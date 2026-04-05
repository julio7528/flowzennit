import { Navigate, Outlet, useLocation } from 'react-router-dom'
import useAdminRole from '../hooks/useAdminRole.js'

export default function AdminRoute() {
  const location = useLocation()
  const { loading, user, isAdmin } = useAdminRole()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bgDark">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-neonCyan border-t-transparent" />
          <p className="font-mono text-sm uppercase tracking-widest text-textMuted">Validando acesso...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace state={{ deniedPath: location.pathname }} />
  }

  return <Outlet />
}
