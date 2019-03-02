/**
 * Created by Administrator on 2017-10-25.
 */
import React from 'react'
import { Table, Icon, Button, Popconfirm, message, Input, Modal, Spin } from 'antd'
import { Link } from 'react-router'
const Search = Input.Search;
// require('babel-polyfill')
// require('es6-promise').polyfill()
import "./account.css";
// import "./authorization.css";
import "../../main.css";
import 'whatwg-fetch';
const util = require('../util.js');
import commonData from '../commonData.js';
class auth extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			lists: [],
			staffList: [],
			userName: [],
			popContent: '',
			pageSize: 10,
			minheight: '',
			uid: localStorage.getItem("uid"),
			token: localStorage.getItem("token"),
			loading: false,
			loading2: true,
			roleName:'',
		}
		this.changeFn = this.changeFn.bind(this);
		// this.changeListFn = this.changeListFn.bind(this);
	}

	fetchFn = async () => {
		this.setState({
			loading: true
		})
		var doc = {
			roleName: this.state.roleName
		}
		var data = await fetch(util.url, {
			method: 'POST',
			headers: {
				"Content-type": "application/x-www-form-urlencoded"
			},
			mode: 'cors',
			body: "method=ella.operation.findOperationPrivilegeList" + "&content=" + JSON.stringify(doc) + commonData.dataString
		})
			.then(function (response) {
				return response.json();
			});

		this.setState({
			lists: data.data,
			loading: false,
			loading2: false
		});
		if (data.data.length > 10) {
			this.setState({
				minheight: 590
			})
		} else {
			this.setState({
				minheight: ''
			})
		}
	}
	changeFn = (pager, roleCode) => {
		this.setState({
			currentPage: pager.current - 1
		})
		this.staffFetchFn(pager.current - 1, this.state.roleCode);
	}
	
	componentDidMount() {
		localStorage.setItem('current', 9);
		this.fetchFn();
	}

	deleteFn = async (roleCode) => {
		const dataSource = [...this.state.lists];
		var doc = {
			roleCode: roleCode
		}
		var data = await fetch(util.url, {
			method: 'POST',
			headers: {
				"Content-type": "application/x-www-form-urlencoded"
			},
			mode: 'cors',
			body: "method=ella.operation.deleteRole" + "&content=" + JSON.stringify(doc) + commonData.dataString
		})
			.then(function (response) {
				return response.json();
			});
		if (data.status == 1) {
			this.setState({ lists: dataSource.filter(item => item.code !== roleCode) });
			message.success(`删除成功！`);
			this.fetchFn(0);
		} else {
			message.error(`删除失败！`);
		}
	}
	onDelete = (roleCode) => {
		
		this.deleteFn(roleCode);
	}

	onStaffDelete = async (uid) => {
		const dataSource = [...this.state.staffList];

		var doc = {
			uid: uid
		}
		var data = await fetch(util.url, {
			method: 'POST',
			headers: {
				"Content-type": "application/x-www-form-urlencoded"
			},
			mode: 'cors',
			body: "method=ella.operation.deleteOperationUserRole" + "&content=" + JSON.stringify(doc) + commonData.dataString
		})
			.then(function (response) {
				return response.json();
			});
		if (data.status == 1) {
			this.setState({ staffList: dataSource.filter(item => item.uid !== uid) });
			message.success(`删除成功！`);
			// this.fetchFn();
		} else {
			message.error(`删除失败！`);
		}
	}

	currentOn = (n) => {
		localStorage.setItem('current', n)
	}

	staffFetchFn = async (page, roleCode) => {
		this.setState({
			loading: true
		})
		var doc = {
			roleCode: roleCode,
			page: page,
			pageSize: 5
		}
		var data = await fetch(util.url, {
			method: 'POST',
			headers: {
				"Content-type": "application/x-www-form-urlencoded"
			},
			mode: 'cors',
			body: "method=ella.operation.findUserListByRoleCode" + "&content=" + JSON.stringify(doc) + commonData.dataString
		})
			.then(function (response) {
				return response.json();
			})
		this.setState({
			staffList: data.data.list,
			popColumns: [{
				title: '姓名',
				width: '60%',
				dataIndex: 'userName',
				render: (text) => {
					return <p style={{ textAlign: 'center' }}>{text}</p>
				}
			}, {
				title: '操作',
				width: '40%',
				render: (text, record) => {
					return (
						<div>
							<Popconfirm title="确定删除吗?" onConfirm={() => this.onStaffDelete(record.uid)}>
								{/* <Icon type="delete" /> */}
								<span className='i-action-ico i-delete'></span>
							</Popconfirm>
						</div>
					)
				}
			}],
			popPagination: {
				total: data.data.total,
				showSizeChanger: false,
				pageSize: 5
			},
			loading: false,
		})
	}

	openModal = (roleCode, roleName) => {
		this.staffFetchFn(0, roleCode);
		this.setState({
			roleCode: roleCode,
			key: Math.random(),
			// roleName: roleName + '列表',
			modalVisible: true
		})
	}

	handleCancel = (e) => {
		this.setState({
			modalVisible: false,
		}, () => {
			this.fetchFn(0);
		});
	}
	 //搜索框
    authorizationSearch(value) {
    	
        this.setState({
            roleName: value
        },()=>{
			this.fetchFn()
		})
       
    }

	render() {
		const columns = [{
			title: '角色',
			width: '33.3%',
			dataIndex: 'roleName'
		}, {
			title: '员工数',
			width: '33.3%',
			dataIndex: 'userCount',
			render: (text, record, index) => {
				if (record.userCount != 0) {
					return (
						<span className='u-open-pop' onClick={() => this.openModal(record.roleCode, record.roleName)}>
							{record.userCount}
						</span>

					)
				} else {
					return (
						<span>{record.userCount}</span>
					)
				}

			}
		}, {
			title: '操作',
			width: '33.3%',
			dataIndex: 'operate',
			render: (text, record) => {
				var url = '/editAuthorization/' + record.roleCode + '/' + record.roleName;
				return (
					<div style={{ textAlign: 'center' }}>
						<Link to={url} target="_blank" style={{ paddingRight: '20px' }}><span className='i-action-ico i-edit' onClick={() => this.currentOn(9)}></span></Link>
						<Popconfirm title="确定删除吗?" onConfirm={() => this.onDelete(record.roleCode)}>
							<span className='i-action-ico i-delete'></span>
						</Popconfirm>
					</div>
				)
			}
		}];
		const pagination = {
			total: this.state.total,
			showSizeChanger: true,
			defaultPageSize: 10,
			showQuickJumper: true,
			onShowSizeChange(current, pageSize) {
			
			},
			onChange(current) {
		

			}
		}
		return (
			<div id="showPerson">
				<p className="m-title">权限管理</p>
				<div className="m-rt-content">
					<div className='intervalBottom'>
						<Link to="/editAuthorization/0/0" className='m-btn-add intervalRight'>
							<Button type="primary" className="u-btn-add"><Icon type="plus" />添加新角色</Button>
						</Link>
						<Search placeholder="输入搜索条件" enterButton size="default" style={{ width: 400 }} onSearch={value => this.authorizationSearch(value)} />
					</div>
					<Spin tip="加载中..." spinning={this.state.loading2} size="large" style={{ zIndex: 9999 }}>
						<Table columns={columns} dataSource={this.state.lists} bordered pagination={false} scroll={{ y: this.state.minheight }} className="t-nm-tab" />
					</Spin>
				</div>
				<div>
					<Modal
						key={this.state.key}
						title={this.state.roleName}
						visible={this.state.modalVisible}
						footer={null}
						onCancel={this.handleCancel}
						style={{ top: '30%' }}
					>
						<Spin tip="加载中..." spinning={this.state.loading} size="large" style={{ zIndex: 9999 }}>
							<Table
								columns={this.state.popColumns}
								dataSource={this.state.staffList}
								pagination={this.state.popPagination}
								onChange={this.changeFn}
								showHeader={true}
								size='default'
								className="t-nm-tab-modal" />
						</Spin>
					</Modal>
				</div>
			</div>
		)
	}
}
export default auth