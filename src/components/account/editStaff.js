import React from 'react'
import { Form, Input, Icon, Select, Button, Modal, message, Radio } from 'antd'
import { Link, hashHistory } from 'react-router'
var md5 = require('md5');
const FormItem = Form.Item
const Option = Select.Option;
const RadioGroup = Radio.Group;
const confirm = Modal.confirm;
var util = require('../util.js');
import commonData from '../commonData.js'
import "./account.css";
const uid = localStorage.getItem('uid')
const statusSelectContent = [{ key: 'NORMAL', value: '在职' }, { key: 'EXCEPTION', value: '离职' }]
class myForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            status: this.props.params.status,
            data: [],
            statusKey: statusSelectContent[0].key,
            roleContent: [],
            roleKey: '',
            departmentKey: '',
            departmentList: [],
            positionList: [],
            positionUseList: [],
            newPasswordElem: '',
            passwordElem: '',
            newPassword: '',
            newPasswordVisible: 'block',
            uid: localStorage.getItem("uid"),
            token: localStorage.getItem("token")
        }
    }

    // 选择select
    handleSelectChange = (value) => {
     

    }

    roleFetchFn = async () => {
        var data = await fetch(util.url, {
            method: 'POST',
            headers: {
                "Content-type": "application/x-www-form-urlencoded"
            },
            mode: 'cors',
            body: "method=ella.operation.findRole"  + commonData.dataString
        })
            .then(function (res) {
                return res.json();
            });
        this.setState({
            roleContent: data.data
        }, () => {
            if (this.state.status == 0) {
                this.setState({
                    roleValue: data.data[0].roleCode
                })
            }
        })
       
    }

    departmentAndPositionFetchfn = async () => {
        var data = await fetch(util.url, {
            method: 'POST',
            headers: {
                "Content-type": "application/x-www-form-urlencoded"
            },
            mode: 'cors',
            body: "method=ella.operation.findDepartmentAndPosition"  + commonData.dataString
        })
            .then(function (res) {
              
                return res.json();
            });
        this.setState({
            departmentList: data.data.filter(function (item) {
                return item.departLevel == 1;
            }),
            positionList: data.data.filter(function (item) {
                return item.departLevel == 2;
            }),
            positionUseList: data.data.filter(function (item) {
                return item.departLevel == 2;
            })
        });
        if (this.state.status == 0) {
            this.setState({
                departmentKey: this.state.departmentList[0].departCode,
                positionKey: this.state.positionUseList[0].departCode
            })
        }
        this.departmentSelectSet();
        this.postionSelectSet();
    }

    departmentSelectSet = () => {
        this.setState({
            departmentSelect: (
                <Select style={{ width: 200 }} labelInValue defaultValue={{ key: this.state.departmentKey }} onChange={this.onDepartmentChange}>
                    {
                        this.state.departmentList.map((item, index) => {
                            return <Option key={item.departCode}>{item.departName}</Option>
                        })
                    }
                </Select>
            )
        })
    }
    postionSelectSet = () => {
        this.setState({
            positionSelect: (
                // <Select style={{width:200,marginLeft:10}} labelInValue value={{key:this.state.positionUseList[0].departCode}} onChange={this.onPositionChange}>
                <Select style={{ width: 200, marginLeft: 10 }} labelInValue value={{ key: this.state.positionKey }} onChange={this.onPositionChange}>
                    {
                        this.state.positionUseList.map((item, index) => {
                            return <Option key={item.departCode}>{item.departName}</Option>
                        })
                    }
                </Select>
            )
        })
    }

    onDepartmentChange = (value) => {
        this.setState({
            departmentKey: value.key,
            positionUseList: this.state.positionList.filter(function (item) {
                return item.parentCode == value.key;
            })
        }, () => {
            this.setState({
                positionKey: this.state.positionUseList[0].departCode
            }, () => {
                this.postionSelectSet();
            })

        })
    }

    onPositionChange = (value) => {
        this.setState({
            positionKey: value.key
        })
    }

    onStatusChange = (value) => {
        this.setState({
            statusKey: value.key
        })
    }

    fetchFn = async () => {
        var doc = {
            staffUid: this.state.status
        };
        var data = await fetch(util.url, {
            method: 'POST',
            headers: {
                "Content-type": "application/x-www-form-urlencoded"
            },
            mode: 'cors',
            body: "method=ella.operation.operationUserInfo" + "&content=" + JSON.stringify(doc)   + commonData.dataString
        })
            .then(function (res) {
                return res.json();
            });
        this.setState({
            roleValue: data.data.roleCode,
            positionKey: data.data.positionCode,
            departmentKey: data.data.departCode,
            name: data.data.userName,
            mobile: data.data.mobile,
            password: data.data.password,
            statusKey: data.data.status,
            passwordElem: (
                <span style={{ color: 'red' }}>此密码已被隐藏,若要修改请点击'重置'<em style={{ color: '#1890ff', marginLeft: 10, fontStyle: 'normal', cursor: 'pointer' }} onClick={() => { this.passwordModify() }}>重置</em></span>
            ),
            newPasswordVisible: 'none'
        }, () => {
            this.departmentAndPositionFetchfn();
            this.roleFetchFn();
        });

    }


    submitFetchFn = async (method, doc) => {
        var data = await fetch(util.url, {
            method: 'POST',
            headers: {
                "Content-type": "application/x-www-form-urlencoded"
            },
            mode: 'cors',
            body: "method=" + method + "&content=" + JSON.stringify(doc)  + commonData.dataString
        })
            .then(function (response) {
                return response.json();
            });
        if (data.status == 1) {
            message.success('成功!');
            if(this.state.status == 0){
                 setTimeout(() => {
                    hashHistory.push('/staff');
                }, 1000)
            }
           
        } else {
            message.error(data.message);
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        var doc = '', method = '', password = this.props.form.getFieldsValue().password;
        if (password != '' && password != undefined) {
            password = md5(password);
        }
        if (this.state.status == 0) {
            doc = {
                uid: uid,
                userName: this.props.form.getFieldsValue().name,
                mobile: this.props.form.getFieldsValue().mobile,
                departCode: this.state.departmentKey,
                positionCode: this.state.positionKey,
                status: this.state.statusKey,
                roleCode: this.state.roleValue,
                password: password
            };
            method = 'ella.operation.addOperationUser'
        } else {
            if (this.state.passwordElem != '') {
                password = this.state.password
            }
            doc = {
                uid: uid,
                staffUid: this.state.status,
                userName: this.props.form.getFieldsValue().name,
                mobile: this.props.form.getFieldsValue().mobile,
                departCode: this.state.departmentKey,
                positionCode: this.state.positionKey,
                status: this.state.statusKey,
                roleCode: this.state.roleValue,
                password: password
            };
            method = 'ella.operation.saveOperationUser'
        }
        
        if (this.props.form.getFieldsValue().name == '' || this.props.form.getFieldsValue().name == undefined || this.props.form.getFieldsValue().mobile == '' || this.props.form.getFieldsValue().mobile == undefined || password == '') {
            message.error('姓名或手机号或密码不能为空!');
            return;
        }
        if(!/^1[3|4|5|6|7|8][0-9]{9}$/.test(this.props.form.getFieldsValue().mobile)){
            message.error('手机号码输入有误!');
            return;
        } 
        this.submitFetchFn(method, doc);
        

    }

    onRoleChange = (e) => {
        this.setState({
            roleValue: e.target.value,
        });
    }

    passwordModify = () => {
        this.setState({
            passwordElem: '',
            newPasswordVisible: 'block'
        })
    }

    newPasswordElemSet = () => {
        this.setState({
            newPasswordElem: '',
            passwordElem: ''
        })
    }

    componentDidMount() {
        if (this.state.status != 0) {
            this.fetchFn();
        } else {
            this.departmentAndPositionFetchfn();
            this.roleFetchFn();
            this.newPasswordElemSet();
        }
    }
    // 显示弹框
    showModal = () => {
        this.setState({ visible: true })
    }


    // 隐藏弹框
    hideModal = () => {
        this.setState({ visible: false })
    }
    // 提交前弹窗
    showConfirm(e) {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
        if (!err) {
            var name = this.props.form.getFieldsValue().name || <span style={{ color: 'red' }}>谁？</span>;
            var _this = this;
            confirm({
                title: this.state.status == 0
                    ?
                    <div>
                        请确认是否将 {name} 添加为新员工
                    </div>
                    :
                    <div>
                        请确认是否修改 {name} 的员工信息
                    </div>
                ,
                // content: '点确定将提交后台',
                okText: '确定',
                okType: 'primary',
                cancelText: '继续编辑',
                onOk() {
                    _this.handleSubmit(e)
                },
                onCancel() {
                    // _this.setState({
                    //     look: true
                    // })
                },
            });
        }else{
            
            }
        });
    }
    render() {
        const { getFieldDecorator } = this.props.form
        const formItemLayout = {

        }

        const statusOptions = statusSelectContent.map(item => <Option key={item.key}>{item.value}</Option>);

        const roleRadios = this.state.roleContent.map(item => <Radio value={item.roleCode}>{item.roleName}</Radio>);
        return (
            <div>
                <p className="m-title"><Link to='/staff'><Icon type="left" />{this.state.status == 0 ? '添加新员工' : '编辑员工'}</Link></p>
                <div className='m-content'>
                    <Form horizontal onSubmit={
                        // this.handleSubmit
                        (e) => { this.showConfirm(e) }
                    }>
                        <FormItem
                            id="control-input"
                            label="员工姓名"
                            className='f-ft-14'
                            {...formItemLayout}
                        >
                            {getFieldDecorator('name', {
                                initialValue: this.state.name,
                                rules: [{ required: true, message: '请输入员工姓名' }],
                            })(
                                <Input style={{ width: 200 }} />
                            )}
                        </FormItem>
                        <FormItem
                            id="control-input"
                            label="手机号"
                            className='f-ft-14'
                            {...formItemLayout}
                        >
                            {getFieldDecorator('mobile', {
                                initialValue: this.state.mobile,
                                rules: [{ required: true, message: '请输入手机号' }],
                            })(
                                <Input style={{ width: 200 }} />
                            )}
                        </FormItem>
                        <FormItem
                            id="control-input"
                            label="部门和职位"
                            className='f-ft-14'
                            {...formItemLayout}
                        >
                            {this.state.departmentSelect}
                            {this.state.positionSelect}
                        </FormItem>
                        <FormItem
                            id="control-input"
                            label="状态"
                            className='f-ft-14'
                            {...formItemLayout}
                        >
                            <Select style={{ width: 200 }} labelInValue value={{ key: this.state.statusKey }} onChange={this.onStatusChange}>
                                {statusOptions}
                            </Select>
                        </FormItem>
                        <FormItem
                            id="control-input"
                            label="分配角色"
                            className='f-ft-14'
                            {...formItemLayout}
                        >
                            <RadioGroup name="radiogroup" onChange={this.onRoleChange} value={this.state.roleValue}>
                                {roleRadios}
                            </RadioGroup>
                        </FormItem>
                        <FormItem
                            id="control-input"
                            label="密码"
                            className='f-ft-14'
                            {...formItemLayout}
                        >
                            {this.state.passwordElem}
                            {getFieldDecorator('password', {
                                initialValue: this.state.newPassword,
                                rules: [{ required: true, message: '请输入密码' }],
                            })(
                                <Input style={{ width: 200, display: this.state.newPasswordVisible }} />
                            )}

                        </FormItem>
                        <FormItem wrapperCol={{ span: 6 }} style={{ marginTop: 24, marginLeft: 150 }}>
                            <Button type="primary" htmlType="submit">确定</Button>
                        </FormItem>
                    </Form>
                </div>
            </div>
        )
    }
}

myForm = Form.create()(myForm)

export default myForm