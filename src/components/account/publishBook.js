/*
 	created by NiePengfei at 2018/3/21
 		出版社--图书列表
 */

import React from 'react'
import { Table, Select, DatePicker, Button, Input, Spin, Pagination, Icon, Modal, message, Popconfirm } from 'antd';
import { Link } from 'react-router';
import "./publishBook.css"
import getUrl from "../util.js"
import commonData from '../commonData.js'
const {
	Option,
	OptGroup
} = Select;
const Search = Input.Search;

const data = [];


export default class PublishBook extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			loading: true,

			publishDetail: [],

			publishId: "",
			pageShow:true,		//是否显示分页
			pageNow:0,
        	pageSize:20,
        	pageMax:0,
		}
		this.pageChangeFun = this.pageChangeFun.bind(this);
        this.pageSizeChangeFun = this.pageSizeChangeFun.bind(this);
	}

	//即将插入本组件时，开始请求数据，准备渲染
	componentWillMount() {
		let publishId = window.location.href.split("?publishUid=")[1].split("&_k=")[0];
		this.setState({
			publishId: publishId
		}, () => {
			this.getPublishDetail(0, 20);
		});
	}

	//虚拟dom变成真实dom之后，开始绑定事件
	componentDidMount() {
		this.setState({
			loading: false
		})
	}
	pageChangeFun(pageNumber){
	  	this.setState({
			pageNow:pageNumber-1
		})
	  	this.getPublishDetail(pageNumber-1,this.state.pageSize);
    	
    }
    pageSizeChangeFun(current, size){
    	this.setState({
			pageSize:size,
			pageNow:current-1
		})
	  	this.getPublishDetail(current-1,size);
    }

	getPublishDetail(pageNow, pageSize) {
		var thisTrue = this;
		this.setState({
			loading: true,
		});

		fetch(getUrl.url, {
			method: "POST",
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: "method=ella.operation.listPublishBook" + "&content=" + JSON.stringify({
				"uid": thisTrue.state.publishId,
				"pageVo": {
					"page": pageNow,
					"pageSize": pageSize
				}
			})  + commonData.dataString
		})
		.then(function(response) {
			return response.json();
		})
		.then(function(response) {
			let newArr;
			newArr = response.data.bookList.map(function(item){
				item.editable = false;
				item.buyBookPercent=item.buyBookPercent.replace("%","");
				item.rentBookPercent=item.rentBookPercent.replace("%","");
				if (item.goodsState = "SHELVES_WAIT") {
					item.goodsState = '未上架';
				}else if (item.goodsState = "SHELVES_ON") {
					item.goodsState = '已上架';
				}else if (item.goodsState = "SHELVES_OFF") {
					item.goodsState = '已下架';
				}
				
				return item
			})
			
			if(response.status == 1) {
				thisTrue.setState({
					publishDetail: newArr,
					loading: false,
					pageMax: response.data.total,
					pageLengthNow: response.data.bookList.length
				})
			}
		})
	}
	
	
	
	

	
	//可编辑表格的编辑按钮
	edit(index) {
		
		let newArr = this.state.publishDetail;
	
		newArr[index].editable = true;
		
		this.setState({
			publishDetail: newArr,
		})
	}
	
	
	//可编辑表格的数据编辑
	onChange(e,index){
		if (e.target.value == "") {
			e.target.value = 0;	
		}
		let theValue = parseFloat(e.target.value.replace("%",""));
		let newArr = this.state.publishDetail;
		if(theValue > 100 || theValue < 0){
			message.error("买书分成区间为0-100%");
		}else{
			newArr[index].buyBookPercent = theValue;
			
			this.setState({
				publishDetail: newArr,
			})
		}
	}
	//可编辑表格的数据编辑
	onChange1(e,index){
		if (e.target.value == "") {
			e.target.value = 0;	
		}
		let theValue = parseFloat(e.target.value.replace("%",""));
		let newArr = this.state.publishDetail;
		if(theValue > 100 || theValue < 0){
			message.error("租书分成区间为0-100%");
		}else{
			newArr[index].rentBookPercent = theValue;
			
			this.setState({
				publishDetail: newArr,
			})
		}
	}
	
	//可编辑表格的保存
	bookOK(code,buy,rent,index){
		var thisTrue = this;
		this.setState({
			loading: true,
		});
		let newArr = this.state.publishDetail;
		newArr[index].editable = false;
		
		let newBuy = parseFloat(buy).toFixed(2);
		let newRent = parseFloat(rent).toFixed(2);

		fetch(getUrl.url, {
			method: "POST",
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: "method=ella.operation.updateBookPercent" + "&content=" + JSON.stringify({
				"bookCode": code,
				"buyBookPercent": newBuy,
				"rentBookPercent": newRent
			})  + commonData.dataString
		})
		.then(function(response) {
			return response.json();
		})
		.then(function(response) {
			if(response.status == 1) {
				thisTrue.setState({
					loading: false,
					publishDetail: newArr
				})
				message.success("修改成功");
			}else{
				message.error("修改失败");
			}
		})
	}
	
	//可编辑表格的取消
	bookCna(index){
		let newArr = this.state.publishDetail;
		newArr[index].editable = false;
		
		this.setState({
			publishDetail: newArr,
		})
	}
	

	render() {
		var thisTrue = this;

		const columns = [{
			title: '图书名称',
			dataIndex: 'bookName',
			width: '15%',
		}, {
			title: 'BookID',
			dataIndex: 'bookCode',
			width: '15%',
		}, {
			title: '买书分成',
			dataIndex: 'buyBookPercent',
			width: '10%',
			render(text, record,index) {
				return(
					record.editable == true ? <span><Input style={{ margin: '-5px 0' }} value={record.buyBookPercent} onChange={(e) => thisTrue.onChange(e,index)} />%</span>: <span>{record.buyBookPercent}%</span>
				)
            }
		}, {
			title: '租书分成',
			dataIndex: 'rentBookPercent',
			width: '10%',
			render: (text, record,index) => {
				return(
					record.editable == true ? <span><Input style={{ margin: '-5px 0' }} value={record.rentBookPercent} onChange={(e) => thisTrue.onChange1(e,index)} />%</span>:<span>{record.rentBookPercent}%</span>
				);
			}
		}, {
			title: '上传时间',
			dataIndex: 'createTime',
			width: '20%',
		}, {
			title: '状态',
			dataIndex: 'goodsState',
			width: '15%',
		}, {
			title: '操作',
			dataIndex: 'operation',
			width: '15%',
			render: (text, record,index) => {
				return(
					<div className="editable-row-operations">
						{
							record.editable == false ? <a onClick={() => thisTrue.edit(index)}>编辑</a>:<span>
								<a onClick={() => thisTrue.bookOK(record.bookCode,record.buyBookPercent,record.rentBookPercent,index)}>保存</a>
							　　　　  <a onClick={() => thisTrue.bookCna(index)}>取消</a>
							</span>
						}
	          		</div>
				);
			},
		}];
		
		return(
			<div className="publishBook">
				<Spin spinning={this.state.loading} size="large">
					<div className="publishTitle">
						<Link to="/publish">
	                        <Icon type="left" /> 出版社图书
	                    </Link>
					</div>
					<div className="publishContent">
						<Table className="t-nm-tab" bordered dataSource={this.state.publishDetail} columns={columns}  pagination={false} scroll={{ y: ((this.state.pageLengthNow > 14) ? 675:0) }}/>
						<div className="paixu">
							<Pagination className="paixuIn" current={this.state.pageNow+1} showSizeChanger pageSizeOptions={['20','50','100','200','500','1000']} defaultPageSize={20} defaultCurrent={1} showTotal={total => `共 ${total} 条`} total={this.state.pageMax} onChange={this.pageChangeFun} showQuickJumper={true} onShowSizeChange={this.pageSizeChangeFun} />
						</div>
					</div>
				</Spin>
			</div>
		);
	}
}