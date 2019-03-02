/*
 	created by NiePengfei at 2018/3/19
 	编辑、新增出版社
 */

import React from 'react'
import {Select,Button,Input ,Spin,Icon ,Modal,message} from 'antd';
import "./addPublish.css"
import getUrl from "../util.js"
import commonData from '../commonData.js'

export default class AddPublish extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
        	loading:true,
        	publishCode:null, 		//出版社编号
			publishName:null, 		//出版社名称
			contacts:null, 			//联系人
			mobile:null, 			//手机号
			email:null, 			//邮箱
			publishAddress:null, 	//联系地址
			creditCode:null, 		//社会统一信用代码
			accountBank:null, 		//开户行
			accountName:null, 		//开户名
			bankNumber:null, 		//开户账号
			rentBookPercent:null, 	//租书分成比例
			buyBookPercent:null, 	//买书分成比例
			basePressList:[], 	//APP内展示名称列表
			uid:null,				//出版社uid
        	
        	
        }
    }
    
    //即将插入本组件时，开始请求数据，准备渲染
    componentWillMount(){
    	if (this.props.operateState == '编辑出版社') {
    		this.setState({
				publishCode:this.props.data.publishCode, 			//出版社编号
				publishName:this.props.data.publishName, 			//出版社名称
				contacts:this.props.data.contacts, 					//联系人
				mobile:this.props.data.mobile, 						//手机号
				email:this.props.data.email, 						//邮箱
				publishAddress:this.props.data.publishAddress, 		//联系地址
				creditCode:this.props.data.creditCode, 				//社会统一信用代码
				accountBank:this.props.data.accountBank, 			//开户行
				accountName:this.props.data.accountName, 			//开户名
				bankNumber:this.props.data.bankNumber, 				//开户账号
				rentBookPercent:this.props.data.rentBookPercent, 	//租书分成比例
				buyBookPercent:this.props.data.buyBookPercent, 		//买书分成比例
				basePressList:this.props.data.basePressList, 		//APP内展示名称列表
				uid:this.props.data.uid, 		//出版社uid
			})
    	}
    }
    
    //虚拟dom变成真实dom之后，开始绑定事件
    componentDidMount(){
    	var thisTrue =this;
    	this.setState({
			loading:false
		})
    } 
    
    
    handleChange11(value) {
	   
	    this.setState({
			publishName:value
		})
	}
    handleChange12(value) {
	   
	    this.setState({
			contacts:value
		})
	}
    handleChange13(value) {
	   
	    this.setState({
			mobile:value
		})
	}
    handleChange14(value) {
	   
	    this.setState({
			email:value
		})
	}
    handleChange15(value) {
	  
	    this.setState({
			publishAddress:value
		})
	}
    
    handleChange16(value) {
	   
	    this.setState({
			creditCode:value
		})
	}
    handleChange17(value) {
	   
	    this.setState({
			accountBank:value
		})
	}handleChange18(value) {
	   
	    this.setState({
			accountName:value
		})
	}
	handleChange19(value) {
	   
	    this.setState({
			bankNumber:value
		})
	}
	handleChange20(value) {
	   
	    this.setState({
			rentBookPercent:value
		})
	}
	handleChange21(value) {
	   
	    this.setState({
			buyBookPercent:value
		})
	}
	handleChange22(value) {
	   
	    this.setState({
			newName:value
		})
	}
	
	publishSave(){
		var thisTrue = this;
    	this.setState({ 
			loading:true,
		});
		fetch(getUrl.url, {
			method: "POST",
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body:"method=ella.operation.saveOrUpdatePublish" + "&content=" + JSON.stringify({
		    	"publishCode":thisTrue.state.publishCode,
				"uid":thisTrue.state.uid,
				"publishName":thisTrue.state.publishName,
				"contacts":thisTrue.state.contacts,
				"mobile":thisTrue.state.mobile,
				"email":thisTrue.state.email,
				"publishAddress":thisTrue.state.publishAddress,
				"creditCode":thisTrue.state.creditCode,
				"accountBank":thisTrue.state.accountBank,
				"accountName":thisTrue.state.accountName,
				"bankNumber":thisTrue.state.bankNumber,
				"rentBookPercent":thisTrue.state.rentBookPercent,
				"buyBookPercent":thisTrue.state.buyBookPercent,
				"basePressList":thisTrue.state.basePressList
			}) + commonData.dataString
		})
		.then(function(response){
			
			return response.json();
		})
		.then(function(response){
			
			if (response.status == 1) {
				thisTrue.setState({ 
					loading:false,
				});
				thisTrue.props.handleCancel();
			}else{
				thisTrue.setState({ 
					loading:false,
				});
			}
		})
	}
	
	pubDe(e,type){
		
		var thisTrue = this;
		let newArr = this.state.basePressList;
		
		
		if(type == "1"){
			
			//新增App展示名称的验证
			fetch(getUrl.url, {
				method: "POST",
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				body:"method=ella.operation.checkPressOnDelete" + "&content=" + JSON.stringify({
					"pressCode":newArr[e].pressCode
				}) + commonData.dataString
			})
			.then(function(response){
			
				return response.json();
			})
			.then(function(response){
			
				if (response.data.status == "YES") {
					message.success("删除成功");
					newArr.splice(parseInt(e),1);
					thisTrue.setState({
						basePressList:newArr
					})
				}else{
					message.error("删除失败");
				}
			})
		}else if(type == "2"){
			if (this.state.newName==""||this.state.newName==null||this.state.newName==undefined) {
				message.error("新增展示名称不能为空");
			}else{
				let newItem = this.state.newName;
				newArr.push({"pressCode":null,"pressName":newItem});
				this.setState({
					basePressList:newArr,
					newName:""
				})
			}
		}
	}
    
    render(){
    	var thisTrue = this;
		
		return (
			<div className="addPublish">
				<Spin spinning={this.state.loading} size="normal">
					<div className="publong">　　　　　出版社　　<Input value={this.state.publishName} className="editDetails" onChange={(e)=>this.handleChange11(e.target.value)} /></div>
					<div className="pubShort">　 　　　 联系人　　<Input value={this.state.contacts} className="editDetails editDetailsShort" onChange={(e)=>this.handleChange12(e.target.value)} /></div>
					<div className="pubShort">　　　　 手机号　　<Input value={this.state.mobile} className="editDetails editDetailsShort" onChange={(e)=>this.handleChange13(e.target.value)} /></div>
					<div className="publong">　　　　　　邮箱　　<Input value={this.state.email} className="editDetails" onChange={(e)=>this.handleChange14(e.target.value)} /></div>
					<div className="publong">　　　　联系地址　　<Input value={this.state.publishAddress} className="editDetails" onChange={(e)=>this.handleChange15(e.target.value)} /></div>
					<div className="publong">社会统一信用代码　　<Input value={this.state.creditCode} className="editDetails" onChange={(e)=>this.handleChange16(e.target.value)} /></div>
					<div className="publong">　　银行卡开户行　　<Input value={this.state.accountBank} className="editDetails" onChange={(e)=>this.handleChange17(e.target.value)} /></div>
					<div className="pubShort">　　　　　 开户名　　<Input value={this.state.accountName} className="editDetails editDetailsShort" onChange={(e)=>this.handleChange18(e.target.value)} /></div>
					<div className="pubShort">　　　　 开户账号　　<Input value={this.state.bankNumber} className="editDetails editDetailsShort" onChange={(e)=>this.handleChange19(e.target.value)} /></div>
					<div className="pubShort">　　 买书分成比例　　<Input value={this.state.rentBookPercent} className="editDetails editDetailsShort" onChange={(e)=>this.handleChange20(e.target.value)} /></div>
					<div className="pubShort">　　 租书分成比例　　<Input value={this.state.buyBookPercent} className="editDetails editDetailsShort" onChange={(e)=>this.handleChange21(e.target.value)} /></div>
					<div className="publong">　 App内展示名称　　
						<div className="specialDiv">
							{
								this.state.basePressList&&this.state.basePressList.map(function(item,index){
									return <div style={{width:200}}>{item.pressName}　　　　　　<Icon  className="pubIcon" onClick={()=>thisTrue.pubDe(index,"1")} type="close-circle" /></div>
								})
							}
							<div><Input value={this.state.newName} style={{width:200}} className="newName" onChange={(e)=>this.handleChange22(e.target.value)} />　　　　<Icon className="pubIcon1" onClick={()=>thisTrue.pubDe("a","2")} type="plus-circle" /></div>
						</div>
					</div>
					
					
					<div className="publishSave" onClick={()=>this.publishSave()}>保存</div>
				</Spin>
			</div>
		);
	}
}
