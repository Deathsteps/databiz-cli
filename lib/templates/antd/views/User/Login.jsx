import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { Form, Icon, Input, Button } from 'antd'

import './Login.less'

const FIELDS_RULES = {
  username: {
    rules: [{ required: true, message: 'Please input your username!' }],
  },
  password: {
    rules: [{ required: true, message: 'Please input your password!' }]
  }
}

class Login extends React.Component {
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // this.props.history.push('/')
        let locationState = this.props.location.state
        this.props.dispatch({
          type: 'user/login/request',
          payload: {
            ...values,
            from: (locationState && locationState.from) || '/'
          }
        })
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit} className="login-form">
        <Form.Item>
          {getFieldDecorator('username', FIELDS_RULES['username'])(
            <Input prefix={<Icon type="user" />} placeholder="Username" />
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('password', FIELDS_RULES['password'])(
            <Input prefix={<Icon type="lock" />} type="password" placeholder="Password" />
          )}
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            登 入
          </Button>
        </Form.Item>
        {/* <Form.Item>
          <Button type="join">
            加 入 我 们
          </Button>
        </Form.Item> */}
      </Form>
    )
  }
}

export default connect(state => state.user)(withRouter(Form.create()(Login)))
