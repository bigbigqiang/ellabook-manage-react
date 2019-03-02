import React from 'react';
import { Row, Col, Card, Icon, Input, Select, Radio, DatePicker, Button, Modal, Table, Divider, Upload, Spin, message,InputNumber } from "antd";
import { Link } from 'react-router';
import './index.css';
import getUrl from '../../util.js';
import commonData from '../../commonData.js';
import Target from './target.js';
// import Submit from './submit.js';
// import Target from './target.js';
const { MonthPicker, RangePicker } = DatePicker;
const RadioGroup = Radio.Group;
const Option = Select.Option;
const { TextArea } = Input;
import moment from 'moment';
import 'moment/locale/zh-cn';
// import img1 from '../../../assets/images/animation1.gif'
// import img2 from '../../../assets/images/animation2.gif'
moment.locale('zh-cn');
export default class addGoods extends React.Component {

    constructor(props) {
        super()
        this.state = {
            spinning: true,
            key: 1,
            startupCode: props.params.adviceCode,           //TODO:新增的时候没有,编辑的时候才有
            adviceType: 'STARTUP_POPUP',                  //TODO:目前写死的内容
  

            adviceName: '',                 //通知名称
            adviceDescription: '',          //通知描述
            pushTarget: '',                 //目标用户
            targetContent: '',               //单个用户id
            pushTimeType: 'SEND_ONTIME',               //推送时间类型
            startTime: '',
            endTime: '',
            createBy: localStorage.uid,


            attachUrl: '',
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
            attachName: 'normal',
            targetType: '',
            targetPage: {},
            //动画1弹窗
            animationVisible1:false,
            animationVisible2:false,

            showStyle:'BOTTOM_UP_IN_OUT',

            pushFrequency:'FIXED_PUSH_INTERVALS_AND_TIMES',
            intervalTime:'',
            pushTimes:''
        }
    }
    setOneKV(k, v) {
        console.log(k);
        console.log(v);
        this.setState({
            [k]: v
        })
    }
    componentDidMount() {
        this.fetchList('ADVICE_DESC', 'adviceDescriptionList');
        this.fetchList('PUSH_TARGET', 'pushTargetList');
        if (this.props.params.adviceCode) {
            this.fetchDefaultData(this.props.params.adviceCode);
        }
    }
    // TODO:拉取默认 数据
    async fetchDefaultData(adviceCode) {
        var doc = {
            adviceCode,
            adviceType: 'STARTUP_POPUP'
        }
        var data = await fetch(getUrl.url, {
            mode: "cors",
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: "method=ella.operation.getAdviceInfo" + "&content=" + JSON.stringify(doc) + commonData.dataString
        }).then(res => res.json())

        console.log(data);
        var v = data.data;
        this.setState({
            adviceName: v.adviceName,
            adviceDescription: v.adviceDescription,
            pushTarget: v.pushTarget,
            targetContent: v.targetContent,
            startTime: v.startTime,
            endTime: v.endTime,
            attachUrl: v.attachList[0].attachUrl,

            showStyle:v.showStyle,

            intervalTime:v.intervalTime/86400,
            pushTimes:v.pushTimes,
            fileList: [
                {
                    uid: -1,
                    name: 'xxx.png',
                    status: 'done',
                    url: v.attachList[0].attachUrl,
                }
            ],
            targetType: v.targetType,
            targetPage: v.targetPage
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
    ///////////////////////////////文本图片上传////////////////////////////////////////////
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
    //隐藏动画弹窗
    handleAnimation1 = (e) => {
        this.setState({
            animationVisible1:false
        })
    }
    handleAnimation2 = (e) => {
        this.setState({
            animationVisible2:false
        })
    }
    animationVisible = (e) => {
//  	if(e.target.value=="animationVisible1"){
//    		this.setState({
//             showType: "BOTTOM_UP_IN_OUT"
//          });
//  	}else if(e.target.value=="animationVisible2"){
//    		this.setState({
//             showType: "CENTER_IN_OUT"
//          });
//  	}
		this.setState({

           showStyle: e.target.value

        });
        console.log('radio checked', e.target.value);
        
      }

	getIntervalTime(value) {
        console.log(value);
        console.log(Math.floor(value))
        if(value!=Math.floor(value)){
            message.error('不能输入小数')
           
        }
        
		this.setState({
			intervalTime:(value!=''?Math.floor(value):value)
				
		})
	}
	getFrequency(value) {
        console.log(value);
        if(value!=Math.floor(value)){
            message.error('不能输入小数');
           
        }
		this.setState({
			pushTimes:(value!=''?Math.floor(value):value)
				
		})
	}
    render() {
        const { previewVisible, previewImage, fileList, previewVisible2, previewImage2, fileList2, previewVisible3, previewImage3, fileList3 } = this.state;
        const uploadButton = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        return <Spin tip="数据加载中..." spinning={this.props.params.ope == "add" ? false : this.state.spinning}>
            <div id='advertisement'>
                <h2 className='title' >
                    <Link style={{ color: '#666' }} to='/messageList/back/STARTUP_POPUP'><Icon type="left" />{`${this.props.params.ope == 'add' ? '添加' : '编辑'}启动弹窗`}</Link>
                </h2>
                <div className='box'>
                    <Row className='row'>
                        <Col className="small_subTitle" offset={1} span={2}>通知名称:</Col>
                        <Col span={4}>
                            <Input
                                onBlur={(e) => {
                                    if (e.target.value.length > 20) {
                                        message.error('通知名称长度过长')
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
                                    <Input placeholder={'请输入用户uid'} value={this.state.targetContent} onChange={(e) => { this.setOneKV('targetContent', e.target.value) }} />
                                </Col>
                                :
                                null
                        }

                       

                    </Row>
                    <Row className='row'>
                        <Col className="small_subTitle" offset={1} span={2}>频次设定:</Col>
                        <Col className="small_subTitle" span={2}>固定间隔时间(天):</Col>
                        <Col span={2}>
                            {
                                <InputNumber
                                    value={this.state.intervalTime}
                                    style={{ width: "80%" }}
                                    onBlur={(e)=>{this.getIntervalTime(e.target.value)}} 
                                    onChange={(value)=>{this.getIntervalTime(value)}} 
                                    
                                    
                                    
                                />  
                            }
                        </Col>
                        <Col className="small_subTitle" offset={1} span={2}>固定次数(次):</Col>
                        <Col span={2}>
                            {
                                <InputNumber

//                                  value={this.state.pushTimes}
									disabled={true} defaultValue={1}

                                    style={{ width: "80%" }}
                                    onBlur={(e)=>{this.getFrequency(e.target.value)}} 
                                    onChange={(value)=>{this.getFrequency(value)}} 
                                   
                                    
                                    
                                />  
                            }
                        </Col>
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
                    <Row>
                        <Col className="small_subTitle" offset={1} span={2}>上传素材:</Col>
                        <Col>
                            <div className="clearfix">
                                <Upload
                                    action="//jsonplaceholder.typicode.com/posts/"
                                    listType="picture-card"
                                    fileList={fileList}
                                    onPreview={(file) => { this.handlePreview(file, "previewImage", "previewVisible") }}
                                    onChange={({ fileList }) => { this.handleChange({ fileList }, "fileList", "attachUrl") }}
                                    onRemove={() => { this.setState({ attachUrl: "" }) }}
                                >
                                    {fileList.length >= 1 ? null : uploadButton}
                                </Upload>
                                <Modal visible={previewVisible} footer={null} onCancel={() => { this.handleCancel("previewVisible") }}>
                                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                                </Modal>
                            </div>
                        </Col>
                    </Row>

                    <Row>
                        <Col className="small_subTitle" offset={1} span={2}>弹窗动画:</Col>
                        <Col>
                            <div className="clearfix" style={{lineHeight:'32px',marginBottom:10}}>

                            <RadioGroup  onChange={this.animationVisible} value={this.state.showStyle}>
                                <Radio value='CENTER_IN_OUT'>动画1</Radio>
                                <span className='i-play' onClick={()=>{this.setOneKV('animationVisible2',true)}}  style={{marginRight:40}}></span>
                                <Radio value='BOTTOM_UP_IN_OUT'>动画2</Radio>
                                <span className='i-play' onClick={()=>{this.setOneKV('animationVisible1',true)}}></span>

                            </RadioGroup>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col className="small_subTitle" offset={1} span={2}>链接目标:</Col>
                        <Col span={20}>
                            <Target submitData={this.state}></Target>
                        </Col>
                    </Row>
                    <Modal
                        visible={this.state.animationVisible1}
                        title={null}
                        onCancel={this.handleAnimation1}
                        footer={null}
                    >
                        <img src='http://member.ellabook.cn/0f205fe430ca401c820cd83233940da7' alt=""/>
                    </Modal>
                    <Modal
                        visible={this.state.animationVisible2}
                        title={null}
                        onCancel={this.handleAnimation2}
                        footer={null}
                    >
                        <img src='http://member.ellabook.cn/74845e5cfb6c42feac6fb54f3355b8c3' alt=""/>
                    </Modal>
                </div>
            </div>
        </Spin>
    }
}