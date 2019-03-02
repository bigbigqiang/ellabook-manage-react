import React from 'react';
import { Menu, Dropdown, Button, Icon, message, Row, Col, Modal } from 'antd';
import { Router, Route, Link, hashHistory, IndexRoute, Redirect, IndexLink } from 'react-router';
import "./GoodsState.css";
const confirm = Modal.confirm;
export default class GoodsState extends React.Component {

	constructor({ getGoodsStateData, submitData }) {
		super()
		this.state = {
			menu: (
				<Menu onClick={this.handleMenuClick.bind(this)}>
					<Menu.Item ename="SHELVES_WAIT" key="1">待上架</Menu.Item>
					<Menu.Item ename="SHELVES_ON" key="2">已上架</Menu.Item>
					<Menu.Item ename="SHELVES_OFF" key="3">已下架</Menu.Item>
					<Menu.Item ename="PRE_SALE" key="4">预售</Menu.Item>
				</Menu>
			),
			goodsState: "请选择商品状态",   //前端显示的内容
			goodsStateValue: ""			//发给后台的内容
		}
	}

	handleButtonClick(e) {
		message.info('点击右边选择条件');
		// console.log('click left button', e);
	}
	handleMenuClick(e) {
		message.info('选择完毕');
		// console.log('click', e);

		this.setState({
			goodsState: e.item.props.children,
			goodsStateValue: e.item.props.ename
		});
		this.props.getGoodsStateData("goodsState", e.item.props.ename);
	}
	showDeleteConfirm(fn) {
		confirm({
			title: '请确认是否添加该商品',
			// content: '如果提交成功将返回上级',
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
	render() {
		return <div>
			<h3>商品状态</h3>
			<div className="goodsState">
				<Row>
					<Col span={3}>设置商品状态</Col>
					<Col span={6}>
						<Dropdown overlay={this.state.menu}>
							<Button style={{ marginLeft: 8 }}>
								{this.state.goodsState} <Icon type="down" />
							</Button>
						</Dropdown>
					</Col>
					<Col span={4}>
						<Button className="goodsStateModify" type="primary" onClick={() => { this.showDeleteConfirm(this.props.submitData) }}>确认增加</Button>
					</Col>
					<Col span={8}>
						<Button className="goodsStateDel" type="primary"><Link to="/goodsList">放弃增加</Link></Button>
					</Col>
					<Col span={3}>
						{/* <a href="javascript:void(0);">操作记录</a> */}
					</Col>
				</Row>
			</div>


		</div>
	}
}