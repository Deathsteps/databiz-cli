import React from 'react'
import { Row, Col } from 'antd'

const FormItemContainer =
  ({ label, labelCol, wrapperCol, className, children, style }) => (
    <Row className={className} style={style}>
      <Col {...labelCol} className="ant-form-item-label">
        <label>{label}</label>
      </Col>
      <Col {...wrapperCol}>
        {children}
      </Col>
    </Row>
  )

export default FormItemContainer
