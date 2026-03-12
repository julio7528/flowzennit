import { useCallback, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Loader2, CornerUpLeft } from 'lucide-react'
import { supabase } from '../../lib/supabase.js'

const BOX_CONFIG = {
    '/boxes/stuff': {
        titulo: 'Stuff',
        alocado: 'Stuff',
        listaTitulo: 'Lista de Stuff',
    },
    '/boxes/trash': {
        titulo: 'Trash',
        alocado: 'Trash',
        listaTitulo: 'Lista de Trash',
    },
    '/boxes/algum-dia': {
        titulo: 'Algum dia / Talvez',
        alocado: 'Incubado',
        listaTitulo: 'Lista de Incubado',
    },
    '/boxes/referencia': {
        titulo: 'Referencia Futura',
        alocado: 'Referencia',
        listaTitulo: 'Lista de Referencia',
    },
}

const Stuff = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const [userId, setUserId] = useState(null)
    const [atividades, setAtividades] = useState([])
    const [loading, setLoading] = useState(true)
    const [feedback, setFeedback] = useState(null)
    const currentBox = BOX_CONFIG[location.pathname] || BOX_CONFIG['/boxes/stuff']

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => {
            setUserId(data.user?.id || null)
        })
    }, [])

    useEffect(() => {
        if (feedback) {
            const timer = setTimeout(() => setFeedback(null), 4000)
            return () => clearTimeout(timer)
        }
    }, [feedback])

    const loadStuff = useCallback(async (currentUserId) => {
        setLoading(true)

        const { data, error } = await supabase
            .from('tbf_atividades')
            .select('id, nometarefa, descricao, created_at')
            .eq('idusuario', currentUserId)
            .eq('alocado', currentBox.alocado)
            .order('created_at', { ascending: false })

        if (error) {
            setFeedback({ type: 'error', message: `Nao foi possivel carregar os registros de ${currentBox.titulo}.` })
            setAtividades([])
        } else {
            setAtividades(data || [])
        }

        setLoading(false)
    }, [currentBox.alocado, currentBox.titulo])

    useEffect(() => {
        if (!userId) return
        const timer = setTimeout(() => {
            loadStuff(userId)
        }, 0)
        return () => clearTimeout(timer)
    }, [loadStuff, location.state?.refreshKey, userId])

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

    const handleActivate = async (atividade) => {
        if (!userId) {
            setFeedback({ type: 'error', message: 'Usuario nao autenticado para carregar a atividade.' })
            return
        }
        console.log('[Stuff] Ativando atividade:', atividade)
        const deleted = await handleDelete(atividade)
        if (!deleted) return
        navigate('/dashboard', {
            state: {
                atividadeSeed: {
                    nometarefa: atividade.nometarefa,
                    descricao: atividade.descricao,
                },
            },
        })
    }

    const handleDelete = async (atividade) => {
        setLoading(true)
        setFeedback({ type: 'success', message: `Excluindo registro ${atividade.id}...` })
        const { error: deleteError } = await supabase
            .from('tbf_atividades')
            .delete()
            .eq('id', atividade.id)
            .eq('idusuario', userId)
        if (deleteError) {
            setFeedback({ type: 'error', message: `Falha ao excluir o registro ${atividade.id}.` })
            setLoading(false)
            return false
        }
        setFeedback({ type: 'success', message: `Registro ${atividade.id} excluido com sucesso.` })
        setAtividades((prev) => prev.filter((item) => item.id !== atividade.id))
        setLoading(false)
        return true
    }

    const handleRemove = async (atividade) => {
        if (!userId) {
            setFeedback({ type: 'error', message: 'Usuario nao autenticado para remover a atividade.' })
            return
        }
        const confirmed = window.confirm('Deseja realmente excluir este registro?')
        if (!confirmed) return
        console.log('[Stuff] Removendo atividade:', atividade)
        await handleDelete(atividade)
    }

    return (
        <div className="p-6 flex flex-col gap-6 max-w-6xl mx-auto w-full animate-in fade-in duration-300">
            <div className="flex flex-col gap-1">
                <h1 className="text-xl font-display font-semibold text-white tracking-tight">{currentBox.titulo}</h1>
                <p className="text-sm text-zen-text-sec">Atividades com alocacao em {currentBox.alocado}.</p>
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

            <div className="bg-zen-surface border border-zen-border rounded-xl overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b border-zen-border bg-zen-surface/50">
                    <h2 className="font-display font-medium text-sm text-white tracking-wide">{currentBox.listaTitulo}</h2>
                </div>

                <div className="divide-y divide-zen-border/50">
                    <div className="grid grid-cols-[1fr_220px_140px] gap-4 px-6 py-3 text-xs font-semibold text-zen-text-tri uppercase tracking-wider bg-zen-bg/30">
                        <span>Nome</span>
                        <span>Data de Inclusao</span>
                        <span />
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center gap-3 px-6 py-12 text-sm text-zen-text-sec">
                            <Loader2 className="w-5 h-5 animate-spin text-zen-blue" />
                            Carregando registros...
                        </div>
                    ) : atividades.length === 0 ? (
                        <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
                            <p className="text-sm text-white font-medium">Nenhum registro encontrado.</p>
                            <p className="text-sm text-zen-text-sec mt-1">Nao ha atividades com alocacao "{currentBox.alocado}".</p>
                        </div>
                    ) : (
                        atividades.map((atividade) => (
                            <div
                                key={atividade.id}
                                className="grid grid-cols-[1fr_220px_140px] gap-4 px-6 py-3.5 items-center hover:bg-white/[0.02] transition-colors"
                            >
                                <span className="text-sm font-medium text-white/90">{atividade.nometarefa || '-'}</span>
                                <span className="text-sm text-zen-text-sec">{formatDate(atividade.created_at)}</span>
                                <div className="flex justify-end gap-2">
                                    <button
                                        type="button"
                                        onClick={() => handleActivate(atividade)}
                                        className="text-sm font-semibold px-3 py-2 rounded-lg border border-zen-border text-zen-text-sec hover:text-white hover:bg-zen-border/30 transition-colors flex items-center gap-2"
                                    >
                                        <CornerUpLeft className="w-4 h-4" />
                                        Ativar
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleRemove(atividade)}
                                        className="text-sm font-semibold px-3 py-2 rounded-lg border border-zen-border text-zen-text-sec hover:text-white hover:bg-zen-border/30 transition-colors"
                                    >
                                        Remover
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}

export default Stuff
