/*
 	created by NiePengfei at 2017/12/12
 		图书——原著作者——作者编辑、添加
 */

import React from 'react'
import {} from 'antd';
import "./uploadImg.css"
import getUrl from "../util.js"
export default class UpLoadImg extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
        	imgSrc:''
        }
    }
    
    componentWillMount(){
    }
    
    componentDidMount(){
    	
    } 
	imgUp(e){
		var thisTrue = this;
		
		console.log(e);
		console.log(e.target.files[0]);
		
		console.log(this.props.bookCode);
		
		//js 的formData函数，append方法写两个参数，直接生成json的对象，已表单的形式。这个现在都这么传，但是他不能和别的参数一起用，只能写一个FormData
		var formData = new FormData(); 
        formData.append('file',e.target.files[0]);
        formData.append('purposeId',"BOOK_PREVIEW_RESOURCE_IMG");
        formData.append('bookCode',this.props.bookCode);


		fetch(getUrl.upLoadVideoUrl, {
			method: "POST",
			mode : 'cors',
			body: formData
		})
		.then(function(response){
			console.log(response);
			return response.json();
		})
		.then(function(response){
			console.log(response);
	        thisTrue.props.imgChangeFn(response.data);
		})
	}
    
    render(){
    	var thisTrue = this;
		return (
			<div className="upLoadImg">
				<label className="imgMeng" htmlFor="imgUpload">上传</label>
				<input type="file" name="file" id="imgUpload" accept="image/jpeg,image/jpg,image/png" onChange={(e)=>{this.imgUp(e)}}/>
			</div>
		);
	}
}
