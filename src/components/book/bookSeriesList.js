/*
 	created by NiePengfei at 2017/12/6
 		图书——分类排序——分类详情
 */

import React from 'react'
import {Table,Select,Input ,Spin,Pagination } from 'antd';
import "./classifyDetail.css"
import getUrl from "../util.js"
import { dataString } from '../commonData.js'
export default class BookSeriesList extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
        	loading:true,
        	allBooksDetail:[]
        }
    }
    
    //即将插入本组件时，开始请求数据，准备渲染
    componentWillMount(){
    }
    
    //虚拟dom变成真实dom之后，开始绑定事件
    componentDidMount(){
    	this.setState({
			loading:false
		});
    	this.getAllBooks();
    } 
    
    //获取所有图书分类的信息
    getAllBooks(){
    	this.setState({
			loading:true
		});
    	var thisTrue = this;
    	fetch(getUrl.url, {
			method: "POST",
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: "method=ella.operation.getBookList" + "&content=" + JSON.stringify({
				seriesCode:this.props.seriesCode
			})+dataString
		})
		.then(function(response){
			return response.json();
		})
		.then(function(response){
			console.log(response);
			if (response.status == 1) {			
				thisTrue.setState({
					allBooksDetail : response.data,
				})
			}
			thisTrue.setState({
				loading:false
			});
		})
    }
    
    
    render(){
    	var thisTrue = this;
    	var columns = [
			{
				title: '图书ID',
				dataIndex: 'bookCode',
				key: 'bookCode'
		  	},
			{
				title: '图书名称',
				dataIndex: 'bookName',
				key: 'bookName'
			},
			{
				title: '图书状态',
				dataIndex: 'goodsState',
				key: 'goodsState',
				render: (text, record) => {
					return <span>{text=="SHELVES_ON"?"已上架":text=="SHELVES_WAIT"?"待上架":text=="SHELVES_OFF"?"已下架":"-"}</span>

				}
			}
		];
		return (
			<div className="classifyDetail">
				<Spin spinning={this.state.loading} size="large">
					<div className="g-bookTable">
						<Table className="t-nm-tab" dataSource={this.state.allBooksDetail} columns={columns} pagination={false} scroll={{ y: ((this.state.allBooksDetail.length > 10) ? 600:0) }} />
					</div>
				</Spin>
			</div>
		);
	}
}
