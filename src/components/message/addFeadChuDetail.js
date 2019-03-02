/*
 	created by NiePengfei at 2017/12/14
 		图书——反馈——反馈编辑、添加
 */

import React from 'react'
import {Spin} from 'antd';
import "./addFeadChuDetail.css"

export default class AddFeadChuDetail extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
        	loading:true,
        }
    }
    
    //即将插入本组件时，开始请求数据，准备渲染
    componentWillMount(){
    	
    }
    
    //虚拟dom变成真实dom之后，开始绑定事件
    componentDidMount(){
    	this.setState({
			loading:false
		})
    } 
    
    
    
    render(){
    	var thisTrue = this;
		return (
			<div className="addFeadChuDetail">
				<Spin spinning={this.state.loading} size="large">
					<div className="feadChuDetailCon">
						<div>{thisTrue.props.feadChuDetail.dealWithTime}</div>
						<div>{thisTrue.props.feadChuDetail.handlerName}</div>
						<div>{thisTrue.props.feadChuDetail.afterDealWithStatus}</div>
						<div>{thisTrue.props.feadChuDetail.dealWithInfo}</div>
					</div>
				</Spin>
			</div>
		);
	}
}