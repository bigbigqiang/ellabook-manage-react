import React from 'react';
import { Card, Icon } from 'antd';
import './part5.css';
import getUrl from "../util.js";
import bottomBanner from "../../assets/images/bg.png";
import topBanner from "../../assets/images/ercodelogo.png";
export default class PriceSet extends React.Component {

    constructor() {
        super()
        this.state = {
            // title: '新书抢先看',
            // more: `更多`,
            // data: [
            //     {
            //         img: 'http://book.ellabook.cn/c33cf360871e4507bf023a531a892f1b',
            //         title: '也许的样子(上)',
            //         text: '文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字'
            //     },
            //     {
            //         img: 'http://book.ellabook.cn/B201801190002.png',
            //         title: '我喜欢美好',
            //         text: '文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字'
            //     },
            //     {
            //         img: 'http://book.ellabook.cn/4f8e5cc88d2d4a0eaa781d30b523f398',
            //         title: '这样的伦敦(上)',
            //         text: '文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字'
            //     }
            // ]
            title: '',
            more: '',
            data: [],
            ads:[],
            bgImageUrl:'',
            bgImageUpUrl:'',
            operateCopy:''
        }
    }
    componentDidMount() {
        // TODO:这里接收父级数据
      
        console.log(this.props.parentData)
        this.setState({
            title: this.props.parentData.title,
            more: this.props.parentData.more,
            data: this.props.parentData.data,
            ads:this.props.parentData.ads,
            bgImageUrl:this.props.parentData.bgImageUrl,
            bgImageUpUrl:this.props.parentData.bgImageUpUrl,
            operateCopy:this.props.parentData.operateCopy
        })
    }
    setOneKV(k, v) {
        this.setState({
            [k]: v
        })
    }
    render() {
    	console.log(this.state.ads);
        return <div className='part5'>
            <div className='part5_top'>
                <span className='title'>{this.state.title}</span>
                <div className='secondtitle'>{this.state.operateCopy}</div>
                {/*<span className="more">{this.state.more}<Icon type="right" /></span>*/}
            </div>
            <div className="addSeniorMember" style={{"backgroundImage":"url("+this.state.bgImageUrl+")","backgroundSize":"100% auto"}}>
                {/*<img src={bottomBanner} className="bottomBanner"/>*/}
                 <img src={this.state.bgImageUpUrl} className="topBanner"/>
            </div>
            <div className='showBoxWrap'>
                <div className='showBox'>
                    {/* <div className='item' style={{}}>
                        <div className='item_inner'>
                            <img src="http://book.ellabook.cn/c33cf360871e4507bf023a531a892f1b" alt="" />
                            <div className='item_right'>
                                <span className="item_title">我想要只虎纹猫</span>
                                <div className='item_textWrap'>
                                    <span style={{ webkitBoxOrient: 'vertical' }} className="item_text">文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字</span>
                                </div>
                                <button>立即阅读</button>
                            </div>
                        </div>
                    </div> */}
                    {
                        this.state.data.map(item => {
                            return <div className='item' style={{}}>
                                <div className='item_inner'>
                                    <img src={item.img} alt="" />
                                    <div className='item_right'>
                                        <span style={{ webkitBoxOrient: 'vertical' }} className="item_title">{item.title}</span>
                                        <div className='item_textWrap'>
                                            <span style={{ webkitBoxOrient: 'vertical' }} className="item_text">{item.text}</span>
                                        </div>
                                        <button>免费看</button>
                                    </div>
                                </div>
                                
                            </div>
                        })
                    }
                    
                    {/* <div className='item' style={{}}>

                    </div> */}
                </div>
            </div>
			<div className="bottomAdvert">
            	{
            		this.state.ads.map(item=> {
            			return (
            				<div className="imgWrap">
            					<img src={item.bannerImageUrl} alt="" />
            				</div>
            			)
            		})
            	}
            </div>
        </div>
    }
}