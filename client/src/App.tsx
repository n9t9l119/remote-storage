import React, {useEffect} from 'react';
import {BrowserRouter as Router} from 'react-router-dom';
import {AuthStateType} from "./redux/reducers/authReducer";
import useRoutes from "./Routes";
import {useTypedDispatch, useTypedSelector} from "./redux/hooks";
import MessageBlock from "./components/system-message/MessageBlock";
import AuthController from "./controllers/AuthController";
import {appEndLoading, appStartLoading} from "./redux/reducers/appReducer";
import Loader from "./components/loader/Loader";

function App() {
    const {isAuth} = useTypedSelector<AuthStateType>(state => state.auth)
    const routes = useRoutes(isAuth)

    const dispatch = useTypedDispatch();

    useEffect(() => {
        dispatch(appStartLoading())
        AuthController.checkAuth()
            .then(res => dispatch(appEndLoading()))
    }, [dispatch])

    return (
        <>
            <Loader/>
            <Router>
                <div className='container'>
                    {routes}
                </div>
                <MessageBlock/>
            </Router>
        </>

    );
}

export default App;