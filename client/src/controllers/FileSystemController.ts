import RequestController from "./RequestController";
import FileSystemGet, {FSGetResponse} from "../requests/FileSystemGet";
import store from "../redux/store";
import {updateDirectory} from "../redux/reducers/fileSystemReducer";
import FileSystemCreateFolder from "../requests/FileSystemCreateFolder";
import MessageController from "./MessageController";
import FileSystemRename from "../requests/FileSystemRename";
import FileSystemDelete from "../requests/FileSystemDelete";
import FileSystemMove from "../requests/FileSystemMove";

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
    }

    static async createDirectory(params: { name: string, parent_id: string }) {
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

    static async renameElement(params: { id: string, new_name: string }) {
        if (!params.new_name.trim()) {
            MessageController.error('Задайте название')
            return
        }
        const command = new RequestController(new FileSystemRename(params))
        const result = await command.execute()
    }

    static async deleteElement(params: { id: string }) {
        const command = new RequestController(new FileSystemDelete(params))
        const result = await command.execute()
    }

    static async updateCurrentDirectory() {
        await FileSystemController.getDirectory(FileSystemController.currentDirectoryId)
    }

    static async moveElement(params: { id: string, new_parent_id: string }) {
        const command = new RequestController(new FileSystemMove(params))
        const result = await command.execute()

        if (result.status === 200) {
        } else if (result.response && result.response.status !== 500) {
            MessageController.error(result.response.data.error)
        }
    }
}