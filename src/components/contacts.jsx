import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, CheckCircle, X } from 'lucide-react'
import { supabase } from '../lib/supabase'

const MotionH2 = motion.h2
const MotionP = motion.p
const MotionForm = motion.form
const MotionButton = motion.button
const MotionDiv = motion.div

const Contacts = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    message: false,
  })

  const [status, setStatus] = useState('idle') // idle, loading, success, error
  const [showModal, setShowModal] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const validateField = (name, value) => {
    if (!value.trim()) {
      return 'Este campo e obrigatorio.'
    }
    if (name === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return 'E-mail corporativo invalido.'
    }
    return ''
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))

    if (touched[name]) {
      setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }))
    }
  }

  const handleBlur = (event) => {
    const { name, value } = event.target
    setTouched((prev) => ({ ...prev, [name]: true }))
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }))
  }

  const handleSubmitRequest = (event) => {
    event.preventDefault()

    const newErrors = {
      name: validateField('name', formData.name),
      email: validateField('email', formData.email),
      message: validateField('message', formData.message),
    }

    setErrors(newErrors)
    setTouched({ name: true, email: true, message: true })

    const hasErrors = Object.values(newErrors).some((err) => err !== '')

    if (!hasErrors) {
      setShowModal(true)
    }
  }

  const handleConfirmSubmit = async () => {
    setShowModal(false)
    setStatus('loading')
    setSubmitError('')

    try {
      if (!supabase) {
        throw new Error('Supabase client is not configured.')
      }

      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        message: formData.message.trim(),
      }

      const { error } = await supabase
        .from('tbf_contato')
        .insert([{ dados_json: payload }])

      if (error) {
        throw new Error(error.message)
      }

      setStatus('success')
    } catch (err) {
      setStatus('error')
      setSubmitError(
        err instanceof Error && err.message
          ? `Nao foi possivel enviar sua mensagem: ${err.message}`
          : 'Nao foi possivel enviar sua mensagem. Tente novamente mais tarde.'
      )
    }
  }

  const isSubmitted = status === 'success'

  const inputClassName = (fieldName) => `w-full px-4 py-3 rounded-lg border transition-all focus:outline-none focus:ring-1 ${
    isSubmitted
      ? 'bg-white/5 border-white/10 text-gray-500 cursor-not-allowed'
      : errors[fieldName]
        ? 'bg-red-500/10 border-red-500 text-white placeholder-red-300 focus:border-red-500 focus:ring-red-500'
        : 'bg-white/5 border-white/20 text-white placeholder-gray-500 focus:border-neonPurple focus:ring-neonPurple'
  }`

  return (
    <section id="contato" className="relative overflow-hidden py-32 scroll-mt-24">
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-hotPink/10 blur-[100px] -z-10"></div>
      <div className="absolute top-0 right-0 w-64 h-64 bg-neonCyan/10 blur-[100px] -z-10"></div>

      <div className="max-w-xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-10">
          <MotionH2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-bold mb-4 text-white"
          >
            Fale Conosco
          </MotionH2>
          <MotionP
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-textGray"
          >
            Duvidas sobre o plano Enterprise? Mande uma mensagem.
          </MotionP>
        </div>

        <MotionForm
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="space-y-6"
          onSubmit={handleSubmitRequest}
          noValidate
        >
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-2">
              Nome Completo <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Seu nome"
              disabled={isSubmitted}
              className={inputClassName('name')}
            />
            {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name}</p>}
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2">
              E-mail Corporativo <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="voce@empresa.com"
              disabled={isSubmitted}
              className={inputClassName('email')}
            />
            {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-400 mb-2">
              Mensagem <span className="text-red-500">*</span>
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              onBlur={handleBlur}
              rows={4}
              placeholder="Como podemos ajudar?"
              disabled={isSubmitted}
              className={inputClassName('message')}
            ></textarea>
            {errors.message && <p className="mt-1 text-xs text-red-400">{errors.message}</p>}
          </div>

          {isSubmitted && (
            <div
              role="status"
              className="flex items-center gap-3 p-4 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400"
            >
              <CheckCircle className="w-5 h-5 shrink-0" />
              <p className="text-sm font-medium">Mensagem enviada com sucesso! Agradecemos o contato.</p>
            </div>
          )}

          {status === 'error' && (
            <div
              role="alert"
              className="flex items-center gap-3 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400"
            >
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <p className="text-sm font-medium">{submitError}</p>
            </div>
          )}

          <MotionButton
            whileHover={!isSubmitted ? { scale: 1.02 } : {}}
            whileTap={!isSubmitted ? { scale: 0.98 } : {}}
            type="submit"
            disabled={isSubmitted || status === 'loading'}
            className={`w-full py-4 rounded-lg font-bold text-lg transition-all ${
              isSubmitted
                ? 'bg-white/5 text-gray-500 cursor-not-allowed border border-white/10'
                : 'bg-gradient-primary text-white hover:shadow-lg hover:shadow-purple-500/30'
            }`}
          >
            {status === 'loading' ? 'Processando...' : isSubmitted ? 'Enviado' : 'Enviar Mensagem'}
          </MotionButton>
        </MotionForm>
      </div>

      <AnimatePresence>
        {showModal && (
          <MotionDiv
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/80 backdrop-blur-sm"
          >
            <MotionDiv
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-md bg-bgCard border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl"
            >
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-yellow-500/10 flex items-center justify-center mb-6">
                  <AlertTriangle className="w-8 h-8 text-yellow-500" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Confirmacao de envio</h3>
                <p className="text-gray-400 mb-8">
                  Tem certeza de que deseja enviar os dados? Esta acao nao podera ser desfeita.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 w-full">
                  <button
                    onClick={() => setShowModal(false)}
                    className="flex-1 py-3 px-4 rounded-lg bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleConfirmSubmit}
                    className="flex-1 py-3 px-4 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold hover:shadow-lg hover:shadow-yellow-500/20 transition-all"
                  >
                    Confirmar
                  </button>
                </div>
              </div>
            </MotionDiv>
          </MotionDiv>
        )}
      </AnimatePresence>
    </section>
  )
}

export default Contacts
