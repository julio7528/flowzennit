import KanbanBoardBase from './KanbanBoardBase.jsx'
import { PROJECT_KANBAN_GROUPS } from './kanban-model.js'

const KanbanProj = ({ onCardOpen, refreshToken = 0, onChanged }) => (
    <KanbanBoardBase
        title="Kanban do projeto"
        description="Fluxo operacional das tasks e bugs do modulo de projetos."
        kanbanGroups={PROJECT_KANBAN_GROUPS}
        forceViewMode="projects"
        showViewOptions={false}
        onCardOpen={onCardOpen}
        refreshToken={refreshToken}
        onChanged={onChanged}
    />
)

export default KanbanProj
