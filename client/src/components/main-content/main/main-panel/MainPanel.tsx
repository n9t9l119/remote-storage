import React from 'react';
import './MainPanel.css'
import FileSystem from "./file-system/FileSystem";
import InfoPart from "./info-part/InfoPart";
import ReactDOM from "react-dom";
import CreateDirectoryWindow from "../directory-name-window/CreateDirectoryWindow";

const MainPanel = () => {
    const root = document.getElementById('root')

    return (
        <article className={'glass'}>
            <div className={'main-panel-wrapper'}>
                <FileSystem/>
                <div className={'line'}></div>
                <InfoPart/>
                {root && ReactDOM.createPortal(<CreateDirectoryWindow/>, root)}

            </div>
        </article>
    );
};

export default MainPanel;