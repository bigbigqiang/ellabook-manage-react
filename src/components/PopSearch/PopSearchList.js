import React from 'react'
import { Table, Icon, Button, Popconfirm, message, Spin, Input, Col, Select, Pagination, Tabs, Popover, Modal, notification } from 'antd'
import 'whatwg-fetch'
import commonData from '../commonData.js';
const Search = Input.Search;
const TabPane = Tabs.TabPane;
const confirm = Modal.confirm;
const util = require('../util.js');

class PopSearchList extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            lists: [],
            selectedRowKeys: [],
            pageIndex: 0,
            minheight: '',
            loading: false,
            pageMax: 0,
            page: '0',
            pageSize: '20',
            current: 1,
            searchName: '',
            activeKey: '1',
            listsHasOnline: [],
            listsAll: [],
            visible: false,
            popularSearchList: [],
            popularSearchOnlineList: [],
            popularSearchOnlineList_SHELVES_ON: [],
            popularSearchOnlineList_SHELVES_OFF: [],
            addSearchName: '',
            searchCode: '',
            shelvesFlag: ''
        }
    }



    async fetchFn(activeKey, searchName) {
        this.setState({
            loading: true
        });

        let doc = activeKey == '1' ? { searchName: searchName, type: 'SHELVES_ON' } : { searchName: searchName, type: 'ALL' };

        util.API(doc, 'ella.operation.getPopularSearchList').then(res => res.json()).then((data) => {
            if (data.status == '1') {
                if (activeKey == "1") {
                    let list = data.data.popularSearchList;
                    let popularSearchOnlineList_SHELVES_ON = [];
                    let popularSearchOnlineList_SHELVES_OFF = [];
                    list.map((item)=>{
                        if (item.shelvesFlag === 'SHELVES_ON') {
                            popularSearchOnlineList_SHELVES_ON.push(item)
                        } else {
                            popularSearchOnlineList_SHELVES_OFF.push(item)
                        }
                    })
                    this.setState({
                        loading: false,
                        popularSearchOnlineList: popularSearchOnlineList_SHELVES_ON.concat(popularSearchOnlineList_SHELVES_OFF),
                        popularSearchOnlineList_SHELVES_ON: popularSearchOnlineList_SHELVES_ON,
                        popularSearchOnlineList_SHELVES_OFF: popularSearchOnlineList_SHELVES_OFF
                    })
                } else {
                    this.setState({
                        loading: false,
                        popularSearchList: data.data.popularSearchList
                    })
                }
            } else {
                this.setState({
                    loading: false
                })
                message.error(data.message)
            }
        }).catch(e => {
            console.log(e.message)
        })
    }

    async deleteFn(searchCode) {

        var doc = {
            searchCode: searchCode,
        }
        util.API(doc, 'ella.operation.delPopularSearch').then(res => res.json()).then((data) => {
            if (data.status == '1') {
                this.fetchFn(this.state.activeKey, this.state.searchName);
            } else {
                message.error(data.message)
            }
        }).catch(e => {
            console.log(e.message)
        })
    }
    onDelete(searchCode, shelvesFlag) {
        if (util.operationTypeCheck('DELETE')) {
            if (shelvesFlag == "SHELVES_ON") {
                message.error('该热门搜索已上线，请下线后重新操作！');
                return;
            }
            this.deleteFn(searchCode);
        } else {
            message.error('您没有权限删除该数据！');
        }
    }
    async UpDownOpera(searchCode, shelvesFlag, searchStatus) {
        var doc = {
            searchCode: searchCode,
            shelvesFlag: shelvesFlag,
            searchStatus: searchStatus
        }
        util.API(doc, 'ella.operation.shelvesFlagPopularSearch').then(res => res.json()).then((data) => {
            if (data.status == '1') {
                message.success(`操作成功！`);
                this.fetchFn(this.state.activeKey, this.state.searchName);
            } else {
                message.error(data.message)
            }
        }).catch(e => {
            console.log(e.message)
        })
    }
    componentDidMount() {
        if (util.operationTypeCheck('RETRIEVE')) {
            this.fetchFn(this.state.activeKey, this.state.searchName);
        } else {
            message.error('您没有权限查看该数据！');
        }
    }
    //搜索框
    bannerSearch(value) {
        this.setState({
            searchName: value
        })
        this.fetchFn(this.state.activeKey, value);
    }
    //上下移动
    arrowDownOrup(moveCode, moveIdx, moveType) {
        if (util.operationTypeCheck('UPDAT')) {
            if (moveType == "UP" && moveIdx == this.state.popularSearchOnlineList_SHELVES_ON[0].idx) {
                message.error(`不可向上移！`);
                return;
            }
            if (moveType == "DOWN" && moveIdx == this.state.popularSearchOnlineList_SHELVES_ON[this.state.popularSearchOnlineList_SHELVES_ON.length -1].idx) {
                message.error(`不可向下移！`);
                return;
            }
            var doc = {
                moveCode: moveCode,
                moveIdx: moveIdx,
                moveType: moveType
            }
            util.API(doc, 'ella.operation.movePopularSearch').then(res => res.json()).then((data) => {
                if (data.status == '1') {
                    this.fetchFn(this.state.activeKey, this.state.searchName);
                } else {
                    message.error(data.message)
                }
            }).catch(e => {
                console.log(e.message)
            })
        } else {
            message.error('您没有权限操作该数据！');
        }
    }

    changeTabs = (activeKey) => {
        this.setState({
            activeKey: activeKey
        });
        this.fetchFn(activeKey, this.state.searchName);
    }

    addSearchSave(type) {
        var curName = this.state.addSearchName.replace(/(^\s*)|(\s*$)/g, "");
        if (curName == '') {
            message.error('热门搜索名称未填写!');
            return;
        }
        if (curName.length > 10) {
            message.error('字符限制为十个中文字符以内!');
            return;
        }
        var doc = {
            searchCode: this.state.searchCode,
            searchName: curName,
        }
        //未上线编辑的时候按照按钮逻辑，上线以后编辑无论点击哪个按钮都传已上线
        if (this.state.shelvesFlag == 'SHELVES_ON') {
            doc.shelvesFlag = "SHELVES_ON";
            doc.type = "SHELVES_ON";
        } else {
            if (type == "1") {
                doc.shelvesFlag = "SHELVES_OFF"
            } else {
                doc.shelvesFlag = "SHELVES_ON"
            }
        }
        util.API(doc, 'ella.operation.insertAndUpdatePopularSearch').then(res => res.json()).then((data) => {
            if (data.status == '1') {
                message.success('操作成功!');
                this.setState({ visible: false, shelvesFlag: '' })
                this.fetchFn(this.state.activeKey, this.state.searchName);
            } else {
                message.error(data.message)
            }
        }).catch(e => {
            console.log(e.message)
        })
    }
    setSearchName(k, v) {
        this.setState({
            [k]: v
        })
    }
    PopSearchDetail(searchCode) {
        util.API({ searchCode: searchCode }, 'ella.operation.getPopularSearchByCode').then(res => res.json()).then((data) => {
            if (data.status == '1') {
                this.setState({
                    visible: true,
                    addSearchName: data.data.searchName,
                    searchCode: data.data.searchCode,
                    shelvesFlag: data.data.shelvesFlag
                })
            } else {
                message.error(data.message)
            }
        }).catch(e => {
            console.log(e.message)
        })
    }
    //置顶
    async arrowStick (moveTopModuleCode, moveTopModuleIdx) {
        if (moveTopModuleIdx === this.state.popularSearchOnlineList_SHELVES_ON[0].idx) {
            message.error('已经在最顶端！');
            return;
        }
        this.setState({
            loading: true
        });
        util.API({moveTopModuleCode: moveTopModuleCode, moveTopModuleIdx: moveTopModuleIdx }, 'ella.operation.topPopularSearch').then(res => res.json()).then((data) => {
            if (data.status == '1') {
                this.fetchFn(this.state.activeKey, this.state.searchName);
            } else {
                this.setState({
                    loading: false
                })
                message.error(data.message)
            }
        }).catch(e => {
            console.log(e.message)
        })
    }
    popSearchPublish() {
        this.setState({
            loading: true
        });
        util.API({ searchStatus: 'NORMAL' }, 'ella.operation.topPopularSearch').then(res => res.json()).then((data) => {
            if (data.status == '1') {
                message.success('操作成功！');
                this.fetchFn(this.state.activeKey, this.state.searchName);
            } else {
                this.setState({
                    loading: false
                })
                message.error(data.message)
            }
        }).catch(e => {
            console.log(e.message)
        })
    }
    release() {
        if (!this.state.popularSearchOnlineList.length) {
            message.error('至少有一条已上线热门搜索');
            return;
        }
        util.API({ searchStatus: 'NORMAL' }, 'ella.operation.issuePopularSearch').then(res => res.json()).then((data) => {
            if (data.status == '1') {
                this.fetchFn(this.state.activeKey, this.state.searchName);
            } else {
                message.error(data.message)
            }
        }).catch(e => {
            console.log(e.message)
        })
    }
    showConfirm = () => {
        var w = this;
        confirm({
            title: '请确认是否发布该热门搜索模块?',
            okType: 'primary',
            cancelText: '继续编辑',
            onOk() {
                w.release();
            },
            onCancel() { },
        });
    }
    render() {
        const columns = [
            {
                title: '序号',
                width: '16%',
                dataIndex: 'idx',
                render: (text, record, index) => {
                    return (

                        <span>{index + 1}</span>
                    )
                }
            },
            {
                title: '名称',
                width: '17%',
                dataIndex: 'searchName',

                className: 'td_hide',
                render: (text, record) => {
                    return (
                        <Popover
                            placement="top"
                            title={null}
                            content={
                                record.searchName
                            }
                        >
                            <span>{record.searchName}</span>
                        </Popover>
                    )
                }
            }, {
                title: '添加时间',
                width: '17%',
                dataIndex: 'createTime'
            }, {
                title: '展示状态',
                width: '16%',
                dataIndex: 'searchStatus',
                render: (text, record) => {
                    let txt = ''
                    switch (text) {
                        case 'EXCEPTION':
                            txt = '未发布';
                            break;
                        case 'NORMAL':
                            txt = '已发布';
                            break;
                        case 'SHOW_OFF':
                            txt = '修改未发布';
                            break;
                        case 'SHOW_OFF_DOWN':
                            txt = '下线未发布';
                            break;
                        case 'SHOW_OFF_UP':
                            txt = '上线未发布';
                            break;
                        default:
                            txt = '-';
                    }
                    return txt;
                }
            },
            {
                title: '操作',
                width: '18%',
                render: (text, record, index) => {
                    if (record.shelvesFlag === 'SHELVES_OFF') {
                        return (
                            <div style={{ textAlign: 'center' }} className='m-icon-type'>
                                <span style={{ marginRight: '20px', marginLeft: '20px' }} className='i-action-ico i-edit' onClick={(index) => this.PopSearchDetail(record.searchCode)}></span>
                                <span style={{ marginRight: '20px' }} className='i-action-ico i-stick' onClick={() => { message.warning('不可做排序操作！') }}></span>
                                <span style={{ marginRight: '20px' }} className='i-action-ico i-up' onClick={() => { message.warning('不可做排序操作！') }}></span>
                                <span style={{ marginRight: '20px' }} className='i-action-ico i-down' onClick={() => { message.warning('不可做排序操作！') }}></span>
                            </div>
                        )
                    } else {
                        return (
                            <div style={{ textAlign: 'center' }} className='m-icon-type'>
                                <span className='i-action-ico i-edit' style={{ marginRight: 20 }} onClick={(index) => this.PopSearchDetail(record.searchCode)}></span>
                                <span style={{ marginRight: 20 }} className='i-action-ico i-stick' onClick={() => this.arrowStick(record.searchCode, record.idx)}></span>
                                <span className='i-action-ico i-up' style={{ marginRight: 20 }} onClick={() => this.arrowDownOrup(record.searchCode, record.idx, "UP")}></span>
                                <span className='i-action-ico i-down' onClick={() => this.arrowDownOrup(record.searchCode, record.idx, "DOWN")}></span>
                            </div>
                        )
                    }
                }

            }, {
                title: '状态操作',
                width: '16%',
                render: (text, record) => {
                    if (record.shelvesFlag == 'SHELVES_ON') {
                        return (
                            <Popconfirm title="确定下线吗?" onConfirm={() => this.UpDownOpera(record.searchCode, "SHELVES_OFF", record.searchStatus)}>
                                <span style={{ "color": "#40a9ff", "cursor": "pointer", "fontWeight": "bold" }}>下线</span>
                            </Popconfirm>

                        )
                    } else {
                        return (
                            <Popconfirm title="确定上线吗?" onConfirm={() => this.UpDownOpera(record.searchCode, "SHELVES_ON", record.searchStatus)}>
                                <span style={{ "color": "#40a9ff", "cursor": "pointer", "fontWeight": "bold" }}>上线</span>
                            </Popconfirm>

                        )
                    }

                }
            }
        ]
        const columns2 = [...columns];
        columns2.splice(4, 1, {
            title: '操作',
            width: '18%',
            render: (text, record) => {
                return (
                    <div style={{ textAlign: 'center' }} className='m-icon-type'>
                        <span className='i-action-ico i-edit' style={{ marginRight: 20 }} onClick={(index) => this.PopSearchDetail(record.searchCode)}></span>
                        <Popconfirm title="确定删除吗?" onConfirm={() => this.onDelete(record.searchCode, record.shelvesFlag)}><span className='i-action-ico i-delete'></span></Popconfirm>
                    </div>
                )
            }

        });
        const table_box = {
            margin: "0px 0px 0px 0px"
        }
        return (
            <div>
                <p className="m-title">热门搜索管理</p>
                <div className="m-rt-content">
                    <Button className='intervalRight' style={{ "background": "#675ca8", "border": "1px solid #675ca8", "color": "#fff" }} onClick={() => this.setState({ visible: true, addSearchName: '', searchCode: '' })}><Icon type="plus" />添加新热门搜索</Button>

                    <Search placeholder="搜索" enterButton className="searchWidth" onSearch={value => this.bannerSearch(value)} />

                    <Tabs defaultActiveKey="1" onChange={this.changeTabs} style={{ width: "100%" }}>
                        <TabPane tab={<span>已上线热门搜索</span>} key="1">
                            <div style={table_box}>
                                <Spin tip="加载中..." spinning={this.state.loading} size="large" style={{ zIndex: 9999 }}>
                                    <Table style={{ marginTop: "4px" }} rowKey={(record, index) => index} rowClassName={(record, index) => { if (record.shelvesFlag === 'SHELVES_OFF') { return 'el-tr-gary' } }} columns={columns} dataSource={this.state.popularSearchOnlineList} bordered pagination={false} className="t-nm-tab" scroll={{ y: 570 }} />
                                    <p style={{ marginTop: 10, textAlign: 'center' }}>
                                        <Button type='primary' onClick={() => { this.showConfirm() }}>发布</Button>
                                    </p>
                                </Spin>
                            </div>
                        </TabPane>
                        <TabPane tab={<span>全部热门搜索</span>} key="2">
                            <div style={table_box}>
                                <Spin tip="加载中..." spinning={this.state.loading} size="large" style={{ zIndex: 9999 }}>
                                    <Table rowKey={(record, index) => index} style={{ marginTop: "4px" }} columns={columns2} dataSource={this.state.popularSearchList} bordered pagination={false} className="t-nm-tab" scroll={{ y: 570 }} />
                                </Spin>
                            </div>
                        </TabPane>
                    </Tabs>
                    <Modal
                        title="添加新热门搜索"
                        visible={this.state.visible}
                        onOk={this.handleOk}
                        onCancel={() => this.setState({ visible: false })}
                        footer={null}
                    >
                        <Input placeholder="请输入搜索字段" value={this.state.addSearchName} style={{ "marginBottom": "20px" }} onBlur={(e) => { this.setSearchName("addSearchName", e.target.value) }} onChange={(e) => { this.setSearchName("addSearchName", e.target.value) }} />
                        <div style={{ textAlign: "center" }}>
                            <Button className="u-btn block buttonWidth intervalRight" onClick={() => this.addSearchSave("1")}>保存</Button>
                            <Button className="u-btn block buttonWidth" onClick={() => this.addSearchSave("2")}>保存并上线</Button>
                        </div>
                    </Modal>
                </div>
            </div>
        )
    }
}
export default PopSearchList
