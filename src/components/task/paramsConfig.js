import React from 'react'
import {Form, Input, Select,Button,message,InputNumber } from 'antd'
var util = require('../util.js');
const FormItem = Form.Item
import ComSelectBook from '../commonSelectBook.js';
class ParamsConfig extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            searchGroupList:[],
        }
    }
    componentDidMount() {
    
       this.fetchGoodGroup("");
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
                message.error(response.message)
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
                // message.error(response.message)
            }
        })
        
    }
    paramsConfig(actionCode,searchGroupList){
        //actionCode: "A20181026BML5WM5544"(无)
        //actionName: "登录咿啦看书（签到）"

        //actionCode: "A20181026BML5WN3449"（无）
        // actionName: "浏览每日绘本"

        // actionCode: "A20181026BML5WN5564"（数字输入框，单位：分钟，大于一）
        // actionName: "累计在线时间"

        // actionCode: "A20181114BM2QJO0500"（数字输入框，单位：本，大于一）
        // actionName: "完整阅读完成任意图书" 

        // actionCode: "A20181026BM2QJO0507"（图书Id）
        // actionName: "完整阅读完成指定图书"

        // actionCode: "A20181026BML5WL9491"（数字输入框，单位：分钟，大于一）
        // actionName: "单次阅读时长达到XX分钟"

        // actionCode: "A20181026BML5WM2649"（数字输入框，单位：分钟，大于一）
        // actionName: "累计阅读时长达到XX分钟"

        // actionCode: "A20181026BN4BQF5586" (图书id)
        // actionName: "购买指定图书"

        // actionCode: "A20181114BM2QJO0501"数字输入框，单位：本，大于一
        // actionName: "购买任意图书"

        // actionCode: "A20181026BN4BQF3396"（图书包id）
        // actionName: "购买指定图书包"
        // actionCode: "A20181114BM2QJO0502"数字输入框，单位：本，大于一
        // actionName: "购买任意图书包"
        
        // actionCode: "A20181026BN4BQG4441"(数字输入框，单位：无，大于一）
        // actionName: "充值一笔（可设定金额）咿啦币"

        // actionCode: "A20181026BN4BQG8483"（会员id）
        // actionName: "开通（续费）一笔会员（可设定会员类型）"

        // actionCode: "A20181026BN4BQG4686"(图书id)
        // actionName: "分享指定图书"
        // actionCode: "A20181114BM2QJO0503"（数字输入框，单位：次，大于一）
        // actionName: "分享任意图书"

        // actionCode: "A20181026BN4BQG1158"(图书id)
        // actionName: "评论指定图书"
        // actionCode: "A20181114BM2QJO0504"(数字输入框，单位：次，大于一）
        // actionName: "评论任意图书"

        // actionCode: "A20181026BN4BQH3802" （无）
        // actionName: "邀请一名好友注册"
    	switch(actionCode){

            case 'A20181026BML5WM5544':case 'A20181026BML5WN3449':case 'A20181026BN4BQH3802':return <FormItem
                    label="任务参数"
                    {...this.props.formItemLayout}>
                <span>无</span>
            </FormItem>;
            break;

            case 'A20181114BM2QJO0504': case 'A20181114BM2QJO0503':case 'A20181114BM2QJO0502':case 'A20181114BM2QJO0501':case 'A20181026BML5WN5564':case 'A20181114BM2QJO0500':case 'A20181026BML5WL9491':case 'A20181026BML5WM2649':case 'A20181026BN4BQG4441':return <FormItem
            label="任务参数"
                {...this.props.formItemLayout}>
                <InputNumber
                    style={{ width: 100 }}
                    value={this.props.times}
                    onChange={(value)=>{
                        this.props.changeType("times",value)}
                	}
                />    
            </FormItem>
            break;
            case 'A20181026BN4BQG1158':case 'A20181026BN4BQG4686':case 'A20181026BM2QJO0507':case 'A20181026BN4BQF5586':return <FormItem
    				label="任务参数"
	            	{...this.props.formItemLayout} 
	            >
                <Input style={{ width: 200}}  value={this.props.paramsBookName} disabled="true" onChange={(e)=>this.props.changeType("paramsBookName",e.target.value)}/>
                <Button onClick={this.bookDetailSearch}>添加</Button>
	        </FormItem>;
	        break;
            case 'A20181026BN4BQF3396':return <FormItem
                label="任务参数"
                {...this.props.formItemLayout}>
                <Select
                    showSearch
                    style={{ width: 200 }}
                    placeholder="搜索图书包"
                    optionFilterProp="children"
                    value={this.props.taskParamsCode||undefined}
                    onChange={(v) => {this.props.changeType("taskParamsCode", v); }}
                    onSearch={(e) => { this.fetchGoodGroup(e) }}
                    onFocus={() => { this.fetchGoodGroup("") }}
                >
                    {
                        searchGroupList.map(item => {
                            
                            return <Option value={item.thirdCode}>{item.goodsName}</Option>
                        })
                    }
                </Select>                   
                </FormItem>;
            break;
            case 'A20181026BN4BQG8483':return <FormItem
            label="任务参数"
            {...this.props.formItemLayout}>
            <Select
                showSearch
                style={{ width: 200 }}
                placeholder="会员"
                optionFilterProp="children"
                value={this.props.taskParamsCode||undefined}
                onChange={(v) => {this.props.changeType("taskParamsCode", v); }}
            >
   
                <Option value={"CARD_MONTH"}>月卡</Option>
                <Option value={"CARD_YEAR"}>年卡</Option>  
            </Select>                   
            </FormItem>;
        break;
            default:return null;
    	}
    	
    }
    bookDetailSearch = () => {
        this.refs.childrenModal.showModal();
    }
    handleOk = (bookCode,bookName) => { 
        this.props.handleOk(bookCode,bookName)

    }
    render() {
       
        const {searchGroupList}=this.state;
        return (
        	<div id="paramsConfig">
	        	{
	        		this.paramsConfig(this.props.actionCode,searchGroupList)
	        	}
        	 	<ComSelectBook ref="childrenModal" handleOk={(bookCode,bookName) => this.handleOk(bookCode,bookName)} />
        	</div>
        )
    }
}
export default ParamsConfig;