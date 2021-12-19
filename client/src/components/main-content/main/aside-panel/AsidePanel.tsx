import React from 'react';
import './AisdePanel.css'
import {useTypedDispatch} from "../../../../redux/hooks";
import {showNameWindow} from "../../../../redux/reducers/nameWindowReducer";
import {closeContextMenu, removeSelection,} from "../../../../redux/reducers/fileSystemInteractionReducer";
import FileSystemInteractionPanel from "./filesystem-interaction-panel/FileSystemInteractionPanel";
import {useFileSystem} from "../../../../hooks/filesystem.hook";
import SpaceInfo from "./space-info/SpaceInfo";

const AsidePanel = () => {
    const {uploadFileHandler} =  useFileSystem()
    const dispatch = useTypedDispatch()

    function createNewFolderHandler() {
        dispatch(showNameWindow({actionType: 'create', elementType: 'folder'}))
        dispatch(removeSelection())
        dispatch(closeContextMenu())
    }


    return (
        <aside className={'glass aside-panel'}>
            <button onClick={createNewFolderHandler}>Новая папка</button>
            <button onClick={uploadFileHandler}>Загрузить файл</button>
            <div className={'spacer'}></div>
            <FileSystemInteractionPanel/>
            <SpaceInfo/>
        </aside>
    );
};

export default AsidePanel;