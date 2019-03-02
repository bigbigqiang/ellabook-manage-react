/*
 	created by NiePengfei at 2017/11/13
 	用户详情--宝贝信息
 */

import React from 'react'
//import ChildTab from './childTab.js'
import { Table, Pagination, Spin,message } from 'antd';
import "./shopDetail.css"
import getUrl from "../util.js"
import $ from 'jquery'
import { dataString } from '../commonData.js'
import childrenImg from '../../assets/images/user.png'


export default class ShopDetail extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			childTab: 0,
			childHtml: [],
			readBookInfor: [],	//阅读历史数据
			pageMax: 0,			//数据总条数
			childName: "",		//当前阅读历史的孩子名称
			loading: true,
			pageSizes: 20,
			pageLengthNow: 0,
			childArr: '',
			current:1,
			flag:false
		}
		this.pageChangeFun = this.pageChangeFun.bind(this);
		this.pageSizeChangeFun = this.pageSizeChangeFun.bind(this);
		this.yanchi = this.yanchi.bind(this);
		
	}

	//即将插入本组件时，开始请求数据，准备渲染
	componentWillMount() {
		
	}

	//虚拟dom变成真实dom之后，开始绑定事件
	componentDidMount() {
		var thisTrue = this;
		thisTrue.setState({
			loading: false
		})
		this.getChildInfor();
		
	}

	yanchi() {
		var thisTrue = this;
		var card = document.getElementsByClassName("childCard");
		var cardNum = card.length;

		console.log(card[0]);
		console.log(cardNum);
		for (var x = 0; x < cardNum; x++) {
			card[x].style.left = 34 * x + "%";
			card[x].className += " childCard" + x;
		}
		var clickNum = cardNum - 3;
		var clickCan = 0;
		document.getElementsByClassName("turnLeft")[0].addEventListener("click", function () {
			console.log(3);

			if ((clickNum >= 0) && (clickCan < clickNum)) {
				for (var y = 0; y < cardNum; y++) {
					var oldLeft = parseInt(card[y].style.left);
					card[y].style.left = oldLeft - 34 + "%";
				}
				clickCan++;
			}
		});
		document.getElementsByClassName("turnRight")[0].addEventListener("click", function () {
			var left0 = parseInt(document.getElementsByClassName("childCard0")[0].style.left);
			if ((clickNum >= 0) && clickCan) {
				for (var y = 0; y < cardNum; y++) {
					card[y].style.left = parseInt(card[y].style.left) + 34 + "%";
				}
				clickCan--;
			}
		});

		
	}
	NextAndPrev(type) {
		//  	console.log(this.refs.childBox.style);
		if ($(".childCard").length <= 3) {
			return;
		}
		if (type == 1) {
			$(".childOut").css({ "transform": "translate(-50%,0)" });
		} else {
			$(".childOut").css({ "transform": "translate(0,0)" });
		}


	}
	getChildInfor() {
		var w = this;
		var theUid = this.props.uid;
		console.log(theUid);
		var thisTrue = this;
		thisTrue.setState({
			loading: true
		});

		fetch(getUrl.url, {
			method: "POST",
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: "method=ella.operation.children.detail" + "&content=" + JSON.stringify({
				"uid": theUid
			}) + dataString
		})
			.then(function (response) {
				return response.json();
			})
			.then(function (response) {
				console.log(response);
				var ownData = response.data;
				if (response.status == 1) {
					console.log(response.data);
					var childNum = ownData.length;

					console.log(childNum);
					thisTrue.setState({
						childTab: childNum,
						childHtml: ownData,
						loading: false,
						childArr: response.data,
					});
					if(response.data.length>0){
						thisTrue.setState({
							childName:response.data[0].cid,
							flag:true
						});
						w.getReadInfor(0,20,response.data[0].cid);
					}
				}else{
					message.error(response.message)
					thisTrue.setState({
						loading: false
					})
				}
			})
	}

	//获取宝宝阅读历史的信息,childName指定宝宝历史，传空为所有数据
	getReadInfor(pageNumber, pageSize, childName) {
		var theUid = this.props.uid;
		console.log(theUid);
		var thisTrue = this;
		thisTrue.setState({
			loading: true
		});

		fetch(getUrl.url, {
			method: "POST",
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: "method=ella.operation.children.readHistory" + "&content=" + JSON.stringify({
				"uid": theUid,
				"cid": childName,
				"page": pageNumber,
				"pageSize": pageSize
			}) + dataString
		})
			.then(function (response) {
				console.log(response);
				return response.json();
			})
			.then(function (response) {
				console.log(response);
				if (response.status == 1) {
					// if(response.data.total <20){
					// 	document.getElementsByClassName("paixu")[0].style.opacity="0";
					// }else{
					// 	document.getElementsByClassName("paixu")[0].style.opacity="1";
					// }
					thisTrue.setState({
						readBookInfor: response.data.list,
						pageMax: response.data.total,
						loading: false,
						pageLengthNow: response.data.list.length
					})
				}else{
					message.error(response.message)
					thisTrue.setState({
						loading: false
					})
				}
			})
	}

	//换页时，更新内容
	pageChangeFun(pageNumber) {
		console.log('Page: ', pageNumber);
		this.setState({
			page:pageNumber-1,
			current:pageNumber
		},()=>{
			this.getReadInfor(this.state.page, this.state.pageSizes, this.state.childName);
		})	
	}

	pageSizeChangeFun(current, size) {
		this.setState({
			pageSizes: size,
			page:current-1,
			current:current
		},()=>{
			this.getReadInfor(this.state.page, this.state.pageSizes, this.state.childName);

		})
		
	}
	getItemHistory(cid,e){
		console.log(cid);
		// $(".childCard .cardTitle").css({ "backgroundColor": "#F0F3F4" });
		// $(".childCard .cardName").css({ "color": "black" });
		// $(e.currentTarget).find(".cardTitle").css({ "backgroundColor": "#23B7E5" });
		// $(e.currentTarget).find(".cardName").css({ "color": "white" });

		$(".childCard").css({ "border": "1px solid #E4EAEC" });
		$(e.currentTarget).find(".cardTitle").parent().css({ "border": "4px solid #23B7E5" });
		//调接口请求数据
		
		
		
		this.setState({
			childName:cid
		},()=>{
			this.getReadInfor(0, this.state.pageSizes, this.state.childName);
		})
	}

	//时间转化
	toDate(value){
		var secondTime = parseInt(value);// 秒
			var minuteTime = 0;// 分
			var hourTime = 0;// 小时
			if(secondTime >= 60) {//如果秒数大于60，将秒数转换成整数
				//获取分钟，除以60取整数，得到整数分钟
				minuteTime = parseInt(secondTime / 60);
				//获取秒数，秒数取佘，得到整数秒数
				secondTime = parseInt(secondTime % 60);
				//如果分钟大于60，将分钟转换成小时
				if(minuteTime >= 60) {
					//获取小时，获取分钟除以60，得到整数小时
					hourTime = parseInt(minuteTime / 60);
					//获取小时后取佘的分，获取分钟除以60取佘的分
					minuteTime = parseInt(minuteTime % 60);
				}
			}
			var result = "" + parseInt(secondTime)>0?parseInt(secondTime) + "秒":'';
			
			if(minuteTime > 0) {
				result = "" + parseInt(minuteTime) + "分" + result;
			}
			if(hourTime > 0) {
				result = "" + parseInt(hourTime) + "小时" + result;
			}
			return result;
		}

	render() {
		var thisTrue = this;
		const style={border:'4px solid #23B7E5'}
		const columns = [{
			title: '图书名称',
			dataIndex: 'bookName',
			key: 'bookName',
		}, {
			title: '阅读时间',
			dataIndex: 'readTime',
			key: 'readTime',
		}, {
			title: '阅读时长',
			dataIndex: 'readWhenLONG',
			render: (text, record) => {
				return (
					<span>{thisTrue.toDate(record.readWhenLONG)}</span>
				)
			},
		}, {
			title: '阅读角色',
			dataIndex: 'childrenNick',
			render: (text, record) => {
				return (
					<span>{(record.childrenNick==''||record.childrenNick==null)?'-':record.childrenNick}</span>
				)
			},
		}];
		return (
			<div className="shopDetail">
				<Spin spinning={this.state.loading} size="large">
					{!this.state.flag&&<h1 style={{textAlign:'center',marginTop:'20px'}}>该用户暂未添加宝贝</h1>}
					{
						this.state.flag&&
						<div className="shopTop">
						<div className="childList">
							<div className="childListIn">
								<div className="childOut" ref="childBox">
									{
										this.state.childArr && this.state.childArr.map((item, index)=> {
											return (
												<div className="childCard" style={index==0?style:null} onClick={this.getItemHistory.bind(this,item.cid)}>
													<div className="cardTitle">
														<div className={"cardImage cardImage"+index}>
															<img src={(item.childrenAvatar==''||item.childrenAvatar==null)?childrenImg:item.childrenAvatar} />
														</div>
													</div>
													<ul className="cardContent">
														<li><title>昵称:</title><span>{(item.childrenNick==''||item.childrenNick==null)?'-':item.childrenNick}</span></li>
														<li><title>性别:</title><span>{(item.childrenSex=="MALE"?"男":(item.childrenSex==''||item.childrenSex==null)?'-':'-')}</span></li>
														<li><title>生日:</title><span>{(item.birthday==''||item.birthday==null)?'-':item.birthday}</span></li>
														<li><title>阅读总本数:</title><span>{(item.readBookAmount==''||item.readBookAmount==null)?'-':item.readBookAmount}</span></li>
														<li><title>阅读总时长:</title><span>{(item.readTimeAmount==''||item.readTimeAmount==null)?'-':this.toDate(item.readTimeAmount)}</span></li>
													</ul>
													<span className="getChildCid">{item.cid}</span>
												</div>
											);
										})
									}
								</div>
							</div>
						</div>
					</div>
					}
					

					<div className="shopBottom">
						<div className="tableTitle">图书阅读记录</div>
						<Table className="t-nm-tab" dataSource={this.state.readBookInfor} columns={columns} pagination={false} scroll={{ y: ((this.state.pageLengthNow > 8) ? 340 : 0) }} />
						<div className="paixu">
							<Pagination className="paixuIn" showSizeChanger pageSizeOptions={['20', '50', '100', '200', '500', '1000']} defaultPageSize={20} defaultCurrent={1} current={this.state.current} total={this.state.pageMax} showTotal={total => `共 ${total} 条`} onChange={this.pageChangeFun} showQuickJumper={true} onShowSizeChange={this.pageSizeChangeFun} />
						</div>
					</div>
				</Spin>
			</div>
		);
	}
}
