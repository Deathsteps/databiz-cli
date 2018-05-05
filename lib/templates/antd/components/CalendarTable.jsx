// @flow
import React from 'react'
import moment from 'moment'
import { Table, DatePicker, Select, Button, Icon } from 'antd'
import _ from 'lodash'

import './CalendarTable.less'

const Option = Select.Option

const WEEK_TITLE = ['Sun', 'Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat']

/**
 * Wrap the column render with date injected
 * @param  {Function} render [description]
 * @param  {moment} date   [description]
 * @return {Function}        [description]
 */
function buildColumnRender (render: Function, date: moment): Function {
  const dateStr = date.format('YYYY-M-DD')
  return function (text: string, record: Object) {
    const dateItem = _.find(record.dateItems, item => item.date === dateStr)
    return render ? render(text, record, dateItem, date) : date.date()
  }
}

type Props = {
  dataSource?: Array<*>,
  loading: boolean,
  rowKey: Function,
  actions?: Object[],
  columns?: Object[],
  onDateChange?: Function,
  className?: string
}
type State = {
  startDate: moment,
  endDate: moment,
  interval: number
}
export default class CalendarTable extends React.Component<Props, State> {
  static defaultProps = {
    columns: []
  }

  state = {
    startDate: moment(moment().format('"YYYY-MM-DD"')),
    endDate: moment(moment().format('"YYYY-MM-DD"')).add(7, 'd'),
    interval: 7
  }

  buildColumns () {
    const columns = this.props.columns || []
    const dateColumnIdx = _.findIndex(columns, x => x.type === 'date')
    const preColumns = columns.slice(0, dateColumnIdx)
    const sufColumns = columns.slice(dateColumnIdx + 1, columns.length)
    // build date columns
    const { render, ...columnConfig } = columns[dateColumnIdx] || {}
    const { startDate, endDate } = this.state
    let dateColumns = []
    let date: moment = moment(startDate), dateStr = '', week = ''
    do {
      dateStr = date.format('YYYY-MM-DD')
      week = WEEK_TITLE[date.weekday()]
      dateColumns.push({
        key: dateStr,
        title: <strong className={"title-" + week.toLowerCase()}>{week}</strong>,
        render: buildColumnRender(render, moment(date)),
        ...columnConfig
      })
    } while (!date.add(1, 'd').isSame(endDate))
    return preColumns.concat(dateColumns).concat(sufColumns)
  }

  handleDateChange = (date: moment) => {
    this.setState({
      startDate: date,
      endDate: moment(date).add(this.state.interval, 'd')
    })
  }

  handleIntervalChange = (interval: number) => {
    this.setState({
      interval,
      endDate: moment(this.state.startDate).add(interval, 'd')
    })
  }

  buildTitle = () => {
    return (
      <div className="calendar-table-title">
        <div className="actions">
          {this.props.actions}
        </div>
        <div className="controller">
          <Select onChange={this.handleIntervalChange} value={this.state.interval}>
            <Option value={7}>一周</Option>
            <Option value={14}>14天</Option>
          </Select>
          <Button shape="circle"><Icon type="left" /></Button>
          <DatePicker onChange={this.handleDateChange} value={this.state.startDate} allowClear={false}/>
          <Button shape="circle"><Icon type="right" /></Button>
        </div>
      </div>
    )
  }

  render () {
    const { dataSource, loading, rowKey, className } = this.props
    return (
      <div className="calendar-table">
        <Table
          dataSource={dataSource}
          rowKey={rowKey}
          loading={loading}
          columns={this.buildColumns()}
          title={this.buildTitle}
          pagination={false}
          bordered
          className={className}
        >
        </Table>
      </div>
    )
  }
}
