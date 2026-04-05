import { useCallback, useEffect, useMemo, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertTriangle, Loader2, Pencil, ChevronLeft, ChevronRight } from 'lucide-react'
import { supabase } from '../../lib/supabase.js'

const EXCLUDED_ALOCADO_CLAUSE = '("Stuff","Trash","Referencia","Incubado")'
const DAY_IN_MS = 1000 * 60 * 60 * 24

const MACRO_STRUCTURE = [
    { id: 'backlog', label: 'Backlog',                       states: ['backlog'] },
    { id: 'plan',    label: 'Analise (Plan)',                states: ['Identificacao do problema', 'Observacao', 'Analise', 'Planejamento de acao', 'Aguardando Plan', 'Bloqueado Plan'] },
    { id: 'do',      label: 'Doing (Do)',                    states: ['Em execucao', 'Aguardando Doing', 'Bloqueado Doing'] },
    { id: 'check',   label: 'Conferindo (Check)',            states: ['Verificacao', 'Validacao', 'Conferencia de aderencia'] },
    { id: 'act',     label: 'Revisao e Padronizacao (Act)', states: ['Padronizacao', 'Conclusao'] },
    { id: 'done',    label: 'Done',                          states: ['Documentado', 'Conhecimento consolidado', 'Done'] },
]

// Cor de acento por macrocoluna — usada na linha do topo dos cards e colunas
const STAGE_ACCENT = {
    backlog: '#64748b',
    plan:    '#f59e0b',
    do:      '#3b82f6',
    check:   '#06b6d4',
    act:     '#10b981',
    done:    '#4ade80',
}

const TRANSITION_RULES = [
    'Nenhum item entra em Doing sem passar por Analise.',
    'Todo item deve passar por Conferindo antes de Revisao.',
    'Revisao e Padronizacao consolidam a melhoria.',
    'Done representa encerramento formal e registro organizacional.',
]

const DEFAULT_STATE_BY_STAGE = {
    backlog: 'backlog',
    plan:    'Identificacao do problema',
    do:      'Em execucao',
    check:   'Verificacao',
    act:     'Padronizacao',
    done:    'Documentado',
}

const normalizeState = (value) => (typeof value === 'string' ? value.trim() : '')

const tryFixMojibake = (value) => {
    if (typeof value !== 'string' || !value) return ''
    try { return decodeURIComponent(escape(value)) } catch { return value }
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

// Trunca label a maxChars caracteres + reticências
const truncateLabel = (value, maxChars = 18) => {
    const str = (value || '').trim()
    if (!str) return '-'
    if (str.length <= maxChars) return str
    return `${str.slice(0, maxChars)}\u2026`
}

const getProgressClass = (percent) => {
    if (percent >= 50) return 'bg-zen-blue'
    if (percent >= 25) return 'bg-zen-success'
    if (percent > 0)  return 'bg-yellow-500'
    return 'bg-zen-border'
}

const getStateBadgeClass = (state) => {
    const key = normalizeKey(state)
    if (key.includes('bloqueado'))  return 'border-zen-error/50 bg-zen-error/10 text-zen-error'
    if (key.includes('aguardando')) return 'border-yellow-500/50 bg-yellow-500/10 text-yellow-300'
    if (key.includes('execucao') || key.includes('doing')) return 'border-zen-blue/50 bg-zen-blue/15 text-blue-200'
    if (key.includes('check') || key.includes('verificacao') || key.includes('validacao') || key.includes('conferencia')) return 'border-cyan-500/50 bg-cyan-500/10 text-cyan-200'
    if (key.includes('act') || key.includes('padronizacao') || key.includes('conclusao')) return 'border-emerald-500/50 bg-emerald-500/10 text-emerald-200'
    if (key.includes('done') || key.includes('documentado')) return 'border-emerald-400/50 bg-emerald-400/10 text-emerald-100'
    return 'border-zen-border text-zen-text-sec bg-zen-bg/80'
}

// ── Componente do Card Kanban ─────────────────────────────────────────────────
const KanbanCard = ({
    atividade,
    classification,
    categoria,
    subcategoria,
    participante,
    gutScore,
    isOverdue,
    isDoneStage,
    stageAccentColor,
    isMovingCard,
    onDragStart,
    onDragEnd,
    onClick,
    onShowTooltip,
    onMoveTooltip,
    onHideTooltip,
}) => {
    const stateLabel          = classification.stateLabel || 'Sem estado'
    const corCategoria        = categoria?.corcategoria   || '#64748b'
    const corSubcategoria     = subcategoria?.corsubcategoria || '#94a3b8'
    const participanteInicial = participante?.nomeparticipante?.trim()?.charAt(0)?.toUpperCase() || '?'

    // Limites de caracteres para layout harmonioso
    const TITLE_MAX    = 40   // ~2 linhas de ~20ch cada
    const STATE_MAX    = 20
    const CAT_MAX      = 14
    const SUBCAT_MAX   = 12
    const PARTIC_MAX   = 14

    const titleText = (atividade.nometarefa || '-').trim()
    const needsTitleTooltip = titleText.length > TITLE_MAX

    // Cor do card baseada no estado
    const cardBorderClass = isDoneStage
        ? 'border-emerald-500/30 hover:border-emerald-400/50'
        : isOverdue
        ? 'border-rose-500/30 hover:border-rose-400/50'
        : 'border-zen-border hover:border-zen-blue/40'

    const cardBgClass = isDoneStage
        ? 'bg-emerald-500/5'
        : isOverdue
        ? 'bg-rose-500/5'
        : 'bg-zen-surface/95'

    return (
        <article
            draggable={!isMovingCard}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onClick={onClick}
            className={`group relative overflow-hidden cursor-grab active:cursor-grabbing border transition-all hover:-translate-y-0.5 hover:shadow-lg ${cardBorderClass} ${cardBgClass}`}
        >
            {/* Accent line colorida por macrocoluna */}
            <div className="h-[2px] w-full" style={{ backgroundColor: stageAccentColor, opacity: 0.8 }} />

            <div className="p-3 flex flex-col gap-2.5">
                {/* Linha 1: state badge + avatar */}
                <div className="flex items-start justify-between gap-2">
                    <span
                        className={`inline-flex items-center border font-mono text-[10px] font-semibold uppercase tracking-[0.12em] px-2 py-0.5 max-w-[calc(100%-2.5rem)] truncate ${getStateBadgeClass(stateLabel)}`}
                        title={stateLabel.length > STATE_MAX ? stateLabel : undefined}
                    >
                        {truncateLabel(stateLabel, STATE_MAX)}
                    </span>

                    {/* Avatar — square */}
                    <div className="size-7 border border-zen-border overflow-hidden flex items-center justify-center bg-zen-bg font-mono text-[11px] text-zen-text-sec shrink-0">
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

                {/* Linha 2: título */}
                <h4
                    className="text-[13px] font-semibold leading-[1.35] text-white line-clamp-2 min-w-0"
                    onMouseEnter={(e) => needsTitleTooltip && onShowTooltip(e, titleText)}
                    onMouseMove={(e)  => needsTitleTooltip && onMoveTooltip(e, titleText)}
                    onMouseLeave={() => needsTitleTooltip && onHideTooltip()}
                >
                    {titleText}
                </h4>

                {/* Linha 3: categoria + subcategoria */}
                <div className="flex flex-wrap items-center gap-1.5 min-w-0">
                    <span
                        className="inline-flex items-center gap-1 border px-2 py-0.5 font-mono text-[10px] font-medium max-w-[100px]"
                        style={{
                            borderColor:     `${corCategoria}80`,
                            backgroundColor: `${corCategoria}1a`,
                            color:           corCategoria,
                        }}
                        title={categoria?.nomecategoria?.length > CAT_MAX ? categoria.nomecategoria : undefined}
                    >
                        <span className="w-1.5 h-1.5 shrink-0" style={{ backgroundColor: corCategoria }} />
                        <span className="truncate">{truncateLabel(categoria?.nomecategoria, CAT_MAX)}</span>
                    </span>

                    {subcategoria && (
                        <span
                            className="inline-flex items-center gap-1 border px-2 py-0.5 font-mono text-[10px] font-medium max-w-[90px]"
                            style={{
                                borderColor:     `${corSubcategoria}80`,
                                backgroundColor: `${corSubcategoria}14`,
                                color:           corSubcategoria,
                            }}
                            title={subcategoria.nomecategoria?.length > SUBCAT_MAX ? subcategoria.nomecategoria : undefined}
                        >
                            <span className="w-1.5 h-1.5 shrink-0" style={{ backgroundColor: corSubcategoria }} />
                            <span className="truncate">{truncateLabel(subcategoria.nomecategoria, SUBCAT_MAX)}</span>
                        </span>
                    )}
                </div>

                {/* Linha 4: divisor + participante + GUT */}
                <div className="flex items-center justify-between gap-2 pt-1 border-t border-zen-border/40">
                    <span
                        className="font-mono text-[10px] text-zen-text-tri truncate max-w-[7rem]"
                        title={participante?.nomeparticipante?.length > PARTIC_MAX ? participante.nomeparticipante : undefined}
                    >
                        {truncateLabel(participante?.nomeparticipante || 'Sem participante', PARTIC_MAX)}
                    </span>
                    <span className="inline-flex items-center border border-zen-blue/40 px-2 py-0.5 font-mono text-[10px] font-semibold text-blue-200 bg-zen-blue/15 shrink-0">
                        GUT {gutScore > 0 ? gutScore : '-'}
                    </span>
                </div>
            </div>
        </article>
    )
}

// ── Componente principal ──────────────────────────────────────────────────────
const Reports = () => {
    const navigate = useNavigate()
    const [userId,           setUserId]           = useState(null)
    const [loading,          setLoading]          = useState(true)
    const [feedback,         setFeedback]         = useState(null)
    const [atividades,       setAtividades]       = useState([])
    const [categoriesById,   setCategoriesById]   = useState({})
    const [subcategoriesById, setSubcategoriesById] = useState({})
    const [participantsById, setParticipantsById] = useState({})
    const [showKanbanBoard,  setShowKanbanBoard]  = useState(false)
    const [draggedCardId,    setDraggedCardId]    = useState(null)
    const [isMovingCard,     setIsMovingCard]     = useState(false)
    const [moveModal,        setMoveModal]        = useState(null)
    const [stageFilter,      setStageFilter]      = useState('all')
    const [stateFilter,      setStateFilter]      = useState('all')
    const [search,           setSearch]           = useState('')
    const [nowMs,            setNowMs]            = useState(() => Date.now())
    const [labelTooltip,     setLabelTooltip]     = useState({ visible: false, text: '', x: 0, y: 0 })

    const scrollContainerRef = useRef(null)

    const scrollKanban = (direction) => {
        if (scrollContainerRef.current) {
            const scrollAmount = 300 // px to scroll
            scrollContainerRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            })
        }
    }

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id || null))
    }, [])

    useEffect(() => {
        const timer = setInterval(() => { setNowMs(Date.now()) }, 30000)
        return () => clearInterval(timer)
    }, [])

    const showLabelTooltip = (event, value) => {
        setLabelTooltip({ visible: true, text: (value || '-').trim() || '-', x: event.clientX + 14, y: event.clientY + 14 })
    }
    const moveLabelTooltip = (event, value) => {
        setLabelTooltip({ visible: true, text: (value || '-').trim() || '-', x: event.clientX + 14, y: event.clientY + 14 })
    }
    const hideLabelTooltip = () => {
        setLabelTooltip((current) => ({ ...current, visible: false }))
    }

    const loadAtividades = useCallback(async () => {
        if (!userId) return
        setLoading(true)
        setFeedback(null)

        const [
            { data: atividadesData,    error: atividadesError    },
            { data: categoriasData,    error: categoriasError    },
            { data: subcategoriasData, error: subcategoriasError },
            { data: participantesData, error: participantesError },
        ] = await Promise.all([
            supabase
                .from('tbf_atividades')
                .select('id, nometarefa, descricao, alocado, created_at, "posicao Kanban", idcategoria, idsubcategoria, participante, gravidade, urgencia, tendencia, data_inicio, data_fim')
                .eq('idusuario', userId)
                .not('alocado', 'in', EXCLUDED_ALOCADO_CLAUSE)
                .order('created_at', { ascending: false }),
            supabase.from('tbf_categorias').select('id, nomecategoria, corcategoria').eq('idusuario', userId),
            supabase.from('tbf_subcategorias').select('id, nomecategoria, corsubcategoria, idcategorias').eq('idusuario', userId),
            supabase.from('tbf_participantes').select('id, nomeparticipante, fotobase64').eq('idusuario', userId),
        ])

        if (atividadesError) {
            setFeedback({ type: 'error', message: 'Não foi possível carregar os dados de report.' })
            setAtividades([])
            setLoading(false)
            return
        }

        setCategoriesById(!categoriasError
            ? (categoriasData || []).reduce((acc, c) => { acc[c.id] = c; return acc }, {})
            : {})
        setSubcategoriesById(!subcategoriasError
            ? (subcategoriasData || []).reduce((acc, s) => { acc[s.id] = s; return acc }, {})
            : {})
        setParticipantsById(!participantesError
            ? (participantesData || []).reduce((acc, p) => { acc[p.id] = p; return acc }, {})
            : {})

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
            return Math.max(0.2, 3 / (1 + daysToEnd))
        }
        return 1 + Math.pow(Math.abs(distanceMs) / DAY_IN_MS + 1, 1.35)
    }, [])

    const getDynamicGutScore = useCallback((atividade, referenceNowMs) => {
        const baseScore = getBaseGutScore(atividade)
        if (baseScore <= 0) return 0
        return Math.round(baseScore * getTemporalWeight(atividade.data_fim, referenceNowMs))
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
                const key  = normalizeKey(state)
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

            const normalizedKey  = normalizeKey(normalized)
            const stageMatches   = statesIndex.get(normalizedKey) || []

            if (stageMatches.length === 0) {
                const macroStageId = stageAliasIndex.get(normalizedKey)
                if (macroStageId) {
                    return {
                        type: 'known',
                        stageId: macroStageId,
                        stageLabel: stageById.get(macroStageId)?.label || macroStageId,
                        stateLabel: DEFAULT_STATE_BY_STAGE[macroStageId] || normalized,
                    }
                }
                return { type: 'unknown', stageId: null, stageLabel: 'Não mapeado', stateLabel: normalized }
            }

            if (stageMatches.length > 1) {
                const macroStageId = stageAliasIndex.get(normalizedKey)
                if (macroStageId) {
                    return {
                        type: 'known',
                        stageId: macroStageId,
                        stageLabel: stageById.get(macroStageId)?.label || macroStageId,
                        stateLabel: DEFAULT_STATE_BY_STAGE[macroStageId] || normalized,
                    }
                }
                return {
                    type: 'ambiguous',
                    stageId: null,
                    stageLabel: `Ambíguo (${stageMatches.map((id) => stageById.get(id)?.label || id).join(' / ')})`,
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
            total:   atividades.length,
            known:   0,
            missing: [],
            unknown: [],
            ambiguous: [],
            byStage:         new Map(MACRO_STRUCTURE.map((stage) => [stage.id, 0])),
            byStageAndState: new Map(),
        }

        MACRO_STRUCTURE.forEach((stage) => {
            stage.states.forEach((state) => summary.byStageAndState.set(`${stage.id}::${normalizeKey(state)}`, 0))
        })

        atividades.forEach((atividade) => {
            const classification = classifyState(atividade.posicaoKanban)
            if (classification.type === 'missing')   { summary.missing.push(atividade);   return }
            if (classification.type === 'unknown')   { summary.unknown.push(atividade);   return }
            if (classification.type === 'ambiguous') { summary.ambiguous.push(atividade); return }

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
            const sorted = [...(map.get(stage.id) || [])].sort((a, b) => {
                const gutDiff = getDynamicGutScore(b, nowMs) - getDynamicGutScore(a, nowMs)
                if (gutDiff !== 0) return gutDiff
                return (b.created_at ? new Date(b.created_at).getTime() : 0) -
                       (a.created_at ? new Date(a.created_at).getTime() : 0)
            })
            map.set(stage.id, sorted)
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
                setFeedback({ type: 'error', message: 'Não foi possível mover o card no Kanban.' })
                setIsMovingCard(false)
                return
            }

            setAtividades((current) =>
                current.map((item) =>
                    item.id === atividadeId ? { ...item, posicaoKanban: nextState, 'posicao Kanban': nextState } : item
                )
            )
            setFeedback({ type: 'success', message: `Card movido para ${targetStageLabel} com estado "${nextState}".` })
            setIsMovingCard(false)
        },
        [atividades, userId]
    )

    const closeMoveModal = useCallback(() => { setMoveModal(null) }, [])

    const handleMoveModalStageChange = useCallback(
        (nextStageId) => {
            const targetStage = stageById.get(nextStageId)
            if (!targetStage) return
            setMoveModal((current) =>
                current
                    ? {
                          ...current,
                          selectedStageId:  nextStageId,
                          targetStageLabel: targetStage.label,
                          options:          targetStage.states,
                          selectedState:    DEFAULT_STATE_BY_STAGE[nextStageId] || targetStage.states[0] || '',
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
                    id: atividade.id, nometarefa: atividade.nometarefa, descricao: atividade.descricao,
                    alocado: atividade.alocado, data_inicio: atividade.data_inicio, data_fim: atividade.data_fim,
                    gravidade: atividade.gravidade, urgencia: atividade.urgencia, tendencia: atividade.tendencia,
                    idcategoria: atividade.idcategoria, idsubcategoria: atividade.idsubcategoria,
                    participante: atividade.participante,
                },
            },
        })
        closeMoveModal()
    }

    const openMoveModalFromCard = useCallback(
        (atividade) => {
            const classification   = classifyState(atividade.posicaoKanban)
            const selectedStageId  = classification.stageId || 'backlog'
            const targetStage      = stageById.get(selectedStageId) || stageById.get('backlog')
            if (!targetStage) return
            setMoveModal({
                atividadeId:      atividade.id,
                selectedStageId,
                targetStageLabel: targetStage.label,
                fromStageLabel:   classification.stageLabel,
                selectedState:    classification.stateLabel || DEFAULT_STATE_BY_STAGE[selectedStageId] || targetStage.states[0] || '',
                options:          targetStage.states,
                stageOptions:     MACRO_STRUCTURE.map((stage) => ({ id: stage.id, label: stage.label })),
            })
        },
        [classifyState, stageById]
    )

    const handleDropStage = useCallback(
        async (stageId) => {
            if (!draggedCardId) return
            const card        = atividades.find((item) => item.id === draggedCardId)
            const targetStage = stageById.get(stageId)
            if (!card || !targetStage) { setDraggedCardId(null); return }

            const currentClassification = classifyState(card.posicaoKanban)
            if (currentClassification.type === 'known' && currentClassification.stageId === stageId) {
                setDraggedCardId(null)
                return
            }
            setMoveModal({
                atividadeId:      draggedCardId,
                selectedStageId:  stageId,
                targetStageLabel: targetStage.label,
                fromStageLabel:   currentClassification.stageLabel,
                selectedState:    DEFAULT_STATE_BY_STAGE[stageId] || targetStage.states[0] || '',
                options:          targetStage.states,
                stageOptions:     MACRO_STRUCTURE.map((stage) => ({ id: stage.id, label: stage.label })),
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
            const stillValid = activeStatesForFilter.some(
                (entry) => entry.value === stateFilter && (nextStage === 'all' || entry.stageId === nextStage)
            )
            if (!stillValid) setStateFilter('all')
        },
        [activeStatesForFilter, stateFilter]
    )

    const filteredAtividades = useMemo(() => {
        const term = normalizeKey(search)
        return atividades.filter((atividade) => {
            const classification = classifyState(atividade.posicaoKanban)
            const stageId    = classification.stageId || 'none'
            const stageLabel = classification.stageLabel
            const stateLabel = classification.stateLabel
            const stageOk  = stageFilter === 'all' || stageId === stageFilter
            const stateOk  = stateFilter === 'all' || (classification.type === 'known' && stateFilter === `${classification.stageId}::${classification.stateLabel}`)
            const searchOk = !term || normalizeKey(atividade.nometarefa).includes(term) || normalizeKey(stripHtml(atividade.descricao)).includes(term) || normalizeKey(stageLabel).includes(term) || normalizeKey(stateLabel).includes(term)
            return stageOk && stateOk && searchOk
        })
    }, [atividades, classifyState, search, stageFilter, stateFilter])

    const inconsistenciesCount = diagnostics.missing.length + diagnostics.unknown.length + diagnostics.ambiguous.length
    const activeStagesCount    = [...diagnostics.byStage.values()].filter((count) => count > 0).length
    const availableStageStates = MACRO_STRUCTURE.reduce((acc, stage) => acc + stage.states.length, 0)
    const usedStageStates      = [...diagnostics.byStageAndState.values()].filter((count) => count > 0).length
    const coveragePercent      = availableStageStates ? Math.round((usedStageStates / availableStageStates) * 100) : 0

    // ── Render ─────────────────────────────────────────────────────────────────
    return (
        <div className="flex w-full max-w-none flex-col gap-5 p-4 sm:p-6 animate-in fade-in duration-300">

            {/* ── PAGE HEADER ──────────────────────────────────────────────────── */}
            <header className="relative overflow-hidden border border-zen-border bg-zen-surface">
                <div className="h-[2px] w-full bg-gradient-to-r from-sky-500/60 via-cyan-400/30 to-transparent" />
                <span className="pointer-events-none absolute right-0 top-[2px] h-8 w-8 border-r border-t border-zen-border/50" />
                <div className="px-5 py-5 sm:px-6 flex flex-col gap-1">
                    <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-zen-text-tri">PDCA · MASP · Fluxo de estado</span>
                    <h1 className="font-display text-2xl font-bold tracking-tight text-white">Relatório de Fluxo PDCA + MASP</h1>
                    <p className="text-[13px] text-zen-text-sec">
                        Macrocolunas fixas: Backlog, Análise (Plan), Doing (Do), Conferindo (Check), Revisão e Padronização (Act), Done.
                    </p>
                </div>
            </header>

            {/* ── FEEDBACK ──────────────────────────────────────────────────────── */}
            {feedback && (
                <div className={`border px-4 py-3 text-xs flex items-center gap-3 animate-in slide-in-from-top-2 ${
                    feedback.type === 'error'
                        ? 'border-rose-500/40 text-rose-300 bg-rose-500/10'
                        : 'border-emerald-500/40 text-emerald-300 bg-emerald-500/10'
                }`}>
                    {feedback.message}
                </div>
            )}

            {/* ── LOADING ───────────────────────────────────────────────────────── */}
            {loading && (
                <div className="flex items-center gap-3 text-xs text-zen-text-sec">
                    <Loader2 className="w-4 h-4 animate-spin text-zen-blue" />
                    <span className="font-mono uppercase tracking-widest">Carregando dados do report...</span>
                </div>
            )}

            {/* ── KANBAN BOARD ──────────────────────────────────────────────────── */}
            <section className="border border-zen-border bg-zen-surface">
                <div className="px-5 py-4 border-b border-zen-border flex items-center justify-between gap-4">
                    <div className="flex flex-col gap-0.5">
                        <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-zen-text-tri">Visualização</span>
                        <h2 className="text-[15px] font-semibold text-white">Kanban clássico</h2>
                        <p className="font-mono text-[10px] text-zen-text-tri">Macrocolunas no quadro · estado interno como label no card</p>
                    </div>
                    <div className="flex items-center gap-3">
                        {showKanbanBoard && (
                            <div className="hidden lg:flex items-center gap-1.5">
                                <button
                                    type="button"
                                    onClick={() => scrollKanban('left')}
                                    className="inline-flex items-center justify-center border border-zen-border bg-zen-surface hover:bg-zen-surface-hl w-8 h-8 transition-colors text-zen-text-sec hover:text-white"
                                    title="Rolar para esquerda"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => scrollKanban('right')}
                                    className="inline-flex items-center justify-center border border-zen-border bg-zen-surface hover:bg-zen-surface-hl w-8 h-8 transition-colors text-zen-text-sec hover:text-white"
                                    title="Rolar para direita"
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                        <button
                            type="button"
                            onClick={() => setShowKanbanBoard((current) => !current)}
                            className="inline-flex items-center border border-zen-blue/50 bg-zen-blue/15 px-3 py-2 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-white hover:bg-zen-blue/30 transition-colors shrink-0"
                        >
                            {showKanbanBoard ? 'Fechar Kanban' : 'Acesso ao Kanban'}
                        </button>
                    </div>
                </div>

                {showKanbanBoard && (
                    <div className="p-4">
                        {/* Scroll horizontal para acomodar 6 colunas */}
                        <div ref={scrollContainerRef} className="overflow-x-auto pb-2 scrollbar-hide">
                            <div className="flex gap-3" style={{ minWidth: 'max-content' }}>
                                {MACRO_STRUCTURE.map((stage) => {
                                    const cards       = cardsByMacro.get(stage.id) || []
                                    const accentColor = STAGE_ACCENT[stage.id] || '#64748b'

                                    return (
                                        <section
                                            key={stage.id}
                                            className="flex flex-col gap-2 border border-zen-border bg-zen-bg"
                                            style={{ width: '220px', minWidth: '220px' }}
                                            onDragOver={(event) => event.preventDefault()}
                                            onDrop={() => handleDropStage(stage.id)}
                                        >
                                            {/* Column header */}
                                            <header className="border-b border-zen-border">
                                                <div className="h-[2px] w-full" style={{ backgroundColor: accentColor, opacity: 0.7 }} />
                                                <div className="px-3 py-2.5 flex items-center justify-between gap-2">
                                                    <h3 className="font-mono text-[9px] font-semibold uppercase tracking-[0.18em] text-white truncate leading-tight">
                                                        {stage.label}
                                                    </h3>
                                                    <span className="font-mono text-[9px] font-semibold border border-zen-border px-2 py-0.5 text-zen-text-sec bg-zen-surface shrink-0">
                                                        {cards.length}
                                                    </span>
                                                </div>
                                            </header>

                                            {/* Cards */}
                                            <div className="flex flex-col gap-2 px-2 pb-2 min-h-[320px]">
                                                {cards.length === 0 ? (
                                                    <div className="border border-dashed border-zen-border px-3 py-4 text-center font-mono text-[9px] text-zen-text-tri">
                                                        Sem cards nesta etapa.
                                                    </div>
                                                ) : (
                                                    cards.map((atividade) => {
                                                        const classification = classifyState(atividade.posicaoKanban)
                                                        const isDoneStage    = classification.stageId === 'done'
                                                        const fimMs          = atividade.data_fim ? new Date(atividade.data_fim).getTime() : Number.NaN
                                                        const isOverdue      = Number.isFinite(fimMs) && fimMs < nowMs

                                                        return (
                                                            <KanbanCard
                                                                key={atividade.id}
                                                                atividade={atividade}
                                                                classification={classification}
                                                                categoria={categoriesById[atividade.idcategoria]}
                                                                subcategoria={subcategoriesById[atividade.idsubcategoria]}
                                                                participante={participantsById[atividade.participante]}
                                                                gutScore={getDynamicGutScore(atividade, nowMs)}
                                                                isOverdue={isOverdue}
                                                                isDoneStage={isDoneStage}
                                                                stageAccentColor={accentColor}
                                                                isMovingCard={isMovingCard}
                                                                onDragStart={() => setDraggedCardId(atividade.id)}
                                                                onDragEnd={() => setDraggedCardId(null)}
                                                                onClick={() => openMoveModalFromCard(atividade)}
                                                                onShowTooltip={showLabelTooltip}
                                                                onMoveTooltip={moveLabelTooltip}
                                                                onHideTooltip={hideLabelTooltip}
                                                            />
                                                        )
                                                    })
                                                )}
                                            </div>
                                        </section>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                )}
            </section>

            {/* ── MOVE MODAL ────────────────────────────────────────────────────── */}
            {moveModal && (
                <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={closeMoveModal} />
                    <div className="relative border border-zen-border bg-zen-surface p-5 w-full max-w-md shadow-2xl">
                        <div className="h-[2px] w-full bg-gradient-to-r from-sky-500/50 to-transparent absolute top-0 left-0" />
                        <h3 className="font-display font-semibold text-lg text-white mt-1">Definir estado da coluna</h3>
                        <p className="font-mono text-[10px] text-zen-text-sec mt-1">
                            Movimento de "{moveModal.fromStageLabel}" para "{moveModal.targetStageLabel}".
                        </p>
                        <p className="font-mono text-[10px] text-zen-text-sec mt-0.5">Selecione o estado interno que será salvo em posição Kanban.</p>

                        <label className="mt-4 flex flex-col gap-2">
                            <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.22em] text-zen-text-tri">Coluna Kanban</span>
                            <select
                                value={moveModal.selectedStageId || ''}
                                onChange={(event) => handleMoveModalStageChange(event.target.value)}
                                className="w-full bg-zen-bg border border-zen-border py-2.5 px-3 text-sm text-white focus:border-zen-blue focus:ring-1 focus:ring-zen-blue outline-none transition-all"
                            >
                                <option value="">Selecione a macrocoluna...</option>
                                {moveModal.stageOptions.map((stage) => (
                                    <option key={stage.id} value={stage.id}>{stage.label}</option>
                                ))}
                            </select>
                        </label>

                        <label className="mt-3 flex flex-col gap-2">
                            <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.22em] text-zen-text-tri">Estado Kanban</span>
                            <select
                                value={moveModal.selectedState}
                                onChange={(event) =>
                                    setMoveModal((current) => (current ? { ...current, selectedState: event.target.value } : current))
                                }
                                className="w-full bg-zen-bg border border-zen-border py-2.5 px-3 text-sm text-white focus:border-zen-blue focus:ring-1 focus:ring-zen-blue outline-none transition-all"
                            >
                                <option value="">Selecione o estado...</option>
                                {moveModal.options.map((state) => (
                                    <option key={state} value={state}>{state}</option>
                                ))}
                            </select>
                        </label>

                        <div className="flex items-center justify-between gap-3 pt-5">
                            <button
                                type="button"
                                onClick={closeMoveModal}
                                className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-zen-text-sec hover:text-white hover:bg-zen-border/30 py-2.5 px-4 transition-colors"
                            >
                                Cancelar
                            </button>
                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={confirmMoveFromModal}
                                    disabled={!moveModal.selectedState || !moveModal.selectedStageId || isMovingCard}
                                    className="flex items-center justify-center min-w-[120px] bg-zen-blue hover:bg-blue-600 text-white font-mono text-[10px] font-semibold uppercase tracking-[0.12em] py-2.5 px-5 shadow-lg shadow-blue-900/20 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    Confirmar
                                </button>
                                <button
                                    type="button"
                                    onClick={openEditFromModal}
                                    className="inline-flex items-center justify-center gap-2 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-zen-text-sec hover:text-white hover:bg-zen-border/30 py-2.5 px-4 border border-zen-border transition-colors"
                                >
                                    <Pencil className="h-3.5 w-3.5" />
                                    Editar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ── MÉTRICAS ──────────────────────────────────────────────────────── */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-zen-border">
                {[
                    { label: 'Cards',               value: diagnostics.total,      tone: 'from-sky-500/40 to-transparent'   },
                    { label: 'Macrocolunas ativas',  value: `${activeStagesCount}/${MACRO_STRUCTURE.length}`, tone: 'from-blue-500/40 to-transparent' },
                    { label: 'Cobertura estado',     value: `${coveragePercent}%`,  tone: 'from-cyan-500/40 to-transparent'  },
                    { label: 'Inconsistências',      value: inconsistenciesCount,   tone: 'from-rose-500/40 to-transparent'  },
                ].map(({ label, value, tone }) => (
                    <article key={label} className="relative overflow-hidden border border-zen-border bg-zen-surface">
                        <div className={`h-[2px] w-full bg-gradient-to-r ${tone}`} />
                        <span className="pointer-events-none absolute right-0 top-[2px] h-5 w-5 border-r border-t border-zen-border/50" />
                        <div className="px-4 py-3">
                            <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-zen-text-tri">{label}</div>
                            <div className="mt-1.5 font-display text-2xl font-bold text-white leading-none">{value}</div>
                        </div>
                    </article>
                ))}
            </div>

            {/* ── FILTROS ───────────────────────────────────────────────────────── */}
            <section className="border border-zen-border bg-zen-surface">
                <div className="border-b border-zen-border px-4 py-3">
                    <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-zen-text-tri">Filtros</span>
                </div>
                <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                    <label className="flex flex-col gap-2">
                        <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-zen-text-tri">Macrocoluna</span>
                        <select
                            value={stageFilter}
                            onChange={(event) => handleStageFilterChange(event.target.value)}
                            className="bg-zen-bg border border-zen-border py-2.5 px-3 text-sm text-white focus:border-zen-blue focus:ring-1 focus:ring-zen-blue outline-none"
                        >
                            <option value="all">Todas</option>
                            {MACRO_STRUCTURE.map((stage) => (
                                <option key={stage.id} value={stage.id}>{stage.label}</option>
                            ))}
                        </select>
                    </label>
                    <label className="flex flex-col gap-2">
                        <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-zen-text-tri">Estado interno</span>
                        <select
                            value={stateFilter}
                            onChange={(event) => setStateFilter(event.target.value)}
                            className="bg-zen-bg border border-zen-border py-2.5 px-3 text-sm text-white focus:border-zen-blue focus:ring-1 focus:ring-zen-blue outline-none"
                        >
                            <option value="all">Todos</option>
                            {activeStatesForFilter.map((entry) => (
                                <option key={entry.value} value={entry.value}>{entry.label}</option>
                            ))}
                        </select>
                    </label>
                    <label className="flex flex-col gap-2">
                        <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-zen-text-tri">Busca</span>
                        <input
                            type="text"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Nome, descrição, estado..."
                            className="bg-zen-bg border border-zen-border py-2.5 px-3 text-sm text-white placeholder:text-zen-text-tri focus:border-zen-blue focus:ring-1 focus:ring-zen-blue outline-none"
                        />
                    </label>
                </div>
            </section>

            {/* ── DISTRIBUIÇÃO POR MACROCOLUNA ──────────────────────────────────── */}
            <section className="border border-zen-border bg-zen-surface">
                <div className="border-b border-zen-border px-5 py-4 flex items-center justify-between gap-4">
                    <h2 className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-white">Distribuição por macrocoluna</h2>
                    <span className="font-mono text-[10px] text-zen-text-tri">{diagnostics.known} cards mapeados de forma unívoca</span>
                </div>
                <div className="p-4 flex flex-col gap-2">
                    {MACRO_STRUCTURE.map((stage) => {
                        const count   = diagnostics.byStage.get(stage.id) || 0
                        const percent = diagnostics.known ? Math.round((count / diagnostics.known) * 100) : 0
                        const accentColor = STAGE_ACCENT[stage.id] || '#64748b'
                        return (
                            <article key={stage.id} className="border border-zen-border bg-zen-bg/70 p-3">
                                <div className="flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-4" style={{ backgroundColor: accentColor, opacity: 0.8 }} />
                                        <div className="text-sm text-white font-semibold">{stage.label}</div>
                                    </div>
                                    <div className="font-mono text-[10px] text-zen-text-tri">
                                        {count} card{count === 1 ? '' : 's'} ({percent}%)
                                    </div>
                                </div>
                                <div className="mt-2 h-1.5 w-full bg-zen-border/70 overflow-hidden">
                                    <div className={`h-full ${getProgressClass(percent)}`} style={{ width: `${percent}%` }} />
                                </div>
                                <div className="mt-2 flex flex-wrap gap-1.5">
                                    {stage.states.map((state) => {
                                        const stateCount = diagnostics.byStageAndState.get(`${stage.id}::${normalizeKey(state)}`) || 0
                                        return (
                                            <span
                                                key={`${stage.id}-${state}`}
                                                className="inline-flex items-center gap-1 border border-zen-border px-2 py-0.5 font-mono text-[10px] text-zen-text-sec"
                                            >
                                                {state}
                                                <strong className="text-white ml-1">{stateCount}</strong>
                                            </span>
                                        )
                                    })}
                                </div>
                            </article>
                        )
                    })}
                </div>
            </section>

            {/* ── AUDITORIA ─────────────────────────────────────────────────────── */}
            <section className="border border-zen-border bg-zen-surface">
                <div className="border-b border-zen-border px-5 py-4">
                    <h2 className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-white">Auditoria de consistência</h2>
                </div>
                <div className="p-4">
                    {inconsistenciesCount === 0 ? (
                        <p className="font-mono text-[11px] text-zen-success">Nenhuma inconsistência encontrada no snapshot atual.</p>
                    ) : (
                        <div className="flex flex-col gap-2">
                            {diagnostics.missing.length > 0 && (
                                <article className="border border-yellow-500/40 bg-yellow-500/10 p-3 flex items-center gap-2">
                                    <AlertTriangle className="w-4 h-4 text-yellow-300 shrink-0" />
                                    <span className="font-mono text-[10px] text-yellow-300 font-semibold">
                                        Cards sem estado Kanban: {diagnostics.missing.length}
                                    </span>
                                </article>
                            )}
                            {diagnostics.unknown.length > 0 && (
                                <article className="border border-zen-error/40 bg-zen-error/10 p-3 flex items-center gap-2">
                                    <AlertTriangle className="w-4 h-4 text-zen-error shrink-0" />
                                    <span className="font-mono text-[10px] text-zen-error font-semibold">
                                        Cards em estado fora do modelo: {diagnostics.unknown.length}
                                    </span>
                                </article>
                            )}
                            {diagnostics.ambiguous.length > 0 && (
                                <article className="border border-orange-500/40 bg-orange-500/10 p-3 flex items-center gap-2">
                                    <AlertTriangle className="w-4 h-4 text-orange-300 shrink-0" />
                                    <span className="font-mono text-[10px] text-orange-300 font-semibold">
                                        Cards em estado ambíguo entre macrocolunas: {diagnostics.ambiguous.length}
                                    </span>
                                </article>
                            )}
                        </div>
                    )}
                </div>
            </section>

            {/* ── TABELA DE CARDS FILTRADOS ──────────────────────────────────────── */}
            <section className="border border-zen-border bg-zen-surface overflow-hidden">
                <div className="px-5 py-4 border-b border-zen-border bg-zen-surface/50 flex items-center justify-between">
                    <h2 className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-white">Cards filtrados</h2>
                    <span className="font-mono text-[10px] text-zen-text-tri">{filteredAtividades.length} resultado(s)</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead className="bg-zen-bg/60">
                            <tr className="text-left">
                                {['Tarefa', 'Macrocoluna', 'Estado interno', 'Criado em'].map((col) => (
                                    <th key={col} className="px-4 py-3 font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-zen-text-tri">
                                        {col}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAtividades.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-4 py-6 text-center font-mono text-[11px] text-zen-text-tri">
                                        Nenhum card encontrado para os filtros atuais.
                                    </td>
                                </tr>
                            ) : (
                                filteredAtividades.map((atividade) => {
                                    const classification = classifyState(atividade.posicaoKanban)
                                    return (
                                        <tr key={atividade.id} className="border-t border-zen-border/70 hover:bg-white/[0.02] transition-colors">
                                            <td className="px-4 py-3 text-white text-sm">{atividade.nometarefa || '-'}</td>
                                            <td className="px-4 py-3 text-zen-text-sec text-sm">{classification.stageLabel}</td>
                                            <td className="px-4 py-3">
                                                <span className={`inline-flex items-center border font-mono text-[10px] font-semibold px-2 py-0.5 ${
                                                    classification.type === 'known'
                                                        ? 'border-zen-border text-zen-text-sec'
                                                        : classification.type === 'ambiguous'
                                                        ? 'border-orange-500/50 text-orange-300 bg-orange-500/10'
                                                        : classification.type === 'unknown'
                                                        ? 'border-zen-error/50 text-zen-error bg-zen-error/10'
                                                        : 'border-yellow-500/50 text-yellow-300 bg-yellow-500/10'
                                                }`}>
                                                    {classification.stateLabel}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 font-mono text-[11px] text-zen-text-sec">
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

            {/* ── REGRAS DE TRANSIÇÃO ───────────────────────────────────────────── */}
            <section className="border border-zen-border bg-zen-surface">
                <div className="border-b border-zen-border px-5 py-4">
                    <h2 className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-white">Regras de transição</h2>
                </div>
                <ul className="p-4 flex flex-col gap-2">
                    {TRANSITION_RULES.map((rule, i) => (
                        <li key={rule} className="flex items-start gap-3 border border-zen-border bg-zen-bg/70 px-3 py-2">
                            <span className="font-mono text-[10px] font-bold text-zen-text-tri shrink-0 mt-0.5">
                                {String(i + 1).padStart(2, '0')}
                            </span>
                            <span className="text-sm text-zen-text-sec">{rule}</span>
                        </li>
                    ))}
                </ul>
            </section>

            {/* Floating tooltip */}
            {labelTooltip.visible && (
                <div
                    className="pointer-events-none fixed z-[120] max-w-xs border border-zen-border bg-zen-surface px-2.5 py-1.5 font-mono text-xs text-white shadow-xl"
                    style={{ left: labelTooltip.x, top: labelTooltip.y }}
                >
                    {labelTooltip.text}
                </div>
            )}
        </div>
    )
}

export default Reports
