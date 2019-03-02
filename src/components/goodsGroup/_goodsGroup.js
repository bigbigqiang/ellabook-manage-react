import React from 'react';
import { Row, Col, Card, Icon, Button, Table, Tabs, notification, message, Input, Select, Divider, Modal, InputNumber,Popover} from "antd";
import { Link } from 'react-router';
import getUrl from "../util.js";
import PriceSet from "./PriceSet.js";
import ChooseBooks from "./chooseBooks.js";
import { CommonAddBook } from "../commonAddBook.js"
import { dataString } from '../commonData.js'
// import FreeTime from "../addgoods/freeTime.js";
import "../../main.css";
const Search = Input.Search;
export default class addGoods extends React.Component {
    constructor() {
        super();
        this.state = {
            visible: false,
            goodsName: "",                              //商品名字
            goodsState: "SHELVES_WAIT",            //商品状态
            goodsMarketprice: null,                        //市场价
            goodsSrcPrice: null,                           //售价
            goodsPrice: null,  //优惠价
            goodsDiscount:'',
            goodsCode: "",
            thirdCode: "",  //图书包的编码pk开头
            uid:localStorage.getItem("uid"),
            token:localStorage.getItem("token"),
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
        }

    }
    componentDidMount() {
        this.fetchAllBookList();
    }
    async fetchAllBookList() {
        var doc = {
            text: '',
            page: 0,
            pageSize: 1000,
            type: "SEARCH_ALL"
        }
        // TODO:地址连的mc的
        var data = await fetch(getUrl.url, {
            mode: "cors",
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: "method=ella.operation.getBookListByIdOrName" + "&content=" + JSON.stringify(doc)+dataString
        }).then(res => res.json());
        this.setState({
            allBookList: data.data.bookList,
        })
        // 获取所有图书列表后 再拉取默认数据
        console.log(1)
      this.fetchGoodsinfo(this.props.params.id);
    }
    async fetchGoodsinfo(str) {
    	console.log(2)
        //TODO:连了mc的接口
        var data = await fetch(getUrl.url, {
            mode: "cors",
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: "method=ella.operation.getGoodsInfoByCode" + "&content=" + JSON.stringify({ "goodsCode": str })+dataString
        }).then(res => res.json())
           this.setState({
           	goodsinfo : data.data
           })
        if (!data.data) return;
        if(data.data.goodsDiscount!=''){
        	var goodsPrice=Math.floor(((data.data.goodsDiscount/10)*data.data.goodsSrcPrice)*10*10)/100;
        }else{
        	var goodsPrice=data.data.goodsSrcPrice;
        }
        console.log(data.data.goodsMarketprice)
        this.setState({
            priceSetData: {
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
            },
        	goodsName: data.data.goodsName,
        	goodsState: data.data.goodsState,
        	goodsCode: data.data.goodsCode,
        	goodsMarketprice2: data.data.goodsMarketprice,
//        	goodsMarketprice: data.data.goodsMarketprice,
//          goodsSrcPrice: data.data.goodsSrcPrice,
//         	goodsPrice:goodsPrice,
 //           goodsDiscount: data.data.goodsDiscount,
            groupList: data.data.booksOfBookPackageList.map(item => item.bookName),
            thirdCode: data.data.thirdCode,
            allBookList: this.state.allBookList.concat(data.data.booksOfBookPackageList)
        })
//      if (data.data.goodsChannelPriceRelation == null) {
//      	
//          this.setState({
//              goodsName: data.data.goodsName,
//              goodsState: data.data.goodsState,
//              goodsCode: data.data.goodsCode,
//              goodsMarketprice: data.data.goodsMarketprice,
//              goodsSrcPrice: data.data.goodsSrcPrice,
//              goodsPrice:goodsPrice, 
//              thirdCode: data.data.thirdCode,
//              goodsDiscount: data.data.goodsDiscount,
//              groupList: data.data.booksOfBookPackageList.map(item => item.bookName),
//              allBookList: this.state.allBookList.concat(data.data.booksOfBookPackageList)
//          })
//      } else {
//          this.setState({
//              priceSetData: {
//                  data: data.data.goodsChannelPriceRelation.map((item, index) => {
//                      return {
//                          key: index + 1,
//                          channel: item.channelCode,
//                          Saledate: [item.saleStartTime, item.saleFinishTime],
//                          Saleprice: item.price,
//                          status: item.status,
//                          del: "删除"
//                      }
//                  })
//              },
//            goodsName: data.data.goodsName,
//            goodsState: data.data.goodsState,
//            goodsCode: data.data.goodsCode,
//            goodsMarketprice: data.data.goodsMarketprice,
//              goodsSrcPrice: data.data.goodsSrcPrice,
////             	goodsPrice:goodsPrice,
////              goodsDiscount: data.data.goodsDiscount,
////              groupList: data.data.booksOfBookPackageList.map(item => item.bookName),
////              // groupList: ["动态阅读7-2惜福与丰收", "动态阅读2-3彩色世界", "动态阅读1-2果儿香香"],
////              thirdCode: data.data.thirdCode,
////              allBookList: this.state.allBookList.concat(data.data.booksOfBookPackageList)
//          })
        

    }

    async searchData(v) {
        var doc = {
            text: v,
            page: 0,
            pageSize: 100,
            // type: "SEARCH_ALL"
        }
        // TODO:地址连的mc的
        var data = await fetch(getUrl.url, {
            mode: "cors",
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: "method=ella.operation.getBookListByIdOrName" + "&content=" + JSON.stringify(doc)+dataString
        }).then(res => res.json());
        console.log({ "search": data.data })
        this.setState({
            searchList: data.data.bookList,
        })
    }
    setOneKV(k, v) {
    	console.log(v)
        this.setState({
            [k]: v
        })
    }
    //PriceSet获取渠道价格
    changePriceSetData(key, str, value) {
        // console.log(key,str,value);
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
			var a = this.state.allBookList.find(n => n.bookName==item);
		
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
        },()=>{
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
        console.log(this.state.goodsPrice)
        if (this.state.goodsName == "") {
            notification.error({
                message: "商品名称不能为空",
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
            }
            return item;
        })
        //TODO:图书包code列表
        var bookCodeList = this.state.groupList.map(item => {
            return this.state.allBookList.find(n => item == n.bookName).bookCode;
        })

        // console.log(this.state.groupList);
        // console.log(bookCodeList)
        // return
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
            goodsType: "BOOK_PACKAGE",
            status: "NORMAL",
            goodsState: this.state.goodsState,
            goodsChannelPriceRelation,
            bookCodeList,
            // thirdCode: this.state.thirdCode,
            goodsCode: this.state.goodsCode,
            goodsDiscount:this.state.goodsDiscount

        } : {
                // thirdCode: "default",
                goodsPrice: this.state.goodsPrice==null?(this.state.goodsSrcPrice || goodsSrcPrice):this.state.goodsPrice,
                goodsSrcPrice: this.state.goodsSrcPrice || goodsSrcPrice,
                goodsMarketprice: this.state.goodsMarketprice || goodsMarketprice,
                goodsSubstance: "测试商品内容",
                goodsName: this.state.goodsName,
                goodsType: "BOOK_PACKAGE",
                status: "NORMAL",
                goodsState: this.state.goodsState,
                goodsChannelPriceRelation,
                bookCodeList,
                thirdCode: this.state.thirdCode,
                goodsCode: this.state.goodsCode,
                goodsDiscount:this.state.goodsDiscount
            }

        doc.goodsPrice=(this.state.goodsPrice==null||this.state.goodsPrice=='')?doc.goodsSrcPrice:this.state.goodsPrice;
       

        var res = await fetch(getUrl.url, {
            mode: "cors",
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: "method=" + method + "&content=" + JSON.stringify(doc)+dataString
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
            setTimeout(function () {
                // window.location.reload()
            }, 5000)
            return
        }
        // TODO:成功的状态
        if (res.status == 1) {
            var _this = this;
            notification.success({
                message: this.state.goodsName + '保存成功',
                description: '回到上级菜单',
            })
            // history.push('/home');
            window.history.back();
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
	      visible:msg
	    });
	}
    accumulation(){
    	let total = this.getGroupList();
        let goodsMarketprice = 0;
        let goodsSrcPrice = 0;
        let goodsPrice = 0;
        this.getGroupList().forEach(item => {
            if (!item) return;//TODO:防止报错
            goodsMarketprice += parseFloat(parseFloat(item.goodsMarketprice));
            goodsSrcPrice += parseFloat(parseFloat(item.goodsSrcPrice));
           
            
        })
        goodsPrice=goodsSrcPrice
        if (!total[2]) total = [];//TODO:防止报错
        goodsMarketprice = goodsMarketprice.toFixed(2);
        goodsSrcPrice = goodsSrcPrice.toFixed(2);
        goodsPrice = goodsPrice.toFixed(2);
        this.setState({
            goodsMarketprice,
            goodsSrcPrice,
            goodsPrice,  
        })
    }
    handleOk = (selectedRowKeys,selectedRows) => {
    	console.log("hahh")
      	var newDatakey= this.state.groupList;
      	var newData=this.state.allBookList;
        newDatakey.push(...selectedRowKeys);
        newData.push(...selectedRows);
////      //去重,遇到重复的书籍自动去重
        var hash = {};
        newDatakey = newDatakey.reduce(function (item, next) {
            hash[next] ? '' : hash[next] = true && item.push(next);
            return item
        }, []);
      	this.accumulation();
		this.setState({
            "groupList":newDatakey,
            "allBookList":newData,
            visible: false
            
        })

    }
    //置顶
   	sortArr = (n) => {
       
        var data = this.state.groupList;
        data.unshift(data.splice(n, 1)[0]);
       
        
        this.setState({
            groupList: data,
          
        })
    }
   
    render() {
        //TODO:这里是不实时搜
        // const list = this.state.allBookList.map(item => {
        //     return <Option key={item.bookName}>{item.bookName}</Option>
        // });
        const list = this.state.searchList.map(item => {
            return <Option key={item.bookName}>{item.bookName}</Option>
        });
        const errorStyle = {
            color: "red",
            fontWeight: "bold",
            // transform: "rotate(17deg)"
        }
        const columns = [
            {
                title: '物品名称',
                dataIndex: 'bookName',
                key: 'bookName',
                width:"8%",
                className: "td_hide",
		        render: (text, record) =>{
		            return(
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
		        render: (text, record) =>{
		            return(
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
            },{
                title: '图书状态',
                dataIndex: 'bookStatus',
                key: 'bookStatus',
                width: "8%",
                render: text => <span style={text != "正常" ? errorStyle : null}>{text}</span>

            }, {
                title: '图书上下架',
                dataIndex: 'shelvesFlag',
                key: 'shelvesFlag',
                width:"8%",
                //TODO: 颜色改变
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
                                console.log(index)
                                this.doUpList(index);
                            }}
                        ></span>
                        <span
                            title="点击下移"
                            style={{ marginRight: '10px' }}
                            className="i-action-ico i-down"
                            onClick={() => {
                                console.log(index)
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
       	const {	goodsMarketprice,goodsSrcPrice,goodsPrice,goodsMarketprice2 }=this.state;
       	
        return <div id="goodsGroup">
            <p className="title"><Link style={{ color: "#666" }} to="/goodsList"><Icon type="left" />{this.props.params.ope == "add" ? "增加" : "编辑"}图书包</Link></p>
            <div className="box">
                <h3>商品设定</h3>
                <Row className="goodsGroup_row">
                    <Col className="goodsGroup_part" offset={1} span={3}><span>商品 ID:</span></Col>
                    <Col className="goodsGroup_part" span={6}>{this.state.goodsCode || "后台自动生成"}</Col>
                    <Col className="goodsGroup_part" span={3}>商品名称:</Col>
                    <Col className="goodsGroup_part" span={6}>
                        <Input value={this.state.goodsName} onChange={(e) => { this.setOneKV("goodsName", e.target.value) }} style={{ width: "50%" }} />
                    </Col>
                </Row>
                <Row className="goodsGroup_row">
                    <Col className="goodsGroup_part" offset={1} span={3}><span>商品类型:</span></Col>
                    <Col className="goodsGroup_part" span={6}>商品包</Col>
                    <Col className="goodsGroup_part" span={3}>{this.state.thirdCode ? "商品包链接:" : ""}</Col>
                    <Col className="goodsGroup_part" span={11}>
                        {this.state.thirdCode ? "ellabook2://package.book?packageCode=" + this.state.thirdCode : ""}
                    </Col>
                </Row>
                <Row>
                    <Col>

                    </Col>
                </Row>
                <Divider />
                <h3>内容设定</h3>
                <Row className="goodsGroup_row">
                    <Col span={3} offset={4}>
                        <Button type="primary" className="ant-btn-add" icon="plus" onClick={this.showModal}>添加图书</Button>
                    </Col>
                   	<CommonAddBook ref="addBooks" rowKey="bookName" visible={this.state.visible} modelCancle= {msg => this.modelCancle(msg)} handleOk= {(selectedRowKeys,selectedRows) => this.handleOk(selectedRowKeys,selectedRows)}></CommonAddBook>
                </Row>
                <Row>
                    <div className="bookListTable">
						<Table pagination={false} columns={columns} className="bookTable" dataSource={this.getGroupList()} scroll={{ y: "300px" }} 
                        		footer={() =>
	                        		<div style={{"text-align":"right","position":"relative"}}>	
	                        			<a style={{ fontSize: "14px","position":"absolute","left":"10px" }} href="javsscript:void(0);" onClick={() => { this.delAllGroupList() }}>删除所有</a>
	                        			<span style={{"margin-right":"20px","color":"red","display":"inline-block","font-weight":"bold"}}>图书包总价:</span>
		                        		{
//		                        			<InputNumber min={1} max={10} defaultValue={3} style={{ width: "10%","margin-right":"2%" }}/>
		                        		}
		                        		<Input
		                                    disabled
		                                    style={{ width: "10%","margin-right":"2%" }}
		                                    defaultValue={"0"}
		                                    type="number"
		                                    value={goodsMarketprice}
		                                />
		                                <Input
		                                		   disabled
		                                       style={{ width: "10%","margin-right":"2%" }}                                 
		                                       type="number"
		                                       step={0.01}
		                                       value={goodsSrcPrice}    
		                                />
		                                <Input
		                                    style={{ width: "10%","margin-right":"2%" }}
		                                    onBlur={(e) => {this.setOneKV("goodsPrice",goodsPrice) }}
		                                    type="number"
		                                    step={0.01}
		                                    value={goodsPrice}
		                                    onChange={(e) => { console.log('hha');this.setOneKV("goodsPrice", e.target.value) }} 
		                                />
		                                <Input
		                                    style={{ width: "13%","margin-right":"1%"}}
		                                    onBlur={(e) => { 
		                                    	if (String(this.state.goodsDiscount)!='')this.setOneKV("goodsDiscount",this.state.goodsDiscount)}
		                                    }
		                                    type="number"
		                                    placeholder="请输入折扣"
		                                  	className="disCountPrice"
		                                    step={0.1}
		                                    max={9.9}
		                                    min={0.1}
		                                   	value={String(this.state.goodsDiscount) == '' ? '': this.state.goodsDiscount}
		                                    onChange={(e) => { 
		                                    	if(String(e.target.value)==''){
		                                    		var cur='';
		                                    		this.setState({
		                                    			goodsPrice:this.state.goodsSrcPrice
		                                    		})
		                                    		
		                                    	}else{
		                                    		var cur=e.target.value;
		                                    		if(this.state.goodsPrice!=null&&this.state.goodsPrice!=''){
		                                    			this.setState({
		                                        			goodsPrice:(Math.floor(((cur/10)*this.state.goodsSrcPrice)*10*10)/100)
		                                        		})
		                                    		}
		                                    		
		                                    		
		                                    	}
		                                    	console.log(cur);
		                                    	this.setOneKV("goodsDiscount", cur);
		                                    }}
		                                />
	                                	<span>折</span>
	                        		</div>
                        		}   
                        />
                    </div>
                </Row>
                <Row className="goodsGroup_row">
                </Row>
                <Divider />
                <PriceSet
                    prveData={{ goodsCode: this.props.params.id }}
                    // prveData={{ goodsCode: "G" }}
                    changePriceSetData={this.changePriceSetData.bind(this)}
                    addPriceSetData={this.addPriceSetData.bind(this)}
                    delPriceSetData={this.delPriceSetData.bind(this)}
                ></PriceSet>
                {/* <FreeTime></FreeTime> */}
                {/* <Divider /> */}
                <h3>商品状态</h3>
                <Row>
                    <Col className="goodsGroup_part" offset={1} span={3}><span>设置商品状态:</span></Col>
                    <Col className="goodsGroup_part" span={6}>
                        <Select value={this.state.goodsState} style={{ width: "50%" }} onChange={e => this.setOneKV("goodsState", e)}>
                            {/* <Select style={{ width: "50%" }} onChange={e => console.log(e)}> */}
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