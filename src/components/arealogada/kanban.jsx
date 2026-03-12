import KanbanBoardBase from './KanbanBoardBase.jsx'

const Kanban = () => (
    <KanbanBoardBase
        title="Board Kanban"
        description="Visualize todos os cards do workspace ou troque para os recortes de projetos e do fluxo inicial."
        defaultViewMode="all"
        showViewOptions
    />
)

export default Kanban
