import React from 'react';
import {Row,Col,Card,Icon} from "antd";
import { Link} from 'react-router';
import getUrl from "../util.js";
import "./Red.css";
export default class addGoods extends React.Component {

	constructor(){
		super()
		this.state={

		}
	}
	render(){
	//////////////样式///////////////////	
		const redType = {
			padding:"60px 0px 40px 60px"
		}	
		const red_title = {
			lineHeight: "50px",
    		borderBottom: "1px solid #e3e6e6",
    		textIndent: "20px",
		}
        const row_1 = {
            margin:"0px 0px 80px 0px"
        }
		const card = {
			cursor:"pointer",
            height:"230px",
            borderRadius:"10px"
		}
		const card_div={
			textAlign: "center",
    		lineHeight: "180px",
    		fontSize: "50px",
    		color: "white"
		}
        const small_title = {
            position:"relative",
            top:"-8px",
            fontSize:"20px",
            paddingLeft:"20px",
            lineHeight:"20px"
        } 
	//////////////样式///////////////////	
		return <div className="red_box">
			<h2 style={red_title}>红包活动</h2>
			<div style={redType}>
				<Row style={row_1}>
    			  	<Col span={7} >
    			  		<Link to="/red/redactivity">
    			    		<Card className="card" bodyStyle={{...card,backgroundColor:"#7569bc"}} bordered={false}>
    			    			<div style={{...card_div}}>
    			    				<p><Icon className="small_icon" type="gift" /><span className="small_title" >红包活动</span></p>
    			    			</div>
    			    		</Card>
    			    	</Link>
    			  	</Col>
    			  	<Col span={7} offset={1}>
    			  		<Link to="/red/reddirectional">
    			    		<Card className="card" bodyStyle={{...card,backgroundColor:"#ad7ae4"}} bordered={false}>
    			    			<div style={card_div}>
    			    				<p><Icon className="small_icon" type="solution" /><span className="small_title">定向红包</span></p>
    			    			</div>
    			    		</Card>
    			    	</Link>
    			  	</Col>
    			  	<Col span={7} offset={1}>
    			  		<Link to="/red/redpay">
    			    		<Card className="card" bodyStyle={{...card,backgroundColor:"#fad734"}} bordered={false}>
    			    			<div style={card_div}>
    			    				<p><Icon className="small_icon" type="wallet" /><span className="small_title" >充值送红包</span></p>
    			    			</div>
    			    		</Card>
    			    	</Link>
    			  	</Col>
    			</Row>
                <Row>
                    <Col span={7}>
                        <Link to="/red/redregister">
                            <Card className="card" bodyStyle={{...card,backgroundColor:"#23b8e5"}} bordered={false}>
                                <div style={card_div}>
                                    <p><Icon className="small_icon" type="user-add" /><span className="small_title">注册送红包</span></p>
                                </div>
                            </Card>
                        </Link>
                    </Col>
                </Row>
			</div>
		</div>
	}
}