import React from 'react';
import { Table, Icon,Button ,Row ,Col ,Input ,Select ,Tag,InputNumber } from 'antd';
import "./ContentSet.css";
import getUrl from "../util.js";
import { dataString } from '../commonData.js'

//thirdCode:商品id,goodsName:商品名字,goodsSrcPrice:原价,goodsMarketprice:(市场价?售价)
export default class ContentSet extends React.Component {

	constructor({getContentData,getThird}){
		super()
		this.state={
			data : [
				{
				  key: '1',
				  thirdCode: '',
				  goodsName: "",
				  goodsMarketprice:'',
				  goodsSrcPrice: "",
				  goodsPrice : "",
				  del:"删除"
				}
			],
			columns : [
				{
				  title: '物品ID',
				  dataIndex: 'thirdCode',
				  key: 'thirdCode',
				  width:200
				}, {
				  title: '物品名称',
				  dataIndex: 'goodsName',
				  key: 'goodsName',
				  width:400,
				  render : (text,record) => (
				  	<Select defaultValue="请选会员类型" style={{ width: 120 }} onChange={(value)=>{this.handleChange(value)}}>
    				  {
    				  	this.state.resultItem.map(item=>{
    				  		return <Option value={item.thirdCode}>{item.thirdName}</Option>
    				  	})
    				  }
    				</Select>
				  )
				}, {
				  title: '市场价',
				  dataIndex: 'goodsMarketprice',
				  key: 'goodsMarketprice',
				  render: text => <InputNumber style={{width:"70px"}} onBlur={(e)=>{this.props.getContentData("goodsMarketprice",e.target.value)}} onChange={(value)=>{this.setPrice("goodsMarketprice",value)}} className="inputPrice" />,
				}, {
				  title: '售价',
				  dataIndex: 'goodsSrcPrice',
				  key: 'goodsSrcPrice',  
				  render: text => <InputNumber style={{width:"70px"}} onBlur={(e)=>{this.props.getContentData("goodsSrcPrice",e.target.value)}} onChange={(value)=>{this.setPrice("goodsSrcPrice",value)}} className="inputPrice" />,
				}, {
				  title : '优惠价',	
				  dataIndex : "goodsPrice",
				  key : "goodsPrice",
				  render : text => <InputNumber style={{width:"70px"}} onBlur={(e)=>{this.props.getContentData("goodsPrice",e.target.value)}} onChange={(value)=>{this.setPrice("goodsPrice",value)}} className="inputPrice" />,
				}
			],
			onSearch : true,
			resultItem : [],
			thirdName : "",
			thirdCode : "",
			goodsMarketprice : "",
			goodsSrcPrice : ""
		}
		this.fetchResultItem();
	}

	
	async fetchResultItem(){
		var data = await fetch(getUrl.url,{
			mode : "cors",
      		method : "POST",
      		headers: {
      		  'Content-Type': 'application/x-www-form-urlencoded',
      		},
      		body:"method=ella.operation.thirdSearchList"+"&content="+JSON.stringify({"text":"","searchType":"searchVip"})+dataString
		}).then(res => res.json());
		console.log(data);
		this.setState({
			resultItem : data.data
		})
	}
	//设置thirdName和thidrCode
	setThird(name,code){
		//可以通过code来得出name
		this.setState({
			...this.state,
			thirdName : name,
			thirdCode : code,
			data : this.state.data.map(item=>{
				return {
					...item,
					thirdName : name,
					thirdCode : code,
				}
			}),
			onSearch : false

		})
	}
	//市场价和售价
	setPrice(str,value){
		this.setState({
			[str] : value
		})
	}
	//////////////////////////////////////////////
	handleChange(value) {
	  	// console.log(`selected ${value}`);
	  	this.setThird(name="",value);
	  	this.props.getThird("thirdName","thirdCode","",value);
	}
	render(){
		return <div>
			<h3>内容设定</h3>
			<div className="contentWrap">
				<Table columns={this.state.columns} dataSource={this.state.data}  pagination={false}/>
				<div className="addContentWarp">				
				</div>
			</div>
			
			<hr/>
		</div>
	}
}
