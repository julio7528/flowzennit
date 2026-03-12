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
        <article className="overflow-hidden rounded-xl border border-zen-border bg-zen-surface">
            <div className={`h-0.5 w-full bg-gradient-to-r ${tone}`} />
            <div className="p-4 sm:p-5">
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zen-text-tri">{label}</div>
                        <div className="mt-2 text-3xl font-display font-bold text-white">{value}</div>
                    </div>
                    <div className="rounded-lg border border-zen-border bg-zen-bg/70 p-2">
                        <Icon className="h-4 w-4 text-zen-text-sec" />
                    </div>
                </div>
                <p className="mt-3 text-sm text-zen-text-sec">{support}</p>
            </div>
        </article>
    )
}

const SectionCard = ({ title, subtitle, action, children }) => (
    <section className="rounded-xl border border-zen-border bg-zen-surface overflow-hidden">
        <div className="flex items-start justify-between gap-4 border-b border-zen-border px-5 py-4">
            <div>
                <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-white">{title}</h2>
                {subtitle && <p className="mt-1 text-sm text-zen-text-sec">{subtitle}</p>}
            </div>
            {action}
        </div>
        <div className="p-5">{children}</div>
    </section>
)

const EmptyState = ({ title, description, ctaLabel, onClick }) => (
    <div className="rounded-xl border border-dashed border-zen-border bg-zen-bg/50 px-6 py-10 text-center">
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg border border-zen-border bg-zen-surface">
            <CircleDot className="h-4 w-4 text-zen-text-tri" />
        </div>
        <div className="mt-4 text-sm font-semibold text-white">{title}</div>
        <p className="mt-1 text-sm text-zen-text-sec">{description}</p>
        {ctaLabel && onClick && (
            <button
                type="button"
                onClick={onClick}
                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-zen-blue px-4 py-2 text-sm font-semibold text-white hover:bg-blue-600"
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
            <div className="mx-auto flex w-full max-w-7xl items-center justify-center p-4 sm:p-6">
                <div className="flex w-full items-center justify-center gap-3 rounded-xl border border-zen-border bg-zen-surface px-6 py-20">
                    <RefreshCw className="h-5 w-5 animate-spin text-zen-blue" />
                    <span className="text-sm text-zen-text-sec">Carregando leitura analitica do workspace...</span>
                </div>
            </div>
        )
    }

    return (
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 sm:p-6 animate-in fade-in duration-300">
            <section className="overflow-hidden rounded-xl border border-zen-border bg-zen-surface">
                <div className="bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.18),transparent_48%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.14),transparent_40%)] px-5 py-6 sm:px-6">
                    <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
                        <div className="max-w-3xl">
                            <div className={`inline-flex items-center gap-2 rounded-md border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${pulseToneClass}`}>
                                <Gauge className="h-3.5 w-3.5" />
                                {pulse.label}
                            </div>
                            <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
                                {greeting}, {firstName}
                            </h1>
                            <p className="mt-3 max-w-2xl text-sm leading-6 text-zen-text-sec">{analytics.summary.headline}</p>
                            <div className="mt-4 flex flex-wrap gap-2">
                                <span className="rounded-md border border-zen-border bg-zen-bg/70 px-3 py-1 text-xs text-zen-text-sec">
                                    Ultima leitura: {analytics.lastLoadedAt ? formatDateTime(analytics.lastLoadedAt) : '-'}
                                </span>
                                <span className="rounded-md border border-zen-border bg-zen-bg/70 px-3 py-1 text-xs text-zen-text-sec">
                                    Atualizacao relativa: {analytics.lastLoadedAt ? formatRelativeTime(analytics.lastLoadedAt) : '-'}
                                </span>
                                <span className="rounded-md border border-zen-border bg-zen-bg/70 px-3 py-1 text-xs text-zen-text-sec">
                                    Alertas: {risks.alertCount}
                                </span>
                            </div>
                            <div className="mt-5 flex flex-wrap gap-2">
                                {quickActions.map((action) => (
                                    <button
                                        key={action.label}
                                        type="button"
                                        onClick={action.onClick}
                                        className="inline-flex items-center gap-2 rounded-lg border border-zen-border bg-zen-bg/70 px-3 py-2 text-sm text-white transition-colors hover:bg-zen-surface-hl"
                                    >
                                        <action.icon className="h-4 w-4 text-zen-text-sec" />
                                        {action.label}
                                    </button>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => analytics.refresh()}
                                    className="inline-flex items-center gap-2 rounded-lg bg-zen-blue px-4 py-2 text-sm font-semibold text-white hover:bg-blue-600"
                                >
                                    <RefreshCw className={`h-4 w-4 ${analytics.refreshing ? 'animate-spin' : ''}`} />
                                    Atualizar
                                </button>
                            </div>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-3 xl:w-[420px]">
                            <div className="rounded-lg border border-zen-border bg-zen-bg/70 p-4">
                                <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zen-text-tri">Ativos agora</div>
                                <div className="mt-2 text-3xl font-display font-bold text-white">{counts.activeTotal}</div>
                                <div className="mt-1 text-xs text-zen-text-sec">{flow.inFlow} em fluxo e {flow.backlog} em backlog.</div>
                            </div>
                            <div className="rounded-lg border border-zen-border bg-zen-bg/70 p-4">
                                <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zen-text-tri">Risco GUT</div>
                                <div className="mt-2 text-3xl font-display font-bold text-white">{risks.averageDynamicGut}</div>
                                <div className="mt-1 text-xs text-zen-text-sec">{risks.criticalCount} criticos e {risks.highCount} altos.</div>
                            </div>
                            <div className="rounded-lg border border-zen-border bg-zen-bg/70 p-4">
                                <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zen-text-tri">Portfolio</div>
                                <div className="mt-2 text-3xl font-display font-bold text-white">
                                    {projects.epics}/{projects.features}/{projects.userStories}
                                </div>
                                <div className="mt-1 text-xs text-zen-text-sec">Epics, features e stories cadastradas.</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {analytics.error && (
                <div className="rounded-lg border border-amber-400/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
                    {analytics.error}
                </div>
            )}

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                <KpiCard
                    icon={Activity}
                    label="Volume ativo"
                    value={formatCompactNumber(counts.activeTotal)}
                    support={`${counts.workspaceTotal} cards validos no workspace e ${counts.doneTotal} ja encerrados.`}
                    tone="from-sky-500/40 to-transparent"
                />
                <KpiCard
                    icon={Target}
                    label="Saida do fluxo"
                    value={`${flow.doneRate}%`}
                    support={`${flow.done} cards em Done. Backlog hoje: ${flow.backlogRate}% da carteira ativa.`}
                    tone="from-emerald-500/40 to-transparent"
                />
                <KpiCard
                    icon={ShieldAlert}
                    label="Risco GUT medio"
                    value={risks.averageDynamicGut}
                    support={`${risks.overdueCount} atrasados, ${risks.dueSoonCount} vencendo em 72h e ${risks.criticalCount} criticos.`}
                    tone="from-rose-500/40 to-transparent"
                />
                <KpiCard
                    icon={TimerReset}
                    label="Planejamento"
                    value={`${coverage.planning}%`}
                    support={`Ownership ${coverage.ownership}% e cards de projeto ligados a story em ${coverage.storyLink}%.`}
                    tone="from-amber-500/40 to-transparent"
                />
                <KpiCard
                    icon={Layers3}
                    label="Portfolio"
                    value={`${projects.epics}/${projects.features}/${projects.userStories}`}
                    support={`Hierarquia consolidada em ${projects.hierarchyDepth}% da profundidade esperada.`}
                    tone="from-cyan-500/40 to-transparent"
                />
                <KpiCard
                    icon={Workflow}
                    label="Progresso do projeto"
                    value={`${projects.avgProgress}%`}
                    support={`${counts.projectActive} card(s) de projeto ativos e ${projects.unlinkedProjectItems} sem vinculo de story.`}
                    tone="from-indigo-500/40 to-transparent"
                />
            </div>

            <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
                <SectionCard
                    title="Analise quantitativa"
                    subtitle="Distribuicao do fluxo e matriz GUT a partir das tabelas do banco."
                >
                    <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                        <div>
                            <div className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-zen-text-tri">Macroetapas</div>
                            <div className="space-y-3">
                                {flow.stageBreakdown.map((stage) => (
                                    <div key={stage.label}>
                                        <div className="flex items-center justify-between gap-3 text-sm">
                                            <span className="text-white">{stage.label}</span>
                                            <span className="text-zen-text-sec">{stage.count} card(s) / {stage.share}%</span>
                                        </div>
                                        <div className="mt-2 h-2 rounded-md bg-zen-bg/70 overflow-hidden">
                                            <div className={`h-full ${stage.bar}`} style={{ width: `${stage.share}%` }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <div className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-zen-text-tri">Faixas GUT</div>
                            <div className="space-y-3">
                                {risks.riskBreakdown.map((bucket) => (
                                    <div key={bucket.id} className="rounded-lg border border-zen-border bg-zen-bg/60 p-3">
                                        <div className="flex items-center justify-between gap-3">
                                            <span className={`inline-flex rounded-md border px-2 py-1 text-[11px] font-semibold ${bucket.tone}`}>
                                                {bucket.label}
                                            </span>
                                            <span className="text-sm text-white">{bucket.count}</span>
                                        </div>
                                        <div className="mt-2 text-xs text-zen-text-sec">{bucket.share}% da carteira ativa.</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </SectionCard>

                <SectionCard
                    title="Analise qualitativa"
                    subtitle="Leitura interpretativa do banco, cruzando volume, risco, cobertura e hierarquia."
                >
                    <div className="space-y-3">
                        {qualitativeInsights.map((insight) => (
                            <article key={insight.title} className={`rounded-lg border p-4 ${getInsightToneClass(insight.tone)}`}>
                                <div className="text-sm font-semibold text-white">{insight.title}</div>
                                <p className="mt-1 text-sm leading-6 text-current/90">{insight.text}</p>
                            </article>
                        ))}
                    </div>
                </SectionCard>
            </div>

            <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                <SectionCard
                    title="Projetos e tarefas em operacao"
                    subtitle="Hierarquia epic > feature > story com contagem de cards ativos, risco e progresso."
                    action={
                        <button
                            type="button"
                            onClick={() => navigate('/projetos')}
                            className="inline-flex items-center gap-2 rounded-lg border border-zen-border px-3 py-2 text-sm text-zen-text-sec hover:bg-zen-surface-hl hover:text-white"
                        >
                            Abrir projetos
                            <ArrowRight className="h-4 w-4" />
                        </button>
                    }
                >
                    {portfolioRows.length === 0 ? (
                        <EmptyState
                            title="Portifolio ainda nao estruturado"
                            description="Crie epics, features e user stories para conectar a operacao diaria ao modulo de projetos."
                            ctaLabel="Ir para projetos"
                            onClick={() => navigate('/projetos')}
                        />
                    ) : (
                        <div className="space-y-3">
                            {portfolioRows.map((row) => (
                                <article key={row.id} className="rounded-lg border border-zen-border bg-zen-bg/50 p-4">
                                    <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                                        <div>
                                            <div className="inline-flex items-center gap-2 rounded-md border border-cyan-400/30 bg-cyan-500/10 px-2 py-1 text-[11px] font-semibold text-cyan-200">
                                                <BriefcaseBusiness className="h-3.5 w-3.5" />
                                                Epic
                                            </div>
                                            <div className="mt-2 text-lg font-semibold text-white">{row.title}</div>
                                            <div className="mt-2 flex flex-wrap gap-2 text-xs text-zen-text-sec">
                                                <span className="rounded-md border border-zen-border bg-zen-surface px-2.5 py-1">{row.featureCount} features</span>
                                                <span className="rounded-md border border-zen-border bg-zen-surface px-2.5 py-1">{row.storyCount} stories</span>
                                                <span className="rounded-md border border-zen-border bg-zen-surface px-2.5 py-1">{row.itemCount} cards</span>
                                                <span className="rounded-md border border-zen-border bg-zen-surface px-2.5 py-1">{row.activeCount} ativos</span>
                                                <span className="rounded-md border border-zen-border bg-zen-surface px-2.5 py-1">{row.progress}% progresso</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-[10px] uppercase tracking-[0.18em] text-zen-text-tri">Risco interno</div>
                                            <div className="mt-1 text-2xl font-display font-bold text-white">{row.criticalCount}</div>
                                            <div className="text-xs text-zen-text-sec">cards criticos</div>
                                        </div>
                                    </div>
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {row.stories.length === 0 ? (
                                            <span className="text-sm text-zen-text-sec">Sem stories vinculadas a este epic.</span>
                                        ) : (
                                            row.stories.map((story) => (
                                                <span key={story.id} className="inline-flex items-center gap-2 rounded-md border border-amber-400/20 bg-amber-500/10 px-3 py-1 text-xs text-amber-100">
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
                    title="Operacao corrente"
                    subtitle="Cards em andamento, ordenados por pressao de prazo, etapa e GUT."
                >
                    {currentItems.length === 0 ? (
                        <EmptyState title="Sem itens correntes" description="Nao ha cards ativos para monitorar neste momento." />
                    ) : (
                        <div className="space-y-3">
                            {currentItems.map((item) => (
                                <article key={item.id} className="rounded-lg border border-zen-border bg-zen-bg/50 p-4">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className={`inline-flex rounded-md border px-2 py-1 text-[11px] font-semibold ${getTypeToneClass(item.alocadoKey)}`}>
                                                    {item.alocadoLabel}
                                                </span>
                                                <span className={`inline-flex rounded-md border px-2 py-1 text-[11px] font-semibold ${item.stageMeta.tone}`}>
                                                    {item.stageLabel}
                                                </span>
                                            </div>
                                            <div className="mt-2 text-sm font-semibold text-white">{item.nometarefa || 'Sem nome'}</div>
                                            <div className="mt-1 text-xs text-zen-text-sec">
                                                Responsavel: {item.participant?.nomeparticipante || 'Nao definido'}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xs text-zen-text-tri">GUT</div>
                                            <div className="text-xl font-display font-bold text-white">{item.dynamicGut}</div>
                                        </div>
                                    </div>
                                    <div className="mt-4 grid grid-cols-2 gap-3 text-xs sm:grid-cols-4">
                                        <div className="rounded-lg border border-zen-border bg-zen-surface px-3 py-2">
                                            <div className="text-zen-text-tri">Prazo</div>
                                            <div className="mt-1 text-white">{formatDateTime(item.data_fim)}</div>
                                        </div>
                                        <div className="rounded-lg border border-zen-border bg-zen-surface px-3 py-2">
                                            <div className="text-zen-text-tri">Status temporal</div>
                                            <div className="mt-1 text-white">
                                                {item.isOverdue ? 'Atrasado' : item.isDueSoon ? 'Vence em 72h' : 'Sem pressao imediata'}
                                            </div>
                                        </div>
                                        <div className="rounded-lg border border-zen-border bg-zen-surface px-3 py-2">
                                            <div className="text-zen-text-tri">Progresso</div>
                                            <div className="mt-1 text-white">{item.progress}%</div>
                                        </div>
                                        <div className="rounded-lg border border-zen-border bg-zen-surface px-3 py-2">
                                            <div className="text-zen-text-tri">Story</div>
                                            <div className="mt-1 text-white">{item.story?.nome_userstory || 'Nao vinculada'}</div>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </SectionCard>
            </div>

            <div className="grid gap-6 xl:grid-cols-[1fr_1fr_1fr]">
                <SectionCard
                    title="Radar GUT"
                    subtitle="Prioridades operacionais calculadas pela combinacao de GUT e janela temporal."
                >
                    {priorityItems.length === 0 ? (
                        <EmptyState title="Sem prioridades ativas" description="Nao ha cards suficientes para montar o ranking GUT." />
                    ) : (
                        <div className="space-y-3">
                            {priorityItems.map((item, index) => (
                                <article key={item.id} className="rounded-lg border border-zen-border bg-zen-bg/50 p-4">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0">
                                            <div className="text-xs text-zen-text-tri">Prioridade #{index + 1}</div>
                                            <div className="mt-1 text-sm font-semibold text-white">{item.nometarefa || 'Sem nome'}</div>
                                            <div className="mt-2 flex flex-wrap gap-2">
                                                <span className={`inline-flex rounded-md border px-2 py-1 text-[11px] font-semibold ${getTypeToneClass(item.alocadoKey)}`}>
                                                    {item.alocadoLabel}
                                                </span>
                                                <span className={`inline-flex rounded-md border px-2 py-1 text-[11px] font-semibold ${item.riskBucket.tone}`}>
                                                    {item.riskBucket.label}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xs text-zen-text-tri">GUT</div>
                                            <div className="text-2xl font-display font-bold text-white">{item.dynamicGut}</div>
                                        </div>
                                    </div>
                                    <div className="mt-3 text-xs text-zen-text-sec">
                                        Prazo {formatRelativeTime(item.data_fim)} / etapa {item.stageLabel}.
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </SectionCard>

                <SectionCard
                    title="Capacidade e ownership"
                    subtitle="Quem esta operando a carga atual e onde faltam responsaveis."
                >
                    <div className="space-y-3">
                        {ownerLoad.length === 0 ? (
                            <EmptyState title="Sem distribuicao por participante" description="Ainda nao ha carga ativa atribuida para participantes." />
                        ) : (
                            ownerLoad.map((owner) => (
                                <article key={owner.id} className="rounded-lg border border-zen-border bg-zen-bg/50 p-4">
                                    <div className="flex items-center justify-between gap-3">
                                        <div>
                                            <div className="text-sm font-semibold text-white">{owner.nome}</div>
                                            <div className="mt-1 text-xs text-zen-text-sec">{owner.activeCount} card(s) ativos / progresso medio {owner.progress}%</div>
                                        </div>
                                        <div className="text-right text-xs text-zen-text-sec">
                                            <div>{owner.highRiskCount} alto(s)</div>
                                            <div>{owner.overdueCount} atrasado(s)</div>
                                        </div>
                                    </div>
                                </article>
                            ))
                        )}
                        <div className="rounded-lg border border-dashed border-zen-border bg-zen-bg/50 px-4 py-3 text-sm text-zen-text-sec">
                            Cards ativos sem responsavel: <strong className="text-white">{semResponsavel}</strong>
                        </div>
                    </div>
                </SectionCard>

                <SectionCard
                    title="Ultimos movimentos"
                    subtitle="Ultimos registros lidos nas tabelas operacionais e de projetos."
                >
                    {recentItems.length === 0 ? (
                        <EmptyState title="Sem historico recente" description="Assim que houver novos registros eles aparecerao aqui." />
                    ) : (
                        <div className="space-y-3">
                            {recentItems.map((item) => (
                                <article key={item.id} className="rounded-lg border border-zen-border bg-zen-bg/50 p-4">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0">
                                            <div className="text-sm font-semibold text-white">{item.nometarefa || 'Sem nome'}</div>
                                            <div className="mt-1 text-xs text-zen-text-sec">
                                                Criado em {formatDateTime(item.created_at)} / etapa {item.stageLabel}
                                            </div>
                                        </div>
                                        <span className={`inline-flex rounded-md border px-2 py-1 text-[11px] font-semibold ${getTypeToneClass(item.alocadoKey)}`}>
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
