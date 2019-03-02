/*
 	created by NiePengfei at 2017/11/16
 	评论记录页面--语音评论组件
 	
 */

import React from 'react'
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
        console.log(this.props.voiceUrl);
        var nums = this.props.num;
        var timeAll = 1000;
        var thisTrue = this;

        $(".aa"+nums).on("click",function(){
            var audioLength = $("audio").length;
            for(let len = 0;len<audioLength;len++){
                $("audio")[len].pause();
                $("audio")[len].load();
            }
            document.getElementsByClassName("vv"+nums)[0].play();

            let timeNow = 0;
            let cishu = 1;

            console.log(timeAll);
            $(".aaa").css({"backgroundImage":"url("+pic3+")"});
            $(this).css({"backgroundImage":"url("+pic+")"});

            $(".remarkVoices audio").on("ended",function(){
                $(".aa"+nums).css({"backgroundImage":"url("+pic3+")"});
            })

            $(".remarkVoices audio").on("paused",function(){
                $(".aa"+nums).css({"backgroundImage":"url("+pic3+")"});
            })

        });
        setTimeout(function(){
            let timeLong = parseInt(document.getElementsByClassName("vv"+nums)[0].duration);
            timeAll = parseInt(document.getElementsByClassName("vv"+nums)[0].duration)*1000;
            console.log(timeLong);
            document.getElementsByClassName("pp"+nums)[0].innerText=timeLong+"''";
        },600)
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
                    <span className={pp}></span>
                    <audio className={vv+" "+vvv}>
                        <source controls="false" src={this.props.voiceUrl} />
                    </audio>
                </div>
            </div>
        );
    }
}
