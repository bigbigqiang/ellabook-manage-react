import React from 'react'
import { Upload, Icon, Form, Input, Select, Spin,Radio, Button, Modal, message, Table, Row, Col,Checkbox} from 'antd'
import { Link, hashHistory } from 'react-router'
import "./addBanner.css";
const FormItem = Form.Item
const RadioGroup = Radio.Group
const CheckboxGroup = Checkbox.Group;
const Option = Select.Option;
var util = require('../util.js');
import commonData from '../commonData.js'
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
class myForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: false,
            status: this.props.params.status,
            targetType: targetTypeData[0].key,
            bannerTitle: '',
            bannerDesc: '',
            previewVisible: false,
            previewImage: '',
            fileList: [],
            loading: false,
            bannerBookLoading: false,
            targetPage: '',
            searchId: '',
            childSelectContent: [],
            shelvesFlag:'',
            idx: 0,
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
            defauleName: "",        //上次编辑的内容
            channel:"",
            customChannel:[],
            channelItem:[],
            searchTxt:'',
            platformList:[],//平台下拉数据
            platformCode:[],//所选平台
            oneClickBuyStatus:"YES"
        }
        this.onPagnition = this.onPagnition.bind(this);
        this.fetchChannelItem();
        
    }
    // TODO:公共设置state函数
    setOneKV(k, v) {
        this.setState({
            [k]: v,
            bookDetailUrl:'ellabook2://package.book?packageCode='+v+'&method=ella.book.getBookPackageBookListInfo'
        })
    }
    setOneKV2(k, v) {
        this.setState({
            [k]: v,
            bookDetailUrl: 'ellabook2://detail.course?courseCode=' +v
            
        })
    }
    handleTargetTypeChange = (value) => {
        console.log(value);
        // if(this.state.targetType == 'BOOK_LIST' || this.state.targetType == 'SYSTEM_INTERFACE'){
        //
        //     // this.setState({
        //     //     searchId:childSelectContent[this.state.idx].searchId,
        //     //     searchPageName:childSelectContent[this.state.idx].searchName,
        //     //     targetPage:encodeURIComponent(childSelectContent[this.state.idx].searchCode)
        //     // });
        // }
        this.selectFetchFn(value.key);
        this.setState({
            targetType: value.key,
            targetKey: value.key,
            targetValue: value.label
        });
    }
    handleTargetPageChange = (value) => {
        console.log(value);
        this.setState({
            searchPageName: value.label,
            idx: value.key,
            searchId: this.state.childSelectContent[value.key].searchId
        });
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
			})+commonData.dataString
		}).then(res => res.json())
		console.log(data);
		this.setState({
			channelItem: data.data.map((item, index) => {
					return {
						...item,
						["label"]: item.name,
						["value"]: item.code
					}
				})
		})
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
            body: "method=ella.book.getOperationBannerInfo" + "&content=" + JSON.stringify(doc) + commonData.dataString
        })
            .then(function (res) {
                return res.json();
            });
        console.log('编辑', data.data);
        // this.selectFetchFn(data.data.targetType);
		
                    
        if (data.data.targetType == 'BOOK_LIST') {
            this.setState({
                targetValue: targetTypeData[0].value,
                targetKey: targetTypeData[0].key
            })
            this.selectBox(0);
            console.log('targetType0:', this.state.targetValue);
        }
        if (data.data.targetType == 'SYSTEM_INTERFACE') {
            this.setState({
                targetValue: targetTypeData[1].value,
                targetKey: targetTypeData[1].key
            })
            this.selectBox(1);
            console.log('targetType1:', this.state.targetValue);

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

        // console.log(JSON.stringify(this.state.targetType));
        if(data.data.shelvesFlag){
			var _shelvesFlag=data.data.shelvesFlag;
		}else{
			var _shelvesFlag="";
		}
        this.setState({
            targetType: data.data.targetType,
            // previewImage:data.data.bannerImageUrl,
            fileList: [{
                uid: -1,
                name: 'xxx.png',
                status: 'done',
                url: data.data.bannerImageUrl,
            }],
            data: data.data,
            bannerTitle: data.data.bannerTitle,
            bannerDesc: data.data.bannerDesc,
            searchId: data.data.searchId,
            searchPageName: data.data.searchPageName,
            targetPage: data.data.targetPage,
            bookDetailUrl: data.data.targetPage,
            idx: 0,
            imgUrl: data.data.bannerImageUrl,
            h5TargetPage: data.data.targetPage,
            searchTxt: data.data.searchPageName,
            shelvesFlag:_shelvesFlag,
            channel:((data.data.channelCodes!= "ios" &&data.data.channelCodes!= "android" &&data.data.channelCodes!= "all")?'custom':data.data.channelCodes),
            customChannel: ((data.data.channelCodes != "ios" && data.data.channelCodes!= "android" &&data.data.channelCodes!= "all") ? data.data.channelCodes.split(',') : []),
            platformCode:data.data.platformCode.split(","),
            // oneClickBuyStatus:data.data.oneClickBuyStatus
            // imageUrl:data.data.bannerImageUrl
        });

        console.log(JSON.stringify(data));
    }

    selectBox = (n) => {
        console.log('key:' + targetTypeData[n].key);
        this.setState({
            select1: (
                <Select labelInValue defaultValue={{ key: targetTypeData[n].key }} style={{ width: 120 }} onChange={this.handleTargetTypeChange}>
                    {
                        targetTypeData.map((item, index) => {
                            return <Option value={item.key} key={item.key}>{item.value}</Option>
                        })
                    }
                </Select>
            )
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
        console.log(this.state.searchId);
        if (targetType == 'BOOK_LIST' || targetType == 'SYSTEM_INTERFACE') {
            this.setState({
                childSelectContent: data.data,
                idx: this.state.status == 0 ? 0 : this.state.idx,
                content: (<Select labelInValue defaultValue={{ key: this.state.idx }} style={{ width: 120, marginLeft: 10 }} onChange={this.handleTargetPageChange}>
                    {
                        data.data.map((item, index) => {
                            return <Option value={index} key={index}>{item.searchName}</Option>
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
        }
        else if (targetType == 'H5') {
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

    componentDidMount() {
        if (this.state.status != 0) {
            this.fetchFn();
        } else {
            this.selectBox(0);
            this.selectFetchFn(targetTypeData[0].key);

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
        console.log('type:' + urlData.split(',')[0].split(':')[1].split(';')[0]);
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
            console.log(data);
            this.setState({ loading: false, imgUrl: data.data });
        }

        console.log(JSON.stringify(data.data));
    }


    // 提交表单
    handleSubmit = (type,e) => {
        console.log(type)
        e.preventDefault();
        let formArr = this.props.form.getFieldsValue();
       
        let childSelectContent = this.state.childSelectContent;
        if (this.state.imgUrl == undefined) {
            message.error('请添加图片!');
            return;
        }
        if (this.state.channel=="") {
            message.error('未选择渠道');
            return;
        }
        if (this.state.channel == 'custom' && this.state.customChannel.length == 0) {
            message.error('自定义渠道未选择');
            return;
        }
        if (this.state.platformCode.length==0) {
            message.error('平台未选择');
            return;
        }
        //TODO:提交数据
        if (this.state.targetType == 'H5') {
        	
            this.setState({
                searchId: '',
                searchPageName: 'h5页面',
                targetPage: this.props.form.getFieldsValue().h5TargetPage
            }, () => {
              	
                this.onEdit(this.state.targetPage,type)
            });
        } else if (this.state.targetType == 'BOOK_DETAIL' || this.state.targetType == 'BOOK_PACKAGE_DETAIL'|| this.state.targetType == 'COURSE_DETAIL') {
           
            this.setState({
                searchId: '',
                searchPageName: this.state.searchTxt,
                targetPage: this.state.bookDetailUrl
            }, () => {
               
                if (this.state.targetPage == '' || this.state.targetPage == 'undefined' || this.state.targetPage == undefined) {
                	if(this.state.targetType == 'BOOK_PACKAGE_DETAIL'){
                		message.error('请添加图书包!');
                	}else if(this.state.targetType == 'BOOK_DETAIL'){
                		message.error('请添加图书!');
                	}else if(this.state.targetType == 'COURSE_DETAIL'){
                		message.error('请添加课程!');
                	}
                   
                }else {
                    this.onEdit(this.state.targetPage,type)
                }
				
            });
        }else {
            this.setState({
                searchId: childSelectContent[this.state.idx].searchId,
                searchPageName: childSelectContent[this.state.idx].searchName,
                targetPage: childSelectContent[this.state.idx].searchCode
            }, () => {
              
                this.onEdit(this.state.targetPage,type)
            });
        }


        // this.props.form.resetFields()
    }

    handleCancelPreview = () => this.setState({ previewVisible: false })

    handlePreview = (file) => {
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true,
        });
    }

    handleChange = ({ fileList }) => {
        this.setState({ fileList,imgUrl:""}, () => {
            if(fileList.length==0){
                return ;
            }
            console.log(fileList)
            let thumbUrl = this.state.fileList[0].thumbUrl;
            if (this.state.fileList[0].percent == 100) {
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

    onEdit = async (targetPage,type) => {
    	//对H5页面校验
    	if(this.state.targetType=="H5"){
    		var str=/http\:\/\/|https\:\/\/|ellabook\:\/\/|ellabook2\:\/\//;
	    	if(!str.test(targetPage)){
				message.error('链接地址格式不正确！');
	    		return;
	    	}
    	}
       	if(this.state.channel=="custom"){
       		var channelCodes=this.state.customChannel.join();
       	}else{
       		var channelCodes=this.state.channel;
       	}
       	var platformCode=this.state.platformCode.join();
       	console.log(platformCode)
        if(type==1){
            var shelvesFlag=this.state.shelvesFlag;
        }else{
            var shelvesFlag="SHELVES_ON"
        }
        var doc = {
            bannerCode: this.state.status == 0 ? null : this.state.status,
            bannerTitle: this.props.form.getFieldsValue().bannerTitle,
            bannerDesc: this.props.form.getFieldsValue().bannerDesc,
            targetType: this.state.targetType,
            bannerImageUrl: encodeURIComponent(this.state.imgUrl),
            searchId: this.state.searchId,
            searchPageName: this.state.searchPageName,
            targetPage: encodeURIComponent(targetPage),
            channelCodes:channelCodes,
            shelvesFlag:shelvesFlag,
            platformCode:platformCode,
            // oneClickBuyStatus:this.state.oneClickBuyStatus
            
        };
        // TODO:如果类型是BOOK_PACKAGE图书包,并且图书包编码不为空那么
        if (this.state.targetType == "BOOK_PACKAGE_DETAIL" && this.state.bookPageThirdCode != "") {
            doc.targetPage = encodeURIComponent(this.state.targetPage);
            doc.targetType = "BOOK_PACKAGE_DETAIL";
            doc.searchPageName = this.state.searchGroupList.find(n => n.thirdCode == this.state.bookPageThirdCode).goodsName
        } else if (this.state.targetType == "BOOK_PACKAGE_DETAIL" && this.state.bookPageThirdCode == "") {
            doc.targetPage = encodeURIComponent(this.state.targetPage);
            doc.targetType = "BOOK_PACKAGE_DETAIL";
            doc.searchPageName = this.state.defauleName;
        } else if (this.state.targetType == "COURSE_DETAIL" && this.state.bookPageThirdCode == "") {
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
            body: "method=ella.book.saveOperationBanner" + "&content=" + JSON.stringify(doc) + commonData.dataString
        })
            .then(function (res) {
                return res.json()
            });
            console.log(this.state.status)
            if (data.status == 1) {
                message.success('操作成功!');
                if(this.state.status==0){
                    setTimeout(() => {
                        hashHistory.push('/home/banner');
                    }, 1000)
                }
                
            } else {
                message.error(data.message);
            }
            console.log(JSON.stringify(data));
    }

    bookDetailList = async (txt, n) => {
    	console.log(txt);
        this.setState({
            selectedRowKeys: [],
            tmpSelectdRowKeys: []
        })
        var doc = {
            text: txt,
            "goodsState":'SHELVES_ON',
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
        // console.log("拉取列表", data.data)
        this.setState({
            lists: data.data.bookList,
            total: data.data.total
        });
        // console.log('data：', JSON.stringify(data.data));
    }

    bookDetailSearch = () => {
        console.log('图书详情：' + this.props.form.getFieldsValue().bookDetailName);
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
                    console.log('searchTxt:' + this.state.searchTxt);
                });
            }, 1000);
            console.log('list:' + JSON.stringify(this.state.lists));
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
        console.log('selectedRowKeys changed: ', selectedRowKeys);
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
        console.log('Current: ', current, '; PageSize: ', pageSize);

    }
    // TODO:搜索图书包
    async fetchGoodGroup(str) {
        
        // TODO:地址连的mc的
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
        var data = await fetch(util.url, {
            mode: "cors",
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: _url
        }).then(res => res.json());
        console.log({ "sdd": data.data })
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
    	console.log(this.state.platformList)
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
            dataIndex: 'goodsState',
            render: (text) => {
                switch (text) {
                    case 'SHELVES_ON':
                        return '已上架';
                    default:
                        return '-'
                }
            }
        }];
        const { previewVisible, previewImage, fileList, visible, bannerBookLoading } = this.state;
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
        const plainOptions = [
            { label: '360应用市场', value: 'c360' },
            { label: '应用宝', value: 'qq' },
            { label: '百度', value: 'baidu' },
            { label: 'oppo', value: 'oppo' },
            { label: '小米市场', value: 'xiaomi' },
            { label: 'vivo', value: 'vivo' },
            { label: '华为', value: 'huawei' },
        ];
        return (
            <div>
                
                <p className="m-title"><Link to='/home/banner'><Icon type="left" />{this.state.status == 0 ? '添加新banner图' : '编辑banner图'}</Link></p>
                <div className="m-rt-content">
                    <div className='m-lt' style={{ width: 400 }}>
                    	<div style={{"marginBottom":10}}>banner图尺寸:750*320</div>
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
                    <Form>
                        <div className='m-rt'>
                            <FormItem
                                id="control-input"
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
                                    <Input type="textarea" id="control-textarea" rows="3" />
                                )}

                            </FormItem>
                            

                            
                                {/*<FormItem
                                    {...formItemLayout}
                                    label="一键购买"
                                >
                                {getFieldDecorator('oneClickBuyStatus', {
                                    initialValue: this.state.oneClickBuyStatus,

                                })(
                                    <RadioGroup onChange={(e) =>{ 
                                        this.setState({
                                            oneClickBuyStatus: e.target.value
                                        
                                        })
                                        }}
                                        value={this.state.oneClickBuyStatus}>
                                        <Radio value="YES">支持</Radio>
                                        <Radio value="NO">不支持</Radio>
                                    </RadioGroup>
                                )}
                                    
                                </FormItem>*/}
                            
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
                            {this.state.targetType == 'BOOK_PACKAGE_DETAIL'?<Row style={{"marginBottom":"24px"}}>
                                <Col offset={4}>
                                    <Select
                                        showSearch
                                        style={{ width: 200 }}
                                        placeholder="搜索图书包"
                                        optionFilterProp="children"
                                        onChange={(v) => { console.log({ "abc": v }); this.setOneKV("bookPageThirdCode", v); }}
                                        onSearch={(e) => { this.fetchGoodGroup(e) }}
                                        onFocus={() => { this.fetchGoodGroup("") }}
                                        // notFoundContent="123" 
                                        defaultValue={this.state.defauleName||undefined}
                                    >
                                        {
                                            this.state.searchGroupList.map(item => {
                                                
                                                return <Option value={item.thirdCode} key={item.thirdCode}>{item.goodsName}</Option>
                                            })
                                        }
                                    </Select>
                                </Col>
                                </Row>
                                :null
                            }
                            {this.state.targetType == 'COURSE_DETAIL'?<Row style={{"marginBottom":"24px"}}>
                                <Col offset={4}>
                                    <Select
                                        showSearch
                                        style={{ width: 200 }}
                                        placeholder="搜索课程"
                                        optionFilterProp="children"
                                        onChange={(v) => { console.log({ "abc": v }); this.setOneKV2("bookPageThirdCode", v); }}
                                        onSearch={(e) => { this.fetchGoodGroup(e) }}
                                        onFocus={() => { this.fetchGoodGroup("") }}
                                        // notFoundContent="123" 
                                        defaultValue={this.state.defauleName||unundefined}
                                    >
                                        
                                        {
                                            this.state.searchGroupList.map(item => {
                                                return <Option value={item.courseCode} key={item.courseCode}>{item.courseName}</Option>
                                            })
                                        }
                                    </Select> 
                                </Col>
                            </Row>:null
                            }
                       		<FormItem {...formItemLayout} style={this.state.bookDetailFlag}>
                                {getFieldDecorator('bookDetailName', {
                                    initialValue: this.state.searchTxt
                                })(
                                    <Input style={{ width: 200, marginLeft: 85 }} />
                                )}
                                <Button onClick={this.bookDetailSearch}><Icon type="search" /></Button>
                            </FormItem>
							<Row className="row ant-form-item">
						 		<Col span={4} className="ant-form-item-required" style={{"color": "rgba(0,0,0,.85)","marginLeft":"3px","marginTop":"3px"}}>平台选择:</Col>
                                <Col offset={3}>
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
	                        <Row>
		                        <Col span={4} className="ant-form-item-required" style={{"color": "rgba(0,0,0,.85)","marginLeft":"3px"}}>渠道选择:</Col>

	                            <Col offset={3}>
	                                <RadioGroup
	                                    onChange={(e) => {
	                                        this.setState({
	                                            channel: e.target.value
	                                        })
	                                    }}
	                                    value={this.state.channel}>
	                                    <Radio value={"all"}>全部渠道</Radio>
	                                    <Radio value={"ios"}>仅IOS</Radio>
	                                    <Radio value={"android"}>仅Android</Radio>
	                                    <Radio value={"custom"}>自定义</Radio>
	                                </RadioGroup>
	                            </Col>
	                        
						 
		                        {
		                            this.state.channel == 'custom'
		                                ?
		                                <Row className="row" style={{"line-height":"25px"}}>
		                                    <Col offset={3}>请选择需要的渠道名称(可多选):</Col>
		                                </Row>
		                                :
		                                null
		                        }
		                        {
		                            this.state.channel == 'custom'
		                                ?
		                                <Row className="row">
		                                    <Col offset={3}>
		                                        <CheckboxGroup
		                                            options={this.state.channelItem}
		                                            value={this.state.customChannel}
		                                            onChange={(v) => {
		                                               
		                                                this.setState({
		                                                    
		                                                     customChannel: v
		                                                    
		                                                })
		                                            }} />
		                                    </Col>
		                                </Row>
		                                :
		                                null
		                        }
                      		</Row>

                            <FormItem wrapperCol={{ span: 24}} style={{ "marginTop": "24px","textAlign":"center" }}>
                                <Button type="primary" onClick={this.handleSubmit.bind(this,1)} className="buttonWidth" style={{"marginRight":"30px"}}>保存</Button>
                                <Button type="primary" onClick={this.handleSubmit.bind(this,2)} className="buttonWidth">保存并上线</Button>
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