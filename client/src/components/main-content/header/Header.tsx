import React from 'react';
import './Header.css'
import AuthController from "../../../controllers/AuthController";

const Header = () => {
    return (
        <header>
            <div className='glass header'>
                <h1>Header</h1>
                <button onClick={()=>AuthController.logout()}>Sign Out</button>
            </div>
        </header>
    );
};

export default Header;