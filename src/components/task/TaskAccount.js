import React from 'react'
import { Button, Table, message, Icon, Spin, Row, Col, Select, Pagination, Input, DatePicker, Popover } from 'antd';
import { Link } from 'react-router';
import getUrl from '../util';
import commonData from '../commonData.js'
import moment from 'moment';
const Search = Input.Search;
class TaskAccount extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            dataSource: [],
            total: 0,
            loading: false,
            pageMax: 0,
            page: '0',
            pageSize: '20',
            current: 1,
            fullSearch: false,

            searchKey: 'uid',

            actionList: [],

            searchValue: '',

            receiveBeginTime: "",
            receiveEndTime: "",
            updateBeginTime: "",
            updateEndTime: "",
            taskStatus: "",
            taskType: "",
            actionCode: "",
            rewardType: "",

            searchData: {
                searchValue: '',

                uid: "",
                taskName: "",
                taskCode: "",
                receiveBeginTime: "",
                receiveEndTime: "",
                updateBeginTime: "",
                updateEndTime: "",
                taskStatus: "",
                taskType: "",
                actionCode: "",
                rewardType: ""
            }
        };
        this.pageChangeFun = this.pageChangeFun.bind(this);
        this.pageSizeFun = this.pageSizeFun.bind(this);
        this.toggleSearch = this.toggleSearch.bind(this);
        this.onSearch = this.onSearch.bind(this);
    }
    setStateData(str, value) {
        this.setState({
            [str]: value
        })
    }
    //任务列表
    fetchModuleList(page, pageSize) {
        this.setState({
            loading: true
        })
        let parameter = {
            uid: this.state.searchData.uid,
            taskName: this.state.searchData.taskName,
            taskCode: this.state.searchData.taskCode,
            receiveBeginTime: this.state.searchData.receiveBeginTime,
            receiveEndTime: this.state.searchData.receiveEndTime,
            updateBeginTime: this.state.searchData.updateBeginTime,
            updateEndTime: this.state.searchData.updateEndTime,
            taskStatus: this.state.searchData.taskStatus,
            taskType: this.state.searchData.taskType,
            actionCode: this.state.searchData.actionCode,
            rewardType: this.state.searchData.rewardType,
            pageVo: {
                "page": page,
                "pageSize": pageSize
            }
        }
        fetch(getUrl.url, {
            method: "POST",
            mode: 'cors',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: "method=ella.operation.getBaseTaskList" + "&content=" + JSON.stringify(parameter) + commonData.dataString,
        }).then(res => res.json()).then((data) => {
            if (data.status == '1') {
                this.setState({
                    dataSource: data.data.list,
                    total: data.data.total,
                    pageMax: data.data.total,
                    pageLength: data.data.totalPage,
                    loading: false
                })
            } else {
                message.error(data.message)
            }
        }).catch(e => {
            console.log(e.message)
        })
    }
    getTaskActionList() {
        fetch(getUrl.url, {
            method: "POST",
            mode: 'cors',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: "method=ella.operation.getTaskActionList" + commonData.dataString,
        }).then(res => res.json()).then((data) => {
            if (data.status == '1') {
                this.setState({
                    actionList: data.data
                })
            } else {
                message.error(data.message)
            }
        }).catch(e => {
            console.log(e.message)
        })
    }
    componentDidMount() {
        this.fetchModuleList(this.state.page, this.state.pageSize);
        this.getTaskActionList();
    }
    toggleSearch() {
        if (!this.state.fullSearch) {
            this.setState({ fullSearch: !this.state.fullSearch })
        } else {
            this.setState({
                fullSearch: !this.state.fullSearch,
                searchValue: this.state.searchValue,
                receiveEndTime: "",
                updateBeginTime: "",
                updateEndTime: "",
                taskStatus: "",
                taskType: "",
                actionCode: "",
                rewardType: "",
                searchData: {
                    uid: this.state.searchData.uid,
                    taskName: this.state.searchData.taskName,
                    taskCode: this.state.searchData.taskCode,
                    receiveBeginTime: "",
                    receiveEndTime: "",
                    updateBeginTime: "",
                    updateEndTime: "",
                    taskStatus: "",
                    taskType: "",
                    actionCode: "",
                    rewardType: ""
                }
            })
        }
    }
    onSearch(value) {
        this.setState({
            current: 1,
            page: '0',
            searchData: {
                uid: this.state.searchKey === 'uid' ? this.state.searchValue : '',
                taskName: this.state.searchKey === 'taskName' ? this.state.searchValue : '',
                taskCode: this.state.searchKey === 'taskCode' ? this.state.searchValue : '',
                receiveBeginTime: this.state.receiveBeginTime,
                receiveEndTime: this.state.receiveEndTime,
                updateBeginTime: this.state.updateBeginTime,
                updateEndTime: this.state.updateEndTime,
                taskStatus: this.state.taskStatus,
                taskType: this.state.taskType,
                actionCode: this.state.actionCode,
                rewardType: this.state.rewardType,
            }
        }, () => {
            this.fetchModuleList(0, this.state.pageSize)
        })
    }
    pageSizeFun(current, pageSize) {
        this.setState({
            pageSize: pageSize,
            page: current - 1,
            current: current
        }, () => {
            this.fetchModuleList(this.state.page, this.state.pageSize);
        });
    }
    pageChangeFun(pageNum) {
        this.setState({
            page: pageNum - 1,
            current: pageNum
        }, () => {
            this.fetchModuleList(this.state.page, this.state.pageSize);
        });
    }
    setStartOrEndData(date, dateString, str) {
        this.setState({
            [str]: dateString
        })
    }
    //恢复默认设置
    clearSelect() {
        this.setState({
            receiveBeginTime: "",
            receiveEndTime: "",
            updateBeginTime: "",
            updateEndTime: "",
            taskStatus: "",
            taskType: "",
            actionCode: "",
            rewardType: "",
            searchValue: '',
            searchData: {
                searchValue: '',
                uid: "",
                taskName: "",
                taskCode: '',
                receiveBeginTime: "",
                receiveEndTime: "",
                updateBeginTime: "",
                updateEndTime: "",
                taskStatus: "",
                taskType: "",
                actionCode: "",
                rewardType: ""
            }
        })
    }
    render() {
        const columns = [{
            title: '任务编号',
            dataIndex: 'taskCode',
            key: 'taskCode',
            width: '12%',
            render: (text, record) => {
                return (
                    <Popover
                        placement="top"
                        title={null}
                        content={
                            record.taskCode
                        }
                    >
                        {record.taskCode || '-'}
                    </Popover>
                )
            }
        }, {
            title: '用户id',
            dataIndex: 'uid',
            key: 'uid',
            width: '12%',
            render: (text, record) => {
                return (
                    <Popover
                        placement="top"
                        title={null}
                        content={record.uid}
                    >
                        {record.uid ? <Link style={{ textDecoration: 'underline' }} target="_blank" to={"/userList?uid=" + record.uid}>
                            {record.uid}
                        </Link> : '-'}
                    </Popover>
                )
            }
        }, {
            title: '任务名称',
            dataIndex: 'taskName',
            key: 'taskName',
            width: '10%',
            className: "td_hide",
            render: (text, record) => {
                return (record.taskName || '-')
            }
        }, {
            title: '接取时间',
            dataIndex: 'createTime',
            key: 'createTime',
            width: '10%',
            render: (text, record) => {
                return (record.createTime || '-')
            }
        }, {
            title: '完成时间',
            dataIndex: 'completionTime',
            key: 'completionTime',
            width: '10%',
            render: (text, record) => {
                return (record.completionTime || '-')
            }
        }, {
            title: '任务状态',
            dataIndex: 'taskStatus',
            key: 'taskStatus',
            width: '6%',
            render: (text, record) => {
                let txt = ''
                switch (record.taskStatus) {
                    case 'HAS_RECEIVE':
                        txt = '已领取';
                        break;
                    case 'HAS_EXPIRED':
                        txt = '已过期';
                        break;
                    case 'HAS_COMPLETED':
                        txt = '已完成';
                        break;
                    default:
                        txt = '-';
                }
                return txt;
            }
        }, {
            title: '任务类型',
            dataIndex: 'taskType',
            key: 'taskType',
            width: '6%',
            render: (text, record) => {
                let txt = ''
                switch (record.taskType) {
                    case 'ACTIVE_TASK':
                        txt = '活跃任务';
                        break;
                    case 'READ_TASK':
                        txt = '阅读任务';
                        break;
                    case 'PAID_BEHAVIOR_TASK':
                        txt = '付费行为 ';
                        break;
                    case 'SOCIAL_PROPAGATE':
                        txt = '社交传播 ';
                        break;
                    default:
                        txt = '-';
                }
                return txt;
            }
        }, {
            title: '任务行为',
            dataIndex: 'actionName',
            key: 'actionName',
            width: '10%',
            render: (text, record) => {
                return (record.actionName || '-')
            }
        }, {
            title: '奖励内容',
            dataIndex: 'rewardType',
            key: 'rewardType',
            width: '5%',
            render: (text, record) => {
                let txt = ''
                switch (record.rewardType) {
                    case 'POINT':
                        txt = '积分';
                        break;
                    case 'BOOK':
                        txt = '图书';
                        break;
                    case 'BOOK_PACKAGE':
                        txt = '图书包';
                        break;
                    case 'COURSE':
                        txt = '课程';
                        break;
                    case 'VIP':
                        txt = '会员';
                        break;
                    case 'COUPON':
                        txt = '红包';
                        break;
                    case 'MEDAL':
                        txt = '勋章';
                        break;
                    default:
                        txt = '-';
                }
                return txt;
            }
        }, {
            title: '奖励参数',
            dataIndex: 'rewardContent',
            key: 'rewardContent',
            width: '10%',
            render: (text, record) => {
                return (record.rewardContent || '-')
            }
        }, {
            title: '操作',
            dataIndex: 'edit',
            width: '8%',
            render: (text, record) => {
                return (
                    <div>
                        <Link target="_blank" to={"/taskDetail?recordId=" + record.recordId + '&taskCode=' + record.taskCode + '&from=taskAccount'}>
                            查看详情
                        </Link>
                    </div>
                )
            }

        }];
        return (
            <div id="TaskAccount">
                <p className="m-title">任务记录查询</p>
                <div className="m-rt-content">
                    <div style={{ marginBottom: 20 }}>
                        <Select defaultValue="uid" className="selectWidth intervalRight" onChange={(value) => { this.setStateData("searchKey", value) }}>
                            <Select.Option value="uid">用户id</Select.Option>
                            <Select.Option value="taskName">任务名称</Select.Option>
                            <Select.Option value="taskCode">任务编号</Select.Option>
                        </Select>
                        <Search placeholder="输入检索内容" value={this.state.searchValue} onChange={(e) => { this.setStateData("searchValue", e.target.value) }} enterButton className="searchWidth intervalRight" onSearch={(value) => { this.onSearch(value); }} />
                        <Button className="theSearch u-btn-green" onClick={this.toggleSearch}>更多条件<Icon type="down" /></Button>
                    </div>
                    {
                        this.state.fullSearch && <div className="showtime">
                            <div className="rowPartWrap">
                                <Row className="rowPart" style={{ marginBottom: 10 }}>
                                    <span className="colTitle">接取时间:</span>
                                    <DatePicker
                                        style={{ marginLeft: 10, width: 150 }}
                                        className="intervalBottom"
                                        showTime={{ format: 'HH:mm' }}
                                        format="YYYY-MM-DD"
                                        placeholder={'开始时间'}
                                        onChange={(value, dateString) => { this.setStartOrEndData(value, dateString, "receiveBeginTime") }}
                                        value={this.state.receiveBeginTime != '' ? moment(this.state.receiveBeginTime, 'YYYY-MM-DD') : null}
                                    />
                                    <span className="line"> — </span>
                                    <DatePicker
                                        className="intervalRight intervalBottom"
                                        style={{ width: 150 }}
                                        showTime={{ format: 'HH:mm' }}
                                        format="YYYY-MM-DD"
                                        placeholder={'结束时间'}
                                        onChange={(value, dateString) => { this.setStartOrEndData(value, dateString, "receiveEndTime") }}
                                        value={this.state.receiveEndTime != '' ? moment(this.state.receiveEndTime, 'YYYY-MM-DD') : null}
                                    />
                                    <span className="colTitle">任务状态:</span>
                                    <Select style={{ marginLeft: 10, width: 130 }} className="intervalRight intervalBottom" defaultValue='全部' value={this.state.taskStatus} onChange={(value) => { this.setStateData("taskStatus", value) }}>
                                        <Select.Option value=''>全部</Select.Option>
                                        <Select.Option value='HAS_RECEIVE'>已领取 </Select.Option>
                                        <Select.Option value='HAS_EXPIRED'>已过期 </Select.Option>
                                        <Select.Option value='HAS_COMPLETED'>已完成 </Select.Option>
                                    </Select>

                                    <span className="colTitle">任务类型:</span>
                                    <Select style={{ marginLeft: 10, width: 130 }} className="intervalRight intervalBottom" defaultValue='全部' value={this.state.taskType} onChange={(value) => { this.setStateData("taskType", value) }}>
                                        <Select.Option value=''>全部</Select.Option>
                                        <Select.Option value='ACTIVE_TASK'>活跃任务 </Select.Option>
                                        <Select.Option value='READ_TASK'>阅读任务 </Select.Option>
                                        <Select.Option value='PAID_BEHAVIOR_TASK'>付费行为 </Select.Option>
                                        <Select.Option value='SOCIAL_PROPAGATE'>社交传播 </Select.Option>
                                    </Select>
                                    <span className="colTitle">任务行为:</span>
                                    <Select style={{ marginLeft: 10, width: 200 }} className="intervalRight intervalBottom" defaultValue='全部' value={this.state.actionCode} onChange={(value) => { this.setStateData("actionCode", value) }}>
                                        <Select.Option value=''>全部</Select.Option>
                                        {
                                            this.state.actionList.map((item, i) => <Select.Option value={item.actionCode} key={i}>{item.actionName} </Select.Option>)
                                        }
                                    </Select>
                                </Row>
                                <Row>
                                    <span className="colTitle">修改时间:</span>
                                    <DatePicker
                                        style={{ marginLeft: 10, width: 150 }}
                                        className="intervalBottom"
                                        showTime={{ format: 'HH:mm' }}
                                        format="YYYY-MM-DD"
                                        placeholder={'开始时间'}
                                        onChange={(value, dateString) => { this.setStartOrEndData(value, dateString, "updateBeginTime") }}
                                        value={this.state.updateBeginTime != '' ? moment(this.state.updateBeginTime, 'YYYY-MM-DD') : null}
                                    />
                                    <span className="line"> — </span>
                                    <DatePicker
                                        className="intervalRight intervalBottom"
                                        style={{ width: 150 }}
                                        showTime={{ format: 'HH:mm' }}
                                        format="YYYY-MM-DD"
                                        placeholder={'结束时间'}
                                        onChange={(value, dateString) => { this.setStartOrEndData(value, dateString, "updateEndTime") }}
                                        value={this.state.updateEndTime != '' ? moment(this.state.updateEndTime, 'YYYY-MM-DD') : null}
                                    />
                                    <span className="colTitle">奖励内容:</span>
                                    <Select style={{ marginLeft: 10, width: 130 }} defaultValue='全部' value={this.state.rewardType} onChange={(value) => { this.setStateData("rewardType", value) }}>
                                        <Select.Option value=''>全部</Select.Option>
                                        <Select.Option value='POINT'>积分 </Select.Option>
                                        <Select.Option value='BOOK'>图书 </Select.Option>
                                        <Select.Option value='BOOK_PACKAGE'>图书包 </Select.Option>
                                        <Select.Option value='COURSE'>课程 </Select.Option>
                                        <Select.Option value='VIP'>会员 </Select.Option>
                                        <Select.Option value='COUPON'>红包 </Select.Option>
                                        <Select.Option value='MEDAL'>勋章 </Select.Option>
                                    </Select>
                                </Row>
                                <Row className="rowPart" style={{ marginBottom: 10 }}>
                                    <Col span={24} style={{ display: 'flex' }}>
                                        <Button className="u-btn-green" style={{ marginRight: 20 }} onClick={() => {
                                            this.setState({
                                                current: 1,
                                                page: '0',
                                                searchData: {
                                                    searchValue: this.state.searchValue,
                                                    uid: this.state.searchKey === 'uid' ? this.state.searchValue : '',
                                                    taskName: this.state.searchKey === 'taskName' ? this.state.searchValue : '',
                                                    taskCode: this.state.searchKey === 'taskCode' ? this.state.searchValue : '',
                                                    receiveBeginTime: this.state.receiveBeginTime,
                                                    receiveEndTime: this.state.receiveEndTime,
                                                    updateBeginTime: this.state.updateBeginTime,
                                                    updateEndTime: this.state.updateEndTime,
                                                    taskStatus: this.state.taskStatus,
                                                    taskType: this.state.taskType,
                                                    actionCode: this.state.actionCode,
                                                    rewardType: this.state.rewardType
                                                }
                                            }, () => { this.fetchModuleList(0, this.state.pageSize) });
                                        }}>查询</Button>
                                        <Button className="theSearch u-btn-green" onClick={() => this.clearSelect()}>恢复默认</Button>
                                    </Col>
                                </Row>
                            </div>
                            <hr />
                        </div>
                    }
                    <Spin tip="加载中..." spinning={this.state.loading} size="large" style={{ zIndex: 9999 }}>
                        <Table
                            rowKey={(record, index) => index}
                            columns={columns}
                            dataSource={this.state.dataSource}
                            pagination={false}
                            scroll={{ y: 570 }}
                            style={{ minWidth: 1050 }}
                        />
                    </Spin>
                    <div className="m-pagination-box">
                        {getUrl.operationTypeCheck("UPDAT") ? <Pagination pageSizeOptions={['20', '40', '60', '80', '100']} showSizeChanger showQuickJumper showTotal={total => `共 ${this.state.total} 条`} className="m-pagination" defaultPageSize={20} defaultCurrent={1} current={this.state.current} total={this.state.total} onChange={this.pageChangeFun} onShowSizeChange={this.pageSizeFun} /> : null}
                    </div>
                </div>
            </div >
        )
    }
}
export default TaskAccount;
