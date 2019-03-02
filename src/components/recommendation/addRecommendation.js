
/**
 * Created by Administrator on 2018/3/20.
 */
import React from 'react'
import { Table, notification, Modal, Pagination, Tooltip, Select, DatePicker, Button, Checkbox, Input, Icon, Spin, Row, Col, Form, Switch, Cascader, Radio, message, InputNumber,TimePicker } from 'antd';
import { Link, hashHistory } from 'react-router';
import getUrl from "../util.js";
import commonData from '../commonData.js';

// import './addCode.css';
import moment from 'moment';
const { MonthPicker, RangePicker } = DatePicker;
const confirm = Modal.confirm;
const FormItem = Form.Item;
const { Option, OptGroup } = Select;
const Search = Input.Search;
const RadioGroup = Radio.Group;
const { TextArea } = Input;

class addCode extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            //活动名称
            adviceName: '',
            activityAmount: "",         //用户数量
            whetherLimit: false,        //是否限量
            status: 'WAITING',                  //活动状态
            loading: false,
            books: [],
            vip: null,
            adviceType:'DAILY_CARD_POPUP',
            couponsList: [],
            startTime: '',
            startTime1:'',
            startTime2:'',
            endTime: '',
            visible: false,
            bookVisible: false,
            //奖励列表
            rewardBookList: [],
            pageVo: {
                page: '0',
                pageSize: '20'
            },
            bookName: [],
            bookNameData: [],
            book: {
                bookName: ''
            },
            bookFlag: true,
            vipFlag: true,
            redFlag: true,
            //红包下拉框接口
            resultItem: [],
            flag: false,
            targetContent: {
		        weekDay: "",
		        introduction:""
		    },
		    defauleName:'',
		    searchGroupList:[],
		    targetType:'BOOK_DETAIL',
		    AddOrEdit:"Add",
		    adviceDescription:'DAILY',
		    targetPage: {
			    targetTypeCode: "",
			    url: ""
			},
			startupCode:'',
			targetTypeList:[]
           
        };
        
       	
    }

    //即将插入本组件时，开始请求数据，准备渲染
    componentWillMount() {

    }

    //虚拟dom变成真实dom之后，开始绑定事件
    componentDidMount() {
    	this.TargetTypeList();
    	if(this.props.location.query.adviceCode){
    		this.RecommendDetail(this.props.location.query.adviceCode)
    	}
        this.setState({
            loading: false
        })
    }
    //拉取链接类型列表
	async TargetTypeList() {
		var data = await fetch(getUrl.url, {
			mode: "cors",
			method: "POST",
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: "method=ella.operation.boxSearchList" + "&content=" + JSON.stringify({
				
				groupId: "DAILY_CARD_BOX"
			})+commonData.dataString
		}).then(res => res.json())
		this.setState({
            targetTypeList:data.data,
            
       },()=>{
       		if(this.props.location.query.adviceCode){
       			
       		}else{
       			this.setState({
	       			select1: (
		                 <Select showArrow="true" defaultValue={this.state.targetType} style={{width:80}} onChange={(v)=>{this.selectReward(v)}}>
			                {
			                    this.state.targetTypeList.map(item => {
			                        return <Option value={item.searchCode}>{item.searchName}</Option>
			                    })
			                }
		                </Select>
		            )
	       		})
       		}
       		
       		
       	}
		)
		
	}
	async RecommendDetail(adviceCode) {
		
		var data = await fetch(getUrl.url, {
			mode: "cors",
			method: "POST",
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: "method=ella.operation.getAdviceInfo" + "&content=" + JSON.stringify({
				adviceType:'DAILY_CARD_POPUP',
				adviceCode:adviceCode
			})+commonData.dataString
		}).then(res => res.json())
		var startTime=data.data.startTime.split(" ");
		console.log(startTime)

		this.fetchGoodGroup(data.data.targetType,'');

		this.setState({
          	adviceName:data.data.adviceName,
          	startTime1:startTime[0],
          	startTime2:startTime[1],
          	targetContent:data.data.targetContent,
          	targetType:data.data.targetType,
          	startupCode:adviceCode,
          	
            select1: (
                 <Select showArrow="true" defaultValue={data.data.targetType} style={{width:80}} onChange={(v)=>{this.selectReward(v)}}>
	                {
	                    this.state.targetTypeList.map(item => {
	                        return <Option value={item.searchCode}>{item.searchName}</Option>
	                    })
	                }
                </Select>
            ),
      
          	targetPage: {
			    targetTypeCode:data.data.targetPage.targetTypeCode,
			    url: encodeURIComponent(data.data.targetPage.url)
			}
          	
        })
	}
	ContentChange(v){
		console.log(v)
		this.setState({
        	targetContent:{
	    		...this.state.targetContent,
				introduction:v
				
	    	}
            
        })
	}
    searchContent(value) {
        this.setState({
            book: {
                ...this.state.book,
                bookName: value
            }
        }, () => {
            this.bookListFn(this.state.book, this.state.pageVo)
        })
    }
    searchRedContent(value) {
        this.redListFn(value);
    }
    //获取红包下拉
    async redListFn(value) {
        var data = await fetch(getUrl.url, {
            mode: "cors",
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: "method=ella.operation.coupon.selectH5CouponActivity" + "&content=" + JSON.stringify({ searchType: 'ACTIVITY_NAME', searchContent: value, pageIndex: '1', pageSize: '20' }) + commonData.dataString
        }).then(res => res.json());
        console.log(data);
        this.setState({
            resultItem: data.data.couponActivityList
        })
    }
    //获取图书列表
    async bookListFn(book, pageVo) {
        this.setState({
            bookLoading: true
        });
        var data = await fetch(getUrl.url, {
            mode: "cors",
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: "method=ella.operation.searchBookByConditions" + "&content=" + JSON.stringify({ "book": book, "pageVo": pageVo, 'searchBoxType': 'BOOK_NAME', goods: this.state.goods }) + commonData.dataString
        }).then(res => res.json())
            .then((d) => {
                console.log(d);
                if (d.status == 1) {
                    const datalist = [];
                    var list = d.data.bookList;
                    for (let i = 0; i < list.length; i++) {
                        datalist.push({
                            bookName: list[i].bookName,
                            bookCode: list[i].bookCode
                        })
                    }
                    this.setState({
                        bookLoading: false,
                        bookName: datalist,
                    })
                } else {
                    message.error(d.message)
                    this.setState({
                        bookLoading: false,
                    })
                }
            })
    }
    //活动名称修改
    NoticeTitleChange(value) {
        console.log(value);
        this.setState({
            adviceName: value
        })
    }
    NoticeTitleChange(value) {
        console.log(value);
        this.setState({
            adviceName: value
        })
    }
    setOneKV(k, v) {
        this.setState({
            [k]: v
        })
    }
    setOneKV2(v) {
    	console.log(v)
    	if(this.state.targetType=="BOOK_DETAIL"){
    		var _url="ellabook2://detail.book?method=ella.book.getBookByCode"+"&bookCode="+v;
    	}else{
    		var _url="ellabook2://detail.course?courseCode="+v;
    	}
    	console.log(_url)
        this.setState({
            
            targetPage:{
	    		targetTypeCode:v,
				url:encodeURIComponent(_url)
				
	    	}
        })
    }
	daySelect(v) {
        this.setState({
        	targetContent:{
	    		...this.state.targetContent,
				weekDay:v
				
	    	}
            
        })
    }


    //图书奖励
    addBook() {
        this.setState({
            visible: false,
            bookVisible: true,

        })
        this.refs.addBooks.getInitList();
    }
    delBook(index) {
        console.log(index);

        this.setState({
            bookNameData: this.state.bookNameData.filter((item, _index) => index != _index),
            // rewardBookList:this.state.rewardBookList.filter((item,_index)=>index!=_index),
            books: this.state.books.filter((item, _index) => index != _index),
        }, () => {
            if (this.state.books.length == 0) {
                this.setState({
                    vipFlag: true,
                    redFlag: true,
                })
            }
            console.log(this.state.books.length);
        })
    }
    //会员奖励奖励
    addVip() {
        this.setState({
            rewardBookList: [
                ...this.state.rewardBookList,
                {
                    prizeCategory: 'VIP'
                }
            ],
            visible: false,
            bookFlag: false,
            redFlag: false,
            vipFlag: false,
        })
    }
    changeVip(value, index) {
        console.log(value);
        this.setState({
            rewardBookList: this.state.rewardBookList.map((item, _index) => { return index == _index ? { prizeCategory: 'VIP' } : item }),
            vip: value
        }, () => {
            console.log(this.state.rewardBookList);
        })
    }
    delVip(index) {
        console.log(index);
        this.setState({
            rewardBookList: this.state.rewardBookList.filter((item, _index) => index != _index),
            vip: null,
            bookFlag: true,
            redFlag: true,
            vipFlag: true,
        }, () => {
            console.log(this.state.rewardBookList);
        })
    }
    //红包奖励
    addRed() {
        this.setState({
            couponsList: [
                ...this.state.couponsList,
                {
                    coupons: ''
                }
            ],
            visible: false,
            bookFlag: false,
            vipFlag: false,
        })
    }
    changeRedPrice(value, index) {
        console.log(value);
        this.setState({
            // rewardBookList:this.state.rewardBookList.map((item,_index)=>{return index==_index ?  {coupons:value,prizeCategory:'COUPON'} : item}),
            couponsList: this.state.couponsList.map((item, _index) => { return index == _index ? { coupons: value } : item }),
        })
    }
    delRed(index) {
        console.log(index);
        this.setState({
            couponsList: this.state.couponsList.filter((item, _index) => index != _index),
            // coupons:this.state.coupons.filter((item,_index)=>index!=_index),

        }, () => {
            if (this.state.couponsList.length == 0) {
                this.setState({
                    bookFlag: true,
                    vipFlag: true,
                })
            }
            console.log(this.state.rewardBookList);
        })
    }
    disabledStartDate(current) {
        return current < moment().startOf('day');
    }
    disabledEndDate(current) {
        return current < moment().startOf('day');
    }
    startTimeChange(date, dateString) {
    	console.log(date)
        console.log(dateString);
    	this.setState({
            startTime1:dateString,
            targetContent: {
            	...this.state.targetContent,
		        weekDay:date.format('dddd')
		       
		    }
            
       },()=>{
       		console.log(this.state.startTime1)
       }
    	)
       
       
    }
    startTimeChange2(time, timeString) {
        console.log(timeString);
    	this.setState({
            startTime2: timeString,
           
        })
       
       
    }
    showModal = () => {
        this.setState({
            visible: true,
        });
    }
    handleOk = () => {
        this.setState({ visible: false });
    }
    handleCancel = () => {
        this.setState({ visible: false });
    }
    //添加活动
    async addwatchwordCodeFn(waCode, watchwordCode, coupons, books, vip, whetherLimit, activityAmount, status, startTime, endTime) {
        var doc = '';
        var doc2 = '';
        if (whetherLimit == true) {
            doc = 'NO';
            doc2 = '10000000';
        } else {
            doc = 'YES';
            doc2 = activityAmount;
        }
        if (books != null && books.length > 0 && books != '') {
            books = books.join(',');
            coupons = null;
            vip = null;
        } else if (coupons.length > 0 && coupons != null && coupons != '') {
            coupons = coupons.map(item => { return item.coupons }).join(',');
            books = null;
            vip = null;
        } else if (vip != null && vip != '') {
            books = null;
            coupons = null;
        }
        var data = await fetch(getUrl.url, {
            mode: "cors",
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: "method=ella.operation.saveWatchwordCode" + "&content=" + JSON.stringify({ 'waCode': waCode, "watchwordCode": watchwordCode, 'coupons': coupons, 'books': books, 'vip': vip, 'whetherLimit': doc, 'activityAmount': doc2, 'status': status, "startTime": new Date(startTime).getTime(), "finishTime": new Date(endTime).getTime() }) + commonData.dataString
        }).then(res => res.json())
            .then((d) => {
                console.log(d);
                if (d.status == 1) {
                    notification.success({
                        message: '保存成功',
                        // description: '回到上级菜单',
                    })
                    console.log(this.props.location.query.adviceCode)
                    if(this.props.location.query.adviceCode){
                       
                    }else{
                         window.history.back();
                    }
                    
                    message.error(d.message);
                }
            })
    }
    save() {
        console.log(this.state.books);
        if (this.state.watchwordCode == '') {
            message.warning('活动名称不能为空');
            return false;
        } else if (this.state.activityAmount == '' && this.state.whetherLimit == false) {
            message.warning('用户数量不能为空');
            return false;
        } else if (this.state.startTime == '') {
            message.warning('开始时间不能为空');
            return false;
        } else if (this.state.endTime == '') {
            message.warning('结束时间不能为空');
            return false;
        } else if (this.state.books.length == 0 && this.state.vip == null && this.state.couponsList.length == 0) {
            message.warning('请添加兑换商品');
            return false;
        }
        if (this.state.startTime > this.state.endTime) {
            message.warning('结束时间不能小于开始时间');
            return false;
        }
        if(this.state.activityAmount<=0&&this.state.whetherLimit==false){
            message.warning('数量不能少于0');
            return false;
        }
        this.addwatchwordCodeFn(null, this.state.watchwordCode, this.state.couponsList, this.state.books, this.state.vip, this.state.whetherLimit, this.state.activityAmount, this.state.status, this.state.startTime, this.state.endTime);
    }

    modelCancle(msg) {
        this.setState({
            bookVisible: msg
        });
    }
    // TODO:搜索图书包

    async fetchGoodGroup(targetType,value) {
        console.log(targetType)
        console.log(value)
        // TODO:地址连的mc的
        if(targetType=="BOOK_DETAIL"){
        	var doc = {
        		text:value,

        		"goodsState":'SHELVES_ON',
	            "page": 0,
	            "pageSize": 1000
	        }
        	var _url="method=ella.operation.getBookListByIdOrName"+ "&content=" + JSON.stringify(doc) + commonData.dataString;
        }else{
        	var doc2= {
            "courseName":value,
            "goodsState": "SHELVES_ON"
        }
        	var _url="method=ella.operation.getBookCourseList"+"&content=" + JSON.stringify(doc2) + commonData.dataString;
        }
        var data = await fetch(getUrl.url, {
            mode: "cors",
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: _url
        }).then(res => res.json());
        if (!data.data) return; //搜索出null直接return防止报错
        
        this.setState({
            searchGroupList: data.data.list ||data.data.bookList
        })
    }
    bookHandleOk = (selectedRowKeys, selectedRows) => {
        console.log(selectedRowKeys);
        console.log(selectedRows);
        var tmp = this.state.bookNameData;
        tmp.push(...selectedRows);
        //去重,遇到重复的书籍自动去重
        var hash = {};
        tmp = tmp.reduce(function (item, next) {
            hash[next.bookCode] ? '' : hash[next.bookCode] = true && item.push(next);
            return item
        }, []);
        var books = [];
        for (let i = 0; i < tmp.length; i++) {
            books.push(
                tmp[i].bookCode
            )
        }
        this.setState({
            bookVisible: false,
            bookNameData: tmp,
            // rewardBookList: datalist,
            books: books,
            vipFlag: false,
            redFlag: false,
        });
    }
    selectReward(v){
    	this.setState({
            targetType:v,
           	targetPage:{
           		...this.state.targetPage,
           		targetTypeCode:''
           	}
          

        });
    }
	showConfirm() {
        if (this.state.adviceName == '') {
            message.error('通知标题未填写');
            return;
        };
        if (this.state.adviceName.length > 20) {
            message.error('通知标题长度过长');
            return;
        };
        if (this.state.startTime1=='') {
            message.error('日期选择不能为空');
            return;
        };
        if (this.state.startTime2=='') {
            message.error('时间选择不能为空');
            return;
        };
       
        if (this.state.targetContent.introduction=='') {
            message.error('正文不能为空');
            return;
        };
         if(this.state.targetContent.introduction.length>40){
	  		var cur=this.state.targetContent.introduction.substring(0,40);
	  		this.setState({
	  			targetContent:{
	  				...this.state.targetContent,
	  				introduction:cur
	  				
	  			}
		     
		    })
	  		message.error('正文不能超过40个中文字符');
            return;	
	  	}
        if (this.state.targetPage.targetTypeCode=='') {
            message.error('请选择图书或者课程');
            return;
        };
        var _startTime=this.state.startTime1+" "+this.state.startTime2;
         
        console.log(_startTime);
        var doc = {
        	adviceType:this.state.adviceType,
            adviceName: this.state.adviceName,
            targetContent:this.state.targetContent,
            startTime: _startTime,
            endTime: _startTime,
            targetType: this.state.targetType,
            targetPage:this.state.targetPage,
            adviceDescription:this.state.adviceDescription,
            startupCode:this.state.startupCode,
            pushTarget:"REGISTER_USER",
            pushFrequency:"DAILY_PUSH"
        }
      	const _this=this;
        confirm({
            title: this.props.location.query.adviceCode
                ?
                <div>
              		  请确认是否修改该每日弹窗
               
                </div>
                :
                <div>
                  	请确认是否添加该每日弹窗
                 
                </div>
            ,
            // content: '点确定将提交后台',
            okText: '确定',
            okType: 'primary',
            cancelText: '继续编辑',
            onOk() {
                _this.handleSubmit(doc)
            },
            onCancel() {
                _this.setState({
                    isSubmit: true
                })
            },
        });
      

     
    }
	async handleSubmit(doc){
		
        var method2= this.props.location.query.adviceCode?'method=ella.operation.updateAdvice':'method=ella.operation.insertAdvice';
        var data = await fetch(getUrl.url, {
            mode: "cors",
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            // body: "method=ella.operation.insertAdvice" + "&content=" + JSON.stringify(doc)
            body:method2 + "&content=" + JSON.stringify(doc) + commonData.dataString
        }).then(res => res.json());

        if (data.status == 1) {
            message.success('添加成功');
              if(!this.props.location.query.adviceCode){
                  setTimeout(() => {
                        hashHistory.push('/recommendation');
                    }, 1000) 
                }
          

            // window.history.back();
        } else if (data.code == '10001001') {
            message.error('目标用户uid不存在');
            this.setOneKV('isSubmit', true);
        } else if (data.code == '70000001') {
            message.error('每日弹窗时间冲突');
            this.setOneKV('isSubmit', true);
        } else {
            message.error('添加失败');
            this.setOneKV('isSubmit', true);
        }
	}
    render() {
        var w = this;
        var obj = {};
        var arr = this.state.bookNameData;
        arr = arr && arr.length ? arr.reduce((item, i) => {
            obj[i.bookName] ? '' : obj[i.bookName] = true && item.push(i);
            return item
        }, []) : [];
        console.log(this.state)
        return (
            <div className="g-bookList">
                <p className="m-head">
                    <Link to="/recommendation">
                        <Icon type="left" /> {this.props.location.query.adviceCode?"修改每日弹窗":"添加新的每日弹窗"}
                    </Link>
                </p>
                <div className="m-addSign-bd">
                    <Spin tip="加载中..." spinning={this.state.loading} size="large" style={{ zIndex: 9999 }}>
                        <Row className="m-input">
                            <Col span={2} style={{ width: 170, textAlign: 'right' }}><span className="u-txt">通知标题</span></Col>
                            <Col span={5}>
                                {
                                    <Input style={{ width: 260 }} value={this.state.adviceName} onChange={(e) => this.NoticeTitleChange(e.target.value)} />
                                }
                            </Col>
                        </Row>
                        <Row className="m-input">
                            <Col span={2} style={{ width: 170, textAlign: 'right' }}><span className="u-txt">日期选择</span></Col>
                            <Col span={4}>
                                <DatePicker
                                   
                                    showTime
                                    style={{ width: "100%" }}
                                    format="YYYY-MM-DD"
                                    placeholder={['选择日期']}
                                    value={this.state.startTime1 != '' ? moment(this.state.startTime1, 'YYYY-MM-DD') : null}
                                    
                                    onChange={(date, dateString) => { this.startTimeChange(date, dateString) }}
                                />
                            </Col>
                            <Col span={2}>
                                {
                                    <Input style={{marginLeft:40}} value={this.state.targetContent.weekDay} onChange={(e)=>{this.daySelect(e.target.value)}} />
                                }
                            </Col>
                        </Row>
                        {
//                      	<Row className="m-input">
//	                            <Col span={2} style={{ width: 170, textAlign: 'right' }}><span className="u-txt">{this.props.location.query.type=="1"?"图书名称":"课程名称"}</span></Col>
//	                            <Col span={5}>
//	                                {
//	                                    <Input style={{ width: 260 }} onChange={(e) => this.watchwordCodeChange(e.target.value)} />
//	                                }
//	                            </Col>
//                      	</Row>
                        }
                        <Row className="m-input">
                        <Col span={2} style={{ width: 170, textAlign: 'right' }}><span className="u-txt">链接目标</span></Col>
                            <Col span={3}>
                                {this.state.select1}
                                
                            </Col>
                             
                                <Col offset={4}>
                                    {
                                        this.state.targetType == 'BOOK_DETAIL'
                                            ?
                                            <Select
                                            	showArrow
                                                showSearch
                                                style={{ width: 200 }}
                                                placeholder="搜索图书"
                                                optionFilterProp="children"
                                                onChange={(v) => { this.setOneKV2(v); }}

                                                onSearch={(v) => { console.log("hhh");this.fetchGoodGroup("BOOK_DETAIL",v) }}
                                                onFocus={() => { this.fetchGoodGroup("BOOK_DETAIL","") }}

                                              	value={this.state.targetPage.targetTypeCode}
                                                
                                            >
                                                {
                                                    this.state.searchGroupList.map(item => {
                                                    	
                                                        return <Option value={item.bookCode}>{item.bookName}</Option>
                                                    })
                                                }
                                            </Select>
                                            : null
                                    }
                                </Col>
                                <Col offset={4}>
                                    {
                                        this.state.targetType == 'BOOK_COURSE'
                                            ?
                                            <Select
                                            	showArrow
                                                showSearch
                                                style={{ width: 200 }}
                                                placeholder="搜索课程"
                                                optionFilterProp="children"
                                                onChange={(v) => { this.setOneKV2(v); }}
                                                onSearch={(v) => { console.log("hhh2");this.fetchGoodGroup("BOOK_COURSE",v) }}
                                                onFocus={(v) => { this.fetchGoodGroup("BOOK_COURSE","") }}

                                               
                                                value={this.state.targetPage.targetTypeCode}
                                            >
                                               
                                                {
                                                    this.state.searchGroupList.map(item => {
                                                        return <Option value={item.courseCode}>{item.courseName}</Option>
                                                    })
                                                }
                                            </Select>
                                            : null
                                    }
                                </Col>
                               
                            
                        </Row>
                        <Row className="m-input">
                            <Col span={2} style={{ width: 170, textAlign: 'right' }}><span className="u-txt">正文</span></Col>
                            <Col span={5}>
                                {
                                    <TextArea rows={4} value={this.state.targetContent.introduction} onChange={(e) => this.ContentChange(e.target.value)}/>
                                }
                            </Col>
                        </Row>
                        <Row className="m-input">
                            <Col span={2} style={{ width: 170, textAlign: 'right' }}><span className="u-txt">定时发布时间</span></Col>
                            <Col span={4}>
                               <TimePicker onChange={(time, timeString) => { this.startTimeChange2(time, timeString) }} value={this.state.startTime2 != '' ?moment(this.state.startTime2, 'HH:mm:ss'): null} defaultOpenValue={moment('00:00:00', 'HH:mm:ss')} />
                            </Col>
                        </Row>
                    </Spin>
                </div>
                <Row style={{ marginTop: '45px',"width":"60%","text-align":"center"}}>
                    <Col>
                        <Button
                            onClick={() => {
                                
                                this.showConfirm();
                               
                            }}
                            type='primary'>保存</Button>
                    </Col>
                </Row>
            </div>
        );
    }
}
// firstPartner = Form.create()(firstPartner)

export default addCode;

//
//content: 
//{"adviceType":"DAILY_CARD_POPUP",
//"adviceName":"测试广澳很富",
//"targetContent":{"weekDay":"星期四","introduction":"附件加分加分"},
//"startTime":"2018-07-12 03:03:03",
//"endTime":"2018-07-12 03:03:03",
//"targetType":"BOOK_DETAIL",
//"targetPage":{"targetTypeCode":"B201801190021","url":"ellabook2://detail.book?bookCode=B201801190021method: 
//ella.book.getBookByCode"},
//"adviceDescription":"DAILY"}
//uid: 
//U201804181104302936678
//token: 
//B03D6618D8424D39AE95D17D1CBC3AC5

