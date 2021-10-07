import { useState, useEffect } from "react";
import { IoAddCircleSharp } from "react-icons/io5"


const AddTask = ({addTask}) => {
    const [value, setValue] = useState("");
    const [edit, setEdit] = useState(false);

    // useEffect(() => {
    //     if(edit) {
    //         this.refs.taskInput.focus();
    //     }
    // }, [edit])

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
                    onKeyDown={(e) => e.code==="Enter" && onClick()} 
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
        return <><IoAddCircleSharp /><span onClick={() => setEdit(true)}>Add Task</span></>
    }

    return (
        <div id="addTask">
            {!edit ? drawAddTask() : drawEdit() }
        </div>
    )
}

export default AddTask