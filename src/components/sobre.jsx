import {
    ArrowRight,
    Code,
    Download,
    History,
    Keyboard,
    Monitor,
    Cpu,
    Zap,
    GraduationCap,
    Blocks,
    Brain,
    Wifi,
    Terminal,
    MemoryStick,
    BadgeCheck,
    Bot,
} from 'lucide-react'
import Header from './header.jsx'
import Footer from './footer.jsx'

const Sobre = () => {
    return (
        <div className="min-h-screen flex flex-col bg-[#050508] text-white antialiased selection:bg-[#00F0FF] selection:text-black overflow-x-hidden font-[Public_Sans,sans-serif]">
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Public+Sans:wght@100..900&family=JetBrains+Mono:wght@100..800&display=swap');

        .sobre-display { font-family: 'Public Sans', sans-serif; }
        .sobre-mono { font-family: 'JetBrains Mono', monospace; }

        .sobre-scrolling-text {
          animation: sobreScroll 20s linear infinite;
        }
        @keyframes sobreScroll {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        @keyframes sobreShimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        .sobre-shimmer { animation: sobreShimmer 2s infinite; }
        .sobre-shimmer-d1 { animation: sobreShimmer 2s infinite 0.5s; }
        .sobre-shimmer-d2 { animation: sobreShimmer 2s infinite 1s; }

        .sobre-crt {
          background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
          background-size: 100% 2px, 3px 100%;
          pointer-events: none;
        }

        .sobre-grid-pattern {
          background-image: linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px);
          background-size: 20px 20px;
        }

        .sobre-neon-shadow { box-shadow: 0 0 10px rgba(0, 240, 255, 0.3); }
        .sobre-neon-purple-shadow { box-shadow: 0 0 10px rgba(189, 0, 255, 0.3); }

        @media (prefers-reduced-motion: reduce) {
          .sobre-scrolling-text, .sobre-shimmer, .sobre-shimmer-d1, .sobre-shimmer-d2 {
            animation: none !important;
          }
        }
      `}</style>

            <Header />

            {/* Main Content */}
            <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12 flex flex-col gap-12">

                {/* Status Bar */}
                <div className="border-b border-[#1A1D26] bg-[#050508]/90 backdrop-blur-sm sticky top-20 z-30">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00FF41] opacity-75" />
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#00FF41]" />
                            </div>
                            <h2 className="sobre-mono text-xs sm:text-sm tracking-widest text-[#00F0FF] font-bold">JÚLIO GOMES // STATUS: DISPONÍVEL PARA PROJETOS</h2>
                        </div>
                        <div className="hidden md:flex items-center gap-4 sobre-mono text-xs text-gray-400">
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-[#0E1016] border border-[#1A1D26]">
                                <Terminal className="h-3.5 w-3.5" />
                                <span>9+ ANOS_EXP</span>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-[#0E1016] border border-[#1A1D26]">
                                <Wifi className="h-3.5 w-3.5" />
                                <span>LATAM REMOTE</span>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-[#0E1016] border border-[#1A1D26]">
                                <Cpu className="h-3.5 w-3.5" />
                                <span>RPA + AI + FULLSTACK</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Hero Section */}
                <section>
                    <div className="grid lg:grid-cols-2 gap-8 items-center">
                        {/* Left: Profile Image & Name */}
                        <div className="flex flex-col gap-6">
                            <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-[#1A1D26] group">
                                <div
                                    className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-luminosity"
                                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop')" }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-transparent to-transparent" />
                                <div className="absolute bottom-6 left-6 right-6">
                                    <h1 className="sobre-display text-4xl md:text-6xl font-black tracking-tighter text-white mb-2 leading-none uppercase">
                                        Júlio<br />
                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F0FF] to-[#BD00FF]">Gomes</span>
                                    </h1>
                                    <a href="https://github.com/julio7528" target="_blank" rel="noreferrer" className="sobre-mono text-[#00F0FF] text-sm tracking-widest uppercase">
                                        github.com/julio7528
                                    </a>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <a
                                    href="mailto:julio@pointec.dev"
                                    className="flex-1 bg-[#00F0FF] text-[#050508] hover:bg-white transition-colors sobre-mono font-bold py-3 px-6 rounded text-sm uppercase flex items-center justify-center gap-2 group"
                                >
                                    <Download className="h-5 w-5 group-hover:animate-bounce" />
                                    Contato
                                </a>
                                <a
                                    href="https://github.com/julio7528"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex-1 bg-[#0E1016] border border-[#00F0FF]/30 text-[#00F0FF] hover:bg-[#00F0FF]/10 transition-colors sobre-mono font-bold py-3 px-6 rounded text-sm uppercase flex items-center justify-center gap-2"
                                >
                                    <Code className="h-5 w-5" />
                                    GitHub
                                </a>
                            </div>
                        </div>

                        {/* Right: Code Terminal */}
                        <div className="h-full bg-[#0E1016] border border-[#1A1D26] rounded-xl p-6 sobre-mono text-xs md:text-sm overflow-hidden relative shadow-lg sobre-neon-purple-shadow/10">
                            <div className="flex items-center gap-2 mb-4 border-b border-[#1A1D26] pb-2">
                                <div className="w-3 h-3 rounded-full bg-red-500" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                <div className="w-3 h-3 rounded-full bg-green-500" />
                                <span className="ml-2 text-gray-500">julio_gomes_profile.js</span>
                            </div>
                            <div className="text-gray-300 leading-relaxed">
                                <span className="text-[#BD00FF]">const</span>{' '}
                                <span className="text-[#00F0FF]">devProfile</span> = {'{'}<br />
                                {'  '}<span className="text-gray-400">role:</span>{' '}
                                <span className="text-[#00FF41]">'RPA Developer & Automation Specialist'</span>,<br />
                                {'  '}<span className="text-gray-400">experience:</span>{' '}
                                <span className="text-blue-400">'9+ anos'</span>,<br />
                                {'  '}<span className="text-gray-400">location:</span>{' '}
                                <span className="text-blue-400">'Mato Grosso, Brasil'</span>,<br />
                                {'  '}<span className="text-gray-400">stack:</span> [<br />
                                {'    '}<span className="text-[#00FF41]">'Python'</span>,<br />
                                {'    '}<span className="text-[#00FF41]">'Automation Anywhere'</span>,<br />
                                {'    '}<span className="text-[#00FF41]">'UiPath'</span>,<br />
                                {'    '}<span className="text-[#00FF41]">'LLM / AI Automation'</span>,<br />
                                {'    '}<span className="text-[#00FF41]">'React / Next.js'</span><br />
                                {'  '}],<br />
                                {'  '}<span className="text-gray-400">currentRole:</span>{' '}
                                <span className="text-[#00FF41]">'Semantix AI — LATAM'</span>,<br />
                                {'  '}<span className="text-gray-400">mission:</span>{' '}
                                <span className="text-[#00FF41]">'Automatizar para liberar o potencial humano.'</span><br />
                                {'};'}<br />
                                <br />
                                <span className="text-gray-500">// Executando inicialização...</span><br />
                                <span className="animate-pulse">_</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Main Dashboard Grid */}
                <section className="grid lg:grid-cols-12 gap-6">
                    {/* Career Timeline */}
                    <div className="lg:col-span-3 flex flex-col gap-4">
                        <div className="flex items-center gap-2 mb-2">
                            <History className="h-5 w-5 text-[#BD00FF]" />
                            <h3 className="sobre-mono text-sm font-bold text-gray-400 uppercase">Trajetória:</h3>
                        </div>
                        <div className="space-y-4 relative pl-4 border-l border-[#1A1D26]">
                            {/* Item 1 */}
                            <div className="relative group">
                                <div className="absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full bg-[#0E1016] border border-gray-600 group-hover:border-[#BD00FF] transition-colors" />
                                <div className="flex flex-col gap-1 p-3 rounded hover:bg-[#1A1D26]/30 transition-colors">
                                    <span className="sobre-mono text-xs text-gray-500">[INIT] :: 2014 – 2021</span>
                                    <h4 className="font-bold text-sm text-gray-200">34 INVESTIMENTOS</h4>
                                    <span className="text-xs text-[#00FF41]">Controller & RPA Dev — Power Automate, WinAutomation</span>
                                </div>
                            </div>
                            {/* Item 2 */}
                            <div className="relative group">
                                <div className="absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full bg-[#0E1016] border border-gray-600 group-hover:border-[#BD00FF] transition-colors" />
                                <div className="flex flex-col gap-1 p-3 rounded hover:bg-[#1A1D26]/30 transition-colors">
                                    <span className="sobre-mono text-xs text-gray-500">[UPDATE] :: 2021 – 2023</span>
                                    <h4 className="font-bold text-sm text-gray-200">VIAFLOW</h4>
                                    <span className="text-xs text-[#00FF41]">AMS Analyst & RPA Dev — AA, Power Automate, IBM RPA</span>
                                </div>
                            </div>
                            {/* Item 3 */}
                            <div className="relative group">
                                <div className="absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full bg-[#0E1016] border border-gray-600 group-hover:border-[#BD00FF] transition-colors" />
                                <div className="flex flex-col gap-1 p-3 rounded hover:bg-[#1A1D26]/30 transition-colors">
                                    <span className="sobre-mono text-xs text-gray-500">[UPDATE] :: 2023 – 2025</span>
                                    <h4 className="font-bold text-sm text-gray-200">MAASLO</h4>
                                    <span className="text-xs text-[#00FF41]">RPA Developer — AA, Python, QA & Arquitetura</span>
                                </div>
                            </div>
                            {/* Item 4 - Current */}
                            <div className="relative group">
                                <div className="absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full bg-[#050508] border-2 border-[#00F0FF] shadow-[0_0_8px_rgba(0,240,255,0.6)] animate-pulse" />
                                <div className="flex flex-col gap-1 p-3 rounded bg-[#0E1016]/50 border border-[#1A1D26]">
                                    <span className="sobre-mono text-xs text-[#00F0FF]">[CURRENT] :: 2025 – Hoje</span>
                                    <h4 className="font-bold text-sm text-white">SEMANTIX AI</h4>
                                    <span className="text-xs text-[#00FF41]">&gt;&gt; RPA Support LATAM — Python, UiPath, AA</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Center Feature Card */}
                    <div className="lg:col-span-5 flex flex-col">
                        <div className="bg-[#0E1016] rounded-xl p-8 h-full flex flex-col justify-between relative overflow-hidden border border-[#1A1D26] group hover:border-[#00F0FF]/50 transition-colors shadow-2xl">
                            <div className="absolute inset-0 opacity-10 sobre-grid-pattern" />
                            <div className="relative z-10 flex flex-col gap-6">
                                <div className="flex justify-between items-start">
                                    <span className="sobre-mono text-xs text-[#00F0FF] bg-[#00F0FF]/10 px-2 py-1 rounded border border-[#00F0FF]/20">ESPECIALIDADE: RPA & AI</span>
                                </div>
                                <h2 className="sobre-display text-3xl md:text-4xl font-black text-white leading-tight tracking-tight">
                                    9 anos automatizando o que importa.<br />
                                    <span className="text-gray-500">Para que humanos foquem no que realmente importa.</span>
                                </h2>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    Especialista em RPA e automação de processos empresariais, com histórico sólido em áreas fiscais, financeiras e operacionais. Hoje também desenvolve soluções com LLMs e IA para ampliar o alcance das automações.
                                </p>
                                <div className="mt-auto pt-4 flex items-end justify-between">
                                    <div className="flex flex-col gap-1">
                                        <span className="sobre-mono text-xs text-gray-400">PROJETOS EM ANDAMENTO</span>
                                        <span className="font-bold text-xl text-white">FLOWZENIT PLATFORM</span>
                                    </div>
                                    {/* Circular Chart */}
                                    <div className="relative w-24 h-24 flex items-center justify-center">
                                        <svg className="w-full h-full transform -rotate-90">
                                            <circle cx="48" cy="48" fill="transparent" r="40" stroke="#1A1D26" strokeWidth="8" />
                                            <circle
                                                className="drop-shadow-[0_0_8px_rgba(0,240,255,0.5)]"
                                                cx="48" cy="48" fill="transparent" r="40"
                                                stroke="#00F0FF" strokeDasharray="251.2" strokeDashoffset="25" strokeWidth="8"
                                            />
                                        </svg>
                                        <div className="absolute flex flex-col items-center">
                                            <span className="text-lg font-bold text-white">9+</span>
                                            <span className="text-[0.5rem] sobre-mono text-[#00F0FF]">ANOS EXP</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Grid — Areas de Atuação */}
                    <div className="lg:col-span-4 grid grid-cols-2 gap-3 h-full">
                        {/* RPA */}
                        <div className="bg-[#0E1016] border border-[#1A1D26] p-4 rounded-lg flex flex-col gap-2 hover:border-[#BD00FF]/50 transition-all hover:-translate-y-1 group">
                            <div className="w-8 h-8 rounded bg-[#BD00FF]/10 flex items-center justify-center text-[#BD00FF] mb-2 group-hover:bg-[#BD00FF] group-hover:text-white transition-colors">
                                <Bot className="h-4 w-4" />
                            </div>
                            <h4 className="font-bold text-sm text-white">RPA</h4>
                            <p className="text-xs text-gray-400">UiPath, Automation Anywhere, IBM RPA, Power Automate, BotCity.</p>
                        </div>
                        {/* AI & LLM */}
                        <div className="bg-[#0E1016] border border-[#1A1D26] p-4 rounded-lg flex flex-col gap-2 hover:border-[#00F0FF]/50 transition-all hover:-translate-y-1 group">
                            <div className="w-8 h-8 rounded bg-[#00F0FF]/10 flex items-center justify-center text-[#00F0FF] mb-2 group-hover:bg-[#00F0FF] group-hover:text-[#050508] transition-colors">
                                <Brain className="h-4 w-4" />
                            </div>
                            <h4 className="font-bold text-sm text-white">AI & LLM</h4>
                            <p className="text-xs text-gray-400">Automações inteligentes com modelos de linguagem e agentes de IA.</p>
                        </div>
                        {/* Full Stack */}
                        <div className="bg-[#0E1016] border border-[#1A1D26] p-4 rounded-lg flex flex-col gap-2 hover:border-[#00F0FF]/50 transition-all hover:-translate-y-1 group">
                            <div className="w-8 h-8 rounded bg-[#00F0FF]/10 flex items-center justify-center text-[#00F0FF] mb-2 group-hover:bg-[#00F0FF] group-hover:text-[#050508] transition-colors">
                                <Blocks className="h-4 w-4" />
                            </div>
                            <h4 className="font-bold text-sm text-white">FULL STACK</h4>
                            <p className="text-xs text-gray-400">React, Next.js, Python e Docker para produtos web modernos.</p>
                        </div>
                        {/* Financeiro */}
                        <div className="bg-[#0E1016] border border-[#1A1D26] p-4 rounded-lg flex flex-col gap-2 hover:border-[#BD00FF]/50 transition-all hover:-translate-y-1 group">
                            <div className="w-8 h-8 rounded bg-[#BD00FF]/10 flex items-center justify-center text-[#BD00FF] mb-2 group-hover:bg-[#BD00FF] group-hover:text-white transition-colors">
                                <Zap className="h-4 w-4" />
                            </div>
                            <h4 className="font-bold text-sm text-white">FINANCEIRO</h4>
                            <p className="text-xs text-gray-400">Automação de tesouraria, faturamento, conciliações e relatórios gerenciais.</p>
                        </div>
                    </div>
                </section>

                {/* Bottom Flow — Metodologia */}
                <section className="border-t border-b border-[#1A1D26] py-8 relative bg-[#0E1016]/30">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-[#00F0FF] to-transparent opacity-50" />
                    <div className="grid md:grid-cols-3 gap-8 items-center relative">
                        {/* Step 1 */}
                        <div className="flex flex-col gap-2 px-4 relative group">
                            <div className="flex items-center gap-3 mb-2">
                                <Keyboard className="h-5 w-5 text-[#00F0FF]" />
                                <h4 className="sobre-mono font-bold text-white">MAPEAMENTO</h4>
                            </div>
                            <p className="text-sm text-gray-400">Análise do processo &amp; levantamento de requisitos</p>
                            <div className="h-0.5 w-full bg-[#1A1D26] mt-2 overflow-hidden">
                                <div className="h-full w-1/2 bg-[#00F0FF] sobre-shimmer" />
                            </div>
                        </div>
                        <div className="hidden md:flex absolute left-[33%] top-1/2 -translate-y-1/2 text-gray-700">
                            <ArrowRight className="h-8 w-8 animate-pulse" />
                        </div>
                        {/* Step 2 */}
                        <div className="flex flex-col gap-2 px-4 relative group">
                            <div className="flex items-center gap-3 mb-2">
                                <Monitor className="h-5 w-5 text-[#BD00FF]" />
                                <h4 className="sobre-mono font-bold text-white">DESENVOLVIMENTO</h4>
                            </div>
                            <p className="text-sm text-gray-400">Automação com Python, RPA &amp; integrações de IA</p>
                            <div className="h-0.5 w-full bg-[#1A1D26] mt-2 overflow-hidden">
                                <div className="h-full w-2/3 bg-[#BD00FF] sobre-shimmer-d1" />
                            </div>
                        </div>
                        <div className="hidden md:flex absolute left-[66%] top-1/2 -translate-y-1/2 text-gray-700">
                            <ArrowRight className="h-8 w-8 animate-pulse" />
                        </div>
                        {/* Step 3 */}
                        <div className="flex flex-col gap-2 px-4">
                            <div className="flex items-center gap-3 mb-2">
                                <Cpu className="h-5 w-5 text-[#00FF41]" />
                                <h4 className="sobre-mono font-bold text-white">ENTREGA &amp; QA</h4>
                            </div>
                            <p className="text-sm text-gray-400">Documentação, code review &amp; melhoria contínua</p>
                            <div className="h-0.5 w-full bg-[#1A1D26] mt-2 overflow-hidden">
                                <div className="h-full w-full bg-[#00FF41] sobre-shimmer-d2" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Certificações */}
                <section className="pb-12 pt-4 border-t border-[#1A1D26]/50">
                    <div className="flex items-center gap-2 mb-6">
                        <BadgeCheck className="h-5 w-5 text-[#00F0FF]" />
                        <h3 className="sobre-mono text-sm font-bold text-gray-400 uppercase tracking-widest">Certificações &amp; Credenciais</h3>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                        {[
                            { label: 'AA Advanced RPA Professional', sub: 'A360', color: '#00F0FF' },
                            { label: 'AA Master RPA Professional', sub: 'Automation Anywhere', color: '#00F0FF' },
                            { label: 'UiPath Advanced Developer', sub: 'UiPath', color: '#BD00FF' },
                            { label: 'IBM RPA', sub: 'IBM', color: '#BD00FF' },
                            { label: 'Blue Prism Developer', sub: 'Blue Prism', color: '#00FF41' },
                            { label: 'BotCity Python RPA', sub: 'BotCity', color: '#00FF41' },
                        ].map((cert, i) => (
                            <div
                                key={i}
                                className="bg-[#0E1016] border border-[#1A1D26] rounded-lg p-4 flex flex-col gap-2 hover:border-[#00F0FF]/40 transition-all hover:-translate-y-1 group"
                            >
                                <div
                                    className="w-2 h-2 rounded-full mb-1"
                                    style={{ backgroundColor: cert.color, boxShadow: `0 0 6px ${cert.color}` }}
                                />
                                <span className="sobre-mono text-xs font-bold text-white leading-tight">{cert.label}</span>
                                <span className="sobre-mono text-[0.6rem] text-gray-500 uppercase">{cert.sub}</span>
                            </div>
                        ))}
                    </div>
                    <div className="mt-6 grid md:grid-cols-2 gap-4">
                        <div className="bg-[#0E1016] border border-[#1A1D26] rounded-lg p-5 flex flex-col gap-1">
                            <span className="sobre-mono text-xs text-gray-500 uppercase">Formação Acadêmica</span>
                            <ul className="space-y-2 mt-2 sobre-mono text-xs text-gray-300">
                                <li><span className="text-[#00FF41]">[x]</span> Bacharelado em Engenharia de Software — Estácio</li>
                                <li><span className="text-[#00FF41]">[x]</span> Bacharelado em Ciências Contábeis — Unopar</li>
                                <li><span className="text-[#BD00FF]">[ ]</span> Pós-Grad. Gestão &amp; Inovação em Negócios e Tecnologia — UNEMAT (12/2026)</li>
                                <li><span className="text-[#BD00FF]">[ ]</span> Pós-Grad. Agrocomputação — UFMT (06/2026)</li>
                            </ul>
                        </div>
                        <div className="bg-[#0E1016] border border-[#1A1D26] rounded-lg p-5 flex flex-col gap-1">
                            <span className="sobre-mono text-xs text-gray-500 uppercase">Projetos em Destaque</span>
                            <ul className="space-y-2 mt-2 sobre-mono text-xs text-gray-300">
                                <li><span className="text-[#00F0FF]">&gt;&gt;</span> FlowZenit — Plataforma de organização e produtividade</li>
                                <li><span className="text-[#00F0FF]">&gt;&gt;</span> ServCasa — Sistema web com automação e IA</li>
                                <li><span className="text-[#00F0FF]">&gt;&gt;</span> ModeloMarketingTop — Automação de marketing</li>
                                <li><span className="text-[#00F0FF]">&gt;&gt;</span> UFMT — Análise de plantas via sensoriamento remoto com IA</li>
                            </ul>
                        </div>
                    </div>
                </section>
            </main>

            {/* CRT Overlay Effect */}
            <div className="fixed inset-0 pointer-events-none z-[100] mix-blend-overlay opacity-20 sobre-crt" />

            <Footer />
        </div>
    )
}

export default Sobre