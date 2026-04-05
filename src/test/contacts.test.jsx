import { fireEvent, screen } from '@testing-library/react'

const { insertMock, fromMock } = vi.hoisted(() => {
  const insert = vi.fn()
  const from = vi.fn(() => ({ insert }))

  return {
    insertMock: insert,
    fromMock: from,
  }
})

vi.mock('../lib/supabase', () => ({
  supabase: {
    from: fromMock,
  },
}))

import Contacts from '../components/contacts.jsx'
import { renderWithProviders } from './render-with-providers.jsx'

describe('Contacts form', () => {
  beforeEach(() => {
    insertMock.mockReset()
    fromMock.mockClear()
  })

  it('envia o formulario e mostra mensagem de sucesso', async () => {
    insertMock.mockResolvedValue({ error: null })

    renderWithProviders(<Contacts />)

    fireEvent.change(screen.getByLabelText(/nome completo/i), { target: { value: 'Maria Silva' } })
    fireEvent.change(screen.getByLabelText(/e-mail corporativo/i), { target: { value: 'maria@empresa.com' } })
    fireEvent.change(screen.getByLabelText(/mensagem/i), { target: { value: 'Quero saber sobre o plano Enterprise.' } })

    fireEvent.click(screen.getByRole('button', { name: /enviar mensagem/i }))
    fireEvent.click(screen.getByRole('button', { name: /confirmar/i }))

    expect(await screen.findByRole('status')).toHaveTextContent(/mensagem enviada com sucesso/i)
    expect(fromMock).toHaveBeenCalledWith('tbf_contato')
    expect(insertMock).toHaveBeenCalledWith([
      {
        dados_json: {
          name: 'Maria Silva',
          email: 'maria@empresa.com',
          message: 'Quero saber sobre o plano Enterprise.',
        },
      },
    ])
  })
})
