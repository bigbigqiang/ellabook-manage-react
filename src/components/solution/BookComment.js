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
import BookCommentWonderfull from './BookCommentWonderfull'
import moment from 'moment';
import { dataString } from '../commonData'
const { Option, OptGroup } = Select;
const Search = Input.Search;
const confirm = Modal.confirm;
const TabPane = Tabs.TabPane;
export default class BookComment extends React.Component {
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
		this.setState({
			searchType: value
		})
	}
	// 监听 Tabs 切换
	handleTabsChange (key) {
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
			body: "method=ella.operation.updateBookCommentIsSelected" + "&content=" + JSON.stringify({
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
			body: "method=ella.operation.searchBookCommentByConditions" + "&content=" + JSON.stringify({
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
					for (let i = 0; i < response.data.bookCommentList.length; i++) {
						//处理评论星级
						let zz = "";
						for (let y = 0; y < parseInt(response.data.bookCommentList[i].commentScore); y++) {
							zz += "★";
						}
						response.data.bookCommentList[i].commentScore = <span className="solutionStar">{zz}</span>;

						//处理语音评论
						if (response.data.bookCommentList[i].commentType == "COMMENT_VOICE") {
							response.data.bookCommentList[i].commentContent = <RemarkVoice voiceUrl={response.data.bookCommentList[i].commentVoiceUrl} num={i} voiceTime={response.data.bookCommentList[i].commentDuration}></RemarkVoice>;
						}

						//处理是否精选评论
						if (response.data.bookCommentList[i].isSelected == "YES") {
							goodArr.push("like");
						} else if (response.data.bookCommentList[i].isSelected == "NO") {
							goodArr.push("like-o");
						} else {
							goodArr.push("like-o");
						}
						/*2018-03-15 start*/
						data.push({
							bookCode: (response.data.bookCommentList[i].bookCode == '' || response.data.bookCommentList[i].bookCode == null) ? '-' : response.data.bookCommentList[i].bookCode,
							bookName: (response.data.bookCommentList[i].bookName == '' || response.data.bookCommentList[i].bookName == null) ? '-' : response.data.bookCommentList[i].bookName,
							commentCode: (response.data.bookCommentList[i].commentCode == '' || response.data.bookCommentList[i].commentCode == null) ? '-' : response.data.bookCommentList[i].commentCode,
							commentContent: (response.data.bookCommentList[i].commentContent == '' || response.data.bookCommentList[i].commentContent == null) ? '-' : response.data.bookCommentList[i].commentContent,
							commentDuration: (response.data.bookCommentList[i].commentDuration == '' || response.data.bookCommentList[i].commentDuration == null) ? '-' : response.data.bookCommentList[i].commentDuration,
							commentScore: (response.data.bookCommentList[i].commentScore == '' || response.data.bookCommentList[i].commentScore == null) ? '-' : response.data.bookCommentList[i].commentScore,
							commentTime: (response.data.bookCommentList[i].commentTime == '' || response.data.bookCommentList[i].commentTime == null) ? '-' : response.data.bookCommentList[i].commentTime,
							commentTitle: (response.data.bookCommentList[i].commentTitle == '' || response.data.bookCommentList[i].commentTitle == null) ? '-' : response.data.bookCommentList[i].commentTitle,
							commentType: (response.data.bookCommentList[i].commentType == '' || response.data.bookCommentList[i].commentType == null) ? '-' : response.data.bookCommentList[i].commentType,
							commentVoiceUrl: (response.data.bookCommentList[i].commentVoiceUrl == '' || response.data.bookCommentList[i].commentVoiceUrl == null) ? '-' : response.data.bookCommentList[i].commentVoiceUrl,
							customerName: (response.data.bookCommentList[i].customerName == '' || response.data.bookCommentList[i].customerName == null) ? '-' : response.data.bookCommentList[i].customerName,
							isAnonymous: (response.data.bookCommentList[i].isAnonymous == '' || response.data.bookCommentList[i].isAnonymous == null) ? '-' : response.data.bookCommentList[i].isAnonymous,
							isSelected: (response.data.bookCommentList[i].isSelected == '' || response.data.bookCommentList[i].isSelected == null) ? '-' : response.data.bookCommentList[i].isSelected,
							upvoteNum: (response.data.bookCommentList[i].upvoteNum == '' || response.data.bookCommentList[i].upvoteNum == null) ? '-' : response.data.bookCommentList[i].upvoteNum,
						})
						/*2018-03-15 end*/
					}

					thisTrue.setState({
						allCommentDetail: data,
						loading: false,
						pageMax: response.data.total,
						pageLengthNow: response.data.bookCommentList.length,
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
					body: "method=ella.operation.updateBookCommentStatus" + "&content=" + JSON.stringify({
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
			title: '评论图书',
			dataIndex: 'bookName',
			key: 'bookName',
			width: 15 + "%",
			className:'td_hide',
	        render: (text, record) =>{
	            return(
	                <Popover
	                    placement="top"
	                    title={null}
	                    content={
	                        record.bookName
	                    }
	                >
	                    <span>{record.bookName}</span>
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
						图书评论
					</div>
					{
						this.state.tabsKey === '1' && (
							<div>
								<div className="g-comSerchTiy">
									<div className="addRemarkBtn intervalRight" onClick={this.addRemarkFunc}>　1</div>
									<Select defaultValue="CUSTOMER_NAME" className="selectWidth intervalRight" onChange={this.handleChange3}>
										<Option value="CUSTOMER_NAME">用户账号</Option>
										<Option value="BOOK_NAME">图书</Option>
										<Option value="COMMENT_CONTENT">内容</Option>
									</Select>
									<Search placeholder="输入检索内容" enterButton className="searchWidth intervalRight" value={this.state.searchText} onChange={(e)=>{this.setState({searchText: e.target.value})}} onSearch={(value) => { this.searchContent("searchText", value) }} />
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
							<BookCommentWonderfull/>
						</TabPane>
					</Tabs>

					<Modal
						visible={thisTrue.state.visible}
						title="添加新评论"
						onCancel={thisTrue.handleCancel}
						footer={null}
						width={700}
					>
						{thisTrue.state.visible && <AddRemark commentType='book' handleCancel={() => this.handleCancel()}></AddRemark>}
					</Modal>
				</Spin>
			</div>
		);
	}
}
