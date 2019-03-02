/**
 * Created by Administrator on 2018/3/20.
 */
import React from 'react'
import { Table, Pagination, Select, DatePicker, Button, Input, Icon, Spin, Row, Col, Form, Switch, Cascader, Radio, message, InputNumber } from 'antd';
import { Link, hashHistory } from 'react-router';
import getUrl from "../util.js";
import commonData from '../commonData.js';
import './addFirst.css';
import moment from 'moment';
const FormItem = Form.Item;
const { Option, OptGroup } = Select;
const Search = Input.Search;
const RadioGroup = Radio.Group;
function onOk(value) {
  
}
class firstPartner extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            selectFlag: false,
            //下拉框
            divideMoney: [],
            dividePercent: [],
            renewMoney: [],
            list: {
                uid: '',
                businessTrueName: '',
                businessName: '',
                mobile: '',
                email: '',
                businessCity: '',
                dealerAddress: '',
                bankName: '',
                dealerInfo: '',
                bankNumber: '',
                contractStartTime: '',
                contractEndTime: '',
                redCodePower: 'OPEN',
                divideType: 'AMOUNT_DIV',
                dividMoney: '',
                dividePercent: '',
                renewMoney: '',
            },
            value: 'AMOUNT_DIV',
            otherRenewMoney: false,
            oRenewMoney: '',
            dividMoneyFlag: false,
            dividePercentFlag: false,

            odividMoneyFlag: false,
            odividePercentFlag: false,
            jine: '',
            fencheng: '',
            moreDividMoney: '',
            moreDividePercent: '',
            flag: false,
            switchFlag: false
        }
        this.divideTypeChange = this.divideTypeChange.bind(this);
    }

    //即将插入本组件时，开始请求数据，准备渲染
    componentWillMount() {
        var search = window.location.href;
        var uid = search.split('?uid=')[1].split('&_k=')[0];
        this.setState({
            loading: false,
            uid: uid
        })
        this.queryFn(uid);
    }

    //虚拟dom变成真实dom之后，开始绑定事件
    componentDidMount() {
        if (this.state.list.renewMoney == '') {
            this.setState({
                otherRenewMoney: true
            })
        } else {
            this.setState({
                otherRenewMoney: false
            })
        }
        if (this.state.value == 'AMOUNT_DIV' && this.state.selectFlag) {
            this.setState({
                dividMoneyFlag: false,
                dividePercentFlag: true
            })
        } else if (this.state.value == 'PERCENT_DIV' && this.state.selectFlag) {
            this.setState({
                dividMoneyFlag: true,
                dividePercentFlag: false
            })
        }
        if (this.state.list.dividMoney == '' && this.state.selectFlag) {
            this.setState({
                odividMoneyFlag: true
            })
        } else {
            this.setState({
                odividMoneyFlag: false
            })
        }
        if (this.state.list.dividePercent == '') {
            this.setState({
                odividePercentFlag: true
            })
        } else {
            this.setState({
                odividePercentFlag: false
            })
        }
        this.selectFn();
    }
    //下拉接口
    async selectFn() {
        this.setState({
            loading: true
        });
        var data = await fetch(getUrl.url, {
            mode: "cors",
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            // body:"method=ella.business.addBusiness"+"&content="+JSON.stringify({"businessTrueName":businessTrueName,"businessName":businessName,"mobile":mobile,"businessCity":businessCity,"dealerAddress":dealerAddress,"bankName":bankName,"dealerInfo":dealerInfo,"bankNumber":bankNumber,"contractStartTime":contractStartTime,"contractEndTime":contractEndTime,"redCodePower":redCodePower,"divideType":divideType,"dividMoney":dividMoney,"dividePercent":dividePercent,"renewMoney":renewMoney})
            body: "method=ella.business.getBoxCombobox" + commonData.dataString
        }).then(res => res.json())
            .then((d) => {
                if (d.status == 1) {
                    this.setState({
                        loading: false,
                        divideMoney: d.data.divideMoney,
                        dividePercent: d.data.dividePercent,
                        renewMoney: d.data.renewMoney,
                    })
                } else {
                    this.setState({
                        loading: false,
                    })
                }
            })
    }
    //查询
    async queryFn(uid) {
        this.setState({
            loading: true
        });
        var data = await fetch(getUrl.url, {
            mode: "cors",
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: "method=ella.operation.businessDetail" + "&content=" + JSON.stringify({ "uid": uid }) + commonData.dataString
        }).then(res => res.json())
            .then((d) => {
                if (d.status == 1) {
                    var str = d.data.businessCity == null ? '' : d.data.businessCity;
                    var city = str.split('-');
                    this.setState({
                        loading: false,
                        list: {
                            uid: d.data.uid,
                            businessTrueName: d.data.businessTrueName,
                            businessName: d.data.businessName,
                            mobile: d.data.mobile,
                            email: d.data.email,
                            businessCity: city,
                            dealerAddress: d.data.dealerAddress,
                            bankName: d.data.bankName,
                            dealerInfo: d.data.dealerInfo,
                            bankNumber: d.data.bankNumber,
                            contractStartTime: d.data.contractStartTime,
                            contractEndTime: d.data.contractEndTime,
                            redCodePower: d.data.redCodePower,
                            divideType: d.data.divideType,
                            dividMoney: d.data.dividMoney,
                            dividePercent: d.data.dividePercent,
                            renewMoney: d.data.renewMoney
                        },
                        switchFlag: d.data.redCodePower == 'OPEN' ? true : false,
                        value: d.data.divideType,
                        // moreDividePercent:d.data.dividePercent,
                        // moreDividMoney:d.data.dividMoney,
                        dividMoneyFlag: d.data.divideType == 'PERCENT_DIV' ? true : false,
                        dividePercentFlag: d.data.divideType == 'AMOUNT_DIV' ? true : false,
                        odividePercentFlag: false,
                        odividMoneyFlag: false,
                        otherRenewMoney: false,
                        flag: true,
                        selectFlag: true
                    })
                } else {
                    message.error('获取信息失败')
                    this.setState({
                        loading: false,
                    })
                }
            })
    }

    businessTrueNameChange(value) {
        this.setState({
            list: {
                ...this.state.list,
                businessTrueName: value
            }
        })
    }
    businessNameChange(value) {
        this.setState({
            list: {
                ...this.state.list,
                businessName: value
            }
        })
    }
    mobileChange(value) {
        this.setState({
            list: {
                ...this.state.list,
                mobile: value
            }
        })
    }
    emailChange(value) {
        this.setState({
            list: {
                ...this.state.list,
                email: value
            }
        })
    }
    businessCityChange(value) {
        this.setState({
            list: {
                ...this.state.list,
                businessCity: value[0] + '-' + (value[1] == undefined ? value[0] : value[1])
            }
        })
    }
    dealerAddressChange(value) {
        this.setState({
            list: {
                ...this.state.list,
                dealerAddress: value
            }
        })
    }
    bankNameChange(value) {
        this.setState({
            list: {
                ...this.state.list,
                bankName: value
            }
        })
    }
    dealerInfoChange(value) {
        this.setState({
            list: {
                ...this.state.list,
                dealerInfo: value
            }
        })
    }
    bankNumberChange(value) {
        this.setState({
            list: {
                ...this.state.list,
                bankNumber: value
            }
        })
    }
    contractStartTimeChange(value, dateString) {
        this.setState({
            list: {
                ...this.state.list,
                contractStartTime: dateString
            }
        })
    }
    contractEndTimeChange(value, dateString) {
        this.setState({
            list: {
                ...this.state.list,
                contractEndTime: dateString
            }
        })
    }
    redCodePowerChange(value) {
        this.setState({
            list: {
                ...this.state.list,
                redCodePower: value == true ? 'OPEN' : 'CLOSE'
            }
        })
    }
    divideTypeChange(e) {
        var w = this;
        var dividePercent = this.state.fencheng;
        var dividMoney = this.state.jine;
        if (e.target.value == 'AMOUNT_DIV') {
            this.setState({
                dividMoneyFlag: false,
                dividePercentFlag: true,
                list: {
                    ...this.state.list,
                    dividePercent: '',
                    dividMoney: dividMoney,
                    divideType: e.target.value
                },
                value: e.target.value
            })
        } else if (e.target.value == 'PERCENT_DIV') {
            this.setState({
                dividMoneyFlag: true,
                dividePercentFlag: false,
                list: {
                    ...this.state.list,
                    dividMoney: '',
                    dividePercent: dividePercent,
                    divideType: e.target.value
                },
                value: e.target.value
            })
        } else {
            message.error('请选择合伙人分成类型');
        }
    }
    dividMoneyChange(value) {
        if (value === '') {
            this.setState({
                odividMoneyFlag: true
            })
        } else {
            this.setState({
                odividMoneyFlag: false,
                list: {
                    ...this.state.list,
                    dividMoney: value
                },
                jine: value
            })
        }
    }
    dividePercentChange(value) {
        if (value === '') {
            this.setState({
                odividePercentFlag: true,
                list: {
                    ...this.state.list,
                    dividePercent: 1
                },
            })
        } else {
            this.setState({
                odividePercentFlag: false,
                list: {
                    ...this.state.list,
                    dividePercent: value
                },
                fencheng: value
            })
        }
    }
    renewMoneyChange(value) {
        if (value === '') {
            this.setState({
                otherRenewMoney: true
            })
        } else {
            this.setState({
                otherRenewMoney: false,
                list: {
                    ...this.state.list,
                    renewMoney: value
                }
            })
        }
    }
    oRenewMoneyChange(value) {
        this.setState({
            oRenewMoney: value,
            list: {
                ...this.state.list,
                renewMoney: value
            }
        })
    }
    moreDividMoneyChange(value) {
        this.setState({
            moreDividMoney: value,
            list: {
                ...this.state.list,
                dividMoney: value
            }
        })
    }
    moreDividePercentChange(value) {
        this.setState({
            moreDividePercent: value,
            list: {
                ...this.state.list,
                dividePercent: value / 100
            }
        })
    }
    filter(inputValue, path) {
        return (path.some(option => (option.label).toLowerCase().indexOf(inputValue.toLowerCase()) > -1));
    }

    //添加
    async updateFn(str) {
        if(typeof(str.businessCity)=='object'){
            str.businessCity = str.businessCity[0]+'-'+(str.businessCity[1] == undefined ? str.businessCity[0] : str.businessCity[1])
        }
        this.setState({
            loading: true
        });
        var data = await fetch(getUrl.url, {
            mode: "cors",
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            // body:"method=ella.business.addBusiness"+"&content="+JSON.stringify({"businessTrueName":businessTrueName,"businessName":businessName,"mobile":mobile,"businessCity":businessCity,"dealerAddress":dealerAddress,"bankName":bankName,"dealerInfo":dealerInfo,"bankNumber":bankNumber,"contractStartTime":contractStartTime,"contractEndTime":contractEndTime,"redCodePower":redCodePower,"divideType":divideType,"dividMoney":dividMoney,"dividePercent":dividePercent,"renewMoney":renewMoney})
            body: "method=ella.business.updateBusiness" + commonData.dataString + "&content=" + JSON.stringify(str)
        }).then(res => res.json())
            .then((d) => {
                if (d.status == 1) {
                    message.success('保存成功');
                    this.setState({
                        loading: false,
                    })
                } else {
                    message.error(d.message);
                    this.setState({
                        loading: false,
                    })
                }
            })
    }
    save() {
        var w =this;
        if (this.state.list.businessName == '' || this.state.list.businessName == null) {
            message.warning('联系人不能为空')
        } 
        else if (!/^1[3|4|5|6|7|8|9][0-9]{9}$/.test(this.state.list.mobile)) {
            message.warning('手机号格式错误')
        } else if (this.state.list.email == '' || this.state.list.email == null) {
            message.warning('邮箱不能为空')
        } else if (!/^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/.test(this.state.list.email)) {
            message.warning('请输入正确的邮箱')
        } else if (this.state.list.businessCity == '' || this.state.list.businessCity == null) {
            message.warning('请选择地域')
        } else if (this.state.list.dealerAddress == '' || this.state.list.dealerAddress == null) {
            message.warning('联系地址不能为空')
        } else if (this.state.list.bankName == '' || this.state.list.bankName == null) {
            message.warning('银行卡开户行不能为空')
        } else if (this.state.list.dealerInfo == '' || this.state.list.dealerInfo == null) {
            message.warning('开户名不能为空')
        } else if (this.state.list.bankNumber == '' || this.state.list.bankNumber == null) {
            message.warning('开户账号不能为空')
        } 
        // else if (!/^([1-9]{1})(\d{15}|\d{18})$/.test(this.state.list.bankNumber)) {
        //     message.warning('开户账号格式错误')
        // } 
        else if (this.state.list.contractStartTime == '' || this.state.list.contractStartTime == null) {
            message.warning('请选择开始时间')
        } else if (this.state.list.contractEndTime == '' || this.state.list.contractEndTime == null) {
            message.warning('请选择时间')
        } else if (this.state.list.redCodePower == '' || this.state.list.redCodePower == null) {
            message.warning('请选择红码权限')
        } else if (this.state.list.divideType == '' || this.state.list.divideType == null) {
            message.warning('请选择分成类型')
        } else if (this.state.list.divideType == 'AMOUNT_DIV' && (this.state.list.dividMoney == '' || this.state.list.dividMoney == null)) {
            message.warning('分成金额不能为空')
        } else if (this.state.list.divideType == 'AMOUNT_DIV' && this.state.list.dividMoney <= 0) {
            message.warning('分成金额不可为负数')
        } else if (this.state.list.contractStartTime>this.state.list.contractEndTime) {
            message.warning('开始时间不能大于结束时间')
        } else if (this.state.list.renewMoney<0) {
            message.warning('动画图书馆续费金额不能小于0')
        } else {
            this.updateFn(this.state.list);
        }
    }

    render() {
        const options = [
            {
                "value": "北京市",
                "label": "北京市",
                "children": [
                    {
                        "value": "北京市",
                        "label": "北京市"
                    }
                ]
            },
            {
                "value": "天津市",
                "label": "天津市",
                "children": [
                    {
                        "value": "天津市",
                        "label": "天津市"
                    }
                ]
            },
            {
                "value": "河北省",
                "label": "河北省",
                "children": [
                    {
                        "value": "石家庄市",
                        "label": "石家庄市"
                    },
                    {
                        "value": "唐山市",
                        "label": "唐山市"
                    },
                    {
                        "value": "秦皇岛市",
                        "label": "秦皇岛市"
                    },
                    {
                        "value": "邯郸市",
                        "label": "邯郸市"
                    },
                    {
                        "value": "邢台市",
                        "label": "邢台市"
                    },
                    {
                        "value": "保定市",
                        "label": "保定市"
                    },
                    {
                        "value": "张家口市",
                        "label": "张家口市"
                    },
                    {
                        "value": "承德市",
                        "label": "承德市"
                    },
                    {
                        "value": "沧州市",
                        "label": "沧州市"
                    },
                    {
                        "value": "廊坊市",
                        "label": "廊坊市"
                    },
                    {
                        "value": "衡水市",
                        "label": "衡水市"
                    }
                ]
            },
            {
                "value": "山西省",
                "label": "山西省",
                "children": [
                    {
                        "value": "太原市",
                        "label": "太原市"
                    },
                    {
                        "value": "大同市",
                        "label": "大同市"
                    },
                    {
                        "value": "阳泉市",
                        "label": "阳泉市"
                    },
                    {
                        "value": "长治市",
                        "label": "长治市"
                    },
                    {
                        "value": "晋城市",
                        "label": "晋城市"
                    },
                    {
                        "value": "朔州市",
                        "label": "朔州市"
                    },
                    {
                        "value": "晋中市",
                        "label": "晋中市"
                    },
                    {
                        "value": "运城市",
                        "label": "运城市"
                    },
                    {
                        "value": "忻州市",
                        "label": "忻州市"
                    },
                    {
                        "value": "临汾市",
                        "label": "临汾市"
                    },
                    {
                        "value": "吕梁市",
                        "label": "吕梁市"
                    }
                ]
            },
            {
                "value": "内蒙古自治区",
                "label": "内蒙古自治区",
                "children": [
                    {
                        "value": "呼和浩特市",
                        "label": "呼和浩特市"
                    },
                    {
                        "value": "包头市",
                        "label": "包头市"
                    },
                    {
                        "value": "乌海市",
                        "label": "乌海市"
                    },
                    {
                        "value": "赤峰市",
                        "label": "赤峰市"
                    },
                    {
                        "value": "通辽市",
                        "label": "通辽市"
                    },
                    {
                        "value": "鄂尔多斯市",
                        "label": "鄂尔多斯市"
                    },
                    {
                        "value": "呼伦贝尔市",
                        "label": "呼伦贝尔市"
                    },
                    {
                        "value": "巴彦淖尔市",
                        "label": "巴彦淖尔市"
                    },
                    {
                        "value": "乌兰察布市",
                        "label": "乌兰察布市"
                    },
                    {
                        "value": "兴安盟",
                        "label": "兴安盟"
                    },
                    {
                        "value": "锡林郭勒盟",
                        "label": "锡林郭勒盟"
                    },
                    {
                        "value": "阿拉善盟",
                        "label": "阿拉善盟"
                    }
                ]
            },
            {
                "value": "辽宁省",
                "label": "辽宁省",
                "children": [
                    {
                        "value": "沈阳市",
                        "label": "沈阳市"
                    },
                    {
                        "value": "大连市",
                        "label": "大连市"
                    },
                    {
                        "value": "鞍山市",
                        "label": "鞍山市"
                    },
                    {
                        "value": "抚顺市",
                        "label": "抚顺市"
                    },
                    {
                        "value": "本溪市",
                        "label": "本溪市"
                    },
                    {
                        "value": "丹东市",
                        "label": "丹东市"
                    },
                    {
                        "value": "锦州市",
                        "label": "锦州市"
                    },
                    {
                        "value": "营口市",
                        "label": "营口市"
                    },
                    {
                        "value": "阜新市",
                        "label": "阜新市"
                    },
                    {
                        "value": "辽阳市",
                        "label": "辽阳市"
                    },
                    {
                        "value": "盘锦市",
                        "label": "盘锦市"
                    },
                    {
                        "value": "铁岭市",
                        "label": "铁岭市"
                    },
                    {
                        "value": "朝阳市",
                        "label": "朝阳市"
                    },
                    {
                        "value": "葫芦岛市",
                        "label": "葫芦岛市"
                    }
                ]
            },
            {
                "value": "吉林省",
                "label": "吉林省",
                "children": [
                    {
                        "value": "长春市",
                        "label": "长春市"
                    },
                    {
                        "value": "吉林市",
                        "label": "吉林市"
                    },
                    {
                        "value": "四平市",
                        "label": "四平市"
                    },
                    {
                        "value": "辽源市",
                        "label": "辽源市"
                    },
                    {
                        "value": "通化市",
                        "label": "通化市"
                    },
                    {
                        "value": "白山市",
                        "label": "白山市"
                    },
                    {
                        "value": "松原市",
                        "label": "松原市"
                    },
                    {
                        "value": "白城市",
                        "label": "白城市"
                    },
                    {
                        "value": "延边朝鲜族自治州",
                        "label": "延边朝鲜族自治州"
                    }
                ]
            },
            {
                "value": "黑龙江省",
                "label": "黑龙江省",
                "children": [
                    {
                        "value": "哈尔滨市",
                        "label": "哈尔滨市"
                    },
                    {
                        "value": "齐齐哈尔市",
                        "label": "齐齐哈尔市"
                    },
                    {
                        "value": "鸡西市",
                        "label": "鸡西市"
                    },
                    {
                        "value": "鹤岗市",
                        "label": "鹤岗市"
                    },
                    {
                        "value": "双鸭山市",
                        "label": "双鸭山市"
                    },
                    {
                        "value": "大庆市",
                        "label": "大庆市"
                    },
                    {
                        "value": "伊春市",
                        "label": "伊春市"
                    },
                    {
                        "value": "佳木斯市",
                        "label": "佳木斯市"
                    },
                    {
                        "value": "七台河市",
                        "label": "七台河市"
                    },
                    {
                        "value": "牡丹江市",
                        "label": "牡丹江市"
                    },
                    {
                        "value": "黑河市",
                        "label": "黑河市"
                    },
                    {
                        "value": "绥化市",
                        "label": "绥化市"
                    },
                    {
                        "value": "大兴安岭地区",
                        "label": "大兴安岭地区"
                    }
                ]
            },
            {
                "value": "上海市",
                "label": "上海市",
                "children": [
                    {
                        "value": "上海市",
                        "label": "上海市"
                    }
                ]
            },
            {
                "value": "江苏省",
                "label": "江苏省",
                "children": [
                    {
                        "value": "南京市",
                        "label": "南京市"
                    },
                    {
                        "value": "无锡市",
                        "label": "无锡市"
                    },
                    {
                        "value": "徐州市",
                        "label": "徐州市"
                    },
                    {
                        "value": "常州市",
                        "label": "常州市"
                    },
                    {
                        "value": "苏州市",
                        "label": "苏州市"
                    },
                    {
                        "value": "南通市",
                        "label": "南通市"
                    },
                    {
                        "value": "连云港市",
                        "label": "连云港市"
                    },
                    {
                        "value": "淮安市",
                        "label": "淮安市"
                    },
                    {
                        "value": "盐城市",
                        "label": "盐城市"
                    },
                    {
                        "value": "扬州市",
                        "label": "扬州市"
                    },
                    {
                        "value": "镇江市",
                        "label": "镇江市"
                    },
                    {
                        "value": "泰州市",
                        "label": "泰州市"
                    },
                    {
                        "value": "宿迁市",
                        "label": "宿迁市"
                    }
                ]
            },
            {
                "value": "浙江省",
                "label": "浙江省",
                "children": [
                    {
                        "value": "杭州市",
                        "label": "杭州市"
                    },
                    {
                        "value": "宁波市",
                        "label": "宁波市"
                    },
                    {
                        "value": "温州市",
                        "label": "温州市"
                    },
                    {
                        "value": "嘉兴市",
                        "label": "嘉兴市"
                    },
                    {
                        "value": "湖州市",
                        "label": "湖州市"
                    },
                    {
                        "value": "绍兴市",
                        "label": "绍兴市"
                    },
                    {
                        "value": "金华市",
                        "label": "金华市"
                    },
                    {
                        "value": "衢州市",
                        "label": "衢州市"
                    },
                    {
                        "value": "舟山市",
                        "label": "舟山市"
                    },
                    {
                        "value": "台州市",
                        "label": "台州市"
                    },
                    {
                        "value": "丽水市",
                        "label": "丽水市"
                    }
                ]
            },
            {
                "value": "安徽省",
                "label": "安徽省",
                "children": [
                    {
                        "value": "合肥市",
                        "label": "合肥市"
                    },
                    {
                        "value": "芜湖市",
                        "label": "芜湖市"
                    },
                    {
                        "value": "蚌埠市",
                        "label": "蚌埠市"
                    },
                    {
                        "value": "淮南市",
                        "label": "淮南市"
                    },
                    {
                        "value": "马鞍山市",
                        "label": "马鞍山市"
                    },
                    {
                        "value": "淮北市",
                        "label": "淮北市"
                    },
                    {
                        "value": "铜陵市",
                        "label": "铜陵市"
                    },
                    {
                        "value": "安庆市",
                        "label": "安庆市"
                    },
                    {
                        "value": "黄山市",
                        "label": "黄山市"
                    },
                    {
                        "value": "滁州市",
                        "label": "滁州市"
                    },
                    {
                        "value": "阜阳市",
                        "label": "阜阳市"
                    },
                    {
                        "value": "宿州市",
                        "label": "宿州市"
                    },
                    {
                        "value": "六安市",
                        "label": "六安市"
                    },
                    {
                        "value": "亳州市",
                        "label": "亳州市"
                    },
                    {
                        "value": "池州市",
                        "label": "池州市"
                    },
                    {
                        "value": "宣城市",
                        "label": "宣城市"
                    }
                ]
            },
            {
                "value": "福建省",
                "label": "福建省",
                "children": [
                    {
                        "value": "福州市",
                        "label": "福州市"
                    },
                    {
                        "value": "厦门市",
                        "label": "厦门市"
                    },
                    {
                        "value": "莆田市",
                        "label": "莆田市"
                    },
                    {
                        "value": "三明市",
                        "label": "三明市"
                    },
                    {
                        "value": "泉州市",
                        "label": "泉州市"
                    },
                    {
                        "value": "漳州市",
                        "label": "漳州市"
                    },
                    {
                        "value": "南平市",
                        "label": "南平市"
                    },
                    {
                        "value": "龙岩市",
                        "label": "龙岩市"
                    },
                    {
                        "value": "宁德市",
                        "label": "宁德市"
                    }
                ]
            },
            {
                "value": "江西省",
                "label": "江西省",
                "children": [
                    {
                        "value": "南昌市",
                        "label": "南昌市"
                    },
                    {
                        "value": "景德镇市",
                        "label": "景德镇市"
                    },
                    {
                        "value": "萍乡市",
                        "label": "萍乡市"
                    },
                    {
                        "value": "九江市",
                        "label": "九江市"
                    },
                    {
                        "value": "新余市",
                        "label": "新余市"
                    },
                    {
                        "value": "鹰潭市",
                        "label": "鹰潭市"
                    },
                    {
                        "value": "赣州市",
                        "label": "赣州市"
                    },
                    {
                        "value": "吉安市",
                        "label": "吉安市"
                    },
                    {
                        "value": "宜春市",
                        "label": "宜春市"
                    },
                    {
                        "value": "抚州市",
                        "label": "抚州市"
                    },
                    {
                        "value": "上饶市",
                        "label": "上饶市"
                    }
                ]
            },
            {
                "value": "山东省",
                "label": "山东省",
                "children": [
                    {
                        "value": "济南市",
                        "label": "济南市"
                    },
                    {
                        "value": "青岛市",
                        "label": "青岛市"
                    },
                    {
                        "value": "淄博市",
                        "label": "淄博市"
                    },
                    {
                        "value": "枣庄市",
                        "label": "枣庄市"
                    },
                    {
                        "value": "东营市",
                        "label": "东营市"
                    },
                    {
                        "value": "烟台市",
                        "label": "烟台市"
                    },
                    {
                        "value": "潍坊市",
                        "label": "潍坊市"
                    },
                    {
                        "value": "济宁市",
                        "label": "济宁市"
                    },
                    {
                        "value": "泰安市",
                        "label": "泰安市"
                    },
                    {
                        "value": "威海市",
                        "label": "威海市"
                    },
                    {
                        "value": "日照市",
                        "label": "日照市"
                    },
                    {
                        "value": "莱芜市",
                        "label": "莱芜市"
                    },
                    {
                        "value": "临沂市",
                        "label": "临沂市"
                    },
                    {
                        "value": "德州市",
                        "label": "德州市"
                    },
                    {
                        "value": "聊城市",
                        "label": "聊城市"
                    },
                    {
                        "value": "滨州市",
                        "label": "滨州市"
                    },
                    {
                        "value": "菏泽市",
                        "label": "菏泽市"
                    }
                ]
            },
            {
                "value": "河南省",
                "label": "河南省",
                "children": [
                    {
                        "value": "郑州市",
                        "label": "郑州市"
                    },
                    {
                        "value": "开封市",
                        "label": "开封市"
                    },
                    {
                        "value": "洛阳市",
                        "label": "洛阳市"
                    },
                    {
                        "value": "平顶山市",
                        "label": "平顶山市"
                    },
                    {
                        "value": "安阳市",
                        "label": "安阳市"
                    },
                    {
                        "value": "鹤壁市",
                        "label": "鹤壁市"
                    },
                    {
                        "value": "新乡市",
                        "label": "新乡市"
                    },
                    {
                        "value": "焦作市",
                        "label": "焦作市"
                    },
                    {
                        "value": "濮阳市",
                        "label": "濮阳市"
                    },
                    {
                        "value": "许昌市",
                        "label": "许昌市"
                    },
                    {
                        "value": "漯河市",
                        "label": "漯河市"
                    },
                    {
                        "value": "三门峡市",
                        "label": "三门峡市"
                    },
                    {
                        "value": "南阳市",
                        "label": "南阳市"
                    },
                    {
                        "value": "商丘市",
                        "label": "商丘市"
                    },
                    {
                        "value": "信阳市",
                        "label": "信阳市"
                    },
                    {
                        "value": "周口市",
                        "label": "周口市"
                    },
                    {
                        "value": "驻马店市",
                        "label": "驻马店市"
                    }
                ]
            },
            {
                "value": "湖北省",
                "label": "湖北省",
                "children": [
                    {
                        "value": "武汉市",
                        "label": "武汉市"
                    },
                    {
                        "value": "黄石市",
                        "label": "黄石市"
                    },
                    {
                        "value": "十堰市",
                        "label": "十堰市"
                    },
                    {
                        "value": "宜昌市",
                        "label": "宜昌市"
                    },
                    {
                        "value": "襄阳市",
                        "label": "襄阳市"
                    },
                    {
                        "value": "鄂州市",
                        "label": "鄂州市"
                    },
                    {
                        "value": "荆门市",
                        "label": "荆门市"
                    },
                    {
                        "value": "孝感市",
                        "label": "孝感市"
                    },
                    {
                        "value": "荆州市",
                        "label": "荆州市"
                    },
                    {
                        "value": "黄冈市",
                        "label": "黄冈市"
                    },
                    {
                        "value": "咸宁市",
                        "label": "咸宁市"
                    },
                    {
                        "value": "随州市",
                        "label": "随州市"
                    },
                    {
                        "value": "恩施土家族苗族自治州",
                        "label": "恩施土家族苗族自治州"
                    }
                ]
            },
            {
                "value": "湖南省",
                "label": "湖南省",
                "children": [
                    {
                        "value": "长沙市",
                        "label": "长沙市"
                    },
                    {
                        "value": "株洲市",
                        "label": "株洲市"
                    },
                    {
                        "value": "湘潭市",
                        "label": "湘潭市"
                    },
                    {
                        "value": "衡阳市",
                        "label": "衡阳市"
                    },
                    {
                        "value": "邵阳市",
                        "label": "邵阳市"
                    },
                    {
                        "value": "岳阳市",
                        "label": "岳阳市"
                    },
                    {
                        "value": "常德市",
                        "label": "常德市"
                    },
                    {
                        "value": "张家界市",
                        "label": "张家界市"
                    },
                    {
                        "value": "益阳市",
                        "label": "益阳市"
                    },
                    {
                        "value": "郴州市",
                        "label": "郴州市"
                    },
                    {
                        "value": "永州市",
                        "label": "永州市"
                    },
                    {
                        "value": "怀化市",
                        "label": "怀化市"
                    },
                    {
                        "value": "娄底市",
                        "label": "娄底市"
                    },
                    {
                        "value": "湘西土家族苗族自治州",
                        "label": "湘西土家族苗族自治州"
                    }
                ]
            },
            {
                "value": "广东省",
                "label": "广东省",
                "children": [
                    {
                        "value": "广州市",
                        "label": "广州市"
                    },
                    {
                        "value": "韶关市",
                        "label": "韶关市"
                    },
                    {
                        "value": "深圳市",
                        "label": "深圳市"
                    },
                    {
                        "value": "珠海市",
                        "label": "珠海市"
                    },
                    {
                        "value": "汕头市",
                        "label": "汕头市"
                    },
                    {
                        "value": "佛山市",
                        "label": "佛山市"
                    },
                    {
                        "value": "江门市",
                        "label": "江门市"
                    },
                    {
                        "value": "湛江市",
                        "label": "湛江市"
                    },
                    {
                        "value": "茂名市",
                        "label": "茂名市"
                    },
                    {
                        "value": "肇庆市",
                        "label": "肇庆市"
                    },
                    {
                        "value": "惠州市",
                        "label": "惠州市"
                    },
                    {
                        "value": "梅州市",
                        "label": "梅州市"
                    },
                    {
                        "value": "汕尾市",
                        "label": "汕尾市"
                    },
                    {
                        "value": "河源市",
                        "label": "河源市"
                    },
                    {
                        "value": "阳江市",
                        "label": "阳江市"
                    },
                    {
                        "value": "清远市",
                        "label": "清远市"
                    },
                    {
                        "value": "东莞市",
                        "label": "东莞市"
                    },
                    {
                        "value": "中山市",
                        "label": "中山市"
                    },
                    {
                        "value": "潮州市",
                        "label": "潮州市"
                    },
                    {
                        "value": "揭阳市",
                        "label": "揭阳市"
                    },
                    {
                        "value": "云浮市",
                        "label": "云浮市"
                    }
                ]
            },
            {
                "value": "广西壮族自治区",
                "label": "广西壮族自治区",
                "children": [
                    {
                        "value": "南宁市",
                        "label": "南宁市"
                    },
                    {
                        "value": "柳州市",
                        "label": "柳州市"
                    },
                    {
                        "value": "桂林市",
                        "label": "桂林市"
                    },
                    {
                        "value": "梧州市",
                        "label": "梧州市"
                    },
                    {
                        "value": "北海市",
                        "label": "北海市"
                    },
                    {
                        "value": "防城港市",
                        "label": "防城港市"
                    },
                    {
                        "value": "钦州市",
                        "label": "钦州市"
                    },
                    {
                        "value": "贵港市",
                        "label": "贵港市"
                    },
                    {
                        "value": "玉林市",
                        "label": "玉林市"
                    },
                    {
                        "value": "百色市",
                        "label": "百色市"
                    },
                    {
                        "value": "贺州市",
                        "label": "贺州市"
                    },
                    {
                        "value": "河池市",
                        "label": "河池市"
                    },
                    {
                        "value": "来宾市",
                        "label": "来宾市"
                    },
                    {
                        "value": "崇左市",
                        "label": "崇左市"
                    }
                ]
            },
            {
                "value": "海南省",
                "label": "海南省",
                "children": [
                    {
                        "value": "海口市",
                        "label": "海口市"
                    },
                    {
                        "value": "三亚市",
                        "label": "三亚市"
                    },
                    {
                        "value": "三沙市",
                        "label": "三沙市"
                    },
                    {
                        "value": "儋州市",
                        "label": "儋州市"
                    }
                ]
            },
            {
                "value": "重庆市",
                "label": "重庆市",
                "children": [
                    {
                        "value": "重庆市",
                        "label": "重庆市"
                    }
                ]
            },
            {
                "value": "四川省",
                "label": "四川省",
                "children": [
                    {
                        "value": "成都市",
                        "label": "成都市"
                    },
                    {
                        "value": "自贡市",
                        "label": "自贡市"
                    },
                    {
                        "value": "攀枝花市",
                        "label": "攀枝花市"
                    },
                    {
                        "value": "泸州市",
                        "label": "泸州市"
                    },
                    {
                        "value": "德阳市",
                        "label": "德阳市"
                    },
                    {
                        "value": "绵阳市",
                        "label": "绵阳市"
                    },
                    {
                        "value": "广元市",
                        "label": "广元市"
                    },
                    {
                        "value": "遂宁市",
                        "label": "遂宁市"
                    },
                    {
                        "value": "内江市",
                        "label": "内江市"
                    },
                    {
                        "value": "乐山市",
                        "label": "乐山市"
                    },
                    {
                        "value": "南充市",
                        "label": "南充市"
                    },
                    {
                        "value": "眉山市",
                        "label": "眉山市"
                    },
                    {
                        "value": "宜宾市",
                        "label": "宜宾市"
                    },
                    {
                        "value": "广安市",
                        "label": "广安市"
                    },
                    {
                        "value": "达州市",
                        "label": "达州市"
                    },
                    {
                        "value": "雅安市",
                        "label": "雅安市"
                    },
                    {
                        "value": "巴中市",
                        "label": "巴中市"
                    },
                    {
                        "value": "资阳市",
                        "label": "资阳市"
                    },
                    {
                        "value": "阿坝藏族羌族自治州",
                        "label": "阿坝藏族羌族自治州"
                    },
                    {
                        "value": "甘孜藏族自治州",
                        "label": "甘孜藏族自治州"
                    },
                    {
                        "value": "凉山彝族自治州",
                        "label": "凉山彝族自治州"
                    }
                ]
            },
            {
                "value": "贵州省",
                "label": "贵州省",
                "children": [
                    {
                        "value": "贵阳市",
                        "label": "贵阳市"
                    },
                    {
                        "value": "六盘水市",
                        "label": "六盘水市"
                    },
                    {
                        "value": "遵义市",
                        "label": "遵义市"
                    },
                    {
                        "value": "安顺市",
                        "label": "安顺市"
                    },
                    {
                        "value": "毕节市",
                        "label": "毕节市"
                    },
                    {
                        "value": "铜仁市",
                        "label": "铜仁市"
                    },
                    {
                        "value": "黔西南布依族苗族自治州",
                        "label": "黔西南布依族苗族自治州"
                    },
                    {
                        "value": "黔东南苗族侗族自治州",
                        "label": "黔东南苗族侗族自治州"
                    },
                    {
                        "value": "黔南布依族苗族自治州",
                        "label": "黔南布依族苗族自治州"
                    }
                ]
            },
            {
                "value": "云南省",
                "label": "云南省",
                "children": [
                    {
                        "value": "昆明市",
                        "label": "昆明市"
                    },
                    {
                        "value": "曲靖市",
                        "label": "曲靖市"
                    },
                    {
                        "value": "玉溪市",
                        "label": "玉溪市"
                    },
                    {
                        "value": "保山市",
                        "label": "保山市"
                    },
                    {
                        "value": "昭通市",
                        "label": "昭通市"
                    },
                    {
                        "value": "丽江市",
                        "label": "丽江市"
                    },
                    {
                        "value": "普洱市",
                        "label": "普洱市"
                    },
                    {
                        "value": "临沧市",
                        "label": "临沧市"
                    },
                    {
                        "value": "楚雄彝族自治州",
                        "label": "楚雄彝族自治州"
                    },
                    {
                        "value": "红河哈尼族彝族自治州",
                        "label": "红河哈尼族彝族自治州"
                    },
                    {
                        "value": "文山壮族苗族自治州",
                        "label": "文山壮族苗族自治州"
                    },
                    {
                        "value": "西双版纳傣族自治州",
                        "label": "西双版纳傣族自治州"
                    },
                    {
                        "value": "大理白族自治州",
                        "label": "大理白族自治州"
                    },
                    {
                        "value": "德宏傣族景颇族自治州",
                        "label": "德宏傣族景颇族自治州"
                    },
                    {
                        "value": "怒江傈僳族自治州",
                        "label": "怒江傈僳族自治州"
                    },
                    {
                        "value": "迪庆藏族自治州",
                        "label": "迪庆藏族自治州"
                    }
                ]
            },
            {
                "value": "西藏自治区",
                "label": "西藏自治区",
                "children": [
                    {
                        "value": "拉萨市",
                        "label": "拉萨市"
                    },
                    {
                        "value": "日喀则市",
                        "label": "日喀则市"
                    },
                    {
                        "value": "昌都市",
                        "label": "昌都市"
                    },
                    {
                        "value": "林芝市",
                        "label": "林芝市"
                    },
                    {
                        "value": "山南市",
                        "label": "山南市"
                    },
                    {
                        "value": "那曲地区",
                        "label": "那曲地区"
                    },
                    {
                        "value": "阿里地区",
                        "label": "阿里地区"
                    }
                ]
            },
            {
                "value": "陕西省",
                "label": "陕西省",
                "children": [
                    {
                        "value": "西安市",
                        "label": "西安市"
                    },
                    {
                        "value": "铜川市",
                        "label": "铜川市"
                    },
                    {
                        "value": "宝鸡市",
                        "label": "宝鸡市"
                    },
                    {
                        "value": "咸阳市",
                        "label": "咸阳市"
                    },
                    {
                        "value": "渭南市",
                        "label": "渭南市"
                    },
                    {
                        "value": "延安市",
                        "label": "延安市"
                    },
                    {
                        "value": "汉中市",
                        "label": "汉中市"
                    },
                    {
                        "value": "榆林市",
                        "label": "榆林市"
                    },
                    {
                        "value": "安康市",
                        "label": "安康市"
                    },
                    {
                        "value": "商洛市",
                        "label": "商洛市"
                    }
                ]
            },
            {
                "value": "甘肃省",
                "label": "甘肃省",
                "children": [
                    {
                        "value": "兰州市",
                        "label": "兰州市"
                    },
                    {
                        "value": "嘉峪关市",
                        "label": "嘉峪关市"
                    },
                    {
                        "value": "金昌市",
                        "label": "金昌市"
                    },
                    {
                        "value": "白银市",
                        "label": "白银市"
                    },
                    {
                        "value": "天水市",
                        "label": "天水市"
                    },
                    {
                        "value": "武威市",
                        "label": "武威市"
                    },
                    {
                        "value": "张掖市",
                        "label": "张掖市"
                    },
                    {
                        "value": "平凉市",
                        "label": "平凉市"
                    },
                    {
                        "value": "酒泉市",
                        "label": "酒泉市"
                    },
                    {
                        "value": "庆阳市",
                        "label": "庆阳市"
                    },
                    {
                        "value": "定西市",
                        "label": "定西市"
                    },
                    {
                        "value": "陇南市",
                        "label": "陇南市"
                    },
                    {
                        "value": "临夏回族自治州",
                        "label": "临夏回族自治州"
                    },
                    {
                        "value": "甘南藏族自治州",
                        "label": "甘南藏族自治州"
                    }
                ]
            },
            {
                "value": "青海省",
                "label": "青海省",
                "children": [
                    {
                        "value": "西宁市",
                        "label": "西宁市"
                    },
                    {
                        "value": "海东市",
                        "label": "海东市"
                    },
                    {
                        "value": "海北藏族自治州",
                        "label": "海北藏族自治州"
                    },
                    {
                        "value": "黄南藏族自治州",
                        "label": "黄南藏族自治州"
                    },
                    {
                        "value": "海南藏族自治州",
                        "label": "海南藏族自治州"
                    },
                    {
                        "value": "果洛藏族自治州",
                        "label": "果洛藏族自治州"
                    },
                    {
                        "value": "玉树藏族自治州",
                        "label": "玉树藏族自治州"
                    },
                    {
                        "value": "海西蒙古族藏族自治州",
                        "label": "海西蒙古族藏族自治州"
                    }
                ]
            },
            {
                "value": "宁夏回族自治区",
                "label": "宁夏回族自治区",
                "children": [
                    {
                        "value": "银川市",
                        "label": "银川市"
                    },
                    {
                        "value": "石嘴山市",
                        "label": "石嘴山市"
                    },
                    {
                        "value": "吴忠市",
                        "label": "吴忠市"
                    },
                    {
                        "value": "固原市",
                        "label": "固原市"
                    },
                    {
                        "value": "中卫市",
                        "label": "中卫市"
                    }
                ]
            },
            {
                "value": "新疆维吾尔自治区",
                "label": "新疆维吾尔自治区",
                "children": [
                    {
                        "value": "乌鲁木齐市",
                        "label": "乌鲁木齐市"
                    },
                    {
                        "value": "克拉玛依市",
                        "label": "克拉玛依市"
                    },
                    {
                        "value": "吐鲁番市",
                        "label": "吐鲁番市"
                    },
                    {
                        "value": "哈密市",
                        "label": "哈密市"
                    },
                    {
                        "value": "昌吉回族自治州",
                        "label": "昌吉回族自治州"
                    },
                    {
                        "value": "博尔塔拉蒙古自治州",
                        "label": "博尔塔拉蒙古自治州"
                    },
                    {
                        "value": "巴音郭楞蒙古自治州",
                        "label": "巴音郭楞蒙古自治州"
                    },
                    {
                        "value": "阿克苏地区",
                        "label": "阿克苏地区"
                    },
                    {
                        "value": "克孜勒苏柯尔克孜自治州",
                        "label": "克孜勒苏柯尔克孜自治州"
                    },
                    {
                        "value": "喀什地区",
                        "label": "喀什地区"
                    },
                    {
                        "value": "和田地区",
                        "label": "和田地区"
                    },
                    {
                        "value": "伊犁哈萨克自治州",
                        "label": "伊犁哈萨克自治州"
                    },
                    {
                        "value": "塔城地区",
                        "label": "塔城地区"
                    },
                    {
                        "value": "阿勒泰地区",
                        "label": "阿勒泰地区"
                    }
                ]
            },
            {
                "value": "台湾省",
                "label": "台湾省",
                "children": []
            },
            {
                "value": "香港特别行政区",
                "label": "香港特别行政区",
                "children": []
            }
        ];
        return (
            <div className="g-bookList">
                <p className="m-head">
                    <Link to="/firstPartner">
                        <Icon type="left" /> 编辑合伙人
                    </Link>
                </p>
                <div className="m-firstDetail-bd">
                    <Spin tip="加载中..." spinning={this.state.loading} size="large" style={{ zIndex: 9999 }}>
                        <Row className="m-input">
                            <Col span={2} style={{ width: 170, textAlign: 'right' }}><span className="u-txt">名称</span></Col>
                            <Col span={5}>
                                {
                                    <Input disabled value={this.state.list.businessTrueName} style={{ width: 260 }} onChange={(e) => this.businessTrueNameChange(e.target.value)} />
                                }
                            </Col>
                        </Row>
                        <Row className="m-input">
                            <Col span={2} style={{ width: 170, textAlign: 'right' }}><span className="u-txt">联系人</span></Col>
                            <Col span={5}>
                                {
                                    <Input value={this.state.list.businessName} style={{ width: 170 }} onChange={(e) => this.businessNameChange(e.target.value)} />
                                }
                            </Col>
                            <Col span={2} style={{ width: 170, textAlign: 'right' }}><span className="u-txt">手机号</span></Col>
                            <Col span={5}>
                                {
                                    <Input disabled maxLength={11} value={this.state.list.mobile} style={{ width: 170 }} onChange={(e) => this.mobileChange(e.target.value)} />
                                }
                            </Col>
                        </Row>
                        <Row className="m-input">
                            <Col span={2} style={{ width: 170, textAlign: 'right' }}><span className="u-txt">邮箱</span></Col>
                            <Col span={5}>
                                {
                                    <Input value={this.state.list.email} style={{ width: 260 }} onChange={(e) => this.emailChange(e.target.value)} />
                                }
                            </Col>
                        </Row>
                        <Row className="m-input">
                            <Col span={2} style={{ width: 170, textAlign: 'right' }}><span className="u-txt">地域</span></Col>
                            <Col span={5}>
                                {this.state.flag && <Cascader
                                    options={options}
                                    // defaultValue={this.state.list.businessCity}
                                    defaultValue={[this.state.list.businessCity[0], this.state.list.businessCity[1]]}
                                    onChange={(value, selectedOptions) => this.businessCityChange(value, selectedOptions)}
                                    placeholder="请选择地区"
                                    showSearch={() => this.filter()}
                                />}
                            </Col>
                        </Row>
                        <Row className="m-input">
                            <Col span={2} style={{ width: 170, textAlign: 'right' }}><span className="u-txt">联系地址</span></Col>
                            <Col span={7}>
                                {
                                    <Input value={this.state.list.dealerAddress} style={{ width: 360 }} onChange={(e) => this.dealerAddressChange(e.target.value)} />
                                }
                            </Col>
                        </Row>
                        <Row className="m-input">
                            <Col span={2} style={{ width: 170, textAlign: 'right' }}><span className="u-txt">银行卡开户行</span></Col>
                            <Col span={5}>
                                {
                                    <Input value={this.state.list.bankName} style={{ width: 260 }} onChange={(e) => this.bankNameChange(e.target.value)} />
                                }
                            </Col>
                        </Row>
                        <Row className="m-input">
                            <Col span={2} style={{ width: 170, textAlign: 'right' }}><span className="u-txt">开户名</span></Col>
                            <Col span={5}>
                                {
                                    <Input value={this.state.list.dealerInfo} style={{ width: 170 }} onChange={(e) => this.dealerInfoChange(e.target.value)} />
                                }
                            </Col>
                            <Col span={2} style={{ width: 170, textAlign: 'right' }}><span className="u-txt">开户账号</span></Col>
                            <Col span={5}>
                                {
                                    <Input value={this.state.list.bankNumber} style={{ width: 260 }} onChange={(e) => this.bankNumberChange(e.target.value)} />
                                }
                            </Col>
                        </Row>
                        <Row className="m-input">
                            <Col span={2} style={{ width: 170, textAlign: 'right' }}><span className="u-txt">合同期限</span></Col>
                            <Col span={3} style={{ width: 260 }}>
                                <DatePicker
                                    style={{ width: "100%" }}
                                    format="YYYY-MM-DD hh:mm:ss"
                                    placeholder={['开始时间']}
                                    // value={moment(this.state.list.contractStartTime, 'YYYY-MM-DD hh:mm:ss')}
                                    value={(this.state.list.contractStartTime=='' || this.state.list.contractStartTime==null)?'':moment(this.state.list.contractStartTime,'YYYY-MM-DD HH:mm:ss')}
                                    onChange={(value, dateString) => { this.contractStartTimeChange(value, dateString, "contractStartTime") }}
                                    onOk={onOk}
                                />
                            </Col>
                            <Col className="t_center" style={{ textAline: "center" }} span={1}>
                                <span style={{ width: "100%" }} className="line">—</span>
                            </Col>
                            <Col span={3} style={{ width: 260 }}>
                                <DatePicker
                                    style={{ width: "100%" }}
                                    format="YYYY-MM-DD hh:mm:ss"
                                    placeholder={['结束时间']}
                                    // value={moment(this.state.list.contractEndTime, 'YYYY-MM-DD hh:mm:ss')}
                                    value={(this.state.list.contractEndTime=='' || this.state.list.contractEndTime==null)?'':moment(this.state.list.contractEndTime,'YYYY-MM-DD HH:mm:ss')}
                                    onChange={(value, dateString) => { this.contractEndTimeChange(value, dateString, "contractEndTime") }}
                                    onOk={onOk}
                                />
                            </Col>
                        </Row>
                        <Row className="m-input">
                            <Col span={2} style={{ width: 170, textAlign: 'right' }}><span className="u-txt">红码权限</span></Col>
                            <Col span={5}>
                                {this.state.flag && <Switch defaultChecked={this.state.switchFlag} onChange={(e) => this.redCodePowerChange(e)} />}
                            </Col>
                        </Row>
                        <Row className="m-input">
                            <Col span={2} style={{ width: 170, textAlign: 'right' }}><span className="u-txt">动画图书馆续费金额</span></Col>
                            {this.state.selectFlag && <Col span={3}>
                                <Select defaultValue={this.state.list.renewMoney} style={{ width: 170 }} onChange={(value) => this.renewMoneyChange(value)}>
                                    <Option value="880">880</Option>
                                    <Option value="1280">1280</Option>
                                    <Option value="1980">1980</Option>
                                    <Option value="">其他金额</Option>
                                    {/* {
                                        this.state.renewMoney.map(item => {
                                            return <Option value={item}>{item}</Option>
                                        })
                                    } */}
                                </Select>
                            </Col>}
                            {this.state.otherRenewMoney == true ? <Col span={3}>{<InputNumber value={this.state.oRenewMoney} onChange={(value) => this.oRenewMoneyChange(value)} style={{ width: 170 }} />}</Col> : null}
                        </Row>
                        <Row className="m-input">
                            <Col span={2} style={{ width: 170, textAlign: 'right' }}><span className="u-txt">合伙人分成</span></Col>
                            <Col span={5}>
                                {this.state.selectFlag && <RadioGroup onChange={(e) => this.divideTypeChange(e)} value={this.state.value}>
                                    <Radio value="AMOUNT_DIV"></Radio>
                                    分成金额
                                    <Select disabled={this.state.dividMoneyFlag} defaultValue={this.state.list.dividMoney} onChange={(value) => this.dividMoneyChange(value)} style={{ width: 100, marginLeft: 20 }}>
                                        {/* {
                                            this.state.divideMoney.map(item => {
                                                return <Option value={item}>{item}</Option>
                                            })
                                        } */}
                                        <Option value="440">440</Option>
                                        <Option value="840">840</Option>
                                        <Option value="1540">1540</Option>
                                        <Option value="">其他金额</Option>
                                    </Select>
                                    {this.state.odividMoneyFlag == true ? <InputNumber disabled={this.state.dividMoneyFlag} defaultValue={this.state.moreDividMoney} onChange={(value) => this.moreDividMoneyChange(value)} style={{ width: 170, marginLeft: 100 }} /> : null}
                                    <br />
                                    <Radio value="PERCENT_DIV"></Radio>
                                    分成比例
                                    <Select disabled={this.state.dividePercentFlag} defaultValue={this.state.list.dividePercent*100+'%'} onChange={(value) => this.dividePercentChange(value)} style={{ width: 100, marginLeft: 20 }}>
                                        {/* {
                                            this.state.dividePercent.map(item => {
                                                return <Option value={item}>{item}</Option>
                                            })
                                        } */}
                                        <Option value="0">0%</Option>
                                        <Option value="0.1">10%</Option>
                                        <Option value="0.2">20%</Option>
                                        <Option value="0.3">30%</Option>
                                        <Option value="0.4">40%</Option>
                                        <Option value="0.5">50%</Option>
                                        <Option value="0.6">60%</Option>
                                        <Option value="0.7">70%</Option>
                                        <Option value="0.8">80%</Option>
                                        <Option value="0.9">90%</Option>
                                        <Option value="1">100%</Option>
                                        <Option value="">其他比例</Option>
                                    </Select>
                                </RadioGroup>}
                                {this.state.odividePercentFlag == true ? <InputNumber min={0}
                                    max={100}
                                    disabled={this.state.dividePercentFlag}
                                    formatter={value => `${value}%`}
                                    parser={value => value.replace('%', '')}
                                    defaultValue={100}
                                    onChange={(value) => this.moreDividePercentChange(value)}
                                    style={{ width: 170, marginLeft: 100 }} /> : null}
                            </Col>
                        </Row>
                        <Row className="m-input">
                            <Col span={2} style={{ width: 170, textAlign: 'right' }}><span className="u-txt"></span></Col>
                            <Col span={5}>
                                <Button type="primary" onClick={() => this.save()}>保存</Button>
                            </Col>
                        </Row>
                    </Spin>
                </div>
            </div>
        );
    }
}
// firstPartner = Form.create()(firstPartner)

export default firstPartner;