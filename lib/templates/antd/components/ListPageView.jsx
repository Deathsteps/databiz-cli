// @flow
import * as React from 'react'
import _ from 'lodash'

export type ListPageProps = {
  fetching: boolean,
  totalCount: number,
  list: ?Array<*>,
  dispatch: Function,
  location: Object,
  filterParams?: Object
}
export type ListPageState = {
  filterParams: Object,
  pageIndex: number,
  pageSize: number
}

export default class ListPageView extends React.Component<ListPageProps, ListPageState> {

  constructor (props: ListPageProps) {
    super(props)
    this.state = {
      filterParams: {},
      pageIndex: 1,
      pageSize: 10
    }
    // deal with initial filter parameters
    if (this.props.filterParams) {
      let filterParams = { ...this.props.filterParams }
      this.state.pageIndex = filterParams.pageIndex
      this.state.pageSize = filterParams.pageSize
      delete filterParams.pageIndex
      delete filterParams.pageSize
      this.state.filterParams = filterParams
    }
    this.modelName = 'non'
  }

  modelName: string

  filter = (filterParams: Object): void => {
    this.setState(
      { filterParams, pageIndex: 1 },
      this.fetchList
    )
  }

  page = (pageIndex: number): void => {
    this.setState(
      { pageIndex },
      this.fetchList
    )
  }

  handlePageSizeChange = (pageIndex: number, pageSize: number): void => {
    this.setState(
      { pageIndex: 1, pageSize },
      this.fetchList
    )
  }

  // @override
  getViewHeader (): ?Object {
    return null
  }
  // @override
  getFilterType (): ?Object {
    return null
  }
  // @override
  getExtraFilterProps (): Object {
    return {}
  }
  // @override
  getDataTableType (): Object {
    return {}
  }
  // @override
  getExtraDataTableProps (): Object {
    return {}
  }
  // @override
  getExtraElements (): ?Object {
    return null
  }

  getFilter (): ?Object {
    const filterType = this.getFilterType()
    if (filterType) {
      return React.createElement(
        filterType,
        {
          onFilter: this.filter,
          ...this.getExtraFilterProps(),
          parameters: this.state.filterParams
        }
      )
    } else {
      return null
    }
  }
  getDataTable (): Object {
    return React.createElement(
      this.getDataTableType(),
      {
        fetching: this.props.fetching,
        dataSource: this.props.list,
        totalCount: this.props.totalCount,
        pageIndex: this.state.pageIndex,
        pageSize: this.state.pageSize,
        onPage: this.page,
        onPageSizeChange: this.handlePageSizeChange,
        ...this.getExtraDataTableProps()
      }
    )
  }

  render () {
    return (
      <div className="view-grey">
        {this.getViewHeader()}
        {this.getFilter()}
        {this.getDataTable()}
        {this.getExtraElements()}
      </div>
    )
  }

  componentDidMount () {
    this.fetchList()
  }

  fetchList (params: ?Object) {
    let payload = {
      ...this.state.filterParams,
      pageIndex: this.state.pageIndex,
      pageSize: this.state.pageSize
    }
    this.props.dispatch({ type: `${this.modelName}/list/request`, payload: payload })
  }

  // Helper Functions
  // XXX: URLSearchParams
  getLocationQuery (): Object {
    let querystring = this.props.location.search || ''
    if (!querystring) {
      return {}
    }
    querystring = querystring.substring(1, querystring.length)
    const queries = querystring.split('&')
    return _.fromPairs(queries.map(q => q.split('=')))
  }
}
