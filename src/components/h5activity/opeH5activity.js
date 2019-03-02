import React from 'react';
import { Row, Col, Card, Icon, Button, Table, Tabs, message, Input, Checkbox, Select, DatePicker, Radio, Upload, Modal, Divider, notification, Spin,InputNumber } from "antd";
import { Link } from 'react-router';
import getUrl from "../util.js";
import commonData from '../commonData.js';
import H5Index from "./h5/indexH5.js";
import Html from "./h5model";
import "../../main.css";
import "./opeH5activity.css";
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
const Search = Input.Search;
const RadioGroup = Radio.Group;
const confirm = Modal.confirm;
export default class addGoods extends React.Component {
    constructor() {
        super();
        this.state = {
            spinning: true,             //TODO:页面是否在加载
            activityCode: "",         //TODO:活动编码,如果是新增这个时候要提交temH5ActivityCode,这个由前端生成
            activityName: "",        //活动名称
            activityAmount: "",         //用户数量
            whetherLimit: false,        //是否限量 TODO: 提交的时候false为YES限定,true为NO不限定
            books: "",               //活动图书列表 TODO:提交的时候根据selectBookList获取code
            startTime: "",           //活动开始时间
            endTime: "",             //活动结束时间
            title: "",               //分享标题
            subTitle: "",            //分享副标题
            isForceShare: true,         //是否强制分享TODO: true传YES false传NO
            forceShareDesc: "1",       //TODO:强制分享描述,现在是影藏了,随便传了一个参数
            // TODO:indexContent:提交数据的时候下面四个放进去
            indexFont: "",          //TODO:领书页页按钮文字内容
            indexFontColor: "",     //TODO:领书页页按钮文字颜色
            indexButtonColor: "",   //TODO:领书页页按钮颜色
            img2: "",               //TODO:领书页页背景图
            img1: "",               //TODO:微信分享图片
            // TODO:landingContent:提交数据的时候下面几个放进去
            landMainTitleFont: "",  //TODO:落地页标题文字
            landMainTitleFontColor: "",
            landSubTitleFont: "",
            landSubTitleFontColor: "",
            landButtonFont: "",
            landButtonFontColor: "",
            landButtonColor: "",
            landText: "",            //TODO:固定文案颜色
            img3: "",
            //图片上传
            previewVisible: false,
            previewImage: '',
            fileList: [
                //默认数据
                //{
                //     uid: -1,
                //     name: 'xxx.png',
                //     status: 'done',
                //     url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
                // }
            ],

            previewVisible2: false,
            previewImage2: '',
            fileList2: [],

            previewVisible3: false,
            previewImage3: '',
            fileList3: [],
            //图片上传

            // 临时数据
            allBookList: [],
            searchBookList: [],
            selectBookList: [],

        }

    }
    componentDidMount() {
        this.fetchBookList('')
        if (this.props.params.ope == "updata") this.fetchDefaultdata(this.props.params.code);
    }
    getSelectBookCodeList() {
        let a = this.state.selectBookList.map(item => {
            if (this.state.allBookList.find(n => n.bookName == item) == undefined) return
            return this.state.allBookList.find(n => n.bookName == item).bookCode
        })
        return a;
    }
    // TODO:这里是前端生成的活动码
    createCode() {
        var now = new Date();
        var year = now.getFullYear();       //年  
        var month = now.getMonth() + 1;     //月  
        var day = now.getDate();            //日  
        var hh = now.getHours();            //时  
        var mm = now.getMinutes();          //分  
        var ss = now.getSeconds();           //秒  
        var clock = year;
        if (month < 10)
            clock += "0";
        clock += month;
        if (day < 10)
            clock += "0";
        clock += day;
        if (hh < 10)
            clock += "0";
        clock += hh;
        if (mm < 10) clock += '0';
        clock += mm;
        if (ss < 10) clock += '0';
        clock += ss;
        clock = 'SBA' + clock;
        do {
            clock += parseInt(Math.random() * 10);
        } while (clock.length != 23)
        return (clock);
    }
    async fetchBookList(str) {
        var doc = {
            text: str,
            page: 0,
            pageSize: 1000,
        }
        var data = await fetch(getUrl.url, {
            mode: "cors",
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: "method=ella.operation.getBookListByIdOrName" + "&content=" + JSON.stringify(doc) + commonData.dataString
        }).then(res => res.json());
        this.setState({
            allBookList: data.data.bookList,
            searchBookList: data.data.bookList
        })
    }
    // TODO:搜索的图书列表
    async fetchSearchBookList(str) {
        var doc = {
            text: str,
            page: 0,
            pageSize: 1000,
        }
        var data = await fetch(getUrl.url, {
            mode: "cors",
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: "method=ella.operation.getBookListByIdOrName" + "&content=" + JSON.stringify(doc) + commonData.dataString
        }).then(res => res.json());
        this.setState({
            searchBookList: data.data.bookList
        })
    }
    // 获取默认数据
    async fetchDefaultdata(activityCode) {
        var doc = {
            activityCode
        }
        var data = await fetch(getUrl.url, {
            mode: "cors",
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: "method=ella.operation.sendBook.selectTemH5ActivityInfo" + "&content=" + JSON.stringify(doc) + commonData.dataString
        }).then(res => res.json());
        console.log(data)

        // TODO:这里为了把bookCode换成bookName
        var doc2 = {
            text: "",
            page: 0,
            pageSize: 1000,
        }
        var data2 = await fetch(getUrl.url, {
            mode: "cors",
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: "method=ella.operation.getBookListByIdOrName" + "&content=" + JSON.stringify(doc2) + commonData.dataString
        }).then(res => res.json());


        let o = data.data.sendBookActivity;
        let n = data.data.sendBookActivityShare;

        console.log(o.books.split(","));

        console.log(data2.data.bookList)
        this.setState({
            spinning: false,
            activityCode: o.activityCode,
            activityName: o.activityName,
            whetherLimit: o.whetherLimit == 'YES' ? false : true,
            activityAmount: o.activityAmount,
            startTime: o.startTime,
            endTime: o.endTime,
            isForceShare: n.isForceShare == "YES" ? true : false,
            forceShareDesc: n.forceShareDesc,
            selectBookList: o.books.split(",").map(item => {
                return data2.data.bookList.find(n => n.bookCode == item).bookName;
            }),
            // TODO:三个图片
            fileList: [
                //默认数据
                {
                    uid: -1,
                    name: 'xxx.png',
                    status: 'done',
                    url: n.indexContent.img1,
                }
            ],
            fileList2: [
                {
                    uid: -1,
                    name: 'xxx.png',
                    status: 'done',
                    url: n.indexContent.img2,
                }
            ],
            fileList3: [
                {
                    uid: -1,
                    name: 'xxx.png',
                    status: 'done',
                    url: n.landingContent.img3,
                }
            ],
            img1: n.indexContent.img1,
            img2: n.indexContent.img2,
            img3: n.landingContent.img3,

            title: n.title,
            subTitle: n.subTitle,
            // TODO:主页默认样式
            indexFont: n.indexContent.indexFont,
            indexFontColor: n.indexContent.indexFontColor,
            indexButtonColor: n.indexContent.indexButtonColor,
            //TODO:落地页默认样式
            landMainTitleFont: n.landingContent.landMainTitleFont,
            landMainTitleFontColor: n.landingContent.landMainTitleFontColor,
            landSubTitleFont: n.landingContent.landSubTitleFont,
            landSubTitleFontColor: n.landingContent.landSubTitleFontColor,
            landButtonFont: n.landingContent.landButtonFont,
            landButtonFontColor: n.landingContent.landButtonFontColor,
            landButtonColor: n.landingContent.landButtonColor,
            landText: n.landingContent.landText,






        })
    }
    //公共设置单个state函数
    setOneKV(k, v) {
        this.setState({
            [k]: v
        })
    }
    ///////////////////////////////文本图片上传////////////////////////////////////////////
    handleCancel = (k) => this.setState({ [k]: false })
    handlePreview = (file, previewImage, previewVisible) => {
        this.setState({
            [previewImage]: file.url || file.thumbUrl,
            [previewVisible]: true,
        });
    }
    handleChange = ({ fileList }, k, img) => {

        console.log(k)
        this.setState({ [k]: fileList,[img]:"" }, () => {
            if(fileList.length==0){
                return ;
            }
            // Blah blah
            // console.log(encodeURIComponent(this.state.fileList[0]))
            let thumbUrl = this.state[k][0].thumbUrl || null;

            // console.log('fileList：',this.state.fileList[0]);

            if (this.state[k][0].percent == 100) {
                setTimeout(() => {
                    // console.log('上传成功！');
                    this.imageFetch(thumbUrl, img);
                    return;
                }, 0)

            } else {
                // console.log('上传失败！')
            }
        });
    }
    convertBase64UrlToBlob = (urlData) => {

        var bytes = window.atob(urlData.split(',')[1]);        //去掉url的头，并转换为byte  

        //处理异常,将ascii码小于0的转换为大于0  
        var ab = new ArrayBuffer(bytes.length);
        var ia = new Uint8Array(ab);
        for (var i = 0; i < bytes.length; i++) {
            ia[i] = bytes.charCodeAt(i);
        }
        console.log('type:' + urlData.split(',')[0].split(':')[1].split(';')[0]);
        var type = urlData.split(',')[0].split(':')[1].split(';')[0];
        return new Blob([ab], { type: type });

    }
    imageFetch = async (url, img) => {
        // var doc = {
        //     pictureStream:window.btoa(url)
        // };
        var formData = new FormData();
        formData.append('pictureStream', this.convertBase64UrlToBlob(url), "file_" + Date.parse(new Date()) + ".png");

        var data = await fetch(getUrl.upLoadUrl, {
            method: 'POST',
            // headers: {
            //     "Content-type":"application/x-www-form-urlencoded"
            // },
            mode: 'cors',
            body: formData
        })
            .then(function (res) {
                return res.json();
            });
        if (data.status == 1) {
            console.log(data);
            this.setState({ [img]: data.data });
        }

        // console.log(JSON.stringify(data.data));
    }
    //弹窗
    showConfirm(doc) {
        console.log(doc)
        var _this = this;
        confirm({
            title: `请确认是否${this.props.params.ope == "updata" ? '修改' : '添加'}该赠书活动?`,
            // content: '点确定将提交后台',
            okText: '确定',
            okType: 'primary',
            cancelText: '继续编辑',
            onOk() {
                _this.submitData(doc)
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }
    // TODO:提交数据
    async submitData(ope) {
        // TODO:生成活动码必须在这里生成先储存;(不同时间生成的会不一样)
        var createCode = ope == "updata" ? this.state.activityCode : this.createCode();
        // TODO:比较时间大小
        function CompareDate(d1, d2) {
            return ((new Date(d1.replace(/-/g, "\/"))) >= (new Date(d2.replace(/-/g, "\/"))));
        }
        var doc = {
            activityName: this.state.activityName,
            activityType: "TEM_H5",
            activityAmount: this.state.activityAmount,
            whetherLimit: this.state.whetherLimit ? "NO" : "YES",
            books: this.getSelectBookCodeList().join(','),
            startTime: this.state.startTime,
            endTime: this.state.endTime,
            title: this.state.title,
            subTitle: this.state.subTitle,
            isForceShare: this.state.isForceShare ? "YES" : "NO",
            forceShareDesc: this.state.forceShareDesc,
            temH5ActivityCode: ope == "add" ? createCode : "",
            activityCode: ope == "updata" ? this.state.activityCode : "",
            booksCount: this.state.selectBookList.length,
            indexContent: {
                indexFont: this.state.indexFont,
                indexFontColor: this.state.indexFontColor,
                indexButtonColor: this.state.indexButtonColor,
                img1: this.state.img1,
                img2: this.state.img2,
            },
            landingContent: {
                landMainTitleFont: this.state.landMainTitleFont,
                landMainTitleFontColor: this.state.landMainTitleFontColor,
                landSubTitleFont: this.state.landSubTitleFont,
                landSubTitleFontColor: this.state.landSubTitleFontColor,
                landButtonFont: this.state.landButtonFont,
                landButtonFontColor: this.state.landButtonFontColor,
                landButtonColor: this.state.landButtonColor,
                landText: this.state.landText,
                img3: this.state.img3
            }
        }
        console.log(doc)
        if (doc.activityName == "") {
            notification.error({
                message: `活动名称未填写`,
            })
            return
        }
        if (doc.whetherLimit == "YES" && (doc.activityAmount == "" || doc.activityAmount <= 0)) {
            notification.error({
                message: `用户数量填写不正确`,
            })
            return
        }
        if (doc.title == "") {
            notification.error({
                message: `分享主标题未填写`,
            })
            return
        }
        if (this.state.selectBookList.length == 0) {
            notification.error({
                message: `活动图书未添加`,
            })
            return
        }
        if (doc.subTitle == "") {
            notification.error({
                message: `分享副标题未填写`,
            })
            return
        }
        if (doc.startTime == "") {
            notification.error({
                message: `开始时间未填写`,
            })
            return
        }

        if (doc.endTime == "") {
            notification.error({
                message: `结束时间未填写`,
            })
            return
        }
        if (CompareDate(doc.startTime, doc.endTime)) {
            notification.error({
                message: `时间设置不正确`,
            })
            return
        }
        if (doc.isForceShare == "YES" && doc.forceShareDesc == "") {
            notification.error({
                message: `分享设置不正确`,
            })
            return
        }
        if (doc.indexContent.img1 == "" && doc.isForceShare == "YES") {
            notification.error({
                message: `微信分享图片未上传`,
            })
            return
        }
        if (doc.indexContent.img2 == "") {
            notification.error({
                message: `领书界面背景图未上传`,
            })
            return
        }
        if (doc.landingContent.img3 == "") {
            notification.error({
                message: `落地页背景图未上传`,
            })
            return
        }
        // TODO:传页面
        // var formData = new FormData();

        // var htmlGroup = {
        console.log(encodeURIComponent(Html.indexFn(this.state.img2)))
        console.log(this.state.indexFont, this.state.indexFontColor, this.state.indexButtonColor, this.state.img2, this.state.title, this.state.subTitle, this.state.img1);
        var index = [
            this.state.indexFont,
            this.state.indexFontColor,
            this.state.indexButtonColor,
            this.state.img2,
            this.state.title,
            this.state.subTitle,
            this.state.img1,
            this.state.isForceShare,
            createCode,                 //TODO:活动编码
        ]
        var landing = [
            this.state.title,
            this.state.landMainTitleFont,
            this.state.landMainTitleFontColor,
            this.state.landSubTitleFont,
            this.state.landSubTitleFontColor,
            this.state.landButtonFont,
            this.state.landButtonFontColor,
            this.state.landButtonColor,
            this.state.landText,
            this.state.img3,
            this.state.img1,
            this.state.subTitle,
        ]
        let activityCode = ope == "add" ? createCode : this.state.activityCode,
            //TODO:首页

            indexHtml = encodeURIComponent(encodeURIComponent(Html.indexFn(...index))),
            // TODO:落地页
            landingHtml = encodeURIComponent(encodeURIComponent(Html.landingFn(...landing)));
        // }
        // formData.append('pictureStream', "file_" + Date.parse(new Date()) + ".png");
        var htmlres = await fetch(getUrl.upLoadTemH5, {
            mode: "cors",
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: "activityCode=" + activityCode + "&indexHtml=" + indexHtml + "&landingHtml=" + landingHtml + commonData.dataString
        }).then(res => res.json());

        console.log({ "htmlres": htmlres });
        if (htmlres.status != 1) {
            notification.error({
                message: `页面生成出现错误`,
            })
            return
        }
        // return;
        //TODO:传数据
        var data = await fetch(getUrl.url, {
            mode: "cors",
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: "method=ella.operation.sendBook.createOrUpdateSendBookActivity" + "&content=" + JSON.stringify(doc) + commonData.dataString
        }).then(res => res.json());
        console.log(data);
        if (data.status == 1) {
            notification.success({
                message: `${this.props.params.ope == "add" ? "增加" : "编辑"}成功`,
            });
            if(this.props.params.ope == "add"){
                 window.history.back();
            }
           
            return
        } else {
            notification.success({
                message: `${this.props.params.ope == "add" ? "增加" : "编辑"}失败`,
            });
            return
        }
    }
    ///////////////////////////////文本图片上传////////////////////////////////////////////
    render() {
        console.log(this.getSelectBookCodeList())
        console.log(this.state)
        //提交图片
        const { previewVisible, previewImage, fileList, previewVisible2, previewImage2, fileList2, previewVisible3, previewImage3, fileList3 } = this.state;
        const uploadButton = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        return <Spin tip="数据加载中..." spinning={this.props.params.ope == "add" ? false : this.state.spinning}>
            <div id="opeH5activity">
                <p className="title"><Link style={{ color: "black" }} to="/h5activity" ><Icon type="left" />{this.props.params.ope == "add" ? "添加" : "编辑"}H5赠书活动</Link></p>
                <div className="h5_box">
                    <Row className="h5_Row">
                        <Col className="item_title" offset={1} span={2}><span>活动名称:</span></Col>
                        <Col span={6}><Input value={this.state.activityName} onChange={(e) => { this.setOneKV("activityName", e.target.value) }} placeholder="请输入活动名称" /></Col>
                        <Col className="item_title" offset={1} span={2}><span>用户数量:</span></Col>
                        <Col span={5}><InputNumber disabled={this.state.whetherLimit} value={this.state.whetherLimit ? '' : this.state.activityAmount} onChange={(value) => { this.setOneKV("activityAmount", value) }} placeholder={this.state.whetherLimit ? '' : "请输入用户数量"} /></Col>
                        <Col className="item_title" offset={1} span={4}><Checkbox checked={this.state.whetherLimit} onChange={(e) => { this.setOneKV("whetherLimit", e.target.checked) }} >不限量</Checkbox></Col>
                    </Row>
                    <Row className="h5_Row">
                        <Col className="item_title" offset={1} span={2}><span className="item_title">分享主标题:</span></Col>
                        <Col span={6}><Input value={this.state.title} onChange={(e) => { this.setOneKV("title", e.target.value) }} placeholder="请输入分享主标题" /></Col>
                        <Col className="item_title" offset={1} span={2}><span className="item_title">分享副标题:</span></Col>
                        <Col span={6}><Input value={this.state.subTitle} onChange={(e) => { this.setOneKV("subTitle", e.target.value) }} placeholder="请输入分享副标题" /></Col>
                    </Row>
                    <Row className="h5_Row">
                        <Col className="item_title" offset={1} span={2}><span className="item_title">添加图书:</span></Col>
                        {/* <Col span={4}><Button><Icon type="search" />搜索图书</Button></Col> */}
                        {/* TODO:搜索书籍 */}
                        <Col span={6}>
                            <Select
                                mode="multiple"
                                style={{ width: '100%' }}
                                tokenSeparators={[',']}
                                onChange={(v) => { this.setOneKV("selectBookList", v) }}
                                onSearch={(v) => { this.fetchSearchBookList(v) }}
                                value={this.state.selectBookList}
                                placeholder="搜索并选择数据"
                            >
                                {
                                    // [<Option key="1234">123(show)</Option>, <Option key="12345">123(show)</Option>]
                                    this.state.searchBookList.map(item => {
                                        return <Option key={item.bookName}>{item.bookName}</Option>
                                    })
                                }
                            </Select>
                        </Col>
                        <Col className="item_title" offset={1} span={2}><span>赠书数量:</span></Col>
                        <Col span={6}><InputNumber value={this.state.selectBookList.length} disabled placeholder="请输入赠书数量" /></Col>
                    </Row>
                    <Row>

                    </Row>
                    <Row className="h5_Row">
                        <Col className="item_title" offset={1} span={2}>
                            <span>开始时间:</span>
                        </Col>
                        <Col span={6}>
                            <DatePicker
                                style={{ width: "100%" }}
                                showTime={{ format: 'HH:mm:ss' }}
                                format="YYYY-MM-DD HH:mm:ss"
                                placeholder={['请输入开始时间']}
                                onChange={(value, dateString) => { this.setOneKV("startTime", dateString) }}
                                value={this.state.startTime ? moment(this.state.startTime, 'YYYY-MM-DD HH:mm:ss') : this.state.startTime}
                            />
                        </Col>
                        <Col className="item_title" offset={1} span={2}>
                            <span>结束时间:</span>
                        </Col>
                        <Col span={6}>
                            <DatePicker
                                style={{ width: "100%" }}
                                showTime={{ format: 'HH:mm:ss' }}
                                format="YYYY-MM-DD HH:mm:ss"
                                placeholder={['请输入结束时间']}
                                onChange={(value, dateString) => { this.setOneKV("endTime", dateString) }}
                                value={this.state.endTime ? moment(this.state.endTime, 'YYYY-MM-DD HH:mm:ss') : this.state.endTime}
                            />
                        </Col>
                    </Row>
                    <Row className="h5_Row">
                        <Col className="item_title" offset={1} span={2}>
                            <span>分享设置:</span>
                        </Col>
                        <Col span={20}>
                            <RadioGroup onChange={(e) => { this.setOneKV("isForceShare", e.target.value) }} value={this.state.isForceShare}>
                                <Radio value={false}>无强制分享</Radio>
                                <Radio value={true}>
                                    强制分享&nbsp;
                                {/* TODO:分享框影藏了 */}
                                    {/* <Input style={{ opacity: this.state.isForceShare ? '1' : '0' }} onChange={(e) => { this.setOneKV("forceShareDesc", e.target.value) }} value={this.state.isForceShare ? this.state.forceShareDesc : ""} /> */}
                                    <Input style={{ opacity: this.state.isForceShare ? '0' : '0' }} onChange={(e) => { this.setOneKV("forceShareDesc", e.target.value) }} value={this.state.isForceShare ? this.state.forceShareDesc : ""} />
                                </Radio>
                            </RadioGroup>
                        </Col>
                    </Row>
                    <Row className="h5_Row">
                        <Col className="item_title" offset={1} span={2}>
                            <span>添加分享小图:</span>
                        </Col>
                        <Col span={4}>
                            <div className="clearfix">
                                <Upload
                                    action="//jsonplaceholder.typicode.com/posts/"
                                    listType="picture-card"
                                    fileList={fileList}
                                    onPreview={(file) => { this.handlePreview(file, "previewImage", "previewVisible") }}
                                    onChange={({ fileList }) => { this.handleChange({ fileList }, "fileList", "img1") }}
                                    onRemove={() => { this.setState({ img1: "" }) }}
                                >
                                    {fileList.length >= 1 ? null : uploadButton}
                                </Upload>
                                <Modal visible={previewVisible} footer={null} onCancel={() => { this.handleCancel("previewVisible") }}>
                                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                                </Modal>
                            </div>
                        </Col>
                    </Row>
                    <Divider>领书界面</Divider>
                    <Row>
                        <Col className="showHtml" span={6} offset={1}>
                            <H5Index styleCss={{ display: false, indexFont: this.state.indexFont, indexFontColor: this.state.indexFontColor, indexButtonColor: this.state.indexButtonColor, imgSrc: this.state.img2 }} ></H5Index>
                        </Col>
                        <Col span={10}>
                            <h2 style={{ fontWeight: "blod" }}>领书界面:</h2>
                            <Row className="h5_Row">
                                <Col span={5}>
                                    <span>添加背景UI:</span>
                                </Col>
                                <Col span={8}>
                                    <div className="clearfix">
                                        <Upload
                                            action="//jsonplaceholder.typicode.com/posts/"
                                            listType="picture-card"
                                            fileList={fileList2}
                                            onPreview={(file) => { this.handlePreview(file, "previewImage2", "previewVisible2") }}
                                            onChange={({ fileList }) => { this.handleChange({ fileList }, "fileList2", "img2") }}
                                            onRemove={() => { this.setState({ img2: "" }) }}
                                        >
                                            {fileList2.length >= 1 ? null : uploadButton}
                                        </Upload>
                                        <Modal visible={previewVisible2} footer={null} onCancel={() => { this.handleCancel("previewVisible2") }}>
                                            <img alt="example" style={{ width: '100%' }} src={previewImage2} />
                                        </Modal>
                                    </div>
                                </Col>
                            </Row>
                            <Row className="h5_Row">
                                <Col span={5}>
                                    <span>添加按钮文字:</span>
                                </Col>
                                <Col span={7}>
                                    <Input value={this.state.indexFont} onChange={(e) => { this.setOneKV("indexFont", e.target.value) }} />
                                </Col>
                                <Col span={4} offset={1}>
                                    <span>文字颜色:</span>
                                </Col>
                                <Col span={7}>
                                    <Input value={this.state.indexFontColor} onChange={(e) => { this.setOneKV("indexFontColor", e.target.value) }} />
                                </Col>
                            </Row>
                            <Row className="h5_Row">
                                <Col span={5}>
                                    <span>添加按钮颜色:</span>
                                </Col>
                                <Col span={7}>
                                    <Input value={this.state.indexButtonColor} onChange={(e) => { this.setOneKV("indexButtonColor", e.target.value) }} />
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Divider>落地页面</Divider>
                    <Row>
                        <Col className="showHtml" span={6} offset={1}>
                            <H5Index styleCss={
                                {
                                    display: true,
                                    indexFont: this.state.landButtonFont,
                                    indexFontColor: this.state.landButtonFontColor,
                                    indexButtonColor: this.state.landButtonColor,
                                    imgSrc: this.state.img3,
                                    landMainTitleFont: this.state.landMainTitleFont,
                                    landMainTitleFontColor: this.state.landMainTitleFontColor,
                                    landSubTitleFont: this.state.landSubTitleFont,
                                    landSubTitleFontColor: this.state.landSubTitleFontColor,
                                    landText: this.state.landText
                                }
                            }></H5Index>
                        </Col>
                        <Col span={10}>
                            <h2 style={{ fontWeight: "blod" }}>落地页面:</h2>
                            <Row className="h5_Row">
                                <Col span={5}>
                                    <span>添加背景UI:</span>
                                </Col>
                                <Col span={8}>
                                    <div className="clearfix">
                                        <Upload
                                            action="//jsonplaceholder.typicode.com/posts/"
                                            listType="picture-card"
                                            fileList={fileList3}
                                            onPreview={(file) => { this.handlePreview(file, "previewImage3", "previewVisible3") }}
                                            onChange={({ fileList }) => { this.handleChange({ fileList }, "fileList3", "img3") }}
                                            onRemove={() => { this.setState({ img3: "" }) }}
                                        >
                                            {fileList3.length >= 1 ? null : uploadButton}
                                        </Upload>
                                        <Modal visible={previewVisible3} footer={null} onCancel={() => { this.handleCancel("previewVisible3") }}>
                                            <img alt="example" style={{ width: '100%' }} src={previewImage3} />
                                        </Modal>
                                    </div>
                                </Col>
                            </Row>
                            <Row className="h5_Row">
                                <Col span={5}>
                                    <span>添加主标题文字:</span>
                                </Col>
                                <Col span={7}>
                                    <Input value={this.state.landMainTitleFont} onChange={(e) => { this.setOneKV("landMainTitleFont", e.target.value) }} />
                                </Col>
                                <Col span={4} offset={1}>
                                    <span>文字颜色:</span>
                                </Col>
                                <Col span={7}>
                                    <Input value={this.state.landMainTitleFontColor} onChange={(e) => { this.setOneKV("landMainTitleFontColor", e.target.value) }} />
                                </Col>
                            </Row>
                            <Row className="h5_Row">
                                <Col span={5}>
                                    <span>添加副标题文字:</span>
                                </Col>
                                <Col span={7}>
                                    <Input value={this.state.landSubTitleFont} onChange={(e) => { this.setOneKV("landSubTitleFont", e.target.value) }} />
                                </Col>
                                <Col span={4} offset={1}>
                                    <span>文字颜色:</span>
                                </Col>
                                <Col span={7}>
                                    <Input value={this.state.landSubTitleFontColor} onChange={(e) => { this.setOneKV("landSubTitleFontColor", e.target.value) }} />
                                </Col>
                            </Row>
                            <Row className="h5_Row">
                                <Col span={5}>
                                    <span>添加按钮文字:</span>
                                </Col>
                                <Col span={7}>
                                    <Input value={this.state.landButtonFont} onChange={(e) => { this.setOneKV("landButtonFont", e.target.value) }} />
                                </Col>
                                <Col span={4} offset={1}>
                                    <span>文字颜色:</span>
                                </Col>
                                <Col span={7}>
                                    <Input value={this.state.landButtonFontColor} onChange={(e) => { this.setOneKV("landButtonFontColor", e.target.value) }} />
                                </Col>
                            </Row>
                            <Row>
                                <Col span={5}>
                                    <span>添加按钮颜色:</span>
                                </Col>
                                <Col span={7}>
                                    <Input value={this.state.landButtonColor} onChange={(e) => { this.setOneKV("landButtonColor", e.target.value) }} />
                                </Col>
                                <Col span={4} offset={1}>
                                    <span>固定文案颜色:</span>
                                </Col>
                                <Col span={7}>
                                    <Input value={this.state.landText} onChange={(e) => { this.setOneKV("landText", e.target.value) }} />
                                </Col>
                            </Row>
                        </Col>
                    </Row>

                    <Row style={{ padding: "20px 0px", textAlign: "center" }}>
                        <Button
                            type="primary"
                            onClick={() => {
                                // this.submitData(this.props.params.ope);
                                this.showConfirm(this.props.params.ope);
                            }}
                        >保存</Button>
                    </Row>
                </div>
            </div>
        </Spin>
    }
}