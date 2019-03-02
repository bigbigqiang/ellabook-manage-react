/**
 * Created by Administrator on 2018/3/19.
 */
import React from 'react'
import { Table, Pagination, Select, DatePicker, Button, Input, Icon, Spin, Row, Col, message,Popover } from 'antd';
import { Link } from 'react-router';
import getUrl from "../util.js";
import commonData from '../commonData.js'
import './firstPartner.css';

const { Option, OptGroup } = Select;
const Search = Input.Search;
export default class firstPartner extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            tableData: [],
            pageVo: {
                page: '0',
                pageSize: '20'
            },
            searchInfo: '',
            searchType:'mobile',
            pageMax: 0,
            current: 1,
        };
        this.pageChangeFun = this.pageChangeFun.bind(this);
        this.pageSizeFun = this.pageSizeFun.bind(this);
    }

    //即将插入本组件时，开始请求数据，准备渲染
    componentWillMount() {

    }

    //虚拟dom变成真实dom之后，开始绑定事件
    componentDidMount() {
        this.secondListFn(this.state.searchType,'', this.state.pageVo);
    }
    async secondListFn(searchType,searchInfo, pageVo) {
        this.setState({
            loading: true
        });
        var data = await fetch(getUrl.url, {
            mode: "cors",
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: "method=ella.operation.searchKindergartenList" + "&content=" + JSON.stringify({ "searchType":searchType,"searchInfo": searchInfo, "pageVo": pageVo }) + commonData.dataString
        }).then(res => res.json())
            .then((d) => {
                console.log(d);
                const datalist = [];
                var list = d.data.kindergartenList;
                for (let i = 0; i < list.length; i++) {
                    datalist.push({
                        kindergartenUid: (list[i].kindergartenUid == '' || list[i].kindergartenUid == null) ? '-' : list[i].kindergartenUid,
                        businessUid: (list[i].businessUid == '' || list[i].businessUid == null) ? '-' : list[i].businessUid,
                        kindergartenTrueName: (list[i].kindergartenTrueName == '' || list[i].kindergartenTrueName == null) ? '-' : list[i].kindergartenTrueName,
                        businessTrueName: (list[i].businessTrueName == '' || list[i].businessTrueName == null) ? '-' : list[i].businessTrueName,
                        kindergartenName: (list[i].kindergartenName == '' || list[i].kindergartenName == null) ? '-' : list[i].kindergartenName,
                        kindergartenCity: (list[i].kindergartenCity == '' || list[i].kindergartenCity == null) ? '-' : list[i].kindergartenCity,
                        kindergartenRegistTime: (list[i].kindergartenRegistTime == '' || list[i].kindergartenRegistTime == null) ? '-' : list[i].kindergartenRegistTime,
                    })
                }

                this.setState({
                    tableData: datalist,
                    loading: false,
                    pageMax: d.data.count,
                    pageLength: d.data.kindergartenList.length
                }, () => {
                    // console.log(this.state.tableData);
                });
            })
    }
    pageChangeFun(pageNum) {
        console.log(pageNum);
        this.setState({
            pageVo: {
                ...this.state.pageVo,
                page: pageNum - 1,
            },
            current: pageNum
        }, () => {
            this.secondListFn(this.state.searchType,this.state.searchInfo, this.state.pageVo);
        });
    }

    pageSizeFun(current, pageSize) {
        console.log(current, pageSize);
        this.setState({
            pageVo: {
                pageSize: pageSize,
                page: current - 1,
            },
            current: current
        }, () => {
            this.secondListFn(this.state.searchType,this.state.searchInfo, this.state.pageVo);
        });
    }

    searchContent(searchInfo, value) {
        this.setState({
            searchInfo: value,
            pageVo: {
                page: '0',
                pageSize: '20'
            },
        }, () => {
            this.secondListFn(this.state.searchType,this.state.searchInfo, this.state.pageVo);
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
                title: '幼儿园名称',
                dataIndex: 'kindergartenTrueName',
                width: 250,
                className: "td_hide",
		        render: (text, record) =>{
		            return(
		                <Popover
		                    placement="top"
		                    title={null}
		                    content={
		                        record.kindergartenTrueName
		                    }
		                >
		                    <span>{record.kindergartenTrueName}</span>
		                </Popover>
		            )
		        }
            }, {
                title: '所属合伙人',
                dataIndex: 'businessTrueName',
                width: 250,
                className: "td_hide",
		        render: (text, record) =>{
		            return(
		                <Popover
		                    placement="top"
		                    title={null}
		                    content={
		                        record.businessTrueName
		                    }
		                >
		                    <span>{record.businessTrueName}</span>
		                </Popover>
		            )
		        }
            }, {
                title: '手机号',
                dataIndex: 'kindergartenName',
                width: 100
            }, {
                title: '地域',
                dataIndex: 'kindergartenCity',
                width: 120
            }, {
                title: '动画图书馆设备',
                dataIndex: 'see',
                width: 100,
                render(text, record) {
                    return (
                        <div data-page="teach">
                            <Link to={"/secondDetail?uid=" + record.kindergartenUid + ""} target="_blank">
                                查看
                            </Link>
                        </div>
                    )
                }
            },
            {
                title: '添加时间',
                dataIndex: 'kindergartenRegistTime',
                width: 200
            }
        ];
        return (
            <div className="g-first">
                <p className="m-head">二级合伙人</p>
                <div className="m-first-bd">
                    <div className='m-select'>
                        <Select defaultValue="mobile" className="selectWidth intervalRight intervalBottom"  onChange={(value) => { this.setOneKV("searchType", value) }}>
                            {/* <Option value="">全部</Option> */}
                            <Option value="name">幼儿园名称</Option>
                            <Option value="mobile">手机号</Option>
                            <Option value="businessTrueName">所属一级合伙人</Option>
                        </Select>
                        <Search placeholder="搜索" enterButton className="intervalBottom searchWidth" onSearch={(value) => { this.searchContent("searchInfo", value) }} />
                      
                    </div>
                    <Spin tip="加载中..." spinning={this.state.loading} size="large" style={{ zIndex: 9999 }}>
                        <Table className="m-book-table t-nm-tab" columns={columns} dataSource={this.state.tableData} bordered pagination={false} scroll={{ y: ((this.state.pageLength > 13) ? 650 : 0) }} />
                    </Spin>
                    <div className="m-pagination-box">
                        <Pagination pageSizeOptions={['20', '40', '60', '80', '100']} showSizeChanger showQuickJumper showTotal={total => `共 ${total} 条`} className="m-pagination" defaultPageSize={20} defaultCurrent={1} current={this.state.current} total={this.state.pageMax} onChange={this.pageChangeFun} onShowSizeChange={this.pageSizeFun} />
                    </div>
                </div>
            </div>
        );
    }
}