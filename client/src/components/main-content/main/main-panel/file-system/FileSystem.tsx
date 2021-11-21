import React, {useEffect} from 'react';
import './FyleSystem.css'
import FsButtons from "../../../../FSButtons";
import FileSystemController from "../../../../../controllers/FileSystemController";
import {useTypedSelector} from "../../../../../redux/hooks";
import {FileSystemStateType} from "../../../../../redux/reducers/fileSystemReducer";

const FileSystem = () => {
    useEffect(() => {
        FileSystemController.getDirectory().then(res => res)
    }, [])

    const fileSystem = useTypedSelector<FileSystemStateType>(state => state.fileSystem)

    function goToDirectory(id: string) {
        if (id === fileSystem.currentDirectoryId) return
        FileSystemController.getDirectory(id)
    }

    return (
        <div className={'file-system'}>
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
            <FsButtons/>
            <div className={'directory-view'}>
                {fileSystem.currentDirectory.parent_id &&
                <div onDoubleClick={() => fileSystem.currentDirectory.parent_id && FileSystemController.getDirectory(fileSystem.currentDirectory.parent_id)}>
                    <div>Upper</div>
                    <span>...</span>
                </div>}
                {fileSystem.currentDirectory.objects?.map(elem => (
                    <div onDoubleClick={() => FileSystemController.getDirectory(elem.id)} key={elem.id}>
                        <div>Folder</div>
                        <span>{elem.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FileSystem;