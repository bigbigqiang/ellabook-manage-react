/*
 	created by NiePengfei at 2017/12/12
 		图书——原著作者
 */

import React from 'react'
import { Table, Select, DatePicker, Button, Input, Spin, Pagination, Modal,Popover } from 'antd';
import { Link } from 'react-router';
import "./originalAuthor.css"
import getUrl from "../util.js"
import AuthorDetail from "./authorDetail.js"
import { dataString } from '../commonData.js'

const { Option, OptGroup } = Select;
const Search = Input.Search;
const confirm = Modal.confirm;
export default class OriginalAuthor extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			loading: true,
			showBooks: false,
			classifyName: "",
			originalAuthorDetail: [],
			visible: false,
			authorName: "",
			editOrNew: "",
			authorCode: "",
			pageNow: 0,
			pageSize: 20,
			pageMax: 0,
			pageLengthNow: 0,
			searchValue: ""

		}
		this.pageChangeFun = this.pageChangeFun.bind(this);
		this.pageSizeChangeFun = this.pageSizeChangeFun.bind(this);
		this.handleCancel = this.handleCancel.bind(this);
		this.origDelete = this.origDelete.bind(this);
	}

	//即将插入本组件时，开始请求数据，准备渲染
	//http://ellabook.cn/EllaBook2.0/scriptPage/faq.html
	componentWillMount() {
		this.getAllOriDetail("", 0, 20);
	}

	//虚拟dom变成真实dom之后，开始绑定事件
	componentDidMount() {
		this.setState({
			loading: false
		})
	}
	//搜索框
	authorSearch(value) {
		console.log(value);
		this.setState({
			searchValue: value
		});
		// TODO:新的搜索开始就从第0页开始
		this.getAllOriDetail(value, 0, this.state.pageSize);
	}
	//编辑
	origEdit(authorCode, oparate) {
		console.log(authorCode);
		this.setState({
			visible: true,
			editOrNew: oparate,
			authorCode: authorCode
		});
	}
	//删除
	origDelete(authorCode) {
		console.log(authorCode);
		var thisTrue = this;
		confirm({
			title: '确定删除此作者吗?',
			content: '',
			okText: '确定',
			okType: 'danger',
			cancelText: '取消',
			onOk() {
				thisTrue.deleteOriAuthor(authorCode);
			},
			onCancel() {
				console.log('Cancel');
			},
		});

	}

	//换页
	pageChangeFun(pageNumber) {
		console.log('Page: ', pageNumber);
		this.setState({
			pageNow: pageNumber - 1
		});
		this.getAllOriDetail(this.state.searchValue, pageNumber - 1, this.state.pageSize);
	}
	pageSizeChangeFun(current, size) {
		this.setState({
			pageSize: size,
			pageNow: current - 1
		})
		this.getAllOriDetail("", current - 1, size);
	}
	//关闭弹出层
	handleCancel() {
		console.log("关闭");
		this.setState({
			visible: false,
		});
		if (this.state.editOrNew == "新加作者" || this.state.editOrNew == "") {
			this.getAllOriDetail("", this.state.pageNow, this.state.pageSize);
		} else if (this.state.editOrNew == "编辑作者") {
			this.getAllOriDetail(this.state.searchValue, this.state.pageNow, this.state.pageSize);
		}

	}

	//获取所有信息
	getAllOriDetail(searchAuthor, pageNow, pageSize) {
		var thisTrue = this;
		thisTrue.setState({
			loading: true
		})
		fetch(getUrl.url, {
			method: "POST",
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: "method=ella.operation.searchAuthorWithTypeAndName" + "&content=" + JSON.stringify({
				"authorType": "ORIGINAL_AUTHOR",
				"text": searchAuthor,
				"page": pageNow,
				"pageSize": pageSize
			})+dataString
		})
			.then(function (response) {
				console.log(response);
				return response.json();
			})
			.then(function (response) {
				console.log(response);
				if (response.status == 1) {
					console.log(response.data);
					var data = [];
					for (let i = 0; i < response.data.bookAuthorList.length; i++) {
						if (response.data.bookAuthorList[i].gender == "FEMALE") {
							response.data.bookAuthorList[i].gender = "女";
						} else if (response.data.bookAuthorList[i].gender == "MALE") {
							response.data.bookAuthorList[i].gender = "男";
						}
						/*2018-03-15 start*/
						data.push({
							authorCode: (response.data.bookAuthorList[i].authorCode == '' || response.data.bookAuthorList[i].authorCode == null) ? '-' : response.data.bookAuthorList[i].authorCode,
							authorName: (response.data.bookAuthorList[i].authorName == '' || response.data.bookAuthorList[i].authorName == null) ? '-' : response.data.bookAuthorList[i].authorName,
							countryName: (response.data.bookAuthorList[i].countryName == '' || response.data.bookAuthorList[i].countryName == null) ? '-' : response.data.bookAuthorList[i].countryName,
							gender: (response.data.bookAuthorList[i].gender == '' || response.data.bookAuthorList[i].gender == null) ? '-' : response.data.bookAuthorList[i].gender,
							introduction: (response.data.bookAuthorList[i].introduction == '' || response.data.bookAuthorList[i].introduction == null) ? '-' : response.data.bookAuthorList[i].introduction,
							mobile: (response.data.bookAuthorList[i].mobile == '' || response.data.bookAuthorList[i].mobile == null) ? '-' : response.data.bookAuthorList[i].mobile,
							updateTime: (response.data.bookAuthorList[i].updateTime == '' || response.data.bookAuthorList[i].updateTime == null) ? response.data.bookAuthorList[i].createTime : response.data.bookAuthorList[i].updateTime,
						})
						/*2018-03-15 end*/
					}
					// if (response.data.total <=20) {
					// 	document.getElementsByClassName("paixu")[0].style.opacity = "0";
					// }else{
					// 	document.getElementsByClassName("paixu")[0].style.opacity = "1";
					// }
					thisTrue.setState({
						loading: false,
						originalAuthorDetail: data,
						pageMax: response.data.total,
						pageLengthNow: response.data.bookAuthorList.length,
						pageNow
					})
				}
			})
	}

	//删除指定作者
	deleteOriAuthor(authorCode) {
		var thisTrue = this;
		fetch(getUrl.url, {
			method: "POST",
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: "method=ella.operation.delAuthorByAuthorCode" + "&content=" + JSON.stringify({
				"bookAuthor": {
					"authorCode": authorCode
				}
			})+dataString
		})
			.then(function (response) {
				console.log(response);
				return response.json();
			})
			.then(function (response) {
				console.log(response);
				if (response.status == 1) {
					thisTrue.success();
					thisTrue.getAllOriDetail("", thisTrue.state.pageNow, thisTrue.state.pageSize);
				} else if (response.status == 0) {
					thisTrue.warning(response.message);
				}
			})
	}
	warning(message) {
		Modal.warning({
			title: '警告',
			content: message,
		});
	}
	success() {
		Modal.success({
			title: '提示',
			content: "删除成功",
		});
	}

	render() {
		var thisTrue = this;
		var columns = [{
			title: '作者姓名',
			dataIndex: 'authorName',
			key: 'authorName',
			className:'td_hide',
		        render: (text, record) =>{
		            return(
		                <Popover
		                    placement="top"
		                    title={null}
		                    content={
		                        record.authorName
		                    }
		                >
		                    <span>{record.authorName}</span>
		                </Popover>
		            )
		        }
		},{
			title: '修改时间',
			dataIndex: 'updateTime',
			key: 'updateTime'
			
			
		}, {
			title: '操作',
			dataIndex: '',
			render(text, record, index) {
				return (
					<div>
						<span style={{ marginRight: '80px' }} className="i-action-ico i-edit" onClick={() => thisTrue.origEdit(record.authorCode, "编辑作者")}></span>
						<span className="i-action-ico i-delete" onClick={() => thisTrue.origDelete(record.authorCode)}></span>
					</div>
				)
			}
		}];
		return (
			<div className="originalAuthor">
				<Spin spinning={this.state.loading} size="large">
					<p className='title'>原著作者</p>
					<div className="originalAuthorTop">
						<div className="addoriginalAuthor" onClick={() => thisTrue.origEdit("", "新加作者")}></div>
						<Search
							placeholder="搜索"
							style={{ width: 400 }}
							enterButton
							onSearch={value => this.authorSearch(value)} />
					</div>
					<div className="originalAuthorTable">
						<Table className="t-nm-tab" dataSource={this.state.originalAuthorDetail} columns={columns} pagination={false} scroll={{ y: ((this.state.pageLengthNow > 16) ? 650 : 0) }} />
						<div className="paixu">
							<Pagination
								className="paixuIn"
								current={this.state.pageNow + 1}
								showSizeChanger
								pageSizeOptions={['20', '40', '60', '80', '100']}
								defaultPageSize={20}
								defaultCurrent={1}
								showTotal={total => `共 ${total} 条`}
								total={this.state.pageMax}
								onChange={this.pageChangeFun}
								showQuickJumper={true}
								onShowSizeChange={this.pageSizeChangeFun} />
						</div>
					</div>

					<Modal
						visible={thisTrue.state.visible}
						title={this.state.editOrNew}
						onCancel={thisTrue.handleCancel}
						footer={null}
						width={740}
					>
						{thisTrue.state.visible && <AuthorDetail handleCancel={() => this.handleCancel()} authorCode={this.state.authorCode} authorName={this.state.authorName} editOrNew={this.state.editOrNew}></AuthorDetail>}
					</Modal>

				</Spin>
			</div>
		);
	}
}
