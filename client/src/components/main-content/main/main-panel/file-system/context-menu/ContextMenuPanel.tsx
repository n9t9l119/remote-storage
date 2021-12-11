import React from 'react';
import './ContextMenuPanel.css'
import {showNameWindow} from "../../../../../../redux/reducers/nameWindowReducer";
import {useTypedDispatch, useTypedSelector} from "../../../../../../redux/hooks";
import {
    closeContextMenu,
    FSInteractionState, removeMovingElementId,
    setMovingElementId
} from "../../../../../../redux/reducers/fileSystemInteractionReducer";
import FileSystemController from "../../../../../../controllers/FileSystemController";
import {FileSystemStateType} from "../../../../../../redux/reducers/fileSystemReducer";

interface Params {
    visible: boolean
    type: 'elementContext' | 'spaceContext',
    position: {
        x: number,
        y: number,
        offset: {
            x: 1 | 0,
            y: 1 | 0
        }
    }
}

const ContextMenuPanel = ({visible, type, position}: Params) => {
    const dispatch = useTypedDispatch();

    const fsInteraction = useTypedSelector<FSInteractionState>(state => state.fileSystemInteraction)
    const {currentDirectoryId} = useTypedSelector<FileSystemStateType>(state => state.fileSystem)

    function renameHandler() {
        dispatch(showNameWindow({actionType: 'rename', elementType: fsInteraction.selectedElement.elementType}))
    }

    function moveHandler() {
        if (fsInteraction.selectedElement.elementId) dispatch(setMovingElementId(fsInteraction.selectedElement.elementId))
    }

    async function putElementHandler() {
        let parentId
        if (fsInteraction.selectedElement.elementId !== fsInteraction.movingElementId && fsInteraction.selectedElement.elementId) {
            parentId = fsInteraction.selectedElement.elementId
        } else {
            parentId = currentDirectoryId
        }
        if (fsInteraction.movingElementId) await FileSystemController.moveElement({
            id: fsInteraction.movingElementId,
            new_parent_id: parentId
        })
        await FileSystemController.updateCurrentDirectory()
        dispatch(removeMovingElementId())
    }

    async function deleteHandler() {
        if (fsInteraction.selectedElement.elementId) await FileSystemController.deleteElement({id: fsInteraction.selectedElement.elementId})
        await FileSystemController.updateCurrentDirectory()
    }

    function createFolderHandler() {
        dispatch(showNameWindow({actionType: 'create', elementType: 'folder'}))
    }

    function uploadFileHandler() {

    }

    function clickHandler(e: any) {
        e.stopPropagation()
        dispatch(closeContextMenu())
    }


    if (!visible) return null

    return (
        <div className={'context-menu-panel'}
             onClick={clickHandler}
             style={{
                 left: position.x,
                 top: position.y,
                 transform: `translate(${-100 * position.offset.x}%, ${-100 * position.offset.y}%)`
             }}>
            <div className={'context-menu-group'} hidden={type === "spaceContext"}>
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
                <div className={'context-menu-item'} onClick={deleteHandler}>
                    <span>Удалить</span>
                </div>
            </div>
            <div className={'context-menu-group'} hidden={type === "elementContext"}>
                <div className={'context-menu-item'} hidden={fsInteraction.movingElementId === undefined}
                     onClick={putElementHandler}>
                    <span>Вставить</span>
                </div>
                <div className={'context-menu-item'} onClick={createFolderHandler}>
                    <span>Создать папку</span>
                </div>
                <div className={'context-menu-item'}>
                    <span>Загрузить файл</span>
                </div>
            </div>
        </div>
    );
};

export default ContextMenuPanel;