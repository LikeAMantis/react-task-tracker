import React from 'react'

const ColorPicker = ({tasksCategorie, onEdit, onClose}) => {
    function handleEdit(e) {
        e.stopPropagation();
        if (!e.target.hasAttribute("title")) return;
        onEdit({...tasksCategorie, color: e.target.title});
        onClose(false);
    }

    return (
        <div className="colorPicker" 
            ref={element => element && element.focus()} 
            tabIndex="0" 
            onClick={(e) => handleEdit(e)}
            onBlur={() => onClose(false)}
        >
            <div title="grey" style={{background: "var(--grey)"}}></div>
            <div title="blue" style={{background: "var(--blue)"}}></div>
            <div title="red" style={{background: "var(--red)"}}></div>
            <div title="orange" style={{background: "var(--orange)"}}></div>
            <div title="purple" style={{background: "var(--purple)"}}></div>
            <div title="teal" style={{background: "var(--teal)"}}></div>
            <div title="green" style={{background: "var(--green)"}}></div>
        </div>
    )
}

export default ColorPicker
