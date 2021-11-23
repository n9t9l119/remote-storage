import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export interface FileSystemStateType {
    dirTrace: Trace[],
    currentDirectory: Directory
    currentDirectoryId: string,
}

interface Trace {
    id: string,
    name: string
}

interface Directory {
    id: string,
    name: string | null,
    objects: DirectoryObjects[],
    owner: string,
    parent_id: string | null
}

interface DirectoryObjects {
    creation_date: number,
    id: string,
    name: string,
    owner_id: string,
    owner_name: string,
    type: 'folder' | 'file'
}

const fileSystemReducer = createSlice({
    name: 'file-system',
    initialState: {
        dirTrace: [],
        currentDirectory: {
            id: '',
            name: '',
            objects: [],
            owner: '',
            parent_id: null
        },
        currentDirectoryId: ''
    } as FileSystemStateType,
    reducers: {
        updateDirectory: (state, action: PayloadAction<Directory>) => {
            state.currentDirectory = action.payload
            state.currentDirectoryId = action.payload.id
            if (state.dirTrace.map(elem => elem.id).includes(action.payload.id)) {
                let index = state.dirTrace.findIndex(elem => elem.id === action.payload.id)
                state.dirTrace = state.dirTrace.slice(0, index + 1)
            } else if (action.payload.name) {
                state.dirTrace.push({
                    id: action.payload.id,
                    name: action.payload.name
                })
            } else if(!action.payload.parent_id){
                state.dirTrace = []
            }
        }
    }
})

export const {updateDirectory} = fileSystemReducer.actions

export default fileSystemReducer.reducer