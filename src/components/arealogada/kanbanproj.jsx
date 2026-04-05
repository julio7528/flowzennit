import { useTranslation } from 'react-i18next'
import KanbanBoardBase from './KanbanBoardBase.jsx'
import { PROJECT_KANBAN_GROUPS } from './kanban-model.js'

const KanbanProj = ({ onCardOpen, refreshToken = 0, onChanged }) => {
    const { t } = useTranslation()

    return (
        <KanbanBoardBase
            title={t('projects.kanban.title')}
            description={t('projects.kanban.description')}
            kanbanGroups={PROJECT_KANBAN_GROUPS}
            forceViewMode="projects"
            showViewOptions={false}
            onCardOpen={onCardOpen}
            refreshToken={refreshToken}
            onChanged={onChanged}
        />
    )
}

export default KanbanProj
