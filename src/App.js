import { useState, useEffect } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai"
import TaskCategoriesContainer from "./Components/TaskCategoriesContainer";
import SideBar from "./Components/SideBar";

const App = () => {
    const [data, setData] = useState({});
    const [filterState, setFilterState] = useState({type: "all"})

    useEffect(() => {
        const getData = async() => {
            const dataFromServer = await fetchData(); 
            setData(dataFromServer);
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
            {Object.keys(data).length > 0 && <SideBar data={data} setData={setData} setFilterState={setFilterState} filterState={filterState} />}
            <div style={{width: "100%"}}>
                <h1>Tasks Tracker</h1>
                {Object.keys(data).length > 0 ? <TaskCategoriesContainer data={data} filterState={filterState} /> : <AiOutlineLoading3Quarters id="loading-icon"/>}
            </div>
        </div>
    );
}

export default App;