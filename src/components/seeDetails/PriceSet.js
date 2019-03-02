import React from 'react';
import { Table, Icon, Button, Row, Col, Select, DatePicker, Input, Popconfirm, message,InputNumber } from 'antd';
const { MonthPicker, RangePicker } = DatePicker;
import "./PriceSet.css";
import getUrl from "../util.js";
import moment from 'moment';
import 'moment/locale/zh-cn';
import { dataString } from '../commonData.js'
moment.locale('zh-cn');
//thirdCode:商品id,goodsName:商品名字,goodsSrcPrice:原价,goodsMarketprice:(市场价?售价)
export default class PriceSet extends React.Component {

	constructor({ addPriceSetData, delPriceSetData, goodsinfo, prveData }) {
		super()
		this.state = {
			data: [
				// {
				//   key: 1,
				//   channel: '',//String
				//   Saledate: [],//Object数组 0:开始时间,1:结束时间
				//   Saleprice:"",//String
				//   status:"",
				//   del:"删除"
				// }
			],

			channelItem: []
		}
		this.fetchChannelItem()
	}
	// 获取默认数据
	componentDidMount() {
		// this.fetchGoodsinfo(this.props.params.goodsCode);
		// console.log(this.props.params.goodsCode);
		this.fetchGoodsinfo(this.props.prveData.goodsCode);
		// console.log(this.props.prveData.goodsCode)
	}
	async fetchGoodsinfo(str) {
		var data = await fetch(getUrl.url, {
			mode: "cors",
			method: "POST",
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: "method=ella.operation.getGoodsInfoByCode" + "&content=" + JSON.stringify({ "goodsCode": str })+dataString
		}).then(res => res.json())
		if (data.status == 1) {
			if (data.data.goodsChannelPriceRelation == null) {
				this.setState({
					data: []
				})
			} else {
				this.setState({
					data: data.data.goodsChannelPriceRelation.map((item, index) => {
						return {
							key: index + 1,
							channel: item.channelCode,
							Saledate: [item.saleStartTime, item.saleFinishTime],
							Saleprice: item.price,
							status: item.status,
							del: "删除"
						}
					})
				})
			}
		} else {
			console.log(data.message)
		}
	}
	componentWillReceiveProps(nextProps) {
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
			body: "method=ella.operation.boxSearchList" + "&content=" + JSON.stringify({ type: "AUTO_BOX", groupId: "operation.box.chanelList" })+dataString
		}).then(res => res.json())
		// console.log(data);
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
		// this.props.getPriceSetData(this.state.data)	
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
		// this.props.getPriceSetData(this.state.data)		
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
		// this.props.getPriceSetData(this.state.data)	
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
		// this.props.getPriceSetData(this.state.data)	
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
					status: "",
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
		// console.log("z");
		// console.log(this.state.data)
		// console.log("z");
		//////////////////////////////////////////////////////////////
		var columns = [
			{
				title: '渠道',
				dataIndex: 'channel',
				key: 'channel',
				render: (text, record, index) => {
					return <Select
						defaultValue={this.state.data[index].channel ? this.state.data[index].channel : "请选择渠道"}
						style={{ width: 120 }}
						onChange={(value) => { this.handleChange(value, record, "channel") }}>
						{
							this.state.channelItem.map(item => {
								return <Option value={item.code}>{item.name}</Option>
							})
						}
					</Select>
				}
			}, {
				title: '销售日期',
				dataIndex: 'Saledate',
				key: 'Saledate',
				render: (text, record, index) => {
					// console.log(333333333)
					// console.log(this.state.data[index].Saledate)
					// console.log(333333333)
					if (this.state.data[index].Saledate) {
						var saleStartTime = this.state.data[index].Saledate[0].split(" ")[0];
						var saleEndTime = this.state.data[index].Saledate[1].split(" ")[0];
					} else {
						var saleStartTime = "2017-11-30";
						var saleEndTime = "2017-12-1";
					}
					// console.log(444444444)
					// console.log(saleStartTime)
					// console.log(444444444)
					return <RangePicker
						defaultValue={[moment(saleStartTime, 'YYYY-MM-DD'), moment(saleEndTime, 'YYYY/MM/DD')]}
						onChange={(date, dateString) => { this.pickerData(date, dateString, record) }} />
				}
			}, {
				title: '售价',
				dataIndex: 'Saleprice',
				key: 'Saleprice',
				render: (text, record, index) => {
					// if(!this.props.goodsinfo.goodsChannelPriceRelation[index].price) return
					return <InputNumber
						style={{ width: "70px" }}
						defaultValue={this.state.data[index].Saleprice ? this.state.data[index].Saleprice : null}
						onChange={(value) => { this.getSalePrice(record, value) }}
						className="inputPrice"
						required
						 />
				}
			}, {
				title: "限定",
				dataIndex: "status",
				key: "status",
				render: (text, record, index) => (
					<Select
						defaultValue={this.state.data[index].status ? this.state.data[index].status : "请选择是否限定"}
						style={{ width: "160px" }}
						onChange={(value) => { this.handleChange2(value, record, "status") }}>
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
		];
		return <div>
			<h3>售价设定</h3>
			<div className="priceWrap">
				<Table columns={columns} dataSource={this.state.data} pagination={false} />
				<div className="addPriceWarp">
					<Button onClick={() => { this.addItem() }} type="primary">增加条件</Button>
				</div>
			</div>
			<hr />
		</div>
	}
}