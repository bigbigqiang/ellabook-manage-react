import React from 'react';
import { Row, Col, Card, Icon, Button, Table, Tabs, message, Input } from "antd";
import { Link } from 'react-router';
import getUrl from "../util.js";
import "../../main.css";
import "./h5activity.css";
const Search = Input.Search;
export default class addGoods extends React.Component {
    constructor() {
        super();
        this.state = {
        }

    }

    render() {
        const columns = [
            {
                title: '活动名称',
                dataIndex: 'a',
                key: 'a',
                width: 100,
            }, {
                title: 'code码',
                dataIndex: 'b',
                key: 'b',
                width: 100,
            }, {
                title: '赠书数量',
                dataIndex: 'c',
                key: 'c',
                width: 100,
            }, {
                title: '开始时间',
                dataIndex: 'd',
                key: 'd',
                width: 200,
            }, {
                title: '结束时间',
                dataIndex: 'e',
                key: 'e',
                width: 200,
            }, {
                title: '领取人数',
                dataIndex: 'f',
                key: 'f',
                width: 100,
            }, {
                title: '页面点击量',
                dataIndex: 'g',
                key: 'g',
                width: 100,
            }, {
                title: '活动状态',
                dataIndex: 'h',
                key: 'h',
                width: 100,
            }, {
                title: '活动链接',
                dataIndex: 'i',
                key: 'i',
                width: 100,
                render: () => <Icon alt="123" type="file-text" />
            }, {
                title: '操作',
                dataIndex: 'j',
                key: 'j',
                width: 100,
                render: () => <span className="i-action-ico i-edit"></span>
            }
        ];
        const data = [
            {
                a: 1,
                b: 2,
                c: 3,
                d: 4,
                e: 5,
                f: 6,
                g: 7,
                h: 8,
                i: 9,
                j: 10
            }, {
                a: 1,
                b: 2,
                c: 3,
                d: 4,
                e: 5,
                f: 6,
                g: 7,
                h: 8,
                i: 9,
                j: 10
            }, {
                a: 1,
                b: 2,
                c: 3,
                d: 4,
                e: 5,
                f: 6,
                g: 7,
                h: 8,
                i: 9,
                j: 10
            }, {
                a: 1,
                b: 2,
                c: 3,
                d: 4,
                e: 5,
                f: 6,
                g: 7,
                h: 8,
                i: 9,
                j: 10
            }
        ];
        return <div id="h5Activity">
            <p className="title">H5赠书活动</p>
            <div className="content">
                <Row>
                    <Col span={3}>
                        <Link to="h5activity/operation/add">
                            <Button>添加赠书活动</Button>
                        </Link>
                    </Col>
                    <Col offset={1} span={9}>
                        <Search
                            placeholder="请输入搜索内容"
                            onSearch={value => console.log(value)}
                            enterButton
                        />
                    </Col>
                </Row>
                <Row style={{ paddingTop: "20px" }}>
                    <Table columns={columns} dataSource={data} />
                </Row>
            </div>
        </div>
    }
}