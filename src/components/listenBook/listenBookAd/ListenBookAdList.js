import React from 'react'
import { Button, Table, message, Icon, Spin, Popover,Tabs } from 'antd';
import { Link, hashHistory } from 'react-router';
import getUrl from '../../util';
const TabPane = Tabs.TabPane;
class TaskAccount extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            dataSource: [],
            loading: false,
            activeKey:"APP"
        };
        this.addListenBookAd = this.addListenBookAd.bind(this);
    }
    //听书广告列表
    fetchModuleList() {
        this.setState({
            loading: true
        })
        getUrl.API({platfromCode:this.state.activeKey},'ella.operation.getLbadListForOts').then(res => res.json()).then((data) => {
            if (data.status == '1') {
                this.setState({
                    dataSource:data.data.list,
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
    toLocaleString (date) {
        return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() +" "+ date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    }
    addListenBookAd () {
        hashHistory.push('/addListenBookAd/current');
    }
    componentDidMount() {
        this.fetchModuleList();
    }
    render() {
        const columns = [{
            title: '名称',
            dataIndex: 'imageTitle',
            key: 'imageTitle',
            width: '12%',
            render: (text, record) => {
                return (
                    <Popover
                        placement="top"
                        title={null}
                        content={
                            record.imageTitle
                        }
                    >
                        {record.imageTitle || '-'}
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
        },{
            title: '操作',
            dataIndex: 'edit',
            width: '8%',
            render: (text, record) => {
                return (
                    <div>
                        <Link target="_blank" to={"/addListenBookAd/current?adCode=" + record.adCode}>
                            <i className="i-action-ico i-edit" type="edit" />
                        </Link>
                    </div>
                )
            }
        }];
        
        return (
            <div id="ListenBookAds">
                <p className="m-title">听书横幅广告管理</p>
                <div className="m-rt-content">
                    <div style={{ marginBottom: 20 }}>
                        <span className='m-btn-add intervalRight'><Button type="primary"  disabled={!!this.state.dataSource.length} className="u-btn-add" onClick={this.addListenBookAd}><Icon type="plus" />添加新的横幅广告</Button></span>
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
