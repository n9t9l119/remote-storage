import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export interface FSInteractionState {
    contextMenu: {
        visible: boolean,
        menuType: MenuType
    },
    selectedElement: {
        elementId: string | undefined,
        elementType: ElementType
    },
    movingElementId: string | undefined
}

type MenuType = 'elementContext' | 'spaceContext'
type ElementType = 'file' | 'folder'

const FileSystemInteractionReducer = createSlice({
    name: 'fsInteraction',
    initialState: {
        contextMenu: {
            menuType: "spaceContext",
            visible: false
        },
        selectedElement: {
            elementId: undefined,
            elementType: "file"
        },
        movingElementId: undefined
    } as FSInteractionState,
    reducers: {
        selectElement: (state, action: PayloadAction<{ id: string, type: ElementType }>) => {
            state.selectedElement.elementId = action.payload.id
            state.selectedElement.elementType = action.payload.type
        },
        removeSelection: state => {
            state.selectedElement.elementId = ''
        },
        showContextMenu: (state, action: PayloadAction<MenuType>) => {
            state.contextMenu.visible = true
            state.contextMenu.menuType = action.payload
        },
        closeContextMenu: state => {
            state.contextMenu.visible = false
        },
        setMovingElementId: (state, action: PayloadAction<string>) => {
            state.movingElementId = action.payload
        },
        removeMovingElementId: state => {
            state.movingElementId = undefined
        }
    }
})

export const {
    selectElement,
    removeSelection,
    showContextMenu,
    closeContextMenu,
    setMovingElementId,
    removeMovingElementId
} = FileSystemInteractionReducer.actions

export default FileSystemInteractionReducer.reducer