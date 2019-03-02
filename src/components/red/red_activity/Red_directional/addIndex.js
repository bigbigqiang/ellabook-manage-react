import React from 'react';
import {Row,Col,Card,Icon,Button,Table,Select} from "antd";
import { Link} from 'react-router';
import getUrl from "../../../util.js";
import Ordinary from "./addSimple.js";
import Channel from "./addChannel.js";
const Option = Select.Option;
export default class addGoods extends React.Component {

	constructor(){
		super()
		this.state={
			type:"putong"
		}
	}
  handleChange(value) {
    console.log(`selected ${value}`);
    this.setState({
      type : value
    })
  }
	render(){
    //样式
        const title = {
            lineHeight: "50px",
            borderBottom: "1px solid #e3e6e6",
            textIndent: "8px",
        }
        const back = {
            paddingRight : "8px"
        }
        const font_color = {
          color:"#242424"
        }
        const red_directional = {
          fontSize : "14px",
          textAlign : "right",
          lineHeight: "27px",
          fontFamily:"\\5FAE\8F6F\96C5\9ED1,sans-serif",
          color: "rgba(0,0,0,.85)",
          paddingRight:"10px"
        }
        const channel_wrap={
          margin : "40px 0px 0px 0px"
        }
    //样式
		return <div className="red">
      <h2 style={title}><Link style={font_color} to="/red/reddirectional" ><Icon style={back} type="left" />添加定向红包</Link></h2>
      <Row style={channel_wrap}>
        <Col style={red_directional} span={3} offset={0}>
          <span>定向红包类型:</span>
        </Col>
        <Col span={2} offset={0}>
          <Select  width="100%" defaultValue="putong" style={{ width: "100%",marginLeft: "16px" }} onChange={(value)=>{this.handleChange(value)}}>
            <Option value="putong">普通</Option>
            <Option value="qudao">渠道</Option>
          </Select>
        </Col>
        {
          this.state.type=="putong"
          ?
          <div></div>
          :
          <Col span={2} offset={2}>
            <Select defaultValue="putong" style={{ width: "100%" }} onChange={(value)=>{this.handleChange(value)}}>
              <Option value="putong">普通</Option>
              <Option value="qudao">渠道</Option>
            </Select>
          </Col>
        }
      </Row>
      {
        this.state.type=="putong"?<Ordinary></Ordinary>:<Channel>aaaaa</Channel>
      }
		</div>
	}
}