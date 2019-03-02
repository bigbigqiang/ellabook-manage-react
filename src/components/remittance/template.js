/**
 * @description 关于如何生成静态页面
 * 之前是用字符串拼接
 * 现在改用iframe引入一个html模板，直接通过 frameElement.contentDocument.documentElement.innerHTML的方式取出所有代码
 * TODO: 重置预览图片，一定是如下:PreViewImageUrl: null ,不要设置空字符串，false什么的
 *
 * 专题模板 template.html
 * 专题模板css 64服务器 C:\tomcat\webapps\ellabook\ellabook-family\h5\topicTemplate.css
 */

import React, { Component } from 'react';
import { connect } from 'dva';
import { Divider, Form, Button, Row, Col, Input, Upload, Switch, Icon, Select, message, Checkbox } from 'antd';
import { Link } from 'dva/router';
import ReactUeditor from '../../components/Editor';
import styles from './SubjectEdit.less';
import { server } from '../../utils/utils';
import { getParameter } from '../../utils/urlHandle';
import { xhr_upload } from '../../utils/xhr_upload';
import lodash from 'lodash';
import templatePage from '../../assets/template.html';

const FormItem = Form.Item;
const Option = Select.Option;
const ButtonGroup = Button.Group;

@connect(state => ({
    subjects: state.subjects,
}))
@Form.create()
export default class SubjectEdit extends Component {

    state = {
        progress: -1,
        PreViewImageUrl: null,
        trueType: true,
        editorResult: '',
        showPreview: 'none',
        replaceTag: '#TitleHolder #MetaHolder #CoverHolder #ContentHolder #BookListHolder',
        bookSearchValue: ''
    }

    componentWillMount() {

        this.props.dispatch({
            type: 'subjects/fetchBookList',
            payload: {
                pageIndex: '1',
                pageSize: this.props.subjects.bookCount || '3000'
            }
        })

        if (getParameter().topicCode) {
            // 如果topicCode存在，则这是一次编辑，首先拉去该专题内容
            this.props.dispatch({
                type: 'subjects/getSubject',
                payload: getParameter().topicCode
            }).then(res => {
                console.log('获取的专题信息:', res)
                this.setState({
                    PreViewImageUrl: res.topicImg,
                    editorResult: res.topicContent,
                    type: res.type
                })
            })
        } else {
            // 如果topicCode不存在，这是一次新增，清除数据模型
            this.props.dispatch({
                type: 'subjects/clearEdit',
            })
        }
    }

    // TODO: 三个上传API都要修改
    uploadImage = e => {
        return new Promise(function (resolve, reject) {
            resolve('https://avatars2.githubusercontent.com/u/3232724?v=8&s=120')
        })
    }

    // TODO: 三个上传API都要修改
    uploadVideo = e => {
        let _this = this
        return new Promise(function (resolve, reject) {
            let i = 0
            let instance = setInterval(() => {
                if (i !== 100) {
                    _this.setState({ progress: ++i })
                }
            }, 50)
            setTimeout(() => {
                resolve('https://cloud-minapp-1131.cloud.ifanrusercontent.com/1eBb1SeNlayvGEKT.mp4')
                _this.setState({ progress: -1 })
                clearInterval(instance)
            }, 5100)
        })
    }

    // TODO: 三个上传API都要修改
    uploadAudio = e => {
        return new Promise(function (resolve, reject) {
            // resolve('https://cloud-minapp-1131.cloud.ifanrusercontent.com/1eEUtZNsjiOiHbWW.mp3')
            reject(new Error('error'))
        })
    }

    updateEditorContent = content => {
        this.state.editorResult = content
    }

    handleSelectedChange(value) {
        console.log(`selected ${value}`);
    }

    /**
     * @description 生成，图书推荐列表内容
     * @param {array} bookCode 选择的 bookCode数组
     * TODO: 可复用
     */
    generateStaticBookList(bookCode) {
        let selected = [];
        let booksContainer = '';

        bookCode.map(item => {
            let key = _.findIndex(this.props.subjects.bookList, ['bookCode', item]);
            let book = this.props.subjects.bookList[key];
            if (book)
                selected.push(book);
        })
        console.log("推荐图书列表:", selected);
        selected.map(item => {
            if (item === undefined) {
                message.error('推荐图书不存在');
            }
            let bt = item.tag;
            console.log('tags:', item.tag)
            let tags2 = bt.split(',');
            let showtags = tags2.slice(0, 4);
            // item.tag = tags2.slice(0, 4);
            let bookCover = `
                <div class='img'>
                    <img src="${encodeURI(item.coverUrl)}" alt='${item.bookName}'/>
                </div>
            `
            let bookTitle = `<div class='title'>${item.bookName}</div>`;
            let bookTag = '';
            showtags.map(item => {
                bookTag += '<span>' + item + '</span>';

            });

            let bookTags = `<div class='tags'>${bookTag}</div>`
            let bookAuthor = `<div class='title1'>作者：${item.author}</div>`
            let bookGrade = `<div class='grade'>建议年级：${item.gradeName}</div>`
            let bookRead = `
                <div class='readamount'>
                    <span class="amount">${item.readNum}</span>人读过
                </div>
            `;
            // teacher.detail.book
            // parent.book.summary
            let book = `
                <a class='book book_${item.id}' href="ellafamily://#LinkHolder?book_code=${item.bookCode}&method=ella.book.getBookByCode" onclick="routeToTargetPage()">
                    ${bookCover}
                    <div class="meta">${bookTitle}${bookTags}${bookAuthor}${bookGrade}${bookRead}</div>
                </a>
            `;
            //TODO: method=ella.book.getBookByCode 方法需要更换

            booksContainer += book;
        })

        return booksContainer;
    }

    /**
     * @description 预览、发布、草稿之前，收集form的values，并增改一些字段
     * @param {object} values
     * @param {string} publishFlag 发布状态标识 （PUBLISH_YES:已发布,OFF_LINE:已下线,DRAFT:草稿） null 则为预览
     * 作为预览和发布通用的方法，该处没有做encodeURIComponent处理，预览不需要，发布会在service层做处理
     */
    compileSendValues = (values, publishFlag) => {
        // TODO: 关于图片的处理有点麻烦，首先从state里面取，如果取不到，则到editContent里面找，如果有更好的直接 设置和取 Upload值得方法，可以改写此处

        // 0. 如果有topicCode，则传递，即编辑，否则即新增
        if (getParameter().topicCode) {
            values.topicCode = getParameter().topicCode;
        }

        // 1. 从this.state.PreViewImageUrl取图片地址，因为通过表单拿图片有点麻烦
        values.topicImg = this.state.PreViewImageUrl;

        // 2. bookCode转字符串之前，生成静态页面需要的 图书推荐列表内容
        var bookHTML = this.generateStaticBookList(values.bookCode);

        // 3. bookCode数组转字符串
        values.bookCode = values.bookCode.join();

        // 4. 状态标识，方法传参
        values.publishFlag = publishFlag;

        // 5. 取inframe“幽灵页面”
        document.getElementById('myFrame').contentDocument.documentElement.children[1].children[0].innerHTML = this.state.replaceTag;

        let ghostHTML = document.getElementById('myFrame').contentDocument.documentElement.innerHTML;

        // 6. 编码编辑器内容
        values.topicContent = encodeURIComponent(this.state.editorResult.replace(/\"/g, "'").replace(/\%/g, "%25"));

        // 7. 如果选择了插入正文，则替换CoverHolder，插入封面
        if (values.insertImg === 'YES') {
            ghostHTML = ghostHTML.replace('#CoverHolder', `<div id='Cover'><img src='${values.topicImg}' alt='${values.topicTitle}'/></div>`);
        } else {
            ghostHTML = ghostHTML.replace('#CoverHolder', '');
        }

        // 8. 替换ContentHolder，插入正文
        // 9. 替换BookHolder, 插入图书列表
        let now = new Date();
        ghostHTML = ghostHTML
            .replace('#TitleHolder', `<div id="TitleHolder">${values.topicTitle}</div>`)
            .replace('#MetaHolder', `
                        <div id="MetaHolder">
                            <span class="update_time">${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}</span>
                            <span class="author">${values.authorName}</span>
                        </div>
                    `)
            .replace('#ContentHolder', `<div id='ContentHolder'>${this.state.editorResult}</div>`)
            .replace('#BookListHolder', `<div id='BookListHolder'>${bookHTML}</div>`)
            .replace(/\"/g, "'");

        values.fullContent = ghostHTML;
        return values;
    }

    /**
     * @description 预览
     */
    previewHandle = (publishFlag) => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let sendValues = this.compileSendValues(values, publishFlag)
                document.getElementById('myFrame').contentDocument.documentElement.children[1].children[0].innerHTML = sendValues.fullContent;
                this.setState({
                    showPreview: 'block'
                })
            } else {
                console.log(err);
            }
        });
    }

    /**
     * @param {string} publishFlag 发布状态标识 （PUBLISH_YES:已发布,OFF_LINE:已下线,DRAFT:草稿） null 则为预览
     */
    publishHandle = (publishFlag) => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let sendValues = this.compileSendValues(values, publishFlag)
                // b. 发送请求
                if (sendValues.type1) {
                    sendValues.type = 'PARENT'
                }
                if (sendValues.type2) {
                    sendValues.type = 'TEACHER'
                }
                if (sendValues.type1 && sendValues.type2) {
                    sendValues.type = 'ALL'
                }
                console.log('请求数据:', sendValues)

                this.props.dispatch({
                    type: 'subjects/setSubject',
                    payload: sendValues
                })
            } else {
                console.log(err);
            }
        });
    }

    render() {

        let { progress, PreViewImageUrl, type } = this.state;

        const { getFieldDecorator, getFieldValue, validateFields, resetFields } = this.props.form;
        const { subjects: { editContent, bookList } } = this.props;

        // 将bookCode字符串解析成code数组
        if (_.has(editContent, 'bookCode') && typeof editContent.bookCode == "string") {
            editContent.bookCode = _.get(editContent, 'bookCode').split(",")
        }

        // 封面图上传组件配置
        const upload_props = {
            name: "topicImg",
            listType: "picture-card",
            showUploadList: false,
            disabled: PreViewImageUrl != null, // 如果已有图片，点击Upload不会跳出窗口，而是等待其它按钮的操作，如：删除、预览
            customRequest: (args) => {
                const ThisComponent = this;
                ThisComponent.setState({
                    loading: true
                })

                /**
                 * @description 如果图片格式校验没问题，则开始上传
                 */
                ThisComponent.state.typeTrue != false ?
                    xhr_upload(server.imgUploadUrl, {
                        'file': args.file
                    }).then(res => {
                        console.log(res.data)
                        ThisComponent.setState({
                            loading: false,
                            PreViewImageUrl: res.data
                        })
                    }).catch(err => {
                        console.error(err)
                    }) : setTimeout(() => {
                        // 如果图片格式不对，或者图片尺寸不对，1s后可以重新选择图片
                        ThisComponent.setState({
                            loading: false,
                            typeTrue: true
                        })
                    }, 1000)
            },
            beforeUpload: (file) => {
                const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'; // TODO: 不确定
                if (!isJPG) {
                    message.error('请上传JPG或者PNG图片!');
                    this.setState({
                        typeTrue: false,
                        PreViewImageUrl: null
                    })
                }
                const isLt2M = file.size / 1024 / 1024 < 2;
                if (!isLt2M) {
                    message.error('图片必须小于2MB!');
                    this.setState({
                        typeTrue: false,
                        PreViewImageUrl: null
                    })
                }
            },
        }

        // 封面图等待上传时的显示
        const uploadButton = (
            <div>
                <Icon type={'plus'} />
                <div className="ant-upload-text">686*240</div>
            </div>
        );

        // 封面图已经上传的缩略图
        const coverPreview = (
            <div className={styles.coverPreview} style={{
                backgroundImage: `url(${PreViewImageUrl})`
            }}>
                <div className={styles.coverPreviewMask}>
                    {/* <Icon className={styles.coverPreviewDelete} type={'eye'} onClick={(e) => {
                        // this.setState({
                        //     PreViewImageUrl: null
                        // })
                    }}></Icon> */}
                    <Icon className={styles.coverPreviewDelete} type={'delete'} onClick={(e) => {
                        this.setState({
                            PreViewImageUrl: null
                        })
                    }}></Icon>
                </div>
            </div>
        )

        // 推荐图书列表，测试数据 TODO: 测试数据，需要修改
        let childrenOptions = [];
        bookList.map(item => {
            childrenOptions.push(<Option key={item.bookCode} title={item.bookName} >{item.bookName}</Option>);
            // childrenOptions.push(<Option key={item.bookCode+"$"+item.bookName} title={item.bookName} >{item.bookName}</Option>);
        })

        return (
            <div className={['clf']} style={{ minWidth: '858px' }}>
                <Row>
                    <Col>
                        <Link to="subjects">
                            <Button><Icon type="left" />返回专题列表</Button>
                        </Link>
                    </Col>
                </Row>
                <div className={styles.editor_container}>
                    <Row>
                        <ReactUeditor
                            ueditorPath='./ueditor'
                            config={{ zIndex: 1001 }}
                            value={_.get(editContent, 'topicContent', '请输入...')}
                            // plugins={['uploadImage', 'insertCode', 'uploadVideo', 'uploadAudio']}
                            // TODO: 暂时关掉音视频上传
                            uploadImage={this.uploadImage}
                            uploadVideo={this.uploadVideo}
                            uploadAudio={this.uploadAudio}
                            onChange={this.updateEditorContent}
                            progress={progress}
                            className={styles.ueditor}
                        />
                    </Row>
                </div>
                <div className={styles.option_container}>
                    <Form layout='inline' hideRequiredMark={true}>
                        <Row>
                            <FormItem label="客户端">
                                {getFieldDecorator('type1', {
                                    valuePropName: 'checked',
                                    initialValue: type == 'ALL' || type == 'PARENT' ? true : false
                                })(
                                    <Checkbox>家长端</Checkbox>
                                )}
                                {getFieldDecorator('type2', {
                                    valuePropName: 'checked',
                                    initialValue: type == 'ALL' || type == 'TEACHER' ? true : false
                                })(
                                    <Checkbox>教师端</Checkbox>
                                )}
                            </FormItem>
                        </Row>
                        <Row>
                            <FormItem label="标&nbsp;&nbsp;&nbsp;&nbsp;题">
                                {getFieldDecorator('topicTitle', {
                                    initialValue: _.get(editContent, 'topicTitle'),
                                    rules: [{ required: true, message: '请输入专题标题，字符限制30', type: 'string', max: 30 }],
                                })(
                                    <Input style={{ width: '300px' }}></Input>
                                )}
                            </FormItem>
                        </Row>
                        <Row>
                            <FormItem label="副标题">
                                {getFieldDecorator('topicSubTitle', {
                                    initialValue: _.get(editContent, 'topicSubTitle'),
                                    rules: [{ required: true, message: '请输入专题副标题，字符限制30', type: 'string', max: 30 }],
                                })(
                                    <Input style={{ width: '300px' }}></Input>
                                )}
                            </FormItem>
                        </Row>
                        <Row>
                            <FormItem label="作&nbsp;&nbsp;&nbsp;&nbsp;者">
                                {getFieldDecorator('authorName', {
                                    initialValue: _.get(editContent, 'authorName'),
                                    rules: [{ required: true, message: '请输入作者，字符限制30', type: 'string', max: 30 }],
                                })(
                                    <Input style={{ width: '300px' }}></Input>
                                )}
                            </FormItem>
                        </Row>
                        <Row>
                            <FormItem label="封&nbsp;&nbsp;&nbsp;&nbsp;面">
                                {getFieldDecorator('topicImg', {
                                    initialValue: _.get(editContent, 'topicImg'),
                                    rules: [{ required: true, message: '请选择专题封面' }],
                                })(
                                    <Upload {...upload_props} style={{ width: '300px', backgroundColor: '#eee' }} className={styles.img_upload} >
                                        {PreViewImageUrl != null ? coverPreview : uploadButton}
                                    </Upload>
                                )}
                            </FormItem>
                        </Row>
                        <Row>
                            <FormItem label="插入正文">
                                {getFieldDecorator('insertImg', {
                                    initialValue: _.get(editContent, 'insertImg') || 'YES'
                                    // rules: [{ required: true, message: '请选择专题封面' }],
                                })(
                                    <Select>
                                        <Option value="YES">是</Option>
                                        <Option value="NO">否</Option>
                                    </Select>
                                )}
                            </FormItem>
                        </Row>
                        <Row>
                            <FormItem label="推荐图书">
                                {getFieldDecorator('bookCode', {
                                    initialValue: _.get(editContent, 'bookCode'),
                                    rules: [{ required: true, message: '请选择推荐图书' }],
                                })(
                                    <Select
                                        // defaultValue={_.get(editContent,'bookCode')}
                                        className={'bookSearch'}
                                        mode="multiple"
                                        style={{ width: '300px' }}
                                        placeholder="选择推荐图书"
                                        optionFilterProp="title"
                                        onSearch={(value) => {
                                            this.setState({
                                                bookSearchValue: value
                                            })
                                        }}
                                    >
                                        {childrenOptions}
                                    </Select>
                                )}
                            </FormItem>
                        </Row>
                        <Divider />
                        <Row style={{
                            width: '383px',
                            textAlign: 'center',
                            marginTop: '10px'
                        }}>
                            <ButtonGroup>
                                <Button type="primary" htmlType="submit" onClick={() => {
                                    this.publishHandle('PUBLISH_YES');
                                }}>
                                    <Icon type="check" />保存并发布
                                </Button>

                                <Button type="default" htmlType="submit" onClick={() => {
                                    this.publishHandle('DRAFT');
                                }}>
                                    <Icon type="inbox" />保存为草稿
                                </Button>

                                <Button type="default" onClick={() => {
                                    this.previewHandle(null);
                                }}>
                                    <Icon type="eye-o" />预&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;览
                                </Button>
                            </ButtonGroup>
                        </Row>
                        <Row style={{
                            width: '383px',
                            textAlign: 'left',
                            marginTop: '10px',
                            color: '#aaa'
                        }}>
                            注意：
                            <br />
                            1.如果推荐图书不显示书名，表示该书已经下架，请从推荐图书中删除
                        </Row>
                    </Form>
                </div>
                <div className={styles.previewMask} style={{
                    display: this.state.showPreview
                }} onClick={() => {
                    // 关闭预览，清空幽灵页面内容，否则下次预览的时候，取出来的不是模板
                    this.setState({
                        showPreview: 'none'
                    })

                }}>
                    <div className={styles.previewPhone}>
                        <div className={styles.previewClip}>
                            <iframe className={styles.previewContent} id="myFrame" src={templatePage + '?test=sdfsdf'} frameBorder={0} scrolling={'auto'}></iframe>
                        </div>
                        <div style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            color: '#fff',
                            textAlign: 'center'
                        }}>点击空白区域退出预览</div>
                    </div>
                </div>

            </div>
        )
    }
}
