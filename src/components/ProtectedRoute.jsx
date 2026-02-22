import { useEffect, useState } from 'react'
import { Outlet, Navigate, useNavigate } from 'react-router-dom'
import { isSupabaseConfigured, supabase } from '../lib/supabase.js'

const ProtectedRoute = () => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(isSupabaseConfigured)
    const [session, setSession] = useState(null)
    const [accessChecking, setAccessChecking] = useState(false)

    useEffect(() => {
        if (!isSupabaseConfigured) {
            return
        }

        // Get current session on mount
        let isMounted = true
        supabase.auth.getSession().then(({ data }) => {
            if (!isMounted) return
            setSession(data.session)
            setLoading(false)
        })

        // Listen for auth state changes (login/logout in other tabs, token refresh)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, currentSession) => {
            setSession(currentSession)
        })

        return () => {
            isMounted = false
            subscription.unsubscribe()
        }
    }, [])

    useEffect(() => {
        if (!isSupabaseConfigured) {
            return
        }
        const user = session?.user
        if (!user?.id) {
            return
        }
        const displayName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Usuário'
        const ensureUserControl = async () => {
            setAccessChecking(true)
            const { data, error } = await supabase
                .from('tbf_controle_usuario')
                .select('uid, ativo')
                .eq('uid', user.id)
                .limit(1)
            if (error) {
                setAccessChecking(false)
                console.error('[tbf_controle_usuario] select', error)
                return
            }
            if (data?.length) {
                const record = data[0]
                if (record?.ativo === false) {
                    await supabase.auth.signOut()
                    navigate('/login', { replace: true, state: { accessDenied: true } })
                    return
                }
                setAccessChecking(false)
                return
            }
            const { error: insertError } = await supabase.from('tbf_controle_usuario').insert({
                uid: user.id,
                display_name: displayName,
                role: 'user',
                ativo: true,
            })
            if (insertError) {
                setAccessChecking(false)
                console.error('[tbf_controle_usuario] insert', insertError)
                return
            }
            setAccessChecking(false)
        }
        ensureUserControl()
    }, [session, navigate])

    if (loading || accessChecking) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-bgDark">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-10 w-10 animate-spin rounded-full border-2 border-neonCyan border-t-transparent" />
                    <p className="font-mono text-sm text-textMuted tracking-widest uppercase">Carregando...</p>
                </div>
            </div>
        )
    }

    if (!isSupabaseConfigured || !session) {
        return <Navigate to="/login" replace />
    }

    return <Outlet />
}

export default ProtectedRoute
