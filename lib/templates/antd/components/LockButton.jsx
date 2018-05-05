import React from 'react'
import PropTypes from 'prop-types'
import { defineMessages, injectIntl } from 'react-intl'
import _ from 'lodash'
import { Modal, Tooltip, Icon } from 'antd';
const confirm = Modal.confirm;

const confirmMsgs = defineMessages({
  lock: {
      id: 'component.lockbutton.confirm.lock',
      defaultMessage: '你确定要锁定这个{it}'
  },
  unlock: {
      id: 'component.lockbutton.confirm.unlock',
      defaultMessage: '你确定要解锁这个{it}'
  },
});

class LockButton extends React.Component {
  state = {
    locked: false
  }

  triggerLock = () => {
    let { intl, lockTarget } = this.props
    let { locked } = this.state
    confirm({
      title:
        intl.formatMessage(
          confirmMsgs[locked ? 'unlock' : 'lock'],
          { it: lockTarget }
        ),
      onOk: () => {
        this.setState({ locked: !locked })
        this.props.onChange(!locked)
      }
    });
  }

  render () {
    let { locked } = this.state
    let style = locked ? { color: "red" } : null
    return (
      <a style={style} onClick={this.triggerLock}>
        <Tooltip title={ locked ? "解锁" : "锁定" }>
          { locked ? <Icon type="lock"/> : <Icon type="unlock"/> }
        </Tooltip>
      </a>
    )
  }
}

LockButton.defaultProps = {
  lockTarget: '它',
  onChange: _.noop
}
LockButton.propTypes = {
  lockTarget: PropTypes.string,
  onChange: PropTypes.func
}

export default injectIntl(LockButton)
