import { useCallback, useEffect, useMemo, useState } from 'react'
import {
    AlertCircle,
    ArrowRight,
    BadgePlus,
    Bug,
    CalendarClock,
    CheckSquare,
    ChevronDown,
    ChevronRight,
    Clock3,
    FolderKanban,
    Layers3,
    ListTodo,
    Pencil,
    RefreshCw,
    Settings2,
    Target,
    Trash2,
    Workflow,
    X,
} from 'lucide-react'
import { supabase } from '../../lib/supabase.js'
import KanbanProj from './kanbanproj.jsx'
import ProjetoCadastroModal from './ProjetoCadastroModal.jsx'
import { getStageLabelByState, getStateBadgeClass, isDoneState, normalizeKey, stripHtml } from './kanban-model.js'

// ─── Constantes ──────────────────────────────────────────────────────────────
const DAY_IN_MS = 1000 * 60 * 60 * 24
const PROJECT_ALOCADOS = ['taskproj', 'bugproj']

const ACOES_CADASTRO = [
    { id: 'task',       titulo: 'Task',        icone: CheckSquare, borda: 'border-emerald-500/40', bg: 'bg-emerald-500/10', destaque: 'text-emerald-300' },
    { id: 'bug',        titulo: 'Bug',         icone: Bug,         borda: 'border-rose-500/40',    bg: 'bg-rose-500/10',    destaque: 'text-rose-300'    },
    { id: 'user-story', titulo: 'User Story',  icone: ListTodo,    borda: 'border-amber-500/40',   bg: 'bg-amber-500/10',   destaque: 'text-amber-300'   },
    { id: 'feature',    titulo: 'Feature',     icone: Workflow,    borda: 'border-cyan-500/40',    bg: 'bg-cyan-500/10',    destaque: 'text-cyan-300'    },
    { id: 'epic',       titulo: 'Epic',        icone: Layers3,     borda: 'border-blue-500/40',    bg: 'bg-blue-500/10',    destaque: 'text-blue-300'    },
]

const HIERARQUIA = ['Projeto', 'Epic', 'Feature', 'User Story', 'Task / Bug']

const REPORT_TABS = [
    { id: 'backlog', rotulo: 'Backlog', icone: ListTodo,      apoio: 'Hierarquia do produto'  },
    { id: 'gantt',   rotulo: 'Gantt',   icone: CalendarClock, apoio: 'Planejamento de sprint' },
    { id: 'kanban',  rotulo: 'Kanban',  icone: FolderKanban,  apoio: 'Fluxo operacional'      },
]

const TYPE_META = {
    epic:     { rotulo: 'Epic',       classe: 'border-blue-500/30 bg-blue-500/10 text-blue-200',    icone: Layers3    },
    feature:  { rotulo: 'Feature',    classe: 'border-cyan-500/30 bg-cyan-500/10 text-cyan-200',    icone: Workflow   },
    story:    { rotulo: 'User Story', classe: 'border-amber-500/30 bg-amber-500/10 text-amber-200', icone: ListTodo   },
    taskproj: { rotulo: 'Task',       classe: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200', icone: CheckSquare },
    bugproj:  { rotulo: 'Bug',        classe: 'border-rose-500/30 bg-rose-500/10 text-rose-200',    icone: Bug        },
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
const formatDateTime = (value) => {
    if (!value) return '-'
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return '-'
    return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(date)
}

const formatDateShort = (value) => {
    if (!value) return '-'
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return '-'
    return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit' }).format(date)
}

const getProgressTone = (percent) => {
    if (percent >= 80) return 'bg-emerald-500/15 text-emerald-200 border border-emerald-500/30'
    if (percent >= 40) return 'bg-sky-500/15 text-sky-200 border border-sky-500/30'
    if (percent > 0)   return 'bg-amber-500/15 text-amber-200 border border-amber-500/30'
    return 'bg-zen-bg text-zen-text-sec border border-zen-border'
}

const buildTaskSeed = (atividade, participantName) => ({ ...atividade, participanteNome: participantName || '' })

// ─── Micro-componentes ────────────────────────────────────────────────────────
const TypePill = ({ type }) => {
    const meta = TYPE_META[type] || TYPE_META.story
    const Icone = meta.icone
    return (
        <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-semibold border ${meta.classe}`}>
            <Icone className="h-3 w-3" />
            {meta.rotulo}
        </span>
    )
}

// MetricCard com ícone e barra de acento no topo
const MetricCard = ({ label, value, apoio, tone = 'from-sky-500/30 to-transparent', icone: Icone }) => (
    <article className="overflow-hidden rounded-xl border border-zen-border bg-zen-surface">
        <div className={`h-0.5 w-full bg-gradient-to-r ${tone}`} />
        <div className="flex items-start justify-between gap-3 p-4">
            <div className="space-y-1 min-w-0">
                <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zen-text-tri">{label}</div>
                <div className="font-display text-2xl font-bold text-white leading-none">{value}</div>
                <p className="text-xs text-zen-text-sec truncate">{apoio}</p>
            </div>
            {Icone && (
                <div className="shrink-0 rounded-lg bg-zen-bg/80 p-2 border border-zen-border">
                    <Icone className="h-4 w-4 text-zen-text-tri" />
                </div>
            )}
        </div>
    </article>
)

// EmptyPanel mais clean
const EmptyPanel = ({ title, description, actionLabel, onAction }) => (
    <div className="rounded-xl border border-dashed border-zen-border bg-zen-bg/40 px-6 py-12 text-center">
        <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full border border-zen-border bg-zen-surface">
            <BadgePlus className="h-5 w-5 text-zen-text-tri" />
        </div>
        <h3 className="text-sm font-semibold text-white">{title}</h3>
        <p className="mx-auto mt-1.5 max-w-sm text-xs leading-relaxed text-zen-text-sec">{description}</p>
        {actionLabel && onAction && (
            <button
                type="button"
                onClick={onAction}
                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-zen-blue px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-600"
            >
                <BadgePlus className="h-4 w-4" />
                {actionLabel}
            </button>
        )}
    </div>
)

// ─── HierarchyOverviewPanel ───────────────────────────────────────────────────
const HierarchyOverviewPanel = ({ epics, featuresByEpic, storiesByFeature, activitiesByStory, onCreateEpic }) => {
    if (epics.length === 0) {
        return (
            <EmptyPanel
                title="Nenhum Epic encontrado"
                description="Crie o primeiro Epic para estruturar o backlog na cadeia Epic → Feature → User Story → Task/Bug."
                actionLabel="Cadastrar Epic"
                onAction={onCreateEpic}
            />
        )
    }

    return (
        <div className="grid gap-3">
            {epics.map((epic) => {
                const featureList = featuresByEpic.get(epic.id) || []
                const storiesCount = featureList.reduce((acc, f) => acc + (storiesByFeature.get(f.id) || []).length, 0)
                const itensCount  = featureList.reduce(
                    (acc, f) => acc + (storiesByFeature.get(f.id) || []).reduce(
                        (sa, s) => sa + (activitiesByStory.get(s.id) || []).length, 0
                    ), 0
                )

                return (
                    <article key={epic.id} className="overflow-hidden rounded-xl border border-zen-border bg-zen-surface">
                        {/* Epic header */}
                        <div className="flex items-center justify-between gap-4 border-b border-zen-border/60 bg-blue-500/5 px-4 py-3">
                            <div className="flex items-center gap-2.5 min-w-0">
                                <TypePill type="epic" />
                                <h3 className="truncate text-sm font-semibold text-white">{epic.nome_epic}</h3>
                            </div>
                            <div className="flex shrink-0 items-center gap-2 text-xs text-zen-text-tri">
                                <span>{featureList.length} feat.</span>
                                <span>·</span>
                                <span>{storiesCount} stories</span>
                                <span>·</span>
                                <span>{itensCount} itens</span>
                            </div>
                        </div>

                        {/* Features */}
                        <div className="divide-y divide-zen-border/40">
                            {featureList.length === 0 ? (
                                <div className="px-4 py-3 text-xs text-zen-text-tri">Sem features vinculadas.</div>
                            ) : (
                                featureList.map((feature) => {
                                    const storyList = storiesByFeature.get(feature.id) || []
                                    return (
                                        <div key={feature.id} className="px-4 py-3">
                                            <div className="flex items-center gap-2 mb-2">
                                                <TypePill type="feature" />
                                                <span className="text-xs font-medium text-white">{feature.nome_feature}</span>
                                            </div>
                                            {storyList.length === 0 ? (
                                                <span className="ml-1 text-[11px] text-zen-text-tri">Sem User Stories.</span>
                                            ) : (
                                                <div className="flex flex-wrap gap-1.5 ml-1">
                                                    {storyList.map((story) => (
                                                        <span key={story.id} className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-0.5 text-[11px] text-amber-100">
                                                            <ListTodo className="h-3 w-3" />
                                                            {story.nome_userstory}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )
                                })
                            )}
                        </div>
                    </article>
                )
            })}
        </div>
    )
}

// ─── OverviewRail (sidebar) ───────────────────────────────────────────────────
const OverviewRail = ({ upcomingItems, metrics }) => {
    return (
        <div className="flex flex-col gap-4">
            {/* Saúde da sprint */}
            <article className="rounded-xl border border-zen-border bg-zen-surface p-4">
                <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-white">
                    <Target className="h-4 w-4 text-emerald-300" />
                    Saúde da sprint
                </div>
                <div className="grid grid-cols-2 gap-2">
                    {[
                        { label: 'Em fluxo', value: metrics.flowing, color: 'text-sky-300' },
                        { label: 'Done',     value: metrics.done,    color: 'text-emerald-300' },
                        { label: 'Backlog',  value: metrics.backlog, color: 'text-zen-text-sec' },
                        { label: 'Bugs',     value: metrics.bugs,    color: 'text-rose-300' },
                    ].map(({ label, value, color }) => (
                        <div key={label} className="rounded-lg border border-zen-border bg-zen-bg/60 p-3">
                            <div className="text-[10px] uppercase tracking-[0.18em] text-zen-text-tri">{label}</div>
                            <div className={`mt-1.5 text-xl font-bold ${color}`}>{value}</div>
                        </div>
                    ))}
                </div>
            </article>

            {/* Próximas entregas */}
            <article className="rounded-xl border border-zen-border bg-zen-surface p-4">
                <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-white">
                    <Clock3 className="h-4 w-4 text-amber-300" />
                    Próximas entregas
                </div>
                <div className="space-y-2">
                    {upcomingItems.length === 0 ? (
                        <p className="rounded-lg border border-dashed border-zen-border bg-zen-bg/40 px-3 py-4 text-center text-xs text-zen-text-tri">
                            Nenhuma entrega com prazo definido.
                        </p>
                    ) : (
                        upcomingItems.map((item) => (
                            <div key={item.id} className="rounded-lg border border-zen-border bg-zen-bg/50 p-3">
                                <div className="flex items-center justify-between gap-2 mb-1.5">
                                    <TypePill type={item.alocado} />
                                    <span className="text-[11px] text-zen-text-tri">{formatDateTime(item.data_fim)}</span>
                                </div>
                                <div className="text-xs font-semibold text-white line-clamp-1">{item.nometarefa}</div>
                                <div className="mt-1.5 flex items-center gap-2">
                                    <span className="rounded-full border border-zen-border bg-zen-surface px-2 py-0.5 text-[10px] text-zen-text-sec">{item.stageLabel}</span>
                                    {Number(item.percentual_progresso) > 0 && (
                                        <span className={`rounded-full px-2 py-0.5 text-[10px] ${getProgressTone(Number(item.percentual_progresso))}`}>
                                            {item.percentual_progresso}%
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </article>
        </div>
    )
}

// ─── GanttPanel ───────────────────────────────────────────────────────────────
const GanttPanel = ({ items, onOpenCard }) => {
    const [todayReferenceMs] = useState(() => Date.now())

    if (items.length === 0) {
        return (
            <EmptyPanel
                title="Nenhum item para o Gantt"
                description="O Gantt mostra tasks e bugs fora de Done. Adicione datas de início e fim aos cards para visualizar o planejamento."
            />
        )
    }

    const minStart = Math.min(...items.map((i) => i.startMs))
    const maxEnd   = Math.max(...items.map((i) => i.endMs))
    const timelineStart = new Date(minStart)
    timelineStart.setHours(0, 0, 0, 0)
    const timelineStartMs = timelineStart.getTime()
    const timelineEnd = new Date(maxEnd)
    timelineEnd.setHours(0, 0, 0, 0)
    const totalDays = Math.max(1, Math.floor((timelineEnd.getTime() - timelineStartMs) / DAY_IN_MS) + 1)
    const timelineSpanMs = totalDays * DAY_IN_MS
    const itemColumnWidth = 296
    const timelineMinWidth = Math.max(totalDays * 52, 840)
    const gridTemplateColumns = `${itemColumnWidth}px minmax(${timelineMinWidth}px, 1fr)`
    const contentMinWidth = itemColumnWidth + timelineMinWidth
    const days = Array.from({ length: totalDays }, (_, i) => new Date(timelineStartMs + i * DAY_IN_MS))
    const sprintHeaders = Array.from({ length: Math.ceil(totalDays / 7) }, (_, i) => ({
        label: `Sprint ${String(i + 1).padStart(2, '0')}`,
        span: Math.min(7, totalDays - i * 7),
    }))
    const todayOffset = Math.floor((todayReferenceMs - timelineStartMs) / DAY_IN_MS)
    const todayLeft = todayOffset >= 0 && todayOffset < totalDays ? (todayOffset / totalDays) * 100 : null

    const clampProgress = (percent) => Math.max(0, Math.min(100, Number(percent) || 0))
    const getDayBoundaryMs = (value) => {
        const dayBoundary = new Date(value)
        dayBoundary.setHours(24, 0, 0, 0)
        return dayBoundary.getTime()
    }
    const getBarMetrics = (item) => {
        const safeStartMs = Math.max(item.startMs, timelineStartMs)
        const naturalEndMs = Math.max(item.endMs, safeStartMs)
        const renderEndMs = Math.min(
            Math.max(naturalEndMs, safeStartMs + DAY_IN_MS * 0.15),
            getDayBoundaryMs(naturalEndMs)
        )
        const startRatio = (safeStartMs - timelineStartMs) / timelineSpanMs
        const endRatio = Math.min(1, Math.max(startRatio, (renderEndMs - timelineStartMs) / timelineSpanMs))
        const leftPct = startRatio * 100
        const widthPct = Math.max((endRatio - startRatio) * 100, 0.35)
        const progress = clampProgress(item.percentual_progresso)

        return {
            item,
            isBug: normalizeKey(item.alocado) === 'bugproj',
            progress,
            leftPct,
            widthPct,
        }
    }

    const rowMetrics = items.map((item) => getBarMetrics(item))

    return (
        <article className="overflow-hidden rounded-xl border border-zen-border bg-zen-surface">
            <div className="flex items-center justify-between gap-4 border-b border-zen-border px-4 py-3 sm:px-5">
                <div>
                    <h3 className="text-sm font-semibold text-white">Planejamento Gantt · Scrum</h3>
                    <p className="mt-0.5 text-xs text-zen-text-sec">Clique na barra para editar o item.</p>
                </div>
                <div className="inline-flex items-center gap-1.5 rounded-full border border-zen-border bg-zen-bg/70 px-3 py-1 text-xs text-zen-text-sec">
                    <CalendarClock className="h-3.5 w-3.5 text-zen-blue" />
                    {items.length} itens
                </div>
            </div>

            <div
                className="zen-scroll overflow-x-auto pb-2"
                style={{ scrollbarWidth: 'thin', scrollbarColor: '#334155 #0f172a' }}
            >
                <div className="min-w-max" style={{ minWidth: `${contentMinWidth}px` }}>
                    {/* Header */}
                    <div className="grid border-b border-zen-border bg-zen-bg/70" style={{ gridTemplateColumns }}>
                        <div className="border-r border-zen-border px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-zen-text-tri">Item</div>
                        <div>
                            <div className="grid border-b border-zen-border" style={{ gridTemplateColumns: `repeat(${totalDays}, minmax(0, 1fr))` }}>
                                {sprintHeaders.map((sprint) => (
                                    <div key={`${sprint.label}-${sprint.span}`} className="border-r border-zen-border/60 px-2 py-2 text-center text-[10px] font-semibold uppercase tracking-[0.18em] text-sky-300" style={{ gridColumn: `span ${sprint.span}` }}>
                                        {sprint.label}
                                    </div>
                                ))}
                            </div>
                            <div className="grid" style={{ gridTemplateColumns: `repeat(${totalDays}, minmax(0, 1fr))` }}>
                                {days.map((day) => (
                                    <div key={day.toISOString()} className="border-r border-zen-border/40 px-0.5 py-1.5 text-center text-[9px] text-zen-text-tri">
                                        <div>{day.toLocaleDateString('pt-BR', { day: '2-digit' })}</div>
                                        <div>{day.toLocaleDateString('pt-BR', { month: 'short' })}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Rows */}
                    <div className="relative">
                        {rowMetrics.map(({ item, leftPct, widthPct, isBug, progress }) => (
                            <div key={item.id} className="grid h-[88px] border-b border-zen-border/60" style={{ gridTemplateColumns }}>
                                <button
                                    type="button"
                                    onClick={() => onOpenCard(item)}
                                    className="flex h-full min-w-0 flex-col justify-center gap-1.5 border-r border-zen-border bg-zen-surface/50 px-4 py-3 text-left transition-colors hover:bg-zen-surface"
                                >
                                    <div className="flex flex-wrap items-center gap-1.5">
                                        <TypePill type={item.alocado} />
                                        <span className={`inline-flex items-center rounded-md border px-1.5 py-0.5 text-[10px] ${getStateBadgeClass(item.posicaoKanban)}`}>{item.stageLabel}</span>
                                    </div>
                                    <div className="line-clamp-1 text-xs font-semibold text-white">{item.nometarefa}</div>
                                    <div className="flex w-full items-center justify-between gap-2 text-[11px] text-zen-text-sec">
                                        <div className="flex min-w-0 items-center gap-1.5 overflow-hidden">
                                            <span
                                                className="shrink-0 rounded-md border border-zen-border/70 bg-zen-bg/70 px-2 py-0.5"
                                                title={formatDateTime(item.data_inicio || item.startDate)}
                                            >
                                                {formatDateShort(item.data_inicio || item.startDate)}
                                            </span>
                                            <ArrowRight className="h-3 w-3 shrink-0 text-zen-text-tri" />
                                            <span
                                                className="shrink-0 rounded-md border border-zen-border/70 bg-zen-bg/70 px-2 py-0.5"
                                                title={formatDateTime(item.data_fim || item.endDate)}
                                            >
                                                {formatDateShort(item.data_fim || item.endDate)}
                                            </span>
                                        </div>
                                        <span className={`shrink-0 rounded-full px-2 py-0.5 ${getProgressTone(progress)}`}>{progress}%</span>
                                    </div>
                                </button>

                                <div className="relative overflow-hidden bg-[#0d131d]">
                                    {todayLeft !== null && (
                                        <div className="pointer-events-none absolute inset-y-0 z-20 w-px bg-amber-400/60" style={{ left: `${todayLeft}%` }} />
                                    )}
                                    <div className="absolute inset-0 grid" style={{ gridTemplateColumns: `repeat(${totalDays}, minmax(0, 1fr))` }}>
                                        {days.map((day) => (
                                            <div key={`${item.id}-${day.toISOString()}`} className="border-r border-zen-border/30" />
                                        ))}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => onOpenCard(item)}
                                        className={`absolute top-1/2 z-30 flex h-10 -translate-y-1/2 items-center gap-2 overflow-hidden rounded-lg border px-2.5 text-left shadow-md transition-transform hover:scale-[1.01] ${
                                            isBug
                                                ? 'border-rose-500/30 bg-gradient-to-r from-rose-500/25 to-rose-400/10 text-rose-50'
                                                : 'border-sky-500/30 bg-gradient-to-r from-sky-500/25 to-emerald-400/10 text-sky-50'
                                        }`}
                                        style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
                                    >
                                        <span
                                            className={`absolute inset-y-0 left-0 rounded-[inherit] ${
                                                isBug ? 'bg-rose-300/20' : 'bg-emerald-300/18'
                                            }`}
                                            style={{ width: `${progress}%` }}
                                        />
                                        <span className="pointer-events-none absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-transparent" />
                                        <span className="relative z-10 min-w-0 truncate text-xs font-semibold">{item.nometarefa}</span>
                                        {widthPct >= 8 && (
                                            <span className="relative z-10 ml-auto inline-flex shrink-0 rounded-full bg-black/25 px-1.5 py-0.5 text-[10px] font-semibold">{progress}%</span>
                                        )}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </article>
    )
}

// ─── BacklogPanel ─────────────────────────────────────────────────────────────
const BacklogPanel = ({
    epics,
    featuresByEpic,
    storiesByFeature,
    activitiesByStory,
    participantsById,
    activeSearch,
    setActiveSearch,
    openOnly,
    setOpenOnly,
    collapsedRows,
    onToggleRow,
    onOpenCard,
}) => {
    const query = activeSearch.trim().toLowerCase()

    const matchesActivity = useCallback(
        (atividade) => {
            if (openOnly && atividade.isDone) return false
            if (!query) return true
            const haystack = [atividade.nometarefa, atividade.stageLabel, atividade.participanteNome, stripHtml(atividade.descricao)].join(' ').toLowerCase()
            return haystack.includes(query)
        },
        [openOnly, query]
    )

    const visibleTree = useMemo(() => {
        return epics
            .map((epic) => {
                const featureBlocks = (featuresByEpic.get(epic.id) || [])
                    .map((feature) => {
                        const storyBlocks = (storiesByFeature.get(feature.id) || [])
                            .map((story) => {
                                const visibleActivities = (activitiesByStory.get(story.id) || []).filter(matchesActivity)
                                const storyMatches = query ? story.nome_userstory.toLowerCase().includes(query) : false
                                if (!storyMatches && visibleActivities.length === 0) return null
                                return { story, activities: visibleActivities }
                            })
                            .filter(Boolean)
                        const featureMatches = query ? feature.nome_feature.toLowerCase().includes(query) : false
                        if (!featureMatches && storyBlocks.length === 0) return null
                        return { feature, stories: storyBlocks }
                    })
                    .filter(Boolean)
                const epicMatches = query ? epic.nome_epic.toLowerCase().includes(query) : false
                if (!epicMatches && featureBlocks.length === 0) return null
                return { epic, features: featureBlocks }
            })
            .filter(Boolean)
    }, [activitiesByStory, epics, featuresByEpic, matchesActivity, query, storiesByFeature])

    if (epics.length === 0) {
        return <EmptyPanel title="Backlog vazio" description="Cadastre Epic, Feature e User Story para montar a árvore hierárquica." />
    }

    return (
        <div className="overflow-hidden rounded-xl border border-zen-border bg-zen-surface">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-2 border-b border-zen-border bg-zen-bg/40 px-4 py-3">
                <input
                    type="text"
                    value={activeSearch}
                    onChange={(e) => setActiveSearch(e.target.value)}
                    placeholder="Buscar item, estado ou responsável..."
                    className="min-w-[200px] flex-1 rounded-lg border border-zen-border bg-zen-bg px-3 py-2 text-sm text-white placeholder:text-zen-text-tri outline-none transition-all focus:border-zen-blue focus:ring-1 focus:ring-zen-blue"
                />
                <button
                    type="button"
                    onClick={() => setOpenOnly((c) => !c)}
                    className={`rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
                        openOnly
                            ? 'border-zen-blue bg-zen-blue/15 text-sky-300'
                            : 'border-zen-border text-zen-text-sec hover:bg-zen-border/30 hover:text-white'
                    }`}
                >
                    Somente abertos
                </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <div className="min-w-[860px]">
                    {/* Header row */}
                    <div className="grid grid-cols-[minmax(300px,1.8fr)_1fr_0.9fr_0.8fr_0.8fr] border-b border-zen-border bg-zen-bg/60 px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-zen-text-tri">
                        <span>Item</span>
                        <span>Responsável</span>
                        <span>Estado</span>
                        <span>Progresso</span>
                        <span>Prazo</span>
                    </div>

                    {visibleTree.length === 0 ? (
                        <div className="px-4 py-8 text-center text-sm text-zen-text-sec">Nenhum item encontrado.</div>
                    ) : (
                        visibleTree.map(({ epic, features }) => {
                            const epicRowId  = `epic-${epic.id}`
                            const epicCollapsed = Boolean(collapsedRows[epicRowId])
                            return (
                                <div key={epic.id}>
                                    {/* Epic row */}
                                    <div className="grid grid-cols-[minmax(300px,1.8fr)_1fr_0.9fr_0.8fr_0.8fr] border-b border-zen-border/70 bg-blue-950/30 px-4 py-2.5">
                                        <button type="button" onClick={() => onToggleRow(epicRowId)} className="flex items-center gap-2.5 text-left">
                                            {epicCollapsed ? <ChevronRight className="h-3.5 w-3.5 text-zen-text-tri" /> : <ChevronDown className="h-3.5 w-3.5 text-zen-text-tri" />}
                                            <TypePill type="epic" />
                                            <span className="text-sm font-semibold text-white">{epic.nome_epic}</span>
                                        </button>
                                        <div className="text-xs text-zen-text-tri flex items-center">—</div>
                                        <div className="text-xs text-zen-text-tri flex items-center">{features.length} features</div>
                                        <div className="text-xs text-zen-text-tri flex items-center">—</div>
                                        <div className="text-xs text-zen-text-tri flex items-center">—</div>
                                    </div>

                                    {!epicCollapsed && features.map(({ feature, stories }) => {
                                        const featureRowId  = `feature-${feature.id}`
                                        const featureCollapsed = Boolean(collapsedRows[featureRowId])
                                        return (
                                            <div key={feature.id}>
                                                {/* Feature row */}
                                                <div className="grid grid-cols-[minmax(300px,1.8fr)_1fr_0.9fr_0.8fr_0.8fr] border-b border-zen-border/60 bg-cyan-950/20 px-4 py-2.5">
                                                    <button type="button" onClick={() => onToggleRow(featureRowId)} className="flex items-center gap-2.5 text-left" style={{ paddingLeft: 24 }}>
                                                        {featureCollapsed ? <ChevronRight className="h-3.5 w-3.5 text-zen-text-tri" /> : <ChevronDown className="h-3.5 w-3.5 text-zen-text-tri" />}
                                                        <TypePill type="feature" />
                                                        <span className="text-sm font-medium text-white">{feature.nome_feature}</span>
                                                    </button>
                                                    <div className="text-xs text-zen-text-tri flex items-center">—</div>
                                                    <div className="text-xs text-zen-text-tri flex items-center">{stories.length} stories</div>
                                                    <div className="text-xs text-zen-text-tri flex items-center">—</div>
                                                    <div className="text-xs text-zen-text-tri flex items-center">—</div>
                                                </div>

                                                {!featureCollapsed && stories.map(({ story, activities }) => {
                                                    const storyRowId  = `story-${story.id}`
                                                    const storyCollapsed = Boolean(collapsedRows[storyRowId])
                                                    const bugsCount = activities.filter((a) => normalizeKey(a.alocado) === 'bugproj').length
                                                    return (
                                                        <div key={story.id}>
                                                            {/* Story row */}
                                                            <div className="grid grid-cols-[minmax(300px,1.8fr)_1fr_0.9fr_0.8fr_0.8fr] border-b border-zen-border/50 bg-amber-950/10 px-4 py-2.5">
                                                                <button type="button" onClick={() => onToggleRow(storyRowId)} className="flex items-center gap-2.5 text-left" style={{ paddingLeft: 48 }}>
                                                                    {storyCollapsed ? <ChevronRight className="h-3.5 w-3.5 text-zen-text-tri" /> : <ChevronDown className="h-3.5 w-3.5 text-zen-text-tri" />}
                                                                    <TypePill type="story" />
                                                                    <span className="text-sm font-medium text-white">{story.nome_userstory}</span>
                                                                </button>
                                                                <div className="text-xs text-zen-text-tri flex items-center">—</div>
                                                                <div className="text-xs text-zen-text-tri flex items-center">{activities.length} itens</div>
                                                                <div className="text-xs text-zen-text-tri flex items-center">{bugsCount > 0 ? `${bugsCount} bug${bugsCount > 1 ? 's' : ''}` : '—'}</div>
                                                                <div className="text-xs text-zen-text-tri flex items-center">—</div>
                                                            </div>

                                                            {!storyCollapsed && (
                                                                activities.length === 0 ? (
                                                                    <div className="grid grid-cols-[minmax(300px,1.8fr)_1fr_0.9fr_0.8fr_0.8fr] border-b border-zen-border/40 px-4 py-2.5">
                                                                        <div className="text-xs text-zen-text-tri" style={{ paddingLeft: 72 }}>Nenhuma task ou bug vinculado.</div>
                                                                        <div /><div /><div /><div />
                                                                    </div>
                                                                ) : (
                                                                    activities.map((atividade) => {
                                                                        const participant = participantsById[atividade.participante] || null
                                                                        return (
                                                                            <div key={atividade.id} className="grid grid-cols-[minmax(300px,1.8fr)_1fr_0.9fr_0.8fr_0.8fr] border-b border-zen-border/30 px-4 py-2.5 transition-colors hover:bg-white/[0.025]">
                                                                                <button type="button" onClick={() => onOpenCard(atividade)} className="flex items-start gap-2.5 text-left" style={{ paddingLeft: 72 }}>
                                                                                    <Pencil className="mt-0.5 h-3.5 w-3.5 shrink-0 text-zen-text-tri" />
                                                                                    <div className="min-w-0">
                                                                                        <div className="flex flex-wrap items-center gap-1.5">
                                                                                            <TypePill type={atividade.alocado} />
                                                                                            <span className="truncate text-sm font-medium text-white">{atividade.nometarefa}</span>
                                                                                        </div>
                                                                                        <p className="mt-0.5 line-clamp-1 text-xs text-zen-text-sec">{stripHtml(atividade.descricao) || 'Sem descrição.'}</p>
                                                                                    </div>
                                                                                </button>
                                                                                <div className="flex items-center text-xs text-zen-text-sec">{participant?.nomeparticipante || '—'}</div>
                                                                                <div className="flex items-center">
                                                                                    <span className={`inline-flex items-center rounded-md border px-1.5 py-0.5 text-[10px] ${getStateBadgeClass(atividade.posicaoKanban)}`}>{atividade.stageLabel}</span>
                                                                                </div>
                                                                                <div className="flex items-center">
                                                                                    {Number(atividade.percentual_progresso) > 0 ? (
                                                                                        <span className={`rounded-full px-2 py-0.5 text-[10px] ${getProgressTone(Number(atividade.percentual_progresso))}`}>{atividade.percentual_progresso}%</span>
                                                                                    ) : (
                                                                                        <span className="text-xs text-zen-text-tri">0%</span>
                                                                                    )}
                                                                                </div>
                                                                                <div className="flex items-center text-xs text-zen-text-sec">{atividade.data_fim ? formatDateTime(atividade.data_fim) : '—'}</div>
                                                                            </div>
                                                                        )
                                                                    })
                                                                )
                                                            )}
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        )
                                    })}
                                </div>
                            )
                        })
                    )}
                </div>
            </div>
        </div>
    )
}

const CadastroControlModal = ({
    open,
    onClose,
    epics,
    featuresByEpic,
    storiesByFeature,
    onCreate,
    onEdit,
    onDelete,
    deletingKey,
}) => {
    const [search, setSearch] = useState('')

    const normalizedSearch = normalizeKey(search)
    const filteredEpics = useMemo(() => {
        if (!normalizedSearch) return epics
        return epics.filter((epic) => {
            const epicMatch = normalizeKey(epic.nome_epic).includes(normalizedSearch)
            if (epicMatch) return true
            const featureList = featuresByEpic.get(epic.id) || []
            return featureList.some((feature) => {
                const featureMatch = normalizeKey(feature.nome_feature).includes(normalizedSearch)
                if (featureMatch) return true
                const storyList = storiesByFeature.get(feature.id) || []
                return storyList.some((story) => normalizeKey(story.nome_userstory).includes(normalizedSearch))
            })
        })
    }, [epics, featuresByEpic, normalizedSearch, storiesByFeature])

    if (!open) return null

    return (
        <div className="fixed inset-0 z-[88] flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} />
            <div className="relative max-h-[90vh] w-full max-w-6xl overflow-y-auto rounded-2xl border border-zen-border bg-zen-surface shadow-2xl">
                <div className="flex items-start justify-between gap-4 border-b border-zen-border px-6 py-5">
                    <div>
                        <h2 className="font-display text-lg font-semibold text-white">Painel de manutenção de cadastros</h2>
                        <p className="mt-1 text-sm text-zen-text-sec">CRUD de Epic, Feature e User Story com visão hierárquica.</p>
                    </div>
                    <button type="button" onClick={onClose} className="rounded-lg border border-zen-border p-2 text-zen-text-sec transition-colors hover:bg-zen-border/30 hover:text-white">
                        <X className="h-4 w-4" />
                    </button>
                </div>

                <div className="border-b border-zen-border px-6 py-4">
                    <div className="flex flex-wrap items-center gap-3">
                        <input
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Buscar por nome de Epic, Feature ou User Story..."
                            className="min-w-[260px] flex-1 rounded-lg border border-zen-border bg-zen-bg px-3 py-2 text-sm text-white placeholder:text-zen-text-tri outline-none transition-all focus:border-zen-blue focus:ring-1 focus:ring-zen-blue"
                        />
                        <button
                            type="button"
                            onClick={() => onCreate('epic')}
                            className="inline-flex items-center gap-2 rounded-lg border border-blue-500/40 bg-blue-500/10 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-blue-500/20"
                        >
                            <BadgePlus className="h-3.5 w-3.5 text-blue-300" />
                            Novo Epic
                        </button>
                        <button
                            type="button"
                            onClick={() => onCreate('feature')}
                            className="inline-flex items-center gap-2 rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-cyan-500/20"
                        >
                            <BadgePlus className="h-3.5 w-3.5 text-cyan-300" />
                            Nova Feature
                        </button>
                        <button
                            type="button"
                            onClick={() => onCreate('user-story')}
                            className="inline-flex items-center gap-2 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-amber-500/20"
                        >
                            <BadgePlus className="h-3.5 w-3.5 text-amber-300" />
                            Nova User Story
                        </button>
                    </div>
                </div>

                <div className="space-y-4 p-6">
                    {filteredEpics.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-zen-border bg-zen-bg/40 px-5 py-8 text-center text-sm text-zen-text-sec">
                            Nenhum cadastro encontrado para o filtro informado.
                        </div>
                    ) : (
                        filteredEpics.map((epic) => {
                            const featureList = featuresByEpic.get(epic.id) || []
                            return (
                                <article key={epic.id} className="overflow-hidden rounded-xl border border-zen-border bg-zen-bg/20">
                                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zen-border bg-blue-500/5 px-4 py-3">
                                        <div className="flex min-w-0 items-center gap-2.5">
                                            <TypePill type="epic" />
                                            <h3 className="truncate text-sm font-semibold text-white">{epic.nome_epic}</h3>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={() => onEdit('epic', epic)}
                                                className="inline-flex items-center gap-1 rounded-lg border border-zen-border px-2.5 py-1.5 text-xs font-semibold text-zen-text-sec transition-colors hover:bg-zen-border/30 hover:text-white"
                                            >
                                                <Pencil className="h-3.5 w-3.5" />
                                                Editar
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => onDelete('epic', epic)}
                                                disabled={deletingKey === `epic-${epic.id}`}
                                                className="inline-flex items-center gap-1 rounded-lg border border-rose-500/40 px-2.5 py-1.5 text-xs font-semibold text-rose-200 transition-colors hover:bg-rose-500/20 hover:text-white disabled:opacity-60"
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                                {deletingKey === `epic-${epic.id}` ? 'Excluindo...' : 'Excluir'}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="divide-y divide-zen-border/50">
                                        {featureList.length === 0 ? (
                                            <div className="px-4 py-3 text-xs text-zen-text-tri">Sem features vinculadas.</div>
                                        ) : (
                                            featureList.map((feature) => {
                                                const storyList = storiesByFeature.get(feature.id) || []
                                                return (
                                                    <div key={feature.id} className="px-4 py-3">
                                                        <div className="flex flex-wrap items-center justify-between gap-3">
                                                            <div className="flex min-w-0 items-center gap-2">
                                                                <TypePill type="feature" />
                                                                <span className="truncate text-sm font-medium text-white">{feature.nome_feature}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => onEdit('feature', feature)}
                                                                    className="inline-flex items-center gap-1 rounded-lg border border-zen-border px-2 py-1 text-[11px] font-semibold text-zen-text-sec transition-colors hover:bg-zen-border/30 hover:text-white"
                                                                >
                                                                    <Pencil className="h-3 w-3" />
                                                                    Editar
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => onDelete('feature', feature)}
                                                                    disabled={deletingKey === `feature-${feature.id}`}
                                                                    className="inline-flex items-center gap-1 rounded-lg border border-rose-500/40 px-2 py-1 text-[11px] font-semibold text-rose-200 transition-colors hover:bg-rose-500/20 hover:text-white disabled:opacity-60"
                                                                >
                                                                    <Trash2 className="h-3 w-3" />
                                                                    {deletingKey === `feature-${feature.id}` ? 'Excluindo...' : 'Excluir'}
                                                                </button>
                                                            </div>
                                                        </div>
                                                        <div className="mt-2 flex flex-wrap gap-2">
                                                            {storyList.length === 0 ? (
                                                                <span className="text-[11px] text-zen-text-tri">Sem User Stories vinculadas.</span>
                                                            ) : (
                                                                storyList.map((story) => (
                                                                    <div key={story.id} className="inline-flex items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 py-1.5">
                                                                        <span className="text-xs text-amber-100">{story.nome_userstory}</span>
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => onEdit('user-story', story)}
                                                                            className="inline-flex items-center gap-1 rounded-md border border-zen-border/70 px-1.5 py-0.5 text-[10px] text-zen-text-sec transition-colors hover:bg-zen-border/30 hover:text-white"
                                                                        >
                                                                            <Pencil className="h-3 w-3" />
                                                                            Editar
                                                                        </button>
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => onDelete('user-story', story)}
                                                                            disabled={deletingKey === `user-story-${story.id}`}
                                                                            className="inline-flex items-center gap-1 rounded-md border border-rose-500/40 px-1.5 py-0.5 text-[10px] text-rose-200 transition-colors hover:bg-rose-500/20 hover:text-white disabled:opacity-60"
                                                                        >
                                                                            <Trash2 className="h-3 w-3" />
                                                                            {deletingKey === `user-story-${story.id}` ? 'Excluindo...' : 'Excluir'}
                                                                        </button>
                                                                    </div>
                                                                ))
                                                            )}
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        )}
                                    </div>
                                </article>
                            )
                        })
                    )}
                </div>
            </div>
        </div>
    )
}

// ─── Projetos (componente raiz) ───────────────────────────────────────────────
const Projetos = () => {
    const [userId, setUserId]           = useState(null)
    const [loading, setLoading]         = useState(true)
    const [feedback, setFeedback]       = useState(null)
    const [refreshToken, setRefreshToken] = useState(0)
    const [cadastroAberto, setCadastroAberto] = useState(null)
    const [editingSeed, setEditingSeed] = useState(null)
    const [cadastroManagerOpen, setCadastroManagerOpen] = useState(false)
    const [deletingCadastroKey, setDeletingCadastroKey] = useState('')
    const [activeTab, setActiveTab]     = useState('backlog')
    const [backlogSearch, setBacklogSearch] = useState('')
    const [backlogOpenOnly, setBacklogOpenOnly] = useState(false)
    const [collapsedRows, setCollapsedRows] = useState({})
    const [epics, setEpics]             = useState([])
    const [features, setFeatures]       = useState([])
    const [userStories, setUserStories] = useState([])
    const [activities, setActivities]   = useState([])
    const [participantsById, setParticipantsById] = useState({})
    const [categoriesById, setCategoriesById]     = useState({})

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => {
            setUserId(data.user?.id || null)
        })
    }, [])

    useEffect(() => {
        if (!feedback) return undefined
        const timer = setTimeout(() => setFeedback(null), 4000)
        return () => clearTimeout(timer)
    }, [feedback])

    const loadWorkspace = useCallback(async () => {
        if (!userId) { setLoading(false); return }
        setLoading(true)
        setFeedback(null)

        const [
            { data: epicsData,        error: epicsError       },
            { data: featuresData,     error: featuresError    },
            { data: storiesData,      error: storiesError     },
            { data: activitiesData,   error: activitiesError  },
            { data: participantsData, error: participantsError},
            { data: categoriesData,   error: categoriesError  },
        ] = await Promise.all([
            supabase.from('tbf_epic').select('id, nome_epic').eq('idusuario', userId).order('id', { ascending: true }),
            supabase.from('tbf_feature').select('id, nome_feature, id_epic').eq('idusuario', userId).order('id', { ascending: true }),
            supabase.from('tbf_userstory').select('id, nome_userstory, id_feature').eq('idusuario', userId).order('id', { ascending: true }),
            supabase
                .from('tbf_atividades')
                .select('id, nometarefa, descricao, alocado, created_at, "posicao Kanban", percentual_progresso, data_inicio, data_fim, gravidade, urgencia, tendencia, idcategoria, idsubcategoria, participante, predecessor, sucessor, userhistory')
                .eq('idusuario', userId)
                .in('alocado', PROJECT_ALOCADOS)
                .order('created_at', { ascending: false }),
            supabase.from('tbf_participantes').select('id, nomeparticipante, fotobase64').eq('idusuario', userId),
            supabase.from('tbf_categorias').select('id, nomecategoria, corcategoria').eq('idusuario', userId),
        ])

        if (epicsError || featuresError || storiesError || activitiesError) {
            setFeedback({ type: 'error', message: 'Não foi possível carregar a workspace de projetos.' })
            setEpics([]); setFeatures([]); setUserStories([]); setActivities([])
            setLoading(false)
            return
        }

        setEpics(epicsData || [])
        setFeatures(featuresData || [])
        setUserStories(storiesData || [])
        setActivities((activitiesData || []).map((item) => ({ ...item, posicaoKanban: item['posicao Kanban'] || '' })))

        setParticipantsById(!participantsError
            ? (participantsData || []).reduce((acc, p) => { acc[p.id] = p; return acc }, {})
            : {}
        )
        setCategoriesById(!categoriesError
            ? (categoriesData || []).reduce((acc, c) => { acc[c.id] = c; return acc }, {})
            : {}
        )

        setLoading(false)
    }, [userId])

    useEffect(() => {
        const timer = setTimeout(() => loadWorkspace(), 0)
        return () => clearTimeout(timer)
    }, [loadWorkspace, refreshToken])

    const handleModalSaved = useCallback(() => { setRefreshToken((c) => c + 1) }, [])
    const openCadastro  = (id, seed = null) => { setEditingSeed(seed); setCadastroAberto(id) }
    const closeCadastro = ()   => { setCadastroAberto(null); setEditingSeed(null) }
    const openCadastroManager = () => setCadastroManagerOpen(true)
    const closeCadastroManager = () => setCadastroManagerOpen(false)
    const toggleRow     = useCallback((rowId) => { setCollapsedRows((c) => ({ ...c, [rowId]: !c[rowId] })) }, [])

    const cadastroAtual  = useMemo(() => ACOES_CADASTRO.find((i) => i.id === cadastroAberto) || null, [cadastroAberto])
    const acoesOrdenadas = useMemo(() => {
        const ordem = ['task', 'bug', 'epic', 'feature', 'user-story']
        return ordem.map((id) => ACOES_CADASTRO.find((a) => a.id === id)).filter(Boolean)
    }, [])

    const featureById  = useMemo(() => new Map(features.map((f) => [f.id, f])),     [features])
    const storyById    = useMemo(() => new Map(userStories.map((s) => [s.id, s])),  [userStories])
    const epicById     = useMemo(() => new Map(epics.map((e) => [e.id, e])),         [epics])

    const featuresByEpic = useMemo(() => {
        const map = new Map()
        features.forEach((f) => { const l = map.get(f.id_epic) || []; l.push(f); map.set(f.id_epic, l) })
        return map
    }, [features])

    const storiesByFeature = useMemo(() => {
        const map = new Map()
        userStories.forEach((s) => { const l = map.get(s.id_feature) || []; l.push(s); map.set(s.id_feature, l) })
        return map
    }, [userStories])

    const enrichedActivities = useMemo(() => {
        return activities.map((a) => {
            const story       = storyById.get(a.userhistory)       || null
            const feature     = story ? featureById.get(story.id_feature) || null : null
            const epic        = feature ? epicById.get(feature.id_epic)   || null : null
            const participant = participantsById[a.participante]           || null
            const category    = categoriesById[a.idcategoria]              || null
            return {
                ...a,
                stageLabel: getStageLabelByState(a.posicaoKanban),
                isDone: isDoneState(a.posicaoKanban),
                story, feature, epic, participant, category,
                participanteNome: participant?.nomeparticipante || '',
            }
        })
    }, [activities, categoriesById, epicById, featureById, participantsById, storyById])

    const activitiesByStory = useMemo(() => {
        const map = new Map()
        enrichedActivities.forEach((a) => { const l = map.get(a.userhistory) || []; l.push(a); map.set(a.userhistory, l) })
        return map
    }, [enrichedActivities])

    const ganttItems = useMemo(() => {
        return enrichedActivities
            .filter((a) => !a.isDone)
            .map((a) => {
                const startMs = new Date(a.data_inicio || a.created_at).getTime()
                let   endMs   = new Date(a.data_fim || a.data_inicio || a.created_at).getTime()
                if (Number.isNaN(startMs)) return null
                if (Number.isNaN(endMs) || endMs < startMs) endMs = startMs + 2 * DAY_IN_MS
                return {
                    ...a, startMs, endMs,
                    durationDays: Math.max(1, Math.round((endMs - startMs) / DAY_IN_MS) + 1),
                    startDate: new Date(startMs).toISOString(),
                    endDate:   new Date(endMs).toISOString(),
                }
            })
            .filter(Boolean)
            .sort((a, b) => a.startMs - b.startMs)
    }, [enrichedActivities])

    const metrics = useMemo(() => {
        const bugs     = enrichedActivities.filter((a) => normalizeKey(a.alocado) === 'bugproj').length
        const backlog  = enrichedActivities.filter((a) => normalizeKey(a.posicaoKanban) === 'backlog').length
        const done     = enrichedActivities.filter((a) => a.isDone).length
        const flowing  = enrichedActivities.filter((a) => !a.isDone && normalizeKey(a.posicaoKanban) !== 'backlog').length
        const avgProgress = enrichedActivities.length
            ? Math.round(enrichedActivities.reduce((acc, a) => acc + Number(a.percentual_progresso || 0), 0) / enrichedActivities.length)
            : 0
        return { bugs, backlog, done, flowing, avgProgress }
    }, [enrichedActivities])

    const upcomingItems = useMemo(() => (
        [...enrichedActivities]
            .filter((a) => a.data_fim && !a.isDone)
            .sort((a, b) => new Date(a.data_fim).getTime() - new Date(b.data_fim).getTime())
            .slice(0, 4)
    ), [enrichedActivities])

    const tabCounts = useMemo(() => ({
        backlog: enrichedActivities.length,
        gantt:   ganttItems.length,
        kanban:  enrichedActivities.length,
    }), [enrichedActivities.length, ganttItems.length])

    const handleOpenProjectCard = useCallback((atividade) => {
        setEditingSeed(buildTaskSeed(atividade, atividade.participanteNome))
        setCadastroAberto(normalizeKey(atividade.alocado) === 'bugproj' ? 'bug' : 'task')
    }, [])

    const handleDeleteCadastro = useCallback(async (type, item) => {
        if (!item?.id) return
        const mapByType = {
            epic: { table: 'tbf_epic', field: 'nome_epic', label: 'Epic', id: 'epic' },
            feature: { table: 'tbf_feature', field: 'nome_feature', label: 'Feature', id: 'feature' },
            'user-story': { table: 'tbf_userstory', field: 'nome_userstory', label: 'User Story', id: 'user-story' },
        }
        const config = mapByType[type]
        if (!config) return
        const itemName = item[config.field] || 'Sem nome'
        const confirmed = window.confirm(`Excluir ${config.label} "${itemName}"?`)
        if (!confirmed) return

        const key = `${config.id}-${item.id}`
        setDeletingCadastroKey(key)
        const { error } = await supabase.from(config.table).delete().eq('id', item.id).eq('idusuario', userId)
        setDeletingCadastroKey('')

        if (error) {
            setFeedback({ type: 'error', message: `Nao foi possivel excluir ${config.label}.` })
            return
        }

        setFeedback({ type: 'success', message: `${config.label} excluido com sucesso.` })
        setRefreshToken((c) => c + 1)
    }, [userId])

    // ── Loading state ──────────────────────────────────────────────────────────
    if (loading) {
        return (
            <div className="mx-auto flex w-full max-w-7xl items-center justify-center p-4 sm:p-6">
                <div className="flex w-full items-center justify-center gap-3 rounded-2xl border border-zen-border bg-zen-surface px-6 py-20">
                    <RefreshCw className="h-5 w-5 animate-spin text-zen-blue" />
                    <span className="text-sm text-zen-text-sec">Carregando workspace de projetos...</span>
                </div>
            </div>
        )
    }

    // ── Render ─────────────────────────────────────────────────────────────────
    return (
        <div className="flex w-full max-w-none flex-col gap-5 p-4 sm:p-6 animate-in fade-in duration-300">

            {/* Toast flutuante */}
            {feedback && (
                <div className={`fixed bottom-5 right-5 z-50 flex max-w-sm items-start gap-3 rounded-xl border bg-zen-surface px-4 py-3 shadow-2xl shadow-black/50 animate-in slide-in-from-bottom-3 duration-300 ${
                    feedback.type === 'success' ? 'border-emerald-500/30' : 'border-rose-500/30'
                }`}>
                    <AlertCircle className={`mt-0.5 h-4 w-4 shrink-0 ${feedback.type === 'success' ? 'text-emerald-400' : 'text-rose-400'}`} />
                    <span className={`flex-1 text-sm ${feedback.type === 'success' ? 'text-emerald-300' : 'text-rose-300'}`}>{feedback.message}</span>
                    <button type="button" onClick={() => setFeedback(null)} className="shrink-0 text-zen-text-tri transition-colors hover:text-white">
                        <X className="h-3.5 w-3.5" />
                    </button>
                </div>
            )}

            {/* ── 1. PAGE HEADER ───────────────────────────────────────────────── */}
            <header className="overflow-hidden rounded-2xl border border-zen-border bg-zen-surface">
                <div className="bg-[radial-gradient(ellipse_at_top_left,rgba(56,189,248,0.1),transparent_50%)] px-5 py-5 sm:px-6">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">

                        {/* Esquerda: título + hierarquia */}
                        <div className="space-y-3">
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-500/30 bg-sky-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-sky-300">
                                <FolderKanban className="h-3 w-3" />
                                Módulo de Projetos
                            </span>
                            <div>
                                <h1 className="font-display text-2xl font-bold tracking-tight text-white">Dashboard de Projetos</h1>
                                <p className="mt-1 max-w-lg text-sm leading-relaxed text-zen-text-sec">
                                    Backlog hierárquico, cronograma Gantt e Kanban operacional em uma única visão.
                                </p>
                            </div>
                            {/* Cadeia de hierarquia */}
                            <div className="flex flex-wrap items-center gap-1.5">
                                {HIERARQUIA.map((item, index) => (
                                    <div key={item} className="flex items-center gap-1.5">
                                        <span className="rounded-full border border-zen-border bg-zen-bg/60 px-2.5 py-0.5 text-[11px] font-medium text-zen-text-sec">{item}</span>
                                        {index < HIERARQUIA.length - 1 && <ArrowRight className="h-3 w-3 text-zen-text-tri" />}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Direita: botões de cadastro compactos */}
                        <div className="flex flex-wrap gap-2 lg:justify-end lg:pt-1">
                            <button
                                type="button"
                                onClick={openCadastroManager}
                                className="inline-flex items-center gap-2 rounded-lg border border-zen-border bg-zen-bg/50 px-3 py-2 text-xs font-semibold text-zen-text-sec transition-all hover:bg-zen-border/30 hover:text-white"
                            >
                                <Settings2 className="h-3.5 w-3.5" />
                                Manter Cadastros
                            </button>
                            {acoesOrdenadas.map((acao) => {
                                const Icone = acao.icone
                                return (
                                    <button
                                        key={acao.id}
                                        type="button"
                                        onClick={() => openCadastro(acao.id)}
                                        className={`group inline-flex items-center gap-2 rounded-lg border ${acao.borda} ${acao.bg} px-3 py-2 text-xs font-semibold text-white transition-all hover:brightness-125 hover:shadow-lg`}
                                    >
                                        <Icone className={`h-3.5 w-3.5 ${acao.destaque}`} />
                                        {acao.titulo}
                                        <BadgePlus className="h-3 w-3 text-zen-text-tri transition-colors group-hover:text-white" />
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </header>

            {/* ── 2. MÉTRICAS ──────────────────────────────────────────────────── */}
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <MetricCard icone={Layers3}     label="Epics"           value={epics.length}             apoio="Estrutura principal do portfólio."   tone="from-blue-500/30 to-transparent"    />
                <MetricCard icone={Workflow}    label="Features"        value={features.length}          apoio="Frentes funcionais por epic."        tone="from-cyan-500/30 to-transparent"    />
                <MetricCard icone={ListTodo}    label="User Stories"    value={userStories.length}       apoio="Escopo refinado para execução."      tone="from-amber-500/30 to-transparent"   />
                <MetricCard icone={Target}      label="Progresso médio" value={`${metrics.avgProgress}%`} apoio="Média de tasks e bugs ativos."     tone="from-emerald-500/30 to-transparent"  />
            </div>

            {/* ── 3. REPORTS + SIDEBAR ─────────────────────────────────────────── */}
            <div className="grid gap-5">

                {/* Painel principal com tabs */}
                <section className="overflow-hidden rounded-2xl border border-zen-border bg-zen-surface">
                    {/* Tab bar */}
                    <div className="flex items-center gap-1 border-b border-zen-border bg-zen-bg/30 px-4 pt-3 sm:px-5">
                        {REPORT_TABS.map((tab) => {
                            const active = activeTab === tab.id
                            const Icone  = tab.icone
                            return (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`relative inline-flex items-center gap-2 rounded-t-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                                        active
                                            ? 'text-white after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:rounded-t-full after:bg-zen-blue'
                                            : 'text-zen-text-sec hover:text-zen-text-sec/80'
                                    }`}
                                >
                                    <Icone className="h-4 w-4" />
                                    {tab.rotulo}
                                    <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold leading-none ${
                                        active ? 'bg-sky-500/20 text-sky-300' : 'bg-zen-border/60 text-zen-text-tri'
                                    }`}>
                                        {tabCounts[tab.id]}
                                    </span>
                                </button>
                            )
                        })}
                    </div>

                    {/* Conteúdo da tab */}
                    <div className="p-4 sm:p-5">
                        {activeTab === 'backlog' && (
                            <BacklogPanel
                                epics={epics}
                                featuresByEpic={featuresByEpic}
                                storiesByFeature={storiesByFeature}
                                activitiesByStory={activitiesByStory}
                                participantsById={participantsById}
                                activeSearch={backlogSearch}
                                setActiveSearch={setBacklogSearch}
                                openOnly={backlogOpenOnly}
                                setOpenOnly={setBacklogOpenOnly}
                                collapsedRows={collapsedRows}
                                onToggleRow={toggleRow}
                                onOpenCard={handleOpenProjectCard}
                            />
                        )}
                        {activeTab === 'gantt'  && <GanttPanel items={ganttItems} onOpenCard={handleOpenProjectCard} />}
                        {activeTab === 'kanban' && (
                            <KanbanProj
                                onCardOpen={handleOpenProjectCard}
                                refreshToken={refreshToken}
                                onChanged={() => setRefreshToken((c) => c + 1)}
                            />
                        )}
                    </div>
                </section>

                {/* Sidebar lateral */}
                <aside className="xl:sticky xl:top-5 xl:self-start">
                    <OverviewRail
                        upcomingItems={upcomingItems}
                        metrics={metrics}
                    />
                </aside>
            </div>

            {/* ── 4. VISÃO DA HIERARQUIA ───────────────────────────────────────── */}
            <section>
                <div className="mb-3 flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-white">Visão geral da hierarquia</h2>
                    <button
                        type="button"
                        onClick={() => openCadastro('epic')}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-zen-border px-3 py-1.5 text-xs text-zen-text-sec transition-colors hover:bg-zen-border/30 hover:text-white"
                    >
                        <BadgePlus className="h-3.5 w-3.5" />
                        Novo Epic
                    </button>
                </div>
                <HierarchyOverviewPanel
                    epics={epics}
                    featuresByEpic={featuresByEpic}
                    storiesByFeature={storiesByFeature}
                    activitiesByStory={activitiesByStory}
                    onCreateEpic={() => openCadastro('epic')}
                />
            </section>

            {/* Modal */}
            <ProjetoCadastroModal
                key={`${cadastroAtual?.id || 'empty'}-${editingSeed?.id || 'new'}`}
                cadastro={cadastroAtual}
                seedData={editingSeed}
                onClose={closeCadastro}
                onSaved={handleModalSaved}
            />
            <CadastroControlModal
                open={cadastroManagerOpen}
                onClose={closeCadastroManager}
                epics={epics}
                featuresByEpic={featuresByEpic}
                storiesByFeature={storiesByFeature}
                deletingKey={deletingCadastroKey}
                onCreate={(type) => openCadastro(type)}
                onEdit={(type, item) => openCadastro(type, item)}
                onDelete={handleDeleteCadastro}
            />
        </div>
    )
}

export default Projetos
