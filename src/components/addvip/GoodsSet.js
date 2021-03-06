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
      goodsType  : "看书会员",//商品类型
      iosPriceId : "",//商品码 
      thirdCode  : "",
      fetchIosPriceId :[]
		}
    //拉IosPriceId
    this.fetchdata();
    //改内容
    getGoodsSetData("goodsType","ELLA_VIP");
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
    console.log(this.state.fetchIosPriceId)
    return (
      <div>
        <h3>商品设定</h3>
        <div className="goodsSet">
          <Row className="row">
            <Col className="goodsSetTitle" span={2}>商品 ID:</Col>
            <Col className="goodsSetTitle" span={6}>未知</Col>
            <Col className="goodsSetTitle" span={2}>IOS 商品码:</Col>
            <Col span={4}>
              <Select 
              placeholder="请选择商品码"
              style={{ width: 200 }} 
              onChange={(value)=>{this.handleChange("iosPriceId",value)}}>
                {
                  this.state.fetchIosPriceId.map(item=>{
                    return <Option value={item.searchCode}>{item.searchName.split("--")[0]}</Option>
                  })
                }
              </Select>
            </Col>
          </Row>
          <Row>
            <Col className="goodsSetTitle" span={2}>商品类型:</Col>
            <Col className="goodsSetTitle" span={6}>{this.state.goodsType}</Col>
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