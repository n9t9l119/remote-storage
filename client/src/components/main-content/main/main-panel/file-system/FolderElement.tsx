import React from 'react';
import FileSystemController from "../../../../../controllers/FileSystemController";

interface Props {
    selectedElementId: string | undefined,
    elem: {
        creation_date: number,
        id: string,
        name: string,
        owner_id: string,
        owner_name: string,
        type: 'folder' | 'file'
    }
}

const FolderElement = ({elem, selectedElementId}: Props) => {
    return (
        <div
            className={`fs-element ${selectedElementId === elem.id ? 'selected' : ''}`}
            data-elementid={elem.id}
            data-elementtype={elem.type}
            onDoubleClick={() => FileSystemController.getDirectory(elem.id)}
            key={elem.id}>
            <img src={process.env.PUBLIC_URL + 'icons/directory.png'} alt="folder"/>
            <span>{elem.name}</span>
        </div>
    );
};

export default FolderElement;