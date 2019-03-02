/**
 * Created by Administrator on 2017-10-25.
 */
import React from 'react'
import { Table, Icon, Button, Popconfirm, message, Spin,Modal, Input, Col, Select, Pagination,Popover } from 'antd'
import { Link } from 'react-router'
// require('babel-polyfill')
// require('es6-promise').polyfill()
const Search = Input.Search;
const { TextArea } = Input;
import getUrl from "../util.js";
import commonData from '../commonData.js';
import 'whatwg-fetch'
import PrizeBooks from './prizeBooks.js'
var util = require('../util.js');
class BookPrize extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
           	
           
            selectedRowKeys: [],
            pageIndex: 0,
            minheight: '',
            loading: false,
            pageMax: 0,
            page: '0',
            pageSize: '20',
            current: 1,
            bannerTitle: '',
            
            
            
            bookPrizeList: [],
            prizeName:'',
            visible:false,
            visible2:false,
            introduction:'',
            prizeCode:'',
            searchPrizeName:'',
            curPrizeCode:''
           
        }
        this.changeFn = this.changeFn.bind(this);
        this.pageChangeFun = this.pageChangeFun.bind(this);
        this.pageSizeFun = this.pageSizeFun.bind(this);
    }
	
    componentDidMount() {
        if (util.operationTypeCheck('RETRIEVE')) {
            this.fetchFn(this.state.searchPrizeName, this.state.page, this.state.pageSize);
        } else {
            message.error('您没有权限查看该数据！');
        }

    }
    pageSizeFun(current, pageSize) {
        this.setState({
            pageSize: pageSize,
            page: current - 1,
            current: current
        }, () => {
            this.fetchFn(this.state.bannerTitle, this.state.page, this.state.pageSize);
        });
    }
    pageChangeFun(pageNum) {
        this.setState({
            page: pageNum - 1,
            current: pageNum

        }, () => {
            this.fetchFn(this.state.bannerTitle, this.state.page, this.state.pageSize);
        });
    }

    fetchFn = (searchPrizeName, page, pageSize) => {
        this.setState({
            loading: true
        });
        util.API({ "prizeName": searchPrizeName, "pageVo": { "page": page, "pageSize": pageSize }},"ella.operation.getBookPrizeList")
       .then(response=>{
                console.log(response);
                return response.json();
            })
            .then(response=>{
               
                console.log(response);
                if (response.status == 1) {
                    this.setState({
                        bookPrizeList: response.data.bookPrizeList,
                    
                        loading: false,
                        total: response.data.total,
                        pageMax: response.data.total,
                        current:response.data.currentPage
                    }, () => {

                    if (response.data.bookPrizeList.length > 12) {
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
            })
            
			
	       
       
    }
    fetchbookPrizeDetail = async (prizeCode) => {
        
        var data = await fetch(util.url, {
            method: 'POST',
            headers: {
                "Content-type": "application/x-www-form-urlencoded"
            },
            mode: 'cors',
            body: "method=ella.operation.getBookPrizeByCode" + "&content=" + JSON.stringify({"prizeCode":prizeCode}) + commonData.dataString
        })
            .then(function (res) {

                return res.json();
            });
			this.setState({
				"prizeName":data.data.prizeName,
				"introduction":data.data.introduction,
				"prizeCode":data.data.prizeCode
			})
	       
       
    }
    
    changeFn = (pagination) => {
        console.log(pagination.current);
        this.fetchFn(pagination.current - 1);
    }

    deleteFn = async (prizeCode) => {
        const dataSource = [...this.state.bookPrizeList];
        var doc = {
            prizeCode: prizeCode,
        }
        var data = await fetch(util.url, {
            method: 'POST',
            headers: {
                "Content-type": "application/x-www-form-urlencoded"
            },
            mode: 'cors',
            body: "method=ella.operation.delBookPrizeByCode" + "&content=" + JSON.stringify(doc) + commonData.dataString
        })
            .then(function (response) {
                return response.json();
            });
        if (data.status == 1) {

            const cur = this.state.total - 1;
            this.setState({ bookPrizeList: dataSource.filter(item => item.prizeCode !== prizeCode), total: cur });
            message.success(`删除成功！`);
        } else {
            message.error(`删除失败！`);
        }
    }

    onDelete = (prizeCode) => {
        if (util.operationTypeCheck('DELETE')) {
            this.deleteFn(prizeCode);
        } else {
            message.error('您没有权限删除该数据！');
        }
    }

    //搜索框
    prizeSearch(value) {
        this.setState({
            searchPrizeName: value
        })
        this.fetchFn(value, 0, this.state.pageSize);
    }


	//保存操作
    saveAndClose(){
    	
//  	if(this.state.prizeName.length<2||this.state.prizeName.length>10){
//  		message.error('奖项名称限制2~10个中文字符');
//  		return;
//  	}
    	if(this.state.introduction==''){
    		message.error('请填写简介');
    		return;
    	}
        var doc = {
            prizeCode:this.state.prizeCode,
           	introduction:this.state.introduction,
           	prizeName:this.state.prizeName
        };
        fetch(util.url, {
            method: 'POST',
            headers: {
                "Content-type": "application/x-www-form-urlencoded"
            },
            mode: 'cors',
            body: "method=ella.operation.saveAndUpdateBookPrize" + "&content=" + JSON.stringify(doc) + commonData.dataString
        })
          .then((response)=>{
			console.log(response);
			return response.json();
		})
		.then((response)=>{
			if (response.status == 1) {
				message.success('操作成功!');
				this.fetchFn(this.state.searchPrizeName, this.state.page, this.state.pageSize);
	            setTimeout(() => {
	                this.setState({visible:false})
	            }, 1000)
			}else{
				message.error(response.message);
			}
		})
        
    }
    toDate(number) {
        var n = number * 1;
        var date = new Date(n);
        var Y = date.getFullYear() + '-';
        var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        var D = date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate() + ' ';
        var h = date.getHours() < 10 ? '0'+ date.getHours() : date.getHours() + ':';
        var m = date.getMinutes() < 10 ? '0'+ date.getMinutes() : date.getMinutes() + ':';
        var s = date.getSeconds() < 10 ? '0'+ date.getSeconds() : date.getSeconds();
        return (Y + M + D +h + m + s)
    }
    render() {
    	console.log(this.state.bookPrizeList)
        const columns = [{
            title: '获奖名称',
            width: '10%',
            dataIndex: 'prizeName',
            className:'td_hide',
	        render: (text, record) =>{
	            return(
	                <Popover
	                    placement="top"
	                    title={null}
	                    content={
	                        record.prizeName
	                    }
	                >
	                    <span>{record.prizeName}</span>
	                </Popover>
	            )
	        }

        },
        {
            title: '修改时间',
            width: '10%',
            dataIndex: 'updateTime',
            render: (text, record) => {
            	
              return <span>{record.updateTime==null?'':this.toDate(record.updateTime)}</span>

            }
           
        }, {
            title: '图书',
            width: '10%',
            dataIndex: 'bookPrizeQuantity',
            render: (text, record) => {
              return <Link style={{"text-decoration":"underline"}} onClick={()=>this.setState({"visible2":true,"curPrizeCode":record.prizeCode})}>{record.bookPrizeQuantity}</Link>

            }
        },
        {
            title: '操作',
            width: '10%',
            render: (text, record) => {
                return (
                    <div style={{ textAlign: 'center' }} className='m-icon-type'>
                        <span className='i-action-ico i-edit' style={{ marginRight: '20px' }} onClick={()=>{this.setState({"visible":true});this.fetchbookPrizeDetail(record.prizeCode)}}></span>
                   
                        <Popconfirm title="确定删除吗?" onConfirm={() => this.onDelete(record.prizeCode)}>
                            <span className='i-action-ico i-delete'></span>
                        </Popconfirm>
					
                    </div>
                )
            }
        }]

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
        return (
            <div>
                <p className="m-title">图书大奖</p>
                <div className="m-rt-content">
                   
                   	<Button type="primary" className="u-btn-add m-btn-add intervalBottom intervalRight" style={{"background": "#675ca8","border": "1px solid #675ca8"}} 
	                   	onClick={()=>{
	                   		this.setState({
	                   			visible:true,  
	                   			prizeName:'',	
	            				introduction:'',
	            				prizeCode:''
	            			})
	                   	}}><Icon type="plus" />添加新奖项</Button>
                    
                    <Search placeholder="搜索" enterButton className="searchWidth intervalBottom" onSearch={value => this.prizeSearch(value)} />
                    <Spin tip="加载中..." spinning={this.state.loading} size="large" style={{ zIndex: 9999 }}>
                        <Table columns={columns} dataSource={this.state.bookPrizeList} bordered pagination={false} className="t-nm-tab" scroll={{ y: 570 }} />
                    </Spin>
                    <div className="m-pagination-box">
                        {util.operationTypeCheck('RETRIEVE') ? <Pagination pageSizeOptions={['20', '40', '60', '80', '100']} showSizeChanger showQuickJumper showTotal={total => `共 ${this.state.total} 条`} className="m-pagination" defaultPageSize={20} defaultCurrent={1} current={this.state.current} total={this.state.pageMax} onChange={this.pageChangeFun} onShowSizeChange={this.pageSizeFun} /> : null}
                    </div>
                    <Modal
						visible={this.state.visible}
						title="新图书大奖"
						onCancel={()=>this.setState({visible:false})}
						footer={null}
						width={740}
					>
					
	                    <div className="authorDetail">
							<Spin spinning={this.state.loading} size="large">
								<div className="authorContent">
									<div>
										<span>奖项名称:</span>
										<Input value={this.state.prizeName} style={{ width: 300 }}  onChange={(e)=>this.setState({"prizeName":e.target.value})}/>
									</div>
									
									<div className="m-jianjie">
										<span>　　简介:</span>
										<i>　　　　</i>
										<TextArea value={this.state.introduction} autosize={{ minRows: 1, maxRows: 20 }} onChange={(e)=>this.setState({"introduction":e.target.value})} style={{ height:158, width: 500}}/>
									</div>
									
									<Button  className="saveAuthorBtn" onClick={()=>this.saveAndClose()}>保存</Button>
								</div>
							</Spin>
						</div>
						
					</Modal>
					<Modal
			          	visible={this.state.visible2}
			          	title="图书"
			          	onCancel={()=>this.setState({visible2:false})}
			          	footer={null}
			          	width={1000}
			        >
			        	{this.state.visible2&&<PrizeBooks prizeCode={this.state.curPrizeCode}></PrizeBooks>}
			        </Modal>
                </div>
            </div>
        )
    }
}
export default BookPrize