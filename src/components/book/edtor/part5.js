import React from 'react';
import { Icon, Button, Row,Modal, Col, Select, Input, message,Spin,Steps } from 'antd';
import { Link } from 'react-router';
// import ClassSet from './classSet.js';
// const { MonthPicker, RangePicker } = DatePicker;
const Step = Steps.Step;
const confirm = Modal.confirm;
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
import './index.css';
import getUrl from "../../util.js";
import commonData from '../../commonData.js';
export default class PriceSet extends React.Component {

    constructor() {
        super()
        this.state = {
            spinning: true,
            prizeList:[],
            bookCode:window.location.href.split('bookCode=')[1].split('&')[0],
            bookPrizeRelationList:[{"prizeCode":'',"bookCode":window.location.href.split('bookCode=')[1].split('&')[0]}],
            visible:false,
            skipStep:'',
            initData:[],
          
        }
    }
    componentDidMount() {
    	this.fetchBookPrizeDetail();
        this.fetchPrizeList();
        console.log(this.state.bookCode)
    }
    async fetchBookPrizeDetail() {
        fetch(getUrl.url, {
            mode: "cors",
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: "method=ella.operation.getPrize" + "&content=" + JSON.stringify({
                "bookCode":window.location.href.split('bookCode=')[1].split('&')[0],
               
            }) + commonData.dataString
        }).then(res=>res.json()).then(resData =>{
        	 //两个数组的引用地址相同，赋值的时候，如果其中一个数组改变，另外一个也会改变。
        	let preData = this.state.bookPrizeRelationList;
        	console.log()
            this.setState({
                bookPrizeRelationList:resData.data.bookPrizeList.length==0?JSON.parse(JSON.stringify(preData)):JSON.parse(JSON.stringify(resData.data.bookPrizeList)),
                initData:resData.data.bookPrizeList.length==0?JSON.parse(JSON.stringify(preData)):JSON.parse(JSON.stringify(resData.data.bookPrizeList))
            
            },()=>{console.log(this.state)
            })
        });
       
      
       
    }
    async fetchPrizeList() {
        var data = await fetch(getUrl.url, {
            mode: "cors",
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: "method=ella.operation.boxSearchList" + "&content=" + JSON.stringify({
                "type": "AUTO_BOX",
                "groupId": "operation.box.bookPrizeList"
            }) + commonData.dataString
        }).then(res => res.json());
       
        console.log(data);
        this.setState({
            spinning: false,
            prizeList:data.data
        })
    }
    //存储选择的奖项
   	bookPrizeSelected(v,index){
   		console.log(index)
   		const bookPrizeRelationList=this.state.bookPrizeRelationList;
   		bookPrizeRelationList[index].prizeCode=v;
    	
        this.setState({
            bookPrizeRelationList
        },()=>{
        	console.log(this.state)
        	})
   		
   	}
    async submitData(saveType) {
        var { bookPrizeRelationList } = this.state;
      
        bookPrizeRelationList=bookPrizeRelationList.filter(item => item.prizeCode !='');
//      if(bookPrizeRelationList.length==0){
//      	message.error('至少添加一个奖项');
//      	return;
//      }
        //判断是否有相同的奖项,set设置数组会去除相同的元素
        if(new Set(bookPrizeRelationList.map(item=>item.prizeCode)).size < bookPrizeRelationList.length){
		    message.error('选择的有相同奖项，请重新选择');
      		return;
		}
        var submitData = {
            bookCode: this.state.bookCode,
           	bookPrizeRelationList
        }
      	console.log(submitData)
        var data = await fetch(getUrl.url, {
            mode: "cors",
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: "method=ella.operation.updateBookPrize" + "&content=" + JSON.stringify(submitData) + commonData.dataString
        }).then(res => res.json());
        console.log(data);
         if(data.status == 1){
             message.success("保存成功！")
            this.setState({
                visible:false,
                
            });
            this.fetchBookPrizeDetail();
                this.fetchPrizeList();
                if(saveType=="save"){
                        
                }else if(saveType=="skepsave"){
                        this.props.changePage(this.state.skipStep);
                }
         }else{
                message.error(data.message)
            }
        
    }
    //删除图书
    deleteList() {
    	const that=this;
        confirm({
            title: '确定删除此条数据吗？',
            content: '一旦删除将不可恢复！',
            onOk() {
                
                that.deleteFn(that.state.bookCode, 'NO');
            },
            onCancel() { },
        })
    }
     async deleteFn(bookCode, str) {
        var w = this;
        var data = await fetch(getUrl.url, {
            mode: "cors",
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: "method=ella.operation.delBookByBookCode" + "&content=" + JSON.stringify({ "bookCode": bookCode, "isOffRelationGoods": str }) + commonData.dataString
        }).then(res => res.json())
            .then((d) => {
                console.log(d);
                if (d.status == '1') {
                	message.success('删除成功');
                    window.history.back();
                }else if (d.code == '2000010009') {
                    const confirm = Modal.confirm;
                    const bookPage = [];
                    for (let i = 0; i < d.data.length; i++) {
                        bookPage.push(
                            d.data[i].goodsName
                        )
                    }
                    console.log(bookPage);
                    confirm({
                        title: '该图书已添加至' + bookPage.join('、') + '图书包中',
                        content: '删除会导致图书包异常，是否确认删除',
                        okType: 'primary',
                        onOk() {
                            
                            w.deleteFn(bookCode, 'YES');
                        },
                        onCancel() { },
                    })
                }
            })
    }
    skipStep(step){
        this.setState({
            skipStep:step
        })
        var { bookPrizeRelationList } = this.state;
        bookPrizeRelationList=bookPrizeRelationList.filter(item => item.prizeCode !='');
         console.log(this.state.initData)
         console.log(bookPrizeRelationList)
         if(bookPrizeRelationList.map((item)=>item.prizeCode).join(",")!=this.state.initData.map((item)=>item.prizeCode).join(",")){
           
            this.setState({visible:true})
            return;
         }
        this.props.changePage(step);

    }
    modalClick(type){
      
        if(type=="leave"){
            this.fetchBookPrizeDetail();
        	this.fetchPrizeList();
            //不保存，直接离开
            this.setState({visible:false},()=>{
            	this.props.changePage(this.state.skipStep);
            });
          
        }else if(type=="save"){
        	this.setState({visible:false},()=>{
            	this.submitData("skepsave");
            });
            
        }
       
    }
    render() {
        console.log(this.state.bookPrizeRelationList)
      
        return <Spin spinning={this.state.spinning}>
            <div className="bookPart" style={{"marginTop":"50px"}}>
            	{
	            	this.state.bookPrizeRelationList.map((item,index)=>{
	            		return <Row className='row' style={{"text-align":"center"}}>
	            			<span>奖项{index+1}:</span>
		                    <Select
		                        showSearch
		                        style={{ width: 200,"marginLeft":"10px","marginRight":"10px" }}
		                        placeholder="请选择所获取奖项"
		                       	value={item.prizeCode||undefined}
		                        onChange={(v) => {this.bookPrizeSelected(v,index); }}
		                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
		                    >
		                       
		                        {
		                            this.state.prizeList.map(item2 => {
		                                return <Option value={item2.prizeCode}>{item2.prizeName}</Option>
		                            })
		                        }
		                    </Select>
		                    <Icon style={{ fontSize: '20px' }} type="close-circle" 
			                    onClick={()=>{
			                    	const bookPrizeRelationList=this.state.bookPrizeRelationList;
			                    	if(index==0){
			                    		bookPrizeRelationList[0].prizeCode='';
			                    	}else{
			                    		bookPrizeRelationList.splice(index,1)
			                    	}
			                    	
							   		
							        this.setState({
							            bookPrizeRelationList
							        })
			                    }}
		                    />
		                </Row>
	            	})
               }
                <Row className="row" style={{"text-align":"center"}}>
                    <Button
                        style={{ width: 120 }}
                        onClick={() => {
                        	const bookPrizeRelationList=this.state.bookPrizeRelationList;
                        	bookPrizeRelationList.push({"prizeCode":'',"bookCode":this.state.bookCode})
                            this.setState({
                                bookPrizeRelationList,
                               
                            },()=>{
                                console.log(this.state)
                            }
                            )
                        }}
                    >添加奖项</Button>
                </Row>
                <Row className='row' style={{ marginTop: '100px' }}>
                	<Col span={4} offset={4}>
                        <Button onClick={() => this.deleteList()} type='primary' style={{ width: 120,"background":"red","border":"none" }}>删除图书</Button>
                    </Col>
                    <Col span={4} offset={3}>
                        <Button onClick={() => { this.skipStep(3) }} type='primary' style={{ width: 120 }}>上一步</Button>
                    </Col>
                    <Col span={4} offset={2}>
                        <Button onClick={() => { this.submitData("save") }} type='primary' style={{ width: 120 }}>保存</Button>
                    </Col>
               		
               </Row>
                <Modal
                    title="保存确认"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={()=>this.setState({visible:false})}
                    footer={null}
                >
                    <h5 style={{"text-align":"center","font-size":"16px"}}>您已修改了该页面的信息，请确认是否保存？</h5>
                    <p style={{"text-align":"center","marginBottom":"30px"}}>
                        <Icon type="warning" theme="filled" style={{"marginRight":"3px"}} />
                        <span>所有必填信息填写完全才可保存</span>
                    </p>
                    <div style={{"text-align":"center"}}>
                        <Button className="buttonWidth intervalRight" onClick={()=>this.modalClick("leave")}>离开</Button>
                        <Button className="buttonWidth" onClick={()=>this.modalClick("save")}>保存</Button>
                    </div>
                </Modal>
            </div>
        </Spin>
    }
}