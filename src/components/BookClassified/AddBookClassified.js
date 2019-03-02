import React from 'react'
import { Upload, Icon, Input, Spin, Button, Modal, message, Popover, Popconfirm } from 'antd'

import { Link, hashHistory } from 'react-router'
import './AddBookClassified.css'
import AddChildClassified from './AddChildClassified'
import BookList from './BookList'
import DragSortingTable from './DragSortingTable'

const util = require('../util.js');

class AddBookClassified extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            customFileList: [
                //{
                //     uid: -1,
                //     name: 'xxx.png',
                //     status: 'done',
                //     url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
                // }
            ],
            previewVisible: false,
            imageUrl: '',
            classifiedName: '',
            classifiedCode: '',
            showStatus: '',
            visible: false,
            loading: false,
            bookListVisible: false,
            bookClassifiedSon: [],
            editSonClassified: {},
            bookList: []
        }
        this.handleIconPreview = this.handleIconPreview.bind(this);
        this.hideModel = this.hideModel.bind(this);
        this.saveSonClassified = this.saveSonClassified.bind(this);
    }

    getBookClassifiedList(params) {
        this.setState({
            loading: true
        })
        util.API(params, 'ella.operation.getBookClassifiedList').then(res => res.json()).then((data) => {
            if (data.status == '1') {
                this.setState({
                    bookClassifiedSon: data.data.bookClassifiedList,
                    loading: false
                })
            } else {
                message.error(data.message)
            }
        }).catch(e => {
            console.log(e.message)
        })
    }



    moveRow = (dragIndex, hoverIndex) => {
        const { bookClassifiedSon } = this.state;
        const dragRow = bookClassifiedSon[dragIndex];

        let params = {
            moveInModuleCode: bookClassifiedSon[dragIndex].classifiedCode,
            moveInResult: bookClassifiedSon[dragIndex].idx,
            moveOutModuleCode: bookClassifiedSon[hoverIndex].classifiedCode,
            moveOutResult: bookClassifiedSon[hoverIndex].idx,
            moveType:dragIndex < hoverIndex ? 'DOWN' : 'UP',
            level:'2'
        }
        this.sortBookClassifiedBookList(params)
    }

    sortBookClassifiedBookList (params) {
        util.API(params, 'ella.operation.sortBookClassifiedBookList').then(res => res.json()).then((data) => {
            if (data.status == '1') {
                this.getBookClassifiedList({ level: '2', parentCode: this.state.classifiedCode, classifiedName: '' });
            } else {
                message.error(data.message)
            }
        }).catch(e => {
            console.log(e.message)
        })
    }

    getBookClassifiedParentInfo(code) {
        util.API({ classifiedCode: code, pageVo: { page: 0, pageSize: 1000 } }, 'ella.operation.getBookClassifiedParentInfo').then(res => res.json()).then((data) => {
            if (data.status == '1') {
                this.setState({
                    imageUrl: data.data.iconUrl,
                    classifiedName: data.data.classifiedName,
                    customFileList: [
                        {
                            uid: -1,
                            name: 'xxx.png',
                            status: 'done',
                            url: data.data.iconUrl
                        }
                    ],
                    classifiedCode: data.data.classifiedCode,
                    showStatus: data.data.showStatus,
                    bookClassifiedSon: data.data.bookClassifiedSon || []
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

    componentDidMount() {
        hashHistory.getCurrentLocation().query.classifiedCode && this.getBookClassifiedParentInfo(hashHistory.getCurrentLocation().query.classifiedCode);
    }

    handleIconPreview = (file) => {
        this.setState({
            previewVisible: true
        });
    }

    handleChange({ fileList }) {
        this.setState({ customFileList: fileList });
        if (fileList.length && (fileList[0].status == 'done' || fileList[0].status == 'error')) {
            this.imageFetch(fileList[0].originFileObj)
        }
    }

    hideModel() {
        this.setState({
            visible: false
        })
    }

    async imageFetch(file) {
        var formData = new FormData();
        formData.append('pictureStream', file);
        var data = await fetch(util.upLoadUrl, {
            method: 'POST',
            mode: 'cors',
            body: formData
        })
            .then(function (res) {
                return res.json();
            });
        if (data.status == 1) {
            this.setState({
                imageUrl: data.data,
                customFileList: [{ ...this.state.customFileList[0], status: 'done' }]
            });
        }
    }

    updateBookClassifiedStatus(classifiedCode, index) {
        this.setState({
            loading: true
        })
        let bookClassifiedSon = [...this.state.bookClassifiedSon];
        if (classifiedCode) {
            util.API({ classifiedCode, level: '2' }, 'ella.operation.updateBookClassifiedStatus').then(res => res.json()).then((data) => {
                if (data.status == '1') {
                    bookClassifiedSon.splice(index, 1);
                    this.setState({
                        loading: false,
                        bookClassifiedSon
                    })
                } else {
                    message.error(data.message)
                }
            }).catch(e => {
                console.log(e.message)
            })
        } else {
            bookClassifiedSon.splice(index, 1);
            this.setState({
                loading: false,
                bookClassifiedSon
            })
        }

    }

    saveSonClassified(classifiedName, sonClassifiedBookList) {
        if (this.state.bookClassifiedSon.find((item) => item.classifiedName == classifiedName) && this.state.editSonClassified.type === 'add') {
            message.error('子分类名称已经存在！');
            return;
        }
        let bookCodeList = [];
        for (let i = 0; i < sonClassifiedBookList.length; i++) {
            bookCodeList.push(sonClassifiedBookList[i].bookCode);
        }

        if (hashHistory.getCurrentLocation().query.classifiedCode) {
            let params = {
                classifiedCode: this.state.editSonClassified.type === 'edit' ? this.state.editSonClassified.sonClassified.classifiedCode : '',
                classifiedName: classifiedName,
                level: '2',
                parentCode: this.state.classifiedCode,
                bookCodeList: sonClassifiedBookList.map((elm) => {
                    return elm.bookCode;
                })
            }
            this.saveAndUpdateBookClassifiedSon(params, classifiedName, sonClassifiedBookList);
        } else {
            this.updateSookClassifiedSon(classifiedName, sonClassifiedBookList);
        }

    }

    updateSookClassifiedSon = (classifiedName, sonClassifiedBookList,classifiedCode) => {
        let bookClassifiedSon = [...this.state.bookClassifiedSon];
        if (this.state.editSonClassified.type === 'add') {
            if (this.state.bookClassifiedSon.find((item) => item.classifiedName == classifiedName)) {
                message.error('子分类名称已经存在！');
                return;
            }
            bookClassifiedSon.push({
                classifiedCode:classifiedCode,
                classifiedName: classifiedName,
                bookList: sonClassifiedBookList,
                bookCount: sonClassifiedBookList.length,
                showStatus: 'SHOW_OFF'
            })

        } else if (this.state.editSonClassified.type === 'edit') {
            let item_bookClassifiedSon = { ...bookClassifiedSon[this.state.editSonClassified.index] };
            item_bookClassifiedSon.classifiedName = classifiedName;
            item_bookClassifiedSon.bookCount = sonClassifiedBookList.length;
            bookClassifiedSon[this.state.editSonClassified.index] = item_bookClassifiedSon;
        }
        this.setState({
            bookClassifiedSon,
            visible: false
        })
    }

    saveOrUpdateBookClassifiedInfo(params, classifiedName, sonClassifiedBookList) {
        util.API(params, hashHistory.getCurrentLocation().query.classifiedCode?'ella.operation.updateBookClassifiedInfo':'ella.operation.saveBookClassifiedInfo').then(res => res.json()).then((data) => {
            if (data.status == '1') {
                message.success('操作成功！');
                hashHistory.push('/bookClassified');
            } else {
                message.error(data.message);
            }
        }).catch(e => {
            console.log(e.message)
        })
    }

    saveAndUpdateBookClassifiedSon(params, classifiedName, sonClassifiedBookList) {
        util.API(params, 'ella.operation.saveAndUpdateBookClassifiedSon').then(res => res.json()).then((data) => {
            if (data.status == '1') {
                this.getBookClassifiedList({ level: '2', parentCode: this.state.classifiedCode, classifiedName: '' });
                this.setState({
                    visible: false
                })
            } else {
                message.error(data.message);
            }
        }).catch(e => {
            console.log(e.message)
        })
    }

    submit = () => {
        if (!this.state.imageUrl) {
            message.error('图片未上传！');
            return;
        }
        if (!this.state.classifiedName.trim()) {
            message.error('主分类名称不能为空！');
            return;
        }
        if (this.state.classifiedName.trim().length > 5) {
            message.error('主分类名称在5个中文字符以内！');
            return;
        }

        let params = {}
        if (hashHistory.getCurrentLocation().query.classifiedCode) {
            let bookClassifiedList = [];
            this.state.bookClassifiedSon.map((item) => {
                bookClassifiedList.push(item.classifiedCode);
            });
            params.classifiedCode = this.state.classifiedCode;
            params.classifiedName = this.state.classifiedName.trim();
            params.iconUrl = this.state.imageUrl;
            params.level = '1';
            params.bookClassifiedCodeList = bookClassifiedList;
        } else {
            let bookClassifiedList = [];
            this.state.bookClassifiedSon.map((item) => {
                let unit = {};
                unit.classifiedName = item.classifiedName;
                unit.level = '2';
                unit.classifiedCode = '';
                unit.parentCode = '';
                unit.bookCodeList = item.bookList.map((elm)=> elm.bookCode);
                bookClassifiedList.push(unit);
            });
            params.classifiedCode = '';
            params.classifiedName = this.state.classifiedName.trim();
            params.iconUrl = this.state.imageUrl;
            params.level = '1';
            params.parentCode = '0';
            params.bookClassifiedList = bookClassifiedList;
        }
        this.saveOrUpdateBookClassifiedInfo(params);
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
            title: '子分类名字',
            width: '20%',
            className: 'td_hide',
            dataIndex: 'classifiedName',
            render: (text, record) => {
                return (
                    <Popover
                        placement="top"
                        title={null}
                        content={
                            record.classifiedName
                        }
                    >
                        {record.classifiedName || '-'}
                    </Popover>
                )
            }
        },
        {
            title: '展示状态',
            width: '20%',
            dataIndex: 'showStatus',
            render: (text) => {
                return showStatus[text]
            }
        },
        {
            title: '图书数量',
            width: '20%',
            dataIndex: 'bookCount',
            render: (text, record, index) => {
                return <span style={{ color: '#1890ff', textDecoration: 'underline', cursor: 'pointer' }} onClick={() => {
                    if (record.bookCount == 0) {
                        message.warn('没有关联图书');
                    } else {
                        if (record.classifiedCode) {
                            this.getBookClassifiedBookList(record.classifiedCode)
                        } else {
                            this.setState({
                                bookList: this.state.bookClassifiedSon[index].bookList,
                                bookListVisible: true
                            })
                        }
                    }

                }}>{text}</span>
            }
        }, {
            title: '操作',
            width: '20%',
            dataIndex: 'edit',
            render: (text, record, index) => {
                return (
                    <div>
                        <i className="i-action-ico i-edit" type="edit" style={{ marginRight: 20 }} onClick={() => { this.setState({ editSonClassified: { type: 'edit', index, sonClassified: record }, visible: true }) }} />
                        <Popconfirm title="确定删除吗?" onConfirm={() => { this.updateBookClassifiedStatus(record.classifiedCode, index) }}>
                            <span className='i-action-ico i-delete'></span>
                        </Popconfirm>
                    </div>
                )
            }
        }];
        return (
            <div id='AddClassifiedBook'>
                <p className="m-title"><Link to='/bookClassified'><Icon type="left" /> 添加新的主分类</Link></p>
                <div className='classification'>
                    <div className='mainClassification'>
                        <p style={{fontSize:'18px'}}>主分类基础信息设定</p>
                        <Upload
                            accept=".jpg,.png,.webp,.bmp,.tiff,.gif,.jpeg"
                            action="//jsonplaceholder.typicode.com/posts/"
                            listType="picture-card"
                            fileList={this.state.customFileList}
                            onPreview={this.handleIconPreview}
                            onChange={({ fileList }) => { this.handleChange({ fileList }) }}
                            onRemove={() => { this.setState({ imageUrl: "" }) }}
                        >
                            {this.state.customFileList.length >= 1 ? null : <div>
                                <Icon type="plus" />
                                <div className="ant-upload-text">Upload</div>
                            </div>}
                        </Upload>
                        <div style={{ color: '#faad14' }}>图片尺寸：98*98</div>
                        <Modal visible={this.state.previewVisible} footer={null} onCancel={() => { this.setState({ previewVisible: false }) }}>
                            <img alt="example" style={{ width: '100%' }} src={this.state.imageUrl} />
                        </Modal>
                        <p className='ant-form-item-required' style={{ marginTop: 30 }}>主分类名称</p>
                        <Input placeholder='请输入主分类名称' value={this.state.classifiedName} onChange={(e) => { this.setState({ classifiedName: e.target.value }) }} />
                    </div>
                    <i></i>
                    <div className='subclass t-nm-tab'>
                        <p style={{fontSize:'18px'}}>子分类设定</p>
                        <p style={{ textAlign: 'right' }}>列表总数：{this.state.bookClassifiedSon.length}</p>
                        <div style={{ display: 'flex', marginBottom: 10 }}>
                            <Button type="primary" icon="delete" className="ant-btn-add" onClick={() => { this.setState({ bookClassifiedSon: [] }) }}>清空列表</Button>
                            <Button type="primary" className="ant-btn-add" icon="plus" style={{ marginLeft: 'auto', marginRight: 30 }} onClick={() => { this.setState({ editSonClassified: { type: 'add', index: null, sonClassified: null }, visible: true }) }}>添加子分类</Button>
                            <AddChildClassified visible={this.state.visible} hideModel={this.hideModel} saveSonClassified={this.saveSonClassified} editSonClassified={this.state.editSonClassified} />
                            <Button type="primary" onClick={this.submit}>保存分类</Button>
                        </div>
                        <Spin tip="加载中..." spinning={this.state.loading} size="large" style={{ zIndex: 9999 }}>
                            <DragSortingTable rowKey='id' columns={columns} data={this.state.bookClassifiedSon} moveRow={this.moveRow} scroll={{height:570}}/>
                        </Spin>
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
                </div>
            </div>
        )
    }
}

export default AddBookClassified;
