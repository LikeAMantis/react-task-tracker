import { useState, useEffect } from 'react';
import { GrDrag } from "react-icons/gr";

import React from 'react';
import Add from './AddTask';
import Task from './Task';
import SortableTask from './SortableTask';

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

  

const Tasks = ({tasksCategorie, onDelete, onEdit, categoryAdded}) => {
    const [tasks, setTasks] = useState([]);
    const [edit, setEdit] = useState(categoryAdded);
    const [name, setName] = useState(tasksCategorie.name);
    
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

    useEffect(() => {
        async function fetchTasks() {
            var res =  await fetch(`http://localhost:5000/tasks?tasksCategorieId=${tasksCategorie.id}`);
            var data = await res.json();
    
            setTasks(data);
        }
        fetchTasks();
    }, [])



    
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
                        onClick={() => {name.length === 0 ? alert("Enter a Name!") : saveCategory()}}
                    >
                        Save
                    </button>
                    <button onClick={() => name.length === 0 ? alert("Enter a Name!") : setEdit(false)}>Cancel</button>
                    <button className="del-btn" onClick={() => {onDelete(tasksCategorie.id); setEdit(false)}}>Delete</button>
                </div>
            </div>
        )
    }

    function handleKeyDown(e) {
        if (e.code==="Enter") {
            onEdit(tasksCategorie.id, name); 
            setEdit(false);
        }
        else if (e.code==="Escape") {
            setEdit(false);
        }
    }

    function saveCategory() {
        onEdit(tasksCategorie.id, name); 
        setEdit(false);
    }



    
    // Sortable

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
            <DragOverlay> {activeId ? <Task taskData={tasks.find(task => task.id === activeId)}/> : null} </DragOverlay>
        </DndContext>
      );
    }

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

    return (
        <div className="test" style={{...style}} ref={setNodeRef}>
            <div className="categoryWrapper">
                <GrDrag className="dragHandle" {...listeners} {...attributes} tabIndex="false"></GrDrag>
                {!edit ? (
                    <h2 className="categoryTitle" onClick={() => setEdit(true)}>
                        {tasksCategorie.name}
                    </h2>
                ) : drawCategoryEdit()}
                <div className="tasks" >{(tasks.length > 0) ? drawTasks() : <p>Tasks</p>}</div>
                <Add onAdd={addTask}/>
            </div>
        </div>
    )
}

export default Tasks