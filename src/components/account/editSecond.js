/**
 * Created by Administrator on 2018/3/20.
 */
import React from 'react'
import {Table,Pagination,Select,DatePicker,Button,Input,Icon ,Spin ,Row ,Col ,Form} from 'antd';
import { Link,hashHistory} from 'react-router';
import getUrl from "../util.js"
const FormItem = Form.Item;
const { Option, OptGroup } = Select;
const Search = Input.Search;
class firstPartner extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loading:true,
        }
    }

    //即将插入本组件时，开始请求数据，准备渲染
    componentWillMount(){

    }

    //虚拟dom变成真实dom之后，开始绑定事件
    componentDidMount(){
        this.setState({
            loading:false
        })
        this.props.form.validateFields();
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
              
            }
        });
    }

    render(){
        const formItemLayout = {
            labelCol: { span: 2 },
            wrapperCol: { span: 22 },
        };
        const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
        return (
            <div className="g-bookList">
                <p className="m-head">
                    <Link to="/firstPartner">
                        <Icon type="left" /> 添加合伙人
                    </Link>
                </p>
                <div className="g-book-table">
                    <Spin tip="加载中..." spinning={this.state.loading} size="large" style={{zIndex:9999}}>
                        <Form >
                            <FormItem
                                {...formItemLayout}
                                label="名称"
                            >
                                {getFieldDecorator('partTitle', {
                                    rules: [{required: true, message: '名称不能为空'}],
                                })(
                                    <Input style={{width:'15%'}} onBlur={(e)=>{this.handleChanges("partTitle",e.target.value)}}  />
                                )}

                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label="联系人"
                            >
                                {getFieldDecorator('partTitle', {
                                    rules: [{required: true, message: '联系人不能为空'}],
                                })(
                                    <Input style={{width:'15%'}} onBlur={(e)=>{this.handleChanges("partTitle",e.target.value)}}  />
                                )}
                                {getFieldDecorator('partTitle', {
                                    rules: [{required: true, message: '手机号不能为空'}],
                                })(
                                    <Input style={{width:'15%'}} onBlur={(e)=>{this.handleChanges("partTitle",e.target.value)}}  />
                                )}

                            </FormItem>
                            <FormItem>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                >
                                    保存
                                </Button>
                            </FormItem>
                        </Form>
                    </Spin>
                </div>
            </div>
        );
    }
}
firstPartner = Form.create()(firstPartner)

export default firstPartner;