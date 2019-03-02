import React from 'react';
import { Row ,Col ,Select ,Input} from 'antd';
import "./GoodsSet.css";
import getUrl from "../util.js";
import { dataString } from '../commonData.js'
const Option = Select.Option;
//本组件参数 thirdCode:商品ID,goodsType:商品类型,goodsName:商品名字
export default class GoodsSet extends React.Component {
	constructor({getGoodsSetData}){
		super()
		this.state={
			goodsName  : "",//商品名字
      goodsType  : "内容",//商品类型
      iosPriceId : "",//商品码 
      thirdCode  : "",
      fetchIosPriceId :[]
		}
    //拉IosPriceId
	this.fetchdata();
    //改内容
    getGoodsSetData("goodsType","BOOK");
	}
	componentDidMount() {
       
  }
  //拉数据
  async fetchdata(){
    var data = await fetch(getUrl.url, {
      mode : "cors",
      method : "POST",
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body:"method=ella.operation.boxSearchList"+"&content="+JSON.stringify({groupId:"IOS_PRICE_CODE"})+dataString
    }).then(res => res.json())
    //改state
    this.setState({
      fetchIosPriceId : data.data
    })
  }

  //接收数据
  handleChange(name,value) {
    this.props.getGoodsSetData(name,value);
  }
  
  render(){
    return (
      <div>
        <h3>商品设定</h3>
        <div className="goodsSet">
          <Row className="row">
            <Col className="goodsSetTitle" span={2}>商品 ID:</Col>
            <Col className="goodsSetTitle" span={6}>未知</Col>
          </Row>
          <Row>
            <Col className="goodsSetTitle" span={2}>商品类型:</Col>
            <Col className="goodsSetTitle" span={6}>内容</Col>
            <Col className="goodsSetTitle" span={2}>商品名称:</Col>
            <Col span={4}>
              <Input 
              onBlur={(e)=>{this.handleChange("goodsName",e.target.value)}}  
              style={{ width: 200 }} 
              placeholder="请输入商品名字" />
            </Col>
          </Row>
        </div>
        <hr/>
      </div>
    )
  }
}