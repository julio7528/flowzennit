import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowDown, ArrowUp, ArrowUpDown, Loader2, Pencil, Trash2 } from 'lucide-react'
import { supabase } from '../../lib/supabase.js'

const FILTER_OPTIONS = [
    { value: 'todos', label: 'Todos' },
    { value: 'delegar', label: 'Delegar' },
    { value: 'agendar', label: 'Agendar' },
]

const HEADER_GRID_CLASS = 'grid grid-cols-[2fr_1.05fr_1.15fr_0.9fr_1fr_1fr_0.6fr_1fr_0.75fr] gap-3 px-4 py-3 text-xs font-semibold text-zen-text-tri uppercase tracking-wider bg-zen-bg/30'
const ROW_GRID_CLASS = 'grid grid-cols-[2fr_1.05fr_1.15fr_0.9fr_1fr_1fr_0.6fr_1fr_0.75fr] gap-3 px-4 py-3.5 items-center hover:bg-white/[0.02] transition-colors'
const DOT_CLASS = 'w-2 h-2 rounded-full'

const Tarefas = () => {
    const navigate = useNavigate()
    const [userId, setUserId] = useState(null)
    const [atividades, setAtividades] = useState([])
    const [categoriesById, setCategoriesById] = useState({})
    const [participantsById, setParticipantsById] = useState({})
    const [loading, setLoading] = useState(true)
    const [feedback, setFeedback] = useState(null)
    const [alocadoFilter, setAlocadoFilter] = useState('todos')
    const [participantFilter, setParticipantFilter] = useState('todos')
    const [categoryFilter, setCategoryFilter] = useState('todos')
    const [startDateFilter, setStartDateFilter] = useState('')
    const [endDateFilter, setEndDateFilter] = useState('')
    const [sortConfig, setSortConfig] = useState({ key: 'gut', direction: 'desc' })
    const [labelTooltip, setLabelTooltip] = useState({ visible: false, text: '', x: 0, y: 0 })
    const [nowMs, setNowMs] = useState(() => Date.now())
    const normalizeAlocado = (alocado) => (alocado || '').toLowerCase()
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
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        return `${year}-${month}-${day}`
    }
    const normalizeTaskLabel = (value) => (value || '-').trim() || '-'
    const formatTaskLabel = (value) => {
        const label = normalizeTaskLabel(value)
        if (label.length <= 25) return label
        return `${label.slice(0, 25)}...`
    }
    const isTaskLabelTruncated = (value) => normalizeTaskLabel(value).length > 25
    const handleTaskLabelMouseEnter = (event, value) => {
        if (!isTaskLabelTruncated(value)) return
        setLabelTooltip({
            visible: true,
            text: normalizeTaskLabel(value),
            x: event.clientX + 14,
            y: event.clientY + 14,
        })
    }
    const handleTaskLabelMouseMove = (event, value) => {
        if (!isTaskLabelTruncated(value)) return
        setLabelTooltip({
            visible: true,
            text: normalizeTaskLabel(value),
            x: event.clientX + 14,
            y: event.clientY + 14,
        })
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
        const timer = setInterval(() => {
            setNowMs(Date.now())
        }, 30000)

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
        const maxHours = 168
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

        const [{ data: atividadesData, error: atividadesError }, { data: categoriasData, error: categoriasError }, { data: participantesData, error: participantesError }] = await Promise.all([
            atividadesQuery,
            supabase
                .from('tbf_categorias')
                .select('id, nomecategoria, corcategoria')
                .eq('idusuario', currentUserId),
            supabase
                .from('tbf_participantes')
                .select('id, nomeparticipante, fotobase64')
                .eq('idusuario', currentUserId),
        ])

        if (categoriasError) {
            setCategoriesById({})
        } else {
            const map = (categoriasData || []).reduce((acc, categoria) => {
                acc[categoria.id] = categoria
                return acc
            }, {})
            setCategoriesById(map)
        }

        if (atividadesError) {
            setFeedback({ type: 'error', message: 'Nao foi possivel carregar as atividades.' })
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

        if (participantesError) {
            setParticipantsById({})
        } else {
            const map = (participantesData || []).reduce((acc, participante) => {
                acc[participante.id] = participante
                return acc
            }, {})
            setParticipantsById(map)
        }

        setLoading(false)
    }, [alocadoFilter, getGutScore])

    useEffect(() => {
        if (!userId) return
        const timer = setTimeout(() => {
            loadAtividades(userId)
        }, 0)
        return () => clearTimeout(timer)
    }, [loadAtividades, userId])

    useEffect(() => {
        if (!userId) return undefined
        const handleWorkspaceRefresh = () => {
            loadAtividades(userId)
        }
        window.addEventListener('workspace-refresh-request', handleWorkspaceRefresh)
        return () => window.removeEventListener('workspace-refresh-request', handleWorkspaceRefresh)
    }, [loadAtividades, userId])

    const formatDate = (value) => {
        if (!value) return '-'
        const date = new Date(value)
        if (Number.isNaN(date.getTime())) return '-'
        return new Intl.DateTimeFormat('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
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
            setFeedback({ type: 'error', message: 'Nao foi possivel carregar os dados para edicao.' })
            return
        }

        const participanteNome = participantsById[data.participante]?.nomeparticipante || ''
        navigate('/tarefas', {
            state: {
                atividadeSeed: {
                    ...data,
                    participanteNome,
                },
            },
        })
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
            setFeedback({ type: 'error', message: 'Nao foi possivel excluir a tarefa.' })
            return
        }

        setAtividades((current) => current.filter((item) => item.id !== atividade.id))
        setFeedback({ type: 'success', message: 'Tarefa excluida com sucesso.' })
    }

    const displayedAtividades = useMemo(() => {
        const byParticipant = participantFilter === 'todos'
            ? atividades
            : atividades.filter((atividade) => String(atividade.participante || '') === participantFilter)
        const byCategory = categoryFilter === 'todos'
            ? byParticipant
            : byParticipant.filter((atividade) => String(atividade.idcategoria || '') === categoryFilter)
        const byDateRange = startDateFilter
            ? byCategory.filter((atividade) => {
                const activityStartDate = getDateOnlyKey(atividade.data_inicio)
                const activityEndDate = getDateOnlyKey(atividade.data_fim)
                if (!activityStartDate || !activityEndDate) return false
                if (endDateFilter) {
                    return activityStartDate >= startDateFilter && activityEndDate <= endDateFilter
                }
                return activityStartDate >= startDateFilter
            })
            : byCategory

        const compareText = (first, second) => first.localeCompare(second, 'pt-BR', { sensitivity: 'base' })
        const sorted = byDateRange.slice().sort((a, b) => {
            const directionMultiplier = sortConfig.direction === 'asc' ? 1 : -1

            const getComparable = (atividade) => {
                if (sortConfig.key === 'nome') return (atividade.nometarefa || '').trim()
                if (sortConfig.key === 'participante') {
                    const participante = participantsById[atividade.participante]
                    return (participante?.nomeparticipante || '').trim()
                }
                if (sortConfig.key === 'categoria') {
                    const categoria = categoriesById[atividade.idcategoria]
                    return (categoria?.nomecategoria || '').trim()
                }
                if (sortConfig.key === 'inicio') return atividade.data_inicio ? new Date(atividade.data_inicio).getTime() : 0
                if (sortConfig.key === 'fim') return atividade.data_fim ? new Date(atividade.data_fim).getTime() : 0
                if (sortConfig.key === 'criado') return atividade.created_at ? new Date(atividade.created_at).getTime() : 0
                if (sortConfig.key === 'gut') return getDynamicGutScore(atividade, nowMs)
                return ''
            }

            const aValue = getComparable(a)
            const bValue = getComparable(b)

            if (typeof aValue === 'number' && typeof bValue === 'number') {
                return (aValue - bValue) * directionMultiplier
            }
            return compareText(String(aValue), String(bValue)) * directionMultiplier
        })

        return sorted
    }, [atividades, categoriesById, categoryFilter, endDateFilter, getDynamicGutScore, nowMs, participantFilter, participantsById, sortConfig.direction, sortConfig.key, startDateFilter])

    const handleSortChange = (key) => {
        setSortConfig((current) => {
            if (current.key === key) {
                return { key, direction: current.direction === 'asc' ? 'desc' : 'asc' }
            }
            return { key, direction: 'asc' }
        })
    }

    const renderSortIcon = (key) => {
        if (sortConfig.key !== key) return <ArrowUpDown className="h-3.5 w-3.5 text-zen-text-tri" />
        if (sortConfig.direction === 'asc') return <ArrowUp className="h-3.5 w-3.5 text-zen-blue" />
        return <ArrowDown className="h-3.5 w-3.5 text-zen-blue" />
    }

    const participantFilterOptions = useMemo(() => {
        const ids = [...new Set(atividades.map((atividade) => atividade.participante).filter(Boolean))]
        return ids
            .map((id) => ({ id: String(id), nome: participantsById[id]?.nomeparticipante || '' }))
            .filter((item) => item.nome)
            .sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR', { sensitivity: 'base' }))
    }, [atividades, participantsById])

    const categoryFilterOptions = useMemo(() => {
        const ids = [...new Set(atividades.map((atividade) => atividade.idcategoria).filter(Boolean))]
        return ids
            .map((id) => ({ id: String(id), nome: categoriesById[id]?.nomecategoria || '' }))
            .filter((item) => item.nome)
            .sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR', { sensitivity: 'base' }))
    }, [atividades, categoriesById])

    const gutScores = useMemo(
        () =>
            atividades
                .map((atividade) => getDynamicGutScore(atividade, nowMs))
                .filter((score) => score > 0),
        [atividades, getDynamicGutScore, nowMs]
    )
    const gutAverage = gutScores.length ? Math.round(gutScores.reduce((acc, score) => acc + score, 0) / gutScores.length) : 0
    const delegarCount = atividades.filter((atividade) => normalizeAlocado(atividade.alocado) === 'delegar').length
    const agendarCount = atividades.filter((atividade) => normalizeAlocado(atividade.alocado) === 'agendar').length

    const getAlocadoBadgeClass = (alocado) => {
        const normalized = normalizeAlocado(alocado)
        if (normalized === 'delegar') return 'bg-blue-500/10 text-blue-300 border border-blue-500/30'
        if (normalized === 'agendar') return 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
        return 'bg-zen-bg text-zen-text-sec border border-zen-border'
    }

    return (
        <div className="p-4 sm:p-6 flex flex-col gap-6 max-w-7xl mx-auto w-full animate-in fade-in duration-300">
            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-xl font-display font-semibold text-white tracking-tight">Tarefas</h1>
                    <p className="text-sm text-zen-text-sec">Lancamentos da tabela tbf_atividades.</p>
                </div>

                <div className="bg-zen-surface border border-zen-border rounded-xl p-3 sm:p-4 flex flex-col gap-3">
                    <div className="text-xs font-semibold uppercase tracking-wider text-zen-text-tri">Filtro de alocacao</div>
                    <div className="flex flex-wrap gap-2">
                        {FILTER_OPTIONS.map((option) => {
                            const active = alocadoFilter === option.value
                            return (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => setAlocadoFilter(option.value)}
                                    className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
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
                    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                        <label className="flex flex-col gap-1.5">
                            <span className="text-[11px] font-semibold uppercase tracking-wider text-zen-text-tri">Participante</span>
                            <select
                                value={participantFilter}
                                onChange={(event) => setParticipantFilter(event.target.value)}
                                className="rounded-lg border border-zen-border bg-zen-bg px-3 py-2 text-sm text-white outline-none transition-all focus:border-zen-blue focus:ring-1 focus:ring-zen-blue"
                            >
                                <option value="todos">Todos os participantes</option>
                                {participantFilterOptions.map((option) => (
                                    <option key={option.id} value={option.id}>
                                        {option.nome}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <label className="flex flex-col gap-1.5">
                            <span className="text-[11px] font-semibold uppercase tracking-wider text-zen-text-tri">Categoria</span>
                            <select
                                value={categoryFilter}
                                onChange={(event) => setCategoryFilter(event.target.value)}
                                className="rounded-lg border border-zen-border bg-zen-bg px-3 py-2 text-sm text-white outline-none transition-all focus:border-zen-blue focus:ring-1 focus:ring-zen-blue"
                            >
                                <option value="todos">Todas as categorias</option>
                                {categoryFilterOptions.map((option) => (
                                    <option key={option.id} value={option.id}>
                                        {option.nome}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <label className="flex flex-col gap-1.5">
                            <span className="text-[11px] font-semibold uppercase tracking-wider text-zen-text-tri">Data início</span>
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
                                className="rounded-lg border border-zen-border bg-zen-bg px-3 py-2 text-sm text-white outline-none transition-all focus:border-zen-blue focus:ring-1 focus:ring-zen-blue"
                            />
                        </label>
                        <label className="flex flex-col gap-1.5">
                            <span className="text-[11px] font-semibold uppercase tracking-wider text-zen-text-tri">Data fim</span>
                            <input
                                type="date"
                                value={endDateFilter}
                                min={startDateFilter || undefined}
                                disabled={!startDateFilter}
                                onChange={(event) => setEndDateFilter(event.target.value)}
                                className="rounded-lg border border-zen-border bg-zen-bg px-3 py-2 text-sm text-white outline-none transition-all focus:border-zen-blue focus:ring-1 focus:ring-zen-blue disabled:cursor-not-allowed disabled:opacity-60"
                            />
                        </label>
                    </div>
                </div>
            </div>

            {feedback && (
                <div
                    className={`border rounded-lg px-4 py-3 text-sm flex items-center transition-all animate-in slide-in-from-top-2 ${
                        feedback.type === 'error'
                            ? 'border-zen-error/40 text-zen-error bg-zen-error/10'
                            : 'border-zen-success/40 text-zen-success bg-zen-success/10'
                    }`}
                >
                    {feedback.message}
                </div>
            )}

            <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
                <div className="bg-zen-surface border border-zen-border rounded-xl px-4 py-3">
                    <div className="text-xs uppercase tracking-wider text-zen-text-tri">Total</div>
                    <div className="text-xl font-display font-semibold text-white mt-1">{atividades.length}</div>
                </div>
                <div className="bg-zen-surface border border-zen-border rounded-xl px-4 py-3">
                    <div className="text-xs uppercase tracking-wider text-zen-text-tri">Delegar</div>
                    <div className="text-xl font-display font-semibold text-white mt-1">{delegarCount}</div>
                </div>
                <div className="bg-zen-surface border border-zen-border rounded-xl px-4 py-3">
                    <div className="text-xs uppercase tracking-wider text-zen-text-tri">Agendar</div>
                    <div className="text-xl font-display font-semibold text-white mt-1">{agendarCount}</div>
                </div>
                <div className="bg-zen-surface border border-zen-border rounded-xl px-4 py-3">
                    <div className="text-xs uppercase tracking-wider text-zen-text-tri">Media GUT</div>
                    <div className="text-xl font-display font-semibold text-white mt-1">{gutAverage}</div>
                </div>
            </div>

            <div className="bg-zen-surface border border-zen-border rounded-xl overflow-hidden shadow-sm">
                <div className="px-4 sm:px-6 py-4 border-b border-zen-border bg-zen-surface/50">
                    <h2 className="font-display font-medium text-sm text-white tracking-wide">Lista de Atividades</h2>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center gap-3 px-4 sm:px-6 py-12 text-sm text-zen-text-sec">
                        <Loader2 className="w-5 h-5 animate-spin text-zen-blue" />
                        Carregando registros...
                    </div>
                ) : displayedAtividades.length === 0 ? (
                    <div className="flex flex-col items-center justify-center px-4 sm:px-6 py-12 text-center">
                        <p className="text-sm text-white font-medium">Nenhum registro encontrado.</p>
                        <p className="text-sm text-zen-text-sec mt-1">Nao ha atividades para os filtros aplicados.</p>
                    </div>
                ) : (
                    <>
                        <div className="hidden xl:block">
                            <div className="divide-y divide-zen-border/50">
                                <div className={HEADER_GRID_CLASS}>
                                    <button type="button" onClick={() => handleSortChange('nome')} className="inline-flex items-center gap-1.5 text-left text-xs font-semibold uppercase tracking-wider text-zen-text-tri hover:text-white transition-colors">
                                        Nome
                                        {renderSortIcon('nome')}
                                    </button>
                                    <button type="button" onClick={() => handleSortChange('participante')} className="inline-flex items-center gap-1.5 text-left text-xs font-semibold uppercase tracking-wider text-zen-text-tri hover:text-white transition-colors">
                                        Participante
                                        {renderSortIcon('participante')}
                                    </button>
                                    <button type="button" onClick={() => handleSortChange('categoria')} className="inline-flex items-center gap-1.5 text-left text-xs font-semibold uppercase tracking-wider text-zen-text-tri hover:text-white transition-colors">
                                        Categoria
                                        {renderSortIcon('categoria')}
                                    </button>
                                    <span>Alocado</span>
                                    <button type="button" onClick={() => handleSortChange('inicio')} className="inline-flex items-center gap-1.5 text-left text-xs font-semibold uppercase tracking-wider text-zen-text-tri hover:text-white transition-colors">
                                        Inicio
                                        {renderSortIcon('inicio')}
                                    </button>
                                    <button type="button" onClick={() => handleSortChange('fim')} className="inline-flex items-center gap-1.5 text-left text-xs font-semibold uppercase tracking-wider text-zen-text-tri hover:text-white transition-colors">
                                        Fim
                                        {renderSortIcon('fim')}
                                    </button>
                                    <button type="button" onClick={() => handleSortChange('gut')} className="inline-flex items-center gap-1.5 text-left text-xs font-semibold uppercase tracking-wider text-zen-text-tri hover:text-white transition-colors">
                                        GUT
                                        {renderSortIcon('gut')}
                                    </button>
                                    <button type="button" onClick={() => handleSortChange('criado')} className="inline-flex items-center gap-1.5 text-left text-xs font-semibold uppercase tracking-wider text-zen-text-tri hover:text-white transition-colors">
                                        Criado em
                                        {renderSortIcon('criado')}
                                    </button>
                                    <span className="justify-self-end text-right">Acoes</span>
                                </div>

                                {displayedAtividades.map((atividade) => {
                                    const categoria = categoriesById[atividade.idcategoria]
                                    const corCategoria = categoria?.corcategoria || '#64748b'
                                    const participante = participantsById[atividade.participante]
                                    const primeiroNomeParticipante = getParticipantFirstName(participante?.nomeparticipante)

                                    return (
                                        <div key={atividade.id} className={ROW_GRID_CLASS}>
                                            <div className="flex items-center gap-2 text-sm font-medium text-white/90">
                                                <div className={DOT_CLASS} style={{ backgroundColor: corCategoria }} />
                                                <span
                                                    className="truncate"
                                                    onMouseEnter={(event) => handleTaskLabelMouseEnter(event, atividade.nometarefa)}
                                                    onMouseMove={(event) => handleTaskLabelMouseMove(event, atividade.nometarefa)}
                                                    onMouseLeave={handleTaskLabelMouseLeave}
                                                >
                                                    {formatTaskLabel(atividade.nometarefa)}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 min-w-0">
                                                <div className="size-7 rounded-full border border-zen-border overflow-hidden flex items-center justify-center bg-zen-bg text-[10px] text-zen-text-sec shrink-0">
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
                                                <span className="text-sm text-zen-text-sec truncate">{primeiroNomeParticipante}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-zen-text-sec">
                                                <div className={DOT_CLASS} style={{ backgroundColor: corCategoria }} />
                                                <span className="truncate">{categoria?.nomecategoria || '-'}</span>
                                            </div>
                                            <span className="text-sm">
                                                <span className={`inline-flex px-2.5 py-1 rounded-md text-xs font-medium ${getAlocadoBadgeClass(atividade.alocado)}`}>
                                                    {formatAlocadoLabel(atividade.alocado)}
                                                </span>
                                            </span>
                                            <span className="text-sm text-zen-text-sec">{formatDate(atividade.data_inicio)}</span>
                                            <span className="text-sm text-zen-text-sec">{formatDate(atividade.data_fim)}</span>
                                            <span className="text-sm text-white font-medium">{formatGut(atividade)}</span>
                                            <span className="text-sm text-zen-text-sec">{formatDate(atividade.created_at)}</span>
                                            <div className="flex justify-end justify-self-end gap-2">
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
                                                    className="inline-flex items-center justify-center text-rose-200 hover:text-rose-100 transition-colors"
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

                        <div className="xl:hidden p-3 sm:p-4 grid gap-3">
                            {displayedAtividades.map((atividade) => {
                                const categoria = categoriesById[atividade.idcategoria]
                                const corCategoria = categoria?.corcategoria || '#64748b'

                                return (
                                    <article key={atividade.id} className="bg-zen-bg border border-zen-border rounded-xl p-3 flex flex-col gap-3">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-2 text-sm font-medium text-white">
                                                    <div className={DOT_CLASS} style={{ backgroundColor: corCategoria }} />
                                                    <span
                                                        className="truncate"
                                                        onMouseEnter={(event) => handleTaskLabelMouseEnter(event, atividade.nometarefa)}
                                                        onMouseMove={(event) => handleTaskLabelMouseMove(event, atividade.nometarefa)}
                                                        onMouseLeave={handleTaskLabelMouseLeave}
                                                    >
                                                        {formatTaskLabel(atividade.nometarefa)}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2 mt-1 text-xs text-zen-text-sec">
                                                    <div className={DOT_CLASS} style={{ backgroundColor: corCategoria }} />
                                                    <span className="truncate">{categoria?.nomecategoria || 'Sem categoria'}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 shrink-0">
                                                <button
                                                    type="button"
                                                    onClick={() => handleEdit(atividade)}
                                                    className="inline-flex items-center justify-center text-zen-text-sec hover:text-white transition-colors shrink-0"
                                                    aria-label="Editar"
                                                    title="Editar"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDelete(atividade)}
                                                    className="inline-flex items-center justify-center text-rose-200 hover:text-rose-100 transition-colors shrink-0"
                                                    aria-label="Excluir"
                                                    title="Excluir"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <span className={`inline-flex px-2.5 py-1 rounded-md text-xs font-medium ${getAlocadoBadgeClass(atividade.alocado)}`}>
                                                {formatAlocadoLabel(atividade.alocado)}
                                            </span>
                                            <span className="inline-flex px-2.5 py-1 rounded-md text-xs font-medium bg-zen-surface border border-zen-border text-white">
                                                GUT {formatGut(atividade)}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2 text-xs">
                                            <div className="bg-zen-surface border border-zen-border rounded-lg p-2">
                                                <div className="text-zen-text-tri uppercase tracking-wider">Inicio</div>
                                                <div className="text-zen-text-sec mt-1">{formatDate(atividade.data_inicio)}</div>
                                            </div>
                                            <div className="bg-zen-surface border border-zen-border rounded-lg p-2">
                                                <div className="text-zen-text-tri uppercase tracking-wider">Fim</div>
                                                <div className="text-zen-text-sec mt-1">{formatDate(atividade.data_fim)}</div>
                                            </div>
                                            <div className="col-span-2 bg-zen-surface border border-zen-border rounded-lg p-2">
                                                <div className="text-zen-text-tri uppercase tracking-wider">Criado em</div>
                                                <div className="text-zen-text-sec mt-1">{formatDate(atividade.created_at)}</div>
                                            </div>
                                        </div>
                                    </article>
                                )
                            })}
                        </div>
                    </>
                )}
            </div>
            {labelTooltip.visible && (
                <div
                    className="pointer-events-none fixed z-[120] max-w-xs rounded-md border border-zen-border bg-zen-surface px-2.5 py-1.5 text-xs text-white shadow-xl"
                    style={{ left: labelTooltip.x, top: labelTooltip.y }}
                >
                    {labelTooltip.text}
                </div>
            )}
        </div>
    )
}

export default Tarefas
