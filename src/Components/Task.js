import { FaTimes } from "react-icons/fa"

const Task = ({taskData, toggleTask, deleteTask}) => {
    return (
        <div className="taskContainer">
            <div className="task" onClick={() => toggleTask(taskData.id)} style={taskData.done ? {textDecorationLine: 'line-through', color: "black"} : {}}>{taskData.text}</div>
            <FaTimes 
                className="del-icon" 
                onClick={(e) => {e.stopPropagation(); deleteTask(taskData.id); console.log("deleteTask");}}
            />
        </div>
    )
}

export default Task