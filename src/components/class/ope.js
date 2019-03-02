import React from 'react';
import { Icon, Button, Row, Col, Select, DatePicker, Input, Popconfirm, message, Modal, Radio, Checkbox, Carousel, Spin, Upload, Progress } from 'antd';
import { Link } from 'react-router';
import ClassSet from './classSetSimple.js';
// const { MonthPicker, RangePicker } = DatePicker;
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;
import './ope.css';
import getUrl from "../util.js";
import commonData from '../commonData.js';
import Editor from "../editor/editor.js";
import GetHtml from './classHtml.js';
export default class PriceSet extends React.Component {
    constructor() {
        super()
        this.state = {
            attachUrl: '',//这是背景图
            previewVisible: false,
            previewImage: '',
            fileList: [
                //{
                //     uid: -1,
                //     name: 'xxx.png',
                //     status: 'done',
                //     url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
                // }
            ],

            coverImageUrl: '',//这是封面图
            previewVisible2: false,
            previewImage2: '',
            fileList2: [],
            previewImage3: '',
            previewVisible3: false,
            fileList3: [],

            videoPrecentShow:false,
            videoPrecentName:'',
            videoPrecent:0,
            videoStates:'active',
            videoSrc:'',
            
            targetPage: '',// 图文介绍 服务器返回的链接

            //图片上传
            dailyContent: '',//富文本里的内容(组件里面的)
            graphicIntroduction: '',
            graphicIntroductionAddress: '',
            show: false, //控制点击图文介绍弹窗
            courseName: '',
            courseDescription: '',
            curriculumRestriction: 'LOCK_YES',//课程限定选择内容(单选框)
            classData: [
                // {
                //     title: 'aaa',
                //     content: 'guideReading1',
                //     address: '',
                //     bookList: ["动态阅读1-4动物宝宝秀", "动态阅读2-1来，抱抱", "动态阅读6-1心心相印"],
                //     codeList: ["B201801190006", "B201801190007", "B201801190010"],
                //     quizNum: 1
                // }
            ],
            key: 0,                  //获取默认数据后变成1
            spinning: true,
            labelListData: [],       //标签下拉数据
            courseLabel: null
        }
        this.upVideo.bind(this)
        this.delCourseVideo.bind(this)
    }
    // 获取子组件classData
    getClassData(v) {
        this.setState({
            classData: v
        })
    }
    setOneKV(k, v) {
        this.setState({
            [k]: v
        })
    }
    //用来拿富文本里面的内容
    getdata(k, v) {
        this.setState({
            [k]: v //这里设置了一个dailyContent
        })
    }

    componentDidMount() {
        this.getDownListData();
        // TODO:此处拉数据,改key
        if (this.props.params.ope != 'add') this.fetchDefaultData(this.props.params.ope);
    }
    async getDownListData() {
        var data = await fetch(getUrl.url, {
            mode: "cors",
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: "method=ella.operation.boxSearchList" + "&content=" + JSON.stringify({ "groupId": "COURSE_LABEL_LIST" }) + commonData.dataString
        }).then(res => res.json());
        this.setState({
            labelListData: data.data
        })
    }
    async fetchDefaultData(courseCode) {
        let bookList = await fetch(getUrl.url, {
            mode: "cors",
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: "method=ella.operation.getBookListByIdOrName" + "&content=" + JSON.stringify({
                text: '',
                pageSize: 10000,
                type: "SEARCH_ALL"
            }) + commonData.dataString
        }).then(res => res.json());
        let allBookList = bookList.data.bookList;
        let data = await fetch(getUrl.url, {
            mode: "cors",
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: "method=ella.operation.getBookCourseInfo" + "&content=" + JSON.stringify({
                courseCode: courseCode
            }) + commonData.dataString
        }).then(res => res.json());
        let fileList3 = []
        let videoSrc = ''

        data.data.coursePreviewResourceList.map((item, index) => {
            if (item.resourceType === 'PREVIEW_IMG') {
                fileList3.push({
                    uid: index-1,
                    name: index + '.png',
                    status: 'done',
                    url: item.ossUrl,
                    videoImageUrl: item.ossUrl
                })
            } else if (item.resourceType === 'PREVIEW_VIDEO') {
                videoSrc = item.ossUrl
            }
        })
        this.setState({
            attachUrl: data.data.bgImageUrl,
            fileList: [
                {
                    uid: -1,
                    name: 'xxx.png',
                    status: 'done',
                    url: data.data.bgImageUrl,
                }
            ],
            coverImageUrl: data.data.coverImageUrl,
            fileList2: [
                {
                    uid: -1,
                    name: 'xxx.png',
                    status: 'done',
                    url: data.data.coverImageUrl
                }
            ],
            fileList3: fileList3,
            videoSrc: videoSrc,
            targetPage: data.data.targetPage,
            courseName: data.data.courseName,
            courseLabel: data.data.courseLabel,
            courseDescription: data.data.courseDesc,
            curriculumRestriction: data.data.courseLimit,
            dailyContent: encodeURIComponent(data.data.graphicIntroduction),
            graphicIntroduction: encodeURIComponent(data.data.graphicIntroduction),
            graphicIntroductionAddress: encodeURIComponent(data.data.targetPage),
            classData: data.data.bookCourseChapters.map(item => {
                return {
                    title: item.chapterName,
                    chapterIntroRelationList: item.chapterIntroRelationList,
                    address: encodeURIComponent(item.targetPage),
                    bookList: allBookList.find(_item => item.bookCode == _item.bookCode).bookName,
                    codeList: item.bookCode,
                    quizNum: item.quizNum,
                    chapterCode: item.chapterCode
                }
            }),
            key: 1,
            spinning: false
        })
        if (this.state.targetPage === '') {
            this.getGraphicIntroductionAddress()
        }
    }
    // 文本图片上传
    handleCancel = (k) => this.setState({ [k]: false })
    handlePreview = (file, previewImage, previewVisible) => {
        this.setState({
            [previewImage]: file.url || file.thumbUrl,
            [previewVisible]: true,
        });
    }
    // 上传视频
    upVideo = async (e) => {
        if (this.state.videoPrecent === 0 || this.state.videoPrecent === 100) {
            this.setState({
                videoPrecentShow:true,
                videoPrecentName:e.target.files[0].name
            })
            var formData = new FormData()
            formData.append('file', e.target.files[0])
            formData.append('purposeId', 'COURSE_PREVIEW_RESOURCE')
            formData.append('courseCode', '')
    
            //获取视频上传百分比
            let a = 0;
            let theTimeJi = window.setInterval( ()=>{
                a++;
                if (a >= 98) {
                    window.clearInterval(theTimeJi);
                }
                this.setState({
                    videoPrecent: a
                });
            }, 500);

            var data = await fetch(getUrl.upLoadVideoUrl, {
                method: 'POST',
                mode: 'cors',
                body: formData
            }).then(function (res) {
                return res.json();
            });
            if (data.status == 1) {
                window.clearInterval(theTimeJi);
                this.setState({
                    videoSrc: data.data,
                    videoStates: 'success',
                    videoPrecent: 100
                });
                let obj = document.getElementById('courseVideo');
                obj.value = ''
            } else {
                window.clearInterval(theTimeJi);
                this.setState({
                    videoSrc: '',
                    videoStates: 'exception',
                    videoPrecent: 100
                });
                let obj = document.getElementById('courseVideo') ;
                obj.value = ''
                message.error(`${this.state.videoPrecentName} 上传失败,${data.message}`);
            }   
        } else {
            message.error('请等待上传结束~')
        }
    }
    // 删除视频
    delCourseVideo () {
        if (this.state.videoSrc) {
            this.setState({
                videoPrecentShow: false,
                videoPrecentName: '',
                videoPrecent: 0,
                videoStates: 'active',
                videoSrc: ''
            })
        } else {
            message.error('您还未上传视频！')
        }
    }
    handleChange = ({ fileList }, k, img) => {
        console.log('fileList',fileList)
        this.setState({ [k]: fileList })
        if (this.state[k][this.state[k].length-1].status === 'done') {
            this.imageFetch(this.state[k][fileList.length-1], img);
        }
    }
    imageFetch = async (file, img) => {
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
            if (img === 'videoImageUrl') {
                this.state.fileList3[this.state.fileList3.length-1].videoImageUrl = data.data
                this.setState({
                    fileList3: this.state.fileList3
                })
            } else {
                this.setState({ [img]: data.data })
            }
        }
    }
    //获取地址
    async getGraphicIntroductionAddress() {
        // var html = "<html lang='en'><head><meta charset='UTF-8'><meta name='viewport' content='width=device-width, initial-scale=1.0'><meta http-equiv='X-UA-Compatible' content='ie=edge'><title>Document</title></head><body>" + this.state.dailyContent + "</body></html>"
        const { attachUrl, courseName, courseDescription, dailyContent } = this.state;
        var html = GetHtml.getIndex(attachUrl, courseName, courseDescription, dailyContent);
        html = encodeURIComponent(html)
        var address = await fetch(getUrl.upFileUrl, {
            method: 'POST',
            headers: {
                "Content-type": "application/x-www-form-urlencoded"
            },
            mode: 'cors',
            body: "content=" + JSON.stringify({ fileContent: html }) + commonData.dataString
        }).then(function (res) {
            return res.json();
        });

        this.setState({
            show: false,
            targetPage:  address.data,
            graphicIntroduction: dailyContent,
            graphicIntroductionAddress: ip == '118.31.171.207:9000' ? encodeURIComponent(address.data + '?ifmUrl=' + address.data + '&shareUrl=http://ellabook.cn/bookService1/shareClass/index.html&shareType=SS201806201845299375&shareTitle=' + this.state.courseName) : encodeURIComponent(address.data + '?ifmUrl=' + address.data + '&shareUrl=http://ellabook.cn/bookService/shareClass/index.html&shareType=SS201806201845299375&shareTitle=' + this.state.courseName)
        })
    }
    // 是否已添加图文
    isClassAdd(item){
        let isAllAdd = true
        for (let i = 0; i < item.length; i++) {
            for (let j = 0; j < item[i].chapterIntroRelationList.length; j++) {
                if (!(item[i].chapterIntroRelationList[j].introImageUrl || item[i].chapterIntroRelationList[j].introDesc)) {
                    isAllAdd = false
                    break
                }
            }
        }
        return isAllAdd
    }
    //提交数据
    async submitData() {
        const {
            attachUrl,
            coverImageUrl,
            courseName,
            courseDescription,
            graphicIntroduction,
            graphicIntroductionAddress,
            curriculumRestriction,      //TODO:对应的值是什么?还有一个下拉没好,判断数据还没好
            classData,
            courseLabel,
            targetPage,
            fileList3
        } = this.state;
        if (!attachUrl) { message.error('课程背景图未上传'); return; }
        if (!coverImageUrl) { message.error('课程封面未上传'); return; }
        if (!courseName) { message.error('课程名称未填写'); return; }
        if (!courseDescription) { message.error('简单描述未填写'); return; }
        if (!graphicIntroduction) { message.error('图文介绍未填写'); return; }

        if (!classData.every(item => item.title != '')) { message.error('单元标题没全写'); return; }
        if (!this.isClassAdd(classData)) {message.error('单元内容没全写'); return;}
        if (classData.length == 0) { message.error('课程结构未添加'); return; }
        // 修改
        let submitData = {
            coverImageUrl,
            courseName,
            courseLabel,
            courseDesc: courseDescription,
            bgImageUrl: attachUrl,
            graphicIntroduction: encodeURIComponent(graphicIntroduction),
            graphicIntroductionAddress: graphicIntroductionAddress,
            targetPage: targetPage,
            courseLimit: curriculumRestriction,
            bookCourseChapters: classData.map((item, index) => {
                return {
                    chapterName: item.title,
                    bookCode: item.codeList,
                    targetPage: item.address,
                    quizNum: item.quizNum,
                    idx: index + 1,
                    chapterCode: item.chapterCode || null,
                    chapterIntroRelationList: item.chapterIntroRelationList.map((item,index)=>{
                        return {
                            introImageUrl: item.introImageUrl,
                            introDesc: item.introDesc,
                            idx: index+1
                        }
                    })
                }
            }),
            coursePreviewResourceList:fileList3.map((item, index) => {
                return {
                    ossUrl: item.videoImageUrl,
                    resource: 'normal',
                    resourceType: 'PREVIEW_IMG'
                }
            })
        };
        if (this.state.videoSrc) {
            submitData.coursePreviewResourceList.push({
                ossUrl: this.state.videoSrc,
                resource: 'normal',
                resourceType: 'PREVIEW_VIDEO'
            })
        }
        // 如果是编辑的话就多一个courseCode
        if (this.props.params.ope != 'add') submitData.courseCode = this.props.params.ope;
        var data = await fetch(getUrl.url, {
            mode: "cors",
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: "method=ella.operation.saveBookCourse" + "&content=" + JSON.stringify(submitData) + commonData.dataString
        }).then(res => res.json());
        if (data.status == 1) {
            message.success('操作成功');
            if(this.props.params.ope == 'add'){
                 window.location.href = window.location.href.split('/course')[0] + '/course/back/' + this.props.params.type;
            }
           
        } else {
            message.success('操作失败');
        }
    }
    render() {
        const { previewVisible, previewImage, fileList, previewVisible2, previewImage2, fileList2, previewVisible3, previewImage3, fileList3 } = this.state;
        const uploadButton = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        return <Spin tip="数据加载中..." spinning={this.props.params.ope == "add" ? false : this.state.spinning}>
            <div className="course">
                <h2 className='title' >
                    <Link style={{ color: '#666' }} to={'/course/back/' + this.props.params.type || 1}><Icon type="left" />{`课程内容${this.props.params.ope == 'updata' ? '编辑' : '添加'}`}</Link>
                </h2>
                <div className='box'>
                    <Row className='row'>
                        <Col md={{ span: 24,offset: 1 }} lg={{ span: 8,offset: 1}}>
                            <Row className='row img1'>
                                <Col className="small_subTitle" md={{ span: 5 }} lg={{ span: 8}} xl={{span: 6}}>课程封面:</Col>
                                <Col md={{ span: 19 }} lg={{ span: 16}} xl={{span: 18}}>
                                    <Upload
                                        accept=".jpg,.png,.webp,.bmp,.tiff,.gif,.jpeg"
                                        action="//jsonplaceholder.typicode.com/posts/"
                                        listType="picture-card"
                                        fileList={fileList2}
                                        onPreview={(file) => { this.handlePreview(file, "previewImage2", "previewVisible2") }}
                                        onChange={({ fileList }) => { this.handleChange({ fileList }, "fileList2", "coverImageUrl") }}
                                        onRemove={() => { this.setState({ coverImageUrl: "" }) }}
                                    >
                                        {fileList2.length >= 1 ? null : uploadButton}
                                    </Upload>
                                    <Modal visible={previewVisible2} footer={null} onCancel={() => { this.handleCancel("previewVisible2") }}>
                                        <img alt="example" style={{ width: '100%' }} src={previewImage2} />
                                    </Modal>
                                    <Row>
                                        <Col span={24}>
                                            <span className='say'>建议尺寸200*200</span>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Col>
                        <Col md={{ span: 24 }} lg={{ span: 15}}>
                            <Row className='row img2'>
                                <Col className="small_subTitle" offset={1} span={5}>课程背景图:</Col>
                                <Col span={18}>
                                    <div className="clearfix">
                                        <Upload
                                            accept=".jpg,.png,.webp,.bmp,.tiff,.gif,.jpeg"
                                            action="//jsonplaceholder.typicode.com/posts/"
                                            listType="picture-card"
                                            fileList={fileList}
                                            onPreview={(file) => { this.handlePreview(file, "previewImage", "previewVisible") }}
                                            onChange={({ fileList }) => { this.handleChange({ fileList }, "fileList", "attachUrl") }}
                                            onRemove={() => { this.setState({ attachUrl: "" }) }}
                                        >
                                            {fileList.length >= 1 ? null : uploadButton}
                                        </Upload>
                                        <Modal visible={previewVisible} footer={null} onCancel={() => { this.handleCancel("previewVisible") }}>
                                            <img alt="example" style={{ width: '100%' }} src={previewImage} />
                                        </Modal>
                                    </div>
                                    <Row>
                                        <Col span={24}>
                                            <span className='say'>建议尺寸750*458</span>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row className='row'>
                        <Col className="small_subTitle" md={{ span: 5,offset: 1 }} lg={{ span: 3,offset: 1}} xl={{span: 2,offset: 1}}>课程视频:</Col>
                        <Col md={{ span: 18 }} lg={{ span: 20}} xl={{span: 21}}>
                            <Row>
                                <Col sm={{ span: 8 }} md={{ span: 6 }} lg={{ span: 4}} xl={{span: 2}} className="courseVideo">
                                    <Button icon="upload" >{this.state.videoSrc === '' ? '添加视频' : '已添加'}</Button>
                                    <input type="file" name="video" id="courseVideo" onChange={(e) => { this.upVideo(e) }} accept="video/*,.ogg" />
                                </Col>
                                <Col sm={{ span: 3,offset: 1 }} md={{ span: 3,offset: 1 }} lg={{ span: 2,offset: 1}} xl={{span: 1}}>
                                    <span title="点击删除"  className="i-action-ico i-delete" onClick={()=>{this.delCourseVideo()}}></span>
                                </Col>
                            </Row>
                            {this.state.videoPrecentShow && (<row>
                                <Col md={{ span: 16 }} lg={{ span: 8}} xl={{span: 8}}>
                                    <p style={{marginTop:'10px',marginBottom:0}}>{this.state.videoPrecentName}</p>
                                    <Progress percent={this.state.videoPrecent} status={this.state.videoStates} size="small" />
                                </Col>
                            </row>)}
                        </Col>
                    </Row>
                    <Row className='row img3'>
                        <Col className="small_subTitle" md={{ span: 5,offset: 1 }} lg={{ span: 3,offset: 1}} xl={{span: 2,offset: 1}} >课程截图:</Col>
                        <Col className="small_subTitle" md={{ span: 16}} lg={{ span: 16}} xl={{span: 16}} >
                            <Upload
                                accept=".jpg,.png,.webp,.bmp,.tiff,.gif,.jpeg"
                                action="//jsonplaceholder.typicode.com/posts/"
                                listType="picture-card"
                                fileList={fileList3}
                                onPreview={(file) => { this.handlePreview(file, "previewImage3", "previewVisible3") }}
                                onChange={({ fileList }) => { this.handleChange({ fileList }, "fileList3", "videoImageUrl") }}
                            >
                                {fileList3.length >= 8 ? null : uploadButton}
                            </Upload>
                            <Modal visible={previewVisible3} footer={null} onCancel={() => { this.handleCancel("previewVisible3") }}>
                                <img alt="example" style={{ width: '100%' }} src={previewImage3} />
                            </Modal>
                        </Col>
                    </Row>
                    <Row className='row'>
                        <Col className="small_subTitle" md={{ span: 5,offset: 1 }} lg={{ span: 3,offset: 1}} xl={{span: 2,offset: 1}}>标签:</Col>
                        <Col span={8}>
                            <Select
                                value={this.state.courseLabel || null}
                                style={{ width: 150 }}
                                onChange={(v) => { this.setOneKV('courseLabel', v) }}>
                                <Option value={null}>无</Option>
                                {
                                    this.state.labelListData.map(item => {
                                        return <Option value={item.searchCode}>{item.searchName}</Option>
                                    })
                                }
                            </Select>
                        </Col>
                    </Row>
                    <Row className='row'>
                        <Col className="small_subTitle" md={{ span: 5,offset: 1 }} lg={{ span: 3,offset: 1}} xl={{span: 2,offset: 1}}>课程名称:</Col>
                        <Col span={8}>
                            <Input
                                style={{ width: '100%' }}
                                value={this.state.courseName}
                                onChange={(e) => {
                                    this.setOneKV('courseName', e.target.value)
                                }}
                            />
                        </Col>
                    </Row>
                    <Row className='row'>
                        <Col className="small_subTitle" md={{ span: 5,offset: 1 }} lg={{ span: 3,offset: 1}} xl={{span: 2,offset: 1}}>简单描述:</Col>
                        <Col span={8}>
                            <Input
                                style={{ width: '100%' }}
                                value={this.state.courseDescription}
                                onChange={(e) => { this.setOneKV('courseDescription', e.target.value) }}
                            />
                        </Col>
                    </Row>
                    <Row className='row'>
                        <Col className="small_subTitle" md={{ span: 5,offset: 1 }} lg={{ span: 3,offset: 1}} xl={{span: 2,offset: 1}}>图文介绍:</Col>
                        <Col>
                            <Button
                                style={{ width: 120 }}
                                onClick={() => {
                                    this.setState({
                                        show: true,
                                    })
                                }}
                            >添加图文介绍</Button>
                            <Modal
                                destroyOnClose
                                title="图文介绍编辑"
                                visible={this.state.show}
                                onOk={() => {
                                    this.getGraphicIntroductionAddress()
                                }}
                                onCancel={() => { this.setOneKV('show', false) }}
                            >
                                <Editor
                                    style={{ width: "600px" }}
                                    titleImg={null}
                                    getContent={this.getdata.bind(this)}
                                    dailyContent={this.state.graphicIntroduction}>
                                </Editor>
                            </Modal>
                        </Col>
                    </Row>

                    <Row className='row'>
                        <Col className="small_subTitle" md={{ span: 5,offset: 1 }} lg={{ span: 3,offset: 1}} xl={{span: 2,offset: 1}}>课程限定:</Col>
                        <Col span={8} style={{ paddingTop: '5px' }}>
                            <RadioGroup onChange={(e) => { this.setOneKV('curriculumRestriction', e.target.value) }} value={this.state.curriculumRestriction}>
                                <Radio value={'LOCK_YES'}>顺序上锁</Radio>
                                <Radio value={'LOCK_NO'}>不上锁</Radio>
                            </RadioGroup>
                        </Col>
                    </Row>

                    <Row className='row'>
                        <Col className="small_subTitle" md={{ span: 5,offset: 1 }} lg={{ span: 3,offset: 1}} xl={{span: 2,offset: 1}}>课程结构:</Col>
                        <Col md={{ span: 14}} lg={{ span: 20}} xl={{span: 21}}>
                            <ClassSet getClassData={this.getClassData.bind(this)} key={this.state.key} classData={this.state.classData}></ClassSet>
                        </Col>
                    </Row>
                    <Row className='row'>
                        <Col offset={11} span={2} style={{ textAlign: 'center' }}>
                            <Button
                                style={{ width: 120 }}
                                type='primary'
                                onClick={() => {
                                    this.submitData()
                                }}
                            >确定</Button>
                        </Col>
                    </Row>
                </div>
            </div>
        </Spin>
    }
}