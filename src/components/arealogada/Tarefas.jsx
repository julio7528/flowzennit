import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowDown, ArrowUp, ArrowUpDown, Loader2, Pencil, Trash2 } from 'lucide-react'
import { supabase } from '../../lib/supabase.js'

const FILTER_OPTIONS = [
    { value: 'todos',   label: 'Todos'   },
    { value: 'delegar', label: 'Delegar' },
    { value: 'agendar', label: 'Agendar' },
]

const HEADER_GRID_CLASS =
    'grid grid-cols-[2fr_1.05fr_1.15fr_0.9fr_1fr_1fr_0.6fr_1fr_0.75fr] gap-3 px-4 py-3 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-zen-text-tri bg-zen-bg/30'

const ROW_GRID_CLASS =
    'grid grid-cols-[2fr_1.05fr_1.15fr_0.9fr_1fr_1fr_0.6fr_1fr_0.75fr] gap-3 px-4 py-3.5 items-center hover:bg-white/[0.02] transition-colors'

// Square dot — sem rounded-full para manter linguagem angular
const DOT_CLASS = 'w-2 h-2 shrink-0'

const Tarefas = () => {
    const navigate = useNavigate()
    const [userId, setUserId]                   = useState(null)
    const [atividades, setAtividades]           = useState([])
    const [categoriesById, setCategoriesById]   = useState({})
    const [participantsById, setParticipantsById] = useState({})
    const [loading, setLoading]                 = useState(true)
    const [feedback, setFeedback]               = useState(null)
    const [alocadoFilter, setAlocadoFilter]     = useState('todos')
    const [participantFilter, setParticipantFilter] = useState('todos')
    const [categoryFilter, setCategoryFilter]   = useState('todos')
    const [startDateFilter, setStartDateFilter] = useState('')
    const [endDateFilter, setEndDateFilter]     = useState('')
    const [sortConfig, setSortConfig]           = useState({ key: 'gut', direction: 'desc' })
    const [labelTooltip, setLabelTooltip]       = useState({ visible: false, text: '', x: 0, y: 0 })
    const [nowMs, setNowMs]                     = useState(() => Date.now())

    const normalizeAlocado   = (alocado) => (alocado || '').toLowerCase()
    const formatAlocadoLabel = (alocado) => {
        const normalized = normalizeAlocado(alocado)
        if (normalized === 'delegar') return 'Delegar'
        if (normalized === 'agendar') return 'Agendar'
        return alocado || '-'
    }
    const getParticipantFirstName = (participantName) => {
        if (!participantName) return '-'
        const firstName = participantName.trim().split(' ').filter(Boolean)[0]
        return firstName || '-'
    }
    const getDateOnlyKey = (value) => {
        if (!value) return ''
        const date = new Date(value)
        if (Number.isNaN(date.getTime())) return ''
        const year  = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day   = String(date.getDate()).padStart(2, '0')
        return `${year}-${month}-${day}`
    }
    const normalizeTaskLabel  = (value) => (value || '-').trim() || '-'
    const formatTaskLabel     = (value) => {
        const label = normalizeTaskLabel(value)
        if (label.length <= 25) return label
        return `${label.slice(0, 25)}...`
    }
    const isTaskLabelTruncated = (value) => normalizeTaskLabel(value).length > 25
    const handleTaskLabelMouseEnter = (event, value) => {
        if (!isTaskLabelTruncated(value)) return
        setLabelTooltip({ visible: true, text: normalizeTaskLabel(value), x: event.clientX + 14, y: event.clientY + 14 })
    }
    const handleTaskLabelMouseMove = (event, value) => {
        if (!isTaskLabelTruncated(value)) return
        setLabelTooltip({ visible: true, text: normalizeTaskLabel(value), x: event.clientX + 14, y: event.clientY + 14 })
    }
    const handleTaskLabelMouseLeave = () => {
        setLabelTooltip((current) => ({ ...current, visible: false }))
    }

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => {
            setUserId(data.user?.id || null)
        })
    }, [])

    useEffect(() => {
        if (!feedback) return
        const timer = setTimeout(() => setFeedback(null), 4000)
        return () => clearTimeout(timer)
    }, [feedback])

    useEffect(() => {
        const timer = setInterval(() => { setNowMs(Date.now()) }, 30000)
        return () => clearInterval(timer)
    }, [])

    const getGutScore = useCallback((atividade) => {
        const { gravidade, urgencia, tendencia } = atividade
        if (!gravidade || !urgencia || !tendencia) return 0
        return gravidade * urgencia * tendencia
    }, [])

    const getTemporalWeight = useCallback((endDateValue, referenceNowMs) => {
        const minWeight = 1.01
        const maxWeight = 2.0
        const maxHours  = 168
        if (!endDateValue) return minWeight
        const endDateMs = new Date(endDateValue).getTime()
        if (Number.isNaN(endDateMs)) return minWeight
        const distanceMs = endDateMs - referenceNowMs
        if (distanceMs <= 0) return maxWeight
        const distanceHours = distanceMs / (1000 * 60 * 60)
        const clamped = Math.min(Math.max(distanceHours / maxHours, 0), 1)
        const weight = minWeight + (maxWeight - minWeight) * (1 - clamped)
        return Number(weight.toFixed(2))
    }, [])

    const getDynamicGutScore = useCallback((atividade, referenceNowMs) => {
        const baseScore = getGutScore(atividade)
        if (baseScore <= 0) return 0
        const temporalWeight = getTemporalWeight(atividade.data_fim, referenceNowMs)
        return Number((baseScore * temporalWeight).toFixed(2))
    }, [getGutScore, getTemporalWeight])

    const loadAtividades = useCallback(async (currentUserId) => {
        setLoading(true)

        const atividadesQuery = supabase
            .from('tbf_atividades')
            .select('id, nometarefa, descricao, alocado, participante, data_inicio, data_fim, gravidade, urgencia, tendencia, created_at, idcategoria')
            .eq('idusuario', currentUserId)
            .eq('posicao Kanban', 'backlog')
            .not('alocado', 'in', '("Stuff","Trash","Referencia","Incubado")')
            .order('created_at', { ascending: false })

        if (alocadoFilter !== 'todos') {
            const legacyValue = alocadoFilter.charAt(0).toUpperCase() + alocadoFilter.slice(1)
            atividadesQuery.in('alocado', [alocadoFilter, legacyValue])
        }

        const [
            { data: atividadesData,   error: atividadesError   },
            { data: categoriasData,   error: categoriasError   },
            { data: participantesData, error: participantesError },
        ] = await Promise.all([
            atividadesQuery,
            supabase.from('tbf_categorias').select('id, nomecategoria, corcategoria').eq('idusuario', currentUserId),
            supabase.from('tbf_participantes').select('id, nomeparticipante, fotobase64').eq('idusuario', currentUserId),
        ])

        setCategoriesById(
            !categoriasError
                ? (categoriasData || []).reduce((acc, c) => { acc[c.id] = c; return acc }, {})
                : {}
        )

        if (atividadesError) {
            setFeedback({ type: 'error', message: 'Não foi possível carregar as atividades.' })
            setAtividades([])
        } else {
            const atividadesOrdenadas = (atividadesData || []).slice().sort((a, b) => {
                const gutDiff = getGutScore(b) - getGutScore(a)
                if (gutDiff !== 0) return gutDiff
                const fimA = a.data_fim ? new Date(a.data_fim).getTime() : 0
                const fimB = b.data_fim ? new Date(b.data_fim).getTime() : 0
                return fimB - fimA
            })
            setAtividades(atividadesOrdenadas)
        }

        setParticipantsById(
            !participantesError
                ? (participantesData || []).reduce((acc, p) => { acc[p.id] = p; return acc }, {})
                : {}
        )

        setLoading(false)
    }, [alocadoFilter, getGutScore])

    useEffect(() => {
        if (!userId) return
        const timer = setTimeout(() => { loadAtividades(userId) }, 0)
        return () => clearTimeout(timer)
    }, [loadAtividades, userId])

    useEffect(() => {
        if (!userId) return undefined
        const handleWorkspaceRefresh = () => { loadAtividades(userId) }
        window.addEventListener('workspace-refresh-request', handleWorkspaceRefresh)
        return () => window.removeEventListener('workspace-refresh-request', handleWorkspaceRefresh)
    }, [loadAtividades, userId])

    const formatDate = (value) => {
        if (!value) return '-'
        const date = new Date(value)
        if (Number.isNaN(date.getTime())) return '-'
        return new Intl.DateTimeFormat('pt-BR', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit',
        }).format(date)
    }

    const formatGut = (atividade) => {
        const score = getDynamicGutScore(atividade, nowMs)
        return score > 0 ? score.toFixed(2) : '-'
    }

    const handleEdit = async (atividade) => {
        if (!atividade?.id || !userId) return
        const { data, error } = await supabase
            .from('tbf_atividades')
            .select('id, nometarefa, descricao, alocado, participante, data_inicio, data_fim, gravidade, urgencia, tendencia, idcategoria, idsubcategoria')
            .eq('id', atividade.id)
            .eq('idusuario', userId)
            .maybeSingle()

        if (error || !data) {
            setFeedback({ type: 'error', message: 'Não foi possível carregar os dados para edição.' })
            return
        }

        const participanteNome = participantsById[data.participante]?.nomeparticipante || ''
        navigate('/tarefas', { state: { atividadeSeed: { ...data, participanteNome } } })
    }

    const handleDelete = async (atividade) => {
        if (!atividade?.id || !userId) return
        const confirmed = window.confirm(`Excluir a tarefa "${atividade.nometarefa || 'Sem nome'}"?`)
        if (!confirmed) return

        const { error } = await supabase
            .from('tbf_atividades')
            .delete()
            .eq('id', atividade.id)
            .eq('idusuario', userId)

        if (error) {
            setFeedback({ type: 'error', message: 'Não foi possível excluir a tarefa.' })
            return
        }

        setAtividades((current) => current.filter((item) => item.id !== atividade.id))
        setFeedback({ type: 'success', message: 'Tarefa excluída com sucesso.' })
    }

    const displayedAtividades = useMemo(() => {
        const byParticipant = participantFilter === 'todos'
            ? atividades
            : atividades.filter((a) => String(a.participante || '') === participantFilter)
        const byCategory = categoryFilter === 'todos'
            ? byParticipant
            : byParticipant.filter((a) => String(a.idcategoria || '') === categoryFilter)
        const byDateRange = startDateFilter
            ? byCategory.filter((a) => {
                const activityStartDate = getDateOnlyKey(a.data_inicio)
                const activityEndDate   = getDateOnlyKey(a.data_fim)
                if (!activityStartDate || !activityEndDate) return false
                if (endDateFilter) return activityStartDate >= startDateFilter && activityEndDate <= endDateFilter
                return activityStartDate >= startDateFilter
            })
            : byCategory

        const compareText = (first, second) => first.localeCompare(second, 'pt-BR', { sensitivity: 'base' })
        return byDateRange.slice().sort((a, b) => {
            const dir = sortConfig.direction === 'asc' ? 1 : -1
            const getComparable = (atividade) => {
                if (sortConfig.key === 'nome')         return (atividade.nometarefa || '').trim()
                if (sortConfig.key === 'participante') return (participantsById[atividade.participante]?.nomeparticipante || '').trim()
                if (sortConfig.key === 'categoria')    return (categoriesById[atividade.idcategoria]?.nomecategoria || '').trim()
                if (sortConfig.key === 'inicio')       return atividade.data_inicio ? new Date(atividade.data_inicio).getTime() : 0
                if (sortConfig.key === 'fim')          return atividade.data_fim    ? new Date(atividade.data_fim).getTime()    : 0
                if (sortConfig.key === 'criado')       return atividade.created_at  ? new Date(atividade.created_at).getTime()  : 0
                if (sortConfig.key === 'gut')          return getDynamicGutScore(atividade, nowMs)
                return ''
            }
            const aValue = getComparable(a)
            const bValue = getComparable(b)
            if (typeof aValue === 'number' && typeof bValue === 'number') return (aValue - bValue) * dir
            return compareText(String(aValue), String(bValue)) * dir
        })
    }, [atividades, categoriesById, categoryFilter, endDateFilter, getDynamicGutScore, nowMs, participantFilter, participantsById, sortConfig.direction, sortConfig.key, startDateFilter])

    const handleSortChange = (key) => {
        setSortConfig((current) => {
            if (current.key === key) return { key, direction: current.direction === 'asc' ? 'desc' : 'asc' }
            return { key, direction: 'asc' }
        })
    }

    const renderSortIcon = (key) => {
        if (sortConfig.key !== key) return <ArrowUpDown className="h-3.5 w-3.5 text-zen-text-tri" />
        if (sortConfig.direction === 'asc') return <ArrowUp className="h-3.5 w-3.5 text-zen-blue" />
        return <ArrowDown className="h-3.5 w-3.5 text-zen-blue" />
    }

    const participantFilterOptions = useMemo(() => {
        const ids = [...new Set(atividades.map((a) => a.participante).filter(Boolean))]
        return ids
            .map((id) => ({ id: String(id), nome: participantsById[id]?.nomeparticipante || '' }))
            .filter((item) => item.nome)
            .sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR', { sensitivity: 'base' }))
    }, [atividades, participantsById])

    const categoryFilterOptions = useMemo(() => {
        const ids = [...new Set(atividades.map((a) => a.idcategoria).filter(Boolean))]
        return ids
            .map((id) => ({ id: String(id), nome: categoriesById[id]?.nomecategoria || '' }))
            .filter((item) => item.nome)
            .sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR', { sensitivity: 'base' }))
    }, [atividades, categoriesById])

    const gutScores    = useMemo(
        () => atividades.map((a) => getDynamicGutScore(a, nowMs)).filter((s) => s > 0),
        [atividades, getDynamicGutScore, nowMs]
    )
    const gutAverage   = gutScores.length ? Math.round(gutScores.reduce((acc, s) => acc + s, 0) / gutScores.length) : 0
    const delegarCount = atividades.filter((a) => normalizeAlocado(a.alocado) === 'delegar').length
    const agendarCount = atividades.filter((a) => normalizeAlocado(a.alocado) === 'agendar').length

    const getAlocadoBadgeClass = (alocado) => {
        const normalized = normalizeAlocado(alocado)
        if (normalized === 'delegar') return 'bg-blue-500/10 text-blue-300 border border-blue-500/30'
        if (normalized === 'agendar') return 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
        return 'bg-zen-bg text-zen-text-sec border border-zen-border'
    }

    // ── Render ─────────────────────────────────────────────────────────────────
    return (
        <div className="flex w-full max-w-none flex-col gap-5 p-4 sm:p-6 animate-in fade-in duration-300">

            {/* ── PAGE HEADER ──────────────────────────────────────────────────── */}
            <header className="relative overflow-hidden border border-zen-border bg-zen-surface">
                <div className="h-[2px] w-full bg-gradient-to-r from-sky-500/60 via-amber-500/30 to-transparent" />
                <span className="pointer-events-none absolute right-0 top-[2px] h-8 w-8 border-r border-t border-zen-border/50" />
                <div className="px-5 py-5 sm:px-6">
                    <div className="flex flex-col gap-1">
                        <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.22em] text-zen-text-tri">Backlog · tbf_atividades</span>
                        <h1 className="font-display text-2xl font-bold tracking-tight text-white">Tarefas</h1>
                        <p className="text-xs text-zen-text-sec">Lançamentos do backlog por tipo de alocação, filtros e ordenação GUT dinâmica.</p>
                    </div>
                </div>
            </header>

            {/* ── FEEDBACK BANNER ──────────────────────────────────────────────── */}
            {feedback && (
                <div className={`border px-4 py-3 text-xs flex items-center gap-3 animate-in slide-in-from-top-2 transition-all ${
                    feedback.type === 'error'
                        ? 'border-rose-500/40 text-rose-300 bg-rose-500/10'
                        : 'border-emerald-500/40 text-emerald-300 bg-emerald-500/10'
                }`}>
                    {feedback.message}
                </div>
            )}

            {/* ── FILTROS ──────────────────────────────────────────────────────── */}
            <section className="border border-zen-border bg-zen-surface">
                <div className="border-b border-zen-border px-4 py-3">
                    <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.22em] text-zen-text-tri">Filtros</span>
                </div>
                <div className="p-4 flex flex-col gap-4">
                    {/* Alocado filter pills */}
                    <div className="flex flex-col gap-2">
                        <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.22em] text-zen-text-tri">Filtro de alocação</span>
                        <div className="flex flex-wrap gap-2">
                            {FILTER_OPTIONS.map((option) => {
                                const active = alocadoFilter === option.value
                                return (
                                    <button
                                        key={option.value}
                                        type="button"
                                        onClick={() => setAlocadoFilter(option.value)}
                                        className={`px-3 py-2 border font-mono text-[10px] font-semibold transition-colors ${
                                            active
                                                ? 'border-zen-blue bg-zen-blue/20 text-white'
                                                : 'border-zen-border text-zen-text-sec hover:text-white hover:bg-zen-border/30'
                                        }`}
                                    >
                                        {option.label}
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    {/* Advanced filters grid */}
                    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                        <label className="flex flex-col gap-1.5">
                            <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.22em] text-zen-text-tri">Participante</span>
                            <select
                                value={participantFilter}
                                onChange={(event) => setParticipantFilter(event.target.value)}
                                className="border border-zen-border bg-zen-bg px-3 py-2 text-sm text-white outline-none transition-all focus:border-zen-blue focus:ring-1 focus:ring-zen-blue"
                            >
                                <option value="todos">Todos os participantes</option>
                                {participantFilterOptions.map((option) => (
                                    <option key={option.id} value={option.id}>{option.nome}</option>
                                ))}
                            </select>
                        </label>
                        <label className="flex flex-col gap-1.5">
                            <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.22em] text-zen-text-tri">Categoria</span>
                            <select
                                value={categoryFilter}
                                onChange={(event) => setCategoryFilter(event.target.value)}
                                className="border border-zen-border bg-zen-bg px-3 py-2 text-sm text-white outline-none transition-all focus:border-zen-blue focus:ring-1 focus:ring-zen-blue"
                            >
                                <option value="todos">Todas as categorias</option>
                                {categoryFilterOptions.map((option) => (
                                    <option key={option.id} value={option.id}>{option.nome}</option>
                                ))}
                            </select>
                        </label>
                        <label className="flex flex-col gap-1.5">
                            <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.22em] text-zen-text-tri">Data início</span>
                            <input
                                type="date"
                                value={startDateFilter}
                                onChange={(event) => {
                                    const nextStartDate = event.target.value
                                    setStartDateFilter(nextStartDate)
                                    setEndDateFilter((currentEndDate) => {
                                        if (!nextStartDate) return ''
                                        if (!currentEndDate) return currentEndDate
                                        return currentEndDate < nextStartDate ? nextStartDate : currentEndDate
                                    })
                                }}
                                className="border border-zen-border bg-zen-bg px-3 py-2 text-sm text-white outline-none transition-all focus:border-zen-blue focus:ring-1 focus:ring-zen-blue"
                            />
                        </label>
                        <label className="flex flex-col gap-1.5">
                            <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.22em] text-zen-text-tri">Data fim</span>
                            <input
                                type="date"
                                value={endDateFilter}
                                min={startDateFilter || undefined}
                                disabled={!startDateFilter}
                                onChange={(event) => setEndDateFilter(event.target.value)}
                                className="border border-zen-border bg-zen-bg px-3 py-2 text-sm text-white outline-none transition-all focus:border-zen-blue focus:ring-1 focus:ring-zen-blue disabled:cursor-not-allowed disabled:opacity-60"
                            />
                        </label>
                    </div>
                </div>
            </section>

            {/* ── MÉTRICAS ─────────────────────────────────────────────────────── */}
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-px bg-zen-border">
                {[
                    { label: 'Total',     value: atividades.length, tone: 'from-sky-500/40 to-transparent'     },
                    { label: 'Delegar',   value: delegarCount,      tone: 'from-blue-500/40 to-transparent'    },
                    { label: 'Agendar',   value: agendarCount,      tone: 'from-amber-500/40 to-transparent'   },
                    { label: 'Média GUT', value: gutAverage,        tone: 'from-rose-500/40 to-transparent'    },
                ].map(({ label, value, tone }) => (
                    <article key={label} className="relative overflow-hidden border border-zen-border bg-zen-surface">
                        <div className={`h-[2px] w-full bg-gradient-to-r ${tone}`} />
                        <span className="pointer-events-none absolute right-0 top-[2px] h-5 w-5 border-r border-t border-zen-border/50" />
                        <div className="px-4 py-3">
                            <div className="font-mono text-[9px] font-semibold uppercase tracking-[0.22em] text-zen-text-tri">{label}</div>
                            <div className="mt-1.5 font-display text-2xl font-bold text-white leading-none">{value}</div>
                        </div>
                    </article>
                ))}
            </div>

            {/* ── TABELA PRINCIPAL ─────────────────────────────────────────────── */}
            <div className="border border-zen-border bg-zen-surface overflow-hidden">
                <div className="px-4 sm:px-6 py-4 border-b border-zen-border bg-zen-surface/50 flex items-center justify-between">
                    <h2 className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-white">Lista de Atividades</h2>
                    <span className="font-mono text-[10px] text-zen-text-tri">{displayedAtividades.length} registro(s)</span>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center gap-3 px-4 sm:px-6 py-12 text-sm text-zen-text-sec">
                        <Loader2 className="w-4 h-4 animate-spin text-zen-blue" />
                        <span className="font-mono uppercase tracking-widest">Carregando registros...</span>
                    </div>
                ) : displayedAtividades.length === 0 ? (
                    <div className="flex flex-col items-center justify-center px-4 sm:px-6 py-12 text-center gap-1">
                        <p className="text-sm font-semibold text-white">Nenhum registro encontrado.</p>
                        <p className="font-mono text-[10px] text-zen-text-sec">Não há atividades para os filtros aplicados.</p>
                    </div>
                ) : (
                    <>
                        {/* Desktop table */}
                        <div className="hidden xl:block">
                            <div className="divide-y divide-zen-border/50">
                                {/* Header */}
                                <div className={HEADER_GRID_CLASS}>
                                    {[
                                        { key: 'nome',         label: 'Nome'        },
                                        { key: 'participante', label: 'Participante' },
                                        { key: 'categoria',    label: 'Categoria'   },
                                    ].map(({ key, label }) => (
                                        <button
                                            key={key}
                                            type="button"
                                            onClick={() => handleSortChange(key)}
                                            className="inline-flex items-center gap-1.5 text-left font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-zen-text-tri hover:text-white transition-colors"
                                        >
                                            {label}
                                            {renderSortIcon(key)}
                                        </button>
                                    ))}
                                    <span>Alocado</span>
                                    {[
                                        { key: 'inicio',  label: 'Início'    },
                                        { key: 'fim',     label: 'Fim'       },
                                        { key: 'gut',     label: 'GUT'       },
                                        { key: 'criado',  label: 'Criado em' },
                                    ].map(({ key, label }) => (
                                        <button
                                            key={key}
                                            type="button"
                                            onClick={() => handleSortChange(key)}
                                            className="inline-flex items-center gap-1.5 text-left font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-zen-text-tri hover:text-white transition-colors"
                                        >
                                            {label}
                                            {renderSortIcon(key)}
                                        </button>
                                    ))}
                                    <span className="justify-self-end text-right">Ações</span>
                                </div>

                                {/* Rows */}
                                {displayedAtividades.map((atividade) => {
                                    const categoria                = categoriesById[atividade.idcategoria]
                                    const corCategoria             = categoria?.corcategoria || '#64748b'
                                    const participante             = participantsById[atividade.participante]
                                    const primeiroNomeParticipante = getParticipantFirstName(participante?.nomeparticipante)

                                    return (
                                        <div key={atividade.id} className={ROW_GRID_CLASS}>
                                            {/* Nome */}
                                            <div className="flex items-center gap-2 text-sm font-medium text-white/90">
                                                <div className={DOT_CLASS} style={{ backgroundColor: corCategoria }} />
                                                <span
                                                    className="truncate"
                                                    onMouseEnter={(e) => handleTaskLabelMouseEnter(e, atividade.nometarefa)}
                                                    onMouseMove={(e)  => handleTaskLabelMouseMove(e,  atividade.nometarefa)}
                                                    onMouseLeave={handleTaskLabelMouseLeave}
                                                >
                                                    {formatTaskLabel(atividade.nometarefa)}
                                                </span>
                                            </div>

                                            {/* Participante */}
                                            <div className="flex items-center gap-2 min-w-0">
                                                <div className="size-7 border border-zen-border overflow-hidden flex items-center justify-center bg-zen-bg font-mono text-[11px] text-zen-text-sec shrink-0">
                                                    {participante?.fotobase64 ? (
                                                        <img
                                                            src={participante.fotobase64}
                                                            alt={participante.nomeparticipante}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : (
                                                        <span>{primeiroNomeParticipante === '-' ? '?' : primeiroNomeParticipante.slice(0, 1).toUpperCase()}</span>
                                                    )}
                                                </div>
                                                <span className="text-[15px] text-zen-text-sec truncate">{primeiroNomeParticipante}</span>
                                            </div>

                                            {/* Categoria */}
                                            <div className="flex items-center gap-2 text-sm text-zen-text-sec">
                                                <div className={DOT_CLASS} style={{ backgroundColor: corCategoria }} />
                                                <span className="truncate">{categoria?.nomecategoria || '-'}</span>
                                            </div>

                                            {/* Alocado */}
                                            <span>
                                                <span className={`inline-flex px-2.5 py-1 font-mono text-[11px] font-semibold ${getAlocadoBadgeClass(atividade.alocado)}`}>
                                                    {formatAlocadoLabel(atividade.alocado)}
                                                </span>
                                            </span>

                                            {/* Datas e GUT */}
                                            <span className="font-mono text-[13px] text-zen-text-sec">{formatDate(atividade.data_inicio)}</span>
                                            <span className="font-mono text-[13px] text-zen-text-sec">{formatDate(atividade.data_fim)}</span>
                                            <span className="font-mono text-[15px] font-bold text-white">{formatGut(atividade)}</span>
                                            <span className="font-mono text-[13px] text-zen-text-sec">{formatDate(atividade.created_at)}</span>

                                            {/* Ações */}
                                            <div className="flex justify-end justify-self-end gap-3">
                                                <button
                                                    type="button"
                                                    onClick={() => handleEdit(atividade)}
                                                    className="inline-flex items-center justify-center text-zen-text-sec hover:text-white transition-colors"
                                                    aria-label="Editar"
                                                    title="Editar"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDelete(atividade)}
                                                    className="inline-flex items-center justify-center text-rose-300 hover:text-rose-100 transition-colors"
                                                    aria-label="Excluir"
                                                    title="Excluir"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Mobile cards */}
                        <div className="xl:hidden p-3 sm:p-4 grid gap-2">
                            {displayedAtividades.map((atividade) => {
                                const categoria    = categoriesById[atividade.idcategoria]
                                const corCategoria = categoria?.corcategoria || '#64748b'

                                return (
                                    <article key={atividade.id} className="border border-zen-border bg-zen-bg/50 p-3 flex flex-col gap-3">
                                        {/* Title row */}
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-2 text-sm font-semibold text-white">
                                                    <div className={DOT_CLASS} style={{ backgroundColor: corCategoria }} />
                                                    <span
                                                        className="truncate"
                                                        onMouseEnter={(e) => handleTaskLabelMouseEnter(e, atividade.nometarefa)}
                                                        onMouseMove={(e)  => handleTaskLabelMouseMove(e,  atividade.nometarefa)}
                                                        onMouseLeave={handleTaskLabelMouseLeave}
                                                    >
                                                        {formatTaskLabel(atividade.nometarefa)}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <div className={DOT_CLASS} style={{ backgroundColor: corCategoria }} />
                                                    <span className="truncate font-mono text-[11px] text-zen-text-sec">
                                                        {categoria?.nomecategoria || 'Sem categoria'}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 shrink-0">
                                                <button
                                                    type="button"
                                                    onClick={() => handleEdit(atividade)}
                                                    className="inline-flex items-center justify-center text-zen-text-sec hover:text-white transition-colors"
                                                    aria-label="Editar"
                                                    title="Editar"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDelete(atividade)}
                                                    className="inline-flex items-center justify-center text-rose-300 hover:text-rose-100 transition-colors"
                                                    aria-label="Excluir"
                                                    title="Excluir"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Badges */}
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className={`inline-flex px-2.5 py-1 font-mono text-[11px] font-semibold ${getAlocadoBadgeClass(atividade.alocado)}`}>
                                                {formatAlocadoLabel(atividade.alocado)}
                                            </span>
                                            <span className="inline-flex px-2.5 py-1 font-mono text-[11px] font-semibold bg-zen-surface border border-zen-border text-white">
                                                GUT {formatGut(atividade)}
                                            </span>
                                        </div>

                                        {/* Date cells */}
                                        <div className="grid grid-cols-2 gap-px bg-zen-border text-xs">
                                            <div className="bg-zen-surface border border-zen-border px-3 py-2">
                                                <div className="font-mono text-[9px] uppercase tracking-[0.22em] text-zen-text-tri">Início</div>
                                                <div className="font-mono text-[10px] text-zen-text-sec mt-1">{formatDate(atividade.data_inicio)}</div>
                                            </div>
                                            <div className="bg-zen-surface border border-zen-border px-3 py-2">
                                                <div className="font-mono text-[9px] uppercase tracking-[0.22em] text-zen-text-tri">Fim</div>
                                                <div className="font-mono text-[10px] text-zen-text-sec mt-1">{formatDate(atividade.data_fim)}</div>
                                            </div>
                                            <div className="col-span-2 bg-zen-surface border border-zen-border px-3 py-2">
                                                <div className="font-mono text-[9px] uppercase tracking-[0.22em] text-zen-text-tri">Criado em</div>
                                                <div className="font-mono text-[10px] text-zen-text-sec mt-1">{formatDate(atividade.created_at)}</div>
                                            </div>
                                        </div>
                                    </article>
                                )
                            })}
                        </div>
                    </>
                )}
            </div>

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

export default Tarefas
