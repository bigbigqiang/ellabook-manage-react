import React from 'react';
import { Row, Col, Icon, Button, Table, notification, message, Input, Select, Divider, Popover, Upload, Modal } from "antd";
import { Link } from 'react-router';
import util from "../util.js";
import PriceSet from "./PriceSet.js";
import { CommonAddBook } from "../commonAddBook.js"
import { dataString } from '../commonData.js'
import './goodGroup.css'
export default class addGoods extends React.Component {
    constructor() {
        super();
        this.state = {
            visible: false,
            goodsName: "",                              //商品名字
            packageIntroduction: '',
            goodsState: "SHELVES_WAIT",            //商品状态
            goodsMarketprice: null,                        //市场价
            goodsSrcPrice: null,                           //售价
            goodsPrice: null,  //优惠价
            goodsDiscount: null,
            goodsCode: "",
            thirdCode: "",  //图书包的编码pk开头
            uid: localStorage.getItem("uid"),
            token: localStorage.getItem("token"),
            priceSetData: {
                data: [
                    // {
                    // 	key: 1,
                    //   	channel: '',		//String 渠道码
                    //   	Saledate: [],		//Object数组 0:开始时间,1:结束时间
                    //   	Saleprice:"",		//String 渠道售价
                    //   	status: "",
                    // }
                ]
            },
            allBookList: [],                            //所有书籍
            groupList: [],                               //图书包
            searchList: [],                               //搜索内容

            previewVisible: false,
            coverUrl: '',
            customFileList: [
                //{
                //     uid: -1,
                //     name: 'xxx.png',
                //     status: 'done',
                //     url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
                // }
            ]
        }
        this.handleIconPreview = this.handleIconPreview.bind(this);

    }
    componentDidMount() {
        this.props.params.ope =='edt' && this.fetchAllBookList();
    }
    handleChange({ fileList }) {
        this.setState({ customFileList: fileList });
        if (fileList.length && (fileList[0].status == 'done' || fileList[0].status == 'error')) {
            this.imageFetch(fileList[0].originFileObj)
        }
    }
    async imageFetch(file) {
        var formData = new FormData();
        formData.append('pictureStream', file);
        var data = await fetch(util.upLoadUrl, {
            method: 'POST',
            mode: 'cors',
            body: formData
        })
            .then(function (res) {
                return res.json();
            });
        if (data.status == 1) {
            this.setState({
                coverUrl: data.data,
                customFileList: [{ ...this.state.customFileList[0], status: 'done' }]
            });
        }
    }
    handleIconPreview = (file) => {
        this.setState({
            previewVisible: true
        });
    }
    async fetchAllBookList() {
        var doc = {
            text: '',
            page: 0,
            pageSize: 1000,
            type: "SEARCH_ALL"
        }
        var data = await fetch(util.url, {
            mode: "cors",
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: "method=ella.operation.getBookListByIdOrName" + "&content=" + JSON.stringify(doc) + dataString
        }).then(res => res.json());
        this.setState({
            allBookList: data.data.bookList,
        })
        this.fetchGoodsinfo(this.props.params.id);
    }
    async fetchGoodsinfo(str) {

        util.API({goodsCode: str }, 'ella.operation.getGoodsInfoByCode').then(res => res.json()).then((data) => {
            if (data.status == '1') {
                this.setState({
                    priceSetData: data.data.goodsChannelPriceRelation ? {
                        data: data.data.goodsChannelPriceRelation.map((item, index) => {
                            return {
                                key: index + 1,
                                channel: item.channelCode,
                                Saledate: [item.saleStartTime, item.saleFinishTime],
                                Saleprice: item.price,
                                status: item.status,
                                del: "删除"
                            }
                        })
                    } : {data: []},
                    goodsName: data.data.goodsName,
                    packageIntroduction: data.data.packageIntroduction,
                    coverUrl: data.data.coverUrl ? data.data.coverUrl: '',
                    customFileList: data.data.coverUrl ?[
                        {
                            uid: -1,
                            name: 'xxx.png',
                            status: 'done',
                            url: data.data.coverUrl,
                        }
                    ] :[],
                    goodsState: data.data.goodsState,
                    goodsCode: data.data.goodsCode,
                    goodsMarketprice: data.data.goodsMarketprice,
                    goodsSrcPrice: data.data.goodsSrcPrice,
                    goodsPrice: data.data.goodsPrice,
                    goodsDiscount: data.data.goodsDiscount == 0 ? null : data.data.goodsDiscount,
                    groupList: data.data.booksOfBookPackageList.map(item => item.bookName),
                    thirdCode: data.data.thirdCode,
                    allBookList: this.state.allBookList.concat(data.data.booksOfBookPackageList)
                })
            } else {
                message.error(data.message)
            }
        }).catch(e => {
            console.log(e.message)
        })
    }

    async searchData(v) {
        var doc = {
            text: v,
            page: 0,
            pageSize: 100
        }
        // TODO:地址连的mc的
        var data = await fetch(util.url, {
            mode: "cors",
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: "method=ella.operation.getBookListByIdOrName" + "&content=" + JSON.stringify(doc) + dataString
        }).then(res => res.json());
        this.setState({
            searchList: data.data.bookList,
        })
    }
    setOneKV(k, v) {
        this.setState({
            [k]: v
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
    //操作图书包函数 
    getGroupList() {
        var t = this.state.groupList.map(item => {
            var a = this.state.allBookList.find(n => n.bookName == item);

            if (!a) return;//TODO:防止报错
            switch (a.bookStatus) {
                case "NORMAL":
                    a.bookStatus = "正常";
                    break;
                case "EXCEPTION":
                    a.bookStatus = "删除";
                    break;
                case null:
                    a.bookStatus = "-";
            }

            switch (a.goodsStatus) {
                case "NORMAL":
                    a.goodsStatus = "正常";
                    break;
                case "EXCEPTION":
                    a.goodsStatus = "删除";
                    break;
                case null:
                    a.goodsStatus = "-";
            }
            switch (a.goodsState) {
                case "SHELVES_WAIT":
                    a.goodsState = "待上架";
                    break;
                case "SHELVES_ON":
                    a.goodsState = "已上架";
                    break;
                case "SHELVES_OFF":
                    a.goodsState = "已下架";
                    break;
                case "PRE_SALE":
                    a.goodsState = "预售";
                    break;
                case null:
                    a.goodsState = "-";
            }
            switch (a.shelvesFlag) {
                case "SHELVES_WAIT":
                    a.shelvesFlag = "待上架";
                    break;
                case "SHELVES_ON":
                    a.shelvesFlag = "已上架";
                    break;
                case "SHELVES_OFF":
                    a.shelvesFlag = "已下架";
                    break;
                case "PRE_SALE":
                    a.shelvesFlag = "预售";
                    break;
                case null:
                    a.shelvesFlag = "-";
            }

            //展示的状态
            a.zt = "图书数据状态:" + a.bookStatus + ";  图书上下架状态:" + a.shelvesFlag + ";  商品数据状态:" + a.goodsStatus + ";  商品上下架状态 " + a.goodsState;

            return a;
        })

        return t;
    }
    delGroupList(v) {
        this.setState({
                groupList: this.state.groupList.filter(item => item != v)
            }, () => {
                this.accumulation();
            }
        )
    }
    delAllGroupList() {
        this.setState({
            groupList: [],
            goodsMarketprice: null,                        //市场价
            goodsSrcPrice: null,                           //售价
            goodsPrice: null,                              //优惠价
        })
    }
    //提交数据
    async submitData(type) {
        // TODO:当商品名称为空的时候
        if (this.state.goodsName == "") {
            notification.error({
                message: "商品名称不能为空",
                description: '出现错误',
            })
            return
        }
        if (!this.state.packageIntroduction) {
            notification.error({
                message: "图书包简介不能为空",
                description: '出现错误',
            })
            return
        }
        if (this.state.packageIntroduction.trim().length>150) {
            notification.error({
                message: "图书包简介不能超过150个中文字符",
                description: '出现错误',
            })
            return
        }
        if (!this.state.coverUrl) {
            notification.error({
                message: "图书包封面未上传！",
                description: '出现错误',
            })
            return
        }
        if (this.state.groupList.length < 2 || this.state.groupList.length > 99) {
            notification.error({
                message: "图书包列表不能小于2或大于99",
                description: '出现错误',
            })
            return
        }
        //TODO:根据是新增还是编辑给出不同的method
        var method = type == "add" ? "ella.operation.insertGoods" : "ella.operation.updateGoods";
        //TODO: 渠道价格
        var goodsChannelPriceRelation = this.state.priceSetData.data.map(item => {
            item.channelCode = item.channel;
            item.price = item.Saleprice;
            if (item.Saledate.length != 0) {
                item.saleStartTime = item.Saledate[0].split("-").join("/");
                item.saleFinishTime = item.Saledate[1].split("-").join("/");
            } else {
                item.saleStartTime = '2018/11/30';
                item.saleFinishTime = '2019/12/01';
            }
            return item;
        })
        //TODO:图书包code列表
        var bookCodeList = this.state.groupList.map(item => {
            return this.state.allBookList.find(n => item == n.bookName).bookCode;
        })
        //TODO:如果图书包的价格为null就是没有修改过,那就提交合计的价格
        var goodsMarketprice = 0;
        var goodsSrcPrice = 0;
        this.getGroupList().forEach(item => {
            if (!item) return;//TODO:防止报错
            goodsMarketprice += item.goodsMarketprice;
            goodsSrcPrice += item.goodsSrcPrice;
        })
        var doc = type == "add" ? {
            thirdCode: "default",

            goodsSrcPrice: this.state.goodsSrcPrice || goodsSrcPrice,
            goodsMarketprice: this.state.goodsMarketprice || goodsMarketprice,
            goodsSubstance: "测试商品内容",
            goodsName: this.state.goodsName,
            packageIntroduction: this.state.packageIntroduction,
            coverUrl: this.state.coverUrl,
            goodsType: "BOOK_PACKAGE",
            status: "NORMAL",
            goodsState: this.state.goodsState,
            goodsChannelPriceRelation,
            bookCodeList,
            goodsCode: this.state.goodsCode,
            goodsDiscount: this.state.goodsDiscount

        } : {
            goodsPrice: this.state.goodsPrice == null ? (this.state.goodsSrcPrice || goodsSrcPrice) : this.state.goodsPrice,
            goodsSrcPrice: this.state.goodsSrcPrice || goodsSrcPrice,
            goodsMarketprice: this.state.goodsMarketprice || goodsMarketprice,
            goodsSubstance: "测试商品内容",
            goodsName: this.state.goodsName,
            packageIntroduction: this.state.packageIntroduction,
            coverUrl: this.state.coverUrl,
            goodsType: "BOOK_PACKAGE",
            status: "NORMAL",
            goodsState: this.state.goodsState,
            goodsChannelPriceRelation,
            bookCodeList,
            thirdCode: this.state.thirdCode,
            goodsCode: this.state.goodsCode,
            goodsDiscount: this.state.goodsDiscount
        }

        doc.goodsPrice = (this.state.goodsPrice == null || this.state.goodsPrice == '') ? doc.goodsSrcPrice : this.state.goodsPrice;


        var res = await fetch(util.url, {
            mode: "cors",
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: "method=" + method + "&content=" + JSON.stringify(doc) + dataString
        }).then(res => res.json())

        //TODO:存在多人同时操作,错误信息还没拼接
        if (res.code == "2000010008") {
            var error_message = "";
            res.data.forEach(item => {
                error_message = error_message + item.bookName + "  "
            })
            notification.error({
                message: error_message,
                description: '出现错误,图书包内有图书状态异常',
            })
            return
        }
        // TODO:成功的状态
        if (res.status == 1) {
            notification.success({
                message: this.state.goodsName + '保存成功'
            })
            if (this.props.params.ope == "add") {
                window.history.back();
            }
        } else {
            if (res.code == '0x00000000') {
                notification.error({
                    message: '渠道价格未填写',
                    description: '出现错误',
                });
                return;
            }
            notification.error({
                message: res.message,
                description: '出现错误',
            })
        }
        //TODO:失败的状态

    }
    // TODO:上移下移
    doUpList(n) {
        let arr = this.state.groupList;
        let temp = arr[n];
        if (n == 0) {
            message.error('不可向上移动');
            return;
        }
        arr.splice(n, 1);
        arr.splice(n - 1, 0, temp);
        this.setState({
            groupList: arr
        })
    }
    doDownList(n) {
        let arr = this.state.groupList;
        let temp = arr[n];
        if (n == arr.length - 1) {
            message.error('不可向下移动');
            return;
        }
        arr.splice(n, 1);
        arr.splice(n + 1, 0, temp);
        this.setState({
            groupList: arr
        })
    }
    showModal = () => {
        this.setState({
            visible: true,
        });
        this.refs.addBooks.getInitList();
    }
    modelCancle(msg) {
        this.setState({
            visible: msg
        });
    }
    accumulation() {
        let total = this.getGroupList();
        let goodsMarketprice = 0;
        let goodsSrcPrice = 0;
        let goodsPrice = 0;
        this.getGroupList().forEach(item => {
            if (!item) return;//TODO:防止报错
            goodsMarketprice += parseFloat(parseFloat(item.goodsMarketprice));
            goodsSrcPrice += parseFloat(parseFloat(item.goodsSrcPrice));


        })
        goodsPrice = goodsSrcPrice
        if (!total[2]) total = [];//TODO:防止报错
        goodsMarketprice = goodsMarketprice.toFixed(2);
        goodsSrcPrice = goodsSrcPrice.toFixed(2);
        goodsPrice = this.state.goodsDiscount != '' && this.state.goodsDiscount != null ? ((this.state.goodsDiscount / 10) * goodsPrice).toFixed(2) : goodsPrice.toFixed(2);
        this.setState({
            goodsMarketprice,
            goodsSrcPrice,
            goodsPrice,
        })
    }
    handleOk = (selectedRowKeys, selectedRows) => {
        var newDatakey = this.state.groupList;
        var newData = this.state.allBookList;
        newDatakey.push(...selectedRowKeys);
        newData.push(...selectedRows);
        ////      //去重,遇到重复的书籍自动去重
        var hash = {};
        newDatakey = newDatakey.reduce(function (item, next) {
            hash[next] ? '' : hash[next] = true && item.push(next);
            return item
        }, []);

        this.setState({
                "groupList": newDatakey,
                "allBookList": newData,
                visible: false

            }, () => {
                this.accumulation();
            }
        )

    }
    //置顶
    sortArr = (n) => {
        var data = this.state.groupList;
        data.unshift(data.splice(n, 1)[0]);
        this.setState({
            groupList: data
        })
    }

    render() {
        //TODO:这里是不实时搜
        const list = this.state.searchList.map(item => {
            return <Option key={item.bookName}>{item.bookName}</Option>
        });
        const errorStyle = {
            color: "red",
            fontWeight: "bold"
        }
        const columns = [
            {
                title: '物品名称',
                dataIndex: 'bookName',
                key: 'bookName',
                width: "8%",
                className: "td_hide",
                render: (text, record) => {
                    return (
                        <Popover
                            placement="top"
                            title={null}
                            content={
                                record.bookName
                            }
                        >
                            <span>{record.bookName}</span>
                        </Popover>
                    )
                }
            }, {
                title: '物品ID',
                dataIndex: 'bookCode',
                key: 'bookCode',
                width: "8%",
                className: "td_hide",
                render: (text, record) => {
                    return (
                        <Popover
                            placement="top"
                            title={null}
                            content={
                                record.bookCode
                            }
                        >
                            <span>{record.bookCode}</span>
                        </Popover>
                    )
                }
            }, {
                title: '图书状态',
                dataIndex: 'bookStatus',
                key: 'bookStatus',
                width: "8%",
                render: text => <span style={text != "正常" ? errorStyle : null}>{text}</span>

            }, {
                title: '图书上下架',
                dataIndex: 'shelvesFlag',
                key: 'shelvesFlag',
                width: "8%",
                render: text => <span style={text != "已上架" ? errorStyle : null}>{text}</span>
            },
            {
                title: '商品状态',
                dataIndex: 'goodsStatus',
                key: 'goodsStatus',
                width: "8%",
                render: text => <span style={text != "正常" ? errorStyle : null}>{text}</span>
            }, {
                title: '商品上下架',
                dataIndex: 'goodsState',
                key: 'goodsState',
                width: "8%",
                render: text => <span style={text != "已上架" ? errorStyle : null}>{text}</span>
            }, {
                title: '市场价',
                dataIndex: 'goodsMarketprice',
                key: 'goodsMarketprice',
                width: "12%",
            }, {
                title: '售价',
                dataIndex: 'goodsSrcPrice',
                key: 'goodsSrcPrice',
                width: "12%"
            }, {
                title: '优惠价',
                dataIndex: 'goodsPrice',
                key: 'goodsPrice',
                width: "12%"
            }, {
                title: '操作',
                width: "16%",
                render: (text, record, index) => {
                    return <div>
                        <span style={{ marginRight: '20px' }} className='i-action-ico i-stick' onClick={() => { this.sortArr(index) }}></span>
                        <span
                            title="点击上移"
                            style={{ marginRight: '10px' }}
                            className="i-action-ico i-up"
                            onClick={() => {
                                this.doUpList(index);
                            }}
                        ></span>
                        <span
                            title="点击下移"
                            style={{ marginRight: '10px' }}
                            className="i-action-ico i-down"
                            onClick={() => {
                                this.doDownList(index);
                            }}
                        ></span>
                        <span
                            title="点击删除"
                            className="i-action-ico i-delete"
                            onClick={() => { this.delGroupList(record.bookName) }}
                            href="javsscript:void(0);"
                        ></span>
                    </div>
                }
            }

        ];
        const { goodsMarketprice, goodsSrcPrice, goodsPrice, goodsMarketprice2 } = this.state;

        return <div id="goodsGroup">
            <p className="m-title"><Link style={{ color: "#666" }} to="/goodsList"><Icon type="left" />{this.props.params.ope == "add" ? "增加" : "编辑"}图书包</Link></p>
            <div className="box">
                <h3>商品设定</h3>
                <Row>
                    <Col span={16}>
                        <Row style={{ marginBottom: 15 }}>
                            <Col span={12}><span className='labelSpan'>商品 ID:</span>  {this.state.goodsCode || "后台自动生成"}</Col>
                            <Col span={12}><span className='labelSpan'>商品名称:</span><Input value={this.state.goodsName} onChange={(e) => { this.setOneKV("goodsName", e.target.value) }} style={{ width: "60%" }} /></Col>
                        </Row>
                        <Row style={{ marginBottom: 15 }}>
                            <Col span={12}><span className='labelSpan'>商品类型: </span> 图书包</Col>
                            <Col span={12}><span className='labelSpan'>图书包简介: </span><Input value={this.state.packageIntroduction} onChange={(e) => { this.setOneKV("packageIntroduction", e.target.value) }} style={{ width: "60%" }} /></Col>
                        </Row>
                        <Row style={{ marginBottom: 15 }}>
                            <Col style={{ display: 'flex' }}><span className='labelSpan'>{this.state.thirdCode ? "商品包链接:" : ""}</span> <Popover
                                placement="top"
                                title={null}
                                content={this.state.thirdCode ? "ellabook2://package.book?packageCode=" + this.state.thirdCode : ""}
                            >
                                <span className='ellipsisSpan'>{this.state.thirdCode ? "ellabook2://package.book?packageCode=" + this.state.thirdCode : ""}</span>
                            </Popover></Col>
                        </Row>
                    </Col>
                    <Col span={8}>
                        <div style={{ width: 250, display: 'flex' }}>
                            <span className='labelSpan'>图书包封面：</span>
                            <div>
                                <Upload
                                    accept=".jpg,.png,.webp,.bmp,.tiff,.gif,.jpeg"
                                    action="//jsonplaceholder.typicode.com/posts/"
                                    listType="picture-card"
                                    fileList={this.state.customFileList}
                                    onPreview={this.handleIconPreview}
                                    onChange={({ fileList }) => { this.handleChange({ fileList }) }}
                                    onRemove={() => { this.setState({ coverUrl: "" }) }}
                                >
                                    {this.state.customFileList.length >= 1 ? null : <div>
                                        <Icon type="plus" />
                                        <div className="ant-upload-text">Upload</div>
                                    </div>}
                                </Upload>
                                <div style={{ color: '#faad14' }}>尺寸：240*240</div>
                            </div>
                            <Modal visible={this.state.previewVisible} footer={null} onCancel={() => { this.setState({ previewVisible: false }) }}>
                                <img alt="example" style={{ width: '100%' }} src={this.state.coverUrl} />
                            </Modal>
                        </div>
                    </Col>
                </Row>
                <Divider />
                <h3>内容设定</h3>
                <Row >
                    <Col span={3} offset={4} style={{ marginBottom: 10 }}>
                        <Button type="primary" className="ant-btn-add" icon="plus" onClick={this.showModal}>添加图书</Button>
                    </Col>
                    <CommonAddBook ref="addBooks" rowKey="bookName" visible={this.state.visible} modelCancle={msg => this.modelCancle(msg)} handleOk={(selectedRowKeys, selectedRows) => this.handleOk(selectedRowKeys, selectedRows)}></CommonAddBook>
                </Row>
                <Row>
                    <div className="bookListTable">
                        <Table rowKey={(record, index) => index} pagination={false} columns={columns} className="bookTable" dataSource={this.getGroupList()} scroll={{ y: "300px" }}
                               footer={() =>
                                   <div style={{ textAlign: "right", position: "relative" }}>
                                       <a style={{ fontSize: "14px", position: "absolute", left: "10px" }} href="javsscript:void(0);" onClick={() => { this.delAllGroupList() }}>删除所有</a>
                                       <span style={{ marginRight: "20px", color: "red", display: 'inline-block', fontWeight: "bold" }}>图书包总价:</span>
                                       <Input
                                           disabled
                                           style={{ width: "10%", "marginRight": "2%" }}
                                           defaultValue={"0"}
                                           type="number"
                                           value={goodsMarketprice}
                                       />
                                       <Input
                                           disabled
                                           style={{ width: "10%", "marginRight": "2%" }}
                                           type="number"
                                           step={0.01}
                                           value={goodsSrcPrice}
                                       />
                                       <Input
                                           style={{ width: "10%", "marginRight": "2%" }}
                                           onBlur={(e) => { this.setOneKV("goodsPrice", goodsPrice) }}
                                           type="number"
                                           step={0.01}
                                           value={goodsPrice}
                                           onChange={(e) => { this.setOneKV("goodsPrice", e.target.value) }}
                                       />
                                       <Input
                                           style={{ width: "13%", marginRight: "1%" }}
                                           onBlur={(e) => {
                                               if (String(this.state.goodsDiscount) == "0" || String(this.state.goodsDiscount) == "10") {
                                                   this.setOneKV("goodsDiscount", null)
                                                   this.accumulation();
                                                   notification.error({
                                                       message: "折扣输入范围为0.1-9.9",
                                                       description: '出现错误',
                                                   })

                                               }
                                           }
                                           }
                                           type="number"
                                           placeholder="请输入折扣"
                                           className="disCountPrice"
                                           step={0.1}
                                           max={9.9}
                                           min={0.1}
                                           value={this.state.goodsDiscount}
                                           onChange={(e) => {
                                               if (e.target.value > 10 || e.target.value < 0) {
                                                   return;
                                               }
                                               if (String(e.target.value) == '') {
                                                   var cur = '';
                                                   this.setState({
                                                       goodsDiscount: null,
                                                       goodsPrice: this.state.goodsSrcPrice
                                                   })

                                               } else {
                                                   var cur = e.target.value;
                                                   if (this.state.goodsPrice != null && this.state.goodsPrice != '') {
                                                       this.setState({
                                                           goodsPrice: ((cur / 10) * this.state.goodsSrcPrice).toFixed(2)
                                                       })
                                                   }
                                               }
                                               this.setOneKV("goodsDiscount", cur);
                                           }}
                                       />
                                       <span>折</span>
                                   </div>
                               }
                        />
                    </div>
                </Row>
                <Row >
                </Row>
                <Divider />
                <PriceSet
                    prveData={{ goodsCode: this.props.params.id }}
                    changePriceSetData={this.changePriceSetData.bind(this)}
                    addPriceSetData={this.addPriceSetData.bind(this)}
                    delPriceSetData={this.delPriceSetData.bind(this)}
                ></PriceSet>
                <h3>商品状态</h3>
                <Row>
                    <Col offset={1} span={3}><span>设置商品状态:</span></Col>
                    <Col span={6}>
                        <Select value={this.state.goodsState} style={{ width: "50%" }} onChange={e => this.setOneKV("goodsState", e)}>
                            <Option value="SHELVES_WAIT">待上架</Option>
                            <Option value="SHELVES_ON">已上架</Option>
                            <Option value="SHELVES_OFF">已下架</Option>
                            <Option value="PRE_SALE">预售</Option>
                        </Select>
                    </Col>
                    <Col span={3}>
                        <Button className="goodsGroup_button" style={{ width: "120px" }} type="primary" onClick={() => { this.submitData(this.props.params.ope) }} >确定</Button>
                    </Col>
                    <Col span={3} offset={1}>
                        <Button className="goodsGroup_button" style={{ width: "120px" }} type="primary"><Link to="/goodsList">取消</Link></Button>
                    </Col>
                </Row>
            </div>
        </div >
    }
}