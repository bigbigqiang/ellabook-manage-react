
import React from 'react';
import { Table, Pagination, Select, DatePicker,Popconfirm, Button, Input, Icon, Spin, Row, Col, message, Modal,Popover } from 'antd';
import { Link } from 'react-router';
import getUrl from "../util.js";
import commonData from '../commonData.js';
// import "./pwdCode.css";
const Search = Input.Search;
const confirm = Modal.confirm;
export default class recommendation extends React.Component {

    constructor() {
        super()
        this.state = {
            loading: false,
            tableData: [],
            page: '0',
            pageSize: '20',
            searchInfo: '',
            pageMax: 0,
            current: 1,
            addVisible:false,

            adviceName:''       //通知名称
        }
        this.pageChangeFun = this.pageChangeFun.bind(this);
        this.pageSizeFun = this.pageSizeFun.bind(this);
    }
    componentDidMount() {
        this.getAdviceList(this.state.adviceName,this.state.pageSize,this.state.page);
    }
    searchContent(searchInfo, value) {
        this.setState({
            searchInfo: value,
            adviceName:value,
            page: '0',
            pageSize: '20'
        }, () => {
            this.getAdviceList(this.state.adviceName,this.state.pageSize,this.state.page);
        })
    }

    async getAdviceList(adviceName, pageSize,page) {
        this.setState({
            loading: true
        });
        var data = await fetch(getUrl.url, {
            mode: "cors",
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: "method=ella.operation.getAdviceList" + "&content=" + JSON.stringify({ "adviceType": 'DAILY_CARD_POPUP', "adviceName": adviceName,"pageSize":pageSize,"page":page }) + commonData.dataString
        }).then(res => res.json())
            .then((d) => {
                console.log(d);
                if (d.status == 1) {
                    const datalist = [];
                    var list = d.data.list;
                    var commodity = '';
                    for (let i = 0; i < list.length; i++) {
                        var startupType = list[i].targetType;
                        var status = list[i].status;
                        //通知类型
                        if (startupType == 'BOOK_DETAIL') {
                            startupType = '图书';
                        } else if (startupType == 'BOOK_COURSE') {
                            startupType = '课程';
                        } else {
                            startupType = '-';
                        }
                        //状态
                        if (status == 'PUSH_NO') {
                            status = '未推送';
                        } else if (status == 'PUSHING') {
                            status = '正在推送';
                        } else if (status == 'SUCCESS') {
                            status = '成功';
                        } else if (status == 'FAIL') {
                            status = '失败';
                        } else if (status == 'EXCEPTION') {
                            status = '异常';
                        } else {
                            status = '-';
                        }
                        datalist.push({
                            adviceName: list[i].adviceName,
                            startTime: (list[i].startTime!=null&&list[i].startTime!='')?list[i].startTime:'-',
                            startupType:startupType,
                            status:status,
                            startupCode:list[i].startupCode
                        })
                    }
                    this.setState({
                        tableData: datalist,
                        loading: false,
                        pageMax: d.data.total,
                        pageLength: d.data.list.length
                    })
                } else {
                    message.error(d.message);
                    this.setState({
                        loading: false,
                    })
                }
            })
    }

    pageChangeFun(pageNum) {
        console.log(pageNum);
        this.setState({
            page: pageNum - 1,
            current: pageNum
        }, () => {
            this.getAdviceList(this.state.adviceName,this.state.pageSize,this.state.page);
        });
    }

    pageSizeFun(current, pageSize) {
        console.log(current, pageSize);
        this.setState({
            pageSize: pageSize,
            page: current - 1,
            current: current
        }, () => {
            this.getAdviceList(this.state.adviceName,this.state.pageSize,this.state.page);
        });
    }

    async deleteFn(startupCode) {
        var w = this;
        var data = await fetch(getUrl.url, {
            mode: "cors",
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: "method=ella.operation.deleteAdvice" + "&content=" + JSON.stringify({ "startupCode": startupCode }) + commonData.dataString
        }).then(res => res.json())
            .then((d) => {
                console.log(d);
                w.setState({
                    loading: false
                })
                if (d.status== '1') {
                	message.success("操作成功！");
                    this.getAdviceList(this.state.adviceName,this.state.pageSize,this.state.page);
                } else {
                    message.error(d.message);
                }
            })
    }
    //删除一行
    onDelete(startupCode) {
        var w = this;
        console.log(startupCode);
        confirm({
            title: '确定删除此条数据吗？',
            content: '一旦删除将不可恢复！',
            onOk() {
                w.setState({
                    loading: true
                })
                w.deleteFn(startupCode);
            },
            onCancel() { },
        })
    }


    //时间转换
    toDate(number) {
        var n = number * 1;
        var date = new Date(n);
        var Y = date.getFullYear() + '-';
        var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        var D = date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate() + ' ';
        var h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours() + ':';
        var m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
        return (Y + M + D + h + m)
    }
    showModal = () => {
        this.setState({
            addVisible: true,
        });
      }
    handleCancel = () => {
        this.setState({ addVisible: false });
    }

    render() {
    	console.log(this.state.tableData)
        var w = this;
        const columns = [
            {
                title: '标题',
                dataIndex: 'adviceName',
                width: 250,
                className: "td_hide",
		        render: (text, record) =>{
		            return(
		                <Popover
		                    placement="top"
		                    title={null}
		                    content={
		                        record.adviceName
		                    }
		                >
		                    <span>{record.adviceName}</span>
		                </Popover>
		            )
		        }
            }, {
                title: '推送时间',
                dataIndex: 'startTime',
                width: 220
            }, {
                title: '类型',
                dataIndex: 'startupType',
                width: 120
            }, {
                title: '状态',
                dataIndex: 'status',
                width: 120
            },{
                title: '操作',
                dataIndex: 'edit',
                render: (text, record) => {
                    return (
                        <div>
                            <Link target="_blank" to={"/addRecommendation?adviceCode="+record.startupCode} style={{ marginRight: '20px' }}>
                                <i className="i-action-ico i-edit"></i>
                            </Link>
                        
							<Popconfirm title="确定要删除吗?" onConfirm={() => this.onDelete(record.startupCode)}>
								<span className='i-action-ico i-delete'></span>
							</Popconfirm>
	
                        </div>
                    )
                },
                width: 150
            }
        ];
        return (
            <div className="g-user-sign">
                <p className="m-head">每日推荐弹窗管理</p>
                <div className="part">
	                <Link to={'/addRecommendation'} className="intervalRight">
	                	<Button type="primary" icon="plus" className="add-active-btn" onClick={this.showModal}>添加新的每日推荐</Button>
	                </Link>
	                <Search placeholder="搜索" enterButton style={{ width: 400 }} onSearch={(value) => { this.searchContent("searchInfo", value) }} />
               	</div>
                <div className='m-sign-bd'>

                    <Spin tip="加载中..." spinning={this.state.loading} size="large" style={{ zIndex: 9999 }}>
                        <Table className="m-sign-table t-nm-tab" columns={columns} dataSource={this.state.tableData} bordered pagination={false} scroll={{ y: ((this.state.pageLength > 13) ? 620 : 0) }} />
                    </Spin>
                    <div className="m-pagination-box">
                        <Pagination pageSizeOptions={['20', '40', '60', '80', '100']} showSizeChanger showQuickJumper showTotal={total => `共 ${total} 条`} className="m-pagination" defaultPageSize={20} defaultCurrent={1} current={this.state.current} total={this.state.pageMax} onChange={this.pageChangeFun} onShowSizeChange={this.pageSizeFun} />
                    </div>
                </div>
            </div>
        )
    }

}