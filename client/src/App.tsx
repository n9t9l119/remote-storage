import React from 'react';
import {BrowserRouter as Router} from 'react-router-dom';
import {AuthStateType} from "./redux/reducers/authReducer";
import useRoutes from "./Routes";
import {useTypedSelector} from "./redux/hooks";
import MessageBlock from "./components/system-message/MessageBlock";

function App() {
    const Auth = useTypedSelector<AuthStateType>(state => state.auth)
    const routes = useRoutes(Auth.isAuth)

    return (
        <Router>
            <div className='container'>
                {routes}
            </div>
            <MessageBlock/>
        </Router>
    );
}

export default App;