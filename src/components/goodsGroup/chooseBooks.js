import React from 'react';
import { Row, Col, Card, Icon, Button, Table, Tabs, message, Input, Select, Divider, Modal } from "antd";
import { Link } from 'react-router';
import getUrl from "../util.js";
import PriceSet from "./PriceSet.js";
import "../../main.css";
import "./goodGroup.css";
import { dataString } from '../commonData.js'
const Search = Input.Search;
export default class addGoods extends React.Component {
    constructor() {
        super();
        this.state = {
            searchBookList: ""
        }
    }
    componentDidMount() {
        this.fetchBooks();
    }
    async fetchBooks() {
        var doc = {
            text: '',
            page: 0,
            pageSize: 20,
            type: "SEARCH_ALL"
        }
        var data = await fetch(getUrl.url, {
            mode: "cors",
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: "method=ella.operation.getBookListByIdOrName" + "&content=" + JSON.stringify(doc)+dataString
        }).then(res => res.json());
        console.log("table")
        console.log(data.data)
        this.setState({
            searchBookList: data.data.bookList
        })
    }
    render() {
        const columns = [
            {
                title: 'Name',
                dataIndex: 'bookIntroduction',
                render: text => <a href="#">{text}</a>,
            }, {
                title: 'Age',
                dataIndex: 'bookName',
            }, {
                title: 'Address',
                dataIndex: 'publishTime',
            }
        ];
        // const data = [
        //     {
        //         key: '1',
        //         name: 'John Brown',
        //         age: 32,
        //         address: 'New York No. 1 Lake Park',
        //     }, {
        //         key: '2',
        //         name: 'Jim Green',
        //         age: 42,
        //         address: 'London No. 1 Lake Park',
        //     }, {
        //         key: '3',
        //         name: 'Joe Black',
        //         age: 32,
        //         address: 'Sidney No. 1 Lake Park',
        //     }, {
        //         key: '4',
        //         name: 'Disabled User',
        //         age: 99,
        //         address: 'Sidney No. 1 Lake Park',
        //     }, {
        //         key: '5',
        //         name: 'Disabled User',
        //         age: 99,
        //         address: 'Sidney No. 1 Lake Park',
        //     }, {
        //         key: '6',
        //         name: 'Disabled User',
        //         age: 99,
        //         address: 'Sidney No. 1 Lake Park',
        //     }, {
        //         key: '7',
        //         name: 'Disabled ser',
        //         age: 99,
        //         address: 'Sidney No. 1 Lake Park',
        //     }
        // ];
        const data = this.state.searchBookList;
        const rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            },
            getCheckboxProps: record => ({
                disabled: record.name === 'Disabled User', // Column configuration not to be checked
                name: record.name,
            }),
        };
        return <div id="goodsGroup">
            <Table selectedRowKeys={[1, 2, 3]} rowSelection={rowSelection} columns={columns} dataSource={data} />
        </div>
    }
}