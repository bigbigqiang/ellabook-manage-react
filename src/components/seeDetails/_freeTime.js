import React from 'react';
import { Table, Icon, Button, Row, Col, Select, DatePicker, Input, Popconfirm, message, Modal, Radio, Checkbox } from 'antd';
const { MonthPicker, RangePicker } = DatePicker;
import moment from 'moment';
import 'moment/locale/zh-cn';
import { dataString } from '../commonData.js'
moment.locale('zh-cn');
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;
import "./freeTime.css";
import "../../main.css";
import getUrl from "../util.js";
//thirdCode:商品id,goodsName:商品名字,goodsSrcPrice:原价,goodsMarketprice:(市场价?售价)
// TODO:未做的工作:1.单选和多选对应的渠道值;2.新加数据没有设置状态;3.操作的文字是更加状态的不同来显示不同;4.父级接收子集数据
export default class PriceSet extends React.Component {

    constructor() {
        super()
        this.state = {
            visible: false,
            isAdd: true,
            idx: 0,
            freeTimeData: [
                // {
                //     channel: 'custom',
                //     customChannel: ['huawei', 'qq', 'baidu'],
                //     state: 'WAITING',
                //     startTime: '2018-05-02',
                //     endTime: '2018-05-09',
                //     showTime: '2018-05-02 至 2018-05-09'
                // }
            ],
            tempData: {
                channel: '',
                customChannel: [],
                state: '',
                startTime: '',
                endTime: '',
                showTime: '',
                limitType:"GOODS_BUY",
                limitUser:"ALL_USER"
            },            //临时选的数据
        }
    }
    componentDidMount() {
        this.fetchDefaultData(this.props.prveData.goodsCode);
    }
    async fetchDefaultData(code) {
        var data = await fetch(getUrl.url, {
            mode: "cors",
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: "method=ella.operation.getGoodsInfoByCode" + "&content=" + JSON.stringify({ "goodsCode": code }) + dataString
        }).then(res => res.json());
        if (data.status == 1) {
            this.setState({
                freeTimeData: data.data.goodsLimitExemptionRelationList.map(item => {
                    return {
                        channel: (item.channelCode != "ios" && item.channelCode != "android" && item.channelCode != "all")
                            ?
                            'custom'
                            :
                            item.channelCode,
                        customChannel: (item.channelCode != "ios" && item.channelCode != "android" && item.channelCode != "all") ? item.channelCode.split(',') : [],
                        state: item.exemptStatus,
                        startTime: item.startTime,
                        endTime: item.endTime,
                        showTime: item.startTime + ' 至 ' + item.endTime,
                        exemptCode: item.exemptCode,
                        limitType: item.limitType,
                        limitUser: item.limitUser
                    }
                })

            }, () => {
                this.props.getFreeTimeData('freeTimeData', this.state.freeTimeData);
            })
        } else {
            console.log(data.message)
        }
    }
    setOneKV(k, v) {
        this.setState({
            [k]: v
        })
    }
    // TODO:增加和编辑写在一个函数里了
    add() {
        function CompareDate(d1, d2) {
            return ((new Date(d1.replace(/-/g, "\/"))) >= (new Date(d2.replace(/-/g, "\/"))));
        }
        if (this.state.tempData.limitType == '') {
            message.error('限定类型未选择');
            return;
        }
        if (this.state.tempData.limitUser == '') {
            message.error('角色未选择');
            return;
        }
        if (!this.state.tempData.channel) {
            message.error('未选择渠道');
            return;
        }
        if (this.state.tempData.channel == 'custom' && this.state.tempData.customChannel.length == 0) {
            message.error('自定义渠道未选择');
            return;
        }
        if (this.state.tempData.startTime == '' || this.state.tempData.endTime == '') {
            message.error('时间未填写');
            return;
        }
        if (CompareDate(this.state.tempData.startTime, this.state.tempData.endTime) && this.state.tempData.startTime != this.state.tempData.endTime) {
            message.error('时间设置不正确');
            return;
        }
        var flag = true;
        this.state.freeTimeData.forEach((item) => {
            var curStartTime = new Date(item.startTime).getTime();
            var curEndTime = new Date(item.endTime).getTime();
            var tmpStartTime = new Date(this.state.tempData.startTime).getTime();
            var tmpEndTime = new Date(this.state.tempData.endTime).getTime();
            if (tmpStartTime >= curStartTime && tmpStartTime <= curEndTime) {
                message.error("限定时间冲突，请确认后再操作！");
                flag = false;
                return;
            }
            if (tmpEndTime >= curStartTime && tmpEndTime <= curEndTime) {
                message.error("限定时间冲突，请确认后再操作！")
                flag = false;
                return;
            }
        })
        if (!flag) {
            return;
        }
        let item = this.state.tempData;
        // TODO:如果前端判断那就在这里写
        if ((new Date()) < (new Date(this.state.tempData.endTime.replace(/-/g, "\/"))) && (new Date()) > (new Date(this.state.tempData.startTime.replace(/-/g, "\/")))) {
            // alert('活动进行中');
            item.state = 'START';
        }
        if ((new Date()) >= (new Date(this.state.tempData.endTime.replace(/-/g, "\/")))) {
            // alert('活动结束');
            item.state = 'FINISHED';
        }
        if ((new Date()) <= (new Date(this.state.tempData.startTime.replace(/-/g, "\/")))) {
            // alert('活动未开始');
            item.state = 'WAITING';
        }
        // TODO:只要是新加的都展示为"-"
        item.state = '-';
        item.showTime = this.state.tempData.startTime + ' 至 ' + this.state.tempData.endTime;
        if (this.state.isAdd == true) {

            this.setState({
                freeTimeData: [
                    ...this.state.freeTimeData,
                    item
                ],
                visible: false,
                // TODO:一次添加成功就把临时数据制空
                tempData: {
                    channel: '',
                    customChannel: [],
                    state: '',
                    startTime: '',
                    endTime: '',
                    showTime: ''
                },
            }, () => {
                this.props.getFreeTimeData('freeTimeData', this.state.freeTimeData);
            })
        } else {
            console.log("bianjia");
            let freeTimeData = this.state.freeTimeData;
            freeTimeData[this.state.idx] = this.state.tempData;
            this.setState({
                visible: false,
                // TODO:一次添加成功就把临时数据制空
                freeTimeData,
                tempData: {
                    channel: '',
                    customChannel: [],
                    state: '',
                    startTime: '',
                    endTime: '',
                    showTime: '',
                    limitType: "GOODS_BUY",
                    limitUser: "ALL_VIP"
                },
            }, () => {
                this.props.getFreeTimeData('freeTimeData', this.state.freeTimeData);
            })
        }
    }
    updata() {

    }
    del(i) {
        console.log(i);
        this.setState({
            freeTimeData: this.state.freeTimeData.filter((item, index) => index != i)
        }, () => {
            this.props.getFreeTimeData('freeTimeData', this.state.freeTimeData);
        })
    }
    render() {
        const columns = [
            {
                title: '渠道',
                dataIndex: 'channel',
                key: 'channel',
                render: (text, record, index) => {
                    switch (text) {
                        case 'all':
                            return '全部渠道';
                        case 'ios':
                            return '仅IOS';
                        case 'android':
                            return '仅Android';
                        case 'custom':
                            return this.state.freeTimeData[index].customChannel.map((_item, _index) => {
                                let a;
                                switch (_item) {
                                    case 'c360':
                                        a = '360应用市场';
                                        break;
                                    case 'qq':
                                        a = '应用宝';
                                        break;
                                    case 'baidu':
                                        a = '百度';
                                        break;
                                    case 'oppo':
                                        a = 'oppo';
                                        break;
                                    case 'xiaomi':
                                        a = '小米市场';
                                        break;
                                    case 'vivo':
                                        a = 'vivo';
                                        break;
                                    case 'huawei':
                                        a = '华为';
                                        break;
                                }
                                return _index == this.state.freeTimeData[index].customChannel.length - 1 ? a : a + '/'
                            });

                    }
                }
            }, {
                title: '限定类型',
                dataIndex: 'limitType',
                key: 'limitType',
                render: (text, record, index) => {
                    return <span>{record.limitType == "GOODS_BUY" ? "购买" : record.limitType == "GOODS_BORROW" ? "借阅" : "-"}</span>
                }
            }, {
                title: '限免时间',
                dataIndex: 'showTime',
                key: 'showTime',
            }, {
                title: '限定角色',
                dataIndex: 'limitUser',
                key: 'limitUser',
                render: (text, record, index) => {
                    return <span>{record.limitUser == "ALL_USER" ? "全部用户" : record.limitUser == "ALL_VIP" ? "全部会员" : record.limitUser == "SVIP" ? "高级看书会员" : "-"}</span>
                }
            }, {
                title: '编辑',
                render: (text, record, index) => {
                    return (
                        <span
                            title="点击编辑"
                            className="i-action-ico i-edit"
                            onClick={() => {
                                this.setState({
                                    visible: true,
                                    isAdd: false,
                                    tempData: this.state.freeTimeData[index],
                                    idx: index
                                }, () => { console.log(this.state.tempData) })
                            }}
                        ></span>
                    )
                }
            }, {
                title: '操作',
                render: (text, record, index) => {
                    return <Popconfirm
                        onConfirm={() => { this.del(index) }}
                        title={`确定要${record.state == 'FINISHED' || record.state == 'EXPIRED' ? '删除这条记录' : '取消限免'}吗？`}
                        okText="删除"
                        cancelText="取消">
                        <a onClick={() => { }}>{
                            record.state == 'FINISHED' || record.state == 'EXPIRED' || record.state == '-' ? '删除记录' : '取消限免'
                        }</a>
                    </Popconfirm>
                }
            }
        ];
        // TODO:value要改
        const plainOptions = [
            { label: '360应用市场', value: 'c360' },
            { label: '应用宝', value: 'qq' },
            { label: '百度', value: 'baidu' },
            { label: 'oppo', value: 'oppo' },
            { label: '小米市场', value: 'xiaomi' },
            { label: 'vivo', value: 'vivo' },
            { label: '华为', value: 'huawei' },
        ];
        console.log(this.state.tempData)
        return <div className="freeTime">
            <h3>购买/借阅限定</h3>
            <div className="priceWrap">
                <Table
                    columns={columns}
                    pagination={false}
                    dataSource={this.state.freeTimeData} />
                <div className="addPriceWarp">
                    <Button
                        className="PriceSetBtn"
                        onClick={() => {
                            // this.setOneKV('visible', true);
                            this.setState({
                                visible: true,
                                isAdd: true
                            })
                        }}
                        type="primary"
                    >添加限定</Button>
                    <Modal
                        className="freeTimeModel"
                        title="购买/借阅限定"
                        visible={this.state.visible}
                        onOk={() => { this.add() }}
                        onCancel={() => {
                            this.setState({
                                visible: false,
                                tempData: this.state.isAdd == false ? [] : this.state.tempData
                            })
                        }}
                    >
                        <Row className="row">
                            <Col span={3}>限定类型</Col>
                        </Row>

                        <Row className="row">
                            <Col offset={3}>
                                <RadioGroup
                                        onChange={(e) => {
                                            this.setState({
                                                tempData: {
                                                    ...this.state.tempData,
                                                    limitType: e.target.value,
                                                    limitUser:'',
                                                }
                                            })
                                        }}
                                        value={this.state.tempData.limitType}>
                                        {/* TODO:判断值是all或ios或android否则就是custom */}
                                        <Radio value={"GOODS_BUY"}>购买</Radio>
                                        <Radio value={"GOODS_BORROW"}>借阅</Radio>
                                        
                                </RadioGroup>
                            </Col>
                        </Row>
                        <Row className="row">
                            <Col span={3}>渠道选择</Col>
                        </Row>

                        <Row className="row">
                            <Col offset={3}>
                                <RadioGroup
                                    onChange={(e) => {
                                        this.setState({
                                            tempData: {
                                                ...this.state.tempData,
                                                channel: e.target.value
                                            }
                                        })
                                    }}
                                    value={this.state.tempData.channel}>
                                    {/* TODO:判断值是all或ios或android否则就是custom */}
                                    <Radio value={"all"}>全部渠道</Radio>
                                    <Radio value={"ios"}>仅IOS</Radio>
                                    <Radio value={"android"}>仅Android</Radio>
                                    <Radio value={"custom"}>自定义</Radio>
                                </RadioGroup>
                            </Col>
                        </Row>

                        {
                            this.state.tempData.channel == 'custom'
                                ?
                                <Row className="row">
                                    <Col offset={3}>请选择需要的渠道名称(可多选):</Col>
                                </Row>
                                :
                                null
                        }
                        {
                            this.state.tempData.channel == 'custom'
                                ?
                                <Row className="row">
                                    <Col offset={3}>
                                        <CheckboxGroup
                                            options={plainOptions}
                                            value={this.state.tempData.customChannel}
                                            onChange={(v) => {
                                                console.log(v);
                                                this.setState({
                                                    tempData: {
                                                        ...this.state.tempData,
                                                        customChannel: v
                                                    }
                                                })
                                            }} />
                                    </Col>
                                </Row>
                                :
                                null
                        }
                        <Row className="row">
                            <Col span={3}>角色选择</Col>
                        </Row>
                        <Row className="row">
                            <Col offset={3}>
                                <RadioGroup
                                    onChange={(e) => {
                                        this.setState({
                                            tempData: {
                                                ...this.state.tempData,
                                                limitUser: e.target.value
                                            }
                                        })
                                    }}
                                    value={this.state.tempData.limitUser}>
                                    <Radio value={"ALL_USER"}>全部用户</Radio>
                                    <Radio value={"ALL_VIP"} disabled={this.state.tempData.limitType=="GOODS_BORROW"?true:false}>全部会员</Radio>
                                    <Radio value={"SVIP"} disabled={this.state.tempData.limitType=="GOODS_BORROW"?true:false}>高级看书会员</Radio>
                                </RadioGroup>
                            </Col>
                        </Row>

                        <Row className="row">
                            <Col span={3}>限免时间</Col>
                        </Row>

                        <Row className="row">
                            <Col offset={5} span={3}>开始时间:</Col>
                            <Col span={10}>
                                <DatePicker
                                    style={{ width: "100%" }}
                                    // showTime={{ format: 'HH:mm' }}
                                    // format="YYYY-MM-DD  HH:mm:ss"
                                    format="YYYY-MM-DD"
                                    placeholder={['请输入开始时间']}
                                    value={this.state.tempData.startTime ? moment(this.state.tempData.startTime, 'YYYY-MM-DD HH:mm:ss') : this.state.tempData.startTime}
                                    onChange={(value, dateString) => {
                                        this.setState({
                                            tempData: {
                                                ...this.state.tempData,
                                                startTime: dateString
                                            }
                                        })
                                    }}
                                />
                            </Col>
                        </Row>

                        <Row className="row">
                            <Col offset={5} span={3}>结束时间:</Col>
                            <Col span={10}>
                                <DatePicker
                                    style={{ width: "100%" }}
                                    // showTime={{ format: 'HH:mm' }}
                                    // format="YYYY-MM-DD HH:mm:ss"
                                    format="YYYY-MM-DD"
                                    placeholder={['请输入结束时间']}
                                    value={this.state.tempData.endTime ? moment(this.state.tempData.endTime, 'YYYY-MM-DD HH:mm:ss') : this.state.tempData.endTime}
                                    onChange={(value, dateString) => {
                                        this.setState({
                                            tempData: {
                                                ...this.state.tempData,
                                                endTime: dateString
                                            }
                                        })
                                    }}
                                />
                            </Col>
                        </Row>
                    </Modal>
                </div>
            </div>
            <hr />
        </div>
    }
}