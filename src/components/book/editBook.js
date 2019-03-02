import React from 'react'
import { Spin, Form, message, Select, DatePicker, Icon, Button, Input, Row, Col, Table, Checkbox, Upload, Modal, Radio, Tag, Mention, InputNumber } from 'antd';
import { dataString } from '../commonData.js'
const CheckboxGroup = Checkbox.Group;
const FormItem = Form.Item
const ButtonGroup = Button.Group;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { CheckableTag } = Tag;
const { TextArea } = Input;
const { toString, toContentState } = Mention;
const confirm = Modal.confirm;
import { Link } from 'react-router';
import 'antd/dist/antd.css';
import './editBook.css';
var util = require('../util.js');
import $ from "jquery"
import SawImgDetail from "./sawImgDetail.js"
import UpLoadImg from "./upLoadImg.js"

const users = ['afc163', 'benjycui', 'yiminghe', 'jljsj33', 'dqaria', 'RaoHai'];
export default class editBooks extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            checked: false,
            loading: false,
            authorLoading: false,
            bookCode:'',
            book: {										//图书基本信息
                bookSeriesName: "",
                bookCode: "",
                language: "",
                bookEndAge: "",
                bookName: "",
                isVip: "",
                bookPages: "",
                tags: "",
                pinyin: "",
                bookIntroduction: "",
                bookMode: "",
                bookStartAge: "",
                bookPublish: "",
                bookLanguages:""
            },
            goods: {									//价格
                goodsMarketprice: "",
                goodsSrcPrice: ""
            },
            //年级
            bookGradeList:[],
            //出版社
            publishList: [],

            //图书封面
            bookResourceList: [],
            //图书截图
            bookPreviewResourceList: [],

            //故事作者
            suggestions: [],

            bookAuthorRelationList: [],
            bookAuthorRelationList1: [],

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

            tags: [],
            bookModeList: [],							//阅读模式
            GradeList: [],								//年级
            DomainList: "",								//领域
            WikiList: "",								//百科分类
            TopicList: "",								//主题分类
            PrizeList: [],								//获奖情况
            bookSecondList:"",							//领域
            zhutiFlag: false,

            bookSearchList: [],
            bookSearchList1: [],
            allList: [],
            allList1: [],
            bookSelectList: [],
            bookSelectList1: [],
            
            saveAuthorArr:"",
            saveAuthorArr1:"",
            saveAuthorArr2:"",
            
            imgSrc:"",
            tagsValue:'',

        }
        this.closeImage = this.closeImage.bind(this);
        this.imgChangeFn = this.imgChangeFn.bind(this);
    }

    componentDidMount() {
        var search = window.location.href;
        var bookCode = search.split('?bookCode=')[1].split('&_k=')[0];
        this.state = {
            bookCode: bookCode
        };
        this.bookResultItem("operation.box.publishList", "AUTO_BOX", "publishList");
        this.fetchEditBook();
        this.bookResultItem('BOOK_MODE', 'HAND_BOX', 'bookMode');
        this.bookResultItem('operation.box.bookWikiClassList', 'AUTO_BOX', 'bookWikiClassList');

        this.bookResultItem('BOOK_LANGUAGE', 'HAND_BOX', 'bookLanguageList');
        this.bookResultItem('operation.box.bookPrizeList', 'AUTO_BOX', 'bookPrizeList');

        this.searchBookTagsList('', 5, 'getBookTagsList');
    }
    
    //获取图书信息
    async fetchEditBook() {
        this.setState({
            loading: true
        });
        var data = await fetch(util.url, {
            mode: "cors",
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: "method=ella.operation.getBookInfoAndRelationsInfo" + "&content=" + JSON.stringify({ "bookCode": this.state.bookCode })+dataString
        }).then(res => res.json())
            .then((d) => {
				console.log(d);
                var aaa = this.state.book;
                var bookAuthorList = [];
                for (let i = 0; i < d.data.bookAuthorRelationList.length; i++) {
                    bookAuthorList.push({
                        authorCode: (d.data.bookAuthorRelationList[i].authorCode == '') ? '暂无数据' : d.data.bookAuthorRelationList[i].authorCode,
                        authorName: (d.data.bookAuthorRelationList[i].authorName == '') ? '暂无数据' : d.data.bookAuthorRelationList[i].authorName,
                        authorType: (d.data.bookAuthorRelationList[i].authorType == '') ? '暂无数据' : d.data.bookAuthorRelationList[i].authorType,
                        bookCode: (d.data.bookAuthorRelationList[i].bookCode == '') ? '暂无数据' : d.data.bookAuthorRelationList[i].bookCode,
                    	idx:d.data.bookAuthorRelationList[i].idx
                    })
                }

                /**
                 * 作者信息
                 */
                var ellaAuthor = [
                    [],//0:AUTHOR_ART 美术
                    [],//1:AUTHOR_AUDIO 音频
                    [],//2:AUTHOR_SCRIPT 剧本
                    [],//3:AUTHOR_DESIGN 动画设计（交互动效）
                    [],//4:AUTHOR_REVIEW 审校
                    [],//5:AUTHOR_PAINTING 绘画（原著绘画作者）
                    [],//6:AUTHOR_TEXT 文字 （原著故事作者）
                    [] //7:AUTHOR_TRANSLATION 翻译
                ],
                ellaAuthor2 = [[],[],[],[],[],[],[],[]];

                for (let i = 0; i < d.data.bookAuthorRelationList.length; i++) {
                    var author = d.data.bookAuthorRelationList[i];
                    switch (author.authorType) {
                        case 'AUTHOR_ART':
                            ellaAuthor[0].push(author.authorName);
                            ellaAuthor2[4].push({authorName:author.authorName,authorCode:author.authorCode,authorType:"AUTHOR_ART"});
                            break;
                        case 'AUTHOR_AUDIO':
                            ellaAuthor[1].push(author.authorName);
                            ellaAuthor2[6].push({authorName:author.authorName,authorCode:author.authorCode,authorType:"AUTHOR_AUDIO"});
                            break;
                        case 'AUTHOR_SCRIPT':
                            ellaAuthor[2].push(author.authorName);
                            ellaAuthor2[3].push({authorName:author.authorName,authorCode:author.authorCode,authorType:"AUTHOR_SCRIPT"});
                            break;
                        case 'AUTHOR_DESIGN':
                            ellaAuthor[3].push(author.authorName);
                            ellaAuthor2[5].push({authorName:author.authorName,authorCode:author.authorCode,authorType:"AUTHOR_DESIGN"});
                            break;
                        case 'AUTHOR_REVIEW':
                            ellaAuthor[4].push(author.authorName);
                            ellaAuthor2[7].push({authorName:author.authorName,authorCode:author.authorCode,authorType:"AUTHOR_REVIEW"});
                            break;
                        case 'AUTHOR_PAINTING':
                            ellaAuthor[5].push(author.authorName);
                            ellaAuthor2[1].push({authorName:author.authorName,authorCode:author.authorCode,authorType:"AUTHOR_PAINTING"});
                            break;
                        case 'AUTHOR_TEXT':
                            ellaAuthor[6].push(author.authorName);
                            ellaAuthor2[0].push({authorName:author.authorName,authorCode:author.authorCode,authorType:"AUTHOR_TEXT"});
                            break;
                        case 'AUTHOR_TRANSLATION':
                            ellaAuthor[7].push(author.authorName);
                            ellaAuthor2[2].push({authorName:author.authorName,authorCode:author.authorCode,authorType:"AUTHOR_TRANSLATION"});
                            break;
                    }
                }
                var arr = [];
                var modeArr = [];
                var gradeArr = "";
                var DomainArr = "";
                var WikiArr = "";
                var TopicArr = "";
                var PrizeArr = "";
                var bookSecondArr = "";
                arr = d.data.book.tags.split(',');
                modeArr = d.data.book.bookMode.split(',');
                gradeArr = d.data.bookGradeRelationList?d.data.bookGradeRelationList.map(function (item) {
                    return item.gradeCode
                }) : '';
                
                if (d.data.bookDomainRelationList.length > 0) {
                	if (d.data.bookDomainRelationList[0].parentCode == "0") {
	                	DomainArr = d.data.bookDomainRelationList[0].domainCode;
	                	bookSecondArr = "";
	                } else{
	                	DomainArr = d.data.bookDomainRelationList[0].parentCode;
	                	bookSecondArr = d.data.bookDomainRelationList[0].domainCode;
	                }
                }
                
                WikiArr = d.data.bookWikiRelationList? d.data.bookWikiRelationList.map(function (item) {
                    return item.wikiCode
                }) : '';
                if (d.data.bookTopicRelationList.length > 0) {
                	TopicArr = d.data.bookTopicRelationList[0].classCode;	
                }
                
                
                PrizeArr = d.data.bookPrizeRelationList? d.data.bookPrizeRelationList.map(function (item) {
                    return item.prizeCode
                }) : '';
                
                this.setState({
                    ellaAuthor: ellaAuthor,
                    saveAuthorArr2:ellaAuthor2,			//专门保存作者数据，为保存接口做准备的
                    
                    loading: false,
                    book: {
                        ...this.state.book,
                        bookSeriesName: d.data.book.bookSeriesName,
                        bookName: d.data.book.bookName,
                        bookPages: d.data.book.bookPages,
                        pinyin: d.data.book.pinyin,
                        bookIntroduction: d.data.book.bookIntroduction,
                        bookStartAge: d.data.book.bookStartAge,
                        bookEndAge: d.data.book.bookEndAge,
                        isVip: d.data.book.isVip,
                        tags: d.data.book.tags,
                        bookMode: d.data.book.bookMode,
                        bookPublish: d.data.book.bookPublish,
                        bookLanguages:d.data.book.language,
                    },
                    goods: {
                        goodsMarketprice: d.data.goods.goodsMarketprice,
                        goodsSrcPrice: d.data.goods.goodsSrcPrice,
                    },
                    bookAuthorRelationList: bookAuthorList,
                    bookResourceList: d.data.bookResourceList,
                    bookPreviewResourceList: d.data.bookPreviewResourceList,
					
                    tags: arr,
                    bookModeList: modeArr,
                    GradeList: gradeArr,
                    DomainList: DomainArr,
                    bookSecondList: bookSecondArr,
                    WikiList: WikiArr,
                    TopicList: TopicArr,
                    PrizeList: PrizeArr
                }, () => {
                    this.bookResultItem('operation.box.bookTopicClassList', 'AUTO_BOX', 'bookTopicClassList');
                    this.bookResultItem('operation.box.getOriginalAuthorList', 'AUTO_BOX', 'getOriginalAuthorList');
                    this.bookResultItem('operation.box.getEllaAuthorList', 'AUTO_BOX', 'getEllaAuthorList');
                    this.bookResultItem('operation.box.bookGradeList', 'AUTO_BOX', 'bookGradeList');
                    this.bookResultItem('operation.box.bookDomainClassList', 'AUTO_BOX', 'bookDomainClassList');
                    this.setState({ zhutiFlag: true })
                })
            })
    }

	//获取下拉列表、多选、单选等各种数据的函数
    async bookResultItem(groupId, type, listStr) {
        var w = this;
        var data = await fetch(util.url, {
            mode: "cors",
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: "method=ella.operation.boxSearchList" + "&content=" + JSON.stringify({ "groupId": groupId, "type": type })+dataString
        }).then(res => res.json())
        console.log(data);
        
        //获取咿啦作者
        if (listStr == 'getEllaAuthorList') {
            w.setState({
                allList: data.data,
                saveAuthorArr:data.data,
                bookSearchList: [
                    data.data.map(item => {
                        return <Option value={item.authorName}>{item.authorName}</Option>
                    })
                ],
            })
        }else if (listStr == 'getOriginalAuthorList') {				//获取原著作者
            w.setState({
                allList1: data.data,
                saveAuthorArr1:data.data,
                bookSearchList1: [
                    data.data.map(item => {
                        return <Option value={item.authorName}>{item.authorName}</Option>
                    })
                ],
            })
        }
        
        
        
        if (listStr == 'bookDomainClassList') {
        	//当为全领域时，没有子分类
	        if (w.state.DomainList == 'D201712055OHF5Y') {
	            var select = document.getElementsByClassName('u-second-radio')[0];
	            select.style.display = 'none';
	            w.setState({
	                bookSecondList: "",
	                bookSecondClassList:""
	            })
	        } else {
	            $('.u-second-radio .ant-select-selection-selected-value').text('');
	            $('.u-second-radio .ant-select-selection-selected-value').attr('title', '');
	            const secondeList = [];
	            var list = data.data;
	            for (let i = 0; i < list.length; i++) {
	                if (list[i].parentCode == w.state.DomainList) {
	                    secondeList.push({
	                        domainCode: list[i].domainCode,
	                        domainName: list[i].domainName
	                    })
	                }
	            }
	            w.setState({
	                bookSecondClassList: secondeList,
	            }, () => {
	 				console.log(w.state.bookSecondClassList);
	            })
	            var select = document.getElementsByClassName('u-second-radio')[0];
	            select.style.display = 'block';
	        }
        }
        
        w.setState({
            [listStr]: data.data
        })
    }
	
	//获取图书标签
    async searchBookTagsList(text, limitNum, listStr) {
        var w = this;
        var data = await fetch(util.url, {
            mode: "cors",
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: "method=ella.operation.searchBookTagsListByName" + "&content=" + JSON.stringify({ "text": text, "limitNum": limitNum })+dataString
        }).then(res => res.json())
        console.log(data);
        w.setState({
            [listStr]: data.data
        })
    }

    focus = (name, type, listStr) => {
        console.log(name, type, listStr);
        this.bookResultItem(name, type, listStr);
    };
	
	//关于作者那一坨东西都在这处理
    getEllaAuthorListSearch(v,type) {
        //这里是我要做数据保存的
        var auArr=this.state.saveAuthorArr2,			//他保存图书初始的作者信息
        allAuthorList=this.state.saveAuthorArr,			//他是所有动画书作者列表信息
        allAuthorList1=this.state.saveAuthorArr1,		//他是所有原著作者列表信息
        authorSelect=this.state.bookSearchList,			//来保存咿啦作者下拉框列表的
        authorSelect1=this.state.bookSearchList1;		//来保存原著作者下拉框列表的
        
        
        //这块修改下拉列表的数据
        var  authorNew = 0;
        if (type == "AUTHOR_TEXT" || type == "AUTHOR_PAINTING" || type == "AUTHOR_TRANSLATION") {  
        	for (let x=0;x<v.length;x++) {
        		for (let y=0;y<authorSelect1.length;y++) {
	        		if (authorSelect1[y].authorName == v[x]) {
	        			authorNew = 1;
	        		}
        		}
        		if(authorNew != 1){
	    			authorSelect1[0].push(<Option value={v[x]}>{v[x]}</Option>);
	    		}
        	}
        }else{
        	for (let x=0;x<v.length;x++) {
        		for (let y=0;y<authorSelect.length;y++) {
	        		if (authorSelect[y].authorName == v[x]) {
	        			authorNew = 2;
	        		}
        		}
        		if(authorNew != 2){
	    			authorSelect[0].push(<Option value={v[x]}>{v[x]}</Option>);
	    		}
        	}
        }
        
        
        //将最新作者数据保存
        var addAuthorFlag = [0,0,0,0,0,0,0,0];
        //修改保存
        if (type == 'AUTHOR_TEXT') {
        	auArr[0]=[];
        	for (let x=0;x<v.length;x++) {
        		addAuthorFlag[0] = 0;
        		for (let y=0;y<allAuthorList1.length;y++) {
	        		if (allAuthorList1[y].authorName == v[x]) {
	        			auArr[0].push({authorName:allAuthorList1[y].authorName,authorCode:allAuthorList1[y].authorCode,authorType:"AUTHOR_TEXT"});
	        			addAuthorFlag[0] = 1;
	        		}
        		}
        		if(addAuthorFlag[0] == 0){
        			auArr[0].push({authorName:v[x]},authorCode:'',authorType:"AUTHOR_TEXT");
        		}
        	}
        }else if (type == 'AUTHOR_PAINTING') {
        	auArr[1]=[];
        	for (let x=0;x<v.length;x++) {
        		addAuthorFlag[1] = 0;
        		for (let y=0;y<allAuthorList1.length;y++) {
	        		if (allAuthorList1[y].authorName == v[x]) {
	        			auArr[1].push({authorName:allAuthorList1[y].authorName,authorCode:allAuthorList1[y].authorCode,authorType:"AUTHOR_PAINTING"});
	        			addAuthorFlag[1] = 1;
	        		}
        		}
        		if(addAuthorFlag[1] == 0){
        			auArr[1].push({authorName:v[x],authorCode:'',authorType:"AUTHOR_PAINTING"});
        		}
        	}
        }else if (type == 'AUTHOR_TRANSLATION') {
        	auArr[2]=[];
        	for (let x=0;x<v.length;x++) {
        		addAuthorFlag[2] = 0;
        		for (let y=0;y<allAuthorList1.length;y++) {
	        		if (allAuthorList1[y].authorName == v[x]) {
	        			auArr[2].push({authorName:allAuthorList1[y].authorName,authorCode:allAuthorList1[y].authorCode,authorType:"AUTHOR_TRANSLATION"});
	        			addAuthorFlag[2] = 1;
	        		}
        		}
        		if(addAuthorFlag[2] == 0){
        			auArr[2].push({authorName:v[x],authorCode:'',authorType:"AUTHOR_TRANSLATION"});
        		}
        	}
        }else if (type == 'AUTHOR_SCRIPT') {
        	auArr[3]=[];
        	for (let x=0;x<v.length;x++) {
        		addAuthorFlag[3] = 0;
        		for (let y=0;y<allAuthorList.length;y++) {
	        		if (allAuthorList[y].authorName == v[x]) {
	        			auArr[3].push({authorName:allAuthorList[y].authorName,authorCode:allAuthorList[y].authorCode,authorType:"AUTHOR_SCRIPT"});
	        			addAuthorFlag[3] = 1;
	        		}
        		}
        		if(addAuthorFlag[3] == 0){
        			auArr[3].push({authorName:v[x],authorCode:'',authorType:"AUTHOR_SCRIPT"});
        		}
        	}
        }else if (type == 'AUTHOR_ART') {
        	auArr[4]=[];
        	for (let x=0;x<v.length;x++) {
        		addAuthorFlag[4] = 0;
        		for (let y=0;y<allAuthorList.length;y++) {
	        		if (allAuthorList[y].authorName == v[x]) {
	        			auArr[4].push({authorName:allAuthorList[y].authorName,authorCode:allAuthorList[y].authorCode,authorType:"AUTHOR_ART"});
	        			addAuthorFlag[4] = 1;
	        		}
        		}
        		if(addAuthorFlag[4] == 0){
        			auArr[4].push({authorName:v[x],authorCode:'',authorType:"AUTHOR_ART"});
        		}
        	}
        }else if (type == 'AUTHOR_DESIGN') {
        	auArr[5]=[];
        	for (let x=0;x<v.length;x++) {
        		addAuthorFlag[5] = 0;
        		for (let y=0;y<allAuthorList.length;y++) {
	        		if (allAuthorList[y].authorName == v[x]) {
	        			auArr[5].push({authorName:allAuthorList[y].authorName,authorCode:allAuthorList[y].authorCode,authorType:"AUTHOR_DESIGN"});
	        			addAuthorFlag[5] = 1;
	        		}
        		}
        		if(addAuthorFlag[5] == 0){
        			auArr[5].push({authorName:v[x],authorCode:'',authorType:"AUTHOR_DESIGN"});
        		}
        	}
        }else if (type == 'AUTHOR_AUDIO') {
        	auArr[6]=[];
        	for (let x=0;x<v.length;x++) {
        		addAuthorFlag[6] = 0;
        		for (let y=0;y<allAuthorList.length;y++) {
	        		if (allAuthorList[y].authorName == v[x]) {
	        			auArr[6].push({authorName:allAuthorList[y].authorName,authorCode:allAuthorList[y].authorCode,authorType:"AUTHOR_AUDIO"});
	        			addAuthorFlag[6] = 1;
	        		}
        		}
        		if(addAuthorFlag[6] == 0){
        			auArr[6].push({authorName:v[x],authorCode:'',authorType:"AUTHOR_AUDIO"});
        		}
        	}
        }else if (type == 'AUTHOR_REVIEW') {
        	auArr[7]=[];
        	for (let x=0;x<v.length;x++) {
        		addAuthorFlag[7] = 0;
        		for (let y=0;y<allAuthorList.length;y++) {
	        		if (allAuthorList[y].authorName == v[x]) {
	        			auArr[7].push({authorName:allAuthorList[y].authorName,authorCode:allAuthorList[y].authorCode,authorType:"AUTHOR_REVIEW"});
	        			addAuthorFlag[7] = 1;
	        		}
        		}
        		if(addAuthorFlag[7] == 0){
        			auArr[7].push({authorName:v[x],authorCode:'',authorType:"AUTHOR_REVIEW"});
        		}
        	}
        }
        this.setState({
            saveAuthorArr2: auArr,
            bookSearchList: authorSelect,
            bookSearchList1: authorSelect1,
        })
    }
    setAuthorName(theName){
    	console.log(theName);
    }

    bookNameChange(value) {
        console.log(value);
        this.setState({
            book: {
                ...this.state.book,
                bookName: value
            }
        })
    }
    goodsPriceChange(str, value) {
        console.log(value);
        this.setState({
            goods: {
                ...this.state.goods,
                [str]: value
            }
        })
    }

    isBigEnough(element) {
        // console.log(element);
        // console.log(element.authorType);
        if (element.authorType == 'AUTHOR_ART') {
            return element.authorName;
            console.log(element.authorName);
        } else {
            console.log('qubudao');
        }
        // return element >= 10;
        return element.authorType == 'AUTHOR_AUDIO'
    }

    /*领域radio*/
    radioDomainRelationChange(str, value) {
        console.log(value);
        
        this.setState({
            DomainList: value
        })
        
        //当为全领域时，没有子分类
        if (value == 'D201712055OHF5Y') {
            var select = document.getElementsByClassName('u-second-radio')[0];
            select.style.display = 'none';
        } else {
            $('.u-second-radio .ant-select-selection-selected-value').text('');
            $('.u-second-radio .ant-select-selection-selected-value').attr('title', '');
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
                bookSecondClassList: secondeList,
            }, () => {

            })
            var select = document.getElementsByClassName('u-second-radio')[0];
            select.style.display = 'block';
        }
    }
    bookSecondChange(value) {
    	console.log(value);
        this.setState({
            bookSecondList:value
        })
    }
	//主题分类回调
    radioChange(value) {
        console.log(value);
        this.setState({
            TopicList:value
        })
    }
    
    //出版社回调
    bookPublishChange(value){
    	console.log(value)
    	
    	this.setState({
            book:{
            	...this.state.book,
            	bookPublish:value
            }
        })
    } 
    //阅读模式回调
    readModul(value){
    	console.log(value)
    	this.setState({
            bookModeList:value
        })
    }
    //图书简介回调
    bookScript(e){
    	this.setState({
            book:{
            	...this.state.book,
            	bookIntroduction:e.target.value
            }
        })
    }
    //年级回调
    bookGrade(value){
    	console.log(value)
    	this.setState({
            GradeList:value
        })
    }
    //百科分类回调
    bookClass(value){
    	console.log(value)
    	this.setState({
            WikiList:value
        })
    }
    //语言类型回调
    bookLanguage(e){
    	console.log(e.target.value)
    	this.setState({
    		book:{
    			...this.state.book,
    			bookLanguages:e.target.value
    		}
        })
    }
    
    //获奖状况回调
    bookPrise(value){
    	console.log(value)
    	this.setState({
    		PrizeList:value
        })
    }
    //是否会员回调
    vipRead(e){
    	console.log(e.target.value)
    	this.setState({
    		book:{
    			...this.state.book,
    			isVip:e.target.value
    		}
        })
    }
    //适龄下限回调
    bookAgeSta(e){
    	console.log(e.target.value)
    	this.setState({
    		book:{
    			...this.state.book,
    			bookStartAge:e.target.value
    		}
        })
    }
    //适龄上限回调
    bookAgeEnd(e){
    	console.log(e.target.value)
    	this.setState({
    		book:{
    			...this.state.book,
    			bookEndAge:e.target.value
    		}
        })
    }
    //标准价格回调
    biaozhunPrice(e){
    	console.log(e.target.value)
    	this.setState({
    		goods:{
    			...this.state.goods,
    			goodsSrcPrice:e.target.value
    		}
        })
    }
    //图书拼音回调
    bookPY(e){
    	console.log(e.target.value)
    	this.setState({
    		book:{
    			...this.state.book,
    			pinyin:e.target.value
    		}
        })
    }
    //系列名回调
    bookXiLie(e){
    	console.log(e.target.value)
    	this.setState({
    		book:{
    			...this.state.book,
    			bookSeriesName:e.target.value
    		}
        })
    }
    //输入框增加标签的回调
    setBookTags(value){
    	console.log(value);
    	let newTagArr = this.state.tags;
    	
    	//去除两边空格，将所有 空格、逗号(中、英)，替换为英文逗号
    	let newTag = value.replace(/^\s+|\s+$/g,'').replace(/,|\，|\s/g,',');
    	console.log(newTag);
    	if(/,/.test(newTag)){
    		newTag = newTag.split(",");
    		let arrFilter=[];
    		newTag.map(function(item){
    			if (item != "") {
    				arrFilter.push(item);
    			}
    		})
    		newTagArr = newTagArr.concat(arrFilter);
    	}else{
    		newTagArr.push(newTag);
    	}
    	
    	if(newTag != " " && newTag != ""){
    		$(".editBookPage .bookTags").val('');
    		this.setState({
	    		tags:newTagArr
	        })
    	}
    }
    //增加标签的回调，包括 点击常用标签、用户手动输入
    setBookTags1(e){
    	e.preventDefault();
    	console.log(e.target);
    	console.log(e.target.innerText)
    	let newTags = this.state.tags;
    	newTags.push(e.target.innerText);
    	this.setState({
    		tags:newTags
        })
    }
    //删除标签的回调
    deleteBookTags(value){
    	console.log(value);
    	let newTags=[];
    	this.state.tags.map(function(item){
    		if(item != value){
    			newTags.push(item);
    		}
    	});
    	
    	this.setState({
    		tags:newTags
        })
    }
    bookPageSet(num){
    	this.setState({
    		book:{
    			...this.state.book,
    			bookPages:num
    		}
    	})
    }
    
    //查看图片详情
	sayImage(src){
		this.setState({ 
			imgFlag:true,
        	imgSrc:src
		});
	}
    //关闭图片详情
	closeImage(){
		this.setState({ 
			imgFlag:false,
		});
	}
    
    
    
  
    //保存
    fetchFn = () => {
    	var thisTrue = this;
    	
        let param = {},
        book = this.state.book,
        bookMode = this.state.bookModeList.join(","), //阅读模式  数组 单独
        bookTags = this.state.tags.join(","),		  //标签  	 数组  单独
        authorList = [];		  						  //图书的相关制作者
        
        book.tags = bookTags;
        book.bookMode = bookMode;
        book.language = this.state.book.bookLanguages;
        //处理作者的
        for (let a=0;a<this.state.saveAuthorArr2.length;a++) {
        	for(let b=0;b<this.state.saveAuthorArr2[a].length;b++){
        		authorList.push(this.state.saveAuthorArr2[a][b]);
        	}
        }
        
        //判断有没有玩书的
        var bookPlayFlag=0;
        for(let i=0;i<this.state.bookModeList.length;i++){
        	if (this.state.bookModeList[i] == "BOOK_PLAY") {
        		bookPlayFlag = 1;
        	}
        }
        
        console.log("以下是需要保存的数据");
        param.bookCode = this.state.bookCode;
        param.book = book;
        param.goods = this.state.goods;
        param.bookAuthorRelationList  = authorList; 
        param.bookPreviewResourceList= this.state.bookPreviewResourceList
        
        param.bookGradeRelationList = (function(){
        	let arr = [];
        	for (let p=0;p<thisTrue.state.GradeList.length;p++) {
        		arr.push({gradeCode:thisTrue.state.GradeList[p]})
        	}
        	return arr;
        })();
        param.bookDomainRelationList = (function(){
        	let arr = [];
        	if (thisTrue.state.DomainList =="D201712055OHF5Y") {
        		arr.push({domainCode:thisTrue.state.DomainList})
        	} else{
        		arr.push({domainCode:thisTrue.state.bookSecondList})
        	}
        	return arr;
        })();
        param.bookWikiRelationList = (function(){
        	let arr = [];
        	for (let p=0;p<thisTrue.state.WikiList.length;p++) {
        		arr.push({wikiCode:thisTrue.state.WikiList[p]})
        	}
        	return arr;
        })();
        param.bookTopicRelationList = (function(){
        	let arr = [];
        	arr.push({classCode:thisTrue.state.TopicList})
        	return arr;
        })();
        param.bookPrizeRelationList = (function(){
        	let arr = [];
        	for (let p=0;p<thisTrue.state.PrizeList.length;p++) {
        		arr.push({prizeCode:thisTrue.state.PrizeList[p]})
        	}
        	return arr;
        })();
        
        console.log(param);
        console.log(param.bookDomainRelationList[0].domainCode);

        if (param.book.bookStartAge == "" || param.book.bookStartAge == undefined) {
        	thisTrue.errorNotice('保存失败！','适龄最小年龄不能为空！');
        }else if (param.book.bookEndAge == "" || param.book.bookEndAge == undefined) {
        	thisTrue.errorNotice('保存失败！','适龄最大年龄不能为空！');
        }else if (parseInt(param.book.bookEndAge) <parseInt(param.book.bookStartAge)) {
        	thisTrue.errorNotice('保存失败！','适龄年龄范围有误！');
        }else if (param.book.bookName == "" || param.book.bookName == undefined) {
        	thisTrue.errorNotice('保存失败！','图书名称不能为空！');
        }else if (param.book.bookPublish == "" || param.book.bookPublish == undefined) {
        	thisTrue.errorNotice('保存失败！','出版社名称不能为空！');
        }else if (param.book.bookIntroduction == "" || param.book.bookIntroduction == undefined) {
        	thisTrue.errorNotice('保存失败！','图书简介不能为空！');
        }else if (param.book.bookPages == "" || param.book.bookPages == undefined) {
        	thisTrue.errorNotice('保存失败！','页数不能为空！');
        }else if (param.book.bookLanguages == "" || param.book.bookLanguages == undefined) {
        	thisTrue.errorNotice('保存失败！','语言类型不能为空！');
        }else if (param.book.bookMode == "" || param.book.bookMode == undefined) {
        	thisTrue.errorNotice('保存失败！','阅读模式不能为空！');
        }else if (bookPlayFlag == 0) {
        	thisTrue.errorNotice('保存失败！','阅读模式，玩书 为必选项！');
        }else if (param.book.pinyin == "" || param.book.pinyin == undefined) {
        	thisTrue.errorNotice('保存失败！','图书拼音不能为空！');
        }else if (param.book.tags == "" || param.book.tags == undefined) {
        	thisTrue.errorNotice('保存失败！','标签不能为空！');
        }else if (param.goods.goodsMarketprice == "" || param.goods.goodsMarketprice == undefined) {
        	thisTrue.errorNotice('保存失败！','纸质书价格不能为空！');
        }else if (param.goods.goodsSrcPrice == "" || param.goods.goodsSrcPrice == undefined) {
        	thisTrue.errorNotice('保存失败！','标准价格不能为空！');
        }else if (param.book.isVip == "" || param.book.isVip == undefined) {
        	thisTrue.errorNotice('保存失败！','会员借阅不能为空！');
        }else if (param.bookDomainRelationList[0].domainCode =='' || param.bookDomainRelationList[0].domainCode == undefined ) {
        	thisTrue.errorNotice('保存失败！','领域不能为空！');
        }else if (param.bookGradeRelationList.length <=0) {
        	thisTrue.errorNotice('保存失败！','年级不能为空！');
        }else if (param.bookTopicRelationList.length <=0) {
        	thisTrue.errorNotice('保存失败！','主题分类不能为空！');
        }else if (param.bookWikiRelationList.length <=0 ) {
        	thisTrue.errorNotice('保存失败！','百科分类不能为空！');
        }else{
        	let a=0,b=0,c=0,d=0,e=0,f=0;
        	for(let x=0;x<param.bookAuthorRelationList.length;x++){
        		if(param.bookAuthorRelationList[x].authorType == "AUTHOR_ART"){
	        		a=1;
	        	}else if(param.bookAuthorRelationList[x].authorType == "AUTHOR_AUDIO"){
	        		b=1;
	        	}else if(param.bookAuthorRelationList[x].authorType == "AUTHOR_SCRIPT"){
	        		c=1;
	        	}else if(param.bookAuthorRelationList[x].authorType == "AUTHOR_DESIGN"){
	        		d=1;
	        	}else if(param.bookAuthorRelationList[x].authorType == "AUTHOR_REVIEW"){
	        		e=1;
	        	}else if(param.bookAuthorRelationList[x].authorType == "AUTHOR_TEXT" || param.bookAuthorRelationList[x].authorType == "AUTHOR_PAINTING" || param.bookAuthorRelationList[x].authorType == "AUTHOR_TRANSLATION" ){
	        		f=1;
	        	}
        	}
    		if(a==0){
        		thisTrue.errorNotice('保存失败！','图片处理不能为空！');
        	}else if(b==0){
        		thisTrue.errorNotice('保存失败！','音频不能为空！');
        	}else if(c==0){
        		thisTrue.errorNotice('保存失败！','分镜不能为空！');
        	}else if(d==0){
        		thisTrue.errorNotice('保存失败！','动效不能为空！');
        	}else if(e==0){
        		thisTrue.errorNotice('保存失败！','审校不能为空！');
        	}else if(f==0){
        		thisTrue.errorNotice('保存失败！','原著绘图作者、原著绘图作者、原著翻译作者不能全为空！');
        	}else{
        		this.setState({
		    		loading:true
		        })
        		confirm({
				    title: '确定要保存现在的数据吗',
				    content: '请仔细核实您所填写的信息！',
				    onOk() {
				      	fetch(util.url, {
							method: "POST",
							headers: {
								'Content-Type': 'application/x-www-form-urlencoded'
							},
							body: "method=ella.operation.updateBookInfoAndRelationsInfo" + "&content=" + JSON.stringify({
								"bookCode":param.bookCode,
								"book":param.book,
								"goods":param.goods,
								"bookAuthorRelationList":param.bookAuthorRelationList,
								"bookGradeRelationList":param.bookGradeRelationList,
								"bookDomainRelationList":param.bookDomainRelationList,
								"bookWikiRelationList":param.bookWikiRelationList,
								"bookTopicRelationList":param.bookTopicRelationList,
								"bookPrizeRelationList":param.bookPrizeRelationList,
								"bookPreviewResourceList":param.bookPreviewResourceList
							})+dataString
						})
						.then(function(response){
							console.log(response);
							return response.json();
						})
						.then(function(response){
							console.log(response);
							if (response.status == 1) {
								Modal.success({
								    title: "保存成功",
								    content: "",
								});
						    	thisTrue.setState({
						    		loading:false
						        })
							}else if (response.status == 0) {
						    	thisTrue.setState({
						    		loading:false
						        })
						    	thisTrue.errorNotice('保存失败！','请重试');
							}
						})
				    },
				    onCancel() {
				    	thisTrue.setState({
				    		loading:false
				        })
				    },
				});
        		
        	}
        }
    }
    
    errorNotice(titles,contents){
    	Modal.error({
		    title: titles,
		    content: contents,
		});
    }
    
    //新增图片
    imgChangeFn(imgList){
    	var imgList1 = this.state.bookPreviewResourceList;
    	imgList1.push({"ossUrl":imgList,"resourceType":"PREVIEW_IMG","id":''});
    	this.setState({
    		bookPreviewResourceList:imgList1
    	})
    }
    
    //图片删除
    imgDelete(imgUrl,id){
    	var thisTrue = this;
		
		
		console.log(imgUrl);
		
		fetch(util.url, {
			method: "POST",
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: "method=ella.operation.delBookPreviewResourceImg" + "&content=" + JSON.stringify({
				"bookCode":thisTrue.state.bookCode,
				"bookPreviewResource":{
					"ossUrl":imgUrl,
					"resourceType":"PREVIEW_IMG",
					"id":id
				}
			})+dataString
		})
		.then(function(response){
			console.log(response);
			return response.json();
		})
		.then(function(response){
			console.log(response);
			
			var imgList1 = thisTrue.state.bookPreviewResourceList;
			var newImgList = [];
			for(let i=0;i<imgList1.length;i++){
				if(imgList1[i].ossUrl != imgUrl){
					if (imgList1[i].id != "") {
						newImgList.push({"ossUrl":imgList1[i].ossUrl,"resourceType":"PREVIEW_IMG","id":imgList1[i].id});
					}else{
						newImgList.push({"ossUrl":imgList1[i].ossUrl,"resourceType":"PREVIEW_IMG","id":''});
					}
					
				}
			}
			thisTrue.setState({
				bookPreviewResourceList:newImgList
	        });
		})
    }
    

    render() {
        var w = this;
        console.log(this.state.tags);
        return (
            <div className="editBookPage">
                <Spin tip="加载中..." spinning={this.state.loading} size="large">
                    <p className="m-head">
                        <Link to="/bookList">
                            <Icon type="left" /> 编辑图书信息
                        </Link>
                    </p>
                    <div className="m-edit-bd">
                        <Row className="m-input">
                            <Col span={2} style={{ width: 100 }}><span className="u-txt">图书名称</span></Col>
                            <Col span={5}>
                            {
                            	this.state.zhutiFlag && <Input value={this.state.book.bookName ? this.state.book.bookName : ''} style={{ width: 170 }} onChange={(e) => this.bookNameChange(e.target.value)} />
                            }
                            </Col>
                            <Col span={2} style={{ width: 100 }}><span className="u-txt">纸质书价格</span></Col>
                            <Col span={5}>
	                            {
	                            	this.state.zhutiFlag && <Input value={this.state.goods.goodsMarketprice ? this.state.goods.goodsMarketprice : ''} style={{ width: 170 }} onChange={(e) => this.goodsPriceChange("goodsMarketprice", e.target.value)} />
	                            }
                            </Col>
                            <Col span={2} style={{ width: 100 }}><span className="u-txt">图书拼音</span></Col>
                            <Col span={5}>
                            	{
	                            	this.state.zhutiFlag && <Input value={this.state.book.pinyin ? this.state.book.pinyin : ''} style={{ width: 170 }} onChange={(e)=>this.bookPY(e)} />
	                            }
                                
                            </Col>
                        </Row>
                        <Row className="m-input">
                            <Col span={2} style={{ width: 100 }}><span className="u-txt">系列名</span></Col>
                            <Col span={5}>
                            	{
	                            	this.state.zhutiFlag && <Input value={this.state.book.bookSeriesName ? this.state.book.bookSeriesName : ''} onChange={(e)=>this.bookXiLie(e)} style={{ width: 170 }} />
	                            }
                            </Col>
                            <Col span={2} style={{ width: 100 }}><span className="u-txt">出版社</span></Col>
                            <Col span={5}>
                            	{this.state.zhutiFlag && <Select style={{ width: 150 }} value={this.state.book.bookPublish?this.state.book.bookPublish:""} onChange={(value) => this.bookPublishChange(value)} onFocus={(value) => this.focus("operation.box.publishList", "AUTO_BOX", "publishList")}>
                                    {
                                        this.state.publishList ? this.state.publishList.map(function (item) {
                                            return <Option value={item.uid}>{item.businessTruename}</Option>
                                        }) : <div></div>
                                    }
                                </Select>}
                            </Col>
                            <Col span={2} style={{ width: 100 }}><span className="u-txt">页数</span></Col>
                            <Col span={5}>
                            	{
	                            	this.state.zhutiFlag && <Input value={this.state.book.bookPages ? this.state.book.bookPages : ''} style={{ width: 170 }} onChange={(e) => this.bookPageSet(e.target.value)} />
	                            }
                            </Col>
                        </Row>
                        <Row className="m-input">
                            <Col span={2} style={{ width: 100 }}><span className="u-txt">图片处理</span></Col>
                            <Col span={8}>
                                {this.state.zhutiFlag && <Select
                                    mode="tags"
                                    style={{ width: '100%' }}
                                    onChange={(v)=>{this.getEllaAuthorListSearch(v,"AUTHOR_ART")}}
                                    tokenSeparators={[',']}
                                    placeholder="搜索并选择数据"
                                    defaultValue={this.state.ellaAuthor[0]}
                                >
                                    {this.state.bookSearchList}
                                </Select>}
                            </Col>

                            <Col span={2} style={{ width: 100, marginLeft: '100px' }}><span className="u-txt">动效</span></Col>
                            <Col span={8}>
                                {this.state.zhutiFlag && <Select
                                    mode="tags"
                                    style={{ width: '100%' }}
                                    onChange={(v) => { this.getEllaAuthorListSearch(v,"AUTHOR_DESIGN") }}
                                    tokenSeparators={[',']}
                                    placeholder="搜索并选择数据"
                                    defaultValue={this.state.ellaAuthor[3]}
                                >
                                    {this.state.bookSearchList}
                                </Select>}
                            </Col>
                        </Row>

                        <Row className="m-input">
                            <Col span={2} style={{ width: 100 }}><span className="u-txt">音频</span></Col>
                            <Col span={8}>
                                {this.state.zhutiFlag && <Select
                                    mode="tags"
                                    style={{ width: '100%' }}
                                    onChange={(v) => { this.getEllaAuthorListSearch(v,"AUTHOR_AUDIO") }}
                                    tokenSeparators={[',']}
                                    placeholder="搜索并选择数据"
                                    defaultValue={this.state.ellaAuthor[1]}
                                >
                                    {this.state.bookSearchList}
                                </Select>}
                            </Col>

                            <Col span={2} style={{ width: 100, marginLeft: '100px' }}><span className="u-txt">分镜</span></Col>
                            <Col span={8}>
                                {this.state.zhutiFlag && <Select
                                    mode="tags"
                                    style={{ width: '100%' }}
                                    onChange={(v) => { this.getEllaAuthorListSearch(v,"AUTHOR_SCRIPT") }}
                                    tokenSeparators={[',']}
                                    placeholder="搜索并选择数据"
                                    defaultValue={this.state.ellaAuthor[2]}
                                >
                                    {this.state.bookSearchList}
                                </Select>}
                            </Col>
                        </Row>


                        <Row className="m-input">
                            <Col span={2} style={{ width: 100 }}><span className="u-txt">审校</span></Col>
                            <Col span={8}>
                                {this.state.zhutiFlag && <Select
                                    mode="tags"
                                    style={{ width: '100%' }}
                                    onChange={(v) => { this.getEllaAuthorListSearch(v,"AUTHOR_REVIEW") }}
                                    tokenSeparators={[',']}
                                    placeholder="搜索并选择数据"
                                    defaultValue={this.state.ellaAuthor[4]}
                                >
                                    {this.state.bookSearchList}
                                </Select>}
                            </Col>

                            <Col span={2} style={{ width: 100, marginLeft: '100px' }}><span className="u-txt">原著故事作者</span></Col>
                            <Col span={8}>
                                {this.state.zhutiFlag && <Select
                                    mode="tags"
                                    style={{ width: '100%' }}
                                    onChange={(v) => { this.getEllaAuthorListSearch(v,"AUTHOR_TEXT") }}
                                    tokenSeparators={[',']}
                                    placeholder="搜索并选择数据"
                                    defaultValue={this.state.ellaAuthor[6]}
                                >
                                    {this.state.bookSearchList1}
                                </Select>}
                            </Col>
                        </Row>

                        <Row className="m-input">
                            <Col span={2} style={{ width: 110 }}><span className="u-txt">原著绘图作者</span></Col>
                            <Col span={18}>
                                {this.state.zhutiFlag && <Select
                                    mode="tags"
                                    style={{ width: '100%' }}
                                    onChange={(v) => { this.getEllaAuthorListSearch(v,"AUTHOR_PAINTING") }}
                                    tokenSeparators={[',']}
                                    placeholder="搜索并选择数据"
                                    defaultValue={this.state.ellaAuthor[5]}
                                >
                                    {this.state.bookSearchList1}
                                </Select>}
                            </Col>
                        </Row>
                        <Row className="m-input">
                            <Col span={2} style={{ width: 110 }}><span className="u-txt">原著翻译作者</span></Col>
                            <Col span={18}>
                                {this.state.zhutiFlag && <Select
                                    mode="tags"
                                    style={{ width: '100%' }}
                                    onChange={(v) => { this.getEllaAuthorListSearch(v,"AUTHOR_TRANSLATION") }}
                                    tokenSeparators={[',']}
                                    placeholder="搜索并选择数据"
                                    defaultValue={this.state.ellaAuthor[7]}
                                >
                                    {this.state.bookSearchList1}
                                </Select>}
                            </Col>
                        </Row>
                    </div>
                    <div className="m-label">
                        <Row className="m-input">
                            <Col span={2} style={{ width: 110 }}><span className="u-txt">阅读模式</span></Col>
                            <Col span={10}>
                                {this.state.zhutiFlag && <CheckboxGroup value={this.state.bookModeList} onChange={(value)=>this.readModul(value)}>
                                    {
                                        this.state.bookMode ? this.state.bookMode.map(function (item) {
                                            return <Checkbox value={item.searchCode}>{item.searchName}</Checkbox>
                                        }) : <div></div>
                                    }
                                </CheckboxGroup>}
                            </Col>
                        </Row>
                        <Row>
                            <Col span={2} style={{ width: 110 }}><span className="u-txt">图书简介</span></Col>
                            <Col span={10}>
                                {this.state.zhutiFlag && <TextArea value={this.state.book.bookIntroduction ? this.state.book.bookIntroduction :""} className="m-textArea" onChange={(e)=>this.bookScript(e)} />}
                            </Col>
                        </Row>
                        <Row className="m-input">
                            <Col span={2} style={{ width: 110 }}><span className="u-txt">图书封面和截图</span></Col>
                        </Row>
                        <Row>
                            <Col span={1} style={{ width: 110 }}><span className="u-txt"></span></Col>
                            <div className="m-bookImgOut">
	                            {
	                                this.state.bookResourceList ? this.state.bookResourceList.map(function (item) {
	                                    return item.resource == 'normal' ? <div className="u-cover">
	                                    	<div className="imgMengBan1">
		                                    	<Icon onClick={()=>w.sayImage(item.ossUrl)} type="eye" />
		                                    </div>
	                                    	<img className="f-editBookImg" src={item.ossUrl} onClick={()=>w.sayImage(item.ossUrl)} alt="" />
        								</div> : ''
	                                }) : <div></div>
	                            }
	                            {
	                                this.state.bookPreviewResourceList ? this.state.bookPreviewResourceList.map(function (item) {
	                                    return <div className="u-pic">
				                                    <div className="imgMengBan">
				                                    	<Icon onClick={()=>w.sayImage(item.ossUrl)} type="eye" />
				                                    	　　　
				                                    	<Icon onClick={()=>w.imgDelete(item.ossUrl,item.id)} type="delete" />
				                                    </div>
			                                    	<img src={item.ossUrl} alt="" />
		                            			</div>
	                                }) : <div></div>
	                            }
	                            <div className="bianju"></div>
	                            {this.state.zhutiFlag && this.state.bookPreviewResourceList.length <3 && <UpLoadImg imgChangeFn={(imgList)=>this.imgChangeFn(imgList)} bookCode={this.state.bookCode}></UpLoadImg>}
	                            　				
                            </div>
                        </Row>
                    </div>
                    <div className="m-field">
                        <Row className="m-input">
                            <Col span={2} style={{ width: 110 }}><span className="u-txt">学龄阶段</span></Col>
                            <Col span={10}>
                                {this.state.zhutiFlag && <CheckboxGroup value={['1']}>
                                    {
                                        this.state.bookGradeList ? this.state.bookGradeList.map(function (item) {
                                            return item.parentCode == 0 ? <Checkbox value={item.gradeCode}>{item.gradeName}</Checkbox> : ''
                                        }) : <div></div>
                                    }
                                </CheckboxGroup>}
                            </Col>
                        </Row>
                        <Row className="m-input">
                            <Col span={2} style={{ width: 110 }}><span className="u-txt">年级</span></Col>
                            <Col span={10}>
                                {this.state.zhutiFlag && <CheckboxGroup value={this.state.GradeList}  onChange={(value)=>this.bookGrade(value)}>
                                    {
                                        this.state.bookGradeList ? this.state.bookGradeList.map(function (item) {
                                            return item.parentCode != "0" ? <Checkbox value={item.gradeCode}>{item.gradeName}</Checkbox> : ''
                                        }) : <div></div>
                                    }
                                </CheckboxGroup>}
                            </Col>
                        </Row>
                        <Row className="m-input">
                            <Col span={2} style={{ width: 110 }}><span className="u-txt">领域</span></Col>
                            <Col span={10}>
                                {this.state.zhutiFlag && <RadioGroup value={this.state.DomainList?this.state.DomainList:""} onChange={(e) => this.radioDomainRelationChange("bookDomainClassList", e.target.value)}>
                                    {
                                        this.state.bookDomainClassList ? this.state.bookDomainClassList.map(function (item) {
                                            return item.parentCode == "0" ? <Radio value={item.domainCode}>{item.domainName}</Radio> : ''
                                        }) : <div></div>
                                    }
                                </RadioGroup>}
                                
                                {this.state.zhutiFlag && <RadioGroup  value={this.state.bookSecondList?this.state.bookSecondList:""} className="u-second-radio" onChange={(e) => this.bookSecondChange(e.target.value)}>
                                    {
                                        this.state.bookSecondClassList ? this.state.bookSecondClassList.map(function (item) {
                                            return <Radio value={item.domainCode}>{item.domainName}</Radio>
                                        }) : <div></div>
                                    }
                                </RadioGroup>}
                            </Col>
                        </Row>
                        <Row className="m-input">
                            <Col span={2} style={{ width: 110 }}><span className="u-txt">百科分类</span></Col>
                            <Col span={10}>
                                {this.state.zhutiFlag && <CheckboxGroup value={this.state.WikiList} onChange={(value)=>this.bookClass(value)}>
                                    {
                                        this.state.bookWikiClassList ? this.state.bookWikiClassList.map(function (item) {
                                            return <Checkbox value={item.wikiCode}>{item.wikiName}</Checkbox>
                                        }) : <div></div>
                                    }
                                </CheckboxGroup>}
                            </Col>
                        </Row>
                        <Row className="m-input">
                            <Col span={2} style={{ width: 110 }}><span className="u-txt">主题分类</span></Col>
                            <Col span={10}>
                                {this.state.zhutiFlag && <RadioGroup onChange={(e) => this.radioChange(e.target.value)} value={this.state.TopicList}>
                                    {
                                        this.state.bookTopicClassList ? this.state.bookTopicClassList.map(function (item) {
                                            return <Radio value={item.classCode}>{item.className}</Radio>
                                        }) : <div></div>
                                    }
                                </RadioGroup>}
                            </Col>
                        </Row>
                        <Row className="m-input">
                            <Col span={2} style={{ width: 110 }}><span className="u-txt">适龄</span></Col>
                            <Col span={2}>
                                {this.state.zhutiFlag && <Input value={this.state.book.bookStartAge ? this.state.book.bookStartAge : ''} onChange={(e)=>this.bookAgeSta(e)}/>}
                            </Col>
                            <Col className="t_center" style={{ textAline: "center" }} span={1}>
                                <span style={{ width: "100%" }} className="line">—</span>
                            </Col>
                            <Col span={2}>
                                {this.state.zhutiFlag && <Input value={this.state.book.bookEndAge ? this.state.book.bookEndAge : ''}  onChange={(e)=>this.bookAgeEnd(e)} />}
                            </Col>
                        </Row>
                        <Row className="m-input">
                            <Col span={2} style={{ width: 110 }}><span className="u-txt">语言类型</span></Col>
                            <Col span={10}>
                                {this.state.zhutiFlag && <RadioGroup onChange={(e)=>this.bookLanguage(e)} value={this.state.book.bookLanguages}>
                                    {
                                        this.state.bookLanguageList ? this.state.bookLanguageList.map(function (item) {
                                            return <Radio value={item.searchCode}>{item.searchName}</Radio>
                                        }) : <div></div>
                                    }
                                </RadioGroup>}
                            </Col>
                        </Row>
                        <Row className="m-input">
                            <Col span={2} style={{ width: 110 }}><span className="u-txt">获奖情况</span></Col>
                            <Col span={10}>
                                {this.state.zhutiFlag && <CheckboxGroup value={this.state.PrizeList} onChange={(value)=>this.bookPrise(value)}>
                                    {
                                        this.state.bookPrizeList ? this.state.bookPrizeList.map(function (item) {
                                            return <Checkbox value={item.prizeCode}>{item.prizeName}</Checkbox>
                                        }) : <div></div>
                                    }
                                </CheckboxGroup>}
                            </Col>
                        </Row>
                        <Row className="m-input">
                            <Col span={2} style={{ width: 110 }}><span className="u-txt">标签</span></Col>
                            <Col span={4}>
                                <Input className="bookTags" onPressEnter={(e)=>this.setBookTags(e.target.value)} />
                            </Col>
                            <Col span={2} style={{ width: 110, marginLeft: '60px' }}><span className="u-txt">常用标签:</span></Col>
                            <Col span={10}>
                                <div>
                                    {
                                        this.state.getBookTagsList ? this.state.getBookTagsList.map(function (item) {
                                            return <Tag color="#23b8e6" onClick={(e)=>{w.setBookTags1(e)}} >{item.tagName}</Tag>
                                        
                                        }) : ''
                                    }
                                </div>
                            </Col>
                        </Row>
                        <Row className="m-input">
                            <Col span={2} style={{ width: 110 }}><span className="u-txt"></span></Col>
                            <Col span={12}>
                                {
                                    this.state.tags ? this.state.tags.map(function (item) {
                                        return <Tag closable onClose={(e)=>{   e.preventDefault(); console.log(item); w.deleteBookTags(item)}}>{item}</Tag>
                                        {/*return <div>{item}　<Icon type="close" style={{fontSize:12}} onClick={()=>{w.deleteBookTags(item)}} /></div>*/}
                                    }) : ''
                                }
                            </Col>
                        </Row>
                        <Row className="m-input">
                            <Col span={2} style={{ width: 110 }}><span className="u-txt">会员借阅</span></Col>
                            <Col span={4}>
                                {this.state.zhutiFlag && <RadioGroup onChange={(e)=>this.vipRead(e)} value={this.state.book.isVip}>
                                    <Radio value="VIP_YES">是</Radio>
                                    <Radio value="VIP_NO">否</Radio>
                                </RadioGroup>}
                            </Col>
                        </Row>
                        <Row className="m-input">
                            <Col span={2} style={{ width: 110 }}><span className="u-txt">标准价格</span></Col>
                            <Col span={4}>
                                {this.state.zhutiFlag && <Input value={this.state.goods.goodsSrcPrice ? this.state.goods.goodsSrcPrice : ''} style={{ width: 170 }} onChange={(e)=>this.biaozhunPrice(e)} />}
                            </Col>
                        </Row>
                        <Row className="m-input">
                            {/*<Col span={2} style={{ width: 110 }}><span className="u-txt"></span></Col>*/}
                            <Col span={4}>
                                <Button className="g-saveBtn" onClick={() => { this.fetchFn() }}>保存</Button>
                            </Col>
                        </Row>
                    </div>
                    
                    {
						this.state.imgFlag && <SawImgDetail closeImage={this.closeImage} imgSrc={this.state.imgSrc} ></SawImgDetail>
					}
                </Spin>
            </div>
        )
    }
}