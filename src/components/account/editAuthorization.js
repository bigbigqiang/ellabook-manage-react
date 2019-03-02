import React from 'react'
import { Tree, Icon, Form, Input, Button, message, Modal,Spin } from 'antd'
import { Link, hashHistory } from 'react-router'
import "./account.css";
import 'whatwg-fetch'
const util = require('../util.js');
const TreeNode = Tree.TreeNode;
const FormItem = Form.Item;
const confirm = Modal.confirm;

class authorization extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            expandedKeys: [],
            autoExpandParent: true,
            checkedKeys: [],
            selectedKeys: [],
            status: this.props.params.status,
            name: this.props.params.status == 0 ? '' : this.props.params.roleName,
            treeDataList: [],
            loading:false,
            checkedData: []
        }
        this.showConfirm = this.showConfirm.bind(this);
        this.onExpand = this.onExpand.bind(this);
        this.onCheck = this.onCheck.bind(this);
    }

    async fetchFn() {
        this.setState({
            loading:true
        })
        util.API({roleCode: this.state.status}, 'ella.operation.infoRole').then(res => res.json()).then((data) => {
            if (data.status == '1') {
                let checkedKeys = [];
                data.data.map((item) => {
                    if (item.operationType) {
                        checkedKeys.push('2-' + item.menuCode);
                        item.operationType.split(',').map((elem) => {
                            checkedKeys.push('3-' + item.menuCode + '-' + elem);
                        });
                    }
                });
                this.setState({
                    checkedKeys: checkedKeys,
                    loading:false
                })
            } else {
                message.error(data.message)
            }
        }).catch(e => {
            console.log(e.message)
        })
    }

    async treeDataFetchfn() {
        util.API({}, 'ella.operation.menuList').then(res => res.json()).then((data) => {
            if (data.status == '1') {
                let menu = data.data;
                let firstMenu = data.data.filter((item) => {
                    return (item.menuLevel == 1);
                });
                let secondMenu = data.data.filter((item) => {
                    return (item.menuLevel == 2 && item.menuName != '勋章管理');
                });
                let treeNode = {};
                let treeDataList = [];

                firstMenu.map((item) => {
                    treeNode = {
                        title: item.menuName,
                        key: '1-' + item.menuCode,
                        children: this.secondMenuData(item.menuCode,secondMenu)
                    };
                    treeDataList.push(treeNode);
                })
                this.setState({
                    menu,
                    firstMenu,
                    secondMenu,
                    treeDataList
                },()=>{this.state.status != 0 && this.fetchFn();console.log(this.state.treeDataList)})
            } else {
                message.error(data.message)
            }
        }).catch(e => {
            console.log(e.message)
        })
    }

    secondMenuData(key,secondMenu) {
        let treeNodeChildren = {};
        let secondMenuDatas = [];
        let menu = secondMenu.filter((item) => { return item.parentCode == key });
        menu.map((item) => {
            treeNodeChildren = {
                title: item.menuName,
                key: '2-' + item.menuCode,
                children: this.thirdMenuData(item.menuCode)
            };
            secondMenuDatas.push(treeNodeChildren);
        })
        return secondMenuDatas;
    }

    thirdMenuData(key) {
        let thirdMenu = ['CREATE', 'RETRIEVE', 'UPDAT', 'DELETE'];
        let treeNodeChildren = {};
        let thirdMenuDatas = [];
        thirdMenu.map((item) => {
            treeNodeChildren = {
                title: item,
                key: '3-' + key + '-' + item
            };
            thirdMenuDatas.push(treeNodeChildren);
        })
        return thirdMenuDatas;
    }

    componentDidMount() {
        this.treeDataFetchfn();
        localStorage.setItem('current', 9);
    }

    onExpand(expandedKeys) {
        this.setState({
            expandedKeys,
            autoExpandParent: false,
        });
    }
    onCheck(checkedKeys) {
        this.setState({ checkedKeys });
    }

    renderTreeNodes(data) {
        return data.map((item) => {
            if (item.children) {
                return (
                    <TreeNode title={item.title} key={item.key} dataRef={item}>
                        {this.renderTreeNodes(item.children)}
                    </TreeNode>
                );
            }
            return <TreeNode {...item} />;
        });
    }

    async editRoleFetchfn(method, doc) {
        this.setState({
            loading:true
        })
        util.API(doc, method).then(res => res.json()).then((data) => {
            if (data.status == '1') {
                this.setState({
                    loading:false
                })
                message.success('操作成功!');
                setTimeout(() => {
                    hashHistory.push('/authorization');
                }, 1000)
            } else {
                message.error(data.message)
            }
        }).catch(e => {
            console.log(e.message)
        })
    }
    // 提交前弹窗
    showConfirm() {
        let _this = this;
        confirm({
            title: this.state.status == 0 ? '请确认是否添加该新角色' : '请确认是否修改该角色',
            okText: '确定',
            okType: 'primary',
            cancelText: '继续编辑',
            onOk() {
                _this.submitDate()
            },
            onCancel() {
            },
        });
    }

    submitDate() {
        let menus = []
        this.state.checkedKeys.map((element) => {
            let ele_split = element.split('-');
            if (ele_split[0] == 2 || ele_split[0] == 3) {
                let it_parentCode = this.state.secondMenu.find((item) => item.menuCode === ele_split[1]).parentCode;
                menus.push(it_parentCode,ele_split[1])
            } else {
                menus.push(ele_split[1])
            }
        })
        let allMenus = Array.from(new Set(menus));
        let privilegeList = [];
        allMenus.map((ele) => {
            let unit = this.state.menu.find((item) => ele === item.menuCode);
            if (unit.menuLevel == 2) {
                unit.operationType = 'CREATE,RETRIEVE,UPDAT,DELETE';
            }
            privilegeList.push(unit)
        })
        let doc = { privilegeList };

        if (this.state.status != 0) {
            doc.roleCode = this.state.status
            this.editRoleFetchfn('ella.operation.saveRole', doc);
        } else {
            doc.roleName = this.state.name
            this.editRoleFetchfn('ella.operation.addRole', doc);
        }
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                if (this.state.checkedKeys.length == 0) {
                    message.error('请为该角色分配权限！');
                    return;
                } else {
                    this.showConfirm();
                }
            }
        });

    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Spin tip="加载中..." spinning={this.state.loading} size="large" style={{ zIndex: 9999 }}>
                <p className="m-title"><Link to='/authorization'><Icon type="left" />{this.state.status == 0 ? '添加新角色' : '编辑角色'}</Link></p>
                <div className='m-content'>
                    <Form onSubmit={this.handleSubmit}>
                        <FormItem
                            label="角色名称"
                        >
                            {getFieldDecorator('name', {
                                initialValue: this.state.name,
                                rules: [{ required: true, message: '角色名称不能为空' }],
                            })(
                                <Input setfieldsvalue={this.state.name} onChange={(e) => { this.setState({ name: e.target.value }) }} style={{ width: 200 }} />
                            )}
                        </FormItem>
                        <FormItem
                            label="分配权限"
                        >
                            <Tree
                                checkable
                                defaultExpandAll
                                onExpand={this.onExpand}
                                expandedKeys={this.state.expandedKeys}
                                autoExpandParent={this.state.autoExpandParent}
                                onCheck={this.onCheck}
                                checkedKeys={this.state.checkedKeys}
                                selectedKeys={this.state.selectedKeys}
                            >
                                {this.renderTreeNodes(this.state.treeDataList)}
                            </Tree>
                        </FormItem>
                        <FormItem wrapperCol={{ span: 6, offset: 4 }} style={{ marginTop: 24 }}>
                            <Button type="primary" htmlType="submit">确定</Button>
                        </FormItem>
                    </Form>
                </div>
            </Spin>
        );
    }
}
authorization = Form.create()(authorization)
export default authorization
