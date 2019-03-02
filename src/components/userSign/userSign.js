
import React from 'react';
import { Table, Pagination, Select, DatePicker, Button, Input, Icon, Spin, Row, Col, message,Modal,Popover } from 'antd';
import { Link} from 'react-router';
import getUrl from "../util.js";
import "./userSign.css";
import { dataString } from '../commonData.js'
const Search = Input.Search;
const confirm = Modal.confirm;
export default class addGoods extends React.Component {

	constructor(){
		super()
		this.state={
			loading:false,
			tableData: [],
            pageVo: {
                page: '0',
                pageSize: '20'
			},
			searchInfo: '',
            pageMax: 0,
            current: 1,
		}
		this.pageChangeFun = this.pageChangeFun.bind(this);
        this.pageSizeFun = this.pageSizeFun.bind(this);
    }
    componentDidMount() {
        this.activityListFn('',this.state.pageVo);
    }
    searchContent(searchInfo, value) {
        this.setState({
            searchInfo: value,
            pageVo: {
                page: '0',
                pageSize: '20'
			},
        }, () => {
            this.activityListFn(this.state.searchInfo, this.state.pageVo);
        })
    }
    
    async activityListFn(searchInfo, pageVo){
        this.setState({
            loading: true
        });
        var data = await fetch(getUrl.url, {
            mode: "cors",
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: "method=ella.operation.allActivityList" + "&content=" + JSON.stringify({ "activityName": searchInfo, "pageVo": pageVo })+dataString
        }).then(res => res.json())
            .then((d) => {
                console.log(d);
                if(d.status == 1){
                    const datalist = [];
                    var list = d.data.activitySignList;
                    for(let i=0;i<list.length;i++){
                        datalist.push({
                            activityCode:list[i].activityCode,
                            activityName:(list[i].activityName == '' || list[i].activityName == null)?'-':list[i].activityName,
                            createTime:(list[i].createTime == '' || list[i].createTime == null)?'-':this.toDate(list[i].createTime),
                            date:((list[i].startTime == '' || list[i].startTime == null)?'-':list[i].startTime)+'--'+((list[i].endTime == '' || list[i].endTime == null)?'-':list[i].endTime),
                        })
                    }
                    this.setState({
                        tableData: datalist,
                        loading: false,
                        pageMax: d.data.count,
                        pageLength: d.data.activitySignList.length
                    })
                }else{
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
            pageVo: {
                ...this.state.pageVo,
                page: pageNum - 1,
            },
            current: pageNum
        }, () => {
            this.activityListFn(this.state.searchInfo, this.state.pageVo);
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
            this.activityListFn(this.state.searchInfo, this.state.pageVo);
        });
    }

    async deleteFn(activityCode) {
        var w = this;
        var data = await fetch(getUrl.url, {
            mode: "cors",
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: "method=ella.operation.deleteActivity" + "&content=" + JSON.stringify({ "activityCode": activityCode})+dataString
        }).then(res => res.json())
            .then((d) => {
                console.log(d);
                w.setState({
                    loading: false
                })
                if (d.status == '1') {
                    this.activityListFn(this.state.searchInfo, this.state.pageVo);
                } else{
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
        var h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours() + ':';
        var m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes() + ':';
        var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
        return (Y + M + D + h + m + s)
    }

	render(){
        var w = this;
		const columns = [
            {
                title: '活动名称',
                dataIndex: 'activityName',
                width: 250,
                className: "td_hide",
		        render: (text, record) =>{
		            return(
		                <Popover
		                    placement="top"
		                    title={null}
		                    content={
		                        record.activityName
		                    }
		                >
		                    <span>{record.activityName}</span>
		                </Popover>
		            )
		        }
            }, {
                title: '创建时间',
                dataIndex: 'createTime',
                width: 220
            }, {
                title: '有效期',
                dataIndex: 'date',
                width: 400
            },{
                title: '详情',
                dataIndex: 'edit',
                render: (text, record) => {
                    return (
                        <div>
                            <Link target="_blank" style={{paddingRight:'20px'}} to={"/editSign?activityCode=" + record.activityCode + ""}>
                                <i className="i-action-ico i-edit"></i>
                            </Link>
                            <span className='i-action-ico i-delete' style={{ paddingLeft: 4 }} onClick={() => w.deleteList(record.activityCode)}></span>
                        </div>
                    )
                },
                width: 150
            }
        ];
		return (
            <div className="g-user-sign">
                <p className="m-head">新用户签到</p>
                <div className="intervalBottom">
	                <Link to={'/addSign'} className="intervalRight">
						<Button type="primary" icon="plus" className="add-active-btn">添加新的活动</Button>
					</Link>
	               
	                <Search placeholder="搜索" enterButton style={{ width: 400 }} onSearch={(value) => { this.searchContent("searchInfo", value) }} />
                 </div>   
				<div className='m-sign-bd'>
					<Spin tip="加载中..." spinning={this.state.loading} size="large" style={{ zIndex: 9999 }}>
						<Table className="m-sign-table t-nm-tab" columns={columns} dataSource={this.state.tableData} bordered pagination={false} scroll={{ y: (this.state.pageLength > 13) ? '620' : 0 }} />
					</Spin>
					<div className="m-pagination-box">
						<Pagination pageSizeOptions={['20', '40', '60', '80', '100']} showSizeChanger showQuickJumper showTotal={total => `共 ${total} 条`} className="m-pagination" defaultPageSize={20} defaultCurrent={1} current={this.state.current} total={this.state.pageMax} onChange={this.pageChangeFun} onShowSizeChange={this.pageSizeFun} />
					</div>
				</div>
            </div>
        )
	}

}