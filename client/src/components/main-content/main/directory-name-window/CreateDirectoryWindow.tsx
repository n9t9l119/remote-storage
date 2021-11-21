import React, {useContext, useState} from 'react';
import './CreateDirectoryWindow.css'
import {CreateFolderContext} from "../MainContent";
import {useTypedSelector} from "../../../../redux/hooks";
import {FileSystemStateType} from "../../../../redux/reducers/fileSystemReducer";
import FileSystemController from "../../../../controllers/FileSystemController";

const CreateDirectoryWindow = () => {
    const [folderName, setFolderName] = useState<string>('')
    const {visible, visibleHandler} = useContext(CreateFolderContext)

    const {currentDirectoryId} = useTypedSelector<FileSystemStateType>(state => state.fileSystem)

    function folderNameHandler(name: string) {
        setFolderName(name)
    }

    function closeHandler(e: any) {
        e.stopPropagation()

        console.log(e.target.dataset.action)
        if(e.target.dataset.action !== 'close') return
        visibleHandler(false)
        setFolderName('')
    }

    async function saveHandler() {
        await FileSystemController.createDirectory({name: folderName, parent_id: currentDirectoryId})
        await FileSystemController.updateCurrentDirectory()
        visibleHandler(false)
        setFolderName('')
    }

    return (
        <>
            {
                visible &&
                <div className={'create-dir-wrapper'} data-action={'close'} onClick={closeHandler}>
                    <div className={'create-dir-window'}>
                        <h3>Название папки</h3>
                        <input type={'text'} onChange={(e) => folderNameHandler(e.target.value)} value={folderName}/>
                        <button className={'close-btn'} data-action={'close'} onClick={closeHandler}/>
                        <button className={'confirm-btn'} onClick={saveHandler}>Сохранить</button>
                    </div>
                </div>
            }
        </>
    );
};

export default CreateDirectoryWindow;