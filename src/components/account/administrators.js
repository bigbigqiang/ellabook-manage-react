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
import commonData from '../commonData.js';
class admin extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			lists: [],
			searchContent: '',
			uid: localStorage.getItem("uid"),
			token: localStorage.getItem("token"),
			loading: false
		}
		this.changeFn = this.changeFn.bind(this);
	}

	fetchFn = async () => {
		this.setState({
			loading: true
		})
		var doc = {
			searchContent: this.state.searchContent
		}
		var data = await fetch(util.url, {
			method: 'POST',
			headers: {
				"Content-type": "application/x-www-form-urlencoded"
			},
			mode: 'cors',
			body: "method=ella.operation.adminList" + "&content=" + JSON.stringify(doc) + commonData.dataString
		})
			.then(function (response) {
				return response.json();
			});

		this.setState({
			lists: data.data.list,
			total: data.data.total,
			loading: false
		});
	}
	searchFetchfn = (value) => {
	
		this.setState({
			searchContent: value
		}, () => {
			this.fetchFn();
		})
	}
	componentDidMount() {
		localStorage.setItem('current', 10);
		this.fetchFn();
	}
	changeFn = (pager) => {
		this.fetchFn(pager.current - 1);
	}

	currentOn = (n) => {
		localStorage.setItem('current', n)
	}

	render() {
		const columns = [{
			title: '员工姓名',
			width: '25%',
			dataIndex: 'userName'
		}, {
			title: '手机号',
			width: '25%',
			dataIndex: 'mobile'
		}, {
			title: '部门',
			width: '25%',
			dataIndex: 'departmentName'
		}, {
			title: '职位',
			width: '25%',
			dataIndex: 'positionName'
		}]

		const { selectedRowKeys, visible, confirmLoading, ModalText } = this.state

		const rowSelection = {
			selectedRowKeys,
			onChange: this.onSelectChange
		}
		const pagination = {
			total: this.state.total,
			showSizeChanger: false,
			pageSize: 10,
			onShowSizeChange(current, pageSize) {
				
			}
		}

		return (
			<div>
				<p className="m-title">管理员</p>
				<div className="m-rt-content">
					<div className='intervalBottom'><Search placeholder="输入搜索条件" enterButton onSearch={this.searchFetchfn} size="default" style={{ width: 400 }} /></div>
					<Spin tip="加载中..." spinning={this.state.loading} size="large" style={{ zIndex: 9999 }}>
						<Table columns={columns} dataSource={this.state.lists} bordered pagination={false} className="t-nm-tab" />
					</Spin>
				</div>
			</div>
		)
	}
}
export default admin