import React from "react";
import {Redirect, Route, Switch} from "react-router-dom";
import {LoginPage} from "./pages/LoginPage";
import AuthController from "./controllers/AuthController";

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
                <Route path='/main' exact>
                    <p>some page</p>
                    <button onClick={AuthController.logout}>Sign Out</button>
                </Route>
                <Redirect to='/main'/>
            </Switch>
        )
    }
}


export default useRoutes