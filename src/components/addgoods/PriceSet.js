import React from 'react';
import { Table, Icon, Button, Row, Col, Select, DatePicker, Input, Popconfirm, message,InputNumber } from 'antd';
const { MonthPicker, RangePicker } = DatePicker;
import "./PriceSet.css";
import getUrl from "../util.js";
import { dataString } from '../commonData.js'
//thirdCode:商品id,goodsName:商品名字,goodsSrcPrice:原价,goodsMarketprice:(市场价?售价)
export default class PriceSet extends React.Component {

	constructor({ changePriceSetData, addPriceSetData, delPriceSetData }) {
		super()
		this.state = {
			data: [
				{
					key: 1,
					channel: '',//String
					Saledate: [],//Object数组 0:开始时间,1:结束时间
					Saleprice: "",//String
					status: "",
					del: "删除"
				}
			],
			columns: [
				{
					title: '渠道',
					dataIndex: 'channel',
					key: 'channel',
					render: (text, record) => (
						<Select defaultValue="请选择渠道" style={{ width: 120 }} onChange={(value) => { this.handleChange(value, record, "channel") }}>
							{
								this.state.channelItem.map(item => {
									return <Option value={item.code}>{item.name}</Option>
								})
							}
						</Select>)
				}, {
					title: '销售日期',
					dataIndex: 'Saledate',
					key: 'Saledate',
					render: (text, record) => (<RangePicker onChange={(date, dateString) => { this.pickerData(date, dateString, record) }} />)
				}, {
					title: '售价',
					dataIndex: 'Saleprice',
					key: 'Saleprice',
					render: (text, record) => (<InputNumber style={{ width: "70px" }} onChange={(value) => { this.getSalePrice(record, value) }} className="inputPrice" required/>)
				}, {
					title: "限定",
					dataIndex: "status",
					key: "status",
					render: (text, record) => (
						<Select defaultValue="请选择是否限定" style={{ width: "160px" }} onChange={(value) => { this.handleChange2(value, record, "status") }}>
							<Option value="NORMAL">限定</Option>
							<Option value="EXCEPTION">不限定</Option>
						</Select>)
				},
				{
					title: '删除添加',
					dataIndex: 'del',
					key: 'del',
					render: (text, record) => {
						return <Popconfirm onConfirm={() => { this.confirm(record) }} title="确定删除这一条吗？" okText="删除" cancelText="取消">
							<a href="javascript:void(0)" >{text}</a>
						</Popconfirm>
					},
				}
			],
			channelItem: []
		}
		this.fetchChannelItem()
	}
	confirm(record) {
		this.delItem(record)
	}
	//拉取渠道信息
	async fetchChannelItem(text) {
		var data = await fetch(getUrl.url, {
			mode: "cors",
			method: "POST",
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: "method=ella.operation.boxSearchList" + "&content=" + JSON.stringify({
				type: "AUTO_BOX",
				groupId: "operation.box.chanelList"
			})+dataString
		}).then(res => res.json())
		console.log(data);
		this.setState({
			channelItem: data.data
		})
	}
	//获取渠道值
	handleChange(e, record, str) {

		this.setState({
			data: this.state.data.map((item, index) => {
				if (item.key != record.key) return item;
				return {
					...item,
					[str]: e
				}
			})
		})
		// console.log(this.props.changePriceSetData);
		this.props.changePriceSetData(record.key, "channel", e);
	}
	handleChange2(e, record, str) {

		this.setState({
			data: this.state.data.map((item, index) => {
				if (item.key != record.key) return item;
				return {
					...item,
					[str]: e
				}
			})
		})
		// console.log(this.props.changePriceSetData);
		this.props.changePriceSetData(record.key, "status", e);
	}
	//获取销售时间data:antd必要参数时间数据,dateString:antd必要参数时间简写xxxx-xx-xx
	pickerData(date, dateString, record) {
		// console.log(date);
		// console.log(dateString);
		this.setState({
			data: this.state.data.map((item, index) => {
				if (item.key != record.key) return item;
				return {
					...item,
					Saledate: dateString
				}
			})
		})
		this.props.changePriceSetData(record.key, "Saledate", dateString);
	}
	//获取售价
	getSalePrice(record, Saleprice) {
		this.setState({
			data: this.state.data.map((item, index) => {
				if (item.key != record.key) return item;
				return {
					...item,
					Saleprice
				}
			})
		})
		this.props.changePriceSetData(record.key, "Saleprice", Saleprice);
	}
	//增加条件
	addItem() {
		this.setState({
			data: [
				...this.state.data,
				{
					key: this.state.data.length ? 1 + this.state.data.reduce((a, b) => b).key : 1,
					channel: '',
					Saledate: "",
					Saleprice: "",
					del: "删除"
				}
			]
		})
		this.props.addPriceSetData();
	}
	//获取是否限定
	// getStatus(){
	// 	this.setState({
	// 		data : this.state.data.map((item))
	// 	})
	// }
	//删除条件
	delItem(record) {
		this.setState({
			data: this.state.data.filter(item => item.key != record.key)
		})
		this.props.delPriceSetData(record.key);
	}
	render() {
		//////////////////////////////////////////////////////////////
		// console.log(this.state.data)
		//////////////////////////////////////////////////////////////
		return <div>
			<h3>售价设定</h3>
			<div className="priceWrap">
				<Table columns={this.state.columns} dataSource={this.state.data} pagination={false} />
				<div className="addPriceWarp">
					<Button className="PriceSetBtn" onClick={() => { this.addItem() }} type="primary">增加条件</Button>
				</div>
			</div>
			<hr />
		</div>
	}
}