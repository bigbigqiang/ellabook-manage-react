import React from 'react'
import { Link, hashHistory } from 'react-router'
import { Form, Input, Row, Col, Button, Select, Radio, Table, Icon, message,Popconfirm,InputNumber} from 'antd';
import getUrl from '../util';
import commonData from '../commonData.js';
import 'whatwg-fetch';
import './AddBookSleep.less';
import AddListenModal from "./AddListenModal.js";
import ComSelectBook from '../commonSelectBook.js';
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
            sleepName: "",//推荐模块标题
            visible: false,
            total: '',
            dataSource: [],
            lists: [],
            sleepCode:this.props.params.sleepCode,
            status:this.props.params.status,
            visible2:false,
            page:0,
            pageSize:20

        }
      
    }
    componentDidMount() {
        console.log(this.props.params.sleepCode)
        if (this.state.status=="edit") {
            this.ListenRecommendDetail();
            this.fetchRecommendList();
        }
    }
    ListenRecommendDetail() {
        getUrl.API({sleepCode:this.state.sleepCode},"ella.operation.getLbSleepListenDetail")
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
                    sleepName:response.data.sleepName,
                    listType: response.data.listType,
                    homeShowNum: response.data.homeShowNum,
                    jumpDesc: response.data.jumpDesc,
                    jumpType: response.data.jumpType
                })

            }else{
                message.error(response.message)
            }
        })
       
    }
    //获取详情听书列表
    fetchRecommendList(){
        getUrl.API({sleepCode:this.state.sleepCode,"pageVo":{"page":0,"pageSize":1000}},"ella.operation.getSleepListenAudioList")
		.then(response=>response.json())
		.then(response=>{
			if(response.status==1){
                this.setState({
                    audioList:response.data.partList
                })
            }else{
              
            }
        })
    }
    //添加模块
    AddListenRecommend(){
        this.props.form.validateFields((err, values) => {
            if (err) {
                return ;
            }
            if (this.state.audioList.length == 0) {
                message.error("请添加听书!");
                return;
            }
            const params={
                sleepCode:this.state.status=="add"?"":this.state.sleepCode,
                sleepName:values.sleepName,
                voiceTotalTime:this.state.audioList.reduce((prev, cur) =>prev +cur.audioTimeLength, 0),
                audioList:this.state.audioList.map(item=>item.audioCode).join(",")
            }
            console.log(params);
            var url=this.state.status=="add"?"ella.operation.addLbSleepListen":"ella.operation.updateLbSleepListen";
            getUrl.API(params,url)
            .then(response=>response.json())
            .then(response=>{
                if (response.status == 1) {
                    message.success("保存成功");
                    if(this.state.status=="add"){
                        setTimeout(() => {
                            hashHistory.push('/listenBookSleepList');
                        }, 2000)
                    }
                    
                } else {
                    message.error(response.message); 
                }
            })
        })
    }
    sortArr = (n) => {
        var audioList = this.state.audioList;
        audioList.unshift(audioList.splice(n, 1)[0]);
        this.setState({
            audioList
        })
    }
    arrowDown = (n) => {
        if (n == this.state.audioList.length - 1) {
            message.error(`不可向下移！`);
        } else {
            var audioList = this.state.audioList;

            var arr1 = audioList[n];
            audioList[n] = audioList[n + 1];
            audioList[n + 1] = arr1;

            this.setState({
                audioList
            })
        }
    }
    arrowUp = (n) => {
        if (n == 0) {
            message.error(`不可向上移！`);
        } else {
            var audioList = this.state.audioList;
            var arr1 = audioList[n - 1];
            audioList[n - 1] = audioList[n];
            audioList[n] = arr1;

            this.setState({
                audioList
            })
        }
    }
    arrowDelete = (key) => {
      
        var audioList = this.state.audioList.filter(item => {
            if (item.audioCode !== key.audioCode) {
                return item
            }
        });
        
        this.setState({
            audioList
        })
    }
    //点添加听书列表，弹出模糊搜索的Modal
    showModal(){
        this.setState({
            visible2: true,
        });
        this.refs.AddListenReso.fetchDataList();
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
    render() {
        const formItemLayout = {
            labelCol: { span: 3},
            wrapperCol: { span: 20 },
        };
        const { getFieldDecorator} = this.props.form;
        const style = { marginBottom: '20px', borderBottom: "1px solid #ccc", paddingBottom: '10px' }
        const style2 = { width: '13.89%', float: 'left', marginRight: '30px', height: '32px', top: 0 };
        
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
                key: 'audioName',
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
        return (
            <div id="addListenRecommend"  style={{ padding: "10px 10px 0" }}>
                <Row style={style}>
                    <Link to={this.props.params.target=="current"?"/listenBookPartList":this.props.params.target=="index"?"/listenBookHomePage":"/listenBookSleepList"} style={{ color: "#666" }}>
                        <Col span={4} style={{ fontSize: "16px" }}>
                            <Icon type="left" />
                            {this.props.params.status== "add" ? "添加" : "编辑"}睡前听
                        </Col>
                    </Link>
                </Row>
                <Form layout="inline">

                            <FormItem
                                label="列表标题"
                            >
                                {getFieldDecorator('sleepName', {
                                    initialValue: this.state.sleepName,
                                    rules: [
                                        { 
                                            required: true, 
                                            message: '名称不能为空！' 
                                        },
                                        {
                                            max:10,
                                            message:'限制10个中文字符以内！'
                                        }
                                    ],
                                })(
                                    <Input style={{ width: '200px',"marginBottom":"20px" }}/>
                                )}
                            </FormItem>
                    <div id="offsetCol">
                       
                        <Row>
                            <Col offset={1} style={{ marginRight: '3.16667%' }}>
                                <div data-page="addModal">
                                    <Row style={{ background: "#23B8E6", padding: '0 20px', borderRadius: "6px 6px 0 0", lineHeight: '50px', height: '50px' }}>
                                        <Col style={{ fontSize: '14px', color: "#fff", float: 'left' }}>听书列表</Col>
                                        <Col style={{ float: 'right' }}>
                                            <Col style={{ float: 'left', marginRight: '10px' }}>
                                                <Button type="primary" className="ant-btn-add" icon="plus" onClick={()=>this.showModal()}>添加听书</Button>
                                            </Col>
                                            <Col style={{ float: 'left' }}>
                                                <Button type="primary" icon="delete" className="ant-btn-add" onClick={()=>this.setState({audioList:[]})}>清空列表</Button>
                                            </Col>
                                        </Col>
                                    </Row>
                                    <Table rowKey={(record, index)=>index} columns={columns} dataSource={this.state.audioList} pagination={false} scroll={{ y: (this.state.audioList.length > 11 ? 450 : 0) }} />
                                </div>
                            </Col>
                        </Row>
                    </div>
                    <AddListenModal ref="AddListenReso" visible={this.state.visible2} modelCancle={msg => this.modelCancle(msg)} handleOk={(selectedRowKeys, selectedRows) => this.handleOk2(selectedRowKeys, selectedRows)} />
                    <div style={{ margin: '20px 0', textAlign: 'center' }}>
                        <Button className="ant-btn-blue" type="primary" htmlType="submit" onClick={() =>this.AddListenRecommend()}>保存</Button>
                    </div>
                </Form>
            </div>
        )
    }
}


addListenRecommend = Form.create()(addListenRecommend)

export default addListenRecommend;

