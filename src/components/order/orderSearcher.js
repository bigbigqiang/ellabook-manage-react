
import React from 'react'
import { DatePicker, Select, Icon, Button, Input, Modal, Row, Col, InputNumber, Checkbox, message } from 'antd'
import 'whatwg-fetch';
import './orderList.css';
import moment from 'moment';
import commonData from '../commonData.js';
const Search = Input.Search;
const Option = Select.Option;
const CheckboxGroup = Checkbox.Group;
const util = require('../util.js');

export default class OrderSearcher extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            channelItem: [],
            loading: true,
            startValue: '',
            endValue: '',

            defaultData: {
                dateTypeList: [],
                channel: [],
                orderTypeList: [],
                payTypeList: [],
                goodsTypeList: [],
                buyTypeList: [],
            },
            expand: false,
            exportModalVisible: false,
            exportData: {
                dateType: 'orderFinishedTime',
                startTime: '',
                endTime: '',
                channelCode: null,
                orderPayType: null,
                goodsType: null,
                buyType: null,
                pageSize: null,
                page: 0,
                orderInfoVoList: []
            },
            exportDataLength: 0,
            exportDataLengthShow: false,
            exportLoading: false,
            plainOptions: [
                {
                    index: 0,
                    name: '订单编号',
                    value: 'orderNo'
                },
                {
                    index: 1,
                    name: '用户ID',
                    value: 'uid'
                },

                {
                    index: 2,
                    name: '用户账号',
                    value: 'userNick'
                },
                {
                    index: 3,
                    name: '商品类型',
                    value: 'goodsType'
                },
                {
                    index: 4,
                    name: '商品名称',
                    value: 'goodsName'
                },
                {
                    index: 5,
                    name: '订单金额',
                    value: 'orderAmount'
                },
                {
                    index: 6,
                    name: '实付金额',
                    value: 'payAmount'
                },
                {
                    index: 7,
                    name: '渠道',
                    value: 'channelName'
                },
                {
                    index: 8,
                    name: '支付方式',
                    value: 'paymentPlantform'
                },
                {
                    index: 9,
                    name: '订单类型',
                    value: 'orderType'
                },
                {
                    index: 10,
                    name: '完成日期',
                    value: 'finishedTime'
                },
                {
                    index: 11,
                    name: '订单状态',
                    value: 'orderStatus'
                }]
        };
        this.startTime = this.startTime.bind(this);
        this.cancelExportModal = this.cancelExportModal.bind(this);
        this.exportModal = this.exportModal.bind(this);
        this.visibleExportModal = this.visibleExportModal.bind(this);
        this.setStartOrEndData = this.setStartOrEndData.bind(this);
        this.checkDataLength = this.checkDataLength.bind(this);
    }
    componentDidMount() {
        this.fetchResultItem("ORDER_MANAGE_LIST");
        this.fetchChannelItem()
    }
    async fetchResultItem(fetchStr) {
        var data = await fetch(util.url, {
            mode: "cors",
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },

            body: "method=ella.operation.boxSearchList" + "&content=" + JSON.stringify({ "groupId": fetchStr }) + commonData.dataString

        }).then(res => res.json())
        this.setState({
            channelItem: data.data,
            defaultData: {
                ...this.state.defaultData,
                dateTypeList: data.data.filter(item => item.remark == '时间类型'),
                orderTypeList: data.data.filter(item => item.remark == '订单状态'),
                payTypeList: data.data.filter(item => item.remark == '支付方式'),
                goodsTypeList: data.data.filter(item => item.remark == '商品类型'),
                buyTypeList: data.data.filter(item => item.remark == '购买类型'),
            }
        })
    }

    timeChange(name, value) {
        this.props.getTimeData(name, value);
    }
    payChange(name, value) {
        this.props.getPayData(name, value);
    }
    orderChange(name, value) {
        this.props.getOrderData(name, value);
    }
    payTypeChange(name, value) {
        this.props.getPayTypeData(name, value);
    }
    goodsTypeChange(name, value) {
        this.props.getGoodsTypeData(name, value);
    }
    buyTypeChange(name, value) {
        this.props.getBuyTypeData(name, value);
    }
    searchChange(name, value) {
        this.props.getSearchData(name, value);
    }
    startTime(value, dateString, str) {
        this.props.getStartTime(value, dateString, str);
    }
    endTime(value, dateString, str) {
        this.props.getEndTime(value, dateString, str);
    }
    searchContent(name, value) {
        this.props.getSearchContentData(name, value)
    }
    toggle() {
        const { expand } = this.state;
        this.setState({ expand: !expand });
    }

    cancelExportModal() {
        this.setState({
            exportModalVisible: false,
            exportData: {
                dateType: 'orderFinishedTime',
                startTime: '',
                endTime: '',
                channelCode: null,
                orderPayType: null,
                goodsType: null,
                buyType: null,
                pageSize: null,
                page: 0,
                orderInfoVoList: []
            }
        })
    }
    visibleExportModal() {
        this.setState({
            exportModalVisible: true,
            exportDataLengthShow: false,
            exportData: {
                dateType: 'orderFinishedTime',
                startTime: '',
                endTime: '',
                channelCode: null,
                orderPayType: null,
                goodsType: null,
                buyType: null,
                pageSize: null,
                page: 0,
                orderInfoVoList: []
            }
        })
    }

    exportModal() {
        if (!(this.state.exportData.startTime && this.state.exportData.endTime)) {
            message.error('订单完成时间未填写');
            return;
        }
        if (!this.state.exportData.pageSize) {
            message.error('订单数量未填写');
            return;
        }
        if (!this.state.exportData.orderInfoVoList.length) {
            message.error('导出字段未选择');
            return;
        }
        if (this.state.exportData.pageSize>5000) {
            message.error('最多可导出5000条数据，请重新填写订单数量');
            return;
        }
        let overArray = [];
        let orderInfoVoList = [];
        this.state.exportData.orderInfoVoList.map((ele) => {
            overArray.push(this.state.plainOptions.filter((item) => item.value === ele)[0])
        })
        function compare(prop) {
            return function (obj1, obj2) {
                var val1 = obj1[prop];
                var val2 = obj2[prop]; if (val1 < val2) {
                    return -1;
                } else if (val1 > val2) {
                    return 1;
                } else {
                    return 0;
                }
            }
        }
        overArray.sort(compare("index")).map((item) => {
            orderInfoVoList.push(item.value)
        })
        this.setState({
            exportLoading:true
        })
        let params = { ...this.state.exportData }
        params.orderStatus = 'PAY_SUCCESS'
        params.searchType = 'categorySearch'
        params.orderInfoVoList = orderInfoVoList
        util.API(params, 'ella.operation.listOrderExcel').then(res => res.json()).then((data) => {
            if (data.status == '1') {
                this.setState({
                    exportLoading:false,
                    exportModalVisible:false
                })
                window.location = data.data
            } else {
                this.setState({
                    exportLoading:false
                })
                message.error(data.message)
            }
        }).catch(e => {
            console.log(e.message)
        })
    }
    checkDataLength() {
        if (!(this.state.exportData.startTime && this.state.exportData.endTime)) {
            message.error('订单完成时间未填写');
            return;
        }
        let params = { ...this.state.exportData }
        params.pageSize = 1
        params.orderStatus = 'PAY_SUCCESS'
        params.searchType = 'categorySearch'
        util.API(params, 'ella.operation.orderManageList').then(res => res.json()).then((data) => {
            if (data.status == '1') {
                let exportDataLength = data.data.total>5000?5000:data.data.total
                this.setState({
                    exportDataLength: exportDataLength,
                    exportDataLengthShow: true
                })
            } else {
                message.error(data.message)
            }
        }).catch(e => {
            console.log(e.message)
        })
    }

    setStartOrEndData(date, dateString, str) {
        this.setState({
            exportData: {
                ...this.state.exportData,
                [str]: dateString
            }
        })
    }
    setStateExportData(str, value) {
        this.setState({
            exportData: {
                ...this.state.exportData,
                [str]: value
            }
        })
    }
    //拉取渠道信息
    async fetchChannelItem(text) {
        var data = await fetch(util.url, {
            mode: "cors",
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: "method=ella.operation.boxSearchList" + "&content=" + JSON.stringify({
                type: "AUTO_BOX",
                groupId: "operation.box.chanelList"
            }) + commonData.dataString
        }).then(res => res.json())
        this.setState({
            defaultData: {
                ...this.state.defaultData,
                channel: data.data
            }

        })
    }
    render() {
        return (
            <div>
                <p className="m-head">订单查询</p>
                <div className="m-order-bd">
                    <div className="m-accurate">
                        <div>
                            <Select defaultValue="userMobile" className="selectWidth intervalRight" onChange={(value) => this.searchChange("search", value)}>
                                <Option value="orderCode">订单编码</Option>
                                <Option value="uid">用户编码</Option>
                                <Option value="userMobile">用户手机</Option>
                                <Option value="goodsCode">商品编码</Option>
                                <Option value="bookCode">书籍编码</Option>
                                <Option value="userNick">用户昵称</Option>
                                <Option value="uid">uid编码</Option>
                            </Select>
                            <Search placeholder="输入检索内容" enterButton className="searchWidth intervalRight" onSearch={(value) => { this.searchContent("searchContent", value) }} />
                            <Button className="u-btn inline-block" onClick={() => { this.toggle() }}>更多条件<Icon type={this.state.expand ? 'up' : 'down'} /></Button>
                            <Button className="u-btn" style={{ marginLeft: '30px' }} onClick={this.visibleExportModal}>导出订单列表</Button>
                        </div>
                    </div>
                    <div className="m-expand-box" style={{ display: this.state.expand ? 'block' : 'none', 'marginLeft': '20px', 'marginTop': '20px' }}>
                        <div className="part">
                            <span className="u-txt">时间筛选:</span>
                            <Select value={this.props.timeData} className="selectWidth" onChange={(value) => this.timeChange("time", value)}>
                                {
                                    this.state.defaultData.dateTypeList.map((item, i) => {
                                        return <Option value={item.searchCode} key={i}>{item.searchName}</Option>
                                    })
                                }
                            </Select>
                        </div>

                        <div className="part">
                            <DatePicker
                                format="YYYY-MM-DD"
                                placeholder={['开始时间']}
                                onChange={(value, dateString) => this.startTime(value, dateString, "startTime")}
                                value={this.props.startTimeData != '' ? moment(this.props.startTimeData, 'YYYY-MM-DD') : null}
                            /><i> — </i>
                            <DatePicker
                                format="YYYY-MM-DD"
                                placeholder={['结束时间']}
                                onChange={(value, dateString) => this.endTime(value, dateString, "endTime")}
                                value={this.props.endTimeData != '' ? moment(this.props.endTimeData, 'YYYY-MM-DD') : null}
                            />
                        </div>

                        <div className="part">
                            <span className="u-txt">渠道:</span>
                            <Select value={this.props.payData} className="selectWidth" onChange={(value) => this.payChange("pay", value)}>
                                <Option value={null}>全部</Option>
                                {
                                    this.state.defaultData.channel.map((item, i) => {
                                        return <Option value={item.code} key={i}>{item.name}</Option>
                                    })
                                }
                            </Select>
                        </div>
                        <div className="part">
                            <span className="u-txt">订单状态:</span>
                            <Select value={this.props.orderData} className="selectWidth" onChange={(value) => this.orderChange("order", value)}>
                                <Option value={null}>全部</Option>
                                {
                                    this.state.defaultData.orderTypeList.map((item, i) => {
                                        return <Option value={item.searchCode} key={i}>{item.searchName}</Option>
                                    })
                                }
                            </Select>
                        </div>
                        <div className="part">
                            <span className="u-txt">支付平台:</span>
                            <Select value={this.props.payTypeData} className="selectWidth" onChange={(value) => this.payTypeChange("payType", value)}>
                                <Option value={null}>全部</Option>
                                {
                                    this.state.defaultData.payTypeList.map((item, i) => {
                                        return <Option value={item.searchCode} key={i}>{item.searchName}</Option>
                                    })
                                }
                            </Select>
                        </div>
                        <div className="part">
                            <span className="u-txt">商品类型:</span>
                            <Select value={this.props.goodsTypeData} className="selectWidth" onChange={(value) => this.goodsTypeChange("goodsType", value)}>
                                <Option value={null}>全部</Option>
                                {
                                    this.state.defaultData.goodsTypeList.map((item, i) => {
                                        return <Option value={item.searchCode} key={i}>{item.searchName}</Option>
                                    })
                                }
                            </Select>
                        </div>
                        <div className="part">
                            <span className="u-txt">订单类型:</span>
                            <Select value={this.props.buyTypeData} className="selectWidth" onChange={(value) => this.buyTypeChange("buyType", value)}>
                                <Option value={null}>全部</Option>
                                {
                                    this.state.defaultData.buyTypeList.map((item, i) => {
                                        return <Option value={item.searchCode} key={i}>{item.searchName}</Option>
                                    })
                                }
                            </Select>
                        </div>
                        <div>
                            <Button className="u-btn block buttonWidth intervalRight" onClick={this.props.query}>查询</Button>
                            <Button className="u-btn block buttonWidth" onClick={this.props.clearSelect}>恢复默认</Button>
                        </div>
                    </div>
                </div>
                <Modal
                    title="订单列表导出"
                    width={740}
                    visible={this.state.exportModalVisible}
                    onOk={this.exportModal}
                    onCancel={this.cancelExportModal}
                    okText="导出"
                    cancelText="取消"
                    footer={[
                        <Button key="back" onClick={this.cancelExportModal}>取消</Button>,
                        <Button key="submit" type="primary" loading={this.state.exportLoading} onClick={this.exportModal}>
                            导出
                        </Button>,
                    ]}
                >
                    <Row className="rowPart" style={{ marginBottom: 10 }}>
                        <span className="colTitle">订单完成时间:</span>
                        <DatePicker
                            style={{ marginLeft: 10, width: 150 }}
                            className="intervalBottom"
                            placeholder={'开始时间'}
                            onChange={(value, dateString) => { this.setStartOrEndData(value, dateString, "startTime") }}
                            value={this.state.exportData.startTime != '' ? moment(this.state.exportData.startTime, 'YYYY-MM-DD') : null}
                        />
                        <span className="line"> — </span>
                        <DatePicker
                            className="intervalRight intervalBottom"
                            style={{ width: 150 }}
                            placeholder={'结束时间'}
                            onChange={(value, dateString) => { this.setStartOrEndData(value, dateString, "endTime") }}
                            value={this.state.exportData.endTime != '' ? moment(this.state.exportData.endTime, 'YYYY-MM-DD') : null}
                        />
                    </Row>
                    <Row className="rowPart" style={{ marginBottom: 10 }}>
                        <span className="colTitle">渠道:</span>
                        <Select value={this.state.exportData.channelCode} className="intervalRight intervalBottom" style={{ marginLeft: 37, width: 130 }} onChange={(value) => this.setStateExportData("channelCode", value)}>
                            <Option value={null}>全部</Option>
                            {
                                this.state.defaultData.channel.map((item, i) => {
                                    return <Option value={item.code} key={i}>{item.name}</Option>
                                })
                            }
                        </Select>
                        <span className="colTitle">支付平台:</span>
                        <Select value={this.state.exportData.orderPayType} className="intervalRight intervalBottom" style={{ marginLeft: 10, width: 130 }} onChange={(value) => this.setStateExportData("orderPayType", value)}>
                            <Option value={null}>全部</Option>
                            {
                                this.state.defaultData.payTypeList.map((item, i) => {
                                    return <Option value={item.searchCode} key={i}>{item.searchName}</Option>
                                })
                            }
                        </Select>
                        <span className="colTitle">商品类型:</span>
                        <Select value={this.state.exportData.goodsType} className="intervalRight intervalBottom" style={{ marginLeft: 10, width: 130 }} onChange={(value) => this.setStateExportData("goodsType", value)}>
                            <Option value={null}>全部</Option>
                            {
                                this.state.defaultData.goodsTypeList.map((item, i) => {
                                    return <Option value={item.searchCode} key={i}>{item.searchName}</Option>
                                })
                            }
                        </Select>
                    </Row>
                    <Row className="rowPart" style={{ marginBottom: 10 }}>
                        <span className="colTitle">订单类型:</span>
                        <Select value={this.state.exportData.buyType} className="intervalRight intervalBottom" style={{ marginLeft: 10, width: 130 }} onChange={(value) => this.setStateExportData("buyType", value)}>
                            <Option value={null}>全部</Option>
                            {
                                this.state.defaultData.buyTypeList.map((item, i) => {
                                    return <Option value={item.searchCode} key={i}>{item.searchName}</Option>
                                })
                            }
                        </Select>
                        <span className="colTitle">订单数量:</span>
                        <InputNumber min={1} style={{ marginLeft: 10 }} value={this.state.exportData.pageSize} onChange={(value) => this.setStateExportData("pageSize", value)} />
                        <Button type='primary' style={{ marginLeft: '30px' }} onClick={this.checkDataLength}>查询</Button>
                        {this.state.exportDataLengthShow && <span style={{ marginLeft: '10px', color: '#faad14' }}>最多导出{this.state.exportDataLength}条订单数据</span>}
                    </Row>
                    <Row className="rowPart" style={{ marginBottom: 10, display: 'flex' }}>
                        <span className="colTitle">导出字段:</span>
                        <CheckboxGroup value={this.state.exportData.orderInfoVoList} onChange={(value) => { this.setStateExportData("orderInfoVoList", value) }} style={{ display: 'inline' }}>
                            <Row style={{ paddingTop: 6 }}>
                                {
                                    this.state.plainOptions.map((item, i) => {
                                        return <Col span={6} key={i} style={{ marginBottom: 10 }}><Checkbox value={item.value}>{item.name}</Checkbox></Col>
                                    })
                                }
                            </Row>
                        </CheckboxGroup>
                    </Row>
                </Modal>
            </div>
        )
    }
}
