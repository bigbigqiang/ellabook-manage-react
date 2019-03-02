
import React from 'react';
import { Table, Pagination, Button, Input,Spin,message, Modal,Popover,Icon } from 'antd';
import { Link } from 'react-router';
import getUrl from "../util.js";
import commonData from '../commonData.js';
import "./redeemcode.css";
const Search = Input.Search;
const confirm = Modal.confirm;
export default class RedeemList extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            tableData: [],
            pageVo: {
                page: '0',
                pageSize: '20'
            },
            createName: '',
            pageMax: 0,
            current: 1,
            redeemCodeType:this.props.params.redeemCodeType,
            batch:this.props.params.batch
        }
        this.pageChangeFun = this.pageChangeFun.bind(this);
        this.pageSizeFun = this.pageSizeFun.bind(this);
    }
    componentDidMount() {
        this.getWatchwordCodeListFn(this.state.pageVo);
    }
    searchContent(value) {
        console.log(value)
        this.setState({
           
            pageVo: {
                page: '0',
                pageSize: '20'
            },
        }, () => {
            this.getWatchwordCodeListFn(this.state.pageVo);
        })
    }

    getWatchwordCodeListFn(pageVo) {
        this.setState({
            loading: true
        });
        var doc={
            redeemCodeType:this.state.redeemCodeType,
            batch:this.state.batch,
            pageVo
        }
        getUrl.API(doc,"ella.operation.getCardList")
        .then(response=>response.json())
        .then(response=>{
            if(response.status==1){
                this.setState({
                    tableData: response.data.list,
                    loading: false,
                    pageMax: response.data.total,
                    pageLength: response.data.list.length
                });
            }else{
                message.error(response.message)
            }
        })
        // var data = await fetch(getUrl.url, {
        //     mode: "cors",
        //     method: "POST",
        //     headers: {
        //         'Content-Type': 'application/x-www-form-urlencoded',
        //     },
        //     body: "method=ella.operation.getWatchwordCodeList" + "&content=" + JSON.stringify({ "watchwordCode": createName, "pageVo": pageVo }) + commonData.dataString
        // }).then(res => res.json())
        //     .then((d) => {
        //         console.log(d);
        //         if (d.status == 1) {
        //             const datalist = [];
        //             var list = d.data.list;
        //             var commodity = '';
        //             for (let i = 0; i < list.length; i++) {
        //                 datalist.push({
        //                     waCode: list[i].waCode,
        //                     watchwordCode: list[i].watchwordCode,
        //                     createTime: (list[i].createTime!=null&&list[i].createTime!='')?this.toDate(list[i].createTime):'-',
        //                     status:list[i].status=='WAITING'?'未开始':(list[i].status=='START'?'进行中':(list[i].status=='FINISHED'?'已结束':(list[i].status=='EXPIRED'?'已过期':'禁用'))),
        //                     userNum:list[i].activityAmount+'/'+list[i].userNum,
        //                     date: this.toDate(list[i].startTime) + '--' + this.toDate(list[i].finishTime),
        //                     commodity: (list[i].books != null && list[i].books != '') ? '图书' : ((list[i].vip != null && list[i].vip != '') ? '会员' : ((list[i].coupons != null && list[i].coupons != '') ? '红包' : '-'))
        //                 })
        //             }
        //             this.setState({
        //                 tableData: datalist,
        //                 loading: false,
        //                 pageMax: d.data.total,
        //                 pageLength: d.data.list.length
        //             })
        //         } else {
        //             message.error(d.message);
        //             this.setState({
        //                 loading: false,
        //             })
        //         }
        //     })
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
            this.getWatchwordCodeListFn(this.state.pageVo);
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
            this.getWatchwordCodeListFn(this.state.pageVo);
        });
    }

    async deleteFn(waCode) {
        var w = this;
        var data = await fetch(getUrl.url, {
            mode: "cors",
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: "method=ella.operation.delWatchwordCode" + "&content=" + JSON.stringify({ "waCode": waCode }) + commonData.dataString
        }).then(res => res.json())
            .then((d) => {
                console.log(d);
                w.setState({
                    loading: false
                })
                if (d.status == '1') {
                    this.getWatchwordCodeListFn(this.state.pageVo);
                } else {
                    message.error(d.message);
                }
            })
    }
    //删除一行
    deleteList(key) {
        var w = this;
        console.log(key);
        confirm({
            title: '确定删除此条数据吗？',
            content: '一旦删除将不可恢复！',
            onOk() {
                w.setState({
                    loading: true
                })
                w.deleteFn(key);
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
        var h = date.getHours() < 10 ? '0' + date.getHours()+':' : date.getHours() + ':';
        var m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
        return (Y + M + D + h + m)
    }

    render() {
        var w = this;
        const columns = [
            {
                title: '序号',
                dataIndex: 'indexId',
                width: 400
            },
            {
                title: '兑换码',
                dataIndex: 'cardCode',
                width: 250,
                className: "td_hide",
		        render: (text, record) =>{
		            return(
		                <Popover
		                    placement="top"
		                    title={null}
		                    content={
		                        record.cardCode
		                    }
		                >
		                    <span>{record.cardCode}</span>
		                </Popover>
		            )
		        }
            },{
                title: '过期时间',
                dataIndex: 'expireTime',
                width: 400
            },{
                title: '活动编码',
                dataIndex: 'eventId',
                width: 400,
                render:(text)=>{
                    return <span>{text?text:"-"}</span>
                }

            },
            {

                title: '用户ID',
                dataIndex: 'uid',
                width: "8%",
                className: 'td_hide',
                render: (text, record) => {
                    if(record.uid){
                        return (

                            <Popover
                                placement="top"
                                title={null}
                                content={
                                    record.uid
                                }
                            >
                                <Link to={"/userList/indexInit?uid=" + record.uid} target="_blank">{record.uid}</Link>
                            </Popover>
                        )
                       
                    }else{
                        return <span>-</span>
                    }
                   
                }
            },
           {
                title: '兑换商品',
                dataIndex: 'redeemCodeType',
                width: 120,
                render: (text, record) => {
                    return (
                        <span>{this.state.redeemCodeType=="monthCard"?"月卡":this.state.redeemCodeType=="yearCard"?"年卡":this.state.redeemCodeType=="ipCard"?record.activityName:"-"}</span>
                    )
                }
            }
        ];
        return (
            <div className="g-user-sign">
                <p className="m-head">
                    <Link to="/redeemcode">
                        <Icon type="left" />兑换码列表详情
                    </Link>
                </p>
                <div className='m-sign-bd'>

                    <Spin tip="加载中..." spinning={this.state.loading} size="large" style={{ zIndex: 9999 }}>
                        <Table className="m-sign-table t-nm-tab" columns={columns} dataSource={this.state.tableData} bordered pagination={false}  scroll={{ y: 570 }} />
                    </Spin>
                    <div className="m-pagination-box">
                        <Pagination pageSizeOptions={['20', '40', '60', '80', '100']} showSizeChanger showQuickJumper showTotal={total => `共 ${total} 条`} className="m-pagination" defaultPageSize={20} defaultCurrent={1} current={this.state.current} total={this.state.pageMax} onChange={this.pageChangeFun} onShowSizeChange={this.pageSizeFun} />
                    </div>
                </div>
            </div>
        )
    }

}