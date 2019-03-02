import React from 'react';
import { Icon, Button, Row, Col, Input, Popconfirm, message, Modal, Radio, Checkbox, Carousel, Spin, Upload, Tabs, Table } from 'antd';
import { Link } from 'react-router';
// import ClassSet from './classSet.js';
// const { MonthPicker, RangePicker } = DatePicker;
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;
import './tabClass.css';
import getUrl from "../util.js";
import commonData from '../commonData.js';
const TabPane = Tabs.TabPane;
const Search = Input.Search;
export default class PriceSet extends React.Component {

    constructor() {
        super()
        this.state = {
            loading: true,
            pageSize: 20,
            page: 0,
            total: 0,
            searchContent: '',
            data: [],
        }
    }

    setOneKV(k, v) {
        this.setState({
            [k]: v
        })
    }

    componentDidMount() {
        this.fetchData(0, 20, '');
    }
    async fetchData(page, pageSize, courseName) {
        this.setState({
            loading: true
        })
        let doc = {
            courseName,
            // goodsState: 'SHELVES_ON',
            pageVo: {
                page,
                pageSize
            }
        }
        var data = await fetch(getUrl.url, {
            mode: "cors",
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: "method=ella.operation.getBookCourseList" + "&content=" + JSON.stringify(doc) + commonData.dataString
        }).then(res => res.json());
        console.log(data);
        this.setState({
            data: data.data.list,
            total: data.data.total,
            page,
            pageSize,
            loading: false
        })
    }
    render() {
        const columns = [
            {
                title: '课程名称',
                dataIndex: 'courseName',
                key: 'courseName',
                width: 200
            },
            {
                title: '销售时间',
                // dataIndex: 'b',
                // key: 'b',
                width: 200,
                render: (text, record) => {
                    return !record.goodsPublishTime || !record.goodsUnpublishTime ? '-' : record.goodsPublishTime + '~' + record.goodsUnpublishTime;
                }
            },
            {
                title: '售价',
                dataIndex: 'goodsSrcPrice',
                key: 'goodsSrcPrice',
                width: 100,
                render: text => text == null ? '-' : text
            },
            {
                title: '市场价',
                dataIndex: 'goodsMarketprice',
                key: 'goodsMarketprice',
                width: 100,
                render: text => text == null ? '-' : text
            },
            {
                title: '优惠价',
                dataIndex: 'goodsPrice',
                key: 'goodsPrice',
                width: 100,
                render: text => text == null ? '-' : text
            },
            // {
            //     title: '有效期',
            //     dataIndex: 'e',
            //     key: 'e',
            //     width: 100
            // },
            {
                title: '商品状态',
                dataIndex: 'goodsState',
                key: 'goodsState',
                width: 100,
                render: text => {
                    switch (text) {
                        case 'SHELVES_ON':
                            return '已上架';
                        case 'SHELVES_OFF':
                            return '已下架';
                        case 'SHELVES_WAIT':
                            return '待上架';
                        case 'PRE_SALE':
                            return '预售';
                        default:
                            return '-'
                    }
                }
            },
            {
                title: '操作',
                dataIndex: 'g',
                key: 'g',
                width: 100,
                render: (text, record) => <Link target="_blank" to={'course/' + record.courseCode + '/2'}>商品详情</Link>
            }
        ];
        return <div className="tapClass">
            <Row>
                <Col span={8}>
                    <Search
                        placeholder="请输入搜索内容"
                        onSearch={value => {
                            this.setOneKV('searchContent', value);
                            this.fetchData(0, this.state.pageSize, value);
                        }}
                        enterButton
                    />
                </Col>
            </Row>
            <Table
                loading={this.state.loading}
                columns={columns}
                dataSource={this.state.data}
                className='tabClassTable'
                scroll={{ y: 570 }}
                pagination={
                    {
                        defaultPageSize: 20,
                        showSizeChanger: true,
                        pageSizeOptions: ['20', '40', '60', '80', '100'],
                        loading: true,
                        total: this.state.total,
                        showTotal: () => { return `共 ${this.state.total} 条` },
                        onShowSizeChange: (page, pageSize) => { this.fetchData(page - 1, pageSize, this.state.searchContent) },
                        onChange: (page, pageSize) => { this.fetchData(page - 1, pageSize, this.state.searchContent) }
                    }
                }
            ></Table>
        </div>
    }
}