import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { isSupabaseConfigured, supabase } from '../lib/supabase.js'

const AuthCallback = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  useEffect(() => {
    const handleCallback = async () => {
      if (!isSupabaseConfigured) {
        navigate('/login', { replace: true })
        return
      }

      try {
        const url = new URL(window.location.href)
        const authCode = url.searchParams.get('code')

        if (authCode) {
          const { error } = await supabase.auth.exchangeCodeForSession(authCode)

          if (error) {
            console.error('[auth] callback', {
              message: error?.message,
              status: error?.status,
              code: error?.code,
              name: error?.name,
            })
            throw error
          }
        }

        const { data, error } = await supabase.auth.getSession()

        if (error || !data.session) {
          if (error) {
            console.error('[auth] session', {
              message: error?.message,
              status: error?.status,
              code: error?.code,
              name: error?.name,
            })
          }
          navigate('/login', { replace: true })
          return
        }
      } catch {
        navigate('/login', { replace: true })
        return
      }

      navigate('/dashboard', { replace: true })
    }

    handleCallback()
  }, [navigate])

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0b0b16]">
      <p className="text-lg text-[#94a3b8]">{t('auth.processingAuthentication')}</p>
    </div>
  )
}

export default AuthCallback
