import React from 'react'
// import classNames from 'classnames'
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom'
import { Menu, Icon } from 'antd'
import { find } from 'lodash/fp'

import { mainRoutes } from '../common/routes'

const SubMenu = Menu.SubMenu

const OPEN_KEYS = {
  "resources": ["contact"]
}

class LayoutMenu extends React.Component {

  getMenuSelectedKeys () {
    let pathInfoes = this.props.location.pathname.split('/')
    let pathKey = '/' + pathInfoes[1]
    if (pathInfoes.length > 2) {
      pathKey += '/' + pathInfoes[2]
    }
    let route = find(route => route.path.startsWith(pathKey))(mainRoutes)
    return route ? [route.nav] : []
  }

  getMenuOpenKeys (selectedKeys) {
    return selectedKeys.map(item => {
      for(let key in OPEN_KEYS) {
        if (OPEN_KEYS[key].indexOf(item) > -1) {
          return key
        }
      }
      return ''
    })
  }

  render () {
    const selectedKeys = this.getMenuSelectedKeys()
    return (
      <Menu
        mode="inline"
        className="layout-menu"
        selectedKeys={selectedKeys}
        defaultOpenKeys={this.getMenuOpenKeys(selectedKeys)}
      >
        <Menu.Item key="home" >
          <Link to="/" className="link">
            <Icon type="home" /> Home
          </Link>
        </Menu.Item>
        <SubMenu key="resources" title={<span><Icon type="appstore" /><span>Contact</span></span>}>
          <Menu.Item key="contact">
            <Link to="/contact" className="link">
              Contact
            </Link>
          </Menu.Item>
        </SubMenu>
      </Menu>
    )
  }
}

export default withRouter(LayoutMenu)
