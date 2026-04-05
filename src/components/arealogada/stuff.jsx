import { useCallback, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { CornerUpLeft, Loader2 } from 'lucide-react'
import { supabase } from '../../lib/supabase.js'

const BOX_CONFIG = {
  '/boxes/stuff': {
    titleKey: 'boxes.items.stuff.title',
    allocationKey: 'boxes.items.stuff.allocation',
    listTitleKey: 'boxes.items.stuff.listTitle',
  },
  '/boxes/trash': {
    titleKey: 'boxes.items.trash.title',
    allocationKey: 'boxes.items.trash.allocation',
    listTitleKey: 'boxes.items.trash.listTitle',
  },
  '/boxes/algum-dia': {
    titleKey: 'boxes.items.someday.title',
    allocationKey: 'boxes.items.someday.allocation',
    listTitleKey: 'boxes.items.someday.listTitle',
  },
  '/boxes/referencia': {
    titleKey: 'boxes.items.reference.title',
    allocationKey: 'boxes.items.reference.allocation',
    listTitleKey: 'boxes.items.reference.listTitle',
  },
}

const Stuff = () => {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const [userId, setUserId] = useState(null)
  const [atividades, setAtividades] = useState([])
  const [loading, setLoading] = useState(true)
  const [feedback, setFeedback] = useState(null)
  const currentBox = BOX_CONFIG[location.pathname] || BOX_CONFIG['/boxes/stuff']
  const currentBoxTitle = t(currentBox.titleKey)
  const currentBoxAllocation = t(currentBox.allocationKey)
  const currentBoxListTitle = t(currentBox.listTitleKey)

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

  const loadStuff = useCallback(
    async (currentUserId) => {
      setLoading(true)

      const { data, error } = await supabase
        .from('tbf_atividades')
        .select('id, nometarefa, descricao, created_at')
        .eq('idusuario', currentUserId)
        .eq('alocado', currentBoxAllocation)
        .order('created_at', { ascending: false })

      if (error) {
        setFeedback({ type: 'error', message: t('boxes.feedback.loadError', { box: currentBoxTitle }) })
        setAtividades([])
      } else {
        setAtividades(data || [])
      }

      setLoading(false)
    },
    [currentBoxAllocation, currentBoxTitle, t],
  )

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

    const locale = i18n.resolvedLanguage === 'en' ? 'en-US' : 'pt-BR'

    return new Intl.DateTimeFormat(locale, {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  }

  const handleActivate = async (atividade) => {
    if (!userId) {
      setFeedback({ type: 'error', message: t('boxes.feedback.activateAuthError') })
      return
    }

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
    setFeedback({ type: 'success', message: t('boxes.feedback.deleting', { id: atividade.id }) })

    const { error: deleteError } = await supabase
      .from('tbf_atividades')
      .delete()
      .eq('id', atividade.id)
      .eq('idusuario', userId)

    if (deleteError) {
      setFeedback({ type: 'error', message: t('boxes.feedback.deleteError', { id: atividade.id }) })
      setLoading(false)
      return false
    }

    setFeedback({ type: 'success', message: t('boxes.feedback.deleteSuccess', { id: atividade.id }) })
    setAtividades((prev) => prev.filter((item) => item.id !== atividade.id))
    setLoading(false)
    return true
  }

  const handleRemove = async (atividade) => {
    if (!userId) {
      setFeedback({ type: 'error', message: t('boxes.feedback.removeAuthError') })
      return
    }

    const confirmed = window.confirm(t('boxes.feedback.removeConfirm'))
    if (!confirmed) return

    await handleDelete(atividade)
  }

  return (
    <div className="flex w-full max-w-none flex-col gap-6 p-6 animate-in fade-in duration-300">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-display font-semibold text-white tracking-tight">{currentBoxTitle}</h1>
        <p className="text-sm text-zen-text-sec">{t('boxes.description', { allocation: currentBoxAllocation })}</p>
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
          <h2 className="font-display font-medium text-sm text-white tracking-wide">{currentBoxListTitle}</h2>
        </div>

        <div className="divide-y divide-zen-border/50">
          <div className="grid grid-cols-[1fr_220px_140px] gap-4 px-6 py-3 text-xs font-semibold text-zen-text-tri uppercase tracking-wider bg-zen-bg/30">
            <span>{t('boxes.list.name')}</span>
            <span>{t('boxes.list.createdAt')}</span>
            <span />
          </div>

          {loading ? (
            <div className="flex items-center justify-center gap-3 px-6 py-12 text-sm text-zen-text-sec">
              <Loader2 className="w-5 h-5 animate-spin text-zen-blue" />
              {t('boxes.list.loading')}
            </div>
          ) : atividades.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
              <p className="text-sm text-white font-medium">{t('boxes.list.emptyTitle')}</p>
              <p className="text-sm text-zen-text-sec mt-1">{t('boxes.list.emptyDescription', { allocation: currentBoxAllocation })}</p>
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
                    {t('boxes.actions.activate')}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemove(atividade)}
                    className="text-sm font-semibold px-3 py-2 rounded-lg border border-zen-border text-zen-text-sec hover:text-white hover:bg-zen-border/30 transition-colors"
                  >
                    {t('boxes.actions.remove')}
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
