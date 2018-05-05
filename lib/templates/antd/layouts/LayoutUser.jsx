import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Menu, Icon, Dropdown, Avatar, Badge } from 'antd'

class LayoutUser extends Component {

  handleMenuClick = ({ key }) => {
    switch (key) {
      case 'logout':
        return this.logout()
      default:
        break;
    }
  }

  logout () {
    this.props.dispatch({ type: 'user/logout' })
  }

  render () {
    const menu = (
      <Menu onClick={this.handleMenuClick}>
        <Menu.Item key="logout">
          <Icon type="logout" />Logout
        </Menu.Item>
      </Menu>
    );

    const notice = (
      <Link to="/notification" className="notification">
        <Badge count={6}>
          <Icon type="bell" />
        </Badge>
      </Link>
    )

    return (
      <div className="user">
        {notice}
        <Dropdown overlay={menu} trigger={["click"]}>
          <span className="account">
            <Avatar className="avatar"
              src="https://gw.alipayobjects.com/zos/rmsportal/UjusLxePxWGkttaqqmUI.png" />
            Samson
          </span>
        </Dropdown>
      </div>
    )
  }
}

export default connect(state => state.user)(LayoutUser)
