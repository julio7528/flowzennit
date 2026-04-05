import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FolderPlus, Loader2, Pencil, Plus, Trash2, X } from 'lucide-react'
import { supabase } from '../../lib/supabase.js'

const CadSubcategoria = () => {
  const { t } = useTranslation()
  const [userId, setUserId] = useState(null)
  const [categories, setCategories] = useState([])
  const [subcategories, setSubcategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formOpen, setFormOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [nomecategoria, setNomecategoria] = useState('')
  const [idcategorias, setIdcategorias] = useState('')
  const [corsubcategoria, setCorsubcategoria] = useState('#3B82F6')
  const [categoryModalOpen, setCategoryModalOpen] = useState(false)
  const [categoryNome, setCategoryNome] = useState('')
  const [categoryCor, setCategoryCor] = useState('#3B82F6')
  const [categorySaving, setCategorySaving] = useState(false)
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
    const { data, error } = await supabase
      .from('tbf_categorias')
      .select('id, nomecategoria, corcategoria')
      .eq('idusuario', currentUserId)
      .order('nomecategoria', { ascending: true })

    if (error) {
      setCategories([])
      setFeedback({ type: 'error', message: t('subcategories.feedback.categoriesLoadError') })
      return
    }

    setCategories(data || [])
  }

  const loadSubcategories = async (currentUserId) => {
    setLoading(true)
    const { data, error } = await supabase
      .from('tbf_subcategorias')
      .select('id, nomecategoria, corsubcategoria, idcategorias, tbf_categorias ( nomecategoria, corcategoria )')
      .eq('idusuario', currentUserId)
      .order('nomecategoria', { ascending: true })

    if (error) {
      setSubcategories([])
      setFeedback({ type: 'error', message: t('subcategories.feedback.loadError') })
    } else {
      setSubcategories(data || [])
    }

    setLoading(false)
  }

  useEffect(() => {
    if (!userId) return
    const timer = setTimeout(() => {
      loadCategories(userId)
      loadSubcategories(userId)
    }, 0)
    return () => clearTimeout(timer)
  }, [userId, t])

  const resetForm = () => {
    setEditingId(null)
    setNomecategoria('')
    setIdcategorias('')
    setCorsubcategoria('#3B82F6')
  }

  const resetCategoryForm = () => {
    setCategoryNome('')
    setCategoryCor('#3B82F6')
  }

  const selectedCategory = categories.find((category) => String(category.id) === String(idcategorias))

  const handleCategoryChange = (event) => {
    const value = event.target.value
    setIdcategorias(value)
    const category = categories.find((item) => String(item.id) === String(value))
    if (category?.corcategoria) {
      setCorsubcategoria(category.corcategoria)
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!userId) return

    if (!nomecategoria.trim()) {
      setFeedback({ type: 'error', message: t('subcategories.feedback.nameRequired') })
      return
    }

    if (!idcategorias) {
      setFeedback({ type: 'error', message: t('subcategories.feedback.categoryRequired') })
      return
    }

    setSaving(true)

    if (editingId) {
      const { error } = await supabase
        .from('tbf_subcategorias')
        .update({
          nomecategoria: nomecategoria.trim(),
          idcategorias: Number(idcategorias),
          corsubcategoria,
        })
        .eq('id', editingId)
        .eq('idusuario', userId)

      if (error) {
        setFeedback({ type: 'error', message: t('subcategories.feedback.updateError') })
        setSaving(false)
        return
      }

      setFeedback({ type: 'success', message: t('subcategories.feedback.updateSuccess') })
    } else {
      const { error } = await supabase.from('tbf_subcategorias').insert({
        idusuario: userId,
        idcategorias: Number(idcategorias),
        nomecategoria: nomecategoria.trim(),
        corsubcategoria,
      })

      if (error) {
        setFeedback({ type: 'error', message: t('subcategories.feedback.createError') })
        setSaving(false)
        return
      }

      setFeedback({ type: 'success', message: t('subcategories.feedback.createSuccess') })
    }

    await loadSubcategories(userId)
    setSaving(false)
    resetForm()
    setFormOpen(false)
  }

  const handleEdit = (subcategory) => {
    setEditingId(subcategory.id)
    setNomecategoria(subcategory.nomecategoria)
    setIdcategorias(subcategory.idcategorias)
    setCorsubcategoria(subcategory.corsubcategoria)
    setFormOpen(true)
  }

  const handleDelete = async (subcategoryId) => {
    if (!userId) return

    const confirmed = window.confirm(t('subcategories.feedback.deleteConfirm'))
    if (!confirmed) return

    const { error } = await supabase
      .from('tbf_subcategorias')
      .delete()
      .eq('id', subcategoryId)
      .eq('idusuario', userId)

    if (error) {
      setFeedback({ type: 'error', message: t('subcategories.feedback.deleteError') })
      return
    }

    setFeedback({ type: 'success', message: t('subcategories.feedback.deleteSuccess') })
    await loadSubcategories(userId)
  }

  const handleCategorySubmit = async (event) => {
    event.preventDefault()
    if (!userId) return

    if (!categoryNome.trim()) {
      setFeedback({ type: 'error', message: t('subcategories.feedback.newCategoryNameRequired') })
      return
    }

    setCategorySaving(true)

    const { data, error } = await supabase
      .from('tbf_categorias')
      .insert({
        idusuario: userId,
        nomecategoria: categoryNome.trim(),
        corcategoria: categoryCor,
      })
      .select('id, nomecategoria, corcategoria')
      .single()

    if (error) {
      setFeedback({ type: 'error', message: t('subcategories.feedback.newCategoryCreateError') })
      setCategorySaving(false)
      return
    }

    await loadCategories(userId)
    setIdcategorias(data?.id || '')
    setCorsubcategoria(data?.corcategoria || categoryCor)
    setCategorySaving(false)
    resetCategoryForm()
    setCategoryModalOpen(false)
    setFeedback({ type: 'success', message: t('subcategories.feedback.newCategoryCreateSuccess') })
  }

  return (
    <div className="flex w-full max-w-none flex-col gap-6 p-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-display font-semibold text-white tracking-tight">{t('subcategories.title')}</h1>
          <p className="text-sm text-zen-text-sec mt-0.5">{t('subcategories.description')}</p>
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
          {formOpen ? t('common.close') : t('subcategories.actions.new')}
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

      {categoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => {
              resetCategoryForm()
              setCategoryModalOpen(false)
            }}
          />
          <div
            className="relative bg-zen-surface border border-zen-border rounded-xl p-6 w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="font-display font-semibold text-lg text-white tracking-tight">{t('subcategories.categoryModal.title')}</h2>
                <p className="text-sm text-zen-text-sec mt-0.5">{t('subcategories.categoryModal.description')}</p>
              </div>
              <button
                onClick={() => setCategoryModalOpen(false)}
                className="p-2 text-zen-text-sec hover:text-white hover:bg-zen-border/30 rounded-lg transition-colors"
                aria-label={t('common.close')}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCategorySubmit} className="flex flex-col gap-5">
              <div className="grid grid-cols-1 md:grid-cols-[1fr_150px] gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-zen-text-tri uppercase tracking-wider">{t('subcategories.categoryModal.name')}</label>
                  <input
                    value={categoryNome}
                    onChange={(event) => setCategoryNome(event.target.value)}
                    className="bg-zen-bg border border-zen-border rounded-lg py-2.5 px-3 text-sm text-white focus:border-zen-blue focus:ring-1 focus:ring-zen-blue outline-none transition-all"
                    placeholder={t('subcategories.categoryModal.namePlaceholder')}
                    autoFocus
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-zen-text-tri uppercase tracking-wider">{t('subcategories.categoryModal.color')}</label>
                  <div className="flex items-center gap-3 bg-zen-bg border border-zen-border rounded-lg p-1.5 pr-3 transition-all focus-within:border-zen-blue">
                    <input
                      type="color"
                      value={categoryCor}
                      onChange={(event) => setCategoryCor(event.target.value)}
                      className="h-8 w-10 rounded cursor-pointer border-0 bg-transparent p-0 [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none [&::-webkit-color-swatch]:rounded"
                    />
                    <span className="text-sm font-medium text-zen-text-sec uppercase">{categoryCor}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={categorySaving}
                  className="flex items-center justify-center min-w-[120px] bg-zen-blue hover:bg-blue-600 text-white text-sm font-semibold py-2.5 px-5 rounded-lg shadow-lg shadow-blue-900/20 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {categorySaving ? <Loader2 className="w-4 h-4 animate-spin" /> : t('subcategories.categoryModal.submit')}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    resetCategoryForm()
                    setCategoryModalOpen(false)
                  }}
                  className="text-sm font-medium text-zen-text-sec hover:text-white hover:bg-zen-border/30 py-2.5 px-4 rounded-lg transition-colors"
                >
                  {t('common.cancel')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {formOpen && (
        <form
          onSubmit={handleSubmit}
          className="bg-zen-surface border border-zen-border rounded-xl p-6 flex flex-col gap-5 shadow-sm animate-in fade-in slide-in-from-top-4 duration-300"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-zen-text-tri uppercase tracking-wider">{t('subcategories.form.name')}</label>
              <input
                value={nomecategoria}
                onChange={(event) => setNomecategoria(event.target.value)}
                className="bg-zen-bg border border-zen-border rounded-lg py-2.5 px-3 text-sm text-white focus:border-zen-blue focus:ring-1 focus:ring-zen-blue outline-none transition-all"
                placeholder={t('subcategories.form.namePlaceholder')}
                autoFocus
              />
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-zen-text-tri uppercase tracking-wider">{t('subcategories.form.category')}</label>
                <button
                  type="button"
                  onClick={() => setCategoryModalOpen(true)}
                  className="text-xs font-medium text-zen-blue hover:text-blue-400 flex items-center gap-1 transition-colors"
                >
                  <Plus className="w-3 h-3" /> {t('subcategories.actions.newCategory')}
                </button>
              </div>
              <select
                value={idcategorias}
                onChange={handleCategoryChange}
                className="bg-zen-bg border border-zen-border rounded-lg py-2.5 px-3 text-sm text-white focus:border-zen-blue focus:ring-1 focus:ring-zen-blue outline-none transition-all appearance-none cursor-pointer"
              >
                <option value="">{t('subcategories.form.categoryPlaceholder')}</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.nomecategoria}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-zen-text-tri uppercase tracking-wider">{t('subcategories.form.color')}</label>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 bg-zen-bg border border-zen-border rounded-lg p-1.5 pr-4 transition-all focus-within:border-zen-blue w-fit">
                <input
                  type="color"
                  value={corsubcategoria}
                  onChange={(event) => setCorsubcategoria(event.target.value)}
                  className="h-8 w-12 rounded cursor-pointer border-0 bg-transparent p-0 [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none [&::-webkit-color-swatch]:rounded"
                />
                <span className="text-sm font-medium text-zen-text-sec uppercase tracking-wider">{corsubcategoria}</span>
              </div>

              {selectedCategory && (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-zen-border/20 border border-zen-border/50 text-xs text-zen-text-sec">
                  <span>{t('subcategories.form.inherited')}</span>
                  <span
                    className="size-3 rounded-full shadow-sm ring-1 ring-white/10"
                    style={{ backgroundColor: selectedCategory.corcategoria }}
                  />
                  <span className="font-medium text-white/80">{selectedCategory.nomecategoria}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-zen-border/50">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center justify-center min-w-[120px] bg-zen-blue hover:bg-blue-600 text-white text-sm font-semibold py-2.5 px-5 rounded-lg shadow-lg shadow-blue-900/20 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : editingId ? t('subcategories.actions.update') : t('subcategories.actions.save')}
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
          <h2 className="font-display font-medium text-sm text-white tracking-wide">{t('subcategories.list.title')}</h2>
        </div>

        <div className="divide-y divide-zen-border/50">
          <div className="grid grid-cols-[80px_1fr_1fr_100px] gap-4 px-6 py-3 text-xs font-semibold text-zen-text-tri uppercase tracking-wider bg-zen-bg/30">
            <span>{t('subcategories.list.color')}</span>
            <span>{t('subcategories.list.subcategory')}</span>
            <span>{t('subcategories.list.category')}</span>
            <span className="text-right">{t('subcategories.list.actions')}</span>
          </div>

          {loading ? (
            <div className="flex items-center justify-center gap-3 px-6 py-12 text-sm text-zen-text-sec">
              <Loader2 className="w-5 h-5 animate-spin text-zen-blue" />
              {t('subcategories.list.loading')}
            </div>
          ) : subcategories.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
              <div className="w-12 h-12 rounded-full bg-zen-border/30 flex items-center justify-center mb-3">
                <FolderPlus className="w-6 h-6 text-zen-text-sec" />
              </div>
              <p className="text-sm text-white font-medium">{t('subcategories.list.emptyTitle')}</p>
              <p className="text-sm text-zen-text-sec mt-1">{t('subcategories.list.emptyDescription')}</p>
            </div>
          ) : (
            subcategories.map((subcategory) => (
              <div
                key={subcategory.id}
                className="grid grid-cols-[80px_1fr_1fr_100px] gap-4 px-6 py-3.5 items-center hover:bg-white/[0.02] transition-colors group"
              >
                <div className="flex items-center">
                  <span
                    className="size-4 rounded-full shadow-sm ring-1 ring-white/10"
                    style={{ backgroundColor: subcategory.corsubcategoria }}
                  />
                </div>
                <span className="text-sm font-medium text-white/90 group-hover:text-white transition-colors">
                  {subcategory.nomecategoria}
                </span>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-md bg-zen-bg border border-zen-border/50 text-xs text-zen-text-sec font-medium">
                    {subcategory.tbf_categorias?.nomecategoria || '-'}
                  </span>
                </div>
                <div className="flex items-center justify-end gap-1">
                  <button
                    onClick={() => handleEdit(subcategory)}
                    className="p-2 text-zen-text-tri hover:text-white hover:bg-zen-border/50 rounded-md transition-all"
                    title={t('subcategories.actions.edit')}
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(subcategory.id)}
                    className="p-2 text-zen-text-tri hover:text-zen-error hover:bg-zen-error/10 rounded-md transition-all"
                    title={t('subcategories.actions.delete')}
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

export default CadSubcategoria
