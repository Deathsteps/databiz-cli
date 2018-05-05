import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom'

import AppAlert from './components/AppAlert'

import Home from './views/Home/index'
import Contact from './views/Contact/index'

import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <div style={{ height: '100px' }}>
          <Switch>
            <Route path="/" exact={true}>
              <Home />
            </Route>
            <Route path="/contact">
              <Contact />
            </Route>
          </Switch>
          <AppAlert />
        </div>
      </div>
    );
  }
}

export default App;
