import React from 'react'
// import classNames from 'classnames'
import { Switch, Route } from 'react-router-dom'
import { Layout } from 'antd'

import Document from '../components/Document'
import { userRoutes } from '../common/routes'

import logo from '../static/logo.svg'
import './UserLayout.less'

class UserLayout extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    return (
      <Document
        bodyStyle={{
          background: 'url("https://gw.alipayobjects.com/zos/rmsportal/TVYTbAXWheQpRcWDaDMu.svg") no-repeat center center fixed',
          backgroundSize: 'cover',
          webkitBackgroundSize: 'cover',
          mozBackgroundSize: 'cover'
        }}
      >
        <div style={{ width: '100%' }}>
          <Layout className="user-layout">
            <div className="user-layout-header">
              <div className="logo">
                <img src={logo} alt="logo"/>
              </div>
              <p className="desc">DataBiz，Your Best Choice</p>
            </div>
            <div className="user-layout-content">
              <Switch>
                { userRoutes.map( route => <Route {...route} key={route.path} /> ) }
              </Switch>
            </div>
          </Layout>
        </div>
      </Document>
    )
  }
}

export default UserLayout
