import React, { PureComponent } from 'react';
import { Upload, Input, Icon, message } from 'antd';
import styles from './EllaUploader2.less';
// import request from '../../utils/request';
// import EnglishInfo from '../../common/ellainfo';
export default class EllaUploader extends PureComponent {

  state = {
    preview_link: '',
    preview_file: null,
    preview_modal_show: false,
  };

  componentDidMount() {
    if (this.props.initialValue) {
      this.setState({
        preview_link: this.props.initialValue
      }, () => {
        // this.props.initialValue = this.state.preview_link
        // TODO: arg2 isInitialize
        this.props.onChange(this.state.preview_link, true)
      })
    }

  }

  componentWillReceiveProps(newProps) {
    if (newProps.initialValue !== this.props.initialValue) {
      this.setState({
        preview_link: newProps.initialValue
      }, () => {
        // this.props.initialValue = this.state.preview_link
        this.props.onChange(this.state.preview_link, true)
      })
    }
  }
  async imageFetch(formData, onSuccess) {
    // console.log(this.props.api)
    var data = await fetch(this.props.api, {
      method: 'POST',
      // headers: {
      //     "Content-type":"application/x-www-form-urlencoded"
      // },
      mode: 'cors',
      body: formData
    })
      .then(res => {
        return res.json();
      })
    onSuccess(data);
    // this.setState({
    //     defaultData: {
    //         ...this.state.defaultData,
    //         channel: data.data
    //     }

    // })
  }
  render() {

    const father = this.props;
    const that = this;

    // 设置uploader属性
    const uploadProps = {
      name: father.name,
      action: 'http://dev.ellabook.cn/rest/upload/avatar',
      multiple: false,
      data: {},
      mode: 'cors',
      headers: {
        // "Content-Type": "application/x-www-form-urlencoded"
      },
      withCredentials: true,
      onStart(file) {
      },
      onSuccess(ret, file) {
        that.setState({
          preview_link: ret.data,
          preview_file: file,
        });
        father.onChange(ret.data, false, file)
        father.callback ? father.callback(ret.data, file) : '';
      },
      onError(err) {
      },
      onProgress({ percent }, file) {
      },
      beforeUpload(file) {
        let err = null;
        if (err) props.beforeUpload ? props.beforeUpload('beforeUpload', err) : '';
      },
      customRequest({
        action,
        data,
        file,
        filename,
        headers,
        onError,
        onProgress,
        onSuccess,
        withCredentials,
      }) {
        const formData = new FormData();
        if (data) {
          Object.keys(data).map(key => {
            formData.append(key, data[key]);
          });
        }
        formData.append(filename, file);
        that.imageFetch(formData, onSuccess);
        // request(action, {
        //   method: 'POST',
        //   mode: 'cors',
        //   body: formData,
        // })
        //   .then(res => {
        //     onSuccess(res);
        //   })
        //   .catch(err => {
        //     onError(err);
        //   });

        return {
          abort() {
          },
        };
      },
    };

    // 设置组件显示尺寸
    let containerWidth = (this.props.width && this.props.width > 60 ? this.props.width : 60) + 'px';
    let containerHeight = (this.props.height && this.props.height > 60 ? this.props.height : 60) + 'px';

    // 获取文件类型
    // 来源于刚上传的file文件
    // 或者来源于组件的previewType属性
    // 或者 默认为 image
    // let fileType = _.get(this.state.preview_file, 'type', undefined) || father.fileType || 'image'
    let fileType = (this.state.preview_file ? this.state.preview_file.type : undefined) || father.fileType || 'image';

    // 处理预览缩略图
    // if (father.fileType === 'video' && this.state.preview_link) {
    //   var video = document.createElement('video');
    //   video.src = this.state.preview_link;
    //   // video.setAttribute('crossOrigin', 'anonymous');
    //   video.addEventListener('loadeddata', function () {
    //     var canvas = document.createElement('canvas');
    //     canvas.width = video.videoWidth;
    //     canvas.height = video.videoHeight;

    //     canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
    //   });
    // }

    return (
      <div className='Uploader' style={father.style} >
        {
          father.label ? (
            <label className='Uplabel' title={father.label}>
              {father.label + '：'}
            </label>
          ) : (
              ''
            )
        }
        < div
          style={{ width: containerWidth, height: containerHeight, lineHeight: containerHeight }}
          className='UpContent'
        >
          <div style={{ display: `${!this.state.preview_link ? 'inline-block' : 'none'}` }}>
            <Upload {...uploadProps}>
              <Icon type="plus" className='plus' />
            </Upload>
          </div>
          <div
            style={{
              display: `${this.state.preview_link ? 'inline-block' : 'none'}`,
              backgroundImage: `url(${this.state.preview_link})`,
            }}
          >
            <Icon
              type="eye-o"
              className='eye'
              onClick={() => {
                this.setState({
                  preview_modal_show: true,
                });
              }}
            />
            <Icon
              type="delete"
              className='delete'
              onClick={() => {
                if (!father.isDelete) {
                  message.warning('已经关联图书,不允许替换封面!')
                  return;
                }
                this.setState({
                  preview_link: '',
                  preview_modal_show: false,
                });
                father.onChange('', false);
                father.onDelete ? father.onDelete() : '';

              }}
            />
            <div className='mask' />

            <div
              className='preview'
              style={{ display: `${this.state.preview_modal_show ? 'block' : 'none'}`, transition: 'all 0.2s' }}
              onClick={() => {
                let videoArr = document.querySelectorAll('video');
                videoArr.forEach(item => {
                  item.pause();
                })
                this.setState({
                  preview_modal_show: false,
                });
              }}
            >
              {/image/.test(fileType) ?
                <img
                  className='previewImg'
                  src={this.state.preview_link}
                /> : ''
              }
              {/video/.test(fileType) ?
                <video preload="meta" width="500" height="300" className='previewImg' src={this.state.preview_link} controls name="media" /> : ''
              }
            </div>
          </div>
        </div >
      </div >
    );
  }
}
