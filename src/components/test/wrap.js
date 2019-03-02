import React from 'react';
import { Row, Col, Select, Input, message, Modal, Table } from 'antd';
// const { MonthPicker, RangePicker } = DatePicker;
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
// const RadioGroup = Radio.Group;
// const CheckboxGroup = Checkbox.Group;
import getUrl from "../util.js";
import TT from './target.js';
const Search = Input.Search;
export default class PriceSet extends React.Component {

    constructor() {
        super()
        this.state = {
            key: 1,
            targetData: {
                type: '',
                v: '',
                target: ''
            }
        }
    }
    setOneKV(k, v) {
        this.setState({
            [k]: v
        })
    }
    componentDidMount() {

    }
    // getdata(type, v, target) {
    //     this.setState({
    //         targetData: { type, v, target }
    //     })
    // }
    render() {
        console.log(this.state.targetData);
        return <div>
            <Row>
                <Col span={2}>
                    <span
                        onClick={
                            () => {
                                this.setState({
                                    key: 2,
                                    targetData: {
                                        type: 'BOOK_DETAIL',
                                        v: '第11个在哪里',
                                        target: 'http://www.baidu.com'
                                    }
                                })
                            }
                        }
                    >跳转链接:</span>
                </Col>
                <Col span={20}>
                    <TT
                        preverData={this.state.targetData}
                        // getdata={this.getdata.bind(this)}
                        getdata={
                            (type, v, target) => {
                                this.setState({
                                    targetData: { type, v, target }
                                })
                            }
                        }
                        key={this.state.key}
                    ></TT>
                </Col>
            </Row>
        </div>
    }
}