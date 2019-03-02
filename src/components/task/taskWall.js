import React from 'react'
import { Table, Select, Tabs, DatePicker, Button, Input, Icon, Spin, Popover, Popconfirm, message, Modal, Tooltip } from 'antd';
import { Link } from 'react-router';
import "./taskWall.css"
import getUrl from "../util.js"
import moment from 'moment';
const { Option } = Select;
const Search = Input.Search;
const confirm = Modal.confirm;
const TabPane = Tabs.TabPane;
export default class TaskWall extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			loading: false,
			searchType: "",
			// beginTime:'',
			// endTime:'',
			searchFlag: false,
			selectDU: "down",
			taskWallName: '',//任务墙搜索名
			showStatus: '',
			activeKey: "SHELVES_ON",
			taskWallList: [],//已展示任务墙列表
		}
	}
	componentDidMount() {
		this.getTaskWallList('');
	}
	//获取反馈列表的数据
	getTaskWallList(taskWallName) {
		this.setState({
			loading: true,
		});
		var doc = {
			taskWallName,
			showStatus: this.state.showStatus,
			shelvesFlag: this.state.activeKey
		}
		getUrl.API(doc, "ella.operation.getOperationTaskWallList")
			.then(response => response.json())
			.then(response => {
				if (response.status == 1) {

					this.setState({
						taskWallList: response.data,
						loading: false,
					})

				} else {
					message.error(response.message)
				}
			})

	}
	//点击查询按钮查询
	searchTaskWallList() {

		this.setState({
			loading: true,
		});
		var doc = {
			showStatus: this.state.showStatus,
			shelvesFlag: this.state.activeKey,
			// beginTime:this.state.beginTime,
			// endTime:this.state.endTime,
			// searchType:"categorySearch",
		}
		getUrl.API(doc, "ella.operation.getOperationTaskWallList")
			.then(response => response.json())
			.then(response => {
				if (response.status == 1) {

					this.setState({
						taskWallList: response.data,
						loading: false,
					})

				} else {
					message.error(response.message)
				}
			})

	}
	onDelete = (taskWallCode, shelvesFlag) => {
		if (getUrl.operationTypeCheck('DELETE')) {
			if (shelvesFlag == "SHELVES_ON") {
				message.error('该任务列表正在任务墙中展示，请下线后重新操作！');
				return;
			}
			this.fetchDeleteModule(taskWallCode);
		} else {
			message.error('您没有权限删除该数据！');
		}
	}
	//判断有没编辑权限
	isUPDAT() {
		if (!getUrl.operationTypeCheck("UPDAT")) {
			message.error("抱歉没有权限,请联系管理员或者切换账号")
		}
	}
	//删除模块
	fetchDeleteModule(taskWallCode) {
		let params = {
			taskWallCode,
		}
		getUrl.API(params, "ella.operation.deleteOperationTaskWall")
			.then(response => response.json())
			.then(response => {
				if (response.status == 1) {
					message.success("删除成功!");
					this.getTaskWallList(this.state.taskWallName)
				} else {
					message.error("删除失败！")
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
	changeType(name, value) {
		console.log(value)
		this.setState({
			[name]: value
		})
	}
	//恢复默认设置
	clearSelect() {
		this.setState({
			showStatus: '',
			// beginTime:'',
			// endTime:''
		})

	}
	arrowUp = (n) => {
		if (getUrl.operationTypeCheck('UPDAT')) {
			if (n == 0) {
				message.error(`不可向上移！`);
			} else {
				var lists = this.state.taskWallList;
				var doc = {
					moveInModuleCode: lists[n - 1].taskWallCode,
					moveInResult: lists[n].idx,
					moveOutModuleCode: lists[n].taskWallCode,
					moveOutResult: lists[n - 1].idx,
				}
				this.arrowFetchFn(doc);
			}
		} else {
			message.error('您没有权限操作该数据！');
		}
	}

	arrowDown = (n) => {
		if (getUrl.operationTypeCheck('UPDAT')) {
			if (n == this.state.taskWallList.length - 1) {
				message.error(`不可向下移！`);
			} else {
				var lists = this.state.taskWallList;
				var doc = {
					moveInModuleCode: lists[n].taskWallCode,
					moveInResult: lists[n + 1].idx,
					moveOutModuleCode: lists[n + 1].taskWallCode,
					moveOutResult: lists[n].idx,


				}
				this.arrowFetchFn(doc);
			}
		} else {
			message.error('您没有权限操作该数据！');
		}

	}
	arrowFetchFn(doc) {
		this.setState({
			loading: true
		})
		getUrl.API(doc, "ella.operation.taskWallMove")
			.then(response => response.json())
			.then(response => {
				if (response.status == 1) {
					message.success("操作成功!");
					this.setState({

						taskWallList: response.data,
						loading: false
					})
				} else {
					message.error(response.message)
				}
			})

	}
	arrowStick(moveTopModuleCode, moveTopModuleIdx) {

		this.setState({ loading: true });
		var doc = {
			moveTopModuleCode,
			moveTopModuleIdx
		}
		getUrl.API(doc, "ella.operation.taskWallTop")
			.then(response => response.json())
			.then(response => {
				if (response.status == 1) {
					message.success("操作成功!");
					this.setState({
						taskWallList: response.data,
						loading: false
					})
				} else {
					message.error("操作失败！")
				}
			})

	}
	changeTabs = (activeKey) => {

		this.setState({
			activeKey: activeKey
		}, () => {
			this.getTaskWallList(this.state.taskWallName)
		});

	}

	onTimeChange(value, dateString, type) {
		this.setState({
			[type]: dateString,
		});
	}
	//上下架
	updateTaskWallShelve(taskWallCode, shelvesFlag) {
		if (shelvesFlag == "SHELVES_ON") {
			shelvesFlag = "SHELVES_OFF"
		} else {
			shelvesFlag = "SHELVES_ON"
		}
		let params = {
			taskWallCode,
			shelvesFlag
		}
		getUrl.API(params, "ella.operation.updateTaskWallShelves")
			.then(response => response.json())
			.then(response => {
				if (response.status == 1) {
					message.success("操作成功!");
					this.getTaskWallList(this.state.taskWallName)
				} else {
					message.error("操作失败！")
				}
			})
	}
	//发布
	showConfirm = () => {
		var w = this;
		confirm({
			title: '请确认是否发布该模块?',
			okType: 'primary',
			cancelText: '继续编辑',
			onOk() {
				w.release();
			}
		});
	}
	release() {
		getUrl.API({}, "ella.operation.publishTaskWall")
			.then(response => response.json())
			.then(response => {
				if (response.status == 1) {
					message.success("发布成功!");
					this.getTaskWallList(this.state.taskWallName)
				} else {
					message.error(response.message)
				}
			})
	}
	render() {
		console.log(this)
		var that = this;

		let br = <br></br>
		const columns = [
			{
				title: '序号',
				dataIndex: 'id',
				key: 'id',
				colSpan: that.state.activeKey == "SHELVES_ON" ? 1 : 0,
				width: 11 + "%",
				render: (text, record) => {
					const obj = {
						children: text,
						props: {}
					}
					const element = (
						<span>{record.id}</span>
					)
					obj.props.colSpan = 0;
					return that.state.activeKey == "SHELVES_ON" ? element : obj;
				}

			},
			{
				title: '列表名称',
				width: 100,
				dataIndex: 'taskWallName',
				key: 'taskWallName',
				className: 'td_hide',
				render: (taskWallName) => {
					return (
						<Popover
							placement="top"
							title={null}
							content={
								taskWallName
							}
						>
							<span>{taskWallName}</span>
						</Popover>
					)
				}
			},
			// {
			// 	title: '修改时间',
			// 	dataIndex: 'updateTime',
			// 	key: 'updateTime',
			// 	width: 10 + "%",
			// 	render: (text,record) =>{
			// 		return <span>{record.updateTime==null?record.createTime:record.updateTime}</span>
			// 	}
			// }, 
			{
				title: ({ sortOrder, filters }) => <Tooltip title={() => {
					return <div>
						<span>已展示：已发布在客户端中展示;</span><br />
						<span>未展示：未在客户端中发布展示;</span><br />
						<span>待展示：在客户端中展示后修改未发布，点击发布后恢复至已展示状态;</span>
						
					</div>
				}}>
					<div><span style={{ display: "inline-block", "verticalAlign": "middle" }}>展示状态</span><Icon type="question-circle" style={{ display: "inline-block", "verticalAlign": "middle", "marginLeft": "5px" }} /></div>
				</Tooltip>,
				width: 100,
				dataIndex: 'showStatus',
				render: (showStatus) => {
					return <span>{showStatus == "SHOW_ON" ? "已展示" : showStatus == "SHOW_OFF" ? "未展示" : showStatus == "SHOW_WAIT" ? "待展示" : "-"}</span>
				}
			},
			{
				title: '任务数量',
				dataIndex: 'taskNum',
				key: 'taskNum',
				width: 10 + "%"
			},
			{
				title: '操作',
				dataIndex: '',
				width: 13 + "%",
				render(text, record) {
					let url = '/addTaskWall/edit/' + record.taskWallCode;
					return (
						<div style={{ textAlign: 'center' }} className='m-icon-type'>
							<Link to={url} style={{ marginRight: '20px' }}><span className='i-action-ico i-edit'></span></Link>
							{
								that.state.activeKey == "SHELVES_ON" && <span style={{ marginRight: '20px' }} className='i-action-ico i-stick' onClick={() => that.arrowStick(record.taskWallCode, record.idx)}></span>
							}
							{
								that.state.activeKey == "SHELVES_ON" && <span style={{ marginRight: '20px' }} className='i-action-ico i-up' onClick={() => that.arrowUp(record.id - 1)}></span>
							}
							{
								that.state.activeKey == "SHELVES_ON" && <span className='i-action-ico i-down' style={{ marginRight: '20px' }} onClick={() => that.arrowDown(record.id - 1)}></span>
							}
							{
								that.state.activeKey != "SHELVES_ON" && <Popconfirm title="请确认是否删除该任务列表" onConfirm={() => that.onDelete(record.taskWallCode, record.shelvesFlag)}>
									<span className='i-action-ico i-delete'></span>
								</Popconfirm>
							}
						</div>
					)
				}
			},
			{
				title: '状态操作',
				width: 100,
				dataIndex: 'shelvesFlag',
				render: (text, record) => {
					// if (record.shelvesFlag == 'SHELVES_ON') {
					// 	return (
					// 		<Popconfirm title="确定下线吗?" onConfirm={() => this.UpDownOpera(record.bannerCode,"SHELVES_OFF")}>
					// 			<span style={{"color":"#40a9ff","cursor":"pointer","fontWeight":"bold"}}>下线</span>
					// 		</Popconfirm>

					// 	)
					// } else {
					// 	return (
					// 		<Popconfirm title="确定上线吗?" onConfirm={() => this.UpDownOpera(record.bannerCode,"SHELVES_ON")}>
					// 			<span style={{"color":"#40a9ff","cursor":"pointer","fontWeight":"bold"}}>上线</span>
					// 		</Popconfirm>

					// 	)
					// }
					return <Popconfirm title={record.shelvesFlag == "SHELVES_ON" ? "确定下线吗?" : "确定上线吗?"}
						onConfirm={() => that.updateTaskWallShelve(record.taskWallCode, record.shelvesFlag)}
					>
						<a>{record.shelvesFlag == "SHELVES_ON" ? "下线" : record.shelvesFlag == "SHELVES_OFF" ? "上线" : "-"}</a>
					</Popconfirm>
				}
			}
		];
		return (
			<div className="feedBackAll">
				<Spin spinning={this.state.loading} size="large">
					<div className="feedBackAllTitle">
						用户任务墙管理
					</div>

					<div className="g-feedSerchTiy">
						<Link to="/addTaskWall/add/0" className='m-btn-add intervalRight'><Button type="primary" className="u-btn-add"><Icon type="plus" />添加新的任务列表</Button></Link>
						<Search placeholder="搜索" enterButton className="searchWidth intervalRight"
							onSearch={(value) => {
								this.getTaskWallList(value);
								this.changeType("taskWallName", value)
							}}
						/>
						<div className="setSelect" onClick={() => this.selectSet()}>更多条件 <Icon type={this.state.selectDU} /></div>
					</div>


					<div style={{ "marginTop": "20px", "marginLeft": "20px", "display": this.state.searchFlag ? "block" : "none" }}>
						{/* <div className="part">
							<span className="u-txt">修改时间:</span>
							<DatePicker
								showTime
								format="YYYY-MM-DD HH:mm:ss"
								placeholder="开始时间"
								onChange={(value, dateString) => this.onTimeChange(value, dateString,"beginTime")}
								style={{ width: 180 }}
								
								value={this.state.beginTime != '' ? moment(this.state.beginTime, 'YYYY-MM-DD HH:mm:ss') : null}
							/>
							<i> — </i>
							<DatePicker
								showTime
								format="YYYY-MM-DD HH:mm:ss"
								placeholder="结束时间"
								onChange={(value, dateString) => this.onTimeChange(value, dateString,"endTime")}
								value={this.state.endTime != '' ? moment(this.state.endTime, 'YYYY-MM-DD HH:mm:ss') : null}
								style={{ width: 180 }}
								
							/>
						</div> */}
						<div className="part">
							<span className="u-txt">展示状态:</span>
							<Select value={this.state.showStatus} style={{ width: 130 }} onChange={(value) => this.changeType("showStatus", value)}>
								<Option value="">全部</Option>
								<Option value={"SHOW_OFF"}>未展示</Option>
								<Option value={"SHOW_WAIT"}>待展示</Option>
								<Option value={"SHOW_ON"}>已展示</Option>

							</Select>
						</div>
						<div className="intervalBottom">
							<Button className="u-btn-green intervalRight" onClick={() => { this.searchTaskWallList() }}>查询</Button>
							<Button className="block u-btn-green buttonWidth" onClick={() => this.clearSelect()}>恢复默认</Button>
						</div>
					</div>
					<Tabs defaultActiveKey="SHELVES_ON" onChange={this.changeTabs} style={{ width: "100%" }}>
						<TabPane tab={<span>已上线列表</span>} key="SHELVES_ON">
							<div className="g-feedTable">
								<Table className="t-nm-tab" dataSource={this.state.taskWallList} columns={columns} pagination={false} scroll={{ y: ((this.state.taskWallList.length > 10) ? 625 : 0) }} />
							</div>
						</TabPane>
						<TabPane tab={<span>全部列表</span>} key="">
							<div className="g-feedTable">
								<Table className="t-nm-tab" dataSource={this.state.taskWallList} columns={columns} pagination={false} scroll={{ y: ((this.state.taskWallList.length > 10) ? 625 : 0) }} />
							</div>
						</TabPane>
					</Tabs>
					{
						this.state.activeKey == "SHELVES_ON" && <p style={{ marginTop: 10, textAlign: 'center' }}>
							<Button type='primary' onClick={() => { this.showConfirm() }}>发布</Button>
						</p>
					}
				</Spin>
			</div>
		);
	}
}
