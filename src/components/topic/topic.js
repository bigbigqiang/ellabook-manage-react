/**
 * Created by Administrator on 2017-10-25.
 */
import React from 'react'
import { Table, Icon, Button, message, Popconfirm, Spin, Input, Col, Pagination,Popover } from 'antd'
import { Link } from 'react-router'
import commonData from '../commonData.js'
const Search = Input.Search;
var util = require('../util.js');
import 'whatwg-fetch'
class topicList extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            lists: [],
            pageIndex: 0,
            selectedRowKeys: [],
            minheight: '',
            loading: false,
            pageMax: 10,
            page: '0',
            pageSize: '20',
            current: 1,
            subjectTitle: '',
            total: ''


        }
        this.changeFn = this.changeFn.bind(this);
    }

    fetchFn = async (subjectTitle, page, pageSize) => {
        this.setState({
            loading: true
        });
        var data = await fetch(util.url, {
            method: 'POST',
            headers: {
                "Content-type": "application/x-www-form-urlencoded"
            },
            mode: 'cors',
            body: "method=ella.book.listOperationSubject" + "&content=" + JSON.stringify({ "subjectTitle": subjectTitle, "pageVo": { "page": page, "pageSize": pageSize } }) + commonData.dataString
        })
            .then(function (res) {
                return res.json();
            });
        this.state.lists = data.data.list;
        this.setState({
            lists: this.state.lists,
            loading: false,
            total: data.data.total,
            pageMax: data.data.total

        });

    }
    //搜索框
    TopicSearch(value) {
        this.setState({
            subjectTitle: value
        })
        this.fetchFn(value, 0, this.state.pageSize);

    }

    changeFn = (pager) => {
        this.fetchFn(pager.current - 1);
    }

    deleteFn = async (subjectCode) => {
        const dataSource = [...this.state.lists];
        var doc = {
            subjectCode: subjectCode,
        }
        var data = await fetch(util.url, {
            method: 'POST',
            headers: {
                "Content-type": "application/x-www-form-urlencoded"
            },
            mode: 'cors',
            body: "method=ella.book.delOperationSubject" + "&content=" + JSON.stringify(doc) + commonData.dataString
        })
            .then(function (response) {
                return response.json();
            });
        if (data.status == 1) {
            const cur = this.state.total - 1;
            this.setState({ lists: dataSource.filter(item => item.subjectCode !== subjectCode), total: cur });
            message.success(`删除成功！`);
        } else {
            message.error(`删除失败！`);
        }
    }

    onDelete = (subjectCode) => {
        if (util.operationTypeCheck('DELETE')) {
            this.deleteFn(subjectCode)
        } else {
            message.error('您没有权限删除该数据！');
        }
    }

    componentDidMount() {
        if (util.operationTypeCheck('RETRIEVE')) {
            this.fetchFn(this.state.subjectTitle, this.state.page, this.state.pageSize);
        } else {
            message.error('您没有权限查看该数据！');
        }
        this.pageChangeFun = this.pageChangeFun.bind(this);
        this.pageSizeFun = this.pageSizeFun.bind(this);
    }
    pageSizeFun(current, pageSize) {
        this.setState({
            pageSize: pageSize,
            page: current - 1,
            current: current
        }, () => {
            this.fetchFn(this.state.subjectTitle, this.state.page, this.state.pageSize);
        });
    }
    pageChangeFun(pageNum) {
        this.setState({
            page: pageNum - 1,
            current: pageNum

        }, () => {
            this.fetchFn(this.state.subjectTitle, this.state.page, this.state.pageSize);
        });
    }
    arrowUp = (n) => {
    
        if (util.operationTypeCheck('UPDAT')) {
            if (n == 0) {
                message.error(`不可向上移！`);
            } else {
                var lists = this.state.lists;
                var doc = {
                    moveInModuleCode: lists[n - 1].subjectCode,
                    moveInResult: lists[n].idx,
                    moveOutModuleCode: lists[n].subjectCode,
                    moveOutResult: lists[n - 1].idx,
                    moveType: 'eb_operation_subject',
                    uid: localStorage.uid,
                    token: localStorage.token
                }
                this.arrowFetchFn(doc);
            }
        } else {
            message.error('您没有权限操作该数据！');
        }


    }
    arrowDown = (n) => {
        if (util.operationTypeCheck('UPDAT')) {
            if (n == this.state.lists.length - 1) {
                message.error(`不可向下移！`);
            }
            else {
                var lists = this.state.lists;
                var doc = {
                    moveInModuleCode: lists[n].subjectCode,
                    moveInResult: lists[n + 1].idx,
                    moveOutModuleCode: lists[n + 1].subjectCode,
                    moveOutResult: lists[n].idx,
                    moveType: 'eb_operation_subject',
                    uid: localStorage.uid,
                    token: localStorage.token
                }
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
    }
    // checkbox状态
    onSelectChange = (selectedRowKeys) => {
        this.setState({ selectedRowKeys })
    }


    render() {
        const columns = [{
            title: '专题名称',
            width: '15%',
            dataIndex: 'subjectTitle',
            className:'td_hide',
            render: (text, record) =>{
                return(
                    <Popover
                        placement="top"
                        title={null}
                        content={
                            record.subjectTitle
                        }
                    >
                        <span>{record.subjectTitle}</span>
                    </Popover>
                )
            }
        }, {
            title: '修改时间',
            width: '15%',
            dataIndex: 'updateTime'
        },
        {
            title: '平台',
            width: '15%',
            render: (text, record) => {
            	if(record.platformCode==''){
                	var _platformCode='-';
                }else{
                	var curCode=record.platformCode;
                
                	var curCode2=((curCode.replace("APP","移动客户端")).replace("HD","HD客户端")).replace("GUSHIJI","故事机");
	          
	                var curCode3=curCode2.split(",");
	        
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
            title: '目标类型',
            width: '15%',
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
                }else if (record.targetType == 'COURSE_DETAIL') {
                    return (
                        <span>课程详情</span>
                    )
                }else {
                    return (
                        <span>图书详情</span>
                    )
                }

            }
        }, {
            title: '目标链接',
            width: '20%',
            dataIndex: 'searchPageName'
        }, {
            title: '操作',
            width: '20%',
            dataIndex: 'operate',
            render: (text, record,index) => {
                let url = '/home/topic/addTopic/' + record.subjectCode;
                return (
                    <div style={{ textAlign: 'center' }} className='m-icon-type'>
                        <Link to={url} style={{ marginRight: 20 }} target="_blank"><span className='i-action-ico i-edit'></span></Link>
                        <span className='i-action-ico i-up' style={{ marginRight: 20 }} onClick={() => this.arrowUp(index)}></span>
                        <span className='i-action-ico i-down' style={{ marginRight: 20 }} onClick={() => this.arrowDown(index)}></span>
                        <Popconfirm title="确定删除吗?" onConfirm={() => this.onDelete(record.subjectCode)}>
                            <span className='i-action-ico i-delete'></span>
                        </Popconfirm>
                    </div>
                )
            }
        }]
        const { selectedRowKeys } = this.state
        return (
            <div>
                <p className="m-title">专题管理</p>
                <div className="m-rt-content">
                    <p className='m-btn-add' style={{ "display": "inline-block", "marginRight": "30px" }}><Link to="/home/topic/addTopic/0"><Button type="primary" className="u-btn-add"><Icon type="plus" />添加新专题</Button></Link></p>
                    <Search placeholder="搜索" enterButton style={{ width: 400 }} onSearch={value => this.TopicSearch(value)} />
                    <div>
	                    <Spin tip="加载中..." spinning={this.state.loading} size="large" style={{ zIndex: 9999 }}>
	                        <Table rowKey={"id"} columns={columns} dataSource={this.state.lists} bordered pagination={false} className="t-nm-tab" scroll={{ y: 570 }} />
	                    </Spin>
                    </div>
                    <div className="m-pagination-box">
                        {util.operationTypeCheck('RETRIEVE') ? <Pagination pageSizeOptions={['20', '40', '60', '80', '100']} showSizeChanger showQuickJumper showTotal={total => `共 ${this.state.total} 条`} className="m-pagination" defaultPageSize={20} current={this.state.current} total={this.state.pageMax} onChange={this.pageChangeFun} onShowSizeChange={this.pageSizeFun} /> : null}
                    </div>
                </div>
            </div>
        )
    }
}
export default topicList