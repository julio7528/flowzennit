import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase.js'
import {
    FolderOpen,
    Tag,
    CheckCircle2,
    Clock,
    TrendingUp,
    ArrowUpRight,
    Activity,
    Zap,
    ChevronRight,
    Calendar,
    GitBranch,
    Users,
} from 'lucide-react'

const StatCard = ({ icon, label, value, change, color, leading }) => {
    const Icon = icon
    return (
        <div className="bg-zen-surface hover:bg-zen-surface-hl border border-zen-border p-5 rounded-lg transition-all group cursor-default">
            <div className="flex items-center justify-between mb-3">
                {leading || (
                    <div
                        className="size-10 rounded-lg flex items-center justify-center transition-colors"
                        style={{ background: `${color}20`, color }}
                    >
                        <Icon className="h-5 w-5" />
                    </div>
                )}
                {typeof change === 'string' && change && (
                    <span className="flex items-center gap-0.5 text-xs font-medium text-zen-success">
                        <ArrowUpRight className="h-3 w-3" />
                        {change}
                    </span>
                )}
                {typeof change !== 'string' && change}
            </div>
            <p className="text-2xl font-bold text-zen-text font-display tracking-tight">{value}</p>
            <p className="text-xs text-zen-text-sec mt-1">{label}</p>
        </div>
    )
}

const ActivityItem = ({ title, time, tag, tagColor }) => (
    <div className="flex items-start gap-3 py-3 border-b border-zen-border last:border-0 group">
        <div className={`size-2 rounded-full mt-1.5 shrink-0 ${tagColor}`} />
        <div className="flex-1 min-w-0">
            <p className="text-sm text-zen-text group-hover:text-white transition-colors leading-snug">{title}</p>
            <div className="flex items-center gap-2 mt-1">
                {tag && (
                    <span className="px-2 py-0.5 rounded bg-zen-bg border border-zen-border text-[10px] text-zen-text-sec font-medium uppercase tracking-wider">{tag}</span>
                )}
                <span className="text-xs text-zen-text-tri font-body">{time}</span>
            </div>
        </div>
    </div>
)

const QuickAction = ({ icon, label, color }) => {
    const Icon = icon
    return (
        <button className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-zen-text-sec hover:bg-zen-surface-hl hover:text-white transition-colors text-sm font-medium group text-left">
            <div
                className="size-8 rounded-lg flex items-center justify-center transition-colors"
                style={{ background: `${color}15`, color }}
            >
                <Icon className="h-4 w-4" />
            </div>
            <span>{label}</span>
            <ChevronRight className="h-4 w-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-zen-text-tri" />
        </button>
    )
}

const DashboardHome = () => {
    const [displayName, setDisplayName] = useState('Usuário')
    const [userId, setUserId] = useState(null)
    const [categoriasTotal, setCategoriasTotal] = useState('0')
    const [categoriasMes, setCategoriasMes] = useState('0')
    const [subcategoriasTotal, setSubcategoriasTotal] = useState('0')
    const [subcategoriasMes, setSubcategoriasMes] = useState('0')
    const [participantesTotal, setParticipantesTotal] = useState('0')
    const [ultimoParticipante, setUltimoParticipante] = useState(null)

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => {
            setUserId(data.user?.id || null)
            const name = data.user?.user_metadata?.full_name || data.user?.email?.split('@')[0] || 'Usuário'
            setDisplayName(name)
        })
    }, [])

    useEffect(() => {
        if (!userId) return
        const loadCategoriasStats = async () => {
            const { count: totalCount, error: totalError } = await supabase
                .from('tbf_categorias')
                .select('id', { count: 'exact' })
                .eq('idusuario', userId)
                .limit(1)

            const now = new Date()
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
            const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1)

            const { count: monthCount, error: monthError } = await supabase
                .from('tbf_categorias')
                .select('id', { count: 'exact' })
                .eq('idusuario', userId)
                .gte('created_at', startOfMonth.toISOString())
                .lt('created_at', startOfNextMonth.toISOString())
                .limit(1)

            const { count: subTotalCount, error: subTotalError } = await supabase
                .from('tbf_subcategorias')
                .select('id', { count: 'exact' })
                .eq('idusuario', userId)
                .limit(1)

            const { count: subMonthCount, error: subMonthError } = await supabase
                .from('tbf_subcategorias')
                .select('id', { count: 'exact' })
                .eq('idusuario', userId)
                .gte('created_at', startOfMonth.toISOString())
                .lt('created_at', startOfNextMonth.toISOString())
                .limit(1)

            const { count: participantsCount, error: participantsError } = await supabase
                .from('tbf_participantes')
                .select('id', { count: 'exact' })
                .eq('idusuario', userId)
                .limit(1)

            const { data: lastParticipant, error: lastParticipantError } = await supabase
                .from('tbf_participantes')
                .select('nomeparticipante, fotobase64, created_at')
                .eq('idusuario', userId)
                .order('created_at', { ascending: false })
                .limit(1)
                .maybeSingle()

            if (totalError || monthError || subTotalError || subMonthError || participantsError || lastParticipantError) {
                setCategoriasTotal('0')
                setCategoriasMes('0')
                setSubcategoriasTotal('0')
                setSubcategoriasMes('0')
                setParticipantesTotal('0')
                setUltimoParticipante(null)
                return
            }

            setCategoriasTotal(String(totalCount ?? 0))
            setCategoriasMes(String(monthCount ?? 0))
            setSubcategoriasTotal(String(subTotalCount ?? 0))
            setSubcategoriasMes(String(subMonthCount ?? 0))
            setParticipantesTotal(String(participantsCount ?? 0))
            setUltimoParticipante(lastParticipant || null)
        }

        loadCategoriasStats()
    }, [userId])

    const hour = new Date().getHours()
    const greeting = hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite'
    const firstName = ultimoParticipante?.nomeparticipante?.trim()?.split(' ').filter(Boolean)[0]

    return (
        <div className="p-6 flex flex-col gap-6 max-w-7xl">
            {/* Header area */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-display font-semibold text-white tracking-tight">
                        {greeting}, {displayName}
                    </h1>
                    <p className="text-sm text-zen-text-sec mt-0.5">Aqui está o resumo do seu espaço de trabalho.</p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    icon={Tag}
                    label="Categorias cadastradas"
                    value={categoriasTotal}
                    change={`${categoriasMes} no mês`}
                    color="#3B82F6"
                />
                <StatCard
                    icon={CheckCircle2}
                    label="Subcategorias cadastradas"
                    value={subcategoriasTotal}
                    change={`${subcategoriasMes} no mês`}
                    color="#10B981"
                />
                <StatCard
                    icon={Clock}
                    label="Participantes cadastrados"
                    value={participantesTotal}
                    leading={
                        ultimoParticipante ? (
                            <div className="size-10 rounded-full border border-zen-border overflow-hidden flex items-center justify-center bg-zen-bg text-xs text-zen-text-sec">
                                {ultimoParticipante.fotobase64 ? (
                                    <img src={ultimoParticipante.fotobase64} alt={ultimoParticipante.nomeparticipante} className="h-full w-full object-cover" />
                                ) : (
                                    firstName?.slice(0, 1) || '—'
                                )}
                            </div>
                        ) : (
                            <div className="size-10 rounded-full border border-zen-border overflow-hidden flex items-center justify-center bg-zen-bg text-xs text-zen-text-sec">
                                —
                            </div>
                        )
                    }
                    change={
                        ultimoParticipante ? (
                            <span className="flex items-center gap-0.5 text-xs font-medium text-zen-success ml-auto text-right">
                                Novo Participante: {firstName || '—'}
                            </span>
                        ) : (
                            <span className="flex items-center gap-0.5 text-xs font-medium text-zen-success ml-auto text-right">
                                Novo Participante: —
                            </span>
                        )
                    }
                    color="#A855F7"
                />
                <StatCard
                    icon={TrendingUp}
                    label="Produtividade"
                    value="87%"
                    change="+5%"
                    color="#F59E0B"
                />
            </div>

            {/* Content Grid */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* Recent Activity */}
                <div className="lg:col-span-2 bg-zen-surface border border-zen-border rounded-lg">
                    <div className="flex items-center justify-between px-5 py-4 border-b border-zen-border">
                        <div className="flex items-center gap-2">
                            <Activity className="h-4 w-4 text-zen-blue" />
                            <h2 className="font-display font-medium text-sm text-white tracking-wide">Atividade Recente</h2>
                        </div>
                        <button className="text-xs text-zen-text-tri hover:text-zen-blue transition-colors font-medium">
                            Ver tudo →
                        </button>
                    </div>
                    <div className="px-5 py-2">
                        <ActivityItem
                            title="Novo item criado: Flowzenit v2"
                            time="2h atrás"
                            tag="Projeto"
                            tagColor="bg-zen-blue"
                        />
                        <ActivityItem
                            title="Tarefa 'Setup Dashboard' concluída"
                            time="4h atrás"
                            tag="Tarefa"
                            tagColor="bg-zen-success"
                        />
                        <ActivityItem
                            title="Calendário atualizado com sprint review"
                            time="6h atrás"
                            tag="Calendar"
                            tagColor="bg-indigo-500"
                        />
                        <ActivityItem
                            title="Prazo do projeto ServCasa se aproximando"
                            time="1d atrás"
                            tag="Alerta"
                            tagColor="bg-yellow-500"
                        />
                        <ActivityItem
                            title="Nova integração configurada: Supabase Auth"
                            time="2d atrás"
                            tag="Config"
                            tagColor="bg-zen-text-tri"
                        />
                    </div>
                </div>

                {/* Quick Actions + Status */}
                <div className="flex flex-col gap-6">
                    {/* Quick Actions */}
                    <div className="bg-zen-surface border border-zen-border rounded-lg">
                        <div className="flex items-center gap-2 px-5 py-4 border-b border-zen-border">
                            <Zap className="h-4 w-4 text-amber-500" />
                            <h2 className="font-display font-medium text-sm text-white tracking-wide">Ações Rápidas</h2>
                        </div>
                        <div className="p-3 flex flex-col gap-0.5">
                            <QuickAction icon={FolderOpen} label="Novo Projeto" color="#3B82F6" />
                            <QuickAction icon={CheckCircle2} label="Nova Tarefa" color="#10B981" />
                            <QuickAction icon={Calendar} label="Agendar Evento" color="#A855F7" />
                            <QuickAction icon={GitBranch} label="Nova Branch" color="#F59E0B" />
                            <QuickAction icon={Users} label="Convidar Membro" color="#EC4899" />
                        </div>
                    </div>

                    {/* System Status */}
                    <div className="bg-zen-surface border border-zen-border rounded-lg p-5">
                        <div className="text-xs font-medium text-zen-text-tri uppercase tracking-wider mb-4">Status do Sistema</div>
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-zen-success opacity-75" />
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-zen-success" />
                                    </span>
                                    <span className="text-sm text-zen-text-sec">API</span>
                                </div>
                                <span className="text-xs text-zen-success font-medium">Operacional</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="relative flex h-2 w-2">
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-zen-success" />
                                    </span>
                                    <span className="text-sm text-zen-text-sec">Database</span>
                                </div>
                                <span className="text-xs text-zen-success font-medium">Operacional</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="relative flex h-2 w-2">
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-zen-success" />
                                    </span>
                                    <span className="text-sm text-zen-text-sec">Auth</span>
                                </div>
                                <span className="text-xs text-zen-success font-medium">Operacional</span>
                            </div>
                            <div className="mt-2 pt-3 border-t border-zen-border flex items-center justify-between">
                                <span className="text-xs text-zen-text-tri">Última verificação</span>
                                <span className="text-xs text-zen-text-sec">Agora mesmo</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DashboardHome
