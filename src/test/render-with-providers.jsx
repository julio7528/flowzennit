import { render } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import testI18n from './test-i18n.js'

export const renderWithProviders = (ui, options) =>
  render(<I18nextProvider i18n={testI18n}>{ui}</I18nextProvider>, options)
