import "babel-polyfill";

import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
// react router
import { ConnectedRouter } from 'react-router-redux'
// All redux thing is initialized here
import createStoreAndHistory from './common/createStoreAndHistory'

import './index.less'
import App from './App'
import registerServiceWorker from './registerServiceWorker';
// create store and history
let { store, history } = createStoreAndHistory()

render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <App />
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root')
)

registerServiceWorker();
