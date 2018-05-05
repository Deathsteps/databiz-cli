import { createStore, combineReducers, applyMiddleware } from 'redux'
import createHistory from 'history/createHashHistory'
import { routerReducer, routerMiddleware } from 'react-router-redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import createSagaMiddleware from 'redux-saga'
import reducers from '../models/reducers'
import rootSaga from '../models/rootSaga'

export default function () {
  const history = createHistory()
  const sagaMiddleware = createSagaMiddleware()
  let store = createStore(
    combineReducers({
      ...reducers, // all model reducer
      router: routerReducer
    }),
    composeWithDevTools(
      applyMiddleware(
        routerMiddleware(history),
        sagaMiddleware
      )
    )
  )
  sagaMiddleware.run(rootSaga)
  return { store, history }
}
