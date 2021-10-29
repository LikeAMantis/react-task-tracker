import { useState } from 'react';
import { IoAddCircleOutline } from 'react-icons/io5';
import TasksCategorie from './TasksCategorie';

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


const TaskCategoriesContainer = ({ data, filterState }) => {
  const [tasksCategories, setTasksCategories] = useState(data.tasksCategories);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );


  async function addCategory() {
    const newCategorie = {name: "New", color: 1, label: false};
    if (filterState.type !== "all") {
      newCategorie[filterState.type] = filterState.value;
    }

    var res =  await fetch(`https://my-json-server.typicode.com/LikeAMantis/react-task-tracker/tasksCategories`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
        },
      body: JSON.stringify(newCategorie),
    });
    var data = await res.json();

    setTasksCategories([...tasksCategories, data]);
  }

  async function deleteCategory(id) {
      var res = await fetch(`https://my-json-server.typicode.com/LikeAMantis/react-task-tracker/tasksCategories/${id}`, {method: 'DELETE'});
      if (res.status === 200) setTasksCategories(tasksCategories.filter(categorie => categorie.id !== id));
  }

  async function editCategory(editCategory) {
    var res =  await fetch(`https://my-json-server.typicode.com/LikeAMantis/react-task-tracker/tasksCategories/${editCategory.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
            },
        body: JSON.stringify(editCategory),
    });
    var data = await res.json();

    setTasksCategories(tasksCategories.map(categorie => categorie.id === editCategory.id ? data : categorie));
  }

  function handleDragEnd(event) {
    const {active, over} = event;

    if (active.id !== over.id) {
        const oldIndex = tasksCategories.findIndex(categorie => categorie.id === active.id);
        const newIndex = tasksCategories.findIndex(categorie => categorie.id === over.id);
        setTasksCategories(arrayMove(tasksCategories, oldIndex, newIndex));
    }
  }




  // Render

  function drawTasksCategories() {
    return (
    <>
        <DndContext 
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
          <SortableContext items={tasksCategories} >
            {tasksCategories.filter(categorie => categorie[filterState.type] === filterState.value).map((tasksCategorie) => (
              <TasksCategorie 
                  key={`Categorie-${tasksCategorie.id}`} 
                  tasksCategorie={tasksCategorie}
                  tasksData={data.tasks.filter((task) => task.tasksCategorieId === tasksCategorie.id)} 
                  onDelete={deleteCategory}
                  onEdit={editCategory} 
                  colors={data.colors}
                  labels={data.labels}
              />))}
          </SortableContext>
      </DndContext>
    </>
    )
  }

  return (
    <>
    <div className="TaskCategoriesContainer">
        <div className="flexContainer">
            {tasksCategories.length > 0 ? drawTasksCategories() : "No Categories added yet!"}
        </div>
        <hr size="1" width="90%" color="black"></hr>
        <div id="addCategory" onClick={addCategory}>
            <IoAddCircleOutline />
            <span>Add Category</span> 
        </div>
    </div>
    </>
  );
}

export default TaskCategoriesContainer;