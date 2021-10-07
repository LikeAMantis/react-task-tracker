import { FaTimes } from "react-icons/fa"
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const Task = ({taskData, toggleTask, deleteTask, id}) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({id: id});
      
      const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };
      
    return (
        <div className="taskContainer" ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <div className="task" onClick={() => toggleTask(taskData.id)} style={taskData.done ? {textDecorationLine: 'line-through', color: "black"} : {}}>{taskData.text}</div>
            <FaTimes 
                className="del-icon" 
                onClick={(e) => {e.stopPropagation(); deleteTask(taskData.id); console.log("deleteTask");}}
            />
        </div>
    )
}

export default Task