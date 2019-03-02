import React from 'react'
import { Table, Icon, Button, message, Popconfirm, Spin, Input, Pagination, Modal, Tabs } from 'antd'
import { Link } from 'react-router'
import getUrl from "../util.js"
import commonData from '../commonData.js'
import ClassifyDetail from './pushBookList.js'
import 'whatwg-fetch'
const Search = Input.Search;
const util = require('../util.js');
const confirm = Modal.confirm;
const TabPane = Tabs.TabPane;

export default class pushIpList extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            lists: [],
            onlineBookIPList: [],
            onlineBookIPList_SHELVES_ON: [],
            onlineBookIPList_SHELVES_OFF: [],
            pageIndex: 0,
            selectedRowKeys: [],
            minheight: '',
            loading: false,
            ipName: '',
            bookList: [],
            bookLoading: false,

            total: '',
            pageMax: 0,
            page: '0',
            pageSize: '20',
            current: 1
        }
        this.pageChangeFun = this.pageChangeFun.bind(this);
        this.pageSizeFun = this.pageSizeFun.bind(this);
    }

    //IP列表
    fetchFn = async (ipName) => {
        this.setState({
            loading: true
        });
        var data = await fetch(util.url, {
            method: 'POST',
            headers: {
                "Content-type": "application/x-www-form-urlencoded"
            },
            mode: 'cors',
            body: "method=ella.operation.getBookIPList" + "&content=" + JSON.stringify({ "ipName": ipName, "pageVo": { "page": this.state.page, "pageSize": this.state.pageSize } }) + commonData.dataString
        })
            .then(function (res) {
                return res.json();
            });
        if (data.status == 1) {
            this.setState({
                total: data.data.total,
                pageMax: data.data.total,
                lists: data.data.bookIPList,
                loading: false
            });
        } else {
            message.error(data.message);
            this.setState({
                loading: false
            });
        }
    }
    async fetchFnOnline(ipName) {
        var data = await fetch(util.url, {
            method: 'POST',
            headers: {
                "Content-type": "application/x-www-form-urlencoded"
            },
            mode: 'cors',
            body: "method=ella.operation.getBookIPList" + "&content=" + JSON.stringify({ "ipName": ipName, 'type': 'ONLINE', "pageVo": { "page": 0, "pageSize": 40 } }) + commonData.dataString
        })
            .then(function (res) {
                return res.json();
            });
        if (data.status == 1) {
            let onlineBookIPList = data.data.bookIPList;
            let compare = function (obj1, obj2) {
                var val1 = obj1.idx;
                var val2 = obj2.idx;
                if (val1 < val2) {
                    return -1;
                } else if (val1 > val2) {
                    return 1;
                } else {
                    return 0;
                }
            }
            onlineBookIPList.sort(compare);


            let onlineBookIPList_SHELVES_ON = [];
            let onlineBookIPList_SHELVES_OFF = [];
            onlineBookIPList.map((item) => {
                if (item.shelvesFlag === 'SHELVES_ON') {
                    onlineBookIPList_SHELVES_ON.push(item)
                } else {
                    onlineBookIPList_SHELVES_OFF.push(item)
                }
            })

            this.setState({
                onlineBookIPList: onlineBookIPList_SHELVES_ON.concat(onlineBookIPList_SHELVES_OFF),
                onlineBookIPList_SHELVES_ON: onlineBookIPList_SHELVES_ON,
                onlineBookIPList_SHELVES_OFF: onlineBookIPList_SHELVES_OFF
            });
        } else {
            message.error(data.message);
        }
    }

    pageChangeFun(pageNum) {
        this.setState({
            page: pageNum - 1,
            current: pageNum

        }, () => {
            this.fetchFn(this.state.ipName);
        });
    }
    pageSizeFun(current, pageSize) {
        this.setState({
            pageSize: pageSize,
            page: current - 1,
            current: current
        }, () => {
            this.fetchFn(this.state.ipName);
        });
    }
    //搜索框
    TopicSearch(value) {
        this.setState({
            ipName: value,
            page: 0,
            current: 1
        })
        this.fetchFn(value);
        this.fetchFnOnline(value);
    }

    deleteFn = async (ipCode) => {
        var doc = {
            ipCode: ipCode,
        }
        var data = await fetch(util.url, {
            method: 'POST',
            headers: {
                "Content-type": "application/x-www-form-urlencoded"
            },
            mode: 'cors',
            body: "method=ella.operation.delBookIPByIpCode" + "&content=" + JSON.stringify(doc) + commonData.dataString
        })
            .then(function (response) {
                return response.json();
            });
        if (data.status == 1) {
            message.success(`删除成功！`);
            this.fetchFn(this.state.ipName);
            this.fetchFnOnline(this.state.ipName);
        } else {
            message.error(`删除失败！`);
        }
    }

    onDelete = (ipCode) => {
        if (util.operationTypeCheck('DELETE')) {
            this.deleteFn(ipCode)
        } else {
            message.error('您没有权限删除该数据！');
        }
    }

    componentDidMount() {
        if (util.operationTypeCheck('RETRIEVE')) {
            this.fetchFn('');
            this.fetchFnOnline('');
        } else {
            message.error('您没有权限查看该数据！');
        }
    }
    //置顶
    setTopFn = async (moveTopModuleIdx, ipCode) => {
        if (this.state.onlineBookIPList_SHELVES_ON[0].idx === moveTopModuleIdx) {
            message.warning('已经在最顶端！');
            return;
        }
        var doc = {
            moveTopModuleCode: ipCode,
            moveTopModuleIdx: moveTopModuleIdx,
        }
        var data = await fetch(util.url, {
            method: 'POST',
            headers: {
                "Content-type": "application/x-www-form-urlencoded"
            },
            mode: 'cors',
            body: "method=ella.operation.topBookIP" + "&content=" + JSON.stringify(doc) + commonData.dataString
        })
            .then(function (response) {
                return response.json();
            });
        console.log(data);
        if (data.status == 1) {
            message.success(`置顶成功！`);
            this.fetchFn(this.state.ipName);
            this.fetchFnOnline(this.state.ipName);
        } else {
            message.error(data.message);
        }
    }
    //排序
    sortFn = async (moveIdx, ipCode, moveType) => {
        if (this.state.onlineBookIPList.length === 1) {
            message.warning('已经在最顶端！');
            return;
        }
        var doc = {
            moveCode: ipCode,
            moveIdx: moveIdx,
            moveType: moveType
        }
        var data = await fetch(util.url, {
            method: 'POST',
            headers: {
                "Content-type": "application/x-www-form-urlencoded"
            },
            mode: 'cors',
            body: "method=ella.operation.moveBookIP" + "&content=" + JSON.stringify(doc) + commonData.dataString
        })
            .then(function (response) {
                return response.json();
            });
        if (data.status == 1) {
            // message.success(`删除成功！`);
            this.fetchFn(this.state.ipName);
            this.fetchFnOnline(this.state.ipName)
        } else {
            message.error(data.message);
        }
    }
    arrowUp = (idx, ipCode, moveType) => {
        if (util.operationTypeCheck('UPDAT')) {
            if (this.state.onlineBookIPList_SHELVES_ON[0].idx === idx) {
                message.warning(`不可向上移！`);
            } else {
                this.sortFn(idx, ipCode, moveType);
            }
        } else {
            message.error('您没有权限操作该数据！');
        }


    }
    arrowDown = (idx, ipCode, moveType) => {
        if (util.operationTypeCheck('UPDAT')) {
            if (this.state.onlineBookIPList_SHELVES_ON[this.state.onlineBookIPList.length - 1].idx === idx) {
                message.warning(`不可向下移！`);
            }
            else {
                this.sortFn(idx, ipCode, moveType);
            }
        } else {
            message.error('您没有权限操作该数据！');
        }

    }

    shelvesFlag(ipCode, shelvesFlag, showStatus) {
        fetch(util.url, {
            method: 'POST',
            headers: {
                "Content-type": "application/x-www-form-urlencoded"
            },
            mode: 'cors',
            body: "method=ella.operation.shelvesFlagBookIP" + "&content=" + JSON.stringify({
                ipCode: ipCode,
                shelvesFlag: shelvesFlag,
                showStatus: showStatus
            }) + commonData.dataString
        }).then((response) => {
            return response.json();
        }).then((data) => {
            if (data.status == 1) {
                message.success(`操作成功！`);
                this.fetchFn(this.state.ipName);
                this.fetchFnOnline(this.state.ipName)
            } else {
                message.error(data.message);
            }
        })
    }

    showClassBook = (ipCode) => {
        var w = this;
        w.setState({
            visible: true,
            ipCode: ipCode,
        });
    }
    handleCancel = () => {
        this.setState({
            visible: false
        });
    }
    async release() {
        let bookNumFlag = false;
        this.state.onlineBookIPList.map((item) => {
            if (item.bookIPQuantity == '0') {
                bookNumFlag = true;
            }
        })
        if (bookNumFlag) {
            message.error('上线主推IP图书数量不能为0');
            return;
        } else {
            var data = await fetch(util.url, {
                method: 'POST',
                headers: {
                    "Content-type": "application/x-www-form-urlencoded"
                },
                mode: 'cors',
                body: "method=ella.operation.updateIssueStatus" + "&content=" + JSON.stringify({ 'status': 'SHOW_ON' }) + commonData.dataString
            })
                .then(function (response) {
                    return response.json();
                });
            if (data.status == 1) {
                message.success('发布成功');
                this.fetchFn('');
                this.fetchFnOnline('');
            } else {
                message.error(data.message);
            }
        }
    }
    showConfirm = () => {
        var w = this;
        confirm({
            title: '请确认是否发布该主推IP模块?',
            okType: 'primary',
            cancelText: '继续编辑',
            onOk() {
                w.release();
            },
            onCancel() { },
        });
    }

    render() {
        var w = this;
        const columns = [{
            title: '排序',
            width: '5%',
            dataIndex: 'idx',
            render: (text, record, index) => {
                return index + 1
            }
        }, {
            title: '名称',
            width: '20%',
            dataIndex: 'ipName',
            render: (text, record) => {
                if (record.ipName == '') {
                    return (
                        <span>-</span>
                    )
                } else {
                    return (
                        <span>{record.ipName}</span>
                    )
                }
            }
        }, {
            title: '修改时间',
            width: '20%',
            dataIndex: 'updateTime',
            render: (text, record) => {
                if (record.updateTime == '') {
                    return (
                        <span>-</span>
                    )
                } else {
                    return (
                        <span>{record.updateTime}</span>
                    )
                }
            }
        }, {
            title: '图书',
            width: '10%',
            dataIndex: 'bookIPQuantity',
            render(text, record, index) {
                return (
                    <a onClick={() => w.showClassBook(record.ipCode)}>{record.bookIPQuantity}</a>
                )
            }
        }, {
            title: '展示状态',
            width: '10%',
            dataIndex: 'showStatus',
            render: (text, record) => {
                let txt = ''
                switch (text) {
                    case 'SHOW_WAIT':
                        txt = '未发布';
                        break;
                    case 'SHOW_ON':
                        txt = '已发布';
                        break;
                    case 'SHOW_OFF':
                        txt = '修改未发布';
                        break;
                    case 'SHOW_OFF_DOWN':
                        txt = '下线未发布';
                        break;
                    case 'SHOW_OFF_UP':
                        txt = '上线未发布';
                        break;
                    default:
                        txt = '-';
                }
                return txt;
            }
        }, {
            title: '操作',
            width: '20%',
            dataIndex: 'operate',
            render: (text, record) => {
                if (record.shelvesFlag === 'SHELVES_OFF') {
                    return (
                        <div style={{ textAlign: 'center' }} className='m-icon-type'>
                            <Link to={"/addPushIp?ipCode=" + record.ipCode + "&type=edit"} target="_blank" style={{ marginRight: '20px' }}><span className='i-action-ico i-edit'></span></Link>
                            <span style={{ marginRight: '20px' }} className='i-action-ico i-stick' onClick={() => { message.warning('不可做排序操作！') }}></span>
                            <span style={{ marginRight: '20px' }} className='i-action-ico i-up' onClick={() => { message.warning('不可做排序操作！') }}></span>
                            <span style={{ marginRight: '20px' }} className='i-action-ico i-down' onClick={() => { message.warning('不可做排序操作！') }}></span>
                            <Popconfirm title="确定删除吗?" onConfirm={() => this.onDelete(record.ipCode)}>
                                <span className='i-action-ico i-delete'></span>
                            </Popconfirm>
                        </div>
                    )
                } else {
                    return (
                        <div style={{ textAlign: 'center' }} className='m-icon-type'>
                            <Link to={"/addPushIp?ipCode=" + record.ipCode + "&type=edit"} target="_blank" style={{ marginRight: '20px' }}><span className='i-action-ico i-edit'></span></Link>
                            <span style={{ marginRight: '20px' }} className='i-action-ico i-stick' onClick={() => this.setTopFn(record.idx, record.ipCode)}></span>
                            <span style={{ marginRight: '20px' }} className='i-action-ico i-up' onClick={() => this.arrowUp(record.idx, record.ipCode, 'UP')}></span>
                            <span style={{ marginRight: '20px' }} className='i-action-ico i-down' onClick={() => this.arrowDown(record.idx, record.ipCode, 'DOWN')}></span>
                            <Popconfirm title="确定删除吗?" onConfirm={() => this.onDelete(record.ipCode)}>
                                <span className='i-action-ico i-delete'></span>
                            </Popconfirm>
                        </div>
                    )
                }
            }
        },
            {
                title: '状态操作',
                width: '20%',
                dataIndex: 'operateStatus',
                render: (text, record) => {
                    if (record.shelvesFlag === 'SHELVES_ON') {
                        return (
                            <span style={{ color: '#1890ff', cursor: 'pointer' }} onClick={() => this.shelvesFlag(record.ipCode, 'SHELVES_OFF', record.showStatus)}>下线</span>
                        )
                    } else {
                        return (
                            <span style={{ color: '#1890ff', cursor: 'pointer' }} onClick={() => this.shelvesFlag(record.ipCode, 'SHELVES_ON', record.showStatus)}>上线</span>
                        )
                    }
                }
            }]
        const columns2 = [...columns];

        columns2.splice(5, 1, {
            title: '操作',
            width: '20%',
            dataIndex: 'operate',
            render: (text, record) => {
                return (
                    <div style={{ textAlign: 'center' }} className='m-icon-type'>
                        <Link to={"/addPushIp?ipCode=" + record.ipCode + "&type=edit"} target="_blank" style={{ marginRight: '20px' }}><span className='i-action-ico i-edit'></span></Link>
                        <Popconfirm title="确定删除吗?" onConfirm={() => this.onDelete(record.ipCode)}>
                            <span className='i-action-ico i-delete'></span>
                        </Popconfirm>
                    </div>
                )
            }
        });

        return (
            <div>
                <p className="m-title">主推IP</p>
                <div className="m-rt-content">
                    <Link className='m-btn-add intervalRight' to="/addPushIp?type=add" ><Button type="primary" className="u-btn-add"><Icon type="plus" />添加新主推IP</Button></Link>
                    <Search placeholder="搜索" enterButton style={{ width: 400 }} onSearch={value => this.TopicSearch(value)} />
                    <Spin tip="加载中..." spinning={this.state.loading} size="large" style={{ zIndex: 9999 }}>
                        <Tabs defaultActiveKey="1">
                            <TabPane type="line" tab='上线主推IP' key="1">
                                <Table rowClassName={(record, index) => { if (record.shelvesFlag === 'SHELVES_OFF') { return 'el-tr-gary' } }} rowKey={(record, index) => index} columns={columns} dataSource={this.state.onlineBookIPList} bordered pagination={false} className="t-nm-tab" scroll={{ y: 570 }} />
                                <p style={{ marginTop: 10, textAlign: 'center' }}>
                                    <Button type='primary' onClick={() => { this.showConfirm() }}>发布</Button>
                                </p>
                            </TabPane>
                            <TabPane type="line" tab='全部主推IP' key="2">
                                <Table rowKey={(record, index) => index} columns={columns2} dataSource={this.state.lists} bordered pagination={false} className="t-nm-tab" scroll={{ y: 570 }} />
                                <div className="m-pagination-box">
                                    {getUrl.operationTypeCheck("UPDAT") ? <Pagination pageSizeOptions={['20', '40', '60', '80', '100']} showSizeChanger showQuickJumper showTotal={total => `共 ${this.state.total} 条`} className="m-pagination" defaultPageSize={20} defaultCurrent={1} current={this.state.current} total={this.state.total} onChange={this.pageChangeFun} onShowSizeChange={this.pageSizeFun} /> : null}
                                </div>
                            </TabPane>
                        </Tabs>
                    </Spin>
                    <Modal
                        visible={this.state.visible}
                        title="图书列表"
                        onCancel={this.handleCancel}
                        footer={null}
                        width={1000}
                    >
                        {this.state.visible && <ClassifyDetail ipCode={this.state.ipCode}></ClassifyDetail>}
                    </Modal>
                </div>
            </div>
        )
    }
}
