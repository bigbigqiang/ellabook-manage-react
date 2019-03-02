import React from 'react';
import { Row, Col, Card, Icon, Input, Select, Radio, DatePicker, Button, Modal, Table, Divider, Spin, message } from "antd";
import { Link } from 'react-router';
import './addNewMessage.css';
import getUrl from '../util.js';
import commonData from '../commonData.js';
// import Submit from './submit.js';
import Target from './target.js';
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
            isAdd: props.params.ope ? false : true,
            adviceName: '',
            adviceDescription: '',           //描述
            channel: '',
            pushTarget: 'SINGLE_USER',         //推送目标
            targetContent: [],                //目标用户
            targetContent2: '',                //单个用户

            // targetContent3:null,                  //自定义用户

            pushTimeType: 'SEND_ONTIME',                //推送类型
            startTime: '',
            endTime: '',

            title: '',
            subTitle: '',
            content: '',
            targetContentList: [],            //目标用户列表
            visible: false,                  //弹窗的显示和影藏
            adviceDescriptionList: [],       //通知描述列表
            targetType: '',
            targetPage: {},
            customVisible:false,             //自定义弹窗显示隐藏
            selectDetail:{                  //下拉框数据
    			theTime:[],
    			theChannel:[],
    			theType:[]
            },
            customList:{                    //自定义数据
                searchType:'categorySearch',
                dateType:null,              //时间类型
                startTime:'',               //开始时间
                endTime:'',                 //结束时间
                channelCode:null,                //注册渠道
                userType:null,               //用户类型
                userNum:0                   //用户数量
            }
        }
    }
    setOneKV(k, v) {
        this.setState({
            [k]: v
        })
    }
    setCustomList(k,v){
        this.setState({
            customList:{
                ...this.state.customList,
                [k]: v
            } 
        })
    }
    componentDidMount() {
        this.getChannelInfo();
        this.getDateInfo();
        this.getUserInfo();
        this.fetchList('ADVICE_DESC');
        if (this.props.params.ope) {
            this.fetchDefaultData(this.props.params.ope);
        } else {

        }
    }
    //TODO:拉取默认数据
    async fetchDefaultData(adviceCode) {
        var doc = {
            adviceType: 'PUSH_MESSAGE',
            adviceCode
        }
        var data = await fetch(getUrl.url, {
            mode: "cors",
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: "method=ella.operation.getAdviceInfo" + "&content=" + JSON.stringify(doc) + commonData.dataString
        }).then(res => res.json());
        console.log('默认数据');
        console.log(data);

        //TODO:接收后台数据改为PART_USER
        var pushTarget = data.data.pushTarget;
        // if (pushTarget == 'IOS_USER' || pushTarget == 'ANDROID_USER') {
        //     pushTarget = 'PART_USER';
        // }

        this.setState({
            adviceName: data.data.adviceName,
            adviceDescription: data.data.adviceDescription,
            channel: data.data.resource || 'ios',
            pushTarget,

            targetContent: (pushTarget == 'IOS_USER' || pushTarget == 'ANDROID_USER') ? [{ ruleCode: data.data.targetContent }] : [],
            targetContent2: pushTarget == 'SINGLE_USER' ? data.data.targetContent : '',
            customList: pushTarget == 'CUSTOMIZED_USER' ? data.data.targetContent : '',

            // TODO:改为都是定时推送
            // pushTimeType: data.data.pushTimeType,
            startTime: data.data.pushTimeType == 'SEND_NOW' ? '' : data.data.startTime,
            endTime: data.data.pushTimeType == 'SEND_NOW' ? '' : data.data.endTime,
            title: data.data.title,
            subTitle: data.data.subTitle,
            content: data.data.content,
            //TODO: pushtime还没有写
            targetType: data.data.targetType,
            targetPage: data.data.targetPage
        }, () => {
            this.setState({
                key: 2,
                spinning: false
            });
            this.fetchUserList();
        })
    }
    // TODO:拉取描述列表
    async fetchList(str) {

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
        this.setOneKV('adviceDescriptionList', adviceDescriptionList)
    }
    // TODO:拉取目标用户列表
    async fetchUserList() {
        var doc = {
            resource: this.state.channel,
            page: 0,
            pageSize: 1000
        }
        var data = await fetch(getUrl.url, {
            mode: "cors",
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: "method=ella.operation.getMessageRuleList" + "&content=" + JSON.stringify(doc) + commonData.dataString
        }).then(res => res.json())
        if (data.data) this.setOneKV('targetContentList', data.data.list);
        console.log(123)
        console.log(data)
    }
    //获取渠道下拉框数据的函数
    getChannelInfo(){
    	var thisTrue = this;
    	fetch(getUrl.url, {
			method: "POST",
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: "method=ella.operation.boxSearchList" + "&content=" + JSON.stringify({
				type: "AUTO_BOX",
				groupId: "operation.box.chanelList"
			})+commonData.dataString
		})
		.then(function(response){
			console.log(response);
			return response.json();
		})
		.then(function(response){
			console.log("---------------");
			console.log(response);
			if (response.status == 1) {
		       	thisTrue.setState({
		            selectDetail : {
		            	...thisTrue.state.selectDetail,
						["theChannel"] : response.data.filter(function(item){
								return item.code!='appStore'?item:null;
						})
		            }
		        })
			}
		})
    }
    //获取时间类型下拉框数据的函数
    getDateInfo(){
    	var thisTrue = this;
    	fetch(getUrl.url, {
			method: "POST",
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: "method=ella.operation.boxSearchList" + "&content=" + JSON.stringify({
				groupId: "USER_MANAGE_LIST_DATE_TYPE"
			})+commonData.dataString
		})
		.then(function(response){
			console.log(response);
			return response.json();
		})
		.then(function(response){
			console.log("---------------");
			console.log(response);
			if (response.status == 1) {
		       	thisTrue.setState({
		            selectDetail : {
		            	...thisTrue.state.selectDetail,
                		["theTime"] : response.data.filter(function(item){
								return item;
						})	
		            }
		        })
			}
		})
    }
    //获取用户类型下拉框数据的函数
    getUserInfo(){
    	var thisTrue = this;
    	fetch(getUrl.url, {
			method: "POST",
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: "method=ella.operation.boxSearchList" + "&content=" + JSON.stringify({
				groupId: "USER_MANAGE_LIST_USER_TYPE"
			})+commonData.dataString
		})
		.then(function(response){
			console.log(response);
			return response.json();
		})
		.then(function(response){
			console.log("---------------");
			console.log(response);
			if (response.status == 1) {
		       	thisTrue.setState({
		            selectDetail : {
		            	...thisTrue.state.selectDetail,
						["theType"] : response.data.filter(function(item){
								return item;
						})
						
		            }
		        })
			}
		})
    }
    //用户数量
    getuserManageCount(){
        var w = this;
        var doc = {
            searchType:'categorySearch',
            dateType:w.state.customList.dateType,
            startTime:w.state.customList.startTime,
            endTime:w.state.customList.endTime,
            channelCode:w.state.customList.channelCode,
            userType:w.state.customList.userType,
        }
    	fetch(getUrl.url, {
			method: "POST",
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: "method=ella.operation.userManageCount" + "&content=" + JSON.stringify(doc)+commonData.dataString
		})
		.then(function(response){
			return response.json();
		})
		.then(function(response){
			console.log(response);
			if (response.status == 1) {
		       	w.setState({
                    customList:{
                        ...w.state.customList,
                        userNum:response.data
                    }
		        })
			}
		})
    }
    //提交自定义内容
    customSubmit(){
        if(this.state.customList.dateType==null || this.state.customList.dateType==''){
            message.error('请选择时间类型');
            return false
        }
        if(this.state.customList.userNum>10000){
            message.error('用户数量已超过10000，请重新筛选');
            return false
        }else{
            this.setState({
                customVisible:false,
                targetContent3:this.state.customList
            },()=>{
                console.log(this.state.targetContent3);
            })
        }
    }
    render() {
        var datas = this.state.selectDetail;
        console.log(this.state)
        var columns = [
            {
                key: '1',
                title: '描述',
                name: 'ruleDescription',
                dataIndex: 'ruleDescription',
                width: 200
            }, {
                key: '2',
                title: '用户数量',
                name: 'tokenNum',
                dataIndex: 'tokenNum',
                width: 100
            }
        ];
        const rowSelection = {
            selectedRowKeys: this.state.targetContent.map((item, index) => {
                var a;
                this.state.targetContentList.forEach((_item, _index) => {
                    if (item.ruleCode == _item.ruleCode) a = _index;
                })
                return a;
            }),
            type: 'radio',
            onChange: (a, b) => {
                // console.log(a)
                // console.log(b)
                this.setOneKV('targetContent', b);

            }
        };
        return <Spin tip="数据加载中..." spinning={!this.props.params.ope ? false : this.state.spinning}>
            <div id='addNewMessage'>
                <h2 className='title' >
                    <Link style={{ color: '#666' }} to='/messageList'><Icon type="left" />{`${this.props.params.ope ? '查看' : '添加'}推送消息`}</Link>
                </h2>
                <div className='box'>
                    <h2 className='subTitle'>通知设定</h2>
                    <Row className='row'>
                        <Col className="small_subTitle" offset={1} span={2}>通知名称:</Col>
                        <Col span={4}>
                            <Input
                                onBlur={(e) => {
                                    if (e.target.value.length > 20) {
                                        message.error('通知名称长度过长')
                                    }
                                }}
                                style={{ width: "100%" }}
                                value={this.state.adviceName}
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
                        <Col className="small_subTitle" offset={1} span={2}>通知渠道:</Col>
                        <Col span={10}>
                            <RadioGroup
                                value={this.state.channel}
                                onChange={(e) => {
                                    // this.setOneKV('channel', e.target.value);
                                    this.setState({
                                        channel: e.target.value,
                                        targetContent: [],
                                        customList:{                    //自定义数据
                                            searchType:'categorySearch',
                                            dateType:null,              //时间类型
                                            startTime:'',               //开始时间
                                            endTime:'',                 //结束时间
                                            channelCode:null,                //注册渠道
                                            userType:null,               //用户类型
                                            userNum:0                   //用户数量
                                        },
                                        targetContent3:{
                                            searchType:'categorySearch',
                                            dateType:null,              //时间类型
                                            startTime:'',               //开始时间
                                            endTime:'',                 //结束时间
                                            channelCode:null,                //注册渠道
                                            userType:null,               //用户类型
                                            userNum:0                   //用户数量
                                        }
                                    }, () => { this.fetchUserList(); })
                                }} >
                                <Radio className='radioStyle' value={'ios'}>ios&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</Radio>
                                <Radio className='radioStyle' value={'android'}>android</Radio>
                            </RadioGroup>
                        </Col>
                    </Row>

                    <Row className='row'>
                        <Col className="small_subTitle" offset={1} span={2}>目标用户:</Col>
                        <Col span={20}>
                            <RadioGroup value={this.state.pushTarget} style={{ width: '100%' }} onChange={(e) => { this.setOneKV('pushTarget', e.target.value) }} >
                                <Row>
                                    <Col span={8}>
                                        <Radio className='radioStyle' value={'SINGLE_USER'}>
                                            个人用户 
                                        <Input
                                    		style={{"marginLeft":"10px","width":"200px"}}
                                            placeholder={'请填写用户uid'}
                                            value={this.state.targetContent2}
                                            onChange={(e) => { this.setOneKV('targetContent2', e.target.value) }} />
                                        </Radio>
                                    </Col>

                                    <Col span={7}>
                                        <Radio className='radioStyle' value={'PART_USER'}>
                                            部分用户
                                            <Button
                                            	style={{"marginLeft":"10px","width":"80px"}}
                                                type="primary"
                                                onClick={() => {
                                                    if (this.state.pushTarget == 'SINGLE_USER') {
                                                        message.warning('当前选择为单个用户');
                                                    } else if (this.state.pushTarget == 'CUSTOMIZED_USER') {
                                                        message.warning('当前选择为自定义');
                                                    } else if (this.state.channel == '') {
                                                        message.warning('通知渠道没选');
                                                    } else {
                                                        this.setOneKV('visible', true)
                                                    }
                                                }} >选择</Button>
                                        </Radio>
                                    </Col>
                                    <Col span={7}>
                                        <Radio className='radioStyle' value={'CUSTOMIZED_USER'}>
                                            自定义
                                            <Button
                                                style={{"marginLeft":"10px","width":"80px"}}
                                                type="primary"
                                                onClick={() => {
                                                    if (this.state.pushTarget == 'SINGLE_USER') {
                                                        message.warning('当前选择为单个用户');
                                                    } else if (this.state.pushTarget == 'PART_USER') {
                                                        message.warning('当前选择为部分用户');
                                                    } else if (this.state.channel == '') {
                                                        message.warning('通知渠道没选');
                                                    }  else {
                                                        this.setOneKV('customVisible', true)
                                                    }
                                                }} >选择</Button>
                                        </Radio>
                                    </Col>
                                </Row>
                            </RadioGroup>
                            <Modal
                                title="部分用户列表"
                                visible={this.state.visible}
                                onOk={() => { this.setOneKV('visible', false) }}
                                onCancel={() => { this.setOneKV('visible', false) }}
                            >
                                <Table rowSelection={rowSelection} columns={columns} dataSource={this.state.targetContentList} />
                            </Modal>
                            
                            <Modal
                                width={700}
                                title="目标用户筛选"
                                visible={this.state.customVisible}
                                onCancel={() => { this.setOneKV('customVisible', false) }}
                                footer={null}
                            >
                                <Row style={{lineHeight:'50px'}}>
                                    <Col className="small_subTitle" offset={1} span={4}>时间类型:</Col>
                                    <Col span={4}>
                                        <Select value={this.state.customList.dateType} style={{ width: 120 }} onChange={(v) => { this.setCustomList('dateType', v) }}>
                                            {
                                                datas.theTime.map(item=>{
                                                    return <Option value={item.searchCode}>{item.searchName}</Option>
                                                })
                                            }
                                        </Select>
                                    </Col>
                                </Row>
                                <Row style={{lineHeight:'50px'}}>
                                    <Col className="small_subTitle" offset={1} span={4}>时间范围:</Col>
                                    <Col span={8}>
                                        <DatePicker
                                            style={{ width: "100%" }}
                                            showTime={{ format: 'HH:mm:ss' }}
                                            format="YYYY-MM-DD HH:mm:ss"
                                            placeholder={['开始时间']}
                                            onChange={(value, dateString) => { this.setCustomList('startTime', dateString) }}
                                            value={this.state.customList.startTime ? moment(this.state.customList.startTime, 'YYYY-MM-DD HH:mm:ss') : this.state.customList.startTime}
                                        />
                                    </Col>
                                    <Col style={{ textAlign: 'center' }} className="small_subTitle" span={1}>—</Col>
                                    <Col span={8}>
                                        <DatePicker
                                            style={{ width: "100%" }}
                                            showTime={{ format: 'HH:mm:ss' }}
                                            format="YYYY-MM-DD HH:mm:ss"
                                            placeholder={['结束时间']}
                                            onChange={(value, dateString) => { this.setCustomList('endTime', dateString) }}
                                            value={this.state.customList.endTime ? moment(this.state.customList.endTime, 'YYYY-MM-DD HH:mm:ss') : this.state.customList.endTime}
                                        />
                                    </Col>
                                </Row>
                                <Row style={{lineHeight:'50px'}}>
                                    <Col className="small_subTitle" offset={1} span={4}>注册渠道:</Col>
                                    <Col span={2}>
                                        {this.state.channel == 'android'?<Select value={this.state.customList.channelCode} style={{ width: 120 }} onChange={(v) => { this.setCustomList('channelCode', v) }}>
                                            <Option value={null}>全部</Option>
                                            {
                                                datas.theChannel.map(item=>{
                                                    return <Option value={item.code}>{item.name}</Option>
                                                })
                                            }
                                        </Select>:''} 
                                        {this.state.channel == 'ios'?<Select value={this.state.customList.channelCode} style={{ width: 120 }} onChange={(v) => { this.setCustomList('channelCode', v) }}>
                                            <Option value={'appStore'}>IOS</Option>
                                        </Select>:''} 
                                    </Col>
                                </Row>
                                <Row style={{lineHeight:'50px'}}>
                                    <Col className="small_subTitle" offset={1} span={4}>用户类型:</Col>
                                    <Col span={2}>
                                        <Select value={this.state.customList.userType} style={{ width: 120 }} onChange={(v) => { this.setCustomList('userType', v) }}>
                                            <Option value={null}>全部</Option>
                                            {
                                                datas.theType.map(item=>{
                                                    return <Option value={item.searchCode}>{item.searchName}</Option>
                                                })
                                            }
                                        </Select>
                                    </Col>
                                </Row>
                                <Row style={{lineHeight:'50px'}}>
                                    <Col className="small_subTitle" offset={1} span={4}>用户数量:</Col>
                                    <Col span={4}>
                                        <Input
                                            disabled
                                            placeholder={'请填写用户数量'}
                                            style={{ width: 120 }}
                                            value={this.state.customList.userNum}
                                            onChange={(e) => { this.setCustomList('userNum', e.target.value) }} />
                                    </Col>
                                    <Col className="small_subTitle" offset={1} span={4}>
                                        <Button type='primary' style={{ display: !this.state.isAdd ? 'none' : 'block',marginTop:'9px' }} onClick={()=>{this.getuserManageCount()}}>查看</Button>                                            
                                    </Col>
                                </Row>
                                <Button type='primary' style={{ display: !this.state.isAdd ? 'none' : 'block',margin:'20px auto 0 auto' }} onClick={()=>{this.customSubmit()}}>保存</Button>
                            </Modal>
                        </Col>
                    </Row>

                    <Row>
                        <Col className="small_subTitle" offset={1} span={2}>推送时间:</Col>
                        {/* <Col span={6}>
                            <RadioGroup value={this.state.pushTimeType} onChange={(e) => { this.setOneKV('pushTimeType', e.target.value) }} >
                                <Radio className='radioStyle' value={'SEND_NOW'}>立即推送</Radio>
                                <Radio className='radioStyle' value={'SEND_ONTIME'}>定时发布</Radio>
                            </RadioGroup>
                        </Col> */}
                        {/* value={moment(effectDate, 'YYYY-MM-DD HH:mm:ss')} */}
                        <Col span={4}>
                            <DatePicker
                                style={{ width: "100%" }}
                                showTime={{ format: 'HH:mm:ss' }}
                                format="YYYY-MM-DD HH:mm:ss"
                                placeholder={['开始时间']}
                                onChange={(value, dateString) => { this.setOneKV('startTime', dateString) }}
                                value={this.state.startTime ? moment(this.state.startTime, 'YYYY-MM-DD HH:mm:ss') : this.state.startTime}
                                disabled={this.state.pushTimeType == 'SEND_NOW' ? true : false}
                            />
                        </Col>

                        <Col style={{ textAlign: 'center' }} className="small_subTitle" span={1}>—</Col>

                        <Col span={4}>
                            <DatePicker
                                style={{ width: "100%" }}
                                showTime={{ format: 'HH:mm:ss' }}
                                format="YYYY-MM-DD HH:mm:ss"
                                placeholder={['结束时间']}
                                onChange={(value, dateString) => { this.setOneKV('endTime', dateString) }}
                                value={this.state.endTime ? moment(this.state.endTime, 'YYYY-MM-DD HH:mm:ss') : this.state.endTime}
                                disabled={this.state.pushTimeType == 'SEND_NOW' ? true : false}
                            />
                        </Col>
                    </Row>
                    <Divider />

                    <h2 className='subTitle'>通知内容</h2>

                    <Row className='row'>
                        <Col className="small_subTitle" offset={1} span={2}>主标题:</Col>
                        <Col span={8}>
                            <Input
                                value={this.state.title}
                                onBlur={(e) => {
                                    if (e.target.value.length > 20) {
                                        message.error('主标题长度过长')
                                    }
                                }}
                                onChange={(e) => { this.setOneKV('title', e.target.value) }} />
                        </Col>
                    </Row>
                    <Row className='row'>
                        <Col className="small_subTitle" offset={1} span={2}>副标题:</Col>
                        <Col span={8}>
                            <Input
                                onBlur={(e) => {
                                    if (e.target.value.length > 40) {
                                        message.error('副标题长度过长')
                                    }
                                }}
                                value={this.state.subTitle}
                                onChange={(e) => { this.setOneKV('subTitle', e.target.value) }} />
                        </Col>
                    </Row>
                    <Row className='row'>
                        <Col className="small_subTitle" offset={1} span={2}>内容:</Col>
                        <Col span={8}>
                            <TextArea
                                onBlur={(e) => {
                                    if (e.target.value.length > 128) {
                                        message.error('内容超长');
                                    }
                                }}
                                autosize={{ minRows: 5, maxRows: 5 }}
                                value={this.state.content}
                                onChange={(e) => { this.setOneKV('content', e.target.value) }} />
                            <span className="fontNumber">
                                <span style={this.state.content.length > 128 ? { color: 'red' } : {}}>{this.state.content.length}</span>/128
                            </span>
                        </Col>
                    </Row>
                    <Row>
                        <Col className="small_subTitle" offset={1} span={2}>链接目标:</Col>
                        <Col span={20}>
                            {/* <Submit submitData={this.state} ></Submit> */}
                            <Target submitData={this.state}></Target>
                        </Col>
                    </Row>
                </div>
            </div>
        </Spin>
    }
}