import React from 'react'
import { Table, Pagination, Spin, Popover } from 'antd';
import { Link } from 'react-router';
import "./dingDan.css"
import getUrl from "../util.js"
import { dataString } from '../commonData.js'

export default class Task extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            userTaskRecord: [],	//订单详情的数据
            pageMax: 0,			//最大页数
            pageSizeNow: 20,
            userTaskCount: {
                taskSum: "0",
                taskExpiredSum: "0",
                taskFinishSum: "0",
            },		//用户充值、支付的总金额
            loading: true,
            pageLengthNow: 0,
        }
        this.pageChangeFun = this.pageChangeFun.bind(this);
        this.pageSizeChangeFun = this.pageSizeChangeFun.bind(this);
    }

    //即将插入本组件时，开始请求数据，准备渲染
    componentWillMount() {
        this.getUserTaskRecord(0, 20);
    }

    getUserTaskRecord(pageNumber, pageSize) {
        var theUid = this.props.uid;
        this.setState({
            loading: true
        })

        fetch(getUrl.url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: "method=ella.operation.getUserTaskRecord" + "&content=" + JSON.stringify({
                "uid": theUid,
                "page": pageNumber,
                "pageSize": pageSize
            }) + dataString
        }).then((response) => {
            return response.json();
        }).then((response) => {
            if (response.status == 1) {
                this.setState({
                    userTaskRecord: (response.data.userTaskRecord || response.data.userTaskRecord.length) ? response.data.userTaskRecord : [],
                    userTaskCount: response.data.userTaskCount || {
                        taskSum: "0",
                        taskExpiredSum: "0",
                        taskFinishSum: "0"
                    },
                    pageMax: response.data.total,
                    loading: false,
                    pageLengthNow: response.data.userTaskRecord.length
                })
            }
        })
    }

    //换页时，更新内容
    pageChangeFun(pageNumber) {
        console.log('Page: ', pageNumber);
        this.getUserTaskRecord(pageNumber - 1, this.state.pageSizeNow);
    }
    pageSizeChangeFun(current, size) {
        this.setState({
            pageSizeNow: size
        })
        this.getUserTaskRecord(current - 1, size);
    }

    render() {
        const columns = [{
            title: '任务编号',
            dataIndex: 'taskCode',
            key: 'taskCode',
            width: '12%',
            render: (text, record) => {
                return (record.taskCode || '-')
            }
        }, {
            title: '任务名称',
            dataIndex: 'taskName',
            key: 'taskName',
            width: '15%',
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
            width: '8%',
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
            width: '8%',
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
            width: '12%',
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
            width: '12%',
            render: (text, record) => {
                return (record.actionName || '-')
            }
        }, {
            title: '操作',
            dataIndex: 'edit',
            width: '8%',
            render: (text, record) => {
                return (
                    <div>
                        <Link target="_blank" to={"/taskDetail?recordId=" + record.recordId + '&taskCode=' + record.taskCode + '&from=userList&uid=' + this.props.uid}>
                            查看详情
                        </Link>
                    </div>
                )
            }

        }];
        return (
            <div className="dingDan">
                <Spin spinning={this.state.loading} size="large">
                    <div className="ddTop">
                        <div className="topBox">
                            <span>接取任务总数</span>
                            <span>{this.state.userTaskCount.taskSum || 0}</span>
                        </div>
                        <div className="topBox">
                            <span>已失效任务总数</span>
                            <span>{this.state.userTaskCount.taskExpiredSum || 0}</span>
                        </div>
                        <div className="topBox">
                            <span>完成任务总数</span>
                            <span>{this.state.userTaskCount.taskFinishSum || 0}</span>
                        </div>
                    </div>
                    <div className="ddBottom">
                        <Table className="t-nm-tab" dataSource={this.state.userTaskRecord} columns={columns} pagination={false} scroll={{ y: ((this.state.pageLengthNow > 11) ? 500 : 0) }} />
                        <div className="paixu">
                            <Pagination className="paixuIn" showSizeChanger pageSizeOptions={['20', '50', '100', '200', '500', '1000']} defaultPageSize={20} defaultCurrent={1} showTotal={total => `共 ${total} 条`} total={this.state.pageMax} onChange={this.pageChangeFun} showQuickJumper={true} onShowSizeChange={this.pageSizeChangeFun} />
                        </div>
                    </div>
                </Spin>
            </div>
        );
    }
}
