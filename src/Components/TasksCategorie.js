import { useState, useRef } from 'react';
import { GrDrag } from "react-icons/gr";
import { HiColorSwatch } from  "react-icons/hi";
import { FaTimes } from "react-icons/fa";
import SortableTask from './SortableTask';

import AddTask from './AddTask';
import Task from './Task';
import ColorPicker from './ColorPicker';


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


const TasksCategorie = ({tasksCategorie, tasksData, onDelete, onEdit, isAdded}) => {
    const [tasks, setTasks] = useState(tasksData);
    const [isEdit, setIsEdit] = useState(isAdded);
    const [name, setName] = useState(tasksCategorie.name);
    const nameBackup = useRef();
    const [isColorPicker, setisColorPicker] = useState(false);

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
        var res =  await fetch(`http://localhost:5000/tasks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
              },
            body: JSON.stringify(
                task
            ),
        });
        var data = await res.json();
        console.log(data);

        return data;
    }

    async function putTask(task) {
        var res =  await fetch(`http://localhost:5000/tasks/${task.id}`, {
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
        var res = await fetch(`http://localhost:5000/tasks/${id}`, {method: 'DELETE'});
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
            <DragOverlay style={{background: "inherit"}}> {activeId ? <Task taskData={tasks.find(task => task.id === activeId)}/> : null} </DragOverlay>
        </DndContext>
      );
    }

    return (
        <div 
            ref={setNodeRef}
            style={{...style}} 
        >
            <div className={"categoryWrapper"} style={{background: `var(--${tasksCategorie.color})`}}>
                <GrDrag className="dragHandle" {...listeners} {...attributes} tabIndex="false"></GrDrag>
                <div className={"editCategory-container"}>
                    <HiColorSwatch 
                        className="colorPicker-btn" 
                        onClick={() => setisColorPicker(!isColorPicker)} 
                        tabIndex="0"
                    />
                    {isColorPicker && <ColorPicker tasksCategorie={tasksCategorie} onEdit={onEdit} onClose={setisColorPicker}/>}
                    <FaTimes className="del-icon" onClick={() => {onDelete(tasksCategorie.id); setIsEdit(false)}} />
                </div>
                {!isEdit ? (
                    <h2 className="categoryTitle" onClick={() => {setIsEdit(true); nameBackup.current = name}}>
                        {tasksCategorie.name}
                    </h2>
                ) : drawCategoryEdit()}
                <div className="tasks" >{(tasks.length > 0) ? drawTasks() : <p>Tasks</p>}</div>
                <AddTask onAdd={addTask}/>
            </div>
        </div>
    )
}



export default TasksCategorie