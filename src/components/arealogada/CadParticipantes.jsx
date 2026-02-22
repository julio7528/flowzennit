import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase.js'
import { Pencil, Trash2, Plus, X, Loader2, Upload, Users, Image as ImageIcon } from 'lucide-react'

const CadParticipantes = () => {
    const [userId, setUserId] = useState(null)
    const [participants, setParticipants] = useState([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [formOpen, setFormOpen] = useState(false)
    const [editingId, setEditingId] = useState(null)
    const [nomeparticipante, setNomeparticipante] = useState('')
    const [fotobase64, setFotobase64] = useState('')
    const [imageLoading, setImageLoading] = useState(false)
    const [feedback, setFeedback] = useState(null)

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => {
            setUserId(data.user?.id || null)
        })
    }, [])

    // Faz o feedback desaparecer automaticamente após 4 segundos
    useEffect(() => {
        if (feedback) {
            const timer = setTimeout(() => setFeedback(null), 4000)
            return () => clearTimeout(timer)
        }
    }, [feedback])

    const loadParticipants = async (currentUserId) => {
        setLoading(true)
        const { data, error } = await supabase
            .from('tbf_participantes')
            .select('id, nomeparticipante, fotobase64')
            .eq('idusuario', currentUserId)
            .order('nomeparticipante', { ascending: true })
        if (error) {
            setFeedback({ type: 'error', message: 'Não foi possível carregar os participantes.' })
            setParticipants([])
        } else {
            setParticipants(data || [])
        }
        setLoading(false)
    }

    useEffect(() => {
        if (!userId) return
        const timer = setTimeout(() => {
            loadParticipants(userId)
        }, 0)
        return () => clearTimeout(timer)
    }, [userId])

    const resetForm = () => {
        setEditingId(null)
        setNomeparticipante('')
        setFotobase64('')
    }

    const fileToBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = () => resolve(String(reader.result || ''))
            reader.onerror = () => reject(new Error('Falha ao ler arquivo.'))
            reader.readAsDataURL(file)
        })

    const handleFileChange = async (event) => {
        const file = event.target.files?.[0]
        if (!file) return
        try {
            setImageLoading(true)
            const base64 = await fileToBase64(file)
            setFotobase64(base64)
        } catch {
            setFeedback({ type: 'error', message: 'Não foi possível carregar a imagem.' })
        } finally {
            setImageLoading(false)
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        if (!userId) return
        if (!nomeparticipante.trim()) {
            setFeedback({ type: 'error', message: 'Informe o nome do participante.' })
            return
        }
        setSaving(true)
        if (editingId) {
            const { error } = await supabase
                .from('tbf_participantes')
                .update({
                    nomeparticipante: nomeparticipante.trim(),
                    fotobase64: fotobase64 || null,
                })
                .eq('id', editingId)
                .eq('idusuario', userId)
            if (error) {
                setFeedback({ type: 'error', message: 'Não foi possível atualizar o participante.' })
                setSaving(false)
                return
            }
            setFeedback({ type: 'success', message: 'Participante atualizado com sucesso.' })
        } else {
            const { error } = await supabase.from('tbf_participantes').insert({
                idusuario: userId,
                nomeparticipante: nomeparticipante.trim(),
                fotobase64: fotobase64 || null,
            })
            if (error) {
                setFeedback({ type: 'error', message: 'Não foi possível cadastrar o participante.' })
                setSaving(false)
                return
            }
            setFeedback({ type: 'success', message: 'Participante cadastrado com sucesso.' })
        }
        await loadParticipants(userId)
        setSaving(false)
        resetForm()
        setFormOpen(false)
    }

    const handleEdit = (participant) => {
        setEditingId(participant.id)
        setNomeparticipante(participant.nomeparticipante)
        setFotobase64(participant.fotobase64 || '')
        setFormOpen(true)
    }

    const handleDelete = async (participantId) => {
        if (!userId) return
        const confirmed = window.confirm('Deseja excluir este participante?')
        if (!confirmed) return
        const { error } = await supabase
            .from('tbf_participantes')
            .delete()
            .eq('id', participantId)
            .eq('idusuario', userId)
        if (error) {
            setFeedback({ type: 'error', message: 'Não foi possível excluir o participante.' })
            return
        }
        setFeedback({ type: 'success', message: 'Participante excluído com sucesso.' })
        await loadParticipants(userId)
    }

    const getInitials = (name) => {
        const parts = name.trim().split(' ').filter(Boolean)
        if (!parts.length) return '?'
        if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
        return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
    }

    return (
        <div className="p-6 flex flex-col gap-6 max-w-6xl mx-auto w-full animate-in fade-in duration-300">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl font-display font-semibold text-white tracking-tight">Cadastro de Participantes</h1>
                    <p className="text-sm text-zen-text-sec mt-0.5">Crie e gerencie os participantes do sistema.</p>
                </div>
                <button
                    onClick={() => {
                        if (formOpen) {
                            setFormOpen(false)
                            resetForm()
                        } else {
                            setFormOpen(true)
                        }
                    }}
                    className="flex items-center justify-center gap-2 bg-zen-blue hover:bg-blue-600 text-white text-sm font-semibold py-2.5 px-4 rounded-lg shadow-lg shadow-blue-900/20 transition-all active:scale-95"
                >
                    {formOpen ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    {formOpen ? 'Fechar' : 'Novo Participante'}
                </button>
            </div>

            {/* Feedback Message */}
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

            {/* Form Section */}
            {formOpen && (
                <form 
                    onSubmit={handleSubmit} 
                    className="bg-zen-surface border border-zen-border rounded-xl p-6 flex flex-col gap-6 shadow-sm animate-in fade-in slide-in-from-top-4 duration-300"
                >
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-semibold text-zen-text-tri uppercase tracking-wider">Nome do Participante</label>
                        <input
                            value={nomeparticipante}
                            onChange={(event) => setNomeparticipante(event.target.value)}
                            className="bg-zen-bg border border-zen-border rounded-lg py-2.5 px-3 text-sm text-white focus:border-zen-blue focus:ring-1 focus:ring-zen-blue outline-none transition-all max-w-md"
                            placeholder="Ex: Ana Silva"
                            autoFocus
                        />
                    </div>

                    <div className="flex flex-col gap-3">
                        <label className="text-xs font-semibold text-zen-text-tri uppercase tracking-wider">Imagem do Participante</label>
                        <div className="flex items-center gap-5">
                            {/* Avatar Preview */}
                            <div className="relative size-16 rounded-full border border-zen-border/80 overflow-hidden flex items-center justify-center bg-zen-bg shadow-inner">
                                {fotobase64 ? (
                                    <img src={fotobase64} alt="Prévia" className="h-full w-full object-cover" />
                                ) : (
                                    <span className="text-lg font-medium text-zen-text-sec">
                                        {nomeparticipante ? getInitials(nomeparticipante) : <ImageIcon className="w-6 h-6 opacity-40" />}
                                    </span>
                                )}
                                {imageLoading && (
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                        <Loader2 className="w-5 h-5 text-white animate-spin" />
                                    </div>
                                )}
                            </div>

                            {/* Upload Button */}
                            <label className="flex items-center gap-2 px-4 py-2 bg-zen-bg border border-zen-border hover:border-zen-blue/50 rounded-lg text-sm text-white font-medium cursor-pointer transition-colors hover:bg-white/[0.02]">
                                <Upload className="w-4 h-4 text-zen-text-sec" />
                                Escolher imagem
                                <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                            </label>

                            {fotobase64 && (
                                <button 
                                    type="button" 
                                    onClick={() => setFotobase64('')}
                                    className="text-xs text-zen-text-tri hover:text-zen-error transition-colors"
                                >
                                    Remover
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-3 pt-4 border-t border-zen-border/50">
                        <button
                            type="submit"
                            disabled={saving || imageLoading}
                            className="flex items-center justify-center min-w-[120px] bg-zen-blue hover:bg-blue-600 text-white text-sm font-semibold py-2.5 px-5 rounded-lg shadow-lg shadow-blue-900/20 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : editingId ? 'Atualizar' : 'Salvar Participante'}
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                resetForm()
                                setFormOpen(false)
                            }}
                            className="text-sm font-medium text-zen-text-sec hover:text-white hover:bg-zen-border/30 py-2.5 px-4 rounded-lg transition-colors"
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            )}

            {/* List Section */}
            <div className="bg-zen-surface border border-zen-border rounded-xl overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b border-zen-border bg-zen-surface/50">
                    <h2 className="font-display font-medium text-sm text-white tracking-wide">Participantes Cadastrados</h2>
                </div>
                
                <div className="divide-y divide-zen-border/50">
                    {/* Table Header */}
                    <div className="grid grid-cols-[80px_1fr_100px] gap-4 px-6 py-3 text-xs font-semibold text-zen-text-tri uppercase tracking-wider bg-zen-bg/30">
                        <span>Perfil</span>
                        <span>Nome</span>
                        <span className="text-right">Ações</span>
                    </div>

                    {/* Table Body */}
                    {loading ? (
                        <div className="flex items-center justify-center gap-3 px-6 py-12 text-sm text-zen-text-sec">
                            <Loader2 className="w-5 h-5 animate-spin text-zen-blue" />
                            Carregando participantes...
                        </div>
                    ) : participants.length === 0 ? (
                        <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
                            <div className="w-12 h-12 rounded-full bg-zen-border/30 flex items-center justify-center mb-3">
                                <Users className="w-6 h-6 text-zen-text-sec" />
                            </div>
                            <p className="text-sm text-white font-medium">Nenhum participante encontrado.</p>
                            <p className="text-sm text-zen-text-sec mt-1">Clique em "Novo Participante" para adicionar.</p>
                        </div>
                    ) : (
                        participants.map((participant) => (
                            <div 
                                key={participant.id} 
                                className="grid grid-cols-[80px_1fr_100px] gap-4 px-6 py-3.5 items-center hover:bg-white/[0.02] transition-colors group"
                            >
                                <div className="flex items-center">
                                    <div className="size-9 rounded-full border border-zen-border/80 overflow-hidden flex items-center justify-center bg-zen-bg shadow-sm">
                                        {participant.fotobase64 ? (
                                            <img src={participant.fotobase64} alt={participant.nomeparticipante} className="h-full w-full object-cover" />
                                        ) : (
                                            <span className="text-xs font-medium text-zen-text-sec">
                                                {getInitials(participant.nomeparticipante)}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <span className="text-sm font-medium text-white/90 group-hover:text-white transition-colors">
                                    {participant.nomeparticipante}
                                </span>
                                <div className="flex items-center justify-end gap-1">
                                    <button
                                        onClick={() => handleEdit(participant)}
                                        className="p-2 text-zen-text-tri hover:text-white hover:bg-zen-border/50 rounded-md transition-all"
                                        title="Editar"
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(participant.id)}
                                        className="p-2 text-zen-text-tri hover:text-zen-error hover:bg-zen-error/10 rounded-md transition-all"
                                        title="Excluir"
                                    >
                                        <Trash2 className="h-4 w-4" />
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

export default CadParticipantes