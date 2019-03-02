import React from 'react'
import OrderSearcher from '../order/orderSearcher'
import { Spin, Pagination, message, Tabs, Table, Popover } from 'antd';
import { Link } from 'react-router';
import './orderList.css';
import commonData from '../commonData.js';
var util = require('../util.js');
const TabPane = Tabs.TabPane;
export default class orderPage extends React.Component {
    constructor() {
        super()
        this.state = {
            tDate: [],
            successData: [],
            pageLength: '',
            pageChange: '20',
            page: 0,
            current: 1,
            successPageLength: '',
            successPageChange: '20',
            successPage: 0,
            successCurrent: 1,
            loading: false,
            searchType: 'categorySearch',
            timeData: {
                time: "orderCreateTime"
            },
            payData: {
                pay: null
            },
            orderData: {
                order: null
            },
            payTypeData: {
                payType: null
            },
            goodsTypeData: {
                goodsType: null
            },
            buyTypeData: {
                buyType: null
            },
            searchData: {
                search: 'userMobile'
            },
            startTimeData: {
                startTime: ''
            },
            endTimeData: {
                endTime: ''
            },
            searchContentData: {
                searchContent: null
            }
        };
        this.pageChangeFun = this.pageChangeFun.bind(this);
        this.successPageChangeFun = this.successPageChangeFun.bind(this);
        this.pageSizeFun = this.pageSizeFun.bind(this);
        this.successPageSizeFun = this.successPageSizeFun.bind(this);
        this.getStartTime = this.getStartTime.bind(this);
    }

    async orderList(startTime, endTime, pageNum, pageSize, dateType, channelCode, orderStatus, orderPayType, goodsType, searchType, searchContent, orderManageSearchType, buyType) {
        console.log(orderStatus)
        this.setState({
            loading: true
        });
        var data = await fetch(util.url, {
            mode: "cors",
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: "method=ella.operation.orderManageList" + "&content=" + JSON.stringify({ "startTime": startTime, "endTime": endTime, "searchType": searchType, "searchContent": searchContent, "dateType": dateType, "channelCode": channelCode, "orderStatus": orderStatus, "orderPayType": orderPayType, "goodsType": goodsType, "page": pageNum, "pageSize": pageSize, "orderManageSearchType": orderManageSearchType, "buyType": buyType }) + commonData.dataString
        }).then(res => res.json())
            .then((d) => {
                const data = [];
                var list = d.data.list == '' ? [] : d.data.list;
                for (let i = 0; i < list.length; i++) {
                    var orderStatus = list[i].orderStatus;
                    var orderPayType = list[i].orderPayType;
                    var goodsType = list[i].goodsType;
                    var buyType = list[i].buyType;
                    if (orderStatus == 'PAY_WAITING') {
                        orderStatus = '待支付'
                    } else if (orderStatus == 'PAY_SUCCESS') {
                        orderStatus = '已支付'
                    } else if (orderStatus == 'PAY_EXPIRED') {
                        orderStatus = '已失效'
                    } else if (orderStatus == 'PAY_CANCELED') {
                        orderStatus = '已取消'
                    } else if (orderStatus == '') {
                        orderStatus = '-'
                    }

                    if (orderPayType == 'ALIPAY') {
                        orderPayType = '支付宝'
                    } else if (orderPayType == 'WXPAY') {
                        orderPayType = '微信'
                    } else if (orderPayType == 'APPLE_IAP') {
                        orderPayType = '苹果'
                    } else if (orderPayType == 'ELLA_COIN') {
                        orderPayType = '咿啦币'
                    } else if (orderPayType == 'HUAWEIPAY') {
                        orderPayType = '华为'
                    } else if (orderPayType == 'INTEGRAL') {
                        orderPayType = '积分'
                    } else if (orderPayType == '') {
                        orderPayType = '-'
                    }

                    if (goodsType == 'ELLA_COIN') {
                        goodsType = '咿啦币'
                    } else if (goodsType == 'ELLA_VIP') {
                        goodsType = '咿啦会员'
                    } else if (goodsType == 'BOOK') {
                        goodsType = '图书'
                    } else if (goodsType == 'BOOK_PACKAGE') {
                        goodsType = '图书包'
                    } else if (goodsType == 'ELLA_COURSE') {
                        goodsType = '课程购买'
                    } else if (goodsType == 'LIBRARY') {
                        goodsType = '图书馆'
                    } else if (goodsType == '') {
                        goodsType = '-'
                    }

                    if (buyType == 'BOOK_BUY') {
                        buyType = '购书'
                    } else if (buyType == 'BALANCE_MEMBER_BUY') {
                        buyType = '余额购买会员'
                    } else if (buyType == 'MEMBER_BUY') {
                        buyType = '现金购买会员'
                    } else if (buyType == 'LIBRARY') {
                        buyType = '图书馆'
                    } else if (buyType == 'BOOK_RENT') {
                        buyType = '租书'
                    } else if (buyType == 'ONE_CLICK_RENT_BOOKS') {
                        buyType = '一键租书'
                    } else if (buyType == 'ELLA_COIN_BUY') {
                        buyType = '咿啦币充值'
                    } else if (buyType == 'BOOK_PACKAGE_BUY') {
                        buyType = '图书包购买'
                    } else if (buyType == 'COURSE_BUY') {
                        buyType = '课程购买'
                    } else if (buyType == 'ONE_CLICK_BUY') {
                        buyType = '一键购买'
                    } else if (buyType == '') {
                        buyType = '-'
                    }
                    data.push({
                        orderNo: list[i].orderNo,
                        username: list[i].userName == '' ? '-' : list[i].userName,
                        createTime: list[i].createTime == '' ? '-' : list[i].createTime,
                        orderPayType: orderPayType == '' ? '-' : orderPayType,
                        finishedTime: list[i].finishedTime == '' ? '-' : list[i].finishedTime,
                        channelName: list[i].channelName == '' ? '-' : list[i].channelName,
                        buyType: buyType,
                        goodsName: list[i].goodsName == '' ? '-' : list[i].goodsName,
                        goodsType: goodsType == '' ? '-' : goodsType,
                        orderAmount: list[i].orderAmount == '' ? '-' : list[i].orderAmount,
                        orderStatus: orderStatus,
                        uid: list[i].uid,
                        payAmount: list[i].payAmount == '' ? '-' : list[i].payAmount//实付金额
                    });
                }
                this.setState({
                    tDate: data,
                    pageSize: d.data.total,
                    pageLength: d.data.list.length,
                    loading: false,
                    current: d.data.currentPage,

                });
            })

    }

    async successOrderList(startTime, endTime, pageNum, pageSize, dateType, channelCode, orderStatus, orderPayType, goodsType, searchType, searchContent, orderManageSearchType, buyType) {
        this.setState({
            loading: true
        });
        if (orderStatus != null && orderStatus != "PAY_SUCCESS") {
            this.setState({
                loading: false,
                successData: [],
                successCurrent: 1,
                successPageSize: 0,
                successPageLength: 0,

            });
            return;
        }
        await fetch(util.url, {

            mode: "cors",
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: "method=ella.operation.orderManageList" + "&content=" + JSON.stringify({ "startTime": startTime, "endTime": endTime, "searchType": searchType, "searchContent": searchContent, "dateType": dateType, "channelCode": channelCode, "orderStatus": 'PAY_SUCCESS', "orderPayType": orderPayType, "goodsType": goodsType, "page": pageNum, "pageSize": pageSize, "orderManageSearchType": orderManageSearchType, "buyType": buyType }) + commonData.dataString
        }).then(res => res.json())
            .then((d) => {
                const successData = [];
                var list = d.data.list == '' ? [] : d.data.list;
                if (d.data.total == 0) {
                    var str = document.getElementsByClassName('m-pagination-box')[0];
                    str.style.display = 'none';
                } else {
                    var str = document.getElementsByClassName('m-pagination-box')[0];
                    str.style.display = 'block';
                }
                for (let i = 0; i < list.length; i++) {
                    var orderStatus = list[i].orderStatus;
                    var orderPayType = list[i].orderPayType;
                    var goodsType = list[i].goodsType;
                    var buyType = list[i].buyType;
                    if (orderStatus == 'PAY_WAITING') {
                        orderStatus = '待支付'
                    } else if (orderStatus == 'PAY_SUCCESS') {
                        orderStatus = '已支付'
                    } else if (orderStatus == 'PAY_EXPIRED') {
                        orderStatus = '已失效'
                    } else if (orderStatus == 'PAY_CANCELED') {
                        orderStatus = '已取消'
                    } else if (orderStatus == '') {
                        orderStatus = '-'
                    }

                    if (orderPayType == 'ALIPAY') {
                        orderPayType = '支付宝'
                    } else if (orderPayType == 'WXPAY') {
                        orderPayType = '微信'
                    } else if (orderPayType == 'APPLE_IAP') {
                        orderPayType = '苹果'
                    } else if (orderPayType == 'ELLA_COIN') {
                        orderPayType = '咿啦币'
                    } else if (orderPayType == 'HUAWEIPAY') {
                        orderPayType = '华为'
                    } else if (orderPayType == 'INTEGRAL') {
                        orderPayType = '积分'
                    } else if (orderPayType == '') {
                        orderPayType = '-'
                    }

                    if (goodsType == 'ELLA_COIN') {
                        goodsType = '咿啦币'
                    } else if (goodsType == 'ELLA_VIP') {
                        goodsType = '咿啦会员'
                    } else if (goodsType == 'BOOK') {
                        goodsType = '图书'
                    } else if (goodsType == 'BOOK_PACKAGE') {
                        goodsType = '图书包'
                    } else if (goodsType == 'LIBRARY') {
                        goodsType = '图书馆'
                    } else if (goodsType == 'ELLA_COURSE') {
                        goodsType = '课程购买'
                    } else if (goodsType == '') {
                        goodsType = '-'
                    }

                    if (buyType == 'BOOK_BUY') {
                        buyType = '购书'
                    } else if (buyType == 'BALANCE_MEMBER_BUY') {
                        buyType = '余额购买会员'
                    } else if (buyType == 'MEMBER_BUY' || buyType == 'CASH_MEMBER_BUY') {
                        buyType = '现金购买会员'
                    } else if (buyType == 'LIBRARY') {
                        buyType = '图书馆'
                    } else if (buyType == 'BOOK_RENT') {
                        buyType = '租书'
                    } else if (buyType == 'ONE_CLICK_RENT_BOOKS') {
                        buyType = '一键租书'
                    } else if (buyType == 'ELLA_COIN_BUY') {
                        buyType = '咿啦币充值'
                    } else if (buyType == 'BOOK_PACKAGE_BUY') {
                        buyType = '图书包购买'
                    } else if (buyType == 'COURSE_BUY') {
                        buyType = '课程购买'
                    } else if (buyType == 'ONE_CLICK_BUY') {
                        buyType = '一键购买'
                    } else if (buyType == '') {
                        buyType = '-'
                    }
                    successData.push({
                        orderNo: list[i].orderNo,
                        username: list[i].userName == '' ? '-' : list[i].userName,
                        createTime: list[i].createTime == '' ? '-' : list[i].createTime,
                        orderPayType: orderPayType == '' ? '-' : orderPayType,
                        finishedTime: list[i].finishedTime == '' ? '-' : list[i].finishedTime,
                        channelName: list[i].channelName == '' ? '-' : list[i].channelName,
                        buyType: buyType,
                        goodsName: list[i].goodsName == '' ? '-' : list[i].goodsName,
                        goodsType: goodsType == '' ? '-' : goodsType,
                        orderAmount: list[i].orderAmount == '' ? '-' : list[i].orderAmount,
                        orderStatus: orderStatus,
                        uid: list[i].uid,
                        payAmount: list[i].payAmount == '' ? '-' : list[i].payAmount//实付金额
                    });
                }
                this.setState({
                    successData: successData,
                    successCurrent: d.data.currentPage,
                    successPageSize: d.data.total,
                    successPageLength: d.data.list.length,
                    loading: false,
                });
            })
    }

    pageSizeFun(current, pageSize) {
        this.setState({
            pageChange: pageSize,
            page: current - 1,
            current: current
        }, () => {
            this.orderList(this.state.startTimeData.startTime, this.state.endTimeData.endTime, current - 1, pageSize, this.state.timeData.time, this.state.payData.pay, this.state.orderData.order, this.state.payTypeData.payType, this.state.goodsTypeData.goodsType, this.state.searchType, this.state.searchContentData.searchContent, this.state.searchData.search, this.state.buyTypeData.buyType);
        });
    }

    pageChangeFun(pageNum) {
        this.setState({
            page: pageNum - 1,
            current: pageNum
        }, () => {
            this.orderList(this.state.startTimeData.startTime, this.state.endTimeData.endTime, pageNum - 1, this.state.pageChange, this.state.timeData.time, this.state.payData.pay, this.state.orderData.order, this.state.payTypeData.payType, this.state.goodsTypeData.goodsType, this.state.searchType, this.state.searchContentData.searchContent, this.state.searchData.search, this.state.buyTypeData.buyType);
        });
    }
    successPageSizeFun(current, pageSize) {
        this.setState({
            successPageChange: pageSize,
            successPage: current - 1,
            successCurrent: current
        }, () => {
            this.successOrderList(this.state.startTimeData.startTime, this.state.endTimeData.endTime, current - 1, pageSize, this.state.timeData.time, this.state.payData.pay, this.state.orderData.order, this.state.payTypeData.payType, this.state.goodsTypeData.goodsType, this.state.searchType, this.state.searchContentData.searchContent, this.state.searchData.search, this.state.buyTypeData.buyType);
        });
    }

    successPageChangeFun(pageNum) {
        console.log(pageNum);
        this.setState({
            successPage: pageNum - 1,
            successCurrent: pageNum
        }, () => {
            this.successOrderList(this.state.startTimeData.startTime, this.state.endTimeData.endTime, pageNum - 1, this.state.pageChange, this.state.timeData.time, this.state.payData.pay, this.state.orderData.order, this.state.payTypeData.payType, this.state.goodsTypeData.goodsType, this.state.searchType, this.state.searchContentData.searchContent, this.state.searchData.search, this.state.buyTypeData.buyType);
        });
    }

    componentDidMount() {
        this.orderList(null, null, this.state.page, this.state.pageChange, null, null, null, null, null, this.state.searchType, null, null, null);
        this.successOrderList(null, null, this.state.page, this.state.pageChange, null, null, null, null, null, this.state.searchType, null, null, null);
    }

    getTimeData(str, value) {
        this.setState({
            timeData: {
                ...this.state.timeData,
                [str]: value
            }
        })
    }
    getPayData(str, value) {
        this.setState({
            payData: {
                ...this.state.payData,
                [str]: value
            }
        })
    }
    getOrderData(str, value) {
        this.setState({
            orderData: {
                ...this.state.orderData,
                [str]: value
            }
        })
    }
    getPayTypeData(str, value) {
        this.setState({
            payTypeData: {
                ...this.state.payTypeData,
                [str]: value
            }
        })
    }
    getGoodsTypeData(str, value) {
        this.setState({
            goodsTypeData: {
                ...this.state.goodsTypeData,
                [str]: value
            }
        })
    }
    getBuyTypeData(str, value) {
        this.setState({
            buyTypeData: {
                ...this.state.buyTypeData,
                [str]: value
            }
        })
    }
    getSearchData(str, value) {
        this.setState({
            searchData: {
                ...this.state.searchData,
                [str]: value
            }
        })
    }
    getStartTime(value, dateString, str) {
        this.setState({
            startTimeData: {
                ...this.state.startTimeData,
                [str]: dateString
            }
        })
    }
    getEndTime(value, dateString, str) {
        this.setState({
            endTimeData: {
                ...this.state.endTimeData,
                [str]: dateString
            }
        })
    }
    getSearchContentData(str, value) {
        console.log(str, value);
        this.setState({
            searchContentData: {
                ...this.state.searchContentData,
                [str]: value
            },
            searchType: 'accurateSearch',
            page: '0',
            current: 1
        }, () => {
            if (this.state.searchData.search == null) {
                message.error('请选择查询类型');
            }
            // else if(this.state.searchData.search == 'orderCode' && (this.state.searchContentData.searchContent == null || this.state.searchContentData.searchContent == '')){
            //     message.error('请输入订单编码');
            // }else if(this.state.searchData.search == 'uid' && (this.state.searchContentData.searchContent == null || this.state.searchContentData.searchContent == '')){
            //     message.error('请输入用户编码');
            // }else if(this.state.searchData.search == 'userMobile' && (this.state.searchContentData.searchContent == null || this.state.searchContentData.searchContent == '')){
            //     message.error('请输入手机号');
            // }else if(this.state.searchData.search == 'goodsCode' && (this.state.searchContentData.searchContent == null || this.state.searchContentData.searchContent == '')){
            //     message.error('请输入商品编码');
            // }else if(this.state.searchData.search == 'bookCode' && (this.state.searchContentData.searchContent == null || this.state.searchContentData.searchContent == '')){
            //     message.error('请输入书籍编码');
            // }
            else {
                this.orderList(null, null, 0, this.state.pageChange, null, null, null, null, null, "accurateSearch", this.state.searchContentData.searchContent, this.state.searchData.search, null);
                this.successOrderList(null, null, 0, this.state.pageChange, null, null, null, null, null, "accurateSearch", this.state.searchContentData.searchContent, this.state.searchData.search, null);
            }
        })
    }
    query() {
        if (this.state.startTimeData.startTime == "") {
            this.setState({
                startTimeData: {
                    startTime: ''
                }
            })
        }
        if (this.state.endTimeData.endTime == "") {
            this.setState({
                endTimeData: {
                    endTime: ''
                }
            })
        }
        this.setState({
            searchType: 'categorySearch',
            page: 0,
            current: 1
        }, () => {
            if ((this.state.startTimeData.startTime != '' || this.state.endTimeData.endTime != '') && this.state.timeData.time == '') {
                message.error('请选择时间类型');
            } else {
                this.orderList(this.state.startTimeData.startTime, this.state.endTimeData.endTime, this.state.page, this.state.pageChange, this.state.timeData.time, this.state.payData.pay, this.state.orderData.order, this.state.payTypeData.payType, this.state.goodsTypeData.goodsType, "categorySearch", this.state.searchContentData.searchContent, this.state.searchData.search, this.state.buyTypeData.buyType);
                this.successOrderList(this.state.startTimeData.startTime, this.state.endTimeData.endTime, this.state.page, this.state.pageChange, this.state.timeData.time, this.state.payData.pay, this.state.orderData.order, this.state.payTypeData.payType, this.state.goodsTypeData.goodsType, "categorySearch", this.state.searchContentData.searchContent, this.state.searchData.search, this.state.buyTypeData.buyType);
            }
        });
    }
    clearSelect() {
        this.setState({
            startTimeData: {
                startTime: ''
            },
            endTimeData: {
                endTime: ''
            },
            timeData: {
                time: 'orderCreateTime'
            },
            payData: {
                pay: null
            },
            orderData: {
                order: null
            },
            payTypeData: {
                payType: null
            },
            goodsTypeData: {
                goodsType: null
            },
            buyTypeData: {
                buyType: null
            },
        })

    }

    render() {
        const columns = [
            {
                title: '订单编号',
                dataIndex: 'orderNo',
                width: "8%",
                className: 'td_hide',
                render: (text, record) => {
                    return (
                        <Popover
                            placement="top"
                            title={null}
                            content={
                                record.orderNo
                            }
                        >
                            <span>{record.orderNo}</span>
                        </Popover>
                    )
                }
            },
            {

                title: '用户ID',
                dataIndex: 'uid',
                width: "8%",
                className: 'td_hide',
                render: (text, record) => {
                    return (
                        <Popover
                            placement="top"
                            title={null}
                            content={
                                record.uid
                            }
                        >
                            <Link to={"/userList/indexInit?uid=" + record.uid} target="_blank">{record.uid}</Link>
                        </Popover>
                    )
                }
            },

            {
                title: '用户账号',
                dataIndex: 'username',
                width: "8%"
            },
            {
                title: '商品类型',
                dataIndex: 'goodsType',
                width: "8%"
            },
            {
                title: '商品名称',
                dataIndex: 'goodsName',
                width: "8%",
                className: 'td_hide',
                render: (text, record) => {
                    return (
                        <Popover
                            placement="top"
                            title={null}
                            content={
                                record.goodsName
                            }
                        >
                            <span>{record.goodsName}</span>
                        </Popover>
                    )
                }
            },
            {
                title: '订单金额',
                dataIndex: 'orderAmount',
                width: "7%"
            },
            {
                title: '实付金额',
                dataIndex: 'payAmount',
                width: "7%"
            },
            {
                title: '渠道',
                dataIndex: 'channelName',
                width: "8%"
            },
            {
                title: '支付平台',
                dataIndex: 'orderPayType',
                width: "8%"
            },
            {
                title: '订单类型',
                dataIndex: 'buyType',
                width: "8%"
            },
            {
                title: '完成日期',
                dataIndex: 'finishedTime',
                width: "10%"
            }, {
                title: '订单状态',
                dataIndex: 'orderStatus',
                width: "10%",
                render(text, record) {
                    return (
                        <div data-page="orderDetails">
                            <span style={{ marginRight: "5%" }}>{record.orderStatus}</span>
                            <Link to={"/orderDetails?orderNo=" + record.orderNo + ""} target="_blank">
                                查看详情
                            </Link>
                        </div>
                    )
                }
            }];
        return (
            <div>
                <OrderSearcher className="m-order-search" startTimeData={this.state.startTimeData.startTime} endTimeData={this.state.endTimeData.endTime} timeData={this.state.timeData.time} payData={this.state.payData.pay} orderData={this.state.orderData.order} payTypeData={this.state.payTypeData.payType} goodsTypeData={this.state.goodsTypeData.goodsType} buyTypeData={this.state.buyTypeData.buyType} getEndTime={this.getEndTime.bind(this)} getStartTime={this.getStartTime.bind(this)} query={this.query.bind(this)} clearSelect={this.clearSelect.bind(this)} getTimeData={this.getTimeData.bind(this)} getPayData={this.getPayData.bind(this)} getOrderData={this.getOrderData.bind(this)} getPayTypeData={this.getPayTypeData.bind(this)} getGoodsTypeData={this.getGoodsTypeData.bind(this)} getBuyTypeData={this.getBuyTypeData.bind(this)} getSearchData={this.getSearchData.bind(this)} getSearchContentData={this.getSearchContentData.bind(this)}></OrderSearcher>
                <Tabs defaultActiveKey="1">
                    <TabPane type="line" tab='已支付订单' key="1">
                        <div>
                            <Spin tip="加载中..." spinning={this.state.loading} size="large">
                                <Table className="m-table" style={{ paddingRight: '16px' }} rowKey={(record, index) => index} columns={columns} dataSource={this.state.successData} bordered pagination={false} scroll={{ y: ((this.state.successPageLength > 15) ? 600:0) }}  />
                            </Spin>
                        </div>
                        <div className="m-pagination-box">
                            <Pagination pageSizeOptions={['20', '40', '60', '80', '100']} showSizeChanger showQuickJumper className="m-pagination" defaultPageSize={20} showTotal={total => `共 ${total} 条`} defaultCurrent={1} current={this.state.successCurrent} total={this.state.successPageSize} onChange={this.successPageChangeFun} onShowSizeChange={this.successPageSizeFun} />
                        </div>
                    </TabPane>
                    <TabPane type="line" tab='全部订单' key="2">
                        <div>
                            <Spin tip="加载中..." spinning={this.state.loading} size="large">
                                <Table className="m-table" style={{ paddingRight: '16px' }} rowKey={(record, index) => index} columns={columns} dataSource={this.state.tDate} bordered pagination={false} scroll={{ y: ((this.state.pageLength > 15) ? 600:0) }}/>
                            </Spin>
                        </div>
                        <div className="m-pagination-box">
                            <Pagination pageSizeOptions={['20', '40', '60', '80', '100']} showSizeChanger showQuickJumper className="m-pagination" defaultPageSize={20} showTotal={total => `共 ${total} 条`} defaultCurrent={1} current={this.state.current} total={this.state.pageSize} onChange={this.pageChangeFun} onShowSizeChange={this.pageSizeFun} />
                        </div>
                    </TabPane>
                </Tabs>

            </div>
        )
    }
}
