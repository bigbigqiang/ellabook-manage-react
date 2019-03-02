import React from 'react'
import { Table, Icon, Button, message, Popconfirm, Spin, Input, Col, Pagination,Modal } from 'antd'
import { Link } from 'react-router'
import getUrl from "../util.js"
import commonData from '../commonData.js'
const Search = Input.Search;
import ClassifyDetail from '../book/classifyDetail.js'
var util = require('../util.js');
import 'whatwg-fetch'
const confirm = Modal.confirm;
export default class pushBookList extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            ipCode:'',
            bookList:[],
            pageVo:{
                page:0,
                pageSize:20
            },
            pageMax: 0,
            current: 1,
        }
        this.pageChangeFun = this.pageChangeFun.bind(this);
        this.pageSizeFun = this.pageSizeFun.bind(this);
    }

    //图书列表
    bookFetchFn = async (ipCode,pageVo) => {
        this.setState({
            bookLoading: true
        });
        var data = await fetch(util.url, {
            method: 'POST',
            headers: {
                "Content-type": "application/x-www-form-urlencoded"
            },
            mode: 'cors',
            body: "method=ella.operation.getBookIPCodeList" + "&content=" + JSON.stringify({"ipCode": ipCode,"pageVo":pageVo}) + commonData.dataString
        })
            .then(function (res) {
                return res.json();
            });
            console.log(data);
            if(data.status==1){
                this.setState({
                    bookList: data.data.bookList,
                    pageMax:data.data.total,
                    pageLength: data.data.bookList.length,
                    bookLoading: false,
                });
            }else{
                message.error(data.message);
                this.setState({
                    bookLoading: false
                }); 
            }
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
            this.bookFetchFn(this.state.ipCode, this.state.pageVo);
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
            this.bookFetchFn(this.state.ipCode, this.state.pageVo);
        });
    }

    componentDidMount() {
        console.log(this.props.ipCode);
        this.setState({
            ipCode:this.props.ipCode
        })
        this.bookFetchFn(this.props.ipCode,this.state.pageVo);
    }


    render() {
        var w = this;
        const columns2 = [{
            title: '图书名称',
            width: '20%',
            dataIndex: 'bookName',
            render: (text,record) => {
                if(record.bookName == ''){
                    return (
                        <span>-</span>
                    )
                }else{
                    return (
                        <span>{record.bookName}</span>
                    )
                }
            }
        },{
            title: '上架时间',
            width: '20%',
            dataIndex: 'createTime',
            render: (text,record) => {
                if(record.createTime == ''){
                    return (
                        <span>-</span>
                    )
                }else{
                    return (
                        <span>{record.createTime}</span>
                    )
                }
            }
        },{
            title: '展示状态',
            width: '20%',
            dataIndex: 'shelvesFlag',
            render: (text,record) => {
                if(record.shelvesFlag == ''){
                    return (
                        <span>-</span>
                    )
                }else if(record.shelvesFlag == 'SHELVES_ON'){
                    return (
                        <span>已上架</span>
                    )
                }else if(record.shelvesFlag == 'SHELVES_OFF'){
                    return (
                        <span>已下架</span>
                    )
                }else if(record.shelvesFlag == 'PRE_SALE'){
                    return (
                        <span>预售</span>
                    )
                }else if(record.shelvesFlag == 'SHELVES_WAIT'){
                    return (
                        <span>待上架</span>
                    )
                }
            }
        }]

        return (
            <div>
                <Spin tip="加载中..." spinning={this.state.bookLoading} size="large" style={{ zIndex: 9999 }}>
                    <Table columns={columns2} dataSource={this.state.bookList} bordered pagination={false} className="t-nm-tab" scroll={{ y: ((this.state.pageLength > 14) ? 600:0) }} />
                    <div className="m-pagination-box">
                        <Pagination pageSizeOptions={['20', '40', '60', '80', '100']} showSizeChanger showQuickJumper showTotal={total => `共 ${total} 条`} className="m-pagination" defaultPageSize={20} defaultCurrent={1} current={this.state.current} total={this.state.pageMax} onChange={this.pageChangeFun} onShowSizeChange={this.pageSizeFun} />
                    </div>
                </Spin>
            </div>
        )
    }
}