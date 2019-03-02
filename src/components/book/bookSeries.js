import React from 'react'
import { Table,Select,Tabs, Button, Input, Icon, Spin,Popover,Popconfirm,message,Modal,Pagination} from 'antd';
import { Link } from 'react-router';
import "./bookSeries.css"
import getUrl from "../util.js"
import BookSeriesList from './bookSeriesList.js'
const { Option} = Select;
const Search = Input.Search;
const confirm = Modal.confirm;
const TabPane = Tabs.TabPane;

export default class BookSeries extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			loading: false,
			visible:false,
			thePageNow: 0,
			pageMax: 0,
			pageNow: 0,
			pageSize: 20,
			current:'1',
			seriesName:'',//任务墙搜索名
			showStatus:'',
			activeKey:"SHELVES_ON",
			bookCollecList:[],//已展示任务墙列表
			seriesCode:''
		}
	}
	componentDidMount() {
		this.getBookCollecList('');
	}
	//获取图书列表数据
	getBookCollecList(seriesName) {
		this.setState({
			loading: true,
		});
		var doc = {
			seriesName,
			shelvesFlag: this.state.activeKey,
			"pageVo": {
				"page": this.state.pageNow,
				"pageSize": this.state.pageSize
			}

		}
		getUrl.API(doc, "ella.operation.getBookSeriesList")
			.then(response => response.json())
			.then(response => {
				if (response.status == 1) {
					this.setState({
						bookCollecList: response.data.list,
						loading: false,
						pageMax: response.data.total,
						pageLengthNow: response.data.list.length,
						current:response.data.currentPage
					})

				} else {
					message.error(response.message)
				}
			})

	}
	onDelete=(seriesCode,shelvesFlag)=>{
        if (getUrl.operationTypeCheck('DELETE')) {
			// if(shelvesFlag=="SHELVES_ON"){
			// 	message.error('该任务列表正在任务墙中展示，请下架后重新操作！');
			// 	return ;
        	// }
            this.fetchDeleteModule(seriesCode);
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
	fetchDeleteModule(seriesCode) {
		let params= {
			seriesCode,
		}
		getUrl.API(params,"ella.operation.deleteBookSeries")
		.then(response=>response.json())
		.then(response=>{
			if(response.status==1){
				message.success("删除成功!");
				this.getBookCollecList(this.state.seriesName)
			}else{
				message.error("删除失败！")
			}
		})
	}

	changeTabs = (activeKey) => {
        
		this.setState({
			activeKey: activeKey,
			pageNow:0
        },()=>{
			this.getBookCollecList(this.state.seriesName)
		});
		
	}

	//上下架
	updateTaskWallShelve(seriesCode,shelvesFlag){
		if(shelvesFlag=="SHELVES_ON"){
			shelvesFlag="SHELVES_OFF"
		}else{
			shelvesFlag="SHELVES_ON"
		}
		let params= {
			seriesCode,
			shelvesFlag
		}
		getUrl.API(params,"ella.operation.updateBookSeriesShelves")
		.then(response=>response.json())
		.then(response=>{
			if(response.status==1){
				message.success("操作成功!");
				this.getBookCollecList(this.state.seriesName)
			}else{
				message.error(response.message)
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
	release(){
		getUrl.API({},"ella.operation.publishTaskWall")
		.then(response=>response.json())
		.then(response=>{
			if(response.status==1){
				message.success("发布成功!");
				this.getBookCollecList(this.state.seriesName)
			}else{
				message.error(response.message)
			}
		}) 
	}
	showClassBook = (seriesCode) => {
        var w = this;
        w.setState({
            visible: true,
            seriesCode,
        });
	}
	
	//分页换页的回调
	pageChangeFun(pageNumber) {
		console.log(pageNumber)
		this.setState({
			pageNow: pageNumber - 1
		},()=>{
			this.getBookCollecList(this.state.seriesName);
		})
		

	}
	pageSizeChangeFun(current, size) {
		this.setState({
			pageSize: size,
			pageNow: current - 1
		},()=>{
			console.log(this.state.pageSize)
			this.getBookCollecList(this.state.seriesName);
		})
	}
	render() {
		var that=this;
		const columns = [
			{
				title: '合集名称',
				width: "20%",
				dataIndex: 'seriesName',
				key: 'seriesName',
				className:'td_hide',
				render: (seriesName) =>{
					return(
						<Popover
							placement="top"
							title={null}
							content={
								seriesName
							}
						>
							<span>{seriesName}</span>
						</Popover>
					)
				}
			},	
			{
				title: '合集类型',
				dataIndex: 'seriesType',
				key: 'seriesType',
				width: "15%",
				render:(seriesType)=>{
					return <span>{seriesType=="SAME_DIVERSITY"?"分集合集":seriesType=="SAME_ATTRIBUTE"?"同属性合集":"-"}</span>
				}
			},
			{
				title: '合集集数',
				dataIndex: 'bookletNum',
				key: 'bookletNum',
				width: "15%",
				render:(text,record)=>{
					return <span>{record.bookletType=="V1_V2"?"上下":record.bookletType=="V1_V2_V3"?"上中下":record.bookletType=="CUSTOM_NUM"?record.bookletNum:"-"}</span>
				}
			},
			{
				title: '图书',
				width: '15%',
				dataIndex: 'bookNum',
				render(text, record){
					return (
						<a  style={{"textDecoration":"underline"}} onClick={() => that.showClassBook(record.seriesCode)}>{record.bookNum}</a>
					)
				}
			},
			
			{
				title: '上下架操作',
				width: "15%",
				dataIndex: 'shelvesFlag',
				render: (text,record) => {
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
					return <Popconfirm title={record.shelvesFlag == "SHELVES_ON"?"确定下架吗?":"确定上架吗?"}
						onConfirm={()=>that.updateTaskWallShelve(record.seriesCode,record.shelvesFlag)}
					>
						<a>{record.shelvesFlag == "SHELVES_ON" ?"下架":record.shelvesFlag == "SHELVES_OFF" ?"上架":"-"}</a>
					</Popconfirm>
				}
			},
			{
				title: '操作',
				dataIndex: '',
				width: "20%",
				render(text, record) {
					let url = '/addBookSeries/edit/'+record.seriesCode;
					return (
						<div style={{ textAlign: 'center' }} className='m-icon-type'>
							<Link to={url} style={{ marginRight: '20px' }} target="_blank"><span className='i-action-ico i-edit'></span></Link>
							<Popconfirm title="请确认是否删除该合集" onConfirm={() => that.onDelete(record.seriesCode,record.shelvesFlag)}>
								<span className='i-action-ico i-delete'></span>
							</Popconfirm>
							
						</div>
					)
				}
			},
		];
		return (
			<div className="bookCollection">
				<Spin spinning={this.state.loading} size="large">
					<div className="m-title">
						合集管理
					</div>
					<div className="m-rt-content">
						<div className="inter">
							<Link to="/addBookSeries/add/0" className='m-btn-add intervalRight'><Button type="primary" className="u-btn-add"><Icon type="plus" />添加新的合集</Button></Link>
							<Search placeholder="搜索" enterButton className="searchWidth intervalRight"  
								onSearch={(value) => {
									this.setState({"seriesName":value,pageNow:0},()=>{
										this.getBookCollecList(value);
									}) 
								}} 
							/>
						</div>
						<Tabs defaultActiveKey="SHELVES_ON" onChange={this.changeTabs} style={{width:"100%"}}>
							<TabPane tab={<span>上架合集</span>} key="SHELVES_ON">
								<div className="g-feedTable">
									<Table className="t-nm-tab" dataSource={this.state.bookCollecList} columns={columns} pagination={false} scroll={{ y: ((this.state.bookCollecList.length> 10) ? 600 : 0) }} />
								</div>
								<div className="paixu">
									<Pagination className="paixuIn" current={this.state.current} showSizeChanger pageSizeOptions={['20', '40', '60', '80', '100']} defaultPageSize={20} defaultCurrent={1} showTotal={total => `共 ${total} 条`} total={this.state.pageMax} onChange={(pageNumber)=>this.pageChangeFun(pageNumber)} showQuickJumper={true} onShowSizeChange={(current, size)=>this.pageSizeChangeFun(current, size)} />
								</div>
							</TabPane>
							<TabPane tab={<span>全部合集</span>} key="">
								<div className="g-feedTable">
									<Table className="t-nm-tab" dataSource={this.state.bookCollecList} columns={columns} pagination={false} scroll={{ y: ((this.state.bookCollecList.length> 10) ? 600 : 0) }} />
								</div>
								<div className="paixu">
									<Pagination className="paixuIn" current={this.state.current} showSizeChanger pageSizeOptions={['20', '40', '60', '80', '100']} defaultPageSize={20} defaultCurrent={1} showTotal={total => `共 ${total} 条`} total={this.state.pageMax} onChange={(pageNumber)=>this.pageChangeFun(pageNumber)} showQuickJumper={true} onShowSizeChange={(current, size)=>this.pageSizeChangeFun(current, size)} />
								</div>
							</TabPane>
						</Tabs>
						{/* {
							this.state.activeKey=="SHELVES_ON"&&<p style={{ marginTop: 10, textAlign: 'center' }}>
								<Button type='primary' onClick={()=>{this.showConfirm()}}>发布</Button>
							</p>
						} */}
					
					<Modal
						visible={this.state.visible}
						title="图书列表"
						onCancel={()=>this.setState({visible:false})}
						footer={null}
						width={1000}
					>
						{this.state.visible && <BookSeriesList seriesCode={this.state.seriesCode} />}
					</Modal>
				</div>
				</Spin>
			</div>
		);
	}
}
