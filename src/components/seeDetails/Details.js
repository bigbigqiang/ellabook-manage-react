import React from 'react';
import GoodsSet from './GoodsSet.js';
import ContentSet from "./ContentSet.js";
import PriceSet from "./PriceSet.js";
import GoodsState from "./GoodsState.js";
import FreeTime from "./freeTime.js";
import { notification, message, Icon, Modal, InputNumber } from "antd";
import { Link } from 'react-router';
import "./Goods.css";
import getUrl from "../util.js";
import { dataString } from '../commonData.js'
const confirm = Modal.confirm;
export default class addGoods extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            goodsSetData: {
                thirdCode: "",			//商品id
                goodsName: "",			//商品名字
                iosPriceId: null,			//商品ios价格
                goodsType: ""			//商品类型
            },
            contentData: {
                thirdName: "",       	//物品名字
                thirdCode: "",			//物品id
                goodsMarketprice: "",	//市场价
                goodsSrcPrice: "",		//原价
                goodsPrice: "",			//优惠价
                goodsIntegral: 0		//积分
            },
            priceSetData: {
                data: []
            },
            uid: localStorage.getItem("uid"),
            token: localStorage.getItem("token"),
            goodsStateData: {
                goodsState: ""			//商品状态
            },
            goodsinfo: {},
            freeTimeData: []
        }
    }
    //GoodsSet
    getGoodsSetData(str, value) {
        this.setState({
            goodsSetData: {
                ...this.state.goodsSetData,
                [str]: value
            }
        })
    }
    //ContentSet
    getContentData(str, value) {
        this.setState({
            contentData: {
                ...this.state.contentData,
                [str]: value
            }
        })
    }
    getThird(str1, str2, name, code) {
        this.setState({
            contentData: {
                ...this.state.contentData,
                [str1]: name,
                [str2]: code
            }
        })
    }
    //GoodsState
    getGoodsStateData(str, value) {
        this.setState({
            goodsStateData: {
                ...this.state.goodsStateData,
                [str]: value
            }
        })
    }
    //PriceSet获取渠道价格
    changePriceSetData(key, str, value) {
        this.setState({
            priceSetData: {
                data: this.state.priceSetData.data.map((item, index) => {
                    if (item.key != key) return item;
                    return {
                        ...item,
                        [str]: value
                    }
                })

            }
        })
        // console.log(10);
    }
    getPriceSetData(v) {
        if (v == null) {
            this.setState({
                priceSetData: {
                    data: []
                }
            })
        } else {
            this.setState({
                priceSetData: {
                    data: v.map((item, index) => ({
                            key: index + 1,
                            channel: item.channelCode,
                            Saledate: [item.saleStartTime, item.saleFinishTime],
                            // Saledate : ["2017-10-16 16:12:01","2017-10-19 16:12:01"],
                            Saleprice: item.price,
                            status: item.status
                        })
                    )
                }
            })
        }
    }
    addPriceSetData() {
        this.setState({
            priceSetData: {
                data: [
                    ...this.state.priceSetData.data,
                    {
                        key: this.state.priceSetData.data.length ? this.state.priceSetData.data.reduce((a, b) => b).key + 1 : 1,
                        channel: '',
                        Saledate: [],
                        Saleprice: "",
                        status: ""
                    }
                ]
            }
        })
    }
    delPriceSetData(key) {
        this.setState({
            priceSetData: {
                data: this.state.priceSetData.data.filter(item => item.key != key)
            }
        })
    }
    ///////////////////////////////////////////
    componentDidMount() {
        this.fetchGoodsinfo(this.props.params.goodsCode);
    }
    async fetchGoodsinfo(str) {
        var data = await fetch(getUrl.url, {
            mode: "cors",
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: "method=ella.operation.getGoodsInfoByCode" + "&content=" + JSON.stringify({ "goodsCode": str }) + dataString
        }).then(res => res.json())
        //如果有默认值那就在这里设置
        if (data.status == 1) {
            this.setState({
                contentData: {
                    ...this.state.contentData,
                    goodsMarketprice: data.data.goodsMarketprice,
                    goodsSrcPrice: data.data.goodsSrcPrice,
                    goodsPrice: data.data.goodsPrice,
                    goodsIntegral: data.data.goodsIntegral || 0,
                    thirdName:data.data.thirdName,
                    thirdCode:data.data.thirdCode
                },
                goodsSetData: {
                    ...this.state.goodsSetData,
                    iosPriceId: data.data.iosPriceId,
                    goodsName: data.data.goodsName
                },
                goodsStateData: {
                    ...this.state.goodsStateData,
                    goodsState: data.data.goodsState
                },
                priceSetData: {
                    data: !data.data.goodsChannelPriceRelation ? [] : data.data.goodsChannelPriceRelation.map((item, index) => ({
                            key: index + 1,
                            channel: item.channelCode,
                            Saledate: [item.saleStartTime, item.saleFinishTime],
                            Saleprice: item.price,
                            status: item.status
                        })
                    )
                },
                goodsinfo: data.data
            })
        } else {
            console.log(data.message)
        }
    }
    getFreeTimeData(k, v) {
        this.setState({
            [k]: v
        })
    }
    ///////////////////////////////////////////
    //提交数据
    async submitData() {
        var data = {};
        data.thirdCode = this.state.goodsinfo.thirdCode;
        data.goodsCode = this.props.params.goodsCode;
        data.goodsSrcPrice = parseFloat(this.state.contentData.goodsSrcPrice);
        data.goodsMarketprice = parseFloat(this.state.contentData.goodsMarketprice);
        data.goodsIntegral = typeof this.state.contentData.goodsIntegral === 'number' ? this.state.contentData.goodsIntegral : 0;
        data.goodsSubstance = "测试商品内容";
        data.goodsName = this.state.goodsSetData.goodsName;
        data.goodsType = this.props.params.goodsType;
        if (this.state.contentData.goodsPrice==="") {
            data.goodsPrice = data.goodsSrcPrice;
           
        } else {
            data.goodsPrice = parseFloat(this.state.contentData.goodsPrice);  
        }
        console.log(data)
        // TODO: 把图书类型改成英文
        if (data.goodsType == "图书") {
            data.goodsType = "BOOK";
        } else if (data.goodsType == "会员") {
            data.goodsType = "ELLA_VIP";
        } else if (data.goodsType == "咿啦币") {
            data.goodsType = "ELLA_COIN";
        } else if (data.goodsType == "图书馆") {
            data.goodsType = "LIB"
        }

        data.iosPriceId = this.state.goodsSetData.iosPriceId;
        data.status = "NORMAL";
        data.goodsState = this.state.goodsStateData.goodsState;
        // TODO: 是否过滤
        data.isOffRelationGoods = "NO";
        var channelArr = [];
        this.state.priceSetData.data.forEach(item => {
            if (item.Saledate.length == 0) return;
            channelArr.push({
                "channelCode": item.channel,
                "goodsCode": this.props.params.goodsCode,
                "price": parseFloat(item.Saleprice),
                "status": item.status,
                "saleStartTime": item.Saledate[0].split("-").join("/"),
                "saleFinishTime": item.Saledate[1].split("-").join("/")
            })
        })
        data.goodsChannelPriceRelation = channelArr;
        // TODO:修改freeTimeData
        var goodsLimitExemptionRelationList = [];
        if (this.state.freeTimeData.length) {
            goodsLimitExemptionRelationList = this.state.freeTimeData.map(item => {
                return {
                    channelCode: item.channel == 'custom' ? item.customChannel.join(',') : item.channel,
                    startTime: item.startTime,
                    endTime: item.endTime,
                    limitType: item.limitType,
                    limitUser: item.limitUser,
                    exemptCode: item.exemptCode || null
                }
            })
        }
        data.goodsLimitExemptionRelationList = goodsLimitExemptionRelationList;
        if (!data.goodsName.trim()) {
            notification.error({
                message: '商品名称未填写'
            })
            return;
        }
        if (!data.thirdCode) {
            notification.error({
                message: '物品未添加'
            })
            return;
        }
        if (!data.goodsSrcPrice || !data.goodsMarketprice) {
            notification.error({
                message: '市场价或者售价未填写'
            })
            return;
        }
        if (!data.goodsState) {
            notification.error({
                message: '商品状态未选择'
            })
            return;
        }
        if (data.goodsPrice > data.goodsSrcPrice || data.goodsPrice > data.goodsMarketprice) {
            notification.error({
                message: '优惠价不能大于市场价或售价'
            })
            return;
        }
        console.log(data)
        var res = await fetch(getUrl.url, {
            mode: "cors",
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: "method=ella.operation.updateGoods" + "&content=" + JSON.stringify(data) + dataString
        }).then(res => res.json())
        if (res.status == 1) {
            //增加成功跳转到上页面...........
            notification.success({
                message: '添加成功'
            })
        } else {
            if (res.code == '2000010009') {
                var _this = this;
                var bookpageStr = "";
                res.data.forEach((item, index) => {
                    index == res.data.length - 1 ? bookpageStr += item.goodsName : bookpageStr += item.goodsName + '、';
                })
                confirm({
                    title: '该图书已添加至' + bookpageStr + '图书包中，下架会导致图书包异常，是否确认下架',
                    okText: '确定',
                    okType: 'primary',
                    cancelText: '取消',
                    onOk() {
                        data.isOffRelationGoods = "YES";
                        _this.submitData2(data);
                    },
                    onCancel() {
                        console.log('Cancel');
                    },
                });
                return
            } else {
                notification.error({
                    message: res.message,
                    description: '请检查你的输入情况!',
                })
            }
        }
    }
    // TODO:二次提交数据
    async submitData2(data) {
        var res = await fetch(getUrl.url, {
            mode: "cors",
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: "method=ella.operation.updateGoods" + "&content=" + JSON.stringify(data) + dataString
        }).then(res => res.json())
        if (res.status == 1) {
            notification.success({
                message: '修改成功'
            })
        } else {
            notification.error({
                message: '修改失败'
            })
        }
    }
    render() {
        return <div>
            <h2 className="titleNumber"><Link to="/goodsList"><Icon type="left" />{" "}编辑页面</Link></h2>
            <div className="box">
                <GoodsSet goodsinfo={this.state.goodsinfo} prveData={this.props.params} getGoodsSetData={this.getGoodsSetData.bind(this)} ></GoodsSet>
                <ContentSet goodsinfo={this.state.goodsinfo} prveData={this.props.params} getContentData={this.getContentData.bind(this)} getThird={this.getThird.bind(this)} contentData={this.state.goodsinfo.goodsName?this.state.contentData:null} goodsType={this.props.params.goodsType === '图书' ? 'book' : ''}></ContentSet>
                <PriceSet goodsinfo={this.state.goodsinfo} prveData={this.props.params} changePriceSetData={this.changePriceSetData.bind(this)} addPriceSetData={this.addPriceSetData.bind(this)} delPriceSetData={this.delPriceSetData.bind(this)} ></PriceSet>
                <FreeTime getFreeTimeData={this.getFreeTimeData.bind(this)} prveData={this.props.params}></FreeTime>
                <GoodsState goodsinfo={this.state.goodsinfo} getGoodsStateData={this.getGoodsStateData.bind(this)} submitData={this.submitData.bind(this)} ></GoodsState>
            </div>
        </div>
    }
}