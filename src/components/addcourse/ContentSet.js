import React from 'react';
import { Table, Icon,Button ,Row ,Col ,Input ,Select ,Tag ,Popover,Popconfirm,InputNumber,Form ,Radio,Modal} from 'antd';
import "./ContentSet.css";
import getUrl from "../util.js";
import { dataString } from '../commonData.js'
const Search = Input.Search;
const RadioGroup = Radio.Group;
//thirdCode:商品id,goodsName:商品名字,goodsSrcPrice:原价,goodsMarketprice:(市场价?售价)
export default class ContentSet extends React.Component {

	constructor({getContentData,contentData,params}){
		super()
		this.state={
			dataSource:[],
		    count: 2,
		    BookDataList:[],
		    goodsMarketpriceAll:'',
		    goodsSrcPriceAll:'',
		    goodsPriceAll:'',
		    visible:false,
		    searchName:'',
		    selectedRowKeys:'',
		    selectedRows:'',
		    bookCourseList:[],
		    currentPage: 1,
		    total:'',
			data : [
				{
				  key: '1',
				  thirdCode: '',
				  goodsName: "",
				  goodsMarketprice:'',
				  goodsSrcPrice: "",
				  goodsPrice : "",
				  del:"删除"
				}
			],
			columns : [
				{
				   	title: '物品名称',
				  	dataIndex: 'bookName',
				  	key: 'bookName',
				  	width:"20%",
				  	render : (text,record)=> {	
				  		return (
				  			<div>{record.bookName}</div>
				  		)
					}
				},
				{
				  title: '物品ID',
				  dataIndex: 'bookCode',
				  key: 'bookCode',
				  width:"20%"
				},  {
				  title: '市场价',
				  dataIndex: 'bookMarketPrice',
				  key: 'bookMarketPrice',
				   width:"20%",
				  render: (text,record)=> {
				  	if(record.bookMarketPrice==null){
				  		return (
				  			<div></div>
				  		)
				  	}else{
				  		return (
				  			<div>{record.bookMarketPrice}</div>
				  		)
				  	}
				  
				  }	
				},
				{
				   	title: '售价',
				  	dataIndex: 'bookSrcPrice',
				  	key: 'bookSrcPrice',  
				   	width:"20%",
				  	render: (text,record)=> {
				  		if(record.bookSrcPrice==null){
				  			return (
					  			<div></div>
					  		)
				  		}else{
				  			return (
				   				<div>{record.bookSrcPrice}</div>
				   			)
				   		}
				  	}
				},
				{
				  	title : '优惠价',	
				  	dataIndex : "bookGoodsPrice",
				  	key : "bookGoodsPrice",
				   	width:"20%",
				 	render : (text,record) => {
				  		if(record.bookGoodsPrice==null){
					  		return (
					  			<div></div>
					  		)
				  		}else{
					  		return (
					  			<div>{record.bookGoodsPrice}</div>
					  		)
				  		}
				  	
				
				  	}
				}
				
			],
			onSearch : true,
			resultItem : [],
			thirdName : "",
			thirdCode : "",
			goodsMarketprice : "",
			goodsSrcPrice : "",
			content:(<div></div>)
		}
		
	}
	handleAdd = () => {
		this.fetchBookList(this.state.searchName,0);
		this.setState({
	        visible:true
	    });
	}
	componentDidMount() {
		
    }
	setAllPrice(){
		let total = this.state.dataSource;
		const that=this;
		let goodsMarketpriceAll=0;
		let goodsSrcPriceAll=0;
		let goodsPriceAll=0;
		console.log(this.state.dataSource)
        this.state.dataSource.forEach(item => {
            if (!item) return;
            console.log(item.goodsSrcPrice)
            if(item.goodsMarketprice!=""){
            	
            	goodsMarketpriceAll+= parseFloat(parseFloat(item.goodsMarketprice));
            	
            }
            if(item.goodsSrcPrice!=""){
            	
            	goodsSrcPriceAll+= parseFloat(parseFloat(item.goodsSrcPrice));
            	
            	
            }
            if(item.goodsPrice!=""){
            	
            	goodsPriceAll+= parseFloat(parseFloat(item.goodsPrice));
            	
            	
            }
 
        })
        if (!total[2]) total = [];//TODO:防止报错
        this.setState({
			goodsMarketpriceAll:goodsMarketpriceAll.toFixed(2),
			goodsSrcPriceAll:goodsSrcPriceAll.toFixed(2),
			goodsPriceAll:goodsPriceAll.toFixed(2)
		})
        
	}
	async fetchBookList(v,page) {
		var pageVo={
			page: page,
            pageSize:20
		}
        var doc = {
            courseName: v,
            pageVo
        }
        var data = await fetch(getUrl.url, {
            mode: "cors",
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: "method=ella.operation.getBookCourseList" + "&content=" + JSON.stringify(doc)+dataString
        }).then(res => res.json())
        this.setState({
            BookDataList: data.data.list,
            visible: true,
            total: data.data.total,
            currentPage:data.data.currentPage,

        }, () => {

        })
        
    }
	async fetchResultItem(text){
		var data = await fetch(getUrl.url,{
			mode : "cors",
      		method : "POST",
      		headers: {
      		  'Content-Type': 'application/x-www-form-urlencoded',
      		},
      		body:"method=ella.operation.thirdSearchList"+"&content="+JSON.stringify({"text":text,"searchType":"searchBook"})+dataString
		}).then(res => res.json())
		this.setState({
			resultItem : text==""?[]:data.data,
			content : (<div>
			    {
			    	data.data.map((item,index)=>{
			    		if(index<5){

			    			return <div>
			    			<span
			    			onClick={(e)=>{
								this.setThird(item.thirdName,item.thirdCode);
								this.props.getThird("thirdName","thirdCode",item.thirdName,item.thirdCode);
								// this.props.getContentData("thirdName",item.thirdName);
							}}
			    			className="resultItem">{item.thirdName}</span></div>
			    		}
			    	})
			    }
			  </div>)
		})
	}
	//设置thirdName和thidrCode,并清空搜索结果,搜索框消失
	setThird(name,code){
		this.setState({
			...this.state,
			thirdName : name,
			thirdCode : code,
			data : this.state.data.map(item=>{
				return {
					...item,
					thirdName : name,
					thirdCode : code,
				}
			}),
			resultItem : [],
			onSearch : false

		})
	}
	// 用户如果选错了再次搜索
	searchAgain(){
		this.setState({
			onSearch : true
		})
	}
	//市场价和售价
	setPrice(str,value){
		this.setState({
			[str] : value
		})
	}
	getInputValue = (value) => {
    	
        this.setState({
           	searchName:value
           
        })
    }
	changePage = (pagination) => {
        this.fetchBookList(this.state.searchName, pagination.current-1)
    }
	async AddCourseOk(){
		var doc = {
           courseCode:this.state.selectedRowKeys[0]
        }
        var data = await fetch(getUrl.url, {
            mode: "cors",
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: "method=ella.operation.searchCourseDetail" + "&content=" + JSON.stringify(doc)+dataString
        }).then(res => res.json())
        var _data=data.data.bookCourseList;
        for(var i=0;i<_data.length;i++){
        	if(_data[i].bookCode==null){
        		_data.splice(i,1);
        		i=i+1;
        	}
        }
        var courseData={};
        courseData.bookName=this.state.selectedRows[0].courseName;
        courseData.bookCode=this.state.selectedRowKeys;
        courseData.bookMarketPrice=null;
        courseData.bookGoodsPrice=null;
        courseData.bookSrcPrice=null;
       	_data.push(courseData);
       	console.log(_data)
       	//累加
       	const bookMarketPrice=_data.map((item)=>item.bookMarketPrice).reduce((pre,cur)=>pre+cur);
       	const bookGoodsPrice=_data.map((item)=>item.bookGoodsPrice).reduce((pre,cur)=>pre+cur);
       	const bookSrcPrice=_data.map((item)=>item.bookSrcPrice).reduce((pre,cur)=>pre+cur);
       	console.log(bookMarketPrice)
       	this.props.getContentData("goodsMarketprice",bookMarketPrice)
       	this.props.getContentData("goodsPrice",bookGoodsPrice)
       	this.props.getContentData("goodsSrcPrice",bookSrcPrice)
       	this.props.getContentData("thirdCode",this.state.selectedRowKeys[0])
       	this.props.getContentData("bookCourseList",_data)
       	this.setState({
       		
            visible: false
        }, () => {
				
        })
	}
	render(){
		
		
		var columns = [
            {
                title: '课程标题',
                dataIndex: 'courseName',
                key: 'courseName',
            },
            {
                title: '课程编码',
                dataIndex: 'courseCode',
                key: 'courseCode',
            },
            {
                title: '价格',
                dataIndex: 'goodsPrice',
                key: 'goodsPrice',
            },
        ];
         const pagination = {
            current:this.state.currentPage,
            total: this.state.total,
            defaultPageSize:20,
            defaultCurrent:this.state.currentPage,
            onChange:function(){
          		
            }
        }
        const {contentData}=this.props;
        console.log(contentData);
        
        const { selectedRowKeys,selectedRows } = this.state
        var rowSelection = {
            type: 'radio',
            onChange: (selectedRowKeys, selectedRows) => {
               this.setState({
            		selectedRowKeys,
            		selectedRows
            	})

            }
        }
		return <div>
			<h3>内容设定</h3>
			<div className="contentWrap">
				{
					this.props.params.goodsCode==0?(<Button onClick={this.handleAdd} type="primary" style={{ marginBottom: 16,"width":"100px"}}>添加课程</Button>):""
				}
				
				<Modal
                    title="添加课程"
                    visible={this.state.visible}
                    className="addModal"
                    onOk={(e) => { this.AddCourseOk()}}
                    onCancel={() => {
                        this.setState({
                            visible: false
                        })
                    }}
                >
                    <Row style={{ marginBottom: 16,"width":"400" }} align='middle'>
                        <Col>
                        	<Search placeholder="搜索" enterButton onBlur={(e) => { this.getInputValue(e.target.value)}} onPressEnter={(e) => { this.fetchBookList(e.target.value,0) }} onSearch={() => { this.fetchBookList(this.state.searchName,0) }}/>
                        </Col>
                    </Row>
                    <Table rowKey="courseCode" rowSelection={rowSelection}  pagination={pagination}  onChange={this.changePage.bind(this)} columns={columns} dataSource={this.state.BookDataList}  scroll={{ y:240}}/>
                </Modal>
				<Table columns={this.state.columns} dataSource={contentData.bookCourseList}  pagination={false}  scroll={{ y:240}}/>
				<Row style={{"marginTop":"20px"}}>
                    <Col offset={4} className="total_space" span={4}>
                        课程总价:
                    </Col>
                    <Col className="total_space" span={2} offset={3}>
                        {
                            <InputNumber
                                style={{ width: "80%" }}
                                value={contentData.goodsMarketprice}
                                onBlur={(e)=>{this.props.getContentData("goodsMarketprice",e.target.value)}} 
                                onChange={(value)=>{this.props.getContentData("goodsMarketprice",value)}} 
                               
                            />    
                        }
                    </Col>
                     <Col className="total_space" span={2} offset={3}>
                        {
                            <InputNumber
                                style={{ width: "80%" }}
                                value={contentData.goodsSrcPrice}
                                onBlur={(e)=>{this.props.getContentData("goodsSrcPrice",e.target.value)}} 
                                onChange={(value)=>{this.props.getContentData("goodsSrcPrice",value)}} 
                               
                               
                               
                            />    
                        }
                    </Col>
                    <Col className="total_space" span={2} offset={3}>
                        {
                            <InputNumber
                            	value={contentData.goodsPrice}
                                style={{ width: "80%" }}
                                onBlur={(e)=>{this.props.getContentData("goodsPrice",e.target.value)}} 
                                onChange={(value)=>{this.props.getContentData("goodsPrice",value)}} 
                               
                                
                                
                            />  
                        }
                    </Col>
                   
                </Row>
				<div className="addContentWarp">
					{/*<Button 
					onClick={()=>{this.addContent()}} 
					type="primary"
					>增加商品内容</Button>*/}				
				</div>
				
			</div>
			
			<hr/>
		</div>
	}
}
