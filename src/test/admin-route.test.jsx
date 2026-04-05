import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import AdminRoute from '../components/AdminRoute.jsx'

const mockUseAdminRole = vi.fn()

vi.mock('../hooks/useAdminRole.js', () => ({
  default: () => mockUseAdminRole(),
}))

describe('AdminRoute', () => {
  beforeEach(() => {
    mockUseAdminRole.mockReset()
  })

  it('renderiza a rota filha quando o usuario e admin', async () => {
    mockUseAdminRole.mockReturnValue({
      loading: false,
      user: { id: 'user-1' },
      isAdmin: true,
    })

    render(
      <MemoryRouter initialEntries={['/blog-admin']}>
        <Routes>
          <Route element={<AdminRoute />}>
            <Route path="/blog-admin" element={<div>painel admin</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    )

    expect(screen.getByText('painel admin')).toBeInTheDocument()
  })

  it('redireciona para dashboard quando o usuario nao e admin', async () => {
    mockUseAdminRole.mockReturnValue({
      loading: false,
      user: { id: 'user-2' },
      isAdmin: false,
    })

    render(
      <MemoryRouter initialEntries={['/blog-admin']}>
        <Routes>
          <Route element={<AdminRoute />}>
            <Route path="/blog-admin" element={<div>painel admin</div>} />
          </Route>
          <Route path="/dashboard" element={<div>dashboard</div>} />
        </Routes>
      </MemoryRouter>
    )

    expect(screen.getByText('dashboard')).toBeInTheDocument()
  })
})
