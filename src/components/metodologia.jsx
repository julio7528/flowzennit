import { useEffect, useState } from 'react'
import Header from './header.jsx'
import Footer from './footer.jsx'

const gtdSteps = [
  {
    title: 'Capturar',
    what: 'Coletar tudo que chama sua atencao em um inbox confiavel.',
    how: 'Anote tarefas, ideias e pendencias no momento em que surgirem.',
  },
  {
    title: 'Esclarecer',
    what: 'Decidir o que cada item significa.',
    how: 'Pergunte: isso demanda acao? Se sim, defina a proxima acao fisica.',
  },
  {
    title: 'Organizar',
    what: 'Distribuir cada item no lugar correto do sistema.',
    how: 'Use listas de projetos, proximas acoes, aguardando e calendario.',
  },
  {
    title: 'Refletir',
    what: 'Revisar para manter o sistema atualizado e confiavel.',
    how: 'Faça revisao semanal e ajuste prioridades com contexto real.',
  },
  {
    title: 'Engajar',
    what: 'Executar com clareza sobre o que fazer agora.',
    how: 'Escolha pela combinacao contexto, tempo, energia e prioridade.',
  },
]

const gutFactors = [
  {
    title: 'Gravidade',
    score: '5 (Extrema)',
    width: 'w-[90%]',
    what: 'Impacto do problema nos resultados, clientes ou operacao.',
    how: 'Classifique de 1 a 5 conforme o dano potencial.',
  },
  {
    title: 'Urgencia',
    score: '4 (Muita)',
    width: 'w-[72%]',
    what: 'Pressao de tempo para tratar o problema.',
    how: 'Quanto mais curto o prazo, maior a nota.',
  },
  {
    title: 'Tendencia',
    score: '5 (Piora Rapido)',
    width: 'w-[84%]',
    what: 'Velocidade de deterioracao se nada for feito.',
    how: 'Avalie como o problema escala ao longo do tempo.',
  },
]

const maspSteps = [
  { title: 'Identificacao', what: 'Definir o problema principal.', how: 'Delimite escopo, impacto e meta.' },
  { title: 'Observacao', what: 'Entender o problema em campo.', how: 'Coletar dados por local, tempo e tipo.' },
  { title: 'Analise', what: 'Encontrar causa-raiz.', how: 'Use 5 porques, Ishikawa e validacao por dados.' },
  { title: 'Plano de Acao', what: 'Criar contramedidas.', how: 'Descreva responsavel, prazo e criterio de sucesso.' },
  { title: 'Acao', what: 'Executar o plano.', how: 'Implante as acoes e registre evidencias.' },
  { title: 'Verificacao', what: 'Medir resultado.', how: 'Compare antes/depois e confirme eficacia.' },
  { title: 'Padronizacao', what: 'Evitar recorrencia.', how: 'Atualize processo, treinamento e controles.' },
  { title: 'Conclusao', what: 'Consolidar aprendizados.', how: 'Documente ganhos e backlog de melhorias.' },
]

const pdcaPhases = [
  {
    title: 'PLAN',
    what: 'Planejar objetivo, causa e plano de execucao.',
    how: 'Defina meta, indicador, hipotese e plano com prazo.',
  },
  {
    title: 'DO',
    what: 'Executar em escala controlada.',
    how: 'Implemente, registre desvios e mantenha disciplina.',
  },
  {
    title: 'CHECK',
    what: 'Verificar se o resultado esperado aconteceu.',
    how: 'Compare indicador atual vs meta com evidencias.',
  },
  {
    title: 'ACT',
    what: 'Padronizar o que funcionou e corrigir falhas.',
    how: 'Ajuste o processo e reinicie o ciclo continuamente.',
  },
]

const explainers = {
  gtd: {
    title: 'GTD',
    what: 'Metodo de gestao pessoal para transformar excesso de demanda em execucao objetiva.',
    how: 'Fluxo em 5 etapas: capturar, esclarecer, organizar, refletir e engajar.',
  },
  gut: {
    title: 'GUT',
    what: 'Matriz de priorizacao para decidir o que atacar primeiro.',
    how: 'Multiplique Gravidade x Urgencia x Tendencia. Maior resultado = maior prioridade.',
  },
  masp: {
    title: 'MASP',
    what: 'Metodo estruturado para resolver problemas de forma sistemica.',
    how: 'Percorre 8 passos para remover causa-raiz e manter ganhos no processo.',
  },
  pdca: {
    title: 'PDCA',
    what: 'Ciclo continuo para melhorar performance operacional.',
    how: 'Planejar, executar, checar e agir corretivamente em repeticao constante.',
  },
}

const Metodologia = () => {
  const [activeMethod, setActiveMethod] = useState('gtd')
  const [activeGtd, setActiveGtd] = useState(0)
  const [activeGut, setActiveGut] = useState(0)
  const [activeMasp, setActiveMasp] = useState(0)
  const [activePdca, setActivePdca] = useState(0)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.16, rootMargin: '0px 0px -8% 0px' },
    )

    const nodes = document.querySelectorAll('[data-reveal]')
    nodes.forEach((node) => observer.observe(node))

    return () => observer.disconnect()
  }, [])

  return (
    <div className="min-h-screen bg-bgDark text-white overflow-x-hidden selection:bg-hotPink selection:text-white">
      <style>{`
        .method-grid {
          background-image:
            linear-gradient(to right, rgba(148, 163, 184, 0.10) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(148, 163, 184, 0.10) 1px, transparent 1px);
          background-size: 34px 34px;
        }
        .timeline-thread {
          background: linear-gradient(to bottom, transparent 0%, #67e8f9 22%, #ff4fd8 55%, #8b5cf6 80%, transparent 100%);
          box-shadow: 0 0 22px rgba(103, 232, 249, 0.35);
        }
        .glass-panel {
          background: rgba(18, 11, 31, 0.65);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.08);
        }
        .reveal {
          opacity: 0;
          transform: translateY(28px);
          transition: opacity 680ms ease, transform 680ms ease;
        }
        .reveal.is-visible {
          opacity: 1;
          transform: translateY(0);
        }
        .spin-slow {
          animation: spin-slow 26s linear infinite;
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

      <Header />

      <main id="metodologia" className="relative method-grid">
        <div className="pointer-events-none fixed inset-0 -z-10">
          <div className="absolute -top-20 left-[20%] w-72 h-72 rounded-full bg-neonPurple/15 blur-[100px]" />
          <div className="absolute top-[40%] right-[6%] w-72 h-72 rounded-full bg-neonCyan/10 blur-[100px]" />
          <div className="absolute bottom-[8%] left-[8%] w-80 h-80 rounded-full bg-hotPink/10 blur-[110px]" />
        </div>

        <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-[2px] -translate-x-1/2 timeline-thread z-0" />

        <section className="relative z-10 min-h-screen flex items-center justify-center px-6 pt-32 pb-20 text-center">
          <div className="max-w-4xl">
            <p data-reveal className="reveal inline-flex px-4 py-1 rounded-full border border-white/15 bg-white/5 text-xs tracking-[0.22em] text-neonCyan">
              SISTEMA INICIADO
            </p>
            <h1 data-reveal style={{ transitionDelay: '120ms' }} className="reveal mt-6 text-5xl sm:text-6xl md:text-7xl font-extrabold leading-tight">
              DOMINE
              <br />
              <span className="text-gradient">O CAOS</span>
            </h1>
            <p data-reveal style={{ transitionDelay: '220ms' }} className="reveal mt-6 text-textGray max-w-2xl mx-auto">
              Explore cada metodo com botoes interativos para entender o que e e como funciona na pratica.
            </p>

            <div data-reveal style={{ transitionDelay: '280ms' }} className="reveal mt-8 glass-panel rounded-2xl p-4 text-left">
              <div className="flex flex-wrap gap-2">
                {['gtd', 'gut', 'masp', 'pdca'].map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setActiveMethod(method)}
                    className={`px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-wider transition-colors ${
                      activeMethod === method
                        ? 'bg-white text-black'
                        : 'bg-white/5 border border-white/10 text-gray-200 hover:bg-white/10'
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>
              <div className="mt-4">
                <p className="text-neonCyan text-xs tracking-[0.2em]">{explainers[activeMethod].title}</p>
                <p className="mt-1 text-sm text-gray-200">
                  <span className="font-semibold text-white">O que e:</span> {explainers[activeMethod].what}
                </p>
                <p className="mt-1 text-sm text-gray-300">
                  <span className="font-semibold text-white">Como funciona:</span> {explainers[activeMethod].how}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="relative z-10 min-h-screen flex items-center px-6 py-20">
          <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 items-start">
            <div className="lg:text-right">
              <p data-reveal className="reveal font-mono text-neonCyan tracking-[0.22em] text-xs">01 // GTD</p>
              <h2 data-reveal style={{ transitionDelay: '100ms' }} className="reveal mt-4 text-4xl md:text-5xl font-extrabold">Mente como Agua</h2>
              <div data-reveal style={{ transitionDelay: '180ms' }} className="reveal glass-panel rounded-2xl p-6 mt-6">
                <p className="text-gray-300 leading-relaxed">Clique em cada etapa para ver explicacao objetiva do fluxo GTD.</p>
              </div>
              <div data-reveal style={{ transitionDelay: '220ms' }} className="reveal glass-panel rounded-2xl p-6 mt-4 text-left lg:text-right">
                <p className="text-xs text-neonCyan tracking-[0.2em]">{gtdSteps[activeGtd].title}</p>
                <p className="mt-1 text-sm text-gray-200">
                  <span className="font-semibold text-white">O que e:</span> {gtdSteps[activeGtd].what}
                </p>
                <p className="mt-1 text-sm text-gray-300">
                  <span className="font-semibold text-white">Como funciona:</span> {gtdSteps[activeGtd].how}
                </p>
              </div>
            </div>

            <div className="glass-panel rounded-2xl p-6">
              {gtdSteps.map((step, index) => (
                <button
                  key={step.title}
                  type="button"
                  data-reveal
                  onClick={() => setActiveGtd(index)}
                  style={{ transitionDelay: `${120 + index * 90}ms` }}
                  className={`reveal mb-3 last:mb-0 w-full h-12 rounded-lg border-l-4 flex items-center px-4 text-left transition-colors ${
                    activeGtd === index
                      ? 'border-neonCyan bg-gradient-to-r from-neonCyan/25 to-transparent'
                      : 'border-neonCyan/60 bg-gradient-to-r from-neonCyan/10 to-transparent hover:from-neonCyan/20'
                  }`}
                >
                  <span className="font-mono text-neonCyan mr-3">0{index + 1}</span>
                  <span className="font-semibold text-white">{step.title}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="relative z-10 min-h-screen flex items-center px-6 py-20">
          <div className="max-w-5xl mx-auto w-full glass-panel rounded-3xl p-8 md:p-12 border border-hotPink/30">
            <p data-reveal className="reveal font-mono text-hotPink tracking-[0.22em] text-xs text-center">02 // GUT</p>
            <h2 data-reveal style={{ transitionDelay: '90ms' }} className="reveal mt-3 text-center text-4xl font-extrabold">Matriz de Priorizacao</h2>
            <p data-reveal style={{ transitionDelay: '160ms' }} className="reveal mt-3 text-center text-gray-300">Clique no fator para entender como pontuar.</p>

            <div className="mt-8 grid md:grid-cols-3 gap-6">
              {gutFactors.map((factor, i) => (
                <button
                  key={factor.title}
                  type="button"
                  data-reveal
                  onClick={() => setActiveGut(i)}
                  style={{ transitionDelay: `${220 + i * 90}ms` }}
                  className={`reveal text-left rounded-xl p-3 border transition-colors ${
                    activeGut === i ? 'border-hotPink/60 bg-hotPink/10' : 'border-white/10 bg-black/20 hover:bg-hotPink/5'
                  }`}
                >
                  <div className="flex justify-between text-xs font-mono text-gray-400">
                    <span>{factor.title}</span>
                    <span className="text-hotPink">{factor.score}</span>
                  </div>
                  <div className="mt-2 h-3 rounded-full bg-black/40 border border-white/10 overflow-hidden">
                    <div className={`h-full ${factor.width} bg-hotPink shadow-[0_0_10px_#ff4fd8]`} />
                  </div>
                </button>
              ))}
            </div>

            <div data-reveal className="reveal mt-6 rounded-xl border border-white/10 bg-black/25 p-4">
              <p className="text-xs text-hotPink tracking-[0.2em]">{gutFactors[activeGut].title}</p>
              <p className="mt-1 text-sm text-gray-200">
                <span className="font-semibold text-white">O que e:</span> {gutFactors[activeGut].what}
              </p>
              <p className="mt-1 text-sm text-gray-300">
                <span className="font-semibold text-white">Como funciona:</span> {gutFactors[activeGut].how}
              </p>
            </div>
          </div>
        </section>

        <section className="relative z-10 min-h-screen flex items-center px-6 py-20">
          <div className="max-w-6xl mx-auto w-full grid lg:grid-cols-2 gap-10">
            <div>
              <p data-reveal className="reveal font-mono text-neonPurple tracking-[0.22em] text-xs">03 // MASP</p>
              <h2 data-reveal style={{ transitionDelay: '90ms' }} className="reveal mt-4 text-4xl md:text-5xl font-extrabold">Resolucao Estruturada</h2>
              <div data-reveal style={{ transitionDelay: '160ms' }} className="reveal glass-panel rounded-2xl p-6 mt-6 border-l-4 border-neonPurple">
                <p className="text-gray-300">Selecione um passo para entender a funcao dele dentro da resolucao de problemas.</p>
              </div>
              <div data-reveal style={{ transitionDelay: '220ms' }} className="reveal glass-panel rounded-2xl p-6 mt-4">
                <p className="text-xs text-neonPurple tracking-[0.2em]">{maspSteps[activeMasp].title}</p>
                <p className="mt-1 text-sm text-gray-200">
                  <span className="font-semibold text-white">O que e:</span> {maspSteps[activeMasp].what}
                </p>
                <p className="mt-1 text-sm text-gray-300">
                  <span className="font-semibold text-white">Como funciona:</span> {maspSteps[activeMasp].how}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {maspSteps.map((step, index) => (
                <button
                  key={step.title}
                  type="button"
                  data-reveal
                  onClick={() => setActiveMasp(index)}
                  style={{ transitionDelay: `${140 + index * 80}ms` }}
                  className={`reveal glass-panel rounded-xl p-4 border w-full text-left transition-colors ${
                    activeMasp === index ? 'border-neonPurple/60 bg-neonPurple/10' : 'border-neonPurple/25 hover:bg-neonPurple/5'
                  }`}
                >
                  <p className="font-mono text-xs text-neonPurple">0{index + 1}</p>
                  <h3 className="font-bold text-white">{step.title}</h3>
                  <p className="text-sm text-gray-300">{step.what}</p>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="relative z-10 min-h-screen flex items-center px-6 py-20">
          <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p data-reveal className="reveal font-mono text-yellow-400 tracking-[0.22em] text-xs">04 // PDCA</p>
              <h2 data-reveal style={{ transitionDelay: '100ms' }} className="reveal mt-4 text-4xl md:text-6xl font-extrabold">Melhoria Infinita</h2>
              <div data-reveal style={{ transitionDelay: '180ms' }} className="reveal mt-6 grid grid-cols-2 gap-4">
                {pdcaPhases.map((phase, i) => (
                  <button
                    key={phase.title}
                    type="button"
                    onClick={() => setActivePdca(i)}
                    className={`glass-panel rounded-lg p-4 text-left transition-colors ${
                      activePdca === i ? 'border-yellow-400/50 bg-yellow-400/10' : 'hover:bg-white/10'
                    }`}
                  >
                    <p className={`font-bold ${activePdca === i ? 'text-yellow-400' : 'text-white/70'}`}>{phase.title}</p>
                    <p className="text-xs text-gray-400">{phase.what}</p>
                  </button>
                ))}
              </div>
              <div data-reveal className="reveal glass-panel rounded-2xl p-6 mt-4">
                <p className="text-xs text-yellow-400 tracking-[0.2em]">{pdcaPhases[activePdca].title}</p>
                <p className="mt-1 text-sm text-gray-200">
                  <span className="font-semibold text-white">O que e:</span> {pdcaPhases[activePdca].what}
                </p>
                <p className="mt-1 text-sm text-gray-300">
                  <span className="font-semibold text-white">Como funciona:</span> {pdcaPhases[activePdca].how}
                </p>
              </div>
            </div>

            <div data-reveal className="reveal flex items-center justify-center">
              <div className="relative w-[280px] h-[280px] sm:w-[360px] sm:h-[360px] rounded-full border border-white/20 spin-slow">
                <div className="absolute inset-6 rounded-full border-2 border-dashed border-white/20" />
                <span className={`absolute top-8 left-1/2 -translate-x-1/2 font-bold ${activePdca === 0 ? 'text-yellow-400' : 'text-white/60'}`}>PLAN</span>
                <span className={`absolute right-8 top-1/2 -translate-y-1/2 font-bold ${activePdca === 1 ? 'text-yellow-400' : 'text-white/60'}`}>DO</span>
                <span className={`absolute bottom-8 left-1/2 -translate-x-1/2 font-bold ${activePdca === 2 ? 'text-yellow-400' : 'text-white/60'}`}>CHECK</span>
                <span className={`absolute left-8 top-1/2 -translate-y-1/2 font-bold ${activePdca === 3 ? 'text-yellow-400' : 'text-white/60'}`}>ACT</span>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-bgCard border border-yellow-400/40 shadow-[0_0_18px_rgba(251,191,36,0.35)]" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative z-10 py-24 px-6 text-center">
          <h3 data-reveal className="reveal text-3xl md:text-4xl font-extrabold">Sua caixa de ferramentas esta completa.</h3>
          <p data-reveal style={{ transitionDelay: '100ms' }} className="reveal mt-4 text-gray-400 max-w-xl mx-auto">
            Agora cada metodologia pode ser explorada por cliques, com explicacao rapida e aplicavel para o dia a dia.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default Metodologia
