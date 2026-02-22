import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft, Lock, LockKeyhole, Mail, X } from 'lucide-react'
import { isSupabaseConfigured, supabase } from '../lib/supabase.js'
import Header from './header.jsx'
import Footer from './footer.jsx'

const Login = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const [isSignUpOpen, setIsSignUpOpen] = useState(false)
  const [isForgotOpen, setIsForgotOpen] = useState(false)
  const [feedbackType, setFeedbackType] = useState(() => (location.state?.accessDenied ? 'error' : null))
  const [feedbackMessage, setFeedbackMessage] = useState(() => (location.state?.accessDenied ? 'Acesso Negado' : ''))
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  // Signup fields
  const [signUpName, setSignUpName] = useState('')
  const [signUpEmail, setSignUpEmail] = useState('')
  const [signUpPassword, setSignUpPassword] = useState('')
  const [signUpConfirm, setSignUpConfirm] = useState('')
  const [signUpLoading, setSignUpLoading] = useState(false)

  // Forgot password field
  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotLoading, setForgotLoading] = useState(false)

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        setIsSignUpOpen(false)
        setIsForgotOpen(false)
        setFeedbackType(null)
      }
    }

    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [])

  // Redirect if already authenticated
  useEffect(() => {
    if (!isSupabaseConfigured) return
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        navigate('/dashboard', { replace: true })
      }
    })
  }, [navigate])

  const feedbackConfig =
    feedbackType === 'success'
      ? {
        title: 'Sucesso',
        message: feedbackMessage || 'Operação realizada com sucesso.',
        primary: 'Voltar ao login',
        secondary: 'Fechar',
      }
      : feedbackType === 'error'
        ? {
          title: 'Erro',
          message: feedbackMessage || 'Ocorreu um erro. Tente novamente.',
          primary: 'Tentar novamente',
          secondary: 'Fechar',
        }
        : null

  const showFeedback = (type, message) => {
    setFeedbackMessage(message)
    setFeedbackType(type)
  }

  useEffect(() => {
    if (location.state?.accessDenied) {
      navigate('/login', { replace: true })
    }
  }, [location.state, navigate])

  const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

  const handleLogin = async (event) => {
    event.preventDefault()
    if (!isSupabaseConfigured) {
      showFeedback('error', 'Configuração de autenticação ausente. Defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.')
      return
    }
    if (!isValidEmail(email)) {
      showFeedback('error', 'Por favor, insira um email válido.')
      return
    }
    if (password.length < 8) {
      showFeedback('error', 'A senha deve ter no mínimo 8 caracteres.')
      return
    }
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) {
      showFeedback('error', error.message)
      return
    }
    navigate('/dashboard')
  }

  const handleGoogleLogin = async () => {
    if (!isSupabaseConfigured) {
      showFeedback('error', 'Configuração de autenticação ausente. Defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.')
      return
    }
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin + '/auth/callback' },
    })
    if (error) {
      showFeedback('error', error.message)
    }
  }

  const handleSignUp = async () => {
    if (!isSupabaseConfigured) {
      showFeedback('error', 'Configuração de autenticação ausente. Defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.')
      return
    }
    if (!isValidEmail(signUpEmail)) {
      showFeedback('error', 'Por favor, insira um email válido.')
      return
    }
    if (signUpPassword.length < 8) {
      showFeedback('error', 'A senha deve ter no mínimo 8 caracteres.')
      return
    }
    if (signUpPassword !== signUpConfirm) {
      showFeedback('error', 'As senhas não conferem.')
      return
    }
    setSignUpLoading(true)
    const { data, error } = await supabase.auth.signUp({
      email: signUpEmail,
      password: signUpPassword,
      options: { data: { full_name: signUpName } },
    })
    if (error) {
      setSignUpLoading(false)
      showFeedback('error', error.message)
      return
    }
    const userId = data.user?.id
    if (userId) {
      const displayName = signUpName.trim() || signUpEmail.split('@')[0]
      const { error: insertError } = await supabase
        .from('tbf_controle_usuario')
        .upsert(
          {
            uid: userId,
            display_name: displayName,
            role: 'user',
            ativo: true,
          },
          { onConflict: 'uid' },
        )
      if (insertError) {
        setSignUpLoading(false)
        showFeedback('error', 'Cadastro criado, mas não foi possível registrar o usuário no controle.')
        return
      }
    }
    setSignUpLoading(false)
    setIsSignUpOpen(false)
    showFeedback('success', 'Verifique seu email para confirmar o cadastro.')
  }

  const handleForgotPassword = async (event) => {
    event.preventDefault()
    if (!isSupabaseConfigured) {
      showFeedback('error', 'Configuração de autenticação ausente. Defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.')
      return
    }
    if (!isValidEmail(forgotEmail)) {
      showFeedback('error', 'Por favor, insira um email válido.')
      return
    }
    setForgotLoading(true)
    const { error } = await supabase.auth.resetPasswordForEmail(forgotEmail, {
      redirectTo: window.location.origin + '/auth/reset-password',
    })
    setForgotLoading(false)
    if (error) {
      showFeedback('error', error.message)
      return
    }
    setIsForgotOpen(false)
    showFeedback('success', 'Enviamos um link de recuperação para o seu email. Verifique sua caixa de entrada.')
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#0b0b16] font-body text-[#f8fafc] selection:bg-[#67e8f9] selection:text-[#0b0b16]">
      <style>{`
        .login-noise {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E");
        }
        @keyframes login-float {
          0% { transform: translate(0, 0); }
          50% { transform: translate(-20px, 20px); }
          100% { transform: translate(0, 0); }
        }
        @keyframes login-float-reverse {
          0% { transform: translate(0, 0); }
          50% { transform: translate(20px, -20px); }
          100% { transform: translate(0, 0); }
        }
        .login-orb-a { animation: login-float 10s ease-in-out infinite; }
        .login-orb-b { animation: login-float-reverse 12s ease-in-out infinite; }
        .login-glass {
          background-color: rgba(18, 11, 31, 0.65);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
        }
        .login-checkbox:checked {
          background-color: #67E8F9;
          border-color: #67E8F9;
          background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='black' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e");
        }
      `}</style>

      <Header />

      <div className="fixed left-[-10%] top-[-20%] z-0 h-[800px] w-[800px] rounded-full bg-[#8b5cf6]/30 blur-[120px] login-orb-a" />
      <div className="fixed bottom-[-20%] right-[-10%] z-0 h-[600px] w-[600px] rounded-full bg-[#67e8f9]/20 blur-[100px] login-orb-b" />
      <div className="login-noise pointer-events-none fixed inset-0 z-10 mix-blend-overlay" />

      <main className="relative z-20 flex min-h-screen w-full items-center justify-center px-4 pt-28 pb-10">
        <section className="login-glass w-full max-w-[480px] rounded-[24px] p-8 md:p-10">
          <div className="mb-8 flex flex-col items-center gap-2">
            <h1 className="font-display text-4xl font-bold tracking-tight text-[#f8fafc]">FlowZenit</h1>
            <p className="text-center text-sm text-[#94a3b8]">Entre no vacuo. Foque como nunca antes.</p>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="group relative mb-7 flex h-12 w-full items-center justify-center gap-3 overflow-hidden rounded-xl border border-white/10 bg-white/5 text-base font-display font-medium text-[#f8fafc] transition-all duration-300 hover:scale-[1.01] hover:border-white/20 hover:bg-white/10 active:scale-[0.99]"
          >
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            <span className="relative z-10 text-sm">G</span>
            <span className="relative z-10">Acessar com Google</span>
          </button>

          <div className="mb-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-xs font-medium uppercase tracking-wider text-[#94a3b8]">ou continue com email</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <form className="flex flex-col gap-6" onSubmit={handleLogin}>
            <div className="group flex flex-col gap-2">
              <label htmlFor="email" className="pl-1 text-xs font-medium uppercase tracking-wider text-[#94a3b8] transition-colors group-focus-within:text-[#67e8f9]">
                Email
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="h-12 w-full rounded-xl border-0 bg-black/30 px-4 text-[#f8fafc] placeholder:text-white/20 outline-none transition-all duration-300 focus:ring-1 focus:ring-[#67e8f9]"
                />
                <Mail className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94a3b8]/50 transition-colors group-focus-within:text-[#67e8f9]" />
              </div>
            </div>

            <div className="group flex flex-col gap-2">
              <label htmlFor="password" className="pl-1 text-xs font-medium uppercase tracking-wider text-[#94a3b8] transition-colors group-focus-within:text-[#67e8f9]">
                Senha
              </label>
              <div className="relative">
                <input
                  id="password"
                  type="password"
                  placeholder="........"
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="h-12 w-full rounded-xl border-0 bg-black/30 px-4 text-[#f8fafc] placeholder:text-white/20 outline-none transition-all duration-300 focus:ring-1 focus:ring-[#67e8f9]"
                />
                <Lock className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94a3b8]/50 transition-colors group-focus-within:text-[#67e8f9]" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="relative mt-2 flex h-[52px] w-full items-center justify-center overflow-hidden rounded-xl bg-gradient-primary text-lg font-display font-semibold text-white shadow-[0_4px_20px_rgba(255,79,216,0.4)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(255,79,216,0.6)] active:scale-[0.98]"
            >
              <span className="relative z-10">{loading ? 'Entrando...' : 'Acessar'}</span>
              <div
                className="absolute inset-0 bg-white/20 opacity-0 transition-opacity duration-300 hover:opacity-100"
              />
            </button>
          </form>

          <div className="mt-7 flex items-center justify-between text-sm">
            <button
              type="button"
              onClick={() => {
                setIsSignUpOpen(false)
                setIsForgotOpen(true)
              }}
              className="text-[#94a3b8] transition-colors duration-200 hover:text-white"
            >
              Esqueci minha senha
            </button>
            <button
              type="button"
              onClick={() => {
                setIsForgotOpen(false)
                setIsSignUpOpen(true)
              }}
              className="font-medium text-[#94a3b8] transition-colors duration-200 hover:text-white"
            >
              Criar nova conta
            </button>
          </div>
        </section>
      </main>

      <Footer />

      {isSignUpOpen && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-[#0B0B16]/60 p-4 backdrop-blur-[2px]"
          onClick={() => setIsSignUpOpen(false)}
        >
          <section
            className="login-glass relative z-50 w-full max-w-[500px] rounded-3xl p-8 sm:p-10"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsSignUpOpen(false)}
              className="absolute right-6 top-6 text-[#94a3b8] transition-colors duration-200 hover:text-white"
              aria-label="Fechar"
            >
              <X className="h-6 w-6" />
            </button>

            <div className="space-y-2 text-center">
              <h2 className="font-display text-[32px] font-bold leading-tight tracking-tight text-white">Junte-se ao Flow</h2>
              <p className="text-[15px] text-[#94a3b8]">Crie sua conta e entre no cockpit.</p>
            </div>

            <form className="mt-6 flex flex-col gap-5" onSubmit={(event) => { event.preventDefault(); handleSignUp() }}>
              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-medium uppercase tracking-wider text-[#94a3b8]">Nome Completo</label>
                <input
                  type="text"
                  placeholder="Seu nome"
                  value={signUpName}
                  onChange={(event) => setSignUpName(event.target.value)}
                  className="h-12 rounded-xl border border-transparent bg-black/30 px-4 text-[15px] text-white placeholder:text-[#94a3b8]/50 outline-none transition-all duration-300 focus:border-[#67e8f9] focus:ring-0 focus:shadow-[0_0_15px_rgba(103,232,249,0.3)]"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-medium uppercase tracking-wider text-[#94a3b8]">Email</label>
                <input
                  type="email"
                  placeholder="seu@email.com"
                  value={signUpEmail}
                  onChange={(event) => setSignUpEmail(event.target.value)}
                  className="h-12 rounded-xl border border-transparent bg-black/30 px-4 text-[15px] text-white placeholder:text-[#94a3b8]/50 outline-none transition-all duration-300 focus:border-[#67e8f9] focus:ring-0 focus:shadow-[0_0_15px_rgba(103,232,249,0.3)]"
                />
              </div>

              <div className="flex flex-col gap-5 sm:flex-row">
                <div className="flex flex-1 flex-col gap-2">
                  <label className="text-[13px] font-medium uppercase tracking-wider text-[#94a3b8]">Senha</label>
                  <input
                    type="password"
                    placeholder="........"
                    autoComplete="new-password"
                    value={signUpPassword}
                    onChange={(event) => setSignUpPassword(event.target.value)}
                    className="h-12 rounded-xl border border-transparent bg-black/30 px-4 text-[15px] text-white placeholder:text-[#94a3b8]/50 outline-none transition-all duration-300 focus:border-[#67e8f9] focus:ring-0 focus:shadow-[0_0_15px_rgba(103,232,249,0.3)]"
                  />
                </div>
                <div className="flex flex-1 flex-col gap-2">
                  <label className="text-[13px] font-medium uppercase tracking-wider text-[#94a3b8]">Confirmar Senha</label>
                  <input
                    type="password"
                    placeholder="........"
                    autoComplete="new-password"
                    value={signUpConfirm}
                    onChange={(event) => setSignUpConfirm(event.target.value)}
                    className="h-12 rounded-xl border border-transparent bg-black/30 px-4 text-[15px] text-white placeholder:text-[#94a3b8]/50 outline-none transition-all duration-300 focus:border-[#67e8f9] focus:ring-0 focus:shadow-[0_0_15px_rgba(103,232,249,0.3)]"
                  />
                </div>
              </div>

              <div className="mt-1 flex items-start gap-3">
                <div className="flex h-6 items-center">
                  <input
                    id="terms"
                    type="checkbox"
                    className="login-checkbox h-5 w-5 cursor-pointer rounded border border-white/10 bg-black/30 text-[#67e8f9] focus:ring-0"
                  />
                </div>
                <label htmlFor="terms" className="select-none text-[14px] leading-6 text-[#94a3b8]">
                  Li e aceito os{' '}
                  <a href="#" className="text-white underline decoration-white/20 underline-offset-4 transition-colors hover:text-[#67e8f9]">
                    Termos de Uso
                  </a>{' '}
                  e{' '}
                  <a href="#" className="text-white underline decoration-white/20 underline-offset-4 transition-colors hover:text-[#67e8f9]">
                    Privacidade
                  </a>
                </label>
              </div>

              <button
                type="submit"
                disabled={signUpLoading}
                className="mt-4 flex h-[52px] w-full items-center justify-center rounded-xl bg-gradient-primary text-[16px] font-display font-semibold text-white shadow-[0_4px_20px_rgba(255,79,216,0.4)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              >
                {signUpLoading ? 'Criando...' : 'Criar Conta'}
              </button>
            </form>

            <div className="pt-4 text-center text-[14px] text-[#94a3b8]">
              Já tem uma conta?
              <button
                type="button"
                onClick={() => setIsSignUpOpen(false)}
                className="ml-1 font-medium text-white transition-colors hover:text-[#67e8f9]"
              >
                Entrar
              </button>
            </div>
          </section>
        </div>
      )}

      {isForgotOpen && (
        <div
          className="fixed inset-0 z-40 flex items-end justify-center bg-[#0B0B16]/60 p-4 backdrop-blur-sm sm:items-center"
          onClick={() => setIsForgotOpen(false)}
        >
          <section
            className="login-glass relative z-50 w-full max-w-[440px] overflow-hidden rounded-3xl"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsForgotOpen(false)}
              className="absolute right-5 top-5 z-20 text-white/50 transition-colors hover:text-white"
              aria-label="Fechar"
            >
              <X className="h-6 w-6" />
            </button>

            <div className="p-8 sm:p-10">
              <div className="mb-6 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-[#8B5CF6]/20 to-[#FF4FD8]/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
                  <LockKeyhole className="h-8 w-8 text-[#FF4FD8]" />
                </div>
              </div>

              <div className="mb-8 text-center">
                <h2 className="mb-2 font-display text-3xl font-bold tracking-tight text-white">Recuperar Acesso</h2>
                <p className="text-[15px] leading-relaxed text-[#94a3b8]">
                  Digite o email associado à sua conta para receber o link de redefinição.
                </p>
              </div>

              <form className="flex flex-col gap-6" onSubmit={handleForgotPassword}>
                <div className="flex flex-col gap-2">
                  <label htmlFor="forgot-email" className="pl-1 text-[11px] font-medium uppercase tracking-[0.05em] text-[#94a3b8]">
                    Email
                  </label>
                  <div className="group relative">
                    <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#94a3b8] transition-colors group-focus-within:text-[#67e8f9]" />
                    <input
                      id="forgot-email"
                      type="email"
                      required
                      placeholder="nome@exemplo.com"
                      value={forgotEmail}
                      onChange={(event) => setForgotEmail(event.target.value)}
                      className="h-12 w-full rounded-xl border border-transparent bg-black/30 pl-11 pr-4 text-[15px] text-white placeholder:text-[#94a3b8]/50 outline-none transition-all duration-300 focus:border-[#67e8f9] focus:ring-0 focus:shadow-[0_0_15px_rgba(103,232,249,0.3)]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="relative mt-2 flex h-[52px] w-full items-center justify-center overflow-hidden rounded-xl bg-gradient-primary text-[16px] font-display font-bold tracking-wide text-white shadow-[0_4px_20px_rgba(255,79,216,0.4)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span className="relative z-10">{forgotLoading ? 'Enviando...' : 'Enviar Link de Recuperação'}</span>
                  <div className="absolute inset-0 translate-y-full bg-white/20 transition-transform duration-300 hover:translate-y-0" />
                </button>

                <div className="mt-1 text-center">
                  <button
                    type="button"
                    onClick={() => setIsForgotOpen(false)}
                    className="inline-flex items-center gap-1 text-sm text-[#94a3b8] transition-colors hover:text-white"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Voltar para o login
                  </button>
                </div>
              </form>
            </div>

            <div className="absolute bottom-0 h-px w-full bg-gradient-to-r from-transparent via-[#67e8f9]/50 to-transparent" />
          </section>
        </div>
      )}

      {feedbackConfig && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-[#0B0B16]/70 p-4 backdrop-blur-sm"
          onClick={() => setFeedbackType(null)}
        >
          <section
            className="login-glass relative w-full max-w-md rounded-[24px] p-10 text-center"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-8 relative flex items-center justify-center">
              <div
                className={`absolute inset-0 rounded-full blur-xl scale-150 animate-pulse ${feedbackType === 'success' ? 'bg-[#67e8f9]/20' : 'bg-[#ff4fd8]/20'
                  }`}
              />
              <div
                className={`relative z-10 flex h-20 w-20 items-center justify-center rounded-full border ${feedbackType === 'success' ? 'border-[#67e8f9]/40 text-[#67e8f9]' : 'border-[#ff4fd8]/40 text-[#ff4fd8]'
                  }`}
              >
                {feedbackType === 'success' ? (
                  <svg className="h-10 w-10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <circle className="opacity-20" cx="12" cy="12" r="11" stroke="currentColor" />
                    <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  <svg className="h-10 w-10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <circle className="opacity-20" cx="12" cy="12" r="11" stroke="currentColor" />
                    <path d="M8 8l8 8" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M16 8l-8 8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
            </div>

            <h2 className="font-display font-bold text-3xl text-white mb-3 tracking-tight">{feedbackConfig.title}</h2>
            <p className="text-[#94a3b8] text-[15px] leading-relaxed mb-8">{feedbackConfig.message}</p>

            <div className="w-full space-y-4">
              <button
                type="button"
                onClick={() => setFeedbackType(null)}
                className={`w-full h-[52px] rounded-xl font-display font-semibold text-base text-white transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98] ${feedbackType === 'success'
                  ? 'bg-gradient-to-r from-[#8b5cf6] to-[#ff4fd8] shadow-[0_4px_20px_rgba(255,79,216,0.4)]'
                  : 'bg-gradient-to-r from-[#ff4fd8] to-[#8b5cf6] shadow-[0_4px_20px_rgba(255,79,216,0.35)]'
                  }`}
              >
                {feedbackConfig.primary}
              </button>
              <button
                type="button"
                onClick={() => setFeedbackType(null)}
                className="text-[#94a3b8] hover:text-white text-sm font-medium transition-colors duration-200 py-2"
              >
                {feedbackConfig.secondary}
              </button>
            </div>

            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          </section>
        </div>
      )}
    </div>
  )
}

export default Login
