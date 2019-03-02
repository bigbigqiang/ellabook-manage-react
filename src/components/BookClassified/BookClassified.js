import React from 'react'
import { Icon, Button, message, Popconfirm, Spin, Input, Select, Modal } from 'antd'
import { Link } from 'react-router'
import util from '../util.js'
import './BookClassified.less'
import BookList from './BookList'
import AddChildClassified from './AddChildClassified'
import DragSortingTable from './DragSortingTable'
const Search = Input.Search;
class ClassifiedBook extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            bookClassifiedList: [],
            mainClassified: {
                classifiedName: '',
                classifiedCode: ''
            },
            searchClassifiedName: '',
            sonClassified: null,
            sonBookClassifiedList: [],
            sonListCount: [],
            mainLoading: false,
            sonLoading: false,
            bookListVisible: false,
            bookList: [],
            visible: false
        }
        this.hideModel = this.hideModel.bind(this);
        this.getBookClassifiedList = this.getBookClassifiedList.bind(this);
        this.onRowClick = this.onRowClick.bind(this);
    }

    //搜索框
    TopicSearch(value) {
        this.setState({
            searchClassifiedName: value
        })
        this.getBookClassifiedList({ level: '1', parentCode: '', classifiedName: value });
    }


    componentDidMount() {
        this.getBookClassifiedList({ level: '1', parentCode: '', classifiedName: '' });
    }
    getBookClassifiedList(params) {
        if (params.level === '1') {
            this.setState({
                mainLoading: true
            })
        } else if (params.level === '2') {
            this.setState({
                sonLoading: true
            })
        }
        util.API(params, 'ella.operation.getBookClassifiedList').then(res => res.json()).then((data) => {
            if (data.status == '1') {
                if (params.level === '1') {
                    if (data.data.bookClassifiedList.length) {
                        this.getBookClassifiedList({ level: '2', parentCode: this.state.mainClassified.classifiedCode?this.state.mainClassified.classifiedCode:data.data.bookClassifiedList[0].classifiedCode, classifiedName: '' });
                        if (!this.state.mainClassified.classifiedCode) {
                            this.setState({ mainClassified: { classifiedName: data.data.bookClassifiedList[0].classifiedName, classifiedCode: data.data.bookClassifiedList[0].classifiedCode } });
                        }
                    }
                    this.setState({
                        bookClassifiedList: data.data.bookClassifiedList,
                        sonListCount: data.data.sonListCount,
                        mainLoading: false
                    })
                } else if (params.level === '2') {
                    this.setState({
                        sonBookClassifiedList: data.data.bookClassifiedList,
                        sonLoading: false
                    })
                }
            } else {
                message.error(data.message)
            }
        }).catch(e => {
            console.log(e.message)
        })
    }

    updateBookClassifiedStatus(classifiedCode, level) {
        util.API({ classifiedCode, level }, 'ella.operation.updateBookClassifiedStatus').then(res => res.json()).then((data) => {
            if (data.status == '1') {
                if (level === '1') {
                    this.getBookClassifiedList({ level: '1', parentCode: '', classifiedName: '' });
                    if (this.state.mainClassified) {
                        this.setState({
                            sonBookClassifiedList: [],
                            mainClassified: {
                                classifiedName: '',
                                classifiedCode: ''
                            }
                        })
                    }
                } else {
                    this.getBookClassifiedList({ level: '1', parentCode: '', classifiedName: '' });
                    this.getBookClassifiedList({ level: '2', parentCode: this.state.mainClassified.classifiedCode, classifiedName: '' });
                }

            } else {
                message.error(data.message)
            }
        }).catch(e => {
            console.log(e.message)
        })
    }
    publish = () => {
        util.API({ showStatus: 'SHOW_ON' }, 'ella.operation.updateBookClassifiedShowStatus').then(res => res.json()).then((data) => {
            if (data.status == '1') {
                message.success('发布成功！');
                this.getBookClassifiedList({ level: '1', parentCode: '', classifiedName: '' });
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
                this.setState({
                    bookList: data.data,
                    bookListVisible: true
                })
            } else {
                message.error(data.message)
            }
        }).catch(e => {
            console.log(e.message)
        })
    }
    sortBookClassifiedBookList (params) {
        util.API(params, 'ella.operation.sortBookClassifiedBookList').then(res => res.json()).then((data) => {
            if (data.status == '1') {
                console.log(data)
                if (params.level === '1') {
                    this.getBookClassifiedList({ level: '1', parentCode: '', classifiedName: this.state.searchClassifiedName });
                } else {
                    this.getBookClassifiedList({ level: '2', parentCode: this.state.mainClassified.classifiedCode, classifiedName: '' });
                }
            } else {
                message.error(data.message)
            }
        }).catch(e => {
            console.log(e.message)
        })
    }

    moveRow = (dragIndex, hoverIndex) => {
        const { bookClassifiedList } = this.state;
        const dragRow = bookClassifiedList[dragIndex];
        let params = {
            moveInModuleCode: bookClassifiedList[dragIndex].classifiedCode,
            moveInResult: bookClassifiedList[dragIndex].idx,
            moveOutModuleCode: bookClassifiedList[hoverIndex].classifiedCode,
            moveOutResult: bookClassifiedList[hoverIndex].idx,
            moveType:dragIndex < hoverIndex ? 'DOWN' : 'UP',
            level:'1'
        }
        this.sortBookClassifiedBookList(params);
    }

    moveSonRow = (dragIndex, hoverIndex) => {
        const { sonBookClassifiedList } = this.state;
        const dragRow = sonBookClassifiedList[dragIndex];
        let params = {
            moveInModuleCode: sonBookClassifiedList[dragIndex].classifiedCode,
            moveInResult: sonBookClassifiedList[dragIndex].idx,
            moveOutModuleCode: sonBookClassifiedList[hoverIndex].classifiedCode,
            moveOutResult: sonBookClassifiedList[hoverIndex].idx,
            moveType:dragIndex < hoverIndex ? 'DOWN' : 'UP',
            level:'2'
        }
        this.sortBookClassifiedBookList(params);
        // this.setState(
        //     update(this.state, {
        //         sonBookClassifiedList: {
        //             $splice: [[dragIndex, 1], [hoverIndex, 0, dragRow]],
        //         },
        //     }),
        // );
    }

    onRowClick(e, record) {
        if (e.target.tagName == 'TD') {
            this.setState({
                mainClassified: {
                    classifiedName: record.classifiedName,
                    classifiedCode: record.classifiedCode
                }
            });
            this.getBookClassifiedList({ level: '2', parentCode: record.classifiedCode, classifiedName: '' });
        }
    }

    hideModel() {
        this.setState({
            visible: false
        })
    }

    render() {
        const showStatus = {
            SHOW_ON: '已发布',
            SHOW_OFF: '未发布',
            SHOW_WAIT: '修改未发布'
        }
        const columns = [{
            title: '排序',
            width: '20%',
            dataIndex: 'index',
            render: (text, record, index) => {
                return <span>{index + 1}</span>;
            }
        }, {
            title: '主分类名称',
            width: '20%',
            dataIndex: 'classifiedName'
        }, {
            title: '展示状态',
            width: '20%',
            dataIndex: 'showStatus',
            render: (text) => {
                return showStatus[text]
            }
        }, {
            title: '操作',
            width: '20%',
            dataIndex: 'edit',
            render: (text, record) => {
                return (
                    <div>
                        <Link target="_blank" to={"/addBookClassified?classifiedCode=" + record.classifiedCode} style={{ marginRight: 20 }}>
                            <i className="i-action-ico i-edit" type="edit" />
                        </Link>
                        <Popconfirm title="确定删除吗?" onConfirm={() => { this.updateBookClassifiedStatus(record.classifiedCode, '1') }}>
                            <span className='i-action-ico i-delete'></span>
                        </Popconfirm>
                    </div>
                )
            }
        }, {
            title: '子分类',
            width: '20%',
            dataIndex: 'childClass',
            render: (text, record) => {
                let unit = record.classifiedCode ? this.state.sonListCount.find((item) => item.classifiedCode == record.classifiedCode) : null;
                return <span style={{ color: '#23b8e6' }}>{unit ? unit.classCount : 0}</span>
            }
        }]
        const columns2 = [{
            title: '排序',
            width: '20%',
            dataIndex: 'index',
            render: (text, record, index) => {
                return <span>{index + 1}</span>;
            }
        }, {
            title: '子分类名称',
            width: '20%',
            dataIndex: 'classifiedName'
        }, {
            title: '展示状态',
            width: '20%',
            dataIndex: 'showStatus',
            render: (text) => {
                return showStatus[text]
            }
        }, {
            title: '图书数量',
            width: '20%',
            dataIndex: 'bookCount',
            render: (text, record, index) => {
                return <span style={{ color: '#1890ff', textDecoration: 'underline', cursor: 'pointer' }} onClick={() => {
                    if (record.bookCount == 0) {
                        message.warn('没有关联图书');
                    } else {
                        this.getBookClassifiedBookList(record.classifiedCode)
                    }
                }}>{text}</span>
            }
        }, {
            title: '操作',
            width: '20%',
            dataIndex: 'edit',
            render: (text, record) => {
                return (
                    <div>
                        <i style={{ marginRight: 20 }} className="i-action-ico i-edit" type="edit" onClick={() => { this.setState({ sonClassified: record, visible: true }) }} />
                        <Popconfirm title="确定删除吗?" onConfirm={() => { this.updateBookClassifiedStatus(record.classifiedCode, '2') }}>
                            <span className='i-action-ico i-delete'></span>
                        </Popconfirm>
                    </div>
                )
            }
        }]
        return (
            <div id="ClassifiedBook">
                <p className="m-title">图书分类</p>
                <div className="m-rt-content">
                    <p className='m-btn-add' style={{ "display": "inline-block", "marginRight": "30px" }}><Link to="/addBookClassified"><Button type="primary" className="u-btn-add"><Icon type="plus" />添加新的主分类</Button></Link></p>
                    <Select defaultValue="pointsCode" className="selectWidth intervalRight">
                        <Select.Option value="pointsCode">主分类</Select.Option>
                    </Select>
                    <Search placeholder="搜索" enterButton style={{ width: 400 }} onChange={(e) => { console.log(e.target.value) }} onSearch={value => this.TopicSearch(value)} />
                    <div className='m-content t-nm-tab'>
                        <div className="m-content-item m-content-l">
                            <div className='m-content-header' >主分类</div>
                            <Spin tip="加载中..." spinning={this.state.mainLoading} size="large" style={{ zIndex: 9999 }}>
                                <DragSortingTable
                                    rowKey='id'
                                    rowClassName={(record) => { if (record.classifiedCode === this.state.mainClassified.classifiedCode) { return 'el-tr-gary' } }}
                                    onRowClick={this.onRowClick}
                                    columns={columns} data={this.state.bookClassifiedList} bordered moveRow={this.moveRow} className="t-nm-tab" scroll={{height:490,rowNum:10}} />
                            </Spin>
                        </div>
                        <div className="m-content-item m-content-r" >
                            <div className='m-content-header'>子分类{this.state.mainClassified.classifiedName ? ('--' + this.state.mainClassified.classifiedName) : ''}
                                <Button size="small" style={{ float: 'right', marginRight: '10px', marginTop: '8px' }} onClick={() => {
                                    if (this.state.mainClassified.classifiedCode) {
                                        this.setState({ visible: true, sonClassified: null })
                                    } else {
                                        message.warn('请先选择主分类');
                                    }
                                }}>添加子分类</Button>
                                <AddChildClassified visible={this.state.visible} hideModel={this.hideModel} sonClassified={this.state.sonClassified} sonBookClassifiedList={this.state.sonBookClassifiedList} getBookClassifiedList={this.getBookClassifiedList} mainClassified={this.state.mainClassified} />
                            </div>
                            <Spin tip="加载中..." spinning={this.state.sonLoading} size="large" style={{ zIndex: 9999 }}>
                                <DragSortingTable
                                    rowKey='id'
                                    rowClassName={(record, index) => { if (record.classifiedCode === this.state.mainClassified.classifiedCode) { return 'el-tr-gary' } }}
                                    columns={columns2} data={this.state.sonBookClassifiedList} bordered moveRow={this.moveSonRow} className="t-nm-tab" scroll={{height:490,rowNum:10}} />
                            </Spin>
                        </div>
                    </div>
                    <Modal
                        visible={this.state.bookListVisible}
                        title="图书列表"
                        onCancel={() => { this.setState({ bookListVisible: false }) }}
                        footer={null}
                        width={1000}
                    >
                        {this.state.bookListVisible && <BookList bookList={this.state.bookList} />}
                    </Modal>
                </div>
                <Button type="primary" style={{ margin: '50px auto 0', display: 'block' }} onClick={this.publish}>发布</Button>
            </div>
        )
    }
}
export default ClassifiedBook