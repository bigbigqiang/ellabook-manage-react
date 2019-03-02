import React from 'react'
import { Form, Input, Icon, Select, Button, Modal, message } from 'antd'
import { Link } from 'react-router'
const FormItem = Form.Item
const Option = Select.Option;
var util = require('../util.js');
import commonData from '../commonData.js';
class myForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: false,
            status: this.props.params.status,
            data: [],
            moduleTitle: '123'
        }
    }

    // 选择select
    handleSelectChange = (value) => {
        console.log(value);
        this.setState({
            columnCode: value.key,
            moduleTitle: value.label
        });
    }

    // 提交表单


    selectFetchFn = async () => {
        var data = await fetch(util.url, {
            method: 'POST',
            headers: {
                "Content-type": "application/x-www-form-urlencoded"
            },
            mode: 'cors',
            body: "method=ella.operation.findNotShowPart" + commonData.dataString
        })
            .then(function (response) {
                return response.json();
            });
        var data = data.data
        this.setState({
            data: data,
            defaultValue: data[0].moduleTitle,
            columnCode: data[0].moduleTitle
        });
        console.log(JSON.stringify(this.state.data));

    }

    submitFetchFn = async (columnCode, moduleTitle) => {
        var doc = {
            columnCode: columnCode,
            moduleTitle: moduleTitle
        }
        var data = await fetch(util.url, {
            method: 'POST',
            headers: {
                "Content-type": "application/x-www-form-urlencoded"
            },
            mode: 'cors',
            body: "method=ella.operation.addHomePageModule" + "&content=" + JSON.stringify(doc) + commonData.dataString
        })
            .then(function (response) {
                return response.json();
            });
        if (data.status == 1) {
            message.success('成功!');
            // this.props.form.resetFields()
        } else {
            message.error(data.message);
        }
        console.log(JSON.stringify(data));
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.submitFetchFn(this.state.columnCode, this.state.moduleTitle);
        //
    }
    componentDidMount() {
        this.selectFetchFn();
    }
    // 显示弹框
    showModal = () => {
        this.setState({ visible: true })
    }


    // 隐藏弹框
    hideModal = () => {
        this.setState({ visible: false })
    }

    render() {
        const { getFieldDecorator } = this.props.form
        console.log(getFieldDecorator);
        const formItemLayout = {
            labelCol: { span: 1 },
            wrapperCol: { span: 8 }
        }

        return (
            <div>
                <p className="m-title"><Link to='/index'><Icon type="left" />添加新模块</Link></p>

                <Form horizontal onSubmit={this.handleSubmit}>
                    <FormItem
                        id="control-input"
                        label="模块内容"
                        className='f-ft-14'
                        {...formItemLayout}
                    >
                        <span className='f-ft-14'>推荐模块</span>
                        <Select labelInValue defaultValue={{ key: this.state.columnCode }} style={{ marginLeft: 20, width: 120 }} onChange={this.handleSelectChange}>
                            {
                                this.state.data.map(item => {
                                    return <Option value={item.columnCode}>{item.moduleTitle}</Option>
                                })
                            }
                        </Select>
                    </FormItem>
                    <FormItem wrapperCol={{ span: 6, offset: 1 }} style={{ marginTop: 24 }}>
                        <Button type="primary" htmlType="submit">确定</Button>
                    </FormItem>
                </Form>
            </div>
        )
    }
}

myForm = Form.create()(myForm)

export default myForm