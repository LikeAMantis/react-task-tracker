import React from 'react'
import Task from './Task';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const SortableTask = (props) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({id: props.taskData.id});
      
      const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <Task 
            ref={setNodeRef} 
            {...props} 
            style={props.isDragged ? {...style, background: "lightgrey"} : style} 
            attributes={attributes} 
            listeners={listeners}
        />
    )
}

export default SortableTask