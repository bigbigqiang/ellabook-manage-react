import React from 'react';
import { Card, Icon } from 'antd';
import './part2.css';
import getUrl from "../util.js";


export default class PriceSet extends React.Component {

    constructor() {
        super()
        this.state = {
            title: '',
            more: '',
            data: [],
            ads:[]
        }
    }
    componentDidMount() {
        // TODO:这里接收父级数据
        	console.log(this.props.parentData)
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
        return <div className='part2'>
            <div className='part2_top'>
                <span className='title'>{this.state.title}</span>
                <span className="more">{this.state.more}<Icon type="right" /></span>
            </div>
            <div className='part2_box'>
                {/* <div className='part2_item'>
                    <img src="http://book.ellabook.cn/4f8e5cc88d2d4a0eaa781d30b523f398" alt="" />
                    <div className='pWrap'>
                        <p>丫丫历险记一离家出走(1)</p>
                    </div>
                </div> */}
                {
                    this.state.data.map(item =>
                        <div className='part2_item'>
                            <img src={item.img} alt="" />
                            <div className='pWrap'>
                                <p style={{ webkitBoxOrient: 'vertical' }}>{item.title}</p>
                            </div>
                            
                        </div>
                    )
                }
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