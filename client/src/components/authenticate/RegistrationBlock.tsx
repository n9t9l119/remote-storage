import React from 'react';

interface Props {
    usernameHandler: (username: string) => void,
    emailHandler: (email: string) => void,
    passwordHandler: (password: string) => void,
    username: string,
    email: string,
    password: string,
}

export const RegistrationBlock = ({usernameHandler, emailHandler, passwordHandler, username, email, password}: Props) => {
    return (
        <form>
            <h3>sign up</h3>
            <div className="input-field">
                <input type="text" name="" id="username" required={true} autoComplete="off" value={username} onChange={(e) => usernameHandler(e.target.value)}/>
                <label htmlFor="username">Username</label>
            </div>
            <div className="input-field">
                <input type="text" name="" id="email" required={true} value={email} onChange={(e) => emailHandler(e.target.value)}/>
                <label htmlFor="email">Email</label>
            </div>
            <div className="input-field">
                <input type="password" name="" id="password" required={true} value={password} onChange={(e) => passwordHandler(e.target.value)}/>
                <label htmlFor="password">Password</label>
            </div>
        </form>
    );
};