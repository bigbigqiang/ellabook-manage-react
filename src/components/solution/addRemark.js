/*
 	created by NiePengfei at 2017/11/11
 	评论
 */

import React from 'react'
import { Table, Pagination, Select, Input, Spin, Icon, Modal, Button } from 'antd';
import "./addRemark.css";
import getUrl from "../util.js"
import { dataString } from '../commonData.js'

const Option = Select.Option;
const { TextArea } = Input;
const Search = Input.Search;
const confirm = Modal.confirm;
export default class AddRemark extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			remarkBN: "",
			remarkUid: [],
			remarkWord: "",
			loading: false,
			bookList: [],
			bookName: '',
			pageLengthNow: 0,
			selectBook: [],
			courseList: [],
			selectCourse: []
		}
		this.handleChange2 = this.handleChange2.bind(this);
		this.handleChange3 = this.handleChange3.bind(this);
		this.saveAndClose = this.saveAndClose.bind(this);
		this.handleCancel1 = this.handleCancel1.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}

	//即将插入本组件时，开始请求数据，准备渲染
	componentWillMount() {
		this.getUserPhone();
		console.log(this.props.commentType)
		this.props.commentType === 'book' ? this.getBookAll() : this.getBookCourseList();
	}

	//虚拟dom变成真实dom之后，开始绑定事件
	componentDidMount() {
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

	//搜索字段的回调函数
	handleChange2(value) {
		this.setState({
			remarkUid: value
		})
	}
	handleChange3(e) {
		this.setState({
			remarkWord: e.target.value
		})
	}

	saveAndClose() {
		let thisTrue = this;
		
		let _remarkUid=this.state.remarkUid.join()
		let fetchBody = ''
		if (thisTrue.props.commentType === "book") {
			fetchBody = "method=ella.operation.insertBookCommentBatch" + "&content=" + JSON.stringify({
				"uid": _remarkUid,
				"bookCodeList": thisTrue.state.selectBook,
				"commentContent": thisTrue.state.remarkWord
			})+dataString
		} else {
			fetchBody = "method=ella.operation.insertCourseCommentBatch" + "&content=" + JSON.stringify({
				"uid": _remarkUid,
				"courseCodeList": thisTrue.state.selectCourse,
				"commentContent": thisTrue.state.remarkWord
			})+dataString
		}
		confirm({
			title: '请确认是否添加该条评论?',
			content: '',
			onOk() {
				fetch(getUrl.url, {
					method: "POST",
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					body: fetchBody
				})
					.then(function (response) {
						console.log(response);
						return response.json();
					})
					.then(function (response) {
						console.log(response);
						if (response.status == 1) {
							Modal.success({
								title: '发布成功！',
								content: '',
							});
							thisTrue.props.handleCancel();
						} else {
							Modal.error({
								title: '发布失败！',
								content: '系统错误',
							});
						}
					})
			},
			onCancel() { },
		});
	}


	//关闭弹出层
	handleCancel1() {
		this.setState({
			visible1: false,
		});
	}


	//获取所有可选账号
	getUserPhone() {
		var thisTrue = this;
		const doc = {
			type: 'AUTO_BOX',
			groupId: "operation.box.getUserWhiteList"
		}
		fetch(getUrl.url, {
			method: 'POST',
			headers: {
				"Content-type": "application/x-www-form-urlencoded"
			},
			mode: 'cors',
			body: "method=ella.operation.boxSearchList" + "&content=" + JSON.stringify(doc)+dataString
		})
			.then(res => res.json())
			.then((data) => {
				console.log(data);
				if (data.status == 1) {
					thisTrue.setState({
						userList: data.data,
					});
				} else if (data.status == 0) {
					if (data.code == "10003007") {
						Modal.warning({
							title: '登录失效，请重新登录',
							content: ""
						});
					}
				}
			})
	}


	//获取图书列表
	getBookAll() {
		var thisTrue = this;
		fetch(getUrl.url, {
			method: "POST",
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: "method=ella.operation.getBookListByIdOrName" + "&content=" + JSON.stringify({
				text: '',
				page: 0,
				pageSize: 100000
			})+dataString
		})
			.then(res => res.json())
			.then((data) => {
				console.log(data);

				if (data.status == 1) {
					thisTrue.setState({
						bookList: data.data.bookList,
					})
				}
			})
	}
	//获取课程列表
	getBookCourseList() {
		var thisTrue = this;
		fetch(getUrl.url, {
			method: "POST",
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: "method=ella.operation.getBookCourseList" + "&content=" + JSON.stringify({
				pageVo: {
					page: 0,
					pageSize: 100000
				},
			})+dataString
		})
			.then(res => res.json())
			.then((data) => {
				console.log(data);
				if (data.status == 1) {
					thisTrue.setState({
						courseList: data.data.list,
					})
				}
			})
	}


	handleChange(value) {
		if (this.props.commentType === 'book') {
			this.setState({
				selectBook: value
			})
		} else {
			this.setState({
				selectCourse: value
			})
		}
	}


	render() {
		var thisTrue = this;

		return (
			<div className="addRemark">
				<Spin spinning={this.state.loading} size="large">
					<div className="g-addCon">
						{
							this.props.commentType === 'book' ? (
								<div>
									<span>　图书名称:　　</span>
									<Select
										mode="multiple"
										style={{ width: 400 }}
										placeholder="图书名称"
										onChange={thisTrue.handleChange}
									>
										{
											thisTrue.state.bookList.length > 0 ? thisTrue.state.bookList.map(function (item) {
												return <Option key={item.bookCode}>{item.bookName}</Option>
											}) : ''
										}
									</Select>
								</div>
							) : (
								<div>
									<span>　课程名称:　　</span>
									<Select
										mode="multiple"
										style={{ width: 400 }}
										placeholder="课程名称"
										onChange={thisTrue.handleChange}
									>
										{
											thisTrue.state.courseList.length > 0 ? thisTrue.state.courseList.map(function (item) {
												return <Option key={item.courseCode}>{item.courseName}</Option>
											}) : ''
										}
									</Select>
								</div>
							)
						}

						<div>
							<span>评论手机号:　　</span>
							<Select style={{ width: 400 }} mode="multiple" onChange={this.handleChange2}>
								{this.state.userList && this.state.userList.map(function (item) {
									return <Option key={item.uid}>{item.mobile}</Option>
								})}
							</Select>
						</div>

						<div>
							<span>　评论内容:　　</span>
							<TextArea placeholder="评论内容" autosize={{ minRows: 1, maxRows: 6 }} onBlur={this.handleChange3} style={{ width: 400, height: 300 }} />
						</div>

						<div className="saveAddRemarkBtn" onClick={this.saveAndClose}>保存</div>
					</div>
				</Spin>
			</div>
		);
	}
}
