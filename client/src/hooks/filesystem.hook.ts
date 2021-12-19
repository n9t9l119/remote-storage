import {useTypedDispatch, useTypedSelector} from "../redux/hooks";
import {
    closeContextMenu,
    FSInteractionState,
    removeMovingElementId,
    setMovingElementId
} from "../redux/reducers/fileSystemInteractionReducer";
import {FileSystemStateType} from "../redux/reducers/fileSystemReducer";
import {showNameWindow} from "../redux/reducers/nameWindowReducer";
import FileSystemController from "../controllers/FileSystemController";
import {DESTINATION_HOST} from "../utils/consts";
import {useCallback} from "react";
import axios, {AxiosResponse} from "axios";
import {log} from "util";

export const useFileSystem = () => {

    const dispatch = useTypedDispatch();

    const fsInteraction = useTypedSelector<FSInteractionState>(state => state.fileSystemInteraction)
    const {currentDirectoryId} = useTypedSelector<FileSystemStateType>(state => state.fileSystem)

    const renameHandler = useCallback(() => {
        dispatch(showNameWindow({actionType: 'rename', elementType: fsInteraction.selectedElement.elementType}))
    }, [dispatch, fsInteraction.selectedElement.elementType])

    const moveHandler = useCallback(() => {
        if (fsInteraction.selectedElement.elementId) dispatch(setMovingElementId(fsInteraction.selectedElement.elementId))
    }, [dispatch, fsInteraction.selectedElement.elementId])

    const putElementHandler = useCallback(async () => {
        let parentId
        if (fsInteraction.selectedElement.elementId !== fsInteraction.movingElementId && fsInteraction.selectedElement.elementId) {
            parentId = fsInteraction.selectedElement.elementId
        } else {
            parentId = currentDirectoryId
        }
        if (fsInteraction.movingElementId) await FileSystemController.moveElement({
            id: fsInteraction.movingElementId,
            new_parent_id: parentId
        })
        await FileSystemController.updateCurrentDirectory()
        dispatch(removeMovingElementId())
    }, [currentDirectoryId, dispatch, fsInteraction.movingElementId, fsInteraction.selectedElement.elementId])

    const deleteHandler = useCallback(async () => {
        console.log(123)
        if (fsInteraction.selectedElement.elementId) await FileSystemController.deleteElement({id: fsInteraction.selectedElement.elementId})
        await FileSystemController.updateCurrentDirectory()
    }, [fsInteraction.selectedElement.elementId])

    const createFolderHandler = useCallback(() => {
        dispatch(showNameWindow({actionType: 'create', elementType: 'folder'}))
    }, [dispatch])

    const uploadFileHandler = useCallback(() => {
        let input = document.createElement('input')
        input.type = 'file'
        input.hidden = true
        document.body.appendChild(input)
        let file: File | null

        input.click()

        input.onchange = function (e: Event) {
            let fileReader = new FileReader()
            let fileList = (e.target as HTMLInputElement).files

            fileReader.onload = async () => {
                if (file?.name && fileReader.result && fileReader.result instanceof ArrayBuffer) {
                    await FileSystemController.uploadFile({
                        filename: file.name,
                        parent_id: currentDirectoryId
                    }, fileReader.result)
                    await FileSystemController.updateCurrentDirectory()
                }

                input.remove()
            }

            if (fileList) {
                fileReader.readAsArrayBuffer(fileList[0])
                file = fileList[0]
            }
        }
    }, [currentDirectoryId])

    const downloadHandler = useCallback(() => {
        const token = localStorage.getItem('accessToken');
        axios.get(`${DESTINATION_HOST}/api/v1/filesystem/download_file?id=${fsInteraction.selectedElement.elementId}`, {
            responseType: "blob",
            withCredentials: true,
            headers: {
                Authorization: `JWT ${token}`
            },
            onDownloadProgress: (progressEvent) => {
				const totalLength = progressEvent.lengthComputable ? progressEvent.total : progressEvent.target.getResponseHeader('content-length') || progressEvent.target.getResponseHeader('x-decompressed-content-length');
				if (totalLength !== null) {
					console.log(Math.round( (progressEvent.loaded * 100) / totalLength ))
				}
			}
        }).then((res: AxiosResponse<Blob | any>) => {
            let name = res.headers['content-disposition'].replace("attachment; filename*=utf-8\'\'", '')
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', name);
            document.body.appendChild(link);
            link.click();
            link.remove()
        })
    }, [fsInteraction.selectedElement.elementId])

    const clickHandler = useCallback((e: any) => {
        e.stopPropagation()
        dispatch(closeContextMenu())
    }, [dispatch])

    return {
        renameHandler,
        moveHandler,
        putElementHandler,
        deleteHandler,
        createFolderHandler,
        uploadFileHandler,
        downloadHandler,
        clickHandler
    }
}