
import React from 'react';
import { Table, Pagination, Button, Input,Spin,message, Modal,Popover } from 'antd';
import { Link } from 'react-router';
import getUrl from "../util.js";
import commonData from '../commonData.js';
import "./redeemcode.css";
const Search = Input.Search;
const confirm = Modal.confirm;
import copy from "copy-to-clipboard";
export default class RedeemCode extends React.Component {

    constructor() {
        super()
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
            cardCode:''
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
            cardCode: value,
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
            cardCode:this.state.cardCode,
            createName:'',
            pageVo
        }
        getUrl.API(doc,"ella.operation.getRedeemCodeList")
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
                title: '兑换码批次号',
                dataIndex: 'cardCode',
                width: "15%",
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
                title: '兑换码批次名称',
                dataIndex: 'createName',
                width: "15%",
                className: "td_hide",
		        render: (text, record) =>{
		            return(
		                <Popover
		                    placement="top"
		                    title={null}
		                    content={
		                        record.createName
		                    }
		                >
		                    <span>{record.createName}</span>
		                </Popover>
		            )
		        }
            },{
            title: '活动链接',
            dataIndex: 'url',
            width: "15%",
            render: (text, record) => (
              <Popover
                placement="top"
                title="活动链接"
                content={
                  <div>
                    <Input style={{ marginTop: '5px' }} readOnly value={record.url} />
                    <Button
                      style={{ marginTop: '5px' }}
                      onClick={() => {
                        copy(record.url);
                        message.success("复制成功");
                      }}
                      type="primary"
                    >一键复制</Button>
                  </div>
                }
                trigger="hover" >
                <div className='i-action-ico i-link'></div>
              </Popover>
            )},
            {
                title: '过期时间',
                dataIndex: 'expireTime',
                width: "15%",
            }, {
                title: '用户数量',
                dataIndex: 'createNum',
                width: "10%",
            },{
                title: '兑换商品',
                dataIndex: 'redeemCodeType',
                width: "15%",
                render: (text, record) => {
                    return (
                        <span>{record.redeemCodeType=="monthCard"?"月卡":record.redeemCodeType=="yearCard"?"年卡":record.redeemCodeType=="ipCard"?record.activityName:"-"}</span>
                    )
                }
            },{
                title: '详情',
                dataIndex: 'edit',
                render: (text, record) => {
                    return (
                        <div>
                            <Link target="_blank" style={{ paddingRight: '20px',display:"inline-block",verticalAlign:"middle" }} to={"/redeemlist/"+record.redeemCodeType+"/"+record.batch}>
                                查看详情
                            </Link>
                            <Link target="_blank" style={{ paddingRight: '20px',display:"inline-block",verticalAlign:"middle" }} to={"/addredeemcode/edit/"+record.cardCode+"/"+record.redeemCodeType+"/"+record.batch}>
                                <i className="i-action-ico i-edit"></i>
                            </Link>
                        </div>
                    )
                },
                width: "15%"
            }
        ];
        return (
            <div className="g-user-sign">
                <p className="m-head">兑换码活动管理</p>

                <div className="intervalBottom">
	                <Link to={'/addredeemcode/add/0/0/0'} className="intervalRight">
	                    <Button type="primary" icon="plus" className="add-active-btn">添加新的兑换码</Button>
	                </Link>
	               
	                <Search placeholder="搜索" enterButton style={{ width: 400 }} onSearch={(value) => { this.searchContent(value) }} />
                </div>
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