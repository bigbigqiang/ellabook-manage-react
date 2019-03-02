
import React from 'react'
import { Table, Input, Button, Popconfirm, message, Modal, Select, Spin,Popover } from 'antd'
import { Link } from 'react-router'
import moment from 'moment'
const confirm = Modal.confirm;
import 'whatwg-fetch'
import "./listenHome.less"
import commonData from '../commonData.js';
import AudioList from './AudioList2.js'
const Search = Input.Search;
var util = require('../util.js');

class ListenBookSleep extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			lists: [],			
			operationType: localStorage.getItem('operationType'),
			checked: false,
			nextPublishTime: '',
			loading: false,
			visible2:false,
			sleepCode:"",
			sleepName:""
		}
	}
	componentDidMount() {
		localStorage.setItem('current', 1);
		if (util.operationTypeCheck('RETRIEVE')) {
			this.fetchSleepList();

		} else {
			message.error('您没有权限查看该数据！');
		}
	}
	fetchSleepList(){
		this.setState({
			loading: true
		});
		util.API({sleepName:this.state.sleepName},"ella.operation.selectLbSleepListen")
		.then(response=>response.json())
		.then(response=>{
			// response.data=[];
			if(response.status==1){
				this.setState({
					loading: false,
					lists: response.data,
					publishTime: !!response.data[0]&&!!response.data[0].publishDatetime?moment(response.data[0].publishDatetime).format('YYYY-MM-DD HH:mm:ss'):""
				});
			}else{
				message.error(response.message)
			}
		})
	
	}
	deleteFn = async (sleepCode,publishStatus) => {
		const dataSource = [...this.state.lists];

		var doc = {
			sleepCode,
			publishStatus
		}
		var data = await fetch(util.url, {
			method: 'POST',
			headers: {
				"Content-type": "application/x-www-form-urlencoded"
			},
			mode: 'cors',
			body: "method=ella.operation.deleteLbSleepListen" + "&content=" + JSON.stringify(doc) + commonData.dataString
		})
			.then(function (response) {
				return response.json();
			});
		if (data.status == 1) {
			this.setState({ lists: dataSource.filter(item => item.sleepCode !== sleepCode) });
			message.success(`删除成功！`);
			this.fetchSleepList();
		} else {
			message.error(`删除失败！`);
		}
	}
	onDelete = (sleepCode,publishStatus) => {
		
		if (util.operationTypeCheck('DELETE')) {
			this.deleteFn(sleepCode,publishStatus);
			this.selectFetchFn();
		} else {
			message.error('您没有权限删除该数据！');
		}
	}
	arrowUpAndDown(moudleCode,index,type){
		if (util.operationTypeCheck('UPDAT')) {
			if(type=="UP"&&index==0){
				message.error(`不可向上移！`);
				return ;
			}
			if(type=="DOWN"&&index==this.state.lists.length-1){
				message.error(`不可向下移！`);
				return ;
			}
			var doc={
				moveCode:moudleCode,
				moveStatus:type,
				moveType:"eb_operation_lb_sleep_listen_config"
			}
			util.API(doc,"ella.operation.lbPageObjectMove")
			.then(response=>response.json())
			.then(response=>{
				if(response.status==1){
					this.fetchSleepList();
				} else {
					message.error(response.message);
				}
			})
			
		} else {
			message.error('您没有权限操作该数据！');
		}
		
	}
	

	arrowStick(moveCode,index){
		console.log(this)
		if(index==0){
			message.error(`不可置顶！`);
			return ;
		}
		this.setState({loading:true});
		util.API({moveCode,moveType:"eb_operation_lb_sleep_listen_config"},"ella.operation.lbPageObjectTop")
		.then(response=>response.json())
		.then(response=>{
			if(response.status==1){
				this.fetchSleepList();
			} else {
				message.error(response.message);
			}
		})
	}
	
	announceFetchfn(that){
		
		util.API({uid:commonData.commonData.uid},"ella.operation.publishLbSleepData")
		.then(response=>response.json())
		.then(response=>{
			if(response.status==1){
				message.success('发布成功！');
				that.fetchSleepList();
			} else {
				message.error(response.message);
			}
		})
	}
	showConfirm(fn){
		let that=this;
		confirm({
			title: '请确认是否发布该睡前听模块?',
			// content: '点击确定按钮将发布，取消发布请点击取消！',
			okType: 'primary',
			cancelText: '继续编辑',
			onOk() {
				fn(that);
			}
		});
	}
	getAnnuounceDate = (value, dateString, str) => {
		this.setState({
			[str]: dateString,
		});
	}

	setAnnounceOnTime = async (startValue) => {
		var doc = {
			nextPublishTime: startValue,
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
	showAudioList(sleepCode){
		this.setState({
			visible2:true,
			sleepCode
		})
	}
	render() {
		const columns = [{
			title: '序号',
			width:"15%",
            render: (text,record,index) =>{
                return <span>{index+1}</span>
                
            }
			
		}, 
	 	{
			title: '修改时间',
			width: '15%',
			dataIndex: 'updateTime',
			render: (text,record) => !!text?moment(text).format('YYYY-MM-DD HH:mm:ss'):!!record.createTime?moment(record.createTime).format('YYYY-MM-DD HH:mm:ss'):"-"
		},
		{
			title: '列表标题',
			width: '20%',
			dataIndex: 'sleepName',
			className:'td_hide',
            render: (sleepName) =>{
                return(
                    <Popover
                        placement="top"
                        title={null}
                        content={
                            sleepName
                        }
                    >
                        <span>{sleepName}</span>
                    </Popover>
                )
            }
			
		},
		{
			title: '音频数量',
			width: '15%',
			dataIndex:"voiceNum",
			render:(text,record)=><a onClick={() =>this.showAudioList(record.sleepCode)}>{text}</a>
			
		},
		{
			title: '状态',
			width: '15%',
			dataIndex:'publishStatus',
			render: (text, record) => {
				return <span>{text=="PUBLISH_ON"?"已发布":text=="PUBLISH_OFF"?"未发布":text=="PUBLISH_OFF_DOWN"?"下线未发布":text=="PUBLISH_OFF_UPDATE"?"修改未发布":"-"}</span>
			}
			
		},
		{
			title: '操作',
			width: '20%',
			dataIndex: 'operate',
			render: (text, record,index) => {
					return (
						<div style={{ textAlign: 'center' }} className='m-icon-type'>
							<Link style={{ marginRight: 20 }} to={"/addbooksleep/edit/"+record.sleepCode} target="_blank"><span className='i-action-ico i-edit'></span></Link>
							<span 
								style={{ marginRight: 20 }} 
								className='i-action-ico i-stick' 
								onClick={() =>{
									if(record.publishStatus === 'PUBLISH_OFF_DOWN'){
										message.warning('不可做置顶操作！')
									}else{
										this.arrowStick(record.sleepCode,index)
									}
								}} 
							></span>
							<span 
								style={{ marginRight: 20 }} 
								className='i-action-ico i-up'
								onClick={() =>{
									if(record.publishStatus === 'PUBLISH_OFF_DOWN'){
										message.warning('不可做排序操作！')
									}else{
										this.arrowUpAndDown(record.sleepCode,index,"UP")
									}
								}}  
							></span>
							<span 
								className='i-action-ico i-down' 
								style={{ marginRight: 20 }} 
								onClick={() =>{
									if(record.publishStatus === 'PUBLISH_OFF_DOWN'){
										message.warning('不可做排序操作！')
									}else{
										this.arrowUpAndDown(record.sleepCode,index,"DOWN")
									}
								}} 
							></span>
							<Popconfirm title="确定要删除吗?" onConfirm={() => this.onDelete(record.sleepCode,record.publishStatus)}>
								<span className='i-action-ico i-delete'></span>
							</Popconfirm>
						
						</div>
					)
				}
				
		}]


		return (
			<div id="index">
				<p className="m-title">睡前听</p>
				<div className="m-rt-content">
					<Link to="/addbooksleep/add/0" className="m-btn-add">
						<Button type="primary" icon="plus" className="u-btn-add intervalBottom intervalRight">添加听书列表</Button>
					</Link>
					<Search value={this.state.sleepName} onChange={(e) =>this.setState({ sleepName: e.target.value }) } enterButton className="searchWidth intervalRight" onSearch={(value) => this.fetchSleepList()} />
					<Spin tip="加载中..." spinning={this.state.loading} size="large" style={{ zIndex: 9999 }}>
						<Table 
							
							rowKey={(record, index)=>index}
							columns={columns} 
							dataSource={this.state.lists} 
							bordered
							pagination={false} 
							className="t-nm-tab" 
							scroll={{ y: 570 }}
							rowClassName={(record, index) => { if (record.publishStatus === 'PUBLISH_OFF_DOWN') { return 'el-tr-gary' } }}
						/>
					</Spin>
					<p style={{ marginTop: 20, textAlign: 'center' }}>上次发布：{this.state.publishTime}</p>
					<p style={{ marginTop: 10, textAlign: 'center' }}>
						<Button type="primary" onClick={() =>this.showConfirm(this.announceFetchfn)}>发布</Button>
					</p>
				</div>
				<Modal
					visible={this.state.visible2}
					title="音频列表"
					onCancel={()=>this.setState({visible2:false})}
					footer={null}
					width={1000}
				>
					{
						this.state.visible2 && <AudioList sleepCode={this.state.sleepCode}/>
					}
				</Modal>
				
			</div>
		)
	}
}
export default ListenBookSleep