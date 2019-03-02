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
			btn1 : "",     //用户数量输入框值
      btn2 : true,    //是否限量选项
      redList:[
        {
          id : 0, 
          price:"1",
          num : 0
        }
      ]
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
    console.log(this.state.redList)
		return <div className="add">
      <h2 style={title}><Link style={font_color} to="/red/redregister" ><Icon style={back} type="left" />添加注册红包</Link></h2>
        <div style={box}>
          <Form onSubmit={this.handleSubmit}>

            {/*<FormItem
              label="活动名称"
              labelCol={{ span : 5, offset : 3 }}
              wrapperCol={{ span : 6 }}>
              {
                getFieldDecorator('note', {
                  // initialValue : "哈哈哈",
                  rules: [{ required: true, message: text_prompt }],
                })(<Input />)
              }
            </FormItem>*/}

            <FormItem
              label="渠道"
              labelCol={{ span: 3 }}
              wrapperCol={{ span: 3 }}>
              {
                getFieldDecorator('channel', {
                  initialValue : 1,
                  rules: [{ required: true, message: text_prompt }],
                })(
                    <Select style={{ width: "100%" }}>
                      <Option value="1">1元</Option>
                      <Option value="2">2元</Option>
                      <Option value="3">3元</Option>
                      <Option value="4">4元</Option>
                    </Select>
                  )
              }
            </FormItem>

            <FormItem
              label="红包金额"
              labelCol={{ span: 3 }}
              wrapperCol={{ span: 6 }}>
              <Row>
                <Col span={8}>
                  {
                    getFieldDecorator('note1', {
                      rules: [{ required: true, validator:this.checkPrice }],
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
                            this.state.redList.length==1 ? <div></div> : <Tooltip placement="top" title={"点击删除"}><Icon className="addAndMud" onClick={()=>{this.minusRedItem(item.id)}} type="minus-circle" /></Tooltip>
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
              labelCol={{ span: 3 }}
              wrapperCol={{ span: 6 }}>
              <Row>
                <Col span={8}>
                  {
                    getFieldDecorator('note2', {
                      rules: [{ required: true, validator:this.checkPrice }],
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
              labelCol={{ span: 3 }}
              wrapperCol={{ span: 4 }}
              label="开始时间">
              {
                getFieldDecorator('date1', config)(
                  <DatePicker style={{width:"100%"}} showTime format="YYYY-MM-DD HH:mm:ss" />
                )
              }
            </FormItem>

            <FormItem
              labelCol={{ span: 3 }}
              wrapperCol={{ span: 4 }}
              label="结束时间">
              {
                getFieldDecorator('date2', config)(
                  <DatePicker style={{width:"100%"}} showTime format="YYYY-MM-DD HH:mm:ss" />
                )
              }
            </FormItem>

            {/*<FormItem
              label="用户数量"
              labelCol={{ span: 5, offset : 3 }}
              wrapperCol={{ span: 6}}>
              <Row>
                <Col span={12}>
                  {
                    getFieldDecorator('note3', {
                      rules: [
                        { required: false, message:this.state.btn2?'' : text_prompt },
                        ],
                    })(<Input type="number" />)
                  }
                </Col>
                <Col span={11} offset={1}>
                  <Tooltip placement="top" title={this.state.btn2?"如果去掉勾选不要忘记填写用户数量":"如果勾选用户数量为不限定"}>
                    <Checkbox onChange={()=>{this.setState({btn2 : !this.state.btn2})}} defaultChecked>不限定</Checkbox>
                  </Tooltip>
                </Col>
              </Row>
            </FormItem>*/}

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