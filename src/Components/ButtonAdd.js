import { useState } from "react";
import { TiPlus } from "react-icons/ti"


const ButtonAdd = ({ onAdd, text, style }) => {
    const [value, setValue] = useState("");
    const [isEdit, setIsEdit] = useState(false);

    function onClick() {
        onAdd(value);
        setValue("");
        setIsEdit(false);
    }

    function drawEdit() {
        return(
            <div className="edit">
                <input 
                    ref={input => input && input.focus()} 
                    onKeyDown={(e) => handleKeyDown(e)} 
                    onChange={(e) => {setValue(e.target.value)}} 
                    value={value}
                    placeholder={text}
                ></input>
                <div>
                    <button className="save-btn" onClick={onClick}>Save</button>
                    <button onClick={() => setIsEdit(false)}>Cancel</button>
                </div>
            </div>
        )
    }

    function drawButton() {
        return ( 
            <div className="add-btn" style={style} >
                <span onClick={() => setIsEdit(true)}><TiPlus />{text}</span>
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
        <>{!isEdit ? drawButton() : drawEdit() }</>
    )
}

export default ButtonAdd