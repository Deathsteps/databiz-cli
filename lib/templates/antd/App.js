import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom'

import BasicLayout from './layouts/BasicLayout'
import UserLayout from './layouts/UserLayout'
import PrivateRoute from './components/PrivateRoute'
import AppAlert from './components/AppAlert'

class App extends Component {
  render() {
    return (
      <div style={{ height: '100%' }}>
        <Switch>
          <Route path="/user">
            <UserLayout />
          </Route>
          <PrivateRoute
            path="/"
            component={BasicLayout}
          />
        </Switch>
        <AppAlert />
      </div>
    );
  }
}

export default App;
