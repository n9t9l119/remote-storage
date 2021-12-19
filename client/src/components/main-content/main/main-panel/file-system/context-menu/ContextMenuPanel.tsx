import React from 'react';
import './ContextMenuPanel.css'
import {useTypedSelector} from "../../../../../../redux/hooks";
import {FSInteractionState} from "../../../../../../redux/reducers/fileSystemInteractionReducer";
import {useFileSystem} from "../../../../../../hooks/filesystem.hook";

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
    const {
        createFolderHandler,
        uploadFileHandler,
        downloadHandler,
        clickHandler,
        renameHandler,
        moveHandler,
        putElementHandler,
        deleteHandler,
    } = useFileSystem()

    const fsInteraction = useTypedSelector<FSInteractionState>(state => state.fileSystemInteraction)


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
                <div className={'context-menu-item'} hidden={fsInteraction.selectedElement.elementType === 'folder'}
                     onClick={downloadHandler}>
                    <span>Скачать файл</span>
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
                <div className={'context-menu-item'} onClick={uploadFileHandler}>
                    <span>Загрузить файл</span>
                </div>
            </div>
        </div>
    );
};

export default ContextMenuPanel;