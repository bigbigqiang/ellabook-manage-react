import React from 'react';
import {Row,Col,Card,Icon,Button,Table,Input, Form, Select, DatePicker, Checkbox, Tooltip, Modal, notification, message} from "antd";
import { Link} from 'react-router';
import getUrl from "../../util.js";
import "./add.css";
import { dataString } from '../../commonData.js'
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
      ],
      input_a : null,
      input_b : null,
      input_c : null,
      input_d : null,
      input_e : null,
      defaultData : []
		}
	}
  componentDidMount(){
    this.fetchDefaultData(this.props.params.id)
  }
  async fetchDefaultData(cardCode){
    var doc = {
      cardCode
    }
    var data = await fetch(getUrl.url,{
        mode : "cors",
        method : "POST",
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body:"method=ella.operation.getVipCardConfigInfoByCardCode"+"&content="+JSON.stringify(doc)+dataString
    }).then(res => res.json())
    console.log(data)

    this.setState({
      defaultData : data.data
    })
  }
  handleSubmit = (e) => {
    e.preventDefault();
    //验证成功后执行
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // console.log(values["date-time-picker"].format('YYYY-MM-DD HH:mm:ss'))
        // 这里到时候判断用户数量是否不限定,所有红包价格是否等于红包金额
        // console.log('Received values of form: ', values);
        this.showDeleteConfirm(values);
      }
    });
  }


//模态框
showDeleteConfirm(values) {
  var _this = this;
  confirm({
    title: '你已经确定你填写的数据了吗?',
    content: '点确定将提交后台',
    okText: '确定',
    okType: 'primary',
    cancelText: '继续编辑',
    onOk() {
      console.log(values);
      _this.submitData(values)
    },
    onCancel() {
      console.log('Cancel');
    },
  });
}
// 修改数据提交
async submitData(values){
  var doc = {
    ...values,
    cardCode : this.props.params.id
  }
  var data = await fetch(getUrl.url,{
        mode : "cors",
        method : "POST",
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body:"method=ella.operation.updateVipCardConfigByCardCode"+"&content="+JSON.stringify(doc)+dataString
    }).then(res => res.json())
  if(data.status == 1){
    notification.success({
      message: '保存成功',
      // description: '回到上级菜单',
    })
    // window.history.back();
  }else{
    notification.error({
      message: '保存失败',
      description: '后端接口错误啦',
    })
  }
  console.log(data)
}
checkPrice = (rule, value, callback) => {
    // console.log(value);
    if (value > 0) {
      callback();
      return;
    }
    callback('必须填写大于0的数字');
}
	render(){
  //////////////样式/////////////////// 
        const title = {
            // lineHeight: "50px",
            fontSize:"16px",
            padding:"10px 0px",
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
          // fontSize : "24px",
          // cursor : "pointer",
          // color:"#27c14c",
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
    console.log(this.state)
    // console.log(this.props.params.id)
		return <div className="add">
      <h2 style={title}><Link style={font_color} to="/textList" ><Icon style={back} type="left" />添加红包活动</Link></h2>
        <div className="filetext" style={box}>
          <Form onSubmit={this.handleSubmit}>

            <FormItem
              label="一级标题"
              labelCol={{ span : 3 }}
              wrapperCol={{ span : 9 }}>
              <Row>
                <Col span={10}>
                  {
                    getFieldDecorator('title', {
                      initialValue :this.state.defaultData.title||null,
                      rules: [{ required: true, message: text_prompt }],
                    })(<Input placeholder={"请输入活动名称"} />)
                  }
                </Col>
                <Col className="button_warp_1" span={8} offset={2}>
                  {
                    <Tooltip placement="top" title={"原有内容"}>
                      <Button disabled style={{width:"100%"}} onClick={()=>{}}>{this.state.defaultData.title}</Button>
                    </Tooltip>
                  }
                </Col>
              </Row>  
            </FormItem>

            <FormItem
              label="二级标题"
              labelCol={{ span : 3 }}
              wrapperCol={{ span : 9 }}>
              <Row>
                <Col span={10}>
                  {
                    getFieldDecorator('remark', {
                      initialValue :this.state.defaultData.remark||null,
                      rules: [{ required: true, message: text_prompt }],
                    })(<Input placeholder={"请输入活动名称"} />)
                  }
                </Col>
                <Col className="button_warp_1" span={8} offset={2}>
                  {
                    <Tooltip placement="top" title={"原有内容"}>
                      <Button disabled style={{width:"100%"}} onClick={()=>{}}>{this.state.defaultData.remark}</Button>
                    </Tooltip>
                  }
                </Col>
              </Row>  
            </FormItem>

            <FormItem
              label="原价展示文字"
              labelCol={{ span : 3 }}
              wrapperCol={{ span : 9 }}>
              <Row>
                <Col span={10}>
                  {
                    getFieldDecorator('marketPriceContent', {
                      initialValue :this.state.defaultData.marketPriceContent||null,
                      rules: [{ required: true, message: text_prompt }],
                    })(<Input placeholder={"请输入活动名称"} />)
                  }
                </Col>
                <Col className="button_warp_1" span={8} offset={2}>
                  {
                    <Tooltip placement="top" title={"原有内容"}>
                      <Button disabled style={{width:"100%"}} onClick={()=>{}}>{this.state.defaultData.marketPriceContent}</Button>
                    </Tooltip>
                  }
                </Col>
              </Row>  
            </FormItem>

            <FormItem
              label="价格标示"
              labelCol={{ span : 3 }}
              wrapperCol={{ span : 9 }}>
              <Row>
                <Col span={10}>
                  {
                    getFieldDecorator('priceContent', {
                      initialValue :this.state.defaultData.priceContent||null,
                      rules: [{ required: true, message: text_prompt }],
                    })(<Input placeholder={"请输入活动名称"} />)
                  }
                </Col>
                <Col className="button_warp_1" span={8} offset={2}>
                  {
                    <Tooltip placement="top" title={"原有内容"}>
                      <Button disabled style={{width:"100%"}} onClick={()=>{}}>{this.state.defaultData.priceContent}</Button>
                    </Tooltip>
                  }
                </Col>
              </Row>  
            </FormItem>

            <FormItem
              label="实际售价"
              labelCol={{ span : 3 }}
              wrapperCol={{ span : 9 }}>
              <Row>
                <Col span={10}>
                  {
                    getFieldDecorator('price', {
                      initialValue :this.state.defaultData.price||null,
                      rules: [{ required: true, message: text_prompt }],
                    })(<Input placeholder={"请输入活动名称"} />)
                  }
                </Col>
                <Col className="button_warp_1" span={8} offset={2}>
                  {
                    <Tooltip placement="top" title={"原有内容"}>
                      <Button disabled style={{width:"100%"}} onClick={()=>{}}>{this.state.defaultData.price}</Button>
                    </Tooltip>
                  }
                </Col>
              </Row>  
            </FormItem>

            <FormItem
              wrapperCol={{ span : 3 ,offset:5}}>
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