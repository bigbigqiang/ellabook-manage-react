import React from 'react';
import { Button, Table, Spin, Popover, Select, Input } from 'antd';
import { Link } from 'react-router';
import getUrl from '../util.js';
import './vip.css';

const Search = Input.Search;
const Option = Select.Option;

export default class vip extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            defaultData: [],
            listLength: 0,
            searchType: 'customerName',
            searchContent: '',
            loading: false
        }
    }
    componentDidMount() {
        this.fetchdata()
    }
    async fetchdata() {
        this.setState({
            loading: true
        })
        let doc = {
            uid: this.state.searchType === 'uid' ? this.state.searchContent : '',
            customerName: this.state.searchType === 'customerName' ? this.state.searchContent : '',
            pageSize: 1000,
            pageIndex: 1
        }
        getUrl.API(doc, 'ella.operation.sendVIP.selectSendVIPActivityList').then(res => res.json()).then((data) => {
            if (data.status == '1') {
                this.setState({
                    defaultData: data.data.sendVIPActivityList,
                    listLength: data.data.sendVIPActivityList.length,
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
    //搜索框
    bannerSearch(value) {
        this.setState({
            searchContent: value
        },()=>{this.fetchdata();})
    }

    render() {
        const box = {
            padding: "0px 20px"
        }
        const columns = [
            {
                title: '用户ID',
                dataIndex: 'uid',
                width: '20%',
                key: 'uid',
                className: "td_hide",
                render: (text, record) => {
                    return (
                        <Popover
                            placement="top"
                            title={null}
                            content={
                                record.uid
                            }
                        >
                            <span>{record.uid}</span>
                        </Popover>
                    )
                }
            },
            {
                title: '账号',
                dataIndex: 'customerName',
                width: '20%',
                key: 'customerName'
            }, {
                title: '会员类型',
                dataIndex: 'vipType',
                width: '10%',
                key: 'vipType',
                render: (text, record) => {
                    if (text === 'VIP') {
                        return '普通会员'
                    } else if (text === 'SVIP') {
                        return '高级会员'
                    } else {
                        return '-'
                    }
                }
            }, {
                title: '会员有效期',
                dataIndex: 'activeTime',
                width: '10%',
                key: 'activeTime'
            }, {
                title: '会员到期时间',
                dataIndex: 'vipEndTime',
                width: '20%',
                key: 'vipEndTime'
            }, {
                title: '添加时间',
                dataIndex: 'createTime',
                width: '10%',
                key: 'createTime'
            }
        ];
        const data = this.state.defaultData;
        const pagination = {
            showSizeChanger: true,
            showQuickJumper: true,
            defaultPageSize: 20,
            pageSizeOptions: ['20', '40', '60', '80', '100'],
            showTotal: () => { return `共 ${this.state.listLength} 条` }
        }
        return (
            <div id="Vip">
                <p className="m-title" style={{ color: "#666" }}>赠会员</p>

                <div className="m-rt-content" style={{ marginBottom: 20 }}>
                    <Link to="/addVip">
                        <Button type="primary" icon="plus" className="u-btn-add">添加赠送会员</Button>
                    </Link>
                    <Select value={this.state.searchType} className="intervalRight intervalBottom" style={{ marginLeft: 30, width: 130 }} onChange={(value) => { this.setState({ searchType: value }) }}>
                        <Option value='customerName'>手机账号</Option>
                        <Option value='uid'>用户ID</Option>
                    </Select>
                    <Search placeholder="搜索" enterButton className="searchWidth" onSearch={value => this.bannerSearch(value)} />
                </div>
                <div style={box}>
                    <Spin tip="加载中..." spinning={this.state.loading} size="large" style={{ zIndex: 9999 }}>
                        <Table rowKey={(record, index) => index} dataSource={data} columns={columns} pagination={pagination} scroll={{ y: data.length <= 10 ? 0 : 490 }} />
                    </Spin>
                </div>
            </div>
        )
    }
}

