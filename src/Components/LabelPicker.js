import React from 'react'

const LabelPicker = ({labels, onClose, onEdit, tasksCategorie}) => {
    function handleEdit(e) {
        e.stopPropagation();
        var label = e.target.dataset.id;
        if (label == null) label = false;
        else label = parseInt(e.target.dataset.id);
        onEdit({...tasksCategorie, label});
        onClose(false);
    }

    return (
        <div className="labelPicker" 
            style={{position: "relative", background: "black"}}
            ref={element => element && element.focus()} 
            tabIndex="0" 
            onClick={(e) => handleEdit(e)}
            onBlur={() => onClose(false)}
        >
            <div>none</div>
            {labels.map(label => (
                <div key={`label-${label.id}`} data-id={label.id}>{label.name}</div>
            ))}
        </div>
    )
}

export default LabelPicker