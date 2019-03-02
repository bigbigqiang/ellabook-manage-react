import React from 'react';
import { Row, Col, Card, Icon, Input, Select, Radio, DatePicker, Button, Modal, Table, Divider, Upload, Spin, message, Checkbox } from "antd";
import { Link } from 'react-router';
import './index.css';
import getUrl from '../../util.js';
import commonData from '../../commonData.js';
// import Target from './target.js'
// import Submit from './submit.js';
// import Target from './target.js';
const { MonthPicker, RangePicker } = DatePicker;
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;
const Option = Select.Option;
const confirm = Modal.confirm;
const { TextArea } = Input;
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
export default class addGoods extends React.Component {

    constructor(props) {
        super()
        this.state = {
            loading: props.params.ope == 'updata',
            updataDownList: [],
            timesDownList: [],
            versionDownList: [],
            versionNum: '',
            version: {
                versionCode: '',
                versionUrl: '',
            },                         //版本号
            forceUpdate: '',                       //通知类型
            pushTarget: 'IOS',                     //客户端类型
            adviceChannels: [],                    //渠道
            adviceVersionStart: '',
            adviceVersionsEnd: '',
            pushFrequency: '',                      //通知频次
            startTime: '',
            endTime: '',
            adviceName: '',
            content: '',
        }
    }
    setOneKV(k, v) {
        this.setState({
            [k]: v
        })
    }
    componentDidMount() {
        this.fetchDefatultData(this.props.params.ope == 'updata' ? true : false);
    }
    // TODO:比较版本号大小
    comparisonVersion(a, b) {
        if (a == b) {
            return true;
        }
        if (a.split('.')[0] > b.split('.')[0]) {
            return true;
        } else if (a.split('.')[0] == b.split('.')[0]) {
            if (a.split('.')[1] > b.split('.')[1]) {
                return true;
            } else if (a.split('.')[1] == b.split('.')[1]) {
                if (a.split('.')[2] > b.split('.')[2] || b.split('.')[2] == null) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        } else {
            return false;
        }
    }
    async fetchVersionDownList(v) {
        var versionDownList = await fetch(getUrl.url, {
            mode: "cors",
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: "method=ella.operation.boxSearchList" + "&content=" + JSON.stringify(
                {
                    type: "AUTO_BOX",
                    groupId: "operation.box.GetVersionList",
                    versionResource: v
                }
            ) + commonData.dataString
        }).then(res => res.json());
        const _this = this;
        console.log(versionDownList.data);
        console.log(versionDownList.data.reduce((a, b) => _this.comparisonVersion(a.versionNum, b.versionNum) ? a : b).versionNum)
        this.setState({
            versionDownList: versionDownList.data,
            // TODO:每次让版本号取安卓或者ios最大版本号,如果是编辑就不用取最大,直接用后台数据.
            // versionNum: this.props.params.ope == 'updata' ? versionDownList.data.reduce((a, b) => _this.comparisonVersion(a.versionNum, b.versionNum) ? a : b).versionNum : ''
            // versionNum: ''
        })
    }
    async fetchDefatultData(k) {
        // TODO:下拉内容

        var updataDownList = await fetch(getUrl.url, {
            mode: "cors",
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: "method=ella.operation.boxSearchList" + "&content=" + JSON.stringify(
                {
                    // type: 'UPDATE_VERSION_TYPE',
                    groupId: "UPDATE_VERSION_TYPE"
                }
            ) + commonData.dataString
        }).then(res => res.json());

        var timesDownList = await fetch(getUrl.url, {
            mode: "cors",
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: "method=ella.operation.boxSearchList" + "&content=" + JSON.stringify(
                {
                    // type: 'UPDATE_VERSION_TYPE',
                    groupId: "PUSH_FREQUENCY_TYPE"
                }
            ) + commonData.dataString
        }).then(res => res.json());


        this.fetchVersionDownList('ios');
        updataDownList = updataDownList.data;
        timesDownList = timesDownList.data;
        console.log(updataDownList);
        // console.log(timesDownList);


        if (k) {
            var doc = {
                adviceCode: this.props.params.adviceCode,
                adviceType: "UPDATE_VERSION"
            }
            var data = await fetch(getUrl.url, {
                mode: "cors",
                method: "POST",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: "method=ella.operation.getAdviceInfo" + "&content=" + JSON.stringify(doc) + commonData.dataString
            }).then(res => res.json());
            console.log(data);
            this.setState({
                versionNum: data.data.versionCode,
                forceUpdate: data.data.forceUpdate,
                pushTarget: data.data.pushTarget,
                adviceChannels: data.data.adviceChannels.split(','),
                adviceVersionStart: data.data.adviceVersions.split('～')[0],
                adviceVersionsEnd: data.data.adviceVersions.split('～')[1],
                pushFrequency: data.data.pushFrequency,
                startTime: data.data.startTime,
                endTime: data.data.endTime,
                adviceName: data.data.adviceName,
                content: data.data.targetContent,
                updataDownList,
                timesDownList,
                version: {
                    versionCode: data.data.pushTarget == 'IOS' ? '' : data.data.version.versionCode,
                    versionUrl: data.data.pushTarget == 'IOS' ? '' : data.data.version.versionUrl,
                },
                loading: false
            }, () => {
                this.fetchVersionDownList(data.data.pushTarget == "IOS" ? 'ios' : 'android');
            })
        } else {
            this.setState({
                updataDownList,
                timesDownList
            })
        }
    }

    // TODO:提交数据
    async submitData() {
        //TODO:比较时间
        function CompareDate(d1, d2) {
            return ((new Date(d1.replace(/-/g, "\/"))) >= (new Date(d2.replace(/-/g, "\/"))));
        }
        console.log(this.state.versionDownList);
        var doc = {
            versionCode: 200,
            versionCode: this.state.versionNum,
            adviceType: "UPDATE_VERSION",
            adviceCode: this.props.params.ope == 'add' ? null : this.props.params.adviceCode,
            adviceName: this.state.adviceName,
            forceUpdate: this.state.forceUpdate,
            pushTarget: this.state.pushTarget,
            adviceChannels: this.state.adviceChannels.join(','),
            targetContent: this.state.content,
            startTime: this.state.startTime,
            endTime: this.state.endTime,
            pushFrequency: this.state.pushFrequency,
            adviceVersions: this.state.adviceVersionStart + '～' + this.state.adviceVersionsEnd,
            // versionCode: this.props.params.ope == 'add' ? this.state.versionDownList.find(v => v.versionNum == this.state.versionNum).id : 1,
            version: {
                versionCode: this.state.version.versionCode,
                versionUrl: this.state.version.versionUrl
            }
        }
        // console.log(doc.versionCode);
        // return;
        this.props.params.ope == 'add' ? doc.createBy = localStorage.uid : doc.updateBy = localStorage.uid;
        if (doc.versionNum == "") {
            message.error('版本号未填写');
            return;
        }
        if (doc.forceUpdate == "") {
            message.error('通知类型未选择');
            return;
        }
        if (doc.pushTarget == 'ANDROID' && doc.version.versionCode == '') {
            message.error('内部版本号未填写');
            return;
        }
        if (doc.pushTarget == 'ANDROID' && doc.version.versionUrl == '') {
            message.error('URL未填写');
            return;
        }
        if (this.state.adviceVersionStart == '' || this.state.adviceVersionsEnd == '') {
            message.error('推送范围未选择');
            return;
        }
        if (this.comparisonVersion(this.state.adviceVersionStart, this.state.adviceVersionsEnd) && this.state.adviceVersionStart != this.state.adviceVersionsEnd) {
            message.error('版本号顺序不正确');
            return;
        }
        if (doc.pushFrequency == '') {
            message.error('通知频次未选择');
            return;
        }
        if (doc.startTime == "" || doc.endTime == "") {
            message.error('时间未设置');
            return;
        }
        if (CompareDate(doc.startTime, doc.endTime)) {
            message.error('时间设置不正确');
            return;
        }

        if (doc.adviceName == "") {
            message.error('标题未填写');
            return;
        }
        if (doc.targetContent == "") {
            message.error('内容未填写');
            return;
        }

        var _this = this;
        confirm({
            title: this.props.params.ope == 'add'
                ?
                <div>
                    请确认是否添加该升级通知
                </div>
                :
                <div>
                    请确认是否修改该升级通知
                </div>
            ,
            // content: '点确定将提交后台',
            okText: '确定',
            okType: 'primary',
            cancelText: '继续编辑',
            onOk() {
                _this.handleSubmit(doc)
            },
            onCancel() {
                // _this.setState({
                //     look: true
                // })
            },
        });
        return;

    }
    async handleSubmit(doc) {
        var data = await fetch(getUrl.url, {
            mode: "cors",
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: "method=" + (this.props.params.ope == 'add' ? "ella.operation.insertAdvice" : "ella.operation.updateAdvice") + "&content=" + JSON.stringify(doc) + commonData.dataString
        }).then(res => res.json());
        console.log(data);
        if (data.status == 1) {
            message.success('添加成功');
            if(this.props.params.ope == 'add'){
                window.location.href = window.location.href.split('/messageList')[0] + '/messageList/back/UPDATE_POPUP';
            }
            
        } else {
            message.error(data.message);
        }
    }
    render() {
        console.log(this.state)
        const plainOptions = [
            { label: '360', value: 'c360' },
            { label: '百度', value: 'baidu' },
            { label: '应用宝', value: 'qq' },
            { label: '小米市场', value: 'xiaomi' },
            { label: 'PP助手', value: 'ppzushou' },
            { label: '华为', value: 'huawei' },
            { label: 'oppo', value: 'oppo' },
            { label: 'vivo', value: 'vivo' },
            { label: '魅族', value: 'meizu' },
            { label: '联想', value: 'lenovo' },
            { label: '金立', value: 'jinli' },
            { label: '三星', value: 'sanxing' },
            { label: '乐视', value: 'leshi' },
            { label: '锤子', value: 'chuzi' },
            { label: '搜狗', value: 'sogou' },
            { label: '安智', value: 'anzhi' },
            { label: '应用汇', value: 'yingyonghui' },
            { label: '机锋', value: 'gfan' },
            { label: '木蚂蚁', value: 'mumayi' },
            { label: '步步高', value: 'bubugao' },
            { label: '大蛋', value: 'dadan' },
            { label: '普云', value: 'puyun' },
        ];
        return <Spin spinning={this.state.loading} >
            <div id="updateMessage">
                <h2 className='title' >
                    <Link style={{ color: '#666' }} to='/messageList/back/UPDATE_POPUP'><Icon type="left" />{`${this.props.params.ope == 'add' ? '添加' : '编辑'}升级通知`}</Link>
                </h2>
                <div className='box'>
                    <h2 className='subTitle'>通知设定</h2>
                    <Row className='row'>
                        <Col className="small_subTitle" offset={1} span={2}>版本号:</Col>
                        <Col span={2}>
                            <Input
                                value={this.state.versionNum}
                                style={{ width: '100%' }}
                                onChange={(e) => { this.setOneKV('versionNum', e.target.value) }}
                                disabled={this.props.params.ope == 'add' ? false : true}
                            />
                            {/* <Option value={"2.0.1"}>2.0.1</Option>
                            <Option value={"2.0.2"}>2.0.2</Option>
                            <Option value={"2.0.3"}>2.0.3</Option>
                            <Option value={"2.0.4"}>2.0.4</Option> */}
                            {
                                // this.state.versionDownList.map(item => <Option value={item.versionNum}>{item.versionNum}</Option>)
                            }
                        </Col>
                        <Col className="small_subTitle" offset={4} span={2}>通知类型:</Col>
                        <Col span={4}>
                            <Select
                                value={this.state.forceUpdate}
                                style={{ width: '100%' }}
                                onChange={(v) => { this.setOneKV('forceUpdate', v) }}
                            >
                                {/* <Option value={"FORCE_UPDATE_YES"}>强制更新</Option>
                            <Option value={"FORCE_UPDATE_NO"}>建议更新</Option> */}
                                {
                                    this.state.updataDownList.map(item => <Option value={item.searchCode}>{item.searchName}</Option>)
                                }
                            </Select>
                        </Col>
                    </Row>

                    <Row className='row'>
                        <Col className="small_subTitle" offset={1} span={2}>客户端类型:</Col>
                        <Col>
                            <RadioGroup
                                onChange={(e) => {
                                    this.fetchVersionDownList(e.target.value)
                                    this.setState({
                                        'pushTarget': e.target.value,
                                        adviceVersionStart: '',
                                        adviceVersionsEnd: ''
                                    })
                                }}
                                value={this.state.pushTarget}
                                disabled={this.props.params.ope == 'add' ? false : true}
                            >
                                <Radio value={'IOS'}>ios</Radio>
                                <Radio value={'ANDROID'}>Android</Radio>
                            </RadioGroup>
                        </Col>
                    </Row>

                    {/*-------------------------------------------------选安卓展示的内容---------------------------------------------------------------- */}
                    {
                        this.state.pushTarget == 'IOS'
                            ?
                            null
                            :
                            <Row className='row'>
                                <Col className="small_subTitle" offset={2} span={2}>内部版本号:</Col>
                                <Col span={4}>
                                    <Input
                                        value={this.state.version.versionCode}
                                        onChange={(e) => {
                                            this.setState({
                                                version: {
                                                    ...this.state.version,
                                                    versionCode: e.target.value
                                                }
                                            })
                                            // this.setOneKV('versionCode', e.target.value)
                                        }}
                                    />
                                </Col>
                            </Row>
                    }
                    {
                        this.state.pushTarget == 'IOS'
                            ?
                            null
                            :
                            <Row className='row'>
                                <Col className="small_subTitle" offset={2} span={2}>URL:</Col>
                                <Col span={4}>
                                    <Input
                                        value={this.state.version.versionUrl}
                                        onChange={(e) => {
                                            this.setState({
                                                version: {
                                                    ...this.state.version,
                                                    versionUrl: e.target.value
                                                }
                                            })
                                            // this.setOneKV('versionUrl', e.target.value)
                                        }}
                                    />
                                </Col>
                            </Row>
                    }
                    {
                        this.state.pushTarget == 'IOS'
                            ?
                            null
                            :
                            <Row className='row'>
                                <Col className="small_subTitle" offset={2} span={2}>渠道:</Col>
                                <Col span={19}>
                                    <CheckboxGroup
                                        options={plainOptions}
                                        value={this.state.adviceChannels}
                                        onChange={(v) => { this.setOneKV('adviceChannels', v) }}
                                    />
                                </Col>
                            </Row>
                    }
                    {/*-------------------------------------------------选安卓展示的内容---------------------------------------------------------------- */}

                    <Row className='row'>
                        <Col className="small_subTitle" offset={1} span={2}>推送范围:</Col>
                        <Col span={2}>
                            <Select
                                value={this.state.adviceVersionStart}
                                style={{ width: '100%' }}
                                onChange={(v) => { this.setOneKV('adviceVersionStart', v) }}
                            >
                                {
                                    this.state.versionDownList.map(item => <Option value={item.versionNum}>{item.versionNum}</Option>)
                                }
                            </Select>
                        </Col>
                        <Col span={1} className="bar">
                            <span>-</span>
                        </Col>
                        <Col span={2}>
                            <Select
                                value={this.state.adviceVersionsEnd}
                                style={{ width: '100%' }}
                                onChange={(v) => { this.setOneKV('adviceVersionsEnd', v) }}
                            >
                                {
                                    this.state.versionDownList.map(item => <Option value={item.versionNum}>{item.versionNum}</Option>)
                                }
                            </Select>
                        </Col>
                        <Col className="small_subTitle" offset={1} span={2}>通知频次:</Col>
                        <Col span={4}>
                            <Select
                                value={this.state.pushFrequency}
                                style={{ width: '100%' }}
                                onChange={(v) => { this.setOneKV('pushFrequency', v) }}
                            >
                                {/* <Option value={"FIXED_PUSH_TIMES"}>通知一次</Option>
                            <Option value={"DAILY_PUSH"}>每日通知一次</Option>
                            <Option value={"EVERY_TIME_PUSH"}>每次启动通知一次</Option> */}
                                {
                                    this.state.timesDownList.map(item => <Option value={item.searchCode}>{item.searchName}</Option>)
                                }
                            </Select>
                        </Col>
                    </Row>

                    <Row className='row'>
                        <Col className="small_subTitle" offset={1} span={2}>推送时间:</Col>
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
                        <Col span={4} className="bar">
                            <span>到</span>
                        </Col>
                        <Col span={4}>
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

                    <h2 style={{ marginTop: '40px' }} className='subTitle'>内容设定</h2>

                    <Row className='row'>
                        <Col className="small_subTitle" offset={1} span={2}>标题:</Col>
                        <Col span={8}>
                            <Input
                                onBlur={(e) => {
                                    if (e.target.value.length > 20) {
                                        message.error('通知标题长度过长');
                                    }
                                }}
                                value={this.state.adviceName}
                                style={{ width: "100%" }}
                                onChange={(e) => { this.setOneKV('adviceName', e.target.value) }}
                            />
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
                                autosize={{ minRows: 10, maxRows: 10 }}
                                value={this.state.content}
                                onChange={(e) => { this.setOneKV('content', e.target.value) }} />
                            <span style={{ float: 'right' }}>
                                <span style={this.state.content.length > 128 ? { color: 'red' } : {}}>{this.state.content.length}</span>/128
                        </span>
                        </Col>
                    </Row>
                    <Row className='row'>
                        <Col offset={3} span={2}>
                            <Button onClick={() => { this.submitData() }} type='primary'>保存</Button>
                        </Col>
                    </Row>
                </div>
            </div>
        </Spin>
    }
}