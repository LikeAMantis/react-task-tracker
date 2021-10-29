import React from 'react'

const FilterType = ({type, children, setFilterState}) => {
    function filterCategories(e) {
        const value = e.target.dataset.id;
        if (value === undefined) return;

        setFilterState({type, value: parseInt(value)});
    }

    return (
        <section>
            <h3 style={{background: "black", color: "white"}}>{(type + "'s")}</h3>
            <div onClick={(e) => filterCategories(e)}>
                {children}
            </div>
        </section>
    )
}

export default FilterType