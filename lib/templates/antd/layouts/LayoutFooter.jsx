import React from 'react'
import { Layout } from 'antd'

import './LayoutFooter.less'

const LayoutFooter = () => {
  return (
    <Layout.Footer className="layout-footer">
      <p>
          <strong>DataBiz</strong> Management Infomantion System
      </p>
      <p>
          © 2018 <strong>DataBiz</strong>. ALL Rights Reserved.
      </p>
    </Layout.Footer>
  )
}

export default LayoutFooter
