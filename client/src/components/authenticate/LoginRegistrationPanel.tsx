import React, {useState} from 'react';
import {LoginBlock} from "./LoginBlock";
import {RegistrationBlock} from "./RegistrationBlock";
import './LoginRegistration.css'
import AuthController from "../../controllers/AuthController";
import {appEndWaiting, appStartWaiting, AppStateType} from "../../redux/reducers/appReducer";
import {useTypedDispatch, useTypedSelector} from "../../redux/hooks";

export const LoginRegistrationPanel = () => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [rememberFlag, setRememberFlag] = useState<boolean>(false);

    const [panelMode, setPanelMode] = useState<'login' | 'registration'>('login');

    const appState = useTypedSelector<AppStateType>(state => state.app)
    const dispatch = useTypedDispatch()

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
        dispatch(appStartWaiting())
        if (panelMode === 'registration') {
            await AuthController.register({username, email, password})
        } else if (panelMode === 'login') {
            await AuthController.login({username, password})
        }
        dispatch(appEndWaiting())
    }

    return (
        <div className="auth-container">
            <div className="wrapper">
                <div className="shape glass"></div>
                <div className="shape glass"></div>
                <div className="shape glass"></div>
                <div className="shape glass"></div>
                <div className="shape glass"></div>
                <div className="shape glass"></div>
                <div className="shape glass"></div>
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
                            usernameHandler={usernameHandler}
                            passwordHandler={passwordHandler}
                            rememberFlagHandler={rememberFlagHandler}
                            username={username}
                            password={password}
                            rememberFlag={rememberFlag}/>
                    }
                    <button onClick={submitForm}
                            disabled={appState.waiting}>{panelMode === "login" ? "login" : "sign up"}</button>
                </div>
                <div className="shape glass">
                    <button onClick={togglePanelMode} disabled={appState.waiting}>{panelMode === "registration" ? "login" : "sing up"}</button>
                </div>
            </div>

        </div>
    );
};