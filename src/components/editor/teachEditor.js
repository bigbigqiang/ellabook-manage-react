import React from 'react'
import ReactUeditor from './ReactUeditor.js'
import { message } from "antd";
import getUrl from "../util.js";
class teachEditor extends React.Component {
  constructor({titleImg,getContent,dailyContent}) {
    super()
    this.editorResult = ''
  }

  state = {
    progress: -1,
    defaultvalue:""
  }
componentWillReceiveProps(nextProps){
  // console.log("asdassaasd")
  
  // if(this.props.dailyContent!=nextProps.dailyContent) return
  // console.log(decodeURIComponent(this.props.dailyContent))
  // console.log(this.editorResult)
  // console.log(decodeURIComponent(nextProps.dailyContent))
  // console.log("asdassaasd")
  // return
}

componentDidMount(){
  console.log("asdassaasd")
  // console.log(decodeURIComponent(this.props.dailyContent))
  console.log(this.props)
  console.log("asdassaasd")
  // this.setState({
  //   defaultvalue:this.props.dailyContent
  // })
  // console.log("asdassaasd")
  // console.log(this.props.dailyContent)
  // console.log("asdassaasd")
  
}

uploadImage(e){
  // var doc = {
  //     pictureStream:e.target.files[0]
  // };
  // var reader = new FileReader()

  // reader.readAsDataURL(e.target.files[0])
  // var a = reader.onload = function(r){
    //这里拿到那个base64码
    // console.log(r.target.result)
    //然后后台返回url
    //
  // }
  

    return new Promise(function(resolve, reject) {
      //这里获取base64编码
      function getBase64(file) {
        console.log(file);
        if(file.size>5242880){
          message.error('图片不能大于5MB');
        }else{
          var reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = function () {
            console.log(reader);
            //上传图片
            //把base64转成ascii
            var convertBase64UrlToBlob=(urlData)=>{  
      
              var bytes=window.atob(urlData.split(',')[1]);        //去掉url的头，并转换为byte  
            
              //处理异常,将ascii码小于0的转换为大于0  
              var ab = new ArrayBuffer(bytes.length);  
              var ia = new Uint8Array(ab);  
              for (var i = 0; i < bytes.length; i++) {  
                  ia[i] = bytes.charCodeAt(i);  
              }  
              console.log('type:'+urlData.split(',')[0].split(':')[1].split(';')[0]);
              var type = urlData.split(',')[0].split(':')[1].split(';')[0];
              return new Blob( [ab] , {type : type}); 
                 
            }
             var imageFetch = async (url)=>{
                 // console.log(url)
                 // var doc = {
                 //     pictureStream:encodeURIComponent(url)
                 // };
                 var formData = new FormData(); 
                 formData.append('file',convertBase64UrlToBlob(url),"file_"+Date.parse(new Date())+".png");
                 formData.append('purposeId','TEACHING_MODE');
                 var data = await fetch(getUrl.upLoadTeachUrl,{
                     method: 'POST',
                     // headers: {
                     //     "Content-type":"application/x-www-form-urlencoded"
                     // },
                     mode : 'cors',
                     // body:"method=ella.operation.upload"+"&content="+JSON.stringify(doc)
                     body: formData
  
                 })
                     .then(function(res) {
                         return res.json();
                     });
                 if(data.status==1){
                     console.log(data);
                     //获取后端提供的图片这里执行resolve
                     resolve(data.data)
                 }
             }
  
             imageFetch(reader.result);
          };
          reader.onerror = function (error) {
            console.log('Error: ', error);
          };
        }
      }

      getBase64(e.target.files[0]);
      
    })
  }

  

  updateEditorContent = content => {
    console.log(this.props.getContent)
    console.log(55555555555)
    console.log(content.replace(/\"/g,'\''))
    this.props.getContent("dailyContent",encodeURIComponent(content.replace(/\"/g,'\'')))
    this.editorResult = content
    // this.setState({
    //   htmlCode:content
    // })
  }

  render() {
    let {progress} = this.state
    // console.log(444444444444)
    // console.log(this.props.titleImg)
    // console.log(this.state.htmlCode)
    
    return (
      <div>
        <ReactUeditor
          ueditorPath='/ueditor'
          config={{zIndex: 10}}
          value={this.props.dailyContent?decodeURIComponent(this.props.dailyContent):""}
          plugins={['uploadImage']}
          uploadImage={this.uploadImage}
          onChange={this.updateEditorContent}
          progress={progress}
        />
      </div>
    )
  }
}

export default teachEditor
