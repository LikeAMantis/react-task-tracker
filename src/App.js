import Tasks from './Components/Tasks';
import { useState, useEffect } from 'react';
import { IoAddCircleOutline } from 'react-icons/io5';

function App() {
  const [tasksCategories, setTasksCategories] = useState([]);

  useEffect(() => {
    const fetchtasksCategories = async () => {
      var res =  await fetch("http://localhost:5000/tasksCategories");
      var data = await res.json();

      setTasksCategories(data);
    }
    fetchtasksCategories();
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
  


  function drawTasksCategories() {
    return tasksCategories.map((tasksCategorie, index) => 
      <Tasks 
        key={`taskContainer-${index}`} 
        tasksCategorie={tasksCategorie} 
        deleteCategory={deleteCategory} 
        editCategoryName={editCategoryName}
        isLast={(index + 1) === tasksCategories.length}
      />
    );
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
  

  return (
    <div className="App">
      <h1>Tasks Tracker</h1>
      <div className="flexContainer">{tasksCategories.length > 0 ? drawTasksCategories() : "No Categories added yet!"}</div>
      <hr size="1" width="90%" color="black"></hr>
      <div id="addCategory" onClick={() => addCategory()} ><IoAddCircleOutline />Add Category</div>
    </div>
  );
}


export default App;