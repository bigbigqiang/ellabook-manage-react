import React from 'react'

import { Button, Table, Icon, message, Popconfirm,Modal, Spin, Row, Col, Select, Pagination, Input,DatePicker,Popover} from 'antd';


import { Link } from 'react-router';
import './recommend.css';
import getUrl from '../util';
import commonData from '../commonData.js'

import moment from 'moment';

const Search = Input.Search;
class Recommend extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
        	searchType: "categorySearch",
            dataSource: [],
            total: 0,
            loading: false,
            status: '',
            pageMax: 0,
            page: '0',
            pageSize: '20',
            current: 1,

            partTitle: '',
            isShow: false,
            createPartTime:'',
            endPartTime:'',
            targetType:null,
            visible: false, //模态框显示关闭
            showStatus:null,
            svipExist: 'NO',
            defaultData: {
                dateTypeList: [],
                goodsStateList: [],
                goodsTypeList: [],
            }
            

        };
        this.pageChangeFun = this.pageChangeFun.bind(this);
        this.pageSizeFun = this.pageSizeFun.bind(this);
    }
    handleOk = (e) => {
        this.setState({
            visible: false,
        });
    }
    handleCancel = (e) => {
        this.setState({
            visible: false,
        });
    }
    //删除模块
    fetchDeleteModule(code) {
        let param = {
            'partCode': code,
        }
        fetch(getUrl.url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: "method=ella.operation.delOperationPart" + "&content=" + JSON.stringify(param) + commonData.dataString
        }).then(res => res.json()).then(data => {
            if (data.status == 1) {
                message.success("删除成功!");
            } else {
                message.success("删除失败!");
            }
        })
    }
    statusChange(str, value) {
        this.setState({
            status: value
        })
    }
     getSearchData(str, value) {
        this.setState({
            [str]: value
        })
    }
  
      //拉数据
    async fetchdata() {
        var data = await fetch(getUrl.url, {
            mode: "cors",
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: "method=ella.operation.boxSearchList" + "&content=" + JSON.stringify({ "groupId":"PART_MANAGE_LIST" })+commonData.dataString
        }).then(res => res.json())
        this.setState({
            defaultData: {
                ...this.state.defaultData,
                // [stateStr] : data.data.filter(item=>item.remark==getStr)
                dateTypeList: data.data.filter(item => item.remark == '时间类型'),
                goodsStateList: data.data.filter(item => item.remark == '展示状态'),
                goodsTypeList: data.data.filter(item => item.remark == '推荐类型'),
            },
            loading: false
        })
    }
    query() {
        this.fetchModuleList(this.state.partTitle, this.state.status, this.state.page, this.state.pageSize);
    }
    //模块列表
    fetchModuleList(partTitle, showStatus, page, pageSize) {
        this.setState({
            loading: true
        })
        fetch(getUrl.url, {
            method: "POST",
            mode: 'cors',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: "method=ella.operation.getOperationPartList" + "&content=" + JSON.stringify({ "partTitle": partTitle, "showStatus": showStatus, "pageVo": { "page": page, "pageSize": pageSize } }) + commonData.dataString,
        }).then(res => res.json()).then((data) => {
            let list = [];
            let SVIP_APP = false;
            let SVIP_HD = false;
            for (let i = 0; i < data.data.partList.length; i++) {
                if (data.data.partList[i].partStyle === 'SVIP') {
                    data.data.partList[i].platformCode === 'APP' && (SVIP_APP = true)
                    data.data.partList[i].platformCode === 'HD' && (SVIP_HD = true)
                }
                list.push({
                    partTitle: (data.data.partList[i].partTitle == '' || data.data.partList[i].partTitle == null) ? '-' : data.data.partList[i].partTitle,
                    targetType: (data.data.partList[i].targetType == '' || data.data.partList[i].targetType == null) ? '-' : data.data.partList[i].targetType,
                    updateTime: (data.data.partList[i].updateTime == '' || data.data.partList[i].updateTime == null) ? '-' : data.data.partList[i].updateTime,
                    partSourceNum: (data.data.partList[i].partSourceNum == '' || data.data.partList[i].partSourceNum == null) ? '-' : data.data.partList[i].partSourceNum,
                    targetDesc: (data.data.partList[i].targetDesc == '' || data.data.partList[i].targetDesc == null) ? '-' : data.data.partList[i].targetDesc,
                    showStatus: (data.data.partList[i].showStatus == '' || data.data.partList[i].showStatus == null) ? '-' : data.data.partList[i].showStatus,
                    partCode: data.data.partList[i].partCode,
                    partSource:data.data.partList[i].partSource,
                    channelCodes:data.data.partList[i].channelCodes,
                    platformCode:data.data.partList[i].platformCode,
                    partStyle:data.data.partList[i].partStyle
                })
            }
            if (SVIP_APP && SVIP_HD) {
                this.state.svipExist = 'YES'
            } else if (!SVIP_APP && SVIP_HD){
                this.state.svipExist = 'HD'
            } else if (SVIP_APP && !SVIP_HD){
                this.state.svipExist = 'APP'
            } else if (!SVIP_APP && !SVIP_HD){
                this.state.svipExist = 'NO'
            }
            this.setState({
                svipExist: this.state.svipExist,
                dataSource: list,
                total: data.data.total,
                pageMax: data.data.total,
                pageLength: data.data.partList.length,
                loading: false
            })
        }).catch(e => {
        })
    }
    //搜索框
    recommendSearch(value) {
        this.setState({
            partTitle: value
        })
        this.fetchModuleList(value, this.state.status, 0, this.state.pageSize);

    }
    //删除某行
    onDelete = (key) => {
        //判断有没有删除权限  
        if (!getUrl.operationTypeCheck("DELETE")) {
            message.error("抱歉没有权限,请联系管理员或者切换账号")
            return
        }
        this.setState({
            dataSource: this.state.dataSource.filter(item => item.partCode !== key.partCode),
            total: this.state.total - 1
        })
        this.fetchDeleteModule(key.partCode)
    }
    //判断有没编辑权限
    isUPDAT() {
        if (!getUrl.operationTypeCheck("UPDAT")) {
            message.error("抱歉没有权限,请联系管理员或者切换账号")
        }
    }
    componentDidMount() {
    	this.fetchdata();
        this.fetchModuleList(this.state.partTitle, this.state.status, this.state.page, this.state.pageSize);
    }
    pageSizeFun(current, pageSize) {
        this.setState({
            pageSize: pageSize,
            page: current - 1,
            current: current
        }, () => {
            this.fetchModuleList(this.state.partTitle, this.state.showStatus, this.state.page, this.state.pageSize);
        });
    }
    async fetchSearchResultData(page, searchType, pageSize) {
        //精准检索和条目检索的参数
        var searchData={

            searchType,
            createPartTime: this.state.createPartTime,
            endPartTime: this.state.endPartTime,
            showStatus: this.state.showStatus,
            targetType: this.state.targetType,
            pageVo:{
                page,
                pageSize
            }
            
     	}
        //TODO:比较时间大小
        function CompareDate(d1, d2) {
            return ((new Date(d1.replace(/-/g, "\/"))) >= (new Date(d2.replace(/-/g, "\/"))));
        }
        if (CompareDate(searchData.createPartTime, searchData.endPartTime)) {
            message.error('时间设置不正确');
            return;
        }
      
        var data = await fetch(getUrl.url, {
            mode: "cors",
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: "method=ella.operation.getOperationPartList" + "&content=" + JSON.stringify(searchData)+commonData.dataString
        }).then(res => res.json())
            .then((d) => {
                this.setState({
                    currentPage: d.data.currentPage,
                    isLast: d.data.isLast,
                    total: d.data.total,
                    totalPage: d.data.totalPage,
                    dataSource:d.data.partList
                })
            })
    }
    pageChangeFun(pageNum) {
        this.setState({
            page: pageNum - 1,
            current: pageNum

        }, () => {
            this.fetchModuleList(this.state.partTitle, this.state.status, this.state.page, this.state.pageSize);
        });
    }
	getStartOrEndData(value, dateString, str) {
        this.setState({
            [str]: dateString
        })
    }
	 //恢复默认设置
    clearSelect() {
        this.setState({
            createPartTime: '',
            endPartTime: '',
            targetType: null,
            showStatus: null,

        })

    }
       //模态框
    showModal = () => {
        this.setState({
            visible: true,
        });
    }
    render() {
        const columns = [
            {
                title: '推荐名称',
                width: 100,
                dataIndex: 'partTitle',
                key: 'partTitle',
                className:'td_hide',
	            render: (text, record) =>{
	                return(
	                    <Popover
	                        placement="top"
	                        title={null}
	                        content={
	                            record.partTitle
	                        }
	                    >
	                        <span>{record.partTitle}</span>
	                    </Popover>
	                )
	            }
            }, {
                title: '推荐类型',
                width: 100,
                dataIndex: 'targetType',
                render: (text, record) => {
                    return (
                        <div>
                            {record.targetType == "BOOK_DETAIL" ? "图书详情" :
                                (record.targetType == "H5" ? "H5页面" :
                                    (record.targetType == "SYSTEM_INTERFACE" ? "系统界面" :
                                    	(record.targetType == "COURSE_DETAIL" ? "课程详情" :
                                    		(record.targetType == "COURSE_LIST" ? "课程列表" :
                                        		(record.targetType == "BOOK_LIST" ? '图书列表页' : '')))))
                            }
                        </div>
                    )
                }
            }, 
            {
	            title: '平台',
                width: 100,
                className:'td_hide',
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
	                    // <span title={record.platformCode}>{_platformCode}</span>
                        <Popover content={(<span>{_platformCode}</span>)}>
	                    	<span>{_platformCode}</span>
	                    </Popover>
	                )
	               
	
	            }
	
	            
	        },
	        {
	            title: '渠道',
	            width: 100,
	            render: (text, record) => {
	                var curCode=record.channelCodes.split("/");
	                if(curCode.length>3){
	                   var _channelCodes=curCode.slice(0,3).join("/")+"..."
	                }else{
	                    var _channelCodes=record.channelCodes;
	                }
	              
	              
	                return (
	                    <span title={record.channelCodes}>{_channelCodes}</span>
	                )
	               
	
	            }
	
	            
	        },
            {
                title: '修改时间',
                width: 150,
                dataIndex: 'updateTime',
                key: 'updateTime'
            }, {
                title: '图书数量',
                width: 100,
                dataIndex: 'partSourceNum',
                key: 'partSourceNum'
            }, {
                title: '链接文字',
                width: 100,
                dataIndex: 'targetDesc',
                render: (text, record) => {
                    return (
                        <div>
                            {record.targetDesc}
                        </div>

                    )
                }
            },
            {
                title: '状态',
                width: 100,
                dataIndex: 'showStatus',
                render: (showStatus) => {
                    return <div>
                        {showStatus == "SHOW_ON" ? <span>已展示</span> : <span>未展示</span>}
                    </div>

                }
            }, {
                title: '操作',
                width: 150,
                render: (text, record) => {
                    let recommendType = record.partSource == 'ella.book.listCourse' ? 'course' : 'book';
                    return (
                        <div>
                            <Link onClick={() => { this.isUPDAT() }} target="_blank" to={getUrl.operationTypeCheck("UPDAT") ? `/addRecommend/${record.partCode}/${recommendType}/edit` : `addRecommend`}>
                                <i className="i-action-ico i-edit" ></i>
                            </Link>
                            {
                                record.partStyle === 'SVIP'? null:(
                                    <span className="ant-divider" style={{ margin: '0 10px' }} />
                                )
                            }
                            {
                                record.partStyle === 'SVIP'? null : (record.showStatus == 'SHOW_ON' ? <i className="i-action-ico i-delete"
                                    title={record.showStatus == 'SHOW_ON' ? "需要首先在「首页管理」中将对应条目内容删除，才能对内容进行删除操作" : null}
                                    onClick={() => { message.warning('该模块已展示，不能被删除') }}
                                /> :
                                    <Popconfirm title="确定删除吗?" onConfirm={() => {this.onDelete(record)}}>
                                        <i className="i-action-ico i-delete" ></i>
                                    </Popconfirm>)
                            }
                        </div>
                    )
                }
            }
        ]
        const show = {
            display: "block",

        }
        const not_show = {
            display: "none"
        }
        return (
            <div id="Recommend">
                <p className="m-title">推荐管理</p>
                <div className="m-rt-content">
                    <div className="m-select">
                        <Button disabled={!getUrl.operationTypeCheck("CREATE")} type="primary" icon="plus" className="u-btn-add intervalRight" onClick={this.showModal}>添加新推荐</Button>
                        <Search placeholder="搜索" enterButton style={{ width: 400 }} className="intervalRight" onSearch={value => this.recommendSearch(value)} />
                       	<Button style={{ width: '120px' }} type="primary"  className="u-btn-green" onClick={() => { this.setState({ isShow: !this.state.isShow }) }}>展示更多{this.state.isShow ? <Icon type="up" /> : <Icon type="down" />}</Button>

                    </div>
                    <div className="showtime" style={this.state.isShow ? show : not_show}>
                    <div className="rowPartWrap">
                        <Row className="rowPart">
                        	<span className="colTitle">创建时间:</span>
                            <DatePicker
                                style={{"marginLeft":"10px",width:180}}
                                className="intervalBottom"
                                showTime={{ format: 'HH:mm' }}
                                format="YYYY-MM-DD HH:mm:ss"
                                placeholder={['开始时间']}
                                onChange={(value, dateString) => { this.getStartOrEndData(value, dateString, "createPartTime") }}

                                value={this.state.createPartTime != '' ? moment(this.state.createPartTime, 'YYYY-MM-DD HH:mm:ss') : null}
			
                            />
                            <span className="line"> — </span>
                            <DatePicker
                              	className="intervalRight intervalBottom"
                              	style={{width:180}}
                                showTime={{ format: 'HH:mm' }}
                                format="YYYY-MM-DD HH:mm:ss"
                                placeholder={['结束时间']}
                                onChange={(value, dateString) => { this.getStartOrEndData(value, dateString, "endPartTime") }}
                                value={this.state.endPartTime != '' ? moment(this.state.endPartTime, 'YYYY-MM-DD HH:mm:ss') : null}
                            />
                           
                          
                        	<span className="colTitle">推荐类型:</span>
                            <Select defaultValue="全部" style={{"marginLeft":"10px",width:130}} className="intervalRight" value={this.state.targetType} onChange={(value) => { this.getSearchData("targetType", value) }}>
                                <Option value={null}>全部</Option>
                                {
                                    this.state.defaultData.goodsTypeList.map(item => {
                                        return <Option value={item.searchCode} key={item.searchCode}>{item.searchName}</Option>
                                    })
                                }
                            </Select>
                            
                           
                        	<span className="colTitle">展示状态:</span>
                            <Select defaultValue="全部" style={{"marginLeft":"10px",width:130}} className="intervalRight" value={this.state.showStatus} onChange={(value) => { this.getSearchData("showStatus", value) }}>
                                <Option value={null}>全部</Option>
                                {
                                    this.state.defaultData.goodsStateList.map(item => {
                                        return <Option value={item.searchCode}  key={item.searchCode}>{item.searchName}</Option>
                                    })
                                }
                            </Select>
                            <div className="intervalBottom">
	                            <Button className="u-btn-green intervalRight" onClick={() => { this.setState({ searchType: "categorySearch" }); this.fetchSearchResultData(0, "categorySearch", this.state.pageSize) }}>查询</Button>
	                    		<Button className="theSearch u-btn-green" onClick={() => this.clearSelect()}>恢复默认</Button>
                        	</div>
                        </Row>
                    </div>
                   
                   
                    <hr />
                </div>
                    <Spin tip="加载中..." spinning={this.state.loading} size="large" style={{ zIndex: 9999 }}>
                        <Table
                            rowKey={(record, index)=>index}
                            columns={columns}
                            dataSource={this.state.dataSource}
                            pagination={false}
                            scroll={{ y: 570 }}
                        />
                    </Spin>
                    <div className="m-pagination-box">
                        {getUrl.operationTypeCheck("UPDAT") ? <Pagination pageSizeOptions={['20', '40', '60', '80', '100']} showSizeChanger showQuickJumper showTotal={total => `共 ${this.state.total} 条`} className="m-pagination" defaultPageSize={20} defaultCurrent={1} current={this.state.current} total={this.state.total} onChange={this.pageChangeFun} onShowSizeChange={this.pageSizeFun} /> : null}
                    </div>
                    <Modal
                        title="推荐类型选择"
                        visible={this.state.visible}
                        onOk={this.handleOk}
                        onCancel={this.handleCancel}
                        okText="确认"
                        cancelText="关闭"
                        className="goodsListModel"
                    >
                        <Row className="checkbuttonWrap">
                            <Col span={12}><Link to={'/addRecommend/kong/book/add?svipExist=' + this.state.svipExist}><Button className="checkbutton" type="primary">图书</Button></Link></Col>
                        	<Col span={12}><Link to="/addRecommend/kong/course/add"><Button className="checkbutton" type="primary">课程</Button></Link></Col>
                        </Row>
                    </Modal>
                </div>
            </div >
        )
    }
}
export default Recommend;