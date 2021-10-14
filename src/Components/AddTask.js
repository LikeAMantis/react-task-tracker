import { useState } from "react";
import { TiPlus } from "react-icons/ti"


const AddTask = ({addTask}) => {
    const [value, setValue] = useState("");
    const [edit, setEdit] = useState(false);

    function onClick() {
        addTask(value);
        setValue("");
        setEdit(false);
    }



    
    function drawEdit() {
        return(
            <div>
                <input 
                    ref={input => input && input.focus()} 
                    onKeyDown={(e) => onKeyDown(e)} 
                    onChange={(e) => {setValue(e.target.value)}} 
                    value={value}
                    placeholder="Add Task"
                ></input>
                <div>
                    <button className="save-btn" onClick={onClick}>Save</button>
                    <button onClick={() => setEdit(false)}>Cancel</button>
                </div>
            </div>
        )
    }

    function drawAddTask() {
        return <div id="addTask" onClick={() => setEdit(true)}><TiPlus /><span>Add Task</span></div>
    }

    function onKeyDown(e) {
        if (e.code==="Enter") {
            onClick();
            setEdit(false);
        }
        else if (e.code==="Escape") {
            setEdit(false);
        }
    }

    return (
        <>{!edit ? drawAddTask() : drawEdit() }</>
    )
}

export default AddTask