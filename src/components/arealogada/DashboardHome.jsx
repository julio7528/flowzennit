import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Activity, ArrowRight, BriefcaseBusiness, CalendarDays, CheckCircle2, CircleDot, FolderKanban, Gauge, Layers3, ListTodo, RefreshCw, ShieldAlert, Target, TimerReset, Users, Workflow, } from 'lucide-react'
import {
  buildRiskBreakdown,
  DashboardAnalyticsContext,
  fallbackWorkspaceAnalytics,
  formatCompactNumber,
  formatDateTime,
  formatRelativeTime,
  getDynamicGutScore,
  getInsightToneClass,
  getPulseToneClass,
} from './dashboard-analytics.js'


const getTypeToneClass = (alocadoKey) => {
    if (alocadoKey === 'taskproj') return 'border-emerald-400/30 bg-emerald-500/10 text-emerald-200'
    if (alocadoKey === 'bugproj') return 'border-rose-400/30 bg-rose-500/10 text-rose-200'
    if (alocadoKey === 'agendar') return 'border-sky-400/30 bg-sky-500/10 text-sky-200'
    if (alocadoKey === 'delegar') return 'border-amber-400/30 bg-amber-500/10 text-amber-200'
    return 'border-zen-border bg-zen-bg/80 text-zen-text-sec'
}


const KpiCard = ({ icon, label, value, support, tone }) => {
    const Icon = icon
    return (
        <article className="relative overflow-hidden border border-zen-border bg-zen-surface">
            {/* top accent line */}
            <div className={`h-[2px] w-full bg-gradient-to-r ${tone}`} />
            {/* corner decoration top-right */}
            <span className="pointer-events-none absolute right-0 top-[2px] h-6 w-6 border-r border-t border-zen-border/50" />
            <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-zen-text-tri">
                            {label}
                        </div>
                        <div className="mt-3 font-display text-4xl font-bold text-white leading-none">
                            {value}
                        </div>
                    </div>
                    <div className="border border-zen-border bg-zen-bg/70 p-2.5">
                        <Icon className="h-4 w-4 text-zen-text-sec" />
                    </div>
                </div>
                <p className="mt-4 text-xs leading-5 text-zen-text-sec">{support}</p>
            </div>
        </article>
    )
}


const SectionCard = ({ title, subtitle, action, children }) => (
    <section className="border border-zen-border bg-zen-surface overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-zen-border px-5 py-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
                <h2 className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-white">
                    {title}
                </h2>
                {subtitle && (
                    <p className="mt-1 text-xs leading-5 text-zen-text-sec">{subtitle}</p>
                )}
            </div>
            {action}
        </div>
        <div className="p-5">{children}</div>
    </section>
)


const EmptyState = ({ title, description, ctaLabel, onClick }) => (
    <div className="border border-dashed border-zen-border bg-zen-bg/50 px-6 py-10 text-center">
        <div className="mx-auto flex h-10 w-10 items-center justify-center border border-zen-border bg-zen-surface">
            <CircleDot className="h-4 w-4 text-zen-text-tri" />
        </div>
        <div className="mt-4 text-sm font-semibold text-white">{title}</div>
        <p className="mt-1 text-xs text-zen-text-sec">{description}</p>
        {ctaLabel && onClick && (
            <button
                type="button"
                onClick={onClick}
                className="mt-5 inline-flex items-center gap-2 bg-zen-blue px-4 py-2 text-sm font-semibold text-white hover:bg-blue-600 transition-colors"
            >
                {ctaLabel}
                <ArrowRight className="h-4 w-4" />
            </button>
        )}
    </div>
)


const DashboardHome = () => {
    const { t } = useTranslation()
    const today = new Date()
    const sevenDaysAgo = new Date(today)
    sevenDaysAgo.setDate(today.getDate() - 7)

    const toDateString = (d) => d.toISOString().slice(0, 10) // "YYYY-MM-DD"

    const [gutDateFrom, setGutDateFrom] = useState(toDateString(sevenDaysAgo))
    const [gutDateTo,   setGutDateTo]   = useState(toDateString(today))

    const handleDateFromChange = (value) => {
        setGutDateFrom(value)
        analyticsFromContext?.refresh(value, gutDateTo)
    }

    const handleDateToChange = (value) => {
        setGutDateTo(value)
        analyticsFromContext?.refresh(gutDateFrom, value)
    }

    // Date input handlers - use the handleDateFromChange and handleDateToChange functions
    const onGutDateFromChange = (e) => handleDateFromChange(e.target.value)
    const onGutDateToChange = (e) => handleDateToChange(e.target.value)

    const navigate = useNavigate()
    const analyticsFromContext = useContext(DashboardAnalyticsContext)
    const analytics = analyticsFromContext ?? fallbackWorkspaceAnalytics
    const user = analyticsFromContext?.user || null
    const { pulse, counts, flow, coverage, projects, risks } = analytics.summary
    const { currentItems, ownerLoad, portfolioRows, priorityItems, qualitativeInsights, recentItems, semResponsavel } = analytics.cards

    const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || t('common.user')
    const firstName = displayName.trim().split(' ')[0] || t('common.user')
    const hour = new Date().getHours()
    const greeting = hour < 12
        ? t('dashboardHome.greetings.morning')
        : hour < 18
        ? t('dashboardHome.greetings.afternoon')
        : t('dashboardHome.greetings.evening')

  // Filtro de datas → recalcula riskBreakdown local para o painel "Faixas GUT"
    const nowRef = new Date().getTime()
    const dfMs = gutDateFrom ? new Date(`${gutDateFrom}T00:00:00`).getTime() : null
    const dtMs = gutDateTo ? new Date(`${gutDateTo}T23:59:59`).getTime() : null

  const rangeActive = (analytics.snapshot?.atividades ?? [])
        .map((a) => ({ ...a, dynamicGut: getDynamicGutScore(a, nowRef) }))
        .filter((a) => {
        // exclui itens finalizados
        const isDoneItem = (analytics.cards.currentItems ?? []).find((c) => c.id === a.id)?.isDone
            ?? (analytics.cards.priorityItems ?? []).find((c) => c.id === a.id)?.isDone
            ?? false
        if (isDoneItem) return false
        // Filtra por data_inicio e data_fim
        const inicioMs = a.data_inicio ? new Date(a.data_inicio).getTime() : null
        const fimMs = a.data_fim ? new Date(a.data_fim).getTime() : null
        if (dfMs && inicioMs && inicioMs < dfMs) return false
        if (dtMs && fimMs && fimMs > dtMs) return false
        return true
        })

    const filteredRiskBreakdown = buildRiskBreakdown(rangeActive)
        // Recalcula riskBreakdown local aplicando o filtro de datas sobre as atividades ativas

    // Importar utilitários necessários do arquivo de analytics
    // getDynamicGutScore, getRiskBucket e buildRiskBreakdown precisam ser reexportados (ver passo 6)
    const pulseToneClass = getPulseToneClass(pulse.level)

    const quickActions = [
        { label: t('dashboardHome.quickActions.projects'), icon: FolderKanban, onClick: () => navigate('/projetos') },
        { label: t('dashboardHome.quickActions.tasks'), icon: CheckCircle2, onClick: () => navigate('/tarefas') },
        { label: t('dashboardHome.quickActions.reports'), icon: Activity, onClick: () => navigate('/reports') },
        { label: t('dashboardHome.quickActions.records'), icon: Users, onClick: () => navigate('/cad-participantes') },
    ]

    if (analytics.loading && counts.workspaceTotal === 0) {
        return (
            <div className="mx-auto flex w-full max-w-none items-center justify-center p-4 sm:p-6">
                <div className="flex w-full items-center justify-center gap-3 border border-zen-border bg-zen-surface px-6 py-20">
                    <RefreshCw className="h-5 w-5 animate-spin text-zen-blue" />
                    <span className="font-mono text-xs text-zen-text-sec tracking-widest uppercase">
                        {t('dashboardHome.loading')}
                    </span>
                </div>
            </div>
        )
    }

    return (
        <div className="flex w-full max-w-none flex-col gap-5 p-4 sm:p-6 animate-in fade-in duration-300">

            {/* ── HERO ─────────────────────────────────────────────────────── */}
            <section className="relative overflow-hidden border border-zen-border bg-zen-surface">
                {/* subtle radial gradients */}
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.14),transparent_48%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.10),transparent_40%)]" />
                {/* top accent */}
                <div className="h-[2px] w-full bg-gradient-to-r from-sky-500/60 via-emerald-500/40 to-transparent" />

                <div className="px-6 py-7 sm:px-8">
                    <div className="flex flex-col gap-8 xl:flex-row xl:items-start xl:justify-between">

                        {/* left: identity */}
                        <div className="max-w-3xl">
                            <div className={`inline-flex items-center gap-2 border px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.22em] ${pulseToneClass}`}>
                                <Gauge className="h-3 w-3" />
                                {pulse.label}
                            </div>

                            <h1 className="mt-5 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
                                {greeting}, {firstName}
                            </h1>
                            <p className="mt-3 max-w-2xl text-sm leading-6 text-zen-text-sec">
                                {analytics.summary.headline}
                            </p>

                            {/* meta badges */}
                            <div className="mt-4 flex flex-wrap gap-2">
                                <span className="border border-zen-border bg-zen-bg/70 px-3 py-1 font-mono text-[10px] text-zen-text-sec">
                                    {t('dashboardHome.meta.lastRead')}{' '}
                                    {analytics.lastLoadedAt ? formatDateTime(analytics.lastLoadedAt) : '—'}
                                </span>
                                <span className="border border-zen-border bg-zen-bg/70 px-3 py-1 font-mono text-[10px] text-zen-text-sec">
                                    {t('dashboardHome.meta.updatedAt')}{' '}
                                    {analytics.lastLoadedAt ? formatRelativeTime(analytics.lastLoadedAt) : '—'}
                                </span>
                                <span className="border border-zen-border bg-zen-bg/70 px-3 py-1 font-mono text-[10px] text-zen-text-sec">
                                    {t('dashboardHome.meta.alerts', { count: risks.alertCount })}
                                </span>
                            </div>

                            {/* actions */}
                            <div className="mt-5 flex flex-wrap gap-2">
                                {quickActions.map((action) => (
                                    <button
                                        key={action.label}
                                        type="button"
                                        onClick={action.onClick}
                                        className="inline-flex items-center gap-2 border border-zen-border bg-zen-bg/70 px-3 py-2 text-xs text-white transition-colors hover:bg-zen-surface-hl hover:border-white/20"
                                    >
                                        <action.icon className="h-3.5 w-3.5 text-zen-text-sec" />
                                        {action.label}
                                    </button>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => analytics.refresh()}
                                    className="inline-flex items-center gap-2 bg-zen-blue px-4 py-2 text-xs font-semibold text-white hover:bg-blue-600 transition-colors"
                                >
                                    <RefreshCw className={`h-3.5 w-3.5 ${analytics.refreshing ? 'animate-spin' : ''}`} />
                                    {t('common.refresh')}
                                </button>
                            </div>
                        </div>

                        {/* right: trio of stat panels */}
                        <div className="grid w-full gap-px sm:grid-cols-3 xl:w-[400px] xl:max-w-[400px] bg-zen-border">
                            <div className="bg-zen-bg/90 p-5">
                                <div className="font-mono text-[9px] font-semibold uppercase tracking-[0.22em] text-zen-text-tri">
                                    {t('dashboardHome.heroStats.activeNow')}
                                </div>
                                <div className="mt-3 font-display text-4xl font-bold text-white leading-none">
                                    {counts.activeTotal}
                                </div>
                                <div className="mt-2 text-[11px] text-zen-text-sec leading-4">
                                    {t('dashboardHome.heroStats.activeNowSupport', {
                                        inFlow: flow.inFlow,
                                        backlog: flow.backlog,
                                    })}
                                </div>
                            </div>
                            <div className="bg-zen-bg/90 p-5">
                                <div className="font-mono text-[9px] font-semibold uppercase tracking-[0.22em] text-zen-text-tri">
                                    {t('dashboardHome.heroStats.gutRisk')}
                                </div>
                                <div className="mt-3 font-display text-4xl font-bold text-white leading-none">
                                    {risks.averageDynamicGut}
                                </div>
                                <div className="mt-2 text-[11px] text-zen-text-sec leading-4">
                                    {t('dashboardHome.heroStats.gutRiskSupport', {
                                        criticalCount: risks.criticalCount,
                                        highCount: risks.highCount,
                                    })}
                                </div>
                            </div>
                            <div className="bg-zen-bg/90 p-5">
                                <div className="font-mono text-[9px] font-semibold uppercase tracking-[0.22em] text-zen-text-tri">
                                    {t('dashboardHome.heroStats.portfolio')}
                                </div>
                                <div className="mt-3 font-display text-4xl font-bold text-white leading-none">
                                    {projects.epics}/{projects.features}/{projects.userStories}
                                </div>
                                <div className="mt-2 text-[11px] text-zen-text-sec leading-4">
                                    {t('dashboardHome.heroStats.portfolioSupport')}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── ERROR BANNER ──────────────────────────────────────────────── */}
            {analytics.error && (
                <div className="border border-amber-400/30 bg-amber-500/10 px-4 py-3 text-xs text-amber-100">
                    {analytics.error}
                </div>
            )}

            {/* ── KPI GRID ──────────────────────────────────────────────────── */}
            <div className="grid gap-px md:grid-cols-2 xl:grid-cols-3 bg-zen-border">
                <KpiCard
                    icon={Activity}
                    label={t('dashboardHome.kpis.activeVolume.label')}
                    value={formatCompactNumber(counts.activeTotal)}
                    support={t('dashboardHome.kpis.activeVolume.support', {
                        workspaceTotal: counts.workspaceTotal,
                        doneTotal: counts.doneTotal,
                    })}
                    tone="from-sky-500/50 to-transparent"
                />
                <KpiCard
                    icon={Target}
                    label={t('dashboardHome.kpis.flowOutput.label')}
                    value={`${flow.doneRate}%`}
                    support={t('dashboardHome.kpis.flowOutput.support', {
                        done: flow.done,
                        backlogRate: flow.backlogRate,
                    })}
                    tone="from-emerald-500/50 to-transparent"
                />
                <KpiCard
                    icon={ShieldAlert}
                    label={t('dashboardHome.kpis.averageRisk.label')}
                    value={risks.averageDynamicGut}
                    support={t('dashboardHome.kpis.averageRisk.support', {
                        overdueCount: risks.overdueCount,
                        dueSoonCount: risks.dueSoonCount,
                        criticalCount: risks.criticalCount,
                    })}
                    tone="from-rose-500/50 to-transparent"
                />
                <KpiCard
                    icon={TimerReset}
                    label={t('dashboardHome.kpis.planning.label')}
                    value={`${coverage.planning}%`}
                    support={t('dashboardHome.kpis.planning.support', {
                        ownership: coverage.ownership,
                        storyLink: coverage.storyLink,
                    })}
                    tone="from-amber-500/50 to-transparent"
                />
                <KpiCard
                    icon={Layers3}
                    label={t('dashboardHome.kpis.portfolio.label')}
                    value={`${projects.epics}/${projects.features}/${projects.userStories}`}
                    support={t('dashboardHome.kpis.portfolio.support', {
                        hierarchyDepth: projects.hierarchyDepth,
                    })}
                    tone="from-cyan-500/50 to-transparent"
                />
                <KpiCard
                    icon={Workflow}
                    label={t('dashboardHome.kpis.projectProgress.label')}
                    value={`${projects.avgProgress}%`}
                    support={t('dashboardHome.kpis.projectProgress.support', {
                        projectActive: counts.projectActive,
                        unlinkedProjectItems: projects.unlinkedProjectItems,
                    })}
                    tone="from-indigo-500/50 to-transparent"
                />
            </div>

            {/* ── ANALYTICS ROW ─────────────────────────────────────────────── */}
            <div className="grid gap-px xl:grid-cols-[1.5fr_1fr] bg-zen-border">
                <SectionCard
                    title={t('dashboardHome.sections.quantitative.title')}
                    subtitle={t('dashboardHome.sections.quantitative.subtitle')}
                    action={
                        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                            <CalendarDays className="h-3 w-3 text-zen-text-sec shrink-0" />
                            <label className="font-mono text-[9px] uppercase tracking-[0.18em] text-zen-text-sec">
                                {t('dashboardHome.sections.quantitative.from')}
                            </label>
                            <input
                                type="date"
                                value={gutDateFrom}
                                max={gutDateTo}
                                onChange={onGutDateFromChange}
                                className="border border-zen-border bg-zen-bg/70 px-2 py-1 font-mono text-[10px] text-white focus:border-zen-blue focus:outline-none"
                            />
                            <label className="font-mono text-[9px] uppercase tracking-[0.18em] text-zen-text-sec">
                                {t('dashboardHome.sections.quantitative.to')}
                            </label>
                            <input
                                type="date"
                                value={gutDateTo}
                                min={gutDateFrom}
                                onChange={onGutDateToChange}
                                className="border border-zen-border bg-zen-bg/70 px-2 py-1 font-mono text-[10px] text-white focus:border-zen-blue focus:outline-none"
                            />
                        </div>
                    }
                >
                    <div className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
                        {/* stage breakdown */}
                        <div>
                            <div className="mb-4 font-mono text-[9px] font-semibold uppercase tracking-[0.22em] text-zen-text-tri">
                                {t('dashboardHome.sections.quantitative.stages')}
                            </div>
                            <div className="space-y-4">
                                {flow.stageBreakdown.map((stage) => (
                                    <div key={stage.label}>
                                        <div className="flex items-center justify-between gap-3 text-xs">
                                            <span className="text-white">{stage.label}</span>
                                            <span className="font-mono text-zen-text-sec">
                                                {t('dashboardHome.sections.quantitative.cardsShare', {
                                                    count: stage.count,
                                                    share: stage.share,
                                                })}
                                            </span>
                                        </div>
                                        <div className="mt-2 h-1 bg-zen-bg/70 overflow-hidden">
                                            <div
                                                className={`h-full ${stage.bar}`}
                                                style={{ width: `${stage.share}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* risk buckets */}
                        <div>
                            <div className="mb-3 font-mono text-[9px] font-semibold uppercase tracking-[0.22em] text-zen-text-tri">
                                {t('dashboardHome.sections.quantitative.gutBands')}
                            </div>
                            <div className="space-y-2">
                                {filteredRiskBreakdown.map((bucket) => (
                                    <div key={bucket.id} className="border border-zen-border bg-zen-bg/60 p-3">
                                        <div className="flex items-center justify-between gap-3">
                                            <span className={`inline-flex border px-2 py-1 font-mono text-[10px] font-semibold ${bucket.tone}`}>
                                                {bucket.label}
                                            </span>
                                            <span className="text-sm font-bold text-white">{bucket.count}</span>
                                        </div>
                                        <div className="mt-1.5 font-mono text-[10px] text-zen-text-sec">
                                            {t('dashboardHome.sections.quantitative.activePortfolioShare', {
                                                share: bucket.share,
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </SectionCard>

                <SectionCard
                    title={t('dashboardHome.sections.qualitative.title')}
                    subtitle={t('dashboardHome.sections.qualitative.subtitle')}
                >
                    <div className="space-y-2">
                        {qualitativeInsights.map((insight) => (
                            <article
                                key={insight.title}
                                className={`border p-4 ${getInsightToneClass(insight.tone)}`}
                            >
                                <div className="text-xs font-semibold text-white">{insight.title}</div>
                                <p className="mt-1.5 text-xs leading-5 text-current/90">{insight.text}</p>
                            </article>
                        ))}
                    </div>
                </SectionCard>
            </div>

            {/* ── PORTFOLIO + CURRENT OPS ───────────────────────────────────── */}
            <div className="grid gap-px xl:grid-cols-[1.2fr_0.8fr] bg-zen-border">
                <SectionCard
                    title={t('dashboardHome.sections.projects.title')}
                    subtitle={t('dashboardHome.sections.projects.subtitle')}
                    action={
                        <button
                            type="button"
                            onClick={() => navigate('/projetos')}
                            className="inline-flex items-center gap-2 border border-zen-border px-3 py-2 text-xs text-zen-text-sec hover:bg-zen-surface-hl hover:text-white transition-colors"
                        >
                            {t('dashboardHome.sections.projects.action')}
                            <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                    }
                >
                    {portfolioRows.length === 0 ? (
                        <EmptyState
                            title={t('dashboardHome.sections.projects.emptyTitle')}
                            description={t('dashboardHome.sections.projects.emptyDescription')}
                            ctaLabel={t('dashboardHome.sections.projects.emptyAction')}
                            onClick={() => navigate('/projetos')}
                        />
                    ) : (
                        <div className="space-y-2">
                            {portfolioRows.map((row) => (
                                <article
                                    key={row.id}
                                    className="border border-zen-border bg-zen-bg/50 p-4"
                                >
                                    <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                                        <div>
                                            <div className="inline-flex items-center gap-2 border border-cyan-400/30 bg-cyan-500/10 px-2 py-1 font-mono text-[10px] font-semibold text-cyan-200">
                                                <BriefcaseBusiness className="h-3 w-3" />
                                                {t('dashboardHome.sections.projects.epicLabel')}
                                            </div>
                                            <div className="mt-2 text-sm font-semibold text-white">
                                                {row.title}
                                            </div>
                                            <div className="mt-2 flex flex-wrap gap-1.5">
                                                {[
                                                    t('dashboardHome.sections.projects.tags.features', { count: row.featureCount }),
                                                    t('dashboardHome.sections.projects.tags.stories', { count: row.storyCount }),
                                                    t('dashboardHome.sections.projects.tags.cards', { count: row.itemCount }),
                                                    t('dashboardHome.sections.projects.tags.active', { count: row.activeCount }),
                                                    t('dashboardHome.sections.projects.tags.progress', { count: row.progress }),
                                                ].map((tag) => (
                                                    <span
                                                        key={tag}
                                                        className="border border-zen-border bg-zen-surface px-2 py-0.5 font-mono text-[10px] text-zen-text-sec"
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <div className="font-mono text-[9px] uppercase tracking-[0.22em] text-zen-text-tri">
                                                {t('dashboardHome.sections.projects.internalRisk')}
                                            </div>
                                            <div className="mt-1 font-display text-3xl font-bold text-white leading-none">
                                                {row.criticalCount}
                                            </div>
                                            <div className="mt-1 font-mono text-[10px] text-zen-text-sec">
                                                {t('dashboardHome.sections.projects.criticalCards')}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-4 flex flex-wrap gap-1.5">
                                        {row.stories.length === 0 ? (
                                            <span className="text-xs text-zen-text-sec">
                                                {t('dashboardHome.sections.projects.noStories')}
                                            </span>
                                        ) : (
                                            row.stories.map((story) => (
                                                <span
                                                    key={story.id}
                                                    className="inline-flex items-center gap-1.5 border border-amber-400/20 bg-amber-500/10 px-2.5 py-1 font-mono text-[10px] text-amber-100"
                                                >
                                                    <ListTodo className="h-3 w-3" />
                                                    {story.title}
                                                    <strong className="text-white">{story.count}</strong>
                                                </span>
                                            ))
                                        )}
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </SectionCard>

                <SectionCard
                    title={t('dashboardHome.sections.current.title')}
                    subtitle={t('dashboardHome.sections.current.subtitle')}
                >
                    {currentItems.length === 0 ? (
                        <EmptyState
                            title={t('dashboardHome.sections.current.emptyTitle')}
                            description={t('dashboardHome.sections.current.emptyDescription')}
                        />
                    ) : (
                        <div className="space-y-2">
                            {currentItems.map((item) => (
                                <article
                                    key={item.id}
                                    className="border border-zen-border bg-zen-bg/50 p-4"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0">
                                            <div className="flex flex-wrap items-center gap-1.5">
                                                <span
                                                    className={`inline-flex border px-2 py-1 font-mono text-[10px] font-semibold ${getTypeToneClass(item.alocadoKey)}`}
                                                >
                                                    {item.alocadoLabel}
                                                </span>
                                                <span
                                                    className={`inline-flex border px-2 py-1 font-mono text-[10px] font-semibold ${item.stageMeta.tone}`}
                                                >
                                                    {item.stageLabel}
                                                </span>
                                            </div>
                                            <div className="mt-2 text-sm font-semibold text-white">
                                                {item.nometarefa || t('dashboardHome.common.unnamed')}
                                            </div>
                                            <div className="mt-1 text-xs text-zen-text-sec">
                                                {t('dashboardHome.sections.current.ownerLabel')}{' '}
                                                {item.participant?.nomeparticipante || t('dashboardHome.common.notDefined')}
                                            </div>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <div className="font-mono text-[9px] uppercase tracking-widest text-zen-text-tri">
                                                GUT
                                            </div>
                                            <div className="mt-1 font-display text-2xl font-bold text-white leading-none">
                                                {item.dynamicGut}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-4 grid grid-cols-2 gap-px sm:grid-cols-4 bg-zen-border text-xs">
                                        {[
                                            { label: t('dashboardHome.sections.current.cells.deadline'), value: formatDateTime(item.data_fim) },
                                            {
                                                label: t('dashboardHome.sections.current.cells.temporalStatus'),
                                                value: item.isOverdue
                                                    ? t('dashboardHome.sections.current.status.overdue')
                                                    : item.isDueSoon
                                                    ? t('dashboardHome.sections.current.status.dueSoon')
                                                    : t('dashboardHome.sections.current.status.noImmediatePressure'),
                                            },
                                            { label: t('dashboardHome.sections.current.cells.progress'), value: `${item.progress}%` },
                                            {
                                                label: t('dashboardHome.sections.current.cells.story'),
                                                value: item.story?.nome_userstory || t('dashboardHome.common.unlinked'),
                                            },
                                        ].map((cell) => (
                                            <div
                                                key={cell.label}
                                                className="border border-zen-border bg-zen-surface px-3 py-2"
                                            >
                                                <div className="font-mono text-[9px] uppercase tracking-widest text-zen-text-tri">
                                                    {cell.label}
                                                </div>
                                                <div className="mt-1 text-white">{cell.value}</div>
                                            </div>
                                        ))}
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </SectionCard>
            </div>

            {/* ── RADAR + CAPACITY + RECENT ─────────────────────────────────── */}
            <div className="grid gap-px xl:grid-cols-[1fr_1fr_1fr] bg-zen-border">
                <SectionCard
                    title={t('dashboardHome.sections.radar.title')}
                    subtitle={t('dashboardHome.sections.radar.subtitle')}
                >
                    {priorityItems.length === 0 ? (
                        <EmptyState
                            title={t('dashboardHome.sections.radar.emptyTitle')}
                            description={t('dashboardHome.sections.radar.emptyDescription')}
                        />
                    ) : (
                        <div className="space-y-2">
                            {priorityItems.map((item, index) => (
                                <article
                                    key={item.id}
                                    className="border border-zen-border bg-zen-bg/50 p-4"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0">
                                            <div className="font-mono text-[9px] uppercase tracking-[0.22em] text-zen-text-tri">
                                                {t('dashboardHome.sections.radar.priority', { index: index + 1 })}
                                            </div>
                                            <div className="mt-1 text-sm font-semibold text-white">
                                                {item.nometarefa || t('dashboardHome.common.unnamed')}
                                            </div>
                                            <div className="mt-2 flex flex-wrap gap-1.5">
                                                <span
                                                    className={`inline-flex border px-2 py-1 font-mono text-[10px] font-semibold ${getTypeToneClass(item.alocadoKey)}`}
                                                >
                                                    {item.alocadoLabel}
                                                </span>
                                                <span
                                                    className={`inline-flex border px-2 py-1 font-mono text-[10px] font-semibold ${item.riskBucket.tone}`}
                                                >
                                                    {item.riskBucket.label}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <div className="font-mono text-[9px] uppercase tracking-widest text-zen-text-tri">
                                                GUT
                                            </div>
                                            <div className="mt-1 font-display text-2xl font-bold text-white leading-none">
                                                {item.dynamicGut}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-3 font-mono text-[10px] text-zen-text-sec">
                                        {t('dashboardHome.sections.radar.deadlineStage', {
                                            deadline: formatRelativeTime(item.data_fim),
                                            stage: item.stageLabel,
                                        })}
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </SectionCard>

                <SectionCard
                    title={t('dashboardHome.sections.capacity.title')}
                    subtitle={t('dashboardHome.sections.capacity.subtitle')}
                >
                    <div className="space-y-2">
                        {ownerLoad.length === 0 ? (
                            <EmptyState
                                title={t('dashboardHome.sections.capacity.emptyTitle')}
                                description={t('dashboardHome.sections.capacity.emptyDescription')}
                            />
                        ) : (
                            ownerLoad.map((owner) => (
                                <article
                                    key={owner.id}
                                    className="border border-zen-border bg-zen-bg/50 p-4"
                                >
                                    <div className="flex items-center justify-between gap-3">
                                        <div>
                                            <div className="text-sm font-semibold text-white">
                                                {owner.nome}
                                            </div>
                                            <div className="mt-1 font-mono text-[10px] text-zen-text-sec">
                                                {t('dashboardHome.sections.capacity.ownerSummary', {
                                                    activeCount: owner.activeCount,
                                                    progress: owner.progress,
                                                })}
                                            </div>
                                        </div>
                                        <div className="text-right font-mono text-[10px] text-zen-text-sec">
                                            <div>{t('dashboardHome.sections.capacity.highRisk', { count: owner.highRiskCount })}</div>
                                            <div>{t('dashboardHome.sections.capacity.overdue', { count: owner.overdueCount })}</div>
                                        </div>
                                    </div>
                                </article>
                            ))
                        )}
                        <div className="border border-dashed border-zen-border bg-zen-bg/50 px-4 py-3 font-mono text-[10px] text-zen-text-sec">
                            {t('dashboardHome.sections.capacity.withoutOwner')}{' '}
                            <strong className="text-white">{semResponsavel}</strong>
                        </div>
                    </div>
                </SectionCard>

                <SectionCard
                    title={t('dashboardHome.sections.recent.title')}
                    subtitle={t('dashboardHome.sections.recent.subtitle')}
                >
                    {recentItems.length === 0 ? (
                        <EmptyState
                            title={t('dashboardHome.sections.recent.emptyTitle')}
                            description={t('dashboardHome.sections.recent.emptyDescription')}
                        />
                    ) : (
                        <div className="space-y-2">
                            {recentItems.map((item) => (
                                <article
                                    key={item.id}
                                    className="border border-zen-border bg-zen-bg/50 p-4"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0">
                                            <div className="text-sm font-semibold text-white">
                                                {item.nometarefa || t('dashboardHome.common.unnamed')}
                                            </div>
                                            <div className="mt-1 font-mono text-[10px] text-zen-text-sec">
                                                {t('dashboardHome.sections.recent.createdStage', {
                                                    createdAt: formatDateTime(item.created_at),
                                                    stage: item.stageLabel,
                                                })}
                                            </div>
                                        </div>
                                        <span
                                            className={`inline-flex shrink-0 border px-2 py-1 font-mono text-[10px] font-semibold ${getTypeToneClass(item.alocadoKey)}`}
                                        >
                                            {item.alocadoLabel}
                                        </span>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </SectionCard>
            </div>
        </div>
    )
}


export default DashboardHome
