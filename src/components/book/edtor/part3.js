import React from 'react';
import { Icon, Button, Row, Col, Select, DatePicker, Input, Popconfirm, message, Modal, Radio, Checkbox, Carousel, Spin, Upload, Steps } from 'antd';
import { Link } from 'react-router';
// import ClassSet from './classSet.js';
// const { MonthPicker, RangePicker } = DatePicker;
const Step = Steps.Step;
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;
import './index.css';
import getUrl from "../../util.js";
import commonData from '../../commonData.js';
export default class PriceSet extends React.Component {

    constructor() {
        super()
        this.state = {
            // 图片上传
            spinning: true,
            coverImageUrl: '',//这是封面图
            previewVisible: false,
            previewImage: '',
            fileList: [
                //默认数据
                //{
                //     uid: -1,
                //     name: 'xxx.png',
                //     status: 'done',
                //     url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
                // }
            ],

            screenshot: '',
            previewVisible2: false,
            previewImage2: '',
            fileList2: [],

            screenshot2: '',
            previewVisible3: false,
            previewImage3: '',
            fileList3: [],

            screenshot3: '',
            previewVisible4: false,
            previewImage4: '',
            fileList4: [],
            // 图片上传,
            visible:false,
            skipStep:'',
            initData:'',

        }
    }

    setOneKV(k, v) {
        this.setState({
            [k]: v
        })
    }

    componentDidMount() {
        this.fetch()
    }
    async fetch() {
        var data = await fetch(getUrl.url, {
            mode: "cors",
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: "method=ella.operation.getRelationsInfo" + "&content=" + JSON.stringify({
                "bookCode": window.location.href.split('bookCode=')[1].split('&')[0]
            }) + commonData.dataString
        }).then(res => res.json());
        console.log(data);
        // var fileList2, fileList3, fileList4;
        // data.data.bookPreviewResourceList.forEach((item, index) => {
        //     if (index == 0) {
        //         fileList2 = [
        //             {
        //                 uid: -1,
        //                 name: 'xxx.png',
        //                 status: 'done',
        //                 url: ,
        //             }
        //         ]
        //     }
        // })
        this.setState({
            fileList: data.data.bookResourceList[0] ? [
                {
                    uid: -1,
                    name: 'xxx.png',
                    status: 'done',
                    url: data.data.bookResourceList[0].ossUrl
                }
            ] : [],
            coverImageUrl: data.data.bookResourceList[0] ? data.data.bookResourceList[0].ossUrl : '',

            fileList2: data.data.bookPreviewResourceList[0] ? [
                {
                    uid: -1,
                    name: 'xxx.png',
                    status: 'done',
                    url: data.data.bookPreviewResourceList[0].ossUrl
                }
            ] : [],
            screenshot: data.data.bookPreviewResourceList[0] ? data.data.bookPreviewResourceList[0].ossUrl : '',

            fileList3: data.data.bookPreviewResourceList[1] ? [
                {
                    uid: -1,
                    name: 'xxx.png',
                    status: 'done',
                    url: data.data.bookPreviewResourceList[1].ossUrl
                }
            ] : [],
            screenshot2: data.data.bookPreviewResourceList[1] ? data.data.bookPreviewResourceList[1].ossUrl : '',

            fileList4: data.data.bookPreviewResourceList[2] ? [
                {
                    uid: -1,
                    name: 'xxx.png',
                    status: 'done',
                    url: data.data.bookPreviewResourceList[2].ossUrl
                }
            ] : [],
            screenshot3: data.data.bookPreviewResourceList[2] ? data.data.bookPreviewResourceList[2].ossUrl : '',

            spinning: false,
            initData:data.data,
        })
    }
    async submitData(saveType) {

        var submitData = {
            bookCode: window.location.href.split('bookCode=')[1].split('&')[0],
            bookPreviewResourceList: [
                // this.state.screenshot ? {
                //     "ossUrl": this.state.screenshot,
                //     "resource": "normal",
                //     "resourceType": "PREVIEW_IMG"
                // } : null,
                // this.state.screenshot2 ? {
                //     "ossUrl": this.state.screenshot2,
                //     "resource": "normal",
                //     "resourceType": "PREVIEW_IMG"
                // } : null,
                // this.state.screenshot3 ? {
                //     "ossUrl": this.state.screenshot3,
                //     "resource": "normal",
                //     "resourceType": "PREVIEW_IMG"
                // } : null
            ],
        }
        console.log(this.state.screenshot)
        if (this.state.screenshot) {
            submitData.bookPreviewResourceList.push({
                "ossUrl": this.state.screenshot,
                "resource": "normal",
                "resourceType": "PREVIEW_IMG"
            })
        }
        if (this.state.screenshot2) {
            submitData.bookPreviewResourceList.push({
                "ossUrl": this.state.screenshot2,
                "resource": "normal",
                "resourceType": "PREVIEW_IMG"
            })
        }
        if (this.state.screenshot3) {
            submitData.bookPreviewResourceList.push({
                "ossUrl": this.state.screenshot3,
                "resource": "normal",
                "resourceType": "PREVIEW_IMG"
            })
        }
        var data = await fetch(getUrl.url, {
            mode: "cors",
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: "method=ella.operation.updatePreviewResource" + "&content=" + JSON.stringify(submitData) + commonData.dataString
        }).then(res => res.json());
             if(data.status == 1){
                 message.success("保存成功！")
                this.setState({
                        visible:false,
                    
                    });
                this.fetch()
                if(saveType=="save"){
                    
                }else if(saveType=="skepsave"){
                    this.props.changePage(this.state.skipStep);
                }
             }else{
                message.error(data.message)
            }
           
    }
    ///////////////////////////////文本图片上传////////////////////////////////////////////
    handleCancel = (k) => this.setState({ [k]: false })
    handlePreview = (file, previewImage, previewVisible) => {
        this.setState({
            [previewImage]: file.url || file.thumbUrl,
            [previewVisible]: true,
        });
    }
    handleChange = ({ fileList }, k, img) => {

        console.log(k)
        this.setState({ [k]: fileList,[img]:""}, () => {
            if(fileList.length==0){
                return ;
            }
            // Blah blah
            // console.log(encodeURIComponent(this.state.fileList[0]))
            let thumbUrl = this.state[k][0].thumbUrl || null;
            // console.log('fileList：',this.state.fileList[0]);
            if (this.state[k][0].percent == 100) {
                setTimeout(() => {
                    // console.log('上传成功！');
                    this.imageFetch(thumbUrl, img);
                    return;
                }, 0)

            } else {
                // console.log('上传失败！')
            }
        });
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
    imageFetch = async (url, img) => {
        // var doc = {
        //     pictureStream:window.btoa(url)
        // };
        var formData = new FormData();
        formData.append('pictureStream', this.convertBase64UrlToBlob(url), "file_" + Date.parse(new Date()) + ".png");

        var data = await fetch(getUrl.upLoadUrl, {
            method: 'POST',
            // headers: {
            //     "Content-type":"application/x-www-form-urlencoded"
            // },
            mode: 'cors',
            body: formData
        })
            .then(function (res) {
                return res.json();
            });
        if (data.status == 1) {
            console.log(data);
            this.setState({ [img]: data.data });
        }

        // console.log(JSON.stringify(data.data));
    }
    ///////////////////////////////文本图片上传////////////////////////////////////////////
     skipStep(step){
        this.setState({
            skipStep:step
        })
      console.log((this.state))
         if(this.state.initData.bookPreviewResourceList[0]&&this.state.initData.bookPreviewResourceList[0].ossUrl!=this.state.screenshot){
            this.setState({visible:true})
            return;
         }else if(!this.state.initData.bookPreviewResourceList[0]&&this.state.screenshot!=""){
         	this.setState({visible:true})
            return;
         }
        if(this.state.initData.bookPreviewResourceList[1]&&this.state.initData.bookPreviewResourceList[1].ossUrl!=this.state.screenshot2){
            this.setState({visible:true})
            return;
         }else if(!this.state.initData.bookPreviewResourceList[1]&&this.state.screenshot2!=""){
         	this.setState({visible:true})
            return;
         }
          if(this.state.initData.bookPreviewResourceList[2]&&this.state.initData.bookPreviewResourceList[2].ossUrl!=this.state.screenshot3){
            this.setState({visible:true})
            return;
         }else if(!this.state.initData.bookPreviewResourceList[2]&&this.state.screenshot3!=""){
         	this.setState({visible:true})
            return;
         }
        this.props.changePage(step);

    }
    modalClick(type){
       
        if(type=="leave"){
            
           this.fetch()
            //不保存，直接离开
          	this.setState({visible:false},()=>{
            	this.props.changePage(this.state.skipStep);
            });
          
        }else if(type=="save"){
            this.setState({visible:false},()=>{
            	this.submitData("skepsave");
            });
            
        }
       
    }
    render() {
        const { previewVisible, previewImage, fileList, previewVisible2, previewImage2, fileList2, previewVisible3, previewImage3, fileList3, previewVisible4, previewImage4, fileList4 } = this.state;
        const uploadButton = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        console.log(this.state)
        return <Spin spinning={this.state.spinning}>
            <div className="bookPart">
                <Row className='row'>
                    <Col span={8} offset={0} className="ant-form-item-required" style={{fontSize: '20px', fontWeight: 'bold'}}>图书封面上传:</Col>
                    
                </Row>
                <Row className='row'>
                    <Col span={10} offset={3}>
                        <Upload
                            disabled
                            className="Imgcover"
                            accept=".jpg,.png,.webp,.bmp,.tiff,.gif,.jpeg"
                            action="//jsonplaceholder.typicode.com/posts/"
                            listType="picture-card"
                            fileList={fileList}
                            onPreview={(file) => { this.handlePreview(file, "previewImage", "previewVisible") }}
                            onChange={({ fileList }) => { this.handleChange({ fileList }, "fileList", "coverImageUrl") }}
                            onRemove={
                                false
                                // () => { this.setState({ coverImageUrl: "" }) }
                            }
                        >
                            {fileList.length >= 1 ? null : uploadButton}
                        </Upload>
                        <Modal visible={previewVisible} footer={null} onCancel={() => { this.handleCancel("previewVisible") }}>
                            <img alt="example" style={{ width: '100%' }} src={previewImage} />
                        </Modal>
                    </Col>
                </Row>
                <Row className='row'>
                    <Col style={{ fontSize: '20px', fontWeight: 'bold' }} span={8} offset={0}>截图上传:</Col>
                </Row>
                <Row className='row screenshot'>
                    <Col span={5} offset={3}>
                        <Upload
                            accept=".jpg,.png,.webp,.bmp,.tiff,.gif,.jpeg"
                            action="//jsonplaceholder.typicode.com/posts/"
                            listType="picture-card"
                            fileList={fileList2}
                            onPreview={(file) => { this.handlePreview(file, "previewImage2", "previewVisible2") }}
                            onChange={({ fileList }) => { this.handleChange({ fileList }, "fileList2", "screenshot") }}
                            onRemove={() => { this.setState({ screenshot: "" }) }}
                        >
                            {fileList2.length >= 1 ? null : uploadButton}
                        </Upload>
                        <Modal visible={previewVisible2} footer={null} onCancel={() => { this.handleCancel("previewVisible2") }}>
                            <img alt="example" style={{ width: '100%' }} src={previewImage2} />
                        </Modal>
                    </Col>
                    <Col span={5} offset={2}>
                        <Upload
                            disabled={this.state.screenshot == '' && this.state.screenshot2 == '' ? true : false}
                            style={{ backgroundColor: this.state.screenshot == '' && this.state.screenshot2 == '' ? '#ddd' : 'white' }}
                            accept=".jpg,.png,.webp,.bmp,.tiff,.gif,.jpeg"
                            action="//jsonplaceholder.typicode.com/posts/"
                            listType="picture-card"
                            fileList={fileList3}
                            onPreview={(file) => { this.handlePreview(file, "previewImage3", "previewVisible3") }}
                            onChange={({ fileList }) => { this.handleChange({ fileList }, "fileList3", "screenshot2") }}
                            onRemove={() => { this.setState({ screenshot2: "" }) }}
                        >
                            {fileList3.length >= 1 ? null : uploadButton}
                        </Upload>
                        <Modal visible={previewVisible3} footer={null} onCancel={() => { this.handleCancel("previewVisible3") }}>
                            <img alt="example" style={{ width: '100%' }} src={previewImage3} />
                        </Modal>
                    </Col>
                    <Col span={5} offset={2}>
                        <Upload
                            disabled={(this.state.screenshot == '' || this.state.screenshot2 == '') && this.state.screenshot3 == '' ? true : false}
                            style={{ backgroundColor: (this.state.screenshot == '' || this.state.screenshot2 == '') && this.state.screenshot3 == '' ? '#ddd' : 'white' }}
                            accept=".jpg,.png,.webp,.bmp,.tiff,.gif,.jpeg"
                            action="//jsonplaceholder.typicode.com/posts/"
                            listType="picture-card"
                            fileList={fileList4}
                            onPreview={(file) => { this.handlePreview(file, "previewImage4", "previewVisible4") }}
                            onChange={({ fileList }) => { this.handleChange({ fileList }, "fileList4", "screenshot3") }}
                            onRemove={() => { this.setState({ screenshot3: "" }) }}
                        >
                            {fileList4.length >= 1 ? null : uploadButton}
                        </Upload>
                        <Modal visible={previewVisible4} footer={null} onCancel={() => { this.handleCancel("previewVisible4") }}>
                            <img alt="example" style={{ width: '100%' }} src={previewImage4} />
                        </Modal>
                    </Col>
                </Row>
                <Row className='row' style={{ marginTop: '200px' }}>
                    <Col span={4} offset={6}>
                        <Button onClick={() => { this.skipStep(1) }} type='primary' style={{ width: 120 }}>上一步</Button>
                    </Col>
                    <Col span={4} offset={1}>
                        <Button onClick={() => { this.submitData("save") }} type='primary' style={{ width: 120 }}>保存</Button>
                    </Col>
                    <Col span={4} offset={1}>
                        <Button onClick={() => { this.skipStep(3) }} type='primary' style={{ width: 120 }}>下一步</Button>
                    </Col>
                </Row>
                 <Modal
			          	title="保存确认"
			          	visible={this.state.visible}
			          	onOk={this.handleOk}
			          	onCancel={()=>this.setState({visible:false})}
			          	footer={null}
			        >
                        <h5 style={{"text-align":"center","font-size":"16px"}}>您已修改了该页面的信息，请确认是否保存？</h5>
                        <p style={{"text-align":"center","marginBottom":"30px"}}>
                            <Icon type="warning" theme="filled" style={{"marginRight":"3px"}} />
                            <span>所有必填信息填写完全才可保存</span>
                        </p>
			          	<div style={{"text-align":"center"}}>
	                        <Button className="buttonWidth intervalRight" onClick={()=>this.modalClick("leave")}>离开</Button>
	                        <Button className="buttonWidth" onClick={()=>this.modalClick("save")}>保存</Button>
                        </div>
			        </Modal>
            </div>
        </Spin>
    }
}