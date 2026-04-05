import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    Activity,
    ArrowRight,
    BriefcaseBusiness,
    CheckCircle2,
    CircleDot,
    FolderKanban,
    Gauge,
    Layers3,
    ListTodo,
    RefreshCw,
    ShieldAlert,
    Target,
    TimerReset,
    Users,
    Workflow,
} from 'lucide-react'
import {
    DashboardAnalyticsContext,
    fallbackWorkspaceAnalytics,
    formatCompactNumber,
    formatDateTime,
    formatRelativeTime,
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
    const navigate = useNavigate()
    const analyticsFromContext = useContext(DashboardAnalyticsContext)
    const analytics = analyticsFromContext ?? fallbackWorkspaceAnalytics
    const user = analyticsFromContext?.user || null

    const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Usuario'
    const firstName = displayName.trim().split(' ')[0] || 'Usuario'
    const hour = new Date().getHours()
    const greeting = hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite'

    const { counts, flow, coverage, projects, pulse, risks } = analytics.summary
    const { currentItems, ownerLoad, portfolioRows, priorityItems, qualitativeInsights, recentItems, semResponsavel } = analytics.cards
    const pulseToneClass = getPulseToneClass(pulse.level)

    const quickActions = [
        { label: 'Abrir projetos', icon: FolderKanban, onClick: () => navigate('/projetos') },
        { label: 'Abrir tarefas', icon: CheckCircle2, onClick: () => navigate('/tarefas') },
        { label: 'Abrir reports', icon: Activity, onClick: () => navigate('/reports') },
        { label: 'Cadastros', icon: Users, onClick: () => navigate('/cad-participantes') },
    ]

    if (analytics.loading && counts.workspaceTotal === 0) {
        return (
            <div className="mx-auto flex w-full max-w-none items-center justify-center p-4 sm:p-6">
                <div className="flex w-full items-center justify-center gap-3 border border-zen-border bg-zen-surface px-6 py-20">
                    <RefreshCw className="h-5 w-5 animate-spin text-zen-blue" />
                    <span className="font-mono text-xs text-zen-text-sec tracking-widest uppercase">
                        Carregando leitura analitica do workspace...
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
                                    Ultima leitura:{' '}
                                    {analytics.lastLoadedAt ? formatDateTime(analytics.lastLoadedAt) : '—'}
                                </span>
                                <span className="border border-zen-border bg-zen-bg/70 px-3 py-1 font-mono text-[10px] text-zen-text-sec">
                                    Atualização:{' '}
                                    {analytics.lastLoadedAt ? formatRelativeTime(analytics.lastLoadedAt) : '—'}
                                </span>
                                <span className="border border-zen-border bg-zen-bg/70 px-3 py-1 font-mono text-[10px] text-zen-text-sec">
                                    Alertas: {risks.alertCount}
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
                                    Atualizar
                                </button>
                            </div>
                        </div>

                        {/* right: trio of stat panels */}
                        <div className="grid w-full gap-px sm:grid-cols-3 xl:w-[400px] xl:max-w-[400px] bg-zen-border">
                            <div className="bg-zen-bg/90 p-5">
                                <div className="font-mono text-[9px] font-semibold uppercase tracking-[0.22em] text-zen-text-tri">
                                    Ativos agora
                                </div>
                                <div className="mt-3 font-display text-4xl font-bold text-white leading-none">
                                    {counts.activeTotal}
                                </div>
                                <div className="mt-2 text-[11px] text-zen-text-sec leading-4">
                                    {flow.inFlow} em fluxo · {flow.backlog} em backlog
                                </div>
                            </div>
                            <div className="bg-zen-bg/90 p-5">
                                <div className="font-mono text-[9px] font-semibold uppercase tracking-[0.22em] text-zen-text-tri">
                                    Risco GUT
                                </div>
                                <div className="mt-3 font-display text-4xl font-bold text-white leading-none">
                                    {risks.averageDynamicGut}
                                </div>
                                <div className="mt-2 text-[11px] text-zen-text-sec leading-4">
                                    {risks.criticalCount} críticos · {risks.highCount} altos
                                </div>
                            </div>
                            <div className="bg-zen-bg/90 p-5">
                                <div className="font-mono text-[9px] font-semibold uppercase tracking-[0.22em] text-zen-text-tri">
                                    Portfolio
                                </div>
                                <div className="mt-3 font-display text-4xl font-bold text-white leading-none">
                                    {projects.epics}/{projects.features}/{projects.userStories}
                                </div>
                                <div className="mt-2 text-[11px] text-zen-text-sec leading-4">
                                    Epics, features e stories
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
                    label="Volume ativo"
                    value={formatCompactNumber(counts.activeTotal)}
                    support={`${counts.workspaceTotal} cards válidos no workspace e ${counts.doneTotal} já encerrados.`}
                    tone="from-sky-500/50 to-transparent"
                />
                <KpiCard
                    icon={Target}
                    label="Saída do fluxo"
                    value={`${flow.doneRate}%`}
                    support={`${flow.done} cards em Done. Backlog hoje: ${flow.backlogRate}% da carteira ativa.`}
                    tone="from-emerald-500/50 to-transparent"
                />
                <KpiCard
                    icon={ShieldAlert}
                    label="Risco GUT médio"
                    value={risks.averageDynamicGut}
                    support={`${risks.overdueCount} atrasados, ${risks.dueSoonCount} vencendo em 72h e ${risks.criticalCount} críticos.`}
                    tone="from-rose-500/50 to-transparent"
                />
                <KpiCard
                    icon={TimerReset}
                    label="Planejamento"
                    value={`${coverage.planning}%`}
                    support={`Ownership ${coverage.ownership}% e cards de projeto ligados a story em ${coverage.storyLink}%.`}
                    tone="from-amber-500/50 to-transparent"
                />
                <KpiCard
                    icon={Layers3}
                    label="Portfolio"
                    value={`${projects.epics}/${projects.features}/${projects.userStories}`}
                    support={`Hierarquia consolidada em ${projects.hierarchyDepth}% da profundidade esperada.`}
                    tone="from-cyan-500/50 to-transparent"
                />
                <KpiCard
                    icon={Workflow}
                    label="Progresso do projeto"
                    value={`${projects.avgProgress}%`}
                    support={`${counts.projectActive} card(s) de projeto ativos e ${projects.unlinkedProjectItems} sem vínculo de story.`}
                    tone="from-indigo-500/50 to-transparent"
                />
            </div>

            {/* ── ANALYTICS ROW ─────────────────────────────────────────────── */}
            <div className="grid gap-px xl:grid-cols-[1.5fr_1fr] bg-zen-border">
                <SectionCard
                    title="Análise quantitativa"
                    subtitle="Distribuição do fluxo e matriz GUT a partir das tabelas do banco."
                >
                    <div className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
                        {/* stage breakdown */}
                        <div>
                            <div className="mb-4 font-mono text-[9px] font-semibold uppercase tracking-[0.22em] text-zen-text-tri">
                                Macroetapas
                            </div>
                            <div className="space-y-4">
                                {flow.stageBreakdown.map((stage) => (
                                    <div key={stage.label}>
                                        <div className="flex items-center justify-between gap-3 text-xs">
                                            <span className="text-white">{stage.label}</span>
                                            <span className="font-mono text-zen-text-sec">
                                                {stage.count} cards · {stage.share}%
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
                            <div className="mb-4 font-mono text-[9px] font-semibold uppercase tracking-[0.22em] text-zen-text-tri">
                                Faixas GUT
                            </div>
                            <div className="space-y-2">
                                {risks.riskBreakdown.map((bucket) => (
                                    <div
                                        key={bucket.id}
                                        className="border border-zen-border bg-zen-bg/60 p-3"
                                    >
                                        <div className="flex items-center justify-between gap-3">
                                            <span
                                                className={`inline-flex border px-2 py-1 font-mono text-[10px] font-semibold ${bucket.tone}`}
                                            >
                                                {bucket.label}
                                            </span>
                                            <span className="text-sm font-bold text-white">
                                                {bucket.count}
                                            </span>
                                        </div>
                                        <div className="mt-1.5 font-mono text-[10px] text-zen-text-sec">
                                            {bucket.share}% da carteira ativa
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </SectionCard>

                <SectionCard
                    title="Análise qualitativa"
                    subtitle="Leitura interpretativa do banco, cruzando volume, risco, cobertura e hierarquia."
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
                    title="Projetos e tarefas em operação"
                    subtitle="Hierarquia epic › feature › story com contagem de cards ativos, risco e progresso."
                    action={
                        <button
                            type="button"
                            onClick={() => navigate('/projetos')}
                            className="inline-flex items-center gap-2 border border-zen-border px-3 py-2 text-xs text-zen-text-sec hover:bg-zen-surface-hl hover:text-white transition-colors"
                        >
                            Abrir projetos
                            <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                    }
                >
                    {portfolioRows.length === 0 ? (
                        <EmptyState
                            title="Portfólio ainda não estruturado"
                            description="Crie epics, features e user stories para conectar a operação diária ao módulo de projetos."
                            ctaLabel="Ir para projetos"
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
                                                Epic
                                            </div>
                                            <div className="mt-2 text-sm font-semibold text-white">
                                                {row.title}
                                            </div>
                                            <div className="mt-2 flex flex-wrap gap-1.5">
                                                {[
                                                    `${row.featureCount} features`,
                                                    `${row.storyCount} stories`,
                                                    `${row.itemCount} cards`,
                                                    `${row.activeCount} ativos`,
                                                    `${row.progress}% progresso`,
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
                                                Risco interno
                                            </div>
                                            <div className="mt-1 font-display text-3xl font-bold text-white leading-none">
                                                {row.criticalCount}
                                            </div>
                                            <div className="mt-1 font-mono text-[10px] text-zen-text-sec">
                                                cards críticos
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-4 flex flex-wrap gap-1.5">
                                        {row.stories.length === 0 ? (
                                            <span className="text-xs text-zen-text-sec">
                                                Sem stories vinculadas a este epic.
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
                    title="Operação corrente"
                    subtitle="Cards em andamento, ordenados por pressão de prazo, etapa e GUT."
                >
                    {currentItems.length === 0 ? (
                        <EmptyState
                            title="Sem itens correntes"
                            description="Não há cards ativos para monitorar neste momento."
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
                                                {item.nometarefa || 'Sem nome'}
                                            </div>
                                            <div className="mt-1 text-xs text-zen-text-sec">
                                                Responsável:{' '}
                                                {item.participant?.nomeparticipante || 'Não definido'}
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
                                            { label: 'Prazo', value: formatDateTime(item.data_fim) },
                                            {
                                                label: 'Status temporal',
                                                value: item.isOverdue
                                                    ? 'Atrasado'
                                                    : item.isDueSoon
                                                    ? 'Vence em 72h'
                                                    : 'Sem pressão imediata',
                                            },
                                            { label: 'Progresso', value: `${item.progress}%` },
                                            {
                                                label: 'Story',
                                                value: item.story?.nome_userstory || 'Não vinculada',
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
                    title="Radar GUT"
                    subtitle="Prioridades operacionais calculadas pela combinação de GUT e janela temporal."
                >
                    {priorityItems.length === 0 ? (
                        <EmptyState
                            title="Sem prioridades ativas"
                            description="Não há cards suficientes para montar o ranking GUT."
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
                                                Prioridade #{index + 1}
                                            </div>
                                            <div className="mt-1 text-sm font-semibold text-white">
                                                {item.nometarefa || 'Sem nome'}
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
                                        Prazo {formatRelativeTime(item.data_fim)} · etapa {item.stageLabel}
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </SectionCard>

                <SectionCard
                    title="Capacidade e ownership"
                    subtitle="Quem está operando a carga atual e onde faltam responsáveis."
                >
                    <div className="space-y-2">
                        {ownerLoad.length === 0 ? (
                            <EmptyState
                                title="Sem distribuição por participante"
                                description="Ainda não há carga ativa atribuída para participantes."
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
                                                {owner.activeCount} card(s) ativos · progresso médio{' '}
                                                {owner.progress}%
                                            </div>
                                        </div>
                                        <div className="text-right font-mono text-[10px] text-zen-text-sec">
                                            <div>{owner.highRiskCount} alto(s)</div>
                                            <div>{owner.overdueCount} atrasado(s)</div>
                                        </div>
                                    </div>
                                </article>
                            ))
                        )}
                        <div className="border border-dashed border-zen-border bg-zen-bg/50 px-4 py-3 font-mono text-[10px] text-zen-text-sec">
                            Cards ativos sem responsável:{' '}
                            <strong className="text-white">{semResponsavel}</strong>
                        </div>
                    </div>
                </SectionCard>

                <SectionCard
                    title="Últimos movimentos"
                    subtitle="Últimos registros lidos nas tabelas operacionais e de projetos."
                >
                    {recentItems.length === 0 ? (
                        <EmptyState
                            title="Sem histórico recente"
                            description="Assim que houver novos registros eles aparecerão aqui."
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
                                                {item.nometarefa || 'Sem nome'}
                                            </div>
                                            <div className="mt-1 font-mono text-[10px] text-zen-text-sec">
                                                Criado em {formatDateTime(item.created_at)} · etapa{' '}
                                                {item.stageLabel}
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
