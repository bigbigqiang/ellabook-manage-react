import React from 'react';
import GoodsSet from '../addvip/GoodsSet.js';
import ContentSet from "../addvip/ContentSet.js";
import PriceSet from "../addvip/PriceSet.js";
import GoodsState from "../addvip/GoodsState.js";
import {notification,message,Icon} from "antd";
import "./Goods.css";
import { Link} from 'react-router';
import getUrl from "../util.js";
import { dataString } from '../commonData.js'
export default class addGoods extends React.Component {

	constructor(){
		super()
		this.state={
			goodsSetData : {
        		thirdCode : "",			//商品id
        		goodsName : "",			//商品名字
        		iosPriceId: "",			//商品ios价格
        		goodsType : ""			//商品类型
			},
			uid:localStorage.getItem("uid"),
            token:localStorage.getItem("token"),
			contentData : {
				thirdName : "",       	//物品名字
				thirdCode : "",			//物品id
				goodsMarketprice : "",	//市场价
				goodsSrcPrice : "",		//原价
				goodsPrice : ""			//优惠价
			},
			priceSetData : {
				data:[
					{
						key: 1,
					  	channel: '',		//String 渠道码
					  	Saledate: [],		//Object数组 0:开始时间,1:结束时间
					  	Saleprice:"",		//String 渠道售价
					  	status: "",
					}
				]  
			},
			goodsStateData : {
				goodsState : ""			//商品状态
			}
		}
		// this.submitData();
	}
	//GoodsSet
	getGoodsSetData(str,value){
		this.setState({
			goodsSetData : {
				...this.state.goodsSetData,
				[str] : value
			}
		})
	}
	//ContentSet
	getContentData(str,value){
		this.setState({
			contentData : {
				...this.state.contentData,
				[str] : value
			}
		})
	}
	getThird(str1,str2,name,code){
		this.setState({
			contentData : {
				...this.state.contentData,
				[str1] : name,
				[str2] : code
			}
		})
	}
	//GoodsState
	getGoodsStateData(str,value){
		this.setState({
			goodsStateData :{
				...this.state.goodsStateData,
				[str] : value
			}
		})
	}
	//PriceSet
	changePriceSetData(key,str,value){
		// console.log(key,str,value);
		this.setState({
			priceSetData : {
				data : this.state.priceSetData.data.map((item,index)=>{
					if(item.key != key) return item;
					return {
						...item,
						[str]:value
					}
				})
					
			}
		})
		// console.log(10);
	}
	addPriceSetData(){
		this.setState({
			priceSetData : {
				data : [
					...this.state.priceSetData.data,
					{
						key:this.state.priceSetData.data.length ? this.state.priceSetData.data.reduce((a,b)=>b).key+1 : 1,
					  	channel: '',		
					  	Saledate: [],		
					  	Saleprice:"",
					  	status: ""
					}
				]
			}
		})
	}
	delPriceSetData(key){
		this.setState({
			priceSetData : {
				data : this.state.priceSetData.data.filter(item => item.key != key)
			}
		})
	}
	//提交数据
	async submitData(){
		var data = {};
		data.thirdCode = this.state.contentData.thirdCode;
		data.goodsSrcPrice = parseFloat(this.state.contentData.goodsSrcPrice);
		data.goodsMarketprice = parseFloat(this.state.contentData.goodsMarketprice);
		data.goodsSubstance = "测试商品内容";
		data.goodsName = this.state.goodsSetData.goodsName;
		data.goodsType = this.state.goodsSetData.goodsType;
		data.iosPriceId = this.state.goodsSetData.iosPriceId;
		data.status = "NORMAL";
		data.goodsState = this.state.goodsStateData.goodsState;
		var channelArr=[];
		// data.goodsChannelPriceRelation = [];
		if(this.state.contentData.goodsPrice==''||this.state.contentData.goodsPrice==null){
			data.goodsPrice =data.goodsSrcPrice;
		}else{
			data.goodsPrice =parseFloat(this.state.contentData.goodsPrice);
		}

		this.state.priceSetData.data.forEach(item=>{
			if(item.Saledate.length==0)return;
			channelArr.push({
				"channelCode" : item.channel,
				"goodsCode" : this.state.contentData.thirdCode,
				"price" : parseFloat(item.Saleprice),
				"status" : item.status,
				"saleStartTime" : item.Saledate[0].split("-").join("/")+" 00:00:00",
				"saleFinishTime" : item.Saledate[1].split("-").join("/")+" 23:59:59"
			})
		})
		data.goodsChannelPriceRelation = channelArr;
		
		if(data.thirdCode!=""&&data.iosPriceId!=""&&data.goodsState!=""&&data.goodsName!=""&&data.goodsPrice>=0&&data.goodsSrcPrice>=0&&data.goodsMarketprice>=0){
			if(data.goodsMarketprice<0||data.goodsSrcPrice<0||data.goodsPrice<0){
				notification.error({
					message: '输入错误',
    				description: '价格不能为负数!'
				})
				return;
			}
			if(data.goodsPrice>data.goodsSrcPrice||data.goodsPrice>data.goodsMarketprice){
				notification.error({
					message: '输入错误',
    				description: '优惠价不能大于市场价或售价!'
				})
				return;
			}
			if(1){
				var res = await fetch(getUrl.url,{
					mode : "cors",
		      		method : "POST",
		      		headers: {
		      		  'Content-Type': 'application/x-www-form-urlencoded',
		      		},
		      		body:"method=ella.operation.insertGoods"+"&content="+JSON.stringify(data)+dataString
				}).then(res => res.json())
				if(res.status == 1) {
					//增加成功跳转到上页面...........
					notification.success({
						message: '添加成功',
    					description: '回到上级菜单',
					})
					window.history.back();
				}
				if(res.status == 0) {
					//增加成功跳转到上页面...........
					
					notification.error({
						message: '该物品已被占用',
    					description: '请确认商品或刷新页面',
					})
					// window.history.back();
				}
			}else{
				notification.error({
					message: '输入错误',
    				description: '请检查你的输入情况!',
				})
			}
		}else{
			notification.error({
				message: '输入错误',
    			description: '请检查你的输入情况!',
			})
		}
	}
	render(){

		// console.log(this.state)
		return <div>
			<h2 className="addGoodsTitle"><Link to="/goodsList"><Icon type="left" />{" "}增加会员</Link></h2>
			<div className="box">
				<GoodsSet getGoodsSetData={this.getGoodsSetData.bind(this)} ></GoodsSet>
				<ContentSet getContentData={this.getContentData.bind(this)} getThird={this.getThird.bind(this)} ></ContentSet>
				<PriceSet changePriceSetData={this.changePriceSetData.bind(this)} addPriceSetData={this.addPriceSetData.bind(this)} delPriceSetData={this.delPriceSetData.bind(this)} ></PriceSet>
				<GoodsState getGoodsStateData={this.getGoodsStateData.bind(this)} submitData={this.submitData.bind(this)} ></GoodsState>
			</div>
		</div>
	}
}