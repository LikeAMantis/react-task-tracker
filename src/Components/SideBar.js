import { useState } from 'react';
import { AiFillFilter } from 'react-icons/ai'
import { FaTimes } from 'react-icons/fa';
import { MdLabel } from "react-icons/md";
import FilterType from './FilterType';
import ButtonAdd from './ButtonAdd';

const SideBar = ({data, ...props}) => {
    const [isExpanded, setIsExpanded] = useState(false);

    async function addLabel(name) {
        var res =  await fetch(`https://my-json-server.typicode.com/LikeAMantis/react-task-tracker/labels`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
            },
          body: JSON.stringify({name}),
        });
        var resData = await res.json();
    
        props.setData({...data, labels: [...data.labels, resData]});
    }

    async function deleteLabel(id) {
        var res = await fetch(`https://my-json-server.typicode.com/LikeAMantis/react-task-tracker/labels/${id}`, {method: 'DELETE'});
        if (res.status === 200) props.setData({...data, labels: data.labels.filter(label => label.id !== id)});
    }

    return (
        <div className="sideBar" expanded={isExpanded && ""}>
            <div className="sideBar-header" onClick={() => setIsExpanded(!isExpanded)}>
                <AiFillFilter />
                <span>Filter</span>
            </div>
            <div className="filterOption-wrapper" isActive={props.filterState.type === "all" && ""}>
                <div className="filterOption" style={{marginBottom: "15px"}} onClick={() => props.setFilterState({type: "all"})}>All</div>
            </div>
            <FilterType {...props} type="color">
                {data.colors && data.colors.map((color) => (
                    <div className="filterOption-wrapper" isActive={props.filterState.type === "color" &&  props.filterState.value === color.id && ""}>
                        <div 
                            className="filterOption" 
                            style={{background: `var(--${color.name})`, color: "black"}} 
                            key={`filterOption-${color.id}`} 
                            data-id={color.id}
                        >
                            {color.name}
                        </div>
                    </div>
                ))}
            </FilterType>
            <FilterType {...props} type="label">
                {data.labels && data.labels.map(label => (
                    <div className="filterOption-wrapper" isActive={(props.filterState.type === "label" &&  props.filterState.value === label.id) && ""}>
                        <div 
                            className="filterOption" 
                            // isActive={props.filterState.type === "label" &&  props.filterState.value === label.id && ""}
                            key={`filterOption-${label.id}`} 
                            data-id={label.id} 
                        >
                            {label.name}
                            <FaTimes className="del-icon" onClick={(e) => deleteLabel(parseInt(e.target.closest(".filterOption").dataset.id))} />
                        </div>
                    </div>
                ))}
            </FilterType>
            <ButtonAdd text="Add Label" onAdd={addLabel}/>
        </div>
    )
}

const activeElement = {background: "blue"};

export default SideBar