import React from 'react'
import { DatePicker, Select, Button, Table, Icon ,Input, Spin ,Modal,Pagination,message} from 'antd'
import { Link} from 'react-router';
import './orderDetails.css';
import { version } from 'antd'
console.log(version)
import commonData from '../commonData.js';
var util = require('../util.js');

export default class OrderTable extends React.Component {
    constructor() {
        super()
        this.state = {
            loading:false,
            visible:false,
            uid:'',
            thirdCode:'',
            bookList:[],
            goodsSrcPriceAll:'',
            goodsPriceAll:""
        }
        this.showModal = this.showModal.bind(this);
        this.hideModal = this.hideModal.bind(this);
        this.pageChangeFun = this.pageChangeFun.bind(this);
        this.pageSizeFun = this.pageSizeFun.bind(this);
    }
    componentDidMount() {
        var search = window.location.href;
        console.log(search);
        var orderNo = search.split('?orderNo=')[1].split('&_k=')[0];
        console.log(orderNo);
        this.state = {
            orderNo: orderNo,
            pageVo:{
                page:0,
                pageSize:10
            },
            current:1,
            pageMax:0
        };
        this.fetchResultItem();
    }

    toDate(number) {
        var n = number * 1;
        var date = new Date(n);
        var Y = date.getFullYear() + '-';
        var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        var D = date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate() + ' ';
        var h = date.getHours() < 10 ? '0'+ date.getHours() : date.getHours() + ':';
        var m = date.getMinutes() < 10 ? '0'+ date.getMinutes() + ':' : date.getMinutes() + ':';
        var s = date.getSeconds() < 10 ? '0'+ date.getSeconds() : date.getSeconds();
        return (Y + M + D +h + m + s)
    }
    timeFormat(timestamp){
        var date = new Date(parseInt(timestamp));
        var Y = date.getFullYear() + '-';
        var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
        var h = date.getHours() + ':';
        var m = date.getMinutes() + ':';
        var s = date.getSeconds();
        return (Y + M + D + " " + h + m + s)
    }
    async fetchResultItem(text){
        this.setState({
            loading:true
        });
        console.log(this.state.orderNo);
        var data = await fetch(util.url,{
            mode : "cors",
            method : "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body:"method=ella.operation.getOrderInfo"+"&content="+JSON.stringify({"orderNo":this.state.orderNo}) + commonData.dataString
        }).then(res => res.json())
            .then((d) => {
                console.log(d);
                var curData=d.data[0];
                if(d.status == 1){
                    var orderStatus = curData.orderStatus;
                    var orderType = curData.orderType;
                    var paymentPlantform = curData.paymentPlantform;
                    var goodsType = curData.goodsType;
                    if(orderStatus=='PAY_WAITING'){
                        orderStatus = '待支付'
                    }else if(orderStatus=='PAY_SUCCESS'){
                        orderStatus = '已支付'
                    }else if(orderStatus=='PAY_EXPIRED'){
                        orderStatus = '已失效'
                    }else if(orderStatus=='PAY_CANCELED'){
                        orderStatus = '已取消'
                    }

                    if(orderType=='BOOK_BUY'){
                        orderType = '购书'
                    }else if(orderType=='MEMBER_BUY'){
                        orderType = '现金购买会员'
                    }else if(orderType=='LIB_BUY'){
                        orderType = '图书馆'
                    }else if(orderType=='BOOK_RENT'){
                        orderType = '租书'
                    }else if(orderType=='ELLA_COIN_BUY'){
                        orderType = '充值'
                    }else if(orderType=='BOOK_PACKAGE_BUY'){
                        orderType = '图书包购买'
                    }else if(orderType=='ONE_CLICK_BUY'){
                        orderType = '一键购买'
                    }else if(orderType=='COURSE_BUY'){
                        orderType = '课程购买'
                    }else if(orderType=='ONE_CLICK_RENT_BOOKS'){
                        orderType = '一键租书'
                    }

                    if(paymentPlantform=='ALIPAY'){
                        paymentPlantform = '支付宝支付'
                    }else if(paymentPlantform=='WXPAY'){
                        paymentPlantform = '微信支付'
                    }else if(paymentPlantform=='APPLE_IAP'){
                        paymentPlantform = '苹果支付'
                    }else if(paymentPlantform=='ELLA_COIN'){
                        paymentPlantform = '咿啦币支付'
                    }else if(paymentPlantform=='INTEGRAL'){
                        paymentPlantform = '积分'
                    }

                    if(goodsType=='ELLA_COIN'){
                        goodsType = '咿啦币'
                    }else if(goodsType=='ELLA_VIP'){
                        goodsType = '咿啦会员'
                    }else if(goodsType=='BOOK'){
                        goodsType = '图书'
                    }else if(goodsType=='BOOK_PACKAGE'){
                        goodsType = '图书包'
                    }
                    //reduce累加
                    let goodsPrice=d.data.map((item)=>item.goodsPrice).reduce((pre, cur) => pre + cur);
                    let  goodsSrcPrice=d.data.map((item)=>item.goodsSrcPrice).reduce((pre, cur) => pre + cur);

                    var goodsData=d.data;

                    this.setState({
                        goodsSrcPriceAll: goodsSrcPrice!=null? goodsSrcPrice.toFixed(2):'-',
                        goodsPriceAll:goodsPrice!=null?goodsPrice.toFixed(2):'-',
                        loading:false,
                        uid: curData.uid,
                        orderNo: curData.orderNo,
                        userNick:curData.userNick,
                        orderType: orderType==null?'-':orderType,
                        channelName: curData.channelName==null?'-':curData.channelName,
                        createTime:this.toDate(curData.createTime),
                        discount:curData.discount==null?'-':curData.discount,
                        discountPrice:curData.discountPrice==null?'-':curData.discountPrice,
                        thirdCode:curData.thirdCode==null?'':curData.thirdCode,
                        //商品信息
                        goods:goodsData,
                        //支付信息
                        pay:[
                            {
                                payPlatform: curData.channelName || '-',
                                channelName: curData.channelName || '-',
                                paymentPlantform: paymentPlantform,
                                orderType: orderType,
                                payTime: this.toDate(curData.payTime),
                                orderStatus: orderStatus,
                            }
                        ],
                        //订单汇总
                        order:[
                            {
                                project:'金额',
                                orderAmount: curData.orderAmount || '0',
                                couponAmount: curData.couponAmount || '0',
                                festival:0,
                                weixin:0,
                                payAmount: (curData.paymentPlantform == 'INTEGRAL' && curData.orderStatus == 'PAY_SUCCESS')?'0':((curData.goodsPrice-(curData.couponAmount || '0')-(curData.payAmount || '0'))>0?(curData.goodsPrice-(curData.couponAmount || '0')-(curData.payAmount || '0')):'0'),
                            }
                        ]
                    });
                }else{
                    message.error('获取信息失败');
                }

            })
    }

    //图书包弹窗
    async fetchBookPackage(uid,value,pageVo){
        var data = await fetch(util.url,{
            mode : "cors",
            method : "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body:"method=ella.operation.getOrderGoodsInfo"+"&content="+JSON.stringify({"uid":uid,"thirdCode":value,'pageVo':pageVo,'type':'BOOK_PACKAGE'}) + commonData.dataString
        }).then(res => res.json())
            .then((d) => {
                console.log(d);
                if(d.status==1){
                    const bookList = [];
                    var list = d.data.bookList;
                    for(let i=0;i<list.length;i++){
                        bookList.push({
                            bookName:(list[i].bookName==''||list[i].bookName==null)?'-':list[i].bookName,
                            bookCode:(list[i].bookCode==''||list[i].bookCode==null)?'-':list[i].bookCode,
                            goodsSrcPrice:(list[i].goodsSrcPrice==''||list[i].goodsSrcPrice==null)?'-':list[i].goodsSrcPrice,
                        })
                    }
                    this.setState({
                        bookList:bookList,
                        pageMax : d.data.total,
                        pageLength : d.data.bookList.length,
                    })
                }else{
                    message.error('获取信息失败');
                }
            })
    }
    //图书弹窗
    async fetchBook(thirdCode,value){
        var data = await fetch(util.url,{
            mode : "cors",
            method : "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body:"method=ella.operation.getOrderGoodsInfo"+"&content="+JSON.stringify({"thirdCode":thirdCode,"type":value}) + commonData.dataString
        }).then(res => res.json())
            .then((d) => {
                if(d.status==1){
                    console.log(d);
                    this.setState({
                        bookList:[{
                            bookName:(d.data.bookName==''||d.data.bookName==null)?'-':d.data.bookName,
                            bookCode:(d.data.bookCode==''||d.data.bookCode==null)?'-':d.data.bookCode,
                            goodsSrcPrice:(d.data.goodsSrcPrice==''||d.data.goodsSrcPrice==null)?'-':d.data.goodsSrcPrice,
                        }],
                    })
                }else{
                    message.error('获取信息失败');
                }
            })
    }

    showModal(str,value){
        console.log(str,value);
        console.log(this.state.thirdCode);
        console.log(this.state.pageVo);
        if(str=='BOOK_PACKAGE'){
            this.fetchBookPackage(this.state.uid,value,this.state.pageVo);
        }else if(str=='BOOK'){
            this.fetchBook(value,'BOOK');
        }else{
            alert('数据异常');
        }
        this.setState({
            visible:true
        })
    }
    pageChangeFun(pageNum){
        console.log(pageNum);
        this.setState({
            pageVo:{
                ...this.state.pageVo,
                page:pageNum-1,
            },
            current:pageNum
        },()=>{
            this.fetchBookPackage(this.state.uid,this.state.thirdCode,this.state.pageVo);
        });
    }
    pageSizeFun(current, pageSize){
        console.log(current, pageSize);
        this.setState({
            pageVo:{
                pageSize:pageSize,
                page:current-1,
            },
            current:current
        },()=>{
            this.fetchBookPackage(this.state.uid,this.state.thirdCode,this.state.pageVo);
        });
    }
    hideModal(){
        this.setState({
            visible:false
        })
    }

    render() {
        var w=this;
        const goodsColumns = [
            {
                title: '商品类型',
                dataIndex: 'goodsType',
                width:'17%',
                render(text, record){
                    console.log(record)
                    return(

                        <span>
	                        {
                                record.goodsType=='ELLA_COIN'?"咿啦币":(record.goodsType=='ELLA_VIP'?"咿啦会员":(record.goodsType=='BOOK'?"图书":(record.goodsType=='BOOK_PACKAGE'?"图书包":'-')))
                            }
                        </span>
                    )
                }
            },
            {
                title: '商品内容',
                dataIndex: 'goodsSubstance',
                width:'14%',
                render(text, record){
                    console.log(record)
                    return(
                        <div>
                            {record.goodsType=='ELLA_COIN'?record.goodsPrice:(record.goodsType=='ELLA_VIP'?record.goodsName:(record.goodsType=='BOOK'?<a onClick={()=>w.showModal('BOOK',record.thirdCode)}>查看</a>:(record.goodsType=='BOOK_PACKAGE'?<a onClick={()=>w.showModal('BOOK_PACKAGE',record.thirdCode)}>查看</a>:'-')))}
                        </div>
                    )
                }
            },
            {
                title: '商品 ID',
                dataIndex: 'goodsCode',
                width:'16%',
            },
            {
                title: '商品名称',
                dataIndex: 'goodsName',
                width:'14%',
            },
            {
                title: '商品原价',
                dataIndex: 'goodsSrcPrice',
                width:'14%',
            },
            {
                title: '实际售价',
                dataIndex: 'goodsPrice',
                width:'14%',
            },
            {
                title: '支付积分',
                dataIndex: 'payPoints',
                width:'14%',
                render: (text, record) => {
                    return (record.payPoints || '-')
                }
            }
        ];
        const payColumns = [
            {
                title: '支付方式',
                dataIndex: 'paymentPlantform'
            },
            {
                title: '订单类型',
                dataIndex: 'orderType'
            },
            {
                title: '订单完成日期',
                dataIndex: 'payTime'
            },
            {
                title: '订单状态',
                dataIndex: 'orderStatus'
            },
        ];
        // const discountColumns = [];
        const orderColumns = [
            {
                title: '项目',
                dataIndex: 'project'
            },
            {
                title: '订单总额',
                dataIndex: 'orderAmount'
            },
            {
                title: '购书红包',
                dataIndex: 'couponAmount'
            },
            {
                title: '待支付金额',
                dataIndex: 'payAmount'
            },
        ];

        const bookColumns = [
            {
                title: '图书名称',
                dataIndex: 'bookName'
            },
            {
                title: 'bookID',
                dataIndex: 'bookCode'
            },
            {
                title: '原价',
                dataIndex: 'goodsSrcPrice'
            }
        ];
        const style = {marginLeft: '20px',fontSize:'14px'}
        return (
            <div>
                <Spin spinning={this.state.loading} size="large">
                    <p className="m-head">
                        <Link to={window.location.href.indexOf('fromuser') > -1 ? '/userList?uid='+this.props.params.curuid+'&key=3' : "/orderPage"}>
                            <Icon type="left" /> 订单详情
                        </Link>
                    </p>
                    <div className="m-detail-bd">
                        <p>订单信息</p>
                        <div className="m-ul-list">
                            <ul>
                                <li>
                                    <span>订单编号:</span>
                                    {this.state.orderNo}
                                </li>
                                <li>
                                    <span>订单类型:</span>
                                    {this.state.orderType}
                                </li>
                                <li>
                                    <span>渠道:</span>
                                    {this.state.channelName}
                                </li>
                                <li>
                                    <span>用户ID:</span>

                                    <Link to={"/userList/indexInit?uid="+this.state.uid} target="_blank">{this.state.uid}</Link>
                                </li>
                                <li>
                                    <span>用户昵称:</span>
                                    {this.state.userNick}
                                </li>
                                <li>
                                    <span>订单生成日期:</span>
                                    {this.state.createTime}
                                </li>
                            </ul>
                        </div>
                        <p>商品信息</p>
                        <Table
                            className="m-dt-table goodsDetail"
                            columns={goodsColumns}
                            dataSource={this.state.goods}
                            bordered
                            pagination={false}
                            scroll={{ y: 370 }}
                            footer={() =>
                                <div style={{"text-align":"right","position":"relative"}}>
                                    <span style={{"width":"17%","display":"inline-block","text-align":"center"}}>总计：</span>
                                    <span style={{"width":"16%","display":"inline-block","text-align":"center"}}>{this.state.goodsSrcPriceAll}</span>
                                    <span style={{"width":"16%","display":"inline-block","text-align":"center"}}>{this.state.goodsPriceAll}</span>
                                </div>
                            }
                        />
                        <p>支付信息</p>
                        <Table className="m-dt-table" columns={payColumns} dataSource={this.state.pay} bordered pagination={false}/>
                        <p>优惠信息</p>
                        {/*<Table columns={payColumns} dataSource={this.state.pay} bordered pagination={false}/>*/}
                        <div className="m-ul-list">
                            <ul>
                                <li>
                                    <span>优惠类型</span>
                                    {this.state.discount}
                                </li>
                            </ul>
                            <ul>
                                <li>
                                    <span>优惠价格</span>
                                    {this.state.discountPrice}
                                </li>
                            </ul>
                        </div>
                        <p>订单汇总</p>
                        <Table className="m-dt-table" columns={orderColumns} dataSource={this.state.order} bordered pagination={false}/>
                    </div>

                    <Modal
                        visible={this.state.visible}
                        title='商品内容'
                        onCancel={this.hideModal}
                        footer={null}
                        width={800}
                        className="book-modal"
                    >
                        <Table className="m-dt-table" columns={bookColumns} dataSource={this.state.bookList} pagination={false}/>
                        <Pagination pageSizeOptions={['10','20','50','100','200']} showSizeChanger showQuickJumper showTotal={total => `共 ${total} 条`} className="modal-pagination" defaultPageSize={10} defaultCurrent={1} current={this.state.current} total={this.state.pageMax} onChange={this.pageChangeFun} onShowSizeChange={this.pageSizeFun}/>
                    </Modal>
                </Spin>
            </div>
        )
    }
}
