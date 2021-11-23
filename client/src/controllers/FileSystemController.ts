import RequestController from "./RequestController";
import FileSystemGet, {FSGetResponse} from "../requests/FileSystemGet";
import store from "../redux/store";
import {updateDirectory} from "../redux/reducers/fileSystemReducer";
import FileSystemCreateFolder from "../requests/FileSystemCreateFolder";

export default class FileSystemController {
    private static currentDirectoryId: string | undefined = undefined

    static async getDirectory(id?: string) {
        FileSystemController.currentDirectoryId = id

        let params = id ? {id} : undefined
        const command = new RequestController<FSGetResponse>(new FileSystemGet(params))
        const result = await command.execute()

        if (result.status === 200) {
            store.dispatch(updateDirectory(result.data.response))
        }
    }

    static async createDirectory(params: { name: string, parent_id: string }) {
        const command = new RequestController(new FileSystemCreateFolder(params))
        const result = await command.execute()

        console.log(result)
    }

    static async updateCurrentDirectory(){
        await FileSystemController.getDirectory(FileSystemController.currentDirectoryId)
    }
}