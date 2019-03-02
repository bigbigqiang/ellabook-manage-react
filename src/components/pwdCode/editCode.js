
/**
 * Created by Administrator on 2018/3/20.
 */
import React from 'react'
import {Table,notification,Modal,Pagination,Tooltip,Select,DatePicker,Button,Checkbox,Input,Icon ,Spin ,Row ,Col ,Form,Switch,Cascader,Radio,message,InputNumber } from 'antd';
import { Link,hashHistory} from 'react-router';
import getUrl from "../util.js";
import commonData from '../commonData.js';
import './addCode.css';
import moment from 'moment';
import { CommonAddBook } from "../commonAddBook.js"
const { MonthPicker, RangePicker } = DatePicker;
const FormItem = Form.Item;
const { Option, OptGroup } = Select;
const Search = Input.Search;
const RadioGroup = Radio.Group;
function onOk(value) {
    console.log('onOk: ', value);
}
class editCode extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            //活动名称
            waCode:'',
            watchwordCode:'',
            activityAmount: "",         //用户数量
            whetherLimit: false,        //是否限量
            status:'WAITING',                  //活动状态
            loading:false,
            books:[],
            vip:null,
            couponsList:[],
            startTime:'',
            endTime:'',
            visible: false,
            bookVisible:false,
            //奖励列表
            rewardBookList:[],
            pageVo: {
                page: '0',
                pageSize: '20'
            },
            bookNameData:[],
            bookName:[],
            book:{
                bookName:''
            },
            bookFlag:true,
            vipFlag:true,
            redFlag:true,
            //会员下拉框接口
            resultItem:[],
            flag:false
        }
        // this.disabledStartDate  = this.disabledStartDate.bind(this);
        // this.disabledEndDate  = this.disabledEndDate.bind(this);
    }

    //即将插入本组件时，开始请求数据，准备渲染
    componentWillMount(){

    }

    //虚拟dom变成真实dom之后，开始绑定事件
    componentDidMount(){
        this.setState({
            loading:false
        })
        var search = window.location.href;
        console.log(search);
        var waCode = search.split('?waCode=')[1].split('&_k=')[0];
        console.log(waCode);
        this.setState ({
            waCode: waCode
        });
        this.detailListFn(waCode);
        this.bookListFn(this.state.book,this.state.pageVo);
        this.redListFn('');
    }

    async detailListFn(waCode) {
        this.setState({
            loading: true
        });
        var data = await fetch(getUrl.url, {
            mode: "cors",
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: "method=ella.operation.getWatchwordCodeInfo" + "&content=" + JSON.stringify({"waCode": waCode}) + commonData.dataString
        }).then(res => res.json())
            .then((d) => {
                console.log(d);
                if (d.status == 1) {
                    if(d.data.coupons!=null && d.data.coupons!=''){
                        var couponslist = [];
                        var list = d.data.coupons.split(',');
                        for(let i=0;i<list.length;i++){
                            couponslist.push({
                                coupons:list[i]
                            })
                        }
                        this.setState({
                            couponsList:couponslist,
                            bookFlag:false,
                            vipFlag:false
                        })
                    }else if(d.data.books!=null && d.data.books!=''){
                        var bookslist = [];
                        var books = [];
                        var list = d.data.bookList;
                        for(let i=0;i<list.length;i++){
                            bookslist.push({
                                bookCode:list[i].bookCode,
                                bookName:list[i].bookName
                            })
                            books.push(list[i].bookCode)
                        }
                        console.log(books);
                        this.setState({
                            bookNameData:bookslist,
                            books:books,
                            redFlag:false,
                            vipFlag:false
                        })
                    }else if(d.data.vip!=null && d.data.vip!=''){
                        var redlist = [];
                        redlist.push({
                            prizeCategory:'VIP'
                        })
                        this.setState({
                            rewardBookList:redlist,
                            redFlag:false,
                            bookFlag:false,
                            vipFlag:false
                        })
                    }
                    this.setState({
                        watchwordCode:d.data.watchwordCode,
                        activityAmount:d.data.activityAmount,
                        // books:d.data.books,
                        // couponsList:couponslist,
                        vip:d.data.vip,
                        whetherLimit:d.data.whetherLimit=='YES'?false:true,
                        startTime:this.toDate(d.data.startTime),
                        endTime:this.toDate(d.data.finishTime),
                        status:d.data.status,
                        // rewardBookList:datalist,
                        loading: false
                    },()=>{
                        console.log(this.state.couponsList);
                    })
                } else {
                    message.error(d.message)
                    this.setState({
                        loading: false
                    })
                }
            })
    }

    searchContent(value){
        this.setState({
            book:{
                ...this.state.book,
                bookName:value
            }
        },()=>{
            this.bookListFn(this.state.book,this.state.pageVo)
        })
    }
    searchRedContent(value){
        this.redListFn(value);
    }
    //获取红包下拉
    async redListFn(value) {
        var data = await fetch(getUrl.url, {
            mode: "cors",
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: "method=ella.operation.coupon.selectH5CouponActivity" + "&content=" + JSON.stringify({searchType:'ACTIVITY_NAME',searchContent:value,pageIndex:'1',pageSize:'20'}) + commonData.dataString
        }).then(res => res.json());
        console.log(data);
		this.setState({
            resultItem : data.data.couponActivityList,
		})
    }
    //获取图书列表
    async bookListFn(book,pageVo) {
        var data = await fetch(getUrl.url, {
            mode: "cors",
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: "method=ella.operation.searchBookByConditions" + "&content=" + JSON.stringify({ "book": book ,"pageVo":pageVo,'searchBoxType':'BOOK_NAME',goods:this.state.goods}) + commonData.dataString
        }).then(res => res.json())
            .then((d) => {
                console.log(d);
                if (d.status == 1) {
                    const datalist = [];
                    var list = d.data.bookList;
                    for(let i=0;i<list.length;i++){
                        datalist.push({
                            bookName:list[i].bookName,
                            bookCode:list[i].bookCode
                        })
                    }
                    this.setState({
                        bookName:datalist
                    })
                } else {
                    message.error(d.message)
                }
            })
    }
    //活动名称修改
    watchwordCodeChange(value){
        console.log(value);
        this.setState({
            watchwordCode:value
        })
    }
    setOneKV(k, v) {
        this.setState({
            [k]: v
        })
    }

    

    //图书奖励
    addBook(){
        this.setState({
            visible: false,
            bookVisible:true,
            
        })
        this.refs.addBooks.getInitList();
    }
    delBook(index){
        console.log(index);
        
        this.setState({
            bookNameData: this.state.bookNameData.filter((item,_index) => index != _index),
            // rewardBookList:this.state.rewardBookList.filter((item,_index)=>index!=_index),
            books:this.state.books.filter((item,_index)=>index!=_index),
        },()=>{
            if(this.state.books.length==0){
                this.setState({
                    vipFlag:true,
                    redFlag:true,
                })
            }
            console.log(this.state.books.length);
        })
    }
    //会员奖励奖励
    addVip(){
        this.setState({
            rewardBookList:[
                ...this.state.rewardBookList,
                {
                    prizeCategory:'VIP'
                }
            ],
            visible: false,
            bookFlag:false,
            redFlag:false,
            vipFlag:false,
        })
    }
    changeVip(value,index){
        console.log(value);
        this.setState({
            rewardBookList:this.state.rewardBookList.map((item,_index)=>{return index==_index ? {prizeCategory:'VIP'} : item}),
            vip:value
        },()=>{
            console.log(this.state.rewardBookList);
        })
    }
    delVip(index){
        console.log(index);
        this.setState({
            rewardBookList:this.state.rewardBookList.filter((item,_index)=>index!=_index),
            vip:null,
            bookFlag:true,
            redFlag:true,
            vipFlag:true,
        },()=>{
            console.log(this.state.rewardBookList);
        })
    }
    //红包奖励
    addRed(){
        this.setState({
            couponsList:[
                ...this.state.couponsList,
                {
                    coupons:''
                }
            ],
            visible: false,
            bookFlag:false,
            vipFlag:false,
        })
    }
    changeRedPrice(value,index){
        console.log(value);
        this.setState({
            // rewardBookList:this.state.rewardBookList.map((item,_index)=>{return index==_index ?  {coupons:value,prizeCategory:'COUPON'} : item}),
            couponsList:this.state.couponsList.map((item,_index)=>{return index==_index ?  {coupons:value} : item}),
        })
    }
    delRed(index){
        console.log(index);
        this.setState({
            couponsList:this.state.couponsList.filter((item,_index)=>index!=_index),
            // coupons:this.state.coupons.filter((item,_index)=>index!=_index),
            
        },()=>{
            if(this.state.couponsList.length==0){
                this.setState({
                    bookFlag:true,
                    vipFlag:true,
                })
            }
            console.log(this.state.rewardBookList);
        })
    }

    signDayChange(value){
        console.log(value);
        this.setState({
            signAllDays:value
        })
    }
    startTimeChange(value,dateString){
        console.log(dateString);
        console.log(value);
        this.setState({
            startTime: dateString
        })
    }
    endTimeChange(value,dateString){
        console.log(dateString);
        this.setState({
            endTime: dateString
        })
    }
    onChangeTime(value,dateString){
        console.log(value);
        console.log(dateString);
        this.setState({
            startTime:dateString[0],
            endTime:dateString[1]
        })
    }
    disabledDateTime(){
        return {
            disabledHours: () => range(0, 24).splice(4, 20),
            disabledMinutes: () => range(30, 60),
            disabledSeconds: () => [55, 56],
          };
    }
    disabledStartDate(current){
	    return current < moment().startOf('day');
	}
	disabledEndDate(current){
	    return current < moment().startOf('day');
	}
    showModal = () => {
        this.setState({
          visible: true,
        });
      }
    handleOk = () => {
        this.setState({ visible: false });
    }
    handleCancel = () => {
        this.setState({ visible: false });
    }
    //添加活动
    async addwatchwordCodeFn(waCode,watchwordCode,coupons,books,vip,whetherLimit,activityAmount,status,startTime,endTime) {
        console.log(books);
        var doc = '';
        var doc2 = '';
        if(whetherLimit==true){
            doc = 'NO';
            doc2 = '10000000';
        }else{
            doc = 'YES';
            doc2 = activityAmount;
        }
        if(books!=null && books.length>0 && books!=''){
            books = books.join(',');
            coupons = null;
            vip = null;
        }else if(coupons.length>0 && coupons!=null && coupons!=''){
            coupons = coupons.map(item=> {return item.coupons}).join(',');
            books = null;
            vip = null;
        }else if(vip!=null&&vip!=''){
            books = null;
            coupons = null;
        }
        var data = await fetch(getUrl.url, {
            mode: "cors",
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: "method=ella.operation.saveWatchwordCode" + "&content=" + JSON.stringify({'waCode':waCode,"watchwordCode": watchwordCode,'coupons':coupons,'books':books,'vip':vip,'whetherLimit':doc,'activityAmount':doc2,'status':status,"startTime":new Date(startTime).getTime(),"finishTime":new Date(endTime).getTime()}) + commonData.dataString
        }).then(res => res.json())
            .then((d) => {
                console.log(d);
                if (d.status == 1) {
                    notification.success({
                        message: '保存成功',
                        // description: '回到上级菜单',
                      })
                    //   window.history.back();
                } else {
                    message.error(d.message);
                }
            })
    }
    save(){
        if(this.state.watchwordCode == ''){
            message.warning('活动名称不能为空');
            return false;
        }else if(this.state.activityAmount == ''&&this.state.whetherLimit==false){
            message.warning('用户数量不能为空');
            return false;
        }else if(this.state.startTime == ''){
            message.warning('开始时间不能为空');
            return false;
        }else if(this.state.endTime == ''){
            message.warning('结束时间不能为空');
            return false;
        }else if(this.state.books.length==0&&this.state.vip==null&&this.state.couponsList.length==0){
            message.warning('请添加兑换商品');
            return false;
        }
        if(this.state.startTime>this.state.endTime){
            message.warning('结束时间不能小于开始时间');
            return false;
        }
        if(this.state.activityAmount<=0&&this.state.whetherLimit==false){
            message.warning('数量不能少于0');
            return false;
        }
        this.addwatchwordCodeFn(this.state.waCode,this.state.watchwordCode,this.state.couponsList,this.state.books,this.state.vip,this.state.whetherLimit,this.state.activityAmount,this.state.status,this.state.startTime,this.state.endTime);                
    }

    modelCancle(msg) {
        this.setState({
            bookVisible: msg
        });
    }
    bookHandleOk = (selectedRowKeys, selectedRows) => {
        console.log(selectedRowKeys);
        console.log(selectedRows);
        var tmp = this.state.bookNameData;
        tmp.push(...selectedRows);
        //去重,遇到重复的书籍自动去重
        var hash = {};
        tmp = tmp.reduce(function (item, next) {
            hash[next.bookCode] ? '' : hash[next.bookCode] = true && item.push(next);
            return item
        }, []);
        var books = [];
        for(let i=0;i<tmp.length;i++){
            books.push(
                tmp[i].bookCode
            )
        }
        this.setState({
            bookVisible: false,
            bookNameData: tmp,
            // rewardBookList: datalist,
            books:books,
            vipFlag:false,
            redFlag:false,
        });
    }

    toDate(number) {
        var n = number * 1;
        var date = new Date(n);
        var Y = date.getFullYear() + '-';
        var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        var D = date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate() + ' ';
        var h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours() + ':';
        var m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
        return (Y + M + D + h + m)
    }
    

    render(){
        var w = this;
        var obj = {};
        var arr = this.state.bookNameData;
        arr = arr && arr.length ? arr.reduce((item, i) => {
            obj[i.bookName] ? '' : obj[i.bookName] = true && item.push(i);
            return item
        }, []) : [];
        return (
            <div className="g-bookList">
                <p className="m-head">
                    <Link to="/watchcode">
                        <Icon type="left" /> 编辑活动
                    </Link>
                </p>
                <div className="m-addSign-bd">
                    <Spin tip="加载中..." spinning={this.state.loading} size="large" style={{zIndex:9999}}>
                        <Row className="m-input">
                            <Col span={2} style={{ width: 170,textAlign:'right' }}><span className="u-txt">口令码</span></Col>
                            <Col span={5}>
                                {
                                    <Input style={{ width: 260 }} onChange={(e) => this.watchwordCodeChange(e.target.value)} value={this.state.watchwordCode}/>
                                }
                            </Col>
                        </Row>
                        <Row className="m-input">
                            <Col span={2} style={{ width: 170,textAlign:'right' }}><span className="u-txt">兑换商品</span></Col>
                            <Col span={5}>
                                <div>
                                    {arr.map((item, index) => {
                                        return (
                                        <Row>
                                            <Col span={2} style={{ width: 50,textAlign:'right' }}>
                                                <span className='u-txt'>图书</span>
                                            </Col>
                                            <Col span={14}>
                                            <Input value={item.bookName} />
                                            </Col>
                                            <Col span={1} offset={1}>
                                         
                                                    <Tooltip placement="top" title={"点击删除"}><Icon className="addAndMud" onClick={() => { this.delBook(index) }} type="minus-circle" /></Tooltip>
                                       
                                            </Col>
                                        </Row>)
                                        })
                                    }
                                    {
                                        this.state.rewardBookList.map((item , index) => {
                                            return(
                                                <Row>
                                                    <Col span={2} style={{ width: 50,textAlign:'right' }}>
                                                        <span className='u-txt'>会员</span>
                                                    </Col>
                                                    <Col span={14}>
                                                        <Select
                                                            style={{ width: 200 }}
                                                            onChange={(value) => this.changeVip(value,index)}
                                                            value={this.state.vip}
                                                            // onFocus={()=>this.vipListFn()}
                                                        >
                                                            <Option value='ELLA-VIP-WATCHWORD-WEEK'>周卡</Option>
                                                            <Option value='ELLA-VIP-WATCHWORD-MONTH'>月卡</Option>
                                                            <Option value='ELLA-VIP-WATCHWORD-YEAR'>年卡</Option>
                                                            {/* {
                                                                this.state.resultItem.map(item=>{
                                                                    return <Option value={item.thirdCode}>{item.thirdName}</Option>
                                                                })
                                                            } */}
                                                        </Select>
                                                    </Col>
                                                    <Col span={1} offset={1}>
                                                        {
                                                        <Tooltip placement="top" title={"点击删除"}><Icon className="addAndMud" onClick={() => { this.delVip(index) }} type="minus-circle" /></Tooltip>
                                                        }
                                                    </Col>
                                                </Row>
                                            )
                                        })
                                    }
                                    {
                                        this.state.couponsList.map((item , index) => {
                                            return(
                                                <Row>
                                                    <Col span={2} style={{ width: 50,textAlign:'right' }}>
                                                        <span className='u-txt'>红包</span>
                                                    </Col>
                                                    <Col span={14}>
                                                        {/* <Input onChange={(e) => { this.changeRedPrice(e.target.value,index)}} value={this.state.rewardBookList[index].giftName} /> */}
                                                        <Select
                                                            style={{ width: 200 }}
                                                            showSearch
                                                            onSearch={(value) => this.searchRedContent(value)}
                                                            onChange={(value) => this.changeRedPrice(value,index)}
                                                            value={this.state.couponsList[index].coupons}
                                                            onFocus={()=>this.redListFn('')}
                                                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                                            
                                                        >
                                                            {
                                                                this.state.resultItem.map(item=>{
                                                                    return <Option value={item.activityCode}>{item.activityName}</Option>
                                                                })
                                                            }
                                                        </Select>
                                                    </Col>
                                                    <Col span={1} offset={1}>
                                                        {
                                                        <Tooltip placement="top" title={"点击删除"}><Icon className="addAndMud" onClick={() => { this.delRed(index) }} type="minus-circle" /></Tooltip>
                                                        }
                                                    </Col>
                                                </Row>
                                            )
                                        })
                                    }
                                    
                                </div>
                                <Button type='primary' onClick={this.showModal}>添加商品</Button>
                            </Col>
                        </Row>
                        <Row>
                            <CommonAddBook ref="addBooks" rowKey="bookCode" visible={this.state.bookVisible} modelCancle={msg => this.modelCancle(msg)} handleOk={(selectedRowKeys, selectedRows) => this.bookHandleOk(selectedRowKeys, selectedRows)} />
                        </Row>
                        <Row className="m-input">
                            <Col span={2} style={{ width: 170,textAlign:'right' }}><span className="u-txt">活动有效期</span></Col>
                            <Col span={3}>
                                <DatePicker
                                    disabledDate={this.disabledStartDate}
                                    showTime
                                    style={{width:"100%"}}
                                    format="YYYY-MM-DD HH:mm:ss"
                                    placeholder={['开始时间']}
                                    onChange={(value, dateString)=>{this.startTimeChange(value, dateString,"startTime")}}
                                    onOk={onOk}
                                    value={(this.state.startTime==''||this.state.startTime==null)?'':moment(this.state.startTime,'YYYY-MM-DD HH:mm:ss')}
                                />
                            </Col>
                            <Col className="t_center" style={{textAline:"center"}} span={1}>
                                <span style={{width:"100%"}} className="line">—</span>
                            </Col>
                            <Col span={3}>
                                <DatePicker
                                    disabledDate={this.disabledEndDate}
                                    showTime
                                    style={{width:"100%"}}
                                    format="YYYY-MM-DD HH:mm:ss"
                                    placeholder={['结束时间']}
                                    onChange={(value, dateString)=>{this.endTimeChange(value, dateString,"endTime")}}
                                    onOk={onOk}
                                    value={(this.state.endTime=='' || this.state.endTime==null)?'':moment(this.state.endTime,'YYYY-MM-DD HH:mm:ss')}
                                />
                            </Col>
                        </Row>
                        <Row className="m-input">
                            <Col span={2} style={{ width: 170,textAlign:'right' }}><span className="u-txt">用户数量</span></Col>
                            <Col span={3} style={{marginRight:'20px'}}><InputNumber disabled={this.state.whetherLimit} value={this.state.whetherLimit ? '' : this.state.activityAmount} onChange={(value) => { this.setOneKV("activityAmount", value) }} placeholder={this.state.whetherLimit ? '' : "请输入用户数量"} /></Col>
                            <Col span={4}><Checkbox checked={this.state.whetherLimit} onChange={(e) => { this.setOneKV("whetherLimit", e.target.checked) }} >不限量</Checkbox></Col>
                        </Row>
                        <Row className="m-input">
                            <Col span={2} style={{ width: 170,textAlign:'right' }}><span className="u-txt"></span></Col>
                            <Col span={5}>
                                <Button type="primary" onClick={()=>this.save()}>保存</Button>
                            </Col>
                        </Row>
                    </Spin>
                    <Modal
                        visible={this.state.visible}
                        title='添加奖品'
                        onOk={this.handleOk}
                        onCancel={this.handleCancel}
                        footer={null}
                    >
                        <Row className='m-reward-box'>
                            <Col span={12}><Button disabled={!this.state.bookFlag} type='primary' onClick={()=>{this.addBook()}}>图书</Button></Col> 
                            <Col span={12}><Button disabled={!this.state.vipFlag} type='primary' onClick={()=>{this.addVip()}}>会员</Button></Col> 
                            {/* <Col span={8}><Button disabled={!this.state.redFlag} type='primary' onClick={()=>{this.addRed()}}>红包</Button></Col>  */}
                        </Row>
                    </Modal>
                </div>
            </div>
        );
    }
}
// firstPartner = Form.create()(firstPartner)


export default editCode;