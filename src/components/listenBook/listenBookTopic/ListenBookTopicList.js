import React from 'react'
import { Button, Table, message, Icon, Spin, Popover, Input, Popconfirm,Tabs } from 'antd';
import { Link, hashHistory } from 'react-router';
import getUrl from '../../util';
const Search = Input.Search;
const TabPane = Tabs.TabPane;
class TaskAccount extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            dataSource: [],
            loading: false,
            searchValue: '',
            activeKey:'APP'
        };
        this.deleteLbSort = this.deleteLbSort.bind(this);
    }
    //听书广专题列表
    fetchModuleList() {
        this.setState({
            loading: true
        })
        getUrl.API({ sortTitle: this.state.searchValue,platformCode:this.state.activeKey}, 'ella.operation.getLbSortList').then(res => res.json()).then((data) => {
            if (data.status == '0') {
                
                this.setState({
                    dataSource: data.data==null?[]:data.data,
                    loading: false
                })
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
    toLocaleString(date) {
        let month = (date.getMonth() + 1) < 10 ? ('0' + (date.getMonth() + 1)) : (date.getMonth() + 1);
        let dates = date.getDate() < 10 ? ('0' + date.getDate()) : date.getDate();
        let hours = date.getHours() < 10 ? ('0' + date.getHours()) : date.getHours();
        let minutes = date.getMinutes() < 10 ? ('0' + date.getMinutes()) : date.getMinutes();
        let seconds = date.getSeconds() < 10 ? ('0' + date.getSeconds()) : date.getSeconds();
        return date.getFullYear() + "-" + month + "-" + dates + " " + hours + ":" + minutes + ":" + seconds;
    }
    onSearch(value) {
        this.setState({ searchValue: value }, () => {
            this.fetchModuleList();
        })
    }
    deleteLbSort(sortCode) {
        getUrl.API({ sortCode: sortCode }, 'ella.operation.deleteLbSort').then(res => res.json()).then((data) => {
            if (data.status == '1') {
                message.success('删除成功！');
                this.fetchModuleList();
            } else {
                message.error(data.message)
            }
        }).catch(e => {
            console.log(e.message)
        })
    }
    arrowUp(sortCode, moveStatus) {
        if (sortCode === this.state.dataSource[0].sortCode) {
            message.warn('不可上移！');
        } else {
            this.sort(sortCode, moveStatus);
        }
    }

    arrowDown(sortCode, moveStatus) {
        if (sortCode === this.state.dataSource[this.state.dataSource.length - 1].sortCode) {
            message.warn('不可下移！');
        } else {
            this.sort(sortCode, moveStatus);
        }
    }

    sort(sortCode, moveStatus) {
        getUrl.API({ moveCode: sortCode,moveStatus:moveStatus,moveType:'eb_operation_lb_sort' }, 'ella.operation.lbPageObjectMove').then(res => res.json()).then((data) => {
            if (data.status == '1') {
                message.success('操作成功！');
                this.fetchModuleList();
            } else {
                message.error(data.message)
            }
        }).catch(e => {
            console.log(e.message)
        })
    }

    componentDidMount() {
        this.fetchModuleList();
    }
    render() {
        const columns = [{
            title: '专题名称',
            dataIndex: 'sortTitle',
            key: 'sortTitle',
            width: '12%',
            render: (text, record) => {
                return (
                    <Popover
                        placement="top"
                        title={null}
                        content={
                            record.sortTitle
                        }
                    >
                        {record.sortTitle || '-'}
                    </Popover>
                )
            }
        }, {
            title: '修改时间',
            dataIndex: 'updateTime',
            key: 'updateTime',
            width: '10%',
            render: (text, record) => {
                return record.updateTime ? this.toLocaleString(new Date(record.updateTime)) : this.toLocaleString(new Date(record.createTime))
            }
        }, {
            title: '展示状态',
            dataIndex: 'showStatus',
            key: 'showStatus',
            width: '10%',
            render: (text, record) => {
                let txt = ''
                switch (text) {
                    case 'SHOW_ON':
                        txt = '已发布';
                        break;
                    case 'SHOW_OFF':
                        txt = '未发布';
                        break;
                    case 'SHOW_OFF_UPDATE':
                        txt = '修改未发布';
                        break;
                    default:
                        txt = '-';
                }
                return txt;
            }
        }, {
            title: '目标类型',
            dataIndex: 'targetType',
            key: 'targetType',
            width: '6%',
            render: (text, record) => {
                let txt = ''
                switch (record.targetType) {
                    case 'SYSTEM_INTERFACE':
                        txt = '系统界面';
                        break;
                    case 'LISTEN_LIST':
                        txt = '听书推荐';
                        break;
                    case 'H5':
                        txt = 'H5页面';
                        break;
                    default:
                        txt = '-';
                }
                return txt;
            }
        }, {
            title: '目标链接',
            dataIndex: 'searchPageName',
            key: 'searchPageName',
            width: '6%',
            render: (text, record) => {
                return (record.searchPageName || '-')
            }
        }, {
            title: '操作',
            dataIndex: 'edit',
            width: '8%',
            render: (text, record) => {
                return (
                    <div>
                        <Link target="_blank" to={"/addListenBookTopic?sortCode=" + record.sortCode} style={{ marginRight: 20 }}>
                            <i className="i-action-ico i-edit" type="edit" />
                        </Link>
                        <span className='i-action-ico i-up' style={{ marginRight: 20 }} onClick={() => this.arrowUp(record.sortCode, 'UP')}></span>
                        <span className='i-action-ico i-down' style={{ marginRight: 20 }} onClick={() => this.arrowDown(record.sortCode, 'DOWN')}></span>
                        <Popconfirm title="确定删除吗?" onConfirm={() => { this.deleteLbSort(record.sortCode) }}>
                            <span className='i-action-ico i-delete'></span>
                        </Popconfirm>
                    </div>
                )
            }
        }];
        return (
            <div id="ListenBookTopic">
                <p className="m-title">听书专题管理</p>
                <div className="m-rt-content">
                    <div style={{ marginBottom: 20 }}>
                        <Link to="/addListenBookTopic" className='m-btn-add intervalRight'><Button type="primary" className="u-btn-add"><Icon type="plus" />添加新的专题</Button></Link>
                        <Search placeholder="输入专题名称检索" value={this.state.searchValue} onChange={(e) => { this.setState({ searchValue: e.target.value }) }} enterButton className="searchWidth intervalRight" onSearch={(value) => { this.onSearch(value); }} />
                    </div>
                    <Spin tip="加载中..." spinning={this.state.loading} size="large" style={{ zIndex: 9999 }}>
                        <Tabs defaultActiveKey="1" 
                            onChange={(activeKey)=>{
                                console.log(activeKey)
                                this.setState({activeKey},()=>{
                                    this.fetchModuleList();
                                })
                            }} 
                            style={{width:"100%"}}>
                            <TabPane tab={<span>移动客户端</span>} key="APP">
                                
                                    <Table
                                        rowKey={(record, index) => index}
                                        columns={columns}
                                        dataSource={this.state.dataSource}
                                        pagination={false}
                                        scroll={{ y: 570 }}
                                        style={{ minWidth: 1050 }}
                                    />
                               
                            </TabPane>
                            <TabPane tab={<span>HD客户端</span>} key="HD">
                                
                                    <Table
                                        rowKey={(record, index) => index}
                                        columns={columns}
                                        dataSource={this.state.dataSource}
                                        pagination={false}
                                        scroll={{ y: 570 }}
                                        style={{ minWidth: 1050 }}
                                    />
                               
                            </TabPane>
                        </Tabs>
                    </Spin>
                </div>
            </div >
        )
    }
}
export default TaskAccount;
