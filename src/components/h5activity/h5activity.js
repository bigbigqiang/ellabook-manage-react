import React from 'react';
import { Row, Col, Card, Icon, Button, Table, Tabs, message, Input, Spin, Popconfirm, notification, Popover, Collapse } from "antd";
import { Link } from 'react-router';
import getUrl from "../util.js";
import commonData from '../commonData.js';
import "../../main.css";
import "./h5activity.css";
import logo from "../../assets/images/ercodelogo.png";
import copy from "copy-to-clipboard";
const Search = Input.Search;
// const QRCode = require('qrcode.react');
var QRCode = require('qrcode-react');
const Panel = Collapse.Panel;
export default class addGoods extends React.Component {
    constructor() {
        super();
        this.state = {
            // TODO:默认
            pageSize: 20,
            pageIndex: 1,
            total: 0,
            dataList: [],
            loading: false,
            searchContent: '',//列表搜索内容
        }

    }
    componentDidMount() {

        this.fetchList(this.state.pageIndex, this.state.pageSize, '');
    }
    setOneKV(k, v) {
        this.setState({
            [k]: v
        })
    }
    async fetchList(pageIndex, pageSize, searchContent) {
        this.setState({
            loading: true
        })
        let param = {
            "activityType": "TEM_H5",
            "pageIndex": pageIndex,
            "pageSize": pageSize,
            searchContent
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
        console.log(data)
        if (data.status == 1) {
            this.setState({
                pageIndex,
                pageSize,
                total: data.data.count,
                dataList: data.data.sendBookActivityList,
                loading: false
            })
        }
    }
    async searchList(pageIndex, pageSize) {
    }
    // TODO:删除
    async delData(activityCode) {
        console.log(activityCode)
        let param = {
            activityCode
        }
        var data = await fetch(getUrl.url, {
            method: "POST",
            mode: 'cors',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: "method=ella.operation.sendBook.deleteByActivityCode" + "&content=" + JSON.stringify(param) + commonData.dataString
        }).then(function (res) {
            return res.json();
        });
        console.log(data)
        if (data.status == 1) {
            this.fetchList(this.state.pageIndex, this.state.pageSize, this.state.searchContent);
        } else {
            notification.error({
                message: `删除失败`,
            })
        }
    }

    render() {
        const columns = [
            {
                title: '活动名称',
                dataIndex: 'activityName',
                key: 'activityName',
                width: 100,
                className: "td_hide",
		        render: (text, record) =>{
		            return(
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
                key: 'activityCode',
                width: 200,
                className: "td_hide",
		        render: (text, record) =>{
		            return(
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
		        }
            }, {
                title: '赠书数量',
                dataIndex: 'booksCount',
                key: 'booksCount',
                width: 100,
            }, {
                title: '开始时间',
                dataIndex: 'startTime',
                key: 'startTime',
                width: 200,
            }, {
                title: '结束时间',
                dataIndex: 'endTime',
                key: 'endTime',
                width: 200,
            }, {
                title: '领取人数',
                dataIndex: 'joinAmount',
                key: 'joinAmount',
                width: 100,
            }, {
                title: '页面点击量',
                dataIndex: 'clicks',
                key: 'clicks',
                width: 100,
            }, {
                title: '活动状态',
                dataIndex: 'status',
                key: 'status',
                width: 100,
                render: (text) => {
                    switch (text) {
                        case "START":
                            return "进行中";
                        case "WAITING":
                            return "未开始";
                        case "FINISHED":
                            return "已结束";
                        case "EXPIRED":
                            return "已过期";
                        case "STOP":
                            return "禁用";
                        default:
                            return "错误";
                    }
                }
            }, {
                title: '活动链接',
                dataIndex: 'i',
                key: 'i',
                width: 100,
                render: (text, record) => (
                    <Popover
                        placement="top"
                        title={<div style={{ textAlign: "center", fontSize: "16px" }}>活动地址二维码</div>}
                        content={
                            <div>
                                <div className="QRCode" style={{ position: 'relative', textAlign: 'center' }}>
                                    <QRCode size={1000} value={record.activityAddress} logo={logo} logoWidth={250} logoHeight={250} >
                                    </QRCode>

                                </div>
                                {/* <Collapse> */}
                                {/* <Panel header="活动链接地址" key="1"> */}
                                <Input style={{ marginTop: '5px' }} readOnly value={record.activityAddress} />
                                <Button
                                    style={{ marginTop: '5px' }}
                                    onClick={() => {
                                        copy(record.activityAddress);
                                        message.success("复制成功");
                                    }}
                                    type="primary"
                                >一键复制</Button>
                                {/* </Panel> */}
                                {/* </Collapse> */}
                            </div>
                        }
                        trigger="click" >
                        <Icon title="点击显示二维码" type="qrcode" style={{ fontSize: '18px' }} />
                    </Popover>
                )
            }, {
                title: '操作',
                dataIndex: 'j',
                key: 'j',
                width: 100,
                render: (text, record) => (
                    <div>
                        <Popconfirm onConfirm={() => { this.delData(record.activityCode) }} title="确定要删除吗？" okText="确定" cancelText="取消">
                            <span title="点击删除" style={{ marginRight: '10px' }} className="i-action-ico i-delete"></span>
                        </Popconfirm>
                        <Link target="_blank" to={"h5activity/operation/updata/" + record.activityCode}><span title="点击编辑" className="i-action-ico i-edit"></span></Link>
                    </div>
                )
            }
        ];
        const data = this.state.dataList;
        const pagination = {
            defaultPageSize: 20,
            showSizeChanger: true,
            pageSizeOptions: ['20', '40', '60', '80', '100'],
            loading: true,
            total: this.state.total,
            showTotal: () => { return `共 ${this.state.total} 条` },
            onShowSizeChange: (pageIndex, pageSize) => { this.fetchList(pageIndex, pageSize, this.state.searchContent) },
            onChange: (pageIndex, pageSize) => { this.fetchList(pageIndex, pageSize, this.state.searchContent) }
        }
        return <div id="h5Activity">
            <p className="title">H5赠书活动</p>
            <div className="content">
        
                <Link to="h5activity/operation/add" className="intervalRight">
                    <Button className="btn" type='primary'><Icon type="plus" />添加赠书活动</Button>
                </Link>
                   
                <Search
                    placeholder="请输入搜索内容"
                    className="searchWidth"
                    onSearch={value => { this.setOneKV('searchContent', value); this.fetchList(1, this.state.pageSize, value) }}
                    onChange={(e) => { }}
                    enterButton
                />
                   
                <Row style={{ paddingTop: "20px" }}>
                    {/* <Spin size="small" spinning={true}> */}
                    <Table loading={this.state.loading} columns={columns} dataSource={data} pagination={pagination} scroll={{ y: 570 }} />
                    {/* </Spin> */}
                </Row>
            </div>
        </div >
    }
}