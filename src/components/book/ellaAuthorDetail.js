/*
 	created by NiePengfei at 2017/12/13
 		图书——动画书作者——作者编辑、添加
 */

import React from 'react'
import {Table,Select,DatePicker,Button,Input ,Spin,Pagination, Icon,Modal} from 'antd';
import "./ellaAuthorDetail.css"
import getUrl from "../util.js"
import { dataString } from '../commonData.js'
const { Option, OptGroup } = Select;
const Search = Input.Search;
const { TextArea } = Input;
const confirm = Modal.confirm;
export default class EllaAuthorDetail extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
        	loading:true,
        	authorTitleName:"",
        	authorName:"",
        	mobile:"",
        	pinyin:""
        }
        this.handleChange1 = this.handleChange1.bind(this);
        this.handleChange3 = this.handleChange3.bind(this);
        this.handleChange4 = this.handleChange4.bind(this);
        this.saveAndClose = this.saveAndClose.bind(this);
        this.setPY = this.setPY.bind(this);
    }
    
    //即将插入本组件时，开始请求数据，准备渲染
    //http://ellabook.cn/EllaBook2.0/scriptPage/faq.html
    componentWillMount(){
    }
    
    //虚拟dom变成真实dom之后，开始绑定事件
    componentDidMount(){
    	this.setState({
			loading:false
		})
    	console.log(this.props.editOrNew);
		if (this.props.editOrNew == "编辑作者") {
			this.GetAuthorDetail();
		}
    } 
    
    //输入框的回调
    handleChange1(e){
    	this.setState({
			authorName:e.target.value,
		})
    }
    handleChange3(e){
    	this.setState({
			mobile:e.target.value,
		})
    }
    handleChange4(e){
    	this.setState({
			pinyin:e.target.value,
		})
    }
    
    //保存操作
    saveAndClose(){
    	var thisTrue = this;
    	if (this.props.editOrNew == "编辑作者") {
    		console.log(this.props.editOrNew);
    		confirm({
			    title: '确定修改作者信息吗?',
			    content: '',
			    okText: '确定',
			    okType: 'danger',
			    cancelText: '取消',
			    onOk() {
			    	if(thisTrue.state.authorName=="" || thisTrue.state.authorName==null ||thisTrue.state.authorName==undefined){
			    		thisTrue.error("","作者不能为空");
			    	}else{
			    		thisTrue.editAuthor();
			    	}
			    },
			    onCancel() {
			      console.log('Cancel');
			    },
			});
		} else if(this.props.editOrNew == "新加作者") {
			console.log(this.props.editOrNew);
			console.log(this.state.gender);
			confirm({
			    title: '确定新增此作者吗?',
			    content: '',
			    okText: '确定',
			    okType: 'danger',
			    cancelText: '取消',
			    onOk() {
			    	if(thisTrue.state.authorName=="" || thisTrue.state.authorName==null ||thisTrue.state.authorName==undefined){
			    		thisTrue.error("","作者不能为空");
			    	}else{
			    		thisTrue.creatAuthor();
			    	}
			    },
			    onCancel() {
			      console.log('Cancel');
			    },
			});
		}
    }
    
    //请求作者默认数据
    GetAuthorDetail(){
    	var thisTrue = this;
    	fetch(getUrl.url, {
			method: "POST",
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: "method=ella.operation.getAuthorInfoByAuthorCode" + "&content=" + JSON.stringify({
				"authorCode":thisTrue.props.authorCode,
			})+dataString
		})
		.then(function(response){
			console.log(response);
			return response.json();
		})
		.then(function(response){
			console.log(response);
			if (response.status == 1) {
				console.log(response.data);
				thisTrue.setState({
					authorName:response.data.authorName,
					mobile:response.data.mobile,
					pinyin:response.data.pinyin
				})
			}
		})
    }
    
    //自动拉取模糊搜索的拼音
    setPY(e){
    	console.log(e.target.value);
    	var thisTrue = this;
    	fetch(getUrl.url, {
			method: "POST",
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: "method=ella.operation.getCN2PYInitial" + "&content=" + JSON.stringify({
				"text":e.target.value,
				"type":"MULTITONE_NO"
			})+dataString
		})
		.then(function(response){
			console.log(response);
			return response.json();
		})
		.then(function(response){
			console.log(response);
			if (response.status == 1) {
				console.log(response.data);
				thisTrue.setState({
					pinyin:response.data,
				})
			}
		})
    }
    
    //添加作者
    creatAuthor(){
    	var thisTrue = this;
    	fetch(getUrl.url, {
			method: "POST",
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: "method=ella.operation.insertNewBookAuthor" + "&content=" + JSON.stringify({
				"bookAuthorList":[{
					"writerType":"ELLA_AUTHOR",
					"authorName":thisTrue.state.authorName,
					"gender":"",
					"introduction":"",
					"countryName":"",
					"mobile":thisTrue.state.mobile,
					"pinyin":thisTrue.state.pinyin
				}]
			})+dataString
		})
		.then(function(response){
			console.log(response);
			return response.json();
		})
		.then(function(response){
			console.log(response);
			if (response.status == 1) {
				thisTrue.props.handleCancel();
			}else if(response.code == "30000006"){
				thisTrue.error("添加失败","作者已经存在");
			}else{
				thisTrue.error("添加失败","");
			}
		})
    }
    
    //编辑作者
    editAuthor(){
    	var thisTrue = this;
    	fetch(getUrl.url, {
			method: "POST",
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: "method=ella.operation.updateAuthorInfoByAuthorCode" + "&content=" + JSON.stringify({
				"bookAuthor":{
					"authorCode":thisTrue.props.authorCode,
					"writerType":"ELLA_AUTHOR",
					"authorName":thisTrue.state.authorName,
					"gender":"",
					"introduction":"",
					"countryName":"",
					"mobile":thisTrue.state.mobile,
					"pinyin":thisTrue.state.pinyin
				}
			})+dataString
		})
		.then(function(response){
			console.log(response);
			return response.json();
		})
		.then(function(response){
			console.log(response);
			if (response.status == 1) {
				console.log(response.data);
				thisTrue.props.handleCancel();
			}else if(response.code == "30000006"){
				thisTrue.error("添加失败","作者已经存在");
			}else{
				thisTrue.error("编辑失败","");
			}
		})
    }
    
    error(titles,contents) {
	  	Modal.error({
	    	title: titles,
	    	content: contents,
	  	});
	}
    
    
    render(){
    	var thisTrue = this;
		return (
			<div className="ellaAuthorDetail">
				<Spin spinning={this.state.loading} size="large">
					<div className="authorContent">
						<div>
							<span>作者姓名:</span>
							 <Input value={thisTrue.state.authorName?thisTrue.state.authorName:null} style={{ width: 150 }}  onChange={this.handleChange1} onBlur={this.setPY} />
						</div>
						
						<div>
							<span>姓名拼音:</span>
							 <Input value={thisTrue.state.pinyin?thisTrue.state.pinyin:null} style={{ width: 150 }}  onChange={this.handleChange4}/>
						</div>
						
						<div>
							<span>　手机号:</span>
							 <Input value={thisTrue.state.mobile?thisTrue.state.mobile:null} style={{ width: 150 }}  onChange={this.handleChange3}/>
						</div>
						
						<div className="saveAuthorBtn" onClick={this.saveAndClose}>保存</div>
					</div>
				</Spin>
			</div>
		);
	}
}
