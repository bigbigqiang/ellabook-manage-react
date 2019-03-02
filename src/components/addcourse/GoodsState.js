import React from 'react';
import { Menu, Dropdown, Button, Icon, message, Row, Col, Modal,DatePicker,Form } from 'antd';
import { Router, Route, Link, hashHistory, IndexRoute, Redirect, IndexLink } from 'react-router';
import "./GoodsState.css";
import moment from 'moment';
const FormItem = Form.Item;
const confirm = Modal.confirm;
export default class GoodsState extends React.Component {

	constructor({ getGoodsStateData, submitData,goodsStateData }) {
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
			goodsState: "",   //前端显示的内容
			goodsStateValue: ""	,		//发给后台的内容
			createBeginTime:"",
			createEndTime:''
		}
	}

	handleButtonClick(e) {
		message.info('点击右边选择条件');
		// console.log('click left button', e);
	}
	handleMenuClick(e) {
		message.info('选择完毕');
		// console.log('click', e);
		console.log(e.item.props.children)
		this.setState({
			goodsState: e.item.props.children,
			goodsStateValue: e.item.props.ename
		});
		this.props.getGoodsStateData("goodsState", e.item.props.ename);
	}
	componentDidMount() {
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
	
	createBeginTime(value, dateString, str) {
		this.setState({
            createBeginTime: dateString
        })
      	this.props.getGoodsStateData(str,dateString);
    }
    createEndTime(value, dateString, str) {
    	this.setState({
            createEndTime: dateString
        })
        this.props.getGoodsStateData(str,dateString);
    }
	render() {
		const {goodsStateData} =this.props;
		if(goodsStateData.goodsState=="SHELVES_WAIT"){
			var curState="待上架";
		}else if(goodsStateData.goodsState=="SHELVES_ON"){
			var curState="已上架";
		}else if(goodsStateData.goodsState=="SHELVES_OFF"){
			var curState="已下架";
		}else if(goodsStateData.goodsState=="PRE_SALE"){
			var curState="预售";
		}else{
			curState="请选择商品状态";
		}
		return <div>
			<h3>状态设置</h3>
			<div className="goodsState">
				<Row>
					<Col span={2}>设置商品状态:</Col>
					<Col span={6}>
						<Dropdown overlay={this.state.menu}>
							<Button>
								{curState} <Icon type="down" />
							</Button>
						</Dropdown>
					</Col>
					<Col span={2}>设置商品销售时间:</Col>
					<Col span={9}>
					
						 <DatePicker
                                format="YYYY-MM-DD HH:mm:ss"
                                placeholder={['开始时间']}
                                showTime
                                onChange={(value, dateString) => { this.createBeginTime(value, dateString, "createBeginTime") }}
                                value={goodsStateData.createBeginTime != '' ? moment(goodsStateData.createBeginTime, 'YYYY-MM-DD hh:mm:ss') : null}
                                style={{ width: 200,"font-size": "12px"}}
                                
                            />
                           <i style={{"margin":"5px"}}>—</i>
                            <DatePicker
                                format="YYYY-MM-DD HH:mm:ss"
                                placeholder={['结束时间']}
                                showTime
                                style={{ width: 200,"font-size": "12px"}}
                               
                                onChange={(value, dateString) => { this.createEndTime(value, dateString, "createEndTime") }}
                    			value={goodsStateData.createEndTime != '' ? moment(goodsStateData.createEndTime, 'YYYY-MM-DD hh:mm:ss') : null}
                            />
					</Col>
				</Row>
				<p style={{ marginTop: 20, textAlign: 'center' }}>
						<Button className="goodsStateModify"  style={{"marginRight":"10px"}} type="primary" onClick={() => { this.showDeleteConfirm(this.props.submitData) }}>确定</Button>
					
						<Button className="goodsStateDel" type="primary"><Link to="/goodsList">取消</Link></Button>
					
					
				</p>
			</div>


		</div>
	}
}