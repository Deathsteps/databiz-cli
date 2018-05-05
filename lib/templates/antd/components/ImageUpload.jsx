// @flow
import React from 'react'
import { Upload, Icon, Modal } from 'antd'
const Base64 = require('js-base64').Base64
// const md5 = require('blueimp-md5')

function getImageName (url: string): string {
  const items = url.split('/')
  return items[items.length - 1]
}

type ChangeParameter = {
  file: Object,
  fileList: Object[],
  event: Object
}
type Props = {
  initialFiles: Object[],
  onChange: Function
}
type State = {
  previewVisible: boolean,
  previewImage: string,
  fileList: Object[]
}
export default class ImageUpload extends React.Component<Props, State> {
  static defaultProps = {
    initialFiles: [],
    onChange: function() {}
  }

  state = {
    previewVisible: false,
    previewImage: '',
    fileList: this.buildInitialFileList(this.props.initialFiles)
  };

  handleCancel = () => this.setState({ previewVisible: false })

  handlePreview = (file: Object) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }

  handleChange = ({ fileList }: ChangeParameter) => {
    const imgs = fileList.map(
      file => ({
        id: file.imageId,
        url: file.response ? 'http://topbooking-img.b0.upaiyun.com' + file.response.url : ''
      })
    )
    this.props.onChange(imgs)
    this.setState({ fileList })
  }

  buildUploadData (file: Object): Object {
    let policy = Base64.btoa(JSON.stringify({
      'bucket'    : 'topbooking-img',
      'expiration': Date.now(),
      'save-key'  : '/baseroom/upload_{filemd5}{.suffix}'
    }))
    return {
      policy,
      // signature: md5(policy + "&" + "4HYhabAr2ac80E9phoS8d/TAhnM="),
      file
    };
  }

  buildInitialFileList (initialFiles: Object[]): Object[] {
    return initialFiles.map(item => ({
      uid: item.id,
      imageId: item.id,
      name: getImageName(item.url),
      status: 'done',
      url: item.url
    }))
  }

  componentWillReceiveProps (nextProps: Props) {
    if (this.props.initialFiles !== nextProps.initialFiles && nextProps.initialFiles) {
      this.setState({ fileList: this.buildInitialFileList(nextProps.initialFiles) })
    }
  }

  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">上传</div>
      </div>
    );
    return (
      <div className="clearfix">
        <Upload
          action="http://v0.api.upyun.com/topbooking-img/"
          listType="picture-card"
          headers={{ 'X-Requested-With': null }} // 解决跨域问题
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
          data={this.buildUploadData}
        >
          {uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="preview" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}
