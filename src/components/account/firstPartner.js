/**
 * Created by Administrator on 2018/3/19.
 */
import React from 'react'
import { Table, Pagination, Select, DatePicker, Button, Input, Icon, Spin, Row, Col, message,Popover } from 'antd';
import { Link } from 'react-router';
import getUrl from "../util.js";
import commonData from '../commonData.js';
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
        this.firstListFn(this.state.searchType,'', this.state.pageVo);
    }
    async firstListFn(searchType,searchInfo, pageVo) {
        this.setState({
            loading: true
        });
        var data = await fetch(getUrl.url, {
            mode: "cors",
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: "method=ella.operation.searchBusiness" + "&content=" + JSON.stringify({ "searchType":searchType,"searchInfo": searchInfo, "pageVo": pageVo })  + commonData.dataString
        }).then(res => res.json())
            .then((d) => {
                const datalist = [];
                var list = d.data.businessList;
                for (let i = 0; i < list.length; i++) {
                    datalist.push({
                        uid: (list[i].uid == '' || list[i].uid == null) ? '-' : list[i].uid,
                        businessName: (list[i].businessName == '' || list[i].businessName == null) ? '-' : list[i].businessName,
                        mobile: (list[i].mobile == '' || list[i].mobile == null) ? '-' : list[i].mobile,
                        region: (list[i].region == '' || list[i].region == null) ? '-' : list[i].region,
                        status: (list[i].status == '' || list[i].status == null) ? '-' : list[i].status,
                        businessRegistTime: (list[i].businessRegistTime == '' || list[i].businessRegistTime == null) ? '-' : list[i].businessRegistTime,
                        businessUpdateTime: (list[i].businessUpdateTime == '' || list[i].businessUpdateTime == null) ? '-' : list[i].businessUpdateTime,
                    })
                }

                this.setState({
                    tableData: datalist,
                    loading: false,
                    pageMax: d.data.count,
                    pageLength: d.data.businessList.length
                });
            })
    }
    pageChangeFun(pageNum) {
        this.setState({
            pageVo: {
                ...this.state.pageVo,
                page: pageNum - 1,
            },
            current: pageNum
        }, () => {
            this.firstListFn(this.state.searchType,this.state.searchInfo, this.state.pageVo);
        });
    }

    pageSizeFun(current, pageSize) {
        this.setState({
            pageVo: {
                pageSize: pageSize,
                page: current - 1,
            },
            current: current
        }, () => {
            this.firstListFn(this.state.searchType,this.state.searchInfo, this.state.pageVo);
        });
    }

    //导出
    async exportFn(searchInfo) {
        var data = await fetch(getUrl.url, {
            mode: "cors",
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: "method=ella.operation.listBusinessExcel" + "&content=" + JSON.stringify({ "searchInfo": searchInfo })  + commonData.dataString
        }).then(res => res.json())
            .then((d) => {
                if (d.status == 1) {
                    message.success('导出成功')

                    var url=d.data;
                    var a = document.createElement('a');
                    a.href = url;
                    a.download=d.data;
                    a.click();
                } else {
                    message.error('导出失败')
                }
            })
    }
    exportList() {
        this.exportFn(this.state.searchInfo);
    }

    searchContent(searchInfo, value) {

        this.setState({
            searchInfo: value,
            pageVo: {
                page: '0',
                pageSize: '20'
            },
        }, () => {
            this.firstListFn(this.state.searchType,this.state.searchInfo, this.state.pageVo);
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
                title: '合伙人名称',
                dataIndex: 'businessName',
                width: 250,
                className: "td_hide",
		        render: (text, record) =>{
		            return(
		                <Popover
		                    placement="top"
		                    title={null}
		                    content={
		                        record.businessName
		                    }
		                >
		                    <span>{record.businessName}</span>
		                </Popover>
		            )
		        }
            }, {
                title: '手机号',
                dataIndex: 'mobile',
                width: 100
            }, {
                title: '地域',
                dataIndex: 'region',
                width: 250
            }, {
                title: '动画图书馆设备',
                dataIndex: 'see',
                width: 200,
                render(text, record) {
                    return (
                        <div data-page="teach">
                            <Link to={"/firstDetail?uid=" + record.uid + ""}>
                                查看
                            </Link>
                        </div>
                    )
                }
            }, {
                title: '状态',
                dataIndex: 'status',
                width: 100
            },
            {
                title: '添加时间',
                dataIndex: 'businessRegistTime',
                width: 200
            },
            {
                title: '修改时间',
                dataIndex: 'businessUpdateTime',
                width: 200
            },
            {
                title: '操作',
                dataIndex: 'edit',
                render: (text, record) => {
                    return (
                        <div>
                            <Link target="_blank" to={"/editFirst?uid=" + record.uid + ""}>
                                <i className="i-action-ico i-edit"></i>
                            </Link>
                        </div>
                    )
                },
                width: 150
            }
        ];
        return (
            <div className="g-first">
                <p className="m-head">一级合伙人</p>
                <div className="intervalBottom">
	                <Link to={"/addFirst/"} className="intervalRight">
	                    <Button type="primary" icon="plus" className="add-partner-btn">添加合伙人</Button>
	                </Link>
                    <Select defaultValue="mobile" className="selectWidth intervalRight"  onChange={(value) => { this.setOneKV("searchType", value) }}>
                        {/* <Option value="">全部</Option> */}
                        <Option value="name">合伙人名称</Option>
                        <Option value="mobile">手机号</Option>
                    </Select>
                    <Search placeholder="搜索" enterButton className="searchWidth intervalRight" onSearch={(value) => { this.searchContent("searchInfo", value) }} /> 
                    <Button className="m-inSel u-btn buttonWidth" onClick={() => this.exportList()}>导出</Button>
                </div>
                <div style={{"marginLeft":"20px"}}>
	                <Spin tip="加载中..." spinning={this.state.loading} size="large" style={{ zIndex: 9999}}>
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