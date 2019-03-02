import React from 'react'
import { Table, message, Spin, Row, Col, Icon } from 'antd';
import { Link } from 'react-router';
import getUrl from '../util';
import commonData from '../commonData.js'
class TaskDetail extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            dataInfo: {},
            rewardData: []
        }
    }
    //获取任务详情
    getTaskInfo() {
        this.setState({
            loading: true
        })
        let parameter = { recordId: this.props.location.query.recordId, taskCode: this.props.location.query.taskCode }
        fetch(getUrl.url, {
            method: "POST",
            mode: 'cors',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: "method=ella.operation.getTaskInfo" + "&content=" + JSON.stringify(parameter) + commonData.dataString,
        }).then(res => res.json()).then((data) => {
            data.data.taskInfoList = [data.data.taskInfoList]
            this.setState({
                dataInfo: { ...data.data },
                rewardData: [{
                    rewardType: data.data.rewardType,
                    rewardContent: data.data.rewardContent,
                    rewardStatus: data.data.rewardStatus
                }],
                loading: false
            })
        }).catch(e => {
            message.error(e.message)
        })
    }
    componentDidMount() {
        this.getTaskInfo();
    }
    render() {
        const columns = [{
            title: '任务名称',
            dataIndex: 'taskName',
            key: 'taskName',
            width: '15%',
            className: "td_hide",
            render: (text, record) => {
                return (record.taskName || '-')
            }
        }, {
            title: '任务id',
            dataIndex: 'taskCode',
            key: 'taskCode',
            width: '15%',
            className: "td_hide",
            render: (text, record) => {
                return (record.taskCode || '-')
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
            title: '任务参数',
            dataIndex: 'taskParam',
            key: 'taskParam',
            width: '12%',
            render: (text, record) => {
                let taskParam = record.taskParam ? JSON.parse(record.taskParam) : '';
                if (taskParam) {
                    let count = 0
                    for (let i in taskParam) {
                        count++
                    }
                    if (taskParam.count && count === 1) {
                        return (taskParam.count)
                    } else if (taskParam.count && taskParam.bookName) {
                        return (taskParam.bookName + '/' + taskParam.count)
                    } else if (taskParam.bookName && taskParam.bookCode) {
                        return (taskParam.bookName)
                    } else if (taskParam.packageCode) {
                        return record.packageName || '-'
                    } else if (taskParam.vipType) {
                        let txt = ''
                        switch (taskParam.vipType) {
                            case 'CARD_MONTH':
                                txt = '月卡会员';
                                break;
                            case 'CARD_YEAR':
                                txt = '年卡会员';
                                break;
                            default:
                                txt = '-';
                        }
                        return txt
                    } else {
                        return '-'
                    }
                } else {
                    return '-'
                }
            }
        }];
        const rewardColumns = [
            {
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
            },
            {
                title: '奖励参数',
                dataIndex: 'rewardContent',
                key: 'rewardContent',
                width: '10%',
                render: (text, record) => {
                    return (record.rewardContent || '-')
                }
            }, {
                title: '奖励状态',
                dataIndex: 'rewardStatus',
                key: 'rewardStatus',
                width: '10%',
                render: (text, record) => {
                    let txt = ''
                    switch (record.rewardStatus) {
                        case 'NOT_REACH':
                            txt = '未达成领取条件 ';
                            break;
                        case 'WAITING_RECEIVE':
                            txt = '待领取';
                            break;
                        case 'HAS_RECEIVE':
                            txt = '已领取 ';
                            break;
                        default:
                            txt = '-';
                    }
                    return txt;
                }
            },
        ];
        return (
            <div id='PointsDetail'>
                <p className="m-title"><Link to={this.props.location.query.from==='taskAccount'?'/taskAccount':'/userList?uid=' + this.props.location.query.uid + '&key=6'}><Icon type="left" />任务详情</Link></p>
                <Spin tip="加载中..." spinning={this.state.loading} size="large" style={{ zIndex: 9999 }}>
                    <p style={{ padding: '10px 20px', marginBottom: '0px', fontSize: '16px', fontWeight: 'bold' }}>基础信息</p>
                    <Row style={{ marginBottom: 10, padding: '10px 20px', marginLeft: '30px' }}>
                        <Col span={8}><span style={{ fontWeight: 'bold' }}>任务编号：  </span> {this.state.dataInfo.recordId}</Col>
                        <Col span={8}><span style={{ fontWeight: 'bold' }}>接取时间：  </span> {this.state.dataInfo.createTime || '-'}</Col>
                        <Col span={8}><span style={{ fontWeight: 'bold' }}>用户昵称：  </span> {this.state.dataInfo.userNick || '-'}</Col>
                    </Row>
                    <Row style={{ marginBottom: 10, padding: '10px 20px', marginLeft: '30px' }}>
                        <Col span={8}><span style={{ fontWeight: 'bold' }}>用户id：  </span> {this.state.dataInfo.uid ? <Link style={{ textDecoration: 'underline' }} target="_blank" to={"/userList?uid=" + this.state.dataInfo.uid}>
                            {this.state.dataInfo.uid}
                        </Link> : '-'}</Col>
                        <Col span={8}><span style={{ fontWeight: 'bold' }}>完成时间：  </span> {this.state.dataInfo.completionTime || '-'}</Col>
                        <Col span={8}><span style={{ fontWeight: 'bold' }}>任务状态：  </span>{((taskStatus) => {
                            if (taskStatus === 'HAS_RECEIVE') {
                                return '已领取 '
                            } else if (taskStatus === 'HAS_EXPIRED') {
                                return '已过期 '
                            } else if (taskStatus === 'HAS_COMPLETED') {
                                return '已完成 '
                            } else {
                                return '-'
                            }
                        })(this.state.dataInfo.taskStatus)}</Col>
                    </Row>
                    <p style={{ padding: '10px 20px', marginBottom: '0px', fontSize: '16px', fontWeight: 'bold' }}>任务信息</p>
                    <Table
                        columns={columns}
                        dataSource={this.state.dataInfo.taskInfoList}
                        pagination={false}
                        style={{ minWidth: 1050, padding: '10px 20px' }}
                    />
                    <p style={{ padding: '10px 20px', marginBottom: '0px', fontSize: '16px', fontWeight: 'bold' }}>奖励信息</p>
                    <Table
                        columns={rewardColumns}
                        dataSource={this.state.rewardData}
                        pagination={false}
                        style={{ minWidth: 1050, padding: '10px 20px' }}
                    />
                </Spin>
            </div >
        )
    }
}
export default TaskDetail;
