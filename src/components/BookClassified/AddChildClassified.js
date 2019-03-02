import React, { PureComponent } from 'react'
import { Table, Button, message, Input, Pagination, Popover, Modal } from 'antd'
import util from '../util.js'
import './AddChildClassified.css'
const Search = Input.Search;
class AddChildClassified extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            lists: [],
            classifiedName: '',
            childClassifiedlist: [],
            loading: false,
            page: 0,
            current: 1,
            total: 0,
            selectedRowKeys: [],
            childSelectedRowKeys: [],
            book: {
                bookPublish: '',
                bookName: ''
            }
        }
        this.handleCancel = this.handleCancel.bind(this);
        this.onSelectChange = this.onSelectChange.bind(this);
        this.pageChangeFun = this.pageChangeFun.bind(this);
        this.onChildSelectedChange = this.onChildSelectedChange.bind(this);
        this.onSearch = this.onSearch.bind(this);
        this.removeAllSelect = this.removeAllSelect.bind(this);
        this.save = this.save.bind(this);
    }

    //获取图书列表
    fetchFn() {
        this.setState({
            loading: true
        })
        util.API({ book: this.state.book, searchBoxType: 'BOOK_NAME', pageVo: { page: this.state.page, pageSize: 10 } }, 'ella.operation.searchBookByConditions').then(res => res.json()).then((data) => {
            if (data.status == '1') {
                this.setState({
                    lists: data.data.bookList,
                    total: data.data.total,
                    current: data.data.currentPage,
                    loading: false
                })
            } else {
                message.error(data.message)
            }
        }).catch(e => {
            console.log(e.message)
        })
    }
    getBookClassifiedBookList(classifiedCode) {
        util.API({ classifiedCode: classifiedCode }, 'ella.operation.getBookClassifiedBookList').then(res => res.json()).then((data) => {
            if (data.status == '1') {
                let selectedRowKeys = [];
                for (let i = 0; i < data.data.length; i++) {
                    selectedRowKeys.push(data.data[i].bookCode);
                }
                let classifiedName = '';
                if (this.props.sonClassified) {
                    classifiedName = this.props.sonClassified.classifiedName;
                } else if (this.props.editSonClassified) {
                    classifiedName = this.props.editSonClassified.sonClassified.classifiedName;
                }
                this.setState({
                    childClassifiedlist: data.data,
                    selectedRowKeys: selectedRowKeys,
                    classifiedName: classifiedName
                })
            } else {
                message.error(data.message)
            }
        }).catch(e => {
            console.log(e.message)
        })
    }
    //搜索框
    onSearch() {
        this.setState({
            page: 0,
            current: 1,
            total: 0
        }, () => { this.fetchFn() });
    }
    componentWillReceiveProps(newProps) {
        if (newProps.visible) {
            this.setState({
                lists: [],
                childClassifiedlist: [],
                classifiedName: '',
                loading: false,
                page: 0,
                current: 1,
                total: 0,
                selectedRowKeys: [],
                childSelectedRowKeys: [],
                book: {
                    bookPublish: '',
                    bookName: ''
                }
            }, () => { this.fetchFn() });
            if (newProps.sonClassified) {
                this.getBookClassifiedBookList(newProps.sonClassified.classifiedCode)
            }
            if (newProps.editSonClassified) {
                if (newProps.editSonClassified.type === 'edit') {
                    if (newProps.editSonClassified.sonClassified.classifiedCode) {
                        this.getBookClassifiedBookList(newProps.editSonClassified.sonClassified.classifiedCode);
                    } else {
                        let selectedRowKeys = [];
                        for (let i = 0; i < newProps.editSonClassified.sonClassified.bookList.length; i++) {
                            selectedRowKeys.push(newProps.editSonClassified.sonClassified.bookList[i].bookCode);
                        }
                        this.setState({
                            childClassifiedlist: newProps.editSonClassified.sonClassified.bookList,
                            selectedRowKeys: selectedRowKeys,
                            classifiedName: newProps.editSonClassified.sonClassified.classifiedName
                        })
                    }
                }
            }
        }
    }

    saveAndUpdateBookClassifiedSon = (params) => {
        util.API(params, 'ella.operation.saveAndUpdateBookClassifiedSon').then(res => res.json()).then((data) => {
            if (data.status == '1') {
                this.props.getBookClassifiedList({
                    level: '2', parentCode: params.parentCode, classifiedName: ''
                });
                this.props.getBookClassifiedList({
                    level: '1', parentCode: '', classifiedName: ''
                });
                this.handleCancel();
            } else {
                message.error(data.message)
            }
        }).catch(e => {
            console.log(e.message)
        })
    }

    componentDidMount() {
        this.fetchFn()
    }
    pageChangeFun(pageNum) {
        this.setState({
            page: pageNum - 1,
            current: pageNum
        }, () => {
            this.fetchFn();
        });
    }
    handleCancel() {
        this.props.hideModel()
    }

    onSelectChange(selectedKeys) {
        let childClassifiedlist = [...this.state.childClassifiedlist];
        let childSelectedRowKeys = [...this.state.childSelectedRowKeys];

        let cancelKeys = [];
        if (childClassifiedlist.length === 0) {
            selectedKeys.map((ele) => {
                this.state.lists.find((item) => item.bookCode === ele) && childClassifiedlist.unshift(this.state.lists.find((item) => item.bookCode === ele));
            })
        } else {
            if (selectedKeys.length > childClassifiedlist.length) {
                for (let i = 0; i < selectedKeys.length; i++) {
                    let hasKey = false;
                    for (let j = 0; j < childClassifiedlist.length; j++) {
                        if (selectedKeys[i] === childClassifiedlist[j].bookCode) {
                            hasKey = true;
                            break;
                        }
                    }
                    if (!hasKey) {
                        let list_item = this.state.lists.find((item) => item.bookCode === selectedKeys[i]);
                        list_item && childClassifiedlist.unshift(list_item);
                    }
                }
            } else {
                childClassifiedlist.map((item) => {
                    if (!selectedKeys.includes(item.bookCode)) {
                        cancelKeys.push(item.bookCode)
                    }
                })
            }

        }
        cancelKeys.map((item) => {
            for (let i = 0; i < childClassifiedlist.length; i++) {
                if (childClassifiedlist[i].bookCode === item) {
                    childClassifiedlist.splice(i, 1);
                    break;
                }
            }
        })
        cancelKeys.map((item) => {
            let index = childSelectedRowKeys.indexOf(item);
            if (index > -1) {
                childSelectedRowKeys.splice(index, 1);
            }
        })
        this.setState({ selectedRowKeys: selectedKeys, childClassifiedlist, childSelectedRowKeys });
    }

    onChildSelectedChange(childSelectedRowKeys) {
        this.setState({ childSelectedRowKeys });
    }

    removeAllSelect() {
        let childClassifiedlist = [...this.state.childClassifiedlist];
        let selectedRowKeys = [...this.state.selectedRowKeys];
        let childSelectedRowKeys = [...this.state.childSelectedRowKeys];
        for (let j = 0; j < childSelectedRowKeys.length; j++) {
            for (let i = 0; i < childClassifiedlist.length; i++) {
                if (childSelectedRowKeys[j] === childClassifiedlist[i].bookCode) {
                    childClassifiedlist.splice(i, 1);
                    break;
                }
            }
        }
        for (let i = 0; i < childSelectedRowKeys.length; i++) {
            let index = selectedRowKeys.indexOf(childSelectedRowKeys[i]);
            if (index > -1) {
                selectedRowKeys.splice(index, 1);
            }
        }
        this.setState({ childClassifiedlist, childSelectedRowKeys: [], selectedRowKeys })
    }

    removeChildClassified(bookCode) {
        let childClassifiedlist = [...this.state.childClassifiedlist];
        let childSelectedRowKeys = [...this.state.childSelectedRowKeys];
        for (let i = 0; i < this.state.childClassifiedlist.length; i++) {
            if (this.state.childClassifiedlist[i].bookCode === bookCode) {
                childClassifiedlist.splice(i, 1);
                break;
            }
        }
        let removeSelect = function (array, bookCode) {
            let new_array = [...this.state[array]];
            let new_array_index = new_array.indexOf(bookCode);
            if (new_array_index > -1) {
                new_array.splice(new_array_index, 1);
            }
            return new_array;
        }
        let selectedRowKeys = removeSelect.call(this, 'selectedRowKeys', bookCode);
        let index = childSelectedRowKeys.indexOf(bookCode);
        if (index > -1) {
            childSelectedRowKeys.splice(index, 1);
        }
        this.setState({ childClassifiedlist, selectedRowKeys, childSelectedRowKeys })
    }

    save() {
        if (!this.state.classifiedName.trim()) {
            message.error('子分类名称不能为空！');
            return;
        }
        if (this.state.classifiedName.trim().length > 5) {
            message.error('子分类名称在5个中文字符以内！');
            return;
        }
        if (this.props.saveSonClassified) {
            let sonClassifiedBookList = [...this.state.childClassifiedlist];
            this.props.saveSonClassified(this.state.classifiedName.trim(), sonClassifiedBookList)
        } else {
            if (this.props.sonBookClassifiedList.find((item) => item.classifiedName == this.state.classifiedName) && !this.props.sonClassified) {
                message.error('子分类名称已经存在！');
                return;
            }
            let sonClassifiedBookList = [];
            for (let i = 0; i < this.state.childClassifiedlist.length; i++) {
                sonClassifiedBookList.push(this.state.childClassifiedlist[i].bookCode);
            }
            let params = {
                classifiedCode: this.props.sonClassified ? this.props.sonClassified.classifiedCode : '',
                classifiedName: this.state.classifiedName.trim(),
                level: '2',
                parentCode: this.props.sonClassified ? this.props.sonClassified.parentCode : this.props.mainClassified.classifiedCode,
                bookCodeList:sonClassifiedBookList
            }
            this.saveAndUpdateBookClassifiedSon(params)
        }
    }

    render() {
        const bookStatus = {
            SHELVES_WAIT: '待上架',
            SHELVES_ON: '已上架',
            SHELVES_OFF: '已下架'
        }
        const columns = [{
            title: '图书名称',
            width: '45%',
            className: 'td_hide',
            dataIndex: 'bookName',
            render: (text, record) => {
                return (
                    <Popover
                        placement="top"
                        title={null}
                        content={record.bookName}
                    >{record.bookName || '-'}</Popover>
                )
            }
        },
        {
            title: '上传时间',
            width: '35%',
            dataIndex: 'createTime',
        },
        {
            title: '状态',
            width: '20%',
            dataIndex: 'goodsState',
            render: (text, record) => {
                return bookStatus[text]
            }
        }];
        const columns2 = [
            {
                title: '图书名称',
                width: '50%',
                className: 'td_hide',
                dataIndex: 'bookName',
                render: (text, record) => {
                    return (
                        <Popover
                            placement="top"
                            title={null}
                            content={record.bookName}
                        >{record.bookName || '-'}</Popover>
                    )
                }
            }, {
                title: '状态',
                width: '25%',
                dataIndex: 'goodsState',
                render: (text, record) => {
                    return <span>{bookStatus[text]}</span>

                }
            }, {
                title: '移除',
                width: '25%',
                dataIndex: 'remove',
                render: (text, record) => {
                    return <span style={{ color: '#1890ff', textDecoration: 'underline', cursor: 'pointer' }} onClick={() => { this.removeChildClassified(record.bookCode) }}>移除</span>
                }
            }
        ];
        return (
            <Modal
                className="addModal"
                style={{ top: 0 }}
                visible={this.props.visible}
                title="添加子分类"
                width={850}
                onCancel={this.handleCancel}
                wrapClassName="th-bg"
                footer={null}
            >
                <div id='ModalContent'>
                    <div className='bookList'>
                        <p>图书选择</p>
                        <Search
                            style={{ marginBottom: 10 }}
                            placeholder="填写图书名称"
                            value = {this.state.book.bookName}
                            onChange={(e) => {
                                this.setState({
                                    book: {
                                        bookPublish: '',
                                        bookName: e.target.value
                                    }
                                })
                            }}
                            onSearch={this.onSearch}
                            enterButton
                        />
                        <Table
                            rowKey={record => record.bookCode}
                            rowSelection={{
                                selectedRowKeys: this.state.selectedRowKeys,
                                onChange: this.onSelectChange
                            }}
                            columns={columns}
                            dataSource={this.state.lists}
                            pagination={false}
                            size='small'
                            scroll={{ y: (this.state.lists.length > 10 ? 370 : 0) }}
                        />
                        <div className='table-footer'>
                            <span style={{ marginLeft: 20 }}>全选</span>
                            <span style={{ marginLeft: 30 }}>{this.state.selectedRowKeys.length}/{this.state.total}</span>
                            <Pagination style={{ padding: '10px 0', marginLeft: 'auto' }} size="small" defaultPageSize={10} current={this.state.current} total={this.state.total} onChange={this.pageChangeFun} />
                        </div>
                    </div>
                    <i></i>
                    <div className='ChildClassified'>
                        <p>子分类设定</p>
                        <div style={{ marginBottom: 10 }}> <span className='ant-form-item-required'>子分类名称：</span> <Input style={{ width: 225 }} placeholder='请输入子分类名称' value={this.state.classifiedName} onChange={(e) => { this.setState({ classifiedName: e.target.value }) }} /></div>
                        <Table
                            rowKey={record => record.bookCode}
                            rowSelection={{
                                selectedRowKeys: this.state.childSelectedRowKeys,
                                onChange: this.onChildSelectedChange
                            }}
                            columns={columns2}
                            dataSource={this.state.childClassifiedlist}
                            pagination={false}
                            size='small'
                            scroll={{ y: (this.state.childClassifiedlist.length > 10 ? 370 : 0) }}
                        />
                        <div className='table-footer'>
                            <span style={{ marginLeft: 20 }}>全选</span>
                            <span style={{ marginLeft: 30 }}>{this.state.childSelectedRowKeys.length}/{this.state.childClassifiedlist.length}</span>
                            <span style={{ marginLeft: 'auto', color: '#1890ff', textDecoration: 'underline', cursor: 'pointer' }} onClick={this.removeAllSelect}>移除选中</span>
                        </div>
                        <Button type="primary" style={{ marginLeft: 130, marginBottom: 10 }} onClick={this.save}>保存</Button>
                    </div>
                </div>
            </Modal>
        )
    }
}
export default AddChildClassified
