import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import {LoginPage} from "./pages/LoginPage";

function App() {
  return (
    <Router>
      <div className='container'>
        <Switch>
            <Route path="/" exact><LoginPage/></Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;