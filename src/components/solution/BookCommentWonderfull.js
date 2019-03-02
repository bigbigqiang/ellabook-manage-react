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
			body: "method=ella.operation.updateBookCommentIsSelected&content=" + JSON.stringify({
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
			body: "method=ella.operation.searchBookCommentByConditions" + "&content=" + JSON.stringify({
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
						allGoodCommentDetail: data,
						loading: false,
						pageMax: response.data.total,
						pageLengthNow: response.data.bookCommentList.length,
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
						<div className="paixu">
							<Pagination className="paixuIn" current={this.state.pageNow + 1} showSizeChanger pageSizeOptions={['20', '40', '60', '80', '100']} defaultPageSize={20} defaultCurrent={1} showTotal={total => `共 ${total} 条`} total={this.state.pageMax} onChange={this.pageChangeFun} showQuickJumper={true} onShowSizeChange={this.pageSizeChangeFun} />
						</div>
					</div>

				</Spin>
			</div>
		);
	}
}
