import React from 'react';
import GoodsSet from './GoodsSet.js';
import ContentSet from "./ContentSet.js";
import PriceSet from "../addgoods/PriceSet.js";
import GoodsState from "./GoodsState.js";
import FreeTime from "../addgoods/freeTime.js";
import { notification, message, Icon } from "antd";
import { Link } from 'react-router';
import getUrl from "../util.js";
import "./course.css";
import moment from 'moment';
import { dataString } from '../commonData.js'
export default class Addcourse extends React.Component {
	
	constructor() {
		super()
		this.state = {
			goodsSetData: {
				goodsCode: "",			//商品id
				goodsName: "",			//商品名字
				iosPriceId: null,			//商品ios价格
				goodsType: ""			//商品类型
			},
			contentData: {
				goodsName: "",       	//物品名字
				thirdCode: "",			//物品id
				goodsMarketprice:"0",	//市场价
				goodsSrcPrice:"0",		//原价
				goodsPrice: "0",
				bookCourseList:[]
				//优惠价
			},
			uid:localStorage.getItem("uid"),
            token:localStorage.getItem("token"),
			priceSetData: {
				data: [
					{
						key: 1,
						channel: '',		//String 渠道码
						Saledate: [],		//Object数组 0:开始时间,1:结束时间
						Saleprice: "",		//String 渠道售价
						status: "",
					}
				]
			},
			goodsStateData: {
				goodsState: "",
				createBeginTime:"",//商品状态
				createEndTime:""
			},
			freeTimeData: []
		}
	}
	componentDidMount() {
		
		if(this.props.params.goodsCode==0){
			
		}else{
			this.initData(this.props.params.goodsCode);
		}
			
		
		
    }
	async initData(goodsCode){
		 var data = await fetch(getUrl.url, {
            mode: "cors",
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: "method=ella.operation.getGoodsInfoByCode" + "&content=" + JSON.stringify({ "goodsCode": goodsCode })+dataString
        }).then(res =>res.json())
        
        if(data){
			if(data.data.goodsPublishTime==null){
				var _goodsPublishTime=""
			}else{
				var _goodsPublishTime=data.data.goodsPublishTime;
			}
			if(data.data.goodsUnpublishTime==null){
				var _goodsUnpublishTime=""
			}else{
				var _goodsUnpublishTime=data.data.goodsUnpublishTime;
			}
	        this.setState({
	        	goodsSetData:{
	        		...this.state.goodsSetData,
					goodsName:data.data.goodsName,
					goodsCode:data.data.goodsName
	        	},
				goodsStateData: {
					...this.state.goodsStateData,
					goodsState:data.data.goodsState,
					createBeginTime:_goodsPublishTime,
					createEndTime:_goodsUnpublishTime
					
				},
				contentData: {    	
					...this.state.contentData,		
					goodsMarketprice: data.data.goodsMarketprice,	
					goodsSrcPrice: data.data.goodsSrcPrice,		
					goodsPrice:data.data.goodsPrice,
					thirdCode:data.data.thirdCode
				}
			})
	        var doc2 = {
	           courseCode:data.data.thirdCode
	        }
	         var data2 = await fetch(getUrl.url, {
	            mode: "cors",
	            method: "POST",
	            headers: {
	                'Content-Type': 'application/x-www-form-urlencoded',
	            },
	            body: "method=ella.operation.searchCourseDetail" + "&content=" + JSON.stringify(doc2)+dataString
	        }).then(res => res.json())
	        var _data2=data2.data.bookCourseList;
	        for(var i=0;i<_data2.length;i++){
	        	
	        	if(_data2[i].bookCode==null){
	        		_data2.splice(i,1);
	        		i=i-1;
	        	}
	        }
	        var courseData={};
	        courseData.bookName=data.data.thirdName;
	        courseData.bookCode=data.data.thirdCode;
	        courseData.bookMarketPrice=null;
	        courseData.bookGoodsPrice=null;
	        courseData.bookSrcPrice=null;
	        _data2.push(courseData);
	        this.setState({
				contentData: {    	
					...this.state.contentData,		
					bookCourseList:_data2
				}
	        }
	        )
        }
        
	}
	//GoodsSet
	getGoodsSetData(str, value) {
		this.setState({
			goodsSetData: {
				...this.state.goodsSetData,
				[str]: value
			}
			
		})
	}
	//ContentSet
	getContentData(str, value) {
		console.log(value);
		this.setState({
			contentData: {
				...this.state.contentData,
				[str]: value
			}
		})
	}
	getThird(str1, str2, name, code) {
		this.setState({
			contentData: {
				...this.state.contentData,
				[str1]: name,
				[str2]: code
			}
		})
	}
	//GoodsState
	getGoodsStateData(str, value) {
		this.setState({
			goodsStateData: {
				...this.state.goodsStateData,
				[str]: value
			}
		})
	}
	//PriceSet
	changePriceSetData(key, str, value) {
		this.setState({
			priceSetData: {
				data: this.state.priceSetData.data.map((item, index) => {
					if (item.key != key) return item;
					return {
						...item,
						[str]: value
					}
				})

			}
		})
		
	}
	addPriceSetData() {
		this.setState({
			priceSetData: {
				data: [
					...this.state.priceSetData.data,
					{
						key: this.state.priceSetData.data.length ? this.state.priceSetData.data.reduce((a, b) => b).key + 1 : 1,
						channel: '',
						Saledate: [],
						Saleprice: "",
						status: ""
					}
				]
			}
		})
	}
	delPriceSetData(key) {
		this.setState({
			priceSetData: {
				data: this.state.priceSetData.data.filter(item => item.key != key)
			}
		})
	}
	getFreeTimeData(k, v) {
		this.setState({
			[k]: v
		})
	}
	//提交数据
	async submitData() {

		var cur=this.state.contentData.bookCourseList;
		
		function getNowFormatDate() {
		    var date = new Date();
		    var seperator1 = "-";
		    var seperator2 = ":";
		    var month = date.getMonth() + 1;
		    var strDate = date.getDate();
		    if (month >= 1 && month <= 9) {
		        month = "0" + month;
		    }
		    if (strDate >= 0 && strDate <= 9) {
		        strDate = "0" + strDate;
		    }
		    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
		            + " " + date.getHours() + seperator2 + date.getMinutes()
		            + seperator2 + date.getSeconds();
		    return currentdate;
		}
		
		var data = {};
		//课程编码
		data.thirdCode=this.state.contentData.thirdCode;
		
		if(this.props.params.goodsCode==0){
			
		}else{
			data.goodsCode=this.props.params.goodsCode;
		}
		
		
		data.goodsSubstance="课程";
		//商品名字
		data.goodsName = this.state.goodsSetData.goodsName;
		//商品类型
		data.goodsType = "ELLA_COURSE";
		data.status="NORMAL";
		data.goodsState =this.state.goodsStateData.goodsState;
		data.goodsPublishTime=this.state.goodsStateData.createBeginTime;
		data.goodsUnpublishTime=this.state.goodsStateData.createEndTime;

		var m=this.state.contentData.bookCourseList.slice();
	    m.pop();
	    var curcode=[];
	    for(var i=0;i<m.length;i++){
	    	curcode.push(m[i].bookCode);
	    }
	    console.log(curcode)
		data.bookCodeList=curcode;
				//优惠价

		
		if (this.state.goodsSetData.goodsName == "") {
            notification.error({
                message: "商品名称不能为空",
                description: '出现错误',
            })
            return
        }
		if (data.thirdCode== "") {
            notification.error({
                message: "请添加课程",
                description: '出现错误',
            })
            return
        }
		if (data.goodsState== "") {
            notification.error({
                message: "请选择商品状态",
                description: '出现错误',
            })
            return
        }
		
		var cur1=this.state.contentData.goodsMarketprice;
		var cur2=this.state.contentData.goodsSrcPrice;
		
		
		if (String(cur1)==""||String(cur2) =="") {
			notification.error({
				message: '输入错误',
				description: '市场价，售价，优惠价是必填字段。'
			})
			return;
		}
		//售价
		if(this.state.contentData.goodsSrcPrice==""){
			data.goodsSrcPrice =this.state.contentData.goodsSrcPrice;
		}else{
			data.goodsSrcPrice = parseFloat(this.state.contentData.goodsSrcPrice);
		}
		//优惠价
		if(this.state.contentData.goodsPrice==''||this.state.contentData.goodsPrice==null){
			data.goodsPrice =data.goodsSrcPrice;
		}else{
			data.goodsPrice =parseFloat(this.state.contentData.goodsPrice);
		}
		//市场价
		if(this.state.contentData.goodsMarketprice==""){
			data.goodsMarketprice =this.state.contentData.goodsMarketprice;
		}else{
			data.goodsMarketprice = parseFloat(this.state.contentData.goodsMarketprice);
		}
		if (data.goodsMarketprice < 0 || data.goodsSrcPrice < 0 || data.goodsPrice < 0) {
			notification.error({
				message: '输入错误',
				description: '价格不能为负数!'
			})
			return;
		}
		if (data.goodsPrice > data.goodsSrcPrice || data.goodsPrice > data.goodsMarketprice) {
			notification.error({
				message: '输入错误',
				description: '优惠价不能大于市场价或售价!'
			})
			return;
		}
		if(data.goodsPublishTime!=""&&data.goodsUnpublishTime!=""){
			if (new Date(data.goodsPublishTime.replace(/-/g, "\/"))>new Date(data.goodsUnpublishTime.replace(/-/g, "\/"))) {
	            	
	            notification.error({
					message: '输入错误',
					description: '开始时间不能大于结束时间!'
				})
	            return;
	        }
		}
		var curTime=getNowFormatDate();
		//已上架
		if (data.goodsState== "SHELVES_ON"){
			if(this.state.goodsStateData.createBeginTime!=""){
				if (new Date(this.state.goodsStateData.createBeginTime.replace(/-/g, "\/"))>new Date(curTime.replace(/-/g, "\/"))) {
		            notification.error({
						message: "商品状态为已上架，所以起始时间必须小于当前时间。",
		                description: '出现错误',
					})
		            return;
	        	}
				
			}
		}
		if (data.goodsState== "SHELVES_ON"){
			if(this.state.goodsStateData.createEndTime!=""){
				if (new Date(curTime.replace(/-/g, "\/"))>new Date(this.state.goodsStateData.createEndTime.replace(/-/g, "\/"))) {
		            notification.error({
						message: "商品状态为已上架，所以结束时间不能早于当前时间。",
		                description: '出现错误',
					})
		            return;
	        	}
				
			}
		}
		//已下架
		if (data.goodsState== "SHELVES_OFF"){
			if(this.state.goodsStateData.createBeginTime!=""||this.state.goodsStateData.createEndTime!=""){
				if (new Date(this.state.goodsStateData.createBeginTime.replace(/-/g, "\/"))>new Date(curTime.replace(/-/g, "\/"))||new Date(this.state.goodsStateData.createEndTime.replace(/-/g, "\/"))>new Date(curTime.replace(/-/g, "\/"))) {
		            notification.error({                                                                                                                                                                                                                                   
						message: "商品状态为已下架，所以起始时间和结束时间必须小于当前时间。",
		                description: '出现错误',
					})
		            return;
	   			}                                        
				
			}                                             

		}
		//预售
		if (data.goodsState== "PRE_SALE"){
			if(this.state.goodsStateData.createBeginTime!=""){
				if (new Date(this.state.goodsStateData.createBeginTime.replace(/-/g, "\/"))<new Date(curTime.replace(/-/g, "\/"))) {
		            notification.error({
						message: "商品状态为预售，所以起始时间不能小于当前时间。",
		                description: '出现错误',
					})
		            return;
	        	}
				
			}
		}
		if (data.goodsState== "PRE_SALE"){
			if(this.state.goodsStateData.createEndTime!=""){
				if (new Date(this.state.goodsStateData.createEndTime.replace(/-/g, "\/"))<new Date(curTime.replace(/-/g, "\/"))) {
		            notification.error({
						message: "商品状态为预售，所以结束时间不能小于当前时间。",
		                description: '出现错误',
					})
		            return;
	        	}
				
			}
		}
		//待上架
		if(data.goodsState== "SHELVES_WAIT"){
			if(this.state.goodsStateData.createBeginTime!=""){
				console.log(new Date(curTime.replace(/-/g, "\/")));
				console.log(new Date(this.state.goodsStateData.createBeginTime.replace(/-/g, "\/")));
				if (new Date(this.state.goodsStateData.createBeginTime.replace(/-/g, "\/"))<new Date(curTime.replace(/-/g, "\/"))) {
					 notification.error({
		                message: "商品状态为待上架，所以起始时间不能小于当前时间。",
		                description: '出现错误',
		            })
		            return
	            }
			}
		}
		if(data.goodsState== "SHELVES_WAIT"){
			if(this.state.goodsStateData.createEndTime!=""){
				console.log(new Date(curTime.replace(/-/g, "\/")));
				console.log(new Date(this.state.goodsStateData.createBeginTime.replace(/-/g, "\/")));
				if (new Date(this.state.goodsStateData.createEndTime.replace(/-/g, "\/"))<new Date(curTime.replace(/-/g, "\/"))) {
					 notification.error({
		                message: "商品状态为待上架，所以结束时间不能小于当前时间。",
		                description: '出现错误',
		            })
		            return
	            }
			}
		}	
		if(this.props.params.goodsCode==0){
			var _url="ella.operation.insertGoods";
		}else{
			var _url="ella.operation.updateGoods";
		}
		var res = await fetch(getUrl.url, {
			mode: "cors",
			method: "POST",
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: "method="+_url + "&content=" + JSON.stringify(data)+dataString
		}).then(res => res.json())

		if (res.code == "2000010008") {
            var error_message = "";
            res.data.forEach(item => {
                error_message = error_message + item.bookName + "  "
            })
            notification.error({
                message: error_message,
                description: '出现错误,课程内有图书状态异常',
            })
            setTimeout(function () {
                // window.location.reload()
            }, 5000)
            return
        }

		if (res.status == 1) {
			//增加成功跳转到上页面...........

			notification.success({
				message: '添加成功',
				description: '回到上级菜单',
			})
			if(this.props.params.goodsCode==0){
				window.history.back();
			}
			
		}
		if (res.status == 0) {
			//增加成功跳转到上页面...........

			notification.error({
				message: '该物品已被占用',
				description: '请确认商品或刷新页面',
			})
			// window.history.back();
		}
			
		
		
	}
	render() {
		return <div className="bigbox">
			<h2 className="addGoodsTitle"><Link to="/goodsList"><Icon type="left" />{this.props.params.goodsCode==0?"增加课程":"编辑课程"}</Link></h2>
			<div className="box">
				<GoodsSet goodsSetData={this.props.params} getGoodsSetData={this.getGoodsSetData.bind(this)}></GoodsSet>
				<ContentSet getContentData={this.getContentData.bind(this)} contentData={this.state.contentData} params={this.props.params}></ContentSet>
				<GoodsState goodsStateData={this.state.goodsStateData} getGoodsStateData={this.getGoodsStateData.bind(this)} submitData={this.submitData.bind(this)} ></GoodsState>
			</div>
		</div>
	}
}
