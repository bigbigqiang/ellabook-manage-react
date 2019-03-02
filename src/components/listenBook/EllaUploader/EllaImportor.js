import React, { PureComponent } from 'react';
import { Upload, Button, Message } from 'antd';
import EnglishInfo from '../../common/ellainfo';
import request from '../../utils/request';

export default class EllaImportor extends PureComponent {

  state = {
    buttonLoading: false
  }

  render() {

    const father = this.props;
    const that = this;
    const meta = this.props.meta

    const uploadProps = {
      name: 'file',
      action: EnglishInfo.api + father.api, // TODO: 后期会更改
      multiple: false,
      data: meta || {},
      mode: 'cors',
      headers: {
        // "Content-Type": "application/x-www-form-urlencoded"
      },
      withCredentials: true,
      onStart(file) {
      },
      onSuccess(ret, file) {

        Message.success('文件【' + file.name + '】上传成功')

        father.onChange ? father.onChange(ret.data) : '';
        father.onSuccess ? father.onSuccess(ret.data) : '';

        setTimeout(function () {
          that.setState({
            buttonLoading: false
          })
        }, 300)

      },
      onError(err) {
        father.onError ? father.onError(err) : '';
        setTimeout(function () {
          that.setState({
            buttonLoading: false
          })
        }, 1000)
      },
      onProgress({ percent }, file) {
      },
      beforeUpload(file) {
        let err = null;
        if (err) props.beforeUpload ? props.beforeUpload('beforeUpload', err) : '';
        that.setState({
          buttonLoading: true
        })
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

            if (!res) {
              Message.error('请求失败，请检查网络，或者联系服务端人员');
              return false;
            }

            if (res.code !== '000000') {
              Message.error(res.message);
              onError(res);
              return false;
            } else {
              onSuccess(res, file);
            }

          })
          .catch(err => {
            Message.error(err);
          });

        return {
          abort() {
          },
        };
      },
    };

    return (
      <Upload {...uploadProps}>
        <Button loading={this.state.buttonLoading} type="primary">{this.props.title || '点击上传'}</Button>
      </Upload>
    );
  }
}
