import React from 'react';
import { Icon, Button, Row, Col, Select, DatePicker, Input, Popconfirm, message, Modal, Radio, Checkbox, Carousel, Spin } from 'antd';
// const { MonthPicker, RangePicker } = DatePicker;
// import moment from 'moment';
// import 'moment/locale/zh-cn';
import './preview2.css';
// moment.locale('zh-cn');
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;
import getUrl from "../util.js";
import commonData from '../commonData.js';

export default class PriceSet extends React.Component {

    constructor() {
        super()
        this.state = {
            spinning: true,
            storyData:[]
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
        var data = await fetch(getUrl.url, {
            method: 'POST',
            headers: {
                "Content-type": "application/x-www-form-urlencoded"
            },
            mode: 'cors',
            body: "method=ella.operation.HomePagePreview"+"&content=" +JSON.stringify({"platformCode":this.props.platformCode}) + commonData.dataString
        }).then(res => res.json());
        console.log(data);
        this.setState({
            storyData:data.data.part,
            spinning: false
        })
    }
    render() {
        console.log(this.state.storyData)
        return <Spin spinning={this.state.spinning}>
            <div id='preview2'>
                <div className="imgWrap">
                    <div style={{"width":"9999px"}}>
                        <div className="storyItem">
                            <img src={ require('../../assets/images/trainHead.png') } className="imgItem img1"/>
                        </div>
                        <div className="storyItem">
                            <img src={ require('../../assets/images/trainSecond.png') } className="imgItem img2"/>
                        </div>
                        {
                            this.state.storyData.map((item,index)=>{
                                if(item.partSource!="ella.book.listBookCommons"&&item.partSource!="ella.book.listBookNewest"){
                                    return;
                                }
                                if(index%3===0){
                                    return <div className="storyItem">
                                        <img src={ require('../../assets/images/trainOne.png') } className="imgItem img3"/>
                                        <span className="t1">{item.partTitle}</span>
                                    </div>
                                }else if(index%3===1){
                                    return <div className="storyItem">
                                        <img src={ require('../../assets/images/trainTwo.png') } className="imgItem img4"/>
                                        <span className="t2">{item.partTitle}</span>
                                    </div>
                                }else{
                                    return <div className="storyItem">
                                        <img src={ require('../../assets/images/trainThree.png') } className="imgItem img5"/>
                                        <span className="t3">{item.partTitle}</span>
                                    </div>
                                }
                                
                            })
                        }
                    </div>
                </div>
            </div>
        </Spin>
    }
}