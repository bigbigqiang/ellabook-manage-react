/**
 * Created by Administrator on 2017-10-25.
 */
import React from 'react'
import { Table, Icon, Button, Popconfirm, message, Spin, Input, Col, Select, Pagination,Popover } from 'antd'
import { Link } from 'react-router'
// require('babel-polyfill')
// require('es6-promise').polyfill()
const Search = Input.Search;
import getUrl from "../util.js";
import commonData from '../commonData.js';
import 'whatwg-fetch'
var util = require('../util.js');
class AdvertManage extends React.Component {
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
            bannerTitle: ''
        }
        this.changeFn = this.changeFn.bind(this);
        this.pageChangeFun = this.pageChangeFun.bind(this);
        this.pageSizeFun = this.pageSizeFun.bind(this);
    }

    pageSizeFun(current, pageSize) {
        this.setState({
            pageSize: pageSize,
            page: current - 1,
            current: current
        }, () => {
            this.fetchFn(this.state.bannerTitle, this.state.page, this.state.pageSize);
        });
    }
    pageChangeFun(pageNum) {
        this.setState({
            page: pageNum - 1,
            current: pageNum

        }, () => {
            this.fetchFn(this.state.bannerTitle, this.state.page, this.state.pageSize);
        });
    }

    fetchFn = async (bannerTitle, page, pageSize) => {
        this.setState({
            loading: true
        });
        var data = await fetch(util.url, {
            method: 'POST',
            headers: {
                "Content-type": "application/x-www-form-urlencoded"
            },
            mode: 'cors',
            body: "method=ella.operation.getOperationAdList" + "&content=" + JSON.stringify({ "bannerTitle": bannerTitle, "pageVo": { "page": page, "pageSize": pageSize } }) + commonData.dataString
        })
            .then(function (res) {

                return res.json();
            });

        this.setState({
            lists: data.data.list,
            total: data.data.total,
            loading: false,
            total: data.data.total,
            pageMax: data.data.total,
            current:data.data.currentPage
        }, () => {

            if (data.data.length > 12) {
                this.setState({
                    minheight: 510
                })
            } else {
                this.setState({
                    minheight: ''
                })
            }

        });
        localStorage.setItem('current', 2);
        console.log("初始列表数据", data.data)
        // console.log('data：',JSON.stringify(data.data));
    }
    changeFn = (pagination) => {
        console.log(pagination.current);
        this.fetchFn(pagination.current - 1);
    }

    deleteFn = async (bannerCode) => {
        const dataSource = [...this.state.lists];
        var doc = {
            bannerCode: bannerCode,
        }
        var data = await fetch(util.url, {
            method: 'POST',
            headers: {
                "Content-type": "application/x-www-form-urlencoded"
            },
            mode: 'cors',
            body: "method=ella.operation.delOperationAd" + "&content=" + JSON.stringify(doc) + commonData.dataString
        })
            .then(function (response) {
                return response.json();
            });
        if (data.status == 1) {

            const cur = this.state.total - 1;
            this.setState({ lists: dataSource.filter(item => item.bannerCode !== bannerCode), total: cur });
            message.success(`删除成功！`);
        } else {
            message.error(`删除失败！`);
        }
    }

    onDelete = (bannerCode) => {
        if (util.operationTypeCheck('DELETE')) {
            this.deleteFn(bannerCode);
        } else {
            message.error('您没有权限删除该数据！');
        }
    }

    componentDidMount() {
        if (util.operationTypeCheck('RETRIEVE')) {
            this.fetchFn(this.state.bannerTitle, this.state.page, this.state.pageSize);
        } else {
            message.error('您没有权限查看该数据！');
        }

    }
    //搜索框
    bannerSearch(value) {
        this.setState({
            bannerTitle: value
        })
        this.fetchFn(value, 0, this.state.pageSize);
    }

    arrowUp = (n) => {
        if (util.operationTypeCheck('UPDAT')) {
            if (n == 0) {
                message.error(`不可向上移！`);
            } else {
                var lists = this.state.lists;
                console.log(lists);
                var doc = {
                    moveInModuleCode: lists[n - 1].bannerCode,
                    moveInResult: lists[n].idx,
                    moveOutModuleCode: lists[n].bannerCode,
                    moveOutResult: lists[n - 1].idx,
                    moveType: 'eb_operation_banner'
                }
                console.log(JSON.stringify(doc));
                this.arrowFetchFn(doc);
            }
        } else {
            message.error('您没有权限操作该数据！');
        }


    }

    arrowFetchFn = async (doc) => {
        var data = await fetch(util.url, {
            method: 'POST',
            headers: {
                "Content-type": "application/x-www-form-urlencoded"
            },
            mode: 'cors',
            body: "method=ella.operation.homePageObjectMove" + "&content=" + JSON.stringify(doc) + commonData.dataString
        })
            .then(function (response) {
                return response.json();
            });
        this.setState({
            lists: data.data
        });
        console.log(JSON.stringify(data));
    }


    arrowDown = (n) => {
        if (util.operationTypeCheck('UPDAT')) {
            if (n == this.state.lists.length - 1) {
                message.error(`不可向下移！`);
            }
            else {
                var lists = this.state.lists;
                console.log(lists);
                var doc = {
                    moveInModuleCode: lists[n].bannerCode,
                    moveInResult: lists[n + 1].idx,
                    moveOutModuleCode: lists[n + 1].bannerCode,
                    moveOutResult: lists[n].idx,
                    moveType: 'eb_operation_banner'
                }
                console.log(JSON.stringify(doc));
                this.arrowFetchFn(doc);
            }
        } else {
            message.error('您没有权限操作该数据！');
        }

    }

    render() {
        const columns = [{
            title: '图片标题',
            width: '10%',
            dataIndex: 'bannerTitle',
            className:'td_hide',
	        render: (text, record) =>{
	            return(
	                <Popover
	                    placement="top"
	                    title={null}
	                    content={
	                        record.bannerTitle
	                    }
	                >
	                    <span>{record.bannerTitle}</span>
	                </Popover>
	            )
	        }

        },{
            title: '平台',
            width: '10%',
            render: (text, record) => {
            	if(record.platformCode==''){
                	var _platformCode='-';
                }else{
                	var curCode=record.platformCode;
                	console.log(curCode)
                	var curCode2=(curCode.replace("APP","移动客户端")).replace("HD","HD客户端");
	             	console.log(curCode2)
	                var curCode3=curCode2.split(",");
	                console.log(curCode3)
	                if(curCode3.length>3){
	                   var _platformCode=curCode3.slice(0,3).join("/")+"..."
	                }else{
	                    var _platformCode=curCode3.join("/");
	                }
                }
            
              
              
                return (
                    <span title={record.platformCode}>{_platformCode}</span>
                )
               

            }

            
        },
        {
            title: '修改时间',
            width: '10%',
            render: (text, record) => {
                if (record.updateTime != '') {
                    return (
                        <span>{record.updateTime}</span>
                    )
                } else {
                    return (
                        <span>{record.createTime}</span>
                    )
                }

            }
        }, {
            title: '目标类型',
            width: '10%',
            render: (text, record) => {
                if (record.targetType == 'BOOK_LIST') {
                    return (
                        <span>推荐专栏</span>
                    )
                } else if (record.targetType == 'SYSTEM_INTERFACE') {
                    return (
                        <span>系统界面</span>
                    )
                } else if (record.targetType == 'H5') {
                    return (
                        <span>H5页面</span>
                    )
                } else if (record.targetType == 'BOOK_DETAIL') {
                    return (
                        <span>图书详情</span>
                    )
                } else if (record.targetType == 'BOOK_PACKAGE_DETAIL') {
                    return (
                        <span>图书包详情</span>
                    )
                }else if (record.targetType == 'COURSE_DETAIL') {
                    return (
                        <span>课程详情</span>
                    )
                }

            }
        }, {
            title: '目标链接',
            width: '10%',

            render: (text, record) => {
                if (record.searchPageName == '') {
                    return (
                        <span>{record.targetPage}</span>
                    )
                } else {
                    return (
                        <span>{record.searchPageName}</span>
                    )
                }

            }
        }, {
            title: '类型',
            width: '10%',

            render: (text, record) => {
                if (record.adStyle == 'AD_PART') {
                    return (
                        <span>模块广告</span>
                    )
                } else {
                    return (
                        <span>单广告</span>
                    )
                }

            }
        },
        {
            title: '状态',
            width: '10%',

            render: (text, record) => {
                if (record.shelvesFlag == 'SHELVES_OFF') {
                    return (
                        <span>未上线</span>
                    )
                } else {
                    return (
                        <span>已上线</span>
                    )
                }

            }
        },
        {
            title: '模块名称',
            width: '10%',

            render: (text, record) => {
                return (
                    <span>{record.partTitle}</span>
                )
            }
        },
        {
            title: '操作',
            width: '10%',
            render: (text, record) => {
                //console.log(record.partCode)
                if (record.partCode == "") {
                    var url = '/home/addAdvertBanner/' + record.bannerCode + '/' + '0';

                } else {
                    var url = '/home/addAdvertBanner/' + record.bannerCode + '/' + record.partCode;
                }
                return (
                    <div style={{ textAlign: 'center' }} className='m-icon-type'>
                        <Link to={url} style={{ marginRight: 20 }}  target="_blank"><span className='i-action-ico i-edit'></span></Link>
                    {    record.shelvesFlag == 'SHELVES_ON' ? <i className="i-action-ico i-delete"
                                    title={record.shelvesFlag == 'SHELVES_ON' ? "需要首先在「首页管理」中将对应条目内容删除，才能对内容进行删除操作" : null}
                                    onClick={() => { message.warning('该模块已上线，不能被删除') }}
                                /> :
                        <Popconfirm title="确定删除吗?" onConfirm={() => this.onDelete(record.bannerCode)}>
                            <span className='i-action-ico i-delete'></span>
                        </Popconfirm>
					}
                    </div>
                )
            }
        }]

        const { selectedRowKeys } = this.state

        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange
        }

        const pagination = {
            total: this.state.total,
            showSizeChanger: false,
            onShowSizeChange(current, pageSize) {
                console.log('Current: ', current, '; PageSize: ', pageSize)
            }
        }
        const pagination2 = {
            showSizeChanger: true,
            showQuickJumper: true,
            defaultPageSize: 8,
            pageSizeOptions: ['8', '40', '60', '80', '100'],
            showTotal: () => { return `共${this.state.total}条` }
            // 分页加载
            // onChange : (page, pageSize)=>{this.fn(page, pageSize)}
        }
        return (
            <div>
                <p className="m-title">横幅广告管理</p>
                <div className="m-rt-content">
                   
                    <Link to="/home/addAdvertBanner/0/0" className='m-btn-add intervalBottom intervalRight'><Button type="primary" className="u-btn-add"><Icon type="plus" />添加新横幅广告</Button></Link>
                    
                    <Search placeholder="搜索" enterButton className="searchWidth intervalBottom" onSearch={value => this.bannerSearch(value)} />
                    <Spin tip="加载中..." spinning={this.state.loading} size="large" style={{ zIndex: 9999 }}>
                        <Table rowKey={(record, index)=>index} columns={columns} dataSource={this.state.lists} bordered pagination={false} className="t-nm-tab" scroll={{ y: 570 }} />
                    </Spin>
                    <div className="m-pagination-box">
                        {util.operationTypeCheck('RETRIEVE') ? <Pagination pageSizeOptions={['20', '40', '60', '80', '100']} showSizeChanger showQuickJumper showTotal={total => `共 ${this.state.total} 条`} className="m-pagination" defaultPageSize={20} defaultCurrent={1} current={this.state.current} total={this.state.pageMax} onChange={this.pageChangeFun} onShowSizeChange={this.pageSizeFun} /> : null}
                    </div>
                </div>
            </div>
        )
    }
}
export default AdvertManage