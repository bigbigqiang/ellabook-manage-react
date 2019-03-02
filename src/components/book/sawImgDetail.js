/*
 	created by NiePengfei at 2017/12/15
 		图书——反馈——图片详情
 */
import React from 'react'
import "./sawImgDetail.css"

export default class SawImgDetail extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
        	loading:true,
        	imgRoute:0,
        	imgWidth:"380",
        	imgMarginTop:"-90",
        	imgMarginLeft:"-190",
        }
        this.imgRoute = this.imgRoute.bind(this);
        this.imgBig = this.imgBig.bind(this);
        this.imgSmall = this.imgSmall.bind(this);
    }
    
    //即将插入本组件时，开始请求数据，准备渲染
    componentWillMount(){
    }
    
    //虚拟dom变成真实dom之后，开始绑定事件
    componentDidMount(){
    	let imgWidth = parseInt(this.state.imgWidth),
    		img = document.getElementsByClassName("m-imgThis")[0],
    		imgStato = img.naturalWidth/img.naturalHeight;
    	this.setState({
			loading:false,
			imgMarginTop:-((imgWidth)/imgStato)/2
		})
    } 
    
    imgUp(){
    	let img = document.getElementsByClassName("m-imgThis")[0];
    	
    }
    imgBig(){
    	let imgWidth = parseInt(this.state.imgWidth),
    		img = document.getElementsByClassName("m-imgThis")[0],
    		imgStato = img.naturalWidth/img.naturalHeight;
    	console.log(imgWidth);
    	
    	this.setState({
			imgWidth:imgWidth+100,
			imgMarginLeft:-(imgWidth+100)/2,
			imgMarginTop:-((imgWidth+100)/imgStato)/2
		})
    }
    imgSmall(){
    	let imgWidth = parseInt(this.state.imgWidth),
    		img = document.getElementsByClassName("m-imgThis")[0],
    		imgStato = img.naturalWidth/img.naturalHeight;
    	console.log(imgWidth);
    	
    	if (imgWidth>100) {
    		this.setState({
				imgWidth:imgWidth-100,
				imgMarginLeft:-(imgWidth-100)/2,
				imgMarginTop:-((imgWidth-100)/imgStato)/2
			})
    	}
    	
    }
    imgRoute(){
    	let img = document.getElementsByClassName("m-imgOut")[0];
    	let theDeg = this.state.imgRoute +90;
    	img.style.transform = "rotateZ("+theDeg+"deg)";
    	this.setState({
			imgRoute:theDeg
		})
    }
    imgNext(){
    	let img = document.getElementsByClassName("m-imgThis")[0];
    }
    
    render(){
    	var thisTrue = this;
		return (
			<div className="sawImgDetail">
				{/*<img className="m-imgThis" src=""+{this.props.imgSrc}+""/>*/}
				<div className="m-imgOut" style={{width:this.state.imgWidth,marginTop:this.state.imgMarginTop,marginLeft:this.state.imgMarginLeft}}>
					<img className="m-imgThis" src={this.props.imgSrc}/>
				</div>
				
				<div className="m-imgClose" onClick={thisTrue.props.closeImage}></div>
				<div className="m-imgControl">
					{/*<span className="m-imgUp" onClick={this.imgUp}></span>*/}
					<span className="m-imgBig" onClick={this.imgBig}></span>
					<span className="m-imgSmall" onClick={this.imgSmall}></span>
					<span className="m-imgRoute" onClick={this.imgRoute}></span>
					{/*<span className="m-imgNext" onClick={this.imgNext}></span>*/}
				</div>
			</div>
		);
	}
}
