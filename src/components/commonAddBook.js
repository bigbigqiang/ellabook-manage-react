import React from 'react'
import { Link, hashHistory } from 'react-router'
import { Form, Input, Row, Col, Button, Select, Radio, Table, Icon, message, Modal, Checkbox, Tooltip, Popconfirm,Layout,DatePicker,Spin } from 'antd';
import getUrl from './util';
import 'whatwg-fetch';
import moment from 'moment';
import $ from "jquery";
import { dataString } from './commonData.js'
var util = require('./util.js');
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const Search = Input.Search;
const { Header, Content, Sider,Footer } = Layout;

class CommonAddBook extends React.Component {
    constructor(props) {
        super(props)
         this.state = {
            loading: false,
            visible: false,
            bookData: [],
            total: '',
            firstValue: true,
            showQuickJumper: false,
            currentPage: 1,
            searchValue: '',
            checkedData: [],
            publishList:[],
            goodsPriceList:[],
            authorList:[],
            stateList:[],
            createBeginTime:'',
            selectedRowKeys:[],
            selectedRows:[],
            createEndTime:'',
            //渠道
           	bookDomainRelation: {
                domainCode: ''
            },
            firstBookDomainRelation: {
                domainCode: ''
            },
            //领域
            bookDomainClassList: [{
                domainCode: '',
                domainName: '',
                parentCode: '',
            }],
            bookSecondClassList: [{
                domainCode: '',
                domainName: '',
            }],
            book: {
            	//出版社
                bookPublish: '',
                bookName:''
                
            },
            goods: {
            	//价格
                goodsSrcPrice: "",
                //状态
                goodsState:"SHELVES_ON"
            },
            bookAuthorRelation: {
            	//作者
                authorCode: ""
            },
            allselectsData:[],
            allselectskey:[]
            
            

        }
       
    }
	changePage = (pagination) => {
        this.fetchSearchBook(this.state.book.bookName, pagination.current-1)
    }
	
	createBeginTime(value, dateString, str) {
      	console.log('sss')
        this.setState({
            createBeginTime: dateString
        })
    }
    createEndTime(value, dateString, str) {
        this.setState({
            createEndTime: dateString
        })
    }
    query() {
    	function CompareDate(d1, d2) {
            return ((new Date(d1.replace(/-/g, "\/"))) >(new Date(d2.replace(/-/g, "\/"))));
        }
       	
        const pageVo={
        	"page":0,
        	"pageSize":20
        }
        if(this.state.book.bookName==''){
        	var searchType="";
        	
        }else{
        	var searchType="BOOK_NAME";
        }
        this.setState({
            selectedRowKeys:[],
            selectedRows:[],
            allselectsData:[],
            allselectskey:[]
        })
        if (CompareDate(this.state.createBeginTime, this.state.createEndTime)) {
            	
            message.error('时间设置不正确');
            return;
        }
        if (this.state.bookDomainRelation.domainCode == '' && this.state.firstValue == false) {
            message.error('请选择子领域');
            return;
        }
      
         this.bookListFn(this.state.book, this.state.goods,this.state.bookAuthorRelation, this.state.bookDomainRelation,pageVo,this.state.createBeginTime, this.state.createEndTime,searchType);
        
    }
     focus = (name, type, listStr) => {
        this.bookResultItem(name, type, listStr);
    }
    goodsChange(str, value) {
    	
        this.setState({
            goods: {
            	...this.state.goods,
                goodsSrcPrice: value
            }},()=> {
			  
			   
			
        })
        
    }
    bookSecondChange(str, value) {
        this.setState({
            bookDomainRelation: {
                domainCode: value
            },
            firstValue: true
        })
    }
    bookPublishChange(str, value) {
        this.setState({
            book: {
                ...this.state.book,
                bookPublish: value
            }
        })
    }
    bookAuthorChange(str, value){
    	
         this.setState({
            bookAuthorRelation: {
            	//作者
                authorCode:value
            }},()=> {
            
        })    
    }
    goodsStateChange(str, value){
    	 this.setState({
            goods: {
            	...this.state.goods,
                goodsState: value
            }},()=> {
			   
			   
			
        })
    }
       /*领域*/
    bookDomainRelationChange(str, value) {
        console.log(value);
        if (value == '06') {
            this.setState({
                bookDomainRelation: {
                    domainCode: value,
                },
                firstBookDomainRelation: {
                    domainCode: value
                },
            })
            var select = document.getElementsByClassName('u-second-select')[0];
            select.style.display = 'none';
        } else {
            $('.u-second-select .ant-select-selection-selected-value').text('');
            $('.u-second-select .ant-select-selection-selected-value').attr('title', '');
            const secondeList = [];
            var list = this.state.bookDomainClassList;
            for (let i = 0; i < list.length; i++) {
                if (list[i].parentCode == value) {
                    secondeList.push({
                        domainCode: list[i].domainCode,
                        domainName: list[i].domainName
                    })
                }
            }
            this.setState({
                bookDomainRelation: {
                    domainCode: ''
                },
                firstBookDomainRelation: {
                    domainCode: value
                },
                bookSecondClassList: secondeList,
                firstValue: false
            }, () => {

            })
            var select = document.getElementsByClassName('u-second-select')[0];
            select.style.display = 'block';
        }
    }
 	 handleOk = () => {
 	 	console.log(this.state.allselectskey);
       	this.props.handleOk(this.state.allselectskey,this.state.allselectsData);
       
        this.setState({
            bookData: [],
            selectedRowKeys:[],
            selectedRows:[],
            allselectskey:[],
            allselectsData:[],
            currentPage:1
        })
    }
    async bookResultItem(groupId, type, listStr) {
        var data = await fetch(util.url, {
            mode: "cors",
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: "method=ella.operation.boxSearchList" + "&content=" + JSON.stringify({ "groupId": groupId, "type": type })+dataString
        }).then(res => res.json())
       
        this.setState({
            [listStr]: data.data
        }, () => {
            
        })
    }
    
    getInputValue = (value) => {
    	
        this.setState({
           	book: {
            	...this.state.book,
                bookName: value
            }},() => {
           
        }
        )
    }
     fetchSearchBook(text, page) {
     	console.log(text)
     	console.log(page);
     	 const pageVo={
        	"page":page,
        	"pageSize":20
        }
     	 this.setState({
           	book: {
            	...this.state.book,
                bookName: text
            }},() => {
           console.log(this.state.book)
           this.bookListFn(this.state.book, this.state.goods,this.state.bookAuthorRelation, this.state.bookDomainRelation,pageVo,this.state.createBeginTime, this.state.createEndTime,'BOOK_NAME');
        }
        )
       

        

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
    	
    	this.fetchSearchBook('',0);
    }
    clearSelect() {
        this.setState({
            bookDomainRelation: {
                domainCode: ''
            },
            firstBookDomainRelation: {
                domainCode: ''
            },
            //领域
            bookDomainClassList: [{
                domainCode: '',
                domainName: '',
                parentCode: '',
            }],
            book: {
            	//出版社
                bookPublish: '',
                bookName:''
                
            },
            goods: {
            	//价格
                goodsSrcPrice: "",
                //状态
                goodsState:"SHELVES_ON"
            },
            bookAuthorRelation: {
            	//作者
                authorCode: ""
            },
            createBeginTime: "",
            createEndTime: ""
           
        })
    }
	async bookListFn(book, goods,bookAuthorRelation, bookDomainRelation,pageVo,createBeginTime, createEndTime,searchBoxType) {
        this.setState({
            loading: true
        })
        var data = await fetch(util.url, {
            mode: "cors",
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: "method=ella.operation.searchBookByConditions" + "&content=" + JSON.stringify({ "book": book, "goods": goods,"bookAuthorRelation":bookAuthorRelation, "bookDomainRelation": bookDomainRelation,  "pageVo": pageVo,  "createBeginTime": createBeginTime, "createEndTime": createEndTime,"searchBoxType":searchBoxType})+dataString
        }).then(res => res.json())
            .then((data) => {
            	
               
	            this.setState({
	                bookData: data.data.bookList,
	                total: data.data.total,
	                currentPage: data.data.currentPage,
	                loading: false
	              
	            },()=>{
	            	if(data.data.bookList.length!=0){
	            		 
            			$('.ant-table-thead .ant-checkbox-wrapper').css({'display':'block'})
            			$('.curSelected').css({'display':'block'})
            			$('.allchecks').css({'display':'block'})
	            	}else{
	            		$('.ant-table-thead .ant-checkbox-wrapper').css({'display':'none'})
	            		$('.curSelected').css({'display':'none'})
	            		$('.allchecks').css({'display':'none'})
	            	}
	            }
	            )
            })

    }
    render() {
    	
       	const columns2=[  
            {
                title: '图书名称',
                width: 150,
                dataIndex: 'bookName',
            }, 
            {
                title: '上传时间',
                width: 150,
                dataIndex: 'createTime',
            }, 
            {
                title: '价格',
                dataIndex: 'goodsSrcPrice',
                width: 100,
            }, 
            {
                title: '状态',
                width: 100,
                dataIndex: 'goodsState',
                render: (text,record) => {
                    return <span>{text=="SHELVES_WAIT"?"待上架":text=="SHELVES_ON"?"已上架":text=="SHELVES_OFF"?"已下架":""}</span>
                   
                }
            }
                ]
        const { selectedRowKeys,selectedRows } = this.state
       
        const rowSelection2 = {
            selectedRowKeys,
            type: this.props.selectType=='radio'?"radio":"Checkbox",
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
            	},()=> {
			 
			   
			  
			
        }
            	)
          		
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
            		<Sider width={190} style={{ background: '#fff' }}>
            			<div className="slideAll" style={{"marginTop":"-8px"}}>
            				<span className="u-txt">精确检索</span>
            			</div>
            			<div className="slideAll">
            				<span className="u-txt">上传时间</span>
                            <DatePicker
                                format="YYYY-MM-DD"
                                placeholder={['开始时间']}
                                onChange={(value, dateString) => { this.createBeginTime(value, dateString, "createBeginTime") }}
                                value={this.state.createBeginTime != '' ? moment(this.state.createBeginTime, 'YYYY-MM-DD') : null}
                                style={{ width: 113,"font-size": "12px","marginBottom":"10px"}}
                                className="slideRight"
                            />
                            
                            <DatePicker
                                format="YYYY-MM-DD"
                                placeholder={['结束时间']}
                                style={{ width: 113,"font-size": "12px"}}
                                className="slideRight"
                                onChange={(value, dateString) => { this.createEndTime(value, dateString, "createEndTime") }}
                    			value={this.state.createEndTime != '' ? moment(this.state.createEndTime, 'YYYY-MM-DD') : null}
                            />
            			</div>
            			<div className="m-select slideAll">
            				<span className="u-txt">出版社</span>
                        		<Select className="slideRight" value={this.state.book.bookPublish} style={{ width: 113 }} onChange={(value) => this.bookPublishChange("bookPublish", value)} onFocus={(value) => this.focus("operation.box.publishList", "AUTO_BOX", "publishList")}>
                                    <Option value=''>全部</Option>
                                    {
                                        this.state.publishList.map(function (item) {
                                            return <Option value={item.uid} key={item.uid}>{item.businessTruename}</Option>
                                        })
                                    }
                            	</Select>
                    	</div>
                    	<div className="m-select slideAll">
            				<span className="u-txt">作者</span>
            				<Select className="slideRight" value={this.state.bookAuthorRelation.authorCode} style={{ width: 113 }} onChange={(value) => this.bookAuthorChange("bookPublish", value)} onFocus={(value) => this.focus("operation.box.getOriginalAuthorList", "AUTO_BOX", "authorList")}>
                                <Option value=''>全部</Option>
                                {
                                    this.state.authorList.map(function (item) { 
                                        return <Option value={item.authorCode} key={item.authorCode}>{item.authorName}</Option>
                                    })
                                }
                        	</Select>
                    	</div>
                    	<div className="m-select slideAll">
            				<span className="u-txt">状态</span>
            				<Select className="slideRight" value={this.state.goods.goodsState} style={{ width: 113 }} onChange={(value) => this.goodsStateChange("bookPublish", value)} onFocus={(value) => this.focus("GOODS_STATE", "HAND_BOX", "stateList")}>
                                <Option value=''>全部</Option>
           						<Option value='SHELVES_ON'>已上架</Option>
                                {
                                  this.state.stateList.map(function (item) {
                                  	if(item.searchCode!="SHELVES_ON"){
                                  		return <Option value={item.searchCode} key={item.searchCode}>{item.searchName}</Option>
                                  	}
						            
						        })
                                }
                        	</Select>
                    	</div>
                    	<div className="m-select slideAll">
            				<span className="u-txt">价格</span>
            				<Select value={this.state.goods.goodsSrcPrice} className="slideRight" style={{ width: 113 }} onChange={(value) => this.goodsChange("goods", value)} onFocus={(value) => this.focus("GOODS_SRC_PRICE", "HAND_BOX", "goodsPriceList")}>
                                <Option value=''>全部</Option>
                                {
                                    this.state.goodsPriceList.map(function (item,index) {
                                        return <Option value={item.searchName} key={index}>{item.searchName == '0.01'?'免费':item.searchName=='-1'?'其他':item.searchName}</Option>
                                    })
                                }
                               
                            </Select>
                    	</div>
                    	<div className="m-select slideAll">
            				<span className="u-txt">领域</span>
            				 <Select value={this.state.firstBookDomainRelation.domainCode} className="slideRight" style={{ width: 113 }} onChange={(value) => this.bookDomainRelationChange("bookDomainClassList", value)} onFocus={(value) => this.focus("operation.box.bookDomainClassList", "AUTO_BOX", "bookDomainClassList")}>
                                <Option value=''>全部</Option>
                                <Option value="01">健康</Option>
                                <Option value="02">语言</Option>
                                <Option value="03">社会</Option>
                                <Option value="04">科学</Option>
                                <Option value="05">艺术</Option>
                                <Option value="06">全领域</Option>
                               
                            </Select>
                    	</div>
                    	<div className="m-select slideAll">
            				<Select value={this.state.bookDomainRelation.domainCode} className="slideRight slideRight u-second-select" style={{ width: 113,"display":"none" }} onChange={(value) => this.bookSecondChange("bookSecondClassList", value)}>
                                <Option value=''>全部</Option>
                                {
                                    this.state.bookSecondClassList.map(function (item) {
                                        return <Option value={item.domainCode} key={item.domainCode}>{item.domainName}</Option>
                                    })
                                }
                            </Select>
                    	</div>
                    	<div className="m-select" style={{"text-align":"center","marginTop":"20px"}}><Button className="u-btn block" onClick={() => this.clearSelect()}>恢复默认</Button></div>
                    	<div className="m-select" style={{"text-align":"center","marginTop":"20px"}}><Button className="u-btn block" onClick={this.query.bind(this)}>查询</Button></div>
            		</Sider>
            		<Layout>
                    	<Content style={{ background: '#fff', margin: 0, minHeight: 408 }}>
                            <div id="addNewBook" style={{ padding: "0px 0 0 20px","position":"relative" }}>
                                <Row style={{ marginBottom: 16 }} align='middle'>
                                    <Col>
                                    	<Search placeholder="搜索" enterButton onBlur={(e) => { this.getInputValue(e.target.value)}} onPressEnter={(e) => { this.fetchSearchBook(e.target.value,0) }} onSearch={() => { this.fetchSearchBook(this.state.book.bookName,0) }}/>
                                    </Col>
                                </Row>
                                <Spin tip="加载中..." spinning={this.state.loading} size="large" style={{ zIndex: 9999 }}>
	                                <Table
	                                	rowKey={this.props.rowKey}
	                                	rowSelection={rowSelection2}
	                                    columns={columns2}
	                                    dataSource={this.state.bookData}
	                                    pagination={pagination}
	                                    onChange={this.changePage.bind(this)}
	                                    bordered
	                                    scroll={{ y: (this.state.bookData.length > 7? 350 : 0) }}
	                                />
                                </Spin>
                                {
                                    !this.props.selectType?<div>
                                    <span style={{"position":"absolute","bottom":"20px","left":"58px"}} className="allchecks">全选</span>
                                    <span className="curSelected"><span>{this.state.allselectskey.length}</span>/<span>{this.state.total}</span></span>
                                    </div>:null
                                }
                            
                            </div>
                        </Content>
                        <Footer style={{"text-align":"center"}}>
                        	<Button type="primary"  key="submit" onClick={this.handleOk} disabled={this.state.allselectskey.length!=0?false:true}>添加</Button>
                        </Footer>
                    </Layout>
                </Layout>
            </Modal>
        )
    }
}
export {CommonAddBook};



