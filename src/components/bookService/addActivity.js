import React from 'react';
import { Row, Col, Icon, Form, TimePicker, Button, Input, Select, message, Checkbox, Tooltip, Modal, Table, DatePicker } from 'antd';
import { Link } from 'react-router';
import moment from 'moment';
import getUrl from '../util';
import commonData from '../commonData.js';
import './service.css';
import { CommonAddBook } from "../commonAddBook.js"
const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
const Option = Select.Option;
const confirm = Modal.confirm;
class addActivity extends React.Component {
    constructor(props) {
        super(props)
        this.code = this.props.params.code;
        this.type = this.props.params.type;
        this.fill = JSON.parse(decodeURIComponent(this.props.params.fill));
        this.state = {
            look: true,//TODO:保存消抖
            inputValue: '',
            addBook: [],
            delBook: '',
            commonVal: '',
            checked: this.type == 'a' ? false : (this.fill.whetherLimit == 'NO' ? true : false),
            submitData: {
                activityCode: this.type == 'a' ? null : this.code,
                activityType: this.type == 'a' ? 'H5' : this.type,
                activityName: this.identify(this.fill.activityName),
                channelCode: this.fill ? this.fill.channelCode : '',
                booksCount: '',
                startTime: this.identify(this.fill.startTime),
                endTime: this.identify(this.fill.endTime),
                whetherLimit: '',

                activityAmount:this.fill.activityAmount,

                books: '',
                sendMembers: '',
            },
            lists: [],
            total: '',
            visible: false,
            selectedRowKeys: [],
            tmpSelectdRowKeys: [],
            channelData: [],
            bookNameData: []
        }
    }
    handleSubmit = (e) => {
        e.preventDefault();
        console.log(this.state.submitData.activityAmount);
        console.log(this.state.checked)
//      if (this.state.submitData.activityAmount == "" && !this.state.checked) {
//          // if(0){
//          //这里是用户数量没填或者填负数
//          notification.error({
//            message: '操作失败',
//            description: '请勾上不限定用户数量或者填写用户数量',
//          })
//          return
//      }
        //去重，过滤，数组转字符串
        var arr = this.type == "a" ? this.state.addBook : this.state.bookNameData;
        var obj = {};
        arr = arr && arr.length ? arr.reduce((item, i) => {
            obj[i.bookName] ? '' : obj[i.bookName] = true && item.push(i);
            return item
        }, []) : [];
        let bookArr = arr.map(item => item.bookCode);
        let numArr = bookArr.filter(item => item);
        let str = numArr.join(",")
        console.log(33333333)
        console.log(this.state.submitData.channelCode)
        var channelCode = null;
        function CompareDate(d1, d2) {
            return ((new Date(d1.replace(/-/g, "\/"))) >= (new Date(d2.replace(/-/g, "\/"))));
        }


        let param = {
            activityCode: this.state.submitData.activityCode,
            activityType: this.state.submitData.activityType,
            activityName: this.state.submitData.activityName,
            channelCode: this.state.submitData.channelCode,
            booksCount: this.type == "a" ? (arr.length ? arr.length : '0') : this.fill.booksCount,
            startTime: this.state.submitData.startTime,
            endTime: this.state.submitData.endTime,
            whetherLimit: this.state.checked ? "NO" : "YES",

            activityAmount: this.state.checked?10000000: this.state.submitData.activityAmount,
            books: str,
            sendMembers: this.state.submitData.sendMembers
        }
     
        if ((!this.state.submitData.activityAmount || this.state.submitData.activityAmount <= 0) && !this.state.checked) {
            message.error('请填写正确或勾选用户数量');
            this.setState({
                look: true
            })
            return;
        }
        if (CompareDate(param.startTime, param.endTime)) {
            message.error('时间设置不正确(开始时间大于结束时间)');
            this.setState({
                look: true
            })
            return;
        }
        if (this.type == "a") {
            if (this.state.addBook.length == 0) {
                message.error('请选择具体书目');
                this.setState({
                    look: true
                })
                return;
            }
        } else if (this.state.bookNameData.length == 0) {
            message.error('请选择具体书目');
            this.setState({
                look: true
            })
            return;
        }
        this.props.form.validateFields((err) => {
            if (err) {
                return;
            }
        });
        this.onSubmit(param)
    }
    identify = (pa) => {
        return this.type == 'a' ? '' : pa;
    }
    getInputValue = (value) => {
        this.setState({
            inputValue: value
        })
    }
    getSubmitData = (str, value) => {
        this.setState({
            submitData: {
                ...this.state.submitData,
                [str]: value
            }
        })
    }
    onChangeRadio = () => {

        this.setState({
            checked: !this.state.checked
        })
    }
    getCommonValue = (value) => {
        this.setState({
            commonVal: value
        })
    }
    changeFill = (name, value) => {
        this.getSubmitData(name, value)
    }
    timeHandler = (value) => {
        var d = new Date(value),
            hour = d.getHours() < 10 ? "0" + d.getHours() : d.getHours(),
            minutes = d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes(),
            sec = d.getSeconds() < 10 ? "0" + d.getSeconds() : d.getSeconds(),
            month = d.getMonth() < 10 ? "0" + (d.getMonth() + 1) : (d.getMonth() + 1),
            date = d.getDate() < 10 ? "0" + d.getDate() : d.getDate();
        var time = d.getFullYear() + '-' + month + '-' + date + " " + hour + ':' + minutes + ':' + sec;
        return time;
    }
    //请求接口
    onSubmit = (param) => {

        if (this.state.look) return;
        fetch(getUrl.url, {
            method: "POST",
            mode: 'cors',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: "method=ella.operation.sendBook.createOrUpdateSendBookActivity" + "&content=" + JSON.stringify(param) + commonData.dataString
        })
            .then(res => res.json()).then(data => {
                if (data.status == 1) {
                    message.success("保存成功!");
                    if(this.props.params.type == "a"){
                    	window.history.back();
                    }
                    
                } else if (data.code == '50000002') {
                    message.error("该渠道当前时间段已存在注册送书活动!");
                    this.setState({
                        look: true
                    })
                } else {
                    message.error("保存失败!");
                    this.setState({
                        look: true
                    })
                }
            })
    }
    delBookList = (bookCode) => {
        if (this.type == "a") {
            this.setState({
                addBook: this.state.addBook.filter(item => item.bookCode !== bookCode)
            })
        } else {
            this.setState({
                bookNameData: this.state.bookNameData.filter(item => item.bookCode !== bookCode)
            })
        }

    }
    //书目
    bookNameFn = async (books) => {
        console.log({ books })
        var data = await fetch(getUrl.url, {
            method: "POST",
            mode: 'cors',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: "method=ella.operation.sendBook.selectBooksByBooksCodeStr" + "&content=" + JSON.stringify({ "books": books }) + commonData.dataString
        }).then(function (res) {
            return res.json();
        });
        console.log({ "aaa": data })
        if (data.status == 1) {
            this.setState({
                bookNameData: data.data.map(item => item)
            }, () => {
                console.log(this.state.bookNameData)
            })
        }
    }
    //渠道
    channelList = async (pageIndex, pageSize) => {
        // var data = await fetch(getUrl.url,{
        //     method:"POST",
        //     mode:'cors',
        //     headers: {
        //         'Content-Type': 'application/x-www-form-urlencoded'
        //     },
        //     body:"method=ella.operation.coupon.selectChannelCouponActivity"+"&content="+JSON.stringify({"pageIndex":pageIndex,"pageSize":pageSize})
        // }).then(function (res) {
        //     return res.json();
        // });
        // if(data.status==1){
        //     this.setState({
        //         channelData:data.data.couponActivityList
        //     })
        // }
        // 
        // 
        var data = await fetch(getUrl.url, {
            method: "POST",
            mode: 'cors',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: "method=ella.operation.coupon.selectChannelList" + "&content=" + JSON.stringify({}) + commonData.dataString
        }).then(function (res) {
            return res.json();
        });
        if (data.status == 1) {
            this.setState({
                channelData: data.data
            })
        }
    }
    //搜索书籍
    searchBook = async (text, page) => {
        if (this.state.inputValue == '') {
            message.warning('请先输入书目！')
            return
        }
        this.setState({
            selectedRowKeys: [],
            tmpSelectdRowKeys: [],
            type: 'SEARCH_ALL'
        })
        var data = await fetch(getUrl.url, {
            method: "POST",
            mode: 'cors',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            /****
             * 屠科钻修改
             * 修改原因：需要搜索全部书籍，不光是上架的书
             * 添加[,"type":"SEARCH_ALL"]
             */
            body: "method=ella.operation.getBookListByIdOrName" + "&content=" + JSON.stringify({ "text": text, "type": "SEARCH_ALL" }) + commonData.dataString
        }).then(function (res) {
            return res.json();
        });
        if (data.status == 1) {
            this.setState({
                total: data.data.total,
                lists: data.data.bookList
            }, () => {
                console.log(this.state.lists);
            }
            )

        }
    }
    bookDetailSearch = () => {
        this.showModal();
        // if(this.state.inputValue==''){
        //     message.warning('请先输入书目！')
        // }else{
        //     this.showModal();
        //     this.searchBook(this.state.inputValue,0);
        // }
    }
    onSelectChange = (selectedRowKeys) => {
        var tmp = this.state.tmpSelectdRowKeys;

        if (selectedRowKeys.length > 5) {
            message.error('每次只能选择一本图书！');
            return;
        }
        this.setState({
            selectedRowKeys: selectedRowKeys,
            tmpSelectdRowKeys: selectedRowKeys
        })
    }

    showModal = () => {
        this.setState({
            visible: true,
        });
        this.refs.addBooks.getInitList();
    }
    handleOk = (selectedRowKeys, selectedRows) => {
        ///////////////////////////////////////////////////////////////////
        if (this.type == 'a') {
            var tmp = this.state.addBook;
            tmp.push(...selectedRows);
            //去重,遇到重复的书籍自动去重
            var hash = {};
            tmp = tmp.reduce(function (item, next) {
                hash[next.bookCode] ? '' : hash[next.bookCode] = true && item.push(next);
                return item
            }, []);

            this.setState({
                visible: false,
                addBook: tmp
            });
        } else {
            var tmp = this.state.bookNameData;
            tmp.push(...selectedRows);
            //去重,遇到重复的书籍自动去重
            var hash = {};
            tmp = tmp.reduce(function (item, next) {
                hash[next.bookCode] ? '' : hash[next.bookCode] = true && item.push(next);
                return item
            }, []);

            this.setState({
                visible: false,
                bookNameData: tmp
            });

        }
    }
    handleCancel = () => {
        this.setState({ visible: false });
    }
    ////////////////////下拉修改///////////////////////
    fnLai(k, v) {
        this.setState({
            submitData: {
                ...this.state.submitData,
                [k]: v
            }
        })
    }
    ////////////////////下拉修改///////////////////////
    //增加弹窗
    showDeleteConfirm(e) {
        console.log(this.props.params);
        e.preventDefault();//阻止默认事件
        var _this = this;
        confirm({
            title: `请确认是否${this.props.params.type == "a" ? '添加' : '修改'}该赠书活动?`,
            // content: '点确定将提交后台',
            okText: '确定',
            okType: 'primary',
            cancelText: '继续编辑',
            onOk() {

                _this.handleSubmit(e)
            },
            onCancel() {
                _this.setState({
                    look: true
                })
            },
        });
    }
    ///
    getIOS = (value) => {
        let content = '';
        let option = this.state.channelData instanceof Array ? this.state.channelData.map(item => {
            return <Option value={item.code}>{item.name}</Option>
        }) : null;
        console.log(123321123)
        console.log(this.state.channelData)
        console.log(this.fill.channelCode)
        if (value == 'CHANNEL' || value == 'REGISTER') {
            content = <Select
                style={{ width: "50%", float: 'left', maxWidth: "110px" }}
                value={this.state.submitData.channelCode}
                onChange={(value) => { this.fnLai('channelCode', value) }}>
                {option}
            </Select>
        }
        return content;
    }
    onPagnition = (current) => {
        this.searchBook(this.state.inputValue, current.current - 1)
    }
    componentDidMount() {
        this.channelList(1, 10);
        console.log({ "fff": this.fill.books })
        this.bookNameFn(this.fill.books);
    }
    modelCancle(msg) {
        this.setState({
            visible: msg
        });
    }
    getReleaseTimeStart(date, dateString) {
         console.log(dateString)
         this.getSubmitData("startTime",dateString)
        
    
    }
    getReleaseTimeEnd(date, dateString) {
         console.log(dateString)
         this.getSubmitData("endTime",dateString)
        
    
    }
    render() {
        console.log({ 'abs': this.state.bookNameData })
        let val = this.type == "a" ? this.state.commonVal : this.type;
        var arr = this.type == "a" ? this.state.addBook : this.state.bookNameData;
        const style = { marginBottom: '20px', borderBottom: "1px solid #ccc", paddingBottom: '10px' }
        const iconStyle = { fontSize: '24px', verticalAlign: 'middle', cursor: 'pointer', color: '#27c14c', position: 'absolute', top: '7px' }
        const { getFieldDecorator } = this.props.form;
        const { selectedRowKeys } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange
        }
        const pagination = {
            defaultCurrent: 1,
            total: this.state.total,
            showSizeChanger: false,
            pageSize: 5
        }
        const formItemLayout = {
            labelCol: {
                xs: { span: 12 },
                sm: { span: 2 },
            },
            wrapperCol: {
                xs: { span: 12 },
                sm: { span: 4 },
            },
        };
        const columns = [{
            title: '图书标题',
            dataIndex: 'bookName'
        }, {
            title: '图书编码',
            dataIndex: 'bookCode'
        }, {
            title: '出版时间',
            dataIndex: 'publishTime'
        }, {
            title: '图书状态',
            dataIndex: 'goodsState',
            render: (text, record) => {
                return <div>
                    {text == 'SHELVES_WAIT' ? <span>待上架</span> : (
                        text == 'SHELVES_ON' ? <span>已上架</span> : <span>已下架</span>
                    )}
                </div>
            }
        }];
        var obj = {};
        // console.log(1234456664444)
        // console.log(this.fill.startTime)
        //去重
        arr = arr && arr.length ? arr.reduce((item, i) => {
            obj[i.bookName] ? '' : obj[i.bookName] = true && item.push(i);
            return item
        }, []) : [];
        console.log({ "fill": decodeURIComponent(this.props.params.fill) })
        console.log({ "type": this.type })
        return (
            <div style={{ padding: "10px 10px 0" }} className="item-fn">
                <Row style={style}>
                    <Link to="/bookService" style={{ color: "#666" }}>
                        <Col span={4} style={{ fontSize: "16px" }}>
                            <Icon type="left" />
                            {this.type == "a" ? '添加赠书活动' : '编辑赠书活动'}
                        </Col>
                    </Link>
                </Row>
                <Form
                    onSubmit={
                        (e) => {
                            console.log(e);
                            this.showDeleteConfirm(e)
                        }
                        // this.handleSubmit
                    }
                    id="bookList">
                    <FormItem
                        labelCol={{
                            xs: { span: 12 }, sm: { span: 2 }
                        }}
                        wrapperCol={{ span: 12 }}
                        label="活动类型"
                    >
                        <Select style={{ width: "50%", float: 'left', marginRight: 25, maxWidth: "110px" }} defaultValue={this.type == "a" ? "H5" : this.type} onChange={(value) => { this.getCommonValue(value); this.changeFill("activityType", value) }}>
                            <Option value="H5">赠书活动</Option>
                            <Option value="DIRECTIONAL">定向赠书</Option>
                            <Option value="CHANNEL">渠道赠书</Option>
                            <Option value="REGISTER">注册赠书</Option>
                        </Select>
                        {this.getIOS(val)}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="活动名称"
                    >
                        {getFieldDecorator('activityName', {
                            initialValue: this.type == "a" ? '' : this.fill.activityName,
                        })(
                            <Input placeholder="请输入活动名称" onBlur={(e) => { this.changeFill("activityName", e.target.value) }} />
                        )}
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="具体书目"
                    >
                        {/*<Input style={{width:'85%',marginRight:10}} onBlur={(e)=>{this.getInputValue(e.target.value)}}/>*/}
                        <Tooltip placement="top" title="添加书目">
                            {/*<Icon onClick={this.bookDetailSearch.bind(this)} style={iconStyle} type="plus-circle" />*/}
                            {/*<Icon onClick={this.bookDetailSearch.bind(this)} style={iconStyle} type="plus-circle" />*/}
                            <Button onClick={this.bookDetailSearch.bind(this)} icon="search">搜索选书</Button>
                        </Tooltip>
                        <ul className="bookListLi">
                            {arr.map((item, i) => {
                                return <li style={{ marginTop: 24, position: 'relative' }} key={"new" + i} className="clearfixs">
                                    <Input style={{ width: '85%', marginRight: 10, height: 32, float: 'left' }} value={item.bookName} />
                                    <Tooltip placement="top" title="删除书目">
                                        <Icon onClick={() => { this.delBookList(item.bookCode) }}
                                            style={{ fontSize: '24px', verticalAlign: 'middle', cursor: 'pointer', color: '#27c14c', float: 'left', position: 'absolute', top: '4px' }}
                                            type="minus-circle" />
                                    </Tooltip>
                                </li>
                            })}
                        </ul>
                    </FormItem>
                    <Row>
                        <CommonAddBook ref="addBooks" rowKey="bookCode" visible={this.state.visible} modelCancle={msg => this.modelCancle(msg)} handleOk={(selectedRowKeys, selectedRows) => this.handleOk(selectedRowKeys, selectedRows)} />
                    </Row>
                    <FormItem
                        {...formItemLayout}
                        label="赠书数量"
                    >
                        {getFieldDecorator('booksCount', {
                            initialValue: this.type == "a" ? (arr.length ? arr.length : '0') : (this.fill.booksCount ? (this.fill.booksCount !== arr.length ? Math.abs(arr.length) : this.fill.booksCount) : arr.length)
                        })(
                            <Input title="赠书数量不可填" disabled type='number' min="1" max="9999999999" />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="开始时间"
                    >
                        {getFieldDecorator('startTime', {
                            initialValue: this.type == "a" ? '' : moment(this.fill.startTime),
                        })(
                            <DatePicker
                  style={{ width: "100%" }}
                
                  showTime
                  format="YYYY-MM-DD HH:mm:ss"
                  
                  onChange={(value, dateString) => { this.getReleaseTimeStart(value, dateString) }}
                />
                           
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="结束时间"
                    >
                        {getFieldDecorator('endTime', {
                            initialValue: this.type == "a" ? '' : moment(this.fill.endTime),
                        })(
                            <DatePicker
                  style={{ width: "100%" }}
                  showTime

                  format="YYYY-MM-DD HH:mm:ss"
                 
                  onChange={(value, dateString) => { this.getReleaseTimeEnd(value, dateString) }}
                />
                          
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="用户数量"
                    >
                        {getFieldDecorator('activityAmount', {
                            initialValue: this.type == "a" ? '' : this.fill.activityAmount,
                        })(

                            <Input disabled={this.state.checked ? true : false} type='number' max="9999999999" placeholder="请输入用户数量" onBlur={(e) => { this.changeFill("activityAmount", e.target.value) }}
                                addonAfter={<Tooltip placement="top" title={this.state.checked ? "勾选时,不限量,传默认值10000000" : "不勾选时,需自己填入用户数量"}>
                                    <Checkbox checked={this.state.checked} onChange={() => this.onChangeRadio()} >不限量</Checkbox>
                                </Tooltip>}
                            />
                        )}
                    </FormItem>
                    {this.getAccount(val)}
                    <FormItem
                        wrapperCol={{
                            xs: { span: 12, offset: 0 },
                            sm: { span: 8, offset: 3 },
                        }}
                    >
                        <Button
                            className="ant-btn-blue"
                            type="primary"
                            htmlType="submit"
                            loading={!this.state.look}
                            onClick={() => {
                                this.setState({
                                    look: false
                                })
                            }}
                        >保存</Button>
                    </FormItem>
                </Form>
            </div>
        )
    }
    getAccount = (value) => {
        let content = '';
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: { span: 12 },
                sm: { span: 2 },
            },
            wrapperCol: {
                xs: { span: 12 },
                sm: { span: 4 },
            },
        };
        if (value == "DIRECTIONAL") {
            content = <div className="label-visible">
                <FormItem
                    {...formItemLayout}
                    label="获赠账号"
                    style={{ height: 140 }}
                >
                    {getFieldDecorator('sendMembers', {
                        // initialValue:this.type=="a"?null:this.fill.sendMembers
                    })(
                        <Select
                            mode="tags"
                            placeholder="填写用户账号/手机号,按回车输入"
                            style={{ width: '100%' }}
                            onChange={
                                (value) => {
                                    console.log({ "value": value })
                                    let val = value.join(", ");
                                    this.changeFill("sendMembers", val)
                                }
                            }
                            tokenSeparators={[',']}>

                        </Select>
                    )}
                </FormItem>
            </div>
            // content = <div>55555</div>
        }
        return content;
    }
}

addActivity = Form.create()(addActivity);
export default addActivity;



