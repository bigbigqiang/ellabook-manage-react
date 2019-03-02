import React from 'react'
import { Table, message, Spin, Row, Col, Icon } from 'antd';
import { Link } from 'react-router';
import getUrl from '../util';
import commonData from '../commonData.js'
class PointsDetail extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            dataInfo: {}
        }
    }
    //获取积分详情
    getPointsAccountInfo() {
        this.setState({
            loading: true
        })
        let parameter = { pointsCode: this.props.location.query.pointsCode, useType: this.props.location.query.useType, taskCode: this.props.location.query.taskCode || '', orderNo: this.props.location.query.orderNo || '' }
        fetch(getUrl.url, {
            method: "POST",
            mode: 'cors',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: "method=ella.operation.getPointsAccountInfo" + "&content=" + JSON.stringify(parameter) + commonData.dataString,
        }).then(res => res.json()).then((data) => {
            if (data.data.pointsAccountGet) {
                data.data.pointsAccountGet = [data.data.pointsAccountGet]
            }

            this.setState({
                dataInfo: { ...data.data },
                loading: false
            })
        }).catch(e => {
            message.error(e.message)
        })
    }
    componentDidMount() {
        this.getPointsAccountInfo();
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
        }, {
            title: '奖励内容',
            dataIndex: 'rewardContent',
            key: 'rewardContent',
            width: '5%',
            render: (text, record) => {
                let txt = ''
                switch (record.rewardContent) {
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
            dataIndex: 'points',
            key: 'points',
            width: '12%',
            render: (text, record) => {
                return (record.points || '-')
            }
        }];

        const columns2 = [{
            title: '商品名称',
            dataIndex: 'goodsName',
            key: 'goodsName',
            width: '20%',
            className: "td_hide",
            render: (text, record) => {
                return (record.goodsName || '-')
            }
        }, {
            title: '商品ID',
            dataIndex: 'goodsCode',
            key: 'goodsCode',
            width: '20%',
            render: (text, record) => {
                return (record.goodsCode || '-')
            }
        }, {
            title: '商品类型',
            dataIndex: 'goodsType',
            key: 'goodsType',
            width: '20%',
            render: (text, record) => {
                let txt = ''
                switch (record.goodsType) {
                    case 'BOOK':
                        txt = '图书';
                        break;
                    case 'LIB':
                        txt = '图书馆';
                        break;
                    case 'BOOK_PACKAGE':
                        txt = '图书包 ';
                        break;
                    case 'ELLA_VIP':
                        txt = '会员 ';
                        break;
                    case 'ELLA_COURSE':
                        txt = '课程 ';
                        break;
                    default:
                        txt = '-';
                }
                return txt;
            }
        }, {
            title: '商品价格',
            dataIndex: 'goodsPrice',
            key: 'goodsPrice',
            width: '20%',
            render: (text, record) => {
                return (record.goodsPrice || '-')
            }
        }, {
            title: '商品积分价格',
            dataIndex: 'goodsIntegral',
            key: 'goodsIntegral',
            width: '20%',
            render: (text, record) => {
                return (record.goodsIntegral || '-')
            }
        }];
        return (
            <div id='PointsDetail'>
                <p className="m-title"><Link to={this.props.location.query.from==='pointsAccount'?'/pointsAccount':'/userList?uid=' + this.props.location.query.uid + '&key=5'}><Icon type="left" />积分详情</Link></p>
                <Spin tip="加载中..." spinning={this.state.loading} size="large" style={{ zIndex: 9999 }}>
                    <p style={{ padding: '10px 20px', marginBottom: '0px', fontSize: '16px', fontWeight: 'bold' }}>基础信息</p>
                    <Row style={{ marginBottom: 10, padding: '10px 20px', marginLeft: '30px' }}>
                        <Col span={8}><span style={{ fontWeight: 'bold' }}>积分编号：  </span> {this.state.dataInfo.pointsCode}</Col>
                        <Col span={8}><span style={{ fontWeight: 'bold' }}>完成时间：  </span> {this.state.dataInfo.createTime || '-'}</Col>
                        <Col span={8}><span style={{ fontWeight: 'bold' }}>用户昵称：  </span> {this.state.dataInfo.userNick}</Col>
                    </Row>
                    <Row style={{ marginBottom: 10, padding: '10px 20px', marginLeft: '30px' }}>
                        <Col span={8}><span style={{ fontWeight: 'bold' }}>用户id：  </span>{this.state.dataInfo.uid ? <Link style={{ textDecoration: 'underline' }} target="_blank" to={"/userList?uid=" + this.state.dataInfo.uid}>
                            {this.state.dataInfo.uid}
                        </Link> : '-'}</Col>
                        <Col span={8}><span style={{ fontWeight: 'bold' }}>用户行为：  </span>{this.state.dataInfo.useType === 'GET' ? '获得积分' : '消费积分'}</Col>
                    </Row>
                    <p style={{ padding: '10px 20px', marginBottom: '0px', fontSize: '16px', fontWeight: 'bold' }}>{this.state.dataInfo.useType === 'GET' ? '任务信息' : '商品信息'}</p>
                    <Table
                        columns={this.state.dataInfo.useType === 'GET' ? columns : columns2}
                        dataSource={this.state.dataInfo.useType === 'GET' ? this.state.dataInfo.pointsAccountGet : this.state.dataInfo.pointsAccountUse}
                        pagination={false}
                        style={{ minWidth: 1050, padding: '10px 20px' }}
                    />
                </Spin>
            </div >
        )
    }
}
export default PointsDetail;
