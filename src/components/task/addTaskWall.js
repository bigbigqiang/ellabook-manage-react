import React from 'react'
import { Link,hashHistory} from 'react-router'
import { Form, Input, Row, Col, Button, Select,Table, Icon, message, Modal,Popconfirm,Popover,Spin} from 'antd';
import './addTaskWall.css';
import AutoTransfer from "./AutoTransfer.js";
var util = require('../util.js');
const FormItem = Form.Item;
const Option = Select.Option;
class addTaskWall extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            visible:false,
            status: this.props.params.status,
            taskWallCode: this.props.params.taskWallCode,
            taskWallList:[],
            taskWallName:'',
            shelvesFlag:'',//任务上下架
            loading:false
        }

    }
    
    componentDidMount() {
        if(this.state.status=="edit"){
            this.fethTaskWallDetail()
        }
    }
    //任务墙详情数据
    fethTaskWallDetail(){
        util.API({taskWallCode:this.state.taskWallCode},"ella.operation.getOperationTaskWallInfo")
		.then(response=>response.json())
		.then(response=>{
			if(response.status==1){

				this.setState({
					taskWallList:response.data.taskList,
                    taskWallName:response.data.taskWallName,
                    shelvesFlag:response.data.shelvesFlag
				})
				
			}else{
				message.error(response.message)
			}
		})
    }
    handleOk = (addTaskData) => {

        
        var newDataSoure = this.state.taskWallList;
        newDataSoure.push(...addTaskData);
        //去重,遇到重复的书籍自动去重
        var hash = {};
        newDataSoure = newDataSoure.reduce(function (item, next) {
            hash[next.taskCode] ? '' : hash[next.taskCode] = true && item.push(next);
            return item
        }, []);
        console.log(newDataSoure)
        this.setState({
            visible: false,
            taskWallList:newDataSoure,
            
        })
    }
    arrowDelete = (key) => {
        var data = this.state.taskWallList.filter(item => {
            if(item.taskCode !== key.taskCode){
                return item
            }
        });
        this.setState({
            taskWallList: data
            
        })
    }
    //添加任务墙
    saveTaskWall(type){
        if(this.state.taskWallName.length>10||this.state.taskWallName.length==0){
            message.error("列表标题限制为1~10个中文字符！");
            return;
        }
        if(this.state.taskWallList.length==0){
            message.error("请添加任务列表");
            return;
        }
        var doc={
            taskWallName:this.state.taskWallName,
            taskCodes:this.state.taskWallList.map((item)=>item.taskCode)
        }
       
        if(this.state.status=="edit"){
            doc.taskWallCode=this.state.taskWallCode;
            doc.shelvesFlag=this.state.shelvesFlag;
        }
        if(type==2){
            doc.shelvesFlag="SHELVES_ON";
        }
        this.setState({
            loading:true
        })
        util.API(doc,"ella.operation.saveOperationTaskWall")
		.then(response=>response.json())
		.then(response=>{
			if(response.status==1){
                message.success("保存成功！")
                if(this.state.status=="add"){
                    setTimeout(() => {
                        this.setState({
                            loading:false
                        })
                        hashHistory.push('/taskWall');
                    }, 1000)
                }else{
                    this.setState({
                        loading:false
                    })
                }
				
			}else{
				message.error(response.message)
			}
		})
    }
    render() {
        const formItemLayout = {
            labelCol: { span: 2 },
            wrapperCol: { span: 22 },
        };
        const style = { marginBottom: '20px', borderBottom: "1px solid #ccc", paddingBottom: '10px' }
        console.log(this.state.taskWallList)
        var columns=[
            {
                title: '任务ID',
                width: "15%",
                dataIndex: 'taskCode',
                key: 'taskCode',
                render: (taskCode) => {
                    return <Popover
                        placement="top"
                        title={null}
                        content={
                            taskCode
                        }
                    >
                        <span>{taskCode}</span>
                    </Popover>
                }
            },{
                title: '任务名称',
                width: "10%",
                dataIndex: 'taskName',
                key: 'taskName',
            },  {
                title: '有效时间',
                width: "15%",
                render: (text, record) => {
                    return record.startTime+" ~ "+record.endTime;
                }
            },
            {
                title: '展示状态',
                width: "10%",
                dataIndex: 'showFlag',
                render: (showFlag) => {
                    return <span>{showFlag == "SHOW_ON"?"已展示":showFlag == "SHOW_OFF" ?"未展示":showFlag == "SHOW_WAIT"?"待展示":showFlag == "SHOW_UNSHELVE"?"发布后移除":"-"}</span>
                }
            },
            {
                title: '任务状态',
                width: "10%",
                dataIndex: 'expireStatus',
                render: (expireStatus) => {
                    return <span>{expireStatus == "EXPIRED_YES"?"已过期":expireStatus == "EXPIRED_NO" ?"未过期":"-"}</span>
                }
            },  
            {
                title: '循环周期',
                dataIndex: 'cycleTime',
                key: 'cycleTime',
				width: "10%",
				render:(text,record)=>{
					return <span>{record.cycleTime==1?"日循环":(record.cycleTime>1?record.cycleTime:"-")}</span>
				}
            }, {
                title: '任务类型',
                width: "10%",
                dataIndex: 'taskType',
                render: (taskType) => {
                    return <span>{taskType == "ACTIVE_TASK" ?"活跃任务":taskType == "READ_TASK" ?"阅读任务":taskType == "PAID_BEHAVIOR_TASK"?"付费行为":taskType == "SOCIAL_PROPAGATE"?"社交传播":"-"}</span>


                }
            }, 
            {
                title: '奖励内容',
                width: "10%",
                dataIndex: 'rewardType',
                key: 'rewardType',
                render: (rewardType) => {
                    return <span>{rewardType=="BOOK"?"图书":rewardType=="VIP"?"会员":rewardType=="COUPON"?"红包":rewardType=="POINT"?"积分":"-"}</span>
                    
                }
            },
            {
                title: '操作',
                width: "10%",
                key: 'action',
                render: (text, record, index) => {
                    return (
                        <div>
                            <Popconfirm title="确定删除吗?" onConfirm={() => {
                                this.arrowDelete(record)
                            }}>
                                <i className="i-action-ico i-delete" ></i>
                            </Popconfirm>
                        </div>
                    )
                }
            }
        ]
        return (
            <div id="addTaskWall" style={{ padding: "10px 10px 0" }}>
                <Row style={style}>
                    <Link to={'/taskWall'} style={{ color: "#666" }}>
                        <Col span={4} style={{ fontSize: "16px" }}>
                            <Icon type="left" />
                            {this.state.status=="add"?"添加新的任务列表":"编辑新的任务列表"}
                        </Col>
                    </Link>
                </Row>
                <Spin spinning={this.state.loading}>
                <Form horizontal>
                    <Row>
                        <Col>
                            <FormItem
                                {...formItemLayout}
                                label="列表标题"
                            >
                                <Input style={{ width: '15%' }} value={this.state.taskWallName} onChange={(e) =>this.setState({"taskWallName":e.target.value})}/>  
                            </FormItem>
                        </Col>
                    </Row>
                   	<div id="offsetCol">
		                <Row>
		                <Col offset={1} style={{ marginRight: '3.16667%' }}>
		                	<div data-page="addModal">
				                <Row style={{ background: "#23B8E6", padding: '0 20px', borderRadius: "6px 6px 0 0", lineHeight: '50px', height: '50px' }}>
				                    <Col style={{ fontSize: '14px', color: "#fff", float: 'left' }}>任务列表</Col>
				                    <Col style={{ float: 'right' }}>
				                        <Col style={{ float: 'left', marginRight: '10px' }}>
				                            <Button type="primary" className="ant-btn-add" icon="plus" onClick={()=>this.setState({"visible":true})}>添加任务</Button>
                                            <Modal
                                                title="添加任务"
                                                visible={this.state.visible}
                                                onOk={() =>this.setState({visible:false})}
                                                onCancel={()=>this.setState({visible:false})}
                                                width="1000px"
                                                footer={null}
                                                closable
                                                okText=""
                                                cancelText=""
                                            >

                                                {this.state.visible&&<AutoTransfer handleOk={(addTaskData)=>this.handleOk(addTaskData)}/>}
                                            </Modal>
				                
				                        </Col>
				                        <Col style={{ float: 'left' }}>
				                            <Button type="primary" icon="delete" className="ant-btn-add" onClick={()=>this.setState({taskWallList:[]})}>清空列表</Button>
				                        </Col>
				                    </Col>
				                </Row>
				                <Table columns={columns} dataSource={this.state.taskWallList} pagination={false} scroll={{ y: (this.state.taskWallList.length > 11 ? 450 : 0) }} />
				            </div>
		                    </Col>
		                </Row>
			        </div>
                    <FormItem wrapperCol={{ span: 24}} style={{ "marginTop": "24px","textAlign":"center" }}>
                        <Button type="primary" onClick={() => { this.saveTaskWall(1) }} className="buttonWidth" style={{"marginRight":"30px"}}>保存</Button>
                        <Button type="primary" onClick={() => { this.saveTaskWall(2) }} className="buttonWidth">保存并上线</Button>
                    </FormItem>
                    {/* <div style={{ margin: '20px 0', textAlign: 'center' }}>
                        <Button className="ant-btn-blue" type="primary" htmlType="submit" >保存</Button>
                    </div> */}
                </Form>
                </Spin>
            </div>
        )
    }
}


addTaskWall= Form.create()(addTaskWall)

export default addTaskWall;

