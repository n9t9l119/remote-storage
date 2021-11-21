import React, {useContext} from 'react';
import './AisdePanel.css'
import {CreateFolderContext} from "../MainContent";

const AsidePanel = () => {

    const {visibleHandler} = useContext(CreateFolderContext)

    function createNewFolderHandler(){
        visibleHandler(true)
    }

    return (
        <aside className={'glass'}>
            <h1>aside</h1>
            <button onClick={createNewFolderHandler}>Новая папка</button>
        </aside>
    );
};

export default AsidePanel;