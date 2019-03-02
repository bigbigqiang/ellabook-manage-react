import React from 'react'
import { Table } from 'antd'
export default class BookList extends React.Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
    }


    render() {
        const columns = [{
            title: '图书名称',
            width: '20%',
            dataIndex: 'bookName',
            render: (text, record) => {
                if (record.bookName == '') {
                    return (
                        <span>-</span>
                    )
                } else {
                    return (
                        <span>{record.bookName}</span>
                    )
                }
            }
        }, {
            title: '上架时间',
            width: '20%',
            dataIndex: 'createTime',
            render: (text, record) => {
                if (record.createTime == '') {
                    return (
                        <span>-</span>
                    )
                } else {
                    return (
                        <span>{record.createTime}</span>
                    )
                }
            }
        }, {
            title: '展示状态',
            width: '20%',
            dataIndex: 'shelvesFlag',
            render: (text, record) => {
                if (record.shelvesFlag == '') {
                    return (
                        <span>-</span>
                    )
                } else if (record.shelvesFlag == 'SHELVES_ON') {
                    return (
                        <span>已上架</span>
                    )
                } else if (record.shelvesFlag == 'SHELVES_OFF') {
                    return (
                        <span>已下架</span>
                    )
                } else if (record.shelvesFlag == 'PRE_SALE') {
                    return (
                        <span>预售</span>
                    )
                } else if (record.shelvesFlag == 'SHELVES_WAIT') {
                    return (
                        <span>待上架</span>
                    )
                }
            }
        }]
        return <Table rowKey={(record, index) => index} columns={columns} dataSource={this.props.bookList} bordered className="t-nm-tab" />
    }
}