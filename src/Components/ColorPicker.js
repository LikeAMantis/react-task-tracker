import React from 'react'
import reactDom from 'react-dom';

const ColorPicker = ({tasksCategorie, onEdit, onClose, wrapper, colors}) => {
    function handleEdit(e) {
        e.stopPropagation();
        if (!e.target.hasAttribute("title")) return;
        
        onEdit({...tasksCategorie, color: parseInt(e.target.dataset.id)});
        onClose(false);
    }

    return reactDom.createPortal((
        <div className="colorPicker" 
            style={{left: (wrapper.getBoundingClientRect().left + "px"), top: wrapper.getBoundingClientRect().top + 20 + "px"}}
            ref={element => element && element.focus()} 
            tabIndex="0" 
            onClick={(e) => handleEdit(e)}
            onBlur={() => onClose(false)}
        >
            {colors.map(color => (
                <div key={`color-${color.id}`} title={color.name} data-id={color.id} style={{background: `var(--${color.name})`}}></div>
            ))}
        </div>
    ), document.body)
}

export default ColorPicker