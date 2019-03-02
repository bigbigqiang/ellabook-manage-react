import React, { PureComponent } from 'react';
import { Upload, Input, Icon, Button, Tooltip,Spin  } from 'antd';
import styles from './EllaUploader.less';
import getUrl from "../../util.js";
import './EllaUploader.css';
// import request from '../../utils/request';
// import EnglishInfo from '../../common/ellainfo';

export default class EllaUploader extends React.Component {

  state = {
    loading:false,
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
  async imageFetch(formData, onSuccess) {
    // console.log(this.props.api)
    this.setState({
      loading:true
    })
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
  deletAudio() {
    this.setState({
      preview_link: '',
      preview_modal_show: false,
    });
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

  render() {

    const father = this.props;
    const that = this;

    // 设置uploader属性
    const uploadProps = {
      // name: 'pictureStream',//这个是post参数
      name: father.name,
      accept: father.accept ? father.accept : null,
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
        console.log(ret, file)
        that.setState({
          preview_link: ret.data,
          preview_file: file,
          loading:false
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
        console.log(data);
        const formData = new FormData();
        if (data) {
          Object.keys(data).map(key => {
            formData.append(key, data[key]);
          });
        }
        formData.append(filename, file);

        that.imageFetch(formData, onSuccess);



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
      <Spin tip="音频上传中..." spinning={this.state.loading}>
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
        {/* 外面的框 */}
        {/* < div
          style={{ width: containerWidth, height: containerHeight, lineHeight: containerHeight }}
          className='UpContent'
        > */}
        <div style={{ display: `${!this.state.preview_link || father.isConfigureF ? 'block' : 'none'}` }}>
          <Upload {...uploadProps}>
            <Button >
              <Icon type="plus" className='plus' />添加{!father.isConfigureF ? '音频' : '配置文件'}
            </Button>
          </Upload>
        </div>

        <div style={{
          display: `${this.state.preview_link ? 'block' : 'none'}`,
          // backgroundImage: `url(${this.state.preview_link})`,
        }}>
          {
            this.state.preview_link && !father.isConfigureF ? <Button

            >
              <Icon
                type="check"
                className='delete'
              />已添加
            </Button> : null
          }
        </div>
        {this.state.preview_link && !father.isConfigureF ? <div className='audioBox'>
          <audio id='audio' preload="meta" width="500" height="200" className='previewImg' src={this.state.preview_link} controls name="media"></audio>
          <Input value={this.state.preview_link} />
        </div> : ""}
        {this.state.preview_link && !father.isConfigureF ? <div className='audioDelete'>
          <Tooltip placement="top" title={'点击删除已上传音频'}>
            <Icon
              className='audioDeleteIcon'
              onClick={() => {
                father.setPaging();
                this.setState({
                  preview_link: '',
                  preview_modal_show: false,
                });
                father.onChange('', false);
                father.onDelete ? father.onDelete() : '';

              }}
              type="close-circle"
              theme="filled" />
          </Tooltip>
        </div> : null}


        {/* 音频文件样式 */}
        {/* <div className='audioBox'>
          <audio preload="meta" width="500" height="300" className='previewImg' src={this.state.preview_link} controls name="media"></audio>
        </div> */}
        {/* 音频文件样式  /audio/.test(fileType)*/}


        {/* </div > */}
      </div >
      </Spin>
    );
  }
}
