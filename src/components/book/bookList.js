import React from 'react'
import { Spin, Progress, Pagination, message, Select, DatePicker, Icon, Button, Input, Row, Col, Table, Cascader, Modal, Upload, Popover } from 'antd';
const Search = Input.Search;
import { Link } from 'react-router';
import moment from 'moment';
import 'antd/dist/antd.css';
import './bookList.css';
const confirm = Modal.confirm;
var util = require('../util.js');
import $ from "jquery";
import SendBook from "./sendBook.js";
import { dataString } from '../commonData.js'
const { RangePicker } = DatePicker;
// var OSS = require('ali-oss');
function onChange(value, dateString) {
    console.log('Selected Time: ', value);
    console.log('Formatted Selected Time: ', dateString);
}
function onOk(value) {
    console.log('onOk: ', value);
}

export default class bookList extends React.Component {
    constructor() {
        super()
        this.state = {
            versionData: [],         //资源版本号列表
            isCopyright: true,
            copyrightData: {
                copyrightValidityStart: '',//版权开始时间
                copyrightValidityEnd: '', //版权结束时间    
                copyrightStatus: '', //版权状态
                versionNumber: '',//版本号
                versionUpdateTime: '',//更新时间
            },

            tableData: [],
            pageMax: 0,
            pageLength: '',
            pageVo: {
                page: '0',
                pageSize: '20'
            },
            current: 1,
            loading: false,
            loading2: false,
            loading3: false,
            videoInfor: 0,
            videoWord: '',
            videoPrecentShow: false,
            videoPrecent: 0,
            videoStates: "active",
            //出版社
            publishList: [],
            //阅读模式
            bookMode: [],
            //领域
            bookDomainClassList: [{
                domainCode: '',
                domainName: '',
                parentCode: '',
            }],
            bookSecondClassList: [{
                domainCode: '',
                domainName: '',
            }],
            copyrightValidity:'',
            book_version_validity:[],//版权有效期
            book_is_prize:[],//图书大奖
            bookPrize:'',
            firstValue: true,

            //年级
            bookGradeList: [],
            //百科分类
            bookWikiClassList: [],
            //主题分类
            bookTopicClassList: [],
            //语言类型
            bookLanguageList: [],
            //获奖情况
            bookPrizeList: [],
            //会员借阅
            bookVip: [],
            //状态
            bookStatus: [],
            //价格
            goodsPriceList: [],
            //运营工具图书列表搜索框搜索类型
            operationBookSearch: [],

            options: [{
                value: 'zhejiang',
                label: 'Zhejiang',
                children: [{
                    value: 'hangzhou',
                    label: 'Hangzhou',
                }]
            }, {
                value: 'jiangsu',
                label: 'Jiangsu',
                children: [{
                    value: 'nanjing',
                    label: 'Nanjing',
                }]
            }],


            //搜索
            book: {
                bookSeriesName: '',
                bookCode: '',
                language: '',
                bookEndAge: '',
                bookName: '',
                isVip: '',
                bookMode: '',
                bookStartAge: '',
                bookPublish: '',
                bookStatus: ''
            },
            bookGradeRelation: {
                gradeCode: ""
            },
            bookWikiRelation: {
                wikiCode: ""
            },
            bookTopicRelation: {
                classCode: ""
            },
            bookPrizeRelation: {
                prizeCode: ""
            },
            goods: {
                goodsSrcPrice: ""
            },
            bookDomainRelation: {
                domainCode: ''
            },
            firstBookDomainRelation: {
                domainCode: ''
            },
            createBeginTime: "",
            createEndTime: "",
            updateBeginTime: "",
            updateEndTime: "",
            searchContent: "",
            searchBoxType: "BOOK_NAME",

            //视频
            videoVisible: false,

            fileList: [],
            videoSrc: "",
            searchFlag: false,
            selectDU: "down",

            videoSoruce: "",
            bookCodes: "",
            videoEditONew: 0,
            videoName: "",

            sendShow: false,

        };
        this.pageChangeFun = this.pageChangeFun.bind(this);
        this.pageSizeFun = this.pageSizeFun.bind(this);
        this.selectSet = this.selectSet.bind(this);
        this.onSelectChange = this.onSelectChange.bind(this);
    }

    pageChangeFun(pageNum) {
        console.log(pageNum);
        this.setState({
            pageVo: {
                ...this.state.pageVo,
                page: pageNum - 1,
            },
            current: pageNum
        }, () => {
            this.bookListFn(this.state.bookPrize,this.state.copyrightValidity,this.state.book, this.state.goods, this.state.bookTopicRelation, this.state.bookWikiRelation, this.state.bookDomainRelation, this.state.bookPrizeRelation, this.state.bookGradeRelation, this.state.pageVo, this.state.searchBoxType, this.state.createBeginTime, this.state.createEndTime, this.state.updateBeginTime, this.state.updateEndTime);
        });
    }

    pageSizeFun(current, pageSize) {
        console.log(current, pageSize);
        this.setState({
            pageVo: {
                pageSize: pageSize,
                page: current - 1,
            },
            current: current
        }, () => {
            this.bookListFn(this.state.bookPrize,this.state.copyrightValidity,this.state.book, this.state.goods, this.state.bookTopicRelation, this.state.bookWikiRelation, this.state.bookDomainRelation, this.state.bookPrizeRelation, this.state.bookGradeRelation, this.state.pageVo, this.state.searchBoxType, this.state.createBeginTime, this.state.createEndTime, this.state.updateBeginTime, this.state.updateEndTime);
        });
    }

    ellaReaderFn(bookCode, bookName, bookResource, bookModeResource, value) {
        console.log(value);
        console.log(bookCode);

        console.log("------封面------");
        console.log(bookResource);
        console.log("------图书------");
        console.log(bookModeResource);

        let url1 = "", url2 = "";	//url1  封面资源；   url2 图书资源
        if (value == "iphonex") {
            for (let i = 0; i < bookResource.length; i++) {
                if (bookResource[i].resource.toLowerCase() == "iphone2208") {		//封面
                    url1 = bookResource[i].ossUrl;
                }
            }
            for (let j = 0; j < bookModeResource.length; j++) {
                if (bookModeResource[j].resource.toLowerCase() == "iphone2208") {		//预览视频
                    url2 = bookModeResource[j].ossUrl;
                }
            }
        } else {
            for (let i = 0; i < bookResource.length; i++) {
                if (bookResource[i].resource.toLowerCase() == "normal") {
                    url1 = bookResource[i].ossUrl;
                }
            }
            for (let i = 0; i < bookModeResource.length; i++) {
                if (bookModeResource[i].resource.toLowerCase() == "normal") {
                    url2 = bookModeResource[i].ossUrl;
                }
            }
        }

        if (localStorage.getItem("ellaReader") && localStorage.getItem("ellaReader") != null) {


            console.log("-------------------");
            console.log(bookCode);
            console.log(bookName);
            console.log(url1);
            console.log(url2);
            console.log(value);

            window.openReader(bookCode, bookName, url2, value);
        } else {
            window.loadReader();
            localStorage.setItem("ellaReader", "true");
        }
    }

    componentDidMount() {
        // message.warning('阅读器已经更新,如果无法预览请点击右侧按钮!下载新版本阅读器并安装');
        this.bookListFn('','','', '', '', '', '', '', '', this.state.pageVo, '', '', '', '', '');
        this.bookResultItem('operation.box.searchBookDropDownBoxes', 'AUTO_BOX', '');
        console.log(localStorage.getItem("ellaReader"));
        this.fetchVersonData();
    }
    // 获取版本
    async fetchVersonData() {
        var versionData = await fetch(util.url, {
            mode: "cors",
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },

            body: "method=ella.operation.getVersionNumberAndVersionUpdateTiem" + "&content=" + JSON.stringify({})+dataString

        }).then(res => res.json());
        this.setState({
            versionData: versionData.data
        })
    }

    //获取版权信息
    async fetchCopyrightData(bookCode) {
        var copyrightData = await fetch(util.url, {
            mode: "cors",
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: "method=ella.operation.getCopyrightStatusAndCopyrightValidity" + "&content=" + JSON.stringify({
                bookCode

            })+dataString

        }).then(res => res.json());
        console.log(copyrightData);
        this.setState({
            copyrightData: copyrightData.data,
            isCopyright: false
        })
    }
    //版权上下架
    async changeCopyright(method, bookCode, copyrightStatus) {
        this.setState({
            isCopyright: true
        })
        var data = await fetch(util.url, {
            mode: "cors",
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },

            body: "method=" + method + "&content=" + JSON.stringify({ bookCode, copyrightStatus })+dataString

        }).then(res => res.json());
        console.log(data);
        if (data.status == 1) {
            this.fetchCopyrightData(bookCode);
        }
    }

    async bookResultItem(groupId, type, listStr) {
        var data = await fetch(util.url, {
            mode: "cors",
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: "method=ella.operation.boxSearchList" + "&content=" + JSON.stringify({ "groupId": groupId, "type": type }) + dataString
        }).then(res => res.json())
        console.log(data.data);
        this.setState({
            [listStr]: data.data,
            book_is_prize:data.data.book_is_prize?data.data.book_is_prize:[],
            book_version_validity:data.data.book_version_validity?data.data.book_version_validity:[],
        }, () => {
            console.log(this.state);
        })
    }

    async bookListFn(bookPrize,copyrightValidity,book, goods, bookTopicRelation, bookWikiRelation, bookDomainRelation, bookPrizeRelation, bookGradeRelation, pageVo, searchBoxType, createBeginTime, createEndTime, updateBeginTime, updateEndTime) {
        console.log(pageVo)
        this.setState({
            loading: true
        });
        var data = await fetch(util.url, {
            mode: "cors",
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: "method=ella.operation.searchBookByConditions" + "&content=" + JSON.stringify({"bookPrize":bookPrize,"copyrightValidity":copyrightValidity,"book": book, "goods": goods, "bookTopicRelation": bookTopicRelation, "bookWikiRelation": bookWikiRelation, "bookDomainRelation": bookDomainRelation, "bookPrizeRelation": bookPrizeRelation, "bookGradeRelation": bookGradeRelation, "pageVo": pageVo, "searchBoxType": searchBoxType, "createBeginTime": createBeginTime, "createEndTime": createEndTime, "updateBeginTime": updateBeginTime, "updateEndTime": updateEndTime, }) + dataString
        }).then(res => res.json())
            .then((d) => {
                console.log(d);
                const datalist = [];
                var list = d.data.bookList;
                if (d.data.total == 0) {
                    var str = document.getElementsByClassName('m-pagination-box')[0];
                    str.style.display = 'none';
                } else {
                    var str = document.getElementsByClassName('m-pagination-box')[0];
                    str.style.display = 'block';
                }
                for (let i = 0; i < list.length; i++) {
                    datalist.push({
                        bookCode: (list[i].bookCode == '' || list[i].bookCode == null) ? '-' : list[i].bookCode,
                        bookModeResourceList: (list[i].bookModeResourceList == '' || list[i].bookModeResourceList == null) ? '-' : list[i].bookModeResourceList,
                        bookName: (list[i].bookName == '' || list[i].bookName == null) ? '-' : list[i].bookName,
                        pressName: (list[i].pressName == '' || list[i].pressName == null) ? '-' : list[i].pressName,
                        bookPages: (list[i].bookPages == '' || list[i].bookPages == null) ? '-' : list[i].bookPages,
                        bookPreviewResourceCount: list[i].bookPreviewResourceCount,
                        bookResourceList: (list[i].bookResourceList == '' || list[i].bookResourceList == null) ? '-' : list[i].bookResourceList,
                        bookTeachingModeResourceCount: list[i].bookTeachingModeResourceCount,
                        businessTruename: (list[i].businessTruename == '' || list[i].businessTruename == null) ? '-' : list[i].businessTruename,
                        createTime: (list[i].createTime == '' || list[i].createTime == null) ? '-' : list[i].createTime,
                        goodsPublishTime: (list[i].goodsPublishTime == '' || list[i].goodsPublishTime == null) ? '-' : list[i].goodsPublishTime,
                        goodsState: (list[i].goodsState == '' || list[i].goodsState == null) ? '-' : list[i].goodsState,
                        homeStatus: (list[i].homeStatus == '' || list[i].homeStatus == null) ? '-' : list[i].homeStatus,
                        updateTime: (list[i].updateTime == '' || list[i].updateTime == null) ? '-' : list[i].updateTime,
                    })
                }

                this.setState({
                    tableData: datalist,
                    loading: false,
                    pageMax: d.data.total,
                    current:d.data.currentPage,
                    pageLength: d.data.bookList.length,
                }, () => {
                    console.log(this.state.tableData);
                });
            })

    }

    async deleteFn(bookCode, str) {
        var w = this;
        var data = await fetch(util.url, {
            mode: "cors",
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: "method=ella.operation.delBookByBookCode" + "&content=" + JSON.stringify({ "bookCode": bookCode, "isOffRelationGoods": str }) + dataString
        }).then(res => res.json())
            .then((d) => {
                console.log(d);
                w.setState({
                    loading: false
                })
                if (d.status == '1') {
                    w.bookListFn(this.state.book, this.state.goods, this.state.bookTopicRelation, this.state.bookWikiRelation, this.state.bookDomainRelation, this.state.bookPrizeRelation, this.state.bookGradeRelation, this.state.pageVo, this.state.searchBoxType, this.state.createBeginTime, this.state.createEndTime, this.state.updateBeginTime, this.state.updateEndTime);
                } else if (d.code == '2000010009') {
                    const confirm = Modal.confirm;
                    const bookPage = [];
                    for (let i = 0; i < d.data.length; i++) {
                        bookPage.push(
                            d.data[i].goodsName
                        )
                    }
                    console.log(bookPage);
                    confirm({
                        title: '该图书已添加至' + bookPage.join('、') + '图书包中',
                        content: '删除会导致图书包异常，是否确认删除',
                        okType: 'primary',
                        onOk() {
                            w.setState({
                                loading: true
                            })
                            w.deleteFn(bookCode, 'YES');
                        },
                        onCancel() { },
                    })
                }
            })
    }

    //获取视频的URL的
    async videoFn(bookCode) {
        var w = this;
        var data = await fetch(util.url, {
            mode: "cors",
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: "method=ella.operation.getPreviewResourceList" + "&content=" + JSON.stringify({
                "bookCode": bookCode,
                "bookPreviewResource": {
                    "resource": "normal",
                    "resourceType": "PREVIEW_VIDEO"
                },
            }) + dataString
        }).then(res => res.json())
            .then((d) => {
                console.log(d);
                if (d.data.length > 0) {
                    w.setState({
                        videoSrc: d.data[0].ossUrl,
                        bookCodes: bookCode,
                        videoID: d.data[0].id
                    })
                } else {
                    w.setState({
                        videoSrc: '',
                        bookCodes: bookCode,
                        videoID: ''
                    })
                }
            })
    }

    focus = (name, type, listStr) => {
        console.log(name, type, listStr);
        this.bookResultItem(name, type, listStr);
    };

    query() {
        var w = this;
        console.log(w.state.firstValue);
        this.setState({
            pageVo:{
                ...this.state.pageVo,
                page:'0'
            }
        },()=>{
            if (w.state.bookDomainRelation.domainCode == '' && w.state.firstValue == false) {
                message.error('请选择子领域');
            } else {
                w.bookListFn(w.state.bookPrize,w.state.copyrightValidity,w.state.book, w.state.goods, w.state.bookTopicRelation, w.state.bookWikiRelation, w.state.bookDomainRelation, w.state.bookPrizeRelation, w.state.bookGradeRelation, w.state.pageVo, w.state.searchBoxType, w.state.createBeginTime, w.state.createEndTime, w.state.updateBeginTime, w.state.updateEndTime);
            }
        })


    }

    bookPublishChange(str, value) {
        this.setState({
            book: {
                ...this.state.book,
                bookPublish: value
            }
        })
    }
    bookModeChange(str, value) {
        console.log(value);
        this.setState({
            book: {
                ...this.state.book,
                bookMode: value
            }
        })
    }
    bookGradeRelationChange(str, value) {
        this.setState({
            bookGradeRelation: {
                gradeCode: value
            }
        })
    }
    bookWikiRelationChange(str, value) {
        this.setState({
            bookWikiRelation: {
                wikiCode: value
            }
        }, () => {
            console.log(this.state.bookWikiRelation);
        })
    }
    bookTopicRelationChange(str, value) {
        console.log(str, value);
        this.setState({
            bookTopicRelation: {
                classCode: value
            }
        }, () => {
            console.log(this.state.bookTopicRelation);
        })
    }
    languageChange(str, value) {
        this.setState({
            book: {
                ...this.state.book,
                language: value
            }
        })
    }
    bookPrizeRelationChange(str, value) {
        this.setState({
            bookPrizeRelation: {
                prizeCode: value
            }
        })
    }
    /*领域*/
    bookDomainRelationChange(str, value) {
        console.log(value);
        if (value == '06') {
            this.setState({
                bookDomainRelation: {
                    domainCode: value,
                },
                firstBookDomainRelation: {
                    domainCode: value
                },
            })
            var select = document.getElementsByClassName('u-second-select')[0];
            select.style.display = 'none';
        } else {
            $('.u-second-select .ant-select-selection-selected-value').text('');
            $('.u-second-select .ant-select-selection-selected-value').attr('title', '');
            const secondeList = [];
            var list = this.state.bookDomainClassList;
            for (let i = 0; i < list.length; i++) {
                if (list[i].parentCode == value) {
                    secondeList.push({
                        domainCode: list[i].domainCode,
                        domainName: list[i].domainName
                    })
                }
            }
            this.setState({
                bookDomainRelation: {
                    domainCode: ''
                },
                firstBookDomainRelation: {
                    domainCode: value
                },
                bookSecondClassList: secondeList,
                firstValue: false
            }, () => {

            })
            var select = document.getElementsByClassName('u-second-select')[0];
            select.style.display = 'inline-block';
            select.style.marginLeft = '10px';
        }
    }
    bookSecondChange(str, value) {
        this.setState({
            bookDomainRelation: {
                domainCode: value
            },
            firstValue: true
        })
    }
    /*领域*/
    isVipChange(str, value) {
        this.setState({
            book: {
                ...this.state.book,
                isVip: value
            }
        })
    }
    bookStatusChange(str, value) {
        this.setState({
            book: {
                ...this.state.book,
                bookStatus: value
            }
        })
    }
    goodsChange(str, value) {
        this.setState({
            goods: {
                goodsSrcPrice: value
            }
        })
    }
    bookStartAgeChange(name, value) {
        console.log(name, value);
        this.setState({
            book: {
                ...this.state.book,
                bookStartAge: value,
            }
        })
    }
    bookEndAgeChange(name, value) {
        console.log(name, value);
        this.setState({
            book: {
                ...this.state.book,
                bookEndAge: value
            }
        })
    }
    createBeginTime(value, dateString, str) {
        console.log(value, dateString, str);
        this.setState({
            createBeginTime: dateString
        })
    }
    createEndTime(value, dateString, str) {
        console.log(value, dateString, str);
        this.setState({
            createEndTime: dateString
        })
    }
    updateBeginTime(value, dateString, str) {
        console.log(value, dateString, str);
        this.setState({
            updateBeginTime: dateString
        })
    }
    updateEndTime(value, dateString, str) {
        console.log(value, dateString, str);
        this.setState({
            updateEndTime: dateString
        })
    }
    searchChange(str, value) {
        console.log(str, value);
        this.setState({
            searchBoxType: value
        })
    }
    searchContent(name, value) {
        console.log(name, value);
        if (this.state.searchBoxType == '' || this.state.searchBoxType == null && (value != "" || value != null)) {
            this.setState({
                book: {
                    ...this.state.book,
                    bookName: value
                }
            }, () => {
                //                  if(this.state.searchBoxType=='BOOK_NAME' && (value=='' || value==null)){
                //                      message.error('请输入图书名称');
                //                  }else{
                this.bookListFn(this.state.bookPrize,this.state.copyrightValidity,this.state.book, this.state.goods, this.state.bookTopicRelation, this.state.bookWikiRelation, '', this.state.bookPrizeRelation, this.state.bookGradeRelation, this.state.pageVo, "BOOK_NAME", this.state.createBeginTime, this.state.createEndTime, this.state.updateBeginTime, this.state.updateEndTime);
                //                  }
            })
        } else {
            if (this.state.searchBoxType == 'BOOK_CODE') {
                this.setState({
                    book: {
                        ...this.state.book,
                        bookCode: value
                    }
                }, () => {
                    if (this.state.searchBoxType == 'BOOK_CODE' && (value == '' || value == null)) {
                        message.error('请输入图书编码');
                    } else {
                        this.bookListFn(this.state.bookPrize,this.state.copyrightValidity,this.state.book, this.state.goods, this.state.bookTopicRelation, this.state.bookWikiRelation, '', this.state.bookPrizeRelation, this.state.bookGradeRelation, '', this.state.searchBoxType, this.state.createBeginTime, this.state.createEndTime, this.state.updateBeginTime, this.state.updateEndTime);
                    }
                })
            } else if (this.state.searchBoxType == 'BOOK_NAME') {
                this.setState({
                    book: {
                        ...this.state.book,
                        bookName: value
                    }
                }, () => {
                    //                  if(this.state.searchBoxType=='BOOK_NAME' && (value=='' || value==null)){
                    //                      message.error('请输入图书名称');
                    //                  }else{
                    this.bookListFn(this.state.bookPrize,this.state.copyrightValidity,this.state.book, this.state.goods, this.state.bookTopicRelation, this.state.bookWikiRelation, '', this.state.bookPrizeRelation, this.state.bookGradeRelation, this.state.pageVo, this.state.searchBoxType, this.state.createBeginTime, this.state.createEndTime, this.state.updateBeginTime, this.state.updateEndTime);
                    //                  }
                })
            } else if (this.state.searchBoxType == 'BOOK_SERIES_NAME') {
                this.setState({
                    book: {
                        ...this.state.book,
                        bookSeriesName: value
                    }
                }, () => {
                    if (this.state.searchBoxType == 'BOOK_SERIES_NAME' && (value == '' || value == null)) {
                        message.error('请输入系列名称');
                    } else {
                        this.bookListFn(this.state.bookPrize,this.state.copyrightValidity,this.state.book, this.state.goods, this.state.bookTopicRelation, this.state.bookWikiRelation, '', this.state.bookPrizeRelation, this.state.bookGradeRelation, this.state.pageVo, this.state.searchBoxType, this.state.createBeginTime, this.state.createEndTime, this.state.updateBeginTime, this.state.updateEndTime);
                    }
                })
            }
        }
    }

    deleteList(key) {
        var w = this;
        console.log(key);
        confirm({
            title: '确定删除此条数据吗？',
            content: '一旦删除将不可恢复！',
            onOk() {
                w.setState({
                    loading: true
                })
                w.deleteFn(key, 'NO');
            },
            onCancel() { },
        })
    }

    addVideo = (key, videoLive) => {
        this.setState({
            videoVisible: true,
            videoEditONew: videoLive,
            videoName: ''
        });
        this.videoFn(key)
    }
    changeVideo = (key) => {
        this.setState({
            videoVisible: false,
            videoPrecentShow: false
        });
    }
    //设置更多搜索条件的
    selectSet() {
        if (this.state.selectDU == "down") {
            this.setState({
                searchFlag: true,
                selectDU: "up"
            })
        } else if (this.state.selectDU == "up") {
            this.setState({
                searchFlag: false,
                selectDU: "down"
            })
        }

    }

    //上传视频
    upVideo(e) {
        var thisTrue = this;

        console.log(e);
        console.log(e.target.files[0]);

        //js 的formData函数，append方法写两个参数，直接生成json的对象，已表单的形式。这个现在都这么传，但是他不能和别的参数一起用，只能写一个FormData
        var formData = new FormData();
        formData.append('file', e.target.files[0]);
        formData.append('purposeId', "BOOK_PREVIEW_RESOURCE");
        formData.append('bookCode', this.state.bookCodes);

        console.log("--------------------");
        console.log(thisTrue.state.bookCodes);
        console.log(formData);
        console.log(e.target.files[0].name);
        var videoNames = e.target.files[0].name;


        thisTrue.setState({
            videoPrecent: 0,
            videoPrecentShow: true
        });

        fetch(util.upLoadVideoUrl, {
            method: "POST",
            mode: 'cors',
            body: formData      //修改去掉了日志信息
        })
            .then(function (response) {
                console.log(response);
                return response.json();
            })
            .then(function (response) {
                console.log(response);

                if (response.status == "1") {
                    thisTrue.setState({
                        videoSrc: response.data,
                        videoName: videoNames,
                        videoWord: '上传成功',
                        videoInfor: 1,
                        videoStates: 'active',
                        videoPrecent: 100
                    });
                    window.clearInterval(theTimeJi);
                } else {
                    thisTrue.setState({
                        videoSrc: '',
                        videoName: '',
                        videoWord: response.message,
                        videoInfor: 2,
                        videoStates: 'exception'
                    });
                }

                setTimeout(function () {
                    thisTrue.setState({
                        videoInfor: 0
                    });
                }, 2000)

            })

        //获取视频上传百分比
        let a = 0;
        let theTimeJi = window.setInterval(function () {
            a++;
            if (a >= 100) {
                window.clearInterval(theTimeJi);
            }
            if (thisTrue.state.videoStates == 'exception') {
                window.clearInterval(theTimeJi);
            }
            thisTrue.setState({
                videoPrecent: a
            });
        }, 500);




    }

    //保存路径
    saveVideoSource() {
        var thisTrue = this;
        console.log(thisTrue.state.videoEditONew);

        console.log(thisTrue.state.videoSrc);

        if (thisTrue.state.videoSrc == null || thisTrue.state.videoSrc == "") {
            thisTrue.setState({
                videoInfor: 3
            });

            setTimeout(function () {
                thisTrue.setState({
                    videoInfor: 0
                });
            }, 2000)
        }

        //这里区别一下   上传
        if (thisTrue.state.videoEditONew == 0 && thisTrue.state.videoSrc != null && thisTrue.state.videoSrc != "") {
            fetch(util.url, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: "method=ella.operation.insertBookPreviewResource" + "&content=" + JSON.stringify({
                    "bookCode": thisTrue.state.bookCodes,
                    "bookPreviewResource": {
                        "ossUrl": thisTrue.state.videoSrc,
                        "resourceType": "PREVIEW_VIDEO",
                    }
                }) + dataString //加上了日志信息
            })
                .then(function (response) {
                    console.log(response);
                    return response.json();
                })
                .then(function (response) {
                    console.log(response);

                    if (response.status == "1") {
                        thisTrue.setState({
                            videoInfor: 1,
                            videoWord: '保存成功',
                        });
                        setTimeout(function () {
                            thisTrue.setState({
                                videoInfor: 0,
                                loading: false,
                                videoVisible: false,
                                videoEditONew: 1,
                                videoPrecentShow: false
                            });
                            thisTrue.bookListFn(this.state.bookPrize,thisTrue.state.copyrightValidity,thisTrue.state.book, thisTrue.state.goods, thisTrue.state.bookTopicRelation, thisTrue.state.bookWikiRelation, thisTrue.state.bookDomainRelation, thisTrue.state.bookPrizeRelation, thisTrue.state.bookGradeRelation, thisTrue.state.pageVo, thisTrue.state.searchBoxType, thisTrue.state.createBeginTime, thisTrue.state.createEndTime, thisTrue.state.updateBeginTime, thisTrue.state.updateEndTime);
                        }, 900)
                    } else {
                        thisTrue.setState({
                            videoInfor: 2,
                            videoWord: '保存失败',
                        });
                        setTimeout(function () {
                            thisTrue.setState({
                                videoInfor: 0
                            });
                        }, 2000)
                    }

                })
        } else if (thisTrue.state.videoEditONew != 0 && thisTrue.state.videoSrc != null && thisTrue.state.videoSrc != "") {
            //更新
            fetch(util.url, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: "method=ella.operation.updateBookPreviewResource" + "&content=" + JSON.stringify({
                    "bookCode": thisTrue.state.bookCodes,
                    "bookPreviewResource": {
                        "ossUrl": thisTrue.state.videoSrc,
                        "resourceType": "PREVIEW_VIDEO",
                        "id": thisTrue.state.videoID
                    }
                }) + dataString //加上了日志信息
            })
                .then(function (response) {
                    console.log(response);
                    return response.json();
                })
                .then(function (response) {
                    console.log(response);

                    if (response.status == "1") {
                        thisTrue.setState({
                            videoInfor: 1,
                            videoWord: '保存成功',
                        });
                        setTimeout(function () {
                            thisTrue.setState({
                                videoInfor: 0,
                                loading: false,
                                videoVisible: false,
                                videoPrecentShow: false
                            });
                            thisTrue.bookListFn(thisTrue.state.bookPrize,thisTrue.state.copyrightValidity,thisTrue.state.book, thisTrue.state.goods, thisTrue.state.bookTopicRelation, thisTrue.state.bookWikiRelation, thisTrue.state.bookDomainRelation, thisTrue.state.bookPrizeRelation, thisTrue.state.bookGradeRelation, thisTrue.state.pageVo, thisTrue.state.searchBoxType, thisTrue.state.createBeginTime, thisTrue.state.createEndTime, thisTrue.state.updateBeginTime, thisTrue.state.updateEndTime);
                        }, 900)
                    } else {
                        thisTrue.setState({
                            videoInfor: 2,
                            videoWord: '保存失败',
                        });
                        setTimeout(function () {
                            thisTrue.setState({
                                videoInfor: 0
                            });
                        }, 2000)
                    }
                })
        }
    }

    onSelectChange(selectedRowKeys) {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({ selectedRowKeys });
    }
    onSelect(selectedRowKeys) {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({ selectedRowKeys });
    }


    sendShow() {
        this.setState({
            sendShow: true
        });
    }

    sendCansole() {
        this.setState({
            sendShow: false
        });
        this.bookListFn(this.state.bookPrize,this.state.copyrightValidity,this.state.book, this.state.goods, this.state.bookTopicRelation, this.state.bookWikiRelation, this.state.bookDomainRelation, this.state.bookPrizeRelation, this.state.bookGradeRelation, this.state.pageVo, this.state.searchBoxType, this.state.createBeginTime, this.state.createEndTime, this.state.updateBeginTime, this.state.updateEndTime);
    }

    conslSend(code, a) {
        console.log(code);
        console.log(a);
        let thisTrue = this;
        let newArr = [code];

        this.setState({
            loading: true
        });

        fetch(util.url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: "method=ella.operation.updateHomeStatus" + "&content=" + JSON.stringify({
                "homeStatus": "NO",
                "bookCodeList": newArr

            })+dataString

        })
            .then(function (response) {
                console.log(response);
                return response.json();
            })
            .then(function (response) {
                console.log(response);
                if (response.status == "1") {
                    message.success("取消推送成功");
                    thisTrue.setState({
                        loading: false
                    });
                    thisTrue.bookListFn(thisTrue.state.bookPrize,thisTrue.state.copyrightValidity,thisTrue.state.book, thisTrue.state.goods, thisTrue.state.bookTopicRelation, thisTrue.state.bookWikiRelation, thisTrue.state.bookDomainRelation, thisTrue.state.bookPrizeRelation, thisTrue.state.bookGradeRelation, thisTrue.state.pageVo, thisTrue.state.searchBoxType, thisTrue.state.createBeginTime, thisTrue.state.createEndTime, thisTrue.state.updateBeginTime, thisTrue.state.updateEndTime);
                } else {
                    message.success("取消推送失败");
                    thisTrue.setState({
                        loading: false
                    });
                }
            })
    }

    clearSelect() {
        this.setState({
            book: {
                bookSeriesName: '',
                bookCode: '',
                language: '',
                bookEndAge: '',
                bookName: '',
                isVip: '',
                bookMode: '',
                bookStartAge: '',
                bookPublish: '',
                bookStatus: ''
            },
            bookDomainRelation: {
                domainCode: ''
            },
            firstBookDomainRelation: {
                domainCode: ''
            },
            bookGradeRelation: {
                gradeCode: ''
            },
            bookWikiRelation: {
                wikiCode: ''
            },
            bookTopicRelation: {
                classCode: ''
            },
            bookPrizeRelation: {
                prizeCode: ''
            },
            goods: {
                goodsSrcPrice: ''
            },
            copyrightValidity:'',
            bookPrize:'',
            createBeginTime: "",
            createEndTime: "",
            updateBeginTime: "",
            updateEndTime: "",
        })
    }


    render() {
        window.loadReader = function () {
            window.location.href = "http://download.ellabook.cn/EllaPicLib/%E5%92%BF%E5%95%A6%E9%A2%84%E8%A7%88%E5%B7%A5%E5%85%B7.exe";
        }
        window.openReader = function (bookCode, bookName, bookModeResource, value) {
            window.location.href = "EllaPreview:|" + bookCode + "," + bookName + "," + bookModeResource + "," + value + "";
        }
        let w = this;
        const columns = [
            {
                title: '图书名称',
                dataIndex: 'bookName',
                width:"9%",
                bookList,
                className:'td_hide',
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
            },
            {
                title: '出版社',
                dataIndex: 'businessTruename',
                width: "9%",
                className:'td_hide',
                render: (text, record) =>{
                    return(
                        <Popover
                            placement="top"
                            title={null}
                            content={
                                record.businessTruename
                            }
                        >
                            <span>{record.businessTruename}</span>
                        </Popover>
                    )
                }
            },
            {
                title: '出版社别名',
                dataIndex: 'pressName',
                width: "7%",
                className:'td_hide',
                render: (text, record) =>{
                    return(
                        <Popover
                            placement="top"
                            title={null}
                            content={
                                record.pressName
                            }
                        >
                            <span>{record.pressName}</span>
                        </Popover>
                    )
                }
            },
            {
                title: 'bookId',
                dataIndex: 'bookCode',
                width: "9%"
            },
            {
                title: '上传时间',
                dataIndex: 'createTime',
                width: "9%"
            },
            {
                title: '修改时间',
                dataIndex: 'updateTime',
                width: "9%"
            },
            {
                title: '版权操作',
                dataIndex: 'copyright',
                width: "9%",
                render: (text, record) => {
                    return <Popover
                        placement="rightTop"
                        title={
                            <span>版权操作</span>
                        }
                        content={
                            <Spin spinning={this.state.isCopyright}>
                                <div style={{ width: '500px' }}>
                                    <Row className='poverRow'>
                                        <Col className='colTitle' span={6}>
                                            版权有效期:
                                        </Col>
                                        <Col span={17}>
                                            <RangePicker
                                                disabled
                                                value={[
                                                    this.state.copyrightData.copyrightValidityStart ? moment(this.state.copyrightData.copyrightValidityStart, 'YYYY-MM-DD') : '',
                                                    this.state.copyrightData.copyrightValidityEnd ? moment(this.state.copyrightData.copyrightValidityEnd, 'YYYY-MM-DD') : ''
                                                ]}
                                            />
                                        </Col>
                                    </Row>
                                    <Row className='poverRow'>
                                        <Col className='colTitle' span={6}>
                                            版权状态:
                                        </Col>
                                        <Col style={{ textAlign: 'center' }} className='colTitle' span={17}>
                                            {
                                                this.state.copyrightData.copyrightStatus == 'SHELVES_ON' ? '已上架' : '已下架'
                                            }
                                        </Col>
                                    </Row>
                                    <Row className='poverRow'>
                                        <Col className='colTitle' span={6}>
                                            版权操作:
                                        </Col>
                                        <Col style={{ textAlign: 'center' }} className='colTitle' span={17}>
                                            <Button type="danger" onClick={() => {
                                                if (this.state.copyrightData.copyrightStatus == 'SHELVES_ON') {
                                                    this.changeCopyright('ella.operation.copyrightShelvesFlagBelow', record.bookCode, 'SHELVES_OFF');
                                                } else {
                                                    this.changeCopyright('ella.operation.copyrightShelvesFlagUp', record.bookCode, 'SHELVES_ON');
                                                }
                                            }}>
                                                {
                                                    this.state.copyrightData.copyrightStatus == 'SHELVES_ON' ? '下架' : '上架'
                                                }
                                            </Button>
                                        </Col>
                                    </Row>
                                </div>
                            </Spin>
                        }
                        trigger="click">
                        <Icon
                            style={{ fontSize: '24px' }}
                            type="profile"
                            onClick={() => { this.fetchCopyrightData(record.bookCode) }}
                        />
                    </Popover>
                }
            },
            {
                title: '推送家园',
                dataIndex: 'homeStatus',
                width: "8%",
                render(text, record) {
                    return (
                        <span>
                            {record.homeStatus == "YES" ? <span onClick={() => w.conslSend(record.bookCode, record.homeStatus)} style={{ color: "#1890FF", cursor: "pointer" }}>取消推送</span> : <span>未推送</span>}
                        </span>
                    )
                }
            },
            {
                title: '教学模式',
                dataIndex: 'teacher',
                width: "7%",
                render(text, record) {
                    return (
                        <div data-page="teach">
                            <Link to={"/getTeachingMode/" + record.bookCode + '/' + record.bookPages + '/' + record.bookName} target="_blank">
                                {record.bookTeachingModeResourceCount == 0 ? '添加' : '编辑'}
                            </Link>
                        </div>
                    )
                }
            }, {
                title: '视频',
                dataIndex: 'video',
                width: 60,
                render(text, record) {
                    return (
                        <div>
                            <a onClick={() => w.addVideo(record.bookCode, record.bookPreviewResourceCount)}>{record.bookPreviewResourceCount == 0 ? '添加' : '编辑'}</a>
                        </div>
                    )
                }
            }, {
                title: '操作',
                dataIndex: 'orderStatus',
                width: "15%",
                render(text, record) {
                    return (
                        <div data-page="editBooks">
                            <Link target="_blank" style={{ paddingRight: 4 }} to={"/editBook?bookCode=" + record.bookCode + ""}> 编辑 </Link>
                            <Select
                                style={{ width: 80, height: 25, fontSize: 12 }}
                                placeholder="预览"
                                onChange={(value) => { w.ellaReaderFn(record.bookCode, record.bookName, record.bookResourceList, record.bookModeResourceList, value) }}
                                dropdownStyle={{ fontSize: 12, width: 80 }}
                                className="yuLan"
                            >
                                <Option value="iphone">iPhone6</Option>
                                <Option value="iphonex">iPhoneX</Option>
                                <Option value="ipad">iPad</Option>
                                <Option value="pc">PC</Option>
                            </Select>


                            {
//                          	<a style={{ paddingLeft: 4 }} onClick={() => w.deleteList(record.bookCode)}> 删除 </a>
                            }
                        </div>
                    )
                }
            }];
        return (
            <div className="g-bookList">
                <p className="m-head">图书列表</p>
                <div className="g-book-table">
                    <div className="intervalBottom">

                        <Select defaultValue="BOOK_NAME" className="selectWidth intervalRight" onChange={(value) => this.searchChange("searchBoxType", value)}>
                            {/* <Option value="">全部</Option> */}
                            <Option value="BOOK_CODE">图书编码</Option>
                            <Option value="BOOK_NAME">图书名称</Option>
                            <Option value="BOOK_SERIES_NAME">系列名称</Option>
                        </Select>

                        <Search
                            placeholder="搜索"
                            enterButton
                            className="searchWidth intervalRight"
                            onSearch={(value) => {
                                this.setState({
                                    current: 1
                                })
                                this.searchContent("searchContent", value)
                            }}
                            onChange={(e) => {
                                // TODO:每次改变搜索内容的时候页码恢复起始页
                                this.setState({
                                    pageVo: {
                                        page: '',
                                        pageSize: '20'
                                    }
                                })
                            }} />

                        <Button className="block u-btn-green buttonWidth intervalRight" onClick={this.selectSet}>更多条件 <Icon type={this.state.selectDU} /></Button>
                        <Button className="block u-btn-green buttonWidth intervalRight" onClick={() => this.sendShow()}>批量推送图书 </Button>
                        <Button className="block u-btn-green buttonWidth" onClick={() => { window.loadReader() }}>下载预览工具</Button>
                    </div>

                    <div className="m-book-bd" style={{ height: this.state.searchFlag ? "auto" : 0 }}>
                        <div className="intervalBottom">
                            <div className="part">
                                <span className="u-txt">出版社:</span>
                                <Select value={this.state.book.bookPublish} className="selectWidth" onChange={(value) => this.bookPublishChange("bookPublish", value)} onFocus={(value) => this.focus("operation.box.publishList", "AUTO_BOX", "publishList")}>
                                    <Option value=''>全部</Option>
                                    {
                                        this.state.publishList.map(function (item) {
                                            return <Option value={item.uid}>{item.businessTruename}</Option>
                                        })
                                    }
                                </Select>
                            </div>
                            <div className="part">
                                <span className="u-txt">阅读模式:</span>
                                <Select value={this.state.book.bookMode} className="selectWidth" onChange={(value) => this.bookModeChange("bookMode", value)} onFocus={(value) => this.focus("BOOK_MODE", "HAND_BOX", "bookMode")}>
                                    <Option value=''>全部</Option>
                                    {
                                        this.state.bookMode.map(function (item) {
                                            return <Option value={item.searchCode}>{item.searchName}</Option>
                                        })
                                    }
                                </Select>
                            </div>
                            <div className="part">
                                <span className="u-txt">领域:</span>
                                <Select value={this.state.firstBookDomainRelation.domainCode} className="selectWidth" onChange={(value) => this.bookDomainRelationChange("bookDomainClassList", value)} onFocus={(value) => this.focus("operation.box.bookDomainClassList", "AUTO_BOX", "bookDomainClassList")}>
                                    <Option value=''>全部</Option>
                                    <Option value="01">健康</Option>
                                    <Option value="02">语言</Option>
                                    <Option value="03">社会</Option>
                                    <Option value="04">科学</Option>
                                    <Option value="05">艺术</Option>
                                    <Option value="06">全领域</Option>
                                    {/*{*/}
                                    {/*this.state.bookDomainClassList.map(function (item) {*/}
                                    {/*return item.parentCode=='0'?<Option value={item.domainCode}>{item.domainName}</Option>:''*/}
                                    {/*})*/}
                                    {/*}*/}
                                </Select>
                                <span className="u-second-select " style={{ display: 'none' }}>
	                                <Select value={this.state.bookDomainRelation.domainCode} className="selectWidth" onChange={(value) => this.bookSecondChange("bookSecondClassList", value)}>
	                                    <Option value=''>全部</Option>
                                        {
                                            this.state.bookSecondClassList.map(function (item) {
                                                return <Option value={item.domainCode}>{item.domainName}</Option>
                                            })
                                        }
	                                </Select>
                            	</span>
                            </div>
                            <div className="part">
                                <span className="u-txt">年级:</span>
                                <Select value={this.state.bookGradeRelation.gradeCode} className="selectWidth" onChange={(value) => this.bookGradeRelationChange("time", value)} onFocus={(value) => this.focus("operation.box.bookGradeList", "AUTO_BOX", "bookGradeList")}>
                                    <Option value=''>全部</Option>
                                    {
                                        this.state.bookGradeList.map(function (item) {
                                            return item.parentCode == '0' ? '' : <Option value={item.gradeCode}>{item.gradeName}</Option>
                                            // return <Option value={item.gradeCode}>{item.parentCode!='0'?item.gradeName:}</Option>
                                        })
                                    }
                                </Select>
                            </div>
                            <div className="part">
                                <span className="u-txt">百科分类:</span>
                                <Select value={this.state.bookWikiRelation.wikiCode} className="selectWidth" onChange={(value) => this.bookWikiRelationChange("bookWikiRelation", value)} onFocus={(value) => this.focus("operation.box.bookWikiClassList", "AUTO_BOX", "bookWikiClassList")}>
                                    <Option value=''>全部</Option>
                                    {
                                        this.state.bookWikiClassList.map(function (item) {
                                            return <Option value={item.wikiCode}>{item.wikiName}</Option>
                                        })
                                    }
                                </Select>
                            </div>
                            <div className="part">
                                <span className="u-txt">适龄:</span>
                                <Input type='number' value={this.state.book.bookStartAge} style={{ width: "100px" }} onChange={(e) => { this.bookStartAgeChange("bookStartAge", e.target.value) }} />
                                <i> — </i>
                                <Input type='number' value={this.state.book.bookEndAge} style={{ width: "100px" }} onChange={(e) => { this.bookEndAgeChange("bookEndAge", e.target.value) }} />
                            </div>
                            <div className="part">
                                <span className="u-txt">主题分类:</span>
                                <Select value={this.state.bookTopicRelation.classCode} className="selectWidth" onChange={(value) => this.bookTopicRelationChange("bookTopicRelation", value)} onFocus={(value) => this.focus("operation.box.bookTopicClassList", "AUTO_BOX", "bookTopicClassList")}>
                                    <Option value=''>全部</Option>
                                    {
                                        this.state.bookTopicClassList.map(function (item) {
                                            return <Option value={item.classCode}>{item.className}</Option>
                                        })
                                    }
                                </Select>
                            </div>
                            <div className="part">
                                <span className="u-txt">语言类型:</span>
                                <Select value={this.state.book.language} className="selectWidth" onChange={(value) => this.languageChange("language", value)} onFocus={(value) => this.focus("BOOK_LANGUAGE", "HAND_BOX", "bookLanguageList")}>
                                    <Option value=''>全部</Option>
                                    {
                                        this.state.bookLanguageList.map(function (item) {
                                            return <Option value={item.searchCode}>{item.searchName}</Option>
                                        })
                                    }
                                </Select>
                            </div>
                            <div className="part">
                                <span className="u-txt">上传时间:</span>
                                <DatePicker
                                    style={{ width: "140px" }}
                                    format="YYYY-MM-DD"
                                    placeholder={['开始时间']}
                                    onChange={(value, dateString) => { this.createBeginTime(value, dateString, "createBeginTime") }}
                                    onOk={onOk}
                                    value={this.state.createBeginTime != '' ? moment(this.state.createBeginTime, 'YYYY-MM-DD') : null}
                                />
                                <i> — </i>
                                <DatePicker
                                    style={{ width: "140px" }}
                                    format="YYYY-MM-DD"
                                    placeholder={['结束时间']}
                                    onChange={(value, dateString) => { this.createEndTime(value, dateString, "createEndTime") }}
                                    onOk={onOk}
                                    value={this.state.createEndTime != '' ? moment(this.state.createEndTime, 'YYYY-MM-DD') : null}
                                />
                            </div>
                            <div className="part">
                                <span className="u-txt">获奖情况:</span>
                                <Select value={this.state.bookPrize} className="selectWidth" onChange={(value) => this.setState({"bookPrize":value})} onFocus={(value) =>this.bookResultItem('operation.box.searchBookDropDownBoxes', 'AUTO_BOX', '')}>
                                    <Option value=''>全部</Option>
                                    {
                                        this.state.book_is_prize.map(function (item) {
                                            return <Option value={item.searchCode}>{item.searchCode=="PRIZE_NO"?"未获奖":"已获奖"}</Option>
                                        })
                                    }
                                </Select>
                            </div>
                            <div className="part">
                                <span className="u-txt">会员借阅:</span>
                                <Select value={this.state.book.isVip} className="selectWidth" onChange={(value) => this.isVipChange("isVip", value)} onFocus={(value) => this.focus("BOOK_IS_VIP", "HAND_BOX", "bookVip")}>
                                    <Option value=''>全部</Option>
                                    {
                                        this.state.bookVip.map(function (item) {
                                            return <Option value={item.searchCode}>{item.searchName}</Option>
                                        })
                                    }
                                </Select>
                            </div>
                            <div className="part">
                                <span className="u-txt">修改时间:</span>
                                <DatePicker
                                    style={{ width: "140px" }}
                                    format="YYYY-MM-DD"
                                    placeholder={['开始时间']}
                                    onChange={(value, dateString) => { this.updateBeginTime(value, dateString, "updateBeginTime") }}
                                    value={this.state.updateBeginTime != '' ? moment(this.state.updateBeginTime, 'YYYY/MM/DD') : null}
                                />
                                <i> — </i>
                                <DatePicker
                                    style={{ width: "140px" }}
                                    format="YYYY-MM-DD"
                                    placeholder={['结束时间']}
                                    onChange={(value, dateString) => { this.updateEndTime(value, dateString, "updateEndTime") }}
                                    value={this.state.updateEndTime != '' ? moment(this.state.updateEndTime, 'YYYY/MM/DD') : null}
                                />
                            </div>
                            <div className="part">
                                <span className="u-txt">价格:</span>
                                <Select value={this.state.goods.goodsSrcPrice} className="selectWidth" onChange={(value) => this.goodsChange("goods", value)} onFocus={(value) => this.focus("GOODS_SRC_PRICE", "HAND_BOX", "goodsPriceList")}>
                                    <Option value=''>全部</Option>
                                    {
                                        this.state.goodsPriceList.map(function (item) {
                                            return <Option value={item.searchName}>{item.searchName == '0.01' ? '免费' : item.searchName == '-1' ? '其他' : item.searchName}</Option>
                                        })
                                    }
                                </Select>
                            </div>
                            <div className="part">
                                <span className="u-txt">版权有效期:</span>
                                <Select value={this.state.copyrightValidity} className="selectWidth" onChange={(value) => this.setState({"copyrightValidity":value})} onFocus={(value) =>this.bookResultItem('operation.box.searchBookDropDownBoxes', 'AUTO_BOX', '')}>
                                    <Option value=''>全部</Option>
                                    {
                                        this.state.book_version_validity.map(function (item) {
                                            return <Option value={item.searchCode}>{item.searchCode}</Option>
                                        })
                                    }
                                </Select>
                            </div>
                            <div className="interalBottom">
                                <Button className="u-btn-green block intervalRight" onClick={this.query.bind(this)}>查询</Button>
                                <Button className="u-btn-green block" onClick={() => this.clearSelect()}>恢复默认</Button>
                            </div>
                        </div>
                    </div>

                    <Modal
                        title="视频"
                        visible={w.state.videoVisible}
                        onOk={() => w.saveVideoSource()}
                        onCancel={() => w.changeVideo()}
                        okText="保存"
                        cancelText="取消"
                    >
                        <Input value={this.state.videoSrc} style={{ width: 320, marginRight: '20px' }} />

                        {w.state.videoVisible && <div className="videoUploadBtn" style={{ width: 80, marginTop: -52, marginLeft: 365, cursor: 'pointer' }}>
                            <input style={{ opacity: 0, marginLeft: 0, position: 'relative', top: 25, cursor: 'pointer' }} type="file" name="video" id="videos" onChange={(e) => { this.upVideo(e) }} accept="video/*" />
                            <p><Icon type="upload" />　　上传</p>
                        </div>}


                        {w.state.videoPrecentShow && <Progress percent={w.state.videoPrecent} status={w.state.videoStates} />}


                        {w.state.videoVisible && <p>
                            {this.state.videoName}
                        </p>}

                        {w.state.videoInfor == 1 && <div className="videoInfors">
                            <Icon type="check-circle" style={{ color: "#52C41A" }} />
                            {w.state.videoWord}
                        </div>}

                        {w.state.videoInfor == 2 && <div className="videoInfors">
                            <Icon type="close-circle" style={{ color: "#F5222D" }} />
                            {w.state.videoWord}
                        </div>}
                        {w.state.videoInfor == 3 && <div className="videoInfors1">
                            <Icon type="exclamation-circle" style={{ color: "#F5222D" }} />
                            请先上传视频
                        </div>}
                    </Modal>

                    <Spin tip="加载中..." spinning={this.state.loading} size="large" style={{ zIndex: 9999 }}>
                        <Table className="m-book-table t-nm-tab" columns={columns} dataSource={this.state.tableData} bordered pagination={false} scroll={{ y: ((this.state.pageLength > 15) ? 600:0) }} />
                    </Spin>
                    <div className="m-pagination-box">
                        <Pagination pageSizeOptions={['20', '40', '60', '80', '100']} showSizeChanger showQuickJumper showTotal={total => `共 ${total} 条`} className="m-pagination" defaultPageSize={20} defaultCurrent={1} current={this.state.current} total={this.state.pageMax} onChange={this.pageChangeFun} onShowSizeChange={this.pageSizeFun} />
                    </div>

                    <Modal
                        title="图书推送"
                        visible={w.state.sendShow}
                        onOk={() => w.sendCansole()}
                        onCancel={() => w.sendCansole()}
                        width="1000"
                        footer={null}
                        closable
                        okText=""
                        cancelText=""
                    >
                        <Spin tip="加载中..." spinning={this.state.loading3} size="normal" style={{ zIndex: 99999 }}>
                            {w.state.sendShow && <SendBook></SendBook>}
                        </Spin>
                    </Modal>
                </div>
            </div>
        )
    }
}