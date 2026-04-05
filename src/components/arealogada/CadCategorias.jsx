import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Loader2, Pencil, Plus, Trash2, X } from 'lucide-react'
import { supabase } from '../../lib/supabase.js'

const CadCategorias = () => {
  const { t } = useTranslation()
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
      setFeedback({ type: 'error', message: t('categories.feedback.loadError') })
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
  }, [userId, t])

  const resetForm = () => {
    setEditingId(null)
    setNomecategoria('')
    setCorcategoria('#3B82F6')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!userId) return

    if (!nomecategoria.trim()) {
      setFeedback({ type: 'error', message: t('categories.feedback.nameRequired') })
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
        setFeedback({ type: 'error', message: t('categories.feedback.updateError') })
        setSaving(false)
        return
      }

      setFeedback({ type: 'success', message: t('categories.feedback.updateSuccess') })
    } else {
      const { error } = await supabase.from('tbf_categorias').insert({
        idusuario: userId,
        nomecategoria: nomecategoria.trim(),
        corcategoria,
      })

      if (error) {
        setFeedback({ type: 'error', message: t('categories.feedback.createError') })
        setSaving(false)
        return
      }

      setFeedback({ type: 'success', message: t('categories.feedback.createSuccess') })
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

    const confirmed = window.confirm(t('categories.feedback.deleteConfirm'))
    if (!confirmed) return

    const { error } = await supabase
      .from('tbf_categorias')
      .delete()
      .eq('id', categoryId)
      .eq('idusuario', userId)

    if (error) {
      setFeedback({ type: 'error', message: t('categories.feedback.deleteError') })
      return
    }

    setFeedback({ type: 'success', message: t('categories.feedback.deleteSuccess') })
    await loadCategories(userId)
  }

  return (
    <div className="flex w-full max-w-none flex-col gap-6 p-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-display font-semibold text-white tracking-tight">{t('categories.title')}</h1>
          <p className="text-sm text-zen-text-sec mt-0.5">{t('categories.description')}</p>
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
          {formOpen ? t('common.close') : t('categories.actions.new')}
        </button>
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

      {formOpen && (
        <form
          onSubmit={handleSubmit}
          className="bg-zen-surface border border-zen-border rounded-xl p-6 flex flex-col gap-5 shadow-sm animate-in fade-in slide-in-from-top-4 duration-300"
        >
          <div className="grid grid-cols-1 md:grid-cols-[1fr_200px] gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-zen-text-tri uppercase tracking-wider">
                {t('categories.form.name')}
              </label>
              <input
                value={nomecategoria}
                onChange={(event) => setNomecategoria(event.target.value)}
                className="bg-zen-bg border border-zen-border rounded-lg py-2.5 px-3 text-sm text-white focus:border-zen-blue focus:ring-1 focus:ring-zen-blue outline-none transition-all"
                placeholder={t('categories.form.namePlaceholder')}
                autoFocus
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-zen-text-tri uppercase tracking-wider">
                {t('categories.form.color')}
              </label>
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
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : editingId ? t('categories.actions.update') : t('categories.actions.save')}
            </button>
            <button
              type="button"
              onClick={() => {
                resetForm()
                setFormOpen(false)
              }}
              className="text-sm font-medium text-zen-text-sec hover:text-white hover:bg-zen-border/30 py-2.5 px-4 rounded-lg transition-colors"
            >
              {t('common.cancel')}
            </button>
          </div>
        </form>
      )}

      <div className="bg-zen-surface border border-zen-border rounded-xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-zen-border bg-zen-surface/50">
          <h2 className="font-display font-medium text-sm text-white tracking-wide">{t('categories.list.title')}</h2>
        </div>

        <div className="divide-y divide-zen-border/50">
          <div className="grid grid-cols-[80px_1fr_100px] gap-4 px-6 py-3 text-xs font-semibold text-zen-text-tri uppercase tracking-wider bg-zen-bg/30">
            <span>{t('categories.list.color')}</span>
            <span>{t('categories.list.name')}</span>
            <span className="text-right">{t('categories.list.actions')}</span>
          </div>

          {loading ? (
            <div className="flex items-center justify-center gap-3 px-6 py-12 text-sm text-zen-text-sec">
              <Loader2 className="w-5 h-5 animate-spin text-zen-blue" />
              {t('categories.list.loading')}
            </div>
          ) : categories.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
              <div className="w-12 h-12 rounded-full bg-zen-border/30 flex items-center justify-center mb-3">
                <span className="text-2xl">X</span>
              </div>
              <p className="text-sm text-white font-medium">{t('categories.list.emptyTitle')}</p>
              <p className="text-sm text-zen-text-sec mt-1">{t('categories.list.emptyDescription')}</p>
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
                    title={t('categories.actions.edit')}
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="p-2 text-zen-text-tri hover:text-zen-error hover:bg-zen-error/10 rounded-md transition-all"
                    title={t('categories.actions.delete')}
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
