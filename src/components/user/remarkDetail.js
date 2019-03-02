/*
 	created by NiePengfei at 2017/11/16
 	评论记录页面
 */

import React from 'react'
import {Table,Pagination,Spin,Modal, Button,Popover} from 'antd';
import "./remarkDetail.css"
import RemarkVoice from './remarkVoice.js'
import getUrl from "../util.js"
import { dataString } from '../commonData.js'
const confirm = Modal.confirm;

export default class UserFootprints extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
        	remarkInfor:[],	//订单详情的数据
        	pageMax:0,		//数据总数
        	remarkContent:[],	//判断是语音 或者 文字评论
        	loading:true,
        	pageSizeNow:20,
        	pageLengthNow:0,
        }
        this.pageChangeFun = this.pageChangeFun.bind(this);
        this.pageSizeChangeFun = this.pageSizeChangeFun.bind(this);
        this.delateTheRemark = this.delateTheRemark.bind(this);
    }
    
    //即将插入本组件时，开始请求数据，准备渲染
    componentWillMount(){
    	this.getRemarkInfor(0,20);
    }
    
    
    getRemarkInfor(pageNumber,pageSize){
      	var theUid = this.props.uid;
    	var thisTrue = this;
    	thisTrue.setState({
			loading:true
		})
    	
    	fetch(getUrl.url, {
			method: "POST",
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: "method=ella.operation.userCommentManage" + "&content=" + JSON.stringify({
				"uid": theUid,
				"page":pageNumber,
				"pageSize":pageSize
			})+dataString
		})
		.then(function(response){
			console.log(response);
			return response.json();
		})
		.then(function(response){
			console.log(response);
			if (response.status == 1) {
				
				// if(response.data.total <20){
				// 	document.getElementsByClassName("paixu")[0].style.opacity="0";
				// }else{
				// 	document.getElementsByClassName("paixu")[0].style.opacity="1";
				// }
				//每次请求之后，对后台返回数据做的转换处理
				for(let x=0;x<response.data.list.length;x++){
					let zz = "";
					//处理评论星级
		    		for(let y=0;y<response.data.list[x].commentScore;y++){
			    		zz+="★";
			    	}
		    		response.data.list[x].commentScore=zz;
		    		
		    		if(response.data.list[x].commentVoiceUrl != ""){
		    			var haha = response.data.list[x].commentVoiceUrl;
		    			var theNum = x;
		    			//response.data.list[x].commentContent = <RemarkVoice voiceUrl={haha} onClick={thisTrue.onClick1}></RemarkVoice>
		    			response.data.list[x].commentContent = <RemarkVoice voiceUrl={haha} num={theNum}></RemarkVoice>
		    		}
		    	}  
				thisTrue.setState({
					remarkInfor:response.data.list,
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
	  	
	  	this.getRemarkInfor(pageNumber-1,this.state.pageSizeNow);
	}
    pageSizeChangeFun(current,size){
    	this.setState({
    		pageSizeNow:size
		})
    	this.getRemarkInfor(current-1,size);
    }
    
    delateTheRemark(thebookcode){
    	var thisTrue = this;
    	console.log(thebookcode);
    	
    	confirm({
		    title: '确定删除此条评论吗？',
		    content: '一旦删除将不可恢复！',
		    onOk() {
		    	thisTrue.setState({
					loading:true
				})
		    	fetch(getUrl.url, {
					method: "POST",
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					body: "method=ella.operation.deleteComment" + "&content=" + JSON.stringify({
						"commentCode": thebookcode,
					})+dataString
				})
				.then(function(response){
					console.log(response);
					return response.json();
				})
				.then(function(response){
					console.log(response);
					if (response.status == 1) {
						console.log("删除成功");
						thisTrue.getRemarkInfor(thisTrue.state.pageNow);
						thisTrue.setState({
							loading:false
						})
					}
				})
		    },
		    onCancel() {},
		});
    }
    
    render(){
    	var thisTrue = this;
    	var columns = [{
		  	title: '图书名称',
		  	dataIndex: 'bookName',
			key: 'bookName',
			width:'20%',
			className:'td_hide',
			render: (text, record) => {
				return(
					<Popover content={(<span>{record.bookName}</span>)}>
						<span>{record.bookName}</span>
					</Popover>
				)
			}
		}, {
		  	title: '评论星级',
		  	dataIndex: 'commentScore',
			key: 'commentScore',
			width:'20%',
		}, {
		  	title: '评论内容',
		  	dataIndex: 'commentContent',
			key: 'commentContent',
			width:'20%',
			className:'td_hide',
			render: (text, record) => {
				if(record.commentVoiceUrl==''){
					return(
						<Popover content={(<span>{record.commentContent}</span>)}>
							<span>{record.commentContent}</span>
						</Popover>
					)
				}else{
					return(
						<span>{record.commentContent}</span>
					)
				}	
			}
		},{
		  	title: '评论时间',
		  	dataIndex: 'commentTime',
			key: 'commentTime',
			width:'20%',
		},{
		  	title: '操作',
			dataIndex: '',
			width:'20%',
		  	render(text, record) {
                return(
                    <span className="theDelateBtn" onClick={thisTrue.delateTheRemark.bind(this,record.commentCode)}>删除</span>
                )
            }
		}];
		return (
			<div className="remarkDetail">
				<Spin spinning={this.state.loading} size="large">
					<div className="remarkDetailIn">
						<Table className="t-nm-tab" dataSource={this.state.remarkInfor} columns={columns} pagination={false} scroll={{ y: ((this.state.pageLengthNow > 15) ? 640:0) }} />
						<div className="paixu">
							<Pagination className="paixuIn" showSizeChanger pageSizeOptions={['20','50','100','200','500','1000']}  defaultPageSize={20} defaultCurrent={1} total={this.state.pageMax} onChange={this.pageChangeFun} showQuickJumper={true} onShowSizeChange={this.pageSizeChangeFun} />
						</div>
					</div>
				</Spin>
			</div>
		);
	}
}
