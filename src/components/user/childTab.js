/*
 	created by NiePengfei at 2017/11/14
 	用户详情--宝贝信息--宝贝信息卡
 	
 */

import React from 'react'
import "./childTab.css"
import $ from 'jquery'

export default class ChildTab extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
        	sex:""
        }
    }
    
     componentDidMount() {
     	$(".cardImage").css({"backgroundImage":"url("+this.props.dateInfor.childrenAvatar+")"});
     	if (this.props.dateInfor.childrenSex == "MALE") {
     		this.setState({
				sex: "男"
			})
     	}else if(this.props.dateInfor.childrenSex == "FEMALE"){
     		this.setState({
				sex: "女"
			})
     	}
     	
     	
    }
    getItemHistory3(cid){
    	console.log(cid)
    	this.props.getItemHistory(cid);
    }
    render(){
		return (
			<div className="childCard">
				<div className="cardTitle">
					<div className={"cardImage cardImage"+this.props.index}>
						<img src={this.props.dateInfor.childrenAvatar} />
					</div>
					<div className="cardName">{this.props.dateInfor.childrenNick}</div>
				</div>
				<ul className="cardContent">
					<li>性　　　别:<span>{this.state.sex}</span></li>
					<li>生　　　日:<span>{this.props.dateInfor.birthday}</span></li>
					<li>阅读总本数:<span>{this.props.dateInfor.readBookAmount}</span></li>
					<li>阅读总时长:<span>{this.props.dateInfor.readTimeAmount}</span></li>
				</ul>
				<span className="getChildCid">{this.props.dateInfor.cid}</span>
			</div>
		);
	}
}