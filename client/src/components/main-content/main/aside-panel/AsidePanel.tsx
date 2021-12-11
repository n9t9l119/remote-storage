import React from 'react';
import './AisdePanel.css'
import {useTypedDispatch} from "../../../../redux/hooks";
import {showNameWindow} from "../../../../redux/reducers/nameWindowReducer";
import {closeContextMenu, removeSelection,} from "../../../../redux/reducers/fileSystemInteractionReducer";

const AsidePanel = () => {

    const dispatch = useTypedDispatch()

    function createNewFolderHandler() {
        dispatch(showNameWindow({actionType: 'create', elementType: 'folder'}))
        dispatch(removeSelection())
        dispatch(closeContextMenu())
    }

    return (
        <aside className={'glass'}>
            <h1>aside</h1>
            <button onClick={createNewFolderHandler}>Новая папка</button>
        </aside>
    );
};

export default AsidePanel;