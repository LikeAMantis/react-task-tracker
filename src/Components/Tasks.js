import { useState, useEffect } from 'react';
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
import { arrayMoveImmutable } from 'array-move';

import React from 'react';
import Task from './Task';
import Add from './AddTask';



const Tasks = ({tasksCategorie, deleteCategory, editCategoryName, isLast}) => {
    const [tasks, setTasks] = useState([]);
    const [isSortable, setIsSortable] = useState(false);
    const [edit, setEdit] = useState(isLast);
    const [name, setName] = useState(tasksCategorie.name);

    useEffect(() => {
        async function fetchTasks() {
            var res =  await fetch(`http://localhost:5000/tasks?tasksCategorieId=${tasksCategorie.id}`);
            var data = await res.json();
    
            setTasks(data);
        }
        fetchTasks();
    }, [])

    async function addTask(text) {
        var data = await postTask(text);
        setTasks([...tasks, data]);
    }

    async function postTask(text) {
        var res =  await fetch(`http://localhost:5000/tasks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
              },
            body: JSON.stringify(
                {tasksCategorieId: tasksCategorie.id, text, done: false}
            ),
        });
        var data = await res.json();
        console.log(data);

        return data;
    }

    
    async function toggleTask(id) {
        var task = tasks.find(task => task.id===id);
        task.done = !task.done;

        var res =  await fetch(`http://localhost:5000/tasks/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
                },
            body: JSON.stringify(tasks.find(task => task.id === id)),
        });
        var data = await res.json();
    
        setTasks(tasks.map(task => task.id === id ? data : task));
    }

    async function deleteTask(id) {
        var res = await fetch(`http://localhost:5000/tasks/${id}`, {method: 'DELETE'});
        if (res.status===200) setTasks(tasks.filter(task => task.id !== id));
    }


    // Sortable

    function drawTasks() {
        return  tasks.map((task, index) => <><Handle /><SortableItem key={`task-${index}`} index={index} taskData={task} toggleTask={toggleTask} deleteTask={deleteTask}/></>);
    }

    const SortableList = SortableContainer(drawTasks);
    
    const onSortEnd = ({oldIndex, newIndex}) => {
        setTasks(arrayMoveImmutable(tasks, oldIndex, newIndex));
    };

    const attributes = isSortable ? {sortable: ""} : {};


    // Edit

    const onKeyDown = (e) => {
        console.log(e);

        if (e.code==="Enter") {
            editCategoryName(tasksCategorie.id, name); 
            setEdit(false);
        }
        else if (e.code==="Ecape") {
            setEdit(false);
        }
    }

    function saveCategory() {
        editCategoryName(tasksCategorie.id, name); 
        setEdit(false);
    }

    function drawCategoryEdit() {
        return(
            <div>
                <input ref={input => input && input.focus()} placeholder="New Category" onKeyDown={e => onKeyDown(e)} onChange={(e) => setName(e.target.value)} value={name} style={{height: "1.5em", width: "100%"}}></input>
                <div>
                    <button onClick={() => {name.length === 0 ? alert("Enter a Name!") : saveCategory()}}>Save</button>
                    <button onClick={() => name.length === 0 ? alert("Enter a Name!") : setEdit(false)}>Cancel</button>
                    <button onClick={() => {deleteCategory(tasksCategorie.id); setEdit(false);}}>Delete</button>
                </div>
            </div>
        )
    }

    return (
        <div className="CategoryWrapper" style={{width: "250px", height: "fit-content", padding: "18px", background: "#edebeb", borderRadius: "9px"}}>
            { !edit ? <h2 className="CategoryTitle" onClick={() => setEdit(true)}> {tasksCategorie.name}</h2> : drawCategoryEdit() }
            <div className="Tasks" {...attributes}>{ (tasks.length > 0) ? <SortableList items={tasks} onSortEnd={onSortEnd} lockAxis="y" useDragHandle={true}/> : <p style={{fontSize: "12pt", textAlign: "center"}}>No Tasks added yet!</p> }</div>
            <Add addTask={addTask}/>
            <button onClick={() => setIsSortable(!isSortable)}>{ isSortable ? "Finish Sort" : "Sort" }</button>
        </div>
    )
}

export default Tasks