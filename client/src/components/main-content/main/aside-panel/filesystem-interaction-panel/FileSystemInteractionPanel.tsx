import React from 'react';
import {useFileSystem} from "../../../../../hooks/filesystem.hook";
import {useTypedSelector} from "../../../../../redux/hooks";
import {FSInteractionState} from "../../../../../redux/reducers/fileSystemInteractionReducer";
import './FileSystemInteraction.css'

const FileSystemInteractionPanel = () => {
    const fsInteraction = useTypedSelector<FSInteractionState>(state => state.fileSystemInteraction)

    const {renameHandler, moveHandler, putElementHandler, downloadHandler, deleteHandler} = useFileSystem()
    console.log(!fsInteraction.selectedElement.elementId)
    return (
        <div className={'context-menu-group file-system-interaction-panel'} hidden={!fsInteraction.selectedElement.elementId}>
                <div className={'context-menu-item'} onClick={renameHandler}>
                    <span>Переименовать</span>
                </div>
                <div className={'context-menu-item'} onClick={moveHandler}>
                    <span>Переместить</span>
                </div>
                <div className={'context-menu-item'} hidden={fsInteraction.movingElementId === undefined}
                     onClick={putElementHandler}>
                    <span>Вставить</span>
                </div>
                <div className={'context-menu-item'} hidden={fsInteraction.selectedElement.elementType === 'folder'}
                     onClick={downloadHandler}>
                    <span>Скачать файл</span>
                </div>
                <div className={'context-menu-item'} onClick={deleteHandler}>
                    <span>Удалить</span>
                </div>
            </div>
    );
};

export default FileSystemInteractionPanel;