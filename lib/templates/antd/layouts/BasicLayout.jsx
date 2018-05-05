import React, { Component } from 'react'
// import PropTypes from 'prop-types'
// import classNames from 'classnames'
import { Route, Link, Switch } from 'react-router-dom'
import { Layout, Icon } from 'antd'
import _ from 'lodash'

import LayoutFooter from './LayoutFooter'
import LayoutUser from './LayoutUser'
import LayoutMenu from './LayoutMenu'
import { mainRoutes } from '../common/routes'

import logo from '../static/logo.svg'
import './BasicLayout.less'

const { Header, Content, Sider } = Layout;
// const { SubMenu } = Menu;

class BasicLayout extends Component {
  constructor(props) {
    super(props);

    this.state = {
      collapsed: false
    };
  }

  toggleMenu = (collapsed) => {
    this.setState({
      collapsed: _.isBoolean(collapsed) ? collapsed : !this.state.collapsed
    })
  }

  renderHeader () {
    let menuTrigger =
      <span className="menu-trigger" onClick={this.toggleMenu}>
        <Icon type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'} />
      </span>
    return (
      <Header className="layout-header">
        { menuTrigger }
        <Link to="/" className="home-link">DataBiz</Link>
        <LayoutUser />
      </Header>
    )
  }

  renderContent() {
    return (
      <Content className="layout-content">
        <Switch>
          {mainRoutes.map(route => <Route {...route} key={route.path}/>)}
        </Switch>
        <LayoutFooter />
      </Content>
    )
  }

  render() {
    return (
      <Layout className="layout">
        {this.renderHeader()}
        <Layout style={{ height: '100%' }}>
          <Sider
            width={200}
            collapsible
            collapsed={this.state.collapsed}
            collapsedWidth={0}
            trigger={null}
            className="layout-sider"
            breakpoint="sm"
            onCollapse={this.toggleMenu}
          >
            <Link className="logo" to="/">
              <img src={logo} alt="logo"/>
            </Link>
            <LayoutMenu />
          </Sider>
          {this.renderContent()}
        </Layout>
      </Layout>
    )
  }
}

export default BasicLayout
