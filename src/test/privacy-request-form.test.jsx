import { fireEvent, screen } from '@testing-library/react'

const { privacyInsertMock, contactInsertMock, fromMock } = vi.hoisted(() => {
  const privacyInsert = vi.fn()
  const contactInsert = vi.fn()
  const from = vi.fn((table) => {
    if (table === 'privacy_requests') {
      return { insert: privacyInsert }
    }

    if (table === 'tbf_contato') {
      return { insert: contactInsert }
    }

    return { insert: vi.fn() }
  })

  return {
    privacyInsertMock: privacyInsert,
    contactInsertMock: contactInsert,
    fromMock: from,
  }
})

vi.mock('../lib/supabase', () => ({
  supabase: {
    from: fromMock,
  },
}))

import PrivacyRequestForm from '../components/privacy/PrivacyRequestForm.jsx'
import { renderWithProviders } from './render-with-providers.jsx'

describe('PrivacyRequestForm', () => {
  beforeEach(() => {
    privacyInsertMock.mockReset()
    contactInsertMock.mockReset()
    fromMock.mockClear()
  })

  it('envia a solicitação LGPD diretamente para privacy_requests quando a tabela existe', async () => {
    privacyInsertMock.mockResolvedValue({ error: null })

    renderWithProviders(<PrivacyRequestForm />)

    fireEvent.change(screen.getByLabelText(/^Nome$/i), { target: { value: 'Maria Silva' } })
    fireEvent.change(screen.getByLabelText(/^E-mail$/i), { target: { value: 'maria@empresa.com' } })
    fireEvent.change(screen.getByLabelText(/detalhes/i), {
      target: { value: 'Quero receber uma cópia dos dados armazenados na minha conta.' },
    })

    fireEvent.click(screen.getByRole('button', { name: /enviar solicitação/i }))

    expect(await screen.findByRole('status')).toHaveTextContent(/solicitação enviada com sucesso/i)
    expect(fromMock).toHaveBeenCalledWith('privacy_requests')
    expect(privacyInsertMock).toHaveBeenCalledWith([
      {
        name: 'Maria Silva',
        email: 'maria@empresa.com',
        request_type: 'access_data',
        message: 'Quero receber uma cópia dos dados armazenados na minha conta.',
        confirm_deletion: false,
        status: 'pending',
        source: 'privacy_page',
      },
    ])
  })

  it('usa o fallback em tbf_contato quando privacy_requests ainda não existe', async () => {
    privacyInsertMock.mockResolvedValue({
      error: { code: '42P01', message: 'relation "privacy_requests" does not exist' },
    })
    contactInsertMock.mockResolvedValue({ error: null })

    renderWithProviders(<PrivacyRequestForm />)

    fireEvent.change(screen.getByLabelText(/^Nome$/i), { target: { value: 'João Oliveira' } })
    fireEvent.change(screen.getByLabelText(/^E-mail$/i), { target: { value: 'joao@empresa.com' } })
    fireEvent.change(screen.getByLabelText(/detalhes/i), {
      target: { value: 'Preciso entender quais dados pessoais a plataforma utiliza para autenticação.' },
    })

    fireEvent.click(screen.getByRole('button', { name: /enviar solicitação/i }))

    expect(await screen.findByRole('status')).toHaveTextContent(/solicitação enviada com sucesso/i)
    expect(fromMock).toHaveBeenCalledWith('privacy_requests')
    expect(fromMock).toHaveBeenCalledWith('tbf_contato')
    expect(contactInsertMock).toHaveBeenCalledWith([
      {
        dados_json: {
          name: 'João Oliveira',
          email: 'joao@empresa.com',
          message: expect.stringContaining('[LGPD] Solicitação recebida pela página de privacidade'),
        },
      },
    ])
  })
})
