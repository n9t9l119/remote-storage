import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Page1 } from './pages/Page1';
import { Page2 } from './pages/Page2';

function App() {
  return (
    <Router>
      <Navbar/>
      <div className='container'>
        <Switch>
          <Route path='/page-1' exact><Page1/></Route>
          <Route path='/page-2' exact><Page2/></Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
