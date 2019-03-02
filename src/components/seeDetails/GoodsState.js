import React from 'react';
import { Menu, Dropdown, Button, Icon, message, Row, Col, Modal, Select } from 'antd';
import { Router, Route, Link, hashHistory, IndexRoute, Redirect, IndexLink } from 'react-router';
import "./GoodsState.css";
const confirm = Modal.confirm;
export default class GoodsState extends React.Component {

	constructor({ getGoodsStateData, submitData }) {
		super()
		this.state = {
			menu: (
				<Menu
					onClick={this.handleMenuClick.bind(this)}>
					<Menu.Item ename="SHELVES_WAIT" key="1">待上架</Menu.Item>
					<Menu.Item ename="SHELVES_ON" key="2">已上架</Menu.Item>
					<Menu.Item ename="SHELVES_OFF" key="3">已下架</Menu.Item>
					<Menu.Item ename="PRE_SALE" key="4">预售</Menu.Item>
				</Menu>
			),
			goodsState: "",   //前端显示的内容
			goodsStateValue: ""			//发给后台的内容
		}
	}

	handleButtonClick(e) {
		// message.info('点击右边选择条件');
		// console.log('click left button', e);
	}
	handleMenuClick(e) {
		// message.info('选择完毕');
		// console.log('click', e);

		this.setState({
			goodsState: e.item.props.children,
			goodsStateValue: e.item.props.ename
		});
		this.props.getGoodsStateData("goodsState", e.item.props.ename);
	}
	showDeleteConfirm(fn) {
		var _this = this;
		console.log("11111111111")
		console.log(_this.props.goodsinfo.goodsType == "BOOK" && _this.props.goodsinfo.goodsState == "SHELVES_OFF")
		confirm({
			title: '请确认是否添加该商品?',
			content: (_this.props.goodsinfo.goodsType == "BOOK") ? '该图书如果是下架,相关联图书包同时被下架' : null,
			okText: '确定',
			okType: 'primary',
			cancelText: '取消',
			onOk() {
				fn();
			},
			onCancel() {
				console.log('Cancel');
			},
		});
	}
	getCGoodsState(str) {
		console.log(str);
		if (str == "SHELVES_WAIT") {
			return "待上架";
		} else if (str == "SHELVES_ON") {
			return "已上架";
		} else if (str == "SHELVES_OFF") {
			return "已下架";
		} else if (str == "PRE_SALE") {
			return "预售"
		}
	}
	render() {
		console.log(this.state.goodsState)
		console.log(this.props.goodsinfo)
		return <div>
			<h3>商品状态</h3>
			<div className="goodsState">
				<Row>
					<Col span={4}>设置商品状态</Col>
					<Col span={10}>
						<Dropdown.Button
							onClick={this.handleButtonClick}
							overlay={this.state.menu}>
							{this.state.goodsState ? this.state.goodsState : this.getCGoodsState(this.props.goodsinfo.goodsState)}
						</Dropdown.Button>
					</Col>
					<Col span={10}></Col>
				</Row>
				<Row style={{ padding: '20px 0' }}>
					<Col span={4}>
						<Button className="goodsStateModify" type="primary" onClick={() => { this.showDeleteConfirm(this.props.submitData) }}>确认</Button>
					</Col>
					<Col span={4}>
						<Button className="goodsStateDel" type="primary"><Link to="/goodsList">取消</Link></Button>
					</Col>
				</Row>
			</div>

			<hr />
		</div>
	}
}

