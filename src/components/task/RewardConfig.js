import React from 'react'
import {Icon,Input, Select, Radio, Button,Row,InputNumber,Tooltip,notification} from 'antd'
var util = require('../util.js');
import ComSelectBook from '../commonSelectBook.js';
const RadioGroup = Radio.Group;
const Option = Select.Option;
class RewardConfig extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            RewardVIPList:[],
            searchGroupList:[],
            redList: [],//红包金额配置数据
            red_total: 0,
            red_money: null,
            red_number: null,
		    
        }
    }
    componentDidMount() {
        this.fetchGoodGroup("")
        this.fetchRewardVIP();
    }
    componentWillReceiveProps(nextProps){
        var n = 0; //初始获取红包总数
        nextProps.redList.forEach(item => {
            n += item.price * item.num
        })
        this.setState({
            redList:nextProps.redList,
            red_total: n,
        },()=>{
            console.log(this.state.redList)
        })

    }
    //奖励内容为会员时的下拉
    fetchRewardVIP() {
        util.API({},"ella.operation.getTaskRewardVipList")
        .then(response=>response.json())
        .then(response=>{
            if(response.status==1){
                this.setState({
                    "RewardVIPList":response.data,
                })
            }else{
               console.log(response.message)
            }
        })
        
    }
    //图书包下拉数据
    fetchGoodGroup(str) {
        var doc = {
            "goodsManageSearchType": "goodsName",
            "searchContent": str,
            "goodsState": "SHELVES_ON",
            "goodsType": "BOOK_PACKAGE",
            "availableBookPackage": "YES",
            "page": 0,
            "pageSize": 1000
        }
        util.API(doc,"ella.operation.goodsManageList")
        .then(response=>response.json())
        .then(response=>{
            if(response.status==1){
                this.setState({
                    "searchGroupList":response.data.list,
                })
            }else{
                console.log(response.message)
            }
        })
        
    }
    //红包类型设置
    setRedType(k, v) {
        this.setState({
        [k]: v,
        })
    }
    //红包相关函数
    addRedItem() {
        if (this.state.red_money == null || this.state.red_number <= 0 || this.state.red_number == null) {
            notification.error({
                message: '操作失败',
                description: '抱歉没有选红包金额或者数量输错了',
            })
            return
        }
        this.setState({
            redList: [
                ...this.state.redList,
                {
                id: this.state.redList.length == 0 ? 0 : this.state.redList.reduce((a, b) => b).id + 1,
                price: this.state.red_money,
                num: this.state.red_number
                }
            ],
            red_money: null,
            red_number: null
        }, () => {
           
            this.props.changeType("redList",this.state.redList)
            this.setState({ red_total: this.getTotal() }) 
        })
    }
    //获取新增加红包总数
    getTotal() {
        var n = 0;
        this.state.redList.forEach(item => {
        n += item.price * item.num;
        })
        return n
    }
    minusRedItem(id) {
        this.setState({
          redList: this.state.redList.filter(item => item.id != id),
    
        }, () => { this.setState({ red_total: this.getTotal() }) })
    }
    changeRedPrice(k, v, id) {
	    this.setState({
	      redList: this.state.redList.map((item, index) => {
	        if (item.id != id) return item;
	        return {
	          ...item,
	          [k]: v
	        }
	      })
	    }, () => { this.setState({ red_total: this.getTotal() }) })
	  }
    RewardConfig(rewardType){
        const red_detail = {
	      	margin: "4px 0px 4px 0px",
	      	textAlign: "center",
	      	lineHeight: "26px"
	    }
        const addAndMud={
        	fontSize: "24px",
        	cursor: "pointer",
        	color: "#27c14c",
        	"marginLeft":"10px"
        }
    	switch(rewardType){

            case 'VIP':return <RadioGroup
                    onChange={(e) =>{
                        var value=e.target.value.split(",");
                        this.props.rewardChange(value[0],"rewardContent",value[1],"rewardDesc")
                        }
                    }
                    value={!!this.props.taskReward.rewardContent?this.props.taskReward.rewardContent+','+this.props.taskReward.rewardDesc:this.props.taskReward.rewardContent}>
                    {
                        this.state.RewardVIPList.map((item)=>{
                            return <Radio value={item.cardCode+","+item.title} key={item.cardCode}>{item.title}</Radio>
                        })
                    }
                </RadioGroup>;
            break;

            case 'POINT':return <InputNumber
                    onChange={(value) =>this.props.rewardChange(value,"rewardContent")}
                    style={{ width: 100 }}
                    value={this.props.taskReward.rewardContent}
                />;
            break;
    		case 'BOOK':return <span><Input style={{ width: 200}} value={this.props.taskReward.bookName} disabled="true" onChange={(e)=>this.props.rewardChange(e.target.value,"bookName")}/>
	            <Button onClick={this.bookDetailSearch}>添加</Button></span>;
	        break;
			case 'COUPON':return <div style={{"display":"inlineBlock"}}>
					红包金额:
	                <Input disabled value={this.state.red_total} style={{width:"100px","marginLeft":"10px"}}/>
	                <spen style={{"fontSize":"14px"}}>元</spen>
		        <Row style={{width:400}}>
                    {
                        this.state.redList.map(item => {
                            
                            return (
                                <Row style={red_detail}>
                                    <Select value={item.price + "元"} style={{ width: "150px" }} onChange={(value) => { this.changeRedPrice("price", value, item.id) }}>
                                        <Option disabled={this.state.redList.find(n => n.price == 1)} value="1" key="1">1元</Option>
                                        <Option disabled={this.state.redList.find(n => n.price == 2)} value="2" key="2">2元</Option>
                                        <Option disabled={this.state.redList.find(n => n.price == 3)} value="3" key="3">3元</Option>
                                        <Option disabled={this.state.redList.find(n => n.price == 4)} value="4" key="4">4元</Option>
                                    </Select>
                                    <Icon style={{ lineHeight: "34px" }} type="close" />
                                
                                    <InputNumber onChange={(value) => { this.changeRedPrice("num", value, item.id) }}  value={item.num} />
                                
                                    {
                                        <Tooltip placement="top" title={"点击删除"}><Icon style={addAndMud} onClick={() => { this.minusRedItem(item.id) }} type="minus-circle" /></Tooltip>
                                    }
                                    
                                </Row>
                            )
                        })
                    }
                
		        </Row>
          		<Row style={{width:400}}>
            	
	              	{
	                	this.state.redList.length == 4
	                  	?
	                  	<div></div>
	                  	:
	                  	<Row style={red_detail}>
		                    
		                    <Select value={this.state.red_money} style={{ width: "150px" }} onChange={(v) => { this.setRedType("red_money", v) }}>
		                        <Option disabled={this.state.redList.find(n => n.price == 1)} value="1">1元</Option>
		                        <Option disabled={this.state.redList.find(n => n.price == 2)} value="2">2元</Option>
		                        <Option disabled={this.state.redList.find(n => n.price == 3)} value="3">3元</Option>
		                        <Option disabled={this.state.redList.find(n => n.price == 4)} value="4">4元</Option>
		                    </Select>
		                   
		                    <Icon style={{ lineHeight: "34px" }} type="close" />
		                    
		                    <InputNumber value={this.state.red_number} onChange={(value) => { this.setRedType("red_number", value) }}/>
		                    
		                    {
		                        <Tooltip placement="top" title={"点击增加红包"}><Icon style={addAndMud} onClick={() => { this.addRedItem() }} type="plus-circle" /></Tooltip>
		                    }
		                    
	                  	</Row>
	              	}
            	
                </Row>
                <Row style={{width:400}}>
                    <p style={{margin: "0px 0px 5px 0px"}}>
                        {
                            this.state.redList.map((item, index) => {
                                if (index == this.state.redList.length - 1) {
                                    return <span>{item.price}元x{item.num == "" ? 0 : item.num}=</span>
                                }
                                return <span>{item.price}元x{item.num == "" ? 0 : item.num}+</span>
        
                            })
                        }
                        {
                            this.state.red_total
                        }元
                    </p>
                </Row>
          	</div>
            break;
            case 'BOOK_PACKAGE':return <Select
                showSearch
                style={{ width: 200 }}
                placeholder="搜索图书包"
                optionFilterProp="children"
                onChange={(v) => { 
                    var value=v.split(",");
                    this.props.rewardChange(value[0],"rewardContent",value[1],"rewardDesc")
                }}
                onSearch={(e) =>this.fetchGoodGroup(e)}
                onFocus={() =>this.fetchGoodGroup("")}
                value={!!this.props.taskReward.rewardContent?this.props.taskReward.rewardContent+","+this.props.taskReward.rewardDesc:this.props.taskReward.rewardContent}
            >
                {
                    this.state.searchGroupList.map(item => {
                        
                        return <Option value={item.thirdCode+','+item.goodsName} key={item.thirdCode}>{item.goodsName}</Option>
                    })
                }
            </Select>;
            break;
            default:return null;
    	}
    	
    }
    bookDetailSearch = () => {
        this.refs.childrenModal.showModal();
    }
    handleOk = (bookCode,bookName) => {

        this.props.rewardChange(bookName,"bookName")
        setTimeout(()=>{
            this.props.rewardChange(bookCode,"rewardContent")
        },3000);

    }
    render() {
        return (
        	<span>
	        	{
	        		this.RewardConfig(this.props.taskReward.rewardType)
	        	}
        	 	<ComSelectBook ref="childrenModal" handleOk={(bookCode,bookName) => this.handleOk(bookCode,bookName)} />
        	</span>
        )
    }
}
export default RewardConfig;