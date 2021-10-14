import { forwardRef, useState } from "react";
import { FaTimes } from "react-icons/fa"
import { GrDrag } from "react-icons/gr"
import { BsCheck } from "react-icons/bs"


const Task = forwardRef(({taskData, deleteTask, putTask, attributes, listeners, style}, ref) => {
    const [value, setValue] = useState(taskData.text);

    function onKeyDown(e) {
        if (e.code === "Enter" || e.code === "Escape") {
            e.target.blur();
        }
    }
   
    return (
        <div className="taskContainer" ref={ref} style={style}>
            <GrDrag className="dragHandle" {...listeners} {...attributes}></GrDrag>
            <div className="checkbox" 
                onClick={() => putTask({...taskData, done: !taskData.done})} 
                >
                { taskData.done && <BsCheck/>}
            </div>
            <input 
                className="task" 
                style={taskData.done ? {textDecorationLine: 'line-through', color: "grey"} : null}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onBlur={() => putTask({...taskData, text: value})}
                onKeyDown={(e) => onKeyDown(e)}
                >
            </input>
            <FaTimes 
                className="del-icon" 
                onClick={(e) => {e.stopPropagation(); deleteTask(taskData.id); console.log("deleteTask");}}
                />
        </div>
    )
});

export default Task