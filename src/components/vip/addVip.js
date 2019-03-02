import React from 'react';
import { Row, Col, Icon, Form, Button, Input, Radio, Modal, notification, InputNumber } from 'antd';
import { Link } from 'react-router';
import getUrl from '../util.js';
import commonData from '../commonData.js';
import './vip.css';
const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const confirm = Modal.confirm;
class addVip extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            activeTime: null,
            customerName: "",
            vipType: 'VIP'
        }
    }
    handleSubmit(e) {
        e.preventDefault();
        this.props.form.validateFields((err, v) => {
            if (!err) {
                var _this = this;
                confirm({
                    title: '请确认是否赠送会员给' + v.customerName + '用户?',
                    okText: '确定',
                    okType: 'primary',
                    cancelText: '继续编辑',
                    onOk() {
                        _this.submitData(v);
                    }
                });
                return;
            }
        });
    }
    async submitData(v) {
        if (!this.state.activeTime) {
            notification.error({
                message: '操作失败',
                description: "请填写会员有效期",
            })
            return
        }

        var doc = {
            customerName: v.customerName,
            vipType: this.state.vipType,
            activeTime: this.state.activeTime,
            operationUid: localStorage.getItem('uid')
        };

        var data = await fetch(getUrl.url, {
            mode: "cors",
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: "method=ella.operation.sendVIP.createSendVIPActivity" + "&content=" + JSON.stringify(doc) + commonData.dataString
        }).then(res => res.json());
        if (data.status == 1) {
            notification.success({
                message: '操作成功',
                description: '返回上级菜单',
            })
            window.history.back();
        } else {
            notification.error({
                message: '操作失败',
                description: data.message,
            })
        }
    }
    render() {
        const style = { marginBottom: '20px', borderBottom: "1px solid #ccc", paddingBottom: '10px' }
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: { span: 12 },
                sm: { span: 2 },
            },
            wrapperCol: {
                xs: { span: 12 },
                sm: { span: 4 },
            },
        };
        const config = {
            rules: [{ required: true, message: '输入不能为空' }],
        }
        return (
            <div id="Vip" style={{ padding: "10px 10px 0" }} className="item-fn">
                <Row style={style}>
                    <Link to="/vip" style={{ color: "#666" }}>
                        <Col span={4} style={{ fontSize: "16px" }}>
                            <Icon type="left" />
                            添加赠送会员
                        </Col>
                    </Link>
                </Row>
                <Form onSubmit={(e) => { this.handleSubmit(e) }}>
                    <FormItem
                        {...formItemLayout}
                        label="用户账号"
                        labelCol={{ span: 3 }}
                        wrapperCol={{ span: 6 }}
                    >
                        {getFieldDecorator('customerName', {
                            rules: [{ required: true, message: '输入不能为空' }],
                        })(
                            <Input
                                placeholder="请输入用户手机号或uid"
                            />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="会员类型"
                        labelCol={{ span: 3 }}
                        wrapperCol={{ span: 6 }}
                    >
                        <Row>
                            <Col >
                                <RadioGroup value={this.state.vipType} onChange={(e) => { this.setState({ vipType: e.target.value }) }}>
                                    <Radio value='VIP'>普通会员</Radio>
                                    <Radio value='SVIP'>高级会员</Radio>
                                </RadioGroup>
                            </Col>
                        </Row>
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="设定会员有效期"
                        labelCol={{ span: 3 }}
                        wrapperCol={{ span: 6 }}
                    >
                        <Row>
                            <Col span={24}>
                                <InputNumber disabled={true} value={this.state.activeTime} style={{ width: '50%' }} min={1} max={1825} precision={0} />
                                <span style={{ fontSize: '14px', marginLeft: 5 }}>天</span>
                            </Col>
                        </Row>
                    </FormItem>
                    <Row>
                        <Col offset={3}>
                            <RadioGroup className="ant-btn-days" style={{ marginTop: 15 }} onChange={(e) => { this.setState({ activeTime: e.target.value }) }}>
                                <RadioButton value="7">7天</RadioButton>
                                <RadioButton value="30">30天</RadioButton>
                                <RadioButton value="365">1年</RadioButton>
                                <RadioButton value="1095">3年</RadioButton>
                                <RadioButton value="1825">5年</RadioButton>
                            </RadioGroup>
                        </Col>
                    </Row>
                    <FormItem
                        wrapperCol={{
                            xs: { span: 12, offset: 0 },
                            sm: { span: 8, offset: 3 },
                        }}
                    >
                        <Button className="submit" type="primary" htmlType="submit">保存</Button>
                    </FormItem>
                </Form>

            </div>
        )
    }
}

addVip = Form.create()(addVip)

export default addVip;



