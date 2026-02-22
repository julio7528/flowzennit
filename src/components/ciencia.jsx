import React, { useEffect } from 'react'
import {
  ArrowRight,
  BarChart3,
  Brain,
  Circle,
  Lightbulb,
  RefreshCw,
  TerminalSquare,
  View,
} from 'lucide-react'
import Header from './header.jsx'
import Footer from './footer.jsx'

const Ciencia = () => {
  // Hook para observar os elementos entrando na tela e aplicar as animações
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -10% 0px', // Aciona a animação um pouco antes de aparecer totalmente
      threshold: 0.1,
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed')
          // Descomente a linha abaixo se quiser que a animação ocorra apenas uma vez
          // observer.unobserve(entry.target); 
        }
      })
    }, observerOptions)

    // Seleciona todos os elementos que devem ser animados no scroll
    // Usamos setTimeout para garantir que o DOM esteja pronto e estável
    const timer = setTimeout(() => {
      const revealElements = document.querySelectorAll('.science-reveal, .science-reveal-bar')
      revealElements.forEach((el) => {
        // Se o elemento já estiver visível por algum motivo, aciona imediatamente
        const rect = el.getBoundingClientRect()
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          el.classList.add('is-revealed')
        }
        observer.observe(el)
      })
    }, 100)

    return () => {
      clearTimeout(timer)
      observer.disconnect()
    }
  }, [])

  return (
    <div className="min-h-screen bg-[#070818] text-[#e2e8f0] antialiased selection:bg-[#ff4fd8] selection:text-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter+Tight:wght@300;400;600&family=JetBrains+Mono:wght@400;500&family=Space+Grotesk:wght@400;500;700&family=Space+Mono:wght@400;700&display=swap');
        
        /* Tipografia */
        .science-body { font-family: 'Inter Tight', sans-serif; }
        .science-display { font-family: 'Space Grotesk', sans-serif; }
        .science-mono { font-family: 'JetBrains Mono', monospace; }
        
        /* Elementos Visuais e Backgrounds */
        .science-grid {
          background-image:
            linear-gradient(rgba(59,225,247,0.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59,225,247,0.035) 1px, transparent 1px);
          background-size: 40px 40px;
        }
        .science-glass {
          background: rgba(18, 11, 31, 0.72);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.08);
        }
        .science-cyan-glow { text-shadow: 0 0 18px rgba(59,225,247,0.5); }
        .science-box-glow { box-shadow: 0 0 26px rgba(139,92,246,0.15); }
        
        /* Efeitos Contínuos */
        .science-scanline {
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0) 50%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.2));
          background-size: 100% 4px;
          pointer-events: none;
          opacity: 0.14;
          animation: scanShift 16s linear infinite;
        }
        
        .science-card-hover {
          transition: transform 320ms cubic-bezier(0.22, 1, 0.36, 1), border-color 320ms ease, box-shadow 320ms ease;
        }
        .science-card-hover:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.25);
        }

        /* Animações Acionadas por Scroll (Intersection Observer) */
        .science-reveal {
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 800ms cubic-bezier(0.22, 1, 0.36, 1), transform 800ms cubic-bezier(0.22, 1, 0.36, 1);
          transition-delay: var(--d, 0ms);
          will-change: opacity, transform;
        }
        .science-reveal.is-revealed {
          opacity: 1;
          transform: translateY(0);
        }

        .science-reveal-bar {
          transform: scaleX(0);
          transform-origin: left center;
          transition: transform 1000ms cubic-bezier(0.22, 1, 0.36, 1);
          transition-delay: var(--d, 100ms);
          will-change: transform;
        }
        .science-reveal-bar.is-revealed {
          transform: scaleX(1);
        }

        /* Animações Contínuas em Keyframes */
        .science-core-pulse { animation: corePulse 5.2s ease-in-out infinite; }
        .science-float { animation: floatY 7.2s ease-in-out infinite; }
        .science-float-delay { animation: floatY 8.6s ease-in-out infinite; animation-delay: -1.6s; }
        .science-orbit { animation: orbitSpin 72s linear infinite; }
        .science-orbit-reverse { animation: orbitSpinReverse 48s linear infinite; }
        .science-radar-pulse { animation: radarPulse 4.6s ease-in-out infinite; }
        .science-dot-twinkle { animation: dotTwinkle 3.4s ease-in-out infinite; }
        
        @keyframes floatY {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes corePulse {
          0%, 100% { filter: drop-shadow(0 0 8px rgba(59,225,247,0.35)); transform: scale(1); }
          50% { filter: drop-shadow(0 0 18px rgba(59,225,247,0.65)); transform: scale(1.06); }
        }
        @keyframes orbitSpin {
          to { transform: rotate(360deg); }
        }
        @keyframes orbitSpinReverse {
          to { transform: rotate(-360deg); }
        }
        @keyframes scanShift {
          from { transform: translateY(0); }
          to { transform: translateY(4px); }
        }
        @keyframes radarPulse {
          0%, 100% { opacity: 0.95; }
          50% { opacity: 0.72; }
        }
        @keyframes dotTwinkle {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.45; }
        }

        /* Acessibilidade - Redução de Movimento */
        @media (prefers-reduced-motion: reduce) {
          .science-reveal, .science-reveal-bar {
            transition: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
          .science-card-hover, .science-core-pulse, .science-float, .science-float-delay,
          .science-orbit, .science-orbit-reverse, .science-radar-pulse, .science-dot-twinkle, .science-scanline {
            animation: none !important;
            transition: none !important;
            transform: none !important;
            opacity: 1 !important;
          }
        }
        
        /* Custom Scrollbar para tabelas responsivas */
        .custom-scrollbar::-webkit-scrollbar { height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255,255,255,0.05); border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(59,225,247,0.3); border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(59,225,247,0.6); }
      `}</style>

      <Header />

      <main className="science-body pt-20">
        <section className="relative flex min-h-screen w-full flex-col border-b border-white/5 lg:flex-row">

          {/* Coluna Esquerda - Conteúdo Principal */}
          <div className="relative w-full border-r border-white/5 lg:w-[55%]">
            <div className="mx-auto flex w-full max-w-3xl flex-col px-6 py-12 md:px-12 lg:px-20 lg:py-24">

              {/* Seção 01: Hero */}
              <section className="mb-20 min-h-[80vh] content-center lg:mb-28">
                <div className="science-reveal mb-6 flex items-center gap-3" style={{ '--d': '60ms' }}>
                  <div className="h-px w-12 bg-[#3be1f7]/50" />
                  <span className="science-mono text-[11px] tracking-[0.2em] text-[#3be1f7]">INIT_SEQUENCE</span>
                </div>

                <h1 className="science-display science-cyan-glow science-reveal mb-8 text-5xl font-bold leading-[0.88] tracking-tight md:mb-10 md:text-7xl" style={{ '--d': '130ms' }}>
                  <span className="bg-gradient-to-r from-[#3be1f7] via-white to-[#8b5cf6] bg-clip-text text-transparent">
                    A FÓRMULA
                  </span>
                  <br />
                  <span className="text-white/25">DA MENTE.</span>
                </h1>

                <div className="science-reveal max-w-xl space-y-6 text-[16px] leading-relaxed text-[#94a3b8] md:text-[19px]" style={{ '--d': '210ms' }}>
                  <p>
                    Nós não fomos projetados para a era da informação. Nosso hardware biológico evoluiu na savana,
                    processando ameaças imediatas e recompensas tangíveis.
                  </p>
                  <p>
                    Hoje, operamos em um ambiente de <span className="font-medium text-white">inputs infinitos</span>.
                    O resultado? Ansiedade cognitiva. Loopings mentais. O sistema operacional trava.
                  </p>
                </div>

                <div className="science-glass science-box-glow science-reveal science-card-hover relative mt-12 overflow-hidden rounded border-l-4 border-l-[#ff4fd8] p-6 md:p-7" style={{ '--d': '300ms' }}>
                  <p className="science-display text-xl italic text-white md:text-2xl">"A mente é para ter ideias, não para guardá-las."</p>
                  <div className="mt-4 flex items-center gap-2">
                    <span className="h-px w-8 bg-[#ff4fd8]" />
                    <span className="science-mono text-[11px] uppercase text-[#ff4fd8]">David Allen // GTD Origin</span>
                  </div>
                </div>
              </section>

              {/* Seção 02: Matriz GUT */}
              <section className="min-h-[80vh] content-center py-16 lg:py-24">
                <div className="science-reveal" style={{ '--d': '0ms' }}>
                  <span className="science-mono rounded border border-[#ff4fd8]/20 bg-[#ff4fd8]/10 px-2 py-1 text-[11px] text-[#ff4fd8]">
                    MODULE_02
                  </span>
                  <h2 className="science-display mb-6 mt-4 text-3xl font-bold text-white md:mb-8 md:text-4xl">
                    MATRIZ <span className="text-[#ff4fd8]">G.U.T.</span>
                  </h2>
                  <p className="mb-8 text-base leading-relaxed text-[#94a3b8] md:mb-10 md:text-lg">
                    Como priorizar quando tudo parece urgente? A resposta não é intuição. É cálculo. A Matriz GUT
                    decompõe o caos em três vetores mensuráveis.
                  </p>
                </div>

                <div className="grid gap-5">
                  <article className="science-reveal science-card-hover rounded border border-white/5 bg-[#120b1f] p-5 transition-colors hover:border-[#ff4fd8]/45" style={{ '--d': '100ms' }}>
                    <div className="mb-2 flex items-center justify-between">
                      <h3 className="science-display text-lg text-white md:text-xl">Gravidade</h3>
                      <span className="science-mono text-[11px] text-[#ff4fd8]">WT: 5</span>
                    </div>
                    <p className="text-sm text-[#94a3b8]">Impacto se nada for feito. Danos, prejuízos e colapso do sistema.</p>
                    <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-white/5">
                      <div className="science-reveal-bar h-full w-[80%] bg-[#ff4fd8]" />
                    </div>
                  </article>

                  <article className="science-reveal science-card-hover rounded border border-white/5 bg-[#120b1f] p-5 transition-colors hover:border-[#3be1f7]/45" style={{ '--d': '200ms' }}>
                    <div className="mb-2 flex items-center justify-between">
                      <h3 className="science-display text-lg text-white md:text-xl">Urgência</h3>
                      <span className="science-mono text-[11px] text-[#3be1f7]">WT: 4</span>
                    </div>
                    <p className="text-sm text-[#94a3b8]">Tempo disponível para resolução. O prazo está expirando agora?</p>
                    <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-white/5">
                      <div className="science-reveal-bar h-full w-[60%] bg-[#3be1f7]" />
                    </div>
                  </article>

                  <article className="science-reveal science-card-hover rounded border border-white/5 bg-[#120b1f] p-5 transition-colors hover:border-[#8b5cf6]/45" style={{ '--d': '300ms' }}>
                    <div className="mb-2 flex items-center justify-between">
                      <h3 className="science-display text-lg text-white md:text-xl">Tendência</h3>
                      <span className="science-mono text-[11px] text-[#8b5cf6]">WT: 3</span>
                    </div>
                    <p className="text-sm text-[#94a3b8]">Potencial de crescimento do problema. Vai piorar progressivamente?</p>
                    <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-white/5">
                      <div className="science-reveal-bar h-full w-[40%] bg-[#8b5cf6]" />
                    </div>
                  </article>
                </div>
              </section>

              {/* Seção 03: Fluxo Mental */}
              <section className="min-h-[80vh] content-center py-16 lg:py-24">
                <div className="science-reveal" style={{ '--d': '0ms' }}>
                  <span className="science-mono rounded border border-[#8b5cf6]/20 bg-[#8b5cf6]/10 px-2 py-1 text-[11px] text-[#8b5cf6]">
                    MODULE_03
                  </span>
                  <h2 className="science-display mb-6 mt-4 text-3xl font-bold text-white md:mb-8 md:text-4xl">
                    FLUXO <span className="text-[#8b5cf6]">MENTAL</span>
                  </h2>
                  <div className="space-y-6 text-base leading-relaxed text-[#94a3b8] md:text-lg">
                    <p>
                      <strong className="text-white">Getting Things Done (GTD)</strong> não é sobre fazer mais. É sobre o
                      estado de “Mind Like Water”. Uma reação proporcional a cada input.
                    </p>
                    <p>
                      O segredo está na captura externa. Quando você confia no sistema, seu cérebro deixa de gastar RAM
                      tentando lembrar pendências e passa a processar estratégia.
                    </p>
                  </div>
                </div>

                <div className="science-glass science-reveal mt-10 border-l-4 border-l-[#3be1f7] p-6 lg:mt-11" style={{ '--d': '200ms' }}>
                  <h4 className="science-mono mb-4 text-sm text-[#3be1f7]">CORE_ALGORITHM:</h4>
                  <ul className="science-mono space-y-3 text-xs text-[#94a3b8] md:text-sm">
                    <li className="flex gap-3"><span className="text-[#8b5cf6]">01.</span><span>CAPTURE: Esvazie a mente.</span></li>
                    <li className="flex gap-3"><span className="text-[#8b5cf6]">02.</span><span>CLARIFY: É acionável? (Y/N)</span></li>
                    <li className="flex gap-3"><span className="text-[#8b5cf6]">03.</span><span>ORGANIZE: Coloque no lugar certo.</span></li>
                    <li className="flex gap-3"><span className="text-[#8b5cf6]">04.</span><span>REFLECT: Revisão semanal.</span></li>
                    <li className="flex gap-3"><span className="text-[#8b5cf6]">05.</span><span className="text-white">ENGAGE: Execute.</span></li>
                  </ul>
                </div>
              </section>

              {/* Seção 04: Visibilidade */}
              <section className="content-center py-16 lg:min-h-[60vh] lg:py-24">
                <div className="science-reveal" style={{ '--d': '0ms' }}>
                  <span className="science-mono rounded border border-[#3be1f7]/20 bg-[#3be1f7]/10 px-2 py-1 text-[11px] text-[#3be1f7]">
                    MODULE_04
                  </span>
                  <h2 className="science-display mb-6 mt-4 text-3xl font-bold text-white md:mb-8 md:text-4xl">
                    VISIBILIDADE <span className="text-[#3be1f7]">TOTAL</span>
                  </h2>
                  <div className="space-y-6 text-base leading-relaxed text-[#94a3b8] md:text-lg">
                    <p>
                      O cérebro humano processa imagens muito mais rápido que texto. O Kanban transforma trabalho
                      abstrato em objetos visuais que se movem no espaço.
                    </p>
                    <p>
                      Limitar <span className="text-[#3be1f7]">WIP (Work In Progress)</span> é a única forma de evitar
                      gargalos. Se tudo é prioridade, nada é prioridade.
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </div>

          {/* Coluna Direita - Aside Fixo/Visualizador 1 */}
          <aside className="science-grid relative hidden h-screen overflow-hidden border-l border-white/5 lg:sticky lg:top-0 lg:flex lg:w-[45%] lg:items-center lg:justify-center">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(30,27,46,0.85),#0b0b16)]" />
            <div className="relative z-10 h-[420px] w-[420px]">
              <div className="science-orbit absolute inset-0 rounded-full border border-[#3be1f7]/10" />
              <div className="science-orbit-reverse absolute left-[15%] top-[15%] h-[70%] w-[70%] rounded-full border border-dashed border-[#ff4fd8]/20" />

              {/* Core Central */}
              <div className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#3be1f7]/35 bg-[#120b1f] shadow-[0_0_50px_rgba(59,225,247,0.2)]">
                <div className="flex h-full items-center justify-center">
                  <Brain className="science-core-pulse h-12 w-12 text-[#3be1f7]" />
                </div>
              </div>

              {/* Partículas orbitando */}
              <span className="science-dot-twinkle absolute left-1/2 top-[8%] h-3.5 w-3.5 -translate-x-1/2 rounded-full bg-[#ff4fd8] shadow-[0_0_10px_#ff4fd8]" />
              <span className="science-dot-twinkle absolute bottom-[22%] right-[13%] h-3 w-3 rounded-full bg-[#8b5cf6] shadow-[0_0_10px_#8b5cf6]" />
              <span className="science-dot-twinkle absolute left-[14%] top-1/2 h-2 w-2 rounded-full bg-white" />

              {/* Widgets Flutuantes */}
              <div className="science-glass science-float absolute -right-10 top-[19%] w-44 rounded p-3">
                <div className="mb-2 flex items-center justify-between">
                  <span className="science-mono text-[10px] text-[#ff4fd8]">G.U.T. INDEX</span>
                  <BarChart3 className="h-3 w-3 text-[#ff4fd8]" />
                </div>
                <div className="flex h-12 items-end gap-1">
                  <div className="h-[80%] w-1/3 rounded-t-sm bg-[#ff4fd8]/55" />
                  <div className="h-[40%] w-1/3 rounded-t-sm bg-[#3be1f7]/55" />
                  <div className="h-[60%] w-1/3 rounded-t-sm bg-[#8b5cf6]/55" />
                </div>
              </div>

              <div className="science-glass science-float-delay absolute -left-8 bottom-[18%] w-36 rounded p-3 opacity-80">
                <div className="mb-2 flex items-center justify-between">
                  <span className="science-mono text-[10px] text-[#3be1f7]">KANBAN_STATE</span>
                  <View className="h-3 w-3 text-[#3be1f7]" />
                </div>
                <div className="flex gap-1">
                  <div className="relative h-10 w-full rounded-sm border border-white/10 bg-white/5">
                    <div className="absolute left-1 right-1 top-1 h-1.5 rounded-sm bg-[#3be1f7]/40" />
                  </div>
                  <div className="h-10 w-full rounded-sm border border-white/10 bg-white/5" />
                </div>
              </div>
            </div>
          </aside>
        </section>

        <section className="relative flex w-full flex-col border-b border-[#283739]/30 lg:flex-row">

          {/* Seção de Análise - Esquerda */}
          <div className="science-grid relative w-full border-r border-[#283739]/40 lg:w-[55%]">
            <div className="px-6 py-16 md:px-12 lg:px-20 lg:py-20">
              <div className="science-reveal mb-6 flex items-center gap-2" style={{ '--d': '0ms' }}>
                <span className="h-px w-8 bg-[#3be1f7]" />
                <span className="science-mono text-[11px] tracking-wider text-[#3be1f7]">SEÇÃO 02 // ANÁLISE</span>
              </div>
              <h2 className="science-display science-reveal mb-8 text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl" style={{ '--d': '100ms' }}>
                DINÂMICA <span className="text-[#3be1f7]">COMPARATIVA</span>
              </h2>
              <div className="science-reveal max-w-xl space-y-6 text-lg leading-relaxed text-[#94a3b8] md:text-[20px]" style={{ '--d': '200ms' }}>
                <p>
                  <span className="font-medium italic text-white">Eficiência não é monolítica.</span> É um equilíbrio
                  entre carga cognitiva e throughput.
                </p>
                <p>
                  Processamos três metodologias dominantes dentro do framework acadêmico cibernético. Os dados sugerem
                  que, enquanto <span className="text-[#ff4fd8]">sistemas visuais</span> reduzem a ansiedade imediata,
                  sistemas estruturados baseados em listas maximizam a precisão de recuperação no longo prazo.
                </p>
              </div>
            </div>

            <div className="relative px-6 pb-16 md:px-12 lg:px-20 lg:pb-20">
              <div className="science-glass science-reveal overflow-hidden rounded-md border border-[#3be1f7]/20 shadow-[0_0_20px_rgba(59,225,247,0.14)]" style={{ '--d': '300ms' }}>
                <div className="px-5 pb-3 pt-5">
                  <h3 className="science-display text-2xl font-bold text-white md:text-3xl">MÉTODOS x FOCO</h3>
                  <p className="science-mono mt-2 text-[10px] uppercase tracking-[0.2em] text-[#3be1f7]/80">
                    FEED DE DADOS AO VIVO • ANÁLISE COMPARATIVA EM TEMPO REAL
                  </p>
                </div>

                {/* Tabela Responsiva com Scroll Horizontal Isolado */}
                <div className="custom-scrollbar w-full overflow-x-auto pb-1">
                  <table className="w-full min-w-[580px] border-collapse text-left">
                    <thead>
                      <tr className="science-mono border-y border-white/10 bg-black/45 text-[10px] uppercase tracking-wider text-[#3be1f7]">
                        <th className="px-5 py-3 font-semibold">Methodology</th>
                        <th className="px-5 py-3 font-semibold">Focus Area</th>
                        <th className="px-5 py-3 font-semibold">Core Mechanic</th>
                        <th className="px-5 py-3 text-right font-semibold">Impact</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      <tr className="border-b border-white/5 transition-colors duration-200 hover:bg-white/5">
                        <td className="science-display px-5 py-3 font-bold text-white">GTD</td>
                        <td className="px-5 py-3 text-[#94a3b8]">Individual</td>
                        <td className="px-5 py-3 text-[#94a3b8]">Mental Flow</td>
                        <td className="px-5 py-3 text-right">
                          <div className="inline-flex items-center gap-2">
                            <div className="h-1 w-16 overflow-hidden rounded bg-[#1e1b2e]"><div className="science-reveal-bar h-full w-[85%] bg-[#8b5cf6]" /></div>
                            <span className="science-mono text-[#8b5cf6]">0.85</span>
                          </div>
                        </td>
                      </tr>
                      <tr className="border-b border-l-2 border-[#3be1f7] bg-[#1e1b2e]/80">
                        <td className="science-display px-5 py-3 font-bold text-[#3be1f7]">KANBAN</td>
                        <td className="px-5 py-3 text-white">Visual</td>
                        <td className="px-5 py-3 text-white">Workflow</td>
                        <td className="px-5 py-3 text-right">
                          <div className="inline-flex items-center gap-2">
                            <div className="h-1 w-16 overflow-hidden rounded bg-[#120b1f]">
                              <div className="science-reveal-bar h-full w-[72%] bg-[#3be1f7] shadow-[0_0_8px_rgba(59,225,247,0.8)]" />
                            </div>
                            <span className="science-mono font-bold text-[#3be1f7]">0.72</span>
                          </div>
                        </td>
                      </tr>
                      <tr className="transition-colors duration-200 hover:bg-white/5">
                        <td className="science-display px-5 py-3 font-bold text-white">MASP</td>
                        <td className="px-5 py-3 text-[#94a3b8]">Problem</td>
                        <td className="px-5 py-3 text-[#94a3b8]">Root Cause</td>
                        <td className="px-5 py-3 text-right">
                          <div className="inline-flex items-center gap-2">
                            <div className="h-1 w-16 overflow-hidden rounded bg-[#1e1b2e]"><div className="science-reveal-bar h-full w-[91%] bg-[#ff4fd8]" /></div>
                            <span className="science-mono text-[#ff4fd8]">0.91</span>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="science-mono flex flex-col items-start justify-between gap-3 border-t border-white/10 bg-black/40 px-5 py-3 text-[10px] text-[#94a3b8] sm:flex-row sm:items-center sm:gap-0">
                  <span>DATASET: SYS_OPT_24</span>
                  <div className="flex flex-wrap gap-4">
                    <span className="inline-flex items-center gap-1"><Circle className="h-2.5 w-2.5 fill-[#3be1f7] text-[#3be1f7]" />Speed</span>
                    <span className="inline-flex items-center gap-1"><Circle className="h-2.5 w-2.5 fill-[#8b5cf6] text-[#8b5cf6]" />Quality</span>
                    <span className="inline-flex items-center gap-1"><Circle className="h-2.5 w-2.5 fill-[#ff4fd8] text-[#ff4fd8]" />Cost</span>
                  </div>
                </div>
              </div>

              <p className="science-reveal mt-10 max-w-xl text-[16px] leading-relaxed text-[#94a3b8] md:text-[17px]" style={{ '--d': '400ms' }}>
                A metodologia <span className="font-medium text-white">Kanban</span> (destacada acima) otimiza a
                <span className="italic text-[#3be1f7]"> visibilidade do fluxo</span>, mas frequentemente sacrifica a
                captura de detalhes granulares.
              </p>
            </div>
          </div>

          {/* Aside Fixo/Visualizador 2 */}
          <aside className="science-grid relative hidden h-screen overflow-hidden border-l border-[#283739]/50 lg:sticky lg:top-0 lg:flex lg:w-[45%] lg:items-center lg:justify-center">
            <div className="science-scanline" />
            <div className="relative z-10 h-[430px] w-[430px]">
              <div className="science-mono absolute -top-7 left-1/2 -translate-x-1/2 text-[11px] font-bold tracking-widest text-[#3be1f7]">SPEED</div>
              <div className="science-mono absolute -bottom-6 right-[13%] text-[11px] font-bold tracking-widest text-[#8b5cf6]">QUALITY</div>
              <div className="science-mono absolute -bottom-6 left-[13%] text-[11px] font-bold tracking-widest text-[#ff4fd8]">COST</div>

              <svg className="h-full w-full opacity-95" viewBox="0 0 100 100" fill="none">
                <polygon points="50,10 90,80 10,80" stroke="#283739" strokeWidth="0.5" />
                <polygon points="50,27.5 70,62.5 30,62.5" stroke="#283739" strokeWidth="0.5" />
                <line x1="50" y1="50" x2="50" y2="10" stroke="#283739" strokeWidth="0.5" />
                <line x1="50" y1="50" x2="90" y2="80" stroke="#283739" strokeWidth="0.5" />
                <line x1="50" y1="50" x2="10" y2="80" stroke="#283739" strokeWidth="0.5" />

                <polygon className="science-radar-pulse" points="50,25 80,70 30,75" fill="url(#scienceGradient)" stroke="#3be1f7" strokeWidth="1" />

                <circle className="science-dot-twinkle" cx="50" cy="25" r="1.4" fill="#fff" />
                <circle className="science-dot-twinkle" cx="80" cy="70" r="1.4" fill="#fff" />
                <circle className="science-dot-twinkle" cx="30" cy="75" r="1.4" fill="#fff" />

                <defs>
                  <linearGradient id="scienceGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3be1f7" stopOpacity="0.65" />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.65" />
                  </linearGradient>
                </defs>
              </svg>

              <div className="science-mono absolute left-[56%] top-[18%] rounded border border-[#3be1f7]/40 bg-black/80 px-2 py-1 text-[10px] text-[#3be1f7]">
                High Vel.
              </div>
              <div className="science-mono absolute bottom-[21%] right-[4%] rounded border border-[#8b5cf6]/40 bg-black/80 px-2 py-1 text-[10px] text-[#8b5cf6]">
                Med Qual.
              </div>
            </div>

            <div className="science-mono absolute bottom-12 right-12 text-right text-[10px]">
              <p className="mb-1 text-[#3be1f7]/55">VISUALIZER_STATE</p>
              <p className="text-white">SYNCED: KANBAN</p>
            </div>
          </aside>
        </section>

        {/* Footer Content Section */}
        <section className="science-grid relative border-b border-white/5 px-6 py-16 md:px-12 lg:py-24">
          <div className="mx-auto w-full max-w-[800px]">
            <header className="science-reveal relative mb-12 text-center lg:mb-14">
              <h2 className="science-mono science-cyan-glow text-3xl font-bold uppercase tracking-[0.14em] text-white md:text-5xl lg:text-6xl">
                SAÍDA_FINAL //
              </h2>
              <p className="science-mono mt-3 text-[10px] uppercase tracking-[0.2em] text-[#3be1f7]/80 md:text-xs">
                ID DO LOG DA SESSÃO: #88X-GAMMA
              </p>
            </header>

            <section className="science-reveal mb-12 rounded border border-dashed border-[#ff4fd8] bg-[#120b1f]/60 p-6 shadow-[0_0_8px_rgba(255,79,216,0.2)] md:p-10" style={{ '--d': '150ms' }}>
              <div className="flex flex-col gap-5 md:flex-row md:items-start">
                <div className="w-max rounded-full bg-[#ff4fd8]/15 p-3 text-[#ff4fd8]">
                  <Lightbulb className="h-6 w-6 md:h-7 md:w-7" />
                </div>
                <div>
                  <div className="mb-3 flex items-center gap-3">
                    <span className="science-mono rounded border border-[#ff4fd8] bg-[#ff4fd8]/10 px-2 py-0.5 text-[10px] uppercase tracking-wider text-[#ff4fd8]">
                      PRO TIP_LOG
                    </span>
                    <span className="h-px w-10 bg-[#ff4fd8]/35" />
                  </div>
                  <h3 className="science-mono text-2xl font-bold uppercase tracking-wide text-white md:text-3xl">ESTRATÉGIA_DE_OTIMIZAÇÃO</h3>
                  <p className="mt-4 max-w-xl text-lg leading-relaxed text-[#cbd5e1] md:text-2xl">
                    Para vender esta metodologia aos stakeholders, foque em{' '}
                    <span className="font-semibold italic text-[#ff4fd8]">‘Redução de Risco’ (MASP)</span> em vez de{' '}
                    <span className="font-semibold italic text-[#3be1f7]">‘Velocidade’ (Kanban)</span>.
                  </p>
                </div>
              </div>
            </section>

            <section className="science-reveal mb-16" style={{ '--d': '250ms' }}>
              <div className="mb-4 flex items-center gap-3">
                <TerminalSquare className="h-4 w-4 text-[#3be1f7]" />
                <h3 className="science-mono text-lg uppercase tracking-[0.18em] text-[#3be1f7] md:text-xl">LOG_DE_REFERÊNCIA</h3>
                <div className="h-px flex-grow bg-gradient-to-r from-[#3be1f7]/30 to-transparent" />
              </div>

              <div className="science-mono text-sm md:text-lg lg:text-xl">
                {/* Reference Links */}
                {[
                  { ref: '[REF-01]', title: 'GTD: The Art of Stress-Free Productivity', src: 'David Allen Co.' },
                  { ref: '[REF-02]', title: 'Kanban: Successful Evolutionary Change', src: 'David J. Anderson' },
                  { ref: '[REF-03]', title: 'The Toyota Way (Lean Principles)', src: 'Jeffrey Liker' },
                  { ref: '[REF-04]', title: 'Atomic Habits: Tiny Changes', src: 'James Clear' },
                ].map((item, idx) => (
                  <a key={idx} href="#" className="group flex flex-col justify-between border-l-2 border-transparent px-3 py-3 text-[#94a3b8] transition-all duration-200 hover:border-[#3be1f7] hover:bg-[#1e1b2e]/55 hover:pl-4 sm:flex-row sm:items-center">
                    <span className="mb-1 sm:mb-0">
                      <span className="text-[#3be1f7]/70">{item.ref}</span>
                      <span className="ml-2 font-bold text-[#3be1f7]">{item.title}</span>
                    </span>
                    <span className="text-[10px] text-[#94a3b8]/65 sm:text-xs">SRC: {item.src}</span>
                  </a>
                ))}
              </div>
            </section>

            <section className="science-reveal border-t border-white/5 pt-12 text-center" style={{ '--d': '350ms' }}>
              <button className="science-mono group inline-flex w-full items-center justify-center gap-3 border border-[#3be1f7] px-6 py-4 text-base font-bold uppercase tracking-[0.14em] text-[#3be1f7] transition hover:bg-[#3be1f7]/10 sm:w-auto sm:px-10 sm:text-xl">
                <RefreshCw className="h-5 w-5 transition-transform duration-[650ms] group-hover:rotate-180" />
                ACESSAR SISTEMA
              </button>
              <div className="science-mono mt-8 space-y-2 text-[10px] md:text-xs">
                <p className="text-[#94a3b8]">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-500 align-middle" />
                  <span className="ml-2">V2.4.0 // SYS_READY</span>
                </p>
              </div>
            </section>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default Ciencia