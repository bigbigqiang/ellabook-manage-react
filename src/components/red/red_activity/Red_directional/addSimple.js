import React from 'react';
import {Row,Col,Card,Icon,Button,Table,Input, Form, Select, DatePicker, Checkbox, Tooltip, Modal,InputNumber} from "antd";
import { Link} from 'react-router';
import getUrl from "../../../util.js";
import "./add.css";
// import moment from 'moment';
// import 'moment/locale/zh-cn';
const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
const Option = Select.Option;
const confirm = Modal.confirm;
class addGoods extends React.Component {
	constructor(){
		super()
		this.state={
			btn1 : "",        //用户数量输入框值
      btn2 : true,      //是否限量选项
      redList:[
        {
          id : 0, 
          price:"1",
          num : 0
        }
      ],                //红包金额列表
      phoneNumberList : [
      ],                //输入定向手机号码列表
		}
	}
  handleSubmit = (e) => {
    e.preventDefault();
    //验证成功后执行
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // console.log(values["date-time-picker"].format('YYYY-MM-DD HH:mm:ss'))
        // 这里到时候判断用户数量是否不限定,所有红包价格是否等于红包金额
        this.showDeleteConfirm();
        console.log('Received values of form: ', values);
      }
    });
  }
//红包相关函数
  addRedItem(){
    this.setState({
      redList : [
        ...this.state.redList,
        {
          id : this.state.redList.reduce((a,b)=> b).id + 1,
          price:1,
          num : 0
        }
      ]
    })
  }
  minusRedItem(id){
    this.setState({
      redList : this.state.redList.filter(item => item.id != id)
    })
  } 
  changeRedPrice(k,v,id){
    console.log(v,id)
    this.setState({
      redList : this.state.redList.map((item,index)=>{
        if(item.id != id) return item;
        return {
          ...item,
          [k] : v
        }
      })
    })
  }
//红包相关函数
//模态框
showDeleteConfirm() {
  confirm({
    title: '你已经确定你填写的数据了吗?',
    content: '点确定将提交后台',
    okText: '确定',
    okType: 'primary',
    cancelText: '继续编辑',
    onOk() {
      console.log('OK');
    },
    onCancel() {
      console.log('Cancel');
    },
  });
}
//输入发送对象号码
getPhoneNumberList(value) {
  console.log(typeof value)
  console.log(`selected ${value}`);
  this.setState({
    phoneNumberList : value
  })
}
checkPrice = (rule, value, callback) => {
    console.log(value);
    if (value > 0) {
      callback();
      return;
    }
    callback('必须填写大于0的数字');
}
	render(){
  //////////////样式/////////////////// 
        const title = {
            lineHeight: "50px",
            borderBottom: "1px solid #e3e6e6",
            textIndent: "8px",
        }
        const back = {
            paddingRight : "8px"
        }
        const box = {
          padding : "40px 20px 20px 20px"
        }
        const font_color = {
          color:"#242424"
        }
        const font_14px = {
          fontSize : "14px"
        }
        const addAndMud = {
          fontSize : "24px",
          cursor : "pointer"
        }
        const red_detail = {
          margin : "0px 0px 24px 0px",
          textAlign : "center",
          lineHeight : "26px"
        }
        const redListData = {
          margin : "0px 0px 5px 0px"
        }
  //////////////样式/////////////////// 
    const { getFieldDecorator } = this.props.form;
    const text_prompt = "请填写内容";
    const config = {
      // initialValue : moment("2017-01-01 12:11:22", 'YYYY-MM-DD HH:mm:ss'),
      rules: [{ type: 'object', required: true, message: text_prompt }],
    };
    // 默认输入电话号码列表
    const children = [];
    console.log(this.state.redList)
		return <div className="add">
        <div style={box}>
          <Form onSubmit={this.handleSubmit}>

            <FormItem
              label="活动名称"
              labelCol={{ span : 3 }}
              wrapperCol={{ span : 6 }}>
              {
                getFieldDecorator('note', {
                  initialValue : "用户充值补偿红包",
                  rules: [{ required: true, message: text_prompt }],
                })(<Input placeholder="请输入活动名称"/>)
              }
            </FormItem>

            <FormItem
              label="需要发送的手机号"
              labelCol={{ span : 3 }}
              wrapperCol={{ span : 6 }}>
              <Row>
                <Col span={24}>
                  {
                    getFieldDecorator('number', {
                      rules: [{ required: true, message: text_prompt }],
                    })(
                      <Select
                        mode="tags"
                        style={{ width: '100%' }}
                        onChange={(value)=>{this.getPhoneNumberList(value)}}
                        tokenSeparators={[',']}
                        placeholder="在下面输入手机号码或账号，按回车继续输入"
                      >
                        {children}
                      </Select>
                    )
                  }
                </Col>
              </Row>
              <Row>
                <Col offset={16} className="totle_num">
                  <span style={{...font_14px}}>共{this.state.phoneNumberList.length}人</span>
                </Col>
              </Row>
              
            </FormItem>

            {/*<Row>
              <Col span={3} offset = {0}> 
                <span style={{...font_14px}}>需要发送的手机号:</span>
              </Col>
              <Col span={5} offset = {2}>
                <span style={{...font_14px,color:'red'}}>目前输入共{this.state.phoneNumberList.length}人</span>
              </Col>
            </Row>
            <Row>
              <Col span={6} offset={3}>
                <Tooltip placement="topLeft" title={"在下面输入手机号码或账号，按回车继续输入下一个"}>
                  <Select
                    mode="tags"
                    style={{ width: '100%' }}
                    onChange={(value)=>{this.getPhoneNumberList(value)}}
                    tokenSeparators={[',']}
                    placeholder="在下面输入手机号码或账号，按回车继续输入"
                  >
                    {children}
                  </Select>
                </Tooltip>
              </Col>
            </Row>*/}
            <FormItem
              label="红包金额"
              labelCol={{ span : 3 }}
              wrapperCol={{ span: 6 }}>
              <Row>
                <Col span={8}>
                  {
                    getFieldDecorator('note1', {
                      rules: [{ required: true,validator:this.checkPrice }],
                    })(<InputNumber/>)
                  }
                </Col>
                <Col offset={1} span={4}>
                  <spen style={font_14px}>
                    元
                  </spen>
                </Col>
              </Row>
            </FormItem>

            <Row>
              <Col span={12} offset={3}>
                {
                  this.state.redList.map(item=>{
                    return  (
                      <Row style={red_detail}>
                        <Col span={4}>
                          <Select value={item.price+"元"} style={{ width: "100%" }} onChange={(value)=>{this.changeRedPrice("price",value,item.id)}}>
                            <Option value="1">1元</Option>
                            <Option value="2">2元</Option>
                            <Option value="3">3元</Option>
                            <Option value="4">4元</Option>
                          </Select>
                        </Col>
                        <Col span={1} offset={1}>
                          <Icon type="close" />
                        </Col>
                        <Col span={4} offset={1}>
                          <InputNumber onChange={(value)=>{this.changeRedPrice("num",value,item.id)}} value={item.num}/>
                        </Col>
                        <Col style={addAndMud} span={1} offset={1}>
                          <Tooltip placement="top" title={"点击增加红包"}><Icon className="addAndMud" onClick={()=>{this.addRedItem()}} type="plus-circle" /></Tooltip>
                        </Col>
                        <Col style={addAndMud} span={1} offset={1}>
                          {
                            this.state.redList.length==1 ? <div></div> : <Tooltip placement="top" title={"点击删除"}><Icon className="addAndMud" onClick={()=>{this.minusRedItem(item.id)}}  type="minus-circle" /></Tooltip>
                          }
                        </Col>
                      </Row>
                    )
                  })
                }
              </Col>
            </Row>

            <Row>
              <Col span={12} offset={3}>
                {/*<p style={redListData}>1x2=2元</p>
                <p style={redListData}>1x2=2元</p>*/}
                {
                  this.state.redList.map(item=>{
                    return <p style={redListData}>{item.price}元x{item.num==""?0:item.num}={item.price*item.num}元</p>
                  })
                }
              </Col>
            </Row>

            <FormItem
              label="红包有效期"
              labelCol={{ span : 3 }}
              wrapperCol={{ span: 6 }}>
              <Row>
                <Col span={8}>
                  {
                    getFieldDecorator('note2', {
                      rules: [{ required: true,validator:this.checkPrice }],
                    })(<InputNumber/>)
                  }
                </Col>
                <Col offset={1} span={4}>
                  <spen style={font_14px}>
                    天
                  </spen>
                </Col>
              </Row>
            </FormItem>

            <FormItem
              wrapperCol={{ span: 12, offset: 3 }}>
              <Button className="submit" type="primary" htmlType="submit">
                保存
              </Button>
            </FormItem>
          </Form>
        </div>
		</div>
	}
}
const WrappedApp = Form.create()(addGoods);

// React.ReactDOM.render(<WrappedApp />, mountNode);
export default WrappedApp ;