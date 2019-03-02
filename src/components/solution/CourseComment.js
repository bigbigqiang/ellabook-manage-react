/*
 	created by NiePengfei at 2017/11/11
 	评论
 */

import React from 'react'
import { Table, Pagination, Select, DatePicker, Button, Input, Spin, Icon, Modal, message,Popover, Tabs } from 'antd';
import "./BookComment.css"
import "../../main.css"
import getUrl from "../util"
import AddRemark from "./addRemark"
import RemarkVoice from './remarkVoice'
import CourseCommentWonderfull from './CourseCommentWonderfull'
import moment from 'moment';
import { dataString } from '../commonData'
const { Option, OptGroup } = Select;
const Search = Input.Search;
const confirm = Modal.confirm;
const TabPane = Tabs.TabPane;
export default class CourseComment extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			loading: true,
			allCommentDetail: [],
			pageNow: 0,
			pageSize: 20,
			pageMax: 0,

			commentType: "",
			commentScore: "",
			startTime: "",
			endTime: "",
			searchType: "CUSTOMER_NAME",
			searchText: "",
			isSelected: "",

			addRemark: false,
			pageLengthNow: 0,
			searchFlag: false,
			selectDU: "down",

			visible: false,
			goodRemark: "",

			startValue: "",
			endValue: "",
			tabsKey: '1',

			selectedRowKeys: [],

			loading2: false,


		}
		this.handleChange1 = this.handleChange1.bind(this);
		this.handleChange2 = this.handleChange2.bind(this);
		this.handleChange3 = this.handleChange3.bind(this);
		this.commentSearch = this.commentSearch.bind(this);
		this.addRemarkFunc = this.addRemarkFunc.bind(this);
		this.pageChangeFun = this.pageChangeFun.bind(this);
		this.disabledStartDate = this.disabledStartDate.bind(this);
		this.disabledEndDate = this.disabledEndDate.bind(this);
		this.pageSizeChangeFun = this.pageSizeChangeFun.bind(this);
		this.sayGood = this.sayGood.bind(this);
		this.handleCancel = this.handleCancel.bind(this);
		this.onStartChange = this.onStartChange.bind(this);
		this.onEndChange = this.onEndChange.bind(this);
		this.handleTabsChange = this.handleTabsChange.bind(this);

	}

	//即将插入本组件时，开始请求数据，准备渲染
	componentWillMount() {
		this.getAllSolution(0, 20);
	}

	//虚拟dom变成真实dom之后，开始绑定事件
	componentDidMount() {
		var thisTrue = this;
		this.setState({
			loading: false
		})

	}

	//搜索字段的回调函数
	handleChange1(value) {
		console.log(value);
		this.setState({
			commentType: value
		})
	}
	handleChange2(value) {
		console.log(value);
		this.setState({
			commentScore: value
		})
	}
	handleChange3(value) {
		console.log(value);
		this.setState({
			searchType: value
		})
	}
	// 监听 Tabs 切换
	handleTabsChange (key) {
		console.log(typeof key)
		this.setState({
			tabsKey: key
		})
	}
	//搜索框的回调
	commentSearch(value) {
		console.log(value);
		this.setState({
			searchText: value
		}, () => {
			this.getAllSolution(this.state.pageNow, this.state.pageSize);
		})
	}

	pageChangeFun(pageNumber) {
		this.setState({
			pageNow: pageNumber - 1
		})
		this.getAllSolution(pageNumber - 1, this.state.pageSize);

	}
	pageSizeChangeFun(current, size) {
		this.setState({
			pageSize: size,
			pageNow: current - 1
		})
		this.getAllSolution(current - 1, size);
	}

	addRemarkFunc() {
		this.setState({
			addRemark: true,
			visible: true
		})
	}

	sayGood(index, conmentCode) {

		let newArr = this.state.goodRemark;
		var comState;
		if (this.state.goodRemark[index] == "like-o") {
			newArr[index] = "like";
			comState = "YES";
		} else if (this.state.goodRemark[index] == "like") {
			newArr[index] = "like-o";
			comState = "NO";
		}

		this.setState({
			loading2: true
		})

		let thisTrue = this;
		fetch(getUrl.url, {
			method: "POST",
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: "method=ella.operation.updateCourseCommentIsSelected" + "&content=" + JSON.stringify({
				"isSelected": comState,
				"commentCode": conmentCode
			})+dataString
		})
			.then(function (response) {
				console.log(response);
				return response.json();
			})
			.then(function (response) {
				console.log(response);
				if (response.status == 1) {
					message.success('修改成功！');

					thisTrue.setState({
						goodRemark: newArr,
						loading2: false
					})
				} else {
					message.error('修改失败！');
				}
			})
	}

	//关闭弹出层
	handleCancel() {
		console.log("关闭");
		this.setState({
			visible: false,
		})
		this.getAllSolution(this.state.pageNow, this.state.pageSize);
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

	//获取评论列表的数据
	getAllSolution(pageNow, pageSize) {
		var thisTrue = this;
		this.setState({
			loading: true,
		});

		fetch(getUrl.url, {
			method: "POST",
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: "method=ella.operation.searchCourseCommentByConditions" + "&content=" + JSON.stringify({
				"commentType": thisTrue.state.commentType,
				"commentScore": thisTrue.state.commentScore,
				"startTime": thisTrue.state.startValue,
				"endTime": thisTrue.state.endValue,
				"searchType": thisTrue.state.searchType,
				"searchText": thisTrue.state.searchText,
				"isSelected": thisTrue.state.isSelected,
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
				if (response.status == 1) {
					var goodArr = [];	//存放精选评论状态的数组
					var data = [];
					for (let i = 0; i < response.data.courseCommentList.length; i++) {
						//处理评论星级
						let zz = "";
						for (let y = 0; y < parseInt(response.data.courseCommentList[i].commentScore); y++) {
							zz += "★";
						}
						response.data.courseCommentList[i].commentScore = <span className="solutionStar">{zz}</span>;

						//处理语音评论
						if (response.data.courseCommentList[i].commentType == "COMMENT_VOICE") {
							response.data.courseCommentList[i].commentContent = <RemarkVoice voiceUrl={response.data.courseCommentList[i].commentVoiceUrl} num={i} voiceTime={response.data.courseCommentList[i].commentDuration}></RemarkVoice>;
						}

						//处理是否精选评论
						if (response.data.courseCommentList[i].isSelected == "YES") {
							goodArr.push("like");
						} else if (response.data.courseCommentList[i].isSelected == "NO") {
							goodArr.push("like-o");
						} else {
							goodArr.push("like-o");
						}
						/*2018-03-15 start*/
						data.push({
							courseCode: (response.data.courseCommentList[i].courseCode == '' || response.data.courseCommentList[i].courseCode == null) ? '-' : response.data.courseCommentList[i].courseCode,
							courseName: (response.data.courseCommentList[i].courseName == '' || response.data.courseCommentList[i].courseName == null) ? '-' : response.data.courseCommentList[i].courseName,
							commentCode: (response.data.courseCommentList[i].commentCode == '' || response.data.courseCommentList[i].commentCode == null) ? '-' : response.data.courseCommentList[i].commentCode,
							commentContent: (response.data.courseCommentList[i].commentContent == '' || response.data.courseCommentList[i].commentContent == null) ? '-' : response.data.courseCommentList[i].commentContent,
							commentDuration: (response.data.courseCommentList[i].commentDuration == '' || response.data.courseCommentList[i].commentDuration == null) ? '-' : response.data.courseCommentList[i].commentDuration,
							commentScore: (response.data.courseCommentList[i].commentScore == '' || response.data.courseCommentList[i].commentScore == null) ? '-' : response.data.courseCommentList[i].commentScore,
							commentTime: (response.data.courseCommentList[i].commentTime == '' || response.data.courseCommentList[i].commentTime == null) ? '-' : response.data.courseCommentList[i].commentTime,
							commentTitle: (response.data.courseCommentList[i].commentTitle == '' || response.data.courseCommentList[i].commentTitle == null) ? '-' : response.data.courseCommentList[i].commentTitle,
							commentType: (response.data.courseCommentList[i].commentType == '' || response.data.courseCommentList[i].commentType == null) ? '-' : response.data.courseCommentList[i].commentType,
							commentVoiceUrl: (response.data.courseCommentList[i].commentVoiceUrl == '' || response.data.courseCommentList[i].commentVoiceUrl == null) ? '-' : response.data.courseCommentList[i].commentVoiceUrl,
							customerName: (response.data.courseCommentList[i].customerName == '' || response.data.courseCommentList[i].customerName == null) ? '-' : response.data.courseCommentList[i].customerName,
							isAnonymous: (response.data.courseCommentList[i].isAnonymous == '' || response.data.courseCommentList[i].isAnonymous == null) ? '-' : response.data.courseCommentList[i].isAnonymous,
							isSelected: (response.data.courseCommentList[i].isSelected == '' || response.data.courseCommentList[i].isSelected == null) ? '-' : response.data.courseCommentList[i].isSelected,
							upvoteNum: (response.data.courseCommentList[i].upvoteNum == '' || response.data.courseCommentList[i].upvoteNum == null) ? '-' : response.data.courseCommentList[i].upvoteNum,
						})
						/*2018-03-15 end*/
					}

					thisTrue.setState({
						allCommentDetail: data,
						loading: false,
						pageMax: response.data.total,
						pageLengthNow: response.data.courseCommentList.length,
						goodRemark: goodArr
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
		this.getAllSolution(0, this.state.pageSize);
	}
	handleChange6(e) {
		console.log(e.target.value);
		this.setState({
			searchText: e.target.value
		})
	}

	commentDelete(conmentCode) {
		let thisTrue = this;
		confirm({
			title: '确定要彻底删除这条评论吗?',
			content: '一旦删除，将不可恢复',
			onOk() {

				fetch(getUrl.url, {
					method: "POST",
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					body: "method=ella.operation.updateCourseCommentByCode" + "&content=" + JSON.stringify({
						"status": "EXCEPTION",
						"commentCode": conmentCode
					})+dataString
				})
					.then(function (response) {
						console.log(response);
						return response.json();
					})
					.then(function (response) {
						console.log(response);
						if (response.status == 1) {
							Modal.success({
								title: '删除成功！',
								content: '',
							});
							thisTrue.getAllSolution(thisTrue.state.pageNow, thisTrue.state.pageSize);
						} else {
							Modal.error({
								title: '删除失败！',
								content: '系统错误',
							});
						}
					})
			},
			onCancel() { },
		});
	}

	searchContent(name, value) {
		this.setState({
			pageNow: 0,
			[name]: value
		}, () => {
			this.getAllSolution(0, this.state.pageSize);
		})
	}
	//恢复默认设置
	clearSelect() {

		this.setState({
			commentType: '',
			commentScore: '',
			startValue: '',
			endValue: ''
		})

	}

	render() {
		var thisTrue = this;
		var columns = [{
			title: '评论用户',
			dataIndex: 'customerName',
			key: 'customerName',
			width: 15 + "%"
		}, {
			title: '评论课程',
			dataIndex: 'courseName',
			key: 'courseName',
			width: 15 + "%",
			className:'td_hide',
	        render: (text, record) =>{
	            return(
	                <Popover
	                    placement="top"
	                    title={null}
	                    content={
	                        record.courseName
	                    }
	                >
	                    <span>{record.courseName}</span>
	                </Popover>
	            )
	        }
		}, {
			title: '评论星级',
			dataIndex: 'commentScore',
			key: 'commentScore',
			width: 25 + "%"
		}, {
			title: '评论内容',
			dataIndex: 'commentContent',
			key: 'commentContent',
			width: 15 + "%",
			className:'td_hide',
	        render: (text, record) =>{
	            return(
	                <Popover
	                    placement="top"
	                    title={null}
	                    content={
	                        record.commentContent
	                    }
	                >
	                    <span>{record.commentContent}</span>
	                </Popover>
	            )
	        }
		}, {
			title: '评论时间',
			dataIndex: 'commentTime',
			key: 'commentTime',
			width: 15 + "%"
		}, {
			title: '操作',
			dataIndex: '',
			width: 15 + "%",
			render(text, record, index) {
				return (
					<div className="commentOpate">
						<Icon type={thisTrue.state.goodRemark[index]} onClick={() => thisTrue.sayGood(index, record.commentCode)} />
						<span style={{marginLeft:'80px'}} className="i-action-ico i-delete" onClick={() => thisTrue.commentDelete(record.commentCode)}><span></span></span>
					</div>
				)
			}
		}];

		return (
			<div className="BookComment">
				<Spin spinning={this.state.loading} size="large">
					<div className="commentAllTitle">
						课程评论
					</div>
					{
						this.state.tabsKey === '1' && (
							<div>
								<div className="g-comSerchTiy">
									<div className="addRemarkBtn intervalRight" onClick={this.addRemarkFunc}>　1</div>
									<Select defaultValue="CUSTOMER_NAME" className="selectWidth intervalRight" onChange={this.handleChange3}>
										{/* <Option value="">全部</Option> */}
										<Option value="CUSTOMER_NAME">用户账号</Option>
										<Option value="COURSE_NAME">课程</Option>
										<Option value="COMMENT_CONTENT">内容</Option>
									</Select>
									{/*<Input placeholder="输入检索内容"  className="tinySearchContent" onChange={(e)=>this.handleChange6(e)} />*/}
									<Search placeholder="输入检索内容" enterButton className="searchWidth intervalRight" value={this.state.searchText} onChange={(e)=>{this.setState({searchText: e.target.value})}} onSearch={(value) => { this.searchContent("searchText", value) }} />
									{/*<div className="theSearch" onClick={()=>this.jingClick("")}>检索</div>*/}
									<div className="setSelect" onClick={() => this.selectSet()}>更多条件 <Icon type={this.state.selectDU} /></div>
								</div>
								<div className="g-comSerch" style={{ height: this.state.searchFlag ? "auto" : 0 }}>
									<div className="part">
										<span className="u-txt">评论形式:</span>
										<Select defaultValue="" value={this.state.commentType} className="selectWidth" onChange={this.handleChange1}>
											<Option value="">全部</Option>
											<Option value="COMMENT_TEXT">文字</Option>
											<Option value="COMMENT_VOICE">语音</Option>
										</Select>
									</div>

									<div className="part">
										<span className="u-txt">评论星级:</span>
										<Select defaultValue="" value={this.state.commentScore} className="selectWidth" onChange={this.handleChange2}>
											<Option value="">全部</Option>
											<Option value="5">5星</Option>
											<Option value="4">4星</Option>
											<Option value="3">3星</Option>
											<Option value="2">2星</Option>
											<Option value="1">1星</Option>
										</Select>
									</div>

									<div className="part">
										<span className="u-txt">评论时间:</span>
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
										<i>　—　</i>
										<DatePicker
											disabledDate={this.disabledEndDate}
											showTime
											format="YYYY-MM-DD HH:mm:ss"
											
											placeholder="结束时间"
											onChange={(value, dateString) => this.onEndChange(value, dateString)}
											style={{ width: 180 }}
											onOk={this.onOk}
											value={this.state.endValue != '' ? moment(this.state.endValue, 'YYYY-MM-DD HH:mm:ss') : null}

										/>
									</div>
									<div className="intervalBottom">
										<Button className="block u-btn-green buttonWidth" onClick={() => this.clearSelect()}>恢复默认</Button>
									</div>
								</div>
							</div>
						)
					}
					<Tabs defaultActiveKey="1" onChange={this.handleTabsChange}>
						<TabPane type="line" tab='全部评论' key="1">
							<div className="g-comTable">
								<Table className="t-nm-tab" loading={this.state.loading2} dataSource={this.state.allCommentDetail} columns={columns} pagination={false} scroll={{ y: ((this.state.pageLengthNow > 14) ? 615 : 0) }} />
								<div className="paixu">
									<Pagination className="paixuIn" current={this.state.pageNow + 1} showSizeChanger pageSizeOptions={['20', '40', '60', '80', '100']} defaultPageSize={20} defaultCurrent={1} showTotal={total => `共 ${total} 条`} total={this.state.pageMax} onChange={this.pageChangeFun} showQuickJumper={true} onShowSizeChange={this.pageSizeChangeFun} />
								</div>
							</div>
						</TabPane>
						<TabPane type="line" tab='精彩评论' key="2">
							<CourseCommentWonderfull/>
						</TabPane>
					</Tabs>

					<Modal
						visible={thisTrue.state.visible}
						title="添加新评论"
						onCancel={thisTrue.handleCancel}
						footer={null}
						width={700}
					>
						{thisTrue.state.visible && <AddRemark commentType='course' handleCancel={() => this.handleCancel()}></AddRemark>}
					</Modal>
				</Spin>
			</div>
		);
	}
}
