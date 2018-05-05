import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'

const PrivateRoute = ({
  component: Component,
  isLogined,
  children,
  compProps,
  ...rest
}) => (
  <Route
    {...rest}
    render={props => (
      isLogined ? (
        <Component {...props} {...compProps}/>
      ) : (
        <Redirect to={{
          pathname: '/user/login',
          state: { from: props.location.pathname } 
        }}/>
      )
    )}
  />
)

export default connect(
  state => ({ isLogined: state.user.isLogined })
)(PrivateRoute)
