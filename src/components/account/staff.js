/**
 * Created by Administrator on 2017-10-25.
 */
import React from 'react'
import { Table, Icon, Button, Popconfirm, message, Input, Spin } from 'antd'
import { Link } from 'react-router'
const Search = Input.Search;
// require('babel-polyfill')
// require('es6-promise').polyfill()

import 'whatwg-fetch'
const util = require('../util.js');
import commonData from '../commonData.js'
const uid = localStorage.getItem('uid')
class staff extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			lists: [],
			searchContent: '',
			currentPage: 0,
			pageSize: 10,
			minheight: '',
			uid: localStorage.getItem("uid"),
			token: localStorage.getItem("token"),
			loading: false
		}
		this.changeFn = this.changeFn.bind(this);
	}

	fetchFn = async (page, pageSize) => {
		this.setState({
			loading: true
		})
		var doc = {
			page: page,
			pageSize: pageSize,
			searchContent: this.state.searchContent
		}
		var data = await fetch(util.url, {
			method: 'POST',
			headers: {
				"Content-type": "application/x-www-form-urlencoded"
			},
			mode: 'cors',
			body: "method=ella.operation.operationUserManageList" + "&content=" + JSON.stringify(doc)  + commonData.dataString
		})
			.then(function (response) {
				return response.json();
			});

		this.setState({
			lists: data.data.list,
			total: data.data.total,
			loading: false
		});
		if (data.data.total > 10) {
			this.setState({
				minheight: 510
			})
		} else {
			this.setState({
				minheight: ''
			})
		}
	}

	componentDidMount() {
		// localStorage.setItem('current',8);
		this.fetchFn(0, 10);
	}
	changeFn = (pager) => {
		console.log('current11:' + pager.current);
		this.setState({
			currentPage: pager.current - 1,
			pageSize: pager.pageSize
		}, () => {
			this.fetchFn(this.state.currentPage, this.state.pageSize);
		})

	}

	deleteFn = async (adminUid, staffUid, name) => {
		const dataSource = [...this.state.lists];
		var doc = {
			uid: adminUid,
			staffUid: staffUid,
			name: name
		}
		var data = await fetch(util.url, {
			method: 'POST',
			headers: {
				"Content-type": "application/x-www-form-urlencoded"
			},
			mode: 'cors',
			body: "method=ella.operation.deleteOperationUser" + "&content=" + JSON.stringify(doc)  + commonData.dataString
		})
			.then(function (response) {
				return response.json();
			});
		if (data.status == 1) {
			this.setState({ lists: dataSource.filter(item => item.uid !== staffUid) });
			message.success(`删除成功！`);
			this.fetchFn(this.state.currentPage);
		} else {
			message.error(`删除失败！`);
		}
	}
	onDelete = (adminUid, staffUid, name) => {
		this.deleteFn(adminUid, staffUid, name);
	}

	searchFetchfn = (value) => {
		console.log('value:' + value);
		this.setState({
			searchContent: value
		}, () => {
			this.fetchFn(0, 10);
		})
	}

	currentOn = (n) => {
		localStorage.setItem('current', n)
	}

	render() {
		const columns = [{
			title: '员工姓名',
			width: '12.5%',
			dataIndex: 'userName'
		}, {
			title: '手机号',
			width: '12.5%',
			dataIndex: 'mobile'
		}, {
			title: '部门',
			width: '12.5%',
			dataIndex: 'departmentName'
		}, {
			title: '职位',
			width: '12.5%',
			dataIndex: 'positionName'
		}, {
			title: '角色',
			width: '12.5%',
			dataIndex: 'roleName'
		}, {
			title: '状态',
			width: '12.5%',
			render: (text, record) => {
				return (
					<span>{record.status == 'NORMAL' ? '在职' : '离职'}</span>
				)
			}
		}, {
			title: '操作',
			width: '25%',
			dataIndex: 'operate',
			render: (text, record) => {
				let url = '/editStaff/' + record.uid;
				return (
					<div style={{ textAlign: 'center' }}>
						<Link to={url} target="_blank" style={{ paddingRight: '20px' }}><span className='i-action-ico i-edit' onClick={() => this.currentOn(8)}></span></Link>
						<Popconfirm title="确定删除吗?" onConfirm={() => this.onDelete(uid, record.uid, record.userName)}>
							<span className='i-action-ico i-delete'></span>
						</Popconfirm>
					</div>
				)
			}
		}]

		const { selectedRowKeys, visible, confirmLoading, ModalText } = this.state

		const rowSelection = {
			selectedRowKeys,
			onChange: this.onSelectChange
		}

		// console.log(getFieldDecorator);
		const pagination = {
			total: this.state.total,
			showSizeChanger: true,
			showQuickJumper: true,
			defaultPageSize: 10,
			onShowSizeChange(current, pageSize) {
				console.log('Current: ', current, '; PageSize: ', pageSize)
			},
			onChange(current) {
				console.log('Current: ', current);

			}
		}

		return (
			<div>
				<p className="m-title">员工管理</p>
				<div className="m-rt-content">
					<div className='intervalBottom'>
						<Link to="/editStaff/0" className='m-btn-add intervalRight'>
							<Button type="primary" className="u-btn-add"><Icon type="plus" />添加新员工</Button>
						</Link>
						<Search placeholder="输入搜索条件" enterButton onSearch={this.searchFetchfn} size="default" style={{ width: 400 }} />
						
					</div>
					<Spin tip="加载中..." spinning={this.state.loading} size="large" style={{ zIndex: 9999 }}>
						<Table columns={columns} dataSource={this.state.lists} bordered pagination={pagination} onChange={this.changeFn} scroll={{ y: this.state.minheight }} className="t-nm-tab" />
					</Spin>
				</div>
			</div>
		)
	}
}
export default staff