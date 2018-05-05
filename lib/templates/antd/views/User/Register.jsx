import React from 'react'

import { Form, Icon, Input, Checkbox, Button } from 'antd'

class Register extends React.Component {
  constructor(props) {
    super(props)
    this.state = {

    }
  }

  render() {
    return (
      <Form onSubmit={this.handleSubmit} className="login-form">
        <Form.Item>
          <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="Username" />
        </Form.Item>
        <Form.Item>
          <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="Password" />
        </Form.Item>
        <Form.Item>
          <Checkbox>Remember me</Checkbox>
          <a className="login-form-forgot" href="">Forgot password</a>
          <Button type="primary" htmlType="submit" className="login-form-button">
            Log in
          </Button>
          Or <a href="">register now!</a>
        </Form.Item>
      </Form>
    )
  }
}

export default Register
