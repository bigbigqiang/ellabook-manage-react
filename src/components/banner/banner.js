/**
 * Created by Administrator on 2017-10-25.
 */
import React from 'react'
import { Table, Icon, Button, Popconfirm, message, Spin, Input, Col, Select, Pagination,Tabs,Popover } from 'antd'
import { Link } from 'react-router'
// require('babel-polyfill')
// require('es6-promise').polyfill()
const Search = Input.Search;
const TabPane = Tabs.TabPane;
import getUrl from "../util.js"
import 'whatwg-fetch'
var util = require('../util.js');
import commonData from '../commonData.js';

class bannerList extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            lists: [],
            selectedRowKeys: [],
            pageIndex: 0,
            minheight: '',
            loading: false,
            pageMax: 0,
            page: '0',
            pageSize: '20',
            current: 1,
            bannerTitle: '',
            activeKey:'1',
            listsHasOnline:[],
            listsAll:[],
            bannerOnlineList_SHELVES_ON:[]
            
        }
        this.changeFn = this.changeFn.bind(this);
        this.pageChangeFun = this.pageChangeFun.bind(this);
        this.pageSizeFun = this.pageSizeFun.bind(this);
    }

    pageSizeFun(current, pageSize) {
        this.setState({
            pageSize: pageSize,
            page: current - 1,
            current: current
        }, () => {
        	console.log("zhnagy")
            this.fetchFn("2",this.state.bannerTitle, this.state.page, this.state.pageSize);
        });
    }
    pageChangeFun(pageNum) {
        this.setState({
            page: pageNum - 1,
            current: pageNum

        }, () => {
            this.fetchFn("2",this.state.bannerTitle, this.state.page, this.state.pageSize);
        });
    }

    fetchFn = async (activeKey,bannerTitle, page, pageSize) => {
    	console.log(activeKey)
    	console.log(bannerTitle)
    	console.log(page)
    	console.log(pageSize)
        this.setState({
            loading: true
        });
       
        if(activeKey=="1"){
        	var doc={ "bannerTitle": bannerTitle, "shelvesFlag":"SHELVES_ON", "pageVo": { "page":0, "pageSize": 1000 }}
        }else{
        	var doc={ "bannerTitle": bannerTitle, "pageVo": { "page": page, "pageSize": pageSize } }
        }
        var data = await fetch(util.url, {
            method: 'POST',
            headers: {
                "Content-type": "application/x-www-form-urlencoded"
            },
            mode: 'cors',
            body: "method=ella.book.listOperationBanner" + "&content=" + JSON.stringify(doc) + commonData.dataString
        })
            .then(function (res) {

                return res.json();
            });
		if(activeKey=="1"){
            let bannerOnlineList_SHELVES_ON= [];
            data.data.list.map((item)=>{
                if (item.shelvesFlag === 'SHELVES_ON') {
                    bannerOnlineList_SHELVES_ON.push(item)
                }
            })
			 this.setState({
                listsHasOnline: data.data.list,
                bannerOnlineList_SHELVES_ON,
	            loading: false,
	        }, () => {
				
	            if (data.data.length > 12) {
	                this.setState({
	                    minheight: 510
	                })
	            } else {
	                this.setState({
	                    minheight: ''
	                })
	            }
	
	        });
		}else{
			 this.setState({
	            listsAll: data.data.list,
	            total: data.data.total,
	            loading: false,
	            current:data.data.currentPage,
	            pageMax: data.data.total
	        }, () => {
				
	            if (data.data.length > 12) {
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
    
        localStorage.setItem('current', 2);
        
    }
    changeFn = (pagination) => {
        this.fetchFn(pagination.current - 1);
    }

    deleteFn = async (bannerCode,shelvesFlag) => {
       
        var doc = {
            bannerCode: bannerCode,
        }
        var data = await fetch(util.url, {
            method: 'POST',
            headers: {
                "Content-type": "application/x-www-form-urlencoded"
            },
            mode: 'cors',
            body: "method=ella.book.delOperationBanner" + "&content=" + JSON.stringify(doc) + commonData.dataString
        })
            .then(function (response) {
                return response.json();
            });
        if (data.status == 1) {

        	const dataSource = [...this.state.listsAll];
			if(this.state.activeKey=="1"){
				
            	this.setState({ listsHasOnline: dataSource.filter(item => item.bannerCode !== bannerCode)});
			}else{
				
				const cur = this.state.total - 1;
            	this.setState({ listsAll: dataSource.filter(item => item.bannerCode !== bannerCode), total: cur });
			}

            message.success(`删除成功！`);
            this.fetchFn("1",this.state.bannerTitle,"","");
            this.fetchFn("2",this.state.bannerTitle, this.state.page, this.state.pageSize);
        } else {
            message.error(`删除失败！`);
        }
   }
    onDelete = (bannerCode,shelvesFlag) => {
        if (util.operationTypeCheck('DELETE')) {
        	if(shelvesFlag=="SHELVES_ON"){
        		message.error('该banner图已上线，请下线后重新操作！');
        	}
        	
            this.deleteFn(bannerCode,shelvesFlag);
        } else {
            message.error('您没有权限删除该数据！');
        }
    }
	UpDownOpera=async(bannerCode,shelvesFlag,showFlag)=>{
		
        var doc = {
            bannerCode: bannerCode,
            shelvesFlag:shelvesFlag,
            showFlag
        }
        var data = await fetch(util.url, {
            method: 'POST',
            headers: {
                "Content-type": "application/x-www-form-urlencoded"
            },
            mode: 'cors',
            body: "method=ella.operation.updateBannerShelves" + "&content=" + JSON.stringify(doc) + commonData.dataString
        })
        .then(function (response) {
            return response.json();
        });
        var dataSource=this.state.listsHasOnline;
        var curdata=this.state.listsAll;
        if (data.status == 1) {
//			if(this.state.activeKey=="1"){
//				for(var i=0;i<curdata.length;i++){
//					if(curdata[i].bannerCode==bannerCode){
//						curdata[i].shelvesFlag="SHELVES_OFF";
//						break;
//					}
//					
//				}
//				
//          	this.setState({ listsHasOnline: dataSource.filter(item => item.bannerCode !== bannerCode),"listsAll":curdata});
//          	
//			}else{
//				
//				
//				
//				for(var i=0;i<this.state.listsAll.length;i++){
//					if(this.state.listsAll[i].bannerCode==bannerCode&&shelvesFlag=="SHELVES_OFF"){
//						
//						curdata[i].shelvesFlag="SHELVES_OFF";
//						
//						break;
//					}else if(this.state.listsAll[i].bannerCode==bannerCode&&shelvesFlag=="SHELVES_ON"){
//						
//						curdata[i].shelvesFlag="SHELVES_ON";
//						dataSource.unshift(curdata[i]);
//						break;
//					}
//					
//				}
//				
//				this.setState({"listsAll":curdata,"listsHasOnline":dataSource});
//          	
//			}
            
            message.success(`操作成功！`);
            this.fetchFn("1",this.state.bannerTitle,"","");
            this.fetchFn("2",this.state.bannerTitle, this.state.page, this.state.pageSize);
        } else {
            message.error(`操作失败！`);
        }
	}
    componentDidMount() {
        if (util.operationTypeCheck('RETRIEVE')) {
            this.fetchFn("1",this.state.bannerTitle,"","");
            this.fetchFn("2",this.state.bannerTitle, this.state.page, this.state.pageSize);
        } else {
            message.error('您没有权限查看该数据！');
        }

    }
    //搜索框
    bannerSearch(value) {
    	
        this.setState({
            bannerTitle: value
        })
        this.fetchFn(this.state.activeKey,value, 0, this.state.pageSize);
    }

    arrowUp = (n) => {
        if (util.operationTypeCheck('UPDAT')) {
            if (n == 0) {
                message.error(`不可向上移！`);
            } else {
                var lists = this.state.listsHasOnline;
                console.log(lists);
                var doc = {
                    moveInModuleCode: lists[n - 1].bannerCode,
                    moveInResult: lists[n].idx,
                    moveOutModuleCode: lists[n].bannerCode,
                    moveOutResult: lists[n - 1].idx,
                    moveType: 'eb_operation_banner',
                    uid: localStorage.uid,
                    token: localStorage.token
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
            listsHasOnline: data.data
        });
       
    }

	changeTabs = (activeKey) => {
        
		this.setState({
            activeKey: activeKey
        });
//		if(activeKey=="1"){
//			console.log(1)
//			this.fetchFn("1",this.state.bannerTitle,'','');
//		}else{
//			console.log(2)
//			this.fetchFn("2",this.state.bannerTitle, this.state.page, this.state.pageSize);
//		}
	}
    arrowDown = (n) => {
        if (util.operationTypeCheck('UPDAT')) {
            if (n == this.state.bannerOnlineList_SHELVES_ON.length -1) {
                message.error(`不可向下移！`);
            }else {
                var lists = this.state.listsHasOnline;
                console.log(lists);
                var doc = {
                    moveInModuleCode: lists[n].bannerCode,
                    moveInResult: lists[n + 1].idx,
                    moveOutModuleCode: lists[n + 1].bannerCode,
                    moveOutResult: lists[n].idx,
                    moveType: 'eb_operation_banner',
                    uid: localStorage.uid,
                    token: localStorage.token
                }
                this.arrowFetchFn(doc);
            }
        } else {
            message.error('您没有权限操作该数据！');
        }

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
					this.fetchFn("1",this.state.bannerTitle,"","");
				} else {
					message.error(response.message)
				}
			})
	}
    render() {
        
        const columns = [{
            title: '图片标题',
            width: '10%',
            dataIndex: 'bannerTitle',
            className:'td_hide',
            render: (text, record) =>{
                return(
                    <Popover
                        placement="top"
                        title={null}
                        content={
                            record.bannerTitle
                        }
                    >
                        <span>{record.bannerTitle}</span>
                    </Popover>
                )
            }
        }, {
            title: '修改时间',
            width: '15%',
            dataIndex: 'updateTime'
        }, {
            title: '目标类型',
            width: '10%',
            render: (text, record) => {
                if (record.targetType == 'BOOK_LIST') {
                    return (
                        <span>推荐专栏</span>
                    )
                } else if (record.targetType == 'SYSTEM_INTERFACE') {
                    return (
                        <span>系统界面</span>
                    )
                } else if (record.targetType == 'H5') {
                    return (
                        <span>H5页面</span>
                    )
                } else if (record.targetType == 'BOOK_DETAIL') {
                    return (
                        <span>图书详情</span>
                    )
                } else if (record.targetType == 'BOOK_PACKAGE_DETAIL') {
                    return (
                        <span>图书包详情</span>
                    )
                } else if (record.targetType == 'COURSE_DETAIL') {
                    return (
                        <span>课程详情</span>
                    )
                }

            }
        }, {
            title: '目标链接',
            width: '10%',
			render: (text, record) => {
                if (record.searchPageName == '') {
                    return (
                        <span>{record.targetPage}</span>
                    )
                } else {
                    return (
                        <span>{record.searchPageName}</span>
                    )
                }

            }
            
        },
         {
            title: '展示状态',
            width: '10%',
            dataIndex:'showFlag',
            render: (text, record) => {
                let txt = ''
                switch (text) {
                    case 'SHOW_OFF':
                        txt = '未发布';
                        break;
                    case 'SHOW_ON':
                        txt = '已发布';
                        break;
                    case 'SHOW_OFF_UPDATE':
                        txt = '修改未发布';
                        break;
                    case 'SHOW_OFF_DOWN':
                        txt = '下线未发布';
                        break;
                    default:
                        txt = '-';
                }
                return txt;

            }

            
        },
        
        {
            title: '渠道',
            width: '10%',
            render: (text, record) => {
                var curCode=record.channelCodes.split("/");
                if(curCode.length>3){
                   var _channelCodes=curCode.slice(0,3).join("/")+"..."
                }else{
                    var _channelCodes=record.channelCodes;
                }
              
              
                return (
                    <span title={record.channelCodes}>{_channelCodes}</span>
                )
               

            }

            
        },
        {
            title: '平台',
            width: '10%',
            render: (text, record) => {
            	if(record.platformCode==''){
                	var _platformCode='-';
                }else{
                	var curCode=record.platformCode;
                	
                	var curCode2=(curCode.replace("APP","移动客户端")).replace("HD","HD客户端");
	             	
	                var curCode3=curCode2.split(",");
	              
	                if(curCode3.length>3){
	                   var _platformCode=curCode3.slice(0,3).join("/")+"..."
	                }else{
	                    var _platformCode=curCode3.join("/");
	                }
                }
            
              
              
                return (
                    <span title={record.platformCode}>{_platformCode}</span>
                )
               

            }

            
        },
        {
            title: '操作',
            width: '15%',
            render: (text, record) => {
                let url = '/home/addBannerPic/' + record.bannerCode;
				if(this.state.activeKey=="1"){
					return (
	                    <div style={{ textAlign: 'center' }} className='m-icon-type'>
	                        <Link to={url} style={{ marginRight: 20 }}  target="_blank"><span className='i-action-ico i-edit'></span></Link>
                            <span 
                                className='i-action-ico i-up' 
                                style={{ marginRight: 20 }} 
                                onClick={() =>{
                                    if(record.shelvesFlag === 'SHELVES_OFF'){
                                        message.warning('不可做排序操作！')
                                    }else{
                                        this.arrowUp(record.id - 1)
                                    }
                                   
                                }}
                            ></span>
                            <span 
                                className='i-action-ico i-down'
                                onClick={() =>{
                                    if(record.shelvesFlag === 'SHELVES_OFF'){
                                        message.warning('不可做排序操作！')
                                    }else{
                                        this.arrowDown(record.id - 1)
                                    }
                                   
                                }} 
                            ></span>
	                    </div>
	                )
				}else{
					 return (
	                    <div style={{ textAlign: 'center' }} className='m-icon-type'>
	                        <Link to={url} style={{ marginRight: 20 }} target="_blank"><span className='i-action-ico i-edit'></span></Link>
	                        
	                        <Popconfirm title="确定删除吗?" onConfirm={() => this.onDelete(record.bannerCode,record.shelvesFlag)}>
	                            <span className='i-action-ico i-delete'></span>
	                        </Popconfirm>
	                    </div>
	                )
				}
               
            }
        },{
            title: '状态操作',
            width: '10%',

            render: (text, record) => {
                if (record.shelvesFlag == 'SHELVES_ON') {
                    return (
                    	<Popconfirm title="确定下线吗?" onConfirm={() => this.UpDownOpera(record.bannerCode,"SHELVES_OFF",record.showFlag)}>
	                        <span style={{"color":"#40a9ff","cursor":"pointer","fontWeight":"bold"}}>下线</span>
	                    </Popconfirm>
                        
                    )
                } else {
                    return (
                    	<Popconfirm title="确定上线吗?" onConfirm={() => this.UpDownOpera(record.bannerCode,"SHELVES_ON",record.showFlag)}>
	                        <span style={{"color":"#40a9ff","cursor":"pointer","fontWeight":"bold"}}>上线</span>
	                    </Popconfirm>
                        
                    )
                }

            }
        }
        ]
        console.log(this.state.listsHasOnline)
        const { selectedRowKeys } = this.state

        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange
        }

        const pagination = {
            total: this.state.total,
            showSizeChanger: false,
            onShowSizeChange(current, pageSize) {
                console.log('Current: ', current, '; PageSize: ', pageSize)
            }
        }
        const pagination2 = {
            showSizeChanger: true,
            showQuickJumper: true,
            defaultPageSize: 8,
            pageSizeOptions: ['8', '40', '60', '80', '100'],
            showTotal: () => { return `共${this.state.total}条` }
            // 分页加载
            // onChange : (page, pageSize)=>{this.fn(page, pageSize)}
        }
        const table_box = {
          margin : "0px 0px 0px 0px"
        }
        return (
            <div>
                <p className="m-title">banner管理</p>
                <div className="m-rt-content">
                    <Link to="/home/addBannerPic/0" className='m-btn-add intervalRight'><Button type="primary" className="u-btn-add"><Icon type="plus" />添加新图片</Button></Link>
                    
                    <Search placeholder="搜索" enterButton className="searchWidth" onSearch={value => this.bannerSearch(value)} />
                  
                   	<Tabs defaultActiveKey="1" onChange={this.changeTabs} style={{width:"100%"}}>
				      <TabPane tab={<span>已上线banner</span>} key="1">
				        	<div style={table_box}>
                                <Spin tip="加载中..." spinning={this.state.loading} size="large" style={{ zIndex: 9999 }}>
                                    <Table 
                                        style={{"marginTop":"4px"}}
                                        rowKey={"id"} columns={columns}
                                        dataSource={this.state.listsHasOnline} 
                                        bordered pagination={false} 
                                        className="t-nm-tab" scroll={{ y: 570 }} 
                                        rowClassName={(record, index) => {
                                            if (record.shelvesFlag === 'SHELVES_OFF') {
                                                return 'el-tr-gary'
                                            } 
                                        }}
                                    />
			                    </Spin>
        	   			</div>
				      </TabPane>
				      <TabPane tab={<span>全部banner</span>} key="2">
				        	<div style={table_box}>
                                <Spin tip="加载中..." spinning={this.state.loading} size="large" style={{ zIndex: 9999 }}>
			                        <Table style={{"marginTop":"4px"}} columns={columns} rowKey={"id"} dataSource={this.state.listsAll} bordered pagination={false} className="t-nm-tab" scroll={{ y: 570 }} />
			                    </Spin>
        	   			</div>
				      </TabPane>
				    </Tabs>
                    
        	   			
                    <div className="m-pagination-box">
                        {util.operationTypeCheck('RETRIEVE')&&this.state.activeKey=="2" ? <Pagination pageSizeOptions={['20', '40', '60', '80', '100']} showSizeChanger showQuickJumper showTotal={total => `共 ${this.state.total} 条`} className="m-pagination" defaultPageSize={20} defaultCurrent={1} current={this.state.current} total={this.state.pageMax} onChange={this.pageChangeFun} onShowSizeChange={this.pageSizeFun} /> : null}
                    </div>
                    {/* {
						this.state.activeKey == "1" && <p style={{ marginTop: 10, textAlign: 'center' }}>
							<Button type='primary' onClick={() => { this.showConfirm() }}>发布</Button>
						</p>
					} */}
                </div>
            </div>
        )
    }
}
export default bannerList