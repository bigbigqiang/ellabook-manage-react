import React from 'react';
import { Row ,Col ,Select ,Input} from 'antd';
import "./GoodsSet.css";
import getUrl from "../util.js";
import { dataString } from '../commonData.js'
const Option = Select.Option;
//本组件参数 thirdCode:商品ID,goodsType:商品类型,goodsName:商品名字
export default class GoodsSet extends React.Component {
	constructor({getGoodsSetData,prveData,goodsinfo}){
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
  ////////////////////////////////////////////
  componentDidMount(){
    this.fetchGoodsinfo(this.props.prveData.goodsCode);
  }
  async fetchGoodsinfo(str){
    var data = await fetch(getUrl.url,{
      mode : "cors",
          method : "POST",
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body:"method=ella.operation.getGoodsInfoByCode"+"&content="+JSON.stringify({"goodsCode":str})+dataString
    }).then(res => res.json())
    //如果有默认值那就在这里设置
    if (data.status == 1) {
			this.setState({goodsName:data.data.goodsName})
		} else {
			console.log(data.message)
		}
  }
  render(){
    return (
      <div>
        <h3>商品设定</h3>
        <div className="goodsSet">
          <Row className="row">
            <Col span={2}><span className="rowTit">商品 ID:</span></Col>
            <Col span={6}><span className="rowTit">{this.props.prveData.goodsCode}</span></Col>
            <Col span={2}><span className="rowTit">{this.props.prveData.goodsType =="图书"?" ": "IOS 商品码:"}</span></Col>
            <Col span={4}>
            {
              this.props.goodsinfo.iosPriceId
              ?
              <Select 
              placeholder="请选择商品码"
              style={{ width: 200 }} 
              defaultValue={this.props.goodsinfo.iosPriceId}
              onChange={(value)=>{this.handleChange("iosPriceId",value)}}>
                {
                  this.state.fetchIosPriceId.map(item=>{
                    return <Option value={item.searchCode}>{item.searchName.split("--")[0]}</Option>
                  })
                }
              </Select>
              : 
              <div></div>
            }
            </Col>
          </Row>
          <Row>
            <Col span={2}><span className="rowTit">商品类型:</span></Col>
            <Col span={6}><span className="rowTit">{this.props.prveData.goodsType}</span></Col>
            <Col span={2}><span className="rowTit">商品名称:</span></Col>
            <Col span={4}>
              <Input 
              onBlur={(e)=>{this.handleChange("goodsName",e.target.value)}} 
              defaultValue={this.props.prveData.goodsName} 
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