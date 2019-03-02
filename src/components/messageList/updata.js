import React from 'react';
import { Card, Icon, Input, Table } from 'antd';
const Search = Input.Search;
import './updata.css';
import { Link } from 'react-router';
import getUrl from "../util.js";
// import Jiashuju from "./jiadata.js";

import commonData from '../commonData.js';

export default class PriceSet extends React.Component {

    constructor() {
        super()
        this.state = {
            loadding: true,
            page: 1,
            pageSize: 20,
            total: 0,
            data: [],
        }
    }
    componentDidMount() {
        this.fetchListData(this.state.page, this.state.pageSize);
    }
    async fetchListData(page, pageSize) {
        var doc = {
            "adviceType": "UPDATE_VERSION",
            page: page - 1,
            pageSize
        }
        var data = await fetch(getUrl.url, {
            mode: "cors",
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },

            body: "method=ella.operation.getAdviceList" + "&content=" + JSON.stringify(doc) + commonData.dataString

        }).then(res => res.json());
        console.log(data);
        this.setState({
            data: data.data.list,
            total: data.data.total,
            loadding: false
        })

    }
    setOneKV(k, v) {
        this.setState({
            [k]: v
        })
    }
    render() {
        const columns = [
            {
                title: '版本号',
                dataIndex: 'verson',
                width: 50,
                render: (text, record) => {
                    return record.version ? record.version.versionNum : '-'
                }
            }, {
                title: '推送范围',
                dataIndex: 'adviceVersions',
                width: 100
            }, {
                title: '渠道',
                dataIndex: 'pushTarget',
                width: 100
            }, {
                title: '发布时间',
                dataIndex: 'startTime',
                width: 150
            }, {
                title: '通知类型',
                dataIndex: 'forceUpdate',
                width: 100,
                render: (text) => {
                    switch (text) {
                        case 'FORCE_UPDATE_YES':
                            return "强制更新";
                        case 'FORCE_UPDATE_NO':
                            return "建议更新";
                        default:
                            return "-";
                    }
                }
            }, {
                title: '频次',
                dataIndex: 'pushFrequency',
                width: 150,
                render: (text) => {
                    switch (text) {
                        case 'EVERY_TIME_PUSH':
                            return '每次启动通知';
                        case 'DAILY_PUSH':
                            return '每日通知一次';
                        case 'FIXED_PUSH_TIMES':
                            return '通知一次';
                        default:
                            return '-'
                    }
                }
            }, {
                title: '详情',
                dataIndex: 'g',
                render: (text, record, index) => {
                    return <Link target="_blank" to={`messageList/updateMessage/updata/${record.adviceCode}`} style={{ paddingRight: 4 }}>
                        <i className="i-action-ico i-edit"></i>
                    </Link>
                },
                width: 50
            },
        ]

        return <div>
            {/* <div className="m-inSel">
                <Search
                    placeholder="搜索"
                    enterButton style={{ width: 400 }}
                    onSearch={(value) => { console.log(value) }}
                />
            </div> */}
            <Table
                className="m-book-table t-nm-tab"
                scroll={{ y: (this.state.pageLength > 13) ? '560' : 0 }}
                bordered
                columns={columns}
                dataSource={this.state.data}
                scroll={{ y: (this.state.data.length > 13) ? '560' : 0 }}
                loading={this.state.loadding}
                pagination={
                    {
                        defaultPageSize: 20,
                        showSizeChanger: true,
                        pageSizeOptions: ['20', '40', '60', '80', '100'],
                        total: this.state.total,
                        showTotal: () => { return `共 ${this.state.total} 条` },
                        onShowSizeChange: (pageIndex, pageSize) => {
                            console.log(pageIndex, pageSize);
                            // this.setOneKV('loading', true);
                            this.setState({
                                loadding: true,
                            }, () => {
                                this.fetchListData(pageIndex, pageSize);
                            })
                        },
                        onChange: (pageIndex, pageSize) => {
                            console.log(pageIndex, pageSize)
                            this.setState({
                                loadding: true,
                            }, () => {
                                this.fetchListData(pageIndex, pageSize);
                            })
                        }
                    }
                }
            />
        </div>
    }
}