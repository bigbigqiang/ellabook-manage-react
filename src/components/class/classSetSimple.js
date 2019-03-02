import React from 'react';
import { Icon, Button, Row, Col, Select, Input, InputNumber, Popconfirm, message, Modal, Radio, Checkbox, Carousel, Spin, Upload, Divider } from 'antd';
import { Link } from 'react-router';
// const { MonthPicker, RangePicker } = DatePicker;
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;
const { TextArea } = Input;
import './classSet.css';
import "../../main.css";
import getUrl from "../util.js";
import Editor from "../editor/editor.js";
import debounce from 'lodash/debounce';

import commonData from '../commonData.js';

// import Draggable from 'react-draggable';
export default class PriceSet extends React.Component {

    constructor(props) {
        super()
        this.state = {
            chooseIndex: 0,// 单元索引
            chapterIntroRelationList:[],
            dailyContent: '',
            tempTitle: '',
            tempBookList: [],
            tempCodeList: [],
            tempquizNum: 0,
            show: false,
            allBookList: [],
            bookSearchList: [],
            fetching: false,
            classData: props.classData,
            // classData: [
            // {
            //     title: 'aaa',
            //     content: 'guideReading1',

            //     bookList: ["动态阅读1-4动物宝宝秀", "动态阅读2-1来，抱抱", "动态阅读6-1心心相印"],
            //     codeList: ["B201801190006", "B201801190007", "B201801190010"]
            // },
            // {
            //     title: 'bbb',
            //     content: 'bookRead1',
            //     bookList: ["动态阅读2-1来，抱抱"],
            //     codeList: ["B201801190007"]
            // },
            // {
            //     title: 'ccc',
            //     content: 'classEvaluation1',
            //     bookList: ["动态阅读1-4动物宝宝秀", "动态阅读2-1来，抱抱", "动态阅读6-1心心相印", "动态阅读5-1小孩不小"],
            //     codeList: ["B201801190006", "B201801190007", "B201801190010", "B201801190009"]
            // }
            // ]
        }
        this.fetchbookSearchList = debounce(this.fetchbookSearchList, 800)//函数消抖
    }
    setOneKV(k, v) {
        this.setState({
            [k]: v
        })
    }

    componentDidMount() {
        this.fetchbookSearchList('', true);
    }
    componentWillReceiveProps(nextProps) {
        if (this.props.key != nextProps.key) {
            this.setState({
                classData: nextProps.classData
            })
        }
    }
    //搜书
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
    // 删除单元
    delClassChapter(i) {
        this.setState({
            classData: this.state.classData.filter((item, index) => i != index)
        }, () => { this.props.getClassData(this.state.classData) })
    }
    //增加单元
    addClassChapter() {
        this.setState({
            classData: [
                ...this.state.classData,
                {
                    title: '',
                    chapterIntroRelationList:[{
                        introImageUrl: '',
                        introDesc: '',
                        loading: false
                    }],
                    content: '',
                    quizNum: 1,
                    bookList: [],
                    codeList: []
                }
            ]
        }, () => { this.props.getClassData(this.state.classData) })
    }
    // 添加但愿内部图文
    addClassGraphicInChapter() {
        this.setState({
            chapterIntroRelationList: [
                ...this.state.chapterIntroRelationList,
                {
                    introImageUrl: '',
                    introDesc: '',
                    loading:false
                }
            ]
        })
    }
    // 监听图片上传
    handleChapterIntroImageChange(info, index) {
        this.state.chapterIntroRelationList[index].loading = true
        this.setState({ chapterIntroRelationList: this.state.chapterIntroRelationList });
        if (info.file.status === 'done') {
            this.imageFetch(info.file, index);
        }
    }
    // 删除单元内部图片
    delChapterIntroImageChange(index) {
        this.state.chapterIntroRelationList[index].introImageUrl = ''
        this.setState({ chapterIntroRelationList: this.state.chapterIntroRelationList });
    }
    // 图片上传
    imageFetch = async (file, index) => {
        var formData = new FormData();
        formData.append('pictureStream', file.originFileObj);

        var data = await fetch(getUrl.upLoadUrl, {
            method: 'POST',
            mode: 'cors',
            body: formData
        })
            .then(function (res) {
                return res.json();
            });
        if (data.status == 1) {
            this.state.chapterIntroRelationList[index].introImageUrl = data.data
            this.state.chapterIntroRelationList[index].loading = false
            this.setState({ chapterIntroRelationList: this.state.chapterIntroRelationList });
        }
    }
    // 删除单元内部图文
    delClassGraphicInChapter(i) {
        if (this.state.chapterIntroRelationList.length === 1) {
            this.setState({
                chapterIntroRelationList: [{
                    introImageUrl: '',
                    introDesc: '',
                    loading: false
                }]
            })
        } else {
            let arr = this.state.chapterIntroRelationList;arr.splice(i,1);
            this.setState({
                chapterIntroRelationList: arr
            })
        }
    }
    // 关闭弹窗
    closeModal() {
        this.state.classData[this.state.chooseIndex].chapterIntroRelationList = this.state.chapterIntroRelationList
        this.state.classData[this.state.chooseIndex].title = this.state.tempTitle
        this.state.classData[this.state.chooseIndex].quizNum = this.state.tempquizNum
        this.state.classData[this.state.chooseIndex].bookList = this.state.tempBookList
        this.state.classData[this.state.chooseIndex].codeList = this.state.tempCodeList
        this.setState({
            classData:this.state.classData,
            show: false
        })
    }
    // 是否已添加图文
    isClassAdd(item){
        let isAdd = false
        for (let i = 0; i < item.length; i++) {
            if (item[i].introImageUrl || item[i].introDesc) {
                isAdd = true
                break
            }
        }
        return isAdd
    }
    getSelectDataList(tempBookList) {
        console.log(tempBookList)
        let tempCodeList = this.state.allBookList.find(item => item.bookName == tempBookList);
        tempCodeList = tempCodeList && tempCodeList.bookCode
        // console.log(this.state.allBookList.find(item => item.bookName == tempBookList));
        // tempCodeList = tempCodeList || tempCodeList.bookCode;
        console.log(tempCodeList);
        this.setState({
            tempBookList,
            tempCodeList
        })
    }
    async getContent() {
        if (this.state.tempTitle == '') {
            message.error('单元标题未填写');
            return;
        }
        if (!this.state.allBookList.find(item => item.bookName == this.state.tempBookList)) {
            message.error('图书未选择');
            return;
        }
        this.state.classData[this.state.chooseIndex].chapterIntroRelationList = this.state.chapterIntroRelationList
        this.state.classData[this.state.chooseIndex].address = 1
        this.state.classData[this.state.chooseIndex].title = this.state.tempTitle
        this.state.classData[this.state.chooseIndex].bookList = this.state.tempBookList
        this.state.classData[this.state.chooseIndex].codeList = this.state.allBookList.find(item => item.bookName == this.state.tempBookList).bookCode
        this.state.classData[this.state.chooseIndex].quizNum = this.state.tempquizNum || 0
        this.setState({
            classData: this.state.classData,
            show: false
        }, ()=>{this.props.getClassData(this.state.classData)})
    }
    render() {
        return <div className='classSet'>
            {
                this.state.classData.map((item, index) =>
                    <div>
                        <Row>
                            <Col className='' span={4}>
                                <Button
                                    onClick={() => {
                                        this.setState({
                                            chooseIndex: index,
                                            chapterIntroRelationList: item.chapterIntroRelationList.length > 0 ? item.chapterIntroRelationList : [{
                                                introImageUrl: '',
                                                introDesc: '',
                                                loading: false
                                            }],
                                            // TODO:这里在改
                                            tempTitle: this.state.classData[index].title,
                                            tempBookList: this.state.classData[index].bookList,
                                            tempCodeList: this.state.classData[index].bookCode,
                                            tempquizNum: this.state.classData[index].quizNum
                                        }, () => {
                                            this.setState({ show: true })
                                        })
                                    }}
                                    style={{ width: 120 }}>
                                    单元{index + 1}
                                </Button>
                            </Col>
                            <Col style={{ lineHeight: '32px' }} className='classSet_col' span={6}>
                                {item.title ? <span style={{ color: '#57a3ee' }}>{item.title}</span> : <span style={{ color: 'red' }}>未写标题</span>}
                            </Col>
                            <Col style={{ lineHeight: '32px' }} className='classSet_col' span={2}>
                                {
                                    this.isClassAdd(item.chapterIntroRelationList) ? <span style={{ color: '#57a3ee' }}>已添加<Icon type="check" /></span> : <span style={{ color: 'red' }}>未添加<Icon type="close" /></span>
                                }
                            </Col>
                            <Col style={{ lineHeight: '32px' }} className='classSet_col' span={1} offset={4}>
                                <Popconfirm onConfirm={() => { this.delClassChapter(index); }} title={"确认删除此单元吗?"} okText="删除" cancelText="取消">
                                    <Icon style={{ fontSize: '20px' }} type="close-circle" />
                                </Popconfirm>
                            </Col>
                            <Col style={{ lineHeight: '32px' }} className='classSet_col' span={1}>

                                {
                                    index != 0 ? <Icon
                                        style={{ fontSize: '20px' }}
                                        type="arrow-up"
                                        onClick={() => {
                                            let arr = this.state.classData;
                                            let temp = arr[index];
                                            arr.splice(index, 1);
                                            arr.splice(index - 1, 0, temp);
                                            this.setState({
                                                classData: arr
                                            }, () => {
                                                message.success('上移动成功')
                                            })
                                        }}
                                    /> : null
                                }
                            </Col>
                            <Col style={{ lineHeight: '32px' }} className='classSet_col' span={1}>
                                {
                                    index != this.state.classData.length - 1 ? <Icon
                                        style={{ fontSize: '20px' }}
                                        type="arrow-down"
                                        onClick={() => {
                                            let arr = this.state.classData;
                                            let temp = arr[index];
                                            arr.splice(index, 1);
                                            arr.splice(index + 1, 0, temp);
                                            this.setState({
                                                classData: arr
                                            }, () => {
                                                message.success('下移动成功')
                                            })
                                        }}
                                    /> : null
                                }
                            </Col>
                        </Row>
                        <Divider />
                    </div>
                    // </Draggable>
                )
            }
            <Row>
                <Col className='' span={4}>
                    <Button
                        onClick={() => {
                            this.addClassChapter();
                        }}
                        style={{ width: 120 }}
                    >添加单元</Button>
                </Col>
            </Row>
            <Modal
                destroyOnClose
                title="图文介绍编辑"
                visible={this.state.show}
                onOk={() => {
                    this.getContent();
                }}
                onCancel={() => { this.closeModal() }}
            >
                <Row style={{ marginBottom: '24px' }} >
                    <Col style={{ lineHeight: '32px' }} span={6}>
                        单元标题:
                    </Col>
                    <Col span={18}>
                        <Input
                            style={{ width: '100%' }}
                            value={this.state.tempTitle}
                            onChange={(e) => {
                                this.setOneKV('tempTitle', e.target.value);
                            }}
                        />
                    </Col>
                </Row>

                <Row style={{ marginBottom: '24px' }} >
                    <Col style={{ lineHeight: '32px' }} span={6}>
                        添加图书:
                    </Col>
                    <Col span={18}>
                        <Select
                            showSearch
                            style={{ width: '100%' }}
                            notFoundContent={this.state.fetching ? <Spin size="small" /> : <div>未搜索到数据</div>}
                            onChange={(v) => { this.getSelectDataList(v); }}
                            onSearch={(v) => { this.fetchbookSearchList(v); }}
                            // tokenSeparators={[',']}
                            placeholder="搜索并选择数据"
                            value={this.state.tempBookList}
                        // value={this.state.classData[this.state.chooseIndex] && this.state.classData[this.state.chooseIndex][this.state.chooseType] && this.state.classData[this.state.chooseIndex][this.state.chooseType].bookList}
                        >
                            {this.state.bookSearchList}
                        </Select>
                    </Col>
                </Row>

                <Row style={{ marginBottom: '24px' }} >
                    <Col style={{ lineHeight: '32px' }} span={6}>
                        测试题数量:
                    </Col>

                    <Col span={18}>
                        <InputNumber
                            defaultValue={1}
                            min={0} max={100}
                            style={{ width: '100%' }}
                            value={this.state.tempquizNum}
                            onChange={(v) => {
                                this.setOneKV('tempquizNum', v);
                            }}
                        />
                    </Col>

                </Row>
                <Divider />
                {
                    this.state.chapterIntroRelationList.map((item, index) =>
                    <div>
                        <Row style={{ marginBottom: '24px' }} >
                            <Row style={{ marginBottom: '10px' }}>
                                <Col style={{ lineHeight: '32px' }} span={6}>
                                    简介{index+1}:
                                </Col>
                                <Col span={14}>
                                    <TextArea
                                        value={item.introDesc}
                                        onChange={(e)=>{
                                            this.state.chapterIntroRelationList[index].introDesc = e.target.value
                                            this.setState({
                                                chapterIntroRelationList: this.state.chapterIntroRelationList
                                            })
                                            console.log(this.state.chapterIntroRelationList)
                                        }}
                                        rows={3}
                                    />
                                </Col>
                                <Col span={2} offset={2}>
                                    <Icon onClick={() => {
                                        this.delClassGraphicInChapter(index)
                                    }} style={{ fontSize: '20px' }} type="close-circle" />
                                </Col>
                            </Row>
                            <Row className='chapterIntroRelationList'>
                                <Col style={{ lineHeight: '32px' }} span={6}>
                                    图片{index+1}:
                                </Col>
                                <Col span={6}>
                                    <Upload
                                        name="avatar"
                                        listType="picture-card"
                                        className="avatar-uploader"
                                        showUploadList={false}
                                        action="//jsonplaceholder.typicode.com/posts/"
                                        onChange={(info) => {this.handleChapterIntroImageChange(info,index)}}
                                    >
                                        {item.introImageUrl ? <img src={item.introImageUrl} alt="avatar" /> : (
                                        <div>
                                            <Icon type={item.loading ? 'loading' : 'plus'} />
                                            <div className="ant-upload-text">上传图片</div>
                                        </div>)}
                                    </Upload>
                                </Col>
                                <Col span={4} offset={2}>
                                    <span title="点击删除"  className="i-action-ico i-delete" onClick={() => {
                                        this.delChapterIntroImageChange(index)
                                    }}></span>
                                </Col>
                            </Row>
                        </Row>
                    </div>
                )
                }
                <Divider />
                <Row>
                    <Col className='' span={4} offset={9}>
                        <Button
                            onClick={() => {
                                this.addClassGraphicInChapter();
                            }}
                            style={{ width: 120 }}
                        >添加图文</Button>
                    </Col>
                </Row>
            </Modal>
        </div >
    }
}