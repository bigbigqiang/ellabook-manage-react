import React from 'react';
import { Row, Col, Card, Icon, Button, Table, Input, Upload, Modal, Checkbox, DatePicker, notification, message, Tooltip, Select } from "antd";
import { Link } from 'react-router';
import getUrl from "../../util.js";
import commonData from '../../commonData.js';
import "./add.css"
import Template from "./daysH5.js"
import Editor from "../../editor/editor.js";
const confirm = Modal.confirm;
const { TextArea } = Input;
export default class addGoods extends React.Component {
  constructor() {
    super()
    this.state = {
      previewVisible: false,
      previewImage: '',
      fileList: [
        //默认数据
        // {
        //   uid: -1,
        //   name: 'xxx.png',
        //   status: 'done',
        //   url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        // }
      ],
      titleImg: null,
      isInsert: false,
      visible: false,
      dailyTitle: "",
      dailyContent: "",
      dailyImg: "",
      dailyDesc: "",
      effectDate: "",
      targetPage: "",
      authorName: "",
      previewSrc: "",     //预览地址
      allList: [],//这是拉取的所有数据列表
      allList2: [],
      bookSearchList: [],    //这是展示的搜索列表

      bookSelectList: [],     //这是选择的结果列表
      bookSelectCodeList: [],  //这里是选择的bookCode列表用来提交的

      goodsType: "BOOK",
      targetTypeList: []

    };
  }
  componentDidMount() {
    this.TargetTypeList();
    this.fetchBookList();
    this.fetchBookPack();

  }
  //拉取链接类型列表
  async TargetTypeList() {
    var data = await fetch(getUrl.url, {
      mode: "cors",
      method: "POST",
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: "method=ella.operation.boxSearchList" + "&content=" + JSON.stringify({

        groupId: "DAILY_BOOK_TARGET_BOX"
      }) + commonData.dataString
    }).then(res => res.json())
    this.setState({
      targetTypeList: data.data,
    })

  }
  // TODO:搜索图书包
  async fetchBookPack() {
    var doc = {
      "goodsManageSearchType": "goodsName",
      "searchContent": '',
      "goodsState": "SHELVES_ON",
      "goodsType": "BOOK_PACKAGE",
      "availableBookPackage": "YES",
      "page": 0,
      "pageSize": 2000
    }
    var _url = "method=ella.operation.goodsManageList" + "&content=" + JSON.stringify(doc) + commonData.dataString;

    var data = await fetch(getUrl.url, {
      mode: "cors",
      method: "POST",
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: _url
    }).then(res => res.json());

    if (!data.data) return;
    for (var i = 0; i < data.data.list.length; i++) {
      data.data.list[i].bookCode = data.data.list[i].thirdCode;
      data.data.list[i].bookName = data.data.list[i].goodsName;
    }
    this.setState({
      allList2: data.data.list
    })

  }
  ///////////////////////获取图书列表//////////////////
  async fetchBookList() {

    // var bookList = [];

    var doc = {
      text: '',
      page: 0,
      pageSize: 2000,
      type: "SEARCH_ALL"
    }
    var data = await fetch(getUrl.url, {
      mode: "cors",
      method: "POST",
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: "method=ella.operation.getBookListByIdOrName" + "&content=" + JSON.stringify(doc) + commonData.dataString
    }).then(res => res.json())
    this.setState({
      allList: data.data.bookList,
      bookSearchList: [
        data.data.bookList.map(item => {
          return <Option key={item.bookCode}>{item.bookName}</Option>
        })
      ]
    })

  }
  //图书包列表
  async fetchBookBagList(value) {
    var doc = {
      goodsManageSearchType: 'goodsName',
      searchContent: value,
      goodsState: 'SHELVES_ON',
      goodsType: 'BOOK_PACKAGE',
      availableBookPackage: 'YES',
      page: 0,
      pageSize: 2000,
    }
    var data = await fetch(getUrl.url, {
      mode: "cors",
      method: "POST",
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: "method=ella.operation.goodsManageList" + "&content=" + JSON.stringify(doc) + commonData.dataString
    }).then(res => res.json())
    this.setState({
      allList: data.data.list,
      bookBagSearchList: [
        data.data.list.map(item => {
          return <Option key={item.goodsCode}>{item.goodsName}</Option>
        })
      ]
    })

  }
  ///////////////////////获取选择的图书列表//////////////////
  getBookSelectList(v) {
    console.log(v + "2")
    var bookSelectList = [];
    var bookSelectCodeList = [];
    if (this.state.goodsType == "BOOK") {
      var allList = this.state.allList;
      console.log(allList)
      v.forEach(item => {
        var result = allList.find(v => v.bookCode == item)


        bookSelectList.push(result)
        bookSelectCodeList.push(result.bookCode)
      })
    } else {
      var allList = this.state.allList2;

      var result = allList.find(v2 => v2.bookCode == v)


      bookSelectList.push(result)
      bookSelectCodeList.push(result.bookCode)

    }

    this.setState({
      bookSelectList,
      bookSelectCodeList
    })



  }


  //////////////////////保存模态框////////////////////////

  showConfirm(str) {
    var _this = this;
    confirm({
      title: str == "PUSH_YES" ? '请确认是否保存并推送该每日绘本文章?' : '请确认是否保存该每日绘本文章的草稿',
      // content: `你点的是${str == "PUSH_YES" ? "保存并推送" : "保存草稿"}!!!确定之后就要提交服务器了`,
      // cancelText: '取消',
      okText: '确定',
      okType: 'primary',
      cancelText: '继续编辑',
      onOk() {
        _this.storeContent(str);
      },
      onCancel() {

      },
    });
  }



  //////////////////////保存模态框////////////////////////
  // 勾选框事件图片插入正文
  isShowIndex(tf) {


    this.setState({
      isInsert: tf ? true : false,
    })
  }
  isSetReleaseTime(e) {

  }
  // 获取发布时间
  getReleaseTime(date, dateString) {
    this.setState({
      effectDate: dateString
    })

  }

  ///////////////////////////////文本图片上传////////////////////////////////////////////
  handleCancel1 = () => this.setState({ previewVisible: false })
  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }
  handleChange = ({ fileList }) => {
    this.setState({ fileList, titleImg: "", dailyImg: "" }, () => {
      if (fileList.length == 0) {
        return;
      }
      // Blah blah

      let thumbUrl = this.state.fileList[0].thumbUrl || null;


      if (this.state.fileList[0].percent == 100) {
        setTimeout(() => {

          this.imageFetch(thumbUrl);
          return;
        }, 0)

      } else {

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

    var type = urlData.split(',')[0].split(':')[1].split(';')[0];
    return new Blob([ab], { type: type });

  }
  imageFetch = async (url) => {
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

      this.setState({ titleImg: data.data, dailyImg: data.data });
    }


  }
  ///////////////////////////////文本图片上传////////////////////////////////////////////
  // 获取预览数据
  getContent(k, v) {
    this.setState({
      [k]: v
    })
  }
  //当失去焦点时限制输入数字
  BriefIntroduce2(k, v) {

    if (v.length > 30) {
      var cur = v.substring(0, 30);
      this.setState({
        [k]: cur
      })
      notification.error({
        message: '输入错误',
        description: '简介不能超过30个中文字符!',
      })

    }


  }
  //获取简介信息
  BriefIntroduce(k, v) {

    this.setState({
      [k]: v
    })
  }
  //////////////////////////////////保存/////////////////////////////////////////
  storeContent(str) {
    this.storeFetch(str)

  }
  storeFetch = async (publishFlag) => {
    //实现数组的深拷贝
    let bookSelectList = JSON.parse(JSON.stringify(this.state.bookSelectList));
    console.log(bookSelectList)
    if (this.state.goodsType == 'BOOK') {
      //解决内容中有单双引号页面空白问题
      bookSelectList.forEach((item, index, input) => {
        input[index].bookIntroduction = encodeURI(item.bookIntroduction.replace(/'/g, '&apos;'));

        input[index].tags = encodeURI(item.tags.replace(/'/g, '&apos;'));


      })
      console.log(bookSelectList);
    }


    var titleImgSrc = this.state.isInsert ? "<img class='coverImg' src=" + this.state.dailyImg + " alt='推荐图书' />" : "";


    if (this.state.goodsType == 'BOOK') {
      // <<<<<<< HEAD
      //       var sHtmlCode = "<!DOCTYPE html><html lang='en'><head><meta charset='UTF-8'><meta name='format-detection' content='telephone=no'><meta name='apple-mobile-web-app-capable' content='yes'><meta name='apple-mobile-web-app-status-bar-style' content='black'><meta name='viewport' content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0,minimum-scale=1.0'><title>每日读绘本</title><script src='https://cdn.bootcss.com/jquery/3.2.1/jquery.min.js'></script><style type='text/css'>    html {      font-family: 'Helvetica Neue', Helvetica, sans-serif;      -webkit-text-size-adjust: 100%;      -webkit-tap-hightlight-color: transparent;      -webkit-user-select: none;      -webkit-tap-highlight-color: rgba(0, 0, 0, 0);    }    body {      overflow-x: hidden;      -webkit-overflow-scrolling: touch;      font-size: 0.3rem;      background-color: #f6f6f6;    }    * {      margin: 0;      padding: 0;      -webkit-box-sizing: border-box;      box-sizing: border-box;    }    ul,    li {      list-style: none;    }    a {      display: block;      width: 100%;      text-decoration: none;      color: #666;    }    .clearfix {      position: relative;    }    .clearfix:after {      content: '';      display: block;      width: 100%;      height: 0;      clear: both;    }    #wrapper {      width: 100%;      max-width: 640px;      min-width: 300px;      margin: 0 auto;      padding: 24px;      color: #434345;    }    #wrapper .info {      padding: 5px 0;      font-size: 12px;    }    #wrapper .title {            font-size: 24px;      padding-bottom: 5px;      font-weight: bold;    }    #wrapper .time,    #wrapper .author {      padding-left: 5px;      color: #999;    }    #wrapper .author {      color: #6a95c1;    }    #wrapper .content {      color: #676769;      padding-top: 0.5rem;      font-size: 14px;    }    #wrapper .content img {      max-width: 100%;    }    #wrapper .cover .coverImg {      display: block;      max-width: 100%;      margin: 5px auto 0;    }    #wrapper .recommend {      padding-top: 10px;    }    #wrapper .recommend .item {      margin-top: 20px;      padding: 12px 12px 6px 11px;      position: relative;      background-color: white;      box-shadow: 1px 2px 3px #eee;    }    #wrapper .recommend .item .label {            overflow: hidden;      height: 27px;      font-size: 13px;    }    #wrapper .recommend .item .label>i {      color: #AAAAAA;      border: 1px solid #D8D8D8;      border-radius: 20px;      padding: 2px 5px;      margin-right: 2px;      font-style: normal;      display: inline-block;      margin-bottom: 50px;            font-size: 12px;    }    #wrapper .recommend .bookCover {      float: left;      width: 35%;      display: block;          }    #wrapper .recommend .bookRight {      float: right;      width: 65%;      padding: 0 0 0 15px;    }    #wrapper .recommend .bookRight .titleH3 {      font-size: 16px;      font-weight: normal;      margin-bottom: 2px;            font-weight: normal;      margin-bottom: 5px;      text-overflow: ellipsis;      white-space: nowrap;      overflow: hidden;      color: #333333;    }    #wrapper .recommend .bookRight .synopsis {                  font-size: 12px;            display: -webkit-box;      -webkit-box-orient: vertical;      -webkit-line-clamp: 3;      overflow: hidden;      color: #888;    }    #wrapper .recommend .bookRight .details {           width:98px; float:right;margin-top:15px;      border: 1px solid #40D8B1;      padding: 5px 20px;      border-radius: 20px;      color: #40D8B1;      font-size: 14px;      display: block;    }    .btn_share_Wrap {      width: 100%;      text-align: center;      padding: 80px 0px 120px 0px;    }    #btn_share {      border: 0px solid #40d8b0;      color: #40d8b0;      background-color: rgba(0, 0, 0, 0);      background-image: url(http://download.ellabook.cn/btn.png); background-repeat:no-repeat;     background-size: 100%;      width:267px;      height: 73px;      text-align: center;      line-height: 40px;      border-radius: 5px;    }</style><script type='text/javascript'>    // document.documentElement.style.fontSize = document.documentElement.clientWidth / 10 + 'px';    document.title = '每日读绘本';</script></head><body><div id='wrapper'><header class='title'>" + this.state.dailyTitle + "</header><figure class='info'><span class='time'>" + this.state.effectDate.split(" ")[0] + "</span><span class='author'>" + this.state.authorName.replace(/"/g, '&quot;') + "</span></figure><article><section class='cover'>        " + titleImgSrc + "</section><section class='content'>        " + decodeURIComponent(this.state.dailyContent) + "</section><section class='recommend'><ul id='itemContent'></ul></section></article><div class='btn_share_Wrap'><button id='btn_share'></button></div></div><script type='text/javascript'>    $(function () {      var list = " + JSON.stringify(bookSelectList).replace(/\"/g, '\'') + ";      for (var i = 0; i< list.length; i++) {        var obj = list[i];        var li = $('<li></li>'),          a = $('<a></a>'),          img = $('<img src=' + list[i].bookResourceList[0].ossUrl + ' />'),          div = $('<div></div>'),          h3 = $('<h3>' + list[i].bookName + '</h3>'),          ul = $('<ul></ul>'),          p = $('<p>' + decodeURI(list[i].bookIntroduction) + '</p>'),          span = $('<span>查看详情</span>');        $(h3).appendTo($(div));        $(ul).appendTo($(div));        $(p).appendTo($(div));        $(span).appendTo($(div));        $(div).appendTo($(a));        $(img).appendTo($(a));        $(a).appendTo($(li));        $('#itemContent').append($(li));        $('#itemContent li').addClass('item');        $('#itemContent li a').addClass('clearfix');        $('#itemContent li a').eq(i).attr({          id: 'Link',          href: 'ellabook2://detail.book?bookCode=' + obj.bookCode + '&method=ella.book.getBookByCode'        });        $('#itemContent li a img').addClass('bookCover');        $('#itemContent li a div').addClass('bookRight');        $('#itemContent li a div h3').addClass('titleH3');        $('#itemContent li a div ul').addClass('label');        $('#itemContent li a div p').addClass('synopsis');        $('#itemContent li a div span').addClass('details');        if(obj.tags!=''){var tagsH = obj.tags.split(',');        for (var j = 0; j< tagsH.length; j++) {          var tagHtml = $('<i>' + decodeURI(tagsH[j]) + '</i>');          $('.label').eq(i).append($(tagHtml));      }  }      }      $('.clearfix').bind('click', function () {        routeToTargetPage(this)      });      $('#btn_share').bind('click', function () {        routeToTargetPage2();      });      function routeToTargetPage2() {        var u = navigator.userAgent;        var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;        if (isAndroid) {          window.WebView.showSharePop(decodeURIComponent(decodeURIComponent(window.location.href)));        } else {          window.webkit.messageHandlers.showSharePop.postMessage(decodeURIComponent(decodeURIComponent(window.location.href)));        }      }      function routeToTargetPage(_this) {        var href = _this.href;        console.log(href);        var u = navigator.userAgent;        var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;        if (isAndroid) {          window.WebView.routeToTargetPage(href);          _this.href = 'javascript:void(0)';          setTimeout(function () {            _this.href = href;          }, 50)        }      }    })</script></body></html>";

      //     }else{

      //       var sHtmlCode = "<!DOCTYPE html><html lang='en'><head><meta charset='UTF-8'><meta name='format-detection' content='telephone=no'><meta name='apple-mobile-web-app-capable' content='yes'><meta name='apple-mobile-web-app-status-bar-style' content='black'><meta name='viewport' content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0,minimum-scale=1.0'><title>每日读绘本</title><script src='https://cdn.bootcss.com/jquery/3.2.1/jquery.min.js'></script><style type='text/css'>        html {            font-family: 'Helvetica Neue', Helvetica, sans-serif;            -webkit-text-size-adjust: 100%;            -webkit-tap-hightlight-color: transparent;            -webkit-user-select: none;            -webkit-tap-highlight-color: rgba(0, 0, 0, 0);        }        body {            overflow-x: hidden;            -webkit-overflow-scrolling: touch;            font-size: 0.3rem;            background-color: #f6f6f6;        }        * {            margin: 0;            padding: 0;            -webkit-box-sizing: border-box;            box-sizing: border-box;        }        ul,        li {            list-style: none;        }        a {            display: block;            width: 100%;            text-decoration: none;            color: #666;        }        .clearfix {            position: relative;            min-height: 146px;        }        .clearfix:after {            content: '';            display: block;            width: 100%;            height: 0;            clear: both;        }        #wrapper {            width: 100%;            max-width: 640px;            min-width: 300px;            margin: 0 auto;            padding: 24px;            color: #434345;        }        #wrapper .info {            padding: 5px 0;            font-size: 12px;        }        #wrapper .title {            font-size: 24px;            padding-bottom: 5px;            font-weight: bold;        }        #wrapper .time,        #wrapper .author {            padding-left: 5px;            color: #999;        }        #wrapper .author {            color: #6a95c1;        }        #wrapper .content {            color: #676769;            padding-top: 0.5rem;            font-size: 14px;        }        #wrapper .content img {            max-width: 100%;        }        #wrapper .cover .coverImg {            display: block;            max-width: 100%;            margin: 5px auto 0;        }        #wrapper .recommend {            padding-top: 10px;        }        #wrapper .recommend .item {            margin-top: 20px;            padding: 12px 12px 6px 11px;            position: relative;            background-color: white;            box-shadow: 1px 2px 3px #eee;        }        #wrapper .recommend .item .label {            overflow: hidden;            height: 27px;            font-size: 13px;        }        #wrapper .recommend .item .label>i {            color: #AAAAAA;            border: 1px solid #D8D8D8;            border-radius: 20px;            padding: 2px 5px;            margin-right: 2px;            font-style: normal;            display: inline-block;            margin-bottom: 50px;            font-size: 12px;        }        #wrapper .recommend .bookCover {            float: left;            width: 35%;            display: block;        }        #wrapper .recommend .bookRight {            float: right;            width: 65%;            padding: 0 0 0 15px;        }        #wrapper .recommend .bookRight .titleH3 {            font-size: 16px;            font-weight: normal;            margin-bottom: 2px;            font-weight: normal;            margin-bottom: 5px;            text-overflow: ellipsis;            white-space: nowrap;            overflow: hidden;            color: #333333;        }        #wrapper .recommend .bookRight .synopsis {            font-size: 12px;            display: -webkit-box;            -webkit-box-orient: vertical;            -webkit-line-clamp: 3;            overflow: hidden;            color: #888;        }                #wrapper .recommend .bookRight .bookNum {            font-size: 12px;            display: -webkit-box;            -webkit-box-orient: vertical;            -webkit-line-clamp: 3;            overflow: hidden;            color: #888;            margin-top: 1rem        }                #wrapper .recommend .bookRight .priceBox {            position: absolute;            bottom: 6px;        }        #wrapper .recommend .bookRight .details {            position: absolute;            bottom: -1px;            right: 0.2rem;            border: 1px solid #40D8B1;            padding: 5px 20px;            border-radius: 20px;            color: #40D8B1;            font-size: 14px;            display: block;        }        #wrapper .recommend .bookRight .priceTxt {            display: inline-block;            color: #40d8b0;            font-size: 18px;            font-weight: bold;        }        #wrapper .recommend .bookRight .invalidTxt {            display: inline-block;            text-decoration: line-through;            color: #ddd;            margin-left: 6px;font-size:12px;        }        .btn_share_Wrap {            width: 100%;            text-align: center;            padding: 80px 0px 120px 0px;        }        #btn_share {            border: 0px solid #40d8b0;            color: #40d8b0;            background-color: rgba(0, 0, 0, 0);            background-image: url(http://download.ellabook.cn/btn.png); background-repeat:no-repeat;           background-size: 100%;             width:267px;            height: 73px;            text-align: center;            line-height: 40px;            border-radius: 5px;        }</style><script type='text/javascript'>    // document.documentElement.style.fontSize = document.documentElement.clientWidth / 10 + 'px';    document.title = '每日读绘本';</script></head><body><div id='wrapper'><header class='title'>" + this.state.dailyTitle + "</header><figure class='info'><span class='time'>" + this.state.effectDate.split(" ")[0] + "</span><span class='author'>" + this.state.authorName + "</span></figure><article><section class='cover'> " + titleImgSrc + "</section><section class='content'> " + decodeURIComponent(this.state.dailyContent) + "</section><section class='recommend'><ul id='itemContent'></ul></section></article><div class='btn_share_Wrap'><button id='btn_share'></button></div></div><script type='text/javascript'>        $(function () {         var list = " + JSON.stringify(this.state.bookSelectList).replace(/\"/g, '\'') + ";         for (var i = 0; i< list.length; i++) {             var obj = list[i];            var li = $('<li></li>'),            a = $('<a></a>'),            img = $('<img src=' + list[i].firstBookImageUrl + ' />'),            div = $('<div></div>'), h3 = $('<h3>' + list[i].bookName + '</h3>'),            p = $('<p>全系列（共' + list[i].bookNum + '本）</p>'),            span = $('<label><h4>' + list[i].goodsPrice + '咿啦币</h4><h5>' + list[i].goodsSrcPrice + '咿啦币</h5></label>');             $(h3).appendTo($(div));            $(p).appendTo($(div));            $(span).appendTo($(div));             $(div).appendTo($(a));            $(img).appendTo($(a));             $(a).appendTo($(li));            $('#itemContent').append($(li));            $('#itemContent li').addClass('item');            $('#itemContent li a').addClass('clearfix');            $('#itemContent li a').eq(i).attr({                 id: 'Link',                 href: 'ellabook2://package.book?packageCode=' + obj.bookCode + '&method=ella.book.getBookPackageBookListInfo'             });            $('#itemContent li a img').addClass('bookCover');             $('#itemContent li a div').addClass('bookRight');            $('#itemContent li a div h3').addClass('titleH3');             $('#itemContent li a div p').addClass('bookNum');             $('#itemContent li a div label').addClass('priceBox');             $('#itemContent li a div h4').addClass('priceTxt');            $('#itemContent li a div h5').addClass('invalidTxt');        }         $('.clearfix').bind('click', function () { routeToTargetPage(this) });        $('#btn_share').bind('click', function () { routeToTargetPage2(); });        function routeToTargetPage2() {            var u = navigator.userAgent;            var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;            if (isAndroid) {                window.WebView.showSharePop(decodeURIComponent(decodeURIComponent(window.location.href)));            } else {                window.webkit.messageHandlers.showSharePop.postMessage(decodeURIComponent(decodeURIComponent(window.location.href)));            }         }         function routeToTargetPage(_this) {             var href = _this.href;            console.log(href);            var u = navigator.userAgent;            var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;            if (isAndroid) {                 window.WebView.routeToTargetPage(href);                _this.href = 'javascript:void(0)';                setTimeout(function () { _this.href = href; }, 50)             }         }     })</script></body></html>";
      // =======
      var sHtmlCode = "<!DOCTYPE html><html lang='en'><head><meta charset='UTF-8'><meta name='format-detection' content='telephone=no'><meta name='apple-mobile-web-app-capable' content='yes'><meta name='apple-mobile-web-app-status-bar-style' content='black'><meta name='viewport' content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0,minimum-scale=1.0'><title>每日读绘本</title><script src='https://cdn.bootcss.com/jquery/3.2.1/jquery.min.js'></script><style type='text/css'>    html {      font-family: 'Helvetica Neue', Helvetica, sans-serif;      -webkit-text-size-adjust: 100%;      -webkit-tap-hightlight-color: transparent;      -webkit-user-select: none;      -webkit-tap-highlight-color: rgba(0, 0, 0, 0);    }    body {      overflow-x: hidden;      -webkit-overflow-scrolling: touch;      font-size: 0.3rem;      background-color: #f6f6f6;    }    * {      margin: 0;      padding: 0;      -webkit-box-sizing: border-box;      box-sizing: border-box;    }    ul,    li {      list-style: none;    }    a {      display: block;      width: 100%;      text-decoration: none;      color: #666;    }    .clearfix {      position: relative;    }    .clearfix:after {      content: '';      display: block;      width: 100%;      height: 0;      clear: both;    }    #wrapper {      width: 100%;     max-width:729px;   margin: 0 auto;      padding: 24px;      color: #434345;    }    #wrapper .info {      padding: 5px 0;      font-size: 12px;    }    #wrapper .title {            font-size: 24px;      padding-bottom: 5px;      font-weight: bold;    }    #wrapper .time,    #wrapper .author {      padding-left: 5px;      color: #999;    }    #wrapper .author {      color: #6a95c1;    }    #wrapper .content {      color: #676769;      padding-top: 0.5rem;      font-size: 14px;    }    #wrapper .content img {      max-width: 100%;    }    #wrapper .cover .coverImg {      display: block;      max-width: 100%;      margin: 5px auto 0;    }    #wrapper .recommend {      padding-top: 10px;    }    #wrapper .recommend .item {      margin-top: 20px;      padding: 12px 12px 6px 11px;      position: relative;      background-color: white;      box-shadow: 1px 2px 3px #eee;    }    #wrapper .recommend .item .label {            overflow: hidden;      height: 27px;      font-size: 13px;    }    #wrapper .recommend .item .label>i {      color: #AAAAAA;      border: 1px solid #D8D8D8;      border-radius: 20px;      padding: 2px 5px;      margin-right: 2px;      font-style: normal;      display: inline-block;      margin-bottom: 50px;            font-size: 12px;    }    #wrapper .recommend .bookCover {      float: left;      width: 35%;      display: block;          }    #wrapper .recommend .bookRight {      float: right;      width: 65%;      padding: 0 0 0 15px;    }    #wrapper .recommend .bookRight .titleH3 {      font-size: 16px;      font-weight: normal;      margin-bottom: 2px;            font-weight: normal;      margin-bottom: 5px;      text-overflow: ellipsis;      white-space: nowrap;      overflow: hidden;      color: #333333;    }    #wrapper .recommend .bookRight .synopsis {                  font-size: 12px;            display: -webkit-box;      -webkit-box-orient: vertical;      -webkit-line-clamp: 3;      overflow: hidden;      color: #888;    }    #wrapper .recommend .bookRight .details {           width:98px; float:right;margin-top:15px;      background:#40D8B1;      padding: 5px 20px;      border-radius: 20px;      color: #fff;      font-size: 14px;      display: block;    }    .btn_share_Wrap {      width: 100%;      text-align: center;      padding: 80px 0px 120px 0px;    }    #btn_share {      border: 0px solid #40d8b0;      color: #40d8b0;      background-color: rgba(0, 0, 0, 0);      background-image: url(http://download.ellabook.cn/btn.png); background-repeat:no-repeat;     background-size: 100%;      width:267px;      height: 73px;      text-align: center;      line-height: 40px;      border-radius: 5px; outline: none;   }</style><script type='text/javascript'>    // document.documentElement.style.fontSize = document.documentElement.clientWidth / 10 + 'px';    document.title = '每日读绘本';</script></head><body><div id='wrapper'><header class='title'>" + this.state.dailyTitle + "</header><figure class='info'><span class='time'>" + this.state.effectDate.split(" ")[0] + "</span><span class='author'>" + this.state.authorName.replace(/"/g, '&quot;') + "</span></figure><article><section class='cover'>        " + titleImgSrc + "</section><section class='content'>        " + decodeURIComponent(this.state.dailyContent) + "</section><section class='recommend'><ul id='itemContent'></ul></section></article><div class='btn_share_Wrap'><button id='btn_share'></button></div></div><script type='text/javascript'>    $(function () {      var list = " + JSON.stringify(bookSelectList).replace(/\"/g, '\'') + ";      for (var i = 0; i< list.length; i++) {        var obj = list[i];        var li = $('<li></li>'),          a = $('<a></a>'),          img = $('<img src=' + list[i].bookResourceList[0].ossUrl + ' />'),          div = $('<div></div>'),          h3 = $('<h3>' + list[i].bookName + '</h3>'),          ul = $('<ul></ul>'),          p = $('<p>' + decodeURI(list[i].bookIntroduction) + '</p>'),          span = $('<span>查看详情</span>');        $(h3).appendTo($(div));        $(ul).appendTo($(div));        $(p).appendTo($(div));        $(span).appendTo($(div));        $(div).appendTo($(a));        $(img).appendTo($(a));        $(a).appendTo($(li));        $('#itemContent').append($(li));        $('#itemContent li').addClass('item');        $('#itemContent li a').addClass('clearfix');        $('#itemContent li a').eq(i).attr({          id: 'Link',          href: 'ellabook2://detail.book?bookCode=' + obj.bookCode + '&method=ella.book.getBookByCode'        });        $('#itemContent li a img').addClass('bookCover');        $('#itemContent li a div').addClass('bookRight');        $('#itemContent li a div h3').addClass('titleH3');        $('#itemContent li a div ul').addClass('label');        $('#itemContent li a div p').addClass('synopsis');        $('#itemContent li a div span').addClass('details');        if(obj.tags!=''){var tagsH = obj.tags.split(',');        for (var j = 0; j< tagsH.length; j++) {          var tagHtml = $('<i>' + decodeURI(tagsH[j]) + '</i>');          $('.label').eq(i).append($(tagHtml));      }  }      }      $('.clearfix').bind('click', function () {        routeToTargetPage(this)      });      $('#btn_share').bind('click', function () {        routeToTargetPage2();      });      function routeToTargetPage2() {        var u = navigator.userAgent;        var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;        if (isAndroid) {          window.WebView.showSharePop(decodeURIComponent(decodeURIComponent(window.location.href)));        } else {          window.webkit.messageHandlers.showSharePop.postMessage(decodeURIComponent(decodeURIComponent(window.location.href)));        }      }      function routeToTargetPage(_this) {        var href = _this.href;        console.log(href);        var u = navigator.userAgent;        var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;        if (isAndroid) {          window.WebView.routeToTargetPage(href);          _this.href = 'javascript:void(0)';          setTimeout(function () {            _this.href = href;          }, 50)        }      }    })</script></body></html>";

    } else {

      var sHtmlCode = "<!DOCTYPE html><html lang='en'><head><meta charset='UTF-8'><meta name='format-detection' content='telephone=no'><meta name='apple-mobile-web-app-capable' content='yes'><meta name='apple-mobile-web-app-status-bar-style' content='black'><meta name='viewport' content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0,minimum-scale=1.0'><title>每日读绘本</title><script src='https://cdn.bootcss.com/jquery/3.2.1/jquery.min.js'></script><style type='text/css'>        html {            font-family: 'Helvetica Neue', Helvetica, sans-serif;            -webkit-text-size-adjust: 100%;            -webkit-tap-hightlight-color: transparent;            -webkit-user-select: none;            -webkit-tap-highlight-color: rgba(0, 0, 0, 0);        }        body {            overflow-x: hidden;            -webkit-overflow-scrolling: touch;            font-size: 0.3rem;            background-color: #f6f6f6;        }        * {            margin: 0;            padding: 0;            -webkit-box-sizing: border-box;            box-sizing: border-box;        }        ul,        li {            list-style: none;        }        a {            display: block;            width: 100%;            text-decoration: none;            color: #666;        }        .clearfix {            position: relative;            min-height: 146px;        }        .clearfix:after {            content: '';            display: block;            width: 100%;            height: 0;            clear: both;        }        #wrapper {            width: 100%;           margin: 0 auto; max-width:729px;           padding: 24px;            color: #434345;        }        #wrapper .info {            padding: 5px 0;            font-size: 12px;        }        #wrapper .title {            font-size: 24px;            padding-bottom: 5px;            font-weight: bold;        }        #wrapper .time,        #wrapper .author {            padding-left: 5px;            color: #999;        }        #wrapper .author {            color: #6a95c1;        }        #wrapper .content {            color: #676769;            padding-top: 0.5rem;            font-size: 14px;        }        #wrapper .content img {            max-width: 100%;        }        #wrapper .cover .coverImg {            display: block;            max-width: 100%;            margin: 5px auto 0;        }        #wrapper .recommend {            padding-top: 10px;        }        #wrapper .recommend .item {            margin-top: 20px;            padding: 12px 12px 6px 11px;            position: relative;            background-color: white;            box-shadow: 1px 2px 3px #eee;        }        #wrapper .recommend .item .label {            overflow: hidden;            height: 27px;            font-size: 13px;        }        #wrapper .recommend .item .label>i {            color: #AAAAAA;            border: 1px solid #D8D8D8;            border-radius: 20px;            padding: 2px 5px;            margin-right: 2px;            font-style: normal;            display: inline-block;            margin-bottom: 50px;            font-size: 12px;        }        #wrapper .recommend .bookCover {            float: left;            width: 35%;            display: block;        }        #wrapper .recommend .bookRight {            float: right;            width: 65%;            padding: 0 0 0 15px;        }        #wrapper .recommend .bookRight .titleH3 {            font-size: 16px;            font-weight: normal;            margin-bottom: 2px;            font-weight: normal;            margin-bottom: 5px;            text-overflow: ellipsis;            white-space: nowrap;            overflow: hidden;            color: #333333;        }        #wrapper .recommend .bookRight .synopsis {            font-size: 12px;            display: -webkit-box;            -webkit-box-orient: vertical;            -webkit-line-clamp: 3;            overflow: hidden;            color: #888;        }                #wrapper .recommend .bookRight .bookNum {            font-size: 12px;            display: -webkit-box;            -webkit-box-orient: vertical;            -webkit-line-clamp: 3;            overflow: hidden;            color: #888;            margin-top: 1rem        }                #wrapper .recommend .bookRight .priceBox {            position: absolute;            bottom: 6px;        }        #wrapper .recommend .bookRight .details {            position: absolute;            bottom: -1px;            right: 0.2rem;            background:#40D8B1;            padding: 5px 20px;            border-radius: 20px;            color: #fff;            font-size: 14px;            display: block;        }        #wrapper .recommend .bookRight .priceTxt {            display: inline-block;            color: #40d8b0;            font-size: 18px;            font-weight: bold;        }        #wrapper .recommend .bookRight .invalidTxt {            display: inline-block;            text-decoration: line-through;            color: #ddd;            margin-left: 6px;font-size:12px;        }        .btn_share_Wrap {            width: 100%;            text-align: center;            padding: 80px 0px 120px 0px;        }        #btn_share {            border: 0px solid #40d8b0;            color: #40d8b0;            background-color: rgba(0, 0, 0, 0);            background-image: url(http://download.ellabook.cn/btn.png); background-repeat:no-repeat;           background-size: 100%;             width:267px;            height: 73px;            text-align: center;            line-height: 40px;            border-radius: 5px;   outline: none;     }</style><script type='text/javascript'>    // document.documentElement.style.fontSize = document.documentElement.clientWidth / 10 + 'px';    document.title = '每日读绘本';</script></head><body><div id='wrapper'><header class='title'>" + this.state.dailyTitle + "</header><figure class='info'><span class='time'>" + this.state.effectDate.split(" ")[0] + "</span><span class='author'>" + this.state.authorName + "</span></figure><article><section class='cover'> " + titleImgSrc + "</section><section class='content'> " + decodeURIComponent(this.state.dailyContent) + "</section><section class='recommend'><ul id='itemContent'></ul></section></article><div class='btn_share_Wrap'><button id='btn_share'></button></div></div><script type='text/javascript'>        $(function () {         var list = " + JSON.stringify(this.state.bookSelectList).replace(/\"/g, '\'') + ";         for (var i = 0; i< list.length; i++) {             var obj = list[i];            var li = $('<li></li>'),            a = $('<a></a>'),            img = $('<img src=' + list[i].firstBookImageUrl + ' />'),            div = $('<div></div>'), h3 = $('<h3>' + list[i].bookName + '</h3>'),            p = $('<p>全系列（共' + list[i].bookNum + '本）</p>'),            span = $('<label><h4>' + list[i].goodsPrice + '咿啦币</h4><h5>' + list[i].goodsSrcPrice + '咿啦币</h5></label>');             $(h3).appendTo($(div));            $(p).appendTo($(div));            $(span).appendTo($(div));             $(div).appendTo($(a));            $(img).appendTo($(a));             $(a).appendTo($(li));            $('#itemContent').append($(li));            $('#itemContent li').addClass('item');            $('#itemContent li a').addClass('clearfix');            $('#itemContent li a').eq(i).attr({                 id: 'Link',                 href: 'ellabook2://package.book?packageCode=' + obj.bookCode + '&method=ella.book.getBookPackageBookListInfo'             });            $('#itemContent li a img').addClass('bookCover');             $('#itemContent li a div').addClass('bookRight');            $('#itemContent li a div h3').addClass('titleH3');             $('#itemContent li a div p').addClass('bookNum');             $('#itemContent li a div label').addClass('priceBox');             $('#itemContent li a div h4').addClass('priceTxt');            $('#itemContent li a div h5').addClass('invalidTxt');        }         $('.clearfix').bind('click', function () { routeToTargetPage(this) });        $('#btn_share').bind('click', function () { routeToTargetPage2(); });        function routeToTargetPage2() {            var u = navigator.userAgent;            var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;            if (isAndroid) {                window.WebView.showSharePop(decodeURIComponent(decodeURIComponent(window.location.href)));            } else {                window.webkit.messageHandlers.showSharePop.postMessage(decodeURIComponent(decodeURIComponent(window.location.href)));            }         }         function routeToTargetPage(_this) {             var href = _this.href;            console.log(href);            var u = navigator.userAgent;            var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;            if (isAndroid) {                 window.WebView.routeToTargetPage(href);                _this.href = 'javascript:void(0)';                setTimeout(function () { _this.href = href; }, 50)             }         }     })</script></body></html>";
      // >>>>>>> e429dc5c666f139af32c5bc7797fd0bfb64f2261

    }

    var targetPage = await fetch(getUrl.upFileUrl, {
      method: 'POST',
      headers: {
        "Content-type": "application/x-www-form-urlencoded"
      },
      mode: 'cors',
      body: "content=" + JSON.stringify({ fileContent: encodeURIComponent(sHtmlCode) }) + commonData.dataString

    }).then(function (res) {
      return res.json();
    });

    if (publishFlag == "preview") {
      this.setState({
        previewSrc: targetPage.data
      })
      return
    }

    if (this.state.effectDate == "") {
      notification.error({
        message: '输入错误',
        description: '请检查你的输入情况!',
      })
      return


    }

    if (this.state.bookSelectCodeList.length == 0) {
      notification.error({
        message: '输入错误',
        description: '请添加商品',
      })
      return

    }
    if (this.state.dailyDesc == "") {
      notification.error({
        message: '输入错误',
        description: '绘本简介不能为空',
      })
      return

    }

    var doc = {
      dailyTitle: this.state.dailyTitle,
      //////////////////////////////此处两次encodeURIComponent///////////////////////
      dailyContent: encodeURIComponent(encodeURIComponent(this.state.dailyContent)),
      dailyImg: encodeURIComponent(this.state.dailyImg),
      effectDate: this.state.effectDate,
      // TODO:在此处拼链接
      targetPage: encodeURIComponent(targetPage.data + '?shareUrl=' + targetPage.data + '&shareType=SS201805211029598152&isShare=1&shareTitle=' + this.state.dailyTitle),
      authorName: this.state.authorName,
      // bookCode: this.state.bookSelectCodeList.join(','),
      bookCode: this.state.bookSelectCodeList.join(','),
      publishFlag,

      goodsType: this.state.goodsType,
      dailyDesc: encodeURIComponent(this.state.dailyDesc)

    };

    var data = await fetch(getUrl.url, {
      method: 'POST',
      headers: {
        "Content-type": "application/x-www-form-urlencoded"
      },
      mode: 'cors',
      body: "method=ella.operation.saveOrUpdateDaily" + "&content=" + JSON.stringify(doc) + commonData.dataString
    })
      .then(function (res) {
        return res.json();
      });

    if (data.status == 1) {
      notification.success({
        message: '保存成功',
        description: '回到上级菜单',
      })
      window.history.back();
    }
  }
  ////////////////////////////////预览/////////////////////////////////////////////////
  showModal = () => {
    this.storeFetch("preview");
    this.setState({
      visible: true,
    });
  }
  handleOk = (e) => {

    this.setState({
      visible: false,
    });
  }
  handleCancel = (e) => {

    this.setState({
      visible: false,
    });
  }
  handleSelectChange = (value) => {

    if (value.key == "BOOK") {
      var curData = this.state.allList;
    } else {
      var curData = this.state.allList2;
    }

    this.setState({
      goodsType: value.key,
      bookSelectCodeList: [],

      bookSearchList: [
        curData.map(item => {
          return <Option key={item.bookCode}>{item.bookName}</Option>
        })
      ]
    });


  }
  ////////////////////////////////预览/////////////////////////////////////////////////

  render() {
    //////////////样式myself/////////////////// 
    const title = {
      lineHeight: "50px",
      borderBottom: "1px solid #e3e6e6",
      textIndent: "8px",
      fontSize: "16px"
    }
    const back = {
      paddingRight: "8px"
    }
    const box = {
      padding: "40px 20px 20px 20px"
    }
    const font_color = {
      color: "#242424"
    }
    const marginBottom = {
      marginBottom: "20px"
    }
    const release = {
      margin: "10px 0px"
    }
    const lineHeight_30 = {
      lineHeight: "30px",
      minWidth: "80px"
    }
    //////////////样式/////////////////// 
    const { editorContent, editorState } = this.state;
    //提交图片
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );

    return <div className="add_daily">
      <h2 style={title}><Link style={font_color} to="/remittance" ><Icon style={back} type="left" />增加每日绘本</Link></h2>
      <div style={box}>
        <Row>
          <Col span={8} style={{ minWidth: "470px" }}>
            <Row >
              <Col style={{}} span={3}>
                封面
                </Col>
              <Col span={8}>
                <div className="clearfix">
                  <Upload
                    action="//jsonplaceholder.typicode.com/posts/"
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={this.handlePreview}
                    onChange={this.handleChange}
                    onRemove={() => { this.setState({ titleImg: null, dailyImg: "" }) }}
                  >
                    {fileList.length >= 1 ? null : uploadButton}
                  </Upload>
                  <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel1}>
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                  </Modal>
                </div>
              </Col>
            </Row>
            <Row>
              <Col offset={3}>
                <Tooltip placement="top" title={"是否显示封面图"}>
                  <Checkbox className="checkText" onChange={(e) => { this.isShowIndex(e.target.checked) }}>插入正文</Checkbox>
                </Tooltip>
              </Col>
            </Row>
          </Col>
          <Col span={16}>
            <Row style={{ ...marginBottom }}>
              <Col style={{ ...lineHeight_30 }} span={1}>标题</Col>
              <Col span={6}><Input onChange={(e) => { this.getContent("dailyTitle", e.target.value) }} placeholder="请输入标题" /></Col>
            </Row>
            <Row>
              <Col style={{ ...lineHeight_30 }} span={1}>作者</Col>

              <Col span={6}><Input onChange={(e) => { this.getContent("authorName", e.target.value) }} placeholder="请输入作者" /></Col>
            </Row>
            <Row style={{ "margin-top": "20px" }}>
              <Col style={{ ...lineHeight_30 }} span={1}>简介</Col>
              <Col span={6}>
                <TextArea id="control-textarea2" rows={3} value={this.state.dailyDesc} onBlur={(e) => { this.BriefIntroduce2("dailyDesc", e.target.value) }} onChange={(e) => { this.BriefIntroduce("dailyDesc", e.target.value) }} />
              </Col>
            </Row>
            <Row>
              <Col style={{ margin: "20px 0px 0px 80px" }} span={20} className="gutter-row" >
                <Editor style={{ width: "600px" }} titleImg={this.state.isInsert ? this.state.titleImg : null} getContent={this.getContent.bind(this)} ></Editor>
              </Col>
            </Row>
            <Row style={{ ...marginBottom }}>
              <Col style={{ ...lineHeight_30 }} span={1} >
                推荐商品
                </Col>
              <Col span={2} style={{ "min-width": "120px" }}>
                <Select labelInValue showArrow style={{ width: '120' }} defaultValue={{ key: "BOOK" }} onChange={this.handleSelectChange}>
                  {
                    this.state.targetTypeList.map(item => {
                      return <Option value={item.searchCode}>{item.searchName}</Option>
                    })
                  }
                </Select>
              </Col>

              <Col span={6} offset={1}>
                {
                  this.state.goodsType == "BOOK" ?
                    <Select
                      mode="multiple"
                      style={{ width: '100%' }}
                      onChange={(v) => { this.getBookSelectList(v) }}

                      value={this.state.bookSelectCodeList}
                      tokenSeparators={[',']}
                      placeholder="搜索并选择数据"
                      filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}

                    >
                      {this.state.bookSearchList}
                    </Select>
                    : <Select
                      showSearch
                      style={{ width: '100%' }}

                      onChange={(v) => { this.getBookSelectList(v) }}
                      value={this.state.bookSelectCodeList}
                      // tokenSeparators={[',']}
                      placeholder="搜索并选择图书包"
                      filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    >
                      {this.state.bookSearchList}
                    </Select>
                }
              </Col>
            </Row>

            <Row style={{ ...release }}>
              <Col style={{ ...lineHeight_30 }} span={1}>
                {/*<Checkbox onChange={this.isSetReleaseTime}>定时发布</Checkbox>*/}
                定时发布
                </Col>
              <Col span={6}>
                <DatePicker
                  style={{ width: "100%" }}
                  showTime={{ format: 'HH:mm' }}

                  format="YYYY-MM-DD HH:mm:ss"
                  placeholder={['请输入发布时间']}
                  onChange={(value, dateString) => { this.getReleaseTime(value, dateString) }}
                />
                {/*<DatePicker onChange={this.getReleaseTime} />*/}
              </Col>

            </Row>
            <Row style={{ marginTop: "50px" }}>
              <Col span={3} offset={4}>
                <Button className="three_btn" onClick={this.showModal} style={{ width: "100%" }} type="primary">预览</Button>
                <Modal
                  className="showHtml"
                  title="预览效果图,以手机上为准"
                  visible={this.state.visible}
                  onOk={this.handleOk}
                  onCancel={this.handleCancel}
                >
                  {/*<Template effectDate={this.state.effectDate} dailyImg={this.state.dailyImg} dailyContent={this.state.dailyContent} dailyTitle={this.state.dailyTitle} authorName={this.state.authorName} isInsert={this.state.isInsert} bookList={this.state.bookSelectList} ></Template>*/}
                  <div className="previewWrap">
                    <iframe src={this.state.previewSrc}></iframe>
                  </div>
                </Modal>
              </Col>
              <Col span={3} offset={4}>
                {/*<Button onClick={()=>{this.storeContent("PUSH_YES")}} style={{width:"100%"}} type="primary">保存并推送</Button>*/}
                <Button className="three_btn" onClick={() => { this.showConfirm("PUSH_YES") }} style={{ width: "100%" }} type="primary">保存并推送</Button>
              </Col>
              <Col span={3} offset={4}>
                <Button className="three_btn" onClick={() => { this.showConfirm("PUSH_NO") }} style={{ width: "100%" }} type="primary">保存草稿</Button>
              </Col>
            </Row>
          </Col>
        </Row>

      </div>
    </div>
  }
}