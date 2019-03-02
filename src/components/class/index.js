import React from 'react';
import { Icon, Button, Row, Col, Select, DatePicker, Input, Popconfirm, message, Modal, Radio, Checkbox, Carousel, Spin, Upload, Tabs } from 'antd';
import { Link } from 'react-router';
// import ClassSet from './classSet.js';
// const { MonthPicker, RangePicker } = DatePicker;
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;
import './index.css';
import getUrl from "../util.js";
const TabPane = Tabs.TabPane;
import OnShelfCourse from './onShelfCourse.js';
import AllCourse from './allClurses.js';
export default class PriceSet extends React.Component {

    constructor() {
        super()
        this.state = {


        }
    }

    setOneKV(k, v) {
        this.setState({
            [k]: v
        })
    }

    componentDidMount() {

    }

    render() {

        return <div className="classIndex">
            <p className="m-head">课程管理</p>
            <Link to='course/add/1'>
                <Button type="primary" icon="plus" className="add-partner-btn" onClick={() => { }}>添加新课程</Button>
            </Link>
            <Tabs defaultActiveKey={this.props.params.num || '1'} tabBarStyle={{ textAlign: 'center' }}>
                <TabPane tab="上架课程" key="1">
                    <OnShelfCourse></OnShelfCourse>
                </TabPane>
                <TabPane tab="全部课程" key="2">
                    <AllCourse></AllCourse>
                </TabPane>
            </Tabs>
        </div>
    }
}