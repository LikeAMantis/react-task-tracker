import { useState, useRef, useEffect } from 'react';
import { GrDrag } from "react-icons/gr";
import { HiColorSwatch } from  "react-icons/hi";
import { FaTimes } from "react-icons/fa";
import { MdLabel } from "react-icons/md";
import SortableTask from './SortableTask';

import ButtonAdd from './ButtonAdd';
import Task from './Task';
import ColorPicker from './ColorPicker';
import LabelPicker from './LabelPicker';


// Sortable
import {
    DragOverlay,
    closestCenter,
    DndContext, 
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
  } from '@dnd-kit/core';
  import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable
  } from '@dnd-kit/sortable';
  import { CSS } from '@dnd-kit/utilities';

  
const TasksCategorie = ({tasksCategorie, tasksData, onDelete, onEdit, colors, labels}) => {
    const [tasks, setTasks] = useState(tasksData);
    const [isEdit, setIsEdit] = useState(false);
    const [isColorPicker, setisColorPicker] = useState(false);
    const [isLabelPicker, setisLabelPicker] = useState(false);
    const [name, setName] = useState(tasksCategorie.name);
    const nameBackup = useRef();
    const categoryWrapper = useRef();

    const [activeId, setActiveId] = useState(null);
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
          coordinateGetter: sortableKeyboardCoordinates,
        })
      );

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({id: tasksCategorie.id});
      
    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
    };

    async function addTask(text) {
        var data = await postTask({tasksCategorieId: tasksCategorie.id, done: false, text});
        setTasks([...tasks, data]);
    }

    async function postTask(task) {
        var res =  await fetch(`https://my-json-server.typicode.com/LikeAMantis/react-task-tracker/tasks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
              },
            body: JSON.stringify(
                task
            ),
        });
        var data = await res.json();

        return data;
    }

    async function putTask(task) {
        var res =  await fetch(`https://my-json-server.typicode.com/LikeAMantis/react-task-tracker/tasks/${task.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
                },
            body: JSON.stringify(task),
        });
        var data = await res.json();
    
        setTasks(tasks.map(x => x.id === task.id ? data : x));
    }

    async function deleteTask(id) {
        var res = await fetch(`https://my-json-server.typicode.com/LikeAMantis/react-task-tracker/tasks/${id}`, {method: 'DELETE'});
        if (res.status === 200) setTasks(tasks.filter(task => task.id !== id));
    }



    // Edit
    function drawCategoryEdit() {
        return(
            <div>
                <input 
                    ref={input => input && input.focus()} 
                    placeholder="New Category" 
                    onKeyDown={e => handleKeyDown(e)} 
                    onChange={(e) => setName(e.target.value)} 
                    value={name} 
                    style={{height: "1.5em", width: "96%"}}
                />
                <div className="btnContainer">
                    <button 
                        className="save-btn"
                        onClick={saveEdit}
                    >
                        Save
                    </button>
                    <button onClick={cancelEdit}>Cancel</button>
                </div>
            </div>
        )
    }

    function handleKeyDown(e) {
        if (e.code==="Enter") {
            onEdit({...tasksCategorie, name}); 
            setIsEdit(false);
        }
        else if (e.code==="Escape") {
            setIsEdit(false);
        }
    }

    function saveEdit() {
        if (name.length === 0) {
            alert("Enter a Name!");
        } else {
            onEdit({...tasksCategorie, name}); 
            setIsEdit(false);
        }
    }

    function cancelEdit() {
        if (name.length === 0) {
            alert("Enter a Name!");
        } else {
            setIsEdit(false);
            setName(nameBackup.current);
        }
    }

    function drawLabel() {
        const label = labels.find(label => label.id === tasksCategorie.label);
        if (label != null) {
            return <span>{label.name}</span>;
        } else {
            return <MdLabel className="label-btn" />;
        }
    }



    
    // Sortable

    function handleDragStart(event) {            
        setActiveId(event.active.id);  
    }

    function handleDragEnd(event) {
        const {active, over} = event;
    
        if (active.id !== over.id) {
            const oldIndex = tasks.findIndex(x => x.id === active.id);
            const newIndex = tasks.findIndex(x => x.id === over.id);
            setTasks(arrayMove(tasks, oldIndex, newIndex));
        }
        setActiveId(null);
    }

    const drawTasks = () => {
        return  (
        <DndContext 
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            onDragStart={handleDragStart}
        >
            <SortableContext 
                items={tasks}
                strategy={verticalListSortingStrategy}
            >
                {tasks.map((task) => (
                    <SortableTask 
                        key={`task-${task.id}`} 
                        taskData={task} 
                        onEdit={putTask} 
                        onDelete={deleteTask} 
                        isDragged={activeId === task.id}
                    />
                ))}
            </SortableContext>
            <DragOverlay style={{background: "inherit"}}>{activeId ? <Task taskData={tasks.find(task => task.id === activeId)}/> : null}</DragOverlay>
        </DndContext>
      );
    }

    return (
        <div 
            ref={setNodeRef}
            style={{...style}} 
        >
            <div className={"categoryWrapper"}  style={{background: `var(--${colors.find(color => color.id === tasksCategorie.color).name})`}}>
                <GrDrag className="dragHandle" {...listeners} {...attributes} tabIndex="false"></GrDrag>
                <div className={"editCategory-container"} ref={categoryWrapper}>
                    <HiColorSwatch 
                        className="colorPicker-btn" 
                        onClick={() => setisColorPicker(true)} 
                        tabIndex="0"
                    />
                    {isColorPicker && <ColorPicker tasksCategorie={tasksCategorie} onEdit={onEdit} onClose={setisColorPicker} wrapper={categoryWrapper.current} colors={colors} />}
                    <FaTimes className="del-icon" onClick={() => {onDelete(tasksCategorie.id); setIsEdit(false)}} />
                </div>
                {!isEdit ? (
                    <h2 className="categoryTitle" onClick={() => {setIsEdit(true); nameBackup.current = name}}>
                        {tasksCategorie.name}
                    </h2>
                ) : drawCategoryEdit()}
                <div className="tasks" >{(tasks.length > 0) ? drawTasks() : <p>Tasks</p>}</div>
                <div className="label" onClick={() => setisLabelPicker(true)}>
                    {isLabelPicker ? (
                        <LabelPicker tasksCategorie={tasksCategorie} onEdit={onEdit} onClose={setisLabelPicker} labels={labels} />
                    ) : (
                        drawLabel()
                    )}
                </div>
                <ButtonAdd onAdd={addTask} text="Add Task"/>
            </div>
        </div>
    )
}

export default TasksCategorie