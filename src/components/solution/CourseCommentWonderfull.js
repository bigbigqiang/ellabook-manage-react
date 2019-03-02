/*
 	created by NiePengfei at 2017/11/11
 	精选评论
 */

import React from 'react'
import { Table, Pagination, Select, DatePicker, Button, Input, Spin, Modal, message,Popover } from 'antd';
import "./BookCommentWonderfull.css"
import "../../main.css"
import getUrl from "../util"
import RemarkVoice from './remarkVoice'
import { dataString } from '../commonData'
const Search = Input.Search;
const confirm = Modal.confirm;
export default class CommentWonderfull extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			loading: true,
			loading2: false,
			allGoodCommentDetail: [],
			pageNow: 0,
			pageSize: 20,
			pageMax: 0,
			goodRemarkDetail: ""
		}
		this.goodCommentSearch = this.goodCommentSearch.bind(this);
		this.pageChangeFun = this.pageChangeFun.bind(this);
		this.pageSizeChangeFun = this.pageSizeChangeFun.bind(this);
	}

	//即将插入本组件时，开始请求数据，准备渲染
	componentWillMount() {
		this.getAllGoodSolution(0, 20);
	}

	//虚拟dom变成真实dom之后，开始绑定事件
	componentDidMount() {
		this.setState({
			loading: false
		})
	}

	//搜索字段的回调函数
	goodCommentSearch(value) {
		console.log(`selected ${value}`);
		let thisTrue = this;
		this.setState({
			goodRemarkDetail: value
		}, () => {
			thisTrue.getAllGoodSolution(thisTrue.state.pageNow, thisTrue.state.pageSize);
		})
	}

	pageChangeFun(pageNumber) {
		this.setState({
			pageNow: pageNumber - 1
		})
		this.getAllGoodSolution(pageNumber - 1, this.state.pageSize);

	}
	pageSizeChangeFun(current, size) {
		this.setState({
			pageSize: size,
			pageNow: current - 1
		})
		this.getAllGoodSolution(current - 1, size);
	}


	commentDelete(conmentCode) {
		let thisTrue = this;
		this.setState({
			loading2: true
		})
		fetch(getUrl.url, {
			method: "POST",
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: "method=ella.operation.updateCourseCommentIsSelected&content=" + JSON.stringify({
				"isSelected": "NO",
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
					message.success('删除成功！');
					thisTrue.setState({
						loading2: false
					})
					thisTrue.getAllGoodSolution(thisTrue.state.pageNow, thisTrue.state.pageSize);
				} else {
					thisTrue.setState({
						loading2: false
					})
					message.error('删除失败,系统错误!');
				}
			})
	}

	//获取精选评论列表的数据
	getAllGoodSolution(pageNow, pageSize) {
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
				"commentType": '',
				"commentScore": '',
				"startTime": '',
				"endTime": '',
				"searchType": 'COMMENT_CONTENT',
				"searchText": thisTrue.state.goodRemarkDetail,
				"isSelected": 'YES',
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
						allGoodCommentDetail: data,
						loading: false,
						pageMax: response.data.total,
						pageLengthNow: response.data.courseCommentList.length,
					})
				}
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
						<span className="i-action-ico i-delete" onClick={() => thisTrue.commentDelete(record.commentCode)}><span></span></span>
					</div>
				)
			}
		}];
		return (
			<div className="commentWonderfull">
				<Spin spinning={this.state.loading} size="large">
					<div className="commentWonderfullTop">
						<Search placeholder="输入评论内容查询" enterButton onSearch={value => this.goodCommentSearch(value)} />
					</div>

					<div className="g-comFullTable">
						<Table className="t-nm-tab" loading={this.state.loading2} dataSource={this.state.allGoodCommentDetail} columns={columns} pagination={false} scroll={{ y: ((this.state.pageLengthNow > 17) ? 690 : 0) }} />
						<div className="paixu coursePagination">
							<Pagination className="paixuIn" current={this.state.pageNow + 1} showSizeChanger pageSizeOptions={['20', '40', '60', '80', '100']} defaultPageSize={20} defaultCurrent={1} showTotal={total => `共 ${total} 条`} total={this.state.pageMax} onChange={this.pageChangeFun} showQuickJumper={true} onShowSizeChange={this.pageSizeChangeFun} />
						</div>
					</div>

				</Spin>
			</div>
		);
	}
}
