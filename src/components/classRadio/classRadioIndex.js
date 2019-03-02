
import React from 'react';
import {Row,Col,Card,Icon,Button,Table,Tabs,message,Spin,Input,Pagination,Modal,Select,Popover} from "antd";
import { Link} from 'react-router';
import getUrl from "../util.js";
import "../../main.css";
import "./classRadio.css";
import commonData from '../commonData.js';
const Search = Input.Search;
const TabPane = Tabs.TabPane;
const confirm = Modal.confirm;
export default class classRadio extends React.Component {

	constructor(){
		super()
		this.state={
            current:1,
            page:0,
            pageSize:20,
            onlineData:[],
            allData:[],
            visible:false,
            editVisible:false,
            broadcastContent:'',
            editBroadcastContent:'',
            broadcastCode:'',
            searchInfo:'',
            searchType:'ALL',
            shelvesFlag:'',
        }
        this.pageChangeFun = this.pageChangeFun.bind(this);
        this.pageSizeFun = this.pageSizeFun.bind(this);
	}
  componentDidMount(){
    // this.fetchdata(this.state.searchInfo,this.state.shelvesFlag, this.state.page,this.state.pageSize);
    this.fetchdata(this.state.searchInfo,this.state.searchType,this.state.shelvesFlag, this.state.page,this.state.pageSize);
  }
  pageChangeFun(pageNum) {
    console.log(pageNum);
    this.setState({
        page: pageNum - 1,
        current: pageNum
    }, () => {
        this.fetchdata(this.state.searchInfo,this.state.searchType,this.state.shelvesFlag, this.state.page,this.state.pageSize);
    });
}

pageSizeFun(current, pageSize) {
    console.log(current, pageSize);
    this.setState({
        pageSize: pageSize,
        page: current - 1,
        current: current
    }, () => {
        this.fetchdata(this.state.searchInfo,this.state.searchType,this.state.shelvesFlag, this.state.page,this.state.pageSize);
    });
}
searchContent(value) {
    console.log(value);
    this.setState({
        searchInfo: value,
        page: '0',
        pageSize: '20'
    }, () => {
        this.fetchdata(this.state.searchInfo,this.state.searchType,this.state.shelvesFlag, this.state.page,this.state.pageSize);
    })
}
async fetchdata(searchInfo,searchType,shelvesFlag,page,pageSize) {
    this.setState({
        loading:true
    })
    var onlineData = await fetch(getUrl.url,{
        mode : "cors",
        method : "POST",
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body:"method=ella.operation.getCourseBroadcast"+"&content="+JSON.stringify({ 'searchInfo':searchInfo,'searchType':'ONLINE',"shelvesFlag": 'SHELVES_ON', "page": '0', "pageSize": '20' }) + commonData.dataString
    }).then(res => res.json())
    var allData = await fetch(getUrl.url,{
        mode : "cors",
        method : "POST",
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body:"method=ella.operation.getCourseBroadcast"+"&content="+JSON.stringify({ 'searchInfo':searchInfo,'searchType':searchType,'shelvesFlag':shelvesFlag, "page": page, "pageSize": pageSize }) + commonData.dataString
    }).then(res => res.json())
    console.log(onlineData);
    console.log(allData);
    console.log(allData.data.list);
    if(allData.data.list==undefined){
        this.setState({
            onlineData : getData(onlineData.data),
            allData : getData(allData.data),
            loading:false,
            pageMax: 1,
            pageLength: 13
        })
    }else{
        this.setState({
            onlineData : getData(onlineData.data),
            allData : getAllData(allData.data),
            loading:false,
            pageMax: allData.data.total,
            pageLength: allData.data.list.length,
        })
    }
    

    //此函数用来修改后台传来的数据变为可以展示的数据
    function getData(data){
        var result = data.map(item => {
            var status = item.shelvesFlag=='SHELVES_ON'?'已展示':'未展示';
            var statusFlag = item.shelvesFlag=='SHELVES_ON'?'下线':'上线';
            return {
                ...item,
                status,
                statusFlag
            }
        })
        return result;
    }
    //此函数用来修改后台传来的数据变为可以展示的数据
    function getAllData(data){
        var result = data.list.map(item => {
            var status = item.shelvesFlag=='SHELVES_ON'?'已展示':'未展示';
            var statusFlag = item.shelvesFlag=='SHELVES_ON'?'下线':'上线';
            return {
                ...item,
                status,
                statusFlag
            }
        })
        return result;
    }
}
//删除
async deleteFn(broadcastCode) {
    var w = this;
    var data = await fetch(getUrl.url, {
        mode: "cors",
        method: "POST",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: "method=ella.operation.delCourseBroadcast" + "&content=" + JSON.stringify({ "broadcastCode": broadcastCode}) + commonData.dataString
    }).then(res => res.json())
        .then((d) => {
            console.log(d);
            w.setState({
                loading: false
            })
            if (d.status == '1') {
                this.fetchdata(this.state.searchInfo,this.state.searchType,this.state.shelvesFlag, this.state.page,this.state.pageSize);
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
showModal = () => {
    this.setState({
      visible: true,
    });
  }
handleCancel = () => {
    this.setState({ visible: false,editVisible:false });
}
//广播内容添加
watchwordCodeChange(value){
    console.log(value);
    this.setState({
        broadcastContent:value
    })
}
save(){
    if(this.state.broadcastContent==''||this.state.broadcastContent==null){
        message.warning('广播内容不能为空');
        return false;
    }
    this.saveFn('SHELVES_OFF',this.state.broadcastContent);
}
saveLine(){
    if(this.state.broadcastContent==''||this.state.broadcastContent==null){
        message.warning('广播内容不能为空');
        return false;
    }
    this.saveFn('SHELVES_ON',this.state.broadcastContent);
}
async saveFn(shelvesFlag,broadcastContent) {
    var w = this;
    w.setState({
        loading:true
    })
    var data = await fetch(getUrl.url, {
        mode: "cors",
        method: "POST",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: "method=ella.operation.saveCourseBroadcast" + "&content=" + JSON.stringify({ "shelvesFlag": shelvesFlag,'broadcastContent':broadcastContent}) + commonData.dataString
    }).then(res => res.json())
        .then((d) => {
            console.log(d);
            w.setState({
                loading: false
            })
            if (d.status == '1') {
                this.fetchdata(this.state.searchInfo,this.state.searchType,this.state.shelvesFlag, this.state.page,this.state.pageSize);
                message.success('添加成功'); 
                this.setState({
                    visible:false,
                    broadcastContent:''
                })
            } else{
               message.error(d.message); 
               this.setState({
                visible:false,
                broadcastContent:''
            })
            }
        })
}
//修改课程广播
editShowModal = (broadcastCode,shelvesFlag,broadcastContent) => {
    this.setState({
      editVisible: true,
      broadcastCode:broadcastCode,
      shelvesFlag:shelvesFlag,
      editBroadcastContent:broadcastContent,
    });
  }
editCourseBroadcastChange(value){
    console.log(value);
    this.setState({
        editBroadcastContent:value
    })
}
async editFn(broadcastCode,shelvesFlag,broadcastContent) {
    var w = this;
    w.setState({
        loading:true
    })
    var data = await fetch(getUrl.url, {
        mode: "cors",
        method: "POST",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: "method=ella.operation.updateCourseBroadcast" + "&content=" + JSON.stringify({ 'broadcastCode':broadcastCode,"shelvesFlag": shelvesFlag,'broadcastContent':broadcastContent}) + commonData.dataString
    }).then(res => res.json())
        .then((d) => {
            console.log(d);
            w.setState({
                loading: false
            })
            if (d.status == '1') {
                this.fetchdata(this.state.searchInfo,this.state.searchType,this.state.shelvesFlag, this.state.page,this.state.pageSize);
                message.success('添加成功'); 
                this.setState({
                    editVisible:false
                })
            } else{
                message.error(d.message); 
                this.setState({
                    editVisible:false
                })
            }
        })
}
editSave(){
    console.log(this.state.shelvesFlag);
    if(this.state.editBroadcastContent==''||this.state.editBroadcastContent==null){
        message.warning('广播内容不能为空');
        return false;
    }
    this.editFn(this.state.broadcastCode,this.state.shelvesFlag,this.state.editBroadcastContent);
}
editSaveLine(){
    if(this.state.editBroadcastContent==''||this.state.editBroadcastContent==null){
        message.warning('广播内容不能为空');
        return false;
    }
    this.editFn(this.state.broadcastCode,'SHELVES_ON',this.state.editBroadcastContent);
}
//上下线一行
editList(broadcastCode,shelvesFlag,editBroadcastContent){
    var w = this;
    console.log(broadcastCode);
    console.log(shelvesFlag);
    console.log(editBroadcastContent);
    shelvesFlag=='SHELVES_OFF'?shelvesFlag='SHELVES_ON':shelvesFlag='SHELVES_OFF'
    confirm({
        title: '确定修改此条数据吗？',
        onOk() {
            w.setState({
                loading: true
            })
            w.editFn(broadcastCode,shelvesFlag,editBroadcastContent);
        },
        onCancel() { },
    })
}
//筛选条件
searchChange(value){
    console.log(value);
    this.setState({
        pageSize: 20,
        page: 0,
        current: 1
    },()=>{
        if(value=='SHELVES_OFF'){
            // value = 'ALL';
            // this.setState({
            //     shelvesFlag:'SHELVES_OFF'
            // },()=>{
            //     this.fetchdata(this.state.searchInfo,value,'SHELVES_OFF', this.state.page,this.state.pageSize);
            // })
            this.fetchdata(this.state.searchInfo,'ALL','SHELVES_OFF', this.state.page,this.state.pageSize);
            this.setState({
                shelvesFlag:'SHELVES_OFF'
            })
        }else if(value == 'ONLINE'){
            // this.setState({
            //     shelvesFlag:'SHELVES_ON'
            // },()=>{
            //     this.fetchdata(this.state.searchInfo,value,'SHELVES_ON', this.state.page,this.state.pageSize);
            // })
            this.fetchdata(this.state.searchInfo,value,'SHELVES_ON', this.state.page,this.state.pageSize);
            this.setState({
                shelvesFlag:'ONLINE'
            })
        }else{
            this.fetchdata(this.state.searchInfo,value,'', this.state.page,this.state.pageSize);
            this.setState({
                shelvesFlag:''
            })
        }
    })
    
}

	render(){
        var w = this;
        const title = {
            padding: "10px 0px",
            // lineHeight: "50px",
            borderBottom: "1px solid #e3e6e6",
            textIndent: "16px",
            fontSize: "16px",
            marginBottom:"0px"
        }
        const back = {
            paddingRight : "8px"
        }
        const box = {
          padding : "0px 20px 20px 20px"
        }
        const table_box = {
          margin : "0px 0px 0px 0px"
        }
        const font_color = {
          color:"#242424"
        }
        const button_warp = {
          padding: "30px 0px 0px 20px",
          // borderBottom : "1px solid #e3e6e6"
        }
	//////////////样式///////////////////	
        const columns = [
            {
              	title: '广播内容',
              	dataIndex: 'broadcastContent',
              	key: 'broadcastContent',
              	width: "20%",
              	className: "td_hide",
		        render: (text, record) =>{
		            return(
		                <Popover
		                    placement="top"
		                    title={null}
		                    content={
		                        record.broadcastContent
		                    }
		                >
		                    <span>{record.broadcastContent}</span>
		                </Popover>
		            )
		        }
            }, {
              title: '添加时间',
              dataIndex: 'createTime',
              key: 'createTime',
              width: "20%",
            }, {
              title: '状态',
              dataIndex: 'status',
              key: 'status',
              width : "20%"
            },{
                title: '状态操作',
                dataIndex: 'statusFlag',
                key: 'statusFlag',
                width : "20%",
                render: (text, record, index) => <a onClick={() => w.editList(record.broadcastCode,record.shelvesFlag,record.broadcastContent)}>{record.statusFlag}</a>
            },{
                title: '操作',
                dataIndex: 'edit',
                width: "20%",
                render: (text, record) => {
                    return (
                        <div>
                            <span className='i-action-ico i-edit' style={{ paddingLeft: 4 }} onClick={() => w.editShowModal(record.broadcastCode,record.shelvesFlag,record.broadcastContent)}></span>
                            <span className='i-action-ico i-delete' style={{ paddingLeft: 4,marginLeft:20 }} onClick={() => w.deleteList(record.broadcastCode)}></span>
                        </div>
                    )
                },
            }
        ];
        const allData = this.state.allData;   //全部初始数据
        const onlineData = this.state.onlineData;           //上线初始数据
		return <div className="classradio">
			<p style={title}>课程广播管理</p>
            <div>
                <Button type="primary" icon="plus" className="add-active-btn intervalRight" onClick={this.showModal}>添加新课程广播</Button>
                <Select defaultValue="ALL" className="intervalRight selectWidth" onChange={(value) => this.searchChange(value)}>
                    <Option value="ALL">全部</Option>
                    <Option value="ONLINE">已展示</Option>
                    <Option value="SHELVES_OFF">未展示</Option>
                </Select>
                <Search placeholder="搜索" enterButton className="searchWidth" onSearch={(value) => { this.searchContent(value) }} />
            </div>
        	<div style={box}>
                <Tabs defaultActiveKey="1">
                    <TabPane type="line" tab='上线广播' key="1">
                        <div style={table_box}>
                            <Spin tip="加载中..." spinning={this.state.loading} size="large" style={{zIndex:9999}}>
                                <Table className="m-sign-table t-nm-tab" columns={columns} dataSource={onlineData} pagination={false} scroll={{ y: (this.state.pageLength > 12) ? '580' : 0 }}/>
                            </Spin>
                    </div>
                    </TabPane>
                    <TabPane type="line" tab='全部广播' key="2">
                        <div style={table_box}>
                            <Spin tip="加载中..." spinning={this.state.loading} size="large" style={{zIndex:9999}}>
                                <Table className="m-sign-table t-nm-tab" columns={columns} dataSource={allData} pagination={false} scroll={{ y: (this.state.pageLength > 12) ? '580' : 0 }}/>
                            </Spin>
                        </div>
                        <div className="m-pagination-box">
                            <Pagination hideOnSinglePage pageSizeOptions={['20', '40', '60', '80', '100']} showSizeChanger showQuickJumper showTotal={total => `共 ${total} 条`} className="m-pagination" defaultPageSize={20} defaultCurrent={1} current={this.state.current} total={this.state.pageMax} onChange={this.pageChangeFun} onShowSizeChange={this.pageSizeFun} />
                        </div>
                    </TabPane>
                </Tabs>
                <Modal
                    visible={this.state.visible}
                    title='课程广播内容编辑'
                    onCancel={this.handleCancel}
                    footer={null}
                >
                    <Row className='m-reward-box'>
                        <Col span={2} style={{ width: 60,textAlign:'right',marginRight:20 }}>
                            <span className='u-txt'>广播内容</span>
                        </Col>
                        <Col span={19}>
                            <Input onChange={(e) => this.watchwordCodeChange(e.target.value)} value={this.state.broadcastContent} maxLength={20}/>
                        </Col>
                    </Row>
                    <Row className='m-reward-box' style={{marginTop:30}}>
                        <Col span={12}><Button type='primary' onClick={()=>{this.save()}}>保存</Button></Col> 
                        <Col span={12}><Button type='primary' onClick={()=>{this.saveLine()}}>保存并上线</Button></Col> 
                    </Row>
                </Modal>
                <Modal
                    visible={this.state.editVisible}
                    title='课程广播内容编辑'
                    onCancel={this.handleCancel}
                    footer={null}
                >
                    <Row className='m-reward-box'>
                        <Col span={2} style={{ width: 60,textAlign:'right',marginRight:20 }}>
                            <span className='u-txt'>广播内容</span>
                        </Col>
                        <Col span={19}>
                            <Input onChange={(e) => this.editCourseBroadcastChange(e.target.value)} value={this.state.editBroadcastContent} maxLength={20}/>
                        </Col>
                    </Row>
                    <Row className='m-reward-box' style={{marginTop:30}}>
                        <Col span={12}><Button type='primary' onClick={()=>{this.editSave()}}>保存</Button></Col> 
                        <Col span={12}><Button type='primary' onClick={()=>{this.editSaveLine()}}>保存并上线</Button></Col> 
                    </Row>
                </Modal>
        	</div>
		</div>
	}
}
