import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase.js'
import { Pencil, Trash2, Plus, X, Loader2 } from 'lucide-react'

const CadCategorias = () => {
    const [userId, setUserId] = useState(null)
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [formOpen, setFormOpen] = useState(false)
    const [editingId, setEditingId] = useState(null)
    const [nomecategoria, setNomecategoria] = useState('')
    const [corcategoria, setCorcategoria] = useState('#3B82F6')
    const [feedback, setFeedback] = useState(null)

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => {
            setUserId(data.user?.id || null)
        })
    }, [])

    // Faz o feedback desaparecer automaticamente após 4 segundos (UX)
    useEffect(() => {
        if (feedback) {
            const timer = setTimeout(() => setFeedback(null), 4000)
            return () => clearTimeout(timer)
        }
    }, [feedback])

    const loadCategories = async (currentUserId) => {
        setLoading(true)
        const { data, error } = await supabase
            .from('tbf_categorias')
            .select('id, nomecategoria, corcategoria')
            .eq('idusuario', currentUserId)
            .order('nomecategoria', { ascending: true })
        if (error) {
            setFeedback({ type: 'error', message: 'Não foi possível carregar as categorias.' })
            setCategories([])
        } else {
            setCategories(data || [])
        }
        setLoading(false)
    }

    useEffect(() => {
        if (!userId) return
        const timer = setTimeout(() => {
            loadCategories(userId)
        }, 0)
        return () => clearTimeout(timer)
    }, [userId])

    const resetForm = () => {
        setEditingId(null)
        setNomecategoria('')
        setCorcategoria('#3B82F6')
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        if (!userId) return
        if (!nomecategoria.trim()) {
            setFeedback({ type: 'error', message: 'Informe o nome da categoria.' })
            return
        }
        setSaving(true)
        if (editingId) {
            const { error } = await supabase
                .from('tbf_categorias')
                .update({ nomecategoria: nomecategoria.trim(), corcategoria })
                .eq('id', editingId)
                .eq('idusuario', userId)
            if (error) {
                setFeedback({ type: 'error', message: 'Não foi possível atualizar a categoria.' })
                setSaving(false)
                return
            }
            setFeedback({ type: 'success', message: 'Categoria atualizada com sucesso.' })
        } else {
            const { error } = await supabase.from('tbf_categorias').insert({
                idusuario: userId,
                nomecategoria: nomecategoria.trim(),
                corcategoria,
            })
            if (error) {
                setFeedback({ type: 'error', message: 'Não foi possível cadastrar a categoria.' })
                setSaving(false)
                return
            }
            setFeedback({ type: 'success', message: 'Categoria cadastrada com sucesso.' })
        }
        await loadCategories(userId)
        setSaving(false)
        resetForm()
        setFormOpen(false)
    }

    const handleEdit = (category) => {
        setEditingId(category.id)
        setNomecategoria(category.nomecategoria)
        setCorcategoria(category.corcategoria)
        setFormOpen(true)
    }

    const handleDelete = async (categoryId) => {
        if (!userId) return
        const confirmed = window.confirm('Deseja excluir esta categoria?')
        if (!confirmed) return
        const { error } = await supabase
            .from('tbf_categorias')
            .delete()
            .eq('id', categoryId)
            .eq('idusuario', userId)
        if (error) {
            setFeedback({ type: 'error', message: 'Não foi possível excluir a categoria.' })
            return
        }
        setFeedback({ type: 'success', message: 'Categoria excluída com sucesso.' })
        await loadCategories(userId)
    }

    return (
        <div className="p-6 flex flex-col gap-6 max-w-6xl mx-auto w-full animate-in fade-in duration-300">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl font-display font-semibold text-white tracking-tight">Cadastro de Categorias</h1>
                    <p className="text-sm text-zen-text-sec mt-0.5">Crie e gerencie as categorias do sistema.</p>
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
                    {formOpen ? 'Fechar' : 'Nova Categoria'}
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
                    className="bg-zen-surface border border-zen-border rounded-xl p-6 flex flex-col gap-5 shadow-sm animate-in fade-in slide-in-from-top-4 duration-300"
                >
                    <div className="grid grid-cols-1 md:grid-cols-[1fr_200px] gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-semibold text-zen-text-tri uppercase tracking-wider">Nome da Categoria</label>
                            <input
                                value={nomecategoria}
                                onChange={(event) => setNomecategoria(event.target.value)}
                                className="bg-zen-bg border border-zen-border rounded-lg py-2.5 px-3 text-sm text-white focus:border-zen-blue focus:ring-1 focus:ring-zen-blue outline-none transition-all"
                                placeholder="Ex: Atendimento, Suporte, Vendas..."
                                autoFocus
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-semibold text-zen-text-tri uppercase tracking-wider">Cor</label>
                            <div className="flex items-center gap-3 bg-zen-bg border border-zen-border rounded-lg p-1.5 pr-4 transition-all focus-within:border-zen-blue">
                                <input
                                    type="color"
                                    value={corcategoria}
                                    onChange={(event) => setCorcategoria(event.target.value)}
                                    className="h-8 w-12 rounded cursor-pointer border-0 bg-transparent p-0 [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none [&::-webkit-color-swatch]:rounded"
                                />
                                <span className="text-sm font-medium text-zen-text-sec uppercase tracking-wider">{corcategoria}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 pt-2">
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex items-center justify-center min-w-[120px] bg-zen-blue hover:bg-blue-600 text-white text-sm font-semibold py-2.5 px-5 rounded-lg shadow-lg shadow-blue-900/20 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : editingId ? 'Atualizar' : 'Salvar Categoria'}
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
                    <h2 className="font-display font-medium text-sm text-white tracking-wide">Categorias Cadastradas</h2>
                </div>
                
                <div className="divide-y divide-zen-border/50">
                    {/* Table Header */}
                    <div className="grid grid-cols-[80px_1fr_100px] gap-4 px-6 py-3 text-xs font-semibold text-zen-text-tri uppercase tracking-wider bg-zen-bg/30">
                        <span>Cor</span>
                        <span>Nome</span>
                        <span className="text-right">Ações</span>
                    </div>

                    {/* Table Body */}
                    {loading ? (
                        <div className="flex items-center justify-center gap-3 px-6 py-12 text-sm text-zen-text-sec">
                            <Loader2 className="w-5 h-5 animate-spin text-zen-blue" />
                            Carregando categorias...
                        </div>
                    ) : categories.length === 0 ? (
                        <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
                            <div className="w-12 h-12 rounded-full bg-zen-border/30 flex items-center justify-center mb-3">
                                <span className="text-2xl">📁</span>
                            </div>
                            <p className="text-sm text-white font-medium">Nenhuma categoria encontrada.</p>
                            <p className="text-sm text-zen-text-sec mt-1">Clique em "Nova Categoria" para começar a organizar.</p>
                        </div>
                    ) : (
                        categories.map((category) => (
                            <div 
                                key={category.id} 
                                className="grid grid-cols-[80px_1fr_100px] gap-4 px-6 py-3.5 items-center hover:bg-white/[0.02] transition-colors group"
                            >
                                <div className="flex items-center">
                                    <span
                                        className="size-4 rounded-full shadow-sm ring-1 ring-white/10"
                                        style={{ backgroundColor: category.corcategoria }}
                                    />
                                </div>
                                <span className="text-sm font-medium text-white/90 group-hover:text-white transition-colors">
                                    {category.nomecategoria}
                                </span>
                                <div className="flex items-center justify-end gap-1">
                                    <button
                                        onClick={() => handleEdit(category)}
                                        className="p-2 text-zen-text-tri hover:text-white hover:bg-zen-border/50 rounded-md transition-all"
                                        title="Editar"
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(category.id)}
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

export default CadCategorias