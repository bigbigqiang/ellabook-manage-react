import React from 'react'
import { Table, message,Spin,Pagination,Modal } from 'antd'

import commonData from '../commonData.js'
var util = require('../util.js');
import 'whatwg-fetch'
export default class AudioList extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            listenCode:'',
            bookList:[],
            pageVo:{
                page:0,
                pageSize:20
            },
            total:'',
            current: 1,
        }
        this.pageChangeFun = this.pageChangeFun.bind(this);
        this.pageSizeFun = this.pageSizeFun.bind(this);
    }

    //图书列表
    bookFetchFn = async (listenCode,pageVo) => {
        this.setState({
            bookLoading: true
        });
        var data = await fetch(util.url, {
            method: 'POST',
            headers: {
                "Content-type": "application/x-www-form-urlencoded"
            },
            mode: 'cors',
            body: "method=ella.operation.getListenAudioList" + "&content=" + JSON.stringify({listenCode,pageVo}) + commonData.dataString
        })
            .then(function (res) {
                return res.json();
            });
            console.log(data);
            if(data.status==1){
                this.setState({
                    bookList: data.data.partList,
                    current:data.data.currentPage,
                    pageLength: data.data.partList.length,
                    bookLoading: false,
                    total:data.data.total
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
            this.bookFetchFn(this.state.listenCode, this.state.pageVo);
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
            this.bookFetchFn(this.state.listenCode, this.state.pageVo);
        });
    }

    componentDidMount() {
        console.log(this.props.listenCode);
        this.setState({
            listenCode:this.props.listenCode
        })
        this.bookFetchFn(this.props.listenCode,this.state.pageVo);
    }


    render() {
        const columns2 = [{
            title: '音频名称',
            width: '33.3%',
            dataIndex: 'audioName',
            render: (text) =><span>{!!text?text:"-"}</span>
              
        },{
            title: '音频状态',
            width: '33.3%',
            dataIndex: 'isShelves',
            render: (text) =><span>{!!text?text:"-"}</span>
        },
        {
            title: '关联图书',
            width: '33.3%',
            dataIndex: 'bookName',
            render: (text) =><span>{!!text?text:"-"}</span>
              
        }
    ]
    console.log(this.state)
        return (
            <div>
                <Spin tip="加载中..." spinning={this.state.bookLoading} size="large" style={{ zIndex: 9999 }}>
                    <Table columns={columns2} dataSource={this.state.bookList} bordered pagination={false} className="t-nm-tab" scroll={{ y:400 }} />
                    <div className="m-pagination-box">
                        <Pagination pageSizeOptions={['20', '40', '60', '80', '100']} showSizeChanger showQuickJumper showTotal={total => `共 ${total} 条`} className="m-pagination" defaultPageSize={20} defaultCurrent={1} current={this.state.current} total={this.state.total} onChange={this.pageChangeFun} onShowSizeChange={this.pageSizeFun} />
                    </div>
                </Spin>
            </div>
        )
    }
}