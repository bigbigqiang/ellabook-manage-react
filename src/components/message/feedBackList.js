/*
 	created by NiePengfei at 2017/11/11
 	反馈
 */

import React from 'react'
import { Table, Pagination, Select,Tabs, DatePicker, Button, Input, Icon, Spin,Popover } from 'antd';
import { Link } from 'react-router';
import "./feedBackList.css"
import getUrl from "../util.js"
import SawImgDetail from "./sawImgDetail.js"
import $ from "jquery"
import moment from 'moment';
import { dataString } from '../commonData.js'
const { Option, OptGroup } = Select;
const Search = Input.Search;
const TabPane = Tabs.TabPane;
export default class FeedBackList extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			loading: true,
			allCommentDetail: [],
			thePageNow: 0,
			pageMax: 0,
			current:'1',
			channelCode: "",		//下拉框字段
			version: "",
			hasImg: "",
			startTime: "",
			endTime: "",

			searchType: "CUSTOMER_NAME",
			searchText: "",
			status:"",
			startValue: '',
			endValue: '',

			imgFlag: false,
			imgSrc: "",

			searchFlag: false,
			selectDU: "down",
			pageNow: 0,
			pageSize: 20,

			selectDetail: {
				theChannel: [],
				theTypeNum: [],
				theOpaState: []
			},
			activeKey:"NOT_DEAL_WITH",
		}
		this.handleChange1 = this.handleChange1.bind(this);
		this.handleChange2 = this.handleChange2.bind(this);
		this.handleChange3 = this.handleChange3.bind(this);
		this.handleChange4 = this.handleChange4.bind(this);
		this.handleChange5 = this.handleChange5.bind(this);
		this.pageChangeFun = this.pageChangeFun.bind(this);
		this.pageSizeChangeFun = this.pageSizeChangeFun.bind(this);

		this.disabledStartDate = this.disabledStartDate.bind(this);
		this.disabledEndDate = this.disabledEndDate.bind(this);
		this.onStartChange = this.onStartChange.bind(this);
		this.onEndChange = this.onEndChange.bind(this);
		this.handleStartOpenChange = this.handleStartOpenChange.bind(this);
		this.handleEndOpenChange = this.handleEndOpenChange.bind(this);
		this.closeImage = this.closeImage.bind(this);
	}

	//即将插入本组件时，开始请求数据，准备渲染
	componentWillMount() {
		this.getSelectInfor();
		this.getAllInfor(0, 20);
	}

	//虚拟dom变成真实dom之后，开始绑定事件
	componentDidMount() {
		this.setState({
			loading: false
		})
	}

	//搜索字段的回调函数
	handleChange1(value) {
		console.log(`${value}`);
		this.setState({
			channelCode: value
		})
	}
	handleChange2(value) {
		console.log(`${value}`);
		this.setState({
			version: value
		})
	}
	handleChange3(value) {
		console.log(`${value}`);
		this.setState({
			hasImg: value
		})
	}
	handleChange4(value) {
		console.log(`${value}`);
		this.setState({
			status: value
		})
	}
	handleChange5(value) {
		console.log(`${value}`);
		this.setState({
			searchType: value
		})
	}
	handleChange6(e) {
		console.log(e.target.value);
		this.setState({
			searchText: e.target.value
		})
	}

	//分页换页的回调
	pageChangeFun(pageNumber) {
		this.setState({
			pageNow: pageNumber - 1
		})
		this.getAllInfor(pageNumber - 1, this.state.pageSize);

	}
	pageSizeChangeFun(current, size) {
		this.setState({
			pageSize: size,
			pageNow: current - 1
		})
		this.getAllInfor(current - 1, size);
	}

	disabledStartDate(startValue) {
		const endValue = this.state.endValue;
		if (!startValue || !endValue) {
			return false;
		}
		return startValue.valueOf() > endValue.valueOf();
	}
	disabledEndDate(endValue) {
		const startValue = this.state.startValue;
		if (!endValue || !startValue) {
			return false;
		}
		return endValue.valueOf() <= startValue.valueOf();
	}


	onStartChange(value, dateString) {
		console.log(dateString);
		this.setState({
			startValue: dateString,
		});
	}

	onEndChange(value, dateString) {
		console.log(dateString);
		this.setState({
			endValue: dateString,
		});
	}

	handleStartOpenChange(open) {
		if (!open) {
			this.setState({ endOpen: true });
		}
	}

	handleEndOpenChange(open) {
		this.setState({ endOpen: open });
	}

	//查看图片详情
	sayImage(src) {
		this.setState({
			imgFlag: true,
			imgSrc: "....."
		});
	}

	//关闭图片详情
	closeImage() {
		this.setState({
			imgFlag: false,
		});
	}

	//获取下拉框数据的函数
	getSelectInfor() {
		var thisTrue = this;
		fetch(getUrl.url, {
			method: "POST",
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: "method=ella.operation.boxSearchList" + "&content=" + JSON.stringify({
				"type": "MULTI_BOX",
				"groupIdList": {
					"operation.box.chanelList": {
						"TYPE": "AUTO_BOX"
					},
					"FEEDBACK_STATUS": {
						"TYPE": "HAND_BOX"
					},
					"operation.box.feedbackVersionList": {
						"TYPE": "AUTO_BOX"
					}
				}
			})+dataString
		})
			.then(function (response) {
				console.log(response);
				return response.json();
			})
			.then(function (response) {
				console.log("---------------");
				console.log(response);
				if (response.status == 1) {
					thisTrue.setState({
						selectDetail: {
							...thisTrue.state.selectDetail,
							theChannel: response.data.operation_box_chanelList,
							theTypeNum: response.data.operation_box_feedbackVersionList,
							theOpaState: response.data.feedback_status
						}
					})
				}
			})
	}


	//设置更多搜索条件的
	selectSet() {
		if (this.state.selectDU == "down") {
			this.setState({
				searchFlag: true,
				selectDU: "up"
			})
		} else if (this.state.selectDU == "up") {
			this.setState({
				searchFlag: false,
				selectDU: "down"
			})
		}

	}

	//精确检索
	jingClick() {
		this.getAllInfor(0, 20);
	}

	//获取反馈列表的数据
	getAllInfor(pageNow, pageSize) {

		var thisTrue = this;
		this.setState({
			loading: true,
		});
		var status=thisTrue.state.status;
		if(thisTrue.state.activeKey=="NOT_DEAL_WITH"){
			if(thisTrue.state.status=="NOT_DEAL_WITH"||thisTrue.state.status==""){
				status="NOT_DEAL_WITH"
			}
		}
		if(thisTrue.state.activeKey=="IN_CONTACT"){
			if(thisTrue.state.status=="IN_CONTACT"||thisTrue.state.status==""){
				status="IN_CONTACT"
			}
		}
		if(thisTrue.state.activeKey=="NOT_DEAL_WITH"&&thisTrue.state.status!="NOT_DEAL_WITH"&&thisTrue.state.status!=""){
			thisTrue.setState({
				allCommentDetail:[],
				loading: false,
				pageMax:0,
				pageLengthNow:0,
				current:1
			})
			return;
		}
		
		if(thisTrue.state.activeKey=="IN_CONTACT"&&thisTrue.state.status!="IN_CONTACT"&&thisTrue.state.status!=""){
			thisTrue.setState({
				allCommentDetail:[],
				loading: false,
				pageMax:0,
				pageLengthNow:0,
				current:1
			})
			return;
		}
		
		console.log(this.state.activeKey)
		fetch(getUrl.url, {
			method: "POST",
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: "method=ella.operation.searchFeedbackByConditions" + "&content=" + JSON.stringify({
				"channelCode": thisTrue.state.channelCode,
				"version": thisTrue.state.version,
				"hasImg": thisTrue.state.hasImg,
				"status": status,
				"startTime": thisTrue.state.startValue,
				"endTime": thisTrue.state.endValue,
				"searchType": thisTrue.state.searchType,
				"searchText": thisTrue.state.searchText,
				"pageVo": {
					"page": pageNow,
					"pageSize": pageSize
				}
			})+dataString
		})
			.then(function (response) {
				console.log(response);
				return response.json();
			})
			.then(function (response) {
				console.log("---------------");
				console.log(response);
				if (response.status == 1) {
					var data = [];
					for (let i = 0; i < response.data.feedbackList.length; i++) {
						data.push({
							channelCode: (response.data.feedbackList[i].channelCode == '' || response.data.feedbackList[i].channelCode == null) ? '-' : response.data.feedbackList[i].channelCode,
							clientVersion: (response.data.feedbackList[i].clientVersion == '' || response.data.feedbackList[i].clientVersion == null) ? '-' : response.data.feedbackList[i].clientVersion,
							createTime: (response.data.feedbackList[i].createTime == '' || response.data.feedbackList[i].createTime == null) ? '-' : response.data.feedbackList[i].createTime,
							customerName: (response.data.feedbackList[i].customerName == '' || response.data.feedbackList[i].customerName == null) ? '-' : response.data.feedbackList[i].customerName,
							feedbackCode: (response.data.feedbackList[i].feedbackCode == '' || response.data.feedbackList[i].feedbackCode == null) ? '-' : response.data.feedbackList[i].feedbackCode,
							feedbackInfo: (response.data.feedbackList[i].feedbackInfo == '' || response.data.feedbackList[i].feedbackInfo == null) ? '-' : response.data.feedbackList[i].feedbackInfo,
							images: response.data.feedbackList[i].images,
							status: (response.data.feedbackList[i].status == '' || response.data.feedbackList[i].status == null) ? '-' : response.data.feedbackList[i].status,
							uid: (response.data.feedbackList[i].uid == '' || response.data.feedbackList[i].uid == null) ? '-' : response.data.feedbackList[i].uid,
							updateTime: (response.data.feedbackList[i].updateTime == '' || response.data.feedbackList[i].updateTime == null) ? '-' : response.data.feedbackList[i].updateTime,
						})
					}
					thisTrue.setState({
						allCommentDetail: data,
						loading: false,
						pageMax: response.data.total,
						pageLengthNow: response.data.feedbackList.length,
						current:response.data.currentPage
					})
				}
			})
	}
	onOk() {
		console.log('onOk: ');
	}

	searchContent(name, value) {
		this.setState({
			[name]: value
		}, () => {
			this.getAllInfor(0, 20);
		})
	}
	//恢复默认设置
	clearSelect() {
		this.setState({
			channelCode: '',
			version: '',
			hasImg: '',
			endValue: '',
			startValue: '',
			status:''

		})

	}
	
	changeTabs = (activeKey) => {
        
		this.setState({
            activeKey: activeKey
        },()=>{
			this.getAllInfor(0,20)
		});
		
//		if(activeKey=="1"){
//			console.log(1)
//			this.fetchFn("1",this.state.bannerTitle,'','');
//		}else{
//			console.log(2)
//			this.fetchFn("2",this.state.bannerTitle, this.state.page, this.state.pageSize);
//		}
	}
	render() {
		var thisTrue = this;
		var theSelects = this.state.selectDetail;
		var columns = [{
			title: '用户ID',
			dataIndex: 'uid',
			key: 'uid',
			width: 11 + "%",
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
	                    <div className="m-feadUserId">
							<Link to={"/userList?uid=" + record.uid} target="_blank">
								{record.uid}
							</Link>
						</div>
	                </Popover>
	            )
	        }
			
		}, {
			title: '用户账号',
			dataIndex: 'customerName',
			key: 'customerName',
			width: 9 + "%"
		}, {
			title: '反馈时间',
			dataIndex: 'createTime',
			key: 'createTime',
			width: 10 + "%"
		}, {
			title: '内容',
			dataIndex: 'feedbackInfo',
			key: 'feedbackInfo',
			className: "fadeContent td_hide",
			width: 19 + "%",
	        render: (text, record) =>{
	            return(
	                <Popover
	                    placement="top"
	                    title={null}
	                    content={
	                        record.feedbackInfo
	                    }
	                >
	                    <span>{record.feedbackInfo}</span>
	                </Popover>
	            )
	        }
		}, {
			title: '渠道',
			dataIndex: 'channelCode',
			key: 'channelCode',
			width: 8 + "%"
		}, {
			title: '版本号',
			dataIndex: 'clientVersion',
			key: 'clientVersion',
			width: 7 + "%"
		}, {
			title: '图片',
			dataIndex: 'images',
			key: 'images',
			width: 9 + "%",
			render(text, record) {
				return (
					<div>
						<span className="m-sawImage" >{record.images == null? "无" : "有"}</span>
					</div>
				)
			}
		}, {
			title: '状态',
			dataIndex: 'status',
			key: 'status',
			width: 8 + "%"
		}, {
			title: '最后操作时间',
			dataIndex: 'updateTime',
			key: 'updateTime',
			width: 10 + "%"
		}, {
			title: '操作',
			dataIndex: '',
			width: 9 + "%",
			render(text, record) {
				return (
					<div data-page="FeedBackDetail" className="m-feadUserId">
						<Link to={"/FeedBackDetail?feadId=" + record.feedbackCode} target="_blank">
							查看详情
                        </Link>
					</div>
				)
			}
		}];
		return (
			<div className="feedBackAll">
				<Spin spinning={this.state.loading} size="large">
					<div className="feedBackAllTitle">
						反馈
					</div>

					<div className="g-feedSerchTiy">
						<Select defaultValue="CUSTOMER_NAME" className="selectWidth intervalRight" onChange={this.handleChange5}>
							{/* <Option value="">全部</Option> */}
							<Option value="CUSTOMER_NAME">用户账号</Option>
							<Option value="FEEDBACK_INFO">内容</Option>
						</Select>
						{/*<Input placeholder="输入检索内容"  className="tinySearchContent" onChange={(e)=>this.handleChange6(e)} />*/}
						<Search placeholder="搜索" enterButton className="searchWidth intervalRight"  onSearch={(value) => { this.searchContent("searchText", value) }} />
						{/*<div className="theSearch" onClick={()=>this.jingClick("")}>检索</div>*/}
						<div className="setSelect" onClick={() => this.selectSet()}>更多条件 <Icon type={this.state.selectDU} /></div>
					</div>


					<div style={{"marginTop":"20px","marginLeft":"20px", "display":this.state.searchFlag?"block":"none"}}>
						<div className="part">
							<span className="u-txt">渠道:</span>
							<Select defaultValue="" value={this.state.channelCode}  className="selectWidth" onChange={this.handleChange1}>
								<Option value="">全部</Option>
								{
									thisTrue.state.selectDetail.theChannel.length > 0 ? thisTrue.state.selectDetail.theChannel.map(item => {
										return <Option value={item.code}>{item.name}</Option>
									}) : ''
								}
							</Select>
						</div>

						<div className="part">
							<span className="u-txt">版本号:</span>
							<Select defaultValue="" value={this.state.version} className="selectWidth" onChange={this.handleChange2}>
								<Option value="">全部</Option>
								{
									thisTrue.state.selectDetail.theTypeNum ? thisTrue.state.selectDetail.theTypeNum.map(item => {
										return <Option value={item}>{item}</Option>
									}) : ''
								}
							</Select>
						</div>

						<div className="part">
							<span className="u-txt">反馈时间:</span>
							<DatePicker
								disabledDate={this.disabledStartDate}
								showTime
								format="YYYY-MM-DD HH:mm:ss"
								placeholder="开始时间"
								onChange={(value, dateString) => this.onStartChange(value, dateString)}
								style={{ width: 180 }}
								onOk={this.onOk}
								value={this.state.startValue != '' ? moment(this.state.startValue, 'YYYY-MM-DD HH:mm:ss') : null}
							/>
							<i> — </i>
							<DatePicker
								disabledDate={this.disabledEndDate}
								showTime
								format="YYYY-MM-DD HH:mm:ss"
								placeholder="结束时间"
								onChange={(value, dateString) => this.onEndChange(value, dateString)}
								value={this.state.endValue != '' ? moment(this.state.endValue, 'YYYY-MM-DD HH:mm:ss') : null}
								style={{ width: 180 }}
								onOk={this.onOk}
							/>
						</div>

						<div className="part">
							<span className="u-txt">图片:</span>
							<Select defaultValue="" value={this.state.hasImg} className="selectWidth" onChange={this.handleChange3}>
								<Option value="">全部</Option>
								<Option value="YES">有</Option>
								<Option value="NO">无</Option>
							</Select>
						</div>

						<div className="part">
							<span className="u-txt">处理状态:</span>
							<Select value={this.state.status} style={{ width: 130 }} onChange={this.handleChange4}>
								<Option value="">全部</Option>
								{
									thisTrue.state.selectDetail.theOpaState ? thisTrue.state.selectDetail.theOpaState.map(item => {
										return <Option value={item.searchCode}>{item.searchName}</Option>
									}) : ''
								}
							</Select>
						</div>
						<div className="intervalBottom">
							<Button className="u-btn-green intervalRight" onClick={() => {this.getAllInfor(0,20) }}>查询</Button>
							<Button className="block u-btn-green buttonWidth" onClick={() => this.clearSelect()}>恢复默认</Button>
						</div>
					</div>
					<Tabs defaultActiveKey="NOT_DEAL_WITH" onChange={this.changeTabs} style={{width:"100%"}}>
						<TabPane tab={<span>未处理</span>} key="NOT_DEAL_WITH">
							<div className="g-feedTable">
								<Table className="t-nm-tab" dataSource={this.state.allCommentDetail} columns={columns} pagination={false} scroll={{ y: ((this.state.pageLengthNow > 10) ? 625 : 0) }} />
								<div className="paixu">
									<Pagination className="paixuIn" current={this.state.current} showSizeChanger pageSizeOptions={['20', '40', '60', '80', '100']} defaultPageSize={20} defaultCurrent={1} showTotal={total => `共 ${total} 条`} total={this.state.pageMax} onChange={this.pageChangeFun} showQuickJumper={true} onShowSizeChange={this.pageSizeChangeFun} />
								</div>
							</div>
						</TabPane>
						<TabPane tab={<span>联系中</span>} key="IN_CONTACT">
							<div className="g-feedTable">
								<Table className="t-nm-tab" dataSource={this.state.allCommentDetail} columns={columns} pagination={false} scroll={{ y: ((this.state.pageLengthNow > 10) ? 625 : 0) }} />
								<div className="paixu">
									<Pagination className="paixuIn" current={this.state.current} showSizeChanger pageSizeOptions={['20', '40', '60', '80', '100']} defaultPageSize={20} defaultCurrent={1} showTotal={total => `共 ${total} 条`} total={this.state.pageMax} onChange={this.pageChangeFun} showQuickJumper={true} onShowSizeChange={this.pageSizeChangeFun} />
								</div>
							</div>
						</TabPane>
						<TabPane tab={<span>全部反馈</span>} key="">
							<div className="g-feedTable">
								<Table className="t-nm-tab" dataSource={this.state.allCommentDetail} columns={columns} pagination={false} scroll={{ y: ((this.state.pageLengthNow > 10) ? 625 : 0) }} />
								<div className="paixu">
									<Pagination className="paixuIn" current={this.state.current} showSizeChanger pageSizeOptions={['20', '40', '60', '80', '100']} defaultPageSize={20} defaultCurrent={1} showTotal={total => `共 ${total} 条`} total={this.state.pageMax} onChange={this.pageChangeFun} showQuickJumper={true} onShowSizeChange={this.pageSizeChangeFun} />
								</div>
							</div>
						</TabPane>
				    </Tabs>
					

					{
						this.state.imgFlag && <SawImgDetail closeImage={this.closeImage} imgSrc={this.state.imgSrc} ></SawImgDetail>
					}
				</Spin>
			</div>
		);
	}
}
