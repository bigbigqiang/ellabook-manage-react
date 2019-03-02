import React from 'react';
import { Card, Icon } from 'antd';
import './part4.css';
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
        this.setState({
            title: this.props.parentData.title,
            more: this.props.parentData.more,
            data: this.props.parentData.data,
            ads:this.props.parentData.ads,
            moduleImg:this.props.parentData.moduleImg
        })
    }
    setOneKV(k, v) {
        this.setState({
            [k]: v
        })
    }
    render() {
    	
        return <div className='part4'>
            <div className='part4_top'>
                <span className='title'>{this.state.title}</span>
                
            </div>
			<div className="bottomAdvert">
    			
				<div className="imgWrap">
					<img src={this.state.moduleImg} alt="" />
				</div>
    		
            </div>
        </div>
    }
}