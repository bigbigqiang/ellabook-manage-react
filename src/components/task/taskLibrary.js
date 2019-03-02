import React from 'react'

import { Button, Table, Icon, message, Popconfirm, Modal, Spin, Row, Col, Select, Pagination, Input, Popover, Tooltip } from 'antd';
import { Link } from 'react-router';
import './taskLibrary.css';
import getUrl from '../util';
const Search = Input.Search;
const Option = Select.Option
class TaskLibrary extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            searchType: "",
            dataSource: [],
            total: 0,
            loading: false,
            status: '',
            pageMax: 0,
            page: '0',
            pageSize: '20',
            current: 1,
            // beginTime:'',
            // endTime:'',
            partTitle: '',
            isShow: false,
            createPartTime: '',
            endPartTime: '',
            targetType: null,
            visible: false, //模态框显示关闭
            actionList: [],//行为
            actionCode: null,//任务行为
            showFlag: null,//展示状态
            taskType: null,//任务类型
            taskTypeList: [],//任务类型列表
            taskRewardList: [],
            rewardType: null,
            taskStateList: [],//任务状态列表
            taskSearchType: "taskName",//搜索类型
            expireStatus: null

        };
        this.pageChangeFun = this.pageChangeFun.bind(this);
        this.pageSizeFun = this.pageSizeFun.bind(this);
    }
    componentDidMount() {
        this.fetchTaskRewardList();
        this.fetchModuleList("", 0);
        this.fetchTaskTypeData();
        this.fetchTaskStateData();
    }
    //任务状态
    fetchTaskStateData() {
        getUrl.API({ "groupId": "TASK_SHOW_FLAG" }, "ella.operation.boxSearchList")
            .then(response => response.json())
            .then(response => {
                if (response.status == 1) {
                    this.setState({
                        "taskStateList": response.data,
                    })
                } else {

                }
            })

    }
    fetchActionList(actionType) {
        getUrl.API({ actionType }, "ella.operation.getTaskActionList")
            .then(response => response.json())
            .then(response => {
                if (response.status == 1) {
                    this.setState({
                        actionList: response.data,
                    })

                } else {
                    console.log(response.message)
                }
            })
    }
    getSearchData(str, value) {
        this.setState({
            [str]: value
        })
    }
    //模块列表
    fetchModuleList(taskName, page) {
        this.setState({
            loading: true
        })
        var params = {
            "pageVo": {
                "page": page,
                "pageSize": this.state.pageSize
            },
            "showFlag": this.state.showFlag,
            "taskType": this.state.taskType,
            "actionCode": this.state.actionCode,
            "rewardType": this.state.rewardType,
            "expireStatus": this.state.expireStatus
        }
        if (this.state.taskSearchType == "taskCode") {
            params.taskCode = taskName;
        } else {
            params.taskName = taskName;
        }
        getUrl.API(params, "ella.operation.getOperationTaskList")
            .then(response => response.json())
            .then(response => {
                if (response.status == 1) {
                    this.setState({
                        dataSource: response.data.list,
                        total: response.data.total,
                        pageMax: response.data.total,
                        pageLength: response.data.list.length,
                        loading: false
                    })
                } else {
                    message.error(response.message)
                }
            })
    }
    //恢复默认设置
    clearSelect() {
        this.setState({
            // "beginTime":'',
            // "endTime":'',
            "showFlag": null,
            "taskType": null,
            "actionCode": null,
            "rewardType": null,
            "expireStatus": null

        })
    }
    //任务类型
    fetchTaskTypeData() {
        getUrl.API({ "groupId": "TASK_ACTION" }, "ella.operation.boxSearchList")
            .then(response => response.json())
            .then(response => {
                if (response.status == 1) {
                    this.setState({
                        "taskTypeList": response.data,
                    })
                } else {
                    console.log(response.message)
                }
            })

    }
    //任务奖励内容
    fetchTaskRewardList() {
        getUrl.API({ "groupId": "TASK_REWARD" }, "ella.operation.boxSearchList")
            .then(response => response.json())
            .then(response => {
                if (response.status == 1) {
                    this.setState({
                        "taskRewardList": response.data,
                    })
                } else {
                    console.log(response.message)
                }
            })

    }
    //删除模块
    fetchDeleteModule(taskCode) {
        let params = {
            taskCode,
        }
        getUrl.API(params, "ella.operation.deleteOperationTask")
            .then(response => response.json())
            .then(response => {
                if (response.status == 1) {
                    message.success("删除成功!");
                } else {
                    message.error("删除失败！")
                }
            })
    }
    statusChange(str, value) {
        this.setState({
            status: value
        })
    }
    //搜索框
    taskLibrarySearch(value) {
        this.setState({
            partTitle: value
        })
        this.fetchModuleList(value, 0);

    }
    //删除某行
    onDelete = (key) => {
        //判断有没有删除权限  
        if (!getUrl.operationTypeCheck("DELETE")) {
            message.error("抱歉没有权限,请联系管理员或者切换账号")
            return;
        } else {
            if (key.showFlag == "SHOW_WAIT") {
                message.error("已添加至任务墙并未发布的列表，不支持删除！")
                return;
            } else if (key.showFlag == "SHOW_ON") {
                message.error("已添加至任务墙并发布的列表，不支持删除！")
                return;
            } else if (key.showFlag == "SHOW_UNSHELVE") {
                message.error("发布后移除的列表，不支持删除！")
                return;
            }
        }
        this.setState({
            dataSource: this.state.dataSource.filter(item => item.taskCode !== key.taskCode),
            total: this.state.total - 1
        })
        this.fetchDeleteModule(key.taskCode)
    }
    //判断有没编辑权限
    isUPDAT() {
        if (!getUrl.operationTypeCheck("UPDAT")) {
            message.error("抱歉没有权限,请联系管理员或者切换账号")
        }
    }


    pageSizeFun(current, pageSize) {
        this.setState({
            pageSize: pageSize,
            page: current - 1,
            current: current
        }, () => {
            this.fetchModuleList(this.state.partTitle, this.state.showStatus, this.state.page, this.state.pageSize);
        });
    }

    pageChangeFun(pageNum) {
        this.setState({
            page: pageNum - 1,
            current: pageNum

        }, () => {
            this.fetchModuleList(this.state.partTitle, this.state.page);
        });
    }
    getStartOrEndData(value, dateString, str) {
        this.setState({
            [str]: dateString
        })
    }
    render() {
        const styles = {
            "display": "inline-block",
            "verticalAlign": "middle",
            "height": "15px",
            "marginRight": "20px"
        }
        const columns = [
            {
                title: '任务ID',
                width: 100,
                dataIndex: 'taskCode',
                key: 'taskCode',
                className: 'td_hide',
                render: (text, record) => {
                    return (
                        <Popover
                            placement="top"
                            title={null}
                            content={
                                record.taskCode
                            }
                        >
                            <span>{record.taskCode}</span>
                        </Popover>
                    )
                }
            },
            {
                title: '任务名称',
                width: 100,
                dataIndex: 'taskName',
                key: 'taskName',
                className: 'td_hide',
                render: (text, record) => {
                    return (
                        <Popover
                            placement="top"
                            title={null}
                            content={
                                record.taskName
                            }
                        >
                            <span>{record.taskName}</span>
                        </Popover>
                    )
                }
            },
            {
                title: '所在任务列表',
                width: 100,
                dataIndex: 'taskWallName',
                key: 'taskWallName',
                className: 'td_hide',
                render: (text, record) => {
                    return (
                        <Popover
                            placement="top"
                            title={null}
                            content={
                                record.taskWallName
                            }
                        >
                            <span>{!record.taskWallName ? "-" : record.taskWallName}</span>
                        </Popover>
                    )
                }
            },
            // {
            //     title: '修改时间',
            //     width: 100,
            //     dataIndex: 'updateTime',
            //     key: 'updateTime',
            //     render: (text,record) =>{
            // 		return <span>{record.updateTime==null?record.createTime:record.updateTime}</span>
            // 	}
            // },
            {
                title: '有效时间',
                width: 200,
                render: (text, record) => {
                    return record.startTime + " ~ " + record.endTime;
                }
            },
            {
                title: ({ sortOrder, filters }) => <Tooltip title={() => {
                    return <div>
                        <span>未展示：从未在任务墙中发布展示过；</span><br />
                        <span>待展示：已添加至任务墙中但并未发布；</span><br />
                        <span>已展示：已添加至任务墙并发布展示；</span><br />
                        <span>发布后移出：在任务墙中发布过当前已从任务墙中移除；</span>
                    </div>
                }}
                >
                    <div><span style={{ display: "inline-block", "verticalAlign": "middle" }}>展示状态</span><Icon type="question-circle" style={{ display: "inline-block", "verticalAlign": "middle", "marginLeft": "5px" }} /></div>
                </Tooltip>,
                width: 100,
                dataIndex: 'showFlag',
                render: (showFlag) => {
                    return <span>{showFlag == "SHOW_ON" ? "已展示" : showFlag == "SHOW_OFF" ? "未展示" : showFlag == "SHOW_WAIT" ? "待展示" : showFlag == "SHOW_UNSHELVE" ? "发布后移除" : "-"}</span>
                }
            },
            {
                title: '任务状态',
                width: 100,
                dataIndex: 'expireStatus',
                render: (expireStatus) => {
                    return <span>{expireStatus == "EXPIRED_YES" ? "已过期" : expireStatus == "EXPIRED_NO" ? "未过期" : "-"}</span>
                }
            },
            {
                title: '任务类型',
                width: 100,
                dataIndex: 'taskType',
                render: (taskType) => {
                    return <span>{taskType == "ACTIVE_TASK" ? "活跃任务" : taskType == "READ_TASK" ? "阅读任务" : taskType == "PAID_BEHAVIOR_TASK" ? "付费行为" : taskType == "SOCIAL_PROPAGATE" ? "社交传播" : "-"}</span>


                }
            },
            {
                title: '任务行为',
                width: 100,
                dataIndex: 'actionName',
                key: 'actionName',
                className: 'td_hide',
                render: (actionName) => {
                    var curName;
                    // if(actionCode=="A20181026BML5WM5544"){
                    //     curName="登录咿啦看书（签到）"
                    // }else if(actionCode=="A20181026BML5WN3449"){
                    //     curName="浏览每日绘本"
                    // }else if(actionCode=="A20181026BML5WN5564"){
                    //     curName="累计在线时间"
                    // }else if(actionCode=="A20181026BM2QJO0507"){
                    //     curName="完整阅读完成任意图书"
                    // }else if(actionCode=="A20181026BML5WK8649"){
                    //     curName="完整阅读完成指定图书"
                    // }else if(actionCode=="A20181026BML5WL9491"){
                    //     curName="单次阅读时长达到XX分钟"
                    // }else if(actionCode=="A20181026BML5WM2649"){
                    //     curName="累计阅读时长达到XX分钟"
                    // }else if(actionCode=="A20181026BN4BQF5586"){
                    //     curName="购买任意（指定）图书"
                    // }else if(actionCode=="A20181026BN4BQF3396"){
                    //     curName="购买任意（指定）图书包"
                    // }else if(actionCode=="A20181026BN4BQG4441"){
                    //     curName="充值一笔（可设定金额）咿啦币"
                    // }else if(actionCode=="A20181026BN4BQG8483"){
                    //     curName="开通（续费）一笔会员（可设定会员类型）"
                    // }else if(actionCode=="A20181026BN4BQG4686"){
                    //     curName="分享任意（指定）图书"
                    // }else if(actionCode=="A20181026BN4BQG1158"){
                    //     curName="评论任意（指定）图书"
                    // }else if(actionCode=="A20181026BN4BQH3802"){
                    //     curName="邀请一名好友注册"
                    // }
                    return <Popover
                        placement="top"
                        title={null}
                        content={
                            actionName
                        }
                    >
                        <span>{actionName}</span>
                    </Popover>

                }

            },
            {
                title: '奖励内容',
                width: 100,
                dataIndex: 'rewardType',
                key: 'rewardType',
                render: (rewardType) => {
                    return <span>{rewardType == "BOOK" ? "图书" : rewardType == "VIP" ? "会员" : rewardType == "COUPON" ? "红包" : rewardType == "POINT" ? "积分" : rewardType == "BOOK_PACKAGE" ? "图书包" : "-"}</span>

                }
            },
            {
                title: '操作',
                width: 150,
                render: (text, record) => {
                    return (
                        <div>
                            <Link to={'/addTaskLibrary/edit/' + record.taskCode + "/repeatUse"} target="_blank" style={styles}>复用</Link>
                            <Link to={'/addTaskLibrary/edit/' + record.taskCode + "/normal"} target="_blank"><span className='i-action-ico i-edit' style={styles}></span></Link>
                            <Popconfirm title="请确认是否从任务库中删除该条任务" onConfirm={() => { this.onDelete(record) }}>
                                <i className="i-action-ico i-delete" style={styles}></i>
                            </Popconfirm>

                        </div>
                    )
                }
            }
        ]
        const show = {
            display: "block",

        }
        const not_show = {
            display: "none"
        }
        return (

            <div id="Recommend">
                <p className="m-title">任务库管理</p>
                <div className="m-rt-content">
                    <div className="m-select">
                        <Link to="/addTaskLibrary/add/0/normal" className='m-btn-add intervalRight'><Button type="primary" className="u-btn-add"><Icon type="plus" />添加新的任务</Button></Link>
                        <Select defaultValue="taskName" className="selectWidth intervalRight" onChange={(value) => { this.getSearchData("taskSearchType", value) }}>
                            {/* <option value={''}>全部</option> */}
                            <Option value={"taskName"}>任务名称</Option>
                            <Option value={"taskCode"}>任务ID</Option>
                        </Select>
                        <Search placeholder="搜索" enterButton style={{ width: 400 }} className="intervalRight" onSearch={value => this.taskLibrarySearch(value)} />
                        <Button style={{ width: '120px' }} type="primary" className="u-btn-green" onClick={() => { this.setState({ isShow: !this.state.isShow }) }}>展示更多{this.state.isShow ? <Icon type="up" /> : <Icon type="down" />}</Button>

                    </div>
                    <div className="showtime" style={this.state.isShow ? show : not_show}>
                        <div className="rowPartWrap">
                            <Row className="rowPart">
                                {/* <span className="colTitle">修改时间:</span>
                            <DatePicker
                                style={{"marginLeft":"10px",width:"180px"}}
                                className="intervalBottom"
                                showTime={{ format: 'HH:mm' }}
                                format="YYYY-MM-DD HH:mm:ss"
                                placeholder={['开始时间']}
                                onChange={(value, dateString) => { this.getStartOrEndData(value, dateString, "beginTime") }}

                                value={this.state.beginTime != '' ? moment(this.state.beginTime, 'YYYY-MM-DD HH:mm:ss') : null}
			
                            />
                            <span className="line"> — </span>
                            <DatePicker
                              	className="intervalRight intervalBottom"
                              	style={{width:"180px"}}
                                showTime={{ format: 'HH:mm' }}
                                format="YYYY-MM-DD HH:mm:ss"
                                placeholder={['结束时间']}
                                onChange={(value, dateString) => { this.getStartOrEndData(value, dateString, "endTime") }}
                                value={this.state.endTime != '' ? moment(this.state.endTime, 'YYYY-MM-DD HH:mm:ss') : null}
                            /> */}
                                <span className="colTitle">任务展示状态:</span>
                                <Select defaultValue="全部" style={{ "marginLeft": "10px", width: 130, "marginBottom": "20px" }} className="intervalRight" value={this.state.showFlag} onChange={(value) => { this.getSearchData("showFlag", value) }}>
                                    <Option value={null}>全部</Option>
                                    {
                                        this.state.taskStateList.map(item => {
                                            return <Option value={item.searchCode} key={item.searchCode} title={item.searchName}>{item.searchName}</Option>
                                        })
                                    }
                                </Select>
                                <span className="colTitle">任务状态:</span>
                                <Select defaultValue="全部" style={{ "marginLeft": "10px", width: 130, "marginBottom": "20px" }} className="intervalRight" value={this.state.expireStatus} onChange={(value) => { this.getSearchData("expireStatus", value) }}>
                                    <Option value={null}>全部</Option>
                                    <Option value={"EXPIRED_YES"} key={"EXPIRED_YES"}>已过期</Option>
                                    <Option value={"EXPIRED_NO"} key={"EXPIRED_NO"}>未过期</Option>
                                </Select>
                                <span className="colTitle">任务类型:</span>
                                <Select defaultValue="全部" style={{ "marginLeft": "10px", width: 130 }} className="intervalRight" value={this.state.taskType} onChange={(value) => { this.fetchActionList(value); this.setState({ "taskType": value, "actionCode": null }) }}
                                >
                                    <Option value={null}>全部</Option>
                                    {
                                        this.state.taskTypeList.map(item => {
                                            return <Option value={item.searchCode} key={item.searchCode}>{item.searchName}</Option>
                                        })
                                    }
                                </Select>
                                {
                                    this.state.taskType != null && <span>
                                        <span className="colTitle">任务行为:</span>
                                        <Select defaultValue="全部" style={{ "marginLeft": "10px", width: 130 }} className="intervalRight" value={this.state.actionCode} onChange={(value) => { this.getSearchData("actionCode", value) }}>
                                            <Option value={null}>全部</Option>
                                            {
                                                this.state.actionList.map(item => {
                                                    return <Option value={item.actionCode} key={item.actionCode} title={item.actionName}>{item.actionName}</Option>
                                                })
                                            }
                                        </Select>
                                    </span>
                                }

                                <span className="colTitle">奖励内容:</span>
                                <Select defaultValue="全部" style={{ "marginLeft": "10px", width: 130 }} className="intervalRight" value={this.state.rewardType} onChange={(value) => { this.getSearchData("rewardType", value) }}>
                                    <Option value={null}>全部</Option>
                                    {
                                        this.state.taskRewardList.map(item => {
                                            return <Option value={item.searchCode} key={item.searchCode}>{item.searchName}</Option>
                                        })
                                    }
                                </Select>
                                <div className="intervalBottom">
                                    <Button className="u-btn-green intervalRight" onClick={() => { this.fetchModuleList(this.state.partTitle, 0) }}>查询</Button>
                                    <Button className="theSearch u-btn-green" onClick={() => this.clearSelect()}>恢复默认</Button>
                                </div>
                            </Row>
                        </div>


                        <hr />
                    </div>
                    <Spin tip="加载中..." spinning={this.state.loading} size="large" style={{ zIndex: 9999 }}>
                        <Table
                            rowKey={(record, index) => index}
                            columns={columns}
                            dataSource={this.state.dataSource}
                            pagination={false}
                            scroll={{ y: 570 }}
                        />
                    </Spin>
                    <div className="m-pagination-box">
                        {getUrl.operationTypeCheck("UPDAT") ? <Pagination pageSizeOptions={['20', '40', '60', '80', '100']} showSizeChanger showQuickJumper showTotal={total => `共 ${this.state.total} 条`} className="m-pagination" defaultPageSize={20} defaultCurrent={1} current={this.state.current} total={this.state.total} onChange={this.pageChangeFun} onShowSizeChange={this.pageSizeFun} /> : null}
                    </div>
                    <Modal
                        title="推荐类型选择"
                        visible={this.state.visible}
                        onOk={this.handleOk}
                        onCancel={this.handleCancel}
                        okText="确认"
                        cancelText="关闭"
                        className="goodsListModel"
                    >
                        <Row className="checkbuttonWrap">
                            <Col span={12}><Link to={'/addRecommend/kong/book/add?svipExist=' + this.state.svipExist}><Button className="checkbutton" type="primary">图书</Button></Link></Col>
                            <Col span={12}><Link to="/addRecommend/kong/course/add"><Button className="checkbutton" type="primary">课程</Button></Link></Col>
                        </Row>
                    </Modal>
                </div>
            </div >
        )
    }
}
export default TaskLibrary;