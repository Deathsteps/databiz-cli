import React from 'react'
import { connect } from 'react-redux'

class AppAlert extends React.PureComponent {
  componentWillReceiveProps (nextProps) {
    if (this.props.alertTitle !== nextProps.alertTitle &&
      nextProps.alertDisplayed === true) {
      // alert error
      console.log(nextProps.alertTitle)
      alert(nextProps.alertTitle)
    }
  }

  render () {
    return ( <input type="hidden" /> )
  }
}

export default connect(state => state.app)(AppAlert)
