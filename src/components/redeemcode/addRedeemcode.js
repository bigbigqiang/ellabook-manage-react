import React from 'react'
import {Modal,Tooltip,Select,DatePicker,Button,Input,Icon ,Spin ,Row ,Col,message,InputNumber } from 'antd';
import { Link,hashHistory} from 'react-router';
import getUrl from "../util.js";
import './addRedeemcode.css';
import moment from 'moment';
import { CommonAddBook } from "./commonAddBook.js"
const { Option} = Select;
function onOk(value) {
    console.log('onOk: ', value);
}
class addRedeemCode extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: false,
            bookVisible:false,
            cardCode:this.props.params.cardCode,//活动编码
            batch:this.props.params.batch,
            redeemCodeType: this.props.params.redeemCodeType?this.props.params.redeemCodeType:'',//商品类型选择活动的话是ip卡，选择会员分月卡和年卡
            createNum: "",//用户数量
            createName: "",//兑换码名称
            expireTime: "",
            ipCardEventId: "",
            status:this.props.params.status,
            activityName:'',
            activityFlag:true,
            activityShow:false,
            vipFlag:true,
            vipShow:false,
        }
        // this.disabledStartDate  = this.disabledStartDate.bind(this);
        // this.disabledEndDate  = this.disabledEndDate.bind(this);
    }
    //虚拟dom变成真实dom之后，开始绑定事件
    componentDidMount(){
        this.setState({
            loading:false
        })
        if(this.state.status=="edit"){
            this.detailRedeemCode();
        }
    }
    detailRedeemCode() {
        getUrl.API({cardCode:this.state.cardCode,redeemCodeType:this.state.redeemCodeType},"ella.operation.getRedeemCodeInfo")
        .then(response=>response.json())
        .then(response=>{
            if(response.status==1){
                this.setState({
                    createName: response.data.createName,
                    createNum: response.data.createNum,
                    expireTime: response.data.expireTime,
                    ipCardEventId: response.data.ipCardEventId,
                    redeemCodeType: response.data.redeemCodeType,
                    vipShow:(response.data.redeemCodeType=="monthCard"||response.data.redeemCodeType=="yearCard")?true:false,
                    vipFlag:(response.data.redeemCodeType=="monthCard"||response.data.redeemCodeType=="yearCard")?false:true,
                    activityFlag:response.data.redeemCodeType=="ipCard"?true:false,
                    activityShow:response.data.redeemCodeType=="ipCard"?true:false,
                    activityName:response.data.activityName

               })
            }else{
                message.error(response.message)
            }
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
 
    //会员奖励奖励
    addVip(){
        this.setState({
            visible: false,
            activityFlag:false,
            vipFlag:false,
            vipShow:true,
            redeemCodeType:'',

        })
    }
    delVip(index){
        console.log(index);
        this.setState({
            redeemCodeType:"",
            ipCardEventId:'',
            rewardBookList:this.state.rewardBookList.filter((item,_index)=>index!=_index),
            vip:null,
            activityFlag:true,
            vipFlag:true,
        },()=>{
            console.log(this.state.rewardBookList);
        })
    }
 
    endTimeChange(value,dateString){
        console.log(dateString);
        this.setState({
            expireTime: dateString
        })
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

    save(){
        function getNowFormatDate() {
		    var date = new Date();
		    var seperator1 = "-";
		    var seperator2 = ":";
		    var month = date.getMonth() + 1;
		    var strDate = date.getDate();
		    if (month >= 1 && month <= 9) {
		        month = "0" + month;
		    }
		    if (strDate >= 0 && strDate <= 9) {
		        strDate = "0" + strDate;
		    }
		    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
            + " " + date.getHours() + seperator2 + date.getMinutes()
            + seperator2 + date.getSeconds();
		    return currentdate;
		}
        if(this.state.createName == ''){
            message.warning('活动名称不能为空');
            return;
        }
        if(!this.state.redeemCodeType){

            message.warning('请添加兑换商品');
            return;
        }
        if(this.state.redeemCodeType=="ipCard"&&!this.state.ipCardEventId){

            message.warning('请添加兑换商品');
            return;
        }
       
        if(this.state.expireTime == ''){
            message.warning('结束时间不能为空');
            return;
        }
		var curTime=getNowFormatDate();
        if (new Date(this.state.expireTime.replace(/-/g, "\/"))<=new Date(curTime.replace(/-/g, "\/"))) {
            message.error("结束时间必须大于当前时间!")
            return;
        }
        console.log(!!this.state.createNum)
        if(!this.state.createNum||this.state.createNum<1){
            message.warning('用户数量必须大于等于1');
            return;
        }
        if(this.state.status=="add"){
            var doc={
                redeemCodeType:this.state.redeemCodeType,
                createNum: this.state.createNum,
                createName: this.state.createName,
                expireTime: this.state.expireTime,
                ipCardEventId:this.state.ipCardEventId
            }
            var url="ella.operation.saveRedeemCode";
        }else{
            var doc={
                cardCode:this.state.cardCode,
                redeemCodeType:this.state.redeemCodeType,
                batch:this.state.batch,
                expireTime: this.state.expireTime,

            }
            var url="ella.operation.updateRedeemCodeExpireTime"
        }
        console.log(doc)
       
        getUrl.API(doc,url)
        .then(response=>response.json())
        .then(response=>{
            if(response.status==1){
                message.success("保存成功！")
                if(this.state.status=="add"){
                    setTimeout(() => {
                        hashHistory.push('/redeemcode');
                    }, 1000)
                }
            }else{
                message.error(response.message)
            }
        })
    }

    modelCancle(msg) {
        this.setState({
            bookVisible: msg
        });
    }
    bookHandleOk = (selectedRowKeys, selectedRows) => {
    
        this.setState({
            bookVisible: false,
            vipFlag:false,
            redeemCodeType:"ipCard",
            ipCardEventId:selectedRows[0].activityCode,
            activityName:selectedRows[0].activityName,
            activityShow:true
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
        return (
            <div className="g-bookList">
                <p className="m-head">
                    <Link to="/redeemcode">
                        <Icon type="left" /> {this.state.status=="add"?"添加":"编辑"}兑换码
                    </Link>
                </p>
                <div className="m-addSign-bd">
                    <Spin tip="加载中..." spinning={this.state.loading} size="large" style={{zIndex:9999}}>
                        <Row className="m-input">
                            <Col span={2} style={{ width: 170,textAlign:'right' }}><span className="u-txt">兑换码名称</span></Col>
                            <Col span={5}>
                                {
                                    <Input style={{ width: 260 }} disabled={this.state.status=="add"?false:true} onChange={(e) => { this.setOneKV("createName", e.target.value) }} value={this.state.createName}/>
                                }
                            </Col>
                        </Row>
                        <Row className="m-input">
                            <Col span={2} style={{ width: 170,textAlign:'right' }}><span className="u-txt">兑换商品</span></Col>
                            <Col span={5}>
                                <div>
                                    {
                                       this.state.activityShow&&<Row>
                                            <Col span={2} style={{ width: 50,textAlign:'right' }}>
                                                <span className='u-txt'>活动</span>
                                            </Col>
                                            <Col span={14}>
                                            <Input value={this.state.activityName} disabled={this.state.status=="add"?false:true}/>
                                            </Col>
                                            <Col span={1} offset={1}>
                                         
                                                <Tooltip placement="top"  title={"点击删除"}>
                                                    <Icon className="addAndMud" disabled={this.state.status=="add"?false:true} 
                                                        onClick={() => { 
                                                            if(this.state.status=="edit"){
                                                                message.error("编辑页不支持修改！")
                                                                return ;
                                                            }
                                                            this.setState({
                                                                activityName:'',
                                                                ipCardEventId:'',
                                                                vipFlag:true,
                                                                activityShow:false
                                                            }) 
                                                        }} 
                                                        type="minus-circle"
                                                    />
                                                </Tooltip>
                                       
                                            </Col>
                                        </Row>
                                        
                                    }
                                    {this.state.vipShow&&<Row>
                                        <Col span={2} style={{ width: 50,textAlign:'right' }}>
                                            <span className='u-txt'>会员</span>
                                        </Col>
                                        <Col span={14}>
                                            <Select
                                                style={{ width: 200 }}
                                                onChange={(value) => this.setOneKV("redeemCodeType",value)}
                                                value={this.state.redeemCodeType}
                                                disabled={this.state.status=="add"?false:true}
                                            >
                                                <Option value='monthCard'>月卡</Option>
                                                <Option value='yearCard'>年卡</Option>
                                            </Select>
                                        </Col>
                                        <Col span={1} offset={1}>
                                            
                                            <Tooltip placement="top" disabled={this.state.status=="add"?false:true} title={"点击删除"}>
                                                <Icon 
                                                    className="addAndMud" 
                                                    onClick={() => {
                                                        if(this.state.status=="edit"){
                                                            message.error("编辑页不支持修改！")
                                                            return ;
                                                        }
                                                        this.setState({
                                                            activityName:'',
                                                            ipCardEventId:'',
                                                            vipShow:false,
                                                            vipFlag:true,
                                                            activityFlag:true
                                                        }) 
                                                       
                                                    }} 
                                                    type="minus-circle" 
                                                />
                                            </Tooltip>
                                            
                                        </Col>
                                    </Row>
                                            
                                   
                                    }
                               
                                    
                                </div>
                                <Button type='primary' onClick={this.showModal} disabled={this.state.status=="add"?false:true}>添加商品</Button>
                            </Col>
                        </Row>
                        <Row>
                            <CommonAddBook ref="addBooks" rowKey="bookCode" visible={this.state.bookVisible} modelCancle={msg => this.modelCancle(msg)} handleOk={(selectedRowKeys, selectedRows) => this.bookHandleOk(selectedRowKeys, selectedRows)} />
                        </Row>
                        <Row className="m-input">
                            <Col span={2} style={{ width: 170,textAlign:'right' }}><span className="u-txt">活动过期时间</span></Col>
                            <Col span={3}>
                                <DatePicker
                                    format="YYYY-MM-DD HH:mm:ss"
                                    placeholder={['结束时间']}
                                    showTime
                                    onChange={(value, dateString)=>{this.endTimeChange(value, dateString,"expireTime")}}
                                    value={this.state.expireTime!= '' ? moment(this.state.expireTime, 'YYYY-MM-DD hh:mm:ss') : null}
                                    style={{ width: 200,"font-size": "12px"}}
                                    
                                />
                               
                            </Col>
                        </Row>
                        <Row className="m-input">
                            <Col span={2} style={{ width: 170,textAlign:'right' }}><span className="u-txt">用户数量</span></Col>
                            <Col span={3} style={{marginRight:'20px'}}>
                                <InputNumber value={this.state.createNum} min="1" style={{width:"200px"}} disabled={this.state.status=="add"?false:true} onChange={(value) => { this.setOneKV("createNum", value) }} placeholder={"请输入用户数量"} />
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
                            <Col span={12}><Button disabled={!this.state.activityFlag} type='primary' onClick={()=>{this.addBook()}}>活动</Button></Col> 
                            <Col span={12}><Button disabled={!this.state.vipFlag} type='primary' onClick={()=>{this.addVip()}}>会员</Button></Col> 
                            {/* <Col span={8}><Button disabled={!this.state.redFlag} type='primary' onClick={()=>{this.addRed()}}>红包</Button></Col>  */}
                        </Row>
                    </Modal>
                </div>
            </div>
        );
    }
}
export default addRedeemCode;