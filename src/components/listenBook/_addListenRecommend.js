import React from 'react'
import { Link, hashHistory } from 'react-router'
import { Form, Input, Row, Col, Button, Select, Radio, Table, Icon, message, Modal, Checkbox,Popconfirm, Layout,InputNumber, Upload } from 'antd';
import getUrl from '../util';
import commonData from '../commonData.js';
import 'whatwg-fetch';
import './addListenRecommend.less';
var util = require('../util.js');
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;

const CheckboxGroup = Checkbox.Group;
import { CommonAddBook } from "../commonAddBook.js"

class addListenRecommend extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedRowKeys: [],
            tmpSelectdRowKeys: [],
            bookList: [],
            bookDetailUrl: 'ella.book.listBookCommons',
         
            sumbitData: {
                remark: '',
                searchPageName: '',
                searchId: "",//跳转其他
                partCode: "",//推荐模块编码
                partTitle: "",//推荐模块标题
                partStyle: "SLIDE_HORIZONTAL",//展示样式
                partType: "LIST_HAND",//列表类型
                partSource: "",//数据地址
                partSourceNum: "",//展示数量
                targetType: "BOOK_LIST",//跳转的目标类型
                targetDesc: "",//跳转链接文字
                targetPage: "",//跳转链接
                bookCodeList: [], //图书编号列表
                platformCode: [],//所选平台
                oneClickBuyStatus: "YES",//一键购买
                jumpType: "JUMP_CURRENT"//跳转类型
            },
            bgImage: [],
            bgImageUrl: '',
            bgImageUp: [],
            bgImageUpUrl: '',
            operateCopy: '',
            type: '',
            loading: false,//图书列表的数据
            visible: false,
            total: '',
            showQuickJumper: false,
            currentPage: 1,
            dataSource: [],  //选书后的数据
            courseAllList: [],
            selectedCourseList: [],
            selectedCourseCode: [],
            rankingList: [],
            most: 'LIST_LATEST_BOOK',//最新最热
            num: '',//获取数量
            selectedRowKeys2: [],//图书列表数据
            tmpSelectdRowKeys2: [],
            FaceData: [],
            lists: [],
            total2: '',
            visible2: false,
            bookDetailName: '',
            platformList: [],//平台复选框数据
            radioPlatformCode: 'APP',//高级会员时 平台单选
            channel: "",


            SystemFaceList:[],
            RecommendColumnList:[],
            CouseDetailList:[]

        }

    }

    componentDidMount() {
        //拉取推荐专栏的数据
        this.targetTypeData("BOOK_LIST","RecommendColumnList");
        
        //拉取系统界面数据
        this.targetTypeData("SYSTEM_INTERFACE","SystemFaceList");
        //拉取课程详情的数据
        this.courseDetailData();
        

    }
    courseDetailData(){

        getUrl.API({"courseName":"","goodsState":"SHELVES_ON"},"ella.operation.getBookCourseList")
        .then(response=>response.json())
        .then(response=>{
            if(response.status==1){
                this.setState({
                    CouseDetailList:response.data.list
                },()=>{
                    
                })
            }
        })    
    }
    targetTypeData(targetType,listType){
        getUrl.API({"groupId":targetType},"ella.operation.boxSearchList")
        .then(response=>response.json())
        .then(response=>{
            if(response.status==1){
                this.setState({
                    [listType]:response.data
                })
            }
        })    
    }
    //编辑模块
    async fetchEditModules() {
        let param = {
            partCode: this.props.params.partCode,
            partSource: this.props.params.recommendType == "course" ? 'ella.book.listCourse' : 'ella.book.listBookCommons'
        }
        let data = await fetch(getUrl.url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: "method=ella.operation.getOperationPartInfo" + "&content=" + JSON.stringify(param) + commonData.dataString
        }).then(function (response) {
            return response.json();
        })
        if (data.status == 1) {
            let curData = {
                remark: data.data.remark,
                searchPageName: '',
                searchId: data.data.searchId,//跳转其他
                partCode: data.data.partCode,//推荐模块编码
                partTitle: data.data.partTitle,//推荐模块标题
                partStyle: data.data.partStyle,//展示样式
                partType: data.data.partType,//列表类型
                partSource: data.data.partSource,//数据地址
                partSourceNum: data.data.partSourceNum,//展示数量
                targetType: this.props.params.recommendType == "book" ? 'BOOK_DETAIL' : 'COURSE_DETAIL',//跳转的目标类型
                targetDesc: data.data.targetDesc,//跳转链接文字
                targetPage: data.data.targetPage,//跳转链接
                bookCodeList: [], //图书编号列表
                platformCode: data.data.platformCode.split(","),//所选平台
                oneClickBuyStatus: data.data.oneClickBuyStatus//一键购买
            };

            this.setState({
                bgImage: data.data.bgImageUrl ? [{
                    uid: -1,
                    name: '',
                    status: 'done',
                    url: data.data.bgImageUrl,
                    uploading: false
                }] : [],
                bgImageUrl: data.data.bgImageUrl,
                bgImageUp: data.data.bgImageUpUrl ? [{
                    uid: -1,
                    name: '',
                    status: 'done',
                    url: data.data.bgImageUpUrl,
                    uploading: false
                }] : [],
                bgImageUpUrl: data.data.bgImageUpUrl,
                operateCopy: data.data.operateCopy,
                sumbitData: curData,
                radioPlatformCode: curData.platformCode[0],
                bookList: this.props.params.recommendType == "course" ? data.data.courseList : data.data.bookList,
                channel: (data.data.channelCodes == "ios" || data.data.channelCodes == "android" || data.data.channelCodes == "all") ? data.data.channelCodes : 'custom'
            })
        } else {
            message.error(data.message);
        }
    }

    handleSelectChanges(value) {
        if (value === 'SVIP') {
            this.setState({
                sumbitData: {
                    ...this.state.sumbitData,
                    partTitle: '高级会员专区',
                    platformCode: [],
                    partStyle: value
                }
            })
        } else {
            this.setState({
                sumbitData: {
                    ...this.state.sumbitData,
                    partStyle: value
                }
            })
        }
    }

    handleChanges = (name1, value1, name2, value2) => {
        this.getSubmitData(name1, value1, name2, value2)
    }
    changeHandler = (name, value) => {
        this.setState({
            [name]: value
        })
    }
    //链接目标类型配置
    targetTypeConfig(targetType){
    	switch(targetType){
            case 'H5':<FormItem
                label="任务参数"
                    {...this.props.formItemLayout}>
                    <Input
                        style={{ width: 150 }}
                        value={this.props.times}
                        onChange={(value)=>{
                            this.props.changeType("times",value)}
                        }
                    />    
                </FormItem>
            break;
            case 'BOOK_DETAIL':<FormItem
                        label="任务参数"
                        {...this.props.formItemLayout} 
                    >
                    <Input style={{ width: 150}}  value={this.props.paramsBookName} disabled="true" onChange={(e)=>this.props.changeType("paramsBookName",e.target.value)}/>
                    <Button onClick={this.bookDetailSearch}>添加</Button>
	            </FormItem>;
	        break;
            case 'BOOK_LIST':return <FormItem
               
                >
                <Select
                    showSearch
                    style={{ width: 150 }}
                    onChange={(v) => {this.props.changeType("taskParamsCode", v); }}
                >
                    {this.state.RecommendColumnList.map(item=>{
                        return <Option value={item.searchCode} key={item.searchCode}>{item.searchName}</Option>
                    })
                    }
                </Select>                   
            </FormItem>;
            break;
            case 'SYSTEM_INTERFACE':<FormItem
                label="任务参数"
                >
                <Select
                    showSearch
                    style={{ width: 150 }}
                    placeholder="会员"
                    optionFilterProp="children"
                    onChange={(v) => {this.props.changeType("taskParamsCode", v); }}
                >
                    {this.state.SystemFaceList.map(item=>{
                        return <Option value={item.searchCode}>{item.searchName}</Option>
                    })
                    }
                </Select>                   
            </FormItem>;
            break;
            case "COURSE_DETAIL":<FormItem
                label="任务参数"
                >
                <Select
                    showSearch
                    style={{ width: 150 }}
                    placeholder="会员"
                    optionFilterProp="children"
                    onChange={(v) => {this.props.changeType("taskParamsCode", v); }}
                >
                    {this.state.CouseDetailList.map(item=>{
                        return <Option value={item.searchCode}>{item.searchName}</Option>
                    })
                    }
                </Select>                   
            </FormItem>;
            break;
            default:return null;
    	}
    	
    }
    getTargetPage = (url) => {
        this.setState({
            bookDetailUrl: url
        })
    }
    getListArray = (arr) => {
        this.setState({
            getMostList: arr
        })
    }
    getSearchData = (obj) => {
        this.setState({
            getSearchData: obj
        })
    }
    getSearchId = (key, value) => {
        this.getSubmitData(key, value)
    }
    // 上传图片
    imageFetch = async (file, k, img) => {
        this.setState({
            [k]: [{
                uid: -1,
                name: '',
                status: 'done',
                url: (this.state[k][0] && this.state[k][0].url)?this.state[k][0].url:'',
                uploading: true
            }]
        })
        var formData = new FormData();
        formData.append('pictureStream', file);
        var data = await fetch(getUrl.upLoadUrl, {
            method: 'POST',
            mode: 'cors',
            body: formData
        })
            .then(function (res) {
                return res.json();
            });
        if (data.status == 1) {
            this.setState({
                [img]: data.data,
                [k]: [{
                    uid: -1,
                    name: '',
                    status: 'done',
                    url: data.data,
                    uploading: false
                }]
            })
        } else {
            this.setState({
                [k]: [{
                    uid: -1,
                    name: '',
                    status: 'error',
                    url: (this.state[k][0] && this.state[k][0].url)?this.state[k][0].url:'',
                    uploading: false
                }]
            })
        }
    }

    //添加模块
    fetchFn = () => {
      
        const sumbitData=this.props.form.getFieldsValue();
        this.props.form.validateFields((err, values) => {
            if (err) {
                return ;
            }
            if (this.state.bookList.length == 0) {
                message.error("请添加听书!");
                return;
            }
            const { sumbitData }=this.state;
            let param=sumbitData;
            param.bookList=this.state.bookList;
            if (this.state.jumpType == "JUMP_CURRENT") {
              
                if (this.props.params.recommendType == "book") {
                    param.targetType = "BOOK_LIST";
                    param.targetPage = 'ella.book.listBookCommons';
                } else {
                    param.targetType = "COURSE_LIST";
                    param.targetPage = 'ella.book.listCourse';
                }
            }
            if (this.state.targetType == "BOOK_DETAIL") {
                param.targetPage = this.state.bookDetailUrl
            }
            if (param.targetPage == '') {
                message.error("链接目标不能为空");
                return;
            }
    
            fetch(getUrl.url, {
                method: "POST",
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: "method=" + _url + "&content=" + JSON.stringify(param) + commonData.dataString
            })
                .then(res => res.json()).then(data => {
                if (data.status == 1) {
                    message.success("保存成功");
                    setTimeout(() => {
                        hashHistory.push('/recommend');
                    }, 2000)
                } else {
                    // let message = data.message.replace('partTitle','标题')
                    if (data.message == '字段partTitle不能为空|字段targetDesc不能为空|') {
                        message.error("推荐标题|链接文字不能为空");
                    } else if (data.message == '字段partTitle不能为空|') {
                        message.error("推荐标题不能为空");
                    } else if (data.message == '字段targetDesc不能为空|') {
                        message.error("链接文字不能为空");
                    } else {
                        message.error(data.message);
                    }
                }
            })
        });
      

    }
    getSubmitData(str1, value1, str2, value2) {
        this.setState({
            sumbitData: {
                ...this.state.sumbitData,
                [str1]: value1,
                [str2]: value2
            }
        })
    }
    sortArr = (n) => {
        var data = this.state.bookList;
        data.unshift(data.splice(n, 1)[0]);
        this.setState({
            bookList: data,
            status3: this.state.status3 + 1,
        })
    }
    arrowDown = (n) => {
        if (n == this.state.bookList.length - 1) {
            message.error(`不可向下移！`);
        } else {
            var data = this.state.bookList;

            var arr1 = data[n];
            data[n] = data[n + 1];
            data[n + 1] = arr1;

            this.setState({
                bookList: data,
                status3: this.state.status3 + 1,
            })
        }
    }
    arrowUp = (n) => {
        if (n == 0) {
            message.error(`不可向上移！`);
        } else {
            var data = this.state.bookList;
            var arr1 = data[n - 1];
            data[n - 1] = data[n];
            data[n] = arr1;

            this.setState({
                bookList: data,
                status3: this.state.status3 + 1,

            })
        }
    }
    arrowDelete = (key) => {
        if (this.props.params.recommendType == "book") {
            var data = this.state.bookList.filter(item => {
                if (item.bookCode !== key.bookCode) {
                    return item
                }
            });
        } else {
            var data = this.state.bookList.filter(item => {
                if (item.courseCode !== key.courseCode) {
                    return item
                }
            });
        }
        this.setState({
            bookList: data

        })
    }
    //获取最新,最热,评论,分享等图书列表
    getLists(value, num) {
        if (this.state.sumbitData.partStyle === 'SVIP') {
            value = "NEW_VIP"
        }
        if (value == "LIST_LATEST_BOOK") {
            if (this.props.params.recommendType == "book") {
                var _url = "ella.operation.getLatestBookList";
            } else {
                var _url = "ella.operation.getNewCourseList";
            }

        } else if (value == "LIST_HOTTEST_BOOK") {
            var _url = "ella.operation.getHottestBookList";
        } else if (value == "LIST_REMARK_BOOK") {
            var _url = "ella.operation.getCommentBookList";
        } else if (value == "LIST_SHARE_BOOK") {
            var _url = "ella.operation.getShareBookList";
        } else if (value == "NEW_VIP") {
            var _url = "ella.operation.getSvipLatestBookList";
        }
        let param = {
            "num": num
        }
        fetch(getUrl.url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: "method=" + _url + "&content=" + JSON.stringify(param) + commonData.dataString
        }).then(res => res.json()).then((data) => {
            this.setState({
                bookList: data.data //最新图书列表
            })
        })
    }

    getMost = (value) => {

        this.setState({
            most: value
        })
    }
    getNum = (value) => {
        this.setState({
            num: value
        })
    }
    getMostData = (value, num) => {

        if (num < 0) {
            message.error('获取数量不能为负数');
            return;
        }
        this.getLists(value, num);

    }
    //清空列表
    DeleteList = () => {
        this.setState({
            bookList: []
        })
    }


    //点添加图书，弹出模糊搜索的Modal
    showModal = () => {
        this.setState({
            visible: true,
        });
       
        this.refs.addBooks.getInitList();
       

    }
    handleOk = (selectedRowKeys, selectedRows) => {


        var newDataSoure = this.state.bookList;
        newDataSoure.push(...selectedRows);
        //去重,遇到重复的书籍自动去重
        var hash = {};
        newDataSoure = newDataSoure.reduce(function (item, next) {
            hash[next.bookCode] ? '' : hash[next.bookCode] = true && item.push(next);
            return item
        }, []);

        this.setState({
            visible: false,
            bookList: newDataSoure,

        })
    }
    handleOk2 = () => {
        const selectedRowKeys = this.state.selectedCourseCode;
        const selectedRows = this.state.selectedCourseList;
        var newDataSoure = this.state.bookList;
        newDataSoure.push(...selectedRows);
        //去重,遇到重复的书籍自动去重
        var hash = {};
        newDataSoure = newDataSoure.reduce(function (item, next) {
            hash[next.courseCode] ? '' : hash[next.courseCode] = true && item.push(next);
            return item
        }, []);

        // TODO:父组件数据也要一起改变(sp好坑啊)
        this.setState({
            visible: false,
            bookList: newDataSoure,
        })
    }
    handleCancel = () => {
        this.setState({ visible: false });
    }
    onSelectChange = (selectedRowKeys) => {
        var tmp = this.state.tmpSelectdRowKeys;

        this.setState({
            selectedRowKeys: selectedRowKeys,
            tmpSelectdRowKeys: selectedRowKeys
        })

    }
    modelCancle(msg) {
        this.setState({
            visible: msg
        });
    }
    //被选种的课程
    selectedCourseCode(v) {
        const selectedCourseList = v.map(item => (
            this.state.courseAllList.find(_item => item == _item.courseName)
        ))
        const selectedCourseCode = selectedCourseList.map(item => {
            return item.courseCode
        })
        this.setState({
                selectedCourseList,
                selectedCourseCode
            }, () => {

            }
        )

    }
    ///////////////////////获取添加课程数据//////////////////

   


    bookDetailList(text, page) {
        console.log(text);
        var param = {
            text: text,
            page: page,
            pageSize: 5
        }
        this.setState({
                selectedRowKeys2: [],
                tmpSelectdRowKeys2: []
            }, () => {
                fetch(getUrl.url, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: "method=ella.operation.getBookListByIdOrName" + "&content=" + JSON.stringify(param) + commonData.dataString
                }).then(res => res.json()).then((data) => {
                    this.setState({
                        lists: data.data.bookList,
                        total2: data.data.total
                    })
                })
            }
        )



    }
    bookDetailSearch = () => {
        this.bookDetailList(this.props.form.getFieldsValue().bookDetailName, 0);
        this.showModal2();
        this.setState({
            sumbitData: {
                ...this.state.sumbitData,
                searchPageName: this.props.form.getFieldsValue().bookDetailName,

            }
        });
    }
    fetchSystem(targetType) {

        if (targetType == "COURSE_DETAIL") {
            // TODO:搜索课程列表

            var doc2 = {
                "courseName": "",
                "goodsState": "SHELVES_ON"
            }
            fetch(getUrl.url, {
                mode: "cors",
                method: "POST",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: "method=ella.operation.getBookCourseList" + "&content=" + JSON.stringify(doc2) + commonData.dataString
            }).then(res => res.json()).then((data) => {

                if (!data.data.list) return; //搜索出null直接return防止报错

                data.data.list.map((item, index) => {
                    item['searchName'] = item.courseName;
                    item['searchCode'] = item.courseCode;
                })

                this.setState({
                    FaceData: data.data.list
                })
            })
        } else if (targetType == "H5") {


        } else {
            let param = {
                'groupId': targetType
            }
            fetch(getUrl.url, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: "method=ella.operation.boxSearchList" + "&content=" + JSON.stringify(param) + commonData.dataString
            }).then(res => res.json()).then((data) => {
                this.setState({
                        FaceData: data.data,
                    }, () => {
                        this.getSystemSec(targetType)
                    }
                )
            })
        }


    }

    getSystemSec = (value) => {
        const { getFieldDecorator } = this.props.form;

        var children = [];
        this.state.FaceData.map((item, i) => {
            return children.push(<Option key={i} value={item.searchId + "," + item.searchCode} >{item.searchName}</Option>)
        })
        var sysDOM;
        if (this.props.params.recommendType == "book") {
            sysDOM = (<div style={{ width: '15%', float: 'left' }}>
                {getFieldDecorator('bookDetailName', {

                    initialValue: '',

                })(
                    <Input
                        addonAfter={<Button icon="search" style={{ "display": "block" }} onClick={() => { this.bookDetailSearch() }} />} />
                )}
            </div>)
        } else {
            if (value == "" || value == "COURSE_DETAIL") {
                sysDOM = <Select style={{ width: '15%', float: 'left' }} onChange={(value) => {

                    var a = value.split(',');
                    var _url = 'ellabook2://detail.course?courseCode=' + a[1];


                    this.handleChanges("targetPage", _url, "searchId", '');
                }}>
                    {children}
                </Select>
            }

        }
        if (value == "SYSTEM_INTERFACE" || value == "BOOK_LIST") {
            sysDOM = <Select style={{ width: '15%', float: 'left' }} onChange={(value) => {
                var a = value.split(',');
                this.setState({
                    sumbitData: {
                        ...this.state.sumbitData,
                        remark: a[0]
                    }
                })
                this.handleChanges("targetPage", a[1], "searchId", a[0]);
            }}>
                {children}
            </Select>
        } else if (value == "H5") {
            sysDOM = <div style={{ width: '20%', float: 'left' }}><Input style={{ "display": "block" }} onBlur={(e) => { this.handleChanges("targetPage", e.target.value, "searchId", '') }} /></div>
        }
        console.log(sysDOM)
        return sysDOM
    }
    onSelectChange2 = (selectedRowKeys) => {
        var tmp = this.state.tmpSelectdRowKeys2;
        if (selectedRowKeys.length > 1) {
            message.error('每次只能选择一本图书！');
            return;
        }
        this.setState({
            selectedRowKeys2: selectedRowKeys,
            tmpSelectdRowKeys2: selectedRowKeys
        })
    }

    showModal2 = () => {
        this.setState({
            visible2: true,
        });

    }
    handleOk3 = () => {
        var tmp = this.state.tmpSelectdRowKeys2;
        var i = tmp[0];
        var Url = 'ellabook://detail.book?bookCode=' + this.state.lists[i].bookCode + '&method=ella.book.getBookByCode'
        var bookDetailUrl = encodeURIComponent(Url);


        this.setState({
            visible2: false,
            sumbitData: {
                ...this.state.sumbitData,
                targetPage: bookDetailUrl,
                searchId: '',
                searchPageName: this.state.lists[i].bookName
            }

        }, () => {
            this.props.form.setFieldsValue({
                bookDetailName: this.state.sumbitData.searchPageName
            })
        });
    }
    handleCancel3 = () => {
        this.setState({ visible2: false });
    }
    onPagnition = (current) => {
        this.bookDetailList(this.state.sumbitData.searchPageName, current.current - 1)
    }
    //平台下拉框数据
    async fetchPlatformList(fetchStr) {
        var data = await fetch(util.url, {
            mode: "cors",
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },

            body: "method=ella.operation.boxSearchList" + "&content=" + JSON.stringify({ "groupId": fetchStr }) + commonData.dataString

        }).then(res => res.json())
        if (this.props.params.recommendType == "course") {
            var cur = data.data.filter(item => item.searchCode != 'GUSHIJI');
        } else {
            var cur = data.data;
        }
        let [...platformList] = cur.map((item, index) => {
            return {
                label: item.searchName,
                value: item.searchCode,
                disabled: false
            }
        })
        this.setState({
            platformList: platformList
        })
    }
    compareToFirstPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && value !== form.getFieldValue('password')) {
            callback('Two passwords that you enter is inconsistent!');
        } else {
            callback();
        }
    }
    render() {
        const formItemLayout = {
            labelCol: { span: 2},
            wrapperCol: { span: 21 },
        };
        const { sumbitData, selectedRowKeys2 } = this.state;
        const { getFieldDecorator} = this.props.form;

        const dataSource = this.state.bookList;

        const style = { marginBottom: '20px', borderBottom: "1px solid #ccc", paddingBottom: '10px' }
        const style2 = { width: '13.89%', float: 'left', marginRight: '30px', height: '32px', top: 0 };
        var columns = [
            {
                title: '序号',
                width: "25%",
                key: 'id',
                render: (text, record, index) => {
                    return (
                        <div>
                            {index + 1}
                        </div>
                    )
                }
            }, {
                title: '图书ID',
                width: "25%",
                dataIndex: 'bookCode',
                key: 'bookCode',
            }, {
                title: '图书名称',
                width: "25%",
                dataIndex: 'bookName',
                key: 'bookName',
            }, {
                title: '操作',
                width: "25%",
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
       

        const rowSelection = {
            selectedRowKeys: selectedRowKeys2,
            onChange: this.onSelectChange2
        }
        const pagination = {
            total: this.state.total2,
            showSizeChanger: true
        }

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
                    <Link to={window.location.href.indexOf('indexInit') > -1 ? '/index' : "/recommend"} style={{ color: "#666" }}>
                        <Col span={4} style={{ fontSize: "16px" }}>
                            <Icon type="left" />
                            {this.props.params.addOredit == "add" ? "添加新推荐" : "编辑新推荐"}
                        </Col>
                    </Link>
                </Row>

                <Form horizontal>
                    <Row>
                        <Col>
                            <FormItem
                                {...formItemLayout}
                                label="推荐标题"
                            >
                                {getFieldDecorator('partTitle', {
                                    initialValue: sumbitData.partTitle,
                                    rules: [
                                        { 
                                            required: true, 
                                            message: '名称不能为空' 
                                        },
                                        {
                                            max:10,
                                            message:'限制10个中文字符以内！'
                                        }
                                    ],
                                })(
                                    <Input 
                                        style={{ width: '15%' }} 
                                        
                                        // value={this.state.sumbitData.partTitle} 
                                        // onChange={(e) => { this.handleChanges("partTitle", e.target.value) }} 
                                    />
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <FormItem
                                {...formItemLayout}
                                label="展示样式"
                            >
                                {getFieldDecorator('partStyle', {
                                    initialValue: sumbitData.partStyle,
                                    rules: [{ required: true, message: '样式不能为空' }],
                                })
                                (
                                    <Select 
                                        style={{ width: '15%' }} 
                                        value={sumbitData.partStyle} 
                                        onChange={(value) =>this.handleChanges("partStyle", value)}
                                    >
                                        <Option value="SLIDE_HORIZONTAL">横向滑动</Option>
                                        <Option value="SLIDE_PORTRAIT">纵向滑动</Option>
                                    </Select>
                                )
                                }
                            </FormItem>
                        </Col>
                    </Row>
                    
                    {
                        this.props.params.recommendType == "book" &&
                        <Row>
                            <Col>
                                <FormItem
                                    {...formItemLayout}
                                    label="一键购买"
                                >
                                    <RadioGroup onChange={(e) => {
                                        this.setState({
                                            sumbitData: {
                                                ...this.state.sumbitData,
                                                oneClickBuyStatus: e.target.value
                                            }
                                        })
                                    }}
                                                value={sumbitData.oneClickBuyStatus}>
                                        <Radio value="YES">支持</Radio>
                                        <Radio value="NO">不支持</Radio>
                                    </RadioGroup>
                                </FormItem>
                            </Col>
                        </Row>
                    }
                    <Row>
                        <Col>
                            <FormItem
                                {...formItemLayout}
                                label='移动客户端展示数量'
                            >
                                {getFieldDecorator('partSourceNum', {
                                    initialValue: sumbitData.partSourceNum,
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
                                    style={{ width: '15%' }}
                                    // value={this.state.sumbitData.partSourceNum}
                                    // onChange={(value) => { console.log(value);this.handleChanges("partSourceNum", value) }} 
                                />
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <FormItem
                                {...formItemLayout}
                                label="跳转链接文字"
                            >
                                {getFieldDecorator('targetDesc', {
                                    initialValue: sumbitData.targetDesc,
                                    rules:[
                                        {
                                            required:true,
                                            message:"链接文字必填！"
                                        }
                                    ]
                                })
                                (<Input 
                                    style={{ width: '15%' }} 
                                    // onChange={(e) => { this.handleChanges("targetDesc", e.target.value) }} 
                                />
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <FormItem
                                {...formItemLayout}
                                label="链接目标"
                            >
                                {getFieldDecorator('jumpType', {
                                    initialValue: sumbitData.jumpType,
                                })
                                (<RadioGroup>
                                    <Radio value="JUMP_CURRENT">跳转到当前列表</Radio>
                                    <Radio value="PLAY_CURRENT">播放当前列表</Radio>
                                    <Radio value="JUMP_OTHER">跳转到其他</Radio>
                                </RadioGroup>
                                )}
                               
                            </FormItem>
                        </Col>
                    </Row>
                    {
                        this.props.form.getFieldValue('jumpType')=="JUMP_OTHER"&&<Row>
                            <Col offset={2}>
                                <FormItem
                                    id="control-input"
                                    {...formItemLayout}
                                    
                                >
                                    {getFieldDecorator('targetType', {
                                        initialValue: sumbitData.targetType,
                                    })
                                    (<Select style={{width:"150px"}}>
                                        <Option value="BOOK_LIST">推荐专栏</Option>
                                        <Option value="SYSTEM_INTERFACE">系统界面</Option>
                                        
                                        <Option value="H5">H5页面</Option>
                                        <Option value="BOOK_DETAIL">图书详情</Option>
                                        <Option value="COURSE_DETAIL">课程详情</Option>
                                    </Select>)}
                                </FormItem>
                            </Col>
                        </Row>
                    }
                    <div id="targetTypeConfig">
                        {
                            this.targetTypeConfig(this.props.form.getFieldValue('targetType'))
                        }
                    </div>
                    <div id="addNewBook" style={{ display: (this.state.jumpType !== "JUMP_CURRENT" ? 'block' : 'none') }}>
                       
                        <Row>
                            <Modal
                                visible={this.state.visible2}
                                title="添加图书"
                                onOk={this.handleOk3}
                                onCancel={this.handleCancel3}
                                wrapClassName="th-bg"
                                footer=
                                    {[
                                        <Button key="back" size="large" onClick={this.handleCancel3}>取消</Button>,
                                        <Button key="submit" type="primary" size="large" onClick={this.handleOk3}>确定</Button>
                                    ]}
                            >
                                <Table rowKey={(record, index)=>index} className="modal-table" onChange={this.onPagnition.bind(this)} columns={columns2} dataSource={this.state.lists} pagination={pagination} rowSelection={rowSelection} />
                            </Modal>
                        </Row>

                    </div>
                   
                    <div id="offsetCol">
                        <Row>
                            <Col>
                                <FormItem
                                    {...formItemLayout}
                                    label="获取规则"
                                >
                                 
                                    <Select style={style2} value="NEW_VIP" onChange={(value) => { this.getMost(value) }} size="large">
                                        <Option value="NEW_VIP">最新上架</Option>
                                    </Select>
                                           

                                    <Input style={style2} placeholder="获取数量" size="large" onBlur={(e) => { this.getNum(e.target.value) }} />
                                    <Button style={{ float: 'left' }} className="ant-btn-blue" type="primary" onClick={() => {
                                        this.getMostData(this.state.most, this.state.num)
                                    }}>获取</Button>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col offset={1} style={{ marginRight: '3.16667%' }}>
                                <div data-page="addModal">
                                    <Row style={{ background: "#23B8E6", padding: '0 20px', borderRadius: "6px 6px 0 0", lineHeight: '50px', height: '50px' }}>
                                        <Col style={{ fontSize: '14px', color: "#fff", float: 'left' }}>听书列表</Col>
                                        <Col style={{ float: 'right' }}>
                                            <Col style={{ float: 'left', marginRight: '10px' }}>
                                                <Button type="primary" className="ant-btn-add" icon="plus" onClick={this.showModal}>添加听书</Button>
                                                <CommonAddBook ref="addBooks" rowKey="bookCode" visible={this.state.visible} modelCancle={msg => this.modelCancle(msg)} handleOk={(selectedRowKeys, selectedRows) => this.handleOk(selectedRowKeys, selectedRows)} />
                                                <Modal
                                                    visible={this.state.visible && this.props.params.recommendType == "course"}
                                                    title="添加听书"
                                                    onOk={this.handleOk2}
                                                    className="addcourseModal"
                                                    onCancel={this.handleCancel}
                                                    wrapClassName="th-bg"
                                                    footer={[<Button key="submit" onClick={this.handleOk2} type="primary" size="large">添加</Button>]}
                                                >
                                                    <Select
                                                        mode="multiple"
                                                        style={{ width: '100%' }}
                                                        onChange={(v) => { this.selectedCourseCode(v) }}
                                                        tokenSeparators={[',']}
                                                        placeholder="搜索并选择数据"

                                                    >
                                                        {this.state.courseSearchList}

                                                    </Select>

                                                </Modal>

                                            </Col>
                                            <Col style={{ float: 'left' }}>
                                                <Button type="primary" icon="delete" className="ant-btn-add" onClick={this.DeleteList}>清空列表</Button>
                                            </Col>
                                        </Col>
                                    </Row>
                                    <Table rowKey={(record, index)=>index} {...this.state} columns={columns} dataSource={dataSource} pagination={false} scroll={{ y: (dataSource.length > 11 ? 450 : 0) }} />
                                </div>
                            </Col>
                        </Row>
                    </div>
                    <div style={{ margin: '20px 0', textAlign: 'center' }}>
                        <Button className="ant-btn-blue" type="primary" htmlType="submit" onClick={() => { this.fetchFn() }}>保存</Button>
                    </div>
                </Form>
            </div>
        )
    }
}


addListenRecommend = Form.create()(addListenRecommend)

export default addListenRecommend;

