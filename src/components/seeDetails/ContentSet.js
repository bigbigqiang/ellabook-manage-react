import React from 'react';
import { Table, InputNumber } from 'antd';
import "./ContentSet.css";
//thirdCode:商品id,goodsName:商品名字,goodsSrcPrice:原价,goodsMarketprice:(市场价?售价)
export default class ContentSet extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        var columns = [
            {
                title: '物品ID',
                dataIndex: 'thirdCode',
                key: 'thirdCode',
                render: (text, record) => {
                    return <span>{this.props.contentData.thirdCode}</span>
                }
            }, {
                title: '物品名称',
                dataIndex: 'goodsName',
                key: 'goodsName',
                render: (text, record) => (<span>{this.props.contentData.thirdName}</span>)
            }, {
                title: '市场价',
                dataIndex: 'goodsMarketprice',
                key: 'goodsMarketprice',
                render: text => {
                    return <InputNumber style={{ width: "70px" }} min={0} value={this.props.contentData.goodsMarketprice} onChange={(value) => { this.props.getContentData("goodsMarketprice", value) }} className="inputPrice" />
                },
            }, {
                title: '售价',
                dataIndex: 'goodsSrcPrice',
                key: 'goodsSrcPrice',
                render: text => {
                    return <InputNumber style={{ width: "70px" }} min={0} value={this.props.contentData.goodsSrcPrice} onChange={(value) => { this.props.getContentData("goodsSrcPrice", value) }} className="inputPrice" />
                },
            }, {
                title: '优惠价',
                dataIndex: "goodsPrice",
                key: "goodsPrice",
                render: text => {
                    return <InputNumber style={{ width: "70px" }} min={0} value={this.props.contentData.goodsPrice} onChange={(value) => { this.props.getContentData("goodsPrice", value) }} className="inputPrice" />
                },
            }
        ];
        if (this.props.goodsType && this.props.goodsType === 'book') {
            columns.push(
                {
                    title: '积分',
                    dataIndex: "goodsIntegral",
                    key: "goodsIntegral",
                    render: text => <InputNumber style={{ width: "70px" }} min={0} precision={0} defaultValue={parseInt(this.props.contentData.goodsIntegral)} onChange={(value) => { this.props.getContentData("goodsIntegral", value) }} className="inputPrice" />,
                }
            )
        }
        return <div>
            <h3>内容设定</h3>
            <div className="contentWrap">
                <Table columns={columns} dataSource={this.props.contentData ? [{
                    ...this.props.contentData,
                    key: 1
                }] : []} pagination={false} />
                <div className="addContentWarp">
                </div>
            </div>
            <hr />
        </div>
    }
}
