import RequestController from "./RequestController";
import FileSystemGet, {FSGetResponse} from "../requests/FileSystemGet";
import store from "../redux/store";
import {updateDirectory} from "../redux/reducers/fileSystemReducer";
import FileSystemCreateFolder, {FSCreateFolderParams} from "../requests/FileSystemCreateFolder";
import MessageController from "./MessageController";
import FileSystemRename, {FSRenameParams} from "../requests/FileSystemRename";
import FileSystemDelete, {FSDeleteParams} from "../requests/FileSystemDelete";
import FileSystemMove, {FSMoveParams} from "../requests/FileSystemMove";
import FileSystemUploadFile, {FSFileUploadParams} from "../requests/FileSystemUploadFile";
import {setAvailableSpace, setUsedSpace} from "../redux/reducers/spaceInfoReducer";

export default class FileSystemController {
    private static currentDirectoryId: string | undefined = undefined

    static async getDirectory(id?: string) {
        let params = id ? {id} : undefined
        const command = new RequestController<FSGetResponse>(new FileSystemGet(params))
        const result = await command.execute()

        if (result.status === 200) {
            FileSystemController.currentDirectoryId = result.data.id
            store.dispatch(updateDirectory(result.data))
        }

        store.dispatch(setUsedSpace(result.data.used_space))
        store.dispatch(setAvailableSpace(result.data.available_space))

    }

    static async createDirectory(params: FSCreateFolderParams) {
        if (!params.name.trim()) {
            MessageController.error('Задайте название')
            return
        }
        const command = new RequestController(new FileSystemCreateFolder(params))
        const result = await command.execute()

        if (result.status === 200) {
        } else if (result.response && result.response.status !== 500) {
            MessageController.error(result.response.data.error)
        }
    }

    static async renameElement(params: FSRenameParams) {
        if (!params.new_name.trim()) {
            MessageController.error('Задайте название')
            return
        }
        const command = new RequestController(new FileSystemRename(params))
        await command.execute()
    }

    static async deleteElement(params: FSDeleteParams) {
        const command = new RequestController(new FileSystemDelete(params))
        await command.execute()
    }

    static async updateCurrentDirectory() {
        await FileSystemController.getDirectory(FileSystemController.currentDirectoryId)
    }

    static async moveElement(params: FSMoveParams) {
        const command = new RequestController(new FileSystemMove(params))
        const result = await command.execute()

        if (result.status === 200) {
        } else if (result.response && result.response.status !== 500) {
            MessageController.error(result.response.data.error)
        }
    }

    static async uploadFile(params: FSFileUploadParams, data: ArrayBuffer) {
        const command = new RequestController(new FileSystemUploadFile(params, data))
        await command.execute()
    }
}