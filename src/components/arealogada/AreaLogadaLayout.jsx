import { useEffect, useMemo, useState } from 'react'
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom'
import CadAtividades from './CadAtividades.jsx'
import { supabase } from '../../lib/supabase.js'
import logominimal from '../../assets/logominimal.png'
import {
    DashboardAnalyticsContext,
    getPulseToneClass,
    useWorkspaceAnalytics,
} from './dashboard-analytics.js'
import {
    LayoutDashboard,
    FolderOpen,
    Kanban,
    CheckCircle2,
    LogOut,
    PanelLeftClose,
    PanelLeftOpen,
    Bell,
    Search,
    Menu,
    X,
    Plus,
    Cloud,
    Trash2,
    Lightbulb,
    Folder,
    RefreshCw,
} from 'lucide-react'

const workspaceItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { label: 'Projetos', icon: FolderOpen, path: '/projetos' },
    { label: 'Tarefas', icon: CheckCircle2, path: '/tarefas' },
    { label: 'Kanban', icon: Kanban, path: '/reports' },
]

const favoriteItems = [
    { label: 'Categorias', color: 'bg-indigo-500', path: '/cad-categorias' },
    { label: 'Subcategorias', color: 'bg-emerald-500', path: '/cad-subcategorias' },
    { label: 'Participantes', color: 'bg-rose-500', path: '/cad-participantes' },
]

const boxesItems = [
    { label: 'Stuff', icon: Cloud, path: '/boxes/stuff' },
    { label: 'Trash', icon: Trash2, path: '/boxes/trash' },
    { label: 'Algum dia/ Talvez', icon: Lightbulb, path: '/boxes/algum-dia' },
    { label: 'Referência Futura', icon: Folder, path: '/boxes/referencia' },
]

const LayoutMetricPill = ({ label, value, tone }) => (
    <div className={`rounded-md border px-3 py-1.5 text-xs ${tone}`}>
        <span className="text-zen-text-tri">{label}</span>
        <span className="ml-2 font-semibold text-white">{value}</span>
    </div>
)

const AreaLogadaLayout = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const [mobileOpen, setMobileOpen] = useState(false)
    const [collapsed, setCollapsed] = useState(false)
    const [user, setUser] = useState(null)
    const [atividadeModalOpen, setAtividadeModalOpen] = useState(false)

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => {
            setUser(data.user)
        })
    }, [])

    useEffect(() => {
        if (!mobileOpen) return
        const timer = setTimeout(() => setMobileOpen(false), 0)
        return () => clearTimeout(timer)
    }, [location.pathname, mobileOpen])

    const atividadeSeedData = location.state?.atividadeSeed ?? null
    const isSeedOpen = Boolean(atividadeSeedData)

    const handleLogout = async () => {
        await supabase.auth.signOut()
        navigate('/login', { replace: true })
    }

    const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Usuário'
    const displayEmail = user?.email || ''
    const avatarUrl = user?.user_metadata?.avatar_url || null
    const analytics = useWorkspaceAnalytics(user?.id || null)
    const analyticsValue = useMemo(() => ({ ...analytics, user }), [analytics, user])
    const pulseToneClass = getPulseToneClass(analytics.summary.pulse.level)
    const notificationCount = analytics.summary.notifications.total
    const handleRefreshWorkspace = () => {
        analytics.refresh()
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event('workspace-refresh-request'))
        }
    }
    const workspaceItemsWithBadges = useMemo(
        () =>
            workspaceItems.map((item) => {
                if (item.path === '/projetos') {
                    return { ...item, badge: analytics.summary.counts.projectActive }
                }
                if (item.path === '/tarefas') {
                    return { ...item, badge: analytics.summary.counts.operationalTotal }
                }
                if (item.path === '/reports') {
                    return { ...item, badge: analytics.summary.risks.alertCount }
                }
                return { ...item, badge: null }
            }),
        [analytics.summary.counts.operationalTotal, analytics.summary.counts.projectActive, analytics.summary.risks.alertCount]
    )
    const cadastroItemsWithBadges = useMemo(
        () =>
            favoriteItems.map((item) => {
                if (item.path === '/cad-categorias') {
                    return { ...item, badge: analytics.summary.counts.categoriesTotal }
                }
                if (item.path === '/cad-subcategorias') {
                    return { ...item, badge: analytics.summary.counts.subcategoriesTotal }
                }
                if (item.path === '/cad-participantes') {
                    return { ...item, badge: analytics.summary.counts.participantsTotal }
                }
                return { ...item, badge: null }
            }),
        [
            analytics.summary.counts.categoriesTotal,
            analytics.summary.counts.participantsTotal,
            analytics.summary.counts.subcategoriesTotal,
        ]
    )
    const headerMetrics = [
        { label: 'Ativos', value: analytics.summary.counts.activeTotal },
        { label: 'Alertas', value: analytics.summary.risks.alertCount },
        {
            label: 'Portfolio',
            value: `${analytics.summary.projects.epics}/${analytics.summary.projects.features}/${analytics.summary.projects.userStories}`,
        },
    ]

    // Build breadcrumb from pathname
    const pathSegments = location.pathname.split('/').filter(Boolean)
    const breadcrumbs = pathSegments.map((seg, i) => ({
        label: seg.charAt(0).toUpperCase() + seg.slice(1),
        isLast: i === pathSegments.length - 1,
    }))

    return (
        <DashboardAnalyticsContext.Provider value={analyticsValue}>
            <div className="flex h-screen overflow-hidden bg-zen-bg text-zen-text font-body antialiased selection:bg-zen-blue/30 selection:text-white">
            <style>{`
        /* Zen scrollbar */
        .zen-scroll::-webkit-scrollbar { width: 8px; height: 8px; }
        .zen-scroll::-webkit-scrollbar-track { background: #0F1012; }
        .zen-scroll::-webkit-scrollbar-thumb { background: #27272A; border-radius: 4px; }
        .zen-scroll::-webkit-scrollbar-thumb:hover { background: #3B82F6; }
        .zen-no-scrollbar::-webkit-scrollbar { display: none; }
        .zen-no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

            {/* Mobile overlay */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
          ${collapsed ? 'w-[72px]' : 'w-[260px]'} flex-shrink-0 border-r border-zen-border bg-zen-sidebar flex flex-col h-full
          fixed top-0 left-0 z-50 transition-all duration-300
          ${mobileOpen ? 'translate-x-0 !w-[260px]' : '-translate-x-full'}
          md:translate-x-0 md:relative
        `}
            >
                {/* Sidebar Header */}
                <div className="h-16 flex items-center justify-between px-4 border-b border-zen-border">
                    <div className={`flex items-center gap-3 ${collapsed && !mobileOpen ? 'justify-center w-full' : ''}`}>
                        <div className="size-10 flex items-center justify-center shrink-0">
                            <img src={logominimal} alt="FlowZenit" className="h-7 w-7 object-contain" />
                        </div>
                        {(!collapsed || mobileOpen) && (
                            <div className="min-w-0">
                                <h1 className="text-white font-display font-bold text-lg tracking-tight">FlowZenit</h1>
                            </div>
                        )}
                    </div>
                    {/* Close on mobile */}
                    {mobileOpen && (
                        <button
                            onClick={() => setMobileOpen(false)}
                            className="md:hidden text-zen-text-sec hover:text-white"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    )}
                </div>

                {/* Sidebar Navigation */}
                <nav className="flex-1 overflow-y-auto py-6 px-3 flex flex-col gap-6 zen-scroll">
                    {/* Workspace Group */}
                    <div className="flex flex-col gap-1">
                        {(!collapsed || mobileOpen) && (
                            <div className="text-xs font-medium text-zen-text-tri px-3 uppercase tracking-wider mb-2">Workspace</div>
                        )}
                        {workspaceItemsWithBadges.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                end={item.path === '/dashboard'}
                                title={collapsed && !mobileOpen ? item.label : undefined}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors group ${
                                        collapsed && !mobileOpen ? 'justify-center' : ''
                                    } ${
                                        isActive
                                            ? 'bg-zen-blue/10 text-zen-blue'
                                            : 'text-zen-text-sec hover:bg-zen-surface-hl hover:text-white'
                                    }`
                                }
                            >
                                <item.icon className="h-5 w-5 shrink-0" />
                                {(!collapsed || mobileOpen) && (
                                    <>
                                        <span className="flex-1">{item.label}</span>
                                        {item.badge > 0 && (
                                            <span className="rounded-md border border-zen-border bg-zen-bg px-2 py-0.5 text-[10px] text-white">
                                                {item.badge}
                                            </span>
                                        )}
                                    </>
                                )}
                            </NavLink>
                        ))}
                    </div>

                    {(!collapsed || mobileOpen) && (
                        <div className="flex flex-col gap-1">
                            <div className="text-xs font-medium text-zen-text-tri px-3 uppercase tracking-wider mb-2">BOXES</div>
                            {boxesItems.map((item) => (
                                <NavLink
                                    key={item.label}
                                    to={item.path}
                                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-zen-text-sec hover:bg-zen-surface-hl hover:text-white transition-colors text-sm font-medium"
                                >
                                    <item.icon className="h-4 w-4 shrink-0" />
                                    <span>{item.label}</span>
                                </NavLink>
                            ))}
                        </div>
                    )}

                    {/* Favorites Group */}
                    {(!collapsed || mobileOpen) && (
                        <div className="flex flex-col gap-1">
                            <div className="text-xs font-medium text-zen-text-tri px-3 uppercase tracking-wider mb-2">Cadastros</div>
                            {cadastroItemsWithBadges.map((item) => (
                                <NavLink
                                    key={item.label}
                                    to={item.path}
                                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-zen-text-sec hover:bg-zen-surface-hl hover:text-white transition-colors text-sm font-medium"
                                >
                                    <span className={`w-2 h-2 rounded-full ${item.color}`} />
                                    <span className="flex-1">{item.label}</span>
                                    {item.badge > 0 && (
                                        <span className="rounded-md border border-zen-border bg-zen-bg px-2 py-0.5 text-[10px] text-white">
                                            {item.badge}
                                        </span>
                                    )}
                                </NavLink>
                            ))}
                        </div>
                    )}

                    {/* New Item button */}
                    <div className="mt-auto px-0 space-y-2">
                        <button
                            onClick={() => setAtividadeModalOpen(true)}
                            className={`bg-zen-blue hover:bg-blue-600 text-white text-sm font-bold py-1.5 rounded shadow-lg shadow-blue-900/20 transition-all flex items-center gap-2 w-full justify-center ${
                                collapsed && !mobileOpen ? 'px-2' : 'px-4'
                            }`}
                            title={collapsed && !mobileOpen ? 'Novo Item' : undefined}
                        >
                            <Plus className="h-4 w-4 shrink-0" />
                            {(!collapsed || mobileOpen) && <span>Novo Item</span>}
                        </button>
                        {(!collapsed || mobileOpen) && (
                            <button
                                type="button"
                                onClick={handleRefreshWorkspace}
                                className="w-full rounded-lg border border-zen-border bg-zen-surface px-3 py-2 text-sm text-zen-text-sec transition-colors hover:bg-zen-surface-hl hover:text-white"
                            >
                                <span className="inline-flex items-center gap-2">
                                    <RefreshCw className={`h-4 w-4 ${analytics.refreshing ? 'animate-spin' : ''}`} />
                                    Atualizar indicadores
                                </span>
                            </button>
                        )}
                    </div>
                </nav>

                {/* Sidebar Footer - User */}
                <div className="p-3 border-t border-zen-border">
                    <div className={`flex items-center gap-3 w-full p-2 rounded-lg hover:bg-zen-surface-hl transition-colors group ${collapsed && !mobileOpen ? 'justify-center' : ''
                        }`}>
                        {avatarUrl ? (
                            <img
                                src={avatarUrl}
                                alt={displayName}
                                className="rounded-full size-8 border border-zen-border object-cover shrink-0"
                            />
                        ) : (
                            <div className="size-8 rounded-full bg-gradient-to-br from-zen-blue to-indigo-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
                                {displayName.charAt(0).toUpperCase()}
                            </div>
                        )}
                        {(!collapsed || mobileOpen) && (
                            <>
                                <div className="flex flex-col flex-1 min-w-0">
                                    <span className="text-sm font-medium text-white truncate group-hover:text-zen-blue transition-colors">{displayName}</span>
                                    <span className="text-xs text-zen-text-sec truncate">{displayEmail}</span>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="text-zen-text-tri hover:text-zen-error transition-colors"
                                    title="Sair"
                                >
                                    <LogOut className="h-[18px] w-[18px]" />
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0 bg-zen-bg">
                {/* Header */}
                <header className="min-h-16 flex items-center justify-between px-6 py-3 border-b border-zen-border bg-zen-bg/80 backdrop-blur-md sticky top-0 z-20">
                    {/* Left: hamburger + breadcrumbs */}
                    <div className="flex items-center gap-3 min-w-0">
                        <button
                            onClick={() => setMobileOpen(true)}
                            className="md:hidden p-1.5 rounded-lg text-zen-text-sec hover:bg-zen-surface-hl hover:text-white transition-colors"
                        >
                            <Menu className="h-5 w-5" />
                        </button>
                        {!mobileOpen && (
                            <button
                                onClick={() => setCollapsed(!collapsed)}
                                className="hidden md:flex text-zen-text-tri hover:text-white transition-colors p-1 rounded hover:bg-zen-surface-hl"
                                title={collapsed ? 'Expandir sidebar' : 'Minimizar sidebar'}
                            >
                                {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
                            </button>
                        )}
                        <div className="min-w-0">
                            <nav className="flex items-center gap-2 text-sm min-w-0">
                                {breadcrumbs.map((crumb, i) => (
                                    <span key={i} className="flex items-center gap-2 min-w-0">
                                        {i > 0 && <span className="text-zen-text-tri">/</span>}
                                        <span className={crumb.isLast ? 'text-white font-display font-medium truncate' : 'text-zen-text-sec font-display truncate'}>
                                            {crumb.label}
                                        </span>
                                    </span>
                                ))}
                            </nav>
                            <div className="mt-1 text-xs text-zen-text-sec truncate">{analytics.summary.headline}</div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="hidden xl:flex items-center gap-2">
                            {headerMetrics.map((item) => (
                                <LayoutMetricPill
                                    key={item.label}
                                    label={item.label}
                                    value={item.value}
                                    tone={item.label === 'Alertas' && Number(item.value) > 0 ? pulseToneClass : 'border-zen-border bg-zen-surface text-white'}
                                />
                            ))}
                        </div>

                        <div className="relative group hidden sm:block">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-4 w-4 text-zen-text-tri" />
                            </div>
                            <input
                                className="bg-zen-surface border border-transparent focus:border-zen-border rounded-lg py-1.5 pl-10 pr-12 text-sm text-white placeholder-zen-text-tri w-64 focus:ring-0 focus:outline-none transition-all hover:bg-zen-surface-hl font-body"
                                placeholder="Buscar..."
                                type="text"
                            />
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                <span className="text-xs text-zen-text-tri bg-zen-surface-hl px-1.5 py-0.5 rounded border border-zen-border">⌘K</span>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={handleRefreshWorkspace}
                            className="hidden sm:inline-flex items-center gap-2 rounded-lg border border-zen-border px-3 py-2 text-sm text-zen-text-sec transition-colors hover:bg-zen-surface-hl hover:text-white"
                            title="Atualizar indicadores"
                        >
                            <RefreshCw className={`h-4 w-4 ${analytics.refreshing ? 'animate-spin' : ''}`} />
                            <span className="hidden lg:inline">Atualizar</span>
                        </button>

                        <button className="relative p-2 text-zen-text-sec hover:text-white rounded-lg hover:bg-zen-surface-hl transition-colors">
                            <Bell className="h-5 w-5" />
                            {notificationCount > 0 && (
                                <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-rose-500 text-[10px] font-semibold text-white flex items-center justify-center border border-zen-bg">
                                    {notificationCount}
                                </span>
                            )}
                        </button>
                    </div>
                </header>

                {/* Page content */}
                <div className="flex-1 overflow-y-auto zen-scroll">
                    <Outlet />
                </div>
            </main>

            {/* Modal Cadastro de Atividades */}
            <CadAtividades
                open={atividadeModalOpen || isSeedOpen}
                onClose={() => {
                    setAtividadeModalOpen(false)
                    if (isSeedOpen) {
                        navigate(location.pathname, { replace: true })
                    }
                }}
                onSaved={handleRefreshWorkspace}
                seedData={atividadeSeedData}
            />
            </div>
        </DashboardAnalyticsContext.Provider>
    )
}

export default AreaLogadaLayout
