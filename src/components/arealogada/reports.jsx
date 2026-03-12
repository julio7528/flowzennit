import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertTriangle, Loader2, Pencil } from 'lucide-react'
import { supabase } from '../../lib/supabase.js'

const EXCLUDED_ALOCADO_CLAUSE = '("Stuff","Trash","Referencia","Incubado")'
const DAY_IN_MS = 1000 * 60 * 60 * 24

const MACRO_STRUCTURE = [
    { id: 'backlog', label: 'Backlog', states: ['backlog'] },
    {
        id: 'plan',
        label: 'Analise (Plan)',
        states: ['Identificacao do problema', 'Observacao', 'Analise', 'Planejamento de acao', 'Aguardando Plan', 'Bloqueado Plan'],
    },
    { id: 'do', label: 'Doing (Do)', states: ['Em execucao', 'Aguardando Doing', 'Bloqueado Doing'] },
    { id: 'check', label: 'Conferindo (Check)', states: ['Verificacao', 'Validacao', 'Conferencia de aderencia'] },
    { id: 'act', label: 'Revisao e Padronizacao (Act)', states: ['Padronizacao', 'Conclusao'] },
    { id: 'done', label: 'Done', states: ['Documentado', 'Conhecimento consolidado', 'Done'] },
]

const TRANSITION_RULES = [
    'Nenhum item entra em Doing sem passar por Analise.',
    'Todo item deve passar por Conferindo antes de Revisao.',
    'Revisao e Padronizacao consolidam a melhoria.',
    'Done representa encerramento formal e registro organizacional.',
]

const DEFAULT_STATE_BY_STAGE = {
    backlog: 'backlog',
    plan: 'Identificacao do problema',
    do: 'Em execucao',
    check: 'Verificacao',
    act: 'Padronizacao',
    done: 'Documentado',
}

const normalizeState = (value) => (typeof value === 'string' ? value.trim() : '')

const tryFixMojibake = (value) => {
    if (typeof value !== 'string' || !value) return ''
    try {
        return decodeURIComponent(escape(value))
    } catch {
        return value
    }
}

const normalizeKey = (value) =>
    normalizeState(tryFixMojibake(value))
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-zA-Z0-9\s]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .toLowerCase()

const stripHtml = (value) => normalizeState(typeof value === 'string' ? value.replace(/<[^>]+>/g, ' ') : '')

const getProgressClass = (percent) => {
    if (percent >= 50) return 'bg-zen-blue'
    if (percent >= 25) return 'bg-zen-success'
    if (percent > 0) return 'bg-yellow-500'
    return 'bg-zen-border'
}

const getStateBadgeClass = (state) => {
    const key = normalizeKey(state)
    if (key.includes('bloqueado')) return 'border-zen-error/50 bg-zen-error/10 text-zen-error'
    if (key.includes('aguardando')) return 'border-yellow-500/50 bg-yellow-500/10 text-yellow-300'
    if (key.includes('execucao') || key.includes('doing')) return 'border-zen-blue/50 bg-zen-blue/15 text-blue-200'
    if (key.includes('check') || key.includes('verificacao') || key.includes('validacao') || key.includes('conferencia')) {
        return 'border-cyan-500/50 bg-cyan-500/10 text-cyan-200'
    }
    if (key.includes('act') || key.includes('padronizacao') || key.includes('conclusao')) return 'border-emerald-500/50 bg-emerald-500/10 text-emerald-200'
    if (key.includes('done') || key.includes('documentado')) return 'border-emerald-400/50 bg-emerald-400/10 text-emerald-100'
    return 'border-zen-border text-zen-text-sec bg-zen-bg/80'
}

const Reports = () => {
    const navigate = useNavigate()
    const [userId, setUserId] = useState(null)
    const [loading, setLoading] = useState(true)
    const [feedback, setFeedback] = useState(null)
    const [atividades, setAtividades] = useState([])
    const [categoriesById, setCategoriesById] = useState({})
    const [participantsById, setParticipantsById] = useState({})
    const [showKanbanBoard, setShowKanbanBoard] = useState(false)
    const [draggedCardId, setDraggedCardId] = useState(null)
    const [isMovingCard, setIsMovingCard] = useState(false)
    const [moveModal, setMoveModal] = useState(null)
    const [stageFilter, setStageFilter] = useState('all')
    const [stateFilter, setStateFilter] = useState('all')
    const [search, setSearch] = useState('')
    const [nowMs, setNowMs] = useState(() => Date.now())

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id || null))
    }, [])

    useEffect(() => {
        const timer = setInterval(() => {
            setNowMs(Date.now())
        }, 30000)
        return () => clearInterval(timer)
    }, [])

    const loadAtividades = useCallback(async () => {
        if (!userId) return
        setLoading(true)
        setFeedback(null)

        const [
            { data: atividadesData, error: atividadesError },
            { data: categoriasData, error: categoriasError },
            { data: participantesData, error: participantesError },
        ] = await Promise.all([
            supabase
                .from('tbf_atividades')
                .select('id, nometarefa, descricao, alocado, created_at, "posicao Kanban", idcategoria, idsubcategoria, participante, gravidade, urgencia, tendencia, data_inicio, data_fim')
                .eq('idusuario', userId)
                .not('alocado', 'in', EXCLUDED_ALOCADO_CLAUSE)
                .order('created_at', { ascending: false }),
            supabase
                .from('tbf_categorias')
                .select('id, nomecategoria, corcategoria')
                .eq('idusuario', userId),
            supabase
                .from('tbf_participantes')
                .select('id, nomeparticipante, fotobase64')
                .eq('idusuario', userId),
        ])

        if (atividadesError) {
            setFeedback({ type: 'error', message: 'Nao foi possivel carregar os dados de report.' })
            setAtividades([])
            setLoading(false)
            return
        }

        if (!categoriasError) {
            const nextCategories = (categoriasData || []).reduce((acc, categoria) => {
                acc[categoria.id] = categoria
                return acc
            }, {})
            setCategoriesById(nextCategories)
        } else {
            setCategoriesById({})
        }

        if (!participantesError) {
            const nextParticipants = (participantesData || []).reduce((acc, participante) => {
                acc[participante.id] = participante
                return acc
            }, {})
            setParticipantsById(nextParticipants)
        } else {
            setParticipantsById({})
        }

        setAtividades(
            (atividadesData || []).map((item) => ({
                ...item,
                posicaoKanban: normalizeState(item['posicao Kanban']),
            }))
        )
        setLoading(false)
    }, [userId])

    const getBaseGutScore = useCallback((atividade) => {
        const { gravidade, urgencia, tendencia } = atividade
        if (!gravidade || !urgencia || !tendencia) return 0
        return Number(gravidade) * Number(urgencia) * Number(tendencia)
    }, [])

    const getTemporalWeight = useCallback((endDateValue, referenceNowMs) => {
        if (!endDateValue) return 1

        const endDateMs = new Date(endDateValue).getTime()
        if (Number.isNaN(endDateMs)) return 1

        const distanceMs = endDateMs - referenceNowMs
        if (distanceMs >= 0) {
            const daysToEnd = distanceMs / DAY_IN_MS
            const inverseWeight = 3 / (1 + daysToEnd)
            return Math.max(0.2, inverseWeight)
        }

        const daysOverdue = Math.abs(distanceMs) / DAY_IN_MS
        return 1 + Math.pow(daysOverdue + 1, 1.35)
    }, [])

    const getDynamicGutScore = useCallback((atividade, referenceNowMs) => {
        const baseScore = getBaseGutScore(atividade)
        if (baseScore <= 0) return 0

        const temporalWeight = getTemporalWeight(atividade.data_fim, referenceNowMs)
        return Math.round(baseScore * temporalWeight)
    }, [getBaseGutScore, getTemporalWeight])

    useEffect(() => {
        if (!userId) return
        const timer = setTimeout(() => loadAtividades(), 0)
        return () => clearTimeout(timer)
    }, [loadAtividades, userId])

    const stageById = useMemo(() => new Map(MACRO_STRUCTURE.map((stage) => [stage.id, stage])), [])
    const stageAliasIndex = useMemo(() => {
        const map = new Map()
        MACRO_STRUCTURE.forEach((stage) => {
            map.set(normalizeKey(stage.id), stage.id)
            map.set(normalizeKey(stage.label), stage.id)
        })
        return map
    }, [])

    const statesIndex = useMemo(() => {
        const map = new Map()
        MACRO_STRUCTURE.forEach((stage) => {
            stage.states.forEach((state) => {
                const key = normalizeKey(state)
                const list = map.get(key) || []
                list.push(stage.id)
                map.set(key, list)
            })
        })
        return map
    }, [])

    const classifyState = useCallback(
        (rawState) => {
            const normalized = normalizeState(rawState)
            if (!normalized) return { type: 'missing', stageId: null, stageLabel: 'Sem estado', stateLabel: 'Sem estado' }

            const normalizedKey = normalizeKey(normalized)
            const stageMatches = statesIndex.get(normalizedKey) || []
            if (stageMatches.length === 0) {
                const macroStageId = stageAliasIndex.get(normalizedKey)
                if (macroStageId) {
                    const fallbackState = DEFAULT_STATE_BY_STAGE[macroStageId] || normalized
                    return {
                        type: 'known',
                        stageId: macroStageId,
                        stageLabel: stageById.get(macroStageId)?.label || macroStageId,
                        stateLabel: fallbackState,
                    }
                }
                return { type: 'unknown', stageId: null, stageLabel: 'Nao mapeado', stateLabel: normalized }
            }
            if (stageMatches.length > 1) {
                const macroStageId = stageAliasIndex.get(normalizedKey)
                if (macroStageId) {
                    const fallbackState = DEFAULT_STATE_BY_STAGE[macroStageId] || normalized
                    return {
                        type: 'known',
                        stageId: macroStageId,
                        stageLabel: stageById.get(macroStageId)?.label || macroStageId,
                        stateLabel: fallbackState,
                    }
                }
                return {
                    type: 'ambiguous',
                    stageId: null,
                    stageLabel: `Ambiguo (${stageMatches.map((id) => stageById.get(id)?.label || id).join(' / ')})`,
                    stateLabel: normalized,
                    candidateStageIds: stageMatches,
                }
            }

            const stageId = stageMatches[0]
            return { type: 'known', stageId, stageLabel: stageById.get(stageId)?.label || stageId, stateLabel: normalized }
        },
        [stageAliasIndex, stageById, statesIndex]
    )

    const diagnostics = useMemo(() => {
        const summary = {
            total: atividades.length,
            known: 0,
            missing: [],
            unknown: [],
            ambiguous: [],
            byStage: new Map(MACRO_STRUCTURE.map((stage) => [stage.id, 0])),
            byStageAndState: new Map(),
        }

        MACRO_STRUCTURE.forEach((stage) => {
            stage.states.forEach((state) => summary.byStageAndState.set(`${stage.id}::${normalizeKey(state)}`, 0))
        })

        atividades.forEach((atividade) => {
            const classification = classifyState(atividade.posicaoKanban)
            if (classification.type === 'missing') {
                summary.missing.push(atividade)
                return
            }
            if (classification.type === 'unknown') {
                summary.unknown.push(atividade)
                return
            }
            if (classification.type === 'ambiguous') {
                summary.ambiguous.push(atividade)
                return
            }

            summary.known += 1
            summary.byStage.set(classification.stageId, (summary.byStage.get(classification.stageId) || 0) + 1)
            const key = `${classification.stageId}::${normalizeKey(classification.stateLabel)}`
            summary.byStageAndState.set(key, (summary.byStageAndState.get(key) || 0) + 1)
        })

        return summary
    }, [atividades, classifyState])

    const cardsByMacro = useMemo(() => {
        const map = new Map(MACRO_STRUCTURE.map((stage) => [stage.id, []]))
        atividades.forEach((atividade) => {
            const classification = classifyState(atividade.posicaoKanban)
            if (classification.type !== 'known' || !classification.stageId) return
            map.set(classification.stageId, [...(map.get(classification.stageId) || []), atividade])
        })
        MACRO_STRUCTURE.forEach((stage) => {
            const sortedCards = [...(map.get(stage.id) || [])].sort((a, b) => {
                const gutDiff = getDynamicGutScore(b, nowMs) - getDynamicGutScore(a, nowMs)
                if (gutDiff !== 0) return gutDiff

                const createdAtA = a.created_at ? new Date(a.created_at).getTime() : 0
                const createdAtB = b.created_at ? new Date(b.created_at).getTime() : 0
                return createdAtB - createdAtA
            })
            map.set(stage.id, sortedCards)
        })
        return map
    }, [atividades, classifyState, getDynamicGutScore, nowMs])

    const moveCardToState = useCallback(
        async (atividadeId, nextState, targetStageLabel) => {
            if (!atividadeId || !userId || !nextState) return

            const card = atividades.find((item) => item.id === atividadeId)
            if (!card) return

            if (normalizeKey(card.posicaoKanban) === normalizeKey(nextState)) return
            setIsMovingCard(true)

            const { error } = await supabase
                .from('tbf_atividades')
                .update({ 'posicao Kanban': nextState })
                .eq('id', atividadeId)
                .eq('idusuario', userId)

            if (error) {
                setFeedback({ type: 'error', message: 'Nao foi possivel mover o card no Kanban.' })
                setIsMovingCard(false)
                return
            }

            setAtividades((current) =>
                current.map((item) => (item.id === atividadeId ? { ...item, posicaoKanban: nextState, 'posicao Kanban': nextState } : item))
            )
            setFeedback({ type: 'success', message: `Card movido para ${targetStageLabel} com estado "${nextState}".` })
            setIsMovingCard(false)
        },
        [atividades, userId]
    )

    const closeMoveModal = useCallback(() => {
        setMoveModal(null)
    }, [])

    const handleMoveModalStageChange = useCallback(
        (nextStageId) => {
            const targetStage = stageById.get(nextStageId)
            if (!targetStage) return
            setMoveModal((current) =>
                current
                    ? {
                          ...current,
                          selectedStageId: nextStageId,
                          targetStageLabel: targetStage.label,
                          options: targetStage.states,
                          selectedState: DEFAULT_STATE_BY_STAGE[nextStageId] || targetStage.states[0] || '',
                      }
                    : current
            )
        },
        [stageById]
    )

    const confirmMoveFromModal = useCallback(async () => {
        if (!moveModal?.selectedState || !moveModal?.targetStageLabel) return
        await moveCardToState(moveModal.atividadeId, moveModal.selectedState, moveModal.targetStageLabel)
        closeMoveModal()
    }, [closeMoveModal, moveCardToState, moveModal])

    const openEditFromModal = () => {
        if (!moveModal?.atividadeId) return
        const atividade = atividades.find((item) => item.id === moveModal.atividadeId)
        if (!atividade) return

        navigate('/reports', {
            state: {
                atividadeSeed: {
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
                },
            },
        })
        closeMoveModal()
    }

    const openMoveModalFromCard = useCallback(
        (atividade) => {
            const classification = classifyState(atividade.posicaoKanban)
            const selectedStageId = classification.stageId || 'backlog'
            const targetStage = stageById.get(selectedStageId) || stageById.get('backlog')
            if (!targetStage) return
            setMoveModal({
                atividadeId: atividade.id,
                selectedStageId,
                targetStageLabel: targetStage.label,
                fromStageLabel: classification.stageLabel,
                selectedState: classification.stateLabel || DEFAULT_STATE_BY_STAGE[selectedStageId] || targetStage.states[0] || '',
                options: targetStage.states,
                stageOptions: MACRO_STRUCTURE.map((stage) => ({ id: stage.id, label: stage.label })),
            })
        },
        [classifyState, stageById]
    )

    const handleDropStage = useCallback(
        async (stageId) => {
            if (!draggedCardId) return
            const card = atividades.find((item) => item.id === draggedCardId)
            const targetStage = stageById.get(stageId)
            if (!card || !targetStage) {
                setDraggedCardId(null)
                return
            }

            const currentClassification = classifyState(card.posicaoKanban)
            if (currentClassification.type === 'known' && currentClassification.stageId === stageId) {
                setDraggedCardId(null)
                return
            }

            setMoveModal({
                atividadeId: draggedCardId,
                selectedStageId: stageId,
                targetStageLabel: targetStage.label,
                fromStageLabel: currentClassification.stageLabel,
                selectedState: DEFAULT_STATE_BY_STAGE[stageId] || targetStage.states[0] || '',
                options: targetStage.states,
                stageOptions: MACRO_STRUCTURE.map((stage) => ({ id: stage.id, label: stage.label })),
            })
            setDraggedCardId(null)
        },
        [atividades, classifyState, draggedCardId, stageById]
    )

    const activeStatesForFilter = useMemo(() => {
        if (stageFilter === 'all') {
            return MACRO_STRUCTURE.flatMap((stage) =>
                stage.states.map((state) => ({ value: `${stage.id}::${state}`, label: `${state} - ${stage.label}`, stageId: stage.id }))
            )
        }
        const stage = stageById.get(stageFilter)
        if (!stage) return []
        return stage.states.map((state) => ({ value: `${stage.id}::${state}`, label: state, stageId: stage.id }))
    }, [stageById, stageFilter])

    const handleStageFilterChange = useCallback(
        (nextStage) => {
            setStageFilter(nextStage)
            if (stateFilter === 'all') return
            const stillValid = activeStatesForFilter.some((entry) => entry.value === stateFilter && (nextStage === 'all' || entry.stageId === nextStage))
            if (!stillValid) setStateFilter('all')
        },
        [activeStatesForFilter, stateFilter]
    )

    const filteredAtividades = useMemo(() => {
        const term = normalizeKey(search)
        return atividades.filter((atividade) => {
            const classification = classifyState(atividade.posicaoKanban)
            const stageId = classification.stageId || 'none'
            const stageLabel = classification.stageLabel
            const stateLabel = classification.stateLabel

            const stageOk = stageFilter === 'all' || stageId === stageFilter
            const stateOk =
                stateFilter === 'all' ||
                (classification.type === 'known' && stateFilter === `${classification.stageId}::${classification.stateLabel}`)
            const searchOk =
                !term ||
                normalizeKey(atividade.nometarefa).includes(term) ||
                normalizeKey(stripHtml(atividade.descricao)).includes(term) ||
                normalizeKey(stageLabel).includes(term) ||
                normalizeKey(stateLabel).includes(term)

            return stageOk && stateOk && searchOk
        })
    }, [atividades, classifyState, search, stageFilter, stateFilter])

    const inconsistenciesCount = diagnostics.missing.length + diagnostics.unknown.length + diagnostics.ambiguous.length
    const activeStagesCount = [...diagnostics.byStage.values()].filter((count) => count > 0).length

    const availableStageStates = MACRO_STRUCTURE.reduce((acc, stage) => acc + stage.states.length, 0)
    const usedStageStates = [...diagnostics.byStageAndState.values()].filter((count) => count > 0).length
    const coveragePercent = availableStageStates ? Math.round((usedStageStates / availableStageStates) * 100) : 0

    return (
        <div className="p-4 sm:p-6 flex flex-col gap-6 max-w-7xl mx-auto w-full animate-in fade-in duration-300">
            <header className="flex flex-col gap-1">
                <h1 className="text-xl font-display font-semibold text-white tracking-tight">Relatorio de fluxo PDCA + MASP</h1>
                <p className="text-sm text-zen-text-sec">
                    Macrocolunas fixas: Backlog, Analise (Plan), Doing (Do), Conferindo (Check), Revisao e Padronizacao (Act), Done.
                </p>
            </header>

            {feedback && (
                <div className="border rounded-lg px-4 py-3 text-sm border-zen-error/40 text-zen-error bg-zen-error/10">{feedback.message}</div>
            )}

            {loading && (
                <div className="flex items-center gap-3 text-sm text-zen-text-sec">
                    <Loader2 className="w-4 h-4 animate-spin text-zen-blue" />
                    Carregando dados do report...
                </div>
            )}

            <section className="bg-zen-surface border border-zen-border rounded-xl p-4 sm:p-5">
                <div className="flex items-center justify-between gap-3">
                    <div>
                        <h2 className="font-display font-medium text-sm text-white tracking-wide">Kanban classico</h2>
                        <p className="text-xs text-zen-text-tri mt-1">Macrocolunas no quadro e estado interno como label no card.</p>
                    </div>
                    <button
                        type="button"
                        onClick={() => setShowKanbanBoard((current) => !current)}
                        className="inline-flex items-center rounded-lg border border-zen-blue/50 bg-zen-blue/15 px-3 py-2 text-sm font-medium text-white hover:bg-zen-blue/30 transition-colors"
                    >
                        {showKanbanBoard ? 'Fechar Kanban' : 'Acesso ao Kanban'}
                    </button>
                </div>

                {showKanbanBoard && (
                    <div className="mt-4">
                        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
                            {MACRO_STRUCTURE.map((stage) => {
                                const cards = cardsByMacro.get(stage.id) || []
                                return (
                                    <section
                                        key={stage.id}
                                        className="bg-zen-bg border border-zen-border rounded-xl p-3 flex flex-col gap-3 min-h-[320px]"
                                        onDragOver={(event) => event.preventDefault()}
                                        onDrop={() => handleDropStage(stage.id)}
                                    >
                                        <header className="flex items-center justify-between border-b border-zen-border/70 pb-2">
                                            <h3 className="text-sm font-semibold text-white">{stage.label}</h3>
                                            <span className="text-xs font-medium rounded-md px-2 py-1 border border-zen-border text-zen-text-sec bg-zen-surface">
                                                {cards.length}
                                            </span>
                                        </header>
                                        <div className="flex flex-col gap-2 flex-1">
                                            {cards.length === 0 ? (
                                                <div className="text-xs text-zen-text-tri border border-dashed border-zen-border rounded-lg px-3 py-4 text-center">
                                                    Sem cards nesta etapa.
                                                </div>
                                            ) : (
                                                cards.map((atividade) => {
                                                    const classification = classifyState(atividade.posicaoKanban)
                                                    const stateLabel = classification.stateLabel || 'Sem estado'
                                                    const isDoneStage = classification.stageId === 'done'
                                                    const categoria = categoriesById[atividade.idcategoria]
                                                    const participante = participantsById[atividade.participante]
                                                    const participanteInicial = participante?.nomeparticipante?.trim()?.charAt(0)?.toUpperCase() || '?'
                                                    const gutScore = getDynamicGutScore(atividade, nowMs)
                                                    const fimMs = atividade.data_fim ? new Date(atividade.data_fim).getTime() : Number.NaN
                                                    const isOverdue = Number.isFinite(fimMs) && fimMs < nowMs
                                                    const corCategoria = categoria?.corcategoria || '#64748b'
                                                    return (
                                                        <article
                                                            key={atividade.id}
                                                            draggable={!isMovingCard}
                                                            onDragStart={() => setDraggedCardId(atividade.id)}
                                                            onDragEnd={() => setDraggedCardId(null)}
                                                            onClick={() => openMoveModalFromCard(atividade)}
                                                            className={`rounded-xl p-3.5 min-w-0 overflow-hidden cursor-grab active:cursor-grabbing shadow-sm hover:shadow-md transition-all ${
                                                                isDoneStage
                                                                    ? 'bg-emerald-500/10 border border-emerald-500/40 hover:border-emerald-400/50'
                                                                    : isOverdue
                                                                    ? 'bg-red-500/10 border border-red-500/40 hover:border-red-400/50'
                                                                    : 'bg-zen-surface/90 border border-zen-border hover:border-zen-blue/40'
                                                            }`}
                                                        >
                                                            <div className="flex items-center justify-between gap-2 min-w-0">
                                                                <h4 className="text-sm font-semibold text-white truncate flex-1 min-w-0">
                                                                    {atividade.nometarefa || '-'}
                                                                </h4>
                                                                <div className="size-7 rounded-full border border-zen-border overflow-hidden flex items-center justify-center bg-zen-bg text-[10px] text-zen-text-sec shrink-0">
                                                                    {participante?.fotobase64 ? (
                                                                        <img
                                                                            src={participante.fotobase64}
                                                                            alt={participante.nomeparticipante || 'Participante'}
                                                                            className="h-full w-full object-cover"
                                                                        />
                                                                    ) : (
                                                                        <span>{participanteInicial}</span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="mt-2.5 flex items-center justify-between gap-2 min-w-0">
                                                                <span
                                                                    className={`inline-flex w-full items-center rounded-md px-2 py-1 text-[11px] font-medium border truncate max-w-full min-w-0 ${getStateBadgeClass(
                                                                        stateLabel
                                                                    )}`}
                                                                >
                                                                    {stateLabel}
                                                                </span>
                                                            </div>
                                                            <div className="mt-3 flex items-center justify-between gap-2 min-w-0">
                                                                <span
                                                                    className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-medium border truncate max-w-[70%] min-w-0"
                                                                    style={{
                                                                        borderColor: `${corCategoria}80`,
                                                                        backgroundColor: `${corCategoria}1f`,
                                                                        color: corCategoria,
                                                                    }}
                                                                >
                                                                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: corCategoria }} />
                                                                    {categoria?.nomecategoria || '-'}
                                                                </span>
                                                                <span className="inline-flex items-center rounded-md px-2.5 py-1 text-[11px] font-semibold border border-zen-blue/40 text-blue-200 bg-zen-blue/15 shrink-0">
                                                                    {gutScore > 0 ? gutScore : '-'}
                                                                </span>
                                                            </div>
                                                        </article>
                                                    )
                                                })
                                            )}
                                        </div>
                                    </section>
                                )
                            })}
                        </div>
                    </div>
                )}
            </section>

            {moveModal && (
                <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={closeMoveModal} />
                    <div className="relative bg-zen-surface border border-zen-border rounded-xl p-5 w-full max-w-md shadow-2xl">
                        <h3 className="font-display font-semibold text-lg text-white">Definir estado da coluna</h3>
                        <p className="text-sm text-zen-text-sec mt-1">
                            Movimento de "{moveModal.fromStageLabel}" para "{moveModal.targetStageLabel}".
                        </p>
                        <p className="text-sm text-zen-text-sec mt-1">Selecione o estado interno que sera salvo em posicao Kanban.</p>
                        <label className="mt-4 flex flex-col gap-2">
                            <span className="text-xs font-semibold text-zen-text-tri uppercase tracking-wider">Coluna Kanban</span>
                            <select
                                value={moveModal.selectedStageId || ''}
                                onChange={(event) => handleMoveModalStageChange(event.target.value)}
                                className="w-full bg-zen-bg border border-zen-border rounded-lg py-2.5 px-3 text-sm text-white focus:border-zen-blue focus:ring-1 focus:ring-zen-blue outline-none transition-all"
                            >
                                <option value="">Selecione a macrocoluna...</option>
                                {moveModal.stageOptions.map((stage) => (
                                    <option key={stage.id} value={stage.id}>
                                        {stage.label}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <label className="mt-3 flex flex-col gap-2">
                            <span className="text-xs font-semibold text-zen-text-tri uppercase tracking-wider">Estado Kanban</span>
                            <select
                                value={moveModal.selectedState}
                                onChange={(event) =>
                                    setMoveModal((current) => (current ? { ...current, selectedState: event.target.value } : current))
                                }
                                className="w-full bg-zen-bg border border-zen-border rounded-lg py-2.5 px-3 text-sm text-white focus:border-zen-blue focus:ring-1 focus:ring-zen-blue outline-none transition-all"
                            >
                                <option value="">Selecione o estado...</option>
                                {moveModal.options.map((state) => (
                                    <option key={state} value={state}>
                                        {state}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <div className="flex items-center justify-between gap-3 pt-5">
                            <button
                                type="button"
                                onClick={closeMoveModal}
                                className="text-sm font-medium text-zen-text-sec hover:text-white hover:bg-zen-border/30 py-2.5 px-4 rounded-lg transition-colors"
                            >
                                Cancelar
                            </button>
                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={confirmMoveFromModal}
                                    disabled={!moveModal.selectedState || !moveModal.selectedStageId || isMovingCard}
                                    className="flex items-center justify-center min-w-[120px] bg-zen-blue hover:bg-blue-600 text-white text-sm font-semibold py-2.5 px-5 rounded-lg shadow-lg shadow-blue-900/20 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    Confirmar
                                </button>
                                <button
                                    type="button"
                                    onClick={openEditFromModal}
                                    className="inline-flex items-center justify-center gap-2 text-sm font-medium text-zen-text-sec hover:text-white hover:bg-zen-border/30 py-2.5 px-4 rounded-lg transition-colors border border-zen-border"
                                >
                                    <Pencil className="h-4 w-4" />
                                    Editar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <article className="bg-zen-surface border border-zen-border rounded-xl p-4">
                    <div className="text-xs text-zen-text-tri uppercase tracking-wider">Cards</div>
                    <div className="mt-2 text-2xl font-semibold text-white">{diagnostics.total}</div>
                </article>
                <article className="bg-zen-surface border border-zen-border rounded-xl p-4">
                    <div className="text-xs text-zen-text-tri uppercase tracking-wider">Macrocolunas ativas</div>
                    <div className="mt-2 text-2xl font-semibold text-white">
                        {activeStagesCount}/{MACRO_STRUCTURE.length}
                    </div>
                </article>
                <article className="bg-zen-surface border border-zen-border rounded-xl p-4">
                    <div className="text-xs text-zen-text-tri uppercase tracking-wider">Cobertura estado interno</div>
                    <div className="mt-2 text-2xl font-semibold text-white">{coveragePercent}%</div>
                </article>
                <article className="bg-zen-surface border border-zen-border rounded-xl p-4">
                    <div className="text-xs text-zen-text-tri uppercase tracking-wider">Inconsistencias</div>
                    <div className="mt-2 text-2xl font-semibold text-white">{inconsistenciesCount}</div>
                </article>
            </section>

            <section className="bg-zen-surface border border-zen-border rounded-xl p-4 sm:p-5 flex flex-col gap-4">
                <div className="text-xs font-semibold uppercase tracking-wider text-zen-text-tri">Filtros</div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <label className="flex flex-col gap-2">
                        <span className="text-xs text-zen-text-tri">Macrocoluna</span>
                        <select
                            value={stageFilter}
                            onChange={(event) => handleStageFilterChange(event.target.value)}
                            className="bg-zen-bg border border-zen-border rounded-lg py-2.5 px-3 text-sm text-white focus:border-zen-blue focus:ring-1 focus:ring-zen-blue outline-none"
                        >
                            <option value="all">Todas</option>
                            {MACRO_STRUCTURE.map((stage) => (
                                <option key={stage.id} value={stage.id}>
                                    {stage.label}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label className="flex flex-col gap-2">
                        <span className="text-xs text-zen-text-tri">Estado interno</span>
                        <select
                            value={stateFilter}
                            onChange={(event) => setStateFilter(event.target.value)}
                            className="bg-zen-bg border border-zen-border rounded-lg py-2.5 px-3 text-sm text-white focus:border-zen-blue focus:ring-1 focus:ring-zen-blue outline-none"
                        >
                            <option value="all">Todos</option>
                            {activeStatesForFilter.map((entry) => (
                                <option key={entry.value} value={entry.value}>
                                    {entry.label}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label className="flex flex-col gap-2">
                        <span className="text-xs text-zen-text-tri">Busca</span>
                        <input
                            type="text"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Nome, descricao, estado..."
                            className="bg-zen-bg border border-zen-border rounded-lg py-2.5 px-3 text-sm text-white placeholder:text-zen-text-tri focus:border-zen-blue focus:ring-1 focus:ring-zen-blue outline-none"
                        />
                    </label>
                </div>
            </section>

            <section className="bg-zen-surface border border-zen-border rounded-xl p-4 sm:p-5">
                <div className="flex items-center justify-between gap-4">
                    <h2 className="font-display font-medium text-sm text-white tracking-wide">Distribuicao por macrocoluna</h2>
                    <span className="text-xs text-zen-text-tri">{diagnostics.known} cards mapeados de forma univoca</span>
                </div>
                <div className="mt-4 flex flex-col gap-3">
                    {MACRO_STRUCTURE.map((stage) => {
                        const count = diagnostics.byStage.get(stage.id) || 0
                        const percent = diagnostics.known ? Math.round((count / diagnostics.known) * 100) : 0
                        return (
                            <article key={stage.id} className="rounded-lg border border-zen-border bg-zen-bg/70 p-3">
                                <div className="flex items-center justify-between gap-3">
                                    <div className="text-sm text-white font-medium">{stage.label}</div>
                                    <div className="text-xs text-zen-text-tri">
                                        {count} card{count === 1 ? '' : 's'} ({percent}%)
                                    </div>
                                </div>
                                <div className="mt-2 h-2 w-full rounded-full bg-zen-border/70 overflow-hidden">
                                    <div className={`h-full ${getProgressClass(percent)}`} style={{ width: `${percent}%` }} />
                                </div>
                                <div className="mt-2 flex flex-wrap gap-1.5">
                                    {stage.states.map((state) => {
                                        const stateCount = diagnostics.byStageAndState.get(`${stage.id}::${normalizeKey(state)}`) || 0
                                        return (
                                            <span
                                                key={`${stage.id}-${state}`}
                                                className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] border border-zen-border text-zen-text-sec"
                                            >
                                                {state}
                                                <strong className="text-white">{stateCount}</strong>
                                            </span>
                                        )
                                    })}
                                </div>
                            </article>
                        )
                    })}
                </div>
            </section>

            <section className="bg-zen-surface border border-zen-border rounded-xl p-4 sm:p-5">
                <h2 className="font-display font-medium text-sm text-white tracking-wide">Auditoria de consistencia</h2>
                {inconsistenciesCount === 0 ? (
                    <p className="mt-3 text-sm text-zen-success">Nenhuma inconsistencia encontrada no snapshot atual.</p>
                ) : (
                    <div className="mt-3 space-y-3">
                        {diagnostics.missing.length > 0 && (
                            <article className="rounded-lg border border-yellow-500/40 bg-yellow-500/10 p-3">
                                <div className="flex items-center gap-2 text-yellow-300 text-sm font-medium">
                                    <AlertTriangle className="w-4 h-4" />
                                    Cards sem estado Kanban: {diagnostics.missing.length}
                                </div>
                            </article>
                        )}
                        {diagnostics.unknown.length > 0 && (
                            <article className="rounded-lg border border-zen-error/40 bg-zen-error/10 p-3">
                                <div className="flex items-center gap-2 text-zen-error text-sm font-medium">
                                    <AlertTriangle className="w-4 h-4" />
                                    Cards em estado fora do modelo: {diagnostics.unknown.length}
                                </div>
                            </article>
                        )}
                        {diagnostics.ambiguous.length > 0 && (
                            <article className="rounded-lg border border-orange-500/40 bg-orange-500/10 p-3">
                                <div className="flex items-center gap-2 text-orange-300 text-sm font-medium">
                                    <AlertTriangle className="w-4 h-4" />
                                    Cards em estado ambiguo entre macrocolunas (ex.: Aguardando/Bloqueado): {diagnostics.ambiguous.length}
                                </div>
                            </article>
                        )}
                    </div>
                )}
            </section>

            <section className="bg-zen-surface border border-zen-border rounded-xl overflow-hidden">
                <div className="px-4 sm:px-6 py-4 border-b border-zen-border bg-zen-surface/50 flex items-center justify-between">
                    <h2 className="font-display font-medium text-sm text-white tracking-wide">Cards filtrados</h2>
                    <span className="text-xs text-zen-text-tri">{filteredAtividades.length} resultados</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead className="bg-zen-bg/60">
                            <tr className="text-left text-zen-text-tri">
                                <th className="px-4 py-3 font-medium">Tarefa</th>
                                <th className="px-4 py-3 font-medium">Macrocoluna</th>
                                <th className="px-4 py-3 font-medium">Estado interno</th>
                                <th className="px-4 py-3 font-medium">Criado em</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAtividades.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-4 py-6 text-center text-zen-text-tri">
                                        Nenhum card encontrado para os filtros atuais.
                                    </td>
                                </tr>
                            ) : (
                                filteredAtividades.map((atividade) => {
                                    const classification = classifyState(atividade.posicaoKanban)
                                    return (
                                        <tr key={atividade.id} className="border-t border-zen-border/70">
                                            <td className="px-4 py-3 text-white">{atividade.nometarefa || '-'}</td>
                                            <td className="px-4 py-3 text-zen-text-sec">{classification.stageLabel}</td>
                                            <td className="px-4 py-3">
                                                <span
                                                    className={`inline-flex items-center rounded-md px-2 py-1 text-xs border ${
                                                        classification.type === 'known'
                                                            ? 'border-zen-border text-zen-text-sec'
                                                            : classification.type === 'ambiguous'
                                                              ? 'border-orange-500/50 text-orange-300 bg-orange-500/10'
                                                              : classification.type === 'unknown'
                                                                ? 'border-zen-error/50 text-zen-error bg-zen-error/10'
                                                                : 'border-yellow-500/50 text-yellow-300 bg-yellow-500/10'
                                                    }`}
                                                >
                                                    {classification.stateLabel}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-zen-text-sec">
                                                {atividade.created_at ? new Date(atividade.created_at).toLocaleDateString('pt-BR') : '-'}
                                            </td>
                                        </tr>
                                    )
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </section>

            <section className="bg-zen-surface border border-zen-border rounded-xl p-4 sm:p-5 flex flex-col gap-3">
                <h2 className="font-display font-medium text-sm text-white tracking-wide">Regras de transicao</h2>
                <ul className="space-y-2">
                    {TRANSITION_RULES.map((rule) => (
                        <li key={rule} className="text-sm text-zen-text-sec border border-zen-border rounded-lg px-3 py-2 bg-zen-bg/70">
                            {rule}
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    )
}

export default Reports
