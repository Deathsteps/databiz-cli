import React from 'react'
import PropTypes from 'prop-types';

class Document extends React.Component {

  componentWillMount () {
    this._originDocumentStyle = document.documentElement.style
    if (this.props.documentStyle) {
      Object.assign(
        document.documentElement.style,
        this.props.documentStyle
      )
    }

    this._originBodyStyle = document.body.style
    if (this.props.bodyStyle) {
      Object.assign(
        document.body.style,
        this.props.bodyStyle
      )
    }

    if (this.props.title) {
      // TODO: change document title
    }
  }

  render () {
    return this.props.children
  }

  componentWillUnmount () {
    document.documentElement.style = this._originDocumentStyle
    document.body.style = this._originBodyStyle
  }
}

Document.propTypes = {
  children: PropTypes.element.isRequired,
  documentStyle: PropTypes.object,
  bodyStyle: PropTypes.object,
  title: PropTypes.string
}

export default Document
