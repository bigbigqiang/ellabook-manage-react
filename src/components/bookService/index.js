import React from 'react';
import { Tabs, Button, Table, message, Spin, Popover, Input, Select,Pagination } from 'antd';
import { Link } from 'react-router';
import getUrl from '../util';
import commonData from '../commonData.js';
const TabPane = Tabs.TabPane;
const Search = Input.Search;
const Option = Select.Option;
export default class bookService extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            loading: false,
            searchContent: '',
            activityType: 'H5',
            searchType: 'ACTIVITY_NAME',

            total: 0,
            pageIndex: 1,
            pageSize: 20,
            current: 1
        }
        this.pageChangeFun = this.pageChangeFun.bind(this);
        this.pageSizeFun = this.pageSizeFun.bind(this);
    }
    componentDidMount() {
        this.listFetchFn()
    }
    listFetchFn = async () => {
        this.setState({
            loading: true
        })
        let param = {
            activityType: this.state.activityType,
            searchContent: this.state.searchContent,
            pageIndex: this.state.pageIndex,
            pageSize: this.state.pageSize,
            searchType: this.state.searchType
        }
        var data = await fetch(getUrl.url, {
            method: "POST",
            mode: 'cors',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: "method=ella.operation.sendBook.selectSendBookActivityListByActivityType" + "&content=" + JSON.stringify(param) + commonData.dataString
        }).then(function (res) {
            return res.json();
        });
        if (data.status == 1) {
            this.setState({
                dataSource: data.data.sendBookActivityList,
                listLength: data.data.sendBookActivityList.length,
                total: data.data.count,
                loading: false
            })
        } else {
            message.error(data.message)
            this.setState({
                loading: false
            })
        }
    }
    changeTabs = (activeKey) => {
        this.setState({
            activityType: activeKey,
            total: 0,
            pageIndex: 1,
            pageSize: 20,
            current: 1
        },() => {this.listFetchFn()});
    }
    // 判断有没有权限
    isUPDAT() {
        if (!getUrl.operationTypeCheck("UPDAT")) {
            message.error("抱歉没有权限,请联系管理员或者切换账号");
        }
    }
    //搜索框
    bannerSearch(value) {
        this.setState({
            searchContent: value,
            total: 0,
            pageIndex: 1,
            pageSize: 20,
            current: 1
        },()=>{this.listFetchFn();})
    }
    pageSizeFun(current, pageSize) {
        this.setState({
            pageSize: pageSize,
            pageIndex: current,
            current: current
        }, () => {
            this.listFetchFn();
        });
    }
    pageChangeFun(pageNum) {
        this.setState({
            pageIndex: pageNum,
            current: pageNum
        }, () => {
            this.listFetchFn()
        });
    }
    render() {
        const columns = [
            {
                title: '活动名称',
                dataIndex: 'activityName',
                width: '10%',
                className: "td_hide",
                render: (text, record) => {
                    return (
                        <Popover
                            placement="top"
                            title={null}
                            content={
                                record.activityName
                            }
                        >
                            <span>{record.activityName}</span>
                        </Popover>
                    )
                }
            }, {
                title: 'code码',
                dataIndex: 'activityCode',
                colSpan: this.state.activityType == "H5" ? 1 : 0,
                width: '10%',
                className: "td_hide",
                render: (text, record) => {
                    const obj = {
                        children: text,
                        props: {}
                    }
                    const element = (
                        <Popover
                            placement="top"
                            title={null}
                            content={
                                record.activityCode
                            }
                        >
                            <span>{record.activityCode}</span>
                        </Popover>
                    )
                    obj.props.colSpan = 0;
                    return this.state.activityType == "H5" ? element : obj;

                }
            },
            {
                title: '渠道',
                colSpan: this.state.activityType != "H5" && this.state.activityType != "DIRECTIONAL" ? 1 : 0,
                dataIndex: 'name',
                width: '10%',
                render: (text, record) => {
                    const obj = {
                        children: text,
                        props: {}
                    }
                    const element = (
                        <span>{record.name}</span>
                    )
                    obj.props.colSpan = 0;
                    return this.state.activityType != "H5" && this.state.activityType != "DIRECTIONAL" ? element : obj;

                }
            },
            {
                title: '赠书数量',
                dataIndex: 'booksCount',
                width: '10%',
            }, {
                title: '开始时间',
                dataIndex: 'startTime',
                width: '10%',
            }, {
                title: '结束时间',
                dataIndex: 'endTime',
                width: '10%',
            },
            {
                title: this.state.activityType == "REGISTER"?'显示数量':'限制数量',
                dataIndex: 'activityAmount',
                width: '10%',
                render: (text, record) => {
                    if (record.whetherLimit === 'NO') {
                        return '不限量'
                    } else {
                        return record.activityAmount
                    }
                }
            },
            {
                title:this.state.activityType == "H5" ? "领取用户" : "送达人数",
                dataIndex: 'joinAmount',
                width: '10%'
            },

            {
                title: '状态',
                dataIndex: 'status',
                width: '10%',
                render: (text, record) => {
                    return <div>
                        {text == "WAITING" ? <span>未开始</span> : (
                            text == "START" ? <span>进行中</span> : (
                                text == "FAIL" ? <span>失败</span> : (
                                    text == "DELIVERED" ? <span>已发送</span> : (
                                        text == "FINISHED" ? <span>已发送</span> : (
                                            text == "EXPIRED" ? <span>已过期</span> : <span>禁用</span>
                                        )
                                    )
                                )
                            )
                        )}
                    </div>

                }
            },
            {
                title: '操作',
                dataIndex: 'action',
                width: '10%',
                key: 'action',
                render: (text, record) => {
                    return <div>
                        <Link target="_blank" onClick={() => { this.props.isUPDAT() }} to={getUrl.operationTypeCheck("UPDAT") ? `/addActivity/${record.activityCode}/${record.activityType}/${encodeURIComponent(JSON.stringify(record))}` : `bookService`}>
                            <i className="i-action-ico i-edit" ></i>
                        </Link>
                    </div>
                }
            }
        ];

        const data = getUrl.operationTypeCheck("UPDAT") ? this.state.dataSource : [];
        return (
            <div className="BookService">
                <p className="m-title">赠书活动</p>
                <div className="m-rt-content">
                    <Link to={`/addActivity/0/a/${JSON.stringify(1)}`} className="m-btn-add intervalRight">
                        <Button style={{display: !getUrl.operationTypeCheck("CREATE") ? 'none' : 'inline'}} display={!getUrl.operationTypeCheck("CREATE")} type="primary" icon="plus" className="u-btn-add">添加赠书活动</Button>
                    </Link>
                    <Select value={this.state.searchType} className="intervalRight intervalBottom" style={{ marginLeft: 10, width: 130 }} onChange={(value) => { this.setState({ searchType: value }) }}>
                        <Option value='ACTIVITY_NAME'>活动名称</Option>
                        <Option value='ACTIVITY_CODE'>code码</Option>
                    </Select>
                    <Search placeholder="搜索" enterButton className="searchWidth" onSearch={value => this.bannerSearch(value)} />
                </div>
                <Tabs onChange={this.changeTabs} type="line" defaultActiveKey="H5" style={{ padding: '0 20px' }}>
                    <TabPane tab="赠书活动" key="H5">
                        <Spin tip="加载中..." spinning={this.state.loading} size="large" style={{ zIndex: 9999 }}>
                            <Table rowKey={(record, index) => index} dataSource={data} columns={columns} pagination={false} scroll={{ y: 570 }}/>
                        </Spin>
                    </TabPane>
                    <TabPane tab="定向赠书" key="DIRECTIONAL">
                        <Spin tip="加载中..." spinning={this.state.loading} size="large" style={{ zIndex: 9999 }}>
                            <Table rowKey={(record, index) => index} dataSource={data} columns={columns} pagination={false} scroll={{ y: 570 }}/>
                        </Spin>
                    </TabPane>
                    <TabPane tab="渠道赠书" key="CHANNEL">
                        <Spin tip="加载中..." spinning={this.state.loading} size="large" style={{ zIndex: 9999 }}>
                            <Table rowKey={(record, index) => index} dataSource={data} columns={columns} pagination={false} scroll={{ y: 570 }}/>
                        </Spin>
                    </TabPane>
                    <TabPane tab="注册赠书" key="REGISTER">
                        <Spin tip="加载中..." spinning={this.state.loading} size="large" style={{ zIndex: 9999 }}>
                            <Table rowKey={(record, index) => index} dataSource={data} columns={columns} pagination={false} scroll={{ y: 570 }}/>
                        </Spin>
                    </TabPane>
                </Tabs>
                <div className="m-pagination-box">
                    {getUrl.operationTypeCheck("UPDAT") ? <Pagination pageSizeOptions={['20', '40', '60', '80', '100']} showSizeChanger showQuickJumper showTotal={total => `共 ${this.state.total} 条`} className="m-pagination" defaultPageSize={20} defaultCurrent={1} current={this.state.current} total={this.state.total} onChange={this.pageChangeFun} onShowSizeChange={this.pageSizeFun} /> : null}
                </div>
            </div>
        )
    }
}
