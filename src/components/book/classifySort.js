/*
 	created by NiePengfei at 2017/12/6
 	图书——分类排序
 */

import React from 'react'
import {Table,Select,DatePicker,Button,Input ,Spin,Modal} from 'antd';
import { Link} from 'react-router';
import "./classifySort.css"
import getUrl from "../util.js"
import $ from 'jquery'
import up2 from './img/up2.png'
import down2 from './img/down2.png'
import ClassifyDetail from './classifyDetail.js'
import { dataString } from '../commonData.js'
const confirm = Modal.confirm;
const { Option, OptGroup } = Select;
const Search = Input.Search;
export default class ClassifySort extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
        	loading:true,
        	showBooks:false,
        	classifyName:"",
        	allBookLeiDetail:[],
        	pageMax:0,
        	visible:false,
        	classifySortName:"",
        	classifySortCode:"",
        	pageLengthNow:0
        }
        
        this.showConfirm = this.showConfirm.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
    }
    
    //即将插入本组件时，开始请求数据，准备渲染
    componentWillMount(){
    }
    
    //虚拟dom变成真实dom之后，开始绑定事件
    componentDidMount(){
    	this.setState({
			loading:false
		})
    	this.getAllBookLei();
    } 
    
    //获取所有图书分类的信息
    getAllBookLei(){
    	var thisTrue = this;
    	fetch(getUrl.url, {
			method: "POST",
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: "method=ella.operation.boxSearchList" + "&content=" + JSON.stringify({
				"type":"AUTO_BOX",
				"groupId":"operation.box.bookWikiClassList"
			})+dataString
		})
		.then(function(response){
			console.log(response);
			return response.json();
		})
		.then(function(response){
			console.log(response);
			if (response.status == 1) {
				
				thisTrue.setState({
					allBookLeiDetail:response.data,
					pageLengthNow:response.data.length
				},()=>{
					$(".classifySort .g-sortTbUp")[0].style.backgroundImage = "url("+up2+")";
			    	$(".classifySort .g-sortTbUp")[0].style.cursor = "default";
			    	$(".classifySort .g-sortTbDown")[thisTrue.state.allBookLeiDetail.length-1].style.backgroundImage = "url("+down2+")";
			    	$(".classifySort .g-sortTbDown")[thisTrue.state.allBookLeiDetail.length-1].style.cursor = "default";
				})
			}
		})
    }
    
    //上移
    upFunc(index){
    	console.log("上升到"+index);
		if (index!=0) {
			let dataOld,a,b;
			dataOld = this.state.allBookLeiDetail;
			a=this.state.allBookLeiDetail[index];
			b=this.state.allBookLeiDetail[index-1];
			dataOld[index-1] = a;
			dataOld[index] = b;
			
	    	this.setState({
	    		allBookLeiDetail:dataOld,
			})
		}
    }
    
    //下移
    downFunc(index){
    	console.log("下降的"+index);
    	if (index!=this.state.allBookLeiDetail.length-1) {
    		
    		//本地先将数组位置互换,  但是并没有将书籍的实际位置修改，即并未修改idx，他会在保存的时候修改
    		let dataOld,a,b;
			dataOld = this.state.allBookLeiDetail;
			a=this.state.allBookLeiDetail[index+1];
			b=this.state.allBookLeiDetail[index];
			dataOld[index] = a;
			dataOld[index+1] = b;
			
	    	this.setState({
	    		allBookLeiDetail:dataOld,
			})
    	}
    }
    
    
    //提交、保存 新的分类顺序
    showConfirm() {
    	var thisTrue = this;
    	//这里修改 分类的实际排序字段 idx
    	let newArr = this.state.allBookLeiDetail.map(function(item,index){
    		if (item.idx != index+1) {
    			item.idx = index+1;
    			return item;
    		}else{
    			return item;
    		}
    	})
    	
		confirm({
		    title: '确定发布新的分类排序吗！',
		    content: '',
		    onOk() {
		    	thisTrue.setState({
					loading:true
				})
		      	console.log('OK');
		    	fetch(getUrl.url, {
					method: "POST",
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					body: "method=ella.operation.updateBookWikiClassIdx" + "&content=" + JSON.stringify({
						"bookWikiClassList":newArr
					})+dataString
				})
				.then(function(response){
					console.log(response);
					return response.json();
				})
				.then(function(response){
					console.log(response);
					if (response.status == 1) {}
					thisTrue.setState({
						loading:false
					})
				})
		    },
		    onCancel() {
		      console.log('Cancel');
		    },
		});
	}
    
    showClassBook(className,classCode){
    	console.log(className);
    	console.log(classCode);
    	this.setState({
	      visible: true,
	      classifySortName:className,
	      classifySortCode:classCode
	    });
    }
    
    handleCancel(){
    	console.log("关闭");
	    this.setState({
	      visible: false,
	    });
	}
    
    
    render(){
    	var thisTrue = this;
    	var columns = [{
		  	title: '百科分类',
		  	dataIndex: 'wikiName',
		  	key: 'wikiName'
		}, {
		  	title: '图书数量',
		  	dataIndex: 'count',
		  	key: 'count',
		  	render(text, record,index) {
                return(
                    <div className="m-sortBookNum" onClick={() => thisTrue.showClassBook(record.wikiName,record.wikiCode)}>
                        {record.count}
                    </div>
                )
            }
		},{
		  	title: '操作',
		  	dataIndex: '',
		  	render(text, record,index) {
                return(
                    <div>
                     	<span className="g-sortTbUp" onClick={() => thisTrue.upFunc(index)}></span>
                     	<span className="g-sortTbDown" onClick={() => thisTrue.downFunc(index)}></span>
                    </div>
                )
            }
		}];
		return (
			<div className="classifySort">
				<Spin spinning={this.state.loading} size="large">
					<div className="classifySortTitle">
						分类排序
					</div>
					<div className="g-sortTable">
						<Table className="t-nm-tab" dataSource={this.state.allBookLeiDetail} columns={columns} pagination={false} scroll={{ y: ((this.state.pageLengthNow > 17) ? 720:0) }} />
					</div>
					
					<Button className="g-sortBtn" onClick={this.showConfirm}>发布</Button>
					
					
					<Modal
			          visible={thisTrue.state.visible}
			          title={this.state.classifySortName}
			          onCancel={thisTrue.handleCancel}
			          footer={null}
			          width={1000}
			        >
			        	{thisTrue.state.visible&&<ClassifyDetail classifySortCode={this.state.classifySortCode}></ClassifyDetail>}
			        </Modal>
				</Spin>
			</div>
		);
	}
}
