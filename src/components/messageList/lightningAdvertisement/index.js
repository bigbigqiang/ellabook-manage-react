import React from 'react';
import { Row, Col, Card, Icon, Input, Select, Radio, DatePicker, Button, Modal, Table, Divider, Upload, Spin, message } from "antd";
import { Link } from 'react-router';
import './index.css';
import getUrl from '../../util.js';
import commonData from '../../commonData.js';
import Target from './target.js'
// import Submit from './submit.js';
// import Target from './target.js';
const { MonthPicker, RangePicker } = DatePicker;
const RadioGroup = Radio.Group;
const Option = Select.Option;
const { TextArea } = Input;
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
export default class addGoods extends React.Component {

    constructor(props) {
        super()
        this.state = {
            spinning: true,
            key: 1,
            // TODO: attach资源在提交的时候整合
            startupCode: '',                 //编码可以用来判断是编辑还是新增
            adviceType: 'STARTUP_AD',
            adviceName: '',                 //通知名称
            adviceDescription: '',          //通知描述
            pushTarget: '',                 //目标用户
            targetContent: '',               //单个用户id
            pushTimeType: 'SEND_ONTIME',               //推送时间类型
            startTime: '',
            endTime: '',
            countDown: '',                  //倒计时
            pushFrequency: 'EVERY_TIME_PUSH',//TODO:目前写死的东西
            pushTimes: 0,


            targetType: '',
            targetPage: {},


            ipad: '',
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

            iphoneX: '',
            previewVisible2: false,
            previewImage2: '',
            fileList2: [],

            iphonePlus: '',
            previewVisible3: false,
            previewImage3: '',
            fileList3: [],

            iphone: '',
            previewVisible4: false,
            previewImage4: '',
            fileList4: [],

            iphoneSE: '',
            previewVisible5: false,
            previewImage5: '',
            fileList5: [],

            android_normal: '',
            previewVisible6: false,
            previewImage6: '',
            fileList6: [],

            android_special_infinity_002: '',
            previewVisible7: false,
            previewImage7: '',
            fileList7: [],

            android_normal_infinity: '',
            previewVisible8: false,
            previewImage8: '',
            fileList8: [],

            android_special_infinity_001: '',
            previewVisible9: false,
            previewImage9: '',
            fileList9: [],

            ipad_horizontal: '',
            previewVisible10: false,
            previewImage10: '',
            fileList10: [],
        }
    }
    setOneKV(k, v) {
        this.setState({
            [k]: v
        })
    }
    componentDidMount() {
        this.fetchList('ADVICE_DESC', 'adviceDescriptionList');
        this.fetchList('PUSH_TARGET', 'pushTargetList');
        // TODO:写到这里拉取默认数据
        if (this.props.params.ope == 'updata') this.getDefaultData(this.props.params.adviceCode);
    }
    // TODO:获取资源 
    // getAttach(attach, str1, str2, str3, str4, str5, str6, str7, str8, str9) {
    //     var obj = {};
    //     var idx = 2
    //     do {
    //         obj[arguments[idx - 1]] = arguments[0].find(n => n.attachName == arguments[idx - 1]).attachUrl;
    //         if (idx == 2) {

    //             obj['fileList'] = [
    //                 {
    //                     uid: -1,
    //                     name: 'xxx.png',
    //                     status: 'done',
    //                     url: arguments[0].find(n => n.attachName == arguments[idx - 1]).attachUrl,
    //                 }
    //             ];
    //         } else {
    //             obj['fileList' + (idx - 1)] = [
    //                 {
    //                     uid: -1,
    //                     name: 'xxx.png',
    //                     status: 'done',
    //                     url: arguments[0].find(n => n.attachName == arguments[idx - 1]).attachUrl,
    //                 }
    //             ];
    //         }
    //         idx++
    //     } while (idx != 11)
    //     return obj
    // }
    // TODO:拉取默认数据
    async getDefaultData(adviceCode) {
        var doc = {
            adviceType: 'STARTUP_AD',
            adviceCode,
        }
        var data = await fetch(getUrl.url, {
            mode: "cors",
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: "method=ella.operation.getAdviceInfo" + "&content=" + JSON.stringify(doc) + commonData.dataString
        }).then(res => res.json());
        console.log('默认数据2');
        console.log(data);
        // console.log(this.getAttach(data.data.attachList, 'ipad', 'iphoneX', 'iphonePlus', 'iphone', 'iphoneSE', 'android_normal', 'android_special_infinity_002', 'android_normal_infinity', 'android_special_infinity_001'))
        this.setState({
            startupCode: adviceCode,
            adviceName: data.data.adviceName,
            adviceDescription: data.data.adviceDescription,
            pushTarget: data.data.pushTarget,
            targetContent: data.data.targetContent,
            pushTimeType: data.data.pushTimeType,
            startTime: data.data.startTime,
            endTime: data.data.endTime,
            // ...this.getAttach(data.data.attachList, 'ipad', 'iphoneX', 'iphonePlus', 'iphone', 'iphoneSE', 'android_normal', 'android_special_infinity_002', 'android_normal_infinity', 'android_special_infinity_001'),
            countDown: data.data.countDown + '',
            targetType: data.data.targetType,
            targetPage: data.data.targetPage,
            // TODO:资源
            ipad: (data.data.attachList.find(n => n.attachName == 'ipad') || {}).attachUrl || '',
            fileList: data.data.attachList.find(n => n.attachName == 'ipad') ? [
                {
                    uid: -1,
                    name: 'xxx.png',
                    status: 'done',
                    url: (data.data.attachList.find(n => n.attachName == 'ipad') || {}).attachUrl || '',
                }
            ] : [],

            iphoneX: (data.data.attachList.find(n => n.attachName == 'iphoneX') || {}).attachUrl || '',
            fileList2: data.data.attachList.find(n => n.attachName == 'iphoneX') ? [
                {
                    uid: -1,
                    name: 'xxx.png',
                    status: 'done',
                    url: (data.data.attachList.find(n => n.attachName == 'iphoneX') || {}).attachUrl || '',
                }
            ] : [],

            iphonePlus: (data.data.attachList.find(n => n.attachName == 'iphonePlus') || {}).attachUrl || '',
            fileList3: data.data.attachList.find(n => n.attachName == 'iphonePlus') ? [
                {
                    uid: -1,
                    name: 'xxx.png',
                    status: 'done',
                    url: (data.data.attachList.find(n => n.attachName == 'iphonePlus') || {}).attachUrl || '',
                }
            ] : [],

            iphone: (data.data.attachList.find(n => n.attachName == 'iphone') || {}).attachUrl || '',
            fileList4: data.data.attachList.find(n => n.attachName == 'iphone') ? [
                {
                    uid: -1,
                    name: 'xxx.png',
                    status: 'done',
                    url: (data.data.attachList.find(n => n.attachName == 'iphone') || {}).attachUrl || '',
                }
            ] : [],

            iphoneSE: (data.data.attachList.find(n => n.attachName == 'iphoneSE') || {}).attachUrl || '',
            fileList5: data.data.attachList.find(n => n.attachName == 'iphoneSE') ? [
                {
                    uid: -1,
                    name: 'xxx.png',
                    status: 'done',
                    url: (data.data.attachList.find(n => n.attachName == 'iphoneSE') || {}).attachUrl || '',
                }
            ] : [],

            android_normal: (data.data.attachList.find(n => n.attachName == 'android_normal') || {}).attachUrl || '',
            fileList6: data.data.attachList.find(n => n.attachName == 'android_normal') ? [
                {
                    uid: -1,
                    name: 'xxx.png',
                    status: 'done',
                    url: (data.data.attachList.find(n => n.attachName == 'android_normal') || {}).attachUrl || '',
                }
            ] : [],

            android_special_infinity_002: (data.data.attachList.find(n => n.attachName == 'android_special_infinity_002') || {}).attachUrl || '',
            fileList7: data.data.attachList.find(n => n.attachName == 'android_special_infinity_002') ? [
                {
                    uid: -1,
                    name: 'xxx.png',
                    status: 'done',
                    url: (data.data.attachList.find(n => n.attachName == 'android_special_infinity_002') || {}).attachUrl || '',
                }
            ] : [],

            android_normal_infinity: (data.data.attachList.find(n => n.attachName == 'android_normal_infinity') || {}).attachUrl || '',
            fileList8: data.data.attachList.find(n => n.attachName == 'android_normal_infinity') ? [
                {
                    uid: -1,
                    name: 'xxx.png',
                    status: 'done',
                    url: (data.data.attachList.find(n => n.attachName == 'android_normal_infinity') || {}).attachUrl || '',
                }
            ] : [],

            android_special_infinity_001: (data.data.attachList.find(n => n.attachName == 'android_special_infinity_001') || {}).attachUrl || '',
            fileList9: data.data.attachList.find(n => n.attachName == 'android_special_infinity_001') ? [
                {
                    uid: -1,
                    name: 'xxx.png',
                    status: 'done',
                    url: (data.data.attachList.find(n => n.attachName == 'android_special_infinity_001') || {}).attachUrl || '',
                }
            ] : [],

            ipad_horizontal: (data.data.attachList.find(n => n.attachName == 'ipad_horizontal') || {}).attachUrl || '',
            fileList10: data.data.attachList.find(n => n.attachName == 'ipad_horizontal') ? [
                {
                    uid: -1,
                    name: 'xxx.png',
                    status: 'done',
                    url: (data.data.attachList.find(n => n.attachName == 'ipad_horizontal') || {}).attachUrl || '',
                }
            ] : [],
        }, () => {
            this.setState({
                key: 2,
                spinning: false
            })
        })

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
        this.setState({ [k]: fileList,[img]:"" }, () => {
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
    async fetchList(str, v) {

        var data = await fetch(getUrl.url, {
            mode: "cors",
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: "method=ella.operation.boxSearchList" + "&content=" + JSON.stringify({ groupId: str }) + commonData.dataString
        }).then(res => res.json())
        console.log(data)
        var adviceDescriptionList = data.data.map(item => <Option value={item.searchCode}>{item.searchName}</Option>)
        this.setOneKV(v, adviceDescriptionList)
    }
    render() {
        console.log(this.state)
        const { previewVisible,
            previewImage,
            fileList,
            previewVisible1,
            previewImage1,
            fileList1,
            previewVisible2,
            previewImage2,
            fileList2,
            previewVisible3,
            previewImage3,
            fileList3,
            previewVisible4,
            previewImage4,
            fileList4,
            previewVisible5,
            previewImage5,
            fileList5,
            previewVisible6,
            previewImage6,
            fileList6,
            previewVisible7,
            previewImage7,
            fileList7,
            previewVisible8,
            previewImage8,
            fileList8,
            previewVisible9,
            previewImage9,
            fileList9, 
            previewVisible10,
            previewImage10,
            fileList10,
        } = this.state;
        const uploadButton = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        return <Spin tip="数据加载中..." spinning={this.props.params.ope == "add" ? false : this.state.spinning}>
            <div id='advertisement'>
                <h2 className='title' >
                    <Link style={{ color: '#666' }} to='/messageList/back/STARTUP_AD'><Icon type="left" />{`${this.props.params.ope == 'add' ? '添加' : '编辑'}闪屏广告`}</Link>
                </h2>
                <div className='box'>
                    <Row className='row'>
                        <Col className="small_subTitle" offset={1} span={2}>通知名称:</Col>
                        <Col span={4}>
                            <Input
                                onBlur={(e) => {
                                    if (e.target.value.length > 20) {
                                        message.error('通知名称长度过长');
                                    }
                                }}
                                value={this.state.adviceName}
                                style={{ width: "100%" }}
                                onChange={(e) => { this.setOneKV('adviceName', e.target.value) }} />
                        </Col>
                        <Col className="small_subTitle" offset={2} span={2}>通知描述:</Col>
                        <Col span={2}>
                            <Select value={this.state.adviceDescription} style={{ width: 120 }} onChange={(v) => { this.setOneKV('adviceDescription', v) }}>
                                {
                                    this.state.adviceDescriptionList
                                }
                            </Select>
                        </Col>
                    </Row>

                    <Row className='row'>
                        <Col className="small_subTitle" offset={1} span={2}>目标用户:</Col>
                        <Col span={4}>
                            <Select value={this.state.pushTarget} style={{ width: 120 }} onChange={(v) => { this.setOneKV('pushTarget', v) }}>
                                {
                                    this.state.pushTargetList
                                }
                            </Select>
                        </Col>
                        {
                            this.state.pushTarget == 'SINGLE_USER'
                                ?
                                <Col offset={1} span={6}>
                                    <Input placeholder='请输入用户uid' value={this.state.targetContent} onChange={(e) => { this.setOneKV('targetContent', e.target.value) }} />
                                </Col>
                                :
                                null
                        }
                    </Row>

                    <Row className='row'>
                        <Col className="small_subTitle" offset={1} span={2}>推送时间:</Col>

                        {/* <Col span={6}>
                        <RadioGroup style={{ width: '100%' }} onChange={(e) => { this.setOneKV('pushTimeType', e.target.value) }} value={this.state.pushTimeType}>
                            <Radio className='radioStyle' value={'SEND_NOW'}>
                                立即推送
                            </Radio>
                            <Radio className='radioStyle' value={'SEND_ONTIME'}>
                                定时推送
                            </Radio>
                        </RadioGroup>
                    </Col> */}

                        <Col span={4}>
                            <DatePicker
                                style={{ width: "100%" }}
                                showTime={{ format: 'HH:mm:ss' }}
                                format="YYYY-MM-DD HH:mm:ss"
                                placeholder={['开始时间']}
                                onChange={(value, dateString) => { this.setOneKV('startTime', dateString) }}
                                value={this.state.startTime ? moment(this.state.startTime, 'YYYY-MM-DD HH:mm:ss') : this.state.startTime}
                            />
                        </Col>

                        <Col style={{ textAlign: 'center' }} className="small_subTitle" offset={1} span={1}>到</Col>

                        <Col offset={1} span={4}>
                            <DatePicker
                                style={{ width: "100%" }}
                                showTime={{ format: 'HH:mm:ss' }}
                                format="YYYY-MM-DD HH:mm:ss"
                                placeholder={['结束时间']}
                                onChange={(value, dateString) => { this.setOneKV('endTime', dateString) }}
                                value={this.state.endTime ? moment(this.state.endTime, 'YYYY-MM-DD HH:mm:ss') : this.state.endTime}
                            />
                        </Col>
                    </Row>
                    <Divider />
                    <Row className='row'>
                        <Col className="small_subTitle" offset={1} span={4}>
                            <p>ipad:</p>
                            <p>2048px*2732px</p>
                        </Col>
                        <Col span={3}>
                            <div className="clearfix">
                                <Upload
                                    action="//jsonplaceholder.typicode.com/posts/"
                                    listType="picture-card"
                                    fileList={fileList}
                                    onPreview={(file) => { this.handlePreview(file, "previewImage", "previewVisible") }}
                                    onChange={({ fileList }) => { this.handleChange({ fileList }, "fileList", "ipad") }}
                                    onRemove={() => { this.setState({ ipad: "" }) }}
                                >
                                    {fileList.length >= 1 ? null : uploadButton}
                                </Upload>
                                <Modal visible={previewVisible} footer={null} onCancel={() => { this.handleCancel("previewVisible") }}>
                                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                                </Modal>
                            </div>
                        </Col>

                        <Col className="small_subTitle" offset={1} span={4}>
                            <p>iphone X:</p>
                            <p>1125px*2436px</p>

                        </Col>
                        <Col span={3}>
                            <div className="clearfix">
                                <Upload
                                    action="//jsonplaceholder.typicode.com/posts/"
                                    listType="picture-card"
                                    fileList={fileList2}
                                    onPreview={(file) => { this.handlePreview(file, "previewImage2", "previewVisible2") }}
                                    onChange={({ fileList }) => { this.handleChange({ fileList }, "fileList2", "iphoneX") }}
                                    onRemove={() => { this.setState({ iphoneX: "" }) }}
                                >
                                    {fileList2.length >= 1 ? null : uploadButton}
                                </Upload>
                                <Modal visible={previewVisible2} footer={null} onCancel={() => { this.handleCancel("previewVisible2") }}>
                                    <img alt="example" style={{ width: '100%' }} src={previewImage2} />
                                </Modal>
                            </div>
                        </Col>

                        <Col className="small_subTitle" offset={1} span={4}>
                            <p>iphone(6s/7/8)plus:</p>
                            <p>1242px*2208px</p>
                        </Col>
                        <Col span={3}>
                            <div className="clearfix">
                                <Upload
                                    action="//jsonplaceholder.typicode.com/posts/"
                                    listType="picture-card"
                                    fileList={fileList3}
                                    onPreview={(file) => { this.handlePreview(file, "previewImage3", "previewVisible3") }}
                                    onChange={({ fileList }) => { this.handleChange({ fileList }, "fileList3", "iphonePlus") }}
                                    onRemove={() => { this.setState({ iphonePlus: "" }) }}
                                >
                                    {fileList3.length >= 1 ? null : uploadButton}
                                </Upload>
                                <Modal visible={previewVisible3} footer={null} onCancel={() => { this.handleCancel("previewVisible3") }}>
                                    <img alt="example" style={{ width: '100%' }} src={previewImage3} />
                                </Modal>
                            </div>
                        </Col>
                    </Row>
                    <Row className='row'>
                        <Col className="small_subTitle" offset={1} span={4}>
                            <p>iphone(6s/7/8):</p>
                            <p>750px*1334px</p>
                        </Col>
                        <Col span={3}>
                            <div className="clearfix">
                                <Upload
                                    action="//jsonplaceholder.typicode.com/posts/"
                                    listType="picture-card"
                                    fileList={fileList4}
                                    onPreview={(file) => { this.handlePreview(file, "previewImage4", "previewVisible4") }}
                                    onChange={({ fileList }) => { this.handleChange({ fileList }, "fileList4", "iphone") }}
                                    onRemove={() => { this.setState({ iphone: "" }) }}
                                >
                                    {fileList4.length >= 1 ? null : uploadButton}
                                </Upload>
                                <Modal visible={previewVisible4} footer={null} onCancel={() => { this.handleCancel("previewVisible4") }}>
                                    <img alt="example" style={{ width: '100%' }} src={previewImage4} />
                                </Modal>
                            </div>
                        </Col>

                        <Col className="small_subTitle" offset={1} span={4}>
                            <p>iphoneSE:</p>
                            <p>640px*1136px</p>
                        </Col>
                        <Col span={3}>
                            <div className="clearfix">
                                <Upload
                                    action="//jsonplaceholder.typicode.com/posts/"
                                    listType="picture-card"
                                    fileList={fileList5}
                                    onPreview={(file) => { this.handlePreview(file, "previewImage5", "previewVisible5") }}
                                    onChange={({ fileList }) => { this.handleChange({ fileList }, "fileList5", "iphoneSE") }}
                                    onRemove={() => { this.setState({ iphoneSE: "" }) }}
                                >
                                    {fileList5.length >= 1 ? null : uploadButton}
                                </Upload>
                                <Modal visible={previewVisible5} footer={null} onCancel={() => { this.handleCancel("previewVisible5") }}>
                                    <img alt="example" style={{ width: '100%' }} src={previewImage5} />
                                </Modal>
                            </div>
                        </Col>

                        <Col className="small_subTitle" offset={1} span={4}>
                            <p>Android(16:9):</p>
                            <p>1590px*1080px</p>
                        </Col>
                        <Col span={3}>
                            <div className="clearfix">
                                <Upload
                                    action="//jsonplaceholder.typicode.com/posts/"
                                    listType="picture-card"
                                    fileList={fileList6}
                                    onPreview={(file) => { this.handlePreview(file, "previewImage6", "previewVisible6") }}
                                    onChange={({ fileList }) => { this.handleChange({ fileList }, "fileList6", "android_normal") }}
                                    onRemove={() => { this.setState({ android_normal: "" }) }}
                                >
                                    {fileList6.length >= 1 ? null : uploadButton}
                                </Upload>
                                <Modal visible={previewVisible6} footer={null} onCancel={() => { this.handleCancel("previewVisible6") }}>
                                    <img alt="example" style={{ width: '100%' }} src={previewImage6} />
                                </Modal>
                            </div>
                        </Col>

                    </Row>

                    <Row className='row'>
                        <Col className="small_subTitle" offset={1} span={4}>
                            <p>Android(17:9):</p>
                            <p>1080px*1710px</p>
                        </Col>
                        <Col span={3}>
                            <div className="clearfix">
                                <Upload
                                    action="//jsonplaceholder.typicode.com/posts/"
                                    listType="picture-card"
                                    fileList={fileList7}
                                    onPreview={(file) => { this.handlePreview(file, "previewImage7", "previewVisible7") }}
                                    onChange={({ fileList }) => { this.handleChange({ fileList }, "fileList7", "android_special_infinity_002") }}
                                    onRemove={() => { this.setState({ android_special_infinity_002: "" }) }}
                                >
                                    {fileList7.length >= 1 ? null : uploadButton}
                                </Upload>
                                <Modal visible={previewVisible7} footer={null} onCancel={() => { this.handleCancel("previewVisible7") }}>
                                    <img alt="example" style={{ width: '100%' }} src={previewImage7} />
                                </Modal>
                            </div>
                        </Col>

                        <Col className="small_subTitle" offset={1} span={4}>
                            <p>Android(18:9):</p>
                            <p>1880px*1080px</p>
                        </Col>
                        <Col span={3}>
                            <div className="clearfix">
                                <Upload
                                    action="//jsonplaceholder.typicode.com/posts/"
                                    listType="picture-card"
                                    fileList={fileList8}
                                    onPreview={(file) => { this.handlePreview(file, "previewImage8", "previewVisible8") }}
                                    onChange={({ fileList }) => { this.handleChange({ fileList }, "fileList8", "android_normal_infinity") }}
                                    onRemove={() => { this.setState({ android_normal_infinity: "" }) }}
                                >
                                    {fileList8.length >= 1 ? null : uploadButton}
                                </Upload>
                                <Modal visible={previewVisible8} footer={null} onCancel={() => { this.handleCancel("previewVisible8") }}>
                                    <img alt="example" style={{ width: '100%' }} src={previewImage8} />
                                </Modal>
                            </div>
                        </Col>

                        <Col className="small_subTitle" offset={1} span={4}>
                            <p>Android(18.5:9):</p>
                            <p>2520px*1440px</p>
                        </Col>
                        <Col span={3}>
                            <div className="clearfix">
                                <Upload
                                    action="//jsonplaceholder.typicode.com/posts/"
                                    listType="picture-card"
                                    fileList={fileList9}
                                    onPreview={(file) => { this.handlePreview(file, "previewImage9", "previewVisible9") }}
                                    onChange={({ fileList }) => { this.handleChange({ fileList }, "fileList9", "android_special_infinity_001") }}
                                    onRemove={() => { this.setState({ android_special_infinity_001: "" }) }}
                                >
                                    {fileList9.length >= 1 ? null : uploadButton}
                                </Upload>
                                <Modal visible={previewVisible9} footer={null} onCancel={() => { this.handleCancel("previewVisible9") }}>
                                    <img alt="example" style={{ width: '100%' }} src={previewImage9} />
                                </Modal>
                            </div>
                        </Col>
                         <Col className="small_subTitle" offset={1} span={4}>
                            <p>ipad（横屏）:</p>
                            <p>2048px*1536px</p>
                        </Col>
                        <Col span={3}>
                            <div className="clearfix">
                                <Upload
                                    action="//jsonplaceholder.typicode.com/posts/"
                                    listType="picture-card"
                                    fileList={fileList10}
                                    onPreview={(file) => { this.handlePreview(file, "previewImage10", "previewVisible10") }}
                                    onChange={({ fileList }) => { this.handleChange({ fileList }, "fileList10", "ipad_horizontal") }}
                                    onRemove={() => { this.setState({ ipad_horizontal: "" }) }}
                                >
                                    {fileList10.length >= 1 ? null : uploadButton}
                                </Upload>
                                <Modal visible={previewVisible10} footer={null} onCancel={() => { this.handleCancel("previewVisible10") }}>
                                    <img alt="example" style={{ width: '100%' }} src={previewImage10} />
                                </Modal>
                            </div>
                        </Col>
                    </Row>

                    <Row className='row'>
                        <Col className="small_subTitle" offset={1} span={2}>倒计时:</Col>
                        <Select value={this.state.countDown} style={{ width: 120 }} onChange={(v) => { this.setOneKV('countDown', v) }}>
                            <Option value="3000">3秒</Option>
                            <Option value="4000">4秒</Option>
                            <Option value="5000">5秒</Option>
                        </Select>
                    </Row>

                    <Row>
                        <Col className="small_subTitle" offset={1} span={2}>链接目标:</Col>
                        <Col span={20}>
                            <Target submitData={this.state}></Target>
                        </Col>
                    </Row>

                </div>

            </div>
        </Spin>
    }
}