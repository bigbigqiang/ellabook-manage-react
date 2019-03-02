import React from 'react';
import { Icon, Button, Row, Col, Select, Input, Modal, Upload, Table, Popconfirm, message } from 'antd';
import { Link, hashHistory } from 'react-router'
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
const { TextArea } = Input;
const Option = Select.Option;
import './addMedal.css';
import getUrl from "../util.js";
import commonData from '../commonData.js';
export default class Medal extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            medalIconUrl: '',
            materialVisible: false,
            previewMaterial: '',
            material: [],
            courseList: [],
            goodsList: [],
            addGoodsVisible: false,
            selectCourseCode: '',
            medalName: '',
            medalDesc: '',
            status: this.props.params.status
        }
        this.saveCourseMedal = this.saveCourseMedal.bind(this)
        this.handleGoodsChange = this.handleGoodsChange.bind(this)
        this.showAddGoodsModel = this.showAddGoodsModel.bind(this)
        this.addGoods = this.addGoods.bind(this)
        this.clearGoodsList = this.clearGoodsList.bind(this)
        this.getCourseMedalInfo = this.getCourseMedalInfo.bind(this)
    }
    setOneKV(k, v) {
        this.setState({
            [k]: v
        })
    }
    componentWillMount () {
        this.getBookCourseList()
        if (this.state.status != 0) {
            this.getCourseMedalInfo()
        }
    }
    componentDidMount () {
    }
    // 获取勋章详情
    getCourseMedalInfo () {
        fetch(getUrl.url, {
			method: "POST",
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: "method=ella.operation.getCourseMedalInfo" + "&content=" + JSON.stringify({
				medalCode: this.state.status,
			}) + commonData.dataString
		}).then(res => res.json()).then((data) => {
            if (data.status == 1) {
                this.setState({
                    material: [
                        {
                            uid: -1,
                            name: 'xxx.png',
                            status: 'done',
                            url: data.data.medalIconUrl,
                        }
                    ],
                    medalName: data.data.medalName,
                    medalDesc: data.data.medalDesc,
                    medalIconUrl: data.data.medalIconUrl,
                    goodsList: data.data.courseList
                })
            } else {
                message.error(data.message)
            }
        })
    }
    //获取课程列表
	getBookCourseList() {
		fetch(getUrl.url, {
			method: "POST",
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: "method=ella.operation.getBookCourseList" + "&content=" + JSON.stringify({
				pageVo: {
					page: 0,
					pageSize: 100000
				},
			}) + commonData.dataString
		}).then(res => res.json()).then((data) => {
            if (data.status == 1) {
                this.setState({
                    courseList: data.data.list,
                })
            }
        })
    }
    showAddGoodsModel () {
        this.setState({addGoodsVisible: true,selectCourseCode:''})
    }
    // 添加商品
    addGoods () {
        if (this.state.selectCourseCode === '') {
            message.error('请选择商品！')
        } else {
            for (let i = 0; i < this.state.goodsList.length; i++) {
                if (this.state.goodsList[i].courseCode === this.state.selectCourseCode) {
                    message.error('已经添加过该商品！')
                    return
                }
            }
            for (let i = 0; i < this.state.courseList.length; i++) {
                if (this.state.courseList[i].courseCode === this.state.selectCourseCode) {
                    this.state.goodsList.push({
                        courseCode: this.state.courseList[i].courseCode,
                        courseName: this.state.courseList[i].courseName
                    })
                    break
                }
            }
            this.setState({
                addGoodsVisible: false,
                goodsList: this.state.goodsList
            })
        }
    }
    // 选择商品
    handleGoodsChange (value) {
        this.setState({
            selectCourseCode: value
        })
    }
    //添加勋章
	saveCourseMedal() {
        let {medalName, medalDesc, medalIconUrl, goodsList} = this.state
        if (medalIconUrl.trim() === '') {message.error('勋章素材未上传！');return}
        if (medalName.trim() === '') {message.error('勋章名称不能为空！');return}
        if (medalName.length > 15) {message.error('勋章名称不能超过15个中英文字符！');return}
        if (medalDesc.trim() === '') {message.error('勋章简介不能为空！');return}
        if (!goodsList.length) {message.error('勋章关联商品未添加！');return}
        let fetchData = {
            medalName: medalName,
            medalDesc: medalDesc,
            medalIconUrl: medalIconUrl,
            courseList: goodsList.map((item) => {
                return item.courseCode
            })
        }
        if (this.state.status != 0) {
            fetchData.medalCode = this.state.status
        }
		fetch(getUrl.url, {
			method: "POST",
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: "method=ella.operation.saveCourseMedal" + "&content=" + JSON.stringify(fetchData) + commonData.dataString
		}).then(res => res.json()).then((data) => {
				if (data.status == 1) {
                    hashHistory.push('/medal');
				} else {
                    message.error(data.message)
                }
			})
	}
    handleCancel (k) {
        this.setState({ [k]: false })
    }
    handlePreview (file, previewImage, previewVisible) {
        this.setState({
            [previewImage]: file.url || file.thumbUrl,
            [previewVisible]: true,
        });
    }
    // 删除关联商品
    deleteGoods (record, index) {
        this.state.goodsList.splice(index, 1)
        this.setState({
            goodsList: this.state.goodsList
        })
    }
    // 清空商品列表
    clearGoodsList () {
        this.setState({
            goodsList: []
        })
    }
    handleImgChange ({ fileList }) {
        this.setState({ material: fileList })
        if (this.state.material[0].status === 'done') {
            this.imageFetch(this.state.material[0]);
        }
    }
    async imageFetch (file) {
        var formData = new FormData();
        formData.append('pictureStream', file.originFileObj);

        var data = await fetch(getUrl.upLoadUrl, {
            method: 'POST',
            mode: 'cors',
            body: formData
        })
            .then(function (res) {
                return res.json();
            });
        if (data.status == 1) {
            this.setState({ medalIconUrl: data.data });
        }
    }
    render() {
        const uploadButton = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        const columns = [
            {
                title: '序号',
                dataIndex: 'idx',
                render: (text, record, index) => {
                    return index + 1
                }
            },
            {
                title: '商品ID',
                dataIndex: 'courseCode',
                key: 'courseCode'
            },
            {
                title: '商品名称',
                dataIndex: 'courseName',
                key: 'courseName'
            },
            {
                title: '操作',
                width: '20%',
                dataIndex: 'operate',
                render: (text, record, index) => {
                    return (
                        <div style={{ textAlign: 'center' }} className='m-icon-type'>
                            <Popconfirm title="确定删除吗?" onConfirm={() => this.deleteGoods(record, index)}>
                                <span className='i-action-ico i-delete'></span>
                            </Popconfirm>
                        </div>
                    )
                }
            }
        ]
        return (<div className="course">
                <p className="m-title"><Link to='/medal'><Icon type="left" />{this.state.status == 0 ? '添加新勋章' : '编辑勋章'}</Link></p>
                <div className='box'>
                    <Row className='row'>
                        <Col md={{ span: 24,offset: 1 }} lg={{ span: 8,offset: 1}}>
                            <Row className='row img1'>
                                <Col className="small_subTitle" md={{ span: 5 }} lg={{ span: 8}} xl={{span: 6}}>勋章素材:</Col>
                                <Col md={{ span: 19 }} lg={{ span: 16}} xl={{span: 18}}>
                                    <Upload
                                        accept=".jpg,.png,.webp,.bmp,.tiff,.gif,.jpeg"
                                        action="//jsonplaceholder.typicode.com/posts/"
                                        listType="picture-card"
                                        fileList={this.state.material}
                                        onPreview={(file) => { this.handlePreview(file, "previewMaterial", "materialVisible") }}
                                        onChange={({ fileList }) => { this.handleImgChange({ fileList }) }}
                                        onRemove={() => { this.setState({ medalIconUrl: "" }) }}
                                    >
                                        {this.state.material.length >= 1 ? null : uploadButton}
                                    </Upload>
                                    <Modal visible={this.state.materialVisible} footer={null} onCancel={() => { this.handleCancel("materialVisible") }}>
                                        <img alt="example" style={{ width: '100%' }} src={this.state.previewMaterial} />
                                    </Modal>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row className='row'>
                        <Col className="small_subTitle" md={{ span: 5,offset: 1 }} lg={{ span: 3,offset: 1}} xl={{span: 2,offset: 1}}>勋章名称:</Col>
                        <Col span={8}>
                            <Input
                                style={{ width: '100%' }}
                                value={this.state.medalName}
                                onChange={(e) => {
                                    this.setOneKV('medalName', e.target.value)
                                }}
                            />
                        </Col>
                    </Row>
                    <Row className='row'>
                        <Col className="small_subTitle" md={{ span: 5,offset: 1 }} lg={{ span: 3,offset: 1}} xl={{span: 2,offset: 1}}>勋章简介:</Col>
                        <Col span={8}>
                            <TextArea
                                value={this.state.medalDesc}
                                onChange={(e)=>{
                                    this.setOneKV('medalDesc', e.target.value)
                                }}
                                rows={3}
                            />
                        </Col>
                    </Row>
                    <Row className='row'>
                        <Col className="small_subTitle" md={{ span: 5,offset: 1 }} lg={{ span: 3,offset: 1}} xl={{span: 2,offset: 1}}>勋章类型:</Col>
                        <Col md={{ span: 8}} lg={{ span: 6}} xl={{span: 4}}>
                            <Select
                                value='0'
                                style={{ width: 150 }}>
                                <Option value='0'>阅读行为</Option>
                            </Select>
                        </Col>
                        <Col md={{ span: 8}} lg={{ span: 6}} xl={{span: 4}}>
                            <Select
                                value='0'
                                style={{ width: 150 }}>
                                <Option value='0'>课程</Option>
                            </Select>
                        </Col>
                    </Row>
                    <div style={{border:'1px solid #ddd',marginBottom:20}}>
                        <Row style={{paddingTop:5,lineHeight:'32px',paddingBottom:5}}>
                            <Col md={{span: 4,offset: 1}} lg={{ span: 3,offset: 1}} xl={{span: 2,offset: 1}} style={{fontWeight: 'bold'}}>关联商品</Col>
                            <Col md={{span: 5,offset: 6}} lg={{ span: 3,offset: 11}} xl={{span: 2,offset: 14}}><Button type="primary" onClick={this.showAddGoodsModel}><Icon type="plus" />添加商品</Button></Col>
                            <Col md={{span: 5,offset: 1}} lg={{ span: 3,offset: 1}} xl={{span: 2,offset: 1}}><Button style={{ width: 120 }} type='danger' onClick={this.clearGoodsList}>清空列表</Button></Col>
                            <Modal
                                title="添加关联商品"
                                visible={this.state.addGoodsVisible}
                                onOk={this.addGoods}
                                onCancel={() => { this.handleCancel("addGoodsVisible") }}
                                >
                                <Row>
                                    <Col span={6}>商品：</Col>
                                    <Col span={14}>
                                    <Select value={this.state.selectCourseCode} style={{ width: '100%' }} onChange={this.handleGoodsChange}>
                                        {this.state.courseList.length > 0 && this.state.courseList.map( (item) => {
                                            return <Option key={item.courseCode}>{item.courseName}</Option>
                                        })}
                                    </Select>
                                    </Col>
                                </Row>
                            </Modal>
                        </Row>
                        <Table dataSource={this.state.goodsList} columns={columns} pagination={false}/>
                    </div>
                    <Row className='row'>
                        <Col offset={11} span={2} style={{ textAlign: 'center' }}>
                            <Button style={{ width: 120 }} type='primary' onClick={this.saveCourseMedal}>确定</Button>
                        </Col>
                    </Row>
                </div>
            </div>)
    }
}
