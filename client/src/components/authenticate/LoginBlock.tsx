import React from 'react';

interface Props{
    emailHandler: (email: string) => void,
    passwordHandler: (password: string) => void,
    rememberFlagHandler: (flag: boolean) => void,
    email: string,
    password: string,
    rememberFlag: boolean
}

export const LoginBlock = ({emailHandler, passwordHandler, rememberFlagHandler, email, password, rememberFlag}: Props) => {
    return (
        <form>
            <h3>Login</h3>
            <div className="input-field">
                <input type="text" name="" id="email" required={true} value={email} onChange={(e) => emailHandler(e.target.value)}/>
                <label htmlFor="email">Login</label>
            </div>
            <div className="input-field">
                <input type="password" name="" id="password" required={true} value={password} onChange={(e) => passwordHandler(e.target.value)}/>
                <label htmlFor="password">Password</label>
            </div>
            <div className="checkbox-field">
                <label htmlFor="rememberFlag">Remember me</label>
                <input type="checkbox" name="" id="rememberFlag" checked={rememberFlag} onChange={(e) => rememberFlagHandler(e.target.checked)}/>
            </div>
        </form>
    );
};