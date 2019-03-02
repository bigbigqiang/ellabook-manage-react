/**
 * Created by Administrator on 2017-10-25.
 */
import React from 'react'
import { Table, Icon, Button, Popconfirm, message, Modal, Select, Checkbox, DatePicker, Spin,Tabs,Popover } from 'antd'
import { Link } from 'react-router'
import moment from 'moment'
const confirm = Modal.confirm;
const TabPane = Tabs.TabPane;
import Preview from './preview.js';
import Preview2 from './preview2.js';
import Preview3 from './preview3.js';
import 'whatwg-fetch'
import "./lai.css"
import commonData from '../commonData.js'
const Option = Select.Option;
var util = require('../util.js');

class homeSort extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			lists: [],
			selectedRowKeys: [],
			value: this.props.value,
			visible: false,
			visible2: false,
			visible3: false,
			visibleGUSHIJI:false,
			visibleHD:false,
			confirmLoading: false,
			confirmLoading2: false,
			selectList: [],
			selectList2: [],
			columnCode: '',
			moduleName: '',
			columnCode2: '',

			moduleName2: '',
			minheight: '',
			operationType: localStorage.getItem('operationType'),
			checked: false,
			nextPublishDate: '',
			loading: false,
			previewData: {},
			activeKey:'APP',
			times:"00:00"
		}
	}
	disabledDate = (current) => {
		return current < moment();
	}

	fetchFn = async (activeKey) => {
		this.setState({
			loading: true
		});
		var data = await fetch(util.url, {
			method: 'POST',
			headers: {
				"Content-type": "application/x-www-form-urlencoded"
			},
			mode: 'cors',
			body: "method=ella.operation.findHomePageList"+"&content=" +JSON.stringify({"platformCode":activeKey})+ commonData.dataString
		})
			.then(function (response) {
				return response.json();
			});
		
		this.setState({
			loading: false,
			lists: data.data.list,
			publishTime: data.data.publishTime,
			nextPublishDate: !!data.data.nextPublishTime?data.data.nextPublishTime.split(" ")[0]:'',
			times: !!data.data.nextPublishTime?data.data.nextPublishTime.split(" ")[1]:'00:00',
			checked: data.data.nextPublishTime == '' ? false : true
		}, () => {
		
			if (data.data.list.length > 12) {
				this.setState({
					minheight: 510
				})
			} else {
				this.setState({
					minheight: ''
				})
			}
		});
	}

	// operationTypeClick(list,type){
	// 	var list = localStorage.getItem('operationType');
	// 	if(list.indexOf(type)!=-1){
	// 		return true;
	// 	}else{
	// 		return false;
	// 	}
	// }

	componentDidMount() {
		localStorage.setItem('current', 1);
		if (util.operationTypeCheck('RETRIEVE')) {
			this.fetchFn(this.state.activeKey);

		} else {
			message.error('您没有权限查看该数据！');
		}
//		this.selectFetchFn("PART");
//		this.selectFetchFn("AD_SINGLE");
	}

	// checkbox状态
	onSelectChange = (selectedRowKeys) => {
		this.setState({ selectedRowKeys })
	}
	deleteFn = async (moduleCode, columnCode, moduleType) => {
		const dataSource = [...this.state.lists];

		var doc = {
			moduleCode: moduleCode,
			columnCode: columnCode,
			moduleType: moduleType,
			platformCode:this.state.activeKey
		}
		var data = await fetch(util.url, {
			method: 'POST',
			headers: {
				"Content-type": "application/x-www-form-urlencoded"
			},
			mode: 'cors',
			body: "method=ella.operation.deleteHomePageModule" + "&content=" + JSON.stringify(doc) + commonData.dataString
		})
			.then(function (response) {
				return response.json();
			});
		if (data.status == 1) {
			this.setState({ lists: dataSource.filter(item => item.moduleCode !== moduleCode) });
			message.success(`删除成功！`);
			this.fetchFn(this.state.activeKey);
		} else {
			message.error(`删除失败！`);
		}
	}
	onDelete = (moduleCode, columnCode, moduleType, status) => {
		
		if (util.operationTypeCheck('DELETE')) {
			this.deleteFn(moduleCode, columnCode, moduleType, status);
			this.selectFetchFn(moduleType);
		} else {
			message.error('您没有权限删除该数据！');
		}
	}

	arrowUp = (n) => {
		if (util.operationTypeCheck('UPDAT')) {
			if ((n == 2&&this.state.activeKey!="GUSHIJI")||(this.state.activeKey=="GUSHIJI"&&n==0)) {
				message.error(`不可向上移！`);
			} else {
				var lists = this.state.lists;
				var doc = {
					moveInModuleCode: lists[n - 1].moduleCode,
					moveInResult: lists[n].idx,
					moveOutModuleCode: lists[n].moduleCode,
					moveOutResult: lists[n - 1].idx,
					moveType: 'eb_home_page',
					platformCode:this.state.activeKey
				}
				this.arrowFetchFn(doc);
			}
		} else {
			message.error('您没有权限操作该数据！');
		}
	}

	arrowFetchFn = async (doc) => {
		var data = await fetch(util.url, {
			method: 'POST',
			headers: {
				"Content-type": "application/x-www-form-urlencoded"
			},
			mode: 'cors',
			body: "method=ella.operation.homePageObjectMove" + "&content=" + JSON.stringify(doc) + commonData.dataString
		})
			.then(function (response) {
				return response.json();
			});
		this.setState({
			lists: data.data
		});
	}

	arrowStick= async (moveTopModuleCode,moveTopModuleIdx) => {

		this.setState({loading:true});

		var data = await fetch(util.url, {
			method: 'POST',
			headers: {
				"Content-type": "application/x-www-form-urlencoded"
			},
			mode: 'cors',
			body: "method=ella.operation.homePageObjectTop" + "&content=" + JSON.stringify({"moveTopModuleCode":moveTopModuleCode,"moveTopModuleIdx":moveTopModuleIdx,"platformCode":this.state.activeKey}) + commonData.dataString
		})
			.then(function (response) {
				return response.json();
			});
			this.setState({
				lists: data.data,
				loading:false
			});
		
	}
	arrowDown = (n) => {
		if (util.operationTypeCheck('UPDAT')) {
			if (n == this.state.lists.length - 1) {
				message.error(`不可向下移！`);
			}
			else {
				var lists = this.state.lists;
				var doc = {
					moveInModuleCode: lists[n].moduleCode,
					moveInResult: lists[n + 1].idx,
					moveOutModuleCode: lists[n + 1].moduleCode,
					moveOutResult: lists[n].idx,
					moveType: 'eb_home_page',
					uid: localStorage.uid,
					token: localStorage.token,
					platformCode:this.state.activeKey
					
					
				}
				this.arrowFetchFn(doc);
			}
		} else {
			message.error('您没有权限操作该数据！');
		}

	}

	announceFetchfn = async () => {
		var data = await fetch(util.url, {
			method: 'POST',
			headers: {
				"Content-type": "application/x-www-form-urlencoded"
			},
			mode: 'cors',
			body: "method=ella.operation.publishHomePage" + "&content=" + JSON.stringify({"platformCode":this.state.activeKey})+ commonData.dataString
		})
			.then(function (response) {
				return response.json();
			});
		if (data.status == 1) {
			message.success('发布成功！');
			this.fetchFn(this.state.activeKey);
		} else {
			message.fail('发布失败啦！');
		}

	}

	selectFetchFn = async (type) => {
		if (type == "PART") {
			var _url = "ella.operation.findNotShowPart";
		} else if (type == "AD_SINGLE") {
			var _url = "ella.operation.findNotShowAd";
		}
		var data = await fetch(util.url, {
			method: 'POST',
			headers: {
				"Content-type": "application/x-www-form-urlencoded"
			},
			mode: 'cors',
			body: "method=" + _url + "&content=" + JSON.stringify({"platformCode":this.state.activeKey}) + commonData.dataString
		})
			.then(function (response) {
				return response.json();
			});
		var data = data.data
		if (type == "PART") {
			this.setState({
				selectList: data
			}, () => {
				if (data.length > 0) {
					this.setState({
						columnCode: data[0].columnCode,
						moduleName: data[0].moduleTitle
					});
				} else {
					this.setState({
						columnCode: "",
						moduleName: ""

					});
				}
			});
		} else {
			this.setState({
				selectList2: data
			}, () => {
				if (data.length > 0) {
					this.setState({
						columnCode2: data[0].columnCode,
						moduleName2: data[0].moduleTitle

					});
				} else {
					this.setState({
						columnCode2: "",
						moduleName2: ""

					});
				}
			});
		}



	}

	submitSelectFetchFn = async (columnCode, moduleTitle, type) => {

		var doc = {
			columnCode: columnCode,
			moduleTitle: moduleTitle,
			moduleType: type,
			platformCode:this.state.activeKey
		}
		var data = await fetch(util.url, {
			method: 'POST',
			headers: {
				"Content-type": "application/x-www-form-urlencoded"
			},
			mode: 'cors',
			body: "method=ella.operation.addHomePageModule" + "&content=" + JSON.stringify(doc) + commonData.dataString
		})
			.then(function (response) {
				return response.json();
			});
		if (data.status == 1) {
			message.success('成功!');
			this.fetchFn(this.state.activeKey);

		} else {
			message.error(data.message);
		}

	}
	// announce = ()=>{
	// 	this.announceFetchfn();
	// }

	showConfirm = (fn) => {
		let _this = this;
		confirm({
			title: '请确认是否发布该睡前听模块?',
			// content: '点击确定按钮将发布，取消发布请点击取消！',
			okType: 'primary',
			cancelText: '继续编辑',
			onOk() {
				for (var i = 0; i < _this.state.lists.length; i++) {
					if (i + 1 < _this.state.lists.length) {
						if (_this.state.lists[i].moduleType == _this.state.lists[i + 1].moduleType && _this.state.lists[i].moduleType == "AD_SINGLE") {
							message.error("不能发布相邻的广告横幅，请手动移开。");
							return;
						}
					}

				}
				fn();
			},
			onCancel() { },
		});
	}

	handleSelectChange = (value, type) => {
		if (type == "PART") {
			this.setState({
				columnCode: value.key,
				moduleName: value.label
			});
		} else {
			this.setState({
				columnCode2: value.key,
				moduleName2: value.label,

			});
		}


	}

	addNewMoudle = (type) => {
		if (type == "PART") {
			this.selectFetchFn("PART");
			this.setState({
				visible: true
			}, () => {
			});
		} else {
			this.selectFetchFn("AD_SINGLE");
			this.setState({
				visible3: true
			}, () => {
			});
		}


	}

	handleOk = (type) => {
		if (type == "PART") {
			this.setState({
				confirmLoading: true
			}, () => {

				if (this.state.columnCode != '' && this.state.moduleName != '') {
					this.submitSelectFetchFn(this.state.columnCode, this.state.moduleName, "PART")
				}


			});
			setTimeout(() => {
				this.setState({
					visible: false,
					confirmLoading: false,
					selectList:[]
				});
			}, 1000);
		} else {
			this.setState({
				confirmLoading2: true
			}, () => {

				if (this.state.columnCode2 != '' && this.state.moduleName2 != '') {
					this.submitSelectFetchFn(this.state.columnCode2, this.state.moduleName2, "AD_SINGLE")
				}
			});
			setTimeout(() => {
				this.setState({
					visible3: false,
					confirmLoading2: false,
					selectList2: []

				});


			}, 1000);
		}


	}







	handleCancel = (type) => {
		if (type == "PART") {
			this.setState({
				visible: false,
				selectContent: ''
			});
		} else {
			this.setState({
				visible3: false,
				selectContent2: ''
			});
		}

	}

	currentOn = (n) => {
		localStorage.setItem('current', n)
	}

	getAnnuounceDate = (value, dateString, str) => {
		this.setState({
			[str]: dateString,
		});
	}

	setAnnounceOnTime = async () => {
		console.log(this.state.checked)
		if(this.state.checked){
			if(!this.state.nextPublishDate){
				message.error("请选择定时发布日期！")
				return ;
			}
		}
		
		var doc = {
			nextPublishTime: this.state.checked?this.state.nextPublishDate+" "+this.state.times:'',
			platformCode:this.state.activeKey
			
		}
		var data = await fetch(util.url, {
			method: 'POST',
			headers: {
				"Content-type": "application/x-www-form-urlencoded"
			},
			mode: 'cors',
			body: "method=ella.operation.updateHomePageNextPublishTime" + "&content=" + JSON.stringify(doc) + commonData.dataString
		})
			.then(function (response) {
				return response.json();
			});
		if (data.status == 1) {
			message.success('设置成功!');
		}
	}

	announceOnTime = (e) => {
		this.setState({
			checked: e.target.checked
		},()=>{
			if (e.target.checked) {
			
				this.setState({
					nextPublishDate: '',
					times:"00:00"
				});
			}else{
				this.setAnnounceOnTime();
			}
		});
		console.log(e.target.checked)
		

	}
	showPreview() {
		if(this.state.activeKey=="GUSHIJI"){
			this.setState({
				visibleGUSHIJI: true,
			})
		}else if(this.state.activeKey=="APP"){
			this.setState({
				visible2: true,
			})
		}else if(this.state.activeKey=="HD"){
			this.setState({
				visibleHD: true,
			})
		}
		
	}
	changeTabs = (activeKey) => {
		this.fetchFn(activeKey);
	
		this.setState({
            activeKey: activeKey
        });

	}
	render() {
		const columns = [{
			title: '序号',
			width: '10%',
			dataIndex: 'id'
		}, {
			title: '修改时间',
			width: '15%',
			dataIndex: 'updateTime'
		}, {
			title: '模块标题',
			width: '15%',
			dataIndex: 'moduleTitle',
			className:'td_hide',
            render: (text, record) =>{
                return(
                    <Popover
                        placement="top"
                        title={null}
                        content={
                            record.moduleTitle
                        }
                    >
                        <span>{record.moduleTitle}</span>
                    </Popover>
                )
            }
		}, {
			title: '状态',
			width: '15%',
			render: (text, record) => {
				if (record.status == '已删除') {
					return (
						<span style={{ color: 'red' }}>{record.status}</span>
					)
				} else {
					return (
						<span>{record.status}</span>
					)
				}
			}
		},
		{
			title: '类型',
			width: '20%',
			render: (text, record) => {
				if (record.moduleType == 'PART') {
					if (record.isAdPart != "") {
						return (
							<span>推荐模块({record.isAdPart})</span>
						)
					} else {
						return (
							<span>推荐模块</span>
						)
					}

				} else if (record.moduleType == 'AD_SINGLE') {
					if (record.isAdPart != "") {
						return (
							<span>广告横幅({record.isAdPart})</span>
						)
					} else {
						return (
							<span>广告横幅</span>
						)
					}

				} else if (record.moduleType == 'BANNER') {

					return (
						<span>banner模块</span>
					)


				} else if (record.moduleType == 'SUBJECT') {

					return (
						<span>专题模块</span>
					)


				} else if (record.moduleType == 'DAILY_BOOK') {

					return (
						<span>每日绘本模块</span>
					)


				}
			}
		},
		{
			title: '操作',
			width: '30%',
			dataIndex: 'operate',
			render: (text, record) => {
			
				let url = '';
				if (record.moduleType == 'PART') {
					/////2.2.1修改bug把part_Source改为partSource;
					if(record.partSource=="ella.book.listCourse"){
                		var recommendType="course";
                	}else{
                		var recommendType="book";
                	}
					url = '/addRecommend/' + record.columnCode + '/'+recommendType+'/edit/indexInit';
					return (
						<div style={{ textAlign: 'center' }} className='m-icon-type'>
							<Link to={url} style={{ marginRight: 20 }}><span className='i-action-ico i-edit' onClick={() => this.currentOn(3)}></span></Link>
							{(record.id>4&&this.state.activeKey!="GUSHIJI")||(this.state.activeKey=="GUSHIJI"&&record.id>1)?(<span style={{ marginRight: 20 }} className='i-action-ico i-stick' onClick={() => this.arrowStick(record.moduleCode,record.idx)}></span>):null}
							{(record.id>4&&this.state.activeKey!="GUSHIJI")||(this.state.activeKey=="GUSHIJI"&&record.id>1)?(<span style={{ marginRight: 20 }} className='i-action-ico i-up' onClick={() => this.arrowUp(record.id - 1)}></span>):null}
							
							<span className='i-action-ico i-down' style={{ marginRight: 20 }} onClick={() => this.arrowDown(record.id - 1)}></span>
							<Popconfirm title="确定要删除吗?" onConfirm={() => this.onDelete(record.moduleCode, record.columnCode, record.moduleType, record.status)}>
								<span className='i-action-ico i-delete'></span>
							</Popconfirm>
						</div>
					)
				} else if (record.moduleType == 'AD_SINGLE') {
					url = '/home/addAdvertBanner/' + record.columnCode + '/' +'0';
//					url = '/home/addAdvertBanner/' + record.columnCode + '?=' + 'indexInit';
					return (
						<div style={{ textAlign: 'center' }} className='m-icon-type'>
							<Link to={url} style={{ marginRight: 20 }}><span className='i-action-ico i-edit' onClick={() => this.currentOn(3)}></span></Link>
							{record.id>4?(<span style={{ marginRight: 20 }} className='i-action-ico i-stick' onClick={() => this.arrowStick(record.moduleCode,record.idx)}></span>):null}
							
							{record.id>4?(<span style={{ marginRight: 20 }} className='i-action-ico i-up' onClick={() => this.arrowUp(record.id - 1)}></span>):null}
							<span className='i-action-ico i-down' style={{ marginRight: 20 }} onClick={() => this.arrowDown(record.id - 1)}></span>
							<Popconfirm title="确定要删除吗?" onConfirm={() => this.onDelete(record.moduleCode, record.columnCode, record.moduleType, record.status)}>
								<span className='i-action-ico i-delete'></span>
							</Popconfirm>
						</div>
					)
				}else if (record.moduleType == 'DAILY_BOOK') {
					return (
						<div style={{ textAlign: 'center' }} className='m-icon-type'>
							<Link to='/remittance'><span className='i-action-ico i-edit' onClick={() => this.currentOn(3)}></span></Link>
							{record.id>4?(<span style={{ marginRight: 20 }} className='i-action-ico i-stick' onClick={() => this.arrowStick(record.moduleCode,record.idx)}></span>):null}
							
						</div>
					)
				}
				else if (record.moduleType == 'BANNER' || record.moduleType == 'SUBJECT') {
					if (record.moduleType == 'BANNER') {
						url = '/home/banner'
					} else {
						url = '/home/topic'
					}
					return (
						<div style={{ textAlign: 'center' }}>
							<Link to={url}><span className='i-action-ico i-edit' onClick={() => this.currentOn(2)}></span></Link>
							{record.id>4?(<span style={{ marginRight: 20 }} className='i-action-ico i-stick' onClick={() => this.arrowStick(record.moduleCode,record.idx)}></span>):null}
						</div>
					)
				}
			}
		}]

		const { selectedRowKeys, visible, visible2, visible3,visibleGUSHIJI,visibleHD, confirmLoading, confirmLoading2, ModalText,selectList2,selectList,columnCode2,columnCode } = this.state

		const rowSelection = {
			selectedRowKeys,
			onChange: this.onSelectChange
		}
		const pagination = {
			total: this.state.lists.length,
			showSizeChanger: false,
			onShowSizeChange(current, pageSize) {
			},
			onChange(current) {
			}
		}
		return (
			<div id="index">
				<p className="m-title">首页管理</p>
				<div className="m-rt-content">
					{/*<Link to="/home/index/addMoudle/0"><Button type="primary" className="u-btn-add"><Icon type="plus" />添加新模块</Button></Link>*/}
					<div className='m-btn-add' style={{ "display": "inline-block", "marginRight": "30px","marginBottom":"0px" }}><Button type="primary" className="u-btn-add" onClick={() => this.addNewMoudle("PART")}><Icon type="plus" />添加推荐模块</Button></div>
					
					{
						this.state.activeKey!="GUSHIJI"?<div className='m-btn-add' style={{ "display": "inline-block","marginBottom":"0px" }}><Button type="primary" className="u-btn-add" onClick={() => this.addNewMoudle("AD_SINGLE")}><Icon type="plus" />添加单广告横幅</Button></div>:null
					}
					<Tabs defaultActiveKey="App" onChange={this.changeTabs} style={{width:"100%"}}>
						<TabPane tab={<span>移动客户端</span>} key="APP">
							<Spin tip="加载中..." spinning={this.state.loading} size="large" style={{ zIndex: 9999 }}>
								<Table columns={columns} rowKey={"id"} dataSource={this.state.lists} bordered pagination={false} className="t-nm-tab" scroll={{ y: this.state.minheight }} />
							</Spin>
						</TabPane>
						<TabPane tab={<span>故事机平台</span>} key="GUSHIJI">
							<Spin tip="加载中..." spinning={this.state.loading} size="large" style={{ zIndex: 9999 }}>
								<Table columns={columns} rowKey={"id"} dataSource={this.state.lists} bordered pagination={false} className="t-nm-tab" scroll={{ y: this.state.minheight }} />
							</Spin>
						</TabPane>
						<TabPane tab={<span>HD客户端</span>} key="HD">
							<Spin tip="加载中..." spinning={this.state.loading} size="large" style={{ zIndex: 9999 }}>
								<Table columns={columns} rowKey={"id"} dataSource={this.state.lists} bordered pagination={false} className="t-nm-tab" scroll={{ y: this.state.minheight }} />
							</Spin>
						</TabPane>
					 </Tabs>
					<p style={{ marginTop: 20, textAlign: 'center' }}>上次发布：{this.state.publishTime}</p>
					<p style={{ marginTop: 10, textAlign: 'center' }}>
						<Button type="primary" onClick={() => { this.showConfirm(this.announceFetchfn) }}>发布</Button>
						<Button
							style={{marginLeft:'20px'}}
							type="primary"
							onClick={() => { this.showPreview() }}
						>预览</Button>
					</p>
					<p style={{ marginTop: 10, textAlign: 'center' }}>
						<Checkbox onChange={this.announceOnTime} checked={this.state.checked}>定时发布</Checkbox>
						{this.state.checked&&<span class="setTimePublish">
							<DatePicker
								format="YYYY-MM-DD"
								style={{width:"150px","marginRight":"20px"}}
								placeholder="请选择发布日期"
								defaultValue={!!this.state.nextPublishDate?moment(this.state.nextPublishDate):''}
								disabledDate={this.disabledDate}
								onChange={(value, dateString) => { this.getAnnuounceDate(value, dateString, "nextPublishDate") }}
								

							/>
							<Select style={{ width:"100px","marginRight":"20px" }} value={this.state.times} onChange={(value)=>this.setState({times:value})}>
								<Option value="00:00">00:00</Option>
								<Option value="12:00">12:00</Option>
							</Select>
							<Button className="ant-btn-blue" type="primary" onClick={()=>this.setAnnounceOnTime()}>确定</Button>
						</span>
						}
					</p>
				</div>
				{
					<Modal
						title="添加新模块"
						visible={visible}
						onOk={() => this.handleOk("PART")}
						onCancel={() => this.handleCancel("PART")}

						confirmLoading={confirmLoading}

					>

						<span className='f-ft-14'>推荐模块：</span>
						
						<Select labelInValue value={{ key:columnCode }} style={{ marginLeft: 20, width: 180 }} onChange={(value) => this.handleSelectChange(value, "PART")}>
							{
								selectList.map((item, index) => {
									return <Option value={item.columnCode} key={item.columnCode}>{item.moduleTitle}</Option>
								})
							}
						</Select>
						


					</Modal>
				}
				{
					<Modal
						title="添加新模块"
						visible={visible3}
						onOk={() => this.handleOk("AD_SINGLE")}
						onCancel={() => this.handleCancel("AD_SINGLE")}
						confirmLoading={confirmLoading2}

					>

						<span className='f-ft-14'>广告横幅：</span>
						<Select labelInValue value={{ key:columnCode2 }} style={{ marginLeft: 20, width: 180 }} onChange={(value) => this.handleSelectChange(value, "AD_SINGLE")}>
							{
								selectList2.map((item, index) => {
									return <Option value={item.columnCode} key={item.columnCode}>{item.moduleTitle}</Option>
								})
							}
						</Select>

					</Modal>
				}
				{/* TODO:首页预览 */}
				{
					<Modal
						className='preview'
						title="APP首页预览"
						visible={visible2}
						onOk={() => { this.setState({ visible2: false }) }}
						onCancel={() => { this.setState({ visible2: false }) }}
						// TODO:让Modal里面的内容关闭时销毁,就是重新加载
						destroyOnClose={true}
					>
						<Preview platformCode={this.state.activeKey}></Preview>
						
					</Modal>
				}
				<Modal
					className='preview2'
					title="故事机首页预览"
					visible={visibleGUSHIJI}
					onOk={() => { this.setState({ visibleGUSHIJI: false }) }}
					onCancel={() => { this.setState({ visibleGUSHIJI: false }) }}
					// TODO:让Modal里面的内容关闭时销毁,就是重新加载
					destroyOnClose={true}
					
				>
						
						<Preview2 platformCode={this.state.activeKey}></Preview2>
						
					</Modal>
					<Modal
						className='preview3'
						title="HD首页预览"
						visible={visibleHD}
						style={{"width":"1300px"}}
						onOk={() => { this.setState({ visibleHD: false }) }}
						onCancel={() => { this.setState({ visibleHD: false }) }}
						// TODO:让Modal里面的内容关闭时销毁,就是重新加载
						destroyOnClose={true}
					>
						
						<Preview3 platformCode={this.state.activeKey}></Preview3>
					</Modal>
			</div>
		)
	}
}
export default homeSort