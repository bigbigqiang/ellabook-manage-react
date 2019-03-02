import React from 'react';
import { Table, Icon, Button, Row, Col, Input, Select, Tag, Popover, InputNumber } from 'antd';
import "./ContentSet.css";
import getUrl from "../util.js";
import { dataString } from '../commonData.js'
import { CommonAddBook } from "../commonAddBook.js"
//thirdCode:商品id,goodsName:商品名字,goodsSrcPrice:原价,goodsMarketprice:(市场价?售价)
export default class ContentSet extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            goodsNameList: [],
            visible: false,
            data: [
                {
                    key: '1',
                    thirdCode: '',
                    goodsName: "",
                    goodsMarketprice: '',
                    goodsSrcPrice: "",
                    goodsPrice: "",
                    del: "删除"
                }
            ],

            onSearch: true,
            resultItem: [],
            thirdName: "",
            thirdCode: "",
            goodsMarketprice: "",
            goodsSrcPrice: "",
            content: (<div></div>)
        }

    }
    async fetchResultItem(text) {
        var data = await fetch(getUrl.url, {
            mode: "cors",
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: "method=ella.operation.thirdSearchList" + "&content=" + JSON.stringify({ "text": text, "searchType": "searchBook" }) + dataString
        }).then(res => res.json())
        this.setState({ goodsNameList: data.data })
    }
    //设置thirdName和thidrCode,并清空搜索结果,搜索框消失
    setThird(name, code) {
        this.setState({
            ...this.state,
            thirdName: name,
            thirdCode: code,
            data: this.state.data.map(item => {
                return {
                    ...item,
                    thirdName: name,
                    thirdCode: code,
                }
            }),
            resultItem: [],
            onSearch: false

        })
    }
    //点添加图书，弹出模糊搜索的Modal
    showModal = () => {
        this.setState({
            visible: true,
        });

        this.refs.addBooks.getInitList();
    }
    // 用户如果选错了再次搜索
    searchAgain() {
        this.setState({
            onSearch: true
        })
    }
    //市场价和售价
    setPrice(str, value) {
        this.setState({
            [str]: value
        })
    }
    componentDidMount() {
        this.fetchResultItem("");
    }
    handleOk = (selectedRowKeys, selectedRows) => {
        this.setThird(selectedRows[0].bookName, selectedRowKeys[0]);
        this.props.getThird("thirdName", "thirdCode", selectedRows[0].bookName, selectedRowKeys[0]);
        this.setState({ visible: false })
    }
    modelCancle(msg) {
        this.setState({
            visible: msg
        });
    }
    render() {
        const columns = [
            {
                title: '物品ID',
                dataIndex: 'thirdCode',
                key: 'thirdCode',
                width: 200
            }, {
                title: '物品名称',
                dataIndex: 'goodsName',
                key: 'goodsName',
                width: 400,
                render: (text, record) => {
                    if (this.state.thirdName == "") {
                        return <Button type="primary" className="ant-btn-add" icon="plus" onClick={this.showModal}>添加物品</Button>
                    } else {
                        return <span onClick={this.showModal} style={{ "cursor": "pointer" }}>{this.state.thirdName}</span>
                    }
                }

            }, {
                title: '市场价',
                dataIndex: 'goodsMarketprice',
                key: 'goodsMarketprice',
                render: text => <InputNumber style={{ width: "70px" }} min={0} onBlur={(e) => { this.props.getContentData("goodsMarketprice", e.target.value) }} onChange={(value) => { this.setPrice("goodsMarketprice", value) }} className="inputPrice" />,
            }, {
                title: '售价',
                dataIndex: 'goodsSrcPrice',
                key: 'goodsSrcPrice',
                render: text => <InputNumber style={{ width: "70px" }} min={0} onBlur={(e) => { this.props.getContentData("goodsSrcPrice", e.target.value) }} onChange={(value) => { this.setPrice("goodsSrcPrice", value) }} className="inputPrice" />,
            }, {
                title: '优惠价',
                dataIndex: "goodsPrice",
                key: "goodsPrice",
                render: text => <InputNumber style={{ width: "70px" }} min={0} onBlur={(e) => { this.props.getContentData("goodsPrice", e.target.value) }} onChange={(value) => { this.setPrice("goodsPrice", value) }} className="inputPrice" />,
            }
        ]
        if (this.props.goodsType && this.props.goodsType === 'book') {
            columns.push(
                {
                    title: '积分',
                    dataIndex: "goodsIntegral",
                    key: "goodsIntegral",
                    render: text => <InputNumber style={{ width: "70px" }} defaultValue={0} min={0} precision={0} onChange={(value) => { this.props.getContentData("goodsIntegral", value) }} className="inputPrice" />,
                }
            )
        }
        return <div>
            <h3>内容设定</h3>
            <div className="contentWrap">
                <Table columns={columns} dataSource={this.state.data} pagination={false} />
                <div className="addContentWarp"></div>
            </div>
            <hr />
            <CommonAddBook ref="addBooks" rowKey="bookCode" selectType="radio" visible={this.state.visible} modelCancle={msg => this.modelCancle(msg)} handleOk={(selectedRowKeys, selectedRows) => this.handleOk(selectedRowKeys, selectedRows)} />
        </div>
    }
}
