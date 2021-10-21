import { useState } from "react";
import { TiPlus } from "react-icons/ti"


const AddTask = ({ onAdd }) => {
    const [value, setValue] = useState("");
    const [isEdit, setIsEdit] = useState(false);

    function onClick() {
        onAdd(value);
        setValue("");
        setIsEdit(false);
    }

    function drawEdit() {
        return(
            <div>
                <input 
                    ref={input => input && input.focus()} 
                    onKeyDown={(e) => handleKeyDown(e)} 
                    onChange={(e) => {setValue(e.target.value)}} 
                    value={value}
                    placeholder="Add Task"
                ></input>
                <div>
                    <button className="save-btn" onClick={onClick}>Save</button>
                    <button onClick={() => setIsEdit(false)}>Cancel</button>
                </div>
            </div>
        )
    }

    function drawAddTask() {
        return ( 
            <div id="addTask" onClick={() => setIsEdit(true)}>
                <TiPlus /><span>Add Task</span>
            </div>
        )
    }

    function handleKeyDown(e) {
        if (e.code==="Enter") {
            onClick();
            setIsEdit(false);
        }
        else if (e.code==="Escape") {
            setIsEdit(false);
        }
    }

    return (
        <>{!isEdit ? drawAddTask() : drawEdit() }</>
    )
}

export default AddTask