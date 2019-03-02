import React from 'react';
import { Icon, Button, Row, Col, Select, TextArea, Input, Popconfirm, message, Modal, Radio, Checkbox, Carousel, Spin, Upload, Divider } from 'antd';
import { Link } from 'react-router';
// const { MonthPicker, RangePicker } = DatePicker;
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;
import './classSet.css';
import getUrl from "../util.js";
import Editor from "../editor/editor.js";
import debounce from 'lodash/debounce';

import commonData from '../commonData.js';

export default class PriceSet extends React.Component {

    constructor(props) {
        super()
        this.state = {
            chooseIndex: 0,
            chooseType: 0,
            dailyContent: '',
            tempTitle: '',
            tempBookList: '',
            tempCodeList: '',
            classData: props.classData,
            // classData: [
            //     [
            //         {
            //             type: 'guideReading',
            //             title: 'aaa',
            //             content: 'guideReading1',
            //             bookList: ["动态阅读1-4动物宝宝秀", "动态阅读2-1来，抱抱", "动态阅读6-1心心相印"],
            //             codeList: []
            //         },
            //         {
            //             type: 'bookRead',
            //             title: 'bbb',
            //             content: 'bookRead1',
            //             bookList: ["动态阅读2-1来，抱抱"],
            //             codeList: []
            //         },
            //         {
            //             type: 'classEvaluation',
            //             title: 'ccc',
            //             content: 'classEvaluation1',
            //             bookList: ["动态阅读1-4动物宝宝秀", "动态阅读2-1来，抱抱", "动态阅读6-1心心相印", "动态阅读5-1小孩不小"],
            //             codeList: []
            //         }
            //     ],
            //     [
            //         {
            //             type: 'guideReading',
            //             title: 'dddd',
            //             content: 'guideReading2',
            //             bookList: [],
            //             codeList: []
            //         },
            //         {
            //             type: 'bookRead',
            //             title: 'eeee',
            //             content: 'bookRead2',
            //             bookList: [],
            //             codeList: []
            //         },
            //         {
            //             type: 'classEvaluation',
            //             title: 'ffff',
            //             content: 'classEvaluation2',
            //             bookList: [],
            //             codeList: []
            //         }
            //     ],
            //     [
            //         {
            //             type: 'guideReading',
            //             title: '',
            //             content: '',
            //             bookList: [],
            //             codeList: []
            //         },
            //         {
            //             type: 'bookRead',
            //             title: '',
            //             content: '',
            //             bookList: [],
            //             codeList: []
            //         }
            //     ],
            //     [

            //     ],

            // ],
            show: false,
            graphicIntroduction: '',
            chooseTypeModal: false,
            allBookList: [],
            bookSearchList: [],
            fetching: false
        }
        this.fetchbookSearchList = debounce(this.fetchbookSearchList, 800)//函数消抖
    }
    setOneKV(k, v) {
        this.setState({
            [k]: v
        })
    }
    //用来拿富文本里面的内容
    getdata(k, v) {
        this.setState({
            [k]: v //这里设置了一个dailyContent
        })
    }
    componentDidMount() {
        console.log(window.location.href)
        window.location.href = window.location.href;
        this.fetchbookSearchList('', true)
    }
    componentWillReceiveProps(nextProps) {
        if (this.props.key != nextProps.key) {
            this.setState({
                classData: nextProps.classData
            })
        }
        console.log(this.props)
        console.log(nextProps)

    }
    async fetchbookSearchList(v, isAll) {
        this.setState({ bookSearchList: [], fetching: true });
        var doc = {
            text: v,
            pageSize: 10000,
            type: "SEARCH_ALL"
        };
        var data = await fetch(getUrl.url, {
            mode: "cors",
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },

            body: "method=ella.operation.getBookListByIdOrName" + "&content=" + JSON.stringify(doc)+commonData.dataString

        }).then(res => res.json());
        console.log(data);
        if (isAll) {
            this.setState({
                allBookList: data.data.bookList,
                bookSearchList: data.data.bookList.map(item => <Option key={item.bookName}>{item.bookName}</Option>),
                fetching: false
            })
        } else {
            this.setState({
                bookSearchList: data.data.bookList.map(item => <Option key={item.bookName}>{item.bookName}</Option>),
                fetching: false
            })
        }
    }
    // 获取选中图书的内容
    getSelectDataList(bookList) {
        let codeList = bookList.map(item => this.state.allBookList.find(_item => _item.bookName == item).bookCode)
        console.log(bookList);
        console.log(codeList);
        // this.setState({
        //     classData: this.state.classData.map((item, index) => {
        //         return index != this.state.chooseIndex ? item : item.map((_item, _index) => {
        //             return _index != this.state.chooseType ? _item : {
        //                 ..._item,
        //                 bookList: v,
        //                 codeList
        //             }
        //         })
        //     }),
        //     // show: false
        // })
        this.setState({
            tempBookList: bookList,
            tempCodeList: codeList
        })
    }
    // 增加章节下面的内容
    addClassChapter(k) {
        console.log(this.state.chooseIndex);
        console.log(k)
        this.setState({
            classData: this.state.classData.map((item, index) => {
                return index != this.state.chooseIndex
                    ?
                    item
                    :
                    [
                        ...item,
                        {
                            type: k,
                            title: '',
                            content: '',
                            bookList: []
                        }
                    ]
            }),
            chooseTypeModal: false
        }, () => { this.props.getClassData(this.state.classData) })
    }
    //删除章节下面的内容
    delClassChapter(i, j) {
        this.setState({
            classData: this.state.classData.map((item, index) => i != index ? item : this.state.classData[i].filter((_item, _index) => _index != j))
        }, () => { this.props.getClassData(this.state.classData) })
    }
    //增加章节
    addClass() {
        this.setState({
            classData: [
                ...this.state.classData,
                []
            ]
        }, () => { this.props.getClassData(this.state.classData) })
    }
    //删除章节
    delClass(i) {
        this.setState({
            classData: this.state.classData.filter((item, index) => index != i)
        }, () => { this.props.getClassData(this.state.classData) })
    }
    //获取章节内容
    getContent() {
        this.setState({
            classData: this.state.classData.map((item, index) => {
                return index != this.state.chooseIndex ? item : item.map((_item, _index) => {
                    return _index != this.state.chooseType ? _item : {
                        ..._item,
                        content: this.state.dailyContent,
                        // TODO:这里在改
                        title: this.state.tempTitle,
                        bookList: this.state.tempBookList,
                        codeList: this.state.tempCodeList
                    }
                })
            }),
            show: false
        }, () => { this.props.getClassData(this.state.classData) })
    }
    render() {

        return <div className='classSet'>
            {
                this.state.classData.map((item, index) => {
                    // let itemKey = Object.keys(item);
                    // console.log(itemKey);
                    // TODO:item是数组的每一项
                    //TODO:_item是数组每一项的键的每一项
                    return <Row className=''>
                        <Col span={4} className="" >
                            <Button style={{ width: 120 }}
                            >章节{index + 1}</Button>
                        </Col>
                        <Col span={1} className="classSet_col special" >
                            <Popconfirm onConfirm={() => { this.delClass(index); }} title={"确认删除第" + (index + 1) + "章吗?"} okText="删除" cancelText="取消">
                                <Icon style={{ fontSize: '20px' }} type="close-circle" />
                            </Popconfirm>
                        </Col>
                        <Col span={12}>
                            {
                                item.map((_item, _index) => {
                                    return <Row className='row'>
                                        <Col span={8} className="classSet_col right" >
                                            <Button
                                                style={{
                                                    width: 120,
                                                    color: _item.type == 'guideReading' ? '#0aa679' : (_item.type == 'bookRead' ? '#7546c9' : '#1890ff')
                                                }}
                                                onClick={() => {
                                                    this.setState({
                                                        chooseIndex: index,
                                                        chooseType: _index,
                                                        dailyContent: this.state.classData[index][_index].content,
                                                        // TODO:这里在改
                                                        tempTitle: this.state.classData[index][_index].title,
                                                        tempBookList: this.state.classData[index][_index].bookList,
                                                        tempCodeList: this.state.classData[index][_index].bookCode,
                                                    }, () => {
                                                        this.setState({ show: true })
                                                    })
                                                }}
                                            >
                                                {
                                                    _item.type == 'guideReading' ? '课前导读' : (_item.type == 'bookRead' ? '课程阅读' : '课后测评')
                                                }
                                            </Button>
                                        </Col>
                                        <Col span={6} className="classSet_col special" >
                                            {
                                                this.state.classData[index][_index].content
                                                    ?
                                                    <span style={{ color: '#57a3ee' }}>已添加<Icon type="check" /></span>
                                                    :
                                                    <span style={{ color: 'red' }}>未添加<Icon type="close" /></span>
                                            }
                                        </Col>
                                        <Col span={2} className="classSet_col special" >
                                            <Popconfirm onConfirm={() => { this.delClassChapter(index, _index); }} title={"确认删除此单元吗?"} okText="删除" cancelText="取消">
                                                <Icon
                                                    // onClick={() => {
                                                    //     this.delClassChapter(index, _index);
                                                    // }}
                                                    style={{ fontSize: '20px' }}
                                                    type="close-circle" />
                                            </Popconfirm>
                                        </Col>
                                    </Row>
                                })
                            }
                            <Row className='row'>
                                <Col span={8} className="classSet_col right" >
                                    <Button
                                        style={{ width: 120 }}
                                        onClick={() => {
                                            this.setState({
                                                chooseIndex: index
                                            }, () => {
                                                this.setOneKV('chooseTypeModal', true)
                                            })
                                        }}
                                    >添加单元</Button>

                                </Col>
                            </Row>
                        </Col>
                        <Divider />
                    </Row>
                })
            }
            <Row>
                <Col span={4}>
                    <Button
                        style={{ width: 120 }}
                        onClick={() => {
                            this.addClass();
                        }}>
                        添加章节
                    </Button>
                </Col>
            </Row>

            <Modal
                title="选择章节内容"
                visible={this.state.chooseTypeModal}
                onOk={() => { this.setOneKV('chooseTypeModal', false) }}
                onCancel={() => { this.setOneKV('chooseTypeModal', false) }}
            >
                <Row>
                    <Col span={8} style={{ textAlign: 'center' }}>
                        <Button
                            style={{ color: '#0aa679' }}
                            onClick={() => {
                                this.addClassChapter('guideReading')
                            }}
                        >课前导读</Button>
                    </Col>
                    <Col span={8} style={{ textAlign: 'center' }}>
                        <Button
                            style={{ color: '#7546c9' }}
                            onClick={() => {
                                this.addClassChapter('bookRead')
                            }}
                        >课程阅读</Button>
                    </Col>
                    <Col span={8} style={{ textAlign: 'center' }}>
                        <Button
                            style={{ color: '#1890ff' }}
                            onClick={() => {
                                this.addClassChapter('classEvaluation')
                            }}
                        >课后测评</Button>
                    </Col>
                </Row>
            </Modal>

            <Modal
                destroyOnClose
                title="图文介绍编辑"
                visible={this.state.show}
                onOk={() => {
                    this.getContent();
                }}
                onCancel={() => { this.setOneKV('show', false) }}
            >
                <Row style={{ marginBottom: '24px' }} >
                    <Col style={{ lineHeight: '32px' }} span={6}>
                        单元格标题:
                    </Col>
                    <Col span={10}>
                        <Input
                            style={{ width: '100%' }}
                            value={this.state.tempTitle}
                            // value={this.state.classData[this.state.chooseIndex] && this.state.classData[this.state.chooseIndex][this.state.chooseType] && this.state.classData[this.state.chooseIndex][this.state.chooseType].title}
                            onChange={(e) => {
                                // this.setState({
                                //     classData: this.state.classData.map((item, index) => {
                                //         return index != this.state.chooseIndex ? item : item.map((_item, _index) => {
                                //             return _index != this.state.chooseType ? _item : {
                                //                 ..._item,
                                //                 title: e.target.value
                                //             }
                                //         })
                                //     }),
                                // })
                                this.setOneKV('tempTitle', e.target.value);
                                // this.setState({
                                //     tempTitle: e.target.value
                                // })
                            }}
                        />
                    </Col>
                </Row>

                <Row style={{ marginBottom: '24px' }} >
                    <Col style={{ lineHeight: '32px' }} span={6}>
                        添加图书:
                    </Col>
                    <Col span={10}>
                        <Select
                            mode="multiple"
                            style={{ width: '100%' }}
                            notFoundContent={this.state.fetching ? <Spin size="small" /> : <div>未搜索到数据</div>}
                            onChange={(v) => { this.getSelectDataList(v); }}
                            onSearch={(v) => { this.fetchbookSearchList(v); }}
                            tokenSeparators={[',']}
                            placeholder="搜索并选择数据"
                            value={this.state.tempBookList}
                        // value={this.state.classData[this.state.chooseIndex] && this.state.classData[this.state.chooseIndex][this.state.chooseType] && this.state.classData[this.state.chooseIndex][this.state.chooseType].bookList}
                        >
                            {this.state.bookSearchList}
                        </Select>
                    </Col>
                </Row>
                <Editor
                    onChange={() => { console.log(1); }}
                    style={{ width: "600px" }}
                    titleImg={null}
                    getContent={this.getdata.bind(this)}
                    dailyContent={this.state.classData[this.state.chooseIndex] && this.state.classData[this.state.chooseIndex][this.state.chooseType] && this.state.classData[this.state.chooseIndex][this.state.chooseType].content}>
                </Editor>

            </Modal>
        </div >
    }
}