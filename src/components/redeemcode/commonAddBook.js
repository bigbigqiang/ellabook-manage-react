import React from 'react'
import { Form, Input, Row, Col, Button, Select, Radio, Table,message, Modal,Layout,DatePicker,Spin } from 'antd';
import 'whatwg-fetch';
import moment from 'moment';
import $ from "jquery";
import { dataString } from '../commonData.js'
var util = require('../util.js');
const Option = Select.Option;
const Search = Input.Search;
const { Content, Sider,Footer } = Layout;

class CommonAddBook extends React.Component {
    constructor(props) {
        super(props)
         this.state = {
            loading: false,
            visible: false,
            bookData: [],
            total: '',
            selectedRowKeys:[],
            selectedRows:[],
            searchContent:'',
            pageIndex:1,
        }
    }
    focus = (name, type, listStr) => {
        this.bookResultItem(name, type, listStr);
    }
 
    
 	 handleOk = () => {
        console.log(this.state.selectedRowKeys)
        console.log(this.state.selectedRows)
       	this.props.handleOk(this.state.selectedRowKeys,this.state.selectedRows);
       
        this.setState({
            bookData: [],
            selectedRowKeys:[],
            selectedRows:[],
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
    getInitList(){
    	
    	this.bookListFn('');
    }
	bookListFn(searchContent) {
        this.setState({
            loading: true
        })
        var doc={
            "activityType":"H5",
            searchContent,
            "pageIndex":1,
            "pageSize":1000,
            "status":"START"
        }
        util.API(doc,"ella.operation.sendBook.selectSendBookActivityListByActivityType")
        .then(response=>response.json())
        .then(response=>{

            if(response.status==1){
    
                 this.setState({
                    total: response.data.count,
                    bookData: response.data.sendBookActivityList,
                    listLength: response.data.sendBookActivityList.length,
                    loading: false
	              
	            })
        
                
            }else{
                message.error(response.message)
            }
        })
       

    }
    render() {
    	
       	const columns2=[  
            {
                title: '活动名称',
                width: 150,
                dataIndex: 'activityName',
            }, 
            {
                title: '活动编码',
                width: 150,
                dataIndex: 'activityCode',
            } 
          
        ]
        const { selectedRowKeys,selectedRows } = this.state
       
        const rowSelection2 = {
            selectedRowKeys,
            type: 'radio',
            onChange: (selectedRowKeys, selectedRows)=>{
                console.log(selectedRowKeys)
                console.log(selectedRows)
            	this.setState({
            		selectedRowKeys,
            		selectedRows
            	})
            }
        }
        const pagination = {
            showSizeChanger: true,
            showQuickJumper: true,
            defaultPageSize: 20,
            pageSizeOptions: ['20', '40', '60', '80', '100'],
            showTotal: () => { return `共 ${this.state.listLength} 条` },
            onChange:()=>{
                this.setState({
            		selectedRowKeys:[],
            		selectedRows:[]
            	})
            }
        }  
       

        
        return (
            <Modal
                className="addModal"
                style={{ top: 0 }}
                visible={this.props.visible}
                title="添加图书"
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                wrapClassName="th-bg"

                footer={null}
               >
            		<Layout>
                    	<Content style={{ background: '#fff', margin: 0, minHeight: 408 }}>
                            <div id="addNewBook" style={{ padding: "0px 0 0 20px","position":"relative" }}>
                                <Row style={{ marginBottom: 16 }} align='middle'>
                                    <Col>
                                        <Search placeholder="搜索" style={{"width":300}} 
                                            enterButton 
                                            onBlur={(e) =>this.setState({"searchContent":e.target.value})} 
                                            onPressEnter={(e) => {
                                                this.setState({"searchContent":e.target.value},()=>{
                                                    this.bookListFn(this.state.searchContent)
                                                })
                                                  
                                            }} 
                                            onSearch={() => { this.bookListFn(this.state.searchContent) }}/>
                                    </Col>
                                </Row>
                                <Spin tip="加载中..." spinning={this.state.loading} size="large" style={{ zIndex: 9999 }}>
	                                <Table
	                                	rowKey={this.props.rowKey}
	                                	rowSelection={rowSelection2}
	                                    columns={columns2}
	                                    dataSource={this.state.bookData}
	                                    pagination={pagination}
	                                   
	                                    bordered
	                                    scroll={{ y: (this.state.bookData.length > 7? 350 : 0) }}
	                                />
                                </Spin>
                            
                            </div>
                        </Content>
                        <Footer style={{"text-align":"center"}}>
                        	<Button type="primary"  key="submit" onClick={this.handleOk} disabled={this.state.selectedRowKeys.length!=0?false:true}>添加</Button>
                        </Footer>
                    </Layout>
            </Modal>
        )
    }
}
export {CommonAddBook};



