import React from 'react'
import { Spin, Progress, Pagination, message, Select, DatePicker, Icon, Button, Input, Row, Col, Table, Cascader, Modal, Upload,Popover } from 'antd';
const Search = Input.Search;
import { Link } from 'react-router';
import moment, { normalizeUnits } from 'moment';
import 'antd/dist/antd.css';
import './logger.css';

import commonData from '../commonData.js'

const confirm = Modal.confirm;
var util = require('../util.js');
function onOk(value) {
    console.log('onOk: ', value);
}
export default class logger extends React.Component {
    constructor() {
        super()
        this.state = {
            tableData: [],
            pageMax: 0,
            pageLength: '',
            page: '',
            pageSize: '20',
            current: 1,
			loading: false,
			selectDU: "down",
			searchFlag: false,
			startTime: "",
            endTime: "",
            departmentName:'',      //部门名称
            positionName:'',        //职位名称
            roleName:'',
            searchType:'ALL',
            searchContent:'',
            department:[],      //部门下拉框
            position:[],      //职位下拉框
            role:[]             //角色下拉框
        };
        this.pageChangeFun = this.pageChangeFun.bind(this);
		this.pageSizeFun = this.pageSizeFun.bind(this);
		this.selectSet = this.selectSet.bind(this);
    }

    pageChangeFun(pageNum) {
        console.log(pageNum);
        this.setState({
            page: pageNum - 1,
            current: pageNum
        }, () => {
            this.logListFn(this.state.startTime,this.state.endTime,this.state.departmentName,this.state.positionName,this.state.roleName,this.state.searchType,this.state.searchContent,this.state.page,this.state.pageSize);
        });
    }

    pageSizeFun(current, pageSize) {
        console.log(current, pageSize);
        this.setState({
            pageSize: pageSize,
            page: current - 1,
            current: current
        }, () => {
            this.logListFn(this.state.startTime,this.state.endTime,this.state.departmentName,this.state.positionName,this.state.roleName,this.state.searchType,this.state.searchContent,this.state.page,this.state.pageSize);
        });
    }

    componentDidMount() {
        this.logListFn(this.state.startTime,this.state.endTime,this.state.departmentName,this.state.positionName,this.state.roleName,this.state.searchType,this.state.searchContent,this.state.page,this.state.pageSize);
        this.findAllRoleList();
        this.findAllDepartmentAndPositionList();
    }

    //下拉框角色接口
    async findAllRoleList() {
        this.setState({
            loading: true
        });
        var data = await fetch(util.url, {
            mode: "cors",
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },

            body: "method=ella.operation.boxSearchList" + "&content=" + JSON.stringify({ "groupId": 'operation.box.findAllRole', "type": 'AUTO_BOX'}) + commonData.dataString

        }).then(res => res.json())
            .then((d) => {
                console.log(d);
                this.setState({
                    role:d.data
                })
            })
    }
    //下拉框部门及职位接口
    async findAllDepartmentAndPositionList() {
        this.setState({
            loading: true
        });
        var data = await fetch(util.url, {
            mode: "cors",
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },

            body: "method=ella.operation.boxSearchList" + "&content=" + JSON.stringify({ "groupId": 'operation.box.findAllDepartmentAndPosition', "type": 'AUTO_BOX'}) + commonData.dataString

        }).then(res => res.json())
            .then((d) => {
                console.log(d);
                this.setState({
                    department:d.data
                },()=>{
                    console.log(this.state.department);
                })
            })
    }

    //日志列表
    async logListFn(startTime, endTime, departmentName, positionName, roleName, searchType, searchContent, page, pageSize) {
        this.setState({
            loading: true
        });
        var data = await fetch(util.url, {
            mode: "cors",
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },

            body: "method=ella.operation.findOperationLogList" + "&content=" + JSON.stringify({ "startTime": startTime, "endTime": endTime, "departmentName": departmentName, "positionName": positionName, "roleName": roleName, "searchType": searchType, "searchContent": searchContent, "page": page, "pageSize": pageSize}) + commonData.dataString
        }).then(res => res.json())
            .then((d) => {
                console.log(d);
                const datalist = [];
                var list = d.data.list;

                this.setState({
                    tableData: d.data.list,
                    loading: false,
                    pageMax: d.data.total,
                    pageLength: d.data.list.length,
                }, () => {
                    console.log(this.state.tableData);
                });
            })
    }

    focus = (name, type, listStr) => {
        console.log(name, type, listStr);
    };

    query() {
        var w = this;
        this.logListFn(this.state.startTime,this.state.endTime,this.state.departmentName,this.state.positionName,this.state.roleName,this.state.searchType,this.state.searchContent,this.state.page,this.state.pageSize);
    }
    startTime(value, dateString, str) {
        console.log(value, dateString, str);
        this.setState({
            startTime: dateString
        })
    }
    endTime(value, dateString, str) {
        console.log(value, dateString, str);
        this.setState({
            endTime: dateString
        })
    }
    searchChange(str, value) {
        console.log(str, value);
        this.setState({
            searchType: value
        })
    }
    searchContent(value) {
        console.log(value);
        this.setState({
            searchContent:value
        },()=>{
            this.logListFn(this.state.startTime,this.state.endTime,this.state.departmentName,this.state.positionName,this.state.roleName,this.state.searchType,this.state.searchContent,this.state.page,this.state.pageSize);
        })
    }
    //设置更多搜索条件的
    selectSet() {
        if (this.state.selectDU == "down") {
            this.setState({
                searchFlag: true,
                selectDU: "up"
            })
        } else if (this.state.selectDU == "up") {
            this.setState({
                searchFlag: false,
                selectDU: "down"
            })
        }

    }

    clearSelect() {
        this.setState({
            page: '',
            pageSize: '20',
            startTime: "",
            endTime: "",
            departmentName:'',
            positionName:'',
            roleName:'',
            searchContent:'',
        })
    }

    //部门选择
    departmentChange(value,name){
        console.log(value);
        console.log(name);
        console.log(name.props.name);
        if(value==''){
            var select = document.getElementsByClassName('j-select')[0];
            var select1 = document.getElementsByClassName('j-select')[1];
            select.style.display = 'none';
            select1.style.display = 'none';
        }else{
            const secondeList = [];
            var list = this.state.department;
            for (let i = 0; i < list.length; i++) {
                if (list[i].parentCode == value) {
                    secondeList.push({
                        departCode: list[i].departCode,
                        departName: list[i].departName
                    })
                }
            }
            this.setState({
                position: secondeList,
            })
            var select = document.getElementsByClassName('j-select')[0];
            var select1 = document.getElementsByClassName('j-select')[1];
            select.style.display = 'block';
            select1.style.display = 'block';
        }
        this.setState({
            departmentName:value
        })  
    }
    //职位选择
    positionChange(value){
        this.setState({
            positionName:value
        })
    }
    //角色选择
    roleChange(value){
        this.setState({
            roleName:value
        })
    }


    render() {
        let w = this;
        const columns = [
            {
                title: '员工姓名',
                dataIndex: 'userName',
                width: "20%"
            },
            {
                title: '手机号',
                dataIndex: 'mobile',
                width: "20%",
            },
            // {
            //     title: '部门',
            //     dataIndex: 'departName',
            //     width: 90
            // },
            // {
            //     title: '职位',
            //     dataIndex: 'positionName',
            //     width: 110
            // },
            {
                title: '角色',
                dataIndex: 'roleName',
                width: "20%"
            },
            {
                title: '操作内容',
                dataIndex: 'targetName',
                width: "20%",
                className: "td_hide",
		        render: (text, record) =>{
		            return(
		                <Popover
		                    placement="top"
		                    title={null}
		                    content={
		                        record.targetName
		                    }
		                >
		                    <span>{record.targetName}</span>
		                </Popover>
		            )
		        }
            },
            {
                title: '操作时间',
                dataIndex: 'createTime',
                width: "20%"
            }];
        return (
            <div className="g-bookList">
                <p className="m-head">日志记录</p>
                <div className="g-book-table">
                    <div className="intervalBottom">
                       
                            <Select defaultValue="ALL" className="selectWidth intervalRight" onChange={(value) => this.searchChange("searchType", value)}>
                                <Option value="ALL">全部</Option>
                                <Option value="USER_NAME">员工姓名</Option>
                                <Option value="MOBILE">手机号</Option>
                                <Option value="CONTENT">操作内容</Option>
                            </Select>
                       
                        
                            <Search
                                placeholder="搜索"
                                enterButton 
                              	className="searchWidth intervalRight"
                                onSearch={(value) => {
                                    this.setState({
                                        current: 1
                                    })
                                    this.searchContent(value)
                                }}
                                onChange={(e) => {
                                    // TODO:每次改变搜索内容的时候页码恢复起始页
                                    this.setState({
                                        pageVo: {
                                            page: '',
                                            pageSize: '20'
                                        }
                                    })
                                }} />
                       
                        <div className="setSelect" onClick={this.selectSet}>更多条件 <Icon type={this.state.selectDU} /></div>
                    </div>

                    <div className="m-book-bd" style={{ height: this.state.searchFlag ? "auto" : 0,marginLeft:0 }}>
                       	<div className="part">
	                        <span className="u-txt">部门:</span>
                            <Select className="selectWidth" onChange={(value,name) => this.departmentChange(value,name)}>
                                <Option value=''>全部</Option>
                                {
                                    this.state.department.map(item => {
                                        return item.departLevel=="1"?<Option value={item.departCode} name={item.departName}>{item.departName}</Option>:''
                                    })
                                }
                            </Select>
                        </div> 
                		<div className="part j-select" style={{display:'none'}}>
	                        <span className="u-txt">职位:</span>
                            <Select className="selectWidth"  onChange={(value,name) => this.positionChange(value,name)}>
                                {
                                    this.state.position.map(item => {
                                        return <Option value={item.departCode}>{item.departName}</Option>
                                    })
                                }
                            </Select>
                        </div>
                        <div className="part">
	                        <span className="u-txt">角色:</span>  
	                        <Select className="selectWidth" onChange={(value) => this.roleChange(value)}>
	                            <Option value=''>全部</Option>
	                            {
	                                this.state.role.map(item => {
	                                    return <Option value={item.roleCode}>{item.roleName}</Option>
	                                })
	                            }
	                        </Select>
                       	</div>
                       	<div className="part">
							<span className="u-txt">操作时间:</span>
                            
                            <DatePicker
                                style={{ width: "140px" }}
                                format="YYYY-MM-DD"
                                placeholder={['开始时间']}
                                onChange={(value, dateString) => { this.startTime(value, dateString, "startTime") }}
                                onOk={onOk}
                                value={this.state.startTime != '' ? moment(this.state.startTime, 'YYYY-MM-DD') : null}
                            />
                           
                                <i> — </i>
                           
                            <DatePicker
                                style={{ width: "140px" }}
                                format="YYYY-MM-DD"
                                placeholder={['结束时间']}
                                onChange={(value, dateString) => { this.endTime(value, dateString, "endTime") }}
                                onOk={onOk}
                                value={this.state.endTime != '' ? moment(this.state.endTime, 'YYYY-MM-DD') : null}
                            />
                        </div>
                        <div className="intervalBottom">
							<Button className="block u-btn-green buttonWidth intervalRight" onClick={this.query.bind(this)}>查询</Button>
	                        <Button className="block u-btn-green buttonWidth" onClick={() => this.clearSelect()}>恢复默认</Button>
                      	</div>
                    </div>

                    <Spin tip="加载中..." spinning={this.state.loading} size="large" style={{ zIndex: 9999 }}>
                        <Table className="m-book-table t-nm-tab" columns={columns} dataSource={this.state.tableData} bordered pagination={false} scroll={{ y: ((this.state.pageLength > 13) ? 640 : 0) }} />
                    </Spin>
                    <div className="m-pagination-box">
                        <Pagination pageSizeOptions={['20', '40', '60', '80', '100']} showSizeChanger showQuickJumper showTotal={total => `共 ${total} 条`} className="m-pagination" defaultPageSize={20} defaultCurrent={1} current={this.state.current} total={this.state.pageMax} onChange={this.pageChangeFun} onShowSizeChange={this.pageSizeFun} />
                    </div>
                </div>
            </div>
        )
    }
}