/*
 	created by NiePengfei at 2017/11/16
 	评论记录页面--语音评论组件
 	
 */

import React from 'react'
import "./remarkVoice.css"
import $ from 'jquery'

const pic3 = require('./img/laba3.png');
const pic = require('./img/laba.gif');
export default class RemarkVoice extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
        	voiceClass:""
        }
    }
    
    //即将插入本组件时，开始请求数据，准备渲染
    componentWillMount(){
    }
    
    //虚拟dom变成真实dom之后，开始绑定事件
    componentDidMount(){
      	var nums = this.props.num;
      	var timeAll = 1000;
      	var thisTrue = this;
      	
  		$(".aa"+nums).on("click",function(){
  			
  			var length = $("audio").length;
			for(let len = 0;len<length;len++){
				$("audio")[len].pause();
				$("audio")[len].load();
			}
			document.getElementsByClassName("vv"+nums)[0].play();
			
			let timeNow = 0;
			let cishu = 1;
			
			$(".aaa").css({"backgroundImage":"url("+pic3+")"});
			$(this).css({"backgroundImage":"url("+pic+")"});
			
			$(".remarkVoices audio").on("ended",function(){
				$(".aa"+nums).css({"backgroundImage":"url("+pic3+")"});
			})
			
			$(".remarkVoices audio").on("paused",function(){
				$(".aa"+nums).css({"backgroundImage":"url("+pic3+")"});
			})
      	});
    } 
    
    render(){
    	let aa="aa"+this.props.num;
    	let aaa="aaa";
    	let vvv="vvv";
    	let vv="vv"+this.props.num;
    	let pp="pp"+this.props.num;
    	
		return (
			<div className="comment-remarkVoices">
				<div className={aa+" "+aaa}>
					<span className={pp}>{this.props.voiceTime}''</span>
					<audio className={vv+" "+vvv}>
					  	<source controls="false" src={this.props.voiceUrl} />
					</audio>
				</div>
			</div>
		);
	}
}
