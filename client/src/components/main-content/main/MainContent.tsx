import React from 'react';
import AsidePanel from "./aside-panel/AsidePanel";
import MainPanel from "./main-panel/MainPanel";
import './MainContent.css'


const MainContent = () => {


    return (
        <main>
            <AsidePanel/>
            <MainPanel/>
        </main>

    );
};

export default MainContent;