/*
 	created by NiePengfei at 20187/3/13
 		图书——图书——批量推送到家园、图书馆
 */
import React from 'react'
import { Spin, message, Icon, Button, Input,Table,Upload} from 'antd'
import "./sendBook.css"
import getUrl from "../util.js"
import { dataString } from '../commonData.js'

export default class SendBook extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
        	loading:false,
        	tableData1:[],
        	tableData2:[],
        	tloading1:false,
        	tloading2:false
        }
    }
    
    //即将插入本组件时，开始请求数据，准备渲染
    componentWillMount(){
    	this.getAllSendBook(0,3000);
    }
    
    //虚拟dom变成真实dom之后，开始绑定事件
    componentDidMount(){
    } 
    getAllSendBook(pageNow,pageSize){
    	let thisTrue = this;
    	thisTrue.setState({ 
	    	tloading1:true
	    });
    	fetch(getUrl.url, {
			method: "POST",
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: "method=ella.operation.getHomeBookList" + "&content=" + JSON.stringify({
				"homeStatus":"NO",
				"pageVo":{
					"page":pageNow,
					"pageSize":pageSize
				}
			})+dataString
		})
		.then(function(response){
			console.log(response);
			return response.json();
		})
		.then(function(response){
			console.log(response);
			
			if(response.status == "1"){
				let newArr=[];
				response.data.homeBookList.map(function(item){
					newArr.push({"bookName":item.bookName,"bookCode":item.bookCode});
				})
				thisTrue.setState({ 
			    	tableData1:newArr,
			    	tloading1:false
			    });
			}
		})
    }
    
    //增、删 推送书籍
    setSend(index,type){
    	let oldArr1 = this.state.tableData1,
    		oldArr2 = this.state.tableData2;
    	
    	//添加
    	if(type == "in"){
    		//新列表中增加
		    oldArr2.push(oldArr1[index]);
		    
	    	//删除原列表
	    	oldArr1.splice(index,1);
    	}else if(type == "out"){		//取消
    		//新列表中增加
		    oldArr1.push(oldArr2[index]);
		    
	    	//删除原列表
	    	oldArr2.splice(index,1);
    	}
    	
	    this.setState({ 
	    	tableData1:oldArr1,
	    	tableData2:oldArr2
	    });
    }
    //全部添加
    allSend(){
    	let oldArr1 = this.state.tableData1,
    		oldArr2 = this.state.tableData2;
    		oldArr2 = oldArr2.concat(oldArr1);
    	this.setState({ 
	    	tableData1:[],
	    	tableData2:oldArr2
	    });	
    }
    //全部取消
    allConsole(){
    	let oldArr1 = this.state.tableData1,
    		oldArr2 = this.state.tableData2;
    		oldArr1 = oldArr1.concat(oldArr2);
    	this.setState({ 
	    	tableData1:oldArr1,
	    	tableData2:[]
	    });
    }
    
    //开始推送
    sendBook(){
    	let thisTrue = this;
    	
    	this.setState({ 
	    	loading:true
	    });
    	
    	let sendCode = this.state.tableData2.map(function(item){
    		return item.bookCode
    	})
    	
    	fetch(getUrl.url, {
			method: "POST",
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: "method=ella.operation.updateHomeStatus" + "&content=" + JSON.stringify({
				"homeStatus":"YES",
				"bookCodeList":sendCode
			})+dataString
		})
		.then(function(response){
			console.log(response);
			return response.json();
		})
		.then(function(response){
			console.log(response);
			if(response.status == "1"){
				thisTrue.getAllSendBook(0,3000);
				thisTrue.setState({ 
			    	loading:false,
			    	tableData2:[]
			    });
			    message.success("推送成功");
			}else{
				thisTrue.setState({ 
			    	loading:false
			    });
			    message.error("推送失败");
			}
		})
    }
    
    render(){
    	var thisTrue = this;
    	const columns1 = [
    		{
                title: '图书名称',
                dataIndex: 'bookName',
                width: 180
            },{
                title: '操作',
                dataIndex: '',
                width: 80,
                render(text, record,index) {
                    return(
                        <div>
                            <Icon style={{fontSize:"18px"}} onClick={()=>thisTrue.setSend(index,"in")} type="plus-circle" />
                        </div>
                    )
                }
            }
    	];
    	const columns2 = [
    		{
                title: '图书名称',
                dataIndex: 'bookName',
                width: 180
            },{
                title: '操作',
                dataIndex: '',
                width: 80,
                render(text, record,index) {
                    return(
                        <div>
                            <Icon style={{fontSize:"18px"}} onClick={()=>thisTrue.setSend(index,"out")} type="close-circle" />
                        </div>
                    )
                }
            }
    	];
		return (
			<div className="sendBook">
				<Spin spinning={this.state.loading} size="large">
					<div className="sendLeft">
						<Table loading={this.state.tloading1} className="m-book-table t-nm-tab" columns={columns1} dataSource={this.state.tableData1} bordered pagination={false} scroll={{y: 480 }} />
					</div>
					<div className="sendCenter">
						<div className="sendAllOk" onClick={()=>this.allSend()}>全部推送</div>
						<div className="sendAllNo" onClick={()=>this.allConsole()}>全部取消 </div>
					</div>
					<div className="sendRight">
						<Table loading={this.state.tloading2} className="m-book-table t-nm-tab" columns={columns2} dataSource={this.state.tableData2} bordered pagination={false} scroll={{y: 480 }} />
					</div>
					<div className="sendSaves" onClick={()=>this.sendBook()}>保存</div>
				</Spin>
			</div>
		);
	}
}
