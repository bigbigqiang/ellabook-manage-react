import React from 'react'
import { Button, message, Icon, Upload, Modal, Form, Input, Select,Checkbox } from 'antd';
import { Link, hashHistory } from 'react-router';
import getUrl from '../../util';
import { commonData } from '../../commonData.js'
import './AddListenBookAd.css'
const CheckboxGroup = Checkbox.Group;
const FormItem = Form.Item;
const Option = Select.Option
class AddListenBookAds extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            previewVisible: false,
            imageUrl: '',
            customFileList: [
                //{
                //     uid: -1,
                //     name: 'xxx.png',
                //     status: 'done',
                //     url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
                // }
            ],
            imageTitle: '',
            imageDesc: '',

            targetSelector: [],
            targetType: 'SYSTEM_INTERFACE',
            searchId: '',
            targetPage: '',
            searchPageName: '',
            h5_url: '',
            platformList:[],
            platformCode:""
        };
        this.handleIconPreview = this.handleIconPreview.bind(this);
        this.recommendChange = this.recommendChange.bind(this);
        this.targetTypeChange = this.targetTypeChange.bind(this);
    }
    async imageFetch(file) {
        var formData = new FormData();
        formData.append('pictureStream', file);
        var data = await fetch(getUrl.upLoadUrl, {
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

    getTargetSelector(value, targetTypeChange) {
        getUrl.API({ groupId: value }, 'ella.operation.boxSearchList').then(res => res.json()).then((data) => {
            if (data.status == '1') {
                if (data.data.length) {
                    if (hashHistory.getCurrentLocation().query.adCode) {
                        this.setState({
                            targetSelector: data.data,
                            searchId: targetTypeChange ? data.data[0].searchId : this.state.searchId
                        })
                    } else {
                        this.setState({
                            targetSelector: data.data,
                            searchId: data.data[0].searchId
                        })
                    }
                } else {
                    this.setState({
                        targetSelector: [],
                        searchId: ''
                    })
                }
            } else {
                message.error(data.message)
            }
        }).catch(e => {
            console.log(e.message)
        })
    }

    getLdadDetail(adCode) {
        getUrl.API({ adCode: adCode }, 'ella.operation.otsGetLdadDetail').then(res => res.json()).then((data) => {
            if (data.status == '1') {
                console.log(data.data)
                this.setState({
                    imageUrl: data.data.imageUrl,
                    imageDesc: data.data.imageDesc,
                    imageTitle: data.data.imageTitle,
                    customFileList: [
                        {
                            uid: -1,
                            name: 'xxx.png',
                            status: 'done',
                            url: data.data.imageUrl
                        }
                    ],
                    targetType: data.data.targetType,
                    searchId: data.data.searchId,
                    targetPage: data.data.targetPage,
                    h5_url: data.data.targetType === 'H5' ? data.data.targetPage : '',
                    platformCode:data.data.platformCode.split(",")
                }, () => { this.getTargetSelector(data.data.targetType) })
            } else {
                message.error(data.message)
            }
        }).catch(e => {
            console.log(e.message)
        })
    }

    saveLdad(params, addOrModify) {
        getUrl.API(params, addOrModify === 'add' ? 'ella.operation.saveLdad' : 'ella.operation.modifyLbAd').then(res => res.json()).then((data) => {
            if (data.status == '1') {
                message.success('操作成功！')
                hashHistory.push(this.props.params.target=='index'?'/listenBookHomePage':'/listenBookAdList');
            } else {
                message.error(data.message)
            }
        }).catch(e => {
            console.log(e.message)
        })
    }

    handleChange({ fileList }) {
        this.setState({ customFileList: fileList });
        if (fileList.length && (fileList[0].status == 'done' || fileList[0].status == 'error')) {
            this.imageFetch(fileList[0].originFileObj)
        }
    }

    handleIconPreview = (file) => {
        this.setState({
            previewVisible: true
        });
    }

    recommendChange(value) {
        this.setState({
            searchId: value
        })
    }

    targetTypeChange(value) {
        this.setState({ targetType: value })
        if (value !== 'H5') {
            this.getTargetSelector(value, 'targetTypeChange')
        }
    }

    componentDidMount() {
        hashHistory.getCurrentLocation().query.adCode || this.getTargetSelector('SYSTEM_INTERFACE');;
        hashHistory.getCurrentLocation().query.adCode && this.getLdadDetail(hashHistory.getCurrentLocation().query.adCode);
    
        this.fetchPlatformList("SYSTEM_PLATFORM");

    }
 //平台下拉框数据
fetchPlatformList(groupId) {
    getUrl.API({groupId},"ella.operation.boxSearchList")
    .then(response=>response.json())
    .then(response=>{
        if(response.status==1){
            var cur=response.data.filter(item => item.searchCode != 'GUSHIJI');
            this.setState({
                platformList:cur.map((item, index) => {
                    return {
                        ["label"]: item.searchName,
                        ["value"]: item.searchCode
                    }
                })
            
              
            })
        }else{
            console.log(response.message)
        }
      
    }) 
}
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                if (!this.state.imageUrl) {
                    message.error('图片未上传');
                    return;
                }
                if (values.imageTitle.trim().length > 10) {
                    message.error('图片标题在10个中文字符以内');
                    return;
                }
                if (values.imageDesc.trim().length > 20) {
                    message.error('图片描述在20个中文字符以内');
                    return;
                }
                if (this.state.targetType !== 'H5' && !this.state.searchId) {
                    message.error('链接目标未填写完整');
                    return;
                }
                if (this.state.targetType === 'H5' && !this.state.h5_url.trim()) {
                    message.error('未填写H5链接地址');
                    return;
                }
                if (this.state.targetType === 'H5' && this.state.h5_url.trim() && !/(http|https)\:\/\/(ellabook|ellabook2)/.test(this.state.h5_url)) {
                    message.error('h5链接地址格式不正确！');
                    return;
                }

                let params = {
                    imageTitle: values.imageTitle.trim(),
                    imageDesc: values.imageDesc.trim(),
                    imageUrl: this.state.imageUrl,
                    targetType: this.state.targetType,
                    searchId: this.state.targetType !== 'H5' ? this.state.searchId : '',
                    targetPage: this.state.targetType !== 'H5' ? encodeURIComponent(this.state.targetSelector.find((item) => item.searchId === this.state.searchId).searchCode) : encodeURIComponent(this.state.h5_url),
                    searchPageName: this.state.targetType !== 'H5' ? this.state.targetSelector.find((item) => item.searchId === this.state.searchId).searchName : 'H5页面',
                    pcUid: commonData.uid,
                    platformCode:values.platformCode.join()
                }
                hashHistory.getCurrentLocation().query.adCode && (params.adCode = hashHistory.getCurrentLocation().query.adCode);
                hashHistory.getCurrentLocation().query.adCode ? this.saveLdad(params, 'modify') : this.saveLdad(params, 'add');
            }
        });
    }

    render() {
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 18 }
        };
        const { getFieldDecorator } = this.props.form;
        return (
            <div id="AddListenBookAds">
                <p className="m-title"><Link to={this.props.params.target=="index"?"/listenBookHomePage":'/listenBookAdList'}><Icon type="left" />添加新的横幅广告</Link></p>
                <div className='left'>
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
                    <div style={{ color: '#faad14' }}>尺寸：674*130</div>
                    <Modal visible={this.state.previewVisible} footer={null} onCancel={() => { this.setState({ previewVisible: false }) }}>
                        <img alt="example" style={{ width: '100%' }} src={this.state.imageUrl} />
                    </Modal>
                </div>
                <div className='right'>
                    <Form onSubmit={this.handleSubmit}>
                        <FormItem
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span: 12 }}
                            label="图片标题"
                        >
                            {getFieldDecorator('imageTitle', {
                                initialValue: this.state.imageTitle,
                                rules: [{ required: true, message: '请填写图片标题' }],
                            })(
                                <Input />
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="图片描述"
                        >
                            {getFieldDecorator('imageDesc', {
                                initialValue: this.state.imageDesc,
                                rules: [{ required: true, message: '请填写图片描述' }],
                            })(
                                <Input />
                            )}
                        </FormItem>
                        <FormItem
                            label="平台选择"
                            {...formItemLayout}
                        >
                            {getFieldDecorator('platformCode', {
                                initialValue: this.state.platformCode,
                                rules: [{ required: true, message: '平台必选！' }],
                            })
                            (
                                <CheckboxGroup
                                    options={this.state.platformList}
                                />
                            )
                            }
                        </FormItem>
                        <FormItem
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span: 12 }}
                            label="连接目标"
                        >
                            <Select value={this.state.targetType} style={{ width: 120 }} onChange={this.targetTypeChange}>
                                <Option value='SYSTEM_INTERFACE'>系统界面</Option>
                                <Option value='H5'>H5页面</Option>
                                <Option value='LISTEN_LIST'>听书推荐</Option>
                            </Select>
                            {this.state.targetType !== 'H5' && <Select value={this.state.searchId} style={{ width: 150, marginLeft: 10 }} onChange={(value) => { this.setState({ searchId: value }) }}>
                                {(this.state.targetType && this.state.targetSelector.length) && this.state.targetSelector.map((item, i) =>
                                    <Option value={item.searchId} key={i}>{item.searchName}</Option>
                                )}
                            </Select>}
                        </FormItem>
                        {this.state.targetType === 'H5' && <FormItem
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span: 18 }}
                            label="H5链接"
                        >
                            <Input value={this.state.h5_url} onChange={(e) => { this.setState({ h5_url: e.target.value }) }} />
                        </FormItem>}
                        <FormItem wrapperCol={{ span: 6, offset: 4 }} style={{ marginTop: 24 }}>
                            <Button type="primary" htmlType="submit">确定</Button>
                        </FormItem>
                    </Form>
                </div>
            </div >
        )
    }
}

const WrappedAddListenBookAds = Form.create()(AddListenBookAds);

export default WrappedAddListenBookAds;
