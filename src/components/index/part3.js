import React from 'react';
import { Card, Icon } from 'antd';
import './part3.css';
import getUrl from "../util.js";


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
            //     },
            //     {
            //         img: 'http://book.ellabook.cn/B201801190002.png',
            //         title: '我喜欢美好',
            //     },
            //     {
            //         img: 'http://book.ellabook.cn/4f8e5cc88d2d4a0eaa781d30b523f398',
            //         title: '这样的伦敦(上)',
            //     },
            //     {
            //         img: 'http://book.ellabook.cn/c33cf360871e4507bf023a531a892f1b',
            //         title: '也许的样子(上)',
            //     },
            //     {
            //         img: 'http://book.ellabook.cn/B201801190002.png',
            //         title: '我喜欢美好',
            //     },
            //     {
            //         img: 'http://book.ellabook.cn/4f8e5cc88d2d4a0eaa781d30b523f398',
            //         title: '这样的伦敦(上)',
            //     },
            //     {
            //         img: 'http://book.ellabook.cn/c33cf360871e4507bf023a531a892f1b',
            //         title: '也许的样子(上)',
            //     },
            //     {
            //         img: 'http://book.ellabook.cn/B201801190002.png',
            //         title: '我喜欢美好',
            //     },
            //     {
            //         img: 'http://book.ellabook.cn/4f8e5cc88d2d4a0eaa781d30b523f398',
            //         title: '这样的伦敦(上)',
            //     }
            // ]
            title: '',
            more: '',
            data: [],
            ads:[]
        }
    }
    componentDidMount() {
        // TODO:这里接收父级数据
        this.setState({
            title: this.props.parentData.title,
            more: this.props.parentData.more,
            data: this.props.parentData.data,
            ads:this.props.parentData.ads
        })
    }
    setOneKV(k, v) {
        this.setState({
            [k]: v
        })
    }
    render() {
    	console.log(this.state.ads);
        return <div className='part3'>
            <div className='part3_top'>
                <span className='title'>{this.state.title}</span>
                <span className="more">{this.state.more}<Icon type="right" /></span>
            </div>
            <div className='showBoxWrap'>
                <div className='showBox'>
                    {/* <div className="part3_part">
                        <img src="http://book.ellabook.cn/4f8e5cc88d2d4a0eaa781d30b523f398" alt="" />
                        <p>sdfdsfsddsdfgf</p>
                    </div> */}
                    {
                        this.state.data.map(item =>
                            <div className="part3_part">
                                <img src={item.img} alt="" />
                                <p style={{ webkitBoxOrient: 'vertical' }}>{item.title}</p>
                                
                            </div>
                        )
                    }
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