import React from 'react';

interface Props{
    usernameHandler: (username: string) => void,
    passwordHandler: (password: string) => void,
    rememberFlagHandler: (flag: boolean) => void,
    username: string,
    password: string,
    rememberFlag: boolean
}

export const LoginBlock = ({usernameHandler, passwordHandler, rememberFlagHandler, username, password, rememberFlag}: Props) => {
    return (
        <form>
            <h3>Login</h3>
            <div className="input-field">
                <input type="text" name="" id="email" required={true} value={username} onChange={(e) => usernameHandler(e.target.value)}/>
                <label htmlFor="email">Username</label>
            </div>
            <div className="input-field">
                <input type="password" name="" id="password" required={true} value={password} onChange={(e) => passwordHandler(e.target.value)}/>
                <label htmlFor="password">Password</label>
            </div>
            <div className="checkbox-field" hidden={true}>
                <label htmlFor="rememberFlag">Remember me</label>
                <input type="checkbox" name="" id="rememberFlag" checked={rememberFlag} onChange={(e) => rememberFlagHandler(e.target.checked)}/>
            </div>
        </form>
    );
};