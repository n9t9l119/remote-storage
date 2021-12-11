import React, {useState} from 'react';
import './NameWindow.css'
import {useTypedDispatch, useTypedSelector} from "../../../../redux/hooks";
import {FileSystemStateType} from "../../../../redux/reducers/fileSystemReducer";
import FileSystemController from "../../../../controllers/FileSystemController";
import {closeNameWindow, NameWindowState} from "../../../../redux/reducers/nameWindowReducer";
import {FSInteractionState} from "../../../../redux/reducers/fileSystemInteractionReducer";

const NameWindow = () => {
    const [folderName, setFolderName] = useState<string>('')

    const {currentDirectoryId} = useTypedSelector<FileSystemStateType>(state => state.fileSystem)
    const nameWindow = useTypedSelector<NameWindowState>(state => state.nameWindow)
    const {selectedElement} = useTypedSelector<FSInteractionState>(state => state.fileSystemInteraction)

    const dispatch = useTypedDispatch()

    function folderNameHandler(name: string) {
        setFolderName(name)
    }

    function closeHandler(e: any) {
        e.stopPropagation()
        if (e.target.dataset.action !== 'close') return
        dispatch(closeNameWindow())
        setFolderName('')
    }

    async function saveHandler() {
        if (nameWindow.actionType === 'create') await FileSystemController.createDirectory({
            name: folderName,
            parent_id: currentDirectoryId
        })
        if (nameWindow.actionType === 'rename' && selectedElement.elementId) await FileSystemController.renameElement({
            new_name: folderName,
            id: selectedElement.elementId
        })

        await FileSystemController.updateCurrentDirectory()
        dispatch(closeNameWindow())
        setFolderName('')
    }

    return (
        <>
            {
                nameWindow.visible &&
                <div className={'create-dir-wrapper'} data-action={'close'} onClick={closeHandler}>
                    <div className={'create-dir-window'}>
                        {
                            nameWindow.elementType === 'folder' ?
                                <h3>Название папки</h3> :
                                <h3>Название файла</h3>
                        }
                        <input type={'text'} onChange={(e) => folderNameHandler(e.target.value)} value={folderName}/>
                        <button className={'close-btn'} data-action={'close'} onClick={closeHandler}/>
                        <button className={'confirm-btn'} onClick={saveHandler}>Сохранить</button>
                    </div>
                </div>
            }
        </>
    );
};

export default NameWindow;