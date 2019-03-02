/*
 	created by NiePengfei at 2017/12/6
 		图书——分类排序——分类详情
 */

import React from 'react'
import {Table,Select,DatePicker,Button,Input ,Spin,Pagination } from 'antd';
import "./classifyDetail.css"
import getUrl from "../util.js"
import { dataString } from '../commonData.js'
const { Option, OptGroup } = Select;
const Search = Input.Search;
export default class PrizeBooks extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
        	loading:true,
        	allBooksDetail:[],
        	pageNow:0,
        	pageSize:20,
        	pageMax:0,
        	pageLengthNow:0
        }
        this.pageChangeFun = this.pageChangeFun.bind(this);
        this.pageSizeChangeFun = this.pageSizeChangeFun.bind(this);
        this.getAllBooks = this.getAllBooks.bind(this);
    }
    
    //即将插入本组件时，开始请求数据，准备渲染
    componentWillMount(){
    }
    
    //虚拟dom变成真实dom之后，开始绑定事件
    componentDidMount(){
    	this.setState({
			loading:false
		});
		console.log(this.props.classifySortCode);
    	this.getAllBooks(0,20);
    } 
    
    //获取所有图书分类的信息
    getAllBooks(pageNow,pageSize){
    	this.setState({
			loading:true
		});
    	var thisTrue = this;
    	fetch(getUrl.url, {
			method: "POST",
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: "method=ella.operation.getBookPrizeBookList" + "&content=" + JSON.stringify({
				prizeCode:this.props.prizeCode,
				pageVo:{
					"page" : pageNow,
					"pageSize" : pageSize
				}
			})+dataString
		})
		.then(function(response){
			console.log(response);
			return response.json();
		})
		.then(function(response){
			console.log(response);
			if (response.status == 1) {
				//修改字段显示
				for (let z=0;z<response.data.bookList.length;z++) {
					if (response.data.bookList[z].goodsState == "SHELVES_WAIT") {
						response.data.bookList[z].goodsState = "待上架";
					}else if (response.data.bookList[z].goodsState == "SHELVES_ON") {
						response.data.bookList[z].goodsState = "已上架";
					}else if (response.data.bookList[z].goodsState == "PRE_SALE") {
						response.data.bookList[z].goodsState = "预售";
					}else if (response.data.bookList[z].goodsState == "SHELVES_OFF") {
						response.data.bookList[z].goodsState = "已下架";
					}
				}
				
				thisTrue.setState({
					allBooksDetail : response.data.bookList,
					pageMax : response.data.total,
					pageLengthNow:response.data.bookList.length
				})
				if (response.data.total <=20) {
					document.getElementsByClassName("paixu")[0].style.opacity = "0";
				}else{
					document.getElementsByClassName("paixu")[0].style.opacity = "1";
				}
			}
			thisTrue.setState({
				loading:false
			});
		})
    }
    
    //换页时，更新内容
    pageChangeFun(pageNumber) {
	  	console.log('Page: ', pageNumber);
	  	this.setState({
			pageNow:pageNumber-1
		})
	  	this.getAllBooks(pageNumber-1,this.state.pageSize);
	}
    
    pageSizeChangeFun(current, size){
    	this.setState({
			pageSize:size,
			pageNow:current-1
		})
	  	this.getAllBooks(current-1,size);
    }
    
    
    render(){
    	var thisTrue = this;
    	var columns = [{
		  	title: '图书名称',
		  	dataIndex: 'bookName',
		  	key: 'bookName'
		}, {
		  	title: '创建时间',
		  	dataIndex: 'createTime',
		  	key: 'createTime',
		},{
		  	title: '图书状态',
		  	dataIndex: 'shelvesFlag',
		  	key: 'shelvesFlag',
		  	render: (text, record) => {
              	return <span>{record.shelvesFlag=="SHELVES_ON"?"已上架":"未上架"}</span>

            }
		}];
		return (
			<div className="classifyDetail">
				<Spin spinning={this.state.loading} size="large">
					<div className="g-bookTable">
						<Table className="t-nm-tab" dataSource={this.state.allBooksDetail} columns={columns} pagination={false} scroll={{ y: ((this.state.pageLengthNow > 14) ? 600:0) }} />
						<div className="paixu">
							<Pagination className="paixuIn" current={this.state.pageNow+1} showSizeChanger pageSizeOptions={['20','40','60','80','100']} defaultPageSize={20} defaultCurrent={1} showTotal={total => `共 ${total} 条`} total={this.state.pageMax} onChange={this.pageChangeFun} showQuickJumper={true} onShowSizeChange={this.pageSizeChangeFun} />
						</div>
					</div>
				</Spin>
			</div>
		);
	}
}
