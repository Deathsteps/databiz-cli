// @flow
import _ from 'lodash'

export type Action = { +type: string, payload?: Object }
export type Reducer = (state: Object, action: Action) => Object

export type StateConfig = {
  indicate?: string,
  err?: string,
  result?: string,
  isResultSpread?: boolean,
  extraState?: Object
}
const INITIAL_STATE_CONFIG = {
  indicate: 'fetching',
  result: 'fetchingResult',
  err: 'fetchingErr',
  isResultSpread: false,
  extraState: {}
}
/**
 * Build a reducer for an async action
 * @param  {string} model       which model contains the reducer
 * @param  {string} actionName       action name
 * @param  {StateConfig} stateConfig state config
 * @param  {string} [stateConfig.indicate = fetching] async action progress indicate
 * @param  {string} [stateConfig.result = fetchingResult] async action result
 * @param  {Error} [stateConfig.error = fetchingErr] async action error
 * @param  {boolean} [stateConfig.isResultSpread = false] whether spread the action result
 * @param  {Object} [stateConfig.extraState = {}] extra state
 * @return {Reducer}             result reducer
 */
export function buildAsyncActionReducer (
  model: string,
  actionName: string,
  stateConfig: StateConfig = {}
): Reducer {
  const config = { ...INITIAL_STATE_CONFIG, ...stateConfig }
  const INITIAL_STATE = {
    [config.indicate]: false,
    [config.result]: null,
    [config.err]: null,
    ...config.extraState
  }
  return function (state = INITIAL_STATE, { type, payload } ) {
    switch (type) {
      case `${model}/${actionName}/request`:
        return {
          ...state,
          [config.indicate]: true
        }
      case `${model}/${actionName}/success`:
        if (config.isResultSpread) {
          return {
            ...state,
            [config.indicate]: false,
            ...payload
          }
        } else {
          return {
            ...state,
            [config.indicate]: false,
            [config.result]: payload
          }
        }
      case `${model}/${actionName}/failure`:
        return {
          ...state,
          [config.indicate]: false,
          [config.err]: payload
        }
      default:
        return state
    }
  }
}

export function buildListReducer(model: string): Reducer {
  return buildAsyncActionReducer(model, 'list', {
    result: 'list',
    extraState: { totalCount: 0 },
    isResultSpread: true
  })
}

export function buildDetailReducer(model: string): Reducer {
  return buildAsyncActionReducer(model, 'detail', {
    result: 'info'
  })
}

export function buildEditReducer(model: string): Reducer {
  return buildAsyncActionReducer(model, 'edit', {
    indicate: 'editing',
    result: 'editResult',
    err: 'editErr'
  })
}

export function buildDeleteReducer(model: string): Reducer {
  return buildAsyncActionReducer(model, 'delete', {
    indicate: 'deleting',
    result: 'deleteResult',
    err: 'deleteErr'
  })
}

export function buildCRUDReducers (model: string): Object {
  let ret = {}
  ret[ model + 'List' ] = buildListReducer(model)
  ret[ model + 'Detail' ] = buildDetailReducer(model)
  return ret
}

/**
 * merge multiply reducers to one
 */
export function mergeReducers (...reducers: Array<Reducer>): Reducer {

  let initial_state_keys = []

  return function (state: Object, action: Action) {
    if (_.isEmpty(state)) {
      // Find out initial states of each reducer.
      // NOTE: These reducer inital states should not contain the same keys
      let inital_states = reducers.map(reducer => reducer(state, action))
      initial_state_keys = inital_states.map(s => _.keys(s))
      return Object.assign({}, ...inital_states)
    } else {
      return (
        reducers.reduce(
          (finalState, reducer, i) => ({
            ...finalState,
            ...reducer(_.pick(state, initial_state_keys[i]), action)
          }), {}
        )
      )
    }
  }
}
