import React, {useState} from 'react';
import {LoginBlock} from "./LoginBlock";
import {RegistrationBlock} from "./RegistrationBlock";

import './LoginRegistration.css'
import RequestController from "../../http/RequestController";
import RegisterRequest, {RegisterResponse} from "../../requests/RegisterRequest";

export const LoginRegistrationPanel = () => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [rememberFlag, setRememberFlag] = useState<boolean>(false);

    const [panelMode, setPanelMode] = useState<'login' | 'registration'>('login');

    function usernameHandler(username: string) {
        setUsername(username)
    }

    function passwordHandler(password: string) {
        setPassword(password)
    }

    function emailHandler(email: string) {
        setEmail(email)
    }

    function rememberFlagHandler(rememberFlag: boolean) {
        setRememberFlag(rememberFlag)
    }

    function togglePanelMode() {
        panelMode === "login" ? setPanelMode('registration') : setPanelMode("login")
    }

    async function submitForm() {
        if (panelMode === 'registration') {
            const command = new RequestController<RegisterResponse>(new RegisterRequest({
                username: username,
                password: password,
                password2: password,
                email: email
            }))
            const response = await command.execute()

            console.log(response)
        }
    }

    return (
        <div className="auth-container">
            <div className="wrapper">
                <div className="shape"></div>
                <div className="shape"></div>
                <div className="shape"></div>
                <div className="shape"></div>
                <div className="shape"></div>
                <div className="shape"></div>
                <div className="shape"></div>
                <div className="auth-panel">
                    {
                        panelMode === 'registration' &&
                        <RegistrationBlock
                            usernameHandler={usernameHandler}
                            emailHandler={emailHandler}
                            passwordHandler={passwordHandler}
                            username={username}
                            email={email}
                            password={password}/>
                    }
                    {
                        panelMode === 'login' &&
                        <LoginBlock
                            emailHandler={emailHandler}
                            passwordHandler={passwordHandler}
                            rememberFlagHandler={rememberFlagHandler}
                            email={email}
                            password={password}
                            rememberFlag={rememberFlag}/>
                    }
                    <button onClick={submitForm}>{panelMode === "login" ? "login" : "sign up"}</button>
                </div>
                <div className="shape">
                    <button onClick={togglePanelMode}>{panelMode === "registration" ? "login" : "sing up"}</button>
                </div>
            </div>

        </div>
    );
};