import React from 'react'
import { connect } from 'react-redux'

import { Modal } from 'antd'

class AppAlert extends React.PureComponent {
  componentWillReceiveProps (nextProps) {
    if (this.props.alertTitle !== nextProps.alertTitle &&
      nextProps.alertDisplayed === true) {
      // alert error
      Modal.error({
        title: nextProps.alertTitle,
        content: nextProps.alertMessage,
        onOk: () => {
          this.props.dispatch({ type: 'app/alert/hide' })
        }
      });
    }
  }

  render () {
    return ( <input type="hidden" /> )
  }
}

export default connect(state => state.app)(AppAlert)
