
import React from 'react'
import { Table,Button,Modal,Spin,Layout,Input} from 'antd'
import 'whatwg-fetch'
import $ from "jquery";
const Search = Input.Search;
const {Footer } = Layout;
var util = require('../util.js');

class AddListenModal extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
            loading: false,
            selectedRowKeys: [],
            selectedRows:[],
			allselectskey:[],
            allselectsData:[],
            listenResourceList:[],
            total:'',
            currentPage: 1,
            page:0,
            pageSize:20,
            showQuickJumper: false,
            audioName:""
			
		}
	}

    fetchDataList(audioName,page) {
        this.setState({
            loading: true
        })
        var doc={
            page:page+1,
            pageSize:this.state.pageSize,
            audioCode: null,
            audioName,
            startTime: null,
            endTime:  null,
            goodsState:null,
            pushHome: null,
            isShelves:true
        }
        util.API(doc,"ella.operation.bookAudioList")
        .then(response=>response.json())
        .then(response=>{
            if(response.status==1){
                this.setState({
                    listenResourceList: response.data.list,
                    total: response.data.total,
                    currentPage: response.data.currentPage-1,
                    loading:false
                },()=>{
                    if(response.data.list.length!=0){
            			$('.ant-table-thead .ant-checkbox-wrapper').css({'display':'block'})
            			$('#quanxuan').css({'display':'block'})
	            	}else{
	            		$('.ant-table-thead .ant-checkbox-wrapper').css({'display':'none'})
	            		$('#quanxuan').css({'display':'none'})
	            		
	            	}
                })
            }else{
                message.error(response.message)
            }
        })
    }
    handleOk = () => {
        this.props.handleOk(this.state.allselectskey,this.state.allselectsData);
        this.setState({
            listenResourceList: [],
            selectedRowKeys:[],
            selectedRows:[],
            allselectskey:[],
            allselectsData:[],
            currentPage:1
        })
    }
    handleCancel = () => {
        this.props.modelCancle(false);
        this.setState({
            selectedRowKeys:[],
            selectedRows:[],
            allselectskey:[],
            allselectsData:[]
        })
    }
    changePage(pagination){
        console.log(pagination)
        this.setState({
            page:pagination.current-1
        },()=>{
            this.fetchDataList(this.state.audioName,this.state.page)
        })
        
    }
	
	render() {
        const columns = [
            {
                 title: '音频名称',
                 dataIndex: 'audioName',
                 key: 'audioName',
                 width: "33.3%",
                
             }, {
                 title: '关联图书',
                 dataIndex: 'bookName',
                 key: 'bookName',
                 width: "33.3%",
                 
             }, {
                 title: '图书状态',
                 dataIndex: 'goodsState',
                 key: 'goodsState',
                 width: "33.3%",
               
             }
        ]
        const { selectedRowKeys} = this.state
       
        const rowSelection= {
            selectedRowKeys,
            onChange: (selectedRowKeys, selectedRows)=>{
            	this.setState({
            		selectedRowKeys,
            		selectedRows
            	})
            },
            onSelect:(record, selected, selectedRows, nativeEvent)=>{
            	var curKays=this.state.allselectskey;
            	var curdata=this.state.allselectsData;
            	if(selected==true){
            		curKays.push(record[this.props.rowKey]);
            		curdata.push(record);
            		
            	}else{
            		let _this=this;
            		curKays.forEach(function (item, index) {
            			if(item==record[_this.props.rowKey]){
            				
            				curKays.splice(index,1)
            			}
					  	
					});
					curdata.forEach(function (item, index) {
						if(item[_this.props.rowKey]==record[_this.props.rowKey]){
							curdata.splice(index,1)
						}
					  	
					});
            		
            	}
            	this.setState({
            		allselectskey:curKays,
            		allselectsData:curdata
            	})
            	
            },
            onSelectAll:(selected, selectedRows, changeRows)=>{
            	var curKays=this.state.allselectskey;
            	var curdata=this.state.allselectsData;
            	if(selected==true){
            		for(var i=0;i<changeRows.length;i++){
            			curKays.push(changeRows[i][this.props.rowKey]);
            		}
            		
            		curdata.push(...changeRows);
            		
            	}else{
            		for(var i=0;i<curKays.length;i++){
            			var index=i; 
            			for(var j=0;j<changeRows.length;j++){
            				if(curKays[index]==changeRows[j][this.props.rowKey]){
            					curKays.splice(index,1)
            					i--;
            					break;
            				}
            			}
            		}
            		for(var i=0;i<curdata.length;i++){
            			
            			for(var j=0;j<changeRows.length;j++){
            				if(curdata[i][this.props.rowKey]==changeRows[j][this.props.rowKey]){
            					curdata.splice(i,1);
            					i--;
            					break;
            				}
            			}
            		}
            		
            	}
            	this.setState({
            		allselectskey:curKays,
            		allselectsData:curdata
            	})
          		
            }
            
        }
        const pagination = {
            showQuickJumper: this.state.showQuickJumper,
            total: this.state.total,
            defaultPageSize:20,
            defaultCurrent:this.state.currentPage,
            current:this.state.currentPage,
            onChange:function(){
          		
            }
        }
        return   <Modal
            className="addModal"
            style={{ top: 0 }}
            visible={this.props.visible}
            title="添加听书"
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            wrapClassName="th-bg"

            footer={null}
       >
            <Search 
                placeholder="搜索" 
                enterButton 
                style={{ width: 400,"marginBottom":"20px"}} 
                className="intervalRight" 
                value={this.state.audioName} 
                onChange={(e)=>this.setState({audioName:e.target.value})} 
                onSearch={value=> this.fetchDataList(value,0)} 
            />
            <Spin tip="加载中..." spinning={this.state.loading} size="large" style={{ zIndex: 9999 }}>
                <Table
                    rowKey="audioCode"
                    rowSelection={rowSelection}
                    columns={columns}
                    dataSource={this.state.listenResourceList}
                    pagination={pagination}
                    onChange={(pagination)=>this.changePage(pagination)}
                    bordered
                    scroll={{ y: (this.state.listenResourceList.length > 7? 350 : 0) }}
                />
            </Spin>
            <div style={{"position":"absolute",left: "70px",bottom: "96px"}} id="quanxuan">
                <span>全选</span>
                <span><span>{this.state.allselectskey.length}</span>/<span>{this.state.total}</span></span>
            </div>          
            <Footer style={{"text-align":"center"}}>
                <Button type="primary"  key="submit" onClick={this.handleOk} disabled={this.state.allselectskey.length!=0?false:true}>添加</Button>
            </Footer>
           
        </Modal>

		
	}
}
export default AddListenModal