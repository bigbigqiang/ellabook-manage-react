import React from 'react'
import { Table, Pagination, Spin, Popover } from 'antd';
import { Link } from 'react-router';
import "./dingDan.css"
import getUrl from "../util.js"
import { dataString } from '../commonData.js'

export default class integral extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            UserPointsRecord: [],	//订单详情的数据
            pageMax: 0,			//最大页数
            pageSizeNow: 20,
            userPointsCount: {
                pointsConsumptionOrder: "0",
                pointsUse: "0",
                pointsGet: "0",
            },
            loading: true,
            pageLengthNow: 0,
        }
        this.pageChangeFun = this.pageChangeFun.bind(this);
        this.pageSizeChangeFun = this.pageSizeChangeFun.bind(this);
    }

    //即将插入本组件时，开始请求数据，准备渲染
    componentWillMount() {
        this.getUserPointsRecord(0, 20);
    }

    getUserPointsRecord(pageNumber, pageSize) {
        var theUid = this.props.uid;
        this.setState({
            loading: true
        })

        fetch(getUrl.url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: "method=ella.operation.getUserPointsRecord" + "&content=" + JSON.stringify({
                "uid": theUid,
                "page": pageNumber,
                "pageSize": pageSize
            }) + dataString
        }).then((response) => {
            return response.json();
        }).then((response) => {
            if (response.status == 1) {
                this.setState({
                    UserPointsRecord: (response.data.userPointsRecord || response.data.userPointsRecord.length) ? response.data.userPointsRecord: [],
                    userPointsCount: response.data.userPointsCount || {
                        pointsConsumptionOrder: "0",
                        pointsUse: "0",
                        pointsGet: "0",
                    },
                    pageMax: response.data.total,
                    loading: false,
                    pageLengthNow: response.data.userPointsRecord.length
                })
            } else {
                this.setState({
                    loading: false
                })
            }
        })
    }

    //换页时，更新内容
    pageChangeFun(pageNumber) {
        console.log('Page: ', pageNumber);
        this.getUserPointsRecord(pageNumber - 1, this.state.pageSizeNow);
    }
    pageSizeChangeFun(current, size) {
        this.setState({
            pageSizeNow: size
        })
        this.getUserPointsRecord(current - 1, size);
    }

    render() {
        const columns = [{
            title: '积分编号',
            dataIndex: 'pointsCode',
            key: 'pointsCode',
            width: '10%',
            render: (text, record) => {
                return (record.pointsCode || '-')
            }
        }, {
            title: '用户行为',
            dataIndex: 'useType',
            key: 'useType',
            width: '20%',
            className: "td_hide",
            render: (text, record) => {
                if (record.useType === 'GET') {return '获得积分 '} else if (record.useType === 'USE') {return '消费积分'} else {return '-'}
            }
        }, {
            title: '完成时间',
            dataIndex: 'createTime',
            key: 'createTime',
            width: '10%',
            render: (text, record) => {
                return (record.createTime || '-')
            }
        }, {
            title: '积分数量',
            dataIndex: 'points',
            key: 'points',
            width: '10%',
            render: (text, record) => {
                return (record.points || '-')
            }
        }, {
            title: '任务名称',
            dataIndex: 'taskName',
            key: 'taskName',
            width: '10%',
            render: (text, record) => {
                return (record.taskName || '-')
            }
        }, {
            title: '消费商品',
            dataIndex: 'goodsName',
            key: 'goodsName',
            width: '10%',
            render: (text, record) => {
                return (record.goodsName || '-')
            }
        }, {
            title: '操作',
            dataIndex: 'edit',
            width: '10%',
            render: (text, record) => {
                return (
                    <div>
                        <Link target="_blank" to={"/pointsDetail?pointsCode=" + record.pointsCode + '&useType=' + record.useType + '&taskCode=' + record.taskCode + '&orderNo=' + record.orderNo + '&from=userList&uid=' + this.props.uid}>
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
                            <span>积分获得总数</span>
                            <span>{this.state.userPointsCount.pointsGet || 0}</span>
                        </div>
                        <div className="topBox">
                            <span>积分消费总数</span>
                            <span>{this.state.userPointsCount.pointsUse || 0}</span>
                        </div>
                        <div className="topBox">
                            <span>积分支付订单数</span>
                            <span>{this.state.userPointsCount.pointsConsumptionOrder || 0}</span>
                        </div>
                    </div>
                    <div className="ddBottom">
                        <Table className="t-nm-tab" dataSource={this.state.UserPointsRecord} columns={columns} pagination={false} scroll={{ y: ((this.state.pageLengthNow > 11) ? 500 : 0) }} />
                        <div className="paixu">
                            <Pagination className="paixuIn" showSizeChanger pageSizeOptions={['20', '50', '100', '200', '500', '1000']} defaultPageSize={20} defaultCurrent={1} showTotal={total => `共 ${total} 条`} total={this.state.pageMax} onChange={this.pageChangeFun} showQuickJumper={true} onShowSizeChange={this.pageSizeChangeFun} />
                        </div>
                    </div>
                </Spin>
            </div>
        );
    }
}
