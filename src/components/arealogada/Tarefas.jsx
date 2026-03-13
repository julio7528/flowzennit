import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { supabase } from '../../lib/supabase.js'

const FILTER_OPTIONS = [
    { value: 'todos', label: 'Todos' },
    { value: 'delegar', label: 'Delegar' },
    { value: 'agendar', label: 'Agendar' },
]

const HEADER_GRID_CLASS = 'grid grid-cols-[2fr_1.05fr_1.15fr_0.9fr_1fr_1fr_0.6fr_1fr_0.75fr] gap-3 px-4 py-3 text-xs font-semibold text-zen-text-tri uppercase tracking-wider bg-zen-bg/30'
const ROW_GRID_CLASS = 'grid grid-cols-[2fr_1.05fr_1.15fr_0.9fr_1fr_1fr_0.6fr_1fr_0.75fr] gap-3 px-4 py-3.5 items-center hover:bg-white/[0.02] transition-colors'
const DOT_CLASS = 'w-2 h-2 rounded-full'
const DAY_IN_MS = 1000 * 60 * 60 * 24

const Tarefas = () => {
    const navigate = useNavigate()
    const [userId, setUserId] = useState(null)
    const [atividades, setAtividades] = useState([])
    const [categoriesById, setCategoriesById] = useState({})
    const [participantsById, setParticipantsById] = useState({})
    const [loading, setLoading] = useState(true)
    const [feedback, setFeedback] = useState(null)
    const [alocadoFilter, setAlocadoFilter] = useState('todos')
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
        const baseScore = getGutScore(atividade)
        if (baseScore <= 0) return 0

        const temporalWeight = getTemporalWeight(atividade.data_fim, referenceNowMs)
        return Math.round(baseScore * temporalWeight)
    }, [getGutScore, getTemporalWeight])

    const loadAtividades = useCallback(async (currentUserId) => {
        setLoading(true)

        const atividadesQuery = supabase
            .from('tbf_atividades')
            .select('id, nometarefa, descricao, alocado, participante, data_inicio, data_fim, gravidade, urgencia, tendencia, created_at, idcategoria')
            .eq('idusuario', currentUserId)
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
        return score > 0 ? score : '-'
    }

    const handleEdit = (atividade) => {
        navigate('/tarefas', {
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

    const sortedAtividades = useMemo(
        () =>
            atividades.slice().sort((a, b) => {
                const gutDiff = getDynamicGutScore(b, nowMs) - getDynamicGutScore(a, nowMs)
                if (gutDiff !== 0) return gutDiff

                const fimA = a.data_fim ? new Date(a.data_fim).getTime() : 0
                const fimB = b.data_fim ? new Date(b.data_fim).getTime() : 0
                return fimB - fimA
            }),
        [atividades, getDynamicGutScore, nowMs]
    )

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
                ) : atividades.length === 0 ? (
                    <div className="flex flex-col items-center justify-center px-4 sm:px-6 py-12 text-center">
                        <p className="text-sm text-white font-medium">Nenhum registro encontrado.</p>
                        <p className="text-sm text-zen-text-sec mt-1">Nao ha atividades cadastradas.</p>
                    </div>
                ) : (
                    <>
                        <div className="hidden xl:block">
                            <div className="divide-y divide-zen-border/50">
                                <div className={HEADER_GRID_CLASS}>
                                    <span>Nome</span>
                                    <span>Participante</span>
                                    <span>Categoria</span>
                                    <span>Alocado</span>
                                    <span>Inicio</span>
                                    <span>Fim</span>
                                    <span>GUT</span>
                                    <span>Criado em</span>
                                    <span>Acoes</span>
                                </div>

                                {sortedAtividades.map((atividade) => {
                                    const categoria = categoriesById[atividade.idcategoria]
                                    const corCategoria = categoria?.corcategoria || '#64748b'
                                    const participante = participantsById[atividade.participante]
                                    const primeiroNomeParticipante = getParticipantFirstName(participante?.nomeparticipante)

                                    return (
                                        <div key={atividade.id} className={ROW_GRID_CLASS}>
                                            <div className="flex items-center gap-2 text-sm font-medium text-white/90">
                                                <div className={DOT_CLASS} style={{ backgroundColor: corCategoria }} />
                                                <span className="truncate">{atividade.nometarefa || '-'}</span>
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
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => handleEdit(atividade)}
                                                    className="text-sm font-semibold px-3 py-2 rounded-lg border border-zen-border text-zen-text-sec hover:text-white hover:bg-zen-border/30 transition-colors"
                                                >
                                                    Editar
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDelete(atividade)}
                                                    className="text-sm font-semibold px-3 py-2 rounded-lg border border-rose-500/40 text-rose-200 hover:text-white hover:bg-rose-500/20 transition-colors"
                                                >
                                                    Excluir
                                                </button>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        <div className="xl:hidden p-3 sm:p-4 grid gap-3">
                            {sortedAtividades.map((atividade) => {
                                const categoria = categoriesById[atividade.idcategoria]
                                const corCategoria = categoria?.corcategoria || '#64748b'

                                return (
                                    <article key={atividade.id} className="bg-zen-bg border border-zen-border rounded-xl p-3 flex flex-col gap-3">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-2 text-sm font-medium text-white">
                                                    <div className={DOT_CLASS} style={{ backgroundColor: corCategoria }} />
                                                    <span className="truncate">{atividade.nometarefa || '-'}</span>
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
                                                    className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-zen-border text-zen-text-sec hover:text-white hover:bg-zen-border/30 transition-colors shrink-0"
                                                >
                                                    Editar
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDelete(atividade)}
                                                    className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-rose-500/40 text-rose-200 hover:text-white hover:bg-rose-500/20 transition-colors shrink-0"
                                                >
                                                    Excluir
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
        </div>
    )
}

export default Tarefas
