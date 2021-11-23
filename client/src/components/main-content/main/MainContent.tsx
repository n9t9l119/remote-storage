import React, {createContext, useState} from 'react';
import AsidePanel from "./aside-panel/AsidePanel";
import MainPanel from "./main-panel/MainPanel";
import './MainContent.css'

interface CreateFolderContextType {
    visible: boolean,
    visibleHandler: (visible: boolean) => void
}

export const CreateFolderContext = createContext<CreateFolderContextType>({
    visible: false,
    visibleHandler: () => {}
})

const MainContent = () => {
    const [createFolderVisible, setCreateFolderVisible] = useState<boolean>(false)

    function createFolderVisibleHandler(visible: boolean) {
        setCreateFolderVisible(visible)
    }

    return (
        <CreateFolderContext.Provider
            value={{visible: createFolderVisible, visibleHandler: createFolderVisibleHandler}}>
            <main>
                <AsidePanel/>
                <MainPanel/>
            </main>
        </CreateFolderContext.Provider>
    );
};

export default MainContent;