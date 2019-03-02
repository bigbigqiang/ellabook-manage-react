
import React from 'react'
import { Table, Icon, Button, Popconfirm, message, Modal, Select,DatePicker, Spin,Popover,Tabs } from 'antd'
import { Link } from 'react-router'
import moment from 'moment'
const confirm = Modal.confirm;
import 'whatwg-fetch'
import "./listenHome.less"
import commonData from '../commonData.js'
const TabPane = Tabs.TabPane;
var util = require('../util.js');

class ListenHome extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			lists: [],
			visible: false,
			confirmLoading: false,
			selectList: [],
			startValue: null,
			operationType: localStorage.getItem('operationType'),
			checked: false,
			nextPublishTime: '',
			loading: false,
			lists2:[],
			activeKey:'APP'
		}
	}
	componentDidMount() {
		localStorage.setItem('current', 1);
		if (util.operationTypeCheck('RETRIEVE')) {
			this.fetchLBList();

		} else {
			message.error('您没有权限查看该数据！');
		}
	}
	fetchLBList(){
		this.setState({
			loading: true
		});
		util.API({platformCode:this.state.activeKey},"ella.operation.lbAppHomeList")
		.then(response=>response.json())
		.then(response=>{
			if(response.status==0){
				var len=response.data.filter(item=>item.publishStatus === 'PUBLISH_OFF_DOWN').length;
				var curLists= response.data.slice(0,response.data.length-len);
				console.log(curLists)
				this.setState({
					loading: false,
					lists: response.data,
					lists2:curLists,
					publishTime:!!response.data&&!!response.data[0].publishDatetime?moment(response.data[0].publishDatetime).format('YYYY-MM-DD HH:mm:ss'):""
				})
			
			}else{
				message.error(response.message)
			}
		})
	
	}
	disabledDate = (current) => {
		return current < moment();
	}
	onDelete(moudleCode){
		
		if (util.operationTypeCheck('DELETE')) {
			this.deleteFn(moudleCode);
			this.selectFetchFn();
		} else {
			message.error('您没有权限删除该数据！');
		}
	}
	deleteFn(moudleCode){
		console.log(this.state.activeKey)
		util.API({moudleCode,platformCode:this.state.activeKey},"ella.operation.deleteLbAppHome")
		.then(response=>response.json())
		.then(response=>{
			if(response.status==1){
				message.success(`删除成功！`);
				this.fetchLBList();
			} else {
				message.error(response.message);
			}
		})
	}
	arrowUpAndDown(moudleCode,index,type){
		if (util.operationTypeCheck('UPDAT')) {
			if(type=="DOWN"&&index==this.state.lists.length-1){
				message.error(`不可向下移！`);
				return ;
			}
			var doc={
				moveCode:moudleCode,
				moveStatus:type,
				moveType:"eb_operation_lb_page"
			}
			util.API(doc,"ella.operation.lbPageObjectMove")
			.then(response=>response.json())
			.then(response=>{
				if(response.status==1){
					this.fetchLBList();
				} else {
					message.error(response.message);
				}
			})
			
		} else {
			message.error('您没有权限操作该数据！');
		}
		
	}
	arrowStick(moveCode){
		this.setState({loading:true});
		util.API({moveCode,moveType:"eb_operation_lb_page"},"ella.operation.lbPageObjectTop")
		.then(response=>response.json())
		.then(response=>{
			if(response.status==1){
				this.fetchLBList();
			} else {
				message.error(response.message);
			}
		})
	}
	announceFetchfn(that){

		util.API({pcUid:localStorage.uid,platformCode:that.state.activeKey},"ella.operation.publishAppHomeData")
		.then(response=>response.json())
		.then(response=>{
			if(response.status==1){
				message.success('发布成功！');
				that.fetchLBList();
			} else {
				message.error(response.message);
			}
		})
	}
	selectFetchFn(){
		util.API({platformCode:this.state.activeKey},"ella.operation.getUnShowLbListenList")
		.then(response=>response.json())
		.then(response=>{
			if(response.status==0){
				this.setState({
					selectList: response.data
				}, () => {
					if (response.data.length > 0) {
						this.setState({
							listenCode: response.data[0].listenCode,
							listenName: response.data[0].listenName
						});
					} else {
						this.setState({
							listenCode: "",
							listenName: ""
	
						});
					}
				});
			}else{
				message.error(response.message)
			}
		})

	}

	submitSelectFetchFn(listenCode){
		util.API({listenCode,platformCode:this.state.activeKey},"ella.operation.addLbListenToLbAppHome")
		.then(response=>response.json())
		.then(response=>{
			if(response.status==0){
				message.success('添加成功!');
				this.fetchLBList();
			} else {
				message.error(response.message);
			}
		})
	
	}
	showConfirm(fn){
		let that=this;
		confirm({
			title: '请确认是否发布该听书首页模块?',
			// content: '点击确定按钮将发布，取消发布请点击取消！',
			okType: 'primary',
			cancelText: '继续编辑',
			onOk() {
				fn(that);
			},
			onCancel() { },
		});
	}

	handleSelectChange(value){
		this.setState({
			listenCode: value.key,
			listenName: value.label
		});
	}
	addNewMoudle(type){
		this.selectFetchFn("PART");
		this.setState({
			visible: true
		});
	}

	handleOk(){
		this.setState({
			confirmLoading: true
		}, () => {

			if (this.state.listenCode != '' && this.state.listenName != '') {
				this.submitSelectFetchFn(this.state.listenCode)
			}


		});
		setTimeout(() => {
			this.setState({
				visible: false,
				confirmLoading: false,
				selectList:[]
			});
		}, 1000);
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
	announceOnTime = (e) => {
		const { startValue } = this.state;
		this.setState({
			checked: e.target.checked
		});
		var checked = this.state.checked;
		if (!checked) {
			this.setState({
				announceTimeSet: (<DatePicker
					showTime
					disabledDate={this.disabledDate}
					format="YYYY-MM-DD HH:mm:ss"
					placeholder="请设置发布时间"
					onChange={(value, dateString) => { this.getAnnuounceDate(value, dateString, "startValue") }}
					onOk={() => this.setAnnounceOnTime(this.state.startValue)}
				/>)
			});
		} else {
			this.setAnnounceOnTime('');
			this.setState({
				announceTimeSet: '',
				startValue: null
			});
		}

	}
	render() {
		const columns = [{
			title: '序号',
			width: '15%',
            render: (text,record,index) =><span>{index+1}</span>
		}, {
			title: '修改时间',
			width: '15%',
			dataIndex: 'publishDatetime',
			render: (text,record) => !!text?moment(text).format('YYYY-MM-DD HH:mm:ss'):!!record.createTime?moment(record.createTime).format('YYYY-MM-DD HH:mm:ss'):"-"
		}, {
			title: '模块标题',
			width: '15%',
			dataIndex: 'moudleTitle',
			className:'td_hide',
            render: (text, record) =>{
                return(
                    <Popover
                        placement="top"
                        title={null}
                        content={
                            record.moudleTitle
                        }
                    >
                        <span>{record.moudleTitle}</span>
                    </Popover>
                )
            }
		}, {
			title: '状态',
			width: '15%',
			dataIndex:'publishStatus',
			render: (text, record) => {
				return <span>{text=="PUBLISH_ON"?"已发布":text=="PUBLISH_OFF"?"未发布":text=="PUBLISH_OFF_DOWN"?"下线未发布":text=="PUBLISH_OFF_UPDATE"?"修改未发布":"-"}</span>
			}
		},
		{
			title: '类型',
			width: '20%',
			dataIndex:"moudleType",
			render: (text, record) => {
				if(text=="AD"){
					return <span>听书横幅广告</span>
				}else if(text=="LISTEN_LIST"){
					return <span>听书推荐</span>
				}else if(text=="WIKI"){
					return <span>听书专题</span>
				}else{
					return <span>-</span>
				}
			
			}
		},
		{
			title: '操作',
			width: '20%',
			dataIndex: 'operate',
			render: (text, record,index) => {
				var url="";
				if(record.moudleType=="WIKI"){
					url="/listenBookSubjectList";
				}else if(record.moudleType=="LISTEN_LIST"){
					url="/addListenRecommend/edit/"+record.moudleCode+"/index";
				}else if(record.moudleType=="AD"){
					url="/addListenBookAd/index?adCode=" + record.moudleCode
				}else{
					url="";
				}
				return (
					<div style={{ textAlign: 'center' }} className='m-icon-type'>
						<Link style={{ marginRight: 20 }} to={url}><span className='i-action-ico i-edit'></span></Link>
						{(index!=0&&index!=1&&index!=2)&&<span style={{ marginRight: 20 }} className='i-action-ico i-stick' 
						onClick={() =>{
							if(record.publishStatus === 'PUBLISH_OFF_DOWN'){
								message.warning('不可做置顶操作！')
							}else{
								this.arrowStick(record.moudleCode)
							}
						}} 
						></span>
						}
						
						{(index!=0&&index!=1&&index!=2)&&<span style={{ marginRight: 20 }} className='i-action-ico i-up' 
						onClick={() =>{
							if(record.publishStatus === 'PUBLISH_OFF_DOWN'){
								message.warning('不可做排序操作！')
							}else{
								this.arrowUpAndDown(record.moudleCode,index,"UP")
							}
						}} 
						></span>}
						{(index!=0&&index!=1)&&<span className='i-action-ico i-down' style={{ marginRight: 20 }} 
						onClick={() =>{
							if(record.publishStatus === 'PUBLISH_OFF_DOWN'){
								message.warning('不可做排序操作！')
							}else{
								this.arrowUpAndDown(record.moudleCode,index,"DOWN")
							}
						}} 
						>
						</span>}
						{
							(index!=0&&index!=1)&&<Popconfirm title="确定要删除吗?" onConfirm={() => this.onDelete(record.moudleCode)}>
								<span className='i-action-ico i-delete'></span>
							</Popconfirm>
						}
					</div>
				)
			}
				
		}]

		const { visible, confirmLoading,selectList,listenCode } = this.state
		return (
			<div id="index">
				<p className="m-title">听书首页管理</p>
				<div className="m-rt-content">
					<div className='m-btn-add' style={{ "display": "inline-block", "marginRight": "30px","marginBottom":"20px" }}><Button type="primary" className="u-btn-add" onClick={() => this.addNewMoudle("PART")}><Icon type="plus" />添加听书推荐列表</Button></div>
					<Spin tip="加载中..." spinning={this.state.loading} size="large" style={{ zIndex: 9999 }}>
					<Tabs defaultActiveKey="1" 
                            onChange={(activeKey)=>{
                                console.log(activeKey)
                                this.setState({activeKey},()=>{
                                    this.fetchLBList();
                                })
                            }} 
                            style={{width:"100%"}}>
                            <TabPane tab={<span>移动客户端</span>} key="APP">
							<Table 
							columns={columns} 
							rowKey={(record, index)=>index}
							dataSource={this.state.lists} 
							bordered 
							pagination={false} 
							className="t-nm-tab" 
							scroll={{ y: 570 }} 
							rowClassName={(record, index) => { if (record.publishStatus === 'PUBLISH_OFF_DOWN') { return 'el-tr-gary' } }}
						/>
							</TabPane>
                            <TabPane tab={<span>HD客户端</span>} key="HD">
						<Table 
							columns={columns} 
							rowKey={(record, index)=>index}
							dataSource={this.state.lists} 
							bordered 
							pagination={false} 
							className="t-nm-tab" 
							scroll={{ y: 570 }} 
							rowClassName={(record, index) => { if (record.publishStatus === 'PUBLISH_OFF_DOWN') { return 'el-tr-gary' } }}
						/>
						 </TabPane>
                        </Tabs>
					</Spin>
					<p style={{ marginTop: 20, textAlign: 'center' }}>上次发布：{this.state.publishTime}</p>
					<p style={{ marginTop: 10, textAlign: 'center' }}>
						<Button type="primary" onClick={() =>this.showConfirm(this.announceFetchfn)}>发布</Button>
						<Button
							style={{marginLeft:'20px'}}
							type="primary"
							disabled={true}
							onClick={() => { this.showPreview() }}
						>预览</Button>
					</p>
					{/* <p style={{ marginTop: 10, textAlign: 'center' }}>
						<Checkbox disabled="true" onChange={this.announceOnTime} checked={this.state.checked}>定时发布</Checkbox>
						{this.state.announceTimeSet}
					</p> */}
				</div>
				<Modal
					title="添加推荐模块列表"
					visible={visible}
					onOk={() => this.handleOk()}
					confirmLoading={confirmLoading}
					onCancel={()=>{
						this.setState({
							visible: false,
							selectContent: ''
						})
					}}

				>
					<span className='f-ft-14'>推荐模块：</span>	
					<Select 
						labelInValue 
						value={{ key:listenCode }} 
						style={{ marginLeft: 20, width: 180 }} 
						onChange={(value) => this.handleSelectChange(value)}
					>
					{
						selectList.map((item, index) => {
							return <Option value={item.listenCode} key={item.listenCode}>{item.listenName}</Option>
						})
					}
					</Select>
				</Modal>
				
			
			</div>
		)
	}
}
export default ListenHome