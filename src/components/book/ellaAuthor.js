/*
 	created by NiePengfei at 2017/12/13
 		图书——动画书作者
 */

import React from 'react'
import { Table, Select, DatePicker, Button, Input, Spin, Pagination, Modal,Popover } from 'antd';
import "./ellaAuthor.css"
import getUrl from "../util.js"
import EllaAuthorDetail from "./ellaAuthorDetail.js"
import '../../main.css'
import { dataString } from '../commonData.js'
const { Option, OptGroup } = Select;
const Search = Input.Search;
const confirm = Modal.confirm;
export default class EllaAuthor extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			loading: true,
			showBooks: false,
			classifyName: "",
			ellaAuthorDetail: [],
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
	}

	//即将插入本组件时，开始请求数据，准备渲染
	componentWillMount() {
		this.getAllEllaDetail("", 0, 20);
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
		})
		// TODO:每次新的搜索都是从起始页开始的
		this.getAllEllaDetail(value, 0, this.state.pageSize);
	}
	//编辑
	ellaEdit(authorCode, oparate) {
		console.log(authorCode);
		this.setState({
			visible: true,
			editOrNew: oparate,
			authorCode: authorCode
		});
	}

	//换页
	pageChangeFun(pageNumber) {
		console.log('Page: ', pageNumber);
		this.setState({
			pageNow: pageNumber - 1
		})
		this.getAllEllaDetail("", pageNumber - 1, this.state.pageSize);
	}
	pageSizeChangeFun(current, size) {
		this.setState({
			pageSize: size,
			pageNow: current - 1
		})
		this.getAllEllaDetail("", current - 1, size);
	}
	//关闭弹出层
	handleCancel() {
		console.log("关闭");
		this.setState({
			visible: false,
		});
		if (this.state.editOrNew == "新加作者" || this.state.editOrNew == "") {
			this.getAllEllaDetail("", this.state.pageNow, this.state.pageSize);
		} else if (this.state.editOrNew == "编辑作者") {
			this.getAllEllaDetail(this.state.searchValue, this.state.pageNow, this.state.pageSize);
		}

	}

	//获取所有信息
	getAllEllaDetail(searchAuthor, pageNow, pageSize) {
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
				"authorType": "ELLA_AUTHOR",
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

					// if (response.data.total <=20) {
					// 	document.getElementsByClassName("paixu")[0].style.opacity = "0";
					// }else{
					// 	document.getElementsByClassName("paixu")[0].style.opacity = "1";
					// }
					/*2018-03-15 start*/
					var data = [];
					for (let i = 0; i < response.data.bookAuthorList.length; i++) {
						data.push({
							authorCode: (response.data.bookAuthorList[i].authorCode == '' || response.data.bookAuthorList[i].authorCode == null) ? '-' : response.data.bookAuthorList[i].authorCode,
							authorName: (response.data.bookAuthorList[i].authorName == '' || response.data.bookAuthorList[i].authorName == null) ? '-' : response.data.bookAuthorList[i].authorName,
							countryName: (response.data.bookAuthorList[i].countryName == '' || response.data.bookAuthorList[i].countryName == null) ? '-' : response.data.bookAuthorList[i].countryName,
							gender: (response.data.bookAuthorList[i].gender == '' || response.data.bookAuthorList[i].gender == null) ? '-' : response.data.bookAuthorList[i].gender,
							introduction: (response.data.bookAuthorList[i].introduction == '' || response.data.bookAuthorList[i].introduction == null) ? '-' : response.data.bookAuthorList[i].introduction,
							mobile: (response.data.bookAuthorList[i].mobile == '' || response.data.bookAuthorList[i].mobile == null) ? '-' : response.data.bookAuthorList[i].mobile,
							updateTime: (response.data.bookAuthorList[i].updateTime == '' || response.data.bookAuthorList[i].updateTime == null) ? response.data.bookAuthorList[i].createTime: response.data.bookAuthorList[i].updateTime,
						})
					}
					/*2018-03-15 end*/
					// TODO: 多加了pageNow;防止新的搜索维持老的pageNow
					thisTrue.setState({
						loading: false,
						ellaAuthorDetail: data,
						pageMax: response.data.total,
						pageLengthNow: response.data.bookAuthorList.length,
						pageNow
					})
				}
			})
	}

	//删除
	ellaDelete(authorCode) {
		console.log(authorCode);
		var thisTrue = this;
		confirm({
			title: '确定删除此作者吗?',
			content: '',
			okText: '确定',
			okType: 'danger',
			cancelText: '取消',
			onOk() {
				thisTrue.deleteEllaAuthor(authorCode);
			},
			onCancel() {
				console.log('Cancel');
			},
		});

	}

	//删除指定作者
	deleteEllaAuthor(authorCode) {
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
					thisTrue.getAllEllaDetail("", thisTrue.state.pageNow, thisTrue.state.pageSize);
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
		}, {
			title: '手机号',
			dataIndex: 'mobile',
			key: 'mobile',
		}, {
			title: '修改时间',
			dataIndex: 'updateTime',
			key: 'updateTime',
		}, {
			title: '操作',
			dataIndex: '',
			render(text, record, index) {
				return (
					<div>
						<span style={{ marginRight: '80px' }} className="i-action-ico i-edit" onClick={() => thisTrue.ellaEdit(record.authorCode, "编辑作者")}></span>
						<span className="i-action-ico i-delete" onClick={() => thisTrue.ellaDelete(record.authorCode)}></span>
					</div>
				)
			}
		}];
		return (
			<div className="ellaAuthor">
				<Spin spinning={this.state.loading} size="large">
					<p className='title'>动画书作者</p>
					<div className="ellaAuthorTop">
						<div className="addellaAuthor" onClick={() => thisTrue.ellaEdit("", "新加作者")}></div>
						<Search
							style={{ width: 400 }}
							placeholder="搜索"
							enterButton
							onSearch={value => this.authorSearch(value)} />
					</div>
					<div className="ellaAuthorTable">
						<Table className="t-nm-tab" dataSource={this.state.ellaAuthorDetail} columns={columns} pagination={false} scroll={{ y: ((this.state.pageLengthNow > 16) ? 600 : 0) }} />
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
						width={467}
					>
						{thisTrue.state.visible && <EllaAuthorDetail handleCancel={() => this.handleCancel()} authorCode={this.state.authorCode} authorName={this.state.authorName} editOrNew={this.state.editOrNew}></EllaAuthorDetail>}
					</Modal>

				</Spin>
			</div>
		);
	}
}
