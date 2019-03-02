import React from 'react';
import { Icon, Button, Row, Col, Select, DatePicker, Input, Popconfirm, message, Modal, Radio, Checkbox, Carousel, Spin, Upload, Steps, InputNumber, Popover } from 'antd';
import { Link } from 'react-router';
// import ClassSet from './classSet.js';
// const { MonthPicker, RangePicker } = DatePicker;
const { TextArea } = Input;
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
    // author:来洪波
    //fetchDefaultData:获取下拉数据;
    // fetch:获取图书相关默认数据;
    // submitData:提交数据;
    // setOneKV:用来改变state;
    // (part1~part4都是这样命名的)
    constructor() {
        super()
        this.state = {
            // endTime: '2018-12-12'
            spinning: true,
            bookCode: window.location.href.split('bookCode=')[1].split('&')[0],
            publishList: [],
            playBook: [],
            languageData: [],
            versionData: [],
            bookName: '',//图书名称
            pinyin: '',//图书拼音
            bookSeriesName: '',//列表名称
            bookPublish: '',//图书出版社
            bookPages: '',//页数
            goodsMarketprice: '',//纸质书价格
            goodsPrice: '',//标准价格
            language: '',//语言类型
            bookStartAge: '',//最低适龄
            bookEndAge: '',//最高适龄
            copyrightValidityStart: '',//版权开始时间
            copyrightValidityEnd: '',//版权结束时间
            bookMode: '',//阅读模式返回的是string,要转[]
            isVip: 'VIP_YES',//是不是vip借阅
            isSvip:"VIP_NO",//会员借阅类型
           
            operatingCopywriter:'',//运营文案
            bookIntroduction: '',//图书介绍
            resourceVersion: '',//资源版本号
            versionUpdateTime: '',//无用参数
            goodsSrcPrice: '',//无用价格参数
            initData:'',//判断当前页面是否修改对比
            saveType:'',
            skipStep:'',
            visible:false,
            radios:false,
            accompanyReading:[],
            bookModeAccompanyUsers:''
        }
    }

    setOneKV(k, v) {
        this.setState({
            [k]: v
        })
    }

    componentDidMount(){
        this.fetchDefaultData();
        this.accompanyReadingData()
    }
    accompanyReadingData(){
        getUrl.API({
                "type": "HAND_BOX",
                "groupId": "BOOK_MODE_ACCOMPANY"
            },"ella.operation.boxSearchList")
             .then(response=>{
                console.log(response);
                return response.json();
            })
            .then(response=>{
                console.log(response);
                if (response.status == 1) {
                    this.setState({accompanyReading:response.data})
                }
            })
    }
    async fetchDefaultData() {
        var publishList = await fetch(getUrl.url, {
            mode: "cors",
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: "method=ella.operation.boxSearchList" + "&content=" + JSON.stringify({
                "type": "AUTO_BOX",
                "groupId": "operation.box.publishList"
            }) + commonData.dataString
        }).then(res => res.json());

        var playBook = await fetch(getUrl.url, {
            mode: "cors",
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: "method=ella.operation.boxSearchList" + "&content=" + JSON.stringify({
                "type": "HAND_BOX",
                "groupId": "BOOK_MODE"
            }) + commonData.dataString
        }).then(res => res.json());

        var languageData = await fetch(getUrl.url, {
            mode: "cors",
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: "method=ella.operation.boxSearchList" + "&content=" + JSON.stringify({
                "type": "HAND_BOX",
                "groupId": "BOOK_LANGUAGE"
            }) + commonData.dataString
        }).then(res => res.json());

//      var versionData = await fetch(getUrl.url, {
//          mode: "cors",
//          method: "POST",
//          headers: {
//              'Content-Type': 'application/x-www-form-urlencoded',
//          },
//          body: "method=ella.operation.getVersionNumberAndVersionUpdateTiem" + "&content=" + JSON.stringify({}) + commonData.dataString
//      }).then(res => res.json());



        this.setState({
            publishList: publishList.data,
            playBook: playBook.data,
            languageData: languageData.data,
//          versionData: versionData.data,
        }, () => {
            this.fetch();
        })
    }
    async fetch() {

        var data = await fetch(getUrl.url, {
            mode: "cors",
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: "method=ella.operation.getBookInfo" + "&content=" + JSON.stringify({
                "bookCode": window.location.href.split('bookCode=')[1].split('&')[0]
            }) + commonData.dataString
        }).then(res => res.json());
        console.log(data);
        var curdata=data.data;
        if(curdata.book.bookMode.indexOf("BOOK_PARENTING")>-1){
             this.setState({radios:true})
            if(curdata.book.bookModeAccompanyUsers==''){
                curdata.book.bookModeAccompanyUsers='ALL_USERS';
               
            }
           
        }
        this.setState({
            ...curdata.book,
            ...curdata.goods,
            spinning: false,
            initData: curdata,

        },()=>{console.log(this.state)})
    }
   
    async submitData(saveType) {
            
        
       
        let { versionUpdateTime, versionNumber, goodsSrcPrice, bookCode, bookName, pinyin, bookSeriesName, bookPublish, bookPages, goodsMarketprice, goodsPrice, language, bookStartAge, bookEndAge, copyrightValidityStart, copyrightValidityEnd, bookMode,operatingCopywriter, bookIntroduction,isSvip,isVip,bookModeAccompanyUsers } = this.state;
        if(bookMode.indexOf("BOOK_PARENTING")==-1){
            bookModeAccompanyUsers="";
        }
        console.log(bookModeAccompanyUsers)
        var submitData = {

            bookCode: this.state.bookCode,
            book: {
                bookSeriesName,
                copyrightValidityStart,
                versionUpdateTime,

                language,
                bookEndAge,
                bookName,
                isVip,
                versionNumber,
                bookPages,
               
                operatingCopywriter,
                pinyin,
                bookIntroduction:encodeURIComponent(bookIntroduction),
                bookMode,
                bookStartAge,
                copyrightValidityEnd,
                bookPublish,
                isSvip,
                bookModeAccompanyUsers,
            },
            goods: {
                goodsPrice,
                goodsMarketprice,
                goodsSrcPrice
            }
        }
        if (bookName == '') { message.error('图书名称不能为空'); return }
        if (pinyin == '') { message.error('图书拼音不能为空'); return; }
        if (bookPublish == '') { message.error('出版社不能为空'); return; }
//      if (bookSeriesName == '') { message.error('系列名不能为空'); return; }

        if (bookPages ==undefined) { message.error('页数不能为空'); return; }

        if (goodsMarketprice ==undefined) { message.error('纸质书价格不能为空'); return; }
        if (goodsPrice ==undefined) { message.error('标准价格不能为空'); return; }
        if (language =='') { message.error('语言类型不能为空'); return; }
        ///////////////////////////////////修改2.2.1bug
        console.log(bookStartAge)
        console.log(bookEndAge)
        if (bookStartAge == ''||bookStartAge == undefined||bookEndAge == undefined|| bookEndAge == '') { message.error('适龄不能为空'); return; }
    	if (bookMode.indexOf('BOOK_PLAY') == -1) { message.error('阅读模式必选'); return; }

        if (bookIntroduction == '') { message.error('图书介绍不能为空'); return; }
      
//		if(copyrightValidityEnd==''||copyrightValidityStart==''){
//			message.error('请选择版权有效期'); return; 
//		}
//		if(copyrightValidityStart>copyrightValidityEnd){
//			message.error('版权开始时间不能大于结束时间'); return; 
//		}

        var data = await fetch(getUrl.url, {
            mode: "cors",
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: "method=ella.operation.updateBookInfo" + "&content=" + JSON.stringify(submitData) + commonData.dataString
        }).then(res => res.json());
            if(data.status == 1){
                  message.success("保存成功！")
                this.setState({
                    visible:false,
                
                });
                this.fetchDefaultData();
                this.accompanyReadingData()
                if(saveType=="save"){
                    
                }else if(saveType=="skepsave"){
                    this.props.changePage(this.state.skipStep);
                }
            }else{
                message.error(data.message)
            }
          
           

            // if(data.status == 1){
            //      if (type=="next") {
                    
            //         this.props.changePage(1);
            //     }else if(type=="skepsave"||type=="step"){
                   
            //         this.props.changePage(this.state.skipStep);
            //     }else{
            //         console.log(1)
            //         this.setState({
            //             initData:submitData
            //         })
            //     }
            // }
           
    }
    modalClick(type){
       if(type=="leave"){
       		this.fetchDefaultData();
        	this.accompanyReadingData()
//           this.setState({
//              ...this.state.initData.book,
//              ...this.state.initData.goods,
//          })
            //不保存，直接离开
            this.setState({visible:false},()=>{
            	this.props.changePage(this.state.skipStep);
            });
            
          
        }else if(type=="save"){
            
            this.submitData("skepsave");
        }
       
       
    }
    skipStep(step){
        this.setState({
            skipStep:step
        })
       
        //判断页面是否有修改
        if(this.state.bookName!=this.state.initData.book.bookName){
           
            this.setState({visible:true})
        //    this.props.showModal("true")
            return;
            
        }
        if(this.state.pinyin!=this.state.initData.book.pinyin){
            
            this.setState({visible:true})
            return;  
        } 
        if(this.state.bookSeriesName!=this.state.initData.book.bookSeriesName){
          
            this.setState({visible:true})
            return;     
        }  
        if(this.state.bookPublish!=this.state.initData.book.bookPublish){
           
            this.setState({visible:true})
            return;      
        }  
        if(this.state.bookPages!=this.state.initData.book.bookPages){
           
            this.setState({visible:true})
            return;
            
        }  
        if(this.state.goodsMarketprice!=this.state.initData.goods.goodsMarketprice){
           
            this.setState({visible:true})
            return;
        }  
        if(this.state.goodsPrice!=this.state.initData.goods.goodsPrice){
           
            this.setState({visible:true})
            return;
        } 
        if(this.state.language!=this.state.initData.book.language){
           
            this.setState({visible:true})
            return;
        } 
        if(this.state.bookStartAge!=this.state.initData.book.bookStartAge){
           
            this.setState({visible:true})
            return;
        } 
        if(this.state.bookEndAge!=this.state.initData.book.bookEndAge){
           
            this.setState({visible:true})
            return;
        } 
        
        if(this.state.copyrightValidityStart!=this.state.initData.book.copyrightValidityStart){
            
            this.setState({visible:true})
            return;
        } 
        if(this.state.copyrightValidityEnd!=this.state.initData.book.copyrightValidityEnd){
           
            this.setState({visible:true})
            return;
        } 
        if(this.state.bookMode!=this.state.initData.book.bookMode){
           
            this.setState({visible:true})
        } 
           
         if(this.state.bookModeAccompanyUsers!=this.state.initData.book.bookModeAccompanyUsers){
           
            this.setState({visible:true})
             return;
        } 
        if(this.state.isSvip!=this.state.initData.book.isSvip){
           
            this.setState({visible:true})
            return;
        }
           
      
        if(this.state.operatingCopywriter!=this.state.initData.book.operatingCopywriter){
           
             this.setState({visible:true})
            return;
        }
        if(this.state.bookIntroduction!=this.state.initData.book.bookIntroduction){
            
            this.setState({visible:true})
            return;
        }
        this.props.changePage(step);

    }
    render() {
        console.log(this.state)
        const {isSvip}=this.state;
        return <Spin spinning={this.state.spinning}>
            <div className="bookPart">
                <Row className='row'>
                    <Col span={10}>
                        <span style={{ fontSize: '20px', fontWeight: 'bold' }}>图书信息</span>
                    </Col>
                </Row>

                <Row className='row'>
                    <Col span={2} className="ant-form-item-required colTitle" style={{"color": "rgba(0,0,0,.65)","line-height":"28px","text-indent": 0}}>图书名称:</Col>
                   
                    <Col span={4}>
                        <Input
                            value={this.state.bookName}
                            onChange={(e) => { this.setOneKV('bookName', e.target.value) }}
                            style={{ width: '100%' }}
                        />
                    </Col>
                     <Col span={2} offset={2} className="ant-form-item-required colTitle" style={{"color": "rgba(0,0,0,.65)","line-height":"28px","text-indent": 0}}>图书拼音:</Col>
                    <Col span={4}>
                        <Input
                            value={this.state.pinyin}
                            onChange={(e) => { this.setOneKV('pinyin', e.target.value) }}
                            style={{ width: '100%' }}
                        />
                    </Col>
                    <Col className='colTitle' span={2} offset={2} style={{"text-align":"left!important"}} >系列名:</Col>
                    <Col span={4}>
                        <Input
                            value={this.state.bookSeriesName}
                            onChange={(e) => { this.setOneKV('bookSeriesName', e.target.value) }}
                            style={{ width: '100%' }}
                        />
                    </Col>
                </Row>

                <Row className='row'>
                    <Col span={2} className="ant-form-item-required colTitle" style={{"color": "rgba(0,0,0,.65)","line-height":"28px","text-indent": 0}}>出版社:</Col>
                    <Col span={4}>
                        <Select value={this.state.bookPublish} style={{ width: '100%' }} onChange={(v) => { this.setOneKV('bookPublish', v) }}>
                            {/* <Option value="jack">Jack</Option> */}
                            {
                                this.state.publishList.map(item => <Option value={item.uid}>{item.businessTruename}</Option>)
                            }
                        </Select>
                    </Col>
                    <Col span={2} offset={2} className="ant-form-item-required colTitle" style={{"color": "rgba(0,0,0,.65)","line-height":"28px","text-indent": 0}}>页数:</Col>
                    <Col span={4}>
                        <InputNumber
                            min={1}
                            max={10000000}
                            value={this.state.bookPages}
                            onChange={(v) => { this.setOneKV('bookPages', v) }}
                            style={{ width: '100%' }}
                        />
                    </Col>
                     <Col span={2} offset={2} className="ant-form-item-required colTitle" style={{"color": "rgba(0,0,0,.65)","line-height":"28px","text-indent": 0}}>纸质书价格:</Col>
                    
                    <Col span={4}>
                        <InputNumber
                            min={0}
                            max={10000000}
                            value={this.state.goodsMarketprice}
                            step={0.01}
                            onChange={(v) => { this.setOneKV('goodsMarketprice', v) }}
                            style={{ width: '100%' }}
                        />
                    </Col>
                </Row>
                <Row className='row'>
                    <Col span={2} className="ant-form-item-required colTitle" style={{"color": "rgba(0,0,0,.65)","line-height":"28px","text-indent": 0}}>标准价格:</Col>
                   
                    <Col span={4}>
                        <InputNumber
                            min={0}
                            max={10000000}
                            value={this.state.goodsPrice}
                            step={0.01}
                            onChange={(v) => { this.setOneKV('goodsPrice', v) }}
                            style={{ width: '100%' }}
                        />
                    </Col>
                   <Col span={2} offset={2} className="ant-form-item-required colTitle" style={{"color": "rgba(0,0,0,.65)","line-height":"28px","text-indent": 0}}>语言类型:</Col>
                    <Col span={4}>
                        <Select value={this.state.language} style={{ width: '100%' }} onChange={(v) => { this.setOneKV('language', v) }}>
                            {/* <Option value="jack">Jack</Option> */}
                            {
                                this.state.languageData.map(item => <Option value={item.searchCode}>{item.searchName}</Option>)
                            }
                        </Select>
                    </Col>
                    <Col span={2} offset={2} className="ant-form-item-required colTitle" style={{"color": "rgba(0,0,0,.65)","line-height":"28px","text-indent": 0}}>适龄:</Col>
                    <Col span={1}>
                        <InputNumber
                            min={0}
                            max={10000000}
                            value={this.state.bookStartAge}
                            onChange={(v) => { this.setOneKV('bookStartAge', v) }}
                            style={{ width: '150%' }}
                        />
                    </Col>
                    <Col span={2} style={{ textAlign: 'center' }}>
                        <span className='bar'>——</span>
                    </Col>
                    <Col span={1}>
                        <InputNumber
                            min={0}
                            max={10000000}
                            value={this.state.bookEndAge}
                            onChange={(v) => { this.setOneKV('bookEndAge', v) }}
                            style={{ width: '150%' }}
                        />
                    </Col>
                </Row>
                <Row className='row'>
                    <Col className='colTitle' span={2} >资源版本:</Col>
                    <Col span={4}>
                        <Input
                            disabled
                            style={{ width: '100%' }}
                            // value={this.state.versionNumber}
                            value={this.state.resourceVersion}
                        // onChange={(e) => { this.setOneKV('versionNumber', e.target.value) }}
                        />
                        <Popover
                            className='pover'
                            placement="rightTop"
                            title={
                                <Row>
                                    <Col className="poverText" span={12}>版本号</Col>
                                    <Col className="poverText" span={12}>日期</Col>
                                </Row>
                            }
                            content={
                                <div style={{ width: '300px' }}>
                                    {/* <Row className='poverRow'>
                                    <Col className="poverText" span={12}>2.1.0</Col>
                                    <Col className="poverText" span={12}>2018-01-02 20:20</Col>
                                </Row> */}
                                    {
//                                      this.state.versionData.map(item => {
//                                          return <Row>
//                                              <Col className="poverText" span={12}>{item.versionNumber}</Col>
//                                              <Col className="poverText" span={12}>{item.versionUpdateTime}</Col>
//                                          </Row>
//                                      })
                                    }
                                </div>
                            }
                            trigger="click">
                            {/* 版本号按钮影藏,打开只要解注下面代码 */}
                            {/* <Icon style={{ fontSize: '20px', textIndent: '10px' }} type="file-text" /> */}
                        </Popover>
                    </Col>
                    <Col className='colTitle' span={2} offset={2}>版权有效期:</Col>
                    <Col span={4}>
                        <DatePicker
                            style={{ width: "100%" }}
                            // showTime={{ format: 'HH:mm:ss' }}
                            format="YYYY-MM-DD"
                            placeholder={['开始时间']}
                            onChange={(value, dateString) => { this.setOneKV('copyrightValidityStart', dateString) }}
                            value={this.state.copyrightValidityStart ? moment(this.state.copyrightValidityStart, 'YYYY-MM-DD HH:mm:ss') : this.state.copyrightValidityStart}
                            disabled={this.state.pushTimeType == 'SEND_NOW' ? true : false}
                        />
                    </Col>
                    <Col style={{ textAlign: 'center' }} span={2}>
                        <span className="bar">——</span>
                    </Col>
                    <Col span={4}>
                        <DatePicker
                            style={{ width: "100%" }}
                            // showTime={{ format: 'HH:mm:ss' }}
                            format="YYYY-MM-DD"
                            placeholder={['结束时间']}
                            onChange={(value, dateString) => { this.setOneKV('copyrightValidityEnd', dateString) }}
                            value={this.state.copyrightValidityEnd ? moment(this.state.copyrightValidityEnd, 'YYYY-MM-DD HH:mm:ss') : this.state.copyrightValidityEnd}
                            disabled={this.state.pushTimeType == 'SEND_NOW' ? true : false}
                        />
                    </Col>
                </Row>

                <Row className='row'>
                    <Col span={2} className="ant-form-item-required colTitle" style={{"color": "rgba(0,0,0,.65)","line-height":"28px","text-indent": 0}}>阅读模式:</Col>
                    <Col span={10}>
                        <CheckboxGroup
                            value={this.state.bookMode == '' ? [] : this.state.bookMode.split(',')}
                            options={
                                //     [
                                //     { label: 'Apple', value: 'Apple' },
                                // ]
                                this.state.playBook.map(item => ({ label: item.searchName, value: item.searchCode }))
                            }
                            // defaultValue={['Apple']}
                            onChange={(v) => { 
                               
                                this.setOneKV('bookMode', v.join(',')) 
                                if(v.indexOf("BOOK_PARENTING")>-1){
                                	console.log("1")
                                    this.setState({
                                        radios:true,
                                        bookModeAccompanyUsers:this.state.bookModeAccompanyUsers==""?"ALL_USERS":this.state.bookModeAccompanyUsers
                                    })   
                                }else{
                                    this.setState({
                                    	
                                        radios:false,
                                        
                                    })   
                                }
                                console.log(this.state.bookModeAccompanyUsers)
                            }} 
                        />
                    </Col>
                    <Col className='colTitle' span={2} offset={2}>会员借阅:</Col>
                    
                    <RadioGroup style={{"height":"30px","line-height":"30px"}} value={this.state.isSvip}  onChange={(e) => { console.log(e.target.value);this.setOneKV('isSvip', e.target.value) }}>
                        <Radio value={"VIP_NO"}>全部会员</Radio>
                        <Radio value={"VIP_YES"}>高级会员</Radio>
                    </RadioGroup>
                </Row>
                {
                    this.state.radios?<Row className='row'>
                    <Col className='colTitle' span={2} >伴读模式限定:</Col>
                  
                    <RadioGroup value={this.state.bookModeAccompanyUsers} style={{"height":"30px","line-height":"30px"}} onChange={(e) => { console.log(e.target.value);this.setOneKV('bookModeAccompanyUsers', e.target.value)  }}>
                        {
                            this.state.accompanyReading.map((item)=>{
                                return  <Radio value={item.searchCode}>{item.searchName}</Radio>
                            })
                        }
                       
                      
                    </RadioGroup>
                </Row>:null
                }
				
               
				<Row className='row'>
                    <Col className='colTitle' span={2} >运营文案:</Col>
                    <Col span={20}>
                        <Input
                            value={this.state.operatingCopywriter}
                            onChange={(e) => { this.setOneKV('operatingCopywriter', e.target.value) }}
                            
                        />
                    </Col>
                </Row>
                <Row className='row'>
                    <Col span={2} className="ant-form-item-required colTitle" style={{"color": "rgba(0,0,0,.65)","line-height":"28px","text-indent": 0}}>图书简介:</Col>
                    <Col span={20}>
                        <TextArea
                            value={this.state.bookIntroduction}
                            onChange={(e) => { this.setOneKV('bookIntroduction', e.target.value) }}
                            rows={8}
                        />
                    </Col>
                </Row>
                <Row>
                    <Col span={4} offset={8}>
                        <Button onClick={() => { this.submitData("save") }} type='primary' style={{ width: 120 }}>保存</Button>
                    </Col>
                    <Col span={4} offset={2}>
                        <Button onClick={() => { this.skipStep(1) }} type='primary' style={{ width: 120 }}>下一步</Button>
                    </Col>
                </Row>
                <Modal
			          	title="保存确认"
			          	visible={this.state.visible}
			          	onOk={this.handleOk}
			          	onCancel={()=>this.setState({visible:false})}
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