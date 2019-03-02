import React from 'react';
import { Row, Col, Card, Icon, Button, Table, Input, Form, Select, DatePicker, Checkbox, Tooltip, Modal, notification, message } from "antd";
import { Link } from 'react-router';
import getUrl from "../util.js";
import commonData from '../commonData.js';
// import "./add.css";
import moment from 'moment';
import 'moment/locale/zh-cn';
const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
const Option = Select.Option;
const confirm = Modal.confirm;
class addGoods extends React.Component {
    constructor() {
        super()
        this.state = {

        }
    }
    componentDidMount() {
        this.props.form.validateFields();
    }
    hasErrors(fieldsError) {
        console.log(fieldsError)
        return Object.keys(fieldsError).some(field => fieldsError[field]);
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
            }
        });
    }
    render() {
        const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;

        // Only show error after a field is touched.
        const userNameError = isFieldTouched('userName') && getFieldError('userName');
        const passwordError = isFieldTouched('password') && getFieldError('password');
        return <div>
            <Form layout="inline" onSubmit={this.handleSubmit}>
                <Row>
                    <Col span={10} offset={4}>
                        <FormItem
                            validateStatus={userNameError ? 'error' : ''}
                            help={userNameError || ''}
                        >
                            {
                                getFieldDecorator('userName', {
                                    rules: [
                                        {
                                            required: true,
                                            // message: 'Please input your username!',
                                            validator: (rule, value, callback) => {
                                                if (value != '45565q') {
                                                    callback('错误了错误了');
                                                    return;
                                                }
                                                // callback('正确了');
                                            }
                                        }],
                                }
                                )(
                                    <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username" />
                                )
                            }
                        </FormItem>
                    </Col>
                </Row>
                <FormItem
                    validateStatus={passwordError ? 'error' : ''}
                    help={passwordError || ''}
                >
                    {getFieldDecorator('password', {
                        rules: [{ required: true, message: 'Please input your Password!' }],
                    })(
                        <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
                    )}
                </FormItem>
                <FormItem>
                    <Button
                        type="primary"
                        htmlType="submit"
                        disabled={this.hasErrors(getFieldsError())}
                    >
                        Log in
                    </Button>
                </FormItem>
            </Form>
        </div>
    }
}
const WrappedApp = Form.create()(addGoods);

// React.ReactDOM.render(<WrappedApp />, mountNode);
export default WrappedApp;