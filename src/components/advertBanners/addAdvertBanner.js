import React from 'react'
import { Upload, Icon, Form, Input, Select, Spin, Alert, Radio, Button, Modal, message, Table, Row, Col,Checkbox } from 'antd'
import { Link, hashHistory } from 'react-router'
import "./adBanner.css";
const FormItem = Form.Item
const RadioGroup = Radio.Group
const CheckboxGroup = Checkbox.Group;
const Search = Input.Search;
const Option = Select.Option;
var util = require('../util.js');
import commonData from '../commonData.js';
// const targetTypeData = ['推荐专栏', '系统界面','H5页面','图书详情'];
const targetTypeData = [
    {
        key: 'BOOK_LIST',
        value: '推荐专栏'
    },
    {
        key: 'SYSTEM_INTERFACE',
        value: '系统界面'
    },
    {
        key: 'H5',
        value: 'H5页面'
    },
    {
        key: 'BOOK_DETAIL',
        value: '图书详情'
    },
    {
        key: 'BOOK_PACKAGE_DETAIL',
        value: '图书包'
    },
    {
        key: 'COURSE_DETAIL',
        value: '课程详情'
    }
];
const targetTypeData2 = [
    {
        key: 'AD_PART',
        value: '模块广告'
    },
    {
        key: 'AD_SINGLE',
        value: '单广告'
    }
];
class myForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: false,
            status: this.props.params.status,
            targetType: targetTypeData[0].key,
            targetType2: targetTypeData2[0].key,
            bannerTitle: '',
            bannerDesc: '',
            previewVisible: false,
            previewVisible2: false,
            previewImage: '',
            previewImage2: '',
            fileList: [],//移动客户端
            fileList2:[],//HD客户端
            loading: false,
            loading2: false,
            bannerBookLoading: false,
            targetPage: '',
            searchId: '',
            childSelectContent: [],
            childSelectContent2: [],
            idx: 0,
            idx2: 0,
            selectContent: [],
            h5Flag: {
                display: 'none'
            },
            h5TargetPage: '',
            lists: [],
            selectedRowKeys: [],
            tmpSelectdRowKeys: [],
            bookDetailName: '',
            current: 1,
            searchGroupList: [],     //搜索出来的图书包列表
            bookPageThirdCode: "",        //图书包编码
            defauleName: "", //上次编辑的内容
            partCode: '',
            shelvesFlag:null,
            platformList:[],//平台下拉数据
            platformCode:[],//所选平台
           	imgUrl:'',
            imgUrl2:'',
        }
        this.onPagnition = this.onPagnition.bind(this);
    }
    // TODO:公共设置state函数
    setOneKV(k, v) {
        this.setState({
            [k]: v
        })
    }
    handleTargetTypeChange = (value) => {
        this.selectFetchFn(value.key);
        this.setState({
            targetType: value.key,
            targetKey: value.key,
            targetValue: value.label
        });
    }
    handleTargetTypeChange2 = (value) => {
        this.selectFetchFn2(value.key);
        this.setState({
            targetType2: value.key
        });
    }
    handleTargetPageChange = (value) => {

        this.setState({
            searchPageName: value.label,
            idx: value.key,
            searchId: this.state.childSelectContent[value.key].searchId
        }, () => {
            console.log(this.state.searchId);
        }
        );
    }
    handleTargetPageChange2 = (value) => {
        console.log(value);
        this.setState({
            idx2: value.key,
            partCode: this.state.childSelectContent2[value.key].searchId
        }, () => {
            console.log(this.state.partCode);
        }
        );
    }
    fetchFn = async () => {
        var doc = {
            bannerCode: this.state.status
        };
        var data = await fetch(util.url, {
            method: 'POST',
            headers: {
                "Content-type": "application/x-www-form-urlencoded"
            },
            mode: 'cors',
            body: "method=ella.operation.getOperationAdInfo" + "&content=" + JSON.stringify(doc) + commonData.dataString
        })
            .then(function (res) {
                return res.json();
            });

        // this.selectFetchFn(data.data.targetType);

        if (data.data.targetType == 'BOOK_LIST') {
            this.setState({
                targetValue: targetTypeData[0].value,
                targetKey: targetTypeData[0].key
            })
            this.selectBox(0);

        }
        if (data.data.targetType == 'SYSTEM_INTERFACE') {
            this.setState({
                targetValue: targetTypeData[1].value,
                targetKey: targetTypeData[1].key
            })
            this.selectBox(1);


        }
        if (data.data.adStyle == 'AD_PART') {
            this.setState({
                targetValue2: targetTypeData[0].value,
                targetKey2: targetTypeData2[0].key
            })
            this.selectBox2(0);


        }
        if (data.data.adStyle == 'AD_SINGLE') {
            this.setState({
                targetValue2: targetTypeData[1].value,
                targetKey2: targetTypeData2[1].key
            })
            this.selectBox2(1);


        }
        if (data.data.targetType == 'H5') {
            this.setState({
                targetValue: targetTypeData[2].value,
                targetKey: targetTypeData[2].key,

            })
            this.selectBox(2);
        }
        if (data.data.targetType == 'BOOK_DETAIL') {
            this.setState({
                targetValue: targetTypeData[3].value,
                targetKey: targetTypeData[3].key
            })
            this.selectBox(3);
        }
        //TODO:获取默认数据
        if (data.data.targetType == 'BOOK_PACKAGE_DETAIL') {
            this.setState({
                targetValue: targetTypeData[4].value,
                targetKey: targetTypeData[4].key,
                searchGroupList: [],
                defauleName: data.data.searchPageName,

            })
            this.selectBox(4);
        }
        if (data.data.targetType == 'COURSE_DETAIL') {
            this.setState({
                targetValue: targetTypeData[5].value,
                targetKey: targetTypeData[5].key,
                searchGroupList: [],
                defauleName: data.data.searchPageName,

            })
            this.selectBox(5);
        }
        this.selectFetchFn(data.data.targetType);
        this.selectFetchFn2(data.data.adStyle);
        this.setState({
            targetType: data.data.targetType,
            targetType2: data.data.adStyle,
            // previewImage:data.data.bannerImageUrl,
            fileList:data.data.bannerImageUrl==''?[]: [{
                uid: -1,
                name: 'xxx.png',
                status: 'done',
                url: data.data.bannerImageUrl,
            }],
            
            fileList2: data.data.hdImageUrl==''?[]:[{
                uid: -1,
                name: 'xxx.png',
                status: 'done',
                url: data.data.hdImageUrl,
            }],
            data: data.data,
            bannerTitle: data.data.bannerTitle,
            bannerDesc: data.data.bannerDesc,
            searchId: data.data.searchId,
            partCode: data.data.partCode,
            searchPageName: data.data.searchPageName,
            targetPage: data.data.targetPage,
            bookDetailUrl: data.data.targetPage,
            idx: 0,
            idx2: 0,
            imgUrl: data.data.bannerImageUrl,
            imgUrl2: data.data.hdImageUrl,
            h5TargetPage: data.data.targetPage,
            searchTxt: data.data.searchPageName,
            shelvesFlag:data.data.shelvesFlag,
            platformCode:data.data.platformCode.split(","),

            // imageUrl:data.data.bannerImageUrl
        });


    }

    selectBox = (n) => {

        this.setState({
            select1: (
                <Select labelInValue defaultValue={{ key: targetTypeData[n].key }} style={{ width: 120 }} onChange={this.handleTargetTypeChange}>
                    {
                        targetTypeData.map((item, index) => {
                            return <Option value={item.key}>{item.value}</Option>
                        })
                    }
                </Select>
            )
        })
    }
    selectBox2 = (n) => {

        this.setState({
            select2: (
                <Select labelInValue defaultValue={{ key: targetTypeData2[n].key }} style={{ width: 120 }} onChange={this.handleTargetTypeChange2}>
                    {
                        targetTypeData2.map((item, index) => {
                            return <Option value={item.key}>{item.value}</Option>
                        })
                    }
                </Select>
            )
        })
    }
     setOneKV2(k, v) {
        this.setState({
            [k]: v,
            bookDetailUrl: 'ellabook2://detail.course?courseCode=' +v
            
        })
    }
    selectFetchFn = async (targetType) => {


        var doc = {
            groupId: targetType
        };
        var data = await fetch(util.url, {
            method: 'POST',
            headers: {
                "Content-type": "application/x-www-form-urlencoded"
            },
            mode: 'cors',
            body: "method=ella.operation.boxSearchList" + "&content=" + JSON.stringify(doc) + commonData.dataString
        })
            .then(function (res) {
                return res.json();
            });
        // var idx = data.data.indexOf(this.state.searchId);
        data.data.map((item, idx) => {
            if (item.searchId == this.state.searchId) {
                this.setState({
                    idx: idx
                })
            }
        })

        if (targetType == 'BOOK_LIST' || targetType == 'SYSTEM_INTERFACE') {
            this.setState({
                childSelectContent: data.data,
                idx: this.state.status == 0 ? 0 : this.state.idx,
                content: (<Select labelInValue defaultValue={{ key: this.state.idx }} style={{ width: 120, marginLeft: 10 }} onChange={this.handleTargetPageChange}>
                    {
                        data.data.map((item, index) => {
                            return <Option value={index}>{item.searchName}</Option>
                        })
                    }
                </Select>),
                h5Flag: {
                    display: 'none'
                },
                bookDetailFlag: {
                    display: 'none'
                }
            });
        } else if (targetType == 'H5') {
            this.setState({
                content: '',
                bookDetailFlag: {
                    display: 'none'
                },
                h5Flag: {
                    display: 'block'
                }
            });
        }
        else if (targetType == 'BOOK_DETAIL') {
            this.setState({
                content: '',
                h5Flag: {
                    display: 'none'
                },
                bookDetailFlag: {
                    display: 'block'
                }
            });
        }
        else if (targetType == 'BOOK_PACKAGE_DETAIL'||targetType == 'COURSE_DETAIL') {
            this.setState({
                content: '',
                h5Flag: {
                    display: 'none'
                },
                bookDetailFlag: {
                    display: 'none'
                }
            });
        }



    }
    selectFetchFn2 = async (targetType) => {
        console.log(this.props.params)
        if (this.props.params.partCode != "0") {
            var _partCode = this.props.params.partCode;
        } else {
            var _partCode = "";
        }
        console.log(this.state.status);
        if (targetType == "AD_PART") {
            var _targetType = "BOOK_LIST";
            var type = "AD_PART";
            var doc = {
                groupId: _targetType,
                type: type,
                partCode: _partCode
            };

        } else {

            this.setState({
                content2: ''

            })
            return;
        }

        var data = await fetch(util.url, {
            method: 'POST',
            headers: {
                "Content-type": "application/x-www-form-urlencoded"
            },
            mode: 'cors',
            body: "method=ella.operation.boxSearchList" + "&content=" + JSON.stringify(doc) + commonData.dataString
        })
            .then(function (res) {
                return res.json();
            });
        // var idx = data.data.indexOf(this.state.searchId);
        var flag = false;
        data.data.map((item, idx) => {
            if (item.searchId == this.state.partCode) {
                flag = true;
                this.setState({
                    idx2: idx
                })

            }
        })
        if (!flag && targetType == "AD_PART"&&data.data.length!=0) {
            this.setState({
                partCode: data.data[0].searchId
            })
        }
        if (targetType == 'AD_PART') {
            this.setState({
                childSelectContent2: data.data,
                content2: (<Select labelInValue defaultValue={{ key: data.data.length!=0?this.state.idx2:''}} style={{ width: 120, marginLeft: 10 }} onChange={this.handleTargetPageChange2}>
                    {
                        data.data.map((item, index) => {
                            return <Option value={index}>{item.searchName}</Option>
                        })
                    }
                </Select>)

            });
        }



    }
    componentDidMount() {
        if (this.state.status != 0) {
            this.fetchFn();
        } else {
            this.selectBox(0);
            this.selectBox2(0)
            this.selectFetchFn(targetTypeData[0].key);
            this.selectFetchFn2(targetTypeData2[0].key);
        }
        this.fetchPlatformList("SYSTEM_PLATFORM");

    }

    convertBase64UrlToBlob = (urlData) => {

        var bytes = window.atob(urlData.split(',')[1]);        //去掉url的头，并转换为byte  

        //处理异常,将ascii码小于0的转换为大于0  
        var ab = new ArrayBuffer(bytes.length);
        var ia = new Uint8Array(ab);
        for (var i = 0; i < bytes.length; i++) {
            ia[i] = bytes.charCodeAt(i);
        }

        var type = urlData.split(',')[0].split(':')[1].split(';')[0];
        return new Blob([ab], { type: type });

    }

    imageFetch = async (url) => {
        this.setState({
            loading: true
        });
        // var doc = {
        //     pictureStream:this.convertBase64UrlToBlob(url)
        // };
        var formData = new FormData();
        formData.append('pictureStream', this.convertBase64UrlToBlob(url), "file_" + Date.parse(new Date()) + ".png");
        var data = await fetch(util.upLoadUrl, {
            method: 'POST',
            // headers: {
            //     "Content-type":"application/x-www-form-urlencoded; charset=UTF-8"
            // },
            mode: 'cors',
            body: formData
        })
            .then(function (res) {
                return res.json();
            });
        if (data.status == 1) {

            this.setState({ loading: false, imgUrl: data.data });
        }


    }
	 imageFetch2 = async (url) => {
        this.setState({
            loading2: true
        });
        // var doc = {
        //     pictureStream:this.convertBase64UrlToBlob(url)
        // };
        var formData = new FormData();
        formData.append('pictureStream', this.convertBase64UrlToBlob(url), "file_" + Date.parse(new Date()) + ".png");
        var data = await fetch(util.upLoadUrl, {
            method: 'POST',
            // headers: {
            //     "Content-type":"application/x-www-form-urlencoded; charset=UTF-8"
            // },
            mode: 'cors',
            body: formData
        })
            .then(function (res) {
                return res.json();
            });
        if (data.status == 1) {

            this.setState({ loading2: false, imgUrl2: data.data });
        }


    }

    // 提交表单
    handleSubmit = (e) => {
        e.preventDefault();
        
        let formArr = this.props.form.getFieldsValue();

        let childSelectContent = this.state.childSelectContent;
		console.log(this.state.imgUrl);
		if (this.state.platformCode.length==0) {
            message.error('平台未选择');
            return;
        }
        if (this.state.imgUrl==''&&this.state.platformCode.indexOf("APP")>-1) {
            message.error('请添加移动客户端对应的图片!');
            return;
        }
        if (this.state.partCode==''&&this.state.adStyle=="AD_PART") {
            message.error('模块广告必须添加模块');
            return;
        }
        
        console.log(this.state.imgUrl2)
        console.log(this.state.platformCode.indexOf("HD"))
        if (this.state.imgUrl2==''&&this.state.platformCode.indexOf("HD")>-1) {
            message.error('请添加HD客户端对应的图片!');
            return;
        }
       
        //TODO:提交数据
        if (this.state.targetType == 'H5') {
            this.setState({
                searchId: '',
                searchPageName: 'h5页面',
                targetPage: this.props.form.getFieldsValue().h5TargetPage
            }, () => {

                this.onEdit(this.state.targetPage)
            });
        } else if (this.state.targetType == 'BOOK_DETAIL' || this.state.targetType == 'BOOK_PACKAGE_DETAIL'|| this.state.targetType == 'COURSE_DETAIL') {
            this.setState({
                searchId: '',
                searchPageName: this.state.searchTxt,
                targetPage: this.state.bookDetailUrl
            }, () => {

                if (this.state.targetType == 'BOOK_PACKAGE_DETAIL') {
                    if (this.state.bookPageThirdCode == "" && this.state.targetPage == "") {
                        message.error('请添加图书包!');
                    } else {
                        this.onEdit(this.state.targetPage)
                    }

                    return
                }
                if (this.state.targetPage == '' || this.state.targetPage == 'undefined' || this.state.targetPage == undefined) {
                    message.error('请添加图书!');
                }
                else {
                    this.onEdit(this.state.targetPage)
                }

            });
        }
        else {
            this.setState({
                searchId: childSelectContent[this.state.idx].searchId,
                searchPageName: childSelectContent[this.state.idx].searchName,
                targetPage: childSelectContent[this.state.idx].searchCode

            }, () => {

                this.onEdit(this.state.targetPage)
            });
        }

    }

    handleCancelPreview = () => this.setState({ previewVisible: false })
	handleCancelPreview2 = () => this.setState({ previewVisible2: false })
    handlePreview = (file) => {
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true,
        });
    }
	handlePreview2 = (file) => {
        this.setState({
            previewImage2: file.url || file.thumbUrl,
            previewVisible2: true,
        });
    }
    handleChange = ({ fileList }) => {
    	console.log(fileList)
        this.setState({ fileList,imgUrl:''}, () => {
            if(fileList.length==0){
                return ;
            }
            if (this.state.fileList[0].percent == 100) {
                let thumbUrl = this.state.fileList[0].thumbUrl;
                setTimeout(() => {
                    console.log('上传成功！');
                    this.imageFetch(thumbUrl);
                    return;
                }, 0)

            } else {
                console.log('上传失败！')
            }
        });

    }
	handleChange2 = ({ fileList }) => {
	
        this.setState({ fileList2:fileList,imgUrl2:''}, () => {
            if(fileList.length==0){
                return ;
            }
            if (this.state.fileList2[0].percent == 100) {
                let thumbUrl = this.state.fileList2[0].thumbUrl;
                setTimeout(() => {
                    console.log('上传成功！');
                    this.imageFetch2(thumbUrl);
                    return;
                }, 0)

            } else {
                console.log('上传失败！')
            }	
	        
        });

    }
    onEdit = async (targetPage) => {
    	//对H5页面校验
    	if(this.state.targetType=="H5"){
    		var str=/http\:\/\/|https\:\/\/|ellabook\:\/\/|ellabook2\:\/\//;
	    	if(!str.test(targetPage)){
				message.error('链接地址格式不正确！');
	    		return;
	    	}
    	}
        if (this.state.targetType2 == "AD_SINGLE") {
            var partCode = "";
        } else {
            var partCode = this.state.partCode
        }
        var doc = {
            bannerCode: this.state.status == 0 ? null : this.state.status,
            bannerTitle: this.props.form.getFieldsValue().bannerTitle,
            bannerDesc: this.props.form.getFieldsValue().bannerDesc,
            targetType: this.state.targetType,
            bannerImageUrl: encodeURIComponent(this.state.imgUrl),
            hdImageUrl:encodeURIComponent(this.state.imgUrl2),
            searchId: this.state.searchId,
            searchPageName: this.state.searchPageName,
            targetPage: encodeURIComponent(targetPage),
            adStyle: this.state.targetType2,
            partCode: partCode,
            shelvesFlag:this.state.shelvesFlag,
            platformCode:this.state.platformCode.join()
        };
        // TODO:如果类型是BOOK_PACKAGE图书包,并且图书包编码不为空那么
        if (this.state.targetType == "BOOK_PACKAGE_DETAIL" && this.state.bookPageThirdCode != "") {
            doc.targetPage = encodeURIComponent("ellabook2://package.book?packageCode=" + this.state.bookPageThirdCode + "&method=ella.book.getBookPackageBookListInfo");
            doc.targetType = "BOOK_PACKAGE_DETAIL";
            doc.searchPageName = this.state.searchGroupList.find(n => n.thirdCode == this.state.bookPageThirdCode).goodsName
        } else if (this.state.targetType == "BOOK_PACKAGE_DETAIL" && this.state.bookPageThirdCode == "") {
            doc.targetPage = encodeURIComponent(this.state.targetPage);
            doc.targetType = "BOOK_PACKAGE_DETAIL";
            doc.searchPageName = this.state.defauleName;
        }else if (this.state.targetType == "COURSE_DETAIL" && this.state.bookPageThirdCode == "") {
            doc.targetPage = encodeURIComponent(this.state.targetPage);
            doc.targetType = "COURSE_DETAIL";
            doc.searchPageName = this.state.defauleName;
        } else if (this.state.targetType == "COURSE_DETAIL" && this.state.bookPageThirdCode != "") {
            doc.targetPage = encodeURIComponent(this.state.targetPage);
            doc.targetType = "COURSE_DETAIL";
            doc.searchPageName = this.state.searchGroupList.find(n => n.courseCode == this.state.bookPageThirdCode).courseName
        }



        // return;
        var data = await fetch(util.url, {
            method: 'POST',
            headers: {
                "Content-type": "application/x-www-form-urlencoded"
            },
            mode: 'cors',
            body: "method=ella.operation.saveOperationAd" + "&content=" + JSON.stringify(doc) + commonData.dataString
        })
            .then(function (res) {
                return res.json()
            });
        if (data.status == 1) {
            message.success('操作成功!');
            if(this.state.status==0){
                setTimeout(() => {
                    hashHistory.push('/adBanner');
                }, 1000)
            }
            
        } else {
            message.error(data.message);
        }

    }

    bookDetailList = async (txt, n) => {
        this.setState({
            selectedRowKeys: [],
            tmpSelectdRowKeys: []
        })
        var doc = {
            text: txt,
            page: n,
            pageSize: 5
        }
        var data = await fetch(util.url, {
            method: 'POST',
            headers: {
                "Content-type": "application/x-www-form-urlencoded"
            },
            mode: 'cors',
            body: "method=ella.operation.getBookListByIdOrName" + "&content=" + JSON.stringify(doc) + commonData.dataString
        })
            .then(function (res) {
                return res.json();
            });

        this.setState({
            lists: data.data.bookList,
            total: data.data.total
        });

    }

    bookDetailSearch = () => {

        this.setState({
            searchTxt: this.props.form.getFieldsValue().bookDetailName,
            key: Math.random()
        }, () => {
            this.showModal();
            this.bookDetailList(this.props.form.getFieldsValue().bookDetailName, 0);
        });
    }
    showModal = () => {
        this.setState({
            visible: true,
        });
    }
    bannerBookHandleOk = (e) => {

        var tmp = this.state.tmpSelectdRowKeys;
        var i = tmp[0];
        if (tmp.length == 0) {
            message.error('请选择图书！');
            return;
        }
        if (this.state.total > 0) {
            this.setState({ bannerBookLoading: true, current: 1 });
            setTimeout(() => {
                this.setState({ bannerBookLoading: false, visible: false, bookDetailUrl: 'ellabook://detail.book?bookCode=' + this.state.lists[i].bookCode + '&method=ella.book.getBookByCode', searchTxt: this.state.lists[i].bookName }, () => {
                    this.props.form.setFieldsValue({
                        bookDetailName: this.state.searchTxt
                    })

                });
            }, 1000);

        } else {
            this.setState({
                visible: false
            });
        }

    }
    handleCancel = () => {
        this.setState({ visible: false });
    }
    onSelectChange = (selectedRowKeys) => {

        var tmp = this.state.tmpSelectdRowKeys;
        if (selectedRowKeys.length > 1) {
            message.error('每次只能选择一本图书！');
            return;
        }
        this.setState({
            selectedRowKeys: selectedRowKeys,
            tmpSelectdRowKeys: tmp.concat(selectedRowKeys)
        });
    }
    onPagnition = (current, pageSize) => {
        this.bookDetailList(this.state.searchTxt, current.current - 1);


    }
    // TODO:搜索图书包
    async fetchGoodGroup(str) {
        if(this.state.targetType=="BOOK_PACKAGE_DETAIL"){
        	var doc = {
	            "goodsManageSearchType": "goodsName",
	            "searchContent": str,
	            "goodsState": "SHELVES_ON",
	            "goodsType": "BOOK_PACKAGE",
	            "availableBookPackage": "YES",
	            "page": 0,
	            "pageSize": 1000
        	}
        	var _url="method=ella.operation.goodsManageList"+ "&content=" + JSON.stringify(doc) + commonData.dataString;
        }else{
        	var doc2= {
	            "courseName": "",
	            "goodsState": "SHELVES_ON"
       		}
        	var _url="method=ella.operation.getBookCourseList"+"&content=" + JSON.stringify(doc2) + commonData.dataString;
        }
        // TODO:地址连的mc的
        var data = await fetch(util.url, {
            mode: "cors",
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: _url
        }).then(res => res.json());

        if (!data.data) return; //搜索出null直接return防止报错
        this.setState({
            searchGroupList: data.data.list || []
        })
    }
     //平台下拉框数据
    async fetchPlatformList(fetchStr) {
        var data = await fetch(util.url, {
            mode: "cors",
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },

            body: "method=ella.operation.boxSearchList" + "&content=" + JSON.stringify({ "groupId": fetchStr }) + commonData.dataString

        }).then(res => res.json())
        var cur=data.data.filter(item => item.searchCode != 'GUSHIJI');
        
        this.setState({
			platformList:cur.map((item, index) => {
				return {
				
					["label"]: item.searchName,
					["value"]: item.searchCode
				}
			})
		
          
        },()=>{
        	console.log(this.state.platformList)
        }
        )
    }   
    render() {
        const columns = [{
            title: '图书标题',
            width: '30%',
            dataIndex: 'bookName'
        }, {
            title: '图书编码',
            width: '20%',
            dataIndex: 'bookCode'
        }, {
            title: '出版时间',
            width: '30%',
            dataIndex: 'publishTime'
        }, {
            title: '图书状态',
            width: '20%',
            render: (text, record) => {
                if (record.goodsState == 'SHELVES_OFF') {
                    return (
                        <span>未上架</span>
                    )
                } else {
                    return (
                        <span>已上架</span>
                    )
                }

            }
        }];
        const { previewVisible, previewImage,previewVisible2, previewImage2, fileList,fileList2, visible, bannerBookLoading } = this.state;
        const uploadButton = (
            <div className="upLoad-center">
                <Icon type="plus" />
            </div>
        );
        const { getFieldDecorator } = this.props.form

        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 20 }
        }

        const { selectedRowKeys } = this.state

        const rowSelection = {
            selectedRowKeys,
            type: 'radio',
            onChange: this.onSelectChange
        }

        const bannerBookPagination = {
            total: this.state.total,
            showSizeChanger: false,
            pageSize: 5,
            defaultCurrent: this.state.current
        }

        return (
            <div>
                <p className="m-title"><Link to={window.location.href.indexOf('indexInit') > -1 ? '/index' : "/adBanner"} style={{ color: "#666" }}><Icon type="left" />{this.state.status == 0 ? '添加新横幅广告' : '编辑新横幅广告'}</Link></p>
                <div className="m-rt-content">
                    <div className='m-lt' style={{ width: 400 }}>
                    	<div>
                    		<div style={{"marginBottom":"10"}}>移动客户端690*230</div>
	                        <Spin spinning={this.state.loading} tip="图片上传中...">
	                            <div className='m-lt-upload'>
	                                <Upload
	                                    action="//jsonplaceholder.typicode.com/posts/"
	                                    listType="picture-card"
	                                    fileList={fileList}
	                                    onPreview={this.handlePreview}
	                                    onChange={this.handleChange}
	
	                                >
	                                    {fileList.length >= 1 ? null : uploadButton}
	                                </Upload>
	                            </div>
	                        </Spin>
	                        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancelPreview}>
	                            <img alt="example" style={{ width: '100%' }} src={previewImage} />
	                        </Modal>
						</div>
						<div style={{"marginTop":"10px"}}>
							<div style={{"marginBottom":"10"}}>HD客户端1720*320</div>
	                        <Spin spinning={this.state.loading2} tip="图片上传中...">
	                            <div className='m-lt-upload'>
	                                <Upload
	                                    action="//jsonplaceholder.typicode.com/posts/"
	                                    listType="picture-card"
	                                    fileList={fileList2}
	                                    onPreview={this.handlePreview2}
	                                    onChange={this.handleChange2}
	
	                                >
	                                    {fileList2.length >= 1 ? null : uploadButton}
	                                </Upload>
	                            </div>
	                        </Spin>
	                        <Modal visible={previewVisible2} footer={null} onCancel={this.handleCancelPreview2}>
	                            <img alt="example" style={{ width: '100%' }} src={previewImage2} />
	                        </Modal>
						</div>
                    </div>
                    <Form horizontal onSubmit={this.handleSubmit}>
                        <div className='m-rt'>
                            <FormItem
                                id="control-input2"
                                label="图片标题"
                                {...formItemLayout}
                                required>
                                {getFieldDecorator('bannerTitle', {
                                    initialValue: this.state.bannerTitle,
                                    rules: [{ required: true, message: '名称不能为空' }],
                                })(
                                    <Input />
                                )}
                            </FormItem>
                            <FormItem
                                id="control-textarea"
                                label="图片简介"
                                {...formItemLayout}>
                                {getFieldDecorator('bannerDesc', {
                                    initialValue: this.state.bannerDesc,
                                    rules: [{ required: true, message: '名称不能为空' }],
                                })(
                                    <Input type="textarea" id="control-textarea2" rows="3" />
                                )}

                            </FormItem>
                            <Row className="row ant-form-item">
						 		<Col span={4} className="ant-form-item-required" style={{"color": "rgba(0,0,0,.85)","padding-left":"6px","line-height":"28px"}}>平台选择:</Col>
                                <Col span={18}>
                                    <CheckboxGroup
                                        options={this.state.platformList}
                                        value={this.state.platformCode}
                                      	onChange={(v) => {
                                            this.setState({
                                                platformCode: v
                                            },()=>{
	                                        	console.log(this.state.platformCode)
	                                        })
                                        }}
                                    />
                                </Col>
                            </Row>
                            <FormItem
                                id="control-textarea"
                                label="样式选择"
                                {...formItemLayout}>
                                <div>
                                    {this.state.select2}

                                    {this.state.content2}


                                </div>
                            </FormItem>
                            
                            <FormItem
                                id="control-textarea"
                                label="链接目标"
                                {...formItemLayout}>
                                <div>
                                    {this.state.select1}

                                    {this.state.content}
                                    {getFieldDecorator('h5TargetPage', {
                                        initialValue: this.state.h5TargetPage,
                                        rules: [{ required: true, message: '名称不能为空' }],
                                    })(
                                        <Input style={this.state.h5Flag} className="f-mt-24" />
                                    )}

                                </div>
                            </FormItem>
                            {/* TODO: 新加的 */}
                            <Row>
                                <Col offset={4}>
                                    {
                                        this.state.targetType == 'BOOK_PACKAGE_DETAIL'
                                            ?
                                            <Select
                                                showSearch
                                                style={{ width: 200 }}
                                                placeholder="搜索图书包"
                                                optionFilterProp="children"
                                                onChange={(v) => { console.log({ "abc": v }); this.setOneKV("bookPageThirdCode", v); }}
                                                onSearch={(e) => { this.fetchGoodGroup(e) }}
                                                onFocus={() => { this.fetchGoodGroup("") }}
                                                // notFoundContent="123" 
                                                defaultValue={this.state.defauleName}
                                            >
                                                {/* <Option value="jack">Jack</Option>
                                                <Option value="lucy">Lucy</Option>
                                                <Option value="tom">Tom</Option> */}
                                                {
                                                    this.state.searchGroupList.map(item => {
                                                        return <Option value={item.thirdCode}>{item.goodsName}</Option>
                                                    })
                                                }
                                            </Select>
                                            : null
                                    }
                                </Col>
                                <Col>
                                    {/* <span>
                                        {this.state.targetType == "BOOK_PACKAGE" ? "ellabook2://package.book?packageCode=" + this.state.bookPageThirdCode + "&method=ella.book.getBookPackageBookListInfo" : ""}
                                    </span> */}
                                </Col>
                            </Row>
                             <Row>
                                <Col offset={4}>
                                    {
                                        this.state.targetType == 'COURSE_DETAIL'
                                            ?
                                            <Select
                                                showSearch
                                                style={{ width: 200 }}
                                                placeholder="搜索图书包"
                                                optionFilterProp="children"
                                                onChange={(v) => { console.log({ "abc": v }); this.setOneKV2("bookPageThirdCode", v); }}
                                                onSearch={(e) => { this.fetchGoodGroup(e) }}
                                                onFocus={() => { this.fetchGoodGroup("") }}
                                                // notFoundContent="123" 
                                                defaultValue={this.state.defauleName}
                                            >
                                             
                                                {
                                                    this.state.searchGroupList.map(item => {
                                                        return <Option value={item.courseCode}>{item.courseName}</Option>
                                                    })
                                                }
                                            </Select>
                                            : null
                                    }
                                </Col>
                                <Col>
                                    {/* <span>
                                        {this.state.targetType == "BOOK_PACKAGE" ? "ellabook2://package.book?packageCode=" + this.state.bookPageThirdCode + "&method=ella.book.getBookPackageBookListInfo" : ""}
                                    </span> */}
                                </Col>
                            </Row>
                            <FormItem {...formItemLayout} style={this.state.bookDetailFlag}>
                                {getFieldDecorator('bookDetailName', {
                                    initialValue: this.state.searchTxt
                                })(
                                    <Input style={{ width: 200, marginLeft: 85 }} />
                                )}
                                <Button onClick={this.bookDetailSearch}><Icon type="search" /></Button>
                            </FormItem>


                            <FormItem wrapperCol={{ span: 12, offset: 4 }} style={{ marginTop: 24 }}>
                                <Button type="primary" htmlType="submit" style={{ "width": "100px" }}>保存</Button>

                            </FormItem>
                        </div>

                    </Form>
                </div>
                <div className='su-pop'>
                    <Modal
                        key={this.state.key}
                        visible={visible}
                        title="图书选择"
                        onOk={this.handleOk}
                        onCancel={this.handleCancel}
                        footer=
                        {[
                            <Button key="back" size="large" onClick={this.handleCancel}>取消</Button>,
                            <Button key="submit" type="primary" size="large" loading={bannerBookLoading} onClick={this.bannerBookHandleOk}>确定</Button>
                        ]}
                    >
                        <Table columns={columns} dataSource={this.state.lists} bordered pagination={bannerBookPagination} onChange={this.onPagnition} className="t-nm-tab" rowSelection={rowSelection} />
                    </Modal>
                </div>
            </div>
        )
    }
}

myForm = Form.create()(myForm)

export default myForm