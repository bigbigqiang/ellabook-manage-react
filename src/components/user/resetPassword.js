/*
 	created by NiePengfei at 2017/11/10
 	修改密码页面
 */

import React from 'react'
import "./resetPassword.css"
import getUrl from "../util.js"
import $ from 'jquery'
import md5 from 'md5'
import { dataString } from '../commonData.js'
export default class resetPassword extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            userName: '',
            passWord: ''
        }
        this.closeReset = this.closeReset.bind(this);
    }
    //虚拟dom变成真实dom之后，开始绑定事件
    componentDidMount(){
    	var thisTrue = this;
    	var theUid = localStorage.getItem("uid");
    	console.log(theUid);
    	
    	document.getElementsByClassName("submitBtn")[0].addEventListener("click",function(){
    		
    		var oldPassword = document.getElementsByClassName("oldPassword")[0].value;
    		var newPassword = document.getElementsByClassName("newPassword")[0].value;
    		var newPassword1 = document.getElementsByClassName("newPassword1")[0].value;
    		
    		if(oldPassword == '') {
    			$(".alertMess").show();
    			$(".alertMessDetail").text("请输入旧密码!");
    			setTimeout(function(){
    				$(".alertMess").hide();
    			},1000)
				return false;
			} else if(newPassword == ''||newPassword1 == '') {
				$(".alertMess").show();
    			$(".alertMessDetail").text("请输入新密码!");
    			setTimeout(function(){
    				$(".alertMess").hide();
    			},1000)
				return false;
			}else if(newPassword != newPassword1) {
				$(".alertMess").show();
    			$(".alertMessDetail").text("新密码输入不同，请重新输入!");
    			setTimeout(function(){
    				$(".alertMess").hide();
    			},1000)
				return false;
			}else if (newPassword == newPassword1) {
				
				let oldPass = md5(oldPassword);
				let newPass = md5(newPassword);
				
				fetch(getUrl.url, {
					method: "POST",
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					body: "method=ella.user.resetPassword" + "&content=" + JSON.stringify({
						"uid":theUid,
						"password": oldPass,
						"newPassword":newPass,
						"channelCode":"BSS"
					})+dataString
				})
				.then(function(response){
					console.log(response);
					return response.json();
				})
				.then(function(response){
					console.log(response);
					if (response.status == 1) {
						console.log(response.data);
						$(".alertMess").show();
		    			$(".alertMessDetail").text("密码修改成功!");
		    			setTimeout(function(){
		    				$(".alertMess").hide();
		    				//这里显示原页
							//这里用了，父组件传给子组件自己的函数，子组件调用，修改父组件state的方法实现的
							//注意，在父组件中，这个函数得用 箭头函数传递，保证this到了子组件依然指向父组件
		    				thisTrue.props.ziChange(0);
		    			},1000)
					}else if (response.status == 0) {
						if (response.code == "10001002") {
							$(".alertMess").show();
			    			$(".alertMessDetail").text("登录密码错误!");
			    			setTimeout(function(){
			    				$(".alertMess").hide();
			    			},1000)
						}
					}
				})
			}
    	});
    } 
    
    closeReset(){
    	this.props.ziChange(0);
    }
    
    render(){
		return (
			<div className="containers">
				<div className="resetMain">
					<div className="title">
						修改密码
						<div className="theClose" onClick={this.closeReset}></div>
					</div>
					<div  className="content">
						<input type="text"  placeholder="输入旧密码" className="oldPassword" />
						<input type="password"  placeholder="输入新密码" className="newPassword" />
						<input type="password"  placeholder="再次输入新密码" className="newPassword1" />
					</div>
					<div className="submitBtn">提交</div>
				</div>
				<div className="alertMess">
					<span className="alertMessDetail"></span>
				</div>
			</div>
		);
	}
}
