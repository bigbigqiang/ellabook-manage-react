import React from 'react';
import { Row, Col, Icon, Button, Input, Form, Select, DatePicker, Checkbox, Tooltip, Modal, notification, message, InputNumber } from "antd";
import { Link, hashHistory } from 'react-router';
import getUrl from "../../../util.js";
import commonData from '../../../commonData.js';
import "./add.css";
import moment from 'moment';
import 'moment/locale/zh-cn';
const FormItem = Form.Item;
const Option = Select.Option;
const confirm = Modal.confirm;
class addGoods extends React.Component {
    constructor() {
        super()
        this.state = {
            activityAmount: null,     //用户数量输入框值
            isLimit: true,             //是否限量选项
            couponAmount: 0,          //红包金额总数
            channelList: [],          //所有渠道
            goodsList: [],
            channelCode: null,      //渠道码
            redList: [
                {
                    id: 0,
                    price: "1",
                    num: 1
                }
            ],

            redType: "",
            phoneNumberList: [],                //输入定向手机号码列表
            lookData: null,     //查询详情数据
            red_money: null,
            red_number: null,
            red_total: 1
        }
    }
    componentDidMount() {
        this.getInitialData();
        this.props.params.record && this.fetchDetail(this.props.params.record)
    }
    async getInitialData() {
        var channelList = await fetch(getUrl.url, {
            mode: "cors",
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: "method=ella.operation.coupon.selectChannelList" + commonData.dataString
        }).then(res => res.json());
        //拉取关联商品列表
        var goodsList = await fetch(getUrl.url, {
            mode: "cors",
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: "method=ella.operation.coupon.selectRechargeCouponCoinConfigList" + commonData.dataString
        }).then(res => res.json());
        this.setState({
            channelList: channelList.data,
            goodsList: goodsList.data
        })
    }
    // 拉取渠道列表
    async fetchDetail(activityCode) {
        getUrl.API({ activityCode: activityCode }, 'ella.operation.coupon.selectCouponActivityDetailByActivityCode').then(res => res.json()).then((detail) => {
            if (detail.status == '1') {
                function fn(coupons) {
                    let arr = [];
                    let str = coupons.replace(/\s+/g, "");
                    let arr2 = str.split(",").map(item => parseFloat(item));
                    let i = 1;
                    while (i <= 10) {
                        if (arr2.indexOf(i) != -1) {
                            arr.push({
                                "id": i,
                                "price": i,
                                "num": arr2.filter(item => item == i).length
                            });
                        }
                        i++;
                    }
                    return arr
                };
                let redList = detail.data.coupons == "" ? [] : fn(detail.data.coupons);//拉取红包列表
                let red_total = 0; //初始获取红包总数
                redList.forEach(item => {
                    red_total += item.price * item.num
                })
                this.setState({
                    redType: detail.data.activityType,
                    couponAmount: detail.data.couponAmount,
                    channelCode: detail.data.channelCode ? detail.data.channelCode.split(',') : null,
                    lookData: {
                        ...detail.data,
                        whetherLimit: detail.data.whetherLimit == "NO" ? false : true
                    },
                    redList,
                    isLimit: detail.data.whetherLimit == "NO" ? true : false,
                    red_total: red_total,
                    activityAmount: detail.data.whetherLimit === 'NO' ? null : detail.data.activityAmount
                })
            } else {
                this.setState({
                    loading: false
                })
                message.error(data.message)
            }
        }).catch(e => {
            console.log(e.message)
        })
    }

    handleSubmit(e) {
        e.preventDefault();
        //验证成功后执行
        this.props.form.validateFields((err, values) => {
            if (!err) {
                // 这里到时候判断用户数量是否不限定,所有红包价格是否等于红包金额
                if (!this.state.redList.length) {
                    notification.error({
                        message: '操作失败',
                        description: '红包数量和金额未填选',
                    });
                    return;
                }
                let n = 0;
                let coupons = [];
                this.state.redList.forEach(item => {
                    let t = item.num;
                    let p = item.price
                    n = n + p * t;
                    while (t > 0) {
                        t--;
                        coupons.push(p)
                    }
                })
                if (this.state.redType != "RECHARGE") {
                    if (this.state.activityAmount == null && !this.state.isLimit) {
                        //这里是用户数量没填或者填负数
                        notification.error({
                            message: '操作失败',
                            description: '请勾上不限定用户数量或者填写用户数量',
                        })
                        return
                    }
                }
                let channelCode = null
                if (this.state.redType == "CHANNEL") {
                    channelCode = this.state.channelCode.toString();
                } else if (this.state.redType == "REGISTER") {
                    channelCode = this.state.channelCode
                }
                var doc = {
                    ...values,
                    activityCode: this.props.params.record ? this.props.params.record : null,
                    endTime: values["endTime"] ? values["endTime"].format('YYYY-MM-DD HH:mm:ss') : null,
                    startTime: values["endTime"] ? values["startTime"].format('YYYY-MM-DD HH:mm:ss') : null,
                    whetherLimit: this.state.isLimit ? "NO" : "YES",
                    activityAmount: this.state.isLimit ? null : values.activityAmount,
                    coupons: coupons.join(","),
                    sendMembers: this.state.redType == "DIRECTIONAL" ? values.sendMembers.join(",") : null,
                    channelCode: channelCode,
                    couponAmount: this.state.red_total
                }
                this.showDeleteConfirm(doc);
            }
        });
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
        }, () => { this.setState({ red_total: this.getTotal() }) })
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
    getCouponAmount = (e) => {
        this.setState({
            couponAmount: e.target.value
        })
    }
    getCouponAmount2 = (value) => {
        this.setState({
            activityAmount: value
        })
    }
    //红包相关函数
    //模态框
    showDeleteConfirm(doc) {
        var _this = this;
        confirm({
            title: `请确认是否${this.props.params.type ? '修改' : '添加'}该红包活动?`,
            okText: '确定',
            okType: 'primary',
            cancelText: '继续编辑',
            onOk() {
                _this.fetchdata(doc)
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }
    // 提交数据
    async  fetchdata(doc) {
        function CompareDate(d1, d2) {
            return ((new Date(d1.replace(/-/g, "\/"))) >= (new Date(d2.replace(/-/g, "\/"))));
        }
        if (CompareDate(doc.startTime, doc.endTime)) {
            message.error('时间设置不正确(开始时间大于结束时间)');
            return;
        }
        if (doc.whetherLimit == 'YES' && !doc.activityAmount) {
            message.error('用户数量设置不正确');
            return;
        }
        var data = await fetch(getUrl.url, {
            mode: "cors",
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: "method=ella.operation.coupon.createOrUpdateCouponActivity" + "&content=" + JSON.stringify(doc) + commonData.dataString
        }).then(res => res.json())
        if (data.status == 1) {
            notification.success({
                message: '保存成功'
            })
            if (!this.props.params.type) {
                // window.history.back();
                hashHistory.push('/red');
            }

        }
        if (data.status == 0) {
            notification.error({
                message: data.message,
                description: '请选择渠道',
            })
        }
    }
    checkPrice = (rule, value, callback) => {
        if (value > 0) {
            callback();
            return;
        }
        callback('必须填写大于0的数字');
    }
    //红包类型设置
    setRedType(v) {
        this.setState({
            redType: v,
            channelCode: null
        })
    }
    setSingleState(k, v) {
        this.setState({
            [k]: v,
        })
    }
    //定向用户列表
    getPhoneNumberList(value) {
        this.setState({
            phoneNumberList: value
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

    render() {
        //////////////样式///////////////////
        const title = {
            lineHeight: "50px",
            borderBottom: "1px solid #e3e6e6",
            textIndent: "8px",
            fontSize: "16px"
        }
        const back = {
            paddingRight: "8px"
        }
        const box = {
            padding: "40px 20px 20px 20px"
        }
        const font_color = {
            color: "#242424"
        }
        const font_14px = {
            fontSize: "14px"
        }
        const addAndMud = {}
        const red_detail = {
            margin: "4px 0px 4px 0px",
            textAlign: "center",
            lineHeight: "26px"
        }
        const redListData = {
            margin: "0px 0px 5px 0px"
        }
        //////////////样式///////////////////
        const { getFieldDecorator } = this.props.form;
        const text_prompt = "请填写内容";

        const children = [];
        return <div className="add">
            <h2 style={title}><Link style={font_color} to="/red" ><Icon style={back} type="left" />{this.props.params.type ? "编辑红包活动" : "添加红包活动"}</Link></h2>
            <div style={box}>
                <Form onSubmit={(e) => { this.handleSubmit(e) }}>

                    <FormItem
                        label="活动类型"
                        className="special"
                        labelCol={{ span: 3 }}
                        wrapperCol={{ span: 18 }}>
                        <Row>
                            <Col span={4}>
                                {
                                    getFieldDecorator('activityType', {
                                        initialValue: this.props.params.type ? this.props.params.type : null,
                                        rules: [{ required: true, message: text_prompt }],
                                    })(
                                        <Select disabled={this.props.params.type ? true : false} placeholder={"请输入活动类型"} style={{ width: "100%" }} onChange={(v) => { this.setRedType(v) }}>
                                            <Option value="H5">H5红包活动</Option>
                                            <Option value="DIRECTIONAL">定向红包</Option>
                                            <Option value="CHANNEL">渠道红包</Option>
                                            <Option value="RECHARGE" disabled>充值红包</Option>
                                            <Option value="REGISTER">注册红包</Option>
                                        </Select>
                                    )
                                }
                            </Col>
                            {
                                (this.state.redType == "REGISTER")
                                &&
                                <Col span={6} offset={2}>
                                    <Select value={this.state.channelCode ? this.state.channelCode : "请选择渠道"} style={{ width: "100%" }} onChange={(v) => { this.setSingleState("channelCode", v) }}>
                                        {
                                            this.state.channelList.map((item, i) => {
                                                return <Option value={item.code} key={i}>{item.name}</Option>
                                            })
                                        }

                                    </Select>
                                </Col>
                            }
                            {
                                (this.state.redType == "CHANNEL")
                                &&
                                <Col span={6} offset={2}>
                                    <Select value={this.state.channelCode ? this.state.channelCode : []} mode="multiple" style={{ width: "100%" }} onChange={(v) => { this.setSingleState("channelCode", v) }}>

                                        {
                                            this.state.channelList.map((item, i) => {
                                                return <Option value={item.code} key={i}>{item.name}</Option>
                                            })
                                        }

                                    </Select>
                                </Col>
                            }
                        </Row>
                    </FormItem>

                    {
                        this.state.redType == "RECHARGE"
                            ?
                            <FormItem
                                label="关联商品"
                                className="special"
                                labelCol={{ span: 3 }}
                                wrapperCol={{ span: 9 }}>
                                {
                                    getFieldDecorator('coinCode', {
                                        initialValue: this.state.lookData ? this.state.lookData.coinCode : null,
                                        rules: [{ required: true, message: text_prompt }],
                                    })(
                                        <Select disabled placeholder={"请选择关联商品"} style={{ width: "100%" }}>
                                            {
                                                this.state.goodsList.map((item, i) => {
                                                    return <Option key={i} value={item.coinCode}>{item.coin}--{item.appModel == "IOS" ? "苹果" : "安卓"}</Option>
                                                })
                                            }
                                        </Select>
                                    )
                                }
                            </FormItem>
                            :
                            null
                    }

                    {
                        this.state.redType != "RECHARGE"
                            ?
                            <FormItem
                                label="活动名称"
                                labelCol={{ span: 3 }}
                                wrapperCol={{ span: 6 }}>
                                {
                                    getFieldDecorator('activityName', {
                                        initialValue: this.state.lookData ? this.state.lookData.activityName : null,
                                        rules: [{ required: true, message: text_prompt }],
                                    })(<Input placeholder={"请输入活动名称"} />)
                                }
                            </FormItem>
                            :
                            null
                    }

                    {
                        this.state.redType == "RECHARGE"
                            ?
                            <FormItem
                                label="咿啦币数量"
                                labelCol={{ span: 3 }}
                                wrapperCol={{ span: 9 }}>
                                {
                                    getFieldDecorator('coin', {
                                        initialValue: this.state.lookData ? this.state.lookData.coin : null,
                                        rules: [{ required: true, message: text_prompt }],
                                    })(<Input placeholder={"请输入活动名称"} />)
                                }
                            </FormItem>
                            :
                            null
                    }

                    {
                        this.state.redType == "RECHARGE"
                            ?
                            <FormItem
                                label="对应人民币"
                                labelCol={{ span: 3 }}
                                wrapperCol={{ span: 9 }}>
                                {
                                    getFieldDecorator('priceContent', {
                                        initialValue: this.state.lookData ? this.state.lookData.priceContent : null,
                                        rules: [{ required: true, message: text_prompt }],
                                    })(<Input placeholder={"请输入活动名称"} />)
                                }
                            </FormItem>
                            :
                            null
                    }

                    {
                        this.state.redType == "RECHARGE"
                            ?
                            <FormItem
                                label="赠送内容"
                                labelCol={{ span: 3 }}
                                wrapperCol={{ span: 9 }}>
                                {
                                    getFieldDecorator('giftCoin', {
                                        initialValue: this.state.lookData ? this.state.lookData.giftCoin : null,
                                        rules: [{ required: true, message: text_prompt }],
                                    })(<Input placeholder={"请输入活动名称"} />)
                                }
                            </FormItem>
                            :
                            null
                    }
                    <FormItem
                        className="text_indent"
                        label="红包金额"
                        labelCol={{ span: 3 }}
                        wrapperCol={{ span: 9 }}>
                        <Row>
                            <Col span={8}>
                                <Input disabled value={this.state.red_total} />
                            </Col>
                            <Col offset={1} span={4}>
                                <span style={font_14px}>
                                    元
                                </span>
                            </Col>
                        </Row>
                    </FormItem>

                    <Row>
                        <Col span={12} offset={3}>
                            {
                                this.state.redList.map((item, i) => {
                                    return (
                                        <Row style={red_detail} key={i}>
                                            <Col span={4}>
                                                <Select value={item.price + "元"} style={{ width: "100%" }} onChange={(value) => { this.changeRedPrice("price", value, item.id) }}>
                                                    <Option disabled={this.state.redList.find(n => n.price == 1)} value="1">1元</Option>
                                                    <Option disabled={this.state.redList.find(n => n.price == 2)} value="2">2元</Option>
                                                    <Option disabled={this.state.redList.find(n => n.price == 3)} value="3">3元</Option>
                                                    <Option disabled={this.state.redList.find(n => n.price == 4)} value="4">4元</Option>
                                                </Select>
                                            </Col>
                                            <Col span={1} offset={1}>
                                                <Icon style={{ lineHeight: "34px" }} type="close" />
                                            </Col>
                                            <Col span={4} offset={1}>
                                                <InputNumber min={1} precision={0} onChange={(value) => { this.changeRedPrice("num", value, item.id) }} value={item.num} />
                                            </Col>

                                            <Col style={addAndMud} span={1} offset={1}>
                                                {
                                                    <Tooltip placement="top" title={"点击删除"}><Icon className="addAndMud" onClick={() => { this.minusRedItem(item.id) }} type="minus-circle" /></Tooltip>
                                                }
                                            </Col>
                                        </Row>
                                    )
                                })
                            }
                        </Col>
                    </Row>
                    {/*这里是增加红包那咿行*/}
                    <Row>
                        <Col span={12} offset={3}>
                            {
                                this.state.redList.length == 4
                                    ?
                                    <div></div>
                                    :
                                    <Row style={red_detail}>
                                        <Col span={4}>
                                            <Select value={this.state.red_money} style={{ width: "100%" }} onChange={(v) => { this.setSingleState("red_money", v) }}>
                                                <Option disabled={this.state.redList.find(n => n.price == 1)} value="1">1元</Option>
                                                <Option disabled={this.state.redList.find(n => n.price == 2)} value="2">2元</Option>
                                                <Option disabled={this.state.redList.find(n => n.price == 3)} value="3">3元</Option>
                                                <Option disabled={this.state.redList.find(n => n.price == 4)} value="4">4元</Option>
                                            </Select>
                                        </Col>
                                        <Col span={1} offset={1}>
                                            <Icon style={{ lineHeight: "34px" }} type="close" />
                                        </Col>
                                        <Col span={4} offset={1}>
                                            <InputNumber min={0} precision={0} value={this.state.red_number} onChange={(value) => { this.setSingleState("red_number", value) }} />
                                        </Col>
                                        <Col style={addAndMud} span={1} offset={1}>
                                            {
                                                <Tooltip placement="top" title={"点击增加红包"}><Icon className="addAndMud" onClick={() => { this.addRedItem() }} type="plus-circle" /></Tooltip>
                                            }
                                        </Col>
                                    </Row>
                            }
                        </Col>
                    </Row>

                    <Row>
                        <Col span={12} offset={3}>
                            <p style={redListData}>
                                {
                                    this.state.redList.map((item, index) => {
                                        if (index == this.state.redList.length - 1) {
                                            return <span key={index}>{item.price}元x{item.num == "" ? 0 : item.num}=</span>
                                        }
                                        return <span key={index}>{item.price}元x{item.num == "" ? 0 : item.num}+</span>

                                    })
                                }
                                {
                                    this.state.red_total
                                }元
                            </p>
                        </Col>
                    </Row>

                    {
                        this.state.redType != "RECHARGE"
                            ?
                            <FormItem
                                className="text_indent"
                                label="红包有效期"
                                labelCol={{ span: 3 }}
                                wrapperCol={{ span: 9 }}>
                                <Row>
                                    <Col span={8}>
                                        {
                                            getFieldDecorator('validTime', {
                                                initialValue: this.state.lookData ? this.state.lookData.validTime : null,
                                                rules: [{ required: true, validator: this.checkPrice }],
                                            })(<InputNumber min={0} />)
                                        }
                                    </Col>
                                    <Col offset={1} span={4}>
                                        <span style={font_14px}>
                                            天
        </span>
                                    </Col>
                                </Row>
                            </FormItem>
                            :
                            null
                    }

                    {
                        this.state.redType != "RECHARGE"
                            ?
                            <FormItem
                                labelCol={{ span: 3 }}
                                wrapperCol={{ span: 5 }}
                                label="活动开始时间">
                                {
                                    getFieldDecorator('startTime', {
                                        initialValue: this.state.lookData ? moment(this.state.lookData.startTime, "YYYY-MM-DD HH:mm:ss") : null,
                                        rules: [{ type: 'object', required: true, message: text_prompt }],
                                    })(
                                        <DatePicker style={{ width: "100%" }} showTime format="YYYY-MM-DD HH:mm:ss" />
                                    )
                                }
                            </FormItem>
                            :
                            null
                    }

                    {
                        this.state.redType != "RECHARGE"
                            ?
                            <FormItem
                                labelCol={{ span: 3 }}
                                wrapperCol={{ span: 5 }}
                                label="活动结束时间">
                                {
                                    getFieldDecorator('endTime', {
                                        initialValue: this.state.lookData ? moment(this.state.lookData.endTime, "YYYY-MM-DD HH:mm:ss") : null,
                                        rules: [{ type: 'object', required: true, message: text_prompt }],
                                    })(
                                        <DatePicker style={{ width: "100%" }} showTime format="YYYY-MM-DD HH:mm:ss" />
                                    )
                                }
                            </FormItem>
                            :
                            null
                    }
                    {
                        this.state.redType != "RECHARGE"
                            ?
                            <FormItem
                                label="用户数量"
                                labelCol={{ span: 3 }}
                                wrapperCol={{ span: 9 }}>
                                <Row>
                                    <Col span={8}>
                                        {
                                            getFieldDecorator('activityAmount', {
                                                initialValue: this.state.lookData ? this.state.lookData.activityAmount : null,
                                                rules: [{ required: false, message: this.state.isLimit ? '' : text_prompt }],
                                            })(<InputNumber min={1} precision={0} disabled={this.state.isLimit} setFieldsValue={this.state.activityAmount} onChange={(value) => { this.setState({ activityAmount: value }) }} />)
                                        }
                                    </Col>
                                    <Col span={11} offset={1}>
                                        <Tooltip placement="top" title={this.state.isLimit ? "如果去掉勾选不要忘记填写用户数量" : "如果勾选用户数量为不限定"}>
                                            <Checkbox onChange={() => { this.setState({ activityAmount: null, isLimit: !this.state.isLimit }) }} checked={this.state.isLimit}>不限定</Checkbox>
                                        </Tooltip>
                                    </Col>
                                </Row>
                            </FormItem>
                            :
                            null
                    }
                    {
                        this.state.redType == "DIRECTIONAL"
                            ?
                            <FormItem
                                label="需要发送的手机号"
                                labelCol={{ span: 3 }}
                                wrapperCol={{ span: 9 }}>
                                <Row>
                                    <Col span={24} className='highSelect'>
                                        {
                                            getFieldDecorator('sendMembers', {
                                                rules: [{ required: true, message: text_prompt }],
                                            })(
                                                <Select
                                                    mode="tags"
                                                    style={{ width: '100%' }}
                                                    onChange={(value) => { this.getPhoneNumberList(value) }}
                                                    tokenSeparators={[',']}
                                                    placeholder="在下面输入手机号码或账号，按回车继续输入"
                                                >
                                                    {children}
                                                </Select>
                                            )
                                        }
                                    </Col>
                                </Row>
                                <Row>
                                    <Col offset={16} className="totle_num">
                                        <span style={{ ...font_14px }}>共{this.state.phoneNumberList.length}人</span>
                                    </Col>
                                </Row>
                            </FormItem>
                            :
                            null
                    }

                    <FormItem
                        wrapperCol={{ span: 3, offset: 3 }}>
                        <Button className="submit" type="primary" htmlType="submit">
                            保存
                        </Button>
                    </FormItem>
                </Form>
            </div>
        </div>
    }
}
const WrappedApp = Form.create()(addGoods);

export default WrappedApp;
