/*
 	created by NiePengfei at 2017/11/14
 	用户详情--订单详情
 */

import React from 'react'
import {Table,Pagination,Spin,Popover} from 'antd';
import { Link} from 'react-router';
import "./dingDan.css"
import getUrl from "../util.js"
import $ from 'jquery'
import { dataString } from '../commonData.js'

export default class DingDan extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            dingDanInfor:[],	//订单详情的数据
            pageMax:0,			//最大页数
            pageSizeNow:20,
            moneyDetail:{
                sumUserRechargeAmount:"0",
                sumUserPayAmount:"0",
                totalPaidOrders:"0",
                totalPointsOrders: '0'
            },		//用户充值、支付的总金额
            loading:true,
            pageLengthNow:0,
        }
        this.pageChangeFun = this.pageChangeFun.bind(this);
        this.pageSizeChangeFun = this.pageSizeChangeFun.bind(this);
    }

    //即将插入本组件时，开始请求数据，准备渲染
    componentWillMount(){
        this.getDIngDanInfor(0,20);
    }

    //虚拟dom变成真实dom之后，开始绑定事件
    componentDidMount(){
    }

    getDIngDanInfor(pageNumber,pageSize){
        var theUid = this.props.uid;
        console.log(theUid);
        var thisTrue = this;
        thisTrue.setState({
            loading:true
        })

        fetch(getUrl.url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: "method=ella.operation.userOrderStatistic" + "&content=" + JSON.stringify({
                "uid": theUid,
                "page":pageNumber,
                "pageSize":pageSize
            })+dataString
        })
            .then(function(response){
                console.log(response);
                return response.json();
            })
            .then(function(response){
                console.log(response);
                if (response.status == 1) {
                    if(response.data.total<=20){
                        document.getElementsByClassName("paixu")[0].style.opacity="0";
                    }else{
                        document.getElementsByClassName("paixu")[0].style.opacity="1";
                    }
                    for(let lh=0;lh<response.data.list.length;lh++){
                        if (response.data.list[lh].orderStatus == "PAY_WAITING") {
                            response.data.list[lh].orderStatus="待支付"
                        }else if (response.data.list[lh].orderStatus == "PAY_SUCCESS") {
                            response.data.list[lh].orderStatus="支付成功"
                        }else if (response.data.list[lh].orderStatus == "PAY_EXPIRED") {
                            response.data.list[lh].orderStatus="已失效"
                        }else if (response.data.list[lh].orderStatus == "PAY_CANCELED") {
                            response.data.list[lh].orderStatus="取消支付"
                        }

                        if (response.data.list[lh].paymentPlantform == "ALIPAY") {
                            response.data.list[lh].paymentPlantform="支付宝支付"
                        }else if (response.data.list[lh].paymentPlantform == "WXPAY") {
                            response.data.list[lh].paymentPlantform="微信支付"
                        }else if (response.data.list[lh].paymentPlantform == "APPLE_IAP") {
                            response.data.list[lh].paymentPlantform="苹果支付"
                        }else if (response.data.list[lh].paymentPlantform == "ELLA_COIN") {
                            response.data.list[lh].paymentPlantform="咿啦币支付"
                        }else if (response.data.list[lh].paymentPlantform == "INTEGRAL") {
                            response.data.list[lh].paymentPlantform="积分"
                        }

                        if (response.data.list[lh].goodsType == "BOOK") {
                            response.data.list[lh].goodsType="图书"
                        }else if (response.data.list[lh].goodsType == "LIB") {
                            response.data.list[lh].goodsType="图书馆"
                        }else if (response.data.list[lh].goodsType == "BOOK_PACKAGE") {
                            response.data.list[lh].goodsType="图书包"
                        }else if (response.data.list[lh].goodsType == "ELLA_VIP") {
                            response.data.list[lh].goodsType="会员"
                        }else if (response.data.list[lh].goodsType == "ELLA_COIN") {
                            response.data.list[lh].goodsType="咿啦币"
                        }

                        if(response.data.list[lh].orderType=='BOOK_BUY'){
                            response.data.list[lh].orderType = '购书'
                        }else if(response.data.list[lh].orderType=='MEMBER_BUY'){
                            response.data.list[lh].orderType = '现金购买会员'
                        }else if(response.data.list[lh].orderType=='LIB_BUY'){
                            response.data.list[lh].orderType = '图书馆'
                        }else if(response.data.list[lh].orderType=='BOOK_RENT'){
                            response.data.list[lh].orderType = '租书'
                        }else if(response.data.list[lh].orderType=='ELLA_COIN_BUY'){
                            response.data.list[lh].orderType = '充值'
                        }else if(response.data.list[lh].orderType=='BOOK_PACKAGE_BUY'){
                            response.data.list[lh].orderType = '图书包购买'
                        }else if(response.data.list[lh].orderType=='ONE_CLICK_BUY'){
                            response.data.list[lh].orderType = '一键购买'
                        }else if(response.data.list[lh].orderType=='ONE_CLICK_RENT_BOOKS'){
                            response.data.list[lh].orderType = '一键租书'
                        }else{
                            response.data.list[lh].orderType = '-'
                        }


                    }
                    thisTrue.setState({
                        dingDanInfor:response.data.list,
                        pageMax: response.data.total,
                        moneyDetail:response.data.userPayAndRechargeAmount,
                        loading:false,
                        pageLengthNow:response.data.list.length
                    })
                }
            })
    }

    //换页时，更新内容
    pageChangeFun(pageNumber) {
        console.log('Page: ', pageNumber);
        this.getDIngDanInfor(pageNumber-1,this.state.pageSizeNow);
    }
    pageSizeChangeFun(current,size){
        this.setState({
            pageSizeNow:size
        })
        this.getDIngDanInfor(current-1,size);
    }

    render(){
        const columns = [{
            title: '商品类型',
            dataIndex: 'goodsType',
            key: 'goodsType',
            width: '10%'
        }, {
            title: '商品名称',
            dataIndex: 'goodsName',
            key: 'goodsName',
            width: '20%',
            className:"td_hide",
            render: (text, record) => {
                return(
                    <Popover content={(<span>{record.goodsName}</span>)}>
                        <span>{(record.goodsName==null || record.goodsName == '')?'-':record.goodsName}</span>
                    </Popover>
                )
            }
        }, {
            title: '下单时间',
            dataIndex: 'createTime',
            key: 'createTime',
            width: '10%'
        }, {
            title: '订单状态',
            dataIndex: 'orderStatus',
            key: 'orderStatus',
            width: '10%'
        }, {
            title: '订单类型',
            dataIndex: 'orderType',
            key: 'orderType',
            width: '10%'
        },{
            title: '支付平台',
            dataIndex: 'paymentPlantform',
            key: 'paymentPlantform',
            width: '10%',
            render: (text, record) => {
                return (
                    <span>{(record.paymentPlantform==''||record.paymentPlantform==null)?'-':record.paymentPlantform}</span>
                )
            }
        }, {
            title: '订单金额',
            dataIndex: 'orderAmount',
            key: 'orderAmount',
            width: '10%',
            render: (text, record) => {
                return (
                    <span>{(record.orderAmount==''||record.orderAmount==null)?'-':record.orderAmount}</span>
                )
            }
        }, {
            title: '实付金额',
            dataIndex: 'payAmount',
            key: 'payAmount',
            width: '10%',
            render: (text, record) => {
                return (
                    <span>{(record.payAmount==''||record.payAmount==null)?'-':record.payAmount}</span>
                )
            }
        }, {
            title: '操作',
            dataIndex: 'edit',
            width: '10%',
            render: (text, record) => {
                return (
                    <div>
                        <Link to={"/orderDetails/fromuser/"+this.props.uid+"?orderNo="+record.orderNo+""}>
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
                            <span>充值总金额(元)</span>
                            <span>{this.state.moneyDetail.sumUserRechargeAmount==null?0:this.state.moneyDetail.sumUserRechargeAmount}</span>
                        </div>
                        <div className="topBox">
                            <span>咿啦币总消费(元)</span>
                            <span>{this.state.moneyDetail.sumUserPayAmount==null?0:this.state.moneyDetail.sumUserPayAmount}</span>
                        </div>
                        <div className="topBox">
                            <span>已支付订单数</span>
                            <span>{this.state.moneyDetail.totalPaidOrders==null?0:this.state.moneyDetail.totalPaidOrders}</span>
                        </div>
                        <div className="topBox">
                            <span>积分购买订单数</span>
                            <span>{this.state.moneyDetail.totalPointsOrders==null?0:this.state.moneyDetail.totalPointsOrders}</span>
                        </div>
                    </div>
                    <div className="ddBottom">
                        <Table className="t-nm-tab" dataSource={this.state.dingDanInfor} columns={columns} pagination={false} scroll={{ y: ((this.state.pageLengthNow > 11) ? 500:0) }} />
                        <div className="paixu">
                            <Pagination className="paixuIn" showSizeChanger pageSizeOptions={['20','50','100','200','500','1000']} defaultPageSize={20} defaultCurrent={1} showTotal={total => `共 ${total} 条`} total={this.state.pageMax} onChange={this.pageChangeFun} showQuickJumper={true}  onShowSizeChange={this.pageSizeChangeFun} />
                        </div>
                    </div>
                </Spin>
            </div>
        );
    }
}
