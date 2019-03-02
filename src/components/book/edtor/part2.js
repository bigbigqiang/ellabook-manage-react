import React from 'react';
import { Icon, Button, Row, Col, Select, DatePicker, Input, Popconfirm, message, Modal, Radio, Checkbox, Carousel, Spin, Upload, Steps } from 'antd';
import { Link } from 'react-router';
// import ClassSet from './classSet.js';
// const { MonthPicker, RangePicker } = DatePicker;
const Step = Steps.Step;
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;
import './index.css';
import getUrl from "../../util.js";
import commonData from '../../commonData.js';
export default class PriceSet extends React.Component {

    constructor() {
        super()
        this.state = {
            spinning: true,
            originalAuthor: [],//非公司的人
            animationAuthor: [],//公司的人
            authorScriptList: [],//分镜
            authorArtList: [],//图片处理
            authorDesignList: [],//动效设计
            authorAudioList: [],//音频
            authorReviewList: [],//校审

            authorTranslationList: [],//原著翻译作者
            authorPaintingList: [],//原著绘画
            authorTextList: [],//原著作者
            initData:'',
             saveType:'',
            skipStep:'',
            visible2:false

        }
    }

    setOneKV(k, v) {
        this.setState({
            [k]: v
        })
    }

    componentDidMount() {
        this.fetchDefaultData();
    }
    async fetchDefaultData() {
        var originalAuthor = await fetch(getUrl.url, {
            mode: "cors",
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: "method=ella.operation.boxSearchList" + "&content=" + JSON.stringify({
                "type": "AUTO_BOX",
                "groupId": "operation.box.getOriginalAuthorList"
            }) + commonData.dataString
        }).then(res => res.json());
        var animationAuthor = await fetch(getUrl.url, {
            mode: "cors",
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: "method=ella.operation.boxSearchList" + "&content=" + JSON.stringify({
                "type": "AUTO_BOX",
                "groupId": "operation.box.getEllaAuthorList"
            }) + commonData.dataString
        }).then(res => res.json());

        console.log(animationAuthor)

        this.setState({
            originalAuthor: originalAuthor.data,
            animationAuthor: animationAuthor.data,
           
        }, () => {
            this.fetch()
        })
    }
    async fetch() {
        var data = await fetch(getUrl.url, {
            mode: "cors",
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: "method=ella.operation.getAuthorRelation" + "&content=" + JSON.stringify({
                "bookCode": window.location.href.split('bookCode=')[1].split('&')[0]
            }) + commonData.dataString
        }).then(res => res.json());
        console.log(data);
        this.setState({
            authorScriptList: data.data.authorScriptList,
            authorTranslationList: data.data.authorTranslationList,
            authorArtList: data.data.authorArtList,
            authorDesignList: data.data.authorDesignList,
            authorAudioList: data.data.authorAudioList,
            authorPaintingList: data.data.authorPaintingList,
            authorTextList: data.data.authorTextList,
            authorReviewList: data.data.authorReviewList,
            spinning: false,
            initData:data.data
        })
    }
  
    async submitData(saveType) {
        
        const { authorScriptList, authorArtList, authorDesignList, authorAudioList, authorReviewList, authorTranslationList, authorPaintingList, authorTextList } = this.state;
         console.log(this.state.initData.authorTextList)
        
        
        // if(authorTextList.length!=this.state.initData.authorTextList.length){
        //     this.props.showModal("true")
        //     return;   
        // }else{
        //     var arr=[];
        //     authorTextList.forEach((item)=>{
        //         this.state.initData.authorTextList.forEach((item2)=>{
        //             if(item.authorCode==item2.authorCode){
        //                 arr.push(item.authorCode)
        //             }
        //         })
        //     })
        //     if(arr.length!=authorTextList.length){
        //          this.props.showModal("true")
        //         return;   
        //     }
            
        // }
        
        var submitData = {
            bookCode: window.location.href.split('bookCode=')[1].split('&')[0],
            bookAuthorRelationList: [
                ...authorScriptList,
                ...authorArtList,
                ...authorDesignList,
                ...authorAudioList,
                ...authorReviewList,
                ...authorTranslationList,
                ...authorPaintingList,
                ...authorTextList
            ]
        }

//      if (authorTextList.length == 0) { message.error('原著作者未选'); return; }
//      if (authorArtList.length == 0) { message.error('图片处理未选'); return; }
//      if (authorScriptList.length == 0) { message.error('分镜未选'); return; }
//      if (authorDesignList.length == 0) { message.error('动效未选'); return; }
//      if (authorAudioList.length == 0) { message.error('音频未选'); return; }
//      if (authorReviewList.length == 0) { message.error('审校未选'); return; }

        var data = await fetch(getUrl.url, {
            mode: "cors",
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: "method=ella.operation.updateAuthorRelation" + "&content=" + JSON.stringify(submitData) + commonData.dataString
        }).then(res => res.json());
             if(data.status == 1){
                 message.success("保存成功！")
                this.setState({
                        visible2:false,
                    
                    });
                this.fetchDefaultData();
                if(saveType=="save"){
                    
                }else if(saveType=="skepsave"){
                    this.props.changePage(this.state.skipStep);
                }
             }else{
                message.error(data.message)
            }
           
    }
     skipStep(step){
        this.setState({
            skipStep:step
        })
       
        const { authorScriptList, authorArtList, authorDesignList, authorAudioList, authorReviewList, authorTranslationList, authorPaintingList, authorTextList } = this.state;
        console.log(authorTextList);
        console.log(this.state.initData.authorTextList);
        if(authorTextList.map((item)=>item.authorCode).join(",")!=this.state.initData.authorTextList.map((item)=>item.authorCode).join(",")){
            this.setState({visible2:true})
            return;
        }
        if(authorArtList.map((item)=>item.authorCode).join(",")!=this.state.initData.authorArtList.map((item)=>item.authorCode).join(",")){
             this.setState({visible2:true})
            return;
        }
        if(authorScriptList.map((item)=>item.authorCode).join(",")!=this.state.initData.authorScriptList.map((item)=>item.authorCode).join(",")){
             this.setState({visible2:true})
            return;
        }
        if(authorDesignList.map((item)=>item.authorCode).join(",")!=this.state.initData.authorDesignList.map((item)=>item.authorCode).join(",")){
             this.setState({visible2:true})
            return;
        }
        if(authorPaintingList.map((item)=>item.authorCode).join(",")!=this.state.initData.authorPaintingList.map((item)=>item.authorCode).join(",")){
            this.setState({visible2:true})
            return;
        }
        if(authorReviewList.map((item)=>item.authorCode).join(",")!=this.state.initData.authorReviewList.map((item)=>item.authorCode).join(",")){
             this.setState({visible2:true})
            return;
        }
        if(authorAudioList.map((item)=>item.authorCode).join(",")!=this.state.initData.authorAudioList.map((item)=>item.authorCode).join(",")){
             this.setState({visible2:true})
            return;
        }
        if(authorTranslationList.map((item)=>item.authorCode).join(",")!=this.state.initData.authorTranslationList.map((item)=>item.authorCode).join(",")){
           this.setState({visible2:true})
            return;
        }
        
         
        this.props.changePage(step);

    }
     modalClick(type){
       
       if(type=="leave"){
            this.fetchDefaultData();
            //不保存，直接离开
            this.setState({visible2:false},()=>{
            	this.props.changePage(this.state.skipStep);
            });
           
          
        }else if(type=="save"){
            this.setState({visible2:false},()=>{
            	 this.submitData("skepsave");
            });
           
        }
       
    }
    render() {
        console.log(this.state)
        return <Spin spinning={this.state.spinning}>
            <div className="bookPart">
                <Row className='row'>
                    <Col style={{ fontSize: '20px', fontWeight: 'bold' }} span={12} offset={0}>原著作者</Col>
                    <Col style={{ fontSize: '20px', fontWeight: 'bold' }} span={8} >动画书制作员</Col>
                </Row>
                <Row className='row'>
                    <Col className='colTitle' span={3} offset={0}>原著故事作者:</Col>
                    <Col span={8} >
                        <Select
                            mode="multiple"
                            style={{ width: '100%' }}
                            value={this.state.authorTextList.map(item => item.authorName)}
                            onChange={(v) => {
                                this.setState({
                                    authorTextList: v.map(item => ({
                                        bookCode: window.location.href.split('bookCode=')[1].split('&')[0],
                                        authorCode: this.state.originalAuthor.find(_item => item == _item.authorName).authorCode,
                                        authorName: item,
                                        authorType: "AUTHOR_TEXT",
                                        idx: 1
                                    }))
                                })
                            }}
                            tokenSeparators={[',']}
                        >
                            {
                                this.state.originalAuthor.map(item => <Option key={item.authorName}>{item.authorName}</Option>)
                            }
                        </Select>
                    </Col>
                    <Col className='colTitle' span={3} offset={1}>图片处理:</Col>
                    <Col span={8} >
                        <Select
                            mode="multiple"
                            style={{ width: '100%' }}
                            value={this.state.authorArtList.map(item => item.authorName)}
                            onChange={(v) => {
                                this.setState({
                                    authorArtList: v.map(item => ({
                                        bookCode: window.location.href.split('bookCode=')[1].split('&')[0],
                                        authorCode: this.state.animationAuthor.find(_item => item == _item.authorName).authorCode,
                                        authorName: item,
                                        authorType: "AUTHOR_ART",
                                        idx: 5
                                    }))
                                })
                            }}
                            tokenSeparators={[',']}
                        >
                            {
                                this.state.animationAuthor.map(item => <Option key={item.authorName}>{item.authorName}</Option>)
                            }
                        </Select>
                    </Col>
                </Row>
                <Row className='row'>
                    <Col className='colTitle' span={3} offset={0}>原著翻译作者:</Col>
                    <Col span={8} >
                        <Select
                            mode="multiple"
                            style={{ width: '100%' }}
                            value={this.state.authorTranslationList.map(item => item.authorName)}
                            onChange={(v) => {

                                this.setState({
                                    authorTranslationList: v.map(item => ({
                                        bookCode: window.location.href.split('bookCode=')[1].split('&')[0],
                                        authorCode: this.state.originalAuthor.find(_item => item == _item.authorName).authorCode,
                                        authorName: item,
                                        authorType: "AUTHOR_TRANSLATION",
                                        idx: 4
                                    }))
                                })
                            }}
                            tokenSeparators={[',']}
                        >
                            {
                                this.state.originalAuthor.map(item => <Option key={item.authorName}>{item.authorName}</Option>)
                            }
                        </Select>
                    </Col>
                    <Col className='colTitle' span={3} offset={1}>动效:</Col>
                    <Col span={8} >
                        <Select
                            mode="multiple"
                            style={{ width: '100%' }}
                            value={this.state.authorDesignList.map(item => item.authorName)}
                            onChange={(v) => {
                                this.setState({
                                    authorDesignList: v.map(item => ({
                                        bookCode: window.location.href.split('bookCode=')[1].split('&')[0],
                                        authorCode: this.state.animationAuthor.find(_item => item == _item.authorName).authorCode,
                                        authorName: item,
                                        authorType: "AUTHOR_DESIGN",
                                        idx: 6
                                    }))
                                })
                            }}
                            tokenSeparators={[',']}
                        >
                            {
                                this.state.animationAuthor.map(item => <Option key={item.authorName}>{item.authorName}</Option>)
                            }
                        </Select>
                    </Col>
                </Row>
                <Row className='row'>
                    <Col className='colTitle' span={3} offset={0}>原著绘图作者:</Col>
                    <Col span={8} >
                        <Select
                            mode="multiple"
                            style={{ width: '100%' }}
                            value={this.state.authorPaintingList.map(item => item.authorName)}
                            onChange={(v) => {
                                this.setState({
                                    authorPaintingList: v.map(item => ({
                                        bookCode: window.location.href.split('bookCode=')[1].split('&')[0],
                                        authorCode: this.state.originalAuthor.find(_item => item == _item.authorName).authorCode,
                                        authorName: item,
                                        authorType: "AUTHOR_PAINTING",
                                        idx: 2
                                    }))
                                })
                            }}
                            tokenSeparators={[',']}
                        >
                            {
                                this.state.originalAuthor.map(item => <Option key={item.authorName}>{item.authorName}</Option>)
                            }
                        </Select>
                    </Col>
                    <Col className='colTitle' span={3} offset={1}>分镜:</Col>
                    <Col span={8} >
                        <Select
                            mode="multiple"
                            style={{ width: '100%' }}
                            value={this.state.authorScriptList.map(item => item.authorName)}
                            onChange={(v) => {
                                this.setState({
                                    authorScriptList: v.map(item => ({
                                        bookCode: window.location.href.split('bookCode=')[1].split('&')[0],
                                        authorCode: this.state.animationAuthor.find(_item => item == _item.authorName).authorCode,
                                        authorName: item,
                                        authorType: "AUTHOR_SCRIPT",
                                        idx: 3
                                    }))
                                })
                            }}
                            tokenSeparators={[',']}
                        >
                            {
                                this.state.animationAuthor.map(item => <Option key={item.authorName}>{item.authorName}</Option>)
                            }
                        </Select>
                    </Col>
                </Row>
                <Row className='row'>
                    <Col className='colTitle' span={3} offset={12}>审校:</Col>
                    <Col span={8} >
                        <Select
                            mode="multiple"
                            style={{ width: '100%' }}
                            value={this.state.authorReviewList.map(item => item.authorName)}
                            onChange={(v) => {
                                this.setState({
                                    authorReviewList: v.map(item => ({
                                        bookCode: window.location.href.split('bookCode=')[1].split('&')[0],
                                        authorCode: this.state.animationAuthor.find(_item => item == _item.authorName).authorCode,
                                        authorName: item,
                                        authorType: "AUTHOR_REVIEW",
                                        idx: 8
                                    }))
                                })
                            }}
                            tokenSeparators={[',']}
                        >
                            {
                                this.state.animationAuthor.map(item => <Option key={item.authorName}>{item.authorName}</Option>)
                            }
                        </Select>
                    </Col>
                </Row>

                <Row className='row'>
                    <Col className='colTitle' span={3} offset={12}>音频:</Col>
                    <Col span={8} >
                        <Select
                            mode="multiple"
                            style={{ width: '100%' }}
                            value={this.state.authorAudioList.map(item => item.authorName)}
                            onChange={(v) => {
                                this.setState({
                                    authorAudioList: v.map(item => ({
                                        bookCode: window.location.href.split('bookCode=')[1].split('&')[0],
                                        authorCode: this.state.animationAuthor.find(_item => item == _item.authorName).authorCode,
                                        authorName: item,
                                        authorType: "AUTHOR_AUDIO",
                                        idx: 7
                                    }))
                                })
                            }}
                            tokenSeparators={[',']}
                        >
                            {
                                this.state.animationAuthor.map(item => <Option key={item.authorName}>{item.authorName}</Option>)
                            }
                        </Select>
                    </Col>
                </Row>

                <Row className='row' style={{ marginTop: '200px' }}>
                    <Col span={4} offset={6}>
                        <Button onClick={() => { this.skipStep(0) }} type='primary' style={{ width: 120 }}>上一步</Button>
                    </Col>
                    <Col span={4} offset={1}>
                        <Button onClick={() => { this.submitData("save") }} type='primary' style={{ width: 120 }}>保存</Button>
                    </Col>
                    <Col span={4} offset={1}>
                        <Button onClick={() => { this.skipStep(2) }} type='primary' style={{ width: 120 }}>下一步</Button>
                    </Col>
                </Row>
                 <Modal
			          	title="保存确认"
			          	visible={this.state.visible2}
			          	onOk={this.handleOk}
			          	onCancel={()=>this.setState({visible2:false})}
			          	footer={null}
			        >
                        <h5 style={{"text-align":"center","font-size":"16px"}}>您已修改了该页面的信息，请确认是否保存？</h5>
                        <p style={{"text-align":"center","marginBottom":"30px"}}>
                            <Icon type="warning" theme="filled" style={{"marginRight":"3px"}} />
                            <span>所有必填信息填写完全才可保存</span>
                        </p>
			          	<div style={{"text-align":"center"}}>
	                        <Button className="buttonWidth intervalRight" onClick={()=>this.modalClick("leave")}>离开</Button>
	                        <Button className="buttonWidth" onClick={()=>this.modalClick("save")}>保存</Button>
                        </div>
			        </Modal>
            </div>
        </Spin>
    }
}