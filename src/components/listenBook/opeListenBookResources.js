import React from 'react';
import { Input, DatePicker, Button, Icon, Radio, Tooltip, Select, TimePicker, message, Spin } from 'antd';
const Option = Select.Option;
const { RangePicker } = DatePicker;
const Search = Input.Search;
const RadioGroup = Radio.Group;
import { Link } from 'react-router';
import './opeListenBookResources.css';
import getUrl from "../util.js";
import EllaUploader from './EllaUploader/EllaUploader.js';
import EllaImageUploader from './EllaUploader/EllaUploader2.js';
import { CommonAddBook } from "../commonAddBook.js"
import moment from 'moment';
import { dataString } from '../commonData.js'
class myForm2 extends React.Component {
    constructor() {
        super()
        this.state = {
            loading: false,
            audioTypeList: [],

            //提交数据
            audioPic: null,//音频封面
            audioName: '',
            audioIntroduction: '',//简介
            bookCode: '',//关联图书code
            audioTimeLength: '',//上传音频时长 (服务端获取)
            audioTimeLengthLoaction: '',//上传音频时长(本地获取) 
            ossUrl: '',//上传音频地址
            bookPages: '',
            audioClasses: [],//音频分类code数组
            audioSize: 0,//音频文件大小
            isShelves: false,//上下架状态
            copyrightStatus: 'SHELVES_ON',//版权状态
            isToLibrary: 0,//是否推送到绘本馆0:未推送,1:已推送
            //提交数据
            visible: false,
            bookName: '',//选择图书名
            isPaging: false,//是否分页
            // timeArr: ['00:00', '01:00', '01:30', '02:00', '02:30'],//音频分页时间
            timeArr: [],
            pushHome: null,//是否推送1
        }

    }
    componentDidMount() {
        if (this.getQueryString('audioCode')) {
            this.fetchDefaultData();
        }

        this.fetchAudioType();
        function CompareDate(d1, d2) {
            return ((new Date(d1.replace(/-/g, "\/"))) >= (new Date(d2.replace(/-/g, "\/"))));
        }
    }
    //获取编辑数据
    async fetchDefaultData() {
        this.setState({
            loading: true
        })
        var data = await fetch(getUrl.url, {
            mode: "cors",
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: "method=ella.operation.findByCode" + "&content=" + JSON.stringify({
                audioCode: this.getQueryString('audioCode')
            }) + dataString
        }).then(res => res.json())
        console.log(data);
        const defaultData = data.data;
        this.setState({
            copyrightStatus: defaultData.copyrightStatus,
            isShelves: defaultData.isShelves,
            loading: false,
            audioName: defaultData.audioName,
            audioIntroduction: defaultData.audioIntroduction,
            ossUrl: defaultData.ossUrl,
            audioTimeLength: defaultData.audioTimeLength,
            bookName: defaultData.bookName,
            bookCode: defaultData.bookCode,
            bookPages: defaultData.bookPages,
            audioClasses: defaultData.picClass.map(item => item.classCode),
            timeArr: defaultData.audioConfigs.map(item => item.beginTimeStr),
            isPaging: defaultData.audioConfigs.map(item => item.beginTimeStr).length > 0 ? true : false,
            pushHome: defaultData.pushHome,
            audioSize: defaultData.audiosize,
            audioPic: defaultData.audioPic,
            isToLibrary: defaultData.pushHome == 'true' ? 1 : 0
        })
    }
    //获取下拉列表
    async fetchAudioType() {
        var data = await fetch(getUrl.url, {
            mode: "cors",
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: "method=ella.operation.picClassBox"
        }).then(res => res.json())
        console.log(data);
        this.setState({
            audioTypeList: data.data
        })
    }
    //提交数据
    async submitData() {


        const submitData = {
            //编辑有,新增没有
            audioCode: this.getQueryString('type') == 'add' ? null : this.getQueryString('audioCode'),
            audioName: this.state.audioName,
            audioIntroduction: this.state.audioIntroduction,
            bookCode: this.state.bookCode,
            audioTimeLength: parseInt(this.state.audioTimeLengthLoaction) || null,
            ossUrl: this.state.ossUrl,
            audioClasses: this.state.audioClasses,
            audioConfigList: this.state.isPaging ? this.state.timeArr.map((item, index) => ({ 'beginTimeStr': item, 'bookPage': index + 1 + '' })) : [],
            pushHome: this.state.pushHome,
            audioSize: this.state.audioSize,
            audioPic: this.state.audioPic,
            isShelves: this.state.isShelves,
        }
        console.log(submitData);
        // return;
        //判断数据
        if (!submitData.audioPic) { message.error('音频封面未上传'); return }
        if (!submitData.audioName) { message.error('音频名称未填写'); return }
        // if (!submitData.audioIntroduction) { message.error('音频简介未填写'); return }
        if (!submitData.ossUrl) { message.error('音频未上传'); return }
        if (!submitData.bookCode) { message.error('关联图书未选择'); return }
        // if (submitData.audioClasses.length == 0) { message.error('音频分类未选择'); return }
        if (this.state.isPaging && submitData.audioConfigList.length == 0) { message.error('音频分页未设置'); return }
        if (!this.isInTurn(this.state.timeArr.map(item => this.getS(item)))) { message.error('音频分页设置不正确'); return }


        console.log(submitData);
        const method = this.getQueryString('type') == 'add' ? 'ella.operation.bookAudioSave' : 'ella.operation.bookAudioUpdate';
        var data = await fetch(getUrl.url, {
            mode: "cors",
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: "method=" + method + "&content=" + JSON.stringify({
                ...submitData
            }) + dataString
        }).then(res => res.json());
        console.log(data);
        if (data.status == 1) {
            message.success('操作成功');
            window.history.back();
        }
    }
    setOneKV(k, v) { this.setState({ [k]: v }) };
    showModal = () => {
        this.setState({
            visible: true,
        });

        this.refs.addBooks.getInitList();
    }
    //检测动画书是否绑定
    async checkBookBand(bookCode) {
        var data = await fetch(getUrl.url, {
            mode: "cors",
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: "method=ella.operation.checkBindBook" + "&content=" + JSON.stringify({ bookCode })
        }).then(res => res.json())
        console.log(data);
        return data.data;
    }
    handleOk = (selectedRowKeys, selectedRows) => {
        //selectedRows:整个内容
        // let isBand = false;
        this.checkBookBand(selectedRows[0].bookCode).then(res => {
            console.log(res);
            if (res == 2) {
                message.warning('该动画书已经被绑定音频');
                this.setState({
                    visible: false,
                });
                return;
            }

            this.setState({
                isToLibrary: res,
                audioPic: selectedRows[0].bookResourceList[0].ossUrl || this.state.audioPic,
                copyrightStatus: selectedRows[0].copyrightStatus,
                visible: false,
                bookName: selectedRows[0].bookName,
                bookCode: selectedRows[0].bookCode,
                bookPages: selectedRows[0].bookPages,
                timeArr: selectedRows[0].bookPages != this.state.bookPages ? [] : this.state.timeArr,
                audioClasses: selectedRows[0].picBookClasses.map(item => item.classCode)
            })
        });
        // console.log(isBand);
    }
    modelCancle(msg) {
        this.setState({
            visible: msg,
        });
    }
    //转换:'01'=>1 '11'=>11
    getTime(M) {
        if (!M) return 60;
        const M10 = M.split('')[0];
        const M1 = M.split('')[1];
        return M10 * 10 + M1 * 1
    }
    //转换 01:11=>71 00:22=>22
    getS(time) {
        return this.getTime(time.split(':')[0]) * 60 + this.getTime(time.split(':')[1])
    }
    //71=>01:00 22=>00:22
    getTimeStr(n) {
        let M = parseInt(n / 60);
        if (M < 10) M = '0' + M;
        let S = n % 60;
        if (S < 10) S = '0' + S
        return M + ':' + S
    }
    //获取地址栏参数(未处理多个参数)
    getQueryString(name) {
        const keyArrString = window.location.href.split('?')[1].split('&');
        const result = (keyArrString.find(item => item.indexOf(name) != -1) || '=').split('=')[1];
        return result || false;
        // return window.location.href.split('=')[1]
    }
    //转换时间为 0′40″格式的时间 没有就返回---
    getAudioLenth(t) {
        if (!t) return '——';
        let newT = parseInt(t);
        const f = parseInt(newT / 60);
        const s = newT % 60;
        return f + '′' + s + '″';
    }
    //判断数组是否正序(无相同项目)
    isInTurn(arr) {
        for (var i = 1; i < arr.length; i++) {
            if (arr.slice(0, i).find(item => item >= arr[i])) return false;
        }
        return true;
    }
    render() {
        const that = this;
        let type = this.getQueryString('type');
        // console.log(this.state.audioTimeLengthLoaction)
        return (
            <Spin spinning={this.state.loading}>

                <div className='opeListenBookResources'>
                    <p className="m-title"><Link to={'/listenBookResourcesList'}><Icon type="left" theme="outlined" />{type == 'add' ? '新增' : '编辑'}听书资源</Link></p>
                    <div className='uploadCover'>
                        <EllaImageUploader
                            name={'pictureStream'}
                            api={getUrl.upLoadUrl}
                            // initialValue={'http://member.ellabook.cn/0dd1e0a2c69b45a3b3ac4c46595c5bf6'}
                            isDelete={this.state.bookCode ? false : true}
                            initialValue={this.state.audioPic}
                            width={176}
                            height={240}
                            onChange={(e, bear, file) => {
                                // console.log(e);
                                this.setState({
                                    audioPic: e
                                })
                            }}
                        />
                        <p>音频封面(176*240)</p>
                    </div>
                    <div className='titleWrap' style={{ marginTop: 40 }}>
                        <div className='title'><span style={{ color: '#f5222d' }}>*</span>音频名称:</div>
                        <Input
                            maxlength={15}
                            style={{ width: 300 }}
                            value={this.state.audioName}
                            onChange={(e) => {
                                // this.setOneKV('audioName', e.target.value)
                                this.setState({
                                    audioName: e.target.value.substr(0, 15)
                                })
                            }}
                            onBlur={(e) => {
                                if (e.target.value.length > 15) {
                                    message.error('输入长度超过15');
                                    this.setState({
                                        audioName: this.state.audioName.substr(0, 15),
                                    })

                                }
                            }} ></Input>
                    </div>
                    <div className='titleWrap'>
                        <div className='title'>简介:</div>
                        <Input.TextArea
                            rows={4}
                            style={{ width: 300 }}
                            value={this.state.audioIntroduction}
                            onChange={(e) => {
                                // this.setOneKV('audioIntroduction', e.target.value);
                                this.setState({
                                    audioIntroduction: e.target.value.substr(0, 100)
                                })
                            }}
                            onBlur={(e) => {
                                if (e.target.value.length > 100) {
                                    message.error('输入长度超过100');
                                    this.setState({
                                        audioIntroduction: this.state.audioIntroduction.substr(0, 100),
                                    })

                                }
                            }}></Input.TextArea>
                    </div>

                    <div className='titleWrap'>
                        <div className='title'><span style={{ color: '#f5222d' }}>*</span>添加音频:</div>
                        <EllaUploader
                            api={getUrl.upLoadUrl}
                            name={'pictureStream'}
                            setPaging={() => { this.setOneKV('isPaging', false) }}
                            width={120}
                            // initialValue={'http://member.ellabook.cn/437bedfcf87e466cbd56da2a6ebf81ed'}
                            initialValue={this.state.ossUrl}
                            onChange={(e, bear, file) => {
                                this.setState({
                                    ossUrl: e,
                                    audioSize: (file ? file.size : null) || this.state.audioSize
                                })
                            }} accept={'.mp3'} />
                    </div>

                    <div className='titleWrap'>
                        <div className='title'><span style={{ color: '#f5222d' }}>*</span>音频时长:</div>
                        <span style={{ lineHeight: '32px', paddingLeft: '12px' }}>
                            {!this.state.visible && <div style={{ display: 'none' }}>
                                {
                                    //这句代码会被警告⚠~~~~~~
                                    setTimeout(function () {
                                        // console.log(document.getElementById('aa') ? document.getElementById('aa').audioTimeLength : 'wu');
                                        that.setState({
                                            audioTimeLengthLoaction: document.getElementById('audio') ? document.getElementById('audio').duration : '',
                                        })
                                    }, 3000)

                                }
                            </div>}
                            {/* {this.state.audioTimeLength ? parseInt(this.state.audioTimeLength) + '秒' : '——'} */}
                            {/* {type == 'add' ? null : <span>{this.state.audioTimeLength}</span>} */}
                            {/* {type == 'add' ? <span>{this.getAudioLenth(this.state.audioTimeLengthLoaction)}</span> : null} */}
                            {
                                this.state.audioTimeLengthLoaction
                                    ?
                                    <span>{this.getAudioLenth(this.state.audioTimeLengthLoaction)}</span>
                                    :
                                    // <Icon type="loading" theme="outlined" />
                                    <span>——</span>
                            }
                        </span>
                    </div>
                    <div className='titleWrap'>
                        <div className='title'>关联图书:</div>
                        {this.state.bookName ? <div className='showBookNameBox'>
                            <span style={{ paddingLeft: '12px' }}>{this.state.bookName || '——'}</span>
                            {this.state.bookName && <Tooltip placement="top" title={'点击删除已选图书'}><Icon
                                className='bookNameDelet'
                                onClick={() => {
                                    this.setState({
                                        bookName: '',
                                        bookCode: '',
                                        isPaging: false,
                                        bookPages: '',
                                        audioClasses: [],
                                        audioPic: '',
                                    })
                                }}
                                type="close-circle"
                                theme="filled" /></Tooltip>}
                        </div> : null}
                        <Button style={{ verticalAlign: 'top', width: 110 }} onClick={() => { this.showModal() }}>{this.state.bookName ? '已添加' : <span><Icon type="plus" /> 添加图书</span>}</Button>
                        {this.state.bookCode ? <span style={{ paddingLeft: 10, color: this.state.isToLibrary == 0 ? 'red' : 'green' }}>
                            {this.state.isToLibrary == 0 ? '未推送至绘本馆' : '已推送至绘本馆'}
                        </span> : null}
                    </div>
                    <div className='titleWrap'>
                        <div className='title'>图书页数:</div>
                        <span style={{ paddingLeft: '12px', lineHeight: '32px' }}>{this.state.bookPages || '无'}</span>
                    </div>
                    <div className='titleWrap'>
                        <div className='title'>音频分类:</div>
                        <Select
                            disabled={this.state.bookCode}
                            value={this.state.audioClasses.map(item => {
                                try {
                                    var name = this.state.audioTypeList.find(_item => _item.classCode == item).className;
                                    return name;
                                } catch (err) {
                                    return ''
                                }
                            }
                            )}
                            mode="multiple"
                            style={{ width: 300 }}
                            onChange={(v) => {
                                this.setState({
                                    audioClasses: v.map(item => this.state.audioTypeList.find(_item => _item.className == item).classCode)
                                })
                            }}>
                            {
                                this.state.audioTypeList.map(item => <Option key={item.className}>{item.className}</Option>)
                            }
                        </Select>
                    </div>
                    <div className='titleWrap'>
                        <div className='title'>音频分页:</div>
                        <div className='radioWrap'>
                            <RadioGroup
                                disabled={(!this.state.audioTimeLengthLoaction || !this.state.bookCode)}
                                style={{ lineHeight: '33px' }}
                                name="radiogroup"
                                value={this.state.isPaging}
                                onChange={(e) => { this.setOneKV('isPaging', e.target.value) }}>
                                <Radio value={false}>不添加分页</Radio>
                                <Radio value={true}>添加分页</Radio>
                            </RadioGroup>
                            {/* <Button>133</Button> */}
                            {this.state.isPaging && <div style={{ marginLeft: 100 }}>
                                <EllaUploader
                                    api={getUrl.url.split('api')[0] + 'excel/bookAudio'}
                                    name={'file'}
                                    width={120}
                                    initialValue={''}
                                    onChange={(e) => {
                                        //处理配置文件
                                        console.log(e)
                                        //如果页数不对映报错
                                        if (e.length != this.state.bookPages) {
                                            message.error('配置文件配置错误(页数不对)!');
                                            return;
                                        }
                                        //如果时间错误报错(最大分页时间比音频时长长)
                                        if (e.find(item => this.getS(item[1]) > this.state.audioTimeLengthLoaction - 1)) {
                                            message.error('配置文件配置错误(分页时间设置错误)!');
                                            return;
                                        }
                                        //如果时间设置乱序
                                        if (!this.isInTurn(e.map(item => this.getS(item[1])))) {
                                            message.error('配置文件配置错误(分页时间设置错误)!');
                                            return;
                                        }
                                        this.setState({
                                            timeArr: e.map(item => item[1])
                                        })
                                    }}
                                    // accept={'.mp3'}
                                    isConfigureF={true}
                                />
                            </div>}
                        </div>
                    </div>
                    {/* 音频分页代码 */}
                    {
                        this.state.isPaging && this.state.timeArr.map((item, index) => {
                            var that = this;
                            return <div className='pageNumWrap' key={index}>
                                <div className='pageNum'>第{index + 1}页:</div>
                                <TimePicker
                                    id={index + ''}
                                    allowEmpty={false}
                                    hideDisabledOptions
                                    disabled={index == 0}
                                    onOpenChange={(open) => {
                                        if (!open) {
                                            if (this.getS(this.state.timeArr[this.state.timeArr.length - 1]) >= this.state.audioTimeLengthLoaction) {
                                                message.warning('分页时长超过音频时长,自动设置为最大时长');
                                                this.setState({
                                                    timeArr: this.state.timeArr.map((_item, _index) => {
                                                        if (_index == this.state.timeArr.length - 1) {
                                                            console.log(this.getTimeStr(parseInt(this.state.audioTimeLengthLoaction) - 1));
                                                            return this.getTimeStr(this.state.audioTimeLengthLoaction - 1);
                                                        } else {
                                                            return _item;
                                                        }
                                                    })
                                                })
                                            }
                                        }
                                    }}
                                    value={moment(item, 'mm:ss')}
                                    format={'mm:ss'}
                                    onChange={(timeMoment, timeString) => {
                                        console.log(timeString);

                                        this.setState({
                                            timeArr: this.state.timeArr.map((_item, _index) => (_index == index ? timeString : _item))
                                        })
                                    }} />
                            </div>
                        })
                    }
                    <div className='titleWrap' style={{ height: 32 }}>
                        <div className='title'>音频上下架:</div>
                        {this.state.copyrightStatus == 'SHELVES_OFF' ? <span style={{ lineHeight: '32px' }} >版权下架</span> : <div>
                            <Select value={this.state.isShelves} style={{ width: 120 }} onChange={(v) => { this.setState({ isShelves: v }); }}>
                                <Option value={true}>上架</Option>
                                <Option value={false}>下架</Option>
                            </Select>
                        </div>}
                    </div>
                    <div className='titleWrap' >
                        <Button style={{ marginLeft: '300px', marginBottom: '20px' }} onClick={() => { this.submitData() }}>保存</Button>
                    </div>
                    {/* <audio preload="meta" width="500" height="300" className='previewImg' src={this.state.ossUrl} controls name="media"></audio> */}

                    <CommonAddBook ref="addBooks" rowKey="bookCode" selectType="radio" visible={this.state.visible} modelCancle={msg => this.modelCancle(msg)} handleOk={(selectedRowKeys, selectedRows) => this.handleOk(selectedRowKeys, selectedRows)} />
                </div>
            </Spin>
        )
    }
}



export default myForm2