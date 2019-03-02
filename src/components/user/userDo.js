/*
 	created by NiePengfei at 2017/11/16
 	用户足迹页面
 */

import React from 'react'
import {Table,Pagination,Spin} from 'antd';
import "./userDo.css"
import $ from 'jquery'


const columns = [{
  	title: '操作时间',
  	dataIndex: 'aaa',
  	key: 'aaa',
}, {
  	title: '平台',
  	dataIndex: 'bbb',
  	key: 'bbb',
}, {
  	title: '设备',
  	dataIndex: 'ccc',
  	key: 'ccc',
},{
  	title: '操作动作',
  	dataIndex: 'ddd',
  	key: 'ddd',
}];
export default class UserDo extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
        	remarkInfor:[],	//订单详情的数据
        	pageMax:0,			//数据总数
        	loading:true,
        	pageSizeNow:20,
        }
        this.pageChangeFun = this.pageChangeFun.bind(this);
        this.pageSizeChangeFun = this.pageSizeChangeFun.bind(this);
    }
    
    //即将插入本组件时，开始请求数据，准备渲染
    componentWillMount(){
    	this.getReadInfor(0);
    }
    
    //虚拟dom变成真实dom之后，开始绑定事件
    componentDidMount(){
    	var thisTrue = this;
    	thisTrue.setState({
			loading:false
		})
    	document.getElementsByClassName("paixu")[0].style.opacity="0";
    } 
    
    //获取宝宝阅读历史的信息,childName指定宝宝历史，传空为所有数据
    getReadInfor(pageNumber,pageSize){
    	var theUid = this.props.uid;
    	console.log(theUid);
    	var thisTrue = this;
    	
    	//待做，数据还没有
   	}
    //换页时，更新内容
    pageChangeFun(pageNumber) {
	  	console.log('Page: ', pageNumber);
	  	
	  	this.getReadInfor(pageNumber-1,this.state.pageSizeNow);
	}
    pageSizeChangeFun(current,size){
    	this.setState({
    		pageSizeNow:size
		})
    	this.getReadInfor(current-1,size);
    }
    
    render(){
		return (
			<div className="userDo">
				<Spin spinning={this.state.loading} size="large">
					<div className="userDoIn">
						<Table className="t-nm-tab" dataSource={this.state.remarkInfor} columns={columns} pagination={false} scroll={{ y: ((this.state.pageMax > 15) ? 580:0) }}  />
						<div className="paixu">
							<Pagination className="paixuIn" showSizeChanger pagination={false} pageSizeOptions={['20','50','100','200','500','1000']} defaultPageSize={20} defaultCurrent={1} total={this.state.pageMax} showTotal={total => `共 ${total} 条`} onChange={this.pageChangeFun} showQuickJumper={true} onShowSizeChange={this.pageSizeChangeFun} />
						</div>
					</div>
				</Spin>	
			</div>
		);
	}
}
