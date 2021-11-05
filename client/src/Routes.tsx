import React from "react";
import {Redirect, Route, Switch} from "react-router-dom";
import {LoginPage} from "./pages/LoginPage";

const useRoutes = (isAuth: boolean) => {
    if (!isAuth) {
        return (
            <Switch>
                <Route path='/login' exact><LoginPage/></Route>
                <Redirect to='/login'/>
            </Switch>
        )
    } else {
        return (
            <Switch>
                <Route path='/main' exact>some page</Route>
                <Redirect to='/main'/>
            </Switch>
        )
    }
}


export default useRoutes