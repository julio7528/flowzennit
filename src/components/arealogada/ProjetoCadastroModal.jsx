import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AlertCircle, Bold, Italic, List, ListOrdered, Link2, Underline, X } from 'lucide-react'
import { supabase } from '../../lib/supabase.js'

const PROJECT_ALOCADOS = ['taskproj', 'bugproj']

const gravidadeDescriptions = {
    10: 'Catastrofico - interrupcao total ou risco grave.',
    9: 'Critico - prejuizo massivo ou perda relevante.',
    8: 'Severo - compromete operacao em larga escala.',
    7: 'Relevante - impacta metas e acordos importantes.',
    6: 'Moderado alto - afeta a produtividade de um time.',
    5: 'Moderado - impacto localizado e controlavel.',
    4: 'Limitado - dano pequeno e contornavel.',
    3: 'Superficial - reclama internamente, sem perda maior.',
    2: 'Minimo - erro pequeno sem alterar o resultado.',
    1: 'Irrelevante - quase imperceptivel.',
}

const urgenciaDescriptions = {
    10: 'Imediato - resolver agora.',
    9: 'Ate 2 horas - crise instalada.',
    8: 'Hoje - antes do fim do expediente.',
    7: '24 horas - prioridade numero 1.',
    6: 'Ate 3 dias - entra na semana.',
    5: '1 semana - prazo confortavel.',
    4: '15 dias - proximo ciclo.',
    3: '1 mes - impacto baixo no curto prazo.',
    2: 'Proximo trimestre - acompanha de fundo.',
    1: 'Sem prazo - so com folga.',
}

const tendenciaDescriptions = {
    10: 'Explosiva - cresce em poucas horas.',
    9: 'Muito alta - piora diariamente.',
    8: 'Alta - em poucos dias vira crise.',
    7: 'Acelerada - degradacao perceptivel.',
    6: 'Crescente - agrava de forma constante.',
    5: 'Lenta - deteriora aos poucos.',
    4: 'Baixa - piora gradual.',
    3: 'Controlavel - evolucao pequena.',
    2: 'Quase estavel - pouca chance de piora.',
    1: 'Estavel - nao tende a piorar.',
}

const toDateTimeLocalValue = (value) => {
    if (!value) return ''
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return ''
    const offset = date.getTimezoneOffset() * 60000
    return new Date(date.getTime() - offset).toISOString().slice(0, 16)
}

const toIsoOrNull = (value) => {
    if (!value) return null
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return null
    return date.toISOString()
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

const ProjetoCadastroModal = ({ cadastro, seedData, onClose, onSaved }) => {
    const safeCadastro = cadastro || {
        id: '',
        titulo: '',
        descricao: '',
        icone: X,
        borda: 'border-zen-border',
        cor: 'from-zen-bg to-zen-bg',
        destaque: 'text-zen-text-sec',
    }
    const Icone = safeCadastro.icone
    const isTaskOrBug = safeCadastro.id === 'task' || safeCadastro.id === 'bug'
    const isEpic = safeCadastro.id === 'epic'
    const isFeature = safeCadastro.id === 'feature'
    const isUserStory = safeCadastro.id === 'user-story'
    const editingId = seedData?.id ?? null
    const isEditingTaskBug = Boolean(editingId) && isTaskOrBug
    const isEditingEntity = Boolean(editingId) && !isTaskOrBug

    const [step, setStep] = useState('basic')
    const [userId, setUserId] = useState(null)
    const [saving, setSaving] = useState(false)
    const [feedback, setFeedback] = useState(null)

    const [nometarefa, setNometarefa] = useState('')
    const [nomeEpic, setNomeEpic] = useState('')
    const [nomeFeature, setNomeFeature] = useState('')
    const [selectedEpicIdForFeature, setSelectedEpicIdForFeature] = useState('')
    const [epics, setEpics] = useState([])
    const [nomeUserStory, setNomeUserStory] = useState('')
    const [selectedFeatureIdForUserStory, setSelectedFeatureIdForUserStory] = useState('')
    const [features, setFeatures] = useState([])
    const [userStories, setUserStories] = useState([])
    const [selectedUserStoryIdForTask, setSelectedUserStoryIdForTask] = useState('')
    const [taskActivities, setTaskActivities] = useState([])
    const [descricao, setDescricao] = useState('')
    const [charCount, setCharCount] = useState(0)

    const [participants, setParticipants] = useState([])
    const [categories, setCategories] = useState([])
    const [subcategories, setSubcategories] = useState([])
    const [responsavel, setResponsavel] = useState('')
    const [selectedParticipant, setSelectedParticipant] = useState(null)
    const [selectedCategoriaId, setSelectedCategoriaId] = useState('')
    const [selectedSubcategoriaId, setSelectedSubcategoriaId] = useState('')
    const [dataInicio, setDataInicio] = useState('')
    const [dataFim, setDataFim] = useState('')

    const [predecessor, setPredecessor] = useState('')
    const [sucessor, setSucessor] = useState('')
    const [percentualProgresso, setPercentualProgresso] = useState('0')

    const [gutGravidade, setGutGravidade] = useState('5')
    const [gutUrgencia, setGutUrgencia] = useState('5')
    const [gutTendencia, setGutTendencia] = useState('5')
    const [referenceNowMs, setReferenceNowMs] = useState(0)
    const [isBold, setIsBold] = useState(false)
    const [isItalic, setIsItalic] = useState(false)
    const [isUnderline, setIsUnderline] = useState(false)
    const [isUnorderedList, setIsUnorderedList] = useState(false)
    const [isOrderedList, setIsOrderedList] = useState(false)
    const [isLink, setIsLink] = useState(false)
    const editorRef = useRef(null)
    const appliedSeedIdRef = useRef(null)

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => {
            setUserId(data.user?.id || null)
        })
    }, [])

    useEffect(() => {
        if (!feedback) return undefined
        const timer = setTimeout(() => setFeedback(null), 3500)
        return () => clearTimeout(timer)
    }, [feedback])

    useEffect(() => {
        if (!isTaskOrBug || !userId) return
        const loadData = async () => {
            const [{ data: participantsData }, { data: categoriesData }, { data: subcategoriesData }] = await Promise.all([
                supabase.from('tbf_participantes').select('id, nomeparticipante').eq('idusuario', userId).order('nomeparticipante', { ascending: true }),
                supabase.from('tbf_categorias').select('id, nomecategoria').eq('idusuario', userId).order('nomecategoria', { ascending: true }),
                supabase.from('tbf_subcategorias').select('id, nomecategoria, idcategorias').eq('idusuario', userId).order('nomecategoria', { ascending: true }),
            ])
            setParticipants(participantsData || [])
            setCategories(categoriesData || [])
            setSubcategories(subcategoriesData || [])
        }
        loadData()
    }, [isTaskOrBug, userId])

    useEffect(() => {
        if (!isTaskOrBug) return
        const loadUserStories = async () => {
            const { data } = await supabase.from('tbf_userstory').select('id, nome_userstory').order('nome_userstory', { ascending: true })
            setUserStories(data || [])
        }
        loadUserStories()
    }, [isTaskOrBug])

    useEffect(() => {
        if (!isTaskOrBug || !userId) return
        const loadTaskActivities = async () => {
            const { data } = await supabase
                .from('tbf_atividades')
                .select('id, nometarefa, userhistory')
                .eq('idusuario', userId)
                .in('alocado', PROJECT_ALOCADOS)
                .order('nometarefa', { ascending: true })
            setTaskActivities(data || [])
        }
        loadTaskActivities()
    }, [isTaskOrBug, userId])

    useEffect(() => {
        if (!isFeature) return
        const loadEpics = async () => {
            const { data } = await supabase.from('tbf_epic').select('id, nome_epic').order('nome_epic', { ascending: true })
            setEpics(data || [])
        }
        loadEpics()
    }, [isFeature])

    useEffect(() => {
        if (!isUserStory) return
        const loadFeatures = async () => {
            const { data } = await supabase.from('tbf_feature').select('id, nome_feature').order('nome_feature', { ascending: true })
            setFeatures(data || [])
        }
        loadFeatures()
    }, [isUserStory])

    const resetToolbar = useCallback(() => {
        setIsBold(false)
        setIsItalic(false)
        setIsUnderline(false)
        setIsUnorderedList(false)
        setIsOrderedList(false)
        setIsLink(false)
    }, [])

    const getTextLength = useCallback((html) => {
        if (typeof document === 'undefined') return 0
        const container = document.createElement('div')
        container.innerHTML = html || ''
        return (container.innerText || '').replace(/\n/g, '').length
    }, [])

    const resetTaskBugForm = useCallback(() => {
        setStep('basic')
        setNometarefa('')
        setDescricao('')
        setCharCount(0)
        setResponsavel('')
        setSelectedParticipant(null)
        setSelectedCategoriaId('')
        setSelectedSubcategoriaId('')
        setDataInicio('')
        setDataFim('')
        setSelectedUserStoryIdForTask('')
        setPredecessor('')
        setSucessor('')
        setPercentualProgresso('0')
        setGutGravidade('5')
        setGutUrgencia('5')
        setGutTendencia('5')
        setReferenceNowMs(0)
        resetToolbar()
        if (editorRef.current) {
            editorRef.current.innerHTML = ''
        }
    }, [resetToolbar])

    useEffect(() => {
        if (!isTaskOrBug) return

        if (!seedData) {
            if (appliedSeedIdRef.current !== 'new') {
                queueMicrotask(() => resetTaskBugForm())
                appliedSeedIdRef.current = 'new'
            }
            return
        }

        if (appliedSeedIdRef.current === seedData.id) return

        const nextDescricao = seedData.descricao || ''
        queueMicrotask(() => {
            setStep('basic')
            setNometarefa(seedData.nometarefa || '')
            setDescricao(nextDescricao)
            setCharCount(getTextLength(nextDescricao))
            setResponsavel(seedData.participanteNome || '')
            setSelectedParticipant(null)
            setSelectedCategoriaId(seedData.idcategoria ? String(seedData.idcategoria) : '')
            setSelectedSubcategoriaId(seedData.idsubcategoria ? String(seedData.idsubcategoria) : '')
            setDataInicio(toDateTimeLocalValue(seedData.data_inicio))
            setDataFim(toDateTimeLocalValue(seedData.data_fim))
            setSelectedUserStoryIdForTask(seedData.userhistory ? String(seedData.userhistory) : '')
            setPredecessor(seedData.predecessor ? String(seedData.predecessor) : '')
            setSucessor(seedData.sucessor ? String(seedData.sucessor) : '')
            setPercentualProgresso(String(seedData.percentual_progresso ?? 0))
            setGutGravidade(String(seedData.gravidade ?? 5))
            setGutUrgencia(String(seedData.urgencia ?? 5))
            setGutTendencia(String(seedData.tendencia ?? 5))
            setReferenceNowMs(Date.now())
        })

        if (editorRef.current) {
            editorRef.current.innerHTML = nextDescricao
        }

        appliedSeedIdRef.current = seedData.id
    }, [getTextLength, isTaskOrBug, resetTaskBugForm, seedData])

    useEffect(() => {
        if (isTaskOrBug) return
        const currentSeedId = seedData?.id ? String(seedData.id) : 'new'
        if (appliedSeedIdRef.current === currentSeedId) return

        const nextNomeEpic = isEpic && seedData ? seedData.nome_epic || '' : ''
        const nextNomeFeature = isFeature && seedData ? seedData.nome_feature || '' : ''
        const nextSelectedEpicIdForFeature = isFeature && seedData && seedData.id_epic ? String(seedData.id_epic) : ''
        const nextNomeUserStory = isUserStory && seedData ? seedData.nome_userstory || '' : ''
        const nextSelectedFeatureIdForUserStory = isUserStory && seedData && seedData.id_feature ? String(seedData.id_feature) : ''

        queueMicrotask(() => {
            setNomeEpic(nextNomeEpic)
            setNomeFeature(nextNomeFeature)
            setSelectedEpicIdForFeature(nextSelectedEpicIdForFeature)
            setNomeUserStory(nextNomeUserStory)
            setSelectedFeatureIdForUserStory(nextSelectedFeatureIdForUserStory)
        })

        appliedSeedIdRef.current = currentSeedId
    }, [isEpic, isFeature, isTaskOrBug, isUserStory, seedData])

    const updateToolbar = useCallback(() => {
        const editor = editorRef.current
        if (!editor || typeof document === 'undefined') {
            resetToolbar()
            return
        }
        const selection = document.getSelection()
        if (!selection || !selection.anchorNode || !editor.contains(selection.anchorNode)) {
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

    const runCommand = useCallback(
        (command) => {
            if (typeof document === 'undefined') return
            document.execCommand(command)
            updateToolbar()
            editorRef.current?.focus()
        },
        [updateToolbar]
    )

    const toolbarButtonClass = (active) =>
        `rounded p-2 text-xs font-semibold transition-colors ${
            active ? 'bg-zen-border/30 text-white' : 'text-zen-text-sec hover:bg-zen-border/30 hover:text-white'
        }`

    const handleEditorInput = useCallback(() => {
        const nextHtml = editorRef.current?.innerHTML || ''
        setDescricao(nextHtml)
        setCharCount(getTextLength(nextHtml))
    }, [getTextLength])

    const handleEditorKeyDown = useCallback(
        (event) => {
            const selection = window.getSelection()
            const hasSelection = Boolean(selection && !selection.isCollapsed)
            const currentLength = getTextLength(editorRef.current?.innerHTML || '')
            const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Tab']
            if (allowedKeys.includes(event.key) || event.ctrlKey || event.metaKey || hasSelection) return
            if (currentLength >= 1000 && event.key.length === 1) {
                event.preventDefault()
            }
        },
        [getTextLength]
    )

    useEffect(() => {
        if (!isTaskOrBug || step !== 'basic') return
        const editor = editorRef.current
        if (!editor) return
        const nextHtml = descricao || ''
        if (editor.innerHTML !== nextHtml) {
            editor.innerHTML = nextHtml
        }
    }, [descricao, isTaskOrBug, step])

    useEffect(() => {
        if (typeof document === 'undefined') return undefined
        const handleSelectionChange = () => updateToolbar()
        document.addEventListener('selectionchange', handleSelectionChange)
        return () => document.removeEventListener('selectionchange', handleSelectionChange)
    }, [updateToolbar])

    const selectedCategory = categories.find((category) => String(category.id) === String(selectedCategoriaId))
    const filteredSubcategories = subcategories.filter((subcategory) => String(subcategory.idcategorias) === String(selectedCategoriaId))
    const storyActivities = useMemo(() => {
        if (!selectedUserStoryIdForTask) return []
        return taskActivities.filter((atividade) => String(atividade.userhistory) === String(selectedUserStoryIdForTask))
    }, [selectedUserStoryIdForTask, taskActivities])

    const baseGutScore = Number(gutGravidade) * Number(gutUrgencia) * Number(gutTendencia)
    const timeWeight = computeTimeWeight(dataFim, referenceNowMs)
    const gutScore = baseGutScore * timeWeight

    const handleClose = () => {
        if (saving) return
        appliedSeedIdRef.current = null
        onClose()
    }

    const handleNextFromBasic = () => {
        if (!nometarefa.trim()) {
            setFeedback({ type: 'error', message: 'Informe o nome da atividade.' })
            return
        }
        setFeedback(null)
        setStep('detalhes')
    }

    const handleNextFromProgresso = () => {
        if (!selectedUserStoryIdForTask) {
            setFeedback({ type: 'error', message: 'Selecione a User Story vinculada.' })
            return
        }
        setFeedback(null)
        setReferenceNowMs(Date.now())
        setStep('gut')
    }

    const handleSaveTaskBug = async () => {
        if (!userId) {
            setFeedback({ type: 'error', message: 'Usuario nao autenticado.' })
            return
        }
        if (!nometarefa.trim()) {
            setFeedback({ type: 'error', message: 'Informe o nome da atividade.' })
            setStep('basic')
            return
        }
        if (!selectedUserStoryIdForTask) {
            setFeedback({ type: 'error', message: 'Selecione a User Story vinculada.' })
            setStep('progresso')
            return
        }

        setSaving(true)
        setFeedback(null)

        const payload = {
            nometarefa: nometarefa.trim(),
            descricao: descricao.trim() || null,
            alocado: safeCadastro.id === 'task' ? 'taskproj' : 'bugproj',
            participante: selectedParticipant?.id ?? null,
            data_inicio: toIsoOrNull(dataInicio),
            data_fim: toIsoOrNull(dataFim),
            idcategoria: selectedCategoriaId ? Number(selectedCategoriaId) : null,
            idsubcategoria: selectedSubcategoriaId ? Number(selectedSubcategoriaId) : null,
            userhistory: Number(selectedUserStoryIdForTask),
            predecessor: predecessor || null,
            sucessor: sucessor || null,
            percentual_progresso: Number(percentualProgresso),
            gravidade: Number(gutGravidade),
            urgencia: Number(gutUrgencia),
            tendencia: Number(gutTendencia),
        }

        const result = isEditingTaskBug
            ? await supabase.from('tbf_atividades').update(payload).eq('id', editingId).eq('idusuario', userId)
            : await supabase.from('tbf_atividades').insert({ idusuario: userId, 'posicao Kanban': 'backlog', ...payload })

        if (result.error) {
            setFeedback({ type: 'error', message: isEditingTaskBug ? 'Nao foi possivel atualizar o cadastro.' : 'Nao foi possivel salvar o cadastro.' })
            setSaving(false)
            return
        }

        setSaving(false)
        onSaved?.()
        setFeedback({
            type: 'success',
            message: isEditingTaskBug ? `${safeCadastro.titulo.replace('Cadastrar ', '')} atualizado com sucesso.` : `${safeCadastro.titulo} salvo com sucesso.`,
        })
        setTimeout(() => {
            handleClose()
        }, 350)
    }

    const handleSaveEpic = async () => {
        if (!nomeEpic.trim()) {
            setFeedback({ type: 'error', message: 'Informe o nome do Epic.' })
            return
        }
        setSaving(true)
        const query = isEditingEntity
            ? supabase.from('tbf_epic').update({ nome_epic: nomeEpic.trim() }).eq('id', editingId)
            : supabase.from('tbf_epic').insert({ nome_epic: nomeEpic.trim() })
        const { error } = await query
        if (error) {
            setFeedback({ type: 'error', message: isEditingEntity ? 'Nao foi possivel atualizar o Epic.' : 'Nao foi possivel cadastrar o Epic.' })
            setSaving(false)
            return
        }
        setSaving(false)
        onSaved?.()
        setTimeout(() => handleClose(), 350)
    }

    const handleSaveFeature = async () => {
        if (!nomeFeature.trim()) {
            setFeedback({ type: 'error', message: 'Informe o nome da Feature.' })
            return
        }
        if (!selectedEpicIdForFeature) {
            setFeedback({ type: 'error', message: 'Selecione o Epic vinculado.' })
            return
        }
        setSaving(true)
        const payload = {
            nome_feature: nomeFeature.trim(),
            id_epic: Number(selectedEpicIdForFeature),
        }
        const query = isEditingEntity
            ? supabase.from('tbf_feature').update(payload).eq('id', editingId)
            : supabase.from('tbf_feature').insert(payload)
        const { error } = await query
        if (error) {
            setFeedback({ type: 'error', message: isEditingEntity ? 'Nao foi possivel atualizar a Feature.' : 'Nao foi possivel cadastrar a Feature.' })
            setSaving(false)
            return
        }
        setSaving(false)
        onSaved?.()
        setTimeout(() => handleClose(), 350)
    }

    const handleSaveUserStory = async () => {
        if (!nomeUserStory.trim()) {
            setFeedback({ type: 'error', message: 'Informe o nome da User Story.' })
            return
        }
        if (!selectedFeatureIdForUserStory) {
            setFeedback({ type: 'error', message: 'Selecione a Feature vinculada.' })
            return
        }
        setSaving(true)
        const payload = {
            nome_userstory: nomeUserStory.trim(),
            id_feature: Number(selectedFeatureIdForUserStory),
        }
        const query = isEditingEntity
            ? supabase.from('tbf_userstory').update(payload).eq('id', editingId)
            : supabase.from('tbf_userstory').insert(payload)
        const { error } = await query
        if (error) {
            setFeedback({ type: 'error', message: isEditingEntity ? 'Nao foi possivel atualizar a User Story.' : 'Nao foi possivel cadastrar a User Story.' })
            setSaving(false)
            return
        }
        setSaving(false)
        onSaved?.()
        setTimeout(() => handleClose(), 350)
    }

    if (!cadastro) return null

    return (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 animate-in fade-in duration-200">
            <style>{`
                .rich-editor-content ul { list-style-type: disc !important; padding-left: 1.5rem !important; margin: 0.5rem 0; }
                .rich-editor-content ol { list-style-type: decimal !important; padding-left: 1.5rem !important; margin: 0.5rem 0; }
            `}</style>
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={handleClose} />
            <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-zen-border bg-zen-surface shadow-2xl">
                <div className="flex items-start justify-between gap-4 border-b border-zen-border px-6 py-5">
                    <div className="flex items-start gap-4">
                        <div className={`flex h-12 w-12 items-center justify-center rounded-xl border ${safeCadastro.borda} bg-gradient-to-br ${safeCadastro.cor}`}>
                            <Icone className={`h-5 w-5 ${safeCadastro.destaque}`} />
                        </div>
                        <div>
                            <h2 className="font-display text-lg font-semibold text-white">
                                {isTaskOrBug
                                    ? isEditingTaskBug
                                        ? safeCadastro.id === 'task'
                                            ? 'Editar Task de Projeto'
                                            : 'Editar Bug de Projeto'
                                        : step === 'basic'
                                          ? safeCadastro.id === 'task'
                                              ? 'Cadastro de Task de Projeto'
                                              : 'Cadastro de Bug de Projeto'
                                          : step === 'detalhes'
                                            ? 'Detalhes da Atividade'
                                            : step === 'progresso'
                                              ? 'Progresso da Atividade'
                                              : 'Priorizacao GUT'
                                    : isEditingEntity
                                      ? `Editar ${safeCadastro.titulo}`
                                      : safeCadastro.titulo}
                            </h2>
                            <p className="mt-1 text-sm text-zen-text-sec">
                                {isTaskOrBug
                                    ? step === 'basic'
                                        ? 'Informe os dados iniciais da atividade.'
                                        : step === 'detalhes'
                                          ? 'Defina responsavel, datas e categoria.'
                                          : step === 'progresso'
                                            ? 'Defina dependencias e progresso manual.'
                                            : 'Revise a priorizacao antes de salvar.'
                                    : safeCadastro.descricao}
                            </p>
                        </div>
                    </div>
                    <button type="button" onClick={handleClose} className="rounded-lg border border-zen-border p-2 text-zen-text-sec transition-colors hover:bg-zen-border/30 hover:text-white">
                        <X className="h-4 w-4" />
                    </button>
                </div>

                {feedback && (
                    <div className={`mx-6 mt-4 rounded-lg border px-4 py-3 text-sm ${
                        feedback.type === 'error'
                            ? 'border-zen-error/40 bg-zen-error/10 text-zen-error'
                            : 'border-zen-success/40 bg-zen-success/10 text-zen-success'
                    }`}>
                        {feedback.message}
                    </div>
                )}

                {isEpic && (
                    <>
                        <div className="px-6 py-5">
                            <label className="flex flex-col gap-2">
                                <span className="text-xs font-semibold uppercase tracking-wider text-zen-text-tri">Nome do Epic</span>
                                <input
                                    value={nomeEpic}
                                    onChange={(event) => setNomeEpic(event.target.value)}
                                    className="rounded-lg border border-zen-border bg-zen-bg px-3 py-2.5 text-sm text-white outline-none transition-all focus:border-zen-blue focus:ring-1 focus:ring-zen-blue"
                                    placeholder="Ex: Reestruturacao do portal do cliente"
                                    autoFocus
                                />
                            </label>
                        </div>
                        <div className="flex items-center justify-end gap-3 border-t border-zen-border px-6 py-4">
                            <button type="button" onClick={handleClose} className="rounded-lg px-4 py-2.5 text-sm font-medium text-zen-text-sec transition-colors hover:bg-zen-border/30 hover:text-white">Fechar</button>
                            <button type="button" onClick={handleSaveEpic} disabled={saving} className="rounded-lg bg-zen-blue px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60">
                                {saving ? 'Salvando...' : isEditingEntity ? 'Salvar alteracoes' : 'Cadastrar'}
                            </button>
                        </div>
                    </>
                )}

                {isFeature && (
                    <>
                        <div className="grid gap-4 px-6 py-5">
                            <label className="flex flex-col gap-2">
                                <span className="text-xs font-semibold uppercase tracking-wider text-zen-text-tri">Nome da Feature</span>
                                <input
                                    value={nomeFeature}
                                    onChange={(event) => setNomeFeature(event.target.value)}
                                    className="rounded-lg border border-zen-border bg-zen-bg px-3 py-2.5 text-sm text-white outline-none transition-all focus:border-zen-blue focus:ring-1 focus:ring-zen-blue"
                                    placeholder="Ex: Gestao de dependencias"
                                    autoFocus
                                />
                            </label>
                            <label className="flex flex-col gap-2">
                                <span className="text-xs font-semibold uppercase tracking-wider text-zen-text-tri">Epic vinculado</span>
                                <select
                                    value={selectedEpicIdForFeature}
                                    onChange={(event) => setSelectedEpicIdForFeature(event.target.value)}
                                    className="rounded-lg border border-zen-border bg-zen-bg px-3 py-2.5 text-sm text-white outline-none transition-all focus:border-zen-blue focus:ring-1 focus:ring-zen-blue"
                                >
                                    <option value="">Selecione um Epic...</option>
                                    {epics.map((epic) => (
                                        <option key={epic.id} value={epic.id}>{epic.nome_epic}</option>
                                    ))}
                                </select>
                            </label>
                        </div>
                        <div className="flex items-center justify-end gap-3 border-t border-zen-border px-6 py-4">
                            <button type="button" onClick={handleClose} className="rounded-lg px-4 py-2.5 text-sm font-medium text-zen-text-sec transition-colors hover:bg-zen-border/30 hover:text-white">Fechar</button>
                            <button type="button" onClick={handleSaveFeature} disabled={saving} className="rounded-lg bg-zen-blue px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60">
                                {saving ? 'Salvando...' : isEditingEntity ? 'Salvar alteracoes' : 'Cadastrar'}
                            </button>
                        </div>
                    </>
                )}

                {isUserStory && (
                    <>
                        <div className="grid gap-4 px-6 py-5">
                            <label className="flex flex-col gap-2">
                                <span className="text-xs font-semibold uppercase tracking-wider text-zen-text-tri">Nome da User Story</span>
                                <input
                                    value={nomeUserStory}
                                    onChange={(event) => setNomeUserStory(event.target.value)}
                                    className="rounded-lg border border-zen-border bg-zen-bg px-3 py-2.5 text-sm text-white outline-none transition-all focus:border-zen-blue focus:ring-1 focus:ring-zen-blue"
                                    placeholder="Ex: Acompanhar impedimentos do projeto"
                                    autoFocus
                                />
                            </label>
                            <label className="flex flex-col gap-2">
                                <span className="text-xs font-semibold uppercase tracking-wider text-zen-text-tri">Feature vinculada</span>
                                <select
                                    value={selectedFeatureIdForUserStory}
                                    onChange={(event) => setSelectedFeatureIdForUserStory(event.target.value)}
                                    className="rounded-lg border border-zen-border bg-zen-bg px-3 py-2.5 text-sm text-white outline-none transition-all focus:border-zen-blue focus:ring-1 focus:ring-zen-blue"
                                >
                                    <option value="">Selecione uma Feature...</option>
                                    {features.map((feature) => (
                                        <option key={feature.id} value={feature.id}>{feature.nome_feature}</option>
                                    ))}
                                </select>
                            </label>
                        </div>
                        <div className="flex items-center justify-end gap-3 border-t border-zen-border px-6 py-4">
                            <button type="button" onClick={handleClose} className="rounded-lg px-4 py-2.5 text-sm font-medium text-zen-text-sec transition-colors hover:bg-zen-border/30 hover:text-white">Fechar</button>
                            <button type="button" onClick={handleSaveUserStory} disabled={saving} className="rounded-lg bg-zen-blue px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60">
                                {saving ? 'Salvando...' : isEditingEntity ? 'Salvar alteracoes' : 'Cadastrar'}
                            </button>
                        </div>
                    </>
                )}
                {!isTaskOrBug && !isEpic && !isFeature && !isUserStory && (
                    <>
                        <div className="px-6 py-5">
                            <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
                                <div className="flex items-start gap-2 text-sm text-amber-200">
                                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                                    <p>Esta janela nao esta mapeada para cadastro dinamico.</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-end gap-3 border-t border-zen-border px-6 py-4">
                            <button type="button" onClick={handleClose} className="rounded-lg px-4 py-2.5 text-sm font-medium text-zen-text-sec transition-colors hover:bg-zen-border/30 hover:text-white">Fechar</button>
                        </div>
                    </>
                )}

                {isTaskOrBug && step === 'basic' && (
                    <>
                        <div className="grid gap-4 px-6 py-5">
                            <label className="flex flex-col gap-2">
                                <span className="text-xs font-semibold uppercase tracking-wider text-zen-text-tri">
                                    {safeCadastro.id === 'task' ? 'Nome da Atividade (Task)' : 'Nome da Atividade (Bug)'}
                                </span>
                                <input
                                    value={nometarefa}
                                    onChange={(event) => setNometarefa(event.target.value)}
                                    className="rounded-lg border border-zen-border bg-zen-bg px-3 py-2.5 text-sm text-white outline-none transition-all focus:border-zen-blue focus:ring-1 focus:ring-zen-blue"
                                    placeholder="Ex: Implementar relatorio de sprint"
                                    autoFocus
                                />
                            </label>
                            <label className="flex flex-col gap-2">
                                <span className="flex justify-between text-xs font-semibold uppercase tracking-wider text-zen-text-tri">
                                    <span>Descricao</span>
                                    <span className={charCount >= 1000 ? 'text-zen-error' : 'text-zen-text-sec'}>
                                        {Math.max(0, 1000 - charCount)} caracteres restantes
                                    </span>
                                </span>
                                <div className="flex flex-wrap gap-2">
                                    <button type="button" aria-pressed={isBold} onMouseDown={(event) => event.preventDefault()} onClick={() => runCommand('bold')} className={toolbarButtonClass(isBold)}><Bold className="h-4 w-4" /></button>
                                    <button type="button" aria-pressed={isItalic} onMouseDown={(event) => event.preventDefault()} onClick={() => runCommand('italic')} className={toolbarButtonClass(isItalic)}><Italic className="h-4 w-4" /></button>
                                    <button type="button" aria-pressed={isUnderline} onMouseDown={(event) => event.preventDefault()} onClick={() => runCommand('underline')} className={toolbarButtonClass(isUnderline)}><Underline className="h-4 w-4" /></button>
                                    <button type="button" aria-pressed={isUnorderedList} onMouseDown={(event) => event.preventDefault()} onClick={() => runCommand('insertUnorderedList')} className={toolbarButtonClass(isUnorderedList)}><List className="h-4 w-4" /></button>
                                    <button type="button" aria-pressed={isOrderedList} onMouseDown={(event) => event.preventDefault()} onClick={() => runCommand('insertOrderedList')} className={toolbarButtonClass(isOrderedList)}><ListOrdered className="h-4 w-4" /></button>
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
                                        <Link2 className="h-4 w-4" />
                                    </button>
                                </div>
                                <div ref={editorRef} contentEditable onInput={handleEditorInput} onBlur={handleEditorInput} onKeyDown={handleEditorKeyDown} className="rich-editor-content min-h-[8rem] max-h-48 overflow-y-auto rounded-lg border border-zen-border bg-zen-bg px-3 py-2.5 text-sm text-white transition-all focus:border-zen-blue focus:outline-none focus:ring-1 focus:ring-zen-blue" />
                            </label>
                        </div>
                        <div className="flex items-center justify-end gap-3 border-t border-zen-border px-6 py-4">
                            <button type="button" onClick={handleClose} className="rounded-lg px-4 py-2.5 text-sm font-medium text-zen-text-sec transition-colors hover:bg-zen-border/30 hover:text-white">Fechar</button>
                            <button type="button" onClick={handleNextFromBasic} className="rounded-lg bg-zen-blue px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-600">Proximo</button>
                        </div>
                    </>
                )}

                {isTaskOrBug && step === 'detalhes' && (
                    <div className="px-6 py-5">
                        <div className="flex flex-col gap-5">
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-semibold uppercase tracking-wider text-zen-text-tri">Responsavel</label>
                                <input
                                    value={responsavel}
                                    onChange={(event) => {
                                        const value = event.target.value
                                        setResponsavel(value)
                                        const match = participants.find((item) => item.nomeparticipante.toLowerCase() === value.trim().toLowerCase())
                                        setSelectedParticipant(match || null)
                                    }}
                                    list="participants-list-projeto"
                                    className="w-full rounded-lg border border-zen-border bg-zen-bg px-3 py-2.5 text-sm text-white outline-none transition-all focus:border-zen-blue focus:ring-1 focus:ring-zen-blue"
                                    placeholder="Selecione o responsavel"
                                />
                                <datalist id="participants-list-projeto">
                                    {participants.map((participant) => (
                                        <option key={participant.id} value={participant.nomeparticipante} />
                                    ))}
                                </datalist>
                            </div>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-semibold uppercase tracking-wider text-zen-text-tri">Data e Hora Inicio</label>
                                    <input type="datetime-local" value={dataInicio} onChange={(event) => setDataInicio(event.target.value)} className="rounded-lg border border-zen-border bg-zen-bg px-3 py-2.5 text-sm text-white outline-none transition-all focus:border-zen-blue focus:ring-1 focus:ring-zen-blue" />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-semibold uppercase tracking-wider text-zen-text-tri">Data e Hora Finalizacao</label>
                                    <input type="datetime-local" value={dataFim} onChange={(event) => setDataFim(event.target.value)} className="rounded-lg border border-zen-border bg-zen-bg px-3 py-2.5 text-sm text-white outline-none transition-all focus:border-zen-blue focus:ring-1 focus:ring-zen-blue" />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-semibold uppercase tracking-wider text-zen-text-tri">Categoria</label>
                                    <select value={selectedCategoriaId} onChange={(event) => { setSelectedCategoriaId(event.target.value); setSelectedSubcategoriaId('') }} className="rounded-lg border border-zen-border bg-zen-bg px-3 py-2.5 text-sm text-white outline-none transition-all focus:border-zen-blue focus:ring-1 focus:ring-zen-blue">
                                        <option value="">Selecione uma categoria...</option>
                                        {categories.map((category) => (
                                            <option key={category.id} value={category.id}>{category.nomecategoria}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-semibold uppercase tracking-wider text-zen-text-tri">Subcategoria</label>
                                    <select value={selectedSubcategoriaId} onChange={(event) => setSelectedSubcategoriaId(event.target.value)} className="rounded-lg border border-zen-border bg-zen-bg px-3 py-2.5 text-sm text-white outline-none transition-all focus:border-zen-blue focus:ring-1 focus:ring-zen-blue">
                                        <option value="">Selecione uma subcategoria...</option>
                                        {filteredSubcategories.map((subcategory) => (
                                            <option key={subcategory.id} value={subcategory.id}>{subcategory.nomecategoria}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            {selectedCategory && <div className="text-xs text-zen-text-sec">Categoria selecionada: <span className="text-white">{selectedCategory.nomecategoria}</span></div>}
                            <div className="flex items-center gap-3 pt-2">
                                <button type="button" onClick={() => setStep('basic')} className="rounded-lg px-4 py-2.5 text-sm font-medium text-zen-text-sec transition-colors hover:bg-zen-border/30 hover:text-white">Voltar</button>
                                <button type="button" onClick={() => setStep('progresso')} className="min-w-[120px] rounded-lg bg-zen-blue px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-blue-600">Proximo</button>
                                <button type="button" onClick={handleClose} className="rounded-lg px-4 py-2.5 text-sm font-medium text-zen-text-sec transition-colors hover:bg-zen-border/30 hover:text-white">Cancelar</button>
                            </div>
                        </div>
                    </div>
                )}

                {isTaskOrBug && step === 'progresso' && (
                    <div className="px-6 py-5">
                        <div className="flex flex-col gap-5">
                            <label className="flex flex-col gap-2">
                                <span className="text-xs font-semibold uppercase tracking-wider text-zen-text-tri">User Story vinculada</span>
                                <select value={selectedUserStoryIdForTask} onChange={(event) => { setSelectedUserStoryIdForTask(event.target.value); setPredecessor(''); setSucessor('') }} className="rounded-lg border border-zen-border bg-zen-bg px-3 py-2.5 text-sm text-white outline-none transition-all focus:border-zen-blue focus:ring-1 focus:ring-zen-blue">
                                    <option value="">Selecione uma User Story...</option>
                                    {userStories.map((userStory) => (
                                        <option key={userStory.id} value={userStory.id}>{userStory.nome_userstory}</option>
                                    ))}
                                </select>
                            </label>
                            <label className="flex flex-col gap-2">
                                <span className="text-xs font-semibold uppercase tracking-wider text-zen-text-tri">Predecessor</span>
                                <select value={predecessor} onChange={(event) => setPredecessor(event.target.value)} disabled={!selectedUserStoryIdForTask} className="rounded-lg border border-zen-border bg-zen-bg px-3 py-2.5 text-sm text-white outline-none transition-all focus:border-zen-blue focus:ring-1 focus:ring-zen-blue disabled:cursor-not-allowed disabled:opacity-60">
                                    <option value="">Selecione uma task...</option>
                                    {storyActivities.map((atividade) => (
                                        <option key={atividade.id} value={atividade.id}>{atividade.nometarefa}</option>
                                    ))}
                                </select>
                            </label>
                            <label className="flex flex-col gap-2">
                                <span className="text-xs font-semibold uppercase tracking-wider text-zen-text-tri">Sucessor</span>
                                <select value={sucessor} onChange={(event) => setSucessor(event.target.value)} disabled={!selectedUserStoryIdForTask} className="rounded-lg border border-zen-border bg-zen-bg px-3 py-2.5 text-sm text-white outline-none transition-all focus:border-zen-blue focus:ring-1 focus:ring-zen-blue disabled:cursor-not-allowed disabled:opacity-60">
                                    <option value="">Selecione uma task...</option>
                                    {storyActivities.map((atividade) => (
                                        <option key={atividade.id} value={atividade.id}>{atividade.nometarefa}</option>
                                    ))}
                                </select>
                            </label>
                            <div className="flex flex-col gap-2">
                                <span className="text-xs font-semibold uppercase tracking-wider text-zen-text-tri">Percentual de progresso</span>
                                <input type="range" min="0" max="100" step="1" value={percentualProgresso} onChange={(event) => setPercentualProgresso(event.target.value)} className="w-full accent-zen-blue" />
                                <span className="text-sm text-zen-text-sec">{percentualProgresso}%</span>
                            </div>
                            <div className="flex items-center gap-3 pt-2">
                                <button type="button" onClick={() => setStep('detalhes')} className="rounded-lg px-4 py-2.5 text-sm font-medium text-zen-text-sec transition-colors hover:bg-zen-border/30 hover:text-white">Voltar</button>
                                <button type="button" onClick={handleNextFromProgresso} className="min-w-[120px] rounded-lg bg-zen-blue px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-blue-600">Proximo</button>
                                <button type="button" onClick={handleClose} className="rounded-lg px-4 py-2.5 text-sm font-medium text-zen-text-sec transition-colors hover:bg-zen-border/30 hover:text-white">Cancelar</button>
                            </div>
                        </div>
                    </div>
                )}

                {isTaskOrBug && step === 'gut' && (
                    <div className="px-6 py-5">
                        <div className="flex flex-col gap-5">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-semibold uppercase tracking-wider text-zen-text-tri">Gravidade</label>
                                    <input type="range" min="1" max="10" step="1" value={gutGravidade} onChange={(event) => setGutGravidade(event.target.value)} className="w-full accent-zen-blue" />
                                    <div className="text-xs text-zen-text-sec">{gutGravidade} - {gravidadeDescriptions[Number(gutGravidade)]}</div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-semibold uppercase tracking-wider text-zen-text-tri">Urgencia</label>
                                    <input type="range" min="1" max="10" step="1" value={gutUrgencia} onChange={(event) => setGutUrgencia(event.target.value)} className="w-full accent-zen-blue" />
                                    <div className="text-xs text-zen-text-sec">{gutUrgencia} - {urgenciaDescriptions[Number(gutUrgencia)]}</div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-semibold uppercase tracking-wider text-zen-text-tri">Tendencia</label>
                                    <input type="range" min="1" max="10" step="1" value={gutTendencia} onChange={(event) => setGutTendencia(event.target.value)} className="w-full accent-zen-blue" />
                                    <div className="text-xs text-zen-text-sec">{gutTendencia} - {tendenciaDescriptions[Number(gutTendencia)]}</div>
                                </div>
                            </div>
                            <div className="grid gap-2 text-sm text-zen-text-sec sm:grid-cols-3">
                                <div className="rounded-xl border border-zen-border bg-zen-bg/60 p-3">Pontuacao base: <span className="font-semibold text-white">{baseGutScore}</span></div>
                                <div className="rounded-xl border border-zen-border bg-zen-bg/60 p-3">Peso de prazo: <span className="font-semibold text-white">{timeWeight.toFixed(2)}</span></div>
                                <div className="rounded-xl border border-zen-border bg-zen-bg/60 p-3">GUT final: <span className="font-semibold text-white">{gutScore.toFixed(2)}</span></div>
                            </div>
                            <div className="flex items-center gap-3 pt-2">
                                <button type="button" onClick={() => setStep('progresso')} className="rounded-lg px-4 py-2.5 text-sm font-medium text-zen-text-sec transition-colors hover:bg-zen-border/30 hover:text-white">Voltar</button>
                                <button type="button" onClick={handleSaveTaskBug} disabled={saving} className="min-w-[140px] rounded-lg bg-zen-blue px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60">
                                    {saving ? 'Salvando...' : isEditingTaskBug ? 'Salvar alteracoes' : 'Finalizar'}
                                </button>
                                <button type="button" onClick={handleClose} className="rounded-lg px-4 py-2.5 text-sm font-medium text-zen-text-sec transition-colors hover:bg-zen-border/30 hover:text-white">Cancelar</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ProjetoCadastroModal
