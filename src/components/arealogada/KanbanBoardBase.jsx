import { useCallback, useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Filter, Loader2, MoveRight, Pencil } from 'lucide-react'
import { supabase } from '../../lib/supabase.js'
import {
    ALOCADOS_BY_VIEW_MODE,
    EXCLUDED_ALOCADO_CLAUSE,
    KANBAN_GROUPS,
    PROJECT_KANBAN_GROUPS,
    VIEW_OPTIONS,
    getStateBadgeClass,
    normalizeKey,
    normalizeState,
    stripHtml,
} from './kanban-model.js'

const formatAlocadoLabel = (alocado) => {
    const normalized = normalizeKey(alocado)
    if (normalized === 'taskproj') return 'Task'
    if (normalized === 'bugproj') return 'Bug'
    if (normalized === 'agendar') return 'Agendar'
    if (normalized === 'delegar') return 'Delegar'
    return alocado || '-'
}

const getAlocadoBadgeClass = (alocado) => {
    const normalized = normalizeKey(alocado)
    if (normalized === 'taskproj') return 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200'
    if (normalized === 'bugproj') return 'border-rose-500/30 bg-rose-500/10 text-rose-200'
    if (normalized === 'agendar') return 'border-amber-500/30 bg-amber-500/10 text-amber-200'
    if (normalized === 'delegar') return 'border-sky-500/30 bg-sky-500/10 text-sky-200'
    return 'border-zen-border bg-zen-bg/80 text-zen-text-sec'
}

const toSeedData = (atividade) => ({
    id: atividade.id,
    nometarefa: atividade.nometarefa,
    descricao: atividade.descricao,
    alocado: atividade.alocado,
    data_inicio: atividade.data_inicio,
    data_fim: atividade.data_fim,
    gravidade: atividade.gravidade,
    urgencia: atividade.urgencia,
    tendencia: atividade.tendencia,
    idcategoria: atividade.idcategoria,
    idsubcategoria: atividade.idsubcategoria,
    participante: atividade.participante,
    predecessor: atividade.predecessor,
    sucessor: atividade.sucessor,
    percentual_progresso: atividade.percentual_progresso,
    userhistory: atividade.userhistory,
    'posicao Kanban': atividade['posicao Kanban'] || atividade.posicaoKanban,
})

const KanbanBoardBase = ({
    title = 'Board Kanban',
    description = 'Arraste cards entre colunas para mover entre macroetapas.',
    defaultViewMode = 'all',
    forceViewMode = null,
    kanbanGroups = null,
    showViewOptions = true,
    refreshToken = 0,
    onCardOpen,
    onChanged,
}) => {
    const navigate = useNavigate()
    const location = useLocation()
    const [userId, setUserId] = useState(null)
    const [loading, setLoading] = useState(true)
    const [feedback, setFeedback] = useState(null)
    const [atividades, setAtividades] = useState([])
    const [draggedCard, setDraggedCard] = useState(null)
    const [modalState, setModalState] = useState(null)
    const [viewMode, setViewMode] = useState(defaultViewMode)

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id || null))
    }, [])

    useEffect(() => {
        if (!feedback) return undefined
        const timer = setTimeout(() => setFeedback(null), 3200)
        return () => clearTimeout(timer)
    }, [feedback])

    const activeViewMode = forceViewMode || viewMode
    const activeAlocados = ALOCADOS_BY_VIEW_MODE[activeViewMode] || null
    const groups = useMemo(
        () => {
            const sourceGroups = activeViewMode === 'projects' ? PROJECT_KANBAN_GROUPS : kanbanGroups || KANBAN_GROUPS
            return sourceGroups.map((group) => ({
                ...group,
                states: [...group.states],
            }))
        },
        [activeViewMode, kanbanGroups]
    )

    const loadAtividades = useCallback(async () => {
        if (!userId) {
            setLoading(false)
            return
        }

        setLoading(true)
        const query = supabase
            .from('tbf_atividades')
            .select(
                'id, nometarefa, descricao, alocado, created_at, "posicao Kanban", percentual_progresso, data_inicio, data_fim, gravidade, urgencia, tendencia, idcategoria, idsubcategoria, participante, predecessor, sucessor, userhistory'
            )
            .eq('idusuario', userId)
            .not('alocado', 'in', EXCLUDED_ALOCADO_CLAUSE)
            .order('created_at', { ascending: false })

        if (activeAlocados?.length) {
            query.in('alocado', activeAlocados)
        }

        const { data, error } = await query

        if (error) {
            setFeedback({ type: 'error', message: 'Nao foi possivel carregar os cards do Kanban.' })
            setAtividades([])
            setLoading(false)
            return
        }

        setAtividades(
            (data || []).map((item) => ({
                ...item,
                posicaoKanban: normalizeState(item['posicao Kanban']),
            }))
        )
        setLoading(false)
    }, [activeAlocados, userId])

    useEffect(() => {
        const timer = setTimeout(() => loadAtividades(), 0)
        return () => clearTimeout(timer)
    }, [loadAtividades, refreshToken])

    const canMoveToBacklog = useCallback((fromState) => normalizeKey(fromState) === normalizeKey('backlog'), [])

    const moveCardToState = useCallback(
        async ({ atividadeId, fromState, toState }) => {
            const currentState = normalizeState(fromState)
            const nextState = normalizeState(toState)
            if (!atividadeId || !userId || !nextState || normalizeKey(nextState) === normalizeKey(currentState)) return

            if (normalizeKey(nextState) === normalizeKey('backlog') && !canMoveToBacklog(currentState)) {
                setFeedback({ type: 'error', message: 'Nao e permitido retornar um card para backlog apos sair desse estado.' })
                return
            }

            const { error } = await supabase
                .from('tbf_atividades')
                .update({ 'posicao Kanban': nextState })
                .eq('id', atividadeId)
                .eq('idusuario', userId)

            if (error) {
                setFeedback({ type: 'error', message: 'Nao foi possivel atualizar a posicao Kanban.' })
                return
            }

            setAtividades((current) =>
                current.map((item) => (item.id === atividadeId ? { ...item, posicaoKanban: nextState, 'posicao Kanban': nextState } : item))
            )
            setFeedback({ type: 'success', message: `Card movido para "${nextState}".` })
            onChanged?.()
        },
        [canMoveToBacklog, onChanged, userId]
    )

    const handleOpenCard = useCallback(
        (atividade) => {
            if (!atividade) return
            if (onCardOpen) {
                onCardOpen(atividade)
                return
            }

            navigate(location.pathname, {
                state: {
                    atividadeSeed: toSeedData(atividade),
                },
            })
        },
        [location.pathname, navigate, onCardOpen]
    )

    const openMoveModal = useCallback(
        (card) => {
            setModalState({
                mode: 'destination',
                card,
                fromState: card.posicaoKanban,
                selectedStage: '',
                selectedState: '',
                stageOptions: groups.map((group) => group.stage),
                stateOptions: [],
            })
        },
        [groups]
    )

    const handleDropOnGroup = useCallback(
        (group) => {
            if (!draggedCard) return
            setModalState({
                mode: 'exact',
                card: draggedCard,
                fromState: draggedCard.posicaoKanban,
                selectedStage: group.stage,
                selectedState: group.states.length === 1 ? group.states[0] : '',
                stageOptions: groups.map((entry) => entry.stage),
                stateOptions: group.states,
            })
            setDraggedCard(null)
        },
        [draggedCard, groups]
    )

    const cardsByGroup = useMemo(() => {
        const map = new Map()
        groups.forEach((group) => map.set(group.stage, []))

        atividades.forEach((atividade) => {
            const firstMatchedGroup = groups.find((group) =>
                group.states.some((state) => normalizeKey(state) === normalizeKey(atividade.posicaoKanban))
            )
            if (!firstMatchedGroup) return
            map.set(firstMatchedGroup.stage, [...(map.get(firstMatchedGroup.stage) || []), atividade])
        })

        return map
    }, [atividades, groups])

    const selectedStageGroup = useMemo(
        () => groups.find((group) => group.stage === modalState?.selectedStage) || null,
        [groups, modalState?.selectedStage]
    )

    const closeModal = () => setModalState(null)

    const confirmMoveFromModal = async () => {
        if (!modalState?.card) return

        if (modalState.mode === 'destination') {
            if (!selectedStageGroup) return
            if (selectedStageGroup.states.length === 1) {
                await moveCardToState({
                    atividadeId: modalState.card.id,
                    fromState: modalState.fromState,
                    toState: selectedStageGroup.states[0],
                })
                closeModal()
                return
            }

            setModalState((current) =>
                current
                    ? {
                          ...current,
                          mode: 'exact',
                          selectedState: '',
                          stateOptions: selectedStageGroup.states,
                      }
                    : current
            )
            return
        }

        if (!modalState.selectedState) return
        await moveCardToState({
            atividadeId: modalState.card.id,
            fromState: modalState.fromState,
            toState: modalState.selectedState,
        })
        closeModal()
    }

    return (
        <div className="flex flex-col gap-4">
            {feedback && (
                <div
                    className={`rounded-lg border px-4 py-3 text-sm transition-all animate-in slide-in-from-top-2 ${
                        feedback.type === 'error'
                            ? 'border-zen-error/40 bg-zen-error/10 text-zen-error'
                            : 'border-zen-success/40 bg-zen-success/10 text-zen-success'
                    }`}
                >
                    {feedback.message}
                </div>
            )}

            <div className="overflow-hidden rounded-2xl border border-zen-border bg-zen-surface/90 shadow-[0_18px_60px_-30px_rgba(15,23,42,0.9)]">
                <div className="border-b border-zen-border bg-gradient-to-r from-sky-500/10 via-zen-surface to-emerald-500/10 px-4 py-4 sm:px-5">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                        <div className="space-y-1.5">
                            <h2 className="font-display text-lg font-semibold text-white">{title}</h2>
                            <p className="max-w-3xl text-sm text-zen-text-sec">{description}</p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            {showViewOptions && (
                                <div className="flex flex-wrap items-center gap-2 rounded-xl border border-zen-border bg-zen-bg/60 p-1">
                                    {VIEW_OPTIONS.map((option) => {
                                        const active = activeViewMode === option.value
                                        return (
                                            <button
                                                key={option.value}
                                                type="button"
                                                onClick={() => setViewMode(option.value)}
                                                className={`rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${
                                                    active
                                                        ? 'bg-zen-blue text-white shadow-lg shadow-blue-900/20'
                                                        : 'text-zen-text-sec hover:bg-zen-border/40 hover:text-white'
                                                }`}
                                                title={option.description}
                                            >
                                                {option.label}
                                            </button>
                                        )
                                    })}
                                </div>
                            )}
                            <div className="inline-flex items-center gap-2 rounded-xl border border-zen-border bg-zen-bg/70 px-3 py-2 text-xs text-zen-text-sec">
                                <Filter className="h-3.5 w-3.5 text-zen-blue" />
                                {atividades.length} card{atividades.length === 1 ? '' : 's'}
                            </div>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="flex items-center gap-3 px-5 py-12 text-sm text-zen-text-sec">
                        <Loader2 className="h-4 w-4 animate-spin text-zen-blue" />
                        Carregando cards do Kanban...
                    </div>
                ) : (
                    <div className="p-3 sm:p-4">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
                            {groups.map((group) => {
                                const cards = cardsByGroup.get(group.stage) || []
                                return (
                                    <section
                                        key={group.stage}
                                        className="flex min-h-[520px] flex-col gap-3 rounded-2xl border border-zen-border bg-zen-bg/70 p-3"
                                        onDragOver={(event) => event.preventDefault()}
                                        onDrop={() => handleDropOnGroup(group)}
                                    >
                                        <header className="flex items-center justify-between gap-3 border-b border-zen-border/80 pb-3">
                                            <div className="space-y-1">
                                                <h3 className="text-sm font-semibold text-white">{group.stage}</h3>
                                                <p className="text-[11px] text-zen-text-tri hidden">Estados: {group.states.join(', ')}</p>
                                            </div>
                                            <span className="inline-flex min-w-8 items-center justify-center rounded-lg border border-zen-border bg-zen-surface px-2 py-1 text-xs font-medium text-zen-text-sec">
                                                {cards.length}
                                            </span>
                                        </header>

                                        <div className="flex flex-1 flex-col gap-2">
                                            {cards.length === 0 ? (
                                                <div className="rounded-xl border border-dashed border-zen-border px-3 py-6 text-center text-xs text-zen-text-tri">
                                                    Sem cards nesta etapa.
                                                </div>
                                            ) : (
                                                cards.map((atividade) => (
                                                    <article
                                                        key={atividade.id}
                                                        draggable
                                                        onClick={() => handleOpenCard(atividade)}
                                                        onDragStart={() => setDraggedCard(atividade)}
                                                        onDragEnd={() => setDraggedCard(null)}
                                                        className="cursor-pointer rounded-xl border border-zen-border bg-zen-surface p-3 shadow-sm transition-colors hover:border-zen-blue/40"
                                                    >
                                                        <div className="flex flex-wrap items-start justify-between gap-2">
                                                            <div className="flex flex-wrap items-center gap-2">
                                                                <span
                                                                    className={`inline-flex items-center rounded-md border px-2 py-1 text-[11px] font-medium ${getStateBadgeClass(
                                                                        atividade.posicaoKanban
                                                                    )}`}
                                                                >
                                                                    {atividade.posicaoKanban || 'Sem estado'}
                                                                </span>
                                                                <span
                                                                    className={`inline-flex items-center rounded-md border px-2 py-1 text-[11px] font-medium ${getAlocadoBadgeClass(
                                                                        atividade.alocado
                                                                    )}`}
                                                                >
                                                                    {formatAlocadoLabel(atividade.alocado)}
                                                                </span>
                                                                {Number(atividade.percentual_progresso) > 0 && (
                                                                    <span className="inline-flex items-center rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-[11px] font-medium text-emerald-200">
                                                                        {atividade.percentual_progresso}%
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={(event) => {
                                                                    event.stopPropagation()
                                                                    openMoveModal(atividade)
                                                                }}
                                                                className="inline-flex items-center gap-1 rounded-md border border-zen-border px-2 py-1 text-[11px] text-zen-text-sec transition-colors hover:bg-zen-border/30 hover:text-white"
                                                            >
                                                                <MoveRight className="h-3 w-3" />
                                                                Mover
                                                            </button>
                                                        </div>

                                                        <h4 className="mt-3 text-sm font-semibold text-white">{atividade.nometarefa || '-'}</h4>
                                                        <p className="mt-1 line-clamp-3 text-xs leading-5 text-zen-text-sec">
                                                            {stripHtml(atividade.descricao) || 'Sem descricao.'}
                                                        </p>
                                                    </article>
                                                ))
                                            )}
                                        </div>
                                    </section>
                                )
                            })}
                        </div>
                    </div>
                )}
            </div>

            {modalState?.card && (
                <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={closeModal} />
                    <div className="relative w-full max-w-md rounded-xl border border-zen-border bg-zen-surface p-5 shadow-2xl">
                        <h3 className="font-display text-lg font-semibold text-white">
                            {modalState.mode === 'destination' ? 'Mover para macrocoluna' : 'Selecione o estado exato'}
                        </h3>

                        {modalState.mode === 'destination' ? (
                            <>
                                <p className="mt-1 text-sm text-zen-text-sec">Escolha a macrocoluna de destino.</p>
                                <select
                                    value={modalState.selectedStage}
                                    onChange={(event) =>
                                        setModalState((current) =>
                                            current ? { ...current, selectedStage: event.target.value } : current
                                        )
                                    }
                                    className="mt-4 w-full rounded-lg border border-zen-border bg-zen-bg px-3 py-2.5 text-sm text-white outline-none transition-all focus:border-zen-blue focus:ring-1 focus:ring-zen-blue"
                                >
                                    <option value="">Selecione...</option>
                                    {modalState.stageOptions.map((stage) => (
                                        <option key={stage} value={stage}>
                                            {stage}
                                        </option>
                                    ))}
                                </select>
                            </>
                        ) : (
                            <>
                                <p className="mt-1 text-sm text-zen-text-sec">
                                    A etapa "{modalState.selectedStage}" possui multiplos estados.
                                </p>
                                <select
                                    value={modalState.selectedState}
                                    onChange={(event) =>
                                        setModalState((current) =>
                                            current ? { ...current, selectedState: event.target.value } : current
                                        )
                                    }
                                    className="mt-4 w-full rounded-lg border border-zen-border bg-zen-bg px-3 py-2.5 text-sm text-white outline-none transition-all focus:border-zen-blue focus:ring-1 focus:ring-zen-blue"
                                >
                                    <option value="">Selecione o estado...</option>
                                    {modalState.stateOptions.map((state) => (
                                        <option key={state} value={state}>
                                            {state}
                                        </option>
                                    ))}
                                </select>
                            </>
                        )}

                        <div className="flex items-center justify-between gap-3 pt-5">
                            <button
                                type="button"
                                onClick={closeModal}
                                className="rounded-lg px-4 py-2.5 text-sm font-medium text-zen-text-sec transition-colors hover:bg-zen-border/30 hover:text-white"
                            >
                                Cancelar
                            </button>
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => handleOpenCard(modalState.card)}
                                    className="inline-flex items-center gap-2 rounded-lg border border-zen-border px-4 py-2.5 text-sm font-medium text-zen-text-sec transition-colors hover:bg-zen-border/30 hover:text-white"
                                >
                                    <Pencil className="h-4 w-4" />
                                    Editar
                                </button>
                                <button
                                    type="button"
                                    onClick={confirmMoveFromModal}
                                    disabled={
                                        (modalState.mode === 'destination' && !modalState.selectedStage) ||
                                        (modalState.mode === 'exact' && !modalState.selectedState)
                                    }
                                    className="min-w-[120px] rounded-lg bg-zen-blue px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-900/20 transition-all hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    Confirmar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default KanbanBoardBase
