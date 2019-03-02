import React from 'react'
import { Upload, Icon, Form, Input, Select, Spin, Radio, Button, Modal, message, Row, Col, Table, Checkbox } from 'antd'
import { Link, hashHistory } from 'react-router'
import commonData from '../commonData.js'
import "./topic.css";

const FormItem = Form.Item
const Option = Select.Option
const RadioGroup = Radio.Group
const CheckboxGroup = Checkbox.Group;

const util = require('../util.js');

const targetTypeData = [
    {
        key: 'BOOK_LIST',
        value: '推荐专栏'
    },
    {
        key: 'SYSTEM_INTERFACE',
        value: '系统界面'
    },
    {
        key: 'H5',
        value: 'H5页面'
    },
    {
        key: 'BOOK_DETAIL',
        value: '图书详情'
    },
    {
        key: 'COURSE_DETAIL',
        value: '课程详情'
    }
];

class myForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: false,
            status: this.props.params.status,
            data: [],
            iconDefault: 'b',
            previewVisible2: false,
            previewImage2: '',
            customFileList: [],
            imgUploading: false,
            loading3: false,
            targetPage: '',
            searchId: '',
            childSelectContent: [],
            idx: 0,
            selectContent: [],
            h5Flag: {
                display: 'none'
            },
            h5TargetPage: '',
            lists: [],
            selectedRowKeys: [],
            tmpSelectdRowKeys: [],
            bookDetailName: '',
            searchGroupList: [],
            bookPageThirdCode: "",        //图书包编码
            defauleName: "",
            imgUrl: '',
            iconUrl: '',
            subjectTitle: '',
            searchTxt: '',
            platformList: [],//平台下拉数据
            platformCode: [],//所选平台

        }
        this.onPagnition = this.onPagnition.bind(this);
        this.handleIconChange = this.handleIconChange.bind(this);
    }
    setOneKV(k, v) {
        this.setState({
            [k]: v,
            bookDetailUrl: 'ellabook2://detail.course?courseCode=' + v
        })
    }
    fetchFn = async () => {
        var doc = {
            subjectCode: this.state.status
        };
        var data = await fetch(util.url, {
            method: 'POST',
            headers: {
                "Content-type": "application/x-www-form-urlencoded"
            },
            mode: 'cors',
            body: "method=ella.book.getOperationSubjectInfo" + "&content=" + JSON.stringify(doc) + commonData.dataString
        })
            .then(function (res) {
                return res.json();
            });
        if (data.data.targetType == 'BOOK_LIST') {
            this.setState({
                targetValue: targetTypeData[0].value,
                targetKey: targetTypeData[0].key
            })
            this.selectTargetType(0);

        }
        if (data.data.targetType == 'SYSTEM_INTERFACE') {
            this.setState({
                targetValue: targetTypeData[1].value,
                targetKey: targetTypeData[1].key
            })
            this.selectTargetType(1);


        }
        if (data.data.targetType == 'H5') {
            this.setState({
                targetValue: targetTypeData[2].value,
                targetKey: targetTypeData[2].key
            })
            this.selectTargetType(2);
        }
        if (data.data.targetType == 'BOOK_DETAIL') {
            this.setState({
                targetValue: targetTypeData[3].value,
                targetKey: targetTypeData[3].key
            })
            this.selectTargetType(3);
        }
        if (data.data.targetType == 'COURSE_DETAIL') {
            this.setState({
                targetValue: targetTypeData[4].value,
                targetKey: targetTypeData[4].key,
                searchGroupList: [],
                defauleName: data.data.searchPageName,
            })
            this.selectTargetType(4);
        }
        this.selectTargetPage(data.data.targetType);
        this.setState({
            targetType: this.state.targetKey,
            data: data.data,
            iconDefault: !!data.data.imageUpSearchId ? 'a' : 'b',
            customFileList: data.data.imageUpSearchId == '' ? [{
                uid: -2,
                name: '专题图标.png',
                status: 'done',
                url: data.data.bgImageUpUrl
            }] : [],
            imgUrl: data.data.imageSearchId == '' ? data.data.bgImageUrl : '',
            imgDtUrl: '',
            iconUrl: data.data.imageUpSearchId == '' ? data.data.bgImageUpUrl : '',
            iconDtUrl: data.data.imageUpSearchId == '' ?  this.state.subject_bg_img_up[0].searchCode: data.data.bgImageUpUrl,
            searchId: data.data.searchId,
            imageUpSearchId: data.data.imageUpSearchId,
            searchPageName: data.data.searchPageName,
            targetPage: data.data.targetPage,
            bookDetailUrl: data.data.targetPage,
            idx: 0,
            h5TargetPage: data.data.targetPage,
            searchTxt: data.data.searchPageName,
            platformCode: data.data.platformCode.split(","),
        });
    }

    componentDidMount() {
        this.getSubjectBgImgUp();
        this.fetchPlatformList("SYSTEM_PLATFORM");
    }

    selectIcon = (e) => {
        // this.getSubjectBgImgUp(e.target.value);
        let imageUpSearchId = this.state.imageUpSearchId ? this.state.imageUpSearchId : this.state.subject_bg_img_up[0].searchId;
        this.setState({
            iconDefault: e.target.value,
            imageUpSearchId: imageUpSearchId
        });
    }

    handleSelect2Change = (value) => {
        this.setState({
            iconDtUrl: this.state.subject_bg_img_up.filter((item)=>item.searchId===value)[0].searchCode,
            imageUpSearchId: value
        })
    }

    getSubjectBgImgUp = async (value) => {
        var doc = {
            groupId: 'SUBJECT_BG_IMAGE_UP'
        };
        var data = await fetch(util.url, {
            method: 'POST',
            headers: {
                "Content-type": "application/x-www-form-urlencoded"
            },
            mode: 'cors',
            body: "method=ella.operation.boxSearchList" + "&content=" + JSON.stringify(doc) + commonData.dataString
        }).then(function (res) {
            return res.json();
        });
        this.setState({
            subject_bg_img_up: data.data
        },()=>{
            if (this.state.status == '0') {
                this.setState({
                    iconDefault: 'b',
                    targetType: targetTypeData[0].key,
                    iconDtUrl: this.state.subject_bg_img_up[0].searchCode,
                });
                this.selectTargetType(0);
                this.selectTargetPage(targetTypeData[0].key);
            } else {
                this.fetchFn();
            }
        });
    }
    
    //提交
    onEdit = async (targetType) => {
        //对H5页面校验
        if (this.state.targetType == "H5") {
            var str = /http\:\/\/|https\:\/\/|ellabook\:\/\/|ellabook2\:\/\//;
            if (!str.test(targetType)) {
                message.error('链接地址格式不正确！');
                return;
            }
        }
        if (this.state.platformCode.join() == "GUSHIJI") {
            var bgImageUpUrl = '';
        } else {
            var bgImageUpUrl = this.state.iconDefault == 'a' ? encodeURIComponent(this.state.iconDtUrl) : encodeURIComponent(this.state.iconUrl)
        }
        var doc = {
            subjectCode: this.state.status == 0 ? null : this.state.status,
            subjectTitle: this.props.form.getFieldsValue().subjectTitle,
            bgImageUrl: '',//2.4.0废弃
            imageSearchId: this.state.imageSearchId,
            bgImageUpUrl: bgImageUpUrl,
            imageUpSearchId: this.state.iconDefault == 'a'? this.state.imageUpSearchId: '',
            targetType: this.state.targetType,
            searchId: this.state.searchId,
            searchPageName: this.state.searchPageName,
            targetPage: encodeURIComponent(targetType),
            platformCode: this.state.platformCode.join(","),
        };
        if (this.state.targetType == "COURSE_DETAIL" && this.state.bookPageThirdCode == "") {
            doc.targetPage = encodeURIComponent(this.state.targetPage);
            doc.targetType = "COURSE_DETAIL";
            doc.searchPageName = this.state.defauleName;
        } else if (this.state.targetType == "COURSE_DETAIL" && this.state.bookPageThirdCode != "") {
            doc.targetPage = encodeURIComponent(this.state.targetPage);
            doc.targetType = "COURSE_DETAIL";
            doc.searchPageName = this.state.searchGroupList.find(n => n.courseCode == this.state.bookPageThirdCode).courseName
        }
        var data = await fetch(util.url, {
            method: 'POST',
            headers: {
                "Content-type": "application/x-www-form-urlencoded"
            },
            mode: 'cors',
            body: "method=ella.book.saveOperationSubject" + "&content=" + JSON.stringify(doc) + commonData.dataString
        })
            .then(function (res) {
                return res.json()
            });
        if (data.status == 1) {
            message.success('成功!');
            if (this.state.status == 0) {
                setTimeout(() => {
                    hashHistory.push('/home/topic');
                }, 1000)
            }
        } else {
            message.error(data.message);
        }
    }

    // 提交
    handleSubmit = (e) => {
        e.preventDefault()

        let childSelectContent = this.state.childSelectContent;


        if (this.state.platformCode.length == 0) {
            message.error('平台未选择');
            return;
        }
        if ( this.state.iconDefault==='b' && !this.state.iconUrl) {
            message.error('请添加图片!');
            return;
        }
        console.log(this.state.idx)
        if (this.state.targetType == 'H5') {
            this.setState({
                searchId: '',
                searchPageName: 'h5页面',
                targetPage: this.props.form.getFieldsValue().h5TargetPage
            }, () => {
                this.onEdit(this.state.targetPage)
            });
        } else if (this.state.targetType == 'BOOK_DETAIL' || this.state.targetType == 'COURSE_DETAIL') {
            this.setState({
                searchId: '',
                searchPageName: this.state.searchTxt,
                targetPage: this.state.bookDetailUrl
            }, () => {

                if (this.state.targetPage == '' || this.state.targetPage == 'undefined' || this.state.targetPage == undefined) {
                    message.error('请添加图书!');
                } else {
                    this.onEdit(this.state.targetPage)
                }
            });
        }
        else {
            this.setState({
                searchId: childSelectContent[this.state.idx].searchId,
                searchPageName: childSelectContent[this.state.idx].searchName,
                targetPage: childSelectContent[this.state.idx].searchCode
            }, () => {
                this.onEdit(this.state.targetPage)
            });
        }
    }

    handleIconCancel = () => this.setState({ previewVisible2: false })

    handleIconPreview = (file) => {
        this.setState({
            previewImage2: file.url || file.thumbUrl,
            previewVisible2: true,
        });
    }
    imageFetch = async (file) => {
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
                imgUploading: false, 
                iconUrl: data.data,
                customFileList: [{...this.state.customFileList[0],status:'done'}]
            });
        }
    }

    handleIconChange({ fileList }) {
        this.setState({ customFileList: fileList, iconUrl: "" });
        if (fileList.length && (fileList[0].status == 'done'|| fileList[0].status == 'error')) {
            this.imageFetch(fileList[0].originFileObj)
        } 
    }

    //目标链接选择
    selectTargetType = (n) => {
        this.setState({
            targetTypeSelect: (
                <Select labelInValue defaultValue={{ key: targetTypeData[n].value }} style={{ width: 120 }} onChange={this.handleTargetTypeChange}>
                    {
                        targetTypeData.map((item, index) => {
                            return <Option value={item.key} key={item.key}>{item.value}</Option>
                        })
                    }
                </Select>
            )
        })
    }

    selectTargetPage = async (targetType) => {
        var doc = {
            groupId: targetType
        };
        var data = await fetch(util.url, {
            method: 'POST',
            headers: {
                "Content-type": "application/x-www-form-urlencoded"
            },
            mode: 'cors',
            body: "method=ella.operation.boxSearchList" + "&content=" + JSON.stringify(doc) + commonData.dataString
        }).then(function (res) {
            return res.json();
        });
        data.data.map((item, idx) => {
            if (item.searchId == this.state.searchId) {
                this.setState({
                    idx: idx
                })
            }
        })
        if (targetType == 'BOOK_LIST' || targetType == 'SYSTEM_INTERFACE') {
            this.setState({
                childSelectContent: data.data,
                idx: this.state.status == 0 ? 0 : this.state.idx,
                targetPageSelect: (<Select labelInValue defaultValue={{ key: this.state.idx }} style={{ width: 120, marginLeft: 10 }} onChange={this.handleTargetPageChange}>
                    {
                        data.data.map((item, index) => {
                            return <Option value={index} key={index}>{item.searchName}</Option>
                        })
                    }
                </Select>),
                h5Flag: {
                    display: 'none'
                },
                bookDetailFlag: {
                    display: 'none'
                }
            });
        }
        else if (targetType == 'H5') {
            this.setState({
                targetPageSelect: '',
                bookDetailFlag: {
                    display: 'none'
                },
                h5Flag: {
                    display: 'block'
                }
            });
        }
        else if (targetType == 'BOOK_DETAIL') {
            this.setState({
                targetPageSelect: '',
                h5Flag: {
                    display: 'none'
                },
                bookDetailFlag: {
                    display: 'block'
                }
            });
        } else if (targetType == 'COURSE_DETAIL') {
            this.setState({
                targetPageSelect: '',
                h5Flag: {
                    display: 'none'
                },
                bookDetailFlag: {
                    display: 'none'
                }
            });
        }

    }

    handleTargetTypeChange = (value) => {

        this.selectTargetPage(value.key);
        this.setState({
            targetType: value.key,
            targetKey: value.key,
            targetValue: value.label
        });
    }
    handleTargetPageChange = (value) => {
        this.setState({
            searchPageName: value.label,
            idx: value.key,
            searchId: this.state.childSelectContent[value.key].searchId
        });
    }

    bookDetailList = async (txt, n) => {
        this.setState({
            selectedRowKeys: [],
            tmpSelectdRowKeys: []
        })
        var doc = {
            text: txt,
            page: n,
            pageSize: 5
        }
        var data = await fetch(util.url, {
            method: 'POST',
            headers: {
                "Content-type": "application/x-www-form-urlencoded"
            },
            mode: 'cors',
            body: "method=ella.operation.getBookListByIdOrName" + "&content=" + JSON.stringify(doc) + commonData.dataString
        })
            .then(function (res) {
                return res.json();
            });
        this.setState({
            lists: data.data.bookList,
            total: data.data.total
        });
    }

    bookDetailSearch = () => {
        this.setState({
            searchTxt: this.props.form.getFieldsValue().bookDetailName,
            key: Math.random()
        }, () => {
            this.showModal();
            this.bookDetailList(this.props.form.getFieldsValue().bookDetailName, 0);
        });
    }
    showModal = () => {
        this.setState({
            visible: true,
        });
    }
    handleOk = () => {
        var tmp = this.state.tmpSelectdRowKeys;
        var i = tmp[0];
        if (tmp.length == 0) {
            message.error('请选择图书！');
            return;
        }
        if (this.state.total > 0) {
            this.setState({ loading3: true });
            setTimeout(() => {
                this.setState({ loading3: false, visible: false, bookDetailUrl: 'ellabook://detail.book?bookCode=' + this.state.lists[i].bookCode + '&method=ella.book.getBookByCode', searchTxt: this.state.lists[i].bookName }, () => {
                    this.props.form.setFieldsValue({
                        bookDetailName: this.state.searchTxt
                    })
                });
            }, 1000);
        } else {
            this.setState({
                visible: false
            });
        }

    }
    handleCancel = () => {
        this.setState({ visible: false });
    }

    // TODO:搜索课程列表

    async fetchGoodGroup(str) {
        var doc2 = {
            "courseName": "",
            "goodsState": "SHELVES_ON"
        }
        var data = await fetch(util.url, {
            mode: "cors",
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: "method=ella.operation.getBookCourseList" + "&content=" + JSON.stringify(doc2) + commonData.dataString
        }).then(res => res.json());

        if (!data.data) return; //搜索出null直接return防止报错
        this.setState({
            searchGroupList: data.data.list || []
        })
    }
    onSelectChange = (selectedRowKeys) => {
        var tmp = this.state.tmpSelectdRowKeys;
        if (selectedRowKeys.length > 1) {
            message.error('每次只能选择一本图书！');
            return;
        }
        this.setState({
            selectedRowKeys: selectedRowKeys,
            tmpSelectdRowKeys: tmp.concat(selectedRowKeys)
        })
    }
    onPagnition = (current, pageSize) => {
        this.bookDetailList(this.state.searchTxt, current.current - 1);
    }
    //平台下拉框数据
    async fetchPlatformList(fetchStr) {
        var data = await fetch(util.url, {
            mode: "cors",
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },

            body: "method=ella.operation.boxSearchList" + "&content=" + JSON.stringify({ "groupId": fetchStr }) + commonData.dataString

        }).then(res => res.json())

        var cur = data.data.filter(item => item.searchCode != 'GUSHIJI');
        this.setState({
            platformList: cur.map((item, index) => {
                return {
                    ["label"]: item.searchName,
                    ["value"]: item.searchCode
                }
            })


        })

    }
    render() {
        const columns = [{
            title: '图书标题',
            width: '30%',
            dataIndex: 'bookName'
        }, {
            title: '图书编码',
            width: '20%',
            dataIndex: 'bookCode'
        }, {
            title: '出版时间',
            width: '30%',
            dataIndex: 'publishTime'
        }, {
            title: '图书状态',
            width: '20%',
            dataIndex: 'goodsState'
        }];
        const { getFieldDecorator } = this.props.form
        const { previewVisible2, previewImage2, customFileList, visible, loading3 } = this.state;
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 18 }
        }
        const { selectedRowKeys } = this.state

        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange
        }

        const pagination = {
            total: this.state.total,
            showSizeChanger: false,
            pageSize: 5
        }
        return (
            <div>
                <p className="m-title"><Link to='/home/topic'><Icon type="left" />{this.state.status == 0 ? '添加新专题' : '编辑专题'}</Link></p>
                <div className="m-rt-content">
                    <div className='m-lt'>
                        <div className="su-m-dt-icon img" style={{ display: this.state.iconDefault === 'a' ? 'block' : 'none' }}>
                            <img src={this.state.iconDtUrl} alt="默认样式图标" />
                        </div>
                        <div className="m-icon-upload img" style={{ display: this.state.iconDefault === 'b' ? 'block' : 'none', marginLeft: "20px" }}>
                            <Spin spinning={this.state.imgUploading} tip="图片上传中...">
                                <Upload
                                    action="//jsonplaceholder.typicode.com/posts/"
                                    listType="picture-card"
                                    fileList={customFileList}
                                    onPreview={this.handleIconPreview}
                                    onChange={this.handleIconChange}
                                    onRemove={()=>{this.setState({ iconUrl: '' })}}
                                >
                                    {customFileList.length >= 1 ? null : <div className="upLoad-center">
                                        <Icon type="plus" />
                                    </div>}
                                </Upload>
                            </Spin>
                            <Modal visible={previewVisible2} footer={null} onCancel={this.handleIconCancel}>
                                <img alt="example" style={{ width: '100%' }} src={previewImage2} />
                            </Modal>
                        </div>
                    </div>
                    <div className='m-rt'>
                        <Form>
                            <Row className="row ant-form-item">
                                <Col span={4} className="ant-form-item-required" style={{ "color": "rgba(0,0,0,.85)", "paddingLeft": "6px", "lineHeight": "28px" }}>平台选择:</Col>
                                <Col span={18}>
                                    <CheckboxGroup
                                        options={this.state.platformList}
                                        value={this.state.platformCode}
                                        onChange={(v) => {
                                            this.setState({
                                                platformCode: v
                                            })
                                        }}
                                    />
                                </Col>
                            </Row>
                            <Row>
                                <Col>

                                    <FormItem
                                        id="control-input"
                                        label="专题标题"
                                        {...formItemLayout}
                                    >
                                        {getFieldDecorator('subjectTitle', {
                                            initialValue: this.state.data.subjectTitle,
                                            rules: [{ required: true, message: '名称不能为空' }],
                                        })(
                                            <Input id="control-input" placeholder="请输入专题名称"
                                            />
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>

                            <FormItem
                                label="专题图标"
                                {...formItemLayout} >
                                <RadioGroup value={this.state.iconDefault} onChange={this.selectIcon} >
                                    <Radio value="a">默认样式</Radio>
                                    <Radio value="b">本地上传</Radio>
                                </RadioGroup>
                            </FormItem>

                            {this.state.iconDefault==='a' && <Select value={this.state.imageUpSearchId} style={{ width: 120, marginLeft: 80, marginBottom: 24 }} onChange={this.handleSelect2Change}>
                                {
                                    this.state.subject_bg_img_up.map((item, index) => {
                                        return <Option value={item.searchId} key={index}>{item.searchName}</Option>
                                    })
                                }
                            </Select>}

                            <FormItem
                                id="control-input"
                                label="链接目标"
                                {...formItemLayout}
                            >
                                {this.state.targetTypeSelect}
                                {this.state.targetPageSelect}
                                {getFieldDecorator('h5TargetPage', {
                                    initialValue: this.state.h5TargetPage,
                                    rules: [{ required: true, message: '名称不能为空' }],
                                })(
                                    <Input style={this.state.h5Flag} className="f-mt-24" />
                                )}
                            </FormItem>
                            <Row>
                                <Col offset={4}>
                                    {
                                        this.state.targetType == 'COURSE_DETAIL'
                                            ?
                                            <Select
                                                showSearch
                                                style={{ width: 200 }}
                                                placeholder="搜索图书包"
                                                optionFilterProp="children"
                                                onChange={(v) => { this.setOneKV("bookPageThirdCode", v); }}
                                                onSearch={(e) => { this.fetchGoodGroup(e) }}
                                                onFocus={() => { this.fetchGoodGroup("") }}
                                                defaultValue={this.state.defauleName}
                                            >
                                                {
                                                    this.state.searchGroupList.map(item => {
                                                        return <Option value={item.courseCode} key={item.courseCode}>{item.courseName}</Option>
                                                    })
                                                }
                                            </Select>
                                            : null
                                    }
                                </Col>

                            </Row>
                            <FormItem {...formItemLayout} style={this.state.bookDetailFlag}>
                                {getFieldDecorator('bookDetailName', {
                                    initialValue: this.state.searchTxt
                                })(
                                    <Input style={{ width: 200, marginLeft: 85 }} />
                                )}
                                <Button onClick={this.bookDetailSearch}><Icon type="search" /></Button>
                            </FormItem>
                            <FormItem wrapperCol={{ span: 12, offset: 4 }} style={{ marginTop: 24 }}>
                                <Button type="primary" onClick={this.handleSubmit}>确定</Button>
                            </FormItem>

                        </Form>
                    </div>
                </div>
                <div className='su-pop'>
                    <Modal
                        key={this.state.key}
                        visible={visible}
                        title="图书选择"
                        onOk={this.handleOk}
                        onCancel={this.handleCancel}
                        footer=
                        {[
                            <Button key="back" size="large" onClick={this.handleCancel}>取消</Button>,
                            <Button key="submit" type="primary" size="large" loading={loading3} onClick={this.handleOk}>确定</Button>
                        ]}
                    >
                        <Table columns={columns} dataSource={this.state.lists} bordered pagination={pagination} onChange={this.onPagnition} className="t-nm-tab" rowSelection={rowSelection} />
                    </Modal>
                </div>
            </div>
        )
    }
}

myForm = Form.create()(myForm)

export default myForm