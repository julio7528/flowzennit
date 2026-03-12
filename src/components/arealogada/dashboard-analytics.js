import { createContext, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { supabase } from '../../lib/supabase.js'
import { getStageLabelByState, isDoneState, normalizeKey, PROJECT_KANBAN_GROUPS } from './kanban-model.js'

const DAY_IN_MS = 1000 * 60 * 60 * 24
const ALERT_WINDOW_DAYS = 3

export const BOX_ALOCADOS = ['stuff', 'trash', 'referencia', 'incubado']
export const PROJECT_ALOCADOS = ['taskproj', 'bugproj']

const STAGE_ORDER = [
    'Backlog',
    'Analise (Plan)',
    'Doing (Do)',
    'Conferindo (Check)',
    'Revisao e Padronizacao (Act)',
    'Done',
    'Sem etapa',
]

const STAGE_META = {
    backlog: { tone: 'bg-slate-500/10 text-slate-200 border-slate-400/30', bar: 'bg-slate-400' },
    analise: { tone: 'bg-amber-500/10 text-amber-200 border-amber-400/30', bar: 'bg-amber-400' },
    doing: { tone: 'bg-sky-500/10 text-sky-200 border-sky-400/30', bar: 'bg-sky-400' },
    conferindo: { tone: 'bg-cyan-500/10 text-cyan-200 border-cyan-400/30', bar: 'bg-cyan-400' },
    revisao: { tone: 'bg-emerald-500/10 text-emerald-200 border-emerald-400/30', bar: 'bg-emerald-400' },
    done: { tone: 'bg-lime-500/10 text-lime-200 border-lime-400/30', bar: 'bg-lime-400' },
    fallback: { tone: 'bg-zinc-500/10 text-zinc-200 border-zinc-400/30', bar: 'bg-zinc-400' },
}

const RISK_BUCKETS = [
    { id: 'critical', label: 'Critico', min: 500, tone: 'bg-rose-500/10 text-rose-200 border-rose-400/30' },
    { id: 'high', label: 'Alto', min: 200, tone: 'bg-orange-500/10 text-orange-200 border-orange-400/30' },
    { id: 'medium', label: 'Moderado', min: 75, tone: 'bg-amber-500/10 text-amber-200 border-amber-400/30' },
    { id: 'low', label: 'Controlado', min: 1, tone: 'bg-emerald-500/10 text-emerald-200 border-emerald-400/30' },
    { id: 'empty', label: 'Sem GUT', min: Number.NEGATIVE_INFINITY, tone: 'bg-zinc-500/10 text-zinc-200 border-zinc-400/30' },
]

export const DashboardAnalyticsContext = createContext(null)

const emptySnapshot = {
    atividades: [],
    categorias: [],
    subcategorias: [],
    participantes: [],
    epics: [],
    features: [],
    userStories: [],
}

const emptyAnalytics = {
    loading: false,
    refreshing: false,
    error: null,
    lastLoadedAt: null,
    refresh: async () => {},
    snapshot: emptySnapshot,
    summary: {
        pulse: { level: 'neutral', label: 'Sem dados', description: 'Conecte o workspace para montar os indicadores.' },
        headline: 'Sem dados operacionais carregados.',
        counts: {
            workspaceTotal: 0,
            activeTotal: 0,
            doneTotal: 0,
            projectTotal: 0,
            projectActive: 0,
            operationalTotal: 0,
            categoriesTotal: 0,
            subcategoriesTotal: 0,
            participantsTotal: 0,
        },
        flow: {
            backlog: 0,
            inFlow: 0,
            done: 0,
            waiting: 0,
            blocked: 0,
            backlogRate: 0,
            doneRate: 0,
            stageBreakdown: [],
        },
        coverage: {
            planning: 0,
            ownership: 0,
            storyLink: 0,
        },
        risks: {
            averageDynamicGut: 0,
            criticalCount: 0,
            highCount: 0,
            overdueCount: 0,
            dueSoonCount: 0,
            alertCount: 0,
            riskBreakdown: [],
        },
        projects: {
            epics: 0,
            features: 0,
            userStories: 0,
            linkedStories: 0,
            avgProgress: 0,
            hierarchyDepth: 0,
            portfolioRows: [],
            unlinkedProjectItems: 0,
        },
        notifications: {
            total: 0,
        },
    },
    cards: {
        priorityItems: [],
        currentItems: [],
        recentItems: [],
        portfolioRows: [],
        ownerLoad: [],
        qualitativeInsights: [],
        semResponsavel: 0,
    },
}

const clamp = (value, min, max) => Math.min(Math.max(value, min), max)

const getDateMs = (value) => {
    if (!value) return null
    const ms = new Date(value).getTime()
    return Number.isNaN(ms) ? null : ms
}

const formatPercentValue = (value) => `${Math.round(Number(value) || 0)}%`

export const formatCompactNumber = (value) =>
    new Intl.NumberFormat('pt-BR', { notation: 'compact', maximumFractionDigits: 1 }).format(Number(value) || 0)

export const formatDateTime = (value) => {
    if (!value) return '-'
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return '-'
    return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    }).format(date)
}

export const formatRelativeTime = (value) => {
    if (!value) return '-'
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return '-'

    const diffMs = date.getTime() - Date.now()
    const diffMinutes = Math.round(diffMs / (1000 * 60))

    if (Math.abs(diffMinutes) < 60) {
        return diffMinutes >= 0 ? `em ${Math.abs(diffMinutes)} min` : `${Math.abs(diffMinutes)} min atras`
    }

    const diffHours = Math.round(diffMinutes / 60)
    if (Math.abs(diffHours) < 24) {
        return diffHours >= 0 ? `em ${Math.abs(diffHours)} h` : `${Math.abs(diffHours)} h atras`
    }

    const diffDays = Math.round(diffHours / 24)
    return diffDays >= 0 ? `em ${Math.abs(diffDays)} dias` : `${Math.abs(diffDays)} dias atras`
}

export const getBaseGutScore = (atividade) => {
    const gravidade = Number(atividade?.gravidade || 0)
    const urgencia = Number(atividade?.urgencia || 0)
    const tendencia = Number(atividade?.tendencia || 0)

    if (gravidade <= 0 || urgencia <= 0 || tendencia <= 0) return 0
    return gravidade * urgencia * tendencia
}

export const getTemporalWeight = (endDateValue, referenceNowMs) => {
    if (!endDateValue) return 1

    const endDateMs = getDateMs(endDateValue)
    if (!endDateMs) return 1

    const distanceMs = endDateMs - referenceNowMs
    if (distanceMs >= 0) {
        const daysToEnd = distanceMs / DAY_IN_MS
        const inverseWeight = 3 / (1 + daysToEnd)
        return Math.max(0.2, inverseWeight)
    }

    const daysOverdue = Math.abs(distanceMs) / DAY_IN_MS
    return 1 + Math.pow(daysOverdue + 1, 1.35)
}

export const getDynamicGutScore = (atividade, referenceNowMs) => {
    const baseScore = getBaseGutScore(atividade)
    if (baseScore <= 0) return 0

    const temporalWeight = getTemporalWeight(atividade?.data_fim, referenceNowMs)
    return Math.round(baseScore * temporalWeight)
}

const getRiskBucket = (score) => {
    if (!score) return RISK_BUCKETS[RISK_BUCKETS.length - 1]
    return RISK_BUCKETS.find((bucket, index) => {
        if (index === RISK_BUCKETS.length - 1) return true
        const next = RISK_BUCKETS[index + 1]
        return score >= bucket.min && score > next.min
    }) || RISK_BUCKETS[RISK_BUCKETS.length - 1]
}

const getAlocadoLabel = (value) => {
    const key = normalizeKey(value)
    if (key === 'taskproj') return 'Task'
    if (key === 'bugproj') return 'Bug'
    if (key === 'agendar') return 'Agendar'
    if (key === 'delegar') return 'Delegar'
    return value || 'Sem tipo'
}

const getStageMeta = (stageLabel) => {
    const key = normalizeKey(stageLabel)
    if (key.includes('backlog')) return STAGE_META.backlog
    if (key.includes('analise')) return STAGE_META.analise
    if (key.includes('doing') || key.includes('execucao')) return STAGE_META.doing
    if (key.includes('conferindo') || key.includes('check')) return STAGE_META.conferindo
    if (key.includes('revisao') || key.includes('padronizacao') || key.includes('act')) return STAGE_META.revisao
    if (key.includes('done')) return STAGE_META.done
    return STAGE_META.fallback
}

const buildPulse = ({ overdueCount, criticalCount, backlogRate, storyLink, planning, ownership }) => {
    if (overdueCount > 0 || criticalCount > 0) {
        return {
            level: 'critical',
            label: 'Operacao pressionada',
            description: 'Ha atrasos ou cards com GUT critico exigindo resposta imediata.',
        }
    }

    if (backlogRate >= 55 || planning < 70 || ownership < 70 || storyLink < 70) {
        return {
            level: 'warning',
            label: 'Fluxo em atencao',
            description: 'O pipeline esta ativo, mas ainda com gargalos de planejamento ou estruturacao.',
        }
    }

    if (planning >= 70 && ownership >= 70) {
        return {
            level: 'healthy',
            label: 'Operacao estavel',
            description: 'O workspace tem cobertura operacional consistente e baixa pressao imediata.',
        }
    }

    return {
        level: 'neutral',
        label: 'Operacao em formacao',
        description: 'Ainda ha pouca base historica para cravar uma tendencia operacional.',
    }
}

const buildInsight = (tone, title, text) => ({ tone, title, text })

const buildQualitativeInsights = ({
    workspaceTotal,
    activeTotal,
    backlogRate,
    doneRate,
    planning,
    ownership,
    storyLink,
    overdueCount,
    criticalCount,
    highCount,
    unlinkedProjectItems,
    avgProgress,
    portfolioRows,
}) => {
    const insights = []

    if (workspaceTotal === 0) {
        return [
            buildInsight(
                'zinc',
                'Workspace vazio',
                'Nao ha cards suficientes para gerar leitura operacional. O primeiro ganho sera estruturar tarefas, responsaveis e datas.'
            ),
        ]
    }

    if (overdueCount > 0 || criticalCount > 0) {
        insights.push(
            buildInsight(
                'rose',
                'Pressao de risco',
                `${overdueCount} item(ns) em atraso e ${criticalCount} card(s) em GUT critico indicam risco operacional imediato.`
            )
        )
    } else if (highCount > 0) {
        insights.push(
            buildInsight(
                'orange',
                'Prioridades altas',
                `${highCount} card(s) com GUT alto pedem sequenciamento cuidadoso para evitar escalada de impacto.`
            )
        )
    }

    if (backlogRate >= 55) {
        insights.push(
            buildInsight(
                'amber',
                'Acumulo em backlog',
                `${formatPercentValue(backlogRate)} do volume ainda esta parado no backlog. O gargalo atual esta antes da execucao.`
            )
        )
    } else if (doneRate >= 25) {
        insights.push(
            buildInsight(
                'emerald',
                'Fluxo com entrega',
                `${formatPercentValue(doneRate)} do funil ja foi encerrado em Done, sinalizando capacidade de fechar ciclos.`
            )
        )
    }

    if (planning < 70 || ownership < 70) {
        insights.push(
            buildInsight(
                'sky',
                'Governanca operacional',
                `Cobertura de planejamento em ${formatPercentValue(planning)} e ownership em ${formatPercentValue(ownership)}. Falta amarrar prazo ou responsavel em parte da carteira ativa.`
            )
        )
    }

    if (storyLink < 70 || unlinkedProjectItems > 0) {
        insights.push(
            buildInsight(
                'cyan',
                'Hierarquia de projetos incompleta',
                `${formatPercentValue(storyLink)} dos cards de projeto estao ligados a user stories. ${unlinkedProjectItems} item(ns) ainda nao conversam com a cadeia epic > feature > story.`
            )
        )
    } else if (portfolioRows.length > 0) {
        insights.push(
            buildInsight(
                'emerald',
                'Portifolio conectado',
                `A cadeia de projetos esta ativa e o progresso medio dos cards de projeto esta em ${formatPercentValue(avgProgress)}.`
            )
        )
    }

    if (activeTotal > 0 && insights.length < 4) {
        insights.push(
            buildInsight(
                'zinc',
                'Carga atual',
                `${activeTotal} item(ns) seguem operando agora. O foco deve ficar nos cards com maior GUT e prazo mais curto.`
            )
        )
    }

    return insights.slice(0, 4)
}

const buildHeadline = ({ pulse, activeTotal, criticalCount, dueSoonCount, epics, userStories }) => {
    if (activeTotal === 0) {
        return 'Sem itens ativos no momento. O dashboard esta pronto para acompanhar a proxima rodada operacional.'
    }

    if (pulse.level === 'critical') {
        return `${criticalCount} card(s) critico(s) e ${dueSoonCount} entrega(s) proximas puxam o foco para resposta de curto prazo.`
    }

    if (epics > 0 || userStories > 0) {
        return `${activeTotal} item(ns) ativos conectam a operacao diaria com a hierarquia de projetos ja cadastrada.`
    }

    return `${activeTotal} item(ns) ativos em execucao, com leitura de fluxo, risco GUT e cobertura operacional.`
}

const compareByPriority = (a, b) => {
    if (b.isOverdue !== a.isOverdue) return Number(b.isOverdue) - Number(a.isOverdue)
    if (b.dynamicGut !== a.dynamicGut) return b.dynamicGut - a.dynamicGut
    if (a.dueMs && b.dueMs) return a.dueMs - b.dueMs
    if (a.dueMs) return -1
    if (b.dueMs) return 1
    return (b.createdMs || 0) - (a.createdMs || 0)
}

const compareCurrent = (a, b) => {
    if (b.isOverdue !== a.isOverdue) return Number(b.isOverdue) - Number(a.isOverdue)
    if (b.isDueSoon !== a.isDueSoon) return Number(b.isDueSoon) - Number(a.isDueSoon)
    if (a.stageLabel !== b.stageLabel) {
        const aIndex = STAGE_ORDER.findIndex((item) => normalizeKey(item) === normalizeKey(a.stageLabel))
        const bIndex = STAGE_ORDER.findIndex((item) => normalizeKey(item) === normalizeKey(b.stageLabel))
        return aIndex - bIndex
    }
    return compareByPriority(a, b)
}

const buildStageBreakdown = (items, totalCount) => {
    const stageCounts = new Map(STAGE_ORDER.map((label) => [label, 0]))

    items.forEach((item) => {
        const stageLabel = STAGE_ORDER.find((label) => normalizeKey(label) === normalizeKey(item.stageLabel)) || 'Sem etapa'
        stageCounts.set(stageLabel, (stageCounts.get(stageLabel) || 0) + 1)
    })

    return STAGE_ORDER
        .map((label) => {
            const count = stageCounts.get(label) || 0
            if (count === 0 && label === 'Sem etapa') return null
            const share = totalCount > 0 ? Math.round((count / totalCount) * 100) : 0
            return {
                label,
                key: normalizeKey(label),
                count,
                share,
                ...getStageMeta(label),
            }
        })
        .filter(Boolean)
}

const buildRiskBreakdown = (items) =>
    RISK_BUCKETS.map((bucket, index) => {
        const next = RISK_BUCKETS[index - 1]
        const count = items.filter((item) => {
            if (bucket.id === 'empty') return item.dynamicGut <= 0
            if (!next) return item.dynamicGut >= bucket.min
            return item.dynamicGut >= bucket.min && item.dynamicGut < next.min
        }).length

        return {
            ...bucket,
            count,
            share: items.length > 0 ? Math.round((count / items.length) * 100) : 0,
        }
    })

const buildPortfolioRows = ({ epics, featuresByEpic, storiesByFeature, activitiesByStory }) =>
    epics.map((epic) => {
        const featureList = featuresByEpic.get(epic.id) || []
        const storyList = featureList.flatMap((feature) => storiesByFeature.get(feature.id) || [])
        const itemList = storyList.flatMap((story) => activitiesByStory.get(story.id) || [])
        const activeCount = itemList.filter((item) => !item.isDone).length
        const criticalCount = itemList.filter((item) => item.dynamicGut >= 500).length
        const progress = itemList.length
            ? Math.round(itemList.reduce((acc, item) => acc + item.progress, 0) / itemList.length)
            : 0

        return {
            id: epic.id,
            title: epic.nome_epic,
            featureCount: featureList.length,
            storyCount: storyList.length,
            itemCount: itemList.length,
            activeCount,
            criticalCount,
            progress,
            stories: storyList.slice(0, 3).map((story) => ({
                id: story.id,
                title: story.nome_userstory,
                count: (activitiesByStory.get(story.id) || []).length,
            })),
        }
    })

const buildOwnerLoad = ({ activeActivities, participantsById }) => {
    const rows = Object.values(participantsById)
        .map((participant) => {
            const items = activeActivities.filter((item) => item.participante === participant.id)
            if (items.length === 0) return null
            return {
                id: participant.id,
                nome: participant.nomeparticipante,
                foto: participant.fotobase64 || null,
                activeCount: items.length,
                overdueCount: items.filter((item) => item.isOverdue).length,
                highRiskCount: items.filter((item) => item.dynamicGut >= 200).length,
                progress: Math.round(items.reduce((acc, item) => acc + item.progress, 0) / items.length),
            }
        })
        .filter(Boolean)
        .sort((a, b) => {
            if (b.highRiskCount !== a.highRiskCount) return b.highRiskCount - a.highRiskCount
            if (b.activeCount !== a.activeCount) return b.activeCount - a.activeCount
            return a.nome.localeCompare(b.nome, 'pt-BR')
        })

    const semResponsavel = activeActivities.filter((item) => !item.participante).length

    return { rows: rows.slice(0, 5), semResponsavel }
}

export const useWorkspaceAnalytics = (userId) => {
    const [snapshot, setSnapshot] = useState(emptySnapshot)
    const [loading, setLoading] = useState(Boolean(userId))
    const [refreshing, setRefreshing] = useState(false)
    const [error, setError] = useState(null)
    const [lastLoadedAt, setLastLoadedAt] = useState(null)
    const [nowMs, setNowMs] = useState(() => Date.now())
    const hasLoadedRef = useRef(false)

    useEffect(() => {
        const timer = window.setInterval(() => {
            setNowMs(Date.now())
        }, 30000)

        return () => window.clearInterval(timer)
    }, [])

    useEffect(() => {
        hasLoadedRef.current = false
    }, [userId])

    const loadAnalytics = useCallback(async () => {
        if (!supabase) {
            setError('Supabase nao configurado.')
            setLoading(false)
            setRefreshing(false)
            setSnapshot(emptySnapshot)
            return
        }

        if (!userId) {
            setLoading(false)
            setRefreshing(false)
            setError(null)
            setSnapshot(emptySnapshot)
            return
        }

        setError(null)
        setRefreshing(hasLoadedRef.current)
        setLoading(!hasLoadedRef.current)

        const [
            { data: atividadesData, error: atividadesError },
            { data: categoriasData, error: categoriasError },
            { data: subcategoriasData, error: subcategoriasError },
            { data: participantesData, error: participantesError },
            { data: epicsData, error: epicsError },
            { data: featuresData, error: featuresError },
            { data: userStoriesData, error: userStoriesError },
        ] = await Promise.all([
            supabase
                .from('tbf_atividades')
                .select('id, nometarefa, descricao, alocado, participante, data_inicio, data_fim, gravidade, urgencia, tendencia, created_at, idcategoria, idsubcategoria, predecessor, sucessor, percentual_progresso, userhistory, "posicao Kanban"')
                .eq('idusuario', userId)
                .order('created_at', { ascending: false }),
            supabase.from('tbf_categorias').select('id, nomecategoria, corcategoria, created_at').eq('idusuario', userId),
            supabase.from('tbf_subcategorias').select('id, idcategorias, nomecategoria, corsubcategoria, created_at').eq('idusuario', userId),
            supabase.from('tbf_participantes').select('id, nomeparticipante, fotobase64, created_at').eq('idusuario', userId),
            supabase.from('tbf_epic').select('id, nome_epic').order('id', { ascending: true }),
            supabase.from('tbf_feature').select('id, nome_feature, id_epic').order('id', { ascending: true }),
            supabase.from('tbf_userstory').select('id, nome_userstory, id_feature').order('id', { ascending: true }),
        ])

        if (atividadesError) {
            setSnapshot(emptySnapshot)
            setError('Nao foi possivel carregar as atividades do dashboard.')
            setLoading(false)
            setRefreshing(false)
            return
        }

        setSnapshot({
            atividades: atividadesData || [],
            categorias: categoriasError ? [] : categoriasData || [],
            subcategorias: subcategoriasError ? [] : subcategoriasData || [],
            participantes: participantesError ? [] : participantesData || [],
            epics: epicsError ? [] : epicsData || [],
            features: featuresError ? [] : featuresData || [],
            userStories: userStoriesError ? [] : userStoriesData || [],
        })

        if (categoriasError || subcategoriasError || participantesError || epicsError || featuresError || userStoriesError) {
            setError('Parte das fontes auxiliares falhou. Os KPIs foram montados com o que estava disponivel.')
        } else {
            setError(null)
        }

        setLastLoadedAt(new Date())
        hasLoadedRef.current = true
        setLoading(false)
        setRefreshing(false)
    }, [userId])

    useEffect(() => {
        const timer = window.setTimeout(() => {
            loadAnalytics()
        }, 0)

        return () => window.clearTimeout(timer)
    }, [loadAnalytics])

    return useMemo(() => {
        const participantsById = snapshot.participantes.reduce((acc, participant) => {
            acc[participant.id] = participant
            return acc
        }, {})

        const categoriesById = snapshot.categorias.reduce((acc, category) => {
            acc[category.id] = category
            return acc
        }, {})

        const featuresByEpic = snapshot.features.reduce((map, feature) => {
            const list = map.get(feature.id_epic) || []
            list.push(feature)
            map.set(feature.id_epic, list)
            return map
        }, new Map())

        const storiesByFeature = snapshot.userStories.reduce((map, story) => {
            const list = map.get(story.id_feature) || []
            list.push(story)
            map.set(story.id_feature, list)
            return map
        }, new Map())

        const storyById = new Map(snapshot.userStories.map((story) => [story.id, story]))
        const featureById = new Map(snapshot.features.map((feature) => [feature.id, feature]))
        const epicById = new Map(snapshot.epics.map((epic) => [epic.id, epic]))

        const workspaceActivities = snapshot.atividades
            .map((atividade) => {
                const alocadoKey = normalizeKey(atividade.alocado)
                const rawState = atividade['posicao Kanban'] || ''
                const stageLabel = getStageLabelByState(rawState, PROJECT_KANBAN_GROUPS)
                const progress = clamp(Number(atividade.percentual_progresso || 0), 0, 100)
                const dynamicGut = getDynamicGutScore(atividade, nowMs)
                const dueMs = getDateMs(atividade.data_fim)
                const createdMs = getDateMs(atividade.created_at)
                const isDone = isDoneState(rawState, PROJECT_KANBAN_GROUPS)
                const isOverdue = Boolean(dueMs && !isDone && dueMs < nowMs)
                const isDueSoon = Boolean(dueMs && !isDone && dueMs >= nowMs && dueMs <= nowMs + ALERT_WINDOW_DAYS * DAY_IN_MS)
                const riskBucket = getRiskBucket(dynamicGut)
                const story = storyById.get(atividade.userhistory) || null
                const feature = story ? featureById.get(story.id_feature) || null : null
                const epic = feature ? epicById.get(feature.id_epic) || null : null
                const category = categoriesById[atividade.idcategoria] || null
                const participant = participantsById[atividade.participante] || null

                return {
                    ...atividade,
                    alocadoKey,
                    alocadoLabel: getAlocadoLabel(atividade.alocado),
                    rawState,
                    stageLabel,
                    stageMeta: getStageMeta(stageLabel),
                    progress,
                    dynamicGut,
                    baseGut: getBaseGutScore(atividade),
                    riskBucket,
                    dueMs,
                    createdMs,
                    isDone,
                    isOverdue,
                    isDueSoon,
                    story,
                    feature,
                    epic,
                    category,
                    participant,
                }
            })
            .filter((atividade) => !BOX_ALOCADOS.includes(atividade.alocadoKey))

        const activeActivities = workspaceActivities.filter((item) => !item.isDone)
        const doneActivities = workspaceActivities.filter((item) => item.isDone)
        const projectActivities = workspaceActivities.filter((item) => PROJECT_ALOCADOS.includes(item.alocadoKey))
        const activeProjectActivities = projectActivities.filter((item) => !item.isDone)
        const operationalActivities = workspaceActivities.filter((item) => !PROJECT_ALOCADOS.includes(item.alocadoKey))
        const backlogActivities = activeActivities.filter((item) => normalizeKey(item.stageLabel).includes('backlog'))
        const inFlowActivities = activeActivities.filter((item) => !normalizeKey(item.stageLabel).includes('backlog'))
        const waitingActivities = activeActivities.filter((item) => normalizeKey(item.rawState).includes('aguardando'))
        const blockedActivities = activeActivities.filter((item) => normalizeKey(item.rawState).includes('bloqueado'))
        const overdueActivities = activeActivities.filter((item) => item.isOverdue)
        const dueSoonActivities = activeActivities.filter((item) => item.isDueSoon)
        const criticalActivities = activeActivities.filter((item) => item.dynamicGut >= 500)
        const highRiskActivities = activeActivities.filter((item) => item.dynamicGut >= 200)
        const activeWithDeadline = activeActivities.filter((item) => item.data_fim)
        const activeWithOwner = activeActivities.filter((item) => item.participante)
        const linkedProjectItems = projectActivities.filter((item) => item.userhistory)

        const stageBreakdown = buildStageBreakdown(workspaceActivities, workspaceActivities.length)
        const riskBreakdown = buildRiskBreakdown(activeActivities)

        const activitiesByStory = projectActivities.reduce((map, item) => {
            if (!item.userhistory) return map
            const list = map.get(item.userhistory) || []
            list.push(item)
            map.set(item.userhistory, list)
            return map
        }, new Map())

        const portfolioRows = buildPortfolioRows({
            epics: snapshot.epics,
            featuresByEpic,
            storiesByFeature,
            activitiesByStory,
        })

        const ownerLoad = buildOwnerLoad({
            activeActivities,
            participantsById,
        })

        const planningCoverage = activeActivities.length
            ? Math.round((activeWithDeadline.length / activeActivities.length) * 100)
            : 0
        const ownershipCoverage = activeActivities.length
            ? Math.round((activeWithOwner.length / activeActivities.length) * 100)
            : 0
        const storyLinkCoverage = projectActivities.length
            ? Math.round((linkedProjectItems.length / projectActivities.length) * 100)
            : 0
        const doneRate = workspaceActivities.length
            ? Math.round((doneActivities.length / workspaceActivities.length) * 100)
            : 0
        const backlogRate = activeActivities.length
            ? Math.round((backlogActivities.length / activeActivities.length) * 100)
            : 0
        const averageDynamicGut = activeActivities.length
            ? Math.round(activeActivities.reduce((acc, item) => acc + item.dynamicGut, 0) / activeActivities.length)
            : 0
        const averageProjectProgress = projectActivities.length
            ? Math.round(projectActivities.reduce((acc, item) => acc + item.progress, 0) / projectActivities.length)
            : 0

        const hierarchyDepth = Math.round(
            ([snapshot.epics.length, snapshot.features.length, snapshot.userStories.length, projectActivities.length].filter(Boolean).length / 4) * 100
        )

        const pulse = buildPulse({
            overdueCount: overdueActivities.length,
            criticalCount: criticalActivities.length,
            backlogRate,
            storyLink: storyLinkCoverage,
            planning: planningCoverage,
            ownership: ownershipCoverage,
        })

        const headline = buildHeadline({
            pulse,
            activeTotal: activeActivities.length,
            criticalCount: criticalActivities.length,
            dueSoonCount: dueSoonActivities.length,
            epics: snapshot.epics.length,
            userStories: snapshot.userStories.length,
        })

        const qualitativeInsights = buildQualitativeInsights({
            workspaceTotal: workspaceActivities.length,
            activeTotal: activeActivities.length,
            backlogRate,
            doneRate,
            planning: planningCoverage,
            ownership: ownershipCoverage,
            storyLink: storyLinkCoverage,
            overdueCount: overdueActivities.length,
            criticalCount: criticalActivities.length,
            highCount: highRiskActivities.length,
            unlinkedProjectItems: projectActivities.length - linkedProjectItems.length,
            avgProgress: averageProjectProgress,
            portfolioRows,
        })

        return {
            loading,
            refreshing,
            error,
            lastLoadedAt,
            refresh: loadAnalytics,
            snapshot,
            summary: {
                pulse,
                headline,
                counts: {
                    workspaceTotal: workspaceActivities.length,
                    activeTotal: activeActivities.length,
                    doneTotal: doneActivities.length,
                    projectTotal: projectActivities.length,
                    projectActive: activeProjectActivities.length,
                    operationalTotal: operationalActivities.length,
                    categoriesTotal: snapshot.categorias.length,
                    subcategoriesTotal: snapshot.subcategorias.length,
                    participantsTotal: snapshot.participantes.length,
                },
                flow: {
                    backlog: backlogActivities.length,
                    inFlow: inFlowActivities.length,
                    done: doneActivities.length,
                    waiting: waitingActivities.length,
                    blocked: blockedActivities.length,
                    backlogRate,
                    doneRate,
                    stageBreakdown,
                },
                coverage: {
                    planning: planningCoverage,
                    ownership: ownershipCoverage,
                    storyLink: storyLinkCoverage,
                },
                risks: {
                    averageDynamicGut,
                    criticalCount: criticalActivities.length,
                    highCount: highRiskActivities.length,
                    overdueCount: overdueActivities.length,
                    dueSoonCount: dueSoonActivities.length,
                    alertCount: overdueActivities.length + criticalActivities.length + dueSoonActivities.length,
                    riskBreakdown,
                },
                projects: {
                    epics: snapshot.epics.length,
                    features: snapshot.features.length,
                    userStories: snapshot.userStories.length,
                    linkedStories: new Set(linkedProjectItems.map((item) => item.userhistory).filter(Boolean)).size,
                    avgProgress: averageProjectProgress,
                    hierarchyDepth,
                    portfolioRows,
                    unlinkedProjectItems: projectActivities.length - linkedProjectItems.length,
                },
                notifications: {
                    total: overdueActivities.length + criticalActivities.length + blockedActivities.length,
                },
            },
            cards: {
                priorityItems: [...activeActivities].sort(compareByPriority).slice(0, 5),
                currentItems: [...activeActivities].sort(compareCurrent).slice(0, 6),
                recentItems: [...workspaceActivities]
                    .sort((a, b) => (b.createdMs || 0) - (a.createdMs || 0))
                    .slice(0, 5),
                portfolioRows,
                ownerLoad: ownerLoad.rows,
                semResponsavel: ownerLoad.semResponsavel,
                qualitativeInsights,
            },
        }
    }, [error, lastLoadedAt, loadAnalytics, loading, nowMs, refreshing, snapshot])
}

export const getPulseToneClass = (level) => {
    if (level === 'critical') return 'border-rose-400/40 bg-rose-500/10 text-rose-200'
    if (level === 'warning') return 'border-amber-400/40 bg-amber-500/10 text-amber-200'
    if (level === 'healthy') return 'border-emerald-400/40 bg-emerald-500/10 text-emerald-200'
    return 'border-zinc-400/30 bg-zinc-500/10 text-zinc-200'
}

export const getInsightToneClass = (tone) => {
    if (tone === 'rose') return 'border-rose-400/30 bg-rose-500/10 text-rose-100'
    if (tone === 'orange') return 'border-orange-400/30 bg-orange-500/10 text-orange-100'
    if (tone === 'amber') return 'border-amber-400/30 bg-amber-500/10 text-amber-100'
    if (tone === 'sky') return 'border-sky-400/30 bg-sky-500/10 text-sky-100'
    if (tone === 'cyan') return 'border-cyan-400/30 bg-cyan-500/10 text-cyan-100'
    if (tone === 'emerald') return 'border-emerald-400/30 bg-emerald-500/10 text-emerald-100'
    return 'border-zinc-400/30 bg-zinc-500/10 text-zinc-100'
}

export const fallbackWorkspaceAnalytics = emptyAnalytics
