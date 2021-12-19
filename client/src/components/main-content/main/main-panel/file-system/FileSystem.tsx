import React, {useEffect, useRef, useState} from 'react';
import './FyleSystem.css'
import FileSystemController from "../../../../../controllers/FileSystemController";
import {useTypedDispatch, useTypedSelector} from "../../../../../redux/hooks";
import {FileSystemStateType} from "../../../../../redux/reducers/fileSystemReducer";
import ContextMenuPanel from "./context-menu/ContextMenuPanel";
import {
    closeContextMenu,
    FSInteractionState, removeSelection,
    selectElement,
    showContextMenu
} from "../../../../../redux/reducers/fileSystemInteractionReducer";
import FolderElement from "./FolderElement";
import FileElement from "./FileElement";
import {setAvailableSpace} from "../../../../../redux/reducers/spaceInfoReducer";

const FileSystem = () => {
    const dispatch = useTypedDispatch();
    useEffect(() => {
        FileSystemController.getDirectory().then(res => res )
    }, [])

    const [contextMenuPosition, setContextMenuPosition] = useState<{ x: number, y: number, offset: { x: 1 | 0, y: 1 | 0 } }>({
        x: 0,
        y: 0,
        offset: {x: 0, y: 0}
    })
    const fileSystemRef = useRef<HTMLDivElement>(null)


    const fileSystem = useTypedSelector<FileSystemStateType>(state => state.fileSystem)
    const fsInteraction = useTypedSelector<FSInteractionState>(state => state.fileSystemInteraction)

    function goToDirectory(id: string) {
        if (id === fileSystem.currentDirectoryId) return
        FileSystemController.getDirectory(id)
    }

    function clickHandler(e: any) {
        let elem = e.target.closest('.fs-element')
        if (elem) {
            let id = elem.dataset.elementid
            let type = elem.dataset.elementtype
            dispatch(selectElement({id, type}))
        } else {
            dispatch(removeSelection())
        }
        dispatch(closeContextMenu())
    }

    function contextHandler(e: any) {
        e.preventDefault()
        let menuType: 'elementContext' | 'spaceContext';

        let targetElem = e.target.closest('.fs-element')
        if (targetElem) {
            menuType = 'elementContext'
            let type = targetElem.dataset.elementtype
            let id = targetElem.dataset.elementid
            dispatch(selectElement({id, type}))
        } else {
            menuType = 'spaceContext'
            dispatch(removeSelection())
        }

        let coords = calculateContextMenuPosition(e.clientX, e.clientY)
        if (coords) setContextMenuPosition(coords)
        dispatch(showContextMenu(menuType))
    }

    function calculateContextMenuPosition(x: number, y: number): { x: number, y: number, offset: { x: 1 | 0, y: 1 | 0 } } | undefined {
        if (fileSystemRef.current) {
            let {left, top, width, height} = fileSystemRef.current.getBoundingClientRect()
            let xPos = x - left,
                yPos = y - top,
                offset: { x: 1 | 0, y: 1 | 0 } = {
                    x: 0,
                    y: 0
                };

            if (xPos > width - 150) offset.x = 1
            if (yPos > height - 120) offset.y = 1

            return {x: xPos, y: yPos, offset}
        }
    }

    return (
        <div className={'file-system'} ref={fileSystemRef} onClick={clickHandler} onContextMenu={contextHandler}>
            <h1>{fileSystem.currentDirectory.name || 'Root folder'}</h1>
            <div className={'directory-trace'}>
                <ul>
                    {fileSystem.dirTrace.map(elem => (
                        <React.Fragment key={elem.id}>
                            <li>
                                <button onClick={() => goToDirectory(elem.id)}>{elem.name}</button>
                            </li>
                            <li>&#8250;</li>
                        </React.Fragment>
                    ))}
                </ul>
            </div>
            <div className={'directory-view'}>
                {fileSystem.currentDirectory.parent_id &&
                <div
                    onDoubleClick={() => fileSystem.currentDirectory.parent_id && FileSystemController.getDirectory(fileSystem.currentDirectory.parent_id)}>
                    <img src={process.env.PUBLIC_URL + 'icons/upper-directory.png'} alt="upper-folder"/>
                    <span>...</span>
                </div>}
                {fileSystem.currentDirectory.objects?.map(elem => (
                    elem.type === 'folder' ?
                        <FolderElement
                            key={elem.id}
                            selectedElementId={fsInteraction.selectedElement.elementId}
                            elem={elem}/> :
                        <FileElement
                            key={elem.id}
                            selectedElementId={fsInteraction.selectedElement.elementId}
                            elem={elem}/>
                ))}
            </div>
            <ContextMenuPanel
                visible={fsInteraction.contextMenu.visible}
                type={fsInteraction.contextMenu.menuType}
                position={contextMenuPosition}/>
        </div>
    );
};

export default FileSystem;