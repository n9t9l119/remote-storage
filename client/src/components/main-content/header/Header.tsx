import React from 'react';
import './Header.css'
import AuthController from "../../../controllers/AuthController";

const Header = () => {
    return (
        <header>
            <div className='glass header'>
                <h1>DNA</h1>
                <button onClick={() => AuthController.logout()}>
                    <img src={process.env.PUBLIC_URL + 'icons/logout.svg' } alt="logout"/>

                </button>
            </div>
        </header>
    );
};

export default Header;