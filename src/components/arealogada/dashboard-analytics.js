import { createContext, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { supabase } from '../../lib/supabase.js'
import i18n from '../../lib/i18n.js'
import { getStageLabelByState, isDoneState, normalizeKey, PROJECT_KANBAN_GROUPS } from './kanban-model.js'

const DAY_IN_MS = 1000 * 60 * 60 * 24
const ALERT_WINDOW_DAYS = 3

export const BOX_ALOCADOS = ['stuff', 'trash', 'referencia', 'incubado']
export const PROJECT_ALOCADOS = ['taskproj', 'bugproj']

const STAGE_ORDER = ['backlog', 'analysis', 'doing', 'check', 'review', 'done', 'unassigned']

const getLocale = () => i18n.resolvedLanguage || 'pt-BR'

const getStageKey = (stageLabel) => {
    const key = normalizeKey(stageLabel)
    if (key.includes('backlog')) return 'backlog'
    if (key.includes('analise') || key.includes('plan')) return 'analysis'
    if (key.includes('doing') || key.includes('execucao')) return 'doing'
    if (key.includes('conferindo') || key.includes('check')) return 'check'
    if (key.includes('revisao') || key.includes('padronizacao') || key.includes('act')) return 'review'
    if (key.includes('done')) return 'done'
    return 'unassigned'
}

const translateStageKey = (stageKey) => {
    if (stageKey === 'backlog') return i18n.t('dashboardAnalytics.stages.backlog')
    if (stageKey === 'analysis') return i18n.t('dashboardAnalytics.stages.analysis')
    if (stageKey === 'doing') return i18n.t('dashboardAnalytics.stages.doing')
    if (stageKey === 'check') return i18n.t('dashboardAnalytics.stages.check')
    if (stageKey === 'review') return i18n.t('dashboardAnalytics.stages.review')
    if (stageKey === 'done') return i18n.t('dashboardAnalytics.stages.done')
    return i18n.t('dashboardAnalytics.stages.unassigned')
}

const translateStageLabel = (stageLabel) => translateStageKey(getStageKey(stageLabel))

const STAGE_META = {
    backlog: { tone: 'bg-slate-500/10 text-slate-200 border-slate-400/30', bar: 'bg-slate-400' },
    analise: { tone: 'bg-amber-500/10 text-amber-200 border-amber-400/30', bar: 'bg-amber-400' },
    doing: { tone: 'bg-sky-500/10 text-sky-200 border-sky-400/30', bar: 'bg-sky-400' },
    conferindo: { tone: 'bg-cyan-500/10 text-cyan-200 border-cyan-400/30', bar: 'bg-cyan-400' },
    revisao: { tone: 'bg-emerald-500/10 text-emerald-200 border-emerald-400/30', bar: 'bg-emerald-400' },
    done: { tone: 'bg-lime-500/10 text-lime-200 border-lime-400/30', bar: 'bg-lime-400' },
    fallback: { tone: 'bg-zinc-500/10 text-zinc-200 border-zinc-400/30', bar: 'bg-zinc-400' },
}

const getRiskBuckets = () => [
    { id: 'critical', label: i18n.t('dashboardAnalytics.riskBuckets.critical'), min: 500, tone: 'bg-rose-500/10 text-rose-200 border-rose-400/30' },
    { id: 'high', label: i18n.t('dashboardAnalytics.riskBuckets.high'), min: 200, tone: 'bg-orange-500/10 text-orange-200 border-orange-400/30' },
    { id: 'medium', label: i18n.t('dashboardAnalytics.riskBuckets.medium'), min: 75, tone: 'bg-amber-500/10 text-amber-200 border-amber-400/30' },
    { id: 'low', label: i18n.t('dashboardAnalytics.riskBuckets.low'), min: 1, tone: 'bg-emerald-500/10 text-emerald-200 border-emerald-400/30' },
    { id: 'empty', label: i18n.t('dashboardAnalytics.riskBuckets.empty'), min: Number.NEGATIVE_INFINITY, tone: 'bg-zinc-500/10 text-zinc-200 border-zinc-400/30' },
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
        pulse: {
            level: 'neutral',
            label: i18n.t('dashboardAnalytics.defaults.pulseLabel'),
            description: i18n.t('dashboardAnalytics.defaults.pulseDescription'),
        },
        headline: i18n.t('dashboardAnalytics.defaults.headline'),
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
    new Intl.NumberFormat(getLocale(), { notation: 'compact', maximumFractionDigits: 1 }).format(Number(value) || 0)

export const formatDateTime = (value) => {
    if (!value) return '-'
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return '-'
    return new Intl.DateTimeFormat(getLocale(), {
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
        return diffMinutes >= 0
            ? i18n.t('dashboardAnalytics.relativeTime.inMinutes', { count: Math.abs(diffMinutes) })
            : i18n.t('dashboardAnalytics.relativeTime.minutesAgo', { count: Math.abs(diffMinutes) })
    }

    const diffHours = Math.round(diffMinutes / 60)
    if (Math.abs(diffHours) < 24) {
        return diffHours >= 0
            ? i18n.t('dashboardAnalytics.relativeTime.inHours', { count: Math.abs(diffHours) })
            : i18n.t('dashboardAnalytics.relativeTime.hoursAgo', { count: Math.abs(diffHours) })
    }

    const diffDays = Math.round(diffHours / 24)
    return diffDays >= 0
        ? i18n.t('dashboardAnalytics.relativeTime.inDays', { count: Math.abs(diffDays) })
        : i18n.t('dashboardAnalytics.relativeTime.daysAgo', { count: Math.abs(diffDays) })
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

export const getRiskBucket = (score) => {
    const riskBuckets = getRiskBuckets()
    if (!score) return riskBuckets[riskBuckets.length - 1]
    return riskBuckets.find((bucket, index) => {
        if (index === riskBuckets.length - 1) return true
        const next = riskBuckets[index + 1]
        return score >= bucket.min && score > next.min
    }) || riskBuckets[riskBuckets.length - 1]
}

const getAlocadoLabel = (value) => {
    const key = normalizeKey(value)
    if (key === 'taskproj') return i18n.t('dashboardAnalytics.allocation.task')
    if (key === 'bugproj') return i18n.t('dashboardAnalytics.allocation.bug')
    if (key === 'agendar') return i18n.t('dashboardAnalytics.allocation.schedule')
    if (key === 'delegar') return i18n.t('dashboardAnalytics.allocation.delegate')
    return value || i18n.t('dashboardAnalytics.allocation.unknown')
}

const getStageMeta = (stageLabel) => {
    const key = getStageKey(stageLabel)
    if (key === 'backlog') return STAGE_META.backlog
    if (key === 'analysis') return STAGE_META.analise
    if (key === 'doing') return STAGE_META.doing
    if (key === 'check') return STAGE_META.conferindo
    if (key === 'review') return STAGE_META.revisao
    if (key === 'done') return STAGE_META.done
    return STAGE_META.fallback
}

const buildPulse = ({ overdueCount, criticalCount, backlogRate, storyLink, planning, ownership }) => {
    if (overdueCount > 0 || criticalCount > 0) {
        return {
            level: 'critical',
            label: i18n.t('dashboardAnalytics.pulse.critical.label'),
            description: i18n.t('dashboardAnalytics.pulse.critical.description'),
        }
    }

    if (backlogRate >= 55 || planning < 70 || ownership < 70 || storyLink < 70) {
        return {
            level: 'warning',
            label: i18n.t('dashboardAnalytics.pulse.warning.label'),
            description: i18n.t('dashboardAnalytics.pulse.warning.description'),
        }
    }

    if (planning >= 70 && ownership >= 70) {
        return {
            level: 'healthy',
            label: i18n.t('dashboardAnalytics.pulse.healthy.label'),
            description: i18n.t('dashboardAnalytics.pulse.healthy.description'),
        }
    }

    return {
        level: 'neutral',
        label: i18n.t('dashboardAnalytics.pulse.neutral.label'),
        description: i18n.t('dashboardAnalytics.pulse.neutral.description'),
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
                i18n.t('dashboardAnalytics.insights.empty.title'),
                i18n.t('dashboardAnalytics.insights.empty.text')
            ),
        ]
    }

    if (overdueCount > 0 || criticalCount > 0) {
        insights.push(
            buildInsight(
                'rose',
                i18n.t('dashboardAnalytics.insights.riskPressure.title'),
                i18n.t('dashboardAnalytics.insights.riskPressure.text', { overdueCount, criticalCount })
            )
        )
    } else if (highCount > 0) {
        insights.push(
            buildInsight(
                'orange',
                i18n.t('dashboardAnalytics.insights.highPriority.title'),
                i18n.t('dashboardAnalytics.insights.highPriority.text', { highCount })
            )
        )
    }

    if (backlogRate >= 55) {
        insights.push(
            buildInsight(
                'amber',
                i18n.t('dashboardAnalytics.insights.backlogAccumulation.title'),
                i18n.t('dashboardAnalytics.insights.backlogAccumulation.text', { backlogRate: formatPercentValue(backlogRate) })
            )
        )
    } else if (doneRate >= 25) {
        insights.push(
            buildInsight(
                'emerald',
                i18n.t('dashboardAnalytics.insights.deliveryFlow.title'),
                i18n.t('dashboardAnalytics.insights.deliveryFlow.text', { doneRate: formatPercentValue(doneRate) })
            )
        )
    }

    if (planning < 70 || ownership < 70) {
        insights.push(
            buildInsight(
                'sky',
                i18n.t('dashboardAnalytics.insights.governance.title'),
                i18n.t('dashboardAnalytics.insights.governance.text', {
                    planning: formatPercentValue(planning),
                    ownership: formatPercentValue(ownership),
                })
            )
        )
    }

    if (storyLink < 70 || unlinkedProjectItems > 0) {
        insights.push(
            buildInsight(
                'cyan',
                i18n.t('dashboardAnalytics.insights.incompleteHierarchy.title'),
                i18n.t('dashboardAnalytics.insights.incompleteHierarchy.text', {
                    storyLink: formatPercentValue(storyLink),
                    unlinkedProjectItems,
                })
            )
        )
    } else if (portfolioRows.length > 0) {
        insights.push(
            buildInsight(
                'emerald',
                i18n.t('dashboardAnalytics.insights.connectedPortfolio.title'),
                i18n.t('dashboardAnalytics.insights.connectedPortfolio.text', { avgProgress: formatPercentValue(avgProgress) })
            )
        )
    }

    if (activeTotal > 0 && insights.length < 4) {
        insights.push(
            buildInsight(
                'zinc',
                i18n.t('dashboardAnalytics.insights.currentLoad.title'),
                i18n.t('dashboardAnalytics.insights.currentLoad.text', { activeTotal })
            )
        )
    }

    return insights.slice(0, 4)
}

const buildHeadline = ({ pulse, activeTotal, criticalCount, dueSoonCount, epics, userStories }) => {
    if (activeTotal === 0) {
        return i18n.t('dashboardAnalytics.headline.noActive')
    }

    if (pulse.level === 'critical') {
        return i18n.t('dashboardAnalytics.headline.critical', { criticalCount, dueSoonCount })
    }

    if (epics > 0 || userStories > 0) {
        return i18n.t('dashboardAnalytics.headline.withHierarchy', { activeTotal })
    }

    return i18n.t('dashboardAnalytics.headline.default', { activeTotal })
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
    if (a.stageKey !== b.stageKey) {
        const aIndex = STAGE_ORDER.findIndex((item) => item === a.stageKey)
        const bIndex = STAGE_ORDER.findIndex((item) => item === b.stageKey)
        return aIndex - bIndex
    }
    return compareByPriority(a, b)
}

const buildStageBreakdown = (items, totalCount) => {
    const stageCounts = new Map(STAGE_ORDER.map((label) => [label, 0]))

    items.forEach((item) => {
        const stageKey = STAGE_ORDER.includes(item.stageKey) ? item.stageKey : 'unassigned'
        stageCounts.set(stageKey, (stageCounts.get(stageKey) || 0) + 1)
    })

    return STAGE_ORDER
        .map((stageKey) => {
            const count = stageCounts.get(stageKey) || 0
            if (count === 0 && stageKey === 'unassigned') return null
            const share = totalCount > 0 ? Math.round((count / totalCount) * 100) : 0
            return {
                label: translateStageKey(stageKey),
                key: stageKey,
                count,
                share,
                ...getStageMeta(stageKey),
            }
        })
        .filter(Boolean)
}

export const buildRiskBreakdown = (items) =>
    getRiskBuckets().map((bucket, index, riskBuckets) => {
        const next = riskBuckets[index - 1]
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
            return a.nome.localeCompare(b.nome, getLocale())
        })

    const semResponsavel = activeActivities.filter((item) => !item.participante).length

    return { rows: rows.slice(0, 5), semResponsavel }
}

export const useWorkspaceAnalytics = (userId, { dateFrom, dateTo } = {}) => {
    const [snapshot, setSnapshot] = useState(emptySnapshot)
    const [loading, setLoading] = useState(Boolean(userId))
    const [refreshing, setRefreshing] = useState(false)
    const [error, setError] = useState(null)
    const [lastLoadedAt, setLastLoadedAt] = useState(null)
    const [nowMs, setNowMs] = useState(Date.now)
    const hasLoadedRef = useRef(false)

    useEffect(() => {
        const timer = window.setInterval(() => {
            setNowMs(Date.now())
        }, 30000)

        return () => window.clearInterval(timer)
    }, [])

    useEffect(() => {
        hasLoadedRef.current = false
    }, [userId, i18n.resolvedLanguage])

    const loadAnalytics = useCallback(async (dateFrom = null, dateTo = null) => {
        if (!supabase) {
            setError(i18n.t('dashboardAnalytics.errors.supabaseMissing'))
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

        let queryAtividades = supabase
            .from('tbf_atividades')
            .select('id, nometarefa, descricao, alocado, participante, data_inicio, data_fim, gravidade, urgencia, tendencia, created_at, idcategoria, idsubcategoria, predecessor, sucessor, percentual_progresso, userhistory, "posicao Kanban"')
            .eq('idusuario', userId)

        if (dateFrom) {
            queryAtividades = queryAtividades.gte('data_inicio', dateFrom)
        }
        if (dateTo) {
            queryAtividades = queryAtividades.lte('data_fim', dateTo)
        }

        const [
            { data: atividadesData, error: atividadesError },
            { data: categoriasData, error: categoriasError },
            { data: subcategoriasData, error: subcategoriasError },
            { data: participantesData, error: participantesError },
            { data: epicsData, error: epicsError },
            { data: featuresData, error: featuresError },
            { data: userStoriesData, error: userStoriesError },
        ] = await Promise.all([
            queryAtividades.order('created_at', { ascending: false }),
            supabase.from('tbf_categorias').select('id, nomecategoria, corcategoria, created_at').eq('idusuario', userId),
            supabase.from('tbf_subcategorias').select('id, idcategorias, nomecategoria, corsubcategoria, created_at').eq('idusuario', userId),
            supabase.from('tbf_participantes').select('id, nomeparticipante, fotobase64, created_at').eq('idusuario', userId),
            supabase.from('tbf_epic').select('id, nome_epic').eq('idusuario', userId).order('id', { ascending: true }),
            supabase.from('tbf_feature').select('id, nome_feature, id_epic').eq('idusuario', userId).order('id', { ascending: true }),
            supabase.from('tbf_userstory').select('id, nome_userstory, id_feature').eq('idusuario', userId).order('id', { ascending: true }),
        ])

        if (atividadesError) {
            setSnapshot(emptySnapshot)
            setError(i18n.t('dashboardAnalytics.errors.loadActivities'))
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
            setError(i18n.t('dashboardAnalytics.errors.partialSources'))
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
                const canonicalStageLabel = getStageLabelByState(rawState, PROJECT_KANBAN_GROUPS)
                const stageKey = getStageKey(canonicalStageLabel)
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
                    stageKey,
                    stageLabel: translateStageLabel(canonicalStageLabel),
                    stageMeta: getStageMeta(canonicalStageLabel),
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
          const dateFromMs = dateFrom ? new Date(dateFrom).setHours(0, 0, 0, 0) : null
            const dateToMs   = dateTo   ? new Date(dateTo).setHours(23, 59, 59, 999) : null

            const rangeFilteredActivities = activeActivities.filter((item) => {
                const ref = item.createdMs ?? item.dueMs ?? null
                if (!ref) return true
                if (dateFromMs && ref < dateFromMs) return false
                if (dateToMs   && ref > dateToMs)   return false
                return true
            })

        const riskBreakdown = buildRiskBreakdown(rangeFilteredActivities)

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
    }, [dateFrom, dateTo, error, i18n.resolvedLanguage, lastLoadedAt, loadAnalytics, loading, nowMs, refreshing, snapshot])
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
