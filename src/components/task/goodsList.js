import React from 'react'
import { Table, message, Spin, Pagination,Modal } from 'antd'
import commonData from '../commonData.js'
var util = require('../util.js');
import 'whatwg-fetch'
export default class pushBookList extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            medalCode:'',
            list:[],
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
    bookFetchFn = async (medalCode,pageVo) => {
        this.setState({
            bookLoading: true
        });
        fetch(util.url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: "method=ella.operation.listMedalCourse" + "&content=" + JSON.stringify({
                medalCode: medalCode,
                pageVo: pageVo,
            }) + commonData.dataString
        }).then(res => res.json()).then((data) => {
            if (data.status == 1) {
                this.setState({
                    list: data.data.list,
                    pageMax:data.data.total,
                    pageLength: data.data.list.length,
                    bookLoading: false,
                });
            } else {
                message.error(data.message);
                this.setState({
                    bookLoading: false
                }); 
            }
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
            this.bookFetchFn(this.state.medalCode, this.state.pageVo);
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
            this.bookFetchFn(this.state.medalCode, this.state.pageVo);
        });
    }

    componentDidMount() {
        this.setState({
            medalCode:this.props.medalCode
        })
        this.bookFetchFn(this.props.medalCode,this.state.pageVo);
    }


    render() {
        const columns = [
            {
                title: '序号',
                dataIndex: 'idx',
                render: (text, record, index) => {
                    return index + 1
                }
            },
            {
                title: '商品ID',
                dataIndex: 'courseCode',
                key: 'courseCode'
            },
            {
                title: '商品名称',
                dataIndex: 'courseName',
                key: 'courseName'
            }
        ]

        return (
            <div>
                <Spin tip="加载中..." spinning={this.state.bookLoading} size="large" style={{ zIndex: 9999 }}>
                    <Table columns={columns} dataSource={this.state.list} bordered pagination={false} className="t-nm-tab" scroll={{ y: ((this.state.pageLength > 14) ? 600:0) }} />
                    <div className="m-pagination-box" style={{height:60}}>
                        <Pagination pageSizeOptions={['20', '40', '60', '80', '100']} showSizeChanger showQuickJumper showTotal={total => `共 ${total} 条`} className="m-pagination" defaultPageSize={20} defaultCurrent={1} current={this.state.current} total={this.state.pageMax} onChange={this.pageChangeFun} onShowSizeChange={this.pageSizeFun} />
                    </div>
                </Spin>
            </div>
        )
    }
}