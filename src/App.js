import Tasks from './Components/Tasks';
import { useState, useEffect } from 'react';
import { IoAddCircleOutline } from 'react-icons/io5';

import {
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';

import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';


function App() {
  const [tasksCategories, setTasksCategories] = useState([]);
  const [categoryAdded, setCategoryAdded] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    const fetchData = async () => {
      var res =  await fetch("http://localhost:5000/db");
      var data = await res.json();

      setTasksCategories(data["tasksCategories"]);
    }
    fetchData();
  }, []);




  async function addCategory() {
    var res =  await fetch(`http://localhost:5000/tasksCategories`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
        },
      body: JSON.stringify({name: ""}),
    });
    var data = await res.json();

    setTasksCategories([...tasksCategories, data]);
  }

  async function deleteCategory(id) {
      var res = await fetch(`http://localhost:5000/tasksCategories/${id}`, {method: 'DELETE'});
      if (res.status === 200) setTasksCategories(tasksCategories.filter(categorie => categorie.id !== id));
  }

  
  async function editCategoryName(id, newName) {
    var res =  await fetch(`http://localhost:5000/tasksCategories/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
            },
        body: JSON.stringify({name: newName}),
    });
    var data = await res.json();

    setTasksCategories(tasksCategories.map(categorie => categorie.id === id ? data : categorie));
  }




  function drawTasksCategories() {
    return (
      <>
      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext 
          items={tasksCategories}
        > 
          { tasksCategories.map((tasksCategorie) => (
            <Tasks 
              key={`Categorie-${tasksCategorie.id}`} 
              tasksCategorie={tasksCategorie}
            //   tasks={data.tasks.filter((task) => task.tasksCategorieId === tasksCategorie.id)} 
              onDelete={deleteCategory}
              onEdit={editCategoryName} 
              isAdded={categoryAdded}
            />
          ))}
        </SortableContext>
      </DndContext>
      </>
    )
  }

  function handleDragEnd(event) {
    const {active, over} = event;

    if (active.id !== over.id) {
        const oldIndex = tasksCategories.findIndex(categorie => categorie.id === active.id);
        const newIndex = tasksCategories.findIndex(categorie => categorie.id === over.id);
        setTasksCategories(arrayMove(tasksCategories, oldIndex, newIndex));
    }
  }
  
  return (
    <div className="App">
        <h1>Tasks Tracker</h1>
        <div className="flexContainer">{tasksCategories.length > 0 ? drawTasksCategories() : "No Categories added yet!"}</div>
        <hr size="1" width="90%" color="black"></hr>
        <div id="addCategory" onClick={() => {addCategory(); setCategoryAdded(true)}}>
            <IoAddCircleOutline />
            <span>Category</span> 
        </div>
    </div>
  );
}

export default App;