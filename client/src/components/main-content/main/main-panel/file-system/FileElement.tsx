import React from 'react';
import FileSystemController from "../../../../../controllers/FileSystemController";
import {useFileSystem} from "../../../../../hooks/filesystem.hook";

interface Props {
    selectedElementId: string | undefined,
    elem: {
        creation_date: number,
        id: string,
        name: string,
        owner_id: string,
        owner_name: string,
        extension?: string,
        type: 'folder' | 'file'
    }
}

const FileElement = ({selectedElementId, elem}: Props) => {
    const {downloadHandler} = useFileSystem()

    let imageType: string;

    switch (elem.extension) {
        case '.txt':
            imageType = 'icons/txt.png'
            break
        case '.doc':
        case '.docx':
            imageType = 'icons/doc.png'
            break
        default:
            imageType = 'icons/file.png'
    }

    return (
        <div
            className={`fs-element ${selectedElementId === elem.id ? 'selected' : ''}`}
            data-elementid={elem.id}
            data-elementtype={elem.type}
            onDoubleClick={downloadHandler}
            key={elem.id}>
            <img src={process.env.PUBLIC_URL + imageType} alt="folder"/>
            <span>{elem.name}</span>
        </div>
    );
};

export default FileElement;