/**
 * Created by Administrator on 2017-10-25.
 */
import React from 'react'
import { Table, Icon, Button, message, Popconfirm, Spin, Input, Col, Pagination,Popover, Modal } from 'antd'
import { Link } from 'react-router'
import getUrl from "../util.js"
import commonData from '../commonData.js'
import GoodsList from './goodsList.js'
const Search = Input.Search;
var util = require('../util.js');
import 'whatwg-fetch'
class MedalList extends React.Component {
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
            medalName: '',
            total: '',
            medalCode: '',
            showGoodsModel: false
        }
        this.changeFn = this.changeFn.bind(this);
        this.handleGoodsModelCancel = this.handleGoodsModelCancel.bind(this);
    }

    fetchFn = async (medalName, page, pageSize) => {
        this.setState({
            loading: true
        });
        var data = await fetch(util.url, {
            method: 'POST',
            headers: {
                "Content-type": "application/x-www-form-urlencoded"
            },
            mode: 'cors',
            body: "method=ella.operation.listCourseMedal" + "&content=" + JSON.stringify({ "medalName": medalName, "pageVo": { "page": page, "pageSize": pageSize } }) + commonData.dataString
        })
            .then(function (res) {
                return res.json();
            });
        this.setState({
            lists: data.data.list,
            loading: false,
            total: data.data.total,
            pageMax: data.data.total
        }
        );

    }
    //搜索框
    TopicSearch(value) {
        this.setState({
            medalName: value
        })
        this.fetchFn(value, 0, this.state.pageSize);

    }

    changeFn = (pager) => {
        this.fetchFn(pager.current - 1);
    }

    deleteFn = async (medalCode) => {
        const dataSource = [...this.state.lists];
        var doc = {
            medalCode: medalCode,
        }
        var data = await fetch(util.url, {
            method: 'POST',
            headers: {
                "Content-type": "application/x-www-form-urlencoded"
            },
            mode: 'cors',
            body: "method=ella.operation.delCourseMedal" + "&content=" + JSON.stringify(doc) + commonData.dataString
        })
            .then(function (response) {
                return response.json();
            });
        if (data.status == 1) {
            const cur = this.state.total - 1;
            this.setState({ lists: dataSource.filter(item => item.medalCode !== medalCode), total: cur });
            message.success(`删除成功！`);
        } else {
            message.error(`删除失败！`);
        }
    }

    onDelete = (medalCode) => {
        if (util.operationTypeCheck('DELETE')) {
            this.deleteFn(medalCode)
        } else {
            message.error('您没有权限删除该数据！');
        }
    }

    componentDidMount() {
        if (util.operationTypeCheck('RETRIEVE')) {
            this.fetchFn(this.state.medalName, this.state.page, this.state.pageSize);
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
            this.fetchFn(this.state.medalName, this.state.page, this.state.pageSize);
        });
    }
    pageChangeFun(pageNum) {
        this.setState({
            page: pageNum - 1,
            current: pageNum
        }, () => {
            this.fetchFn(this.state.medalName, this.state.page, this.state.pageSize);
        });
    }

    showGoodsModel (medalCode) {
        this.setState({
            medalCode: medalCode,
            showGoodsModel: true
        })
    }
    handleGoodsModelCancel () {
        this.setState({
            showGoodsModel: false
        })
    }

    render() {
        const columns = [{
            title: '勋章名称',
            width: '18.75%',
            dataIndex: 'medalName'
        }, {
            title: '添加时间',
            width: '25%',
            dataIndex: 'createTime'
        },{
            title: '勋章类型',
            width: '12.5%',
            dataIndex: 'medalType',
            render: (text, record, index) => {
                return '阅读行为/课程'
            }
        },{
            title: '关联商品',
            width: '5%',
            dataIndex: 'courseNum',
            render: (text, record, index) => {
                return (<a href='javascript:void(0);' onClick={()=>{this.showGoodsModel(record.medalCode)}}>{record.courseNum}</a>)
            }
        },{
            title: '操作',
            width: '7.5%',
            dataIndex: 'operate',
            render: (text, record,index) => {
                let url = '/medal/addMedal/' + record.medalCode;
                return (
                    <div style={{ textAlign: 'center' }} className='m-icon-type'>
                        <Link to={url} style={{ marginRight: '20px' }}><span className='i-action-ico i-edit'></span></Link>
                        <Popconfirm title="确定删除吗?" onConfirm={() => this.onDelete(record.medalCode)}>
                            <span className='i-action-ico i-delete'></span>
                        </Popconfirm>
                    </div>
                )
            }
        }]
        return (
            <div>
                <p className="m-title">勋章管理</p>
                <div className="m-rt-content">
                    <p className='m-btn-add' style={{ "display": "inline-block", "marginRight": "30px" }}><Link to="/medal/addMedal/0"><Button type="primary" className="u-btn-add"><Icon type="plus" />添加新勋章</Button></Link></p>
                    <Search placeholder="搜索" enterButton style={{ width: 400 }} onSearch={value => this.TopicSearch(value)} />
                    <div>
	                    <Spin tip="加载中..." spinning={this.state.loading} size="large" style={{ zIndex: 9999 }}>
	                        <Table columns={columns} dataSource={this.state.lists} bordered pagination={false} className="t-nm-tab" style={{minWidth:1140}} scroll={{ y: 570 }} />
	                    </Spin>
                    </div>
                    <div className="m-pagination-box">
                        {util.operationTypeCheck('RETRIEVE') ? <Pagination pageSizeOptions={['20', '40', '60', '80', '100']} showSizeChanger showQuickJumper showTotal={total => `共 ${this.state.total} 条`} className="m-pagination" defaultPageSize={20} defaultCurrent={1} current={this.state.current} total={this.state.pageMax} onChange={this.pageChangeFun} onShowSizeChange={this.pageSizeFun} /> : null}
                    </div>
                </div>
                <Modal
			          visible={this.state.showGoodsModel}
			          title="关联商品列表"
			          onCancel={this.handleGoodsModelCancel}
			          footer={null}
			          width={1000}
			        >
                    {this.state.showGoodsModel&&<GoodsList medalCode={this.state.medalCode}></GoodsList>}
                </Modal>
            </div>
        )
    }
}
export default MedalList