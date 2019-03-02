/*
 	created by NiePengfei at 2017/12/14
 		图书——反馈——反馈编辑、添加
 */

import React from 'react'
import {Table,Select,DatePicker,Button,Input ,Spin,Pagination, Icon,Modal,message} from 'antd';
import { Link} from 'react-router';
import "./feedBackDetail.css"
import getUrl from "../util.js"
import AddFeadChuDetail from "./addFeadChuDetail.js"
import SawImgDetail  from "./sawImgDetail.js"
import { dataString } from '../commonData.js'
const { Option, OptGroup } = Select;
const Search = Input.Search;
const { TextArea } = Input;
export default class FeedBackDetail extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
        	loading:true,
        	feadName:"",
        	uid:'',
			userNick:'',
			customerName:'',
			channelCode:'',
			clientVersion:'',
			createTime:'',
			feedbackInfo:'',
			contactWay:'',
			images:'',
			
			newFeadState:'　',
			newFeadInfo:'　',
			imgFlag:false,
			feadImages:'',
			searchFlag:false,
			
        	addFeadChuDetail:[]
        }
        this.handleChange1 = this.handleChange1.bind(this);
        this.handleChange2 = this.handleChange2.bind(this);
        this.handleChange4 = this.handleChange4.bind(this);
    }
    
    //即将插入本组件时，开始请求数据，准备渲染
    componentWillMount(){
    	console.log(window.location.href);
    	let feadName = window.location.href.split("?feadId=")[1].split("&_k=")[0];
    	this.setState({
			feadName:feadName
		});
		this.getfeadDetail(feadName);
    }
    
    //虚拟dom变成真实dom之后，开始绑定事件
    componentDidMount(){
    	this.setState({
			loading:false
		})
    } 
    
    //保存并返回路由
    saveAndClose(){
    	var thisTrue = this;
		if(this.state.newFeadState == "　" ||this.state.newFeadState == "" ||this.state.newFeadState == null||this.state.newFeadState == undefined||this.state.newFeadState == " "){
    		Modal.error({
			    title: "处理状态不能为空",
			    content: "",
			});
    	}else if(this.state.newFeadInfo == "　" ||this.state.newFeadInfo == "" ||this.state.newFeadInfo == null||this.state.newFeadInfo == undefined||this.state.newFeadInfo == " "){
    		Modal.error({
			    title: "处理信息不能为空",
			    content: "",
			});
    	}else{
    		thisTrue.setState({ 
				loading:true,
			});
			
			let userUid = localStorage.getItem("uid");
			
	    	//保存到服务端
	    	fetch(getUrl.url, {
				method: "POST",
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				body: "method=ella.operation.addUserFeedbackReply" + "&content=" + JSON.stringify({
					"feedbackCode":thisTrue.state.feadName,
					"handlerUid":userUid,
					"dealWithInfo":thisTrue.state.newFeadInfo,
					"afterDealWithStatus":thisTrue.state.newFeadState,
				})+dataString
			})
			.then(function(response){
				console.log(response);
				return response.json();
			})
			.then(function(response){
				console.log(response);
				if (response.status == 1) {
					//展示在前端
					thisTrue.getfeadDetail(thisTrue.state.feadName);
					message.success("添加成功");
				}else{
					message.error("添加失败");
					thisTrue.setState({ 
						loading:true,
					});
				}
			})
			.catch(err => {
				thisTrue.setState({ 
					loading:true,
				});
				message.error('系统繁忙，请重试');
			});
    	}
    }
    //输入框的回调
    handleChange1(e){
    	console.log(e.target.value);
    }
    handleChange2(e){
    	console.log(e);
    	this.setState({
			newFeadState:e,
		})
    }
    handleChange4(e){
    	console.log(e);
    	console.log(e.target.value);
    	this.setState({
			newFeadInfo:e.target.value,
		})
    }
    
    setFeadState(){
    	this.setState({
			searchFlag:true
		})
    }
    
    
    //获取反馈详情的数据
    getfeadDetail(feadName){
    	var thisTrue = this;
    	this.setState({ 
			loading:true,
		});
    	fetch(getUrl.url, {
			method: "POST",
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: "method=ella.operation.getFeedBackInfo" + "&content=" + JSON.stringify({
				"feedbackCode":feadName,
			})+dataString
		})
		.then(function(response){
			console.log(response);
			return response.json();
		})
		.then(function(response){
			console.log("---------------");
			console.log(response);
			if (response.status == 1) {
				
				response.data.feedBackReply.map(function(item){
					if(item.afterDealWithStatus == "RESOLVED"){
				    	item.afterDealWithStatus = "已解决";
				    }else if(item.afterDealWithStatus == "RECEIVED"){
				    	item.afterDealWithStatus = "已接收";
				    }if(item.afterDealWithStatus == "IN_CONTACT"){
				    	item.afterDealWithStatus = "联系中";
				    }if(item.afterDealWithStatus == "NOT_DEAL_WITH"){
				    	item.afterDealWithStatus = "未处理";
				    }
				})
				
				thisTrue.setState({
					uid:response.data.uid,
					userNick:response.data.userNick,
					customerName:response.data.customerName,
					channelCode:response.data.channelCode,
					clientVersion:response.data.clientVersion,
					createTime:response.data.createTime,
					feedbackInfo:response.data.feedbackInfo,
					contactWay:response.data.contactWay,
					feadImages:response.data.images,
					
					addFeadChuDetail:response.data.feedBackReply,
					
					loading:false,
					searchFlag:false
				},()=>{
					console.log('---------反馈图片链接---------');
					console.log(thisTrue.state.feadImages);
				})
			}
		})
    }
    
    //查看图片详情
	sayImage(src){
		console.log(src);
		this.setState({ 
			imgFlag:true,
        	imgSrc:src
		});
	}
	//关闭图片详情
	closeImage(){
		this.setState({ 
			imgFlag:false,
		});
	}
    
    
    render(){
    	var thisTrue = this;
		return (
			<div className="addFeedBack">
				<Spin spinning={this.state.loading} size="large">
					<div className="feadTitle">
						<Link to="/FeedBackList">
	                        <Icon type="left" /> 查看详情
	                    </Link>
					</div>
					<div className="feadContent">
						<div className="m-feadTitle">用户信息</div>
						<div className="m-feadUserInfor1">
							<div><span>用户 ID&nbsp;&nbsp;:　</span><span>{thisTrue.state.uid}</span></div>
							<div><span>用户昵称:　</span><span>{thisTrue.state.userNick}</span></div>
							<div><span>用户账号:　</span><span>{thisTrue.state.customerName}</span></div>
						</div>
						<div className="m-feadUserInfor2">
							<div><span>渠道　　:　</span><span>{thisTrue.state.channelCode}</span></div>
							<div><span>版本号　:　</span><span>{thisTrue.state.clientVersion}</span></div>
							<div><span>反馈时间:　</span><span>{thisTrue.state.createTime}</span></div>
						</div>
						<div className="m-feadLine"></div>
						
						
						<div className="m-feadTitle">反馈内容</div>
						<div className="m-feadContent">
							{thisTrue.state.feedbackInfo}
						</div>
						<div className="m-feadPhone">
							<span>联系方式:　</span><span>{thisTrue.state.contactWay}</span>
						</div>
						<div className="m-feadImageTitle">附加图片</div>
						<div className="m-feadImage">
							{
                                this.state.feadImages.length>0 ? this.state.feadImages.map(function (item) {
                                    return <img className="f-editBookImg" src={item} onClick={()=>thisTrue.sayImage(item)} alt="" />
                                }) : ''
                            }
						</div>
						<div className="m-feadLine"></div>
							
							
						<div className="m-feadTitle">处理状态</div>	
						<div className="m-feadState">
							{
								this.state.addFeadChuDetail.length >0 ?this.state.addFeadChuDetail.map(item=>{
                                    return <AddFeadChuDetail feadChuDetail={item}></AddFeadChuDetail>
                                }):''
							}
							<div className="AddFeadChuBtn" onClick={()=>this.setFeadState()}>添加处理状态</div>
						</div>	
							
						
						<div className="m-feadSta" style={{display:this.state.searchFlag?"block":"none"}}>
							<Select className="f-feadSelect" style={{ width: 170 }} onBlur={(e)=>this.handleChange2(e)}>
							    <Option value="RESOLVED">已解决</Option>
							    <Option value="RECEIVED">已接收</Option>
							    <Option value="IN_CONTACT">联系中</Option>
							    <Option value="NOT_DEAL_WITH">未处理</Option>
						    </Select>
							<TextArea className="f-feadText" autosize={{ minRows: 1, maxRows: 20 }} onBlur={(e)=>this.handleChange4(e)} style={{ height:69, width: 400}}/>
							<div className="saveFeadBtn" onClick={()=>this.saveAndClose()}>保存</div>
						</div>
					</div>
					
					{
						this.state.imgFlag && <SawImgDetail closeImage={()=>this.closeImage()} imgSrc={this.state.imgSrc} ></SawImgDetail>
					}
					
				</Spin>
			</div>
		);
	}
}
