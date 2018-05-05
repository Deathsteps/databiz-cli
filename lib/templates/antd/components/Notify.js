// @flow
import { notification } from 'antd'

type MessageConfig = { success: string, failure: string }

export default class Notify {

  static action_messages = {
    edit: {
      success: '保存成功',
      failure: '保存失败'
    },
    delete: {
      success: '删除成功',
      failure: '删除失败'
    },
    other: {
      success: '操作成功',
      failure: '操作失败'
    }
  }
  static registerActionMessage = (actionName: string, message: MessageConfig) => {
    Notify.action_messages[actionName] = message
  }

  owner: Object
  actions: Array<string>

  constructor(component: Object, actions: Array<string> | string) {
    this.owner = component
    this.actions = typeof actions === 'string' ? [actions] : actions
  }

  notify (nextProps: Object) {
    const props = this.owner.props
    this.actions.forEach(actionName => {
      const resultName = actionName + 'Result'
      const errName = actionName + 'Err'
      const messages = Notify.action_messages[actionName] || Notify.action_messages.other
      if (props[resultName] !== nextProps[resultName] && nextProps[resultName]) {
        notification.info({
          message: messages.success
        })
      } else if (props[errName] !== nextProps[errName] && nextProps[errName]) {
        notification.error({
          message: messages.failure,
          description: '失败原因：' + nextProps[errName].message,
        })
      }
    })
  }
}
