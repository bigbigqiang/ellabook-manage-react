
/*
 	created by NiePengfei at 2017/11/11
 	用户管理
 */

import React from 'react'
import {Table,Pagination,Select,DatePicker,Modal, Button,Input ,Spin ,Icon,message,Popover} from 'antd';
import { Link} from 'react-router';
const Search = Input.Search;
import "./userControl.css"
import getUrl from "../util.js"
import $ from 'jquery'
import { dataString } from '../commonData.js'
const { Option, OptGroup } = Select;
const confirm = Modal.confirm;
export default class UserControl extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
        	allUserDetail:[],	//		所有用户详情
        	pageMax:0,			//		最大数据数
        	clickFlag:0,		//		0普通搜索，1精确搜索
    		searchType:'categorySearch',			//是哪种搜索类型
    		dateType:"registerTime",
    		startTime:null,
    		endTime:null,
    		channelCode:null,			//渠道
    		userType:null,
    		userManageSearch:"userMobile",	//精确检索类型
    		searchContent:'',		//检索输入的内容
    		page:0,
    		loading:true,
    		pageSizes:20,
    		thePageNow:0,
    		pageLengthNow:0,
    		startValue: null,
		    endValue: null,
		    endOpen: false,
		    searchFlag:false,
			selectDU:"down",
    		selectDetail:{
    			theTime:[],
    			theChannel:[],
    			theType:[]
    		}
        }
        this.pageChangeFun = this.pageChangeFun.bind(this);
        this.pageSizeChangeFun = this.pageSizeChangeFun.bind(this);
        
        this.handleChange1 = this.handleChange1.bind(this);
        this.handleChange2 = this.handleChange2.bind(this);
        this.handleChange3 = this.handleChange3.bind(this);
        this.handleChange4 = this.handleChange4.bind(this);
        this.handleChange5 = this.handleChange5.bind(this);
        
        this.jingNotClick = this.jingNotClick.bind(this);
        this.jingClick = this.jingClick.bind(this);
        
        this.disabledStartDate  = this.disabledStartDate .bind(this);
        this.disabledEndDate  = this.disabledEndDate .bind(this);
        this.onChange  = this.onChange .bind(this);
        this.onStartChange  = this.onStartChange .bind(this);
        this.onEndChange  = this.onEndChange .bind(this);
        this.handleStartOpenChange  = this.handleStartOpenChange .bind(this);
        this.handleEndOpenChange  = this.handleEndOpenChange .bind(this);
        this.selectSet = this.selectSet.bind(this);
    }
    
    //即将插入本组件时，开始请求数据，准备渲染
    componentWillMount(){
    	this.getSelectInfor();
    }
    
    //虚拟dom变成真实dom之后，开始绑定事件
    componentDidMount(){
    	this.getAllUserInfor(0,20);
    	this.fetchChannelItem();
    } 
    
    //获取下拉框数据的函数
    getSelectInfor(){
    	var thisTrue = this;
    	fetch(getUrl.url, {
			method: "POST",
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: "method=ella.operation.boxSearchList" + "&content=" + JSON.stringify({
				"groupId":"USER_MANAGE_LIST",
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
		       	thisTrue.setState({
		            selectDetail : {
		            	...thisTrue.state.selectDetail,
                		["theTime"] : response.data.filter(function(item){
							if (item.remark == "时间类型") {
								return item;
							}
						}),
//						["theChannel"] : response.data.filter(function(item){
//							if (item.remark == "注册渠道") {
//								return item;
//							}
//						}),
						["theType"] : response.data.filter(function(item){
							if (item.remark == "用户类型") {
								return item;
							}
						})
						
		            }
		        })
			}
		})
    }
    
    //普通检索
    jingNotClick(){
    	$(".userControlSelect .theSearch").css({"backgroundColor":"#23AD43","color":"#03300D"});
		setTimeout(function(){
			$(".userControlSelect .theSearch").css({"backgroundColor":"#26C14B","color":"white"});
		},200)
		this.setState({
			clickFlag:1,
			searchType:"categorySearch",
			thePageNow:0
		},()=>{
			console.log(this.state);
    		this.getTheUserInfor(this.state.thePageNow,this.state.pageSizes,"categorySearch");
		})
		
    }
    
    //精确检索
    jingClick(){
    	$(".tinySearch .theSearch").css({"backgroundColor":"#23AD43","color":"#03300D"});
		setTimeout(function(){
			$(".tinySearch .theSearch").css({"backgroundColor":"#26C14B","color":"white"});
		},200)
    	this.setState({
    		clickFlag:1,
			searchType:"accurateSearch"
		})
    	
    	this.getTheUserInfor(0,this.state.pageSizes,"accurateSearch");
    }
    
    //换页时，更新内容
    pageChangeFun(pageNumber) {
	  	console.log('Page: ', pageNumber);
	  	this.setState({
			thePageNow:pageNumber-1
		})
	  	if (this.state.clickFlag == 0) {
	  		this.getAllUserInfor(pageNumber-1,this.state.pageSizes,this.state.searchType);
	  	}else{
	  		this.getTheUserInfor(pageNumber-1,this.state.pageSizes,this.state.searchType);
	  	}
	}
    
    pageSizeChangeFun(current, size){
    	this.setState({
			pageSizes:size,
			thePageNow:current-1
		})
    	if (this.state.clickFlag == 0) {
	  		this.getAllUserInfor(current-1,size);
	  	}else{
	  		if(this.state.searchType == "categorySearch"){
	  			this.getTheUserInfor(current-1,size,"categorySearch");
	  		}else if(this.state.searchType == "accurateSearch"){
	  			this.getTheUserInfor(current-1,size,"accurateSearch");
	  		}
	  		
	  	}
    }
    
    //获取所有用户数据的函数
    getAllUserInfor(pageNumber,pageSize){
    	var thisTrue = this;
    	thisTrue.setState({
			loading:true
		})
    	fetch(getUrl.url, {
			method: "POST",
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: "method=ella.operation.userManageList" + "&content=" + JSON.stringify({
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
				if(response.data.total <20){
					document.getElementsByClassName("paixu")[0].style.opacity="0";
				}else{
					document.getElementsByClassName("paixu")[0].style.opacity="1";
				}
				var data = [];
				for(let x=0;x<response.data.list.length;x++){
		    		// if(response.data.list[x].userType == "NORMAL_USER"){
		    		// 	response.data.list[x].userType = "普通用户";
		    		// }else if(response.data.list[x].userType == "VIP_YEAR"){
		    		// 	response.data.list[x].userType = "年卡会员";
		    		// }else if(response.data.list[x].userType == "VIP_MONTH"){
		    		// 	response.data.list[x].userType = "月卡";
		    		// }
		    		/*2018-03-14  start*/
		    		var userType = response.data.list[x].userType;
		    		if(userType=='NORMAL_USER'){
                        userType = '普通用户';
					}else if(userType=='VIP_YEAR'){
                        userType = '年卡会员';
					}else if(userType=='VIP_MONTH'){
                        userType = '月卡';
                    }else if(userType=='' || userType==null){
                        userType = '-';
					}else if(userType == 'VIP_WEEK'){
                        userType = '周卡';
					}else if(userType == 'GUEST'){
                        userType = '游客';
					}else if(userType == 'PAY_USER'){
                        userType = '付费用户';
					}
					
					data.push({
                        uid:response.data.list[x].uid,
                        userNick:(response.data.list[x].userNick==''||response.data.list[x].userNick==null)?'-':response.data.list[x].userNick,
                        userType:userType,
                        sumUserPayAmount:response.data.list[x].sumUserPayAmount==null?'0':response.data.list[x].sumUserPayAmount,
                        channel:response.data.list[x].channel,
                        registerTime:(response.data.list[x].registerTime==''||response.data.list[x].registerTime==null)?'-':response.data.list[x].registerTime,
                        loginTime:(response.data.list[x].loginTime==''||response.data.list[x].loginTime==null)?'-':response.data.list[x].loginTime,
                        address:(response.data.list[x].address==''||response.data.list[x].address==null)?'-':response.data.list[x].address,
					})
					/*2018-03-14  end*/
		    	} 
				thisTrue.setState({
					allUserDetail : data,
					pageMax : response.data.total,
					loading:false,
					pageLengthNow:response.data.list.length
				})
			}
		})
    }
    
    //检索指定用户数据的函数
    getTheUserInfor(pageNumber,pagesize,searchS){
    	var thisTrue = this;
    	thisTrue.setState({
			loading:true
		})
    	
    	fetch(getUrl.url, {
			method: "POST",
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: "method=ella.operation.userManageList" + "&content=" + JSON.stringify({
        		"searchType":searchS,			//是哪种搜索类型
        		"dateType":thisTrue.state.dateType,
        		"startTime":thisTrue.state.startValue,
        		"endTime":thisTrue.state.endValue,
        		"channelCode":thisTrue.state.channelCode,			//渠道
        		"userType":thisTrue.state.userType,
        		"userManageSearch":thisTrue.state.userManageSearch,	//精确检索类型
        		"searchContent":thisTrue.state.searchContent,		//检索输入的内容
        		"page":pageNumber,
        		"pageSize":pagesize
			})+dataString
		})
		.then(function(response){
			console.log(response);
			return response.json();
		})
		.then(function(response){
			console.log(response);
			if (response.status == 1) {
				
				if(response.data.total <20){
					document.getElementsByClassName("paixu")[0].style.opacity="0";
				}else{
					document.getElementsByClassName("paixu")[0].style.opacity="1";
				}
				var data = [];
				for(let x=0;x<response.data.list.length;x++){
		    		// if(response.data.list[x].userType == "NORMAL_USER"){
		    		// 	response.data.list[x].userType = "普通用户";
		    		// }else if(response.data.list[x].userType == "VIP_YEAR"){
		    		// 	response.data.list[x].userType = "年卡会员";
		    		// }else if(response.data.list[x].userType == "VIP_MONTH"){
		    		// 	response.data.list[x].userType = "月卡";
		    		// }else if(response.data.list[x].userType == "VIP_WEEK"){
		    		// 	response.data.list[x].userType = "周卡";
		    		// }

                    var userType = response.data.list[x].userType;
                    if(userType=='NORMAL_USER'){
                        userType = '普通用户';
                    }else if(userType=='VIP_YEAR'){
                        userType = '年卡会员';
                    }else if(userType=='VIP_MONTH'){
                        userType = '月卡';
                    }else if(userType=='' || userType==null){
                        userType = '-';
                    }else if(userType == 'VIP_WEEK'){
                        userType = '周卡';
                    }
                    data.push({
                        uid:response.data.list[x].uid,
                        userNick:(response.data.list[x].userNick==''||response.data.list[x].userNick==null)?'-':response.data.list[x].userNick,
						userType:userType,
						sumUserPayAmount:response.data.list[x].sumUserPayAmount==null?'0':response.data.list[x].sumUserPayAmount,
						channel:response.data.list[x].channel,
                        registerTime:(response.data.list[x].registerTime==''||response.data.list[x].registerTime==null)?'-':response.data.list[x].registerTime,
                        loginTime:(response.data.list[x].loginTime==''||response.data.list[x].loginTime==null)?'-':response.data.list[x].loginTime,
                        address:(response.data.list[x].address==''||response.data.list[x].address==null)?'-':response.data.list[x].address,
                    })
		    	}
				thisTrue.setState({
					allUserDetail:data,
					pageMax : response.data.total,
					loading:false,
					pageLengthNow:response.data.list.length
				})
			}
		})
    }
    
	//下拉框的回调
    handleChange1(value) {
	  	console.log(`selected1 ${value}`);
	  	this.setState({
			dateType:value,
		})
	}
    handleChange2(value) {
	  	console.log(`selected2 ${value}`);
	  	this.setState({
			channelCode:value,
		})
	}
    handleChange3(value) {
	  	console.log(`selected3 ${value}`);
	  	this.setState({
			userType:value,
		})
	}
    handleChange4(value) {
	  	console.log(`selected4 ${value}`);
	  	this.setState({
			userManageSearch:value,
		})
	}
    handleChange5() {
	  	var aa = $(".tinySearchContent").val();
	  	console.log(aa);
	  	this.setState({
			searchContent:aa,
		})
	}
		
	
	
	disabledStartDate(startValue){
	    const endValue = this.state.endValue;
	    if (!startValue || !endValue) {
	      return false;
	    }
	    return startValue.valueOf() > endValue.valueOf();
	}
	disabledEndDate(endValue){
	    const startValue = this.state.startValue;
	    if (!endValue || !startValue) {
	      return false;
	    }
	    return endValue.valueOf() <= startValue.valueOf();
	}

	onChange(field,value){
	    this.setState({
	      [field]: value,
	    });
	}

	onStartChange(value){
	    this.onChange('startValue', value);
	}
	
	onEndChange(value){
	    this.onChange('endValue', value);
	}
	
	//选择完开始时间，自动出来结束的选择框
	handleStartOpenChange(open){
	}
	
	handleEndOpenChange(open){
	    this.setState({ endOpen: open });
	}
	//设置更多搜索条件的
	selectSet(){
		if(this.state.selectDU == "down"){
			this.setState({
				searchFlag:true,
				selectDU:"up"
			})
		}else if(this.state.selectDU == "up"){
			this.setState({
				searchFlag:false,
				selectDU:"down"
			})
		}
		
	}

    searchContent(name,value){
		this.setState({
			[name]:value,
            clickFlag:1,
            searchType:"accurateSearch"
		},()=>{
            this.getTheUserInfor(0,this.state.pageSizes,"accurateSearch");
		})
	}
    //恢复默认设置
	clearSelect(){
		
		this.setState({
			channelCode:null,
			startValue:null,
			endValue:null,
			userType:null,
			dateType:"registerTime"
		})
		
	}
	exportList() {
		console.log(this.state.pageMax);
		if(this.state.pageMax>2000){
			message.error('最多导出2000条用户数据，请重新操作');
			return;
		}
        this.exportFn(this.state.searchInfo);
    }
	 //导出
    async exportFn() {
    	
    	
    	var doc={
    		"searchType":this.state.searchType,			//是哪种搜索类型
    		"dateType":this.state.dateType,
    		"startTime":this.state.startValue,
    		"endTime":this.state.endValue,
    		"channelCode":this.state.channelCode,			//渠道
    		"userType":this.state.userType,
    		"userManageSearch":this.state.userManageSearch,	//精确检索类型
    		"searchContent":this.state.searchContent,		//检索输入的内容
    	}
    	console.log(doc);

        var data = await fetch(getUrl.url, {
            mode: "cors",
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: "method=ella.operation.listUserExcel" + "&content=" + JSON.stringify(doc)+dataString
        }).then(res => res.json())
            .then((d) => {
                console.log(d);
                if (d.status == 1) {
                    message.success('导出成功')
                    var url=d.data;
                    var a = document.createElement('a');
                    a.href = url;
                    a.download=d.data;
                    a.click();
                    this.setState({
                        loading: false,
                    })
                } else {
                    message.error('导出失败')
                    this.setState({
                        loading: false,
                    })
                }
            })
    }
    //拉取渠道信息
	async fetchChannelItem() {
		var data = await fetch(getUrl.url, {
			mode: "cors",
			method: "POST",
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: "method=ella.operation.boxSearchList" + "&content=" + JSON.stringify({
				type: "AUTO_BOX",
				groupId: "operation.box.chanelList"
			})+dataString
		}).then(res => res.json())
		console.log(data);
		this.setState({
			selectDetail:{
    			...this.state.selectDetail,
    			theChannel:data.data,
    			
    		}
			
		})
	}
    render(){
    	var thisTrue = this;
    	var datas = this.state.selectDetail;
    	var columns = [{
		  	title: '用户ID',
		  	dataIndex: 'uid',
			width:'15%',
		  	key: 'uid',
		  	className:'td_hide',
	        render: (text, record) =>{
	            return(
	                <Popover
	                    placement="top"
	                    title={null}
	                    content={
	                        record.uid
	                    }
	                >
	                    <span>{record.uid}</span>
	                </Popover>
	            )
	        }
		}, {
		  	title: '用户昵称',
		  	dataIndex: 'userNick',
			  key: 'userNick',
			  width:'10%'
		}, {
		  	title: '用户类型',
		  	dataIndex: 'userType',

			key: 'userType',
			width:'6%',
			render:(text,record)=>{
		  		var userType;
	    		if(record.userType=='NORMAL_USER'){
                    userType = '普通用户';
				}else if(record.userType=='VIP_YEAR'){
                    userType = '年卡会员';
				}else if(record.userType=='VIP_MONTH'){
                    userType = '月卡';
                }else if(record.userType=='' || record.userType==null){
                    userType = '-';
				}else if(record.userType == 'VIP_WEEK'){
                    userType = '周卡';
				}else if(record.userType == 'GUEST'){
                    userType = '游客';
				}else if(record.userType == 'PAY_USER'){
                    userType = '付费用户';
				}
				return(
                    <span>{userType}</span>
                )
		  	}

		},{
			title: '注册渠道',
			dataIndex: 'channel',
			key: 'channel',
			width:'10%'
	  	},{
		  	title: '注册日期',
		  	dataIndex: 'registerTime',
			  key: 'registerTime',
			  width:'11%'
		},{
		  	title: '最近登录时间',
		  	dataIndex: 'loginTime',
			  key: 'loginTime',
			  width:'11%'
		},{
			title: '消费总金额',
			dataIndex: 'sumUserPayAmount',
			key: 'sumUserPayAmount',
			width:'6%'
	  	},{
		  	title: '操作',
			  dataIndex: '',
			  width:'8%',
		  	render(text, record) {
                return(
                    <div data-page="userList">
                        <Link to={"/userList?uid="+record.uid+""} target="_blank">
                            查看详情
                        </Link>
                        {/*注意，第一个参数指向this*/}
                        {/* <span className="specialspans" onClick={thisTrue.VIPno.bind(this,record.uid,0)}>取消会员资格</span> |&nbsp; */}
                        {/* <span className="specialspans" onClick={thisTrue.VIPno.bind(this,record.uid,1)}>封号</span> */}
                    </div>
                )
            }
		}];
		return (
			<div className="userControl">
				<Spin spinning={this.state.loading} size="large">
					<div className="userControlTitle">
						用户管理
					</div>
					<div className="tinySearch">
						
						<Select defaultValue="userMobile" className="selectWidth intervalRight" onChange={this.handleChange4}>
					      	<Option value="userNick">用户昵称</Option>
					      	<Option value="userUid">用户ID</Option>
					      	<Option value="userMobile">用户手机号</Option>
						</Select>
						{/*<Input placeholder="输入检索内容"  className="tinySearchContent" onChange={this.handleChange5} />*/}
						<Search placeholder="输入检索内容" enterButton className="searchWidth intervalRight" onSearch={(value)=>{this.searchContent("searchContent",value)}} />
						{/*<div className="theSearch" onClick={this.jingClick}>精确检索</div>*/}
						<div className="setSelect" onClick={this.selectSet}>更多条件 <Icon type={this.state.selectDU} /></div>
					</div>
					
					<div  className="searchShow" style={{height:this.state.searchFlag?"auto":0}} >
						<div className="userControlSelect">
							<div className="part">
								<span className="u-txt">时间筛选:</span>
								<Select defaultValue={null} value={this.state.dateType} className="selectWidth" onChange={this.handleChange1}>
								{
//									<Option value={null}>全部</Option>
								}
							      	{
	                                    datas.theTime.map(item=>{
	                                        return <Option value={item.searchCode}>{item.searchName}</Option>
	                                    })
	                                }
								</Select>
							</div>
							
							<div className="part">
								<DatePicker
							        disabledDate={this.disabledStartDate}
							        showTime={{ format: 'HH:mm' }}
                            		format="YYYY-MM-DD HH:mm:ss"
							        value={this.state.startValue}
							        placeholder="开始时间"
							        onChange={this.onStartChange}
							        onOpenChange={this.handleStartOpenChange}
							      
							        style={{ width: 180 }}
						        />
								<i> — </i>
						        <DatePicker
						            disabledDate={this.disabledEndDate}	          
						            showTime={{ format: 'HH:mm' }}
                            		format="YYYY-MM-DD HH:mm:ss"
						            value={this.state.endValue}
						            placeholder="结束时间"
						            onChange={this.onEndChange}
						            open={this.state.endOpen}
						            onOpenChange={this.handleEndOpenChange}
						            style={{ width: 180 }}
						            
						        />
							</div>
							
							<div className="part">
								<span className="u-txt">注册渠道:</span>
								<Select defaultValue={null} value={this.state.channelCode} className="selectWidth" onChange={this.handleChange2}>
									<Option value={null}>所有渠道</Option>
							      	{
	                                    datas.theChannel.map(item=>{
	                                        return <Option value={item.code}>{item.name}</Option>
	                                    })
	                                }
								</Select>
							</div>
							
							<div className="part">
								<span className="u-txt">用户类型:</span>
								<Select defaultValue={null} value={this.state.userType} style={{ width: 130 }} onChange={this.handleChange3}>
									<Option value={null}>全部</Option>
							      	{
	                                    datas.theType.map(item=>{
	                                        return <Option value={item.searchCode}>{item.searchName}</Option>
	                                    })
	                                }
								</Select>
							</div>
							
							<div className="intervalBottom">
								<Button className="block u-btn-green buttonWidth intervalRight" onClick={this.jingNotClick}>查询</Button>
								<Button className="block u-btn-green buttonWidth intervalRight" onClick={() => this.exportList()}>导出当前列表</Button>
								<Button className="block u-btn-green buttonWidth" onClick={()=>this.clearSelect()}>恢复默认</Button>
							</div>
						</div>
						
					</div>
					
					<div className="userControlTable">
						<Table className="t-nm-tab" dataSource={this.state.allUserDetail} columns={columns} pagination={false} scroll={{ y: ((this.state.pageLengthNow > 15) ? 665:0) }} />
						<div className="paixu">
							<Pagination className="paixuIn" current={this.state.thePageNow+1} showSizeChanger pageSizeOptions={['20','40','60','80','100']} defaultPageSize={20} defaultCurrent={1} total={this.state.pageMax} showTotal={total => `共 ${total} 条`} onChange={this.pageChangeFun} showQuickJumper={true} onShowSizeChange={this.pageSizeChangeFun} />
						</div>
					</div>
				</Spin>
			</div>
		)
	}
}
