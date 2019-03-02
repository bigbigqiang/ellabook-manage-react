/*
 	created by NiePengfei at 2018/3/19
 	出版社
 */

import React from 'react'
import { Table, Pagination, Select, DatePicker, Button, Input, Spin, Icon, Modal, message,Popover } from 'antd';
import { Link } from 'react-router';
import "./publish.css"
import getUrl from "../util.js"
import commonData from '../commonData.js'
import AddPublish from "./addPublish.js"

const { Option, OptGroup } = Select;
const Search = Input.Search;
const confirm = Modal.confirm;

export default class Publish extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			loading: true,
			loading2: true,
			allCommentDetail: [],
			pageNow: 0,
			pageSize: 20,
			pageMax: 0,

			commentType: "",
			commentScore: "",
			startTime: "",
			endTime: "",
			searchText: "",
			isSelected: "",

			addRemark: false,
			pageLengthNow: 0,
			searchFlag: false,
			selectDU: "down",
			pageLengthNow: 0,

			visible: false,
			goodRemark: "",

			startValue: "",
			endValue: "",

			selectedRowKeys: [],

			loading2: false,




			allPublishList: [],	//所有出版社信息列表
			pageShow: true,		//是否显示分页
			searchType: "publishName",		//搜索的类型
			searchContent: null, //搜索的详情
			operateState: "",	//编辑、新增
			editData: '',
			addFlag: false,


		}
		this.handleChange3 = this.handleChange3.bind(this);
		this.pageChangeFun = this.pageChangeFun.bind(this);
		this.pageSizeChangeFun = this.pageSizeChangeFun.bind(this);
		this.handleCancel = this.handleCancel.bind(this);
	}

	//即将插入本组件时，开始请求数据，准备渲染
	componentWillMount() {
		this.getAllPublish(0, 20, this.state.searchType);
	}

	//虚拟dom变成真实dom之后，开始绑定事件
	componentDidMount() {
		var thisTrue = this;
		this.setState({
			loading: false
		})

	}

	//搜索字段的回调函数
	handleChange3(value) {
		this.setState({
			searchType: value
		})
	}

	pageChangeFun(pageNumber) {
		this.setState({
			pageNow: pageNumber - 1
		})
		this.getAllPublish(pageNumber - 1, this.state.pageSize, this.state.searchType);

	}
	pageSizeChangeFun(current, size) {
		this.setState({
			pageSize: size,
			pageNow: current - 1
		})
		this.getAllPublish(current - 1, size, this.state.searchType);
	}



	//关闭弹出层
	handleCancel() {
		this.setState({
			visible: false,
			addFlag: false
		})
		this.getAllPublish(this.state.pageNow, this.state.pageSize, this.state.searchType);
	}

	//获取出版社的数据
	getAllPublish(pageNow, pageSize, searchType) {
		var thisTrue = this;
		this.setState({
			loading: true,
		});
		let content;
		if (searchType == "publishName") {
			content = {
				"publishName": thisTrue.state.searchContent,
				"pageVo": {
					"page": pageNow,
					"pageSize": pageSize
				}
			}
		} else if (searchType == "mobile") {
			content = {
				"mobile": thisTrue.state.searchContent,
				"pageVo": {
					"page": pageNow,
					"pageSize": pageSize
				}
			}
		} else if (searchType == "pressName") {
			content = {
				"pressName": thisTrue.state.searchContent,
				"pageVo": {
					"page": pageNow,
					"pageSize": pageSize
				}
			}
		}

		fetch(getUrl.url, {
			method: "POST",
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: "method=ella.operation.listPublish" + "&content=" + JSON.stringify(content) + commonData.dataString
		})
			.then(function (response) {
				return response.json();
			})
			.then(function (response) {
				if (response.status == 1) {

					let newArr = response.data.publishList.map(function (item) {
						if (item.basePressList != null && item.basePressList != [] && item.basePressList != '') {
							item.newBasePress = item.basePressList[0].pressName;
						} else {
							item.newBasePress = "-";
						}
						return item
					})

					let pageFlag = response.data.totalPage == 1 ? false : true;
					thisTrue.setState({
						allPublishList: newArr,
						loading: false,
						pageMax: response.data.total,
						pageLengthNow: response.data.publishList.length,
						pageShow: pageFlag
					})
				}
			})
	}
	//设置更多搜索条件的
	selectSet() {

	}
	//精确检索
	jingClick() {
		this.getAllPublish(0, this.state.pageSize, this.state.searchType);
	}
	handleChange6(e) {
		this.setState({
			searchContent: e.target.value
		})
	}


	exportFn() {
		var thisTrue = this;
		let content;
		if (this.state.searchType == "publishName") {
			content = {
				"publishName": thisTrue.state.searchContent,
			}
		} else if (this.state.searchType == "mobile") {
			content = {
				"mobile": thisTrue.state.searchContent,
			}
		} else if (this.state.searchType == "pressName") {
			content = {
				"pressName": thisTrue.state.searchContent,
			}
		}
		fetch(getUrl.url, {
			method: "POST",
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: "method=ella.operation.listPublishExcel" + "&content=" + JSON.stringify(content) + commonData.dataString
		})
			.then(function (response) {
				return response.json();
			})
			.then(function (response) {
				if (response.status == 1) {

				}
			})
	}
	//编辑、新增
	publishEditOrAdd(code, type) {
		var thisTrue = this;
		this.setState({
			operateState: type,
			visible: true,
		})
		if (type == "编辑出版社") {
			this.setState({
				loading2: true
			})
			fetch(getUrl.url, {
				method: "POST",
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				body: "method=ella.operation.getPublishByCode" + "&content=" + JSON.stringify({
					"publishCode": code
				}) + commonData.dataString
			})
				.then(function (response) {
					return response.json();
				})
				.then(function (response) {
					if (response.status == 1) {
						thisTrue.setState({
							editData: response.data
						}, () => {
							thisTrue.setState({
								loading2: false,
								addFlag: true
							})
						})
					} else {
						thisTrue.setState({
							loading2: false
						})
					}
				})
		} else {
			thisTrue.setState({
				editData: {}
			}, () => {
				thisTrue.setState({
					loading2: false,
					addFlag: true
				})
			})
		}
	}

	searchContent(name, value) {
		this.setState({
			[name]: value
		}, () => {
			this.getAllPublish(0, this.state.pageSize, this.state.searchType);
		})
	}

	exportList() {
        this.exportFn();
    }

	render() {
		var thisTrue = this;
		var columns = [{
			title: '出版社',
			dataIndex: 'publishName',
			key: 'publishName',
			width: 20 + "%",
			className: "td_hide",
	        render: (text, record) =>{
	            return(
	                <Popover
	                    placement="top"
	                    title={null}
	                    content={
	                        record.publishName
	                    }
	                >
	                    <span>{record.publishName}</span>
	                </Popover>
	            )
	        }
		}, {
			title: '展示名称',
			dataIndex: 'newBasePress',
			key: 'newBasePress',
			width: 20 + "%",
			className: "td_hide",
			render(text, record) {
				return (
					<Popover
		                    placement="top"
		                    title={null}
		                    content={
		                        record.newBasePress
		                    }
		                >
						<div className="theNames">
							<p>
								{record.newBasePress}
								{record.newBasePress != '-' ? <div className="moreName">
									{
										record.basePressList.map(function (item) {
											return <div>{item.pressName}</div>
										})
									}
								</div> : null}
							</p>
						</div>
					</Popover>
				)
			}
		}, {
			title: '手机号',
			dataIndex: 'mobile',
			key: 'mobile',
			width: 15 + "%"
		}, {
			title: '买书分成',
			dataIndex: 'buyBookPercent',
			key: 'buyBookPercent',
			width: 10 + "%"
		}, {
			title: '租书分成',
			dataIndex: 'rentBookPercent',
			key: 'rentBookPercent',
			width: 10 + "%"
		}, {
			title: '图书',
			dataIndex: 'bookCount',
			key: 'bookCount',
			width: 10 + "%",
			render(text, record) {
				return (
					<Link to={"/publishBook?publishUid=" + record.uid + ""}>
						{record.bookCount}
					</Link>
				)
			}
		}, {
			title: '操作',
			dataIndex: '',
			width: 15 + "%",
			render(text, record, index) {
				return (
					<div className="publishOpate">
						<span onClick={() => thisTrue.publishEditOrAdd(record.publishCode, "编辑出版社")}>编辑</span>
					</div>
				)
			}
		}];

		return (
			<div className="publishAll">
				<Spin spinning={this.state.loading} size="large">
					<div className="publishAllTitle">
						出版社
					</div>
					<div className="g-pubSerchTiy">
						<Link to="/home/addBannerPic/0" className='m-btn-add intervalRight'>
							<Button type="primary" className="u-btn-add buttonWidth" onClick={() => this.publishEditOrAdd("", "新增出版社")}><Icon type="plus" />新增出版社</Button>
						</Link>
						<Select defaultValue="publishName" className="selectWidth intervalRight" onChange={this.handleChange3}>
							<Option value="publishName">出版社名称</Option>
							<Option value="mobile">手机号</Option>
							<Option value="pressName">展示名称</Option>
						</Select>
					
						<Search placeholder="输入检索内容" enterButton className="searchWidth intervalRight" onSearch={(value) => { this.searchContent("searchContent", value) }} />
					
						
						<Button className="block u-btn-green buttonWidth" onClick={() => this.exportList()}>导出</Button>
					</div>

					<div className="g-publishTable">
						<Table className="t-nm-tab" loading={this.state.loading2} dataSource={this.state.allPublishList} columns={columns} pagination={false} scroll={{ y: ((this.state.pageLengthNow > 14) ? 615 : 0) }} />
						<div className="paixu">
							<Pagination className="paixuIn" hideOnSinglePage={this.state.pageShow} current={this.state.pageNow + 1} showSizeChanger pageSizeOptions={['20', '40', '60', '80', '100']} defaultPageSize={20} defaultCurrent={1} showTotal={total => `共 ${total} 条`} total={this.state.pageMax} onChange={this.pageChangeFun} showQuickJumper={true} onShowSizeChange={this.pageSizeChangeFun} />
						</div>
					</div>

					<Modal
						visible={thisTrue.state.visible}
						title={thisTrue.state.operateState}
						onCancel={thisTrue.handleCancel}
						footer={null}
						width={1000}
					>
						{
							thisTrue.state.addFlag == true ? <AddPublish operateState={this.state.operateState} handleCancel={this.handleCancel} data={thisTrue.state.editData}></AddPublish> : ''
						}
					</Modal>
				</Spin>
			</div>
		);
	}
}
