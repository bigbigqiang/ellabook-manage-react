import React from 'react';
import { Icon, Button, Row, Col, Select, DatePicker, Input, Popconfirm, message, Modal, Radio, Checkbox, Carousel, Spin, Upload, Tabs } from 'antd';
import { Link } from 'react-router';
// import ClassSet from './classSet.js';
// const { MonthPicker, RangePicker } = DatePicker;
// const Step = Steps.Step;
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
import checkImg from '../../../assets/images/check.png';
import unCheckImg from '../../../assets/images/noCheck.png';
const TabPane = Tabs.TabPane;
// const RadioGroup = Radio.Group;
// const CheckboxGroup = Checkbox.Group;
import './index.css';
import Part1 from './part1.js';
import Part2 from './part2.js';
import Part3 from './part3.js';
import Part4 from './part4.js';
import Part5 from './part5.js';
import getUrl from "../../util.js";
export default class PriceSet extends React.Component {

    constructor() {
        super()
        this.state = {
            step: 0,
            visible:false,

        }
    }

    setOneKV(k, v) {
        this.setState({
            [k]: v
        })
    }

    componentDidMount() {

    }
    changePage(n) {
    	console.log(n);
        this.setState({
            step:n
        },()=>{
            console.log(this.state.step)
        }
        )
    }
    showModal(visibleState){
        console.log(visibleState)
        this.setState({visible:visibleState})
    }
    tabChanges(step){
        // this.setState({step})

        const part="part"+(this.state.step+1);
        console.log(part)
        this.refs[part].skipStep(step);
    }
   
    render() {
        console.log(this.state.step)
        return <div className="editorBook">
            <p className='title'><Link style={{ color: '#333' }} to={'/bookList'}><Icon type="left" />编辑图书信息</Link></p>
            <Row
            // style={{ minWidth: '1584px' }}
            >
                {/* <div className='editorBookBar'> */}
                <Col span={4} offset={2}
                // style={{ minWidth: '360px' }}
                >
                    <div className='aa' style={{
                        // backgroundColor: this.state.step >= 0 ? 'pink' : 'yellow'
                        backgroundImage: 'url(' + (this.state.step == 0 ? checkImg : unCheckImg) + ')'
                    }}
                    onClick={()=>this.tabChanges(0)}
                    >
                        <span>图书基本信息</span>
                    </div>
                </Col>
                <Col span={4}
                // style={{ minWidth: '360px' }}
                >
                    <div className='aa' style={{
                        // backgroundColor: this.state.step >= 1 ? 'pink' : 'yellow'
                        backgroundImage: 'url(' + (this.state.step == 1 ? checkImg : unCheckImg) + ')'

                        }}
                         onClick={()=>this.tabChanges(1)}
                    >
                        <span>图书作者信息</span>
                    </div>
                </Col>
                <Col span={4}
                // style={{ minWidth: '360px' }}
                >
                    <div className='aa' style={{
                        // backgroundColor: this.state.step >= 2 ? 'pink' : 'yellow'
                        backgroundImage: 'url(' + (this.state.step == 2 ? checkImg : unCheckImg) + ')'
                    }}
                     onClick={()=>this.tabChanges(2)}
                    >
                        <span>图书封面与截图</span>
                    </div>
                </Col>
                <Col span={4}
                // style={{ minWidth: '360px' }}
                >
                    <div className='aa' style={{
                        // backgroundColor: this.state.step >= 3 ? 'pink' : 'yellow'
                        backgroundImage: 'url(' + (this.state.step == 3 ? checkImg : unCheckImg) + ')'
                    }}
                     onClick={()=>this.tabChanges(3)}
                    >
                        <span>分类标签信息</span>
                    </div>
                </Col>
                <Col span={4}
                // style={{ minWidth: '360px' }}
                >
                    <div className='aa' style={{
                        // backgroundColor: this.state.step >= 3 ? 'pink' : 'yellow'
                        backgroundImage: 'url(' + (this.state.step == 4 ? checkImg : unCheckImg) + ')'
                    }}
                     onClick={()=>this.tabChanges(4)}
                    >
                        <span>获奖详情</span>
                    </div>
                </Col>
                {/* </div> */}
            </Row>
            {/* <button
                onClick={() => {
                    this.changePage(-1);
                }}
            >-</button>
            <button
                onClick={() => {
                    this.changePage(+1);
                }}
            >+</button> */}

            <Row style={{ marginTop: '20px' }}>
				{
//					activeKey={this.state.step + 1 + ''}
				}
                <Col span={20} offset={2}>
                    <Tabs activeKey={this.state.step + 1 + ''}>
                        <TabPane tab="Tab 1" key="1"><Part1 changePage={this.changePage.bind(this)} ref="part1" showModal={(visibleState)=>this.showModal(visibleState)}></Part1></TabPane>
                        <TabPane tab="Tab 2" key="2"><Part2 changePage={this.changePage.bind(this)} ref="part2" showModal={(visibleState)=>this.showModal(visibleState)}></Part2></TabPane>
                        <TabPane tab="Tab 3" key="3"><Part3 changePage={this.changePage.bind(this)} ref="part3" showModal={(visibleState)=>this.showModal(visibleState)}></Part3></TabPane>
                        <TabPane tab="Tab 4" key="4"><Part4 changePage={this.changePage.bind(this)} ref="part4" showModal={(visibleState)=>this.showModal(visibleState)}></Part4></TabPane>
                        <TabPane tab="Tab 5" key="5"><Part5 changePage={this.changePage.bind(this)} ref="part5" showModal={(visibleState)=>this.showModal(visibleState)}></Part5></TabPane>
                    </Tabs>
                   
                </Col>
            </Row>

        </div>
    }
}