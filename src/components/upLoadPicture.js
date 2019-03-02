import React from 'react'
import { Upload, Icon, Form, Input, Select, Spin,Radio, Button, Modal, message, Table, Row, Col,Checkbox} from 'antd'
var util = require('./util.js');
class UploadPicture extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            previewVisible: false,
            previewImage:this.props.previewImage,
            fileList: this.props.fileList,
            loading: false,

        }
        
    }
    componentDidMount() {
        console.log(this.state.fileList)
        
    }

    convertBase64UrlToBlob = (urlData) => {

        var bytes = window.atob(urlData.split(',')[1]);        //去掉url的头，并转换为byte  

        //处理异常,将ascii码小于0的转换为大于0  
        var ab = new ArrayBuffer(bytes.length);
        var ia = new Uint8Array(ab);
        for (var i = 0; i < bytes.length; i++) {
            ia[i] = bytes.charCodeAt(i);
        }
        console.log('type:' + urlData.split(',')[0].split(':')[1].split(';')[0]);
        var type = urlData.split(',')[0].split(':')[1].split(';')[0];
        return new Blob([ab], { type: type });

    }

    imageFetch = async (url) => {
        this.setState({
            loading: true
        });
        // var doc = {
        //     pictureStream:this.convertBase64UrlToBlob(url)
        // };
        var formData = new FormData();
        formData.append('pictureStream', this.convertBase64UrlToBlob(url), "file_" + Date.parse(new Date()) + ".png");
        var data = await fetch(util.upLoadUrl, {
            method: 'POST',
            // headers: {
            //     "Content-type":"application/x-www-form-urlencoded; charset=UTF-8"
            // },
            mode: 'cors',
            body: formData
        })
            .then(function (res) {
                return res.json();
            });
        if (data.status == 1) {
            this.setState({ loading: false},()=>{
                this.props.setPicture(data.data);
            });
        }
    }
    handleChange = ({ fileList }) => {
        this.setState({ fileList }, () => {
            if(fileList.length==0){
                return ;
            }
            let thumbUrl = this.state.fileList[0].thumbUrl;
            console.log('fileList：', this.state.fileList[0]);
            if (this.state.fileList[0].percent == 100) {
                setTimeout(() => {
                    console.log('上传成功！');
                    this.imageFetch(thumbUrl);
                    return;
                }, 0)

            } else {
                console.log('上传失败！')
            }
        });

    }
    render() {
        const { previewVisible, previewImage, fileList} = this.state;
        console.log(previewImage)
        const uploadButton = (
            <div className="upLoad-center">
                <Icon type="plus" />
            </div>
        );
        return (
           
            <div>
                <Spin spinning={this.state.loading} tip="图片上传中...">
                    <div className='m-lt-upload'>
                        <Upload
                            action="//jsonplaceholder.typicode.com/posts/"
                            listType="picture-card"
                            fileList={this.state.fileList}
                            onPreview={(file)=>this.setState({
                                previewImage: file.url || file.thumbUrl,
                                previewVisible: true,
                            })}
                            onChange={this.handleChange}

                        >
                            {fileList.length >= 1 ? null : uploadButton}
                        </Upload>
                    </div>
                </Spin>
                <Modal visible={previewVisible} footer={null} onCancel={()=>this.setState({ previewVisible: false })}>
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>

            </div>
        )
    }
}


export default UploadPicture