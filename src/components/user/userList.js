/*
 	created by NiePengfei at 2017/11/12
 	用户详情
 */
import React from 'react'
import './userList.css'
import UserBase from './userBase.js'
import ShopDetail from './shopDetail.js'
import Dingdan from './dingDan.js'
import Integral from './integral.js'
import Task from './task.js'
import RemarkDetail from './remarkDetail.js'
import UserFootprints from './userFootprints.js'
import {Icon,Tabs } from 'antd'
import { Link} from 'react-router'

const TabPane = Tabs.TabPane;
export default class userList extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
        	//各选项卡的组件名称
        	tapName: "",
        	sanFang:"",
        	uid:"",
        	key:''
        }
    }
    
    //即将插入本组件时，开始请求数据，准备渲染
    componentWillMount(){
    	//修改2.2.3bug
    	var locString = this.props.location.search;
    	function getURLParam(name){
            var rs = new RegExp("(^|)"+name+"=([^\&]*)(\&|$)","gi").exec(locString), tmp;
            return (tmp=rs)? tmp[2].replace("#",''):"";
        }
		this.setState({
			uid:getURLParam("uid"),
			key:getURLParam("key")
		})
    }
   
    componentDidMount() {
    	//取出指向组件的指针,避免this指向错乱
    	var thisTrue = this;
    	thisTrue.setState({
			tapName: <UserBase uid = {this.state.uid}></UserBase>
		})
    }
    
    render() {
        return (
        	<div className="userPage">
        		<div className="userTitle">
        			<Link to={window.location.href.indexOf('indexInit') > -1 ? '/orderPage' : "/userControl"}>
                        <Icon type="left" /> 用户详情
                    </Link>
        		</div>
				<div style={{padding:'0 20px'}}>
					<Tabs defaultActiveKey={this.state.key==''?'1':this.state.key}>
						<TabPane tab="基本信息" key="1" type="line"><UserBase uid={this.state.uid}></UserBase></TabPane>
						<TabPane tab="宝贝信息" key="2" type="line"><ShopDetail uid={this.state.uid}></ShopDetail></TabPane>
						<TabPane tab="订单记录" key="3" type="line"><Dingdan uid={this.state.uid}></Dingdan></TabPane>
						<TabPane tab="评论记录" key="4" type="line"><RemarkDetail uid={this.state.uid}></RemarkDetail></TabPane>
						<TabPane tab="积分记录" key="5" type="line"><Integral uid={this.state.uid} /></TabPane>
						<TabPane tab="任务记录" key="6" type="line"><Task uid={this.state.uid} /></TabPane>
						<TabPane tab="用户足迹" key="7" type="line"><UserFootprints uid={this.state.uid}></UserFootprints></TabPane>
					</Tabs>
				</div>
        	</div>
        )
    }
}
