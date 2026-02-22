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
                            <h2 className="sobre-mono text-xs sm:text-sm tracking-widest text-[#00F0FF] font-bold">FLOWZENIT // SYSTEM STATUS: ONLINE</h2>
                        </div>
                        <div className="hidden md:flex items-center gap-4 sobre-mono text-xs text-gray-400">
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-[#0E1016] border border-[#1A1D26]">
                                <Terminal className="h-3.5 w-3.5" />
                                <span>v2.0.2_STABLE</span>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-[#0E1016] border border-[#1A1D26]">
                                <Wifi className="h-3.5 w-3.5" />
                                <span>35ms LATENCY</span>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-[#0E1016] border border-[#1A1D26]">
                                <Cpu className="h-3.5 w-3.5" />
                                <span>8GB ALLOCATED</span>
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
                                        https://github.com/julio7528
                                    </a>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <button className="flex-1 bg-[#00F0FF] text-[#050508] hover:bg-white transition-colors sobre-mono font-bold py-3 px-6 rounded text-sm uppercase flex items-center justify-center gap-2 group">
                                    <Download className="h-5 w-5 group-hover:animate-bounce" />
                                    Documentação
                                </button>
                                <button className="flex-1 bg-[#0E1016] border border-[#00F0FF]/30 text-[#00F0FF] hover:bg-[#00F0FF]/10 transition-colors sobre-mono font-bold py-3 px-6 rounded text-sm uppercase flex items-center justify-center gap-2">
                                    <Code className="h-5 w-5" />
                                    Source_Code
                                </button>
                            </div>
                        </div>

                        {/* Right: Code Terminal */}
                        <div className="h-full bg-[#0E1016] border border-[#1A1D26] rounded-xl p-6 sobre-mono text-xs md:text-sm overflow-hidden relative shadow-lg sobre-neon-purple-shadow/10">
                            <div className="flex items-center gap-2 mb-4 border-b border-[#1A1D26] pb-2">
                                <div className="w-3 h-3 rounded-full bg-red-500" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                <div className="w-3 h-3 rounded-full bg-green-500" />
                                <span className="ml-2 text-gray-500">founder_profile.js</span>
                            </div>
                            <div className="text-gray-300 leading-relaxed">
                                <span className="text-[#BD00FF]">const</span>{' '}
                                <span className="text-[#00F0FF]">founderProfile</span> = {'{'}<br />
                                {'  '}<span className="text-gray-400">role:</span>{' '}
                                <span className="text-[#00FF41]">'Software Engineer'</span>,<br />
                                {'  '}<span className="text-gray-400">location:</span>{' '}
                                <span className="text-blue-400">Brazil</span>,<br />
                                {'  '}<span className="text-gray-400">stack:</span> [<br />
                                {'    '}<span className="text-[#00FF41]">'React / Vite'</span>,<br />
                                {'    '}<span className="text-[#00FF41]">'RPA'</span>,<br />
                                {'    '}<span className="text-[#00FF41]">'Next.js'</span>,<br />
                                {'    '}<span className="text-[#00FF41]">'Python'</span><br />
                                {'  '}],<br />
                                {'  '}<span className="text-gray-400">status:</span>{' '}
                                <span className="text-[#00FF41]">'DEVELOPING_5_PROJECTS'</span>,<br />
                                {'  '}<span className="text-gray-400">mission:</span>{' '}
                                <span className="text-[#00FF41]">'Optimize global workflows.'</span><br />
                                {'};'}<br />
                                <br />
                                <span className="text-gray-500">// Executing initialization...</span><br />
                                <span className="animate-pulse">_</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Main Dashboard Grid */}
                <section className="grid lg:grid-cols-12 gap-6">
                    {/* Origin Log (Timeline) */}
                    <div className="lg:col-span-3 flex flex-col gap-4">
                        <div className="flex items-center gap-2 mb-2">
                            <History className="h-5 w-5 text-[#BD00FF]" />
                            <h3 className="sobre-mono text-sm font-bold text-gray-400 uppercase">História e Carreira:</h3>
                        </div>
                        <div className="space-y-4 relative pl-4 border-l border-[#1A1D26]">
                            {/* Item 1 */}
                            <div className="relative group">
                                <div className="absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full bg-[#0E1016] border border-gray-600 group-hover:border-[#BD00FF] transition-colors" />
                                <div className="flex flex-col gap-1 p-3 rounded hover:bg-[#1A1D26]/30 transition-colors">
                                    <span className="sobre-mono text-xs text-gray-500">[INIT] :: 2018 - Atualmente</span>
                                    <h4 className="font-bold text-sm text-gray-200">AUTOMATION DEV</h4>
                                    <span className="text-xs text-[#00FF41]">+Uipath, Python, Automation Anywhere, Power Automate</span>
                                </div>
                            </div>
                            {/* Item 2 */}
                            <div className="relative group">
                                <div className="absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full bg-[#0E1016] border border-gray-600 group-hover:border-[#BD00FF] transition-colors" />
                                <div className="flex flex-col gap-1 p-3 rounded hover:bg-[#1A1D26]/30 transition-colors">
                                    <span className="sobre-mono text-xs text-gray-500">[UPDATE] :: 2023</span>
                                    <h4 className="font-bold text-sm text-gray-200">FULL STACK TRANSITION</h4>
                                    <span className="text-xs text-[#00FF41]">+ Projetos: ServCasa, ModeloMarketingTop, Vejaki</span>
                                </div>
                            </div>
                            {/* Item 3 */}
                            <div className="relative group">
                                <div className="absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full bg-[#050508] border-2 border-[#00F0FF] shadow-[0_0_8px_rgba(0,240,255,0.6)] animate-pulse" />
                                <div className="flex flex-col gap-1 p-3 rounded bg-[#0E1016]/50 border border-[#1A1D26]">
                                    <span className="sobre-mono text-xs text-[#00F0FF]">[DEPLOY] :: 2026</span>
                                    <h4 className="font-bold text-sm text-white">FLOWZENIT LAUNCH</h4>
                                    <span className="text-xs text-[#00FF41]">&gt;&gt; Em desenvolvimento e implantação</span>
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
                                    <span className="sobre-mono text-xs text-[#00F0FF] bg-[#00F0FF]/10 px-2 py-1 rounded border border-[#00F0FF]/20">PRIORITY: CRITICAL</span>
                                </div>
                                <h2 className="sobre-display text-3xl md:text-4xl font-black text-white leading-tight tracking-tight">
                                    Nossa plataforma é open source.<br />                                    
                                    <span className="text-gray-500">E sempre será.</span>
                                </h2>
                                <div className="mt-auto pt-8 flex items-end justify-between">
                                    <div className="flex flex-col gap-1">
                                        <span className="sobre-mono text-xs text-gray-400">SISTEMA EM DESENVOLVIMENTO</span>
                                        <span className="font-bold text-xl text-white">PRONTO EM PRODUÇÃO</span>
                                    </div>
                                    {/* Circular Chart */}
                                    <div className="relative w-24 h-24 flex items-center justify-center">
                                        <svg className="w-full h-full transform -rotate-90">
                                            <circle cx="48" cy="48" fill="transparent" r="40" stroke="#1A1D26" strokeWidth="8" />
                                            <circle
                                                className="drop-shadow-[0_0_8px_rgba(0,240,255,0.5)]"
                                                cx="48" cy="48" fill="transparent" r="40"
                                                stroke="#00F0FF" strokeDasharray="251.2" strokeDashoffset="0" strokeWidth="8"
                                            />
                                        </svg>
                                        <div className="absolute flex flex-col items-center">
                                            <span className="text-lg font-bold text-white">60%</span>
                                            <span className="text-[0.5rem] sobre-mono text-[#00F0FF]">IMPLEMENTADO</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Right Grid (User Personas) */}
                    <div className="lg:col-span-4 grid grid-cols-2 gap-3 h-full">
                        {/* Freelancers */}
                        <div className="bg-[#0E1016] border border-[#1A1D26] p-4 rounded-lg flex flex-col gap-2 hover:border-[#BD00FF]/50 transition-all hover:-translate-y-1 group">
                            <div className="w-8 h-8 rounded bg-[#BD00FF]/10 flex items-center justify-center text-[#BD00FF] mb-2 group-hover:bg-[#BD00FF] group-hover:text-white transition-colors">
                                <Zap className="h-4 w-4" />
                            </div>
                            <h4 className="font-bold text-sm text-white">FREELANCERS</h4>
                            <p className="text-xs text-gray-400">Fluxos otimizados para projetos e controles econômicos freelancer.</p>
                        </div>
                        {/* Students */}
                        <div className="bg-[#0E1016] border border-[#1A1D26] p-4 rounded-lg flex flex-col gap-2 hover:border-[#00F0FF]/50 transition-all hover:-translate-y-1 group">
                            <div className="w-8 h-8 rounded bg-[#00F0FF]/10 flex items-center justify-center text-[#00F0FF] mb-2 group-hover:bg-[#00F0FF] group-hover:text-[#050508] transition-colors">
                                <GraduationCap className="h-4 w-4" />
                            </div>
                            <h4 className="font-bold text-sm text-white">ESTUDANTES</h4>
                            <p className="text-xs text-gray-400">Acompanhamento acadêmico e gestão de recursos.</p>
                        </div>
                        {/* Developers */}
                        <div className="bg-[#0E1016] border border-[#1A1D26] p-4 rounded-lg flex flex-col gap-2 hover:border-[#00F0FF]/50 transition-all hover:-translate-y-1 group">
                            <div className="w-8 h-8 rounded bg-[#00F0FF]/10 flex items-center justify-center text-[#00F0FF] mb-2 group-hover:bg-[#00F0FF] group-hover:text-[#050508] transition-colors">
                                <Blocks className="h-4 w-4" />
                            </div>
                            <h4 className="font-bold text-sm text-white">DESENVOLVEDORES</h4>
                            <p className="text-xs text-gray-400">Gerenciamento de projetos, códigos e biblioteca de snippets.</p>
                        </div>
                        {/* Organized Minds */}
                        <div className="bg-[#0E1016] border border-[#1A1D26] p-4 rounded-lg flex flex-col gap-2 hover:border-[#BD00FF]/50 transition-all hover:-translate-y-1 group">
                            <div className="w-8 h-8 rounded bg-[#BD00FF]/10 flex items-center justify-center text-[#BD00FF] mb-2 group-hover:bg-[#BD00FF] group-hover:text-white transition-colors">
                                <Brain className="h-4 w-4" />
                            </div>
                            <h4 className="font-bold text-sm text-white">MENTES ORGANIZADAS</h4>
                            <p className="text-xs text-gray-400">Estruturas de pensamento sistemático para o dia a dia.</p>
                        </div>
                    </div>
                </section>

                {/* Bottom Flow */}
                <section className="border-t border-b border-[#1A1D26] py-8 relative bg-[#0E1016]/30">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-[#00F0FF] to-transparent opacity-50" />
                    <div className="grid md:grid-cols-3 gap-8 items-center relative">
                        {/* Step 1 */}
                        <div className="flex flex-col gap-2 px-4 relative group">
                            <div className="flex items-center gap-3 mb-2">
                                <Keyboard className="h-5 w-5 text-[#00F0FF]" />
                                <h4 className="sobre-mono font-bold text-white">INPUT_STREAM</h4>
                            </div>
                            <p className="text-sm text-gray-400">Admin Principles &amp; Raw Data</p>
                            <div className="h-0.5 w-full bg-[#1A1D26] mt-2 overflow-hidden">
                                <div className="h-full w-1/2 bg-[#00F0FF] sobre-shimmer" />
                            </div>
                        </div>
                        {/* Connector Arrow */}
                        <div className="hidden md:flex absolute left-[33%] top-1/2 -translate-y-1/2 text-gray-700">
                            <ArrowRight className="h-8 w-8 animate-pulse" />
                        </div>
                        {/* Step 2 */}
                        <div className="flex flex-col gap-2 px-4 relative group">
                            <div className="flex items-center gap-3 mb-2">
                                <Monitor className="h-5 w-5 text-[#BD00FF]" />
                                <h4 className="sobre-mono font-bold text-white">PROCESSING</h4>
                            </div>
                            <p className="text-sm text-gray-400">Tech Stack Integration</p>
                            <div className="h-0.5 w-full bg-[#1A1D26] mt-2 overflow-hidden">
                                <div className="h-full w-2/3 bg-[#BD00FF] sobre-shimmer-d1" />
                            </div>
                        </div>
                        {/* Connector Arrow */}
                        <div className="hidden md:flex absolute left-[66%] top-1/2 -translate-y-1/2 text-gray-700">
                            <ArrowRight className="h-8 w-8 animate-pulse" />
                        </div>
                        {/* Step 3 */}
                        <div className="flex flex-col gap-2 px-4">
                            <div className="flex items-center gap-3 mb-2">
                                <Cpu className="h-5 w-5 text-[#00FF41]" />
                                <h4 className="sobre-mono font-bold text-white">OUTPUT_RENDER</h4>
                            </div>
                            <p className="text-sm text-gray-400">Flowzenit Platform</p>
                            <div className="h-0.5 w-full bg-[#1A1D26] mt-2 overflow-hidden">
                                <div className="h-full w-full bg-[#00FF41] sobre-shimmer-d2" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Inner Footer */}
                <section className="grid md:grid-cols-4 gap-8 pb-12 pt-4 border-t border-[#1A1D26]/50 text-sm">
                    <div className="md:col-span-2 flex flex-col gap-4">
                        <div className="flex items-center gap-2">
                            <img src="src/assets/logominimal.png" alt="Logo" className="w-6 h-4 rounded-sm" />
                            <h5 className="font-bold tracking-wider">FLOWZENIT</h5>
                        </div>
                        <p className="text-gray-500 max-w-sm">
                            Uma abordagem brutalista e open-source para arquitetura de sistemas e eficiência pessoal. Construída para a mente moderna.
                        </p>
                    </div>
                    <div>
                        <h6 className="sobre-mono text-xs text-gray-400 mb-4 uppercase">Diretrizes</h6>
                        <ul className="space-y-2 text-gray-300">
                            <li className="hover:text-[#00F0FF] cursor-pointer transition-colors">&gt;&gt; Missão</li>
                            <li className="hover:text-[#00F0FF] cursor-pointer transition-colors">&gt;&gt; Plano de Visão</li>
                            <li className="hover:text-[#00F0FF] cursor-pointer transition-colors">&gt;&gt; Changelog</li>
                        </ul>
                    </div>
                    <div>
                        <h6 className="sobre-mono text-xs text-gray-400 mb-4 uppercase">Integrity Check</h6>
                        <ul className="space-y-2 sobre-mono text-xs text-gray-500">
                            <li className="flex items-center gap-2">
                                <span className="text-[#00FF41]">[x]</span> Simplicidade
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-[#00FF41]">[x]</span> Performance
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-[#00FF41]">[x]</span> Escalabilidade
                            </li>
                        </ul>
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
