import React, { PureComponent } from 'react';
import { Upload, Input, Icon } from 'antd';
import styles from './EllaFileUploader.less';
import request from '../../utils/request';
import EnglishInfo from '../../common/ellainfo';
export default class EllaFileUploader extends PureComponent {

  state = {
    preview_link: '',
    preview_modal_show: false,
  };

  componentDidMount() {
    if (this.props.initialValue) {
      this.setState({
        preview_link: this.props.initialValue
      }, () => {
        this.props.onChange(this.state.preview_link)
      })
    }
  }

  componentWillReceiveProps(newProps) {
    if (newProps.initialValue !== this.props.initialValue) {
      this.setState({
        preview_link: newProps.initialValue
      }, () => {
        this.props.onChange(this.state.preview_link)
      })
    }
  }

  render() {

    const father = this.props;
    const that = this;

    const uploadProps = {
      name: 'file',
      action: EnglishInfo.api + '/en/oss/upload/v1', // TODO: 后期会更改
      multiple: false,
      data: { a: 1, b: 2 },
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
        });
        father.onChange(ret.data)
        father.onSuccess ? father.onSuccess(ret.data) : '';
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

        request(action, {
          method: 'POST',
          mode: 'cors',
          body: formData,
        })
          .then(res => {
            onSuccess(res);
          })
          .catch(err => {
            onError(err);
          });

        return {
          abort() {
          },
        };
      },
    };

    return (
      <div className={styles.Uploader} style={father.style}>
        {father.label ? (
          <label className={styles.Uplabel} title={father.label}>
            {father.label + '：'}
          </label>
        ) : ('')}
        <div className={styles.UpContent}>
          <div style={{ display: `${!this.state.preview_link ? 'inline-block' : 'none'}` }}>
            <Upload {...uploadProps}>
              点击上传
            </Upload>
          </div>
          <div
            style={{ display: `${this.state.preview_link ? 'inline-block' : 'none'}` }}
          >
            <Icon
              type="eye-o"
              className={styles.eye}
              onClick={() => {
                this.setState({
                  preview_modal_show: true,
                });
              }}
            />
            <Icon
              type="delete"
              className={styles.delete}
              onClick={() => {
                this.setState({
                  preview_link: '',
                  preview_modal_show: false,
                });
                father.onChange('');
                father.onDelete ? father.onDelete() : '';
              }}
            />
            <div className={styles.mask} />
            <div
              className={styles.preview}
              style={{ display: `${this.state.preview_modal_show ? 'block' : 'none'}`, transition: 'all 0.2s' }}
              onClick={() => {
                this.setState({
                  preview_modal_show: false,
                });
              }}
            >
              <div className={styles.previewDiv}>
                {this.state.preview_link}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
