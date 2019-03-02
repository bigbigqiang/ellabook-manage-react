import React from 'react'
import { Spin, Progress, Pagination, message, Select, DatePicker, Icon, Button, Input, Row, Col, Table, Cascader, Modal, Upload, Tabs, Popconfirm,Popover } from 'antd';
const Search = Input.Search;
import { Link } from 'react-router';
import Updata from './updata.js';
import 'antd/dist/antd.css';
import './messageList.css';
const confirm = Modal.confirm;
var util = require('../util.js');
import commonData from '../commonData.js';
const TabPane = Tabs.TabPane;

export default class messageList extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            adviceType: props.params.type || 'PUSH_MESSAGE',
            visible: false
        };
        this.showModal = this.showModal.bind(this);
        this.hideModal = this.hideModal.bind(this);
    }
    callback(key) {
        var w = this;
        console.log(key);
        w.setState({
            adviceType: key
        })
    }
    showModal() {
        this.setState({
            visible: true
        })
    }
    hideModal() {
        this.setState({
            visible: false
        })
    }
    render() {
        return (
            <div className="g-message-list">
                <p className="m-head">通知列表</p>
                <Button type="primary" icon="plus" className="add-partner-btn" onClick={() => this.showModal()}>添加新的通知</Button>
                <Tabs onChange={(key) => this.callback(key)} type="line" defaultActiveKey={this.props.params.type || "PUSH_MESSAGE"} style={{ padding: '0 20px' }}>
                    <TabPane tab="推送消息" key="PUSH_MESSAGE"><News adviceType={this.state.adviceType} /></TabPane>
                    <TabPane tab="闪屏广告" key="STARTUP_AD"><Advert adviceType={this.state.adviceType} /></TabPane>
                    <TabPane tab="启动弹窗" key="STARTUP_POPUP"><Popup adviceType={this.state.adviceType} /></TabPane>
                    <TabPane tab="更新弹窗" key="UPDATE_POPUP"><Updata adviceType={this.state.adviceType} /></TabPane>
                </Tabs>
                <Modal
                    visible={this.state.visible}
                    title='请选择通知类型'
                    onCancel={this.hideModal}
                    width={444}
                    footer={[
                        <Button key="back" onClick={this.hideModal}>关闭</Button>,
                    ]}
                >
                    <Row>
                        <Col span={6} style={{ textAlign: 'center' }}>
                            <Link to='/messageList/addNewMessage'>
                                <Button type="primary">推送消息</Button>
                            </Link>
                        </Col>
                        <Col span={6} style={{ textAlign: 'center' }}>
                            <Link to='messageList/lightningAdvertisement/add'>
                                <Button type="primary">闪屏广告</Button>
                            </Link>
                        </Col>
                        <Col span={6} style={{ textAlign: 'center' }}>
                            <Link to='messageList/advertisement/add'>
                                <Button type="primary">启动弹窗</Button>
                            </Link>
                        </Col>
                        <Col span={6} style={{ textAlign: 'center' }}>
                            <Link to='messageList/updateMessage/add/null'>
                                <Button type="primary">升级通知</Button>
                            </Link>
                        </Col>
                    </Row>
                </Modal>
            </div>
        )
    }
}
class Popup extends React.Component {
    constructor() {
        super()
        this.state = {
            tableData: [],
            pageMax: 0,
            pageLength: '',
            page: '0',
            pageSize: '20',
            current: 1,
            loading: false,
            adviceName: ''
        }
        this.pageChangeFun = this.pageChangeFun.bind(this);
        this.pageSizeFun = this.pageSizeFun.bind(this);
    }

    pageChangeFun(pageNum) {
        console.log(pageNum);
        this.setState({
            page: pageNum - 1,
            current: pageNum
        }, () => {
            this.messageListFn('STARTUP_POPUP', this.state.adviceName, this.state.pageSize, this.state.page);
        });
    }

    pageSizeFun(current, pageSize) {
        console.log(current, pageSize);
        this.setState({
            pageSize: pageSize,
            page: current - 1,
            current: current
        }, () => {
            this.messageListFn('STARTUP_POPUP', this.state.adviceName, this.state.pageSize, this.state.page);
        });
    }
    searchContent(value) {
        console.log(value);
        this.messageListFn(this.props.adviceType, value, this.state.pageSize, this.state.page);
    }

    componentDidMount() {
        this.messageListFn(this.props.adviceType, this.state.adviceName, this.state.pageSize, this.state.page);
    }
    toDate(number) {
        var n = number * 1;
        var date = new Date(n);
        var Y = date.getFullYear() + '-';
        var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate() + ' ';
        var h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours() + ':';
        var m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes() + ':';
        var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
        return (Y + M + D + h + m + s)
    }

    async messageListFn(adviceType, adviceName, pageSize, page) {
        this.setState({
            loading: true
        });
        var data = await fetch(util.url, {
            mode: "cors",
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: "method=ella.operation.getAdviceList" + "&content=" + JSON.stringify({ "adviceType": adviceType, "adviceName": adviceName, "pageSize": pageSize, "page": page }) + commonData.dataString
        }).then(res => res.json())
            .then((d) => {
                console.log(d);
                const datalist = [];
                var list = d.data.list;
                for (let i = 0; i < list.length; i++) {
                    var startupType = list[i].startupType;
                    var pushTarget = list[i].pushTarget;
                    var status = list[i].status;
                    //通知类型
                    if (startupType == 'STARTUP_POPUP') {
                        startupType = '启动弹窗';
                    } else if (startupType == 'STARTUP_AD') {
                        startupType = '启动广告';
                    } else if (startupType == 'PUSH_MESSAGE') {
                        startupType = '推送消息';
                    } else {
                        startupType = '-';
                    }
                    //推送目标
                    if (pushTarget == 'ALL_USER') {
                        pushTarget = '所有用户';
                    } else if (pushTarget == 'REGISTER_USER') {
                        pushTarget = '注册用户';
                    } else if (pushTarget == 'GUEST_USER') {
                        pushTarget = '游客用户';
                    } else if (pushTarget == 'IOS_USER') {
                        pushTarget = '苹果用户';
                    } else if (pushTarget == 'ANDROID_USER') {
                        pushTarget = '安卓用户';
                    } else if (pushTarget == 'VIP_USER') {
                        pushTarget = '会员用户';
                    } else if (pushTarget == 'SINGLE_USER') {
                        pushTarget = '单个用户'
                    } else {
                        pushTarget = '-';
                    }
                    //状态
                    if (status == 'PUSH_NO') {
                        status = '未推送';
                    } else if (status == 'PUSHING') {
                        status = '正在推送';
                    } else if (status == 'SUCCESS') {
                        status = '成功';
                    } else if (status == 'FAIL') {
                        status = '失败';
                    } else if (status == 'EXCEPTION') {
                        status = '异常';
                    } else {
                        status = '-';
                    }
                    datalist.push({
                        adviceName: (list[i].adviceName == '' || list[i].adviceName == null) ? '-' : list[i].adviceName,
                        adviceDescription: (list[i].adviceDescription == '' || list[i].adviceDescription == null) ? '-' : list[i].adviceDescription,
                        startupType: startupType,
                        pushTarget: pushTarget,
                        startTime: (list[i].startTime == '' || list[i].startTime == null) ? '-' : list[i].startTime,
                        pushNum: (list[i].pushNum == '' || list[i].pushNum == null) ? '-' : list[i].pushNum,
                        openNum: (list[i].openNum == '' || list[i].openNum == null) ? '-' : list[i].openNum,
                        status: status,
                        startupCode: list[i].startupCode
                    })
                }

                this.setState({
                    tableData: datalist,
                    loading: false,
                    pageMax: d.data.total,
                    pageLength: d.data.list.length,
                }, () => {
                    console.log(this.state.tableData);
                });
            })

    }

    render() {
        let w = this;
        const columns = [
            {
                title: '通知名称',
                dataIndex: 'adviceName',
                width: 110,
                className: "td_hide",
                render: (text, record) =>{
                    return(
                        <Popover
                            placement="top"
                            title={null}
                            content={
                                record.adviceName
                            }
                        >
                            <span>{record.adviceName}</span>
                        </Popover>
                    )
                }
            },
            {
                title: '通知描述',
                dataIndex: 'adviceDescription',
                render: (text) => {
                    switch (text) {
                        case 'ACTIVITY':
                            return <span>活动</span>;
                        case 'DAILY':
                            return <span>日常</span>;
                        case 'GOODS':
                            return <span>商品</span>;
                        case 'SYSTEM':
                            return <span>系统</span>;
                        default:
                            return <span>-</span>;
                    }
                },
                width: 100,
            },
            {
                title: '通知类型',
                dataIndex: 'startupType',
                width: 90
            },
            {
                title: '目标用户',
                dataIndex: 'pushTarget',
                width: 110
            },
            {
                title: '推送时间',
                dataIndex: 'startTime',
                width: 110
            },
            {
                title: '发送数',
                dataIndex: 'pushNum',
                width: 110,
            },
            {
                title: '打开次数',
                dataIndex: 'openNum',
                width: 110,
            }, {
                title: '状态',
                dataIndex: 'status',
                width: 60,
            }, {
                title: '操作',
                dataIndex: 'edit',
                width: 150,
                render(text, record) {
                    return (
                        <div data-page="">
                            <Link target="_blank" to={`messageList/advertisement/updata/${record.startupCode}`} style={{ paddingRight: 4 }}>
                                <i className="i-action-ico i-edit"></i>
                            </Link>
                        </div>
                    )
                }
            }];

        return (
            <div>
                <div className="m-inSel">
                    <Search placeholder="搜索" enterButton style={{ width: 400,marginBottom:'10px' }} onSearch={(value) => { this.searchContent(value) }} />
                </div>
                <Spin tip="加载中..." spinning={this.state.loading} size="large" style={{ zIndex: 9999 }}>
                    <Table className="m-book-table t-nm-tab" columns={columns} dataSource={this.state.tableData} bordered pagination={false} scroll={{ y: ((this.state.pageLength > 13) ? 560 : 0) }} />
                </Spin>
                <div className="m-pagination-box">
                    <Pagination pageSizeOptions={['1', '20', '50', '100', '200', '500', '1000']} showSizeChanger showQuickJumper showTotal={total => `共 ${total} 条`} className="m-pagination" defaultPageSize={20} defaultCurrent={1} current={this.state.current} total={this.state.pageMax} onChange={this.pageChangeFun} onShowSizeChange={this.pageSizeFun} />
                </div>
            </div>
        )
    }
}
class Advert extends React.Component {
    constructor() {
        super()
        this.state = {
            tableData: [],
            pageMax: 0,
            pageLength: '',
            page: '0',
            pageSize: '20',
            current: 1,
            loading: false,
            adviceName: ''
        }
        this.pageChangeFun = this.pageChangeFun.bind(this);
        this.pageSizeFun = this.pageSizeFun.bind(this);
    }

    pageChangeFun(pageNum) {
        console.log(pageNum);
        this.setState({
            page: pageNum - 1,
            current: pageNum
        }, () => {
            this.messageListFn('STARTUP_AD', this.state.adviceName, this.state.pageSize, this.state.page);
        });
    }

    pageSizeFun(current, pageSize) {
        console.log(current, pageSize);
        this.setState({
            pageSize: pageSize,
            page: current - 1,
            current: current
        }, () => {
            this.messageListFn('STARTUP_AD', this.state.adviceName, this.state.pageSize, this.state.page);
        });
    }
    searchContent(value) {
        console.log(value);
        this.messageListFn(this.props.adviceType, value, this.state.pageSize, this.state.page);
    }

    componentDidMount() {
        console.log(this.props.adviceType);
        this.messageListFn(this.props.adviceType, this.state.adviceName, this.state.pageSize, this.state.page);
    }
    toDate(number) {
        var n = number * 1;
        var date = new Date(n);
        var Y = date.getFullYear() + '-';
        var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate() + ' ';
        var h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours() + ':';
        var m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes() + ':';
        var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
        return (Y + M + D + h + m + s)
    }

    async messageListFn(adviceType, adviceName, pageSize, page) {
        this.setState({
            loading: true
        });
        var data = await fetch(util.url, {
            mode: "cors",
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: "method=ella.operation.getAdviceList" + "&content=" + JSON.stringify({ "adviceType": adviceType, "adviceName": adviceName, "pageSize": pageSize, "page": page }) + commonData.dataString
        }).then(res => res.json())
            .then((d) => {
                console.log(d);
                const datalist = [];
                var list = d.data.list;
                for (let i = 0; i < list.length; i++) {
                    var startupType = list[i].startupType;
                    var pushTarget = list[i].pushTarget;
                    var status = list[i].status;
                    //通知类型
                    if (startupType == 'STARTUP_POPUP') {
                        startupType = '启动弹窗';
                    } else if (startupType == 'STARTUP_AD') {
                        startupType = '启动广告';
                    } else if (startupType == 'PUSH_MESSAGE') {
                        startupType = '推送消息';
                    } else {
                        startupType = '-';
                    }
                    //推送目标
                    if (pushTarget == 'ALL_USER') {
                        pushTarget = '所有用户';
                    } else if (pushTarget == 'REGISTER_USER') {
                        pushTarget = '注册用户';
                    } else if (pushTarget == 'GUEST_USER') {
                        pushTarget = '游客用户';
                    } else if (pushTarget == 'IOS_USER') {
                        pushTarget = '苹果用户';
                    } else if (pushTarget == 'ANDROID_USER') {
                        pushTarget = '安卓用户';
                    } else if (pushTarget == 'VIP_USER') {
                        pushTarget = '会员用户';
                    } else if (pushTarget == 'SINGLE_USER') {
                        pushTarget = '单个用户'
                    } else if (pushTarget == 'CUSTOMIZED_USER') {
                        pushTarget = '自定义用户'
                    } else {
                        pushTarget = '-';
                    }
                    //状态
                    if (status == 'PUSH_NO') {
                        status = '未推送';
                    } else if (status == 'PUSHING') {
                        status = '正在推送';
                    } else if (status == 'SUCCESS') {
                        status = '成功';
                    } else if (status == 'FAIL') {
                        status = '失败';
                    } else if (status == 'EXCEPTION') {
                        status = '异常';
                    } else {
                        status = '-';
                    }
                    datalist.push({
                        adviceName: (list[i].adviceName == '' || list[i].adviceName == null) ? '-' : list[i].adviceName,
                        adviceDescription: (list[i].adviceDescription == '' || list[i].adviceDescription == null) ? '-' : list[i].adviceDescription,
                        startupType: startupType,
                        pushTarget: pushTarget,
                        startTime: (list[i].startTime == '' || list[i].startTime == null) ? '-' : list[i].startTime,
                        pushNum: (list[i].pushNum == '' || list[i].pushNum == null) ? '-' : list[i].pushNum,
                        openNum: (list[i].openNum == '' || list[i].openNum == null) ? '-' : list[i].openNum,
                        status: status,
                        startupCode: list[i].startupCode
                    })
                }

                this.setState({
                    tableData: datalist,
                    loading: false,
                    pageMax: d.data.total,
                    pageLength: d.data.list.length,
                }, () => {
                    console.log(this.state.tableData);
                });
            })

    }

    render() {
        let w = this;
        const columns = [
            {
                title: '通知名称',
                dataIndex: 'adviceName',
                width: 110,
                className: "td_hide",
                render: (text, record) =>{
                    return(
                        <Popover
                            placement="top"
                            title={null}
                            content={
                                record.adviceName
                            }
                        >
                            <span>{record.adviceName}</span>
                        </Popover>
                    )
                }
            },
            {
                title: '通知描述',
                dataIndex: 'adviceDescription',
                render: (text) => {
                    switch (text) {
                        case 'ACTIVITY':
                            return <span>活动</span>;
                        case 'DAILY':
                            return <span>日常</span>;
                        case 'GOODS':
                            return <span>商品</span>;
                        case 'SYSTEM':
                            return <span>系统</span>;
                        default:
                            return <span>-</span>;
                    }
                },
                width: 100,
            },
            {
                title: '通知类型',
                dataIndex: 'startupType',
                width: 90
            },
            {
                title: '目标用户',
                dataIndex: 'pushTarget',
                width: 110
            },
            {
                title: '推送时间',
                dataIndex: 'startTime',
                width: 110
            },
            {
                title: '发送数',
                dataIndex: 'pushNum',
                width: 110,
            },
            {
                title: '打开次数',
                dataIndex: 'openNum',
                width: 110,
            }, {
                title: '状态',
                dataIndex: 'status',
                width: 60,
            }, {
                title: '操作',
                dataIndex: 'edit',
                width: 150,
                render(text, record) {
                    return (
                        <div data-page="">
                            <Link  target="_blank" to={`/messageList/lightningAdvertisement/updata/${record.startupCode}`} style={{ paddingRight: 4 }}>
                                <i className="i-action-ico i-edit"></i>
                            </Link>
                        </div>
                    )
                }
            }];

        return (
            <div>
                <div className="m-inSel">
                    <Search placeholder="搜索" enterButton style={{ width: 400,marginBottom:'10px' }} onSearch={(value) => { this.searchContent(value) }} />
                </div>
                <Spin tip="加载中..." spinning={this.state.loading} size="large" style={{ zIndex: 9999 }}>
                    <Table className="m-book-table t-nm-tab" columns={columns} dataSource={this.state.tableData} bordered pagination={false} scroll={{ y: ((this.state.pageLength > 13) ? 560 : 0) }} />
                </Spin>
                <div className="m-pagination-box">
                    <Pagination pageSizeOptions={['20', '50', '100', '200', '500', '1000']} showSizeChanger showQuickJumper showTotal={total => `共 ${total} 条`} className="m-pagination" defaultPageSize={20} defaultCurrent={1} current={this.state.current} total={this.state.pageMax} onChange={this.pageChangeFun} onShowSizeChange={this.pageSizeFun} />
                </div>
            </div>
        )
    }
}
class News extends React.Component {
    constructor() {
        super()
        this.state = {
            tableData: [],
            pageMax: 0,
            pageLength: '',
            page: '0',
            pageSize: '20',
            current: 1,
            loading: false,
            adviceName: '',
            selectedRowKeys: []
        }
        this.pageChangeFun = this.pageChangeFun.bind(this);
        this.pageSizeFun = this.pageSizeFun.bind(this);
    }

    pageChangeFun(pageNum) {
        console.log(pageNum);
        this.setState({
            page: pageNum - 1,
            current: pageNum
        }, () => {
            this.messageListFn('PUSH_MESSAGE', this.state.adviceName, this.state.pageSize, this.state.page);
        });
    }

    pageSizeFun(current, pageSize) {
        console.log(current, pageSize);
        this.setState({
            pageSize: pageSize,
            page: current - 1,
            current: current
        }, () => {
            this.messageListFn('PUSH_MESSAGE', this.state.adviceName, this.state.pageSize, this.state.page);
        });
    }
    searchContent(value) {
        console.log(value);
        this.messageListFn(this.props.adviceType, value, this.state.pageSize, this.state.page);
    }

    componentDidMount() {
        console.log(this.props.adviceType);
        this.messageListFn(this.props.adviceType, this.state.adviceName, this.state.pageSize, this.state.page);
    }
    toDate(number) {
        var n = number * 1;
        var date = new Date(n);
        var Y = date.getFullYear() + '-';
        var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate() + ' ';
        var h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours() + ':';
        var m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes() + ':';
        var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
        return (Y + M + D + h + m + s)
    }

    async messageListFn(adviceType, adviceName, pageSize, page) {
        this.setState({
            loading: true
        });
        var data = await fetch(util.url, {
            mode: "cors",
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: "method=ella.operation.getAdviceList" + "&content=" + JSON.stringify({ "adviceType": adviceType, "adviceName": adviceName, "pageSize": pageSize, "page": page }) + commonData.dataString
        }).then(res => res.json())
            .then((d) => {
                console.log(d);
                const datalist = [];
                var list = d.data.list;
                for (let i = 0; i < list.length; i++) {
                    var messageType = list[i].messageType;
                    var pushTarget = list[i].pushTarget;
                    var status = list[i].status;
                    //通知类型
                    if (messageType == 'STARTUP_POPUP') {
                        messageType = '启动弹窗';
                    } else if (messageType == 'STARTUP_AD') {
                        messageType = '启动广告';
                    } else if (messageType == 'PUSH_MESSAGE') {
                        messageType = '推送消息';
                    } else {
                        messageType = '-';
                    }
                    //推送目标
                    if (pushTarget == 'ALL_USER') {
                        pushTarget = '所有用户';
                    } else if (pushTarget == 'SINGLE_USER') {
                        pushTarget = '单个用户';
                    } else if (pushTarget == 'CLIENT_SIDE') {
                        pushTarget = '客户端';
                    } else if (pushTarget == 'CHANNEL') {
                        pushTarget = '渠道';
                    } else if (pushTarget == 'USER_TYPE') {
                        pushTarget = '用户类型';
                    } else if (pushTarget == 'VIP') {
                        pushTarget = '会员';
                    } else if (pushTarget == 'IOS_USER') {
                        pushTarget = '苹果用户';
                    } else if (pushTarget == 'ANDROID_USER') {
                        pushTarget = '安卓用户';
                    } else if (pushTarget == 'CUSTOMIZED_USER') {
                        pushTarget = '自定义用户'
                    } else {
                        pushTarget = '-';
                    }
                    //状态
                    if (status == 'PUSH_NO') {
                        status = '未推送';
                    } else if (status == 'PUSHING') {
                        status = '正在推送';
                    } else if (status == 'SUCCESS') {
                        status = '成功';
                    } else if (status == 'FAIL') {
                        status = '失败';
                    } else if (status == 'EXCEPTION') {
                        status = '异常';
                    } else {
                        status = '-';
                    }
                    datalist.push({
                        adviceName: (list[i].adviceName == '' || list[i].adviceName == null) ? '-' : list[i].adviceName,
                        adviceDescription: (list[i].adviceDescription == '' || list[i].adviceDescription == null) ? '-' : list[i].adviceDescription,
                        messageType: messageType,
                        pushTarget: pushTarget,
                        startTime: list[i].startTime || '-',
                        pushNum: (list[i].pushNum == '' || list[i].pushNum == null) ? '-' : list[i].pushNum,
                        openNum: (list[i].openNum == '' || list[i].openNum == null) ? '-' : list[i].openNum,
                        status: status,
                        messageCode: list[i].messageCode
                    })
                }

                this.setState({
                    tableData: datalist,
                    loading: false,
                    pageMax: d.data.total,
                    pageLength: d.data.list.length,
                }, () => {
                    console.log(this.state.tableData);
                });
            })

    }

    render() {
        let w = this;
        const columns = [
            {
                title: '通知名称',
                dataIndex: 'adviceName',
                width: 110,
                className: "td_hide",
                render: (text, record) =>{
                    return(
                        <Popover
                            placement="top"
                            title={null}
                            content={
                                record.adviceName
                            }
                        >
                            <span>{record.adviceName}</span>
                        </Popover>
                    )
                }
            },
            {
                title: '通知描述',
                dataIndex: 'adviceDescription',
                render: (text) => {
                    switch (text) {
                        case 'ACTIVITY':
                            return <span>活动</span>;
                        case 'DAILY':
                            return <span>日常</span>;
                        case 'GOODS':
                            return <span>商品</span>;
                        case 'SYSTEM':
                            return <span>系统</span>;
                        default:
                            return <span>-</span>;
                    }
                },
                width: 100,
            },
            {
                title: '通知类型',
                dataIndex: 'messageType',
                width: 90
            },
            {
                title: '目标用户',
                dataIndex: 'pushTarget',
                width: 110
            },
            {
                title: '推送时间',
                dataIndex: 'startTime',
                width: 110
            },
            {
                title: '发送数',
                dataIndex: 'pushNum',
                width: 110,
            },
            {
                title: '打开次数',
                dataIndex: 'openNum',
                width: 110,
            }, {
                title: '状态',
                dataIndex: 'status',
                width: 60,
            }, {
                title: '操作',
                dataIndex: 'edit',
                width: 150,
                render(text, record) {
                    return (
                        <div data-page="">
                            <Link  target="_blank" to={`/messageList/addNewMessage/${record.messageCode}`} style={{ paddingRight: 4 }}>
                                <i className="i-action-ico i-edit"></i>
                            </Link>
                        </div>
                    )
                }
            }];
        const { selectedRowKeys } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: (selectedRowKeys, selectedRows) => {
                console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
                this.setState({
                    selectedRowKeys: selectedRowKeys
                })
            },
            onSelect: (record, selected, selectedRows, nativeEvent) => {
                console.log(record, selected, selectedRows, nativeEvent)
            }
        }

        return (
            <div>
                <div className="m-inSel">
                    <Search placeholder="搜索" enterButton style={{ width: 400,marginBottom:'10px' }} onSearch={(value) => { this.searchContent(value) }} />
                </div>
                <Spin tip="加载中..." spinning={this.state.loading} size="large" style={{ zIndex: 9999 }}>
                    <Table
                        className="m-book-table t-nm-tab"
                        columns={columns}
                        dataSource={this.state.tableData}
                        bordered
                        pagination={false}
                        scroll={{ y: ((this.state.pageLength > 13) ? 560 : 0) }}
                        // rowSelection={rowSelection}
                    />
                </Spin>
                <div className="m-pagination-box">
                    <Pagination pageSizeOptions={['20', '40', '60', '80', '100']} showSizeChanger showQuickJumper showTotal={total => `共 ${total} 条`} className="m-pagination" defaultPageSize={20} defaultCurrent={1} current={this.state.current} total={this.state.pageMax} onChange={this.pageChangeFun} onShowSizeChange={this.pageSizeFun} />
                </div>
            </div>
        )
    }
}