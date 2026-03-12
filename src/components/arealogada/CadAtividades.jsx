import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase.js'
import { X, Loader2, Bold, Italic, Underline, List, ListOrdered, Link2, Cloud } from 'lucide-react'

const BOX_PATH_BY_STATUS = {
    Stuff: '/boxes/stuff',
    Trash: '/boxes/trash',
    Incubado: '/boxes/algum-dia',
    Referencia: '/boxes/referencia',
}
const DELEGAR_DB_VALUE_BY_MODE = {
    Agendar: 'agendar',
    Delegar: 'delegar',
}

const CadAtividades = ({ open, onClose, onSaved, seedData }) => {
    const navigate = useNavigate()
    const [userId, setUserId] = useState(null)
    const [nometarefa, setNometarefa] = useState('')
    const [descricao, setDescricao] = useState('')
    const [charCount, setCharCount] = useState(0) // Novo estado para o contador
    const [isBold, setIsBold] = useState(false)
    const [isItalic, setIsItalic] = useState(false)
    const [isUnderline, setIsUnderline] = useState(false)
    const [isUnorderedList, setIsUnorderedList] = useState(false)
    const [isOrderedList, setIsOrderedList] = useState(false)
    const [isLink, setIsLink] = useState(false)
    const [step, setStep] = useState('form')
    const [isAcionavel, setIsAcionavel] = useState(null)
    const [scheduleOpen, setScheduleOpen] = useState(false)
    const [delegarOpen, setDelegarOpen] = useState(false)
    const [delegarMode, setDelegarMode] = useState('Delegar')
    const [delegarStep, setDelegarStep] = useState('form')
    const [participants, setParticipants] = useState([])
    const [categories, setCategories] = useState([])
    const [subcategories, setSubcategories] = useState([])
    const [participantsLoading, setParticipantsLoading] = useState(false)
    const [responsavel, setResponsavel] = useState('')
    const [selectedParticipant, setSelectedParticipant] = useState(null)
    const [delegarInicio, setDelegarInicio] = useState('')
    const [delegarFim, setDelegarFim] = useState('')
    const [selectedCategoriaId, setSelectedCategoriaId] = useState('')
    const [selectedSubcategoriaId, setSelectedSubcategoriaId] = useState('')
    const [delegarFeedback, setDelegarFeedback] = useState(null)
    const [gutGravidade, setGutGravidade] = useState('5')
    const [gutUrgencia, setGutUrgencia] = useState('5')
    const [gutTendencia, setGutTendencia] = useState('5')
    const [timeWeight, setTimeWeight] = useState(1.01)
    const [dataInicio, setDataInicio] = useState('')
    const [dataFim, setDataFim] = useState('')
    const [saving, setSaving] = useState(false)
    const [feedback, setFeedback] = useState(null)
    const editorRef = useRef(null)
    const editingId = seedData?.id ?? null
    const isEditing = Boolean(editingId)

    const MAX_CHARS = 1000;

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => {
            setUserId(data.user?.id || null)
        })
    }, [])

    useEffect(() => {
        if (feedback) {
            const timer = setTimeout(() => setFeedback(null), 4000)
            return () => clearTimeout(timer)
        }
    }, [feedback])

    useEffect(() => {
        if (delegarFeedback) {
            const timer = setTimeout(() => setDelegarFeedback(null), 4000)
            return () => clearTimeout(timer)
        }
    }, [delegarFeedback])

    const validateForm = () => {
        if (!userId) {
            setFeedback({ type: 'error', message: 'Usuario nao autenticado para salvar a atividade.' })
            return false
        }
        if (!nometarefa.trim()) {
            setFeedback({ type: 'error', message: 'Informe o nome da atividade.' })
            return
        }
        if (charCount > MAX_CHARS) {
            setFeedback({ type: 'error', message: `A descrição excedeu o limite de ${MAX_CHARS} caracteres.` })
            return
        }
        return true
    }

    const handleSubmit = (event) => {
        if (event) {
            event.preventDefault()
        }
        if (!validateForm()) return
        setStep('classify')
    }

    const persistAtividade = async (payload) => {
        if (isEditing) {
            const updateResult = await supabase
                .from('tbf_atividades')
                .update(payload)
                .eq('id', editingId)
                .eq('idusuario', userId)
            return updateResult.error
        }
        const insertResult = await supabase.from('tbf_atividades').insert({
            idusuario: userId,
            'posicao Kanban': 'backlog',
            ...payload,
        })
        return insertResult.error
    }

    const handleSave = async (alocado, options = {}) => {
        const { closeAfter = false, navigateTo, navigateState } = options
        if (!validateForm()) return
        console.log('[CadAtividades] Iniciando handleSave:', {
            alocado,
            nometarefa,
            options
        });
        setSaving(true)
        const payload = {
            nometarefa: nometarefa.trim(),
            descricao: descricao || null,
            alocado,
        }
        console.log('[CadAtividades] Payload para salvar:', payload);
        console.log('[CadAtividades] Executando persistencia');
        const error = await persistAtividade(payload)
        console.log('[CadAtividades] Resultado da persistencia:', { error });

        if (error) {
            setFeedback({
                type: 'error',
                message: isEditing ? 'Nao foi possivel atualizar a atividade.' : 'Nao foi possivel cadastrar a atividade.',
            })
            setSaving(false)
            return
        }

        setSaving(false)
        if (closeAfter) {
            onSaved?.()
            handleClose()
            if (navigateTo) {
                navigate(navigateTo, { state: navigateState })
            }
            return
        }

        setFeedback({
            type: 'success',
            message: isEditing ? 'Atividade atualizada com sucesso.' : 'Atividade cadastrada com sucesso.',
        })
        onSaved?.()
        resetForm()
    }

    const validateSchedule = () => {
        if (!dataInicio || !dataFim) {
            setFeedback({ type: 'error', message: 'Informe início e fim do agendamento.' })
            return
        }
        const inicio = new Date(dataInicio)
        const fim = new Date(dataFim)
        if (Number.isNaN(inicio.getTime()) || Number.isNaN(fim.getTime())) {
            setFeedback({ type: 'error', message: 'Datas inválidas no agendamento.' })
            return
        }
        if (fim < inicio) {
            setFeedback({ type: 'error', message: 'A data final deve ser maior ou igual à inicial.' })
            return
        }
        return { inicio, fim }
    }

    const handleSaveSchedule = async () => {
        if (!validateForm()) return
        const schedule = validateSchedule()
        if (!schedule) return
        setSaving(true)
        const payload = {
            nometarefa: nometarefa.trim(),
            descricao: descricao || null,
            alocado: 'agendar',
            data_inicio: schedule.inicio.toISOString(),
            data_fim: schedule.fim.toISOString(),
        }
        const error = await persistAtividade(payload)

        if (error) {
            setFeedback({
                type: 'error',
                message: isEditing ? 'Nao foi possivel atualizar o agendamento.' : 'Nao foi possivel cadastrar o agendamento.',
            })
            setSaving(false)
            return
        }

        setSaving(false)
        setFeedback({
            type: 'success',
            message: isEditing ? 'Agendamento atualizado com sucesso.' : 'Agendamento cadastrado com sucesso.',
        })
        onSaved?.()
        resetForm()
    }

    const getInitials = (name) => {
        const parts = name.trim().split(' ').filter(Boolean)
        if (!parts.length) return '?'
        if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
        return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
    }

    const validateDelegar = () => {
        if (!responsavel.trim() || !selectedParticipant) {
            setDelegarFeedback({ type: 'error', message: 'Selecione um responsável.' })
            return false
        }
        if (!delegarInicio || !delegarFim) {
            setDelegarFeedback({ type: 'error', message: 'Informe início e fim da delegação.' })
            return false
        }
        const inicio = new Date(delegarInicio)
        const fim = new Date(delegarFim)
        if (Number.isNaN(inicio.getTime()) || Number.isNaN(fim.getTime())) {
            setDelegarFeedback({ type: 'error', message: 'Datas inválidas na delegação.' })
            return false
        }
        if (fim < inicio) {
            setDelegarFeedback({ type: 'error', message: 'A data final deve ser maior ou igual à inicial.' })
            return false
        }
        if (!selectedCategoriaId) {
            setDelegarFeedback({ type: 'error', message: 'Selecione uma categoria.' })
            return false
        }
        return { inicio, fim }
    }

    const gravidadeDescriptions = {
        10: 'Catastrófico — falência, risco de vida, crime ambiental ou interrupção total.',
        9: 'Crítico — prejuízo massivo ou perda de clientes vitais.',
        8: 'Severo — afeta toda a operação e exige retrabalho de meses.',
        7: 'Relevante — impacto em metas trimestrais ou problemas legais.',
        6: 'Moderado alto — compromete a produtividade de um departamento.',
        5: 'Moderado — afeta uma equipe; cliente final ainda não sente.',
        4: 'Limitado — dano processual pequeno, contornável.',
        3: 'Superficial — reclamação interna sem perda financeira.',
        2: 'Mínimo — erro pequeno sem alterar resultado final.',
        1: 'Irrelevante — quase imperceptível.',
    }

    const urgenciaDescriptions = {
        10: 'Imediato — resolva agora (minutos).',
        9: 'Até 2 horas — crise instalada.',
        8: 'Hoje (6h) — antes do fim do expediente.',
        7: '24 horas — prioridade número 1.',
        6: 'Até 3 dias — entra no planejamento da semana.',
        5: '1 semana — prazo de conforto.',
        4: '15 dias — próximo ciclo.',
        3: '1 mês — impacto baixo no curto prazo.',
        2: 'Próximo trimestre — background.',
        1: 'Sem prazo — só com ociosidade.',
    }

    const tendenciaDescriptions = {
        10: 'Explosiva — dano dobra em poucas horas.',
        9: 'Muito rápida — piora visível a cada dia.',
        8: 'Rápida — cresce semanalmente e atinge outras áreas.',
        7: 'Progressiva — agravamento constante.',
        6: 'Moderada — piora ao longo dos meses.',
        5: 'Lenta — deteriora, mas leva tempo.',
        4: 'Estável — não cresce, mas incomoda.',
        3: 'Estável/melhora — chances de se resolver.',
        2: 'Redução lenta — perde força com o tempo.',
        1: 'Autolimitada — desaparece sem intervenção.',
    }

    const computeTimeWeight = (deadlineValue, nowMs) => {
        const minWeight = 1.01
        const maxWeight = 2.0
        const maxHours = 168
        if (!deadlineValue) return minWeight
        const deadline = new Date(deadlineValue)
        if (Number.isNaN(deadline.getTime())) return minWeight
        const diffMs = deadline.getTime() - nowMs
        if (diffMs <= 0) return maxWeight
        const diffHours = diffMs / (1000 * 60 * 60)
        const clamped = Math.min(Math.max(diffHours / maxHours, 0), 1)
        const weight = minWeight + (maxWeight - minWeight) * (1 - clamped)
        return Number(weight.toFixed(2))
    }

    const resetToolbar = useCallback(() => {
        setIsBold(false)
        setIsItalic(false)
        setIsUnderline(false)
        setIsUnorderedList(false)
        setIsOrderedList(false)
        setIsLink(false)
    }, [])

    const getTextLength = (html) => {
        if (typeof document === 'undefined') return 0
        const container = document.createElement('div')
        container.innerHTML = html || ''
        return (container.innerText || '').replace(/\n/g, '').length
    }

    useEffect(() => {
        if (!open || !seedData) return
        const timer = setTimeout(() => {
            setNometarefa(seedData.nometarefa || '')
            setDescricao(seedData.descricao || '')
            setCharCount(getTextLength(seedData.descricao || ''))
            setStep('form')
            setIsAcionavel(null)
            setScheduleOpen(false)
            setDelegarOpen(false)
            setDelegarStep('form')
            setDataInicio('')
            setDataFim('')
            resetToolbar()
            if (editorRef.current) {
                editorRef.current.innerHTML = seedData.descricao || ''
            }
        }, 0)
        return () => clearTimeout(timer)
    }, [seedData, open, resetToolbar])

    const resetForm = () => {
        setNometarefa('')
        setDescricao('')
        setCharCount(0)
        setStep('form')
        setIsAcionavel(null)
        setScheduleOpen(false)
        setDelegarOpen(false)
        setDelegarMode('Delegar')
        setDelegarStep('form')
        setDataInicio('')
        setDataFim('')
        setResponsavel('')
        setSelectedParticipant(null)
        setParticipants([])
        setDelegarInicio('')
        setDelegarFim('')
        setSelectedCategoriaId('')
        setSelectedSubcategoriaId('')
        setDelegarFeedback(null)
        setGutGravidade('5')
        setGutUrgencia('5')
        setGutTendencia('5')
        setTimeWeight(1.01)
        setParticipantsLoading(false)
        resetToolbar()
        if (editorRef.current) {
            editorRef.current.innerHTML = ''
        }
    }

    const handleClose = () => {
        resetForm()
        setFeedback(null)
        onClose()
    }

    const handleBackToForm = () => {
        setStep('form')
        setIsAcionavel(null)
        setScheduleOpen(false)
        setDelegarOpen(false)
    }

    const handlePrimaryAction = () => {
        if (step === 'form') {
            console.log('[CadAtividades] Clique em Continuar (validando formulário)');
            handleSubmit()
            return
        }
        console.log('[CadAtividades] Clique em Voltar');
        handleBackToForm()
    }

    const updateToolbar = useCallback(() => {
        const editor = editorRef.current
        const selection = document.getSelection()
        if (!editor || !selection || !selection.anchorNode) {
            resetToolbar()
            return
        }
        if (!editor.contains(selection.anchorNode)) {
            resetToolbar()
            return
        }
        setIsBold(document.queryCommandState('bold'))
        setIsItalic(document.queryCommandState('italic'))
        setIsUnderline(document.queryCommandState('underline'))
        setIsUnorderedList(document.queryCommandState('insertUnorderedList'))
        setIsOrderedList(document.queryCommandState('insertOrderedList'))
        setIsLink(document.queryCommandState('createLink'))
    }, [resetToolbar])

    const runCommand = useCallback((command) => {
        document.execCommand(command)
        updateToolbar()
        editorRef.current?.focus()
    }, [updateToolbar])

    const toolbarButtonClass = (active) =>
        `text-xs font-semibold p-2 rounded transition-colors ${
            active ? 'text-white bg-zen-border/30' : 'text-zen-text-sec hover:text-white hover:bg-zen-border/30'
        }`

    useEffect(() => {
        const handleSelectionChange = () => updateToolbar()
        document.addEventListener('selectionchange', handleSelectionChange)
        return () => document.removeEventListener('selectionchange', handleSelectionChange)
    }, [updateToolbar])

    useEffect(() => {
        if (!open || step !== 'form') return
        const editor = editorRef.current
        if (!editor) return
        const nextHtml = descricao || ''
        if (editor.innerHTML !== nextHtml) {
            editor.innerHTML = nextHtml
        }
    }, [descricao, open, step])

    const handleInput = (event) => {
        const text = event.currentTarget.innerText || '';
        const currentLength = text.replace(/\n/g, '').length; // Ignora quebras de linha na contagem
        
        setCharCount(currentLength);
        setDescricao(event.currentTarget.innerHTML);
        updateToolbar()
    }

    useEffect(() => {
        if (!delegarOpen || !userId) return
        const loadParticipants = async () => {
            setParticipantsLoading(true)
            const { data, error } = await supabase
                .from('tbf_participantes')
                .select('id, nomeparticipante, fotobase64')
                .eq('idusuario', userId)
                .order('nomeparticipante', { ascending: true })
            if (error) {
                setDelegarFeedback({ type: 'error', message: 'Não foi possível carregar os participantes.' })
                setParticipants([])
                setParticipantsLoading(false)
                return
            }
            setParticipants(data || [])
            setParticipantsLoading(false)
        }
        const loadCategories = async () => {
            const { data, error } = await supabase
                .from('tbf_categorias')
                .select('id, nomecategoria, corcategoria')
                .eq('idusuario', userId)
                .order('nomecategoria', { ascending: true })
            if (error) {
                setDelegarFeedback({ type: 'error', message: 'Não foi possível carregar as categorias.' })
                setCategories([])
                return
            }
            setCategories(data || [])
        }
        const loadSubcategories = async () => {
            const { data, error } = await supabase
                .from('tbf_subcategorias')
                .select('id, nomecategoria, corsubcategoria, idcategorias')
                .eq('idusuario', userId)
                .order('nomecategoria', { ascending: true })
            if (error) {
                setDelegarFeedback({ type: 'error', message: 'Não foi possível carregar as subcategorias.' })
                setSubcategories([])
                return
            }
            setSubcategories(data || [])
        }
        loadParticipants()
        loadCategories()
        loadSubcategories()
    }, [delegarOpen, userId])

    const handleDelegarNext = () => {
        if (!validateForm()) return
        const valid = validateDelegar()
        if (!valid) return
        setDelegarStep('gut')
    }

    const handleDelegarFinalize = async () => {
        if (!validateForm()) return
        const schedule = validateDelegar()
        if (!schedule) return
        setSaving(true)
        const tipoLabel = delegarMode === 'Agendar' ? 'agendamento' : 'delegação'
        const alocadoValue = DELEGAR_DB_VALUE_BY_MODE[delegarMode] || 'delegar'
        const payload = {
            nometarefa: nometarefa.trim(),
            descricao: descricao || null,
            alocado: alocadoValue,
            participante: selectedParticipant?.id ?? null,
            data_inicio: schedule.inicio.toISOString(),
            data_fim: schedule.fim.toISOString(),
            idcategoria: selectedCategoriaId ? Number(selectedCategoriaId) : null,
            idsubcategoria: selectedSubcategoriaId ? Number(selectedSubcategoriaId) : null,
            gravidade: Number(gutGravidade),
            urgencia: Number(gutUrgencia),
            tendencia: Number(gutTendencia),
        }
        const error = await persistAtividade(payload)
        if (error) {
            setDelegarFeedback({
                type: 'error',
                message: isEditing ? `Nao foi possivel atualizar o ${tipoLabel}.` : `Nao foi possivel cadastrar o ${tipoLabel}.`,
            })
            setSaving(false)
            return
        }
        setSaving(false)
        setFeedback({
            type: 'success',
            message: isEditing ? `${delegarMode} atualizado com sucesso.` : `${delegarMode} cadastrado com sucesso.`,
        })
        onSaved?.()
        resetForm()
    }

    // Função para travar a digitação se atingir o limite (permite apagar)
    const handleKeyDown = (event) => {
        const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
        if (charCount >= MAX_CHARS && !allowedKeys.includes(event.key) && !event.ctrlKey && !event.metaKey) {
            event.preventDefault();
        }
    }

    if (!open) return null

    const selectedCategory = categories.find((category) => String(category.id) === String(selectedCategoriaId))
    const filteredSubcategories = subcategories.filter(
        (subcategory) => String(subcategory.idcategorias) === String(selectedCategoriaId)
    )
    const baseGutScore = Number(gutGravidade) * Number(gutUrgencia) * Number(gutTendencia)
    const gutScore = baseGutScore * timeWeight

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            {/* Adicionando estilo embutido para corrigir o reset de CSS do Tailwind nas listas */}
            <style>{`
                .rich-editor-content ul { list-style-type: disc !important; padding-left: 1.5rem !important; margin: 0.5rem 0; }
                .rich-editor-content ol { list-style-type: decimal !important; padding-left: 1.5rem !important; margin: 0.5rem 0; }
                .rich-editor-content { scrollbar-width: thin; scrollbar-color: rgba(148, 163, 184, 0.35) rgba(30, 41, 59, 0.35); }
                .rich-editor-content::-webkit-scrollbar { width: 8px; }
                .rich-editor-content::-webkit-scrollbar-track { background: rgba(30, 41, 59, 0.35); border-radius: 999px; }
                .rich-editor-content::-webkit-scrollbar-thumb { background: rgba(148, 163, 184, 0.35); border-radius: 999px; }
                .rich-editor-content::-webkit-scrollbar-thumb:hover { background: rgba(148, 163, 184, 0.6); }
                .datetime-white::-webkit-calendar-picker-indicator { filter: invert(1); width: 20px; height: 20px; }
                .datetime-white { color-scheme: dark; }
            `}</style>

            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={handleClose}
            />
            <div
                className="relative bg-zen-surface border border-zen-border rounded-xl p-6 w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200"
                onClick={(event) => event.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-5">
                    <div>
                        <h2 className="font-display font-semibold text-lg text-white tracking-tight">Cadastro de Atividades</h2>
                        <p className="text-sm text-zen-text-sec mt-0.5">Registre uma nova atividade.</p>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-2 text-zen-text-sec hover:text-white hover:bg-zen-border/30 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Feedback */}
                {feedback && (
                    <div
                        className={`border rounded-lg px-4 py-3 text-sm flex items-center mb-5 transition-all animate-in slide-in-from-top-2 ${feedback.type === 'error'
                                ? 'border-zen-error/40 text-zen-error bg-zen-error/10'
                                : 'border-zen-success/40 text-zen-success bg-zen-success/10'
                            }`}
                    >
                        {feedback.message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    {step === 'form' && (
                    <div className="flex flex-col gap-5">
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-semibold text-zen-text-tri uppercase tracking-wider">Nome da Atividade</label>
                            <input
                                value={nometarefa}
                                onChange={(event) => setNometarefa(event.target.value)}
                                className="bg-zen-bg border border-zen-border rounded-lg py-2.5 px-3 text-sm text-white focus:border-zen-blue focus:ring-1 focus:ring-zen-blue outline-none transition-all"
                                placeholder="Ex: Reunião de equipe"
                                autoFocus
                            />
                        </div>
                        
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-semibold text-zen-text-tri uppercase tracking-wider flex justify-between">
                                <span>Descrição</span>
                                <span className={`${charCount >= MAX_CHARS ? 'text-zen-error' : 'text-zen-text-sec'}`}>
                                    {MAX_CHARS - charCount} caracteres restantes
                                </span>
                            </label>
                            
                            <div className="flex flex-wrap gap-2">
                            <button
                                type="button"
                                aria-pressed={isBold}
                                onMouseDown={(event) => event.preventDefault()}
                                onClick={() => runCommand('bold')}
                                className={toolbarButtonClass(isBold)}
                            >
                                <Bold className="w-4 h-4" />
                            </button>
                            <button
                                type="button"
                                aria-pressed={isItalic}
                                onMouseDown={(event) => event.preventDefault()}
                                onClick={() => runCommand('italic')}
                                className={toolbarButtonClass(isItalic)}
                            >
                                <Italic className="w-4 h-4" />
                            </button>
                            <button
                                type="button"
                                aria-pressed={isUnderline}
                                onMouseDown={(event) => event.preventDefault()}
                                onClick={() => runCommand('underline')}
                                className={toolbarButtonClass(isUnderline)}
                            >
                                <Underline className="w-4 h-4" />
                            </button>
                            <button
                                type="button"
                                aria-pressed={isUnorderedList}
                                onMouseDown={(event) => event.preventDefault()}
                                onClick={() => runCommand('insertUnorderedList')}
                                className={toolbarButtonClass(isUnorderedList)}
                            >
                                <List className="w-4 h-4" />
                            </button>
                            <button
                                type="button"
                                aria-pressed={isOrderedList}
                                onMouseDown={(event) => event.preventDefault()}
                                onClick={() => runCommand('insertOrderedList')}
                                className={toolbarButtonClass(isOrderedList)}
                            >
                                <ListOrdered className="w-4 h-4" />
                            </button>
                            <button
                                type="button"
                                aria-pressed={isLink}
                                onMouseDown={(event) => event.preventDefault()}
                                onClick={() => {
                                    const url = window.prompt('Informe a URL do link')
                                    if (url) {
                                        document.execCommand('createLink', false, url)
                                        updateToolbar()
                                        editorRef.current?.focus()
                                    }
                                }}
                                className={toolbarButtonClass(isLink)}
                            >
                                <Link2 className="w-4 h-4" />
                            </button>
                            </div>

                            <div
                                ref={editorRef}
                                contentEditable
                                onInput={handleInput}
                                onBlur={handleInput}
                                onKeyDown={handleKeyDown}
                                className="rich-editor-content bg-zen-bg border border-zen-border rounded-lg py-2.5 px-3 text-sm text-white min-h-[8rem] max-h-48 overflow-y-auto focus:outline-none focus:ring-1 focus:ring-zen-blue focus:border-zen-blue transition-all"
                            />
                        </div>
                    </div>
                    )}

                    {step === 'classify' && (
                    <div className="flex flex-col gap-4">
                        <div className="text-sm font-semibold text-white">Essa atividade é acionável?</div>
                        <div className="flex flex-wrap gap-3">
                            <button
                                type="button"
                                onClick={() => setIsAcionavel(true)}
                                className={`text-sm font-semibold px-4 py-2 rounded-lg border transition-colors ${
                                    isAcionavel === true
                                        ? 'border-zen-blue bg-zen-border/30 text-white'
                                        : 'border-zen-border text-zen-text-sec hover:text-white hover:bg-zen-border/30'
                                }`}
                            >
                                Sim, é acionável
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsAcionavel(false)}
                                className={`text-sm font-semibold px-4 py-2 rounded-lg border transition-colors ${
                                    isAcionavel === false
                                        ? 'border-zen-blue bg-zen-border/30 text-white'
                                        : 'border-zen-border text-zen-text-sec hover:text-white hover:bg-zen-border/30'
                                }`}
                            >
                                Não é acionável
                            </button>
                            <button
                                type="button"
                                disabled={saving}
                                onClick={() => {
                                    console.log('[CadAtividades] Clique em Stuff (Nuvem de Ideias)');
                                    handleSave('Stuff', { closeAfter: true, navigateTo: BOX_PATH_BY_STATUS.Stuff })
                                }}
                                className="text-sm font-semibold px-4 py-2 rounded-lg border border-zen-border text-zen-text-sec hover:text-white hover:bg-zen-border/30 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                <Cloud className="w-4 h-4" />
                                Stuff (Nuvem de Ideias)
                            </button>
                        </div>

                        {isAcionavel === false && (
                        <div className="grid sm:grid-cols-3 gap-3">
                            {[
                                { label: 'Trash', value: 'Trash', navigateTo: BOX_PATH_BY_STATUS.Trash },
                                { label: 'Incubado', value: 'Incubado', navigateTo: BOX_PATH_BY_STATUS.Incubado },
                                { label: 'Referência', value: 'Referencia', navigateTo: BOX_PATH_BY_STATUS.Referencia },
                            ].map((opcao) => (
                                <button
                                    key={opcao.value}
                                    type="button"
                                    disabled={saving}
                                    onClick={() => {
                                        console.log(`[CadAtividades] Clique em ${opcao.label} (${opcao.value})`);
                                        handleSave(opcao.value, { closeAfter: true, navigateTo: opcao.navigateTo })
                                    }}
                                    className="text-sm font-semibold px-4 py-2 rounded-lg border border-zen-border text-zen-text-sec hover:text-white hover:bg-zen-border/30 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    {opcao.label}
                                </button>
                            ))}
                        </div>
                        )}

                        {isAcionavel === true && (
                        <div className="grid sm:grid-cols-3 gap-3">
                            <button
                                type="button"
                                disabled={saving}
                                onClick={() => handleSave('Projeto')}
                                className="text-sm font-semibold px-4 py-2 rounded-lg border border-zen-border text-zen-text-sec hover:text-white hover:bg-zen-border/30 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                Projeto
                            </button>
                            <button
                                type="button"
                                disabled={saving}
                                onClick={() => {
                                    setDelegarMode('Agendar')
                                    setDelegarStep('form')
                                    setDelegarOpen(true)
                                }}
                                className="text-sm font-semibold px-4 py-2 rounded-lg border border-zen-border text-zen-text-sec hover:text-white hover:bg-zen-border/30 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                Agendar
                            </button>
                            <button
                                type="button"
                                disabled={saving}
                                onClick={() => {
                                    setDelegarMode('Delegar')
                                    setDelegarStep('form')
                                    setDelegarOpen(true)
                                }}
                                className="text-sm font-semibold px-4 py-2 rounded-lg border border-zen-border text-zen-text-sec hover:text-white hover:bg-zen-border/30 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                Delegar
                            </button>
                        </div>
                        )}
                    </div>
                    )}

                    <div className="flex items-center gap-3 pt-2">
                        <button
                            type="button"
                            disabled={saving || charCount > MAX_CHARS}
                            onClick={handlePrimaryAction}
                            className="flex items-center justify-center min-w-[120px] bg-zen-blue hover:bg-blue-600 text-white text-sm font-semibold py-2.5 px-5 rounded-lg shadow-lg shadow-blue-900/20 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : step === 'form' ? 'Continuar' : 'Voltar'}
                        </button>
                        <button
                            type="button"
                            onClick={handleClose}
                            className="text-sm font-medium text-zen-text-sec hover:text-white hover:bg-zen-border/30 py-2.5 px-4 rounded-lg transition-colors"
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
            {scheduleOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => setScheduleOpen(false)}
                    />
                    <div
                        className="relative bg-zen-surface border border-zen-border rounded-xl p-6 w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="flex items-center justify-between mb-5">
                            <div>
                                <h2 className="font-display font-semibold text-lg text-white tracking-tight">Agendar Atividade</h2>
                                <p className="text-sm text-zen-text-sec mt-0.5">Defina início e fim do agendamento.</p>
                            </div>
                            <button
                                onClick={() => setScheduleOpen(false)}
                                className="p-2 text-zen-text-sec hover:text-white hover:bg-zen-border/30 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-semibold text-zen-text-tri uppercase tracking-wider">Início</label>
                                <input
                                    type="datetime-local"
                                    value={dataInicio}
                                    onChange={(event) => setDataInicio(event.target.value)}
                                    className="bg-zen-bg border border-zen-border rounded-lg py-2.5 px-3 text-sm text-white focus:border-zen-blue focus:ring-1 focus:ring-zen-blue outline-none transition-all"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-semibold text-zen-text-tri uppercase tracking-wider">Fim</label>
                                <input
                                    type="datetime-local"
                                    value={dataFim}
                                    onChange={(event) => setDataFim(event.target.value)}
                                    className="bg-zen-bg border border-zen-border rounded-lg py-2.5 px-3 text-sm text-white focus:border-zen-blue focus:ring-1 focus:ring-zen-blue outline-none transition-all"
                                />
                            </div>
                        </div>
                        <div className="flex items-center gap-3 pt-5">
                            <button
                                type="button"
                                disabled={saving}
                                onClick={handleSaveSchedule}
                                className="flex items-center justify-center min-w-[120px] bg-zen-blue hover:bg-blue-600 text-white text-sm font-semibold py-2.5 px-5 rounded-lg shadow-lg shadow-blue-900/20 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Continuar'}
                            </button>
                            <button
                                type="button"
                                onClick={() => setScheduleOpen(false)}
                                className="text-sm font-medium text-zen-text-sec hover:text-white hover:bg-zen-border/30 py-2.5 px-4 rounded-lg transition-colors"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {delegarOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => {
                            setDelegarOpen(false)
                            setDelegarStep('form')
                            setDelegarFeedback(null)
                        }}
                    />
                    <div
                        className="relative bg-zen-surface border border-zen-border rounded-xl p-6 w-full max-w-2xl shadow-2xl animate-in zoom-in-95 duration-200"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="flex items-center justify-between mb-5">
                            <div>
                                <h2 className="font-display font-semibold text-lg text-white tracking-tight">
                                    {delegarStep === 'form'
                                        ? `${delegarMode} Atividade`
                                        : 'GUT'}
                                </h2>
                                <p className="text-sm text-zen-text-sec mt-0.5">
                                    {delegarStep === 'form'
                                        ? 'Defina responsável, datas e categoria.'
                                        : 'Revise a priorização antes de finalizar.'}
                                </p>
                            </div>
                            <button
                                onClick={() => {
                                    setDelegarOpen(false)
                                    setDelegarStep('form')
                                    setDelegarFeedback(null)
                                }}
                                className="p-2 text-zen-text-sec hover:text-white hover:bg-zen-border/30 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        {delegarFeedback && (
                            <div
                                className={`border rounded-lg px-4 py-3 text-sm flex items-center mb-5 transition-all animate-in slide-in-from-top-2 ${delegarFeedback.type === 'error'
                                        ? 'border-zen-error/40 text-zen-error bg-zen-error/10'
                                        : 'border-zen-success/40 text-zen-success bg-zen-success/10'
                                    }`}
                            >
                                {delegarFeedback.message}
                            </div>
                        )}
                        {delegarStep === 'form' && (
                            <div className="flex flex-col gap-5">
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-semibold text-zen-text-tri uppercase tracking-wider">Responsável</label>
                                    <div className="relative">
                                        <input
                                            value={responsavel}
                                            onChange={(event) => {
                                                const value = event.target.value
                                                setResponsavel(value)
                                                const match = participants.find(
                                                    (item) => item.nomeparticipante.toLowerCase() === value.trim().toLowerCase()
                                                )
                                                setSelectedParticipant(match || null)
                                            }}
                                            list="participants-list"
                                            className="bg-zen-bg border border-zen-border rounded-lg py-2.5 px-10 text-sm text-white focus:border-zen-blue focus:ring-1 focus:ring-zen-blue outline-none transition-all w-full"
                                            placeholder={participantsLoading ? 'Carregando responsáveis...' : 'Selecione o responsável'}
                                        />
                                        {participantsLoading && (
                                            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-zen-blue" />
                                        )}
                                    </div>
                                    <datalist id="participants-list">
                                        {participants.map((participant) => (
                                            <option key={participant.id} value={participant.nomeparticipante} />
                                        ))}
                                    </datalist>
                                    {selectedParticipant && (
                                        <div className="flex items-center gap-3">
                                            <div className="size-10 rounded-full border border-zen-border overflow-hidden flex items-center justify-center bg-zen-bg text-xs text-zen-text-sec">
                                                {selectedParticipant.fotobase64 ? (
                                                    <img
                                                        src={selectedParticipant.fotobase64}
                                                        alt={selectedParticipant.nomeparticipante}
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    getInitials(selectedParticipant.nomeparticipante)
                                                )}
                                            </div>
                                            <span className="text-sm text-white/90">{selectedParticipant.nomeparticipante}</span>
                                        </div>
                                    )}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-semibold text-zen-text-tri uppercase tracking-wider">Data e Hora Início</label>
                                        <input
                                            type="datetime-local"
                                            value={delegarInicio}
                                            onChange={(event) => setDelegarInicio(event.target.value)}
                                            className="bg-zen-bg border border-zen-border rounded-lg py-2.5 px-3 text-sm text-white focus:border-zen-blue focus:ring-1 focus:ring-zen-blue outline-none transition-all datetime-white"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-semibold text-zen-text-tri uppercase tracking-wider">Data e Hora Finalização</label>
                                        <input
                                            type="datetime-local"
                                            value={delegarFim}
                                            onChange={(event) => {
                                                const value = event.target.value
                                                setDelegarFim(value)
                                                setTimeWeight(computeTimeWeight(value, Date.now()))
                                            }}
                                            className="bg-zen-bg border border-zen-border rounded-lg py-2.5 px-3 text-sm text-white focus:border-zen-blue focus:ring-1 focus:ring-zen-blue outline-none transition-all datetime-white"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-semibold text-zen-text-tri uppercase tracking-wider">Categoria</label>
                                        <select
                                            value={selectedCategoriaId}
                                            onChange={(event) => {
                                                setSelectedCategoriaId(event.target.value)
                                                setSelectedSubcategoriaId('')
                                            }}
                                            className="bg-zen-bg border border-zen-border rounded-lg py-2.5 px-3 text-sm text-white focus:border-zen-blue focus:ring-1 focus:ring-zen-blue outline-none transition-all appearance-none cursor-pointer"
                                        >
                                            <option value="">Selecione uma categoria...</option>
                                            {categories.map((category) => (
                                                <option key={category.id} value={category.id}>
                                                    {category.nomecategoria}
                                                </option>
                                            ))}
                                        </select>
                                        {selectedCategory && (
                                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-zen-border/20 border border-zen-border/50 text-xs text-zen-text-sec w-fit">
                                                <span
                                                    className="size-3 rounded-full shadow-sm ring-1 ring-white/10"
                                                    style={{ backgroundColor: selectedCategory.corcategoria }}
                                                />
                                                <span className="font-medium text-white/80">{selectedCategory.nomecategoria}</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-semibold text-zen-text-tri uppercase tracking-wider">Subcategoria</label>
                                        <select
                                            value={selectedSubcategoriaId}
                                            onChange={(event) => setSelectedSubcategoriaId(event.target.value)}
                                            className="bg-zen-bg border border-zen-border rounded-lg py-2.5 px-3 text-sm text-white focus:border-zen-blue focus:ring-1 focus:ring-zen-blue outline-none transition-all appearance-none cursor-pointer"
                                        >
                                            <option value="">Selecione uma subcategoria...</option>
                                            {filteredSubcategories.map((subcategory) => (
                                                <option key={subcategory.id} value={subcategory.id}>
                                                    {subcategory.nomecategoria}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 pt-2">
                                    <button
                                        type="button"
                                        disabled={saving}
                                        onClick={() => {
                                            setDelegarOpen(false)
                                            setDelegarStep('form')
                                            setDelegarFeedback(null)
                                        }}
                                        className="text-sm font-medium text-zen-text-sec hover:text-white hover:bg-zen-border/30 py-2.5 px-4 rounded-lg transition-colors"
                                    >
                                        Voltar
                                    </button>
                                    <button
                                        type="button"
                                        disabled={saving}
                                        onClick={handleDelegarNext}
                                        className="flex items-center justify-center min-w-[120px] bg-zen-blue hover:bg-blue-600 text-white text-sm font-semibold py-2.5 px-5 rounded-lg shadow-lg shadow-blue-900/20 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                                    >
                                        Próximo
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setDelegarOpen(false)
                                            setDelegarStep('form')
                                            setDelegarFeedback(null)
                                        }}
                                        className="text-sm font-medium text-zen-text-sec hover:text-white hover:bg-zen-border/30 py-2.5 px-4 rounded-lg transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </div>
                        )}
                        {delegarStep === 'gut' && (
                            <div className="flex flex-col gap-5">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-semibold text-zen-text-tri uppercase tracking-wider">Gravidade</label>
                                        <input
                                            type="range"
                                            min="1"
                                            max="10"
                                            step="1"
                                            value={gutGravidade}
                                            onChange={(event) => setGutGravidade(event.target.value)}
                                            className="w-full accent-zen-blue"
                                        />
                                        <div className="text-xs text-zen-text-sec">
                                            {gutGravidade} • {gravidadeDescriptions[Number(gutGravidade)]}
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-semibold text-zen-text-tri uppercase tracking-wider">Urgência</label>
                                        <input
                                            type="range"
                                            min="1"
                                            max="10"
                                            step="1"
                                            value={gutUrgencia}
                                            onChange={(event) => setGutUrgencia(event.target.value)}
                                            className="w-full accent-zen-blue"
                                        />
                                        <div className="text-xs text-zen-text-sec">
                                            {gutUrgencia} • {urgenciaDescriptions[Number(gutUrgencia)]}
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-semibold text-zen-text-tri uppercase tracking-wider">Tendência</label>
                                        <input
                                            type="range"
                                            min="1"
                                            max="10"
                                            step="1"
                                            value={gutTendencia}
                                            onChange={(event) => setGutTendencia(event.target.value)}
                                            className="w-full accent-zen-blue"
                                        />
                                        <div className="text-xs text-zen-text-sec">
                                            {gutTendencia} • {tendenciaDescriptions[Number(gutTendencia)]}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-sm text-zen-text-sec">
                                    Pontuação base: <span className="text-white font-semibold">{baseGutScore}</span>
                                </div>
                                <div className="text-sm text-zen-text-sec">
                                    Peso de prazo: <span className="text-white font-semibold">{timeWeight.toFixed(2)}</span>
                                </div>
                                <div className="text-sm text-zen-text-sec">
                                    Pontuação GUT final: <span className="text-white font-semibold">{gutScore.toFixed(2)}</span>
                                </div>
                                <div className="flex items-center gap-3 pt-2">
                                    <button
                                        type="button"
                                        disabled={saving}
                                        onClick={() => setDelegarStep('form')}
                                        className="text-sm font-medium text-zen-text-sec hover:text-white hover:bg-zen-border/30 py-2.5 px-4 rounded-lg transition-colors"
                                    >
                                        Voltar
                                    </button>
                                    <button
                                        type="button"
                                        disabled={saving}
                                        onClick={handleDelegarFinalize}
                                        className="flex items-center justify-center min-w-[120px] bg-zen-blue hover:bg-blue-600 text-white text-sm font-semibold py-2.5 px-5 rounded-lg shadow-lg shadow-blue-900/20 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                                    >
                                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Finalizar'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setDelegarOpen(false)
                                            setDelegarStep('form')
                                            setDelegarFeedback(null)
                                        }}
                                        className="text-sm font-medium text-zen-text-sec hover:text-white hover:bg-zen-border/30 py-2.5 px-4 rounded-lg transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default CadAtividades


