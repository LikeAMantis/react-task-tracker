import { useState, useEffect } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai"
import TaskCategoriesContainer from "./Components/TaskCategoriesContainer";

const App = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const getData = async() => {
            const dataFromServer = await fetchData(); 
            setData(dataFromServer)
        }
        getData();
    }, []);

    async function fetchData() {
        const res = await fetch("http://localhost:5000/db");
        const dbData = await res.json();
        return dbData;
    }

    return (
        <div className="App">
            <h1>Tasks Tracker</h1>
            {Object.keys(data).length > 0 ? <TaskCategoriesContainer data={data} /> : <AiOutlineLoading3Quarters id="loading-icon"/>}
        </div>
    );
}

export default App;