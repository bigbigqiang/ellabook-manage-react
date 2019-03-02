/*
 	created by 张亚 at 2018/8/26
 	用户足迹页面
 */

import React from 'react'
import {Table,Pagination,Spin,Modal, Button,Popover} from 'antd';
import "./userFootPrint.css"
import RemarkVoice from './remarkVoice.js'
import getUrl from "../util.js"
import $ from 'jquery'
import { dataString } from '../commonData.js'
const confirm = Modal.confirm;

export default class RemarkDetail extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
        	userFootInfor:[],	//订单详情的数据
        	pageMax:0,		//数据总数
        	remarkContent:[],	//判断是语音 或者 文字评论
        	loading:true,
        	pageSizeNow:20,
        	pageLengthNow:0,
        }
        this.pageChangeFun = this.pageChangeFun.bind(this);
        this.pageSizeChangeFun = this.pageSizeChangeFun.bind(this);
    }
    
    //即将插入本组件时，开始请求数据，准备渲染
    componentWillMount(){
    	this.getuserFootPrintInfor(0,20);
    }
    
    
    getuserFootPrintInfor(pageNumber,pageSize){
      	var theUid = this.props.uid;
    	console.log(theUid);
    	
    	this.setState({
			loading:true
		})
    	
    	fetch(getUrl.url, {
			method: "POST",
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: "method=ella.operation.listUserBehaviorAnalysis" + "&content=" + JSON.stringify({
				"uid": theUid,
				"dayNum":7,
				"page":pageNumber,
				"pageSize":pageSize
			})+dataString
		})
		.then((response)=>{
			
			return response.json();
		})
		.then((response)=>{
			console.log(response);
			if (response.status == 1) {
				
				this.setState({
					userFootInfor:response.data.list,
					pageMax: response.data.total,
					loading:false,
					pageLengthNow:response.data.list.length
					
					
				})
			}
		})
   	}
    
    //换页时，更新内容
    pageChangeFun(pageNumber) {
	  	console.log('Page: ', pageNumber);
	  	
	  	this.getuserFootPrintInfor(pageNumber-1,this.state.pageSizeNow);
	}
    pageSizeChangeFun(current,size){
    	this.setState({
    		pageSizeNow:size
		})
    	this.getRemarkInfor(current-1,size);
    }

    
    render(){
    	var thisTrue = this;
    	var columns = [{
		  	title: '时间',
		  	dataIndex: 'operateTime',
			key: 'operateTime',
			width:'25%'
			
		}, {
		  	title: 'IP地址',
		  	dataIndex: 'ipAddress',
			key: 'ipAddress',
			width:'25%',
			render: (text, record) => {
				return(
					
						<span>{record.ipAddress==null?'-':record.ipAddress}</span>
					
				)
			}
			
		}, {
		  	title: '操作事件',
		  	dataIndex: 'operateType',
			key: 'operateType',
			width:'25%'
			
		},{
		  	title: '操作描述',
		  	dataIndex: 'operateContent',
			key: 'operateContent',
			width:'25%',
			className:'td_hide',
			render: (text, record) => {
				return(
					<Popover content={(<span>{record.operateContent}</span>)}>
						<span>{record.operateContent}</span>
					</Popover>
				)
			}
		}];
		return (
			<div className="userDetail">
				<Spin spinning={this.state.loading} size="large">
					<div className="remarkDetailIn">
						<Table className="t-nm-tab" dataSource={this.state.userFootInfor} columns={columns} pagination={false} scroll={{ y: ((this.state.pageLengthNow > 15) ? 640:0) }} />
						<div className="paixu">
							<Pagination className="paixuIn" showSizeChanger pageSizeOptions={['20','50','100','200','500','1000']}  defaultPageSize={20} defaultCurrent={1} total={this.state.pageMax} onChange={this.pageChangeFun} showQuickJumper={true} onShowSizeChange={this.pageSizeChangeFun} />
						</div>
					</div>
				</Spin>
			</div>
		);
	}
}
