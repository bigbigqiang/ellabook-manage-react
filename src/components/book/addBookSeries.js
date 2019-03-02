import React from 'react'
import { Link,hashHistory} from 'react-router'
import { Form, Input, Row, Col, Button, Select,Table, Icon, message,Spin, Modal,Popconfirm,Radio,InputNumber,Upload,Progress} from 'antd';
import './addBookSeries.css';
import { CommonAddBook } from "../commonAddBook.js"

var util = require('../util.js');
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group
const { TextArea } = Input;
import { DragDropContext, DragSource, DropTarget } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
function dragDirection(
  dragIndex,
  hoverIndex,
  initialClientOffset,
  clientOffset,
  sourceClientOffset,
) {
  const hoverMiddleY = (initialClientOffset.y - sourceClientOffset.y) / 2;
  const hoverClientY = clientOffset.y - sourceClientOffset.y;
  if (dragIndex < hoverIndex && hoverClientY > hoverMiddleY) {
    return 'downward';
  }
  if (dragIndex > hoverIndex && hoverClientY < hoverMiddleY) {
    return 'upward';
  }
}
//拖拽
class BodyRow extends React.Component {
  render() {
    const {
      isOver,
      connectDragSource,
      connectDropTarget,
      moveRow,
      dragRow,
      clientOffset,
      sourceClientOffset,
      initialClientOffset,
      ...restProps
    } = this.props;
    const style = { ...restProps.style, cursor: 'move' };

    let className = restProps.className;
    if (isOver && initialClientOffset) {
      const direction = dragDirection(
        dragRow.index,
        restProps.index,
        initialClientOffset,
        clientOffset,
        sourceClientOffset
      );
      if (direction === 'downward') {
        className += ' drop-over-downward';
      }
      if (direction === 'upward') {
        className += ' drop-over-upward';
      }
    }

    return connectDragSource(
      connectDropTarget(
        <tr
          {...restProps}
          className={className}
          style={style}
        />
      )
    );
  }
}

const rowSource = {
    beginDrag(props) {
        return {
            index: props.index,
        };
    }
};

const rowTarget = {
    drop(props, monitor) {
        const dragIndex = monitor.getItem().index;
        const hoverIndex = props.index;
        if (dragIndex === hoverIndex) {
            return;
        }

        props.moveRow(dragIndex, hoverIndex);
        monitor.getItem().index = hoverIndex;
    }
};

const DragableBodyRow = DropTarget('row', rowTarget, (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    sourceClientOffset: monitor.getSourceClientOffset(),
}))(
    DragSource('row', rowSource, (connect, monitor) => ({
        connectDragSource: connect.dragSource(),
        dragRow: monitor.getItem(),
        clientOffset: monitor.getClientOffset(),
        initialClientOffset: monitor.getInitialClientOffset(),
  }))(BodyRow)
);

class Demo extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            seriesCode: this.props.params.seriesCode,//'BS201801190324'
            taskWallList:[],
            seriesName:'',//合集名称
            previewVisible: false,
            previewImage: '',
            fileList: [],
            fileList2: [],
            previewVisible2: false,
            previewImage2: '',
            screenshot:'',

            fileList3: [],
            previewVisible3: false,
            previewImage3: '',
            screenshot2:'',

            fileList4: [],
            previewVisible4: false,
            previewImage4: '',
            screenshot3:"",
            loading: false,
            resources:[],//视频
            books:[
                {
                  
                   
                    bookCode:'',
                    bookIndex:1,
                },
                {
                  
                    bookCode:'',
                    bookIndex:2
                },
            ],
            visible:false,
            status: this.props.params.status,
            bookletNum:'2',
            keyword:'',
            bookIntroduction:'',//合集简介
            seriesType:'SAME_DIVERSITY',
            bookletType:'V1_V2',
            disabled:false,
            videoSrc:'',//合集视频地址
            vidoeState:"上传",
            videoInfor: 0,
            videoWord: '',
            videoPrecentShow: false,
            progressShow:false,
            videoPrecent: 0,
            videoStates: "active",
            coverResource:'',//合集封面
            tags:""



        }
        this.upVideo.bind(this)

    }
    
    componentDidMount() {
        if(this.state.status=="edit"){
            this.fethBookCollecDetail()
        }
        // var arr=[
        //     {
        //         "num":"5.00"
        //     },
        //     {
        //         "num":"5.00"
        //     }
        // ]
        // const score=arr.reduce((prev, cur) =>prev + parseFloat(cur.num), 0) / arr.length;
        // console.log(score)
    }
    //任务墙详情数据
    fethBookCollecDetail(){
        util.API({seriesCode:this.state.seriesCode},"ella.operation.getBookSeriesInfo")
		.then(response=>response.json())
		.then(response=>{
			if(response.status==1){
                var bookletType=response.data.bookletType;
                var books=response.data.books;
                var bookletNum=response.data.bookletNum;
                var curbooks=[];
               
                for(var i=0;i<bookletNum;i++){
                    console.log(books.filter((item)=>item.bookletName==i+1))
                    var _books=books.filter((item)=>{
                        if(bookletType=="V1_V2"){
                            var cur2=item.bookletName=="上"?0:1
                             
                             
                         }else if(bookletType=="V1_V2_V3"){
                             var cur2=item.bookletName=="上"?0:item.bookletName=="中"?1:2;
                             
                        }else{
                             var cur2=item.bookletName-1
                        }
                    
                        return i===cur2
                    });
                    console.log(_books)
                    if(_books.length==0){
                        if(bookletType=="V1_V2"){
                            curbooks[i]={
                                bookCode:"",
                                bookName:"",
                                bookletName:i==0?"上":"下"
                            }
                            
                        }else if(bookletType=="V1_V2_V3"){
                            curbooks[i]={
                                bookCode:"",
                                bookName:"",
                                bookletName:i==0?"上":i==1?"中":"下"
                            }
                            
                        }else{
                            curbooks[i]={
                                bookCode:"",
                                bookName:"",
                                bookletName:i+1
                            }
                        }
                       
                    }else{
                        console.log(_books[0].bookletName)
                        if(bookletType=="V1_V2"){
                           var cur=_books[0].bookletName=="上"?0:1
                            
                            
                        }else if(bookletType=="V1_V2_V3"){
                            var cur=_books[0].bookletName=="上"?0:_books[0].bookletName=="中"?1:2;
                            
                        }else{
                            var cur=_books[0].bookletName-1
                        }
                       
                        curbooks[cur]= _books[0];
                        
                    }
                   
                }
                console.log(curbooks)
                let tags = response.data.tags;
                tags = tags.split(",").filter(item => item !== "").join(",");
                var resources=response.data.resources!=null?response.data.resources:[];
                var videoSrc="";
                var screenshot="";
                var screenshot2="";
                var screenshot3="";
                var videoSrc="";
                resources.forEach(item=>{
                    if(item.resourceType=="PREVIEW_VIDEO"){
                        videoSrc=item.ossUrl;
                    }else{
                        
                        if(screenshot==""){
                            screenshot=item.ossUrl
                        }else if(screenshot2==""){
                            screenshot2=item.ossUrl
                        }else if(screenshot3==""){
                            screenshot3=item.ossUrl
                        }
                    }
                })
               
				this.setState({
                    coverResource: response.data.coverResource,
                    bookIntroduction:response.data.bookIntroduction,
                    seriesType:response.data.seriesType,
                    bookletNum: response.data.bookletNum,
                    bookletType,
                    books: curbooks,
                    videoSrc,
                    fileList: [{
                        uid: -1,
                        name: 'xxx.png',
                        status: 'done',
                        url: response.data.coverResource,
                    }],
                    fileList2: screenshot!=""?[{
                        uid: -1,
                        name: 'xxx.png',
                        status: 'done',
                        url:screenshot,
                    }]:[],  
                    fileList3:screenshot2!=""?[{
                        uid: -1,
                        name: 'xxx.png',
                        status: 'done',
                        url:screenshot2,
                    }]:[],  
                    fileList4:screenshot3!=""?[{
                        uid: -1,
                        name: 'xxx.png',
                        status: 'done',
                        url: screenshot3,
                    }]:[],
                    screenshot,
                    screenshot2,
                    screenshot3,
                    keyword: response.data.keyword,
                    seriesName: response.data.seriesName,
                    seriesType: response.data.seriesType,
                    tags,
                    videoPrecentShow:true,
                    shelvesFlag: response.data.shelvesFlag

                    
				},()=>{
                    console.log(this.state)
                })
				
			}else{
				message.error(response.message)
			}
		})
    }
    //设置state
    setStatefun(k,v){
        this.setState({
            [k]:v
        })
    }
    //存储图片
    setPicture(url){
        this.setState({
            coverResource:url
        })
    }
    arrowDelete(key){
        var books=this.state.books;
        for(var i=0;i<books.length;i++){
            if(books[i].bookCode==key.bookCode){
                books[i].bookCode="";
                books[i].bookName="";
                books[i].remarkRed=false;
                books[i].goodsState="";
                break;
            }
        }
        this.setState({
            books
            
        })
    }
    //添加图书合集
    saveBookCollection(type){
        console.log(this.state.books)
        if(!this.state.coverResource){
            message.error("请上传合集封面！");
            return;
        }
        if(this.state.seriesName.length>15||this.state.seriesName.length==0){
            message.error("合集名称限制为1~15个中文字符！");
            return;
        }
        if(!!this.state.bookIntroduction.length){
           
        }else{
            message.error("合集简介必填！");
            return;
        }
        // if(!this.state.videoSrc){
        //     message.error("请添加合集视频！");
        //     return;
        // }
        if(!this.state.screenshot&&!this.state.screenshot2&&!this.state.screenshot3){
            message.error("请至少添加一张合集预览图片！");
            return;
        }
        if(!this.state.seriesType){
            message.error("合集类型必填！");
            return;
        }
        if(!this.state.bookletType){
            message.error("合集集数类型必填！");
            return;
        }
        if(this.state.bookletType=="CUSTOM_NUM"&&this.state.bookletNum<2){
            message.error("自定义集数必须大于等于2！");
            return;
        }
        if(this.state.keyword.length==0){
            message.error("搜索关键词必填！");
            return;
        }
        if(!this.state.tags){
            message.error("标签必填！");
            return;
        }
        // if(this.state.books.filter((item)=>item.bookCode!="").length==0){
        //     message.error("请至少添加一本图书合集！");
        //     return;
        // }
        var resources=[];
        if(!!this.state.videoSrc){
            resources.push({
                resourceType:"PREVIEW_VIDEO",
                ossUrl:this.state.videoSrc
            })
        }
      
        if(this.state.screenshot){
            resources.push({
                resourceType:"PREVIEW_IMG",
                ossUrl:this.state.screenshot
            })
        }
        if(this.state.screenshot2){
            resources.push({
                resourceType:"PREVIEW_IMG",
                ossUrl:this.state.screenshot2
            })
        }
        if(this.state.screenshot3){
            resources.push({
                resourceType:"PREVIEW_IMG",
                ossUrl:this.state.screenshot3
            })
        }
        var curbooks=[];
        
       
       
        this.state.books.forEach((item,index)=>{
            if(item.bookCode){
                if(this.state.bookletType=="V1_V2"){
                    curbooks.push({
                        bookCode:item.bookCode,
                        bookletName:index==0?"上":"下",
                        goodsState:item.goodsState
                    })
                }else if(this.state.bookletType=="V1_V2_V3"){
                    curbooks.push({
                        bookCode:item.bookCode,
                        bookletName:index==0?"上":index==1?"中":"下",
                        goodsState:item.goodsState
                    })
                }else{
                    curbooks.push({
                        bookCode:item.bookCode,
                        bookletName:index+1,
                        goodsState:item.goodsState
                    })
                }
            }
        })
        console.log(curbooks)
        //求评分平均值
        var addBooks=this.state.books.filter(item=>item.bookCode);
        console.log(addBooks)
        //求评分人数总数
        var bookScore;
        if(addBooks.length==0){
            bookScore=0
        }else{
            bookScore=(addBooks.reduce((prev, cur) =>prev + parseFloat(cur.bookScore), 0) / addBooks.length).toFixed(1);
            
        }
      
        const scoreNum=addBooks.reduce((prev, cur) =>prev + parseFloat(cur.scoreNum), 0); 
        console.log(this.state.tags)

        var doc={
            coverResource:this.state.coverResource,
            seriesName:this.state.seriesName,
            bookIntroduction:this.state.bookIntroduction,
            resources,
            seriesType:this.state.seriesType,
            bookletType:this.state.bookletType,
            bookletNum:this.state.bookletNum,
            keyword:this.state.keyword,
            tags:encodeURIComponent(this.state.tags),
            books:curbooks,
            bookScore,
            scoreNum

           
        }
       
        if(this.state.status=="edit"){
            doc.seriesCode=this.state.seriesCode;
            doc.shelvesFlag=this.state.shelvesFlag;
        }
        if(type=="2"){
            doc.shelvesFlag="SHELVES_ON";
        }
        console.log(doc)
        util.API(doc,"ella.operation.saveBookSeries")
		.then(response=>response.json())
		.then(response=>{
           
			if(response.status==1){
                message.success("保存成功！")
                if(this.state.status=="add"){
                    setTimeout(() => {
                        hashHistory.push('/bookSeries');
                    }, 1000)
                }
				
			}else{
                if(response.code=="10001036"){
                    var names=response.data.map(item=>item.bookName).join(",");
                    var codes=response.data.map(item=>item.bookCode).join(",");
                    console.log(names)
                    console.log(codes)
                    var _books=this.state.books;
                    _books.forEach((item,index)=>{
                        if(item.bookCode){
                            if(codes.indexOf(item.bookCode)>-1){
                                item.remarkRed=true;
                              
                            }else{
                                item.remarkRed=false;
                            }
                        }
                      
                    })
                    console.log(_books);
                    message.error(names+"这些图书已在其他合集存在");
                    this.setState({
                        books:_books
                    })
                }else{
                    message.error(response.message)
                }

			}
		})
    }
    handleOk = (selectedRowKeys, selectedRows) => {
        var newDataSoure=JSON.parse(JSON.stringify(this.state.books))
        console.log(selectedRows)
        //把数据添加到bookList中，包括去重，放到有空的位置
        this.setState({
            visible: false
        })
        //先判断是否有重复，
        // var curSelectedRows=JSON.parse(JSON.stringify(selectedRows))
     
        for(var i=0;i<selectedRows.length;i++){
            for(var j=0;j<newDataSoure.length;j++){
                if(selectedRows[i].bookCode==newDataSoure[j].bookCode){
                    selectedRows.splice(i,1);
                    i=i-1;
                    break;
                }
            }
        }
     
        //把去重后的数据从上到下插入空的列表的部分
        for(var i=0;i<selectedRows.length;i++){
            for(var j=0;j<newDataSoure.length;j++){
                //判断是否超出限制
                if(this.state.bookletType=="V1_V2"&&newDataSoure.filter((item)=>item.bookCode!="").length==2){
                    message.error("合集集数为【上下册】，最多只能添加2本图书！")
                    this.setState({
                        books: newDataSoure
                    })
                    //直接跳出整个函数
                    return false;
                }
                if(this.state.bookletType=="V1_V2_V3"&&newDataSoure.filter((item)=>item.bookCode!="").length==3){
                    message.error("合集集数为【上中下册】，最多只能添加3本图书！")
                    this.setState({
                        books: newDataSoure
            
                    })
                    return false;
                }
                if(this.state.bookletType=="CUSTOM_NUM"&&newDataSoure.filter((item)=>item.bookCode!="").length==this.state.bookletNum){
                    message.error("合集集数为自定义，图书添加不能超过自定义数量！")
                    this.setState({
                        books: newDataSoure
            
                    })
                    return false;
                }
                if(newDataSoure[j].bookCode==""){
                    newDataSoure[j].bookCode=selectedRows[i].bookCode;
                    newDataSoure[j].bookName=selectedRows[i].bookName;
                    newDataSoure[j].bookIndex=j+1;
                    newDataSoure[j].scoreNum=selectedRows[i].scoreNum;
                    newDataSoure[j].bookScore=selectedRows[i].bookScore;
                    newDataSoure[j].goodsState=selectedRows[i].goodsState;
                    break;
                }
            }
        }
        console.log(newDataSoure)
        this.setState({

            books: newDataSoure

        })
   
    }
    modelCancle(msg) {
        this.setState({
            visible: msg
        });
    }
    components = {
        body: {
          row: DragableBodyRow,
        },
      }
    
    moveRow = (dragIndex, hoverIndex) => {
        console.log(dragIndex+","+hoverIndex)
        var books=JSON.parse(JSON.stringify(this.state.books));
        var books2=JSON.parse(JSON.stringify(this.state.books));
        books2[dragIndex]=books[hoverIndex];
        books2[hoverIndex]=books[dragIndex];
        const dragRow = books[dragIndex];
        
        this.setState({
            books: books2
        })
    
    }
  
    moveFun(v,record,index){
        console.log(v);
        // if(this.state.bookList.filter((item)=>item.bookIndex==v).length>=1){
        //     message.error("序号不能重复！")
        //     return ;
        // }
        var books=JSON.parse(JSON.stringify(this.state.books));
        books[index].bookIndex=v;
        this.setState({
            books
        })

    }
    // //移动位置
    // moveFun(v,record,index){
    //     console.log(v)
    //     console.log(index)
    //     //v是要移到的位置
    //     //index是当前位置
    //     var bookList=JSON.parse(JSON.stringify(this.state.bookList));
    //     console.log(bookList)
    //     //原地不动
    //     if(v==index){
    //         return ;
    //     }
    //     var b1,b2,b3,b4,b5;
    //     //向下移动
    //     if(v>index){
    //         b1=bookList.slice(0,index);
    //         b2=record;
    //         b3=bookList.slice(index+1,v+1);

    //         b4=bookList.slice(v+1,bookList.length);
           
    //     }else{
    //         //上移
    //         b1=bookList.slice(0,v);
           
    //         b2=bookList.slice(v,index);
    //         b3=record;
    //         b4=bookList.slice(index+1,bookList.length);
          
    //     }
    //     console.log(b1)
    //     console.log(b2)
    //     console.log(b3)
    //     console.log(b4)
    //     b5=b1.concat(b3,b2,b4);
    //     this.setState({
    //         bookList:b5
    //     })
    // }
    setColleTimesType(value){
        if(value=="V1_V2"){
            var Len=2
        }else if(value=="V1_V2_V3"){
            var Len=3
        }else{
            var Len=0;
        }
        var books=[];
        console.log(Len)
        for(var i=0;i<Len;i++){
            books.push({
                "bookCode":""
            })
        }
        this.setState({
            books,
            bookletNum:Len==0?"":Len,
            bookletType:value
        })
    }
   	setCustomFun(value){
        console.log(value)
        var books=this.state.books;
        var curLen=this.state.books.length;
            if(value==curLen){
                return ;
            }else if(value>curLen){
                for(var i=0;i<value-curLen;i++){
                    books.push({
                        "bookCode":""
                    })
                }
            }else{
                books.splice(value,curLen-value);
            }
            this.setState({
              books
            },()=>{
            	console.log(this.state)
            })
      
    }
 
    // 上传视频
    upVideo = async (e) => {
        if (this.state.videoPrecent === 0 || this.state.videoPrecent === 100) {
            this.setState({
                videoPrecentShow:true,
                progressShow:true,
                videoPrecentName:e.target.files[0].name
            })
            var formData = new FormData()
            formData.append('file', e.target.files[0])
            formData.append('purposeId', 'BOOK_RESIES_PREVIEW_RESOURCE')
            // formData.append('courseCode', '')
            
    
            //获取视频上传百分比
            let a = 0;
            let theTimeJi = window.setInterval( ()=>{
                a++;
                if (a >= 98) {
                    window.clearInterval(theTimeJi);
                }
                this.setState({
                    videoPrecent: a
                });
            }, 500);

            var data = await fetch(util.upLoadVideoUrl, {
                method: 'POST',
                mode: 'cors',
                body: formData
            }).then(function (res) {
                return res.json();
            });
            if (data.status == 1) {
                window.clearInterval(theTimeJi);
                this.setState({
                    videoSrc: data.data,
                    videoStates: 'success',
                    videoPrecent: 100
                });
                let obj = document.getElementById('courseVideo');
                obj.value = ''
            } else {
                window.clearInterval(theTimeJi);
                this.setState({
                    videoSrc: '',
                    videoStates: 'exception',
                    videoPrecent: 100
                });
                let obj = document.getElementById('courseVideo') ;
                obj.value = ''
                message.error(`${this.state.videoPrecentName} 上传失败,${data.message}`);
            }   
        } else {
            message.error('请等待上传结束~')
        }
    }
     // 删除视频
     delColleVideo () {
        if (this.state.videoSrc) {
            this.setState({
                videoPrecentShow: false,
                progressShow:false,
                videoPrecentName: '',
                videoPrecent: 0,
                videoStates: 'active',
                videoSrc: ''
            })
        } else {
            message.error('您还未上传视频！')
        }
    }
     ///////////////////////////////文本图片上传////////////////////////////////////////////
    handleCancel = (k) => this.setState({ [k]: false })
    handlePreview = (file, previewImage, previewVisible) => {
         this.setState({
             [previewImage]: file.url || file.thumbUrl,
             [previewVisible]: true,
         });
    }
    handleCoverChange= ({ fileList }) => {
        this.setState({ fileList, coverResource:'' }, () => {
            if(fileList.length==0){
                return ;
            }
            let thumbUrl = this.state.fileList[0].thumbUrl;
            console.log('fileList：', this.state.fileList[0]);
            if (this.state.fileList[0].percent == 100) {
                setTimeout(() => {
                    console.log('上传成功！');
                    this.imageCoverFetch(thumbUrl);
                    return;
                }, 0)

            } else {
                console.log('上传失败！')
            }
        });

    }
    
    imageCoverFetch = async (url) => {
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
            this.setState({ loading: false},()=>{
                this.setStatefun("coverResource",data.data);
            });
        }
    }
    handleChange = ({ fileList }, k, img) => {
 
         console.log(k)
         console.log(img)
         this.setState({ [k]: fileList,[img]:""}, () => {
            if(fileList.length==0){
               return ;
               
            }else{
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
        console.log(img)
         var formData = new FormData();
         formData.append('pictureStream', this.convertBase64UrlToBlob(url), "file_" + Date.parse(new Date()) + ".png");
 
         var data = await fetch(util.upLoadUrl, {
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
    setSeriesType(value){
        if(value=="SAME_ATTRIBUTE"){
            this.setState({
                seriesType:value,
                bookletType:"CUSTOM_NUM",
                bookletNum:"",
                books:[]
    
            },()=>{
                console.log(this.state.bookletNum)
            })
        }else{
            this.setState({
                seriesType:value,
                books:[
                    {
                      
                       
                        bookCode:'',
                        bookIndex:1,
                    },
                    {
                      
                        bookCode:'',
                        bookIndex:2
                    },
                ],
                bookletNum:"",
                bookletType:"V1_V2",
                bookletNum:"2"
    
            })
        }
       
    }
    inputChangeSure(){
        var value=this.state.bookletNum;
        var books=this.state.books;
        if(value==this.state.bookletNum){
            return ;
        }else if(value>this.state.bookletNum){
            for(var i=0;i<value-this.state.bookletNum;i++){
                books.push({
                    "bookCode":""
                })
            }
        }else{
            books.splice(value,this.state.bookletNum-value);
        }
        this.setState({
            books
        })
    }
    render() {
        const formItemLayout = {
            labelCol: { span: 2 },
            wrapperCol: { span: 20 },
        };
        const style = { 
            marginBottom: '20px',
            borderBottom: "1px solid #ccc", 
            paddingBottom: '10px' 
        }
        const uploadButton = (
            <div>
                <Icon type="plus" />
            </div>
        );
        const {fileList,fileList2,fileList3,fileList4,previewImage,previewImage2,previewImage3,previewImage4,previewVisible,previewVisible2,previewVisible3,previewVisible4,coverResource}=this.state
        var columns = [
            {
                // title: ({ sortOrder, filters }) => <div>
                //      <span style={{"display":"inline-block","verticalAlign":"middle"}}>合集序号</span>
                //     <Icon type="sort-ascending" style={{"display":"inline-block","verticalAlign":"middle","marginLeft":"10px","fontSize":"26px"}} onClick={()=>this.arrSort()}/>
                   
                // </div>,
                title:"序号",
                width: "20%",
                render: (text,record,index) =>{
                    if(this.state.bookletType=="V1_V2"){
                        return (<span>{index==0?"上册":"下册"}</span>)
                    }else if(this.state.bookletType=="V1_V2_V3"){
                        return (<span>{index==0?"上册":index=="1"?"中册":"下册"}</span>)
                    }else{
                        return (<span>{index+1}</span>)
                    }
                    // return <Select
                    //     style={{ width: '80px',"marginRight":"20px"}}
                    //     onChange={(v)=>this.moveFun(v,record,record.showNumber)}
                    //     placeholder="移动"
                    //     value={record.bookIndex}
                    
                    // >
                    // {
                    //     this.state.bookList.map((item,index)=>{

                    //         if(this.state.collectionTimesType=="one"){
                    //             return <option value={index+1} key={index+1}>{index==0?"上册":"下册"}</option>
                            
                    //         }else if(this.state.collectionTimesType=="two"){
                    //             return <option value={index+1} key={index+1}>{index==0?"上册":index=="1"?"中册":"下册"}</option>
                            
                    //         }else{
                    //             return <option value={index+1} key={index+1}>{index+1}</option>
                            
                    //         }
                        
                    //     })
                    // }
                        
                    // </Select>
                }
            }, {
                title: '图书ID',
                width: "20%",
                dataIndex: 'bookCode',
                key: 'bookCode',
            }, {
                title: '图书名称',
                width: "25%",
                dataIndex: 'bookName',
                key: 'bookName',
            },  {
                title: '图书状态',
                width: "20%",
                dataIndex: 'goodsState',
                key: 'goodsState',
                render:(text)=>{
                    return <span>{text=="SHELVES_WAIT"?"待上架":text=="SHELVES_ON"?"已上架":text=="SHELVES_OFF"?"已下架":""}</span>
                }
            },{
                title: '操作',
                width: "20%",
                key: 'action',
                render: (text, record) => {
                    return (
                        <div>
                            {/* <span style={{ cursor: "pointer" }} onClick={() => { this.sortArr(index) }}>置顶</span>
                            <span className="ant-divider" />
                            <i className="i-action-ico i-up" onClick={() => { this.arrowUp(index) }}></i>
                            <span className="ant-divider" />
                            <i className="i-action-ico i-down" onClick={() => { this.arrowDown(index) }}></i> */}
                            {/* <span className="ant-divider" /> */}
                            {
                                record.bookCode&&<Popconfirm title="确定删除吗?" onConfirm={() => {
                                    this.arrowDelete(record)
                                }}>
                                    <i className="i-action-ico i-delete" ></i>
                                </Popconfirm>
                            }
                          
                        </div>
                    )
                }
            }
        ]
        console.log(this.state.books)
        return (
            <div id="addBookCollection" style={{ padding: "10px 10px 0" }}>
                <Row style={style}>
                    <Link to={'/bookSeries'} style={{ color: "#666" }}>
                        <Col span={4} style={{ fontSize: "16px" }}>
                            <Icon type="left" />
                            {this.state.status=="add"?"添加新的合集":"编辑合集"}
                        </Col>
                    </Link>
                </Row>
                <div className="top-content">
                    <div className='m-lt'>
                        <div>
                            <Spin spinning={this.state.loading} tip="图片上传中...">
                                <div className='m-lt-upload'>
                                    <Upload
                                        action="//jsonplaceholder.typicode.com/posts/"
                                        listType="picture-card"
                                        fileList={fileList}
                                        onPreview={(file)=>this.setState({
                                            previewImage: file.url || file.thumbUrl,
                                            previewVisible: true,
                                        })}
                                        onChange={this.handleCoverChange}

                                    >
                                        {fileList.length >= 1 ? null : uploadButton}
                                    </Upload>
                                </div>
                            </Spin>
                            <Modal visible={previewVisible} footer={null} onCancel={()=>this.setState({ previewVisible: false })}>
                                <img alt="example" style={{ width: '100%' }} src={previewImage} />
                            </Modal>

                        </div>
                        <div style={{"marginBottom":10}}>合集封面（176*240）</div>
                    </div>
                    <Form>
                        <FormItem
                            {...formItemLayout}
                            label="合集名称"
                            style={{"display":"block"}}
                        >
                            <Input style={{ width: '30%' }} value={this.state.seriesName} onChange={(e) =>this.setStatefun("seriesName",e.target.value)}/>  
                        </FormItem>
                        <FormItem
                            label="合集简介"
                            {...formItemLayout}
                        > 
                            <TextArea id="control-textarea2" rows={3} style={{"width":"40%"}} value={this.state.bookIntroduction} onChange={(e) =>this.setStatefun("bookIntroduction",e.target.value)}/>  
                        </FormItem>
                        <FormItem
                            label="合集视频"
                            {...formItemLayout}
                        > 

                                <div className="collectionVideo">
                                    <Button icon="upload" >{this.state.videoSrc === '' ? '添加视频' : '已添加'}</Button>
                                    <input type="file" style={{width:"100px"}} name="video" id="courseVideo" onChange={(e) => { this.upVideo(e) }} accept="video/*,.ogg" />
                                </div>
                        
                                <span title="点击删除"  className="i-action-ico i-delete" onClick={()=>this.delColleVideo()}></span>

                          
                            {this.state.videoPrecentShow &&<p style={{marginTop:'10px',marginBottom:0}}>{this.state.videoSrc}</p>}
                            {this.state.progressShow&&<Progress percent={this.state.videoPrecent} status={this.state.videoStates} size="small" />}
                        </FormItem>
                        <FormItem
                            label="合集预览图片"
                            {...formItemLayout}
                        > 
                            <div className="previwPicture">
                                <Upload
                                    accept=".jpg,.png,.webp,.bmp,.tiff,.gif,.jpeg"
                                    action="//jsonplaceholder.typicode.com/posts/"
                                    listType="picture-card"
                                    fileList={fileList2}
                                    onPreview={(file) => { this.handlePreview(file, "previewImage2", "previewVisible2") }}
                                    onChange={({ fileList }) => { this.handleChange({ fileList }, "fileList2", "screenshot") }}
                                    onRemove={() => { this.setState({ screenshot: "" }) }}
                                >
                                    {fileList2.length >= 1 ? null : uploadButton}
                                </Upload>
                                <Modal visible={previewVisible2} footer={null} onCancel={() => { this.handleCancel("previewVisible2") }}>
                                    <img alt="example" style={{ width: '100%' }} src={previewImage2} />
                                </Modal>
                            </div>
                            <div className="previwPicture">
                                <Upload
                                    disabled={this.state.screenshot == '' && this.state.screenshot2 == '' ? true : false}
                                    style={{ backgroundColor: this.state.screenshot == '' && this.state.screenshot2 == '' ? '#ddd' : 'white' }}
                                    accept=".jpg,.png,.webp,.bmp,.tiff,.gif,.jpeg"
                                    action="//jsonplaceholder.typicode.com/posts/"
                                    listType="picture-card"
                                    fileList={fileList3}
                                    onPreview={(file) => { this.handlePreview(file, "previewImage3", "previewVisible3") }}
                                    onChange={({ fileList }) => { this.handleChange({ fileList }, "fileList3", "screenshot2") }}
                                    onRemove={() => { this.setState({ screenshot2: "" }) }}
                                >
                                    {fileList3.length >= 1 ? null : uploadButton}
                                </Upload>
                                <Modal visible={previewVisible3} footer={null} onCancel={() => { this.handleCancel("previewVisible3") }}>
                                    <img alt="example" style={{ width: '100%' }} src={previewImage3} />
                                </Modal>
                            </div>
                            <div className="previwPicture">
                                <Upload
                                    disabled={(this.state.screenshot == '' || this.state.screenshot2 == '') && this.state.screenshot3 == '' ? true : false}
                                    style={{ backgroundColor: (this.state.screenshot == '' || this.state.screenshot2 == '') && this.state.screenshot3 == '' ? '#ddd' : 'white' }}
                                    accept=".jpg,.png,.webp,.bmp,.tiff,.gif,.jpeg"
                                    action="//jsonplaceholder.typicode.com/posts/"
                                    listType="picture-card"
                                    fileList={fileList4}
                                    onPreview={(file) => { this.handlePreview(file, "previewImage4", "previewVisible4") }}
                                    onChange={({ fileList }) => { this.handleChange({ fileList }, "fileList4", "screenshot3") }}
                                    onRemove={() => { this.setState({ screenshot3: "" }) }}
                                >
                                    {fileList4.length >= 1 ? null : uploadButton}
                                </Upload>
                                <Modal visible={previewVisible4} footer={null} onCancel={() => { this.handleCancel("previewVisible4") }}>
                                    <img alt="example" style={{ width: '100%' }} src={previewImage4} />
                                </Modal>
                            </div>
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="合集类型"
                        >
                            <RadioGroup onChange={(e) =>this.setSeriesType(e.target.value)} value={this.state.seriesType}>
                                <Radio value="SAME_DIVERSITY">分集合集</Radio>
                                <Radio value="SAME_ATTRIBUTE">同属性合集</Radio>
                            </RadioGroup>         
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="合集集数"
                        >
                            <RadioGroup onChange={(e) =>this.setColleTimesType(e.target.value)}

                                value={this.state.bookletType}>
                                {this.state.seriesType=="SAME_DIVERSITY"&&<Radio value="V1_V2">上下册</Radio>}
                                {this.state.seriesType=="SAME_DIVERSITY"&&<Radio value="V1_V2_V3">上中下册</Radio>}
                                <Radio value="CUSTOM_NUM">自定义</Radio>
                               
                            </RadioGroup>
                            {   
                               this.state.bookletType=="CUSTOM_NUM"&&<InputNumber 
                              min={0}
	                            value={this.state.bookletNum} 
	                            onChange={(value)=>this.setState({bookletNum:value})} 
	                            onBlur={(e)=>this.setCustomFun(e.target.value)}
                            />
                            }
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="搜索关键词"
                            style={{"display":"block"}}
                        >
                            <Input 
                                style={{ width: '300px' }} 
                                value={this.state.keyword} 
                                onChange={(e)=>this.setStatefun("keyword",e.target.value)}
                                onBlur={(e)=>{
                                    console.log(e.target.value)
                                    var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>《》/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]");
                                    if(pattern.test(e.target.value)){
                                        message.error("关键词不能存在特殊字符！");
                                        this.setStatefun("keyword","")

                                    }
	    			
                                }}
                            />
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="标签"
                            style={{"display":"block"}}
                        >
                            <Select
                                mode="tags"
                                style={{ width: '100%' }}
                                value={this.state.tags== '' ? [] : this.state.tags.split(',')}
                                onChange={(v) => {
                                    console.log(v)

                                    var cur = v.filter(item => item && item.trim())
                                    console.log(cur.join(','))
                                    this.setStatefun("tags",cur.join(','))
                                   

                                }}
                                tokenSeparators={[',']}
                            >
                            </Select>
                        </FormItem>
                    </Form>
                </div>
                   	<div id="offsetCol">
		                <Row>
		                <Col offset={1} style={{ marginRight: '3.16667%' }}>
		                	<div data-page="addModal">
				                <Row style={{ background: "#23B8E6", padding: '0 20px', borderRadius: "6px 6px 0 0", lineHeight: '50px', height: '50px' }}>
				                    <Col style={{ fontSize: '14px', color: "#fff", float: 'left' }}>图书列表</Col>
				                    <Col style={{ float: 'right' }}>
				                        <Col style={{ float: 'left', marginRight: '10px' }}>
                                            <Button 
                                                type="primary" 
                                                className="ant-btn-add" 
                                                icon="plus" 
                                               
                                                onClick={()=>{
                                                	if(this.bookletType="CUSTOM_NUM"&&this.state.books.length==0){
                                                		message.error("请填写自定义集数!")
                                                		return ;
                                                	}
                                                    this.setState({"visible":true});
                                                    this.refs.addBooks.getInitList();
                                                }}
                                            >
                                                添加图书
                                            </Button>
                                            <CommonAddBook ref="addBooks" rowKey="bookCode" visible={this.state.visible} modelCancle={msg => this.modelCancle(msg)} handleOk={(selectedRowKeys, selectedRows) => this.handleOk(selectedRowKeys, selectedRows)} />
				                        </Col>
				                        <Col style={{ float: 'left' }}>
                                            <Button 
                                                type="primary" 
                                                icon="delete" 
                                                className="ant-btn-add" 
                                                onClick={()=>{
                                                    var books=this.state.books;
                                                    books.forEach((item)=>{
                                                        item.bookCode="";
                                                        item.bookName="";
                                                        item.goodsState="";
                                                        item.remarkRed=false;
                                                    })
                                                    this.setState({books})
                                                }}
                                            >清空列表</Button>
				                        </Col>
				                    </Col>
				                </Row>
                                <Table 
                                    columns={columns}
                                    dataSource={this.state.books}
                                    pagination={false} 
                                    scroll={{ y: (this.state.books.length > 11 ? 450 : 0) }}
                                    components={this.components}
                                    rowClassName={(record, index) =>{
                                        if(record.remarkRed){
                                            return 'el-tr-red'
                                        }
                                       
                                    }
                                    }
                                    onRow={(record, index) => ({
                                        index,
                                        moveRow: this.moveRow,
                                      })}
                                />
				            </div>
		                    </Col>
		                </Row>
			        </div>
                    <FormItem wrapperCol={{ span: 24}} style={{ "marginTop": "24px","textAlign":"center" }}>
                        <Button type="primary" onClick={() => { this.saveBookCollection(1) }} className="buttonWidth" style={{"marginRight":"30px"}}>保存</Button>
                        <Button type="primary" onClick={() => { this.saveBookCollection(2) }} className="buttonWidth">保存并上架</Button>
                    </FormItem>
                    {/* <div style={{ margin: '20px 0', textAlign: 'center' }}>
                        <Button className="ant-btn-blue" type="primary" htmlType="submit" >保存</Button>
                    </div> */}
                
            </div>
        )
    }
}
const addBookSeries = DragDropContext(HTML5Backend)(Demo);
export default addBookSeries;