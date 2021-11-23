import React from 'react';
import RequestController from "../controllers/RequestController";
import FileSystemGet from "../requests/FileSystemGet";
import FileSystemCreateFolder from "../requests/FileSystemCreateFolder";
import FileSystemRename from "../requests/FileSystemRename";
import FileSystemDelete from "../requests/FileSystemDelete";

const FsButtons = () => {

    function Get(){
        const command = new RequestController(new FileSystemGet())
        command.execute()
    }

    function GetId(){
        const command = new RequestController(new FileSystemGet({id: '5573501c-3a37-4907-b19d-c3d1b46a81d5'}))
        command.execute()
    }

    function Create(){
        const command = new RequestController(new FileSystemCreateFolder({parent_id: '6a8e7618-d121-48b9-b455-4a28f7413173', name: 'Папка 1'}))
        command.execute()
    }

    function Rename(){
        const command = new RequestController(new FileSystemRename({id: 'e0d8a7f6-e20f-4019-afda-76c506279940', new_name: 'Папка 123'}))
        command.execute()
    }

    function Delete(){
        const command = new RequestController(new FileSystemDelete({id: 'e0d8a7f6-e20f-4019-afda-76c506279940'}))
        command.execute()
    }

    return (

        <div>
            <button onClick={Get}>Get</button>
            <button onClick={GetId}>GetId</button>
            <button onClick={Create}>Create</button>
            <button onClick={Rename}>Rename</button>
            <button onClick={Delete}>Delete</button>
        </div>
    );
};

export default FsButtons;