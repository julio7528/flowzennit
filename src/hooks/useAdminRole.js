import { useCallback, useEffect, useState } from 'react'
import { isSupabaseConfigured, supabase } from '../lib/supabase.js'

const EMPTY_STATE = {
  loading: false,
  isAdmin: false,
  user: null,
  profile: null,
}

export default function useAdminRole() {
  const [state, setState] = useState({
    ...EMPTY_STATE,
    loading: isSupabaseConfigured,
  })

  const loadRole = useCallback(async (overrideUser = null) => {
    if (!isSupabaseConfigured || !supabase) {
      setState(EMPTY_STATE)
      return
    }

    setState((current) => ({ ...current, loading: true }))

    const user = overrideUser ?? (await supabase.auth.getUser()).data.user ?? null

    if (!user?.id) {
      setState({
        loading: false,
        isAdmin: false,
        user: null,
        profile: null,
      })
      return
    }

    const { data, error } = await supabase
      .from('tbf_controle_usuario')
      .select('uid, role, ativo, display_name')
      .eq('uid', user.id)
      .limit(1)

    if (error) {
      setState({
        loading: false,
        isAdmin: false,
        user,
        profile: null,
      })
      return
    }

    const profile = data?.[0] ?? null
    const isAdmin = profile?.role === 'admin' && profile?.ativo === true

    setState({
      loading: false,
      isAdmin,
      user,
      profile,
    })
  }, [])

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      return undefined
    }

    let active = true

    supabase.auth.getUser().then(({ data }) => {
      if (!active) return
      loadRole(data.user ?? null)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return
      loadRole(session?.user ?? null)
    })

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [loadRole])

  return {
    ...state,
    refresh: loadRole,
  }
}
