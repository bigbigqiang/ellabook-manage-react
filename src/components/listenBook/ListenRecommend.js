import React from 'react'

import { Button, Table, Icon, message, Popconfirm,Modal, Spin, Row, Col, Select, Pagination, Input,DatePicker,Popover} from 'antd';


import { Link } from 'react-router';
import './ListenRecommend.less';
import getUrl from '../util';
import commonData from '../commonData.js'
import AudioList from './AudioList.js'
import moment from 'moment';

const Search = Input.Search;
class ListenRecommend extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            dataSource: [],
            total: 0,
            loading: false,
            pageNum: 0,
            pageSize: 20,
            current: 1,
            listenName: '',
            isShow: false,
            beginTime:'',
            endTime:'',
            targetType:null,
            visible: false, //模态框显示关闭
            showStatus:'',
            svipExist: 'NO',
            ShowStatusList:[],
            recommendType:"recommendName",
            listenCode:"",
            visible2:false,
            platformList:[],
            platformCode:''
            

        };
        this.pageChangeFun = this.pageChangeFun.bind(this);
        this.pageSizeFun = this.pageSizeFun.bind(this);
    }
    componentDidMount() {
    	this.fetchdata();
        this.fetchModuleList(this.state.listenName,this.state.pageNum, this.state.pageSize);
        this.fetchPlatformList("SYSTEM_PLATFORM");
    }
     //平台下拉框数据
     fetchPlatformList(groupId) {
        getUrl.API({groupId},"ella.operation.boxSearchList")
        .then(response=>response.json())
        .then(response=>{
            if(response.status==1){
                var cur=response.data.filter(item => item.searchCode != 'GUSHIJI');
                this.setState({
                    platformList:cur
                
                  
                })
            }else{
                console.log(response.message)
            }
          
        }) 
    }
    //模块列表
    fetchModuleList(listenName,pageNum, pageSize) {
        this.setState({
            loading: true
        })
        var doc={ 
            listenName,
            pageNum,
            pageSize, 
            beginTime:this.state.beginTime,
            endTime:this.state.endTime,
            showStatus:this.state.showStatus,
            platformCode:this.state.platformCode
        }
        fetch(getUrl.url, {
            method: "POST",
            mode: 'cors',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: "method=ella.operation.getLbListenList" + "&content=" + JSON.stringify(doc) + commonData.dataString,
        }).then(res => res.json()).then((data) => {
            this.setState({
                dataSource: data.data.list,
                total: data.data.total,
                loading: false,
                current:parseInt(pageNum)+1
            },()=>{
                console.log(this.state)
            })
        }).catch(e => {
        })
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
    fetchDeleteModule(listenCode) {
        let param = {
            listenCode
        }
        fetch(getUrl.url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: "method=ella.operation.deleteLbListen" + "&content=" + JSON.stringify(param) + commonData.dataString
        }).then(res => res.json()).then(data => {
            if (data.status == 1) {
                message.success("删除成功!");
                this.fetchModuleList(this.state.listenName,0,this.state.pageSize);
            } else {
                message.success(data.message);
            }
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
            body: "method=ella.operation.boxSearchList" + "&content=" + JSON.stringify({ "groupId":"LISTEN_SHOW_STATUS" })+commonData.dataString
        }).then(res => res.json())
        this.setState({
            ShowStatusList:data.data,
            loading: false
        })
    }
    query() {
        this.fetchModuleList(this.state.listenName,this.state.pageNum, this.state.pageSize);
    }
    
    //搜索框
    recommendSearch(value) {
        this.setState({
            listenName: value
        })
        this.fetchModuleList(value, 0, this.state.pageSize);

    }
    //删除某行
    onDelete = (key) => {
        //判断有没有删除权限  
        if (!getUrl.operationTypeCheck("DELETE")) {
            message.error("抱歉没有权限,请联系管理员或者切换账号")
            return
        }
        if(key.showStatus == "SHOW_ON"){
            message.error("该列表已发布，不能被删除!");
            return ;
        }
        this.setState({
            dataSource: this.state.dataSource.filter(item => item.listenCode !== key.listenCode),
            total: this.state.total - 1
        })
        this.fetchDeleteModule(key.listenCode)
    }
    //判断有没编辑权限
    isUPDAT() {
        if (!getUrl.operationTypeCheck("UPDAT")) {
            message.error("抱歉没有权限,请联系管理员或者切换账号")
        }
    }
   
    pageSizeFun(current, pageSize) {
        this.setState({
            pageSize: pageSize,
            pageNum: current - 1,
            current: current
        }, () => {
            this.fetchModuleList(this.state.listenName,this.state.pageNum, this.state.pageSize);
        });
    }
   
    pageChangeFun(pageNum) {
        this.setState({
            pageNum: pageNum - 1,
            current: pageNum

        }, () => {
            this.fetchModuleList(this.state.listenName,this.state.pageNum, this.state.pageSize);
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
            beginTime: '',
            endTime: '',
            showStatus: '',
            platformCode:''

        })

    }
       //模态框
    showModal = () => {
        this.setState({
            visible: true,
        });
    }
    showAudioList(listenCode){
		this.setState({
			visible2:true,
			listenCode
		})
	}
    render() {
        const columns = [
            {
                title: '推荐名称',
                width: 100,
                dataIndex: 'listenName',
                key: 'listenName',
                className:'td_hide',
	            render: (text, record) =>{
	                return(
	                    <Popover
	                        placement="top"
	                        title={null}
	                        content={
	                            text
	                        }
	                    >
	                        <span>{text}</span>
	                    </Popover>
	                )
	            }
            }, 
            {
                title: '修改时间',
                width: 150,
                dataIndex: 'updateTime',
                render: (text,record) => !!text?moment(text).format('YYYY-MM-DD HH:mm:ss'):moment(record.createTime).format('YYYY-MM-DD HH:mm:ss')

            },
            {
                title: '平台',
                width: '10%',
                render: (text, record) => {
                    if(!!record.platformCode){
                        var curCode=record.platformCode;
                        
                        var curCode2=(curCode.replace("APP","移动客户端")).replace("HD","HD客户端");
                         
                        var curCode3=curCode2.split(",");
                      
                        if(curCode3.length>3){
                           var _platformCode=curCode3.slice(0,3).join("/")+"..."
                        }else{
                            var _platformCode=curCode3.join("/");
                        }
                        
                    }else{
                        var _platformCode='-';
                    }
                    return (
                        <span title={record.platformCode}>{_platformCode}</span>
                    )
                   
    
                }
    
                
            },
            {
                title: '音频数量',
                width: 150,
                dataIndex: 'voiceNum',
                key: 'voiceNum',
                render:(text,record)=><a onClick={() =>this.showAudioList(record.listenCode)}>{text}</a>
            },
            {
                title: '音频总时长',
                width: 150,
                dataIndex: 'voiceTotalTime',
                key: 'voiceTotalTime',
                render:(text)=><span>{parseInt(text / 60)+"′"+parseInt(text % 60)+"″"}</span>
            },
            {
                title: '链接文字',
                width: 100,
                dataIndex: 'jumpDesc',
                className:'td_hide',
	            render: (text, record) =>{
	                return(
	                    <Popover
	                        placement="top"
	                        title={null}
	                        content={
	                            text
	                        }
	                    >
	                        <span>{text}</span>
	                    </Popover>
	                )
	            }
            },
            {
                title: '状态',
                width: 100,
                dataIndex: 'showStatus',
                render: (showStatus) =><span>{showStatus == "SHOW_OFF_UP" ? "上线未发布":showStatus == "SHOW_ON" ? "已发布":showStatus == "SHOW_OFF" ?"未发布":showStatus == "SHOW_OFF_DOWN"?"下线未发布":showStatus == "SHOW_OFF_UPDATE"?"修改未发布":"-" }</span>

                
            }, {
                title: '操作',
                width: 150,
                render: (text, record) => {
                    return (
                        <div>
                            <Link style={{"marginRight":"20px"}} onClick={() => { this.isUPDAT() }} target="_blank" to={`/addListenRecommend/edit/${record.listenCode}/current`}>
                                <i className="i-action-ico i-edit" ></i>
                            </Link>
                            <Popconfirm title="确定删除吗?" onConfirm={() => {this.onDelete(record)}}>
                                <i className="i-action-ico i-delete" ></i>
                            </Popconfirm>
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
                <p className="m-title">听书推荐列表</p>
                <div className="m-rt-content">
                    <div className="m-select">
                        <Link to="/addListenRecommend/add/0/current">
                            <Button type="primary" icon="plus" className="u-btn-add intervalRight">添加新的推荐</Button>
                        </Link>
                        <Select  
                            className="selectWidth intervalRight" 
                            onChange={(value)=>this.getSearchData("recommendType",value)}
                            value={this.state.recommendType}
                        >
                            <Option value="recommendName">推荐名称</Option>
                        </Select>
                        <Search placeholder="搜索" enterButton style={{ width: 400 }} className="intervalRight" onSearch={value => this.recommendSearch(value)} />
                       	<Button style={{ width: '120px' }} type="primary"  className="u-btn-green" onClick={() => { this.setState({ isShow: !this.state.isShow }) }}>展示更多{this.state.isShow ? <Icon type="up" /> : <Icon type="down" />}</Button>

                    </div>
                    <div className="showtime" style={this.state.isShow ? show : not_show}>
                    <div className="rowPartWrap">
                        <Row className="rowPart">
                        	<span className="colTitle">添加时间:</span>
                            <DatePicker
                                style={{"marginLeft":"10px",width:180}}
                                className="intervalBottom"
                                showTime={{ format: 'HH:mm' }}
                                format="YYYY-MM-DD HH:mm:ss"
                                placeholder={['开始时间']}
                                onChange={(value, dateString) => { this.getStartOrEndData(value, dateString, "beginTime") }}

                                value={this.state.beginTime != '' ? moment(this.state.beginTime, 'YYYY-MM-DD HH:mm:ss') : null}
			
                            />
                            <span className="line"> — </span>
                            <DatePicker
                              	className="intervalRight intervalBottom"
                              	style={{width:180}}
                                showTime={{ format: 'HH:mm' }}
                                format="YYYY-MM-DD HH:mm:ss"
                                placeholder={['结束时间']}
                                onChange={(value, dateString) => { this.getStartOrEndData(value, dateString, "endTime") }}
                                value={this.state.endTime != '' ? moment(this.state.endTime, 'YYYY-MM-DD HH:mm:ss') : null}
                            />
                        	<span className="colTitle">展示状态:</span>
                            <Select defaultValue="全部" style={{"marginLeft":"10px",width:130}} className="intervalRight" value={this.state.showStatus} onChange={(value) => { this.getSearchData("showStatus", value) }}>
                                <Option value="">全部</Option>
                                {
                                    this.state.ShowStatusList.map(item => {
                                        return <Option value={item.searchCode}  key={item.searchCode}>{item.searchName}</Option>
                                    })
                                }
                            </Select>
                            <span className="colTitle">平台:</span>
                            <Select defaultValue="全部" style={{"marginLeft":"10px",width:130}} className="intervalRight" value={this.state.platformCode} onChange={(value) => { this.getSearchData("platformCode", value) }}>
                                <Option value="">全部</Option>
                                {
                                    this.state.platformList.map(item=><Option value={item.searchCode}  key={item.searchCode}>{item.searchName}</Option>)
                                }
                                
                            </Select>
                            <div className="intervalBottom">
	                            <Button className="u-btn-green intervalRight" onClick={() => this.fetchModuleList(this.state.listenName,this.state.pageNum, this.state.pageSize)}>查询</Button>
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
                        {getUrl.operationTypeCheck("UPDAT") ? <Pagination 
                            pageSizeOptions={['20', '40', '60', '80', '100']}
                            showSizeChanger
                            showQuickJumper 
                            showTotal={total => `共 ${this.state.total} 条`} 
                            className="m-pagination" 
                            pageSize={this.state.pageSize}
                            current={this.state.current} 
                            total={this.state.total} 
                            onChange={this.pageChangeFun} 
                            onShowSizeChange={this.pageSizeFun}
                            /> : null}
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
                    <Modal
                        visible={this.state.visible2}
                        title="音频列表"
                        onCancel={()=>this.setState({visible2:false})}
                        footer={null}
                        width={1000}
                    >
                        {
                            this.state.visible2 && <AudioList listenCode={this.state.listenCode}/>
                        }
                    </Modal>
                </div>
            </div >
        )
    }
}
export default ListenRecommend;