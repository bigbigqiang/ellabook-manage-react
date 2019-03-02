import React from 'react'
import { Form, Input, Icon, Select, Button, Modal, message, Radio, Spin, DatePicker, Row, Col, Table, Checkbox, Upload, Tag, Mention, InputNumber } from 'antd'
import { Link, hashHistory } from 'react-router'
import { dataString } from '../commonData.js'
const FormItem = Form.Item;
const Option = Select.Option;
const CheckboxGroup = Checkbox.Group;
const ButtonGroup = Button.Group;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { CheckableTag } = Tag;
const { TextArea } = Input;
const { toString, toContentState } = Mention;
var util = require('../util.js');
import "./editBooks.css";

class myForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            bookSeriesName: "",
            bookCode: "",
            language: "",
            bookEndAge: "",
            bookName: "林银福",
            isVip: "",
            bookPages: "",
            tags: "",
            pinyin: "",
            bookIntroduction: "",
            bookMode: "",
            bookStartAge: "",
            bookPublish: "",

            bookSelectList: [],
            getEllaAuthorList: []
        }
    }

    async fetchEditBook() {
        this.setState({
            loading: true
        });
        var data = await fetch(util.url, {
            mode: "cors",
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: "method=ella.operation.getBookInfoAndRelationsInfo" + "&content=" + JSON.stringify({ "bookCode": this.state.bookCode }) + dataString
        }).then(res => res.json())
            .then((d) => {
                console.log(d);
                var aaa = this.state.book;
                var bookAuthorList = [];
                for (let i = 0; i < d.data.bookAuthorRelationList.length; i++) {
                    bookAuthorList.push({
                        authorCode: (d.data.bookAuthorRelationList[i].authorCode == '') ? '暂无数据' : d.data.bookAuthorRelationList[i].authorCode,
                        authorName: (d.data.bookAuthorRelationList[i].authorName == '') ? '暂无数据' : d.data.bookAuthorRelationList[i].authorName,
                        authorType: (d.data.bookAuthorRelationList[i].authorType == '') ? '暂无数据' : d.data.bookAuthorRelationList[i].authorType,
                        bookCode: (d.data.bookAuthorRelationList[i].bookCode == '') ? '暂无数据' : d.data.bookAuthorRelationList[i].bookCode,
                    })
                }
                console.log(bookAuthorList);
                this.setState({
                    loading: false,
                    bookName: d.data.book.bookName,
                    bookSeriesName: d.data.book.bookSeriesName,
                    bookPages: d.data.book.bookPages,
                    pinyin: d.data.book.pinyin,
                    bookIntroduction: d.data.book.bookIntroduction,
                    bookStartAge: d.data.book.bookStartAge,
                    bookEndAge: d.data.book.bookEndAge,
                    isVip: d.data.book.isVip,
                    tags: d.data.book.tags,
                    goodsMarketprice: d.data.goods.goodsMarketprice,
                    goodsSrcPrice: d.data.goods.goodsSrcPrice,
                    bookAuthorRelationList: bookAuthorList,
                    bookResourceList: d.data.bookResourceList,
                    bookPreviewResourceList: d.data.bookPreviewResourceList,
                }, () => {
                    console.log(this.state.bookResourceList);
                })
            })
    }

    async bookResultItem(groupId, type, listStr) {
        var w = this;
        var data = await fetch(util.url, {
            mode: "cors",
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: "method=ella.operation.boxSearchList" + "&content=" + JSON.stringify({ "groupId": groupId, "type": type }) + dataString
        console.log(data.data);
            w.setState({
                [listStr]: data.data
            })
        }

    componentDidMount() {
                var search = window.location.href;
                console.log(search);
                var bookCode = search.split('?bookCode=')[1].split('&_k=')[0];
                console.log(bookCode);
                this.state = {
                    bookCode: bookCode
                };
                this.fetchEditBook();
                this.bookResultItem('operation.box.getEllaAuthorList', 'AUTO_BOX', 'getEllaAuthorList');
            }

    authorList = () => {
                this.setState({

                })
            }

    getEllaAuthorListSearch(v){
                var bookSelectList = [];
                v.forEach(item => {
                    var result = this.state.getEllaAuthorList.find(v => v.authorName == item)
                    bookSelectList.push(result)
                })
        this.setState({
                    bookSelectList
                })
            }

    render() {
                const { getFieldDecorator } = this.props.form
        // console.log(getFieldDecorator);
        console.log(JSON.stringify(this.state.bookAuthorRelationList));
                const formItemLayout = {

                }
        const effect = this.state.bookAuthorRelationList ? this.state.bookAuthorRelationList.map(item => item.authorType == 'AUTHOR_AUDIO' ? item.authorName : '') : ''
        return(
            <div>
            <p className="m-head">
                <Link to="/bookList">
                    <Icon type="left" /> 编辑图书信息
                    </Link>
            </p>
            <div className="m-edit-bd">
                <Form>
                    <Row>
                        <Col>
                            <FormItem
                                id="control-input"
                                label="图书名称"
                                className='f-ft-14'
                                {...formItemLayout}
                            >
                                {getFieldDecorator('bookName', {
                                    initialValue: this.state.bookName
                                })(
                                    <Input style={{ width: 170 }} />
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <FormItem
                                id="control-input"
                                label="纸质书价格"
                                className='f-ft-14'
                                {...formItemLayout}
                            >
                                {getFieldDecorator('goodsMarketprice', {
                                    initialValue: this.state.goodsMarketprice
                                })(
                                    <Input style={{ width: 170 }} />
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <FormItem
                                id="control-input"
                                label="图片处理"
                                className='f-ft-14'
                                {...formItemLayout}
                            >
                                {getFieldDecorator('bookName', {
                                    initialValue: this.state.bookName
                                })(
                                    <Input style={{ width: 170 }} />
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <FormItem
                                id="control-input"
                                label="图书名称"
                                className='f-ft-14'
                                {...formItemLayout}
                            >
                                {getFieldDecorator('bookName', {
                                    initialValue: this.state.bookName
                                })(
                                    <Input style={{ width: 170 }} />
                                )}
                            </FormItem>
                        </Col>
                    </Row>


                    <FormItem
                        id="control-input"
                        label="页数"
                        className='f-ft-14'
                        {...formItemLayout}
                    >
                        {getFieldDecorator('bookPages', {
                            initialValue: this.state.bookPages
                        })(
                            <Input style={{ width: 170 }} />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="音频"
                    >
                        {getFieldDecorator('getEllaAuthorList', {
                            rules: [
                                { required: true, message: 'Please select your favourite colors!', type: 'array' },
                            ],
                        })(
                            <Select
                                mode="tags"
                                placeholder="Please select favourite colors"
                                defaultValue={effect}
                                style={{ width: 170 }}
                            // onChange{(v)=>{this.getEllaAuthorListSearch(v)}}
                            >
                                {
                                    this.state.getEllaAuthorList ? this.state.getEllaAuthorList.map(function(item) {
                                        return <Option key={item.authorName} value={item.authorCode}>{item.authorName}</Option>
                                    }) : ''
                                }
                            </Select>
                        )}
                    </FormItem>
                    <FormItem
                        id="control-input"
                        label="页数"
                        className='f-ft-14'
                        {...formItemLayout}
                    >
                        {this.state.departmentSelect}
                        {this.state.positionSelect}
                    </FormItem>

                    <FormItem
                        id="control-input"
                        label="密码"
                        className='f-ft-14'
                        {...formItemLayout}
                    >
                        {this.state.passwordElem}
                        {getFieldDecorator('password', {
                            initialValue: this.state.newPassword
                        })(
                            <Input style={{ width: 200, display: this.state.newPasswordVisible }} />
                        )}

                    </FormItem>
                    <FormItem wrapperCol={{ span: 6 }} style={{ marginTop: 24, marginLeft: 150 }}>
                        <Button type="primary" htmlType="submit">确定</Button>
                    </FormItem>
                </Form>
            </div>
            </div >
        )
    }
}

myForm = Form.create()(myForm)

export default myForm