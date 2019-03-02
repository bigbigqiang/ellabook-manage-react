
import React from 'react'
import { Spin, message, Icon, Button, Input,Table,Upload} from 'antd'
import "./AutoTransfer.css"
import getUrl from "../util.js"
import { dataString } from '../commonData.js'
const Search = Input.Search;
export default class AutoTransfer extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
        	loading:false,
        	tableData1:[],
			tableData2:[],
			allTaskData:[],
        	tloading1:false,
			tloading2:false,
			searchName1:'',
			searchName2:'',

        }
    }
    componentWillMount(){
    	this.getDataList();
    }
    getDataList(){
		getUrl.API({taskName:""},"ella.operation.getNoTaskWallOfTasks")
		.then(response=>response.json())
		.then(response=>{
			if(response.status==1){
				this.setState({ 
					tableData1:JSON.parse(JSON.stringify(response.data)),
					allTaskData:JSON.parse(JSON.stringify(response.data)),
					tloading1:false,
					loading:false,
			    });
			}else{
				console.log(message.error)
			}
		})
    	
    }
    
    //增、删 任务列表
    setTransfer(taskCode,type){
    	let oldArr1 = this.state.tableData1,
    		oldArr2 = this.state.tableData2;
    	
    	//添加
    	if(type == "in"){
    		//新列表中增加
		    oldArr2.push(oldArr1.find(item=>item.taskCode==taskCode));
		    
	    	//删除原列表
	    	oldArr1=oldArr1.filter(item=>item.taskCode!=taskCode)
    	}else if(type == "out"){		//取消
    		//新列表中增加
		    oldArr1.push(oldArr2.find(item=>item.taskCode==taskCode));
		    
	    	//删除原列表
	    	oldArr2=oldArr2.filter(item=>item.taskCode!=taskCode)
    	}
		console.log(oldArr1)
		console.log(oldArr2)
	    this.setState({ 
	    	tableData1:oldArr1,
	    	tableData2:oldArr2
	    });
    }
    //全部添加,添加的是页面上展示的
    allSend(){
		let toAddList=this.state.tableData1.filter(item=>item.taskName.indexOf(this.state.searchName1)!=-1)
		let restList=this.state.tableData1.filter(item=>item.taskName.indexOf(this.state.searchName1)==-1)
		let tableData2=this.state.tableData2.concat(toAddList);
    	this.setState({ 
	    	tableData1:restList,
	    	tableData2,
	    });	
    }
	//全部取消，取消的是页面上展示的
    allCansel(){
    	let toAddList=this.state.tableData2.filter(item=>item.taskName.indexOf(this.state.searchName2)!=-1)
		let restList=this.state.tableData2.filter(item=>item.taskName.indexOf(this.state.searchName2)==-1)
		let tableData1=this.state.tableData1.concat(toAddList);
    	this.setState({ 
	    	tableData1,
	    	tableData2:restList
	    },()=>{
			console.log(this.state)
		});	
    }
    
    //开始推送
    addTaskList(){
    	this.props.handleOk(this.state.tableData2)
	}
	//搜索后设置数据
    setSearchData(value,searchName){
		// console.log(value);
		// var allTaskData=this.state.allTaskData;
		// var tableData1=this.state.tableData1;
		// var tableData2=this.state.tableData2;
		// if(searchName=="searchName1"){
		// 	var curData= allTaskData.filter(item => {
		// 		return !tableData2.find(_item => _item.taskName== item.taskName)
		// 	}).filter(item2=>item2.taskName.indexOf(value)!=-1)
		// 	console.log(curData)
		// 	this.setState({
		// 		tableData1:curData
		// 	})
		// }else{
		// 	var curData= allTaskData.filter(item => {
		// 		return !tableData1.find(_item => _item.taskName== item.taskName)
		// 	}).filter(item2=>item2.taskName.indexOf(value)!=-1)
		// 	console.log(curData)
		// 	this.setState({
		// 		tableData2:curData
		// 	})
		// }
		this.setState({
			[searchName]:value
		},()=>{
			console.log(this.state)
		})
	}
    render(){
    	var thisTrue = this;
    	const columns1 = [
    		{
                title: '任务名称',
                dataIndex: 'taskName',
                width: 180
            },{
                title: '任务类型',
                dataIndex: 'taskType',
				width: 180,
				render: (taskType) => {
                    return <span>{taskType == "ACTIVE_TASK" ?"活跃任务":taskType == "READ_TASK" ?"阅读任务":taskType == "PAID_BEHAVIOR_TASK"?"付费行为":taskType == "SOCIAL_PROPAGATE"?"社交传播":"-"}</span>
                }
            },{
                title: '循环周期',
                dataIndex: 'cycleTime',
				width: 180,
				render:(text,record)=>{
					return <span>{record.cycleTime==1?"日循环":(record.cycleTime>1?record.cycleTime:"-")}</span>
				}
            },{
                title: '操作',
                dataIndex: '',
                width: 80,
                render(text, record,index) {
                    return(
                        <div>
                            <Icon style={{fontSize:"18px"}} onClick={()=>thisTrue.setTransfer(record.taskCode,"in")} type="plus-circle" />
                        </div>
                    )
                }
            }
    	];
    	const columns2 = [
    		{
                title: '任务名称',
                dataIndex: 'taskName',
                width: 180
			},{
                title: '操作',
                dataIndex: '',
                width: 80,
                render(text, record,index) {
                    return(
                        <div>
                            <Icon style={{fontSize:"18px"}} onClick={()=>thisTrue.setTransfer(record.taskCode,"out")} type="close-circle" />
                        </div>
                    )
                }
            }
    	];
		return (
			<div className="autoTransfer">
				<Spin spinning={this.state.loading} size="large">
					<div className="transferLeft">
						<Search placeholder="搜索"
							style={{"width":"350px"}}
							enterButton 
							className="intervalRight intervalBottom"
							onSearch={(value) =>this.setSearchData(value,"searchName1")} 
						/>
						<Table loading={this.state.tloading1} className="m-book-table t-nm-tab" columns={columns1} 
							dataSource={
								this.state.tableData1.filter(item=>item.taskName.indexOf(this.state.searchName1)!=-1)
							} 
							bordered pagination={false} scroll={{y: 300 }} 
						/>
					</div>
					<div className="transferCenter">
						<div className="transferAllOk" onClick={()=>this.allSend()}>全部添加</div>
						<div className="transferAllNo" onClick={()=>this.allCansel()}>全部取消</div>
					</div>
					<div className="transferRight">
						<Search placeholder="搜索" 
							enterButton 
							className="intervalRight intervalBottom"  
							style={{"width":"350px"}}
							onSearch={(value) =>this.setSearchData(value,"searchName2")} 
						/>
						<Table loading={this.state.tloading2} className="m-book-table t-nm-tab" columns={columns2} 
							dataSource={
								this.state.tableData2.filter(item=>item.taskName.indexOf(this.state.searchName2)!=-1)
							}  
							bordered pagination={false} scroll={{y: 300 }} 
						/>
					</div>
					<div className="transferSaves" onClick={()=>this.addTaskList()}>添加</div>
				</Spin>
			</div>
		);
	}
}
