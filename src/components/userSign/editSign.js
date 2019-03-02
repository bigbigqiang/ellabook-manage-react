
/**
 * Created by Administrator on 2018/3/20.
 */
import React from 'react'
import {Table,notification,Modal,Pagination,Tooltip,Select,DatePicker,Button,Input,Icon ,Spin ,Row ,Col ,Form,Switch,Cascader,Radio,message,InputNumber } from 'antd';
import { Link,hashHistory} from 'react-router';
import getUrl from "../util.js"
import './addSign.css';
import moment from 'moment';
import commonData from '../commonData.js';
const { MonthPicker, RangePicker } = DatePicker;
const FormItem = Form.Item;
const { Option, OptGroup } = Select;
const Search = Input.Search;
const RadioGroup = Radio.Group;
function onOk(value) {
    console.log('onOk: ', value);
}
class addSign extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            //活动名称
            activityName:'',
            activityCode:'',
            //签到天数
            signAllDays:7,
            //奖励内容表
            activityPrizeList:[],
            loading:false,
            bookLoading:false,
            startTime:'',
            endTime:'',
            visible: false,
            //奖励列表
            rewardBookList:[],
            rewardVipList:[],
            rewardRedList:[],
            pageVo: {
                page: '0',
                pageSize: '20'
            },
            bookName:[],
            book:{
                bookName:''
            },
            rewardFlag:true,
            //会员下拉框接口
            resultItem:[],
            goods: {
                //状态
                goodsState:"SHELVES_ON"
            },
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
        var activityCode = search.split('?activityCode=')[1].split('&_k=')[0];
        console.log(activityCode);
        this.setState ({
            activityCode: activityCode
        });
        this.detailListFn(activityCode);
        this.bookListFn(this.state.book,this.state.pageVo);
        this.redListFn('');
    }

    async detailListFn(activityCode) {
        this.setState({
            loading: true
        });
        var data = await fetch(getUrl.url, {
            mode: "cors",
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: "method=ella.operation.oneActivity" + "&content=" + JSON.stringify({"activityCode": activityCode})+ commonData.dataString
        }).then(res => res.json())
            .then((d) => {
                console.log(d);
                if (d.status == 1) {
                    const datalist = [];
                    var list = d.data.activityPrizeList;
                    for(let i=0;i<list.length;i++){
                        datalist.push({
                            giftName:list[i].giftName,
                            activityName:list[i].activityName,
                            prizeCategory:list[i].prizeCategory,
                            prizeInfo:list[i].prizeInfo,
                            activityCode:list[i].activityCode,
                        })
                    }
                    this.setState({
                        activityCode:d.data.activitySignList[0].activityCode,
                        activityName:d.data.activitySignList[0].activityName,
                        signAllDays:d.data.activitySignList[0].signAllDays,
                        startTime:d.data.activitySignList[0].startTime,
                        endTime:d.data.activitySignList[0].endTime,
                        //奖励列表
                        activityPrizeList:datalist,
                        loading: false
                    },()=>{
                        this.setState({
                            rewardBookList:this.state.activityPrizeList
                            // rewardVipList:this.state.activityPrizeList.filter(item=>item.prizeCategory=='VIP'),
                            // rewardRedList:this.state.activityPrizeList.filter(item=>item.prizeCategory=='COUPON'),
                        })
                        if(this.state.activityPrizeList.length==this.state.signAllDays){
                            this.setState({
                                rewardFlag:false
                            })
                        }else{
                            this.setState({
                                rewardFlag:true
                            })
                        }
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
            body: "method=ella.operation.coupon.selectH5CouponActivity" + "&content=" + JSON.stringify({searchType:'ACTIVITY_NAME',searchContent:value,pageIndex:'1',pageSize:'20'})+ commonData.dataString
        }).then(res => res.json());
        console.log(data);
		this.setState({

			resultItem : data.data.couponActivityList
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
            body: "method=ella.operation.searchBookByConditions" + "&content=" + JSON.stringify({ "book": book ,"pageVo":pageVo,'searchBoxType':'BOOK_NAME',goods:this.state.goods})+ commonData.dataString
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
    activityNameChange(value){
        console.log(value);
        this.setState({
            activityName:value
        })
    }

    

    //图书奖励
    addBook(){
        this.setState({
            rewardBookList:[
                ...this.state.rewardBookList,
                {
                    giftName:'',
                    activityName:this.state.activityName,
                    prizeCategory:'BOOK',
                    prizeInfo:'',
                    activityCode:this.state.activityCode
                }
            ],
            visible: false
        },()=>{
            if(this.state.rewardBookList.length==this.state.signAllDays){
                this.setState({
                    rewardFlag:false
                })
            }else{
                this.setState({
                    rewardFlag:true
                })
            }
        })
    }
    changeBook(value,index){
        console.log(value);
        this.setState({
            rewardBookList:this.state.rewardBookList.map((item,_index)=>{return index==_index ? {giftName:value,prizeCategory:'BOOK',prizeInfo:value,activityCode:this.state.activityCode,activityName:this.state.activityName} : item})
        })
    }
    delBook(index){
        console.log(index);
        this.setState({
            rewardBookList:this.state.rewardBookList.filter((item,_index)=>index!=_index),
            rewardFlag:true
        },()=>{
            console.log(this.state.rewardBookList);
        })
    }
    //会员奖励奖励
    addVip(){
        this.setState({
            rewardBookList:[
                ...this.state.rewardBookList,
                {
                    giftName:'',
                    prizeCategory:'VIP',
                    activityName:this.state.activityName,
                    prizeInfo:'',
                    activityCode:this.state.activityCode
                }
            ],
            // activityPrizeList:[
            //     ...this.state.activityPrizeList,
            //     {
            //         giftName:'',
            //         prizeCategory:'VIP'
            //     }
            // ],
            visible: false
        },()=>{
            if(this.state.rewardBookList.length==this.state.signAllDays){
                this.setState({
                    rewardFlag:false
                })
            }else{
                this.setState({
                    rewardFlag:true
                })
            }
        })
    }
    changeVip(value,index){
        console.log(value);
        this.setState({
            rewardBookList:this.state.rewardBookList.map((item,_index)=>{return index==_index ? {giftName:value,prizeCategory:'VIP',prizeInfo:value,activityCode:this.state.activityCode,activityName:this.state.activityName} : item})
        })
    }
    delVip(index){
        console.log(index);
        this.setState({
            rewardBookList:this.state.rewardBookList.filter((item,_index)=>index!=_index),
            rewardFlag:true
        },()=>{
            console.log(this.state.rewardBookList);
        })
    }
    //红包奖励
    addRed(){
        this.setState({
            rewardBookList:[
                ...this.state.rewardBookList,
                {
                    giftName:'',
                    prizeCategory:'COUPON',
                    activityName:this.state.activityName,
                    prizeInfo:'',
                    activityCode:this.state.activityCode
                }
            ],
            // activityPrizeList:[
            //     ...this.state.activityPrizeList,
            //     {
            //         giftName:'',
            //         prizeCategory:'COUPON'
            //     }
            // ],
            visible: false
        },()=>{
            if(this.state.rewardBookList.length==this.state.signAllDays){
                this.setState({
                    rewardFlag:false
                })
            }else{
                this.setState({
                    rewardFlag:true
                })
            }
        })
    }
    changeRedPrice(value,index){
        console.log(value);
        this.setState({
            rewardBookList:this.state.rewardBookList.map((item,_index)=>{return index==_index ?  {giftName:value,prizeCategory:'COUPON',prizeInfo:value,activityCode:this.state.activityCode,activityName:this.state.activityName} : item})
        })
    }
    delRed(index){
        console.log(index);
        this.setState({
            rewardBookList:this.state.rewardBookList.filter((item,_index)=>index!=_index),
            rewardFlag:true
        },()=>{
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
    async addSignActivityFn(activityName,signAllDays,startTime,endTime,activityPrizeList) {
        var data = await fetch(getUrl.url, {
            mode: "cors",
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: "method=ella.operation.addSignActivity" + "&content=" + JSON.stringify({"activityName": activityName ,"signAllDays":signAllDays,"startTime":startTime,"endTime":endTime,"activityPrizeList":activityPrizeList})+ commonData.dataString
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
        this.setState({
            activityPrizeList:this.state.rewardBookList
        },()=>{
            console.log(this.state.activityPrizeList);
            if(this.state.activityName == ''){
                message.warning('活动名称不能为空');
                return false;
            }else if(this.state.signAllDays == ''){
                message.warning('签到天数不能为空');
                return false;
            }else if(this.state.startTime == ''){
                message.warning('开始时间不能为空');
                return false;
            }else if(this.state.endTime == ''){
                message.warning('结束时间不能为空');
                return false;
            }else if(this.state.activityPrizeList.length != this.state.signAllDays){
                message.warning('奖励与天数不符，请确认');
                return false;
            }
            for(let i=0;i<this.state.activityPrizeList.length;i++){
                if(this.state.activityPrizeList[i].giftName==''){
                    message.warning('奖励不能为空');
                    return false
                }
            }
            if(this.state.startTime>this.state.endTime){
                message.warning('结束时间不能小于开始时间');
                return false;
            }
            this.addSignActivityFn(this.state.activityName,this.state.signAllDays,this.state.startTime,this.state.endTime,this.state.activityPrizeList);                

        })
    }
    

    render(){
        var w = this;
        console.log(this.state.activityPrizeList.length);
        return (
            <div className="g-bookList">
                <p className="m-head">
                    <Link to="/userSign">
                        <Icon type="left" /> 编辑活动
                    </Link>
                </p>
                <div className="m-addSign-bd">
                    <Spin tip="加载中..." spinning={this.state.loading} size="large" style={{zIndex:9999}}>
                        <Row className="m-input">
                            <Col span={2} style={{ width: 170,textAlign:'right' }}><span className="u-txt">活动名称</span></Col>
                            <Col span={5}>
                                {
                                    <Input style={{ width: 260 }} onChange={(e) => this.activityNameChange(e.target.value)} value={this.state.activityName} />
                                }
                            </Col>
                        </Row>
                        <Row className="m-input">
                        <Col span={2} style={{ width: 170,textAlign:'right' }}><span className="u-txt">签到天数</span></Col>
                            <Col span={3}>
                                <Select style={{ width: 170 }} onChange={(value)=>this.signDayChange(value)} value={this.state.signAllDays}>
                                    <Option value="7">7天</Option>
                                </Select>
                            </Col>
                        </Row>
                        <Row className="m-input">
                            <Col span={2} style={{ width: 170,textAlign:'right' }}><span className="u-txt">具体奖励</span></Col>
                            <Col span={5}>
                                <div>
                                    {
                                        this.state.rewardBookList.map((item , index) => {
                                            if(item.prizeCategory=='BOOK'){
                                                return(
                                                    <Row>
                                                        <Col span={2} style={{ width: 50,textAlign:'right' }}>
                                                            <span className='u-txt'>图书</span>
                                                        </Col>
                                                        <Col span={14}>
                                                            <Select 
                                                                showSearch
                                                                style={{ width: 200 }}
                                                                onFocus={(value) => this.bookListFn(value,this.state.pageVo)}
                                                                onSearch={(value) => this.searchContent(value)}
                                                                onChange={(value) => this.changeBook(value,index)}
                                                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                                                value={this.state.rewardBookList[index].giftName}
                                                            >
                                                                {
                                                                    this.state.bookName.map(function(item){
                                                                        return <Option value={item.bookCode}>{item.bookName}</Option>
                                                                    })
                                                                }
                                                            </Select>
                                                        </Col>
                                                        <Col span={1} offset={1}>
                                                            {
                                                            <Tooltip placement="top" title={"点击删除"}><Icon className="addAndMud" onClick={() => { this.delBook(index) }} type="minus-circle" /></Tooltip>
                                                            }
                                                        </Col>
                                                    </Row>
                                                )
                                            }else if(item.prizeCategory=='VIP'){
                                                return(
                                                    <Row>
                                                        <Col span={2} style={{ width: 50,textAlign:'right' }}>
                                                            <span className='u-txt'>会员</span>
                                                        </Col>
                                                        <Col span={14}>
                                                            <Select
                                                                style={{ width: 200 }}
                                                                onChange={(value) => this.changeVip(value,index)}
                                                                value={this.state.rewardBookList[index].giftName}
                                                                // onFocus={()=>this.vipListFn()}
                                                            >
                                                                <Option value='ELLA-VIP-NEWSEND-WEEK'>周卡</Option>
                                                                <Option value='ELLA-VIP-NEWSEND-MONTH'>月卡</Option>
                                                                <Option value='ELLA-VIP-NEWSEND-YEAR'>年卡</Option>
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
                                            }else if(item.prizeCategory=='COUPON'){
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
                                                                value={this.state.rewardBookList[index].giftName}
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
                                            }
                                        })
                                    }
                                </div>
                                <Button type='primary' onClick={this.showModal}>添加奖品</Button>
                            </Col>
                        </Row>
                        <Row className="m-input">
                            <Col span={2} style={{ width: 170,textAlign:'right' }}><span className="u-txt">活动有效期</span></Col>
                            <Col span={3}>
                                {/* <RangePicker
                                    style={{width:"100%"}}
                                    format="YYYY-MM-DD hh:mm:ss"
                                    onChange={(value, dateString)=>{this.onChangeTime(value, dateString)}}
                                    onOk={onOk}
                                    value={[moment(this.state.startTime,'YYYY-MM-DD hh:mm:ss'),moment(this.state.endTime,'YYYY-MM-DD hh:mm:ss')]}
                                    showTime={{
                                        hideDisabledOptions: true,
                                        defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('11:59:59', 'HH:mm:ss')],
                                    }}
                                /> */}
                                <DatePicker
                                    disabledDate={this.disabledStartDate}
                                    showTime
                                    style={{width:"100%"}}
                                    format="YYYY-MM-DD HH:mm:ss"
                                    placeholder={['开始时间']}
                                    onChange={(value, dateString)=>{this.startTimeChange(value, dateString,"startTime")}}
                                    onOk={onOk}
                                    value={this.state.startTime==''?'':moment(this.state.startTime,'YYYY-MM-DD HH:mm:ss')}
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
                                    value={this.state.endTime==''?'':moment(this.state.endTime,'YYYY-MM-DD HH:mm:ss')}
                                />
                            </Col>
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
                            <Col span={8}><Button disabled={!this.state.rewardFlag} type='primary' onClick={()=>{this.addBook()}}>图书</Button></Col> 
                            <Col span={8}><Button disabled={!this.state.rewardFlag} type='primary' onClick={()=>{this.addVip()}}>会员</Button></Col> 
                            <Col span={8}><Button disabled={!this.state.rewardFlag} type='primary' onClick={()=>{this.addRed()}}>红包</Button></Col> 
                        </Row>
                    </Modal>
                </div>
            </div>
        );
    }
}
// firstPartner = Form.create()(firstPartner)


export default addSign;