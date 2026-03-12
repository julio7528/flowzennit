export const EXCLUDED_ALOCADO_CLAUSE = '("Stuff","Trash","Referencia","Incubado")'
export const BACKLOG_STATE = 'backlog'

const DEFAULT_MACRO_COLUMNS = [
    'Backlog',
    'Analise (Plan)',
    'Doing (Do)',
    'Conferindo (Check)',
    'Revisao e Padronizacao (Act)',
    'Done',
]

export const VIEW_OPTIONS = [
    {
        value: 'all',
        label: 'Todos',
        description: 'Exibe todos os cards validos do workspace.',
    },
    {
        value: 'projects',
        label: 'Projetos',
        description: 'Mostra apenas cards taskproj e bugproj.',
    },
    {
        value: 'initial',
        label: 'Agendar e delegar',
        description: 'Foca no fluxo inicial de agendar e delegar.',
    },
]

export const ALOCADOS_BY_VIEW_MODE = {
    all: null,
    projects: ['taskproj', 'bugproj'],
    initial: ['agendar', 'delegar'],
}

export const normalizeState = (value) => (typeof value === 'string' ? value.trim() : '')

export const tryFixMojibake = (value) => {
    if (typeof value !== 'string' || !value) return ''
    try {
        return decodeURIComponent(escape(value))
    } catch {
        return value
    }
}

export const normalizeKey = (value) =>
    normalizeState(tryFixMojibake(value))
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\([^)]*\)/g, ' ')
        .replace(/[^a-zA-Z0-9\s]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .toLowerCase()

export const stripHtml = (value) => normalizeState(typeof value === 'string' ? value.replace(/<[^>]+>/g, ' ') : '')

export const KANBAN_GROUPS = DEFAULT_MACRO_COLUMNS.map((stage) => ({
    stage,
    states: normalizeKey(stage).includes('backlog') ? [BACKLOG_STATE] : [stage],
}))

export const PROJECT_KANBAN_GROUPS = [
    {
        stage: 'Backlog',
        states: ['backlog'],
    },
    {
        stage: 'Analise (Plan)',
        states: [
            'identificacao do problema',
            'observacao',
            'analise',
            'planejamento de acao',
            'aguardando plan',
            'bloqueado plan',
            'aguardando plano',
            'bloqueado plano',
        ],
    },
    {
        stage: 'Doing (Do)',
        states: ['em execucao', 'aguardando doing', 'bloqueado doing'],
    },
    {
        stage: 'Conferindo (Check)',
        states: ['verificacao', 'validacao', 'conferencia de aderencia'],
    },
    {
        stage: 'Revisao e Padronizacao (Act)',
        states: ['padronizacao', 'conclusao'],
    },
    {
        stage: 'Done',
        states: ['documentado', 'conhecimento consolidado', 'done'],
    },
]

export const isStateInGroup = (stateValue, group) => {
    const target = normalizeKey(stateValue)
    if (!target) return false
    return group.states.some((state) => normalizeKey(state) === target)
}

export const findGroupByState = (stateValue, groups = KANBAN_GROUPS) =>
    groups.find((group) => isStateInGroup(stateValue, group)) || null

export const getStageLabelByState = (stateValue, groups = KANBAN_GROUPS) => findGroupByState(stateValue, groups)?.stage || 'Sem etapa'

export const isDoneState = (stateValue, groups = KANBAN_GROUPS) => {
    const directKey = normalizeKey(stateValue)
    if (directKey === 'done') return true
    const group = findGroupByState(stateValue, groups)
    return normalizeKey(group?.stage).includes('done')
}

export const getStateBadgeClass = (state) => {
    const key = normalizeKey(state)
    if (key.includes('bloqueado')) return 'border-zen-error/50 bg-zen-error/10 text-zen-error'
    if (key.includes('aguardando')) return 'border-yellow-500/50 bg-yellow-500/10 text-yellow-300'
    if (key.includes('execucao') || key.includes('doing')) return 'border-zen-blue/50 bg-zen-blue/15 text-blue-200'
    if (key.includes('check') || key.includes('verificacao') || key.includes('validacao') || key.includes('conferencia')) {
        return 'border-cyan-500/50 bg-cyan-500/10 text-cyan-200'
    }
    if (key.includes('act') || key.includes('padronizacao') || key.includes('conclusao')) {
        return 'border-emerald-500/50 bg-emerald-500/10 text-emerald-200'
    }
    if (key.includes('done') || key.includes('documentado')) return 'border-emerald-400/50 bg-emerald-400/10 text-emerald-100'
    return 'border-zen-border bg-zen-bg/80 text-zen-text-sec'
}
