import React from 'react'
import { Link, hashHistory } from 'react-router'
import { Form, Input, Row, Col, Button, Select, Radio, Table, Icon, message,Popconfirm, Layout,InputNumber,Checkbox} from 'antd';
import getUrl from '../util';
import commonData from '../commonData.js';
const CheckboxGroup = Checkbox.Group;
import 'whatwg-fetch';
import './addListenRecommend.less';
import AddListenModal from "./AddListenModal.js";
import ComSelectBook from '../commonSelectBook.js';
const {
    Sider, Content
} = Layout;
var util = require('../util.js');
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const targetTypeData = [
    {
        key: 'BOOK_LIST',
        value: '推荐专栏'
    },
    {
        key: 'SYSTEM_INTERFACE',
        value: '系统界面'
    },
    {
        key: 'H5',
        value: 'H5页面'
    },
    {
        key: 'BOOK_DETAIL',
        value: '图书详情'
    },
    {
        key: 'COURSE_DETAIL',
        value: '课程详情'
    }
];


class addListenRecommend extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            audioList: [],
            bookDetailUrl: '',
            idx: 0,
            searchPageName: '',
            searchId: "",//跳转其他
            listenName: "",//推荐模块标题
            listType: "HORIZONTAL_NO_SUBTITLE",//展示样式
            homeShowNum: "",//展示数量
            targetType: "BOOK_LIST",//跳转的目标类型
            jumpDesc: "",//跳转链接文字
            targetPage: "",//跳转链接
            jumpType: "JUMP_CURRENT",//跳转类型
            visible: false,
            total: '',
            most: 'LIST_LATEST_BOOK',//最新最热
            num: '',//获取数量
    
            h5TargetPage: '',
            bookDetailName: '',
            h5Flag: {
                display: 'none'
            },
            bookDetailFlag: {
                display: 'none'
            },
            searchGroupList:[],
            listenCode:this.props.params.listenCode,
            status:this.props.params.status,
            visible2:false,
            page:0,
            pageSize:20,
            platformCode:'',
            platformList:[],
            hdShowNum:''


        }
      
    }
    componentDidMount() {
        if (this.state.status=="edit") {
            this.ListenRecommendDetail();
            this.fetchRecommendList();
        } else {
            this.setState({
                targetType: targetTypeData[0].key
            });
            // this.selectTargetType(0);
            // this.selectTargetPage(targetTypeData[0].key);
        }
        this.fetchPlatformList("SYSTEM_PLATFORM");

    }
     //平台下拉框数据
    fetchPlatformList(groupId) {
        getUrl.API({groupId},"ella.operation.boxSearchList")
        .then(response=>response.json())
        .then(response=>{
            if(response.status==1){
                var cur=response.data.filter(item => item.searchCode != 'GUSHIJI');
                this.setState({
                    platformList:cur.map((item, index) => {
                        return {
                            ["label"]: item.searchName,
                            ["value"]: item.searchCode
                        }
                    })
                
                  
                })
            }else{
                console.log(response.message)
            }
          
        }) 
    }
    ListenRecommendDetail() {
        getUrl.API({listenCode:this.state.listenCode},"ella.operation.lbListenDetail")
        .then(response=>response.json())
        .then(response=>{
            if(response.status==1){
        //     if (data.data.targetType == 'BOOK_LIST') {
        //         this.setState({
        //             targetValue: targetTypeData[0].value,
        //             targetKey: targetTypeData[0].key
        //         })
        //         this.selectTargetType(0);
    
        //     }
        //     if (data.data.targetType == 'SYSTEM_INTERFACE') {
        //         this.setState({
        //             targetValue: targetTypeData[1].value,
        //             targetKey: targetTypeData[1].key
        //         })
        //         this.selectTargetType(1);
    
    
        //     }
        //     if (data.data.targetType == 'H5') {
        //         this.setState({
        //             targetValue: targetTypeData[2].value,
        //             targetKey: targetTypeData[2].key
        //         })
        //         this.selectTargetType(2);
        //     }
        //     if (data.data.targetType == 'BOOK_DETAIL') {
        //         this.setState({
        //             targetValue: targetTypeData[3].value,
        //             targetKey: targetTypeData[3].key
        //         })
        //         this.selectTargetType(3);
        //     }
        //     if (data.data.targetType == 'COURSE_DETAIL') {
        //         this.setState({
        //             targetValue: targetTypeData[4].value,
        //             targetKey: targetTypeData[4].key,
        //             searchGroupList: [],
        //             defauleName: data.data.searchPageName,
        //         })
        //         this.selectTargetType(4);
        //     }
        //     this.selectTargetPage(data.data.targetType);
                this.setState({
                    listenName:response.data.listenName,
                    listType: response.data.listType,
                    homeShowNum: response.data.homeShowNum,
                    jumpDesc: response.data.jumpDesc,
                    jumpType: response.data.jumpType,
                    platformCode:response.data.platformCode.split(","),
                    hdShowNum:response.data.hdShowNum
                })

            }else{
                message.error(response.message)
            }
        })
       
    }
    //获取详情听书列表
    fetchRecommendList(){
        getUrl.API({listenCode:this.state.listenCode},"ella.operation.queryByLbListenCode")
		.then(response=>response.json())
		.then(response=>{
			if(response.status==1){
                this.setState({
                    audioList:response.data
                })
            }else{
               console.log(response.message)
            }
        })
    }
  
  
    handleTargetTypeChange = (value) => {
       
        this.selectTargetPage(value.key);
        this.setState({
            targetType: value.key,
            targetKey: value.key,
            targetValue: value.label,
            bookDetailUrl:"",
            searchPageName:"",
            bookDetailName:""

        });
    }
    handleTargetPageChange = (value) => {
        this.setState({
            searchPageName: value.label,
            idx: value.key,
            searchId: this.state.childSelectContent[value.key].searchId
        });
    }
  
     //目标链接选择
     selectTargetType = (n) => {
        this.setState({
            targetTypeSelect: (
                <Select labelInValue defaultValue={{ key: targetTypeData[n].value }} style={{ width: 120 }} onChange={this.handleTargetTypeChange}>
                    {
                        targetTypeData.map((item, index) => {
                            return <Option value={item.key} key={item.key}>{item.value}</Option>
                        })
                    }
                </Select>
            )
        })
    }
    selectTargetPage(targetType){
        getUrl.API({"groupId":targetType},"ella.operation.boxSearchList")
        .then(response=>response.json())
        .then(response=>{
            if(response.status==1){
                console.log(this.state.searchId)
                response.data.map((item, idx) => {
                    if (item.searchId == this.state.searchId) {
                        this.setState({
                            idx: idx
                        })
                    }
                })
                if (targetType == 'BOOK_LIST' || targetType == 'SYSTEM_INTERFACE') {
                    this.setState({
                        childSelectContent: response.data,
                        idx: this.state.status == "add" ? 0 : this.state.idx,
                        targetPageSelect: (<Select 
                                labelInValue 
                                defaultValue={{ key: this.state.idx }} 
                                style={{ width: 120, marginLeft: 20 }} 
                                onChange={this.handleTargetPageChange}
                            >
                            {
                                response.data.map((item, index) => {
                                    return <Option value={index} key={index}>{item.searchName}</Option>
                                })
                            }
                        </Select>),
                        h5Flag: {
                            display: 'none'
                        },
                        bookDetailFlag: {
                            display: 'none'
                        }
                    });
                } else if (targetType == 'H5') {
                    this.setState({
                        targetPageSelect: '',
                        bookDetailFlag: {
                            display: 'none'
                        },
                        h5Flag: {
                            display: 'block'
                        }
                    });
                }else if (targetType == 'BOOK_DETAIL') {
                    this.setState({
                        targetPageSelect: '',
                        h5Flag: {
                            display: 'none'
                        },
                        bookDetailFlag: {
                            display: 'block'
                        }
                    });
                }else if (targetType == 'COURSE_DETAIL') {
                    this.setState({
                        targetPageSelect: '',
                        h5Flag: {
                            display: 'none'
                        },
                        bookDetailFlag: {
                            display: 'none'
                        }
                    });
                }
               
            }else{
                message.error(response.message)
            }
        })   
    }
 

    handleChanges = (name1, value1, name2, value2) => {
        this.getSubmitData(name1, value1, name2, value2)
    }
    //添加模块
    AddListenRecommend(){
        console.log(platformCode)
        // let reg = /(\d+)\′(\d+)\″/;
        // console.log(parseInt(this.state.audioList[0].audioTimeLength.match(reg)[1]*60)+parseInt(this.state.audioList[0].audioTimeLength.match(reg)[2]))

        let childSelectContent = this.state.childSelectContent;
        this.props.form.validateFields((err, values) => {
            if (err) {
                return ;
            }
            if (this.state.audioList.length == 0) {
                message.error("请添加听书!");
                return;
            }
            const params={
                listenCode:this.state.status=="add"?"":this.state.listenCode,
                listenName:values.listenName,
                listType:values.listType,
                homeShowNum:values.homeShowNum,
                hdShowNum:values.hdShowNum,
                jumpType:values.jumpType,
                jumpDesc:values.jumpDesc,
                voiceTotalTime:this.state.audioList.reduce((prev, cur) =>prev +cur.audioTimeLength, 0),
                columnStyle:"HORIZONTAL_NO_SUBTITLE",
                platformCode:values.platformCode.join(),
                // this.state.audioList.reduce((prev, cur) =>prev +cur.audioTimeLength, 0); 
                audioList:this.state.audioList.map(item=>item.audioCode).join(",")
            }
            console.log(params);
            // if (params.targetType == 'H5') {
               
            //     params.searchId='';
            //     params.searchPageName='h5页面';
            //     params.targetPage=this.props.form.getFieldsValue().h5TargetPage;
               
            // }else if (params.targetType == 'BOOK_DETAIL'||params.targetType == 'COURSE_DETAIL') {
            //     params.searchId='';
            //     params.searchPageName=this.state.bookDetailName;
            //     params.targetPage=this.state.bookDetailUrl;
            // }else{
            //     params.searchId=childSelectContent[this.state.idx].searchId,
            //     params.searchPageName=childSelectContent[this.state.idx].searchName,
            //     params.targetPage=childSelectContent[this.state.idx].searchCode
            // }
          
            // params.audioList=this.state.audioList.map(item=>item.audioCode).join(",");
            // if (params.jumpType == "JUMP_CURRENT") {
            //     params.targetType = "BOOK_LIST";
            //     params.targetPage = 'ella.book.listBookCommons';
                
            // }
            // console.log(params)
            // if (params.targetPage == '') {
            //     message.error("链接目标不能为空");
            //     return;
            // }
            // if (params.targetType == "H5") {
            //     var str = /http\:\/\/|https\:\/\/|ellabook\:\/\/|ellabook2\:\/\//;
              
            //     if(!str.test(params.targetPage)) {
            //         message.error('H5链接地址格式不正确！');
            //         return;
            //     }
            // }
            // params.targetPage=encodeURIComponent(params.targetPage);
            var url=this.state.status=="add"?"ella.operation.addLbListen":"ella.operation.updateLbListen";
            getUrl.API(params,url)
            .then(response=>response.json())
            .then(response=>{
                if (response.status == 1) {
                    message.success("保存成功");
                    if(this.state.status=="add"){
                        setTimeout(() => {
                            hashHistory.push('/listenBookPartList');
                        }, 2000)
                    }
                    
                } else {
                    message.error(response.message); 
                }
            })
        })
    }
    getSubmitData(str1, value1, str2, value2) {
        this.setState({
            [str1]: value1,
            [str2]: value2
        })
    }
    sortArr = (n) => {
        var data = this.state.audioList;
        data.unshift(data.splice(n, 1)[0]);
        this.setState({
            audioList: data,
            status3: this.state.status3 + 1,
        })
    }
    arrowDown = (n) => {
        if (n == this.state.audioList.length - 1) {
            message.error(`不可向下移！`);
        } else {
            var data = this.state.audioList;

            var arr1 = data[n];
            data[n] = data[n + 1];
            data[n + 1] = arr1;

            this.setState({
                audioList: data,
                status3: this.state.status3 + 1,
            })
        }
    }
    arrowUp = (n) => {
        if (n == 0) {
            message.error(`不可向上移！`);
        } else {
            var data = this.state.audioList;
            var arr1 = data[n - 1];
            data[n - 1] = data[n];
            data[n] = arr1;

            this.setState({
                audioList: data,
                status3: this.state.status3 + 1,

            })
        }
    }
    arrowDelete = (key) => {
      
        var data = this.state.audioList.filter(item => {
            if (item.audioCode !== key.audioCode) {
                return item
            }
        });
        
        this.setState({
            audioList: data

        })
    }
  
    setStateFn(key,value){
        this.setState({
            [key]: value
        })
    }
    getMostData(num){
        if (!!num) {
           
        }else{
            message.error('请输入获取数量！');
            return;
        }
        if (num < 0) {
            message.error('获取数量不能为负数');
            return;
        }
        fetch(getUrl.url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: "method=ella.operation.getLatestAudioList" + "&content=" + JSON.stringify({num}) + commonData.dataString
        }).then(res => res.json()).then((data) => {
            this.setState({
                audioList: data.data //最新图书列表
            })
        })

    }
    //点添加听书列表，弹出模糊搜索的Modal
    showModal(){
        this.setState({
            visible2: true,
        });
        this.refs.AddListenReso.fetchDataList();
    }
    handleOk(bookCode,bookName){
        this.props.form.setFieldsValue({
            bookDetailName:bookName,
        });
        this.setState({
            bookDetailUrl: 'ellabook://detail.book?bookCode=' +bookCode + '&method=ella.book.getBookByCode',
            visible: false,
            bookDetailName:bookName
        })
    }
    handleOk2 = (selectedRowKeys, selectedRows) => {
      
        var tmp = this.state.audioList;
        tmp.push(...selectedRows);
        //去重,遇到重复的书籍自动去重
        var hash = {};
        tmp = tmp.reduce(function (item, next) {
            hash[next.audioCode] ? '' : hash[next.audioCode] = true && item.push(next);
            return item
        }, []);

        this.setState({
            visible2: false,
            audioList: tmp
        });

        
    }
    modelCancle(msg) {
        this.setState({
            visible2: msg
        });
    }
    bookDetailSearch(){
        this.refs.childrenModal.showModal();
    }
     async fetchGoodGroup(str) {
    	var doc2= {
            "courseName": "",
            "goodsState": "SHELVES_ON"
    	}
        var data = await fetch(util.url, {
            mode: "cors",
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: "method=ella.operation.getBookCourseList"+"&content=" + JSON.stringify(doc2) + commonData.dataString
        }).then(res => res.json());
       
        if (!data.data) return; //搜索出null直接return防止报错
        this.setState({
            searchGroupList: data.data.list || []
        })
    }
    ValidateListenName = (rule, value, callback) => {
        const form = this.props.form;
        if (value.trim().length>10) {
            callback("限制10个中文字符以内！")
        }
        callback();
    }
    render() {
        const { getFieldDecorator} = this.props.form;
        const style = { marginBottom: '20px', borderBottom: "1px solid #ccc", paddingBottom: '10px' }
        var columns = [
            {
                title: '序号',
                width: "15%",
                key: 'id',
                render: (text, record, index) => {
                    return (
                        <div>
                            {index + 1}
                        </div>
                    )
                }
            }, {
                title: '音频ID',
                width: "15%",
                dataIndex: 'audioCode',
                key: 'audioCode',
            }, 
            {
                title: '音频名称',
                width: "15%",
                dataIndex: 'audioName',
                key: 'audioCode',
            },
            {
                title: '关联图书',
                width: "20%",
                dataIndex: 'bookName',
                key: 'bookName',
                render:(text,record)=>{
                    return <span>{!!text?text:"无"}</span>

                }
            }, 
            {
                title: '音频状态',
                width: "15%",
                dataIndex: 'isShelves',
                key: 'isShelves',
            }, 
            {
                title: '操作',
                width: "20%",
                key: 'action',
                render: (text, record, index) => {
                    return (
                        <div>
                            <span style={{ cursor: "pointer" }} onClick={() => { this.sortArr(index) }}>置顶</span>
                            <span className="ant-divider" />
                            <i className="i-action-ico i-up" onClick={() => { this.arrowUp(index) }}></i>
                            <span className="ant-divider" />
                            <i className="i-action-ico i-down" onClick={() => { this.arrowDown(index) }}></i>
                            <span className="ant-divider" />
                            <Popconfirm title="确定删除吗?" onConfirm={() => {
                                this.arrowDelete(record)
                            }}>
                                <i className="i-action-ico i-delete" ></i>
                            </Popconfirm>
                        </div>
                    )
                }
            }
        ]
        const columns2 = [{
            title: '图书标题',
            width: '25%',
            dataIndex: 'bookName'
        }, {
            title: '图书编码',
            width: '25%',
            dataIndex: 'bookCode'
        }, {
            title: '出版时间',
            width: '25%',
            dataIndex: 'publishTime'
        }, {
            title: '图书状态',
            width: '25%',
            dataIndex: 'goodsState',
            render: (text, record) => {
                return <div>
                    {text == 'SHELVES_WAIT' ? <span>待上架</span> : (
                        text == 'SHELVES_ON' ? <span>已上架</span> : <span>已下架</span>
                    )}
                </div>
            }
        }];
        return (
            <div id="addListenRecommend"  style={{ padding: "10px 10px 0" }}>
                <Row style={style}>
                    <Link to={this.props.params.target=="current"?"/listenBookPartList":this.props.params.target=="index"?"/listenBookHomePage":"/listenBookSleepList"} style={{ color: "#666" }}>
                        <Col span={4} style={{ fontSize: "16px" }}>
                            <Icon type="left" />
                            {this.props.params.status== "add" ? "添加新推荐" : "编辑新推荐"}
                        </Col>
                    </Link>
                </Row>
                <Layout>
                <Sider
                   width="220px"
                    style={{background:"#f0f2f5","marginLeft":"20px","borderRight":"1px solid rgb(204, 204, 204)","marginRight":"40px","paddingRight":"20px"}}
                >
                <p style={{fontSize:"18px"}}>基础信息设置</p>
                <Form>
                  
                    <FormItem
                        label="推荐标题"
                    >
                        {getFieldDecorator('listenName', {
                            initialValue: this.state.listenName,
                            rules: [
                                { 
                                    required: true, 
                                    message: '名称不能为空！' 
                                },
                                {
                                    validator: this.ValidateListenName,
                                }
                                // {
                                //     max:10,
                                //     message:'限制10个中文字符以内！'
                                // }
                            ],
                        })(
                            <Input style={{ width: '200px' }}/>
                        )}
                    </FormItem>
                    <FormItem
                        label="展示样式"
                    >
                        {getFieldDecorator('listType', {
                            initialValue: this.state.listType,
                            rules: [{ required: true, message: '样式不能为空' }],
                        })
                        (
                            <Select 
                                style={{ width: '200px' }} 
                                value={this.state.listType} 
                                onChange={(value) =>this.handleChanges("listType", value)}
                            >
                                <Option value="HORIZONTAL_NO_SUBTITLE">横向滑动</Option>
                                <Option value="PORTRAIT_WITH_SUBTITLE">纵向滑动</Option>
                            </Select>
                        )
                        }
                    </FormItem>
                    <FormItem
                        label="平台选择"
                    >
                        {getFieldDecorator('platformCode', {
                            initialValue: this.state.platformCode,
                            rules: [{ required: true, message: '平台必选！' }],
                        })
                        (
                            <CheckboxGroup
                                options={this.state.platformList}
                            />
                        )
                        }
                    </FormItem>

                    <FormItem
                        label='移动客户端展示数量'
                    >
                        {getFieldDecorator('homeShowNum', {
                            initialValue: this.state.homeShowNum,
                            rules:[
                                {
                                    required:true,
                                    message:"展示数量必须大于等于1！"
                                }
                            ]
                        })
                        (<InputNumber 
                            min={1} 
                            max={10} 
                            placeholder="请填写数量" 
                            style={{ width: '200px' }} 
                        />
                        )}
                    </FormItem>
                    <FormItem
                        label='HD客户端展示数量'
                    >
                        {getFieldDecorator('hdShowNum', {
                            initialValue: this.state.hdShowNum,
                            rules:[
                                {
                                    required:true,
                                    message:"展示数量必须大于等于1！"
                                }
                            ]
                        })
                        (<InputNumber 
                            min={1} 
                            max={10} 
                            placeholder="请填写数量" 
                            style={{ width: '200px' }} 
                        />
                        )}
                    </FormItem>
                    <FormItem
                        label="跳转链接文字"
                    >
                        {getFieldDecorator('jumpDesc', {
                            initialValue: this.state.jumpDesc,
                            rules:[
                                {
                                    required:true,
                                    message:"跳转链接文字不能为空！"
                                },
                                {
                                    max:5,
                                    message:'限制5个中文字符以内！'
                                }
                            ]
                        })
                        (<Input style={{ width: '200px' }} />
                        )}
                    </FormItem>
                    <FormItem
                        label="链接目标"
                    >
                        {getFieldDecorator('jumpType', {
                            initialValue: this.state.jumpType,
                            rules:[
                                {
                                    required:true
                                }
                            ]
                        })
                        (<RadioGroup disabled="true" style={{ width: '200px' }} >
                            <Radio value="JUMP_CURRENT">跳转到当前列表</Radio>
                            <Radio value="PLAY_CURRENT">播放当前列表</Radio>
                            {/* <Radio value="JUMP_OTHER">跳转到其他</Radio> */}
                        </RadioGroup>
                        )}
                        
                    </FormItem>
                    {
                        this.props.form.getFieldValue('jumpType')=="JUMP_OTHER"&&<FormItem
                            id="control-input"
                            style={{"marginLeft":"12.5%"}}
                        >
                            {this.state.targetTypeSelect}
                            {this.state.targetPageSelect}
                            {getFieldDecorator('h5TargetPage', {
                                initialValue: this.state.h5TargetPage,
                            })(
                                <Input style={this.state.h5Flag} className="H5Input"/>
                            )}
                            {
                                this.state.targetType == 'COURSE_DETAIL'&&<Select
                                    showSearch
                                    style={{ width: 200,"marginLeft":"20px"}}
                                    optionFilterProp="children"
                                    onChange={(v) =>this.setState({bookDetailUrl: 'ellabook2://detail.course?courseCode=' +v})}
                                    onSearch={(e) => { this.fetchGoodGroup(e) }}
                                    onFocus={() => { this.fetchGoodGroup("") }}
                                    // notFoundContent="123" 
                                    defaultValue={this.state.defauleName}
                                >
                                    {
                                        this.state.searchGroupList.map(item => {
                                            return <Option value={item.courseCode} key={item.courseCode}>{item.courseName}</Option>
                                        })
                                    }
                                </Select>
                                
                            }
                        </FormItem>
                    }
                    {
                        this.props.form.getFieldValue('jumpType')=="JUMP_OTHER"&&<FormItem style={this.state.bookDetailFlag}>
                            {getFieldDecorator('bookDetailName', {
                                initialValue: this.state.bookDetailName
                            })(
                                <Input style={{ width: 200, marginLeft: "15%" }} disabled="true" />
                            )}
                            <Button 
                                onClick={()=>this.bookDetailSearch()}
                            ><Icon type="search" /></Button>
                        </FormItem>
                    }
                   <ComSelectBook ref="childrenModal" handleOk={(bookCode,bookName) => this.handleOk(bookCode,bookName)} />
                 
                    <AddListenModal ref="AddListenReso" visible={this.state.visible2} modelCancle={msg => this.modelCancle(msg)} handleOk={(selectedRowKeys, selectedRows) => this.handleOk2(selectedRowKeys, selectedRows)} />
                   
                </Form>
                </Sider>
                <Content>
                    <p style={{"fontSize":"18px"}}>听书推荐列表配置</p>
                    <p style={{"text-align":"right","marginRight": "3.16667%"}}>列表总数：{this.state.audioList.length}</p>
                    <Row style={{lineHeight: '50px', height: '50px',"marginRight": "3.16667%"}}>
                        <Col style={{ fontSize: '14px', color: "#fff", float: 'left' }}>
                            <Popconfirm title="确定清空列表吗?" onConfirm={() =>this.setState({audioList:[]})}>
                                <Button type="primary" icon="delete" className="ant-btn-add">清空列表</Button>
                            </Popconfirm>
                        </Col>
                        <Col style={{ float: 'right' }}>
                            <Button type="primary" className="ant-btn-add" icon="plus" onClick={()=>this.showModal()} style={{"marginRight":"20px"}}>添加音频</Button>
                            <Button className="ant-btn-blue" type="primary" htmlType="submit" onClick={() =>this.AddListenRecommend()}>保存为听书推荐列表</Button>
                        </Col>
                    </Row>
                    <Row>
                        <Col offset={1} style={{ marginRight: '3.16667%' }}>
                            <div data-page="addModal">
                                <Row style={{background:"#fff",padding: '0 20px',lineHeight: '50px', height: '50px' }}>
                                    <span>获取规则：</span>   
                                    <Select style={{ width: '100px',"marginRight":"20px"}} value="NEW_VIP" onChange={(value) =>this.setStateFn("most",value)}>
                                        <Option value="NEW_VIP">最新上架</Option>
                                    </Select>
                                    <Input style={{ width: '100px',"marginRight":"20px"}} placeholder="获取数量" onBlur={(e) =>this.setStateFn("num",e.target.value)} />
                                    <Button className="ant-btn-blue" type="primary" onClick={() => this.getMostData(this.state.num)}>获取</Button>
                                </Row>
                                <Table className="addLisBooTable" rowKey={(record, index)=>index} columns={columns} dataSource={this.state.audioList} pagination={false} scroll={{ y: (this.state.audioList.length > 11 ? 450 : 0) }} />
                            </div>
                        </Col>
                    </Row>
                </Content>
            </Layout>
            </div>
        )
    }
}


addListenRecommend = Form.create()(addListenRecommend)

export default addListenRecommend;

