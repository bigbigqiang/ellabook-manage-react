import React from 'react'
import { Upload, Icon, Form, Input, Select, Spin, Radio, Button, Modal, message, Row, Col,DatePicker,InputNumber } from 'antd'
import { Link,hashHistory} from 'react-router'
const FormItem = Form.Item
const Option = Select.Option
const RadioGroup = Radio.Group
import "./addTaskLibrary.css";
var util = require('../util.js');
import moment from 'moment';
import ParamsConfig from './paramsConfig.js'
import RewardConfig from './RewardConfig.js'

const { TextArea } = Input;
class addTaskLibrary extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            status: this.props.params.status,
            taskCode:this.props.params.taskCode,
            previewImage: '',
            previewVisible: false,
            previewImage2: '',
            previewVisible2: false,
            fileList: [],
            fileList2:[],
            loading: false,
            loading2:false,
            loading3:false,
            bgDefault:"a",
            cycleType:"YES",//是否接受循环
            loopCycleType:"day",
            taskCode:this.props.params.taskCode,
            useStatus:this.props.params.useStatus,
            taskName:'',//任务名称
            taskImageUrl:'',//图标地址链接
            taskDesc:'',//任务简介
            startTime:'',//有效时间
            endTime:'',//完成时间
            cycleTime:'',//循环周期
            taskType:'',//任务类型
            taskTypeList:[],
            taskActionList:[],//任务行为
            actionCode:'',
            taskParameter:'',//任务参数代码
            selectedRowKeys: [],
            tmpSelectdRowKeys: [],
            taskParam:{},
            paramsBookName:"",
            taskReward:{//奖励内容
                rewardType:'',
                rewardContent:'',
                bookName:'',
                rewardIcon:'',
                rewardDesc:''
            },
            taskRewardList:[],
            redList:[],//奖励内容红包存储列表,
            taskAcceptType:"HAND",//是否自动接取
            activeTask:"http://member.ellabook.cn/587c46e4a60e4f21ba7b2c4604258983",//活跃任务
            readTask:"http://member.ellabook.cn/dd2e24cc9103423f9be951262c8860ac",//阅读任务
            payTask:"http://member.ellabook.cn/1c462c7bbeed409ba457cdd3912fb3f7",//付费任务
            socialTask:"http://member.ellabook.cn/b824e6a101dd444f807f7ced04bf88e4",//社交任务    
            taskParamsCode:'',//用于存放bookCode,会员类型等
            times:'',//用于存放本书，次数等
            rewardsAcceptType:"AUTO",//是否自动完成
            finishTimes:'1',//周期内完成次数

            BOOKImg:"http://member.ellabook.cn/f471ddbf69fc43d0a2bb056035a04e65",//图书
            VIPImg:"http://member.ellabook.cn/6fdf82ee743c4f6f873da69c4d7b11b3",//会员
            COUPONImg:"http://member.ellabook.cn/b568deb3ddd84f29a9e3b38af54159d7",//红包
            POINTImg:"http://member.ellabook.cn/e417540a5e454b3daa7f2b13be4884f1",//积分
            BOOK_PACKAGEImg:"http://member.ellabook.cn/647840f10b264efa9b746a4c270d99c8",//图书包
            rewardDefault:"default",
            showFlag:'',

        }
    }
    componentDidMount() {
        if (this.state.status== "edit") {
            this.fetchTaskDetail();
        }
        this.props.form.validateFields();                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
        this.fetchTaskTypeData();
        this.fetchTaskRewardList();
       
      
    }
    fetchTaskDetail(){
        util.API({taskCode:this.state.taskCode},"ella.operation.getOperationTaskInfo")
        .then(response=>response.json())
        .then(response=>{
            if(response.status==1){
                var data=response.data;
                var actionCode=data.actionCode;
                var times,taskParamsCode,loopCycleType; 
                var paramsBookName="";
               
                var bgDefault;
                var curImg=data.taskImageUrl;
                if(curImg!=this.state.activeTask&&curImg!=this.state.readTask&&curImg!=this.state.payTask&&curImg!=this.state.socialTask){
                    bgDefault="b"
                }else{
                    bgDefault="a"
                }
                var taskParam=data.taskParam!=""?JSON.parse(data.taskParam):data.taskParam;
                if(data.cycleType=="YES"){
                    if(data.cycleTime==1){
                        loopCycleType="day";
                    }else{
                        loopCycleType="custom"
                    }
                }else{
                    loopCycleType="";
                }
                if(actionCode=='A20181114BM2QJO0504'||actionCode=='A20181114BM2QJO0503'||actionCode=='A20181114BM2QJO0502'||actionCode=="A20181114BM2QJO0501"||actionCode=="A20181026BML5WL9491"||actionCode=="A20181026BML5WM2649"||actionCode=="A20181114BM2QJO0500"||actionCode=="A20181026BML5WN5564"||actionCode=='A20181026BN4BQG4441'){
                    times=taskParam.count;
               
                }else if(actionCode=='A20181026BN4BQG1158'||actionCode=='A20181026BN4BQG4686'||actionCode=="A20181026BM2QJO0507"||actionCode=='A20181026BN4BQF5586'){

                    taskParamsCode=taskParam.bookCode;
                    paramsBookName=taskParam.bookName;
                       
                }else if(actionCode=="A20181026BN4BQF3396"){
                    taskParamsCode=taskParam.packageCode;
                }else if(actionCode=="A20181026BN4BQG8483"){
                    taskParamsCode=taskParam.vipType;
                }else if(actionCode=='A20181026BN4BQG1158'){
                    taskParamsCode=taskParam.bookCode;
                    paramsBookName=taskParam.bookName;
                    times=taskParam.count;
                    
                }
                var redList=[];
                if(data.taskReward.rewardType=="COUPON"){
                    function fn(str) {
                        var arr = [];
                        var str = str.replace(/\s+/g, "");
                        var arr2 = str.split(",").map(item => parseFloat(item));
                        var i = 1;
                        while (i <= 10) {
                            if (arr2.indexOf(i) != -1) {
                                arr.push({
                                "id": i,
                                "price": i,
                                "num": arr2.filter(item => item == i).length
                                });
                            }
                            i++;
                        }
                
                        return arr
                    };
                    redList = fn(data.taskReward.rewardContent);//拉取红包列表
                   
                }
               
                if(data.taskReward.rewardIcon!=this.state.BOOKImg&&data.taskReward.rewardIcon!=this.state.BOOK_PACKAGEImg&&data.taskReward.rewardIcon!=this.state.COUPONImg&&data.taskReward.rewardIcon!=this.state.POINTImg&&data.taskReward.rewardIcon!=this.state.VIPImg){
                    var rewardDefault="custom";
                }else{
                    var rewardDefault="default";
                }
                this.fetchTaskActionData(data.taskType)
                this.setState({
                    actionCode,
                    cycleTime:data.cycleTime,
                    cycleType:data.cycleType,
                    rewardDefault,
                    endTime:data.endTime,
                    finishTimes:"1",//data.finishTimes,
                    rewardsAcceptType:data.rewardsAcceptType,
                    startTime:data.startTime,
                    taskAcceptType:"HAND",//data.taskAcceptType,
                    taskDesc:data.taskDesc,
                    taskImageUrl:data.taskImageUrl,
                    taskName: data.taskName,
                   
                    taskParam,
                    taskReward: data.taskReward,
                    taskType:data.taskType,
                    times,
                    taskParamsCode,
                    loopCycleType,
                    paramsBookName,
                    bgDefault,
                    showFlag:data.showFlag,
                    fileList:bgDefault=="b"?[{
                        uid: -1,
                        name: 'xxx.png',
                        status: 'done',
                        url:data.taskImageUrl,
                    }]:[],
                    fileList2:rewardDefault=="custom"?[{
                        uid: -1,
                        name: 'xxx.png',
                        status: 'done',
                        url:data.taskReward.rewardIcon,
                    }]:[],
                    redList,
                })
            }else{
                message.error(response.message)
            }
        })
    }
    //任务类型
    fetchTaskTypeData() {
        util.API({"groupId":"TASK_ACTION"},"ella.operation.boxSearchList")
        .then(response=>response.json())
        .then(response=>{
            if(response.status==1){
                this.setState({
                    "taskTypeList":response.data,
                })
            }else{
                console.log(response.message)
            }
        })
        
    }
    //任务行为
    fetchTaskActionData(actionType) {
        util.API({actionType},"ella.operation.getTaskActionList")
        .then(response=>response.json())
        .then(response=>{
            if(response.status==1){
                this.setState({
                    "taskActionList":response.data,
                })
            }else{
                console.log(response.message)
            }
        })
        
    }
    //任务奖励内容
    fetchTaskRewardList(){
        util.API({"groupId":"TASK_REWARD"},"ella.operation.boxSearchList")
        .then(response=>response.json())
        .then(response=>{
            if(response.status==1){
                this.setState({
                    "taskRewardList":response.data,
                })
            }else{
                console.log(response.message)
            }
        })
        
    }
    convertBase64UrlToBlob = (urlData) => {

        var bytes = window.atob(urlData.split(',')[1]);        //去掉url的头，并转换为byte  

        //处理异常,将ascii码小于0的转换为大于0  
        var ab = new ArrayBuffer(bytes.length);
        var ia = new Uint8Array(ab);
        for (var i = 0; i < bytes.length; i++) {
            ia[i] = bytes.charCodeAt(i);
        }
        console.log('type:' + urlData.split(',')[0].split(':')[1].split(';')[0]);
        var type = urlData.split(',')[0].split(':')[1].split(';')[0];
        return new Blob([ab], { type: type });

    }

    imageFetch = async (url,type) => {
        if(type==1){
            this.setState({
                loading:true
            });
        }else{
            this.setState({
                loading2:true
            });
        }
      
        var doc = {
            pictureStream: url
        };
        var formData = new FormData();
        formData.append('pictureStream', this.convertBase64UrlToBlob(url));
        var data = await fetch(util.upLoadUrl, {
            method: 'POST',
            // headers: {
            //     "Content-type":"application/x-www-form-urlencoded"
            // },
            mode: 'cors',
            body: formData
        })
            .then(function (res) {
                return res.json();
            });
        if (data.status == 1) {
            if(type==1){
                this.setState({ loading: false, taskImageUrl: data.data }); 
            }else{
                this.setState({ 
                    loading2: false, 
                    taskReward:{
                        ...this.state.taskReward,
                        rewardIcon:data.data
                    }
                }); 
            }
           
        }
    }
    handleIconChange = ({ fileList }) => {
        this.setState({ fileList: fileList }, () => {
            if(fileList.length==0){
                return ;
            }
            if(this.state.fileList[0].thumbUrl!='undefined'){
                let thumbUrl = this.state.fileList[0].thumbUrl;
               
                if (this.state.fileList[0].percent == 100) {
                   
                    setTimeout(() => {

                        this.imageFetch(thumbUrl,1);
                        return;
                    }, 0)

                } else {
                    console.log('上传失败2！')
                }
              
            }
            

        });

    }
    handleIconChange2 = ({ fileList }) => {
        this.setState({ fileList2: fileList }, () => {
            if(fileList.length==0){
                return ;
            }
            if(this.state.fileList2[0].thumbUrl!='undefined'){
                let thumbUrl = this.state.fileList2[0].thumbUrl;
               
                if (this.state.fileList2[0].percent == 100) {
                   
                    setTimeout(() => {

                        this.imageFetch(thumbUrl,2);
                        return;
                    }, 0)

                } else {
                    console.log('上传失败2！')
                }
              
            }
            

        });

    }
    handleSubmit=()=>{
    	
        function getNowFormatDate() {
		    var date = new Date();
		    var seperator1 = "-";
		    var month = date.getMonth() + 1;
		    var strDate = date.getDate();
		    if (month >= 1 && month <= 9) {
		        month = "0" + month;
		    }
		    if (strDate >= 0 && strDate <= 9) {
		        strDate = "0" + strDate;
		    }
		    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
		    return currentdate;
		}
        const formData=this.props.form.getFieldsValue();
        //传参
        const {rewardDefault,taskCode,paramsBookName,finishTimes,redList,times,taskParamsCode,bgDefault,endTime,startTime,loopCycleType,taskImageUrl,taskDesc,cycleType,cycleTime,taskAcceptType,taskType,actionCode,rewardsAcceptType,taskReward}=this.state;
        //任务名称
        if(formData.taskName.length>8||formData.taskName.length==0){
            message.error("任务名称限制为1~8个中文字符！");
            return;
        }     
        //任务图标
        if(bgDefault=="b"&&taskImageUrl==''){
            message.error("自定义图标未选择！");
            return;
        }
        //简介
        if(taskDesc==""){
            message.error("任务简介不能未空！");
            return;
        }
        if(taskDesc.length>15){
            message.error("任务简介不能超过15个中文字符！");
            return;
        }
        var curCycleTime=cycleTime;
        var curFinishTimes=finishTimes;
      	//是否支持循环
        if(cycleType=="YES"){
            //支持循环后，循环周期
            if(loopCycleType==""){
                message.error("请选择循环周期类型！");
                return;
            }
            if(loopCycleType=="custom"){
                //自定义周期要填写多少天
                if(cycleTime==""){
                    message.error("请填写自定义周期！");
                    return;
                }
                if(Math.round(cycleTime)!=cycleTime){
                    message.error("自定义周期必须是整数");
                    return;
                }
                if(cycleTime<=1||String(cycleTime)==""||cycleTime==undefined){
                    message.error("自定义周期需大于1");
                    return;
                }
            }else if(loopCycleType=="day"){
                curCycleTime=1;
            }
            //周期内完成次数
            if(curFinishTimes==""){
                message.error("请填写周期内完成次数！");
                return;
            }
            if(Math.round(curFinishTimes)!=curFinishTimes){
                message.error("周期内次数必须是整数");
                return;
            }
            if(curFinishTimes<1||String(curFinishTimes)==""||curFinishTimes==undefined){
                message.error("周期内次数需大于等于1");
                return;
            }
        }else{
            curCycleTime="";
            curFinishTimes="";
        }
      //有效时间
        var curTime=new Date(getNowFormatDate()).getTime()
        if(startTime==""||endTime==""){
            message.error("请填写有效时间！");
            return;
        }
        if(new Date(startTime).getTime()>=new Date(endTime).getTime()){
            message.error("有效时间的开始时间必须小于完成时间！");
            return;
        }
        if(new Date(endTime).getTime()<curTime){
            message.error("有效时间的结束时间必须等于或晚于当前时间！");
            return;
        }
       
       //是否自动接取任务
        if(taskAcceptType==""){
            message.error("请选择是否自动接取任务！");
            return;
        }
        //任务类型
        if(taskType==""){
            message.error("请填写任务类型！");
            return;
        }
        
        //任务行为
        if(actionCode==""){
            message.error("请填写任务行为！");
            return;
        }
        var taskParam;
        //任务参数
        if(actionCode=="A20181026BML5WM5544"||actionCode=="A20181026BML5WN3449"||actionCode=="A20181026BN4BQH3802"){
            taskParam="";
        }else if(actionCode=='A20181114BM2QJO0504'||actionCode=='A20181114BM2QJO0503'||actionCode=='A20181114BM2QJO0502'||actionCode=='A20181114BM2QJO0501'||actionCode=='A20181026BML5WN5564'||actionCode=='A20181114BM2QJO0500'||actionCode=='A20181026BML5WL9491'||actionCode=='A20181026BML5WM2649'||actionCode=='A20181026BN4BQG4441'){
            if(times<1||String(times)==""||times==undefined){
                message.error("任务参数输入框必须大于等于1！");
                return;
            }
            if(Math.round(times)!=times){
                message.error("任务参数必须是整数！");
                return;
            }
            taskParam={
                count:times
            }

        }else if(actionCode=='A20181026BN4BQG1158'||actionCode=='A20181026BN4BQG4686'||actionCode=='A20181026BN4BQF3396'||actionCode=='A20181026BN4BQF5586'||actionCode=="A20181026BM2QJO0507"||actionCode=="A20181026BN4BQG8483"){
            if(taskParamsCode==""){
                message.error("任务参数未选择！");
                return;
            }
            if(actionCode=='A20181026BN4BQG1158'||actionCode=='A20181026BN4BQG4686'||actionCode=="A20181026BM2QJO0507"||actionCode=='A20181026BN4BQF5586'){
                taskParam={
                    bookCode:taskParamsCode,
                    bookName:paramsBookName,
                }
            }
            if(actionCode=="A20181026BN4BQF3396"){
                taskParam={
                    packageCode:taskParamsCode
                }
            }
            if(actionCode=="A20181026BN4BQG8483"){
                taskParam={
                    vipType:taskParamsCode
                }
            }
        }else if(actionCode=='A20181026BN4BQG1158'){
            
            if(taskParamsCode==""){
                message.error("任务参数未选择！");
                return;
            }
            if(times<1||String(times)==""||times==undefined){
                message.error("任务参数输入框必须大于等于1！");
                return;
            }
            if(Math.round(times)!=times){
                message.error("任务参数必须是整数！");
                return;
            }
            taskParam={
                count:times,
                bookCode:taskParamsCode,
                bookName:paramsBookName,
            }
        }
        //是否自动完成
        if(rewardsAcceptType==""){
            message.error("是否自动完成未选择");
            return;
        }
        //任务奖励内容
        if(taskReward.rewardType==""){
            message.error("任务奖励类型未选择");
            return;
        }
        if(taskReward.rewardType=="COUPON"){
            if(redList.length==0){
                message.error("请设置奖励红包");
                return;
            }
            let n = 0;
            let coupons = [];
            let allMoney=0;
            redList.forEach(item => {
                let t = item.num;
                let p = item.price
                n = n + p * t;
                allMoney+= item.price * item.num
                while (t > 0) {
                    t--;
                    coupons.push(p)
                }
            })
            taskReward.rewardContent=coupons.join(",")
            taskReward.rewardDesc=encodeURIComponent("+"+allMoney);
           

        }else{
            if(taskReward.rewardContent==""){
                message.error("任务奖励不能为空");
                return;
            }
            if(taskReward.rewardType=="POINT"){
            	if(taskReward.rewardContent==""||taskReward.rewardContent==undefined||taskReward.rewardContent<1){
	                message.error("任务奖励积分必须大于等于1");
	                return;
	            }
            	if(Math.round(taskReward.rewardContent)!=taskReward.rewardContent){
	                message.error("任务奖励积分必须是整数！");
	                return;
                }
                taskReward.rewardDesc=encodeURIComponent("+"+taskReward.rewardContent)
            }else if(taskReward.rewardType=="BOOK"){
                taskReward.rewardDesc="+"+taskReward.bookName;
            }
        }
        //任务奖励图标
        if(rewardDefault=="custom"&&taskReward.rewardIcon==''){
            message.error("任务奖励自定义图标未选择！");
            return;
        }
		var curTaskImageUrl=taskImageUrl;
		if(bgDefault=="a"){
			curTaskImageUrl=taskType=="ACTIVE_TASK"?this.state.activeTask:taskType=="READ_TASK"?this.state.readTask:taskType=="PAID_BEHAVIOR_TASK"?this.state.payTask:this.state.socialTask;

        }
		if(rewardDefault=="default"){
			taskReward.rewardIcon=taskReward.rewardType=="BOOK"?this.state.BOOKImg:taskReward.rewardType=="BOOK_PACKAGE"?this.state.BOOK_PACKAGEImg:taskReward.rewardType=="COUPON"?this.state.COUPONImg:taskReward.rewardType=="POINT"?this.state.POINTImg:this.state.VIPImg;
        }
        //传参
        var doc={
            taskName:formData.taskName,
            taskImageUrl:curTaskImageUrl,
            taskDesc,
            cycleType,
            cycleTime:curCycleTime,
            taskAcceptType:taskAcceptType,
            startTime,
            endTime,
            taskType,
            actionCode,
            taskParam,
            rewardsAcceptType,
            taskReward,
            finishTimes:curFinishTimes
        }
        if(this.state.status=="edit"&&this.state.useStatus!="repeatUse"){
            doc.taskCode=taskCode;
        }
        console.log(doc)
        this.setState({
            loading3:true
        })
        util.API(doc,"ella.operation.saveOperationTask")
        .then(response=>response.json())
        .then(response=>{
            if(response.status==1){
                message.success("保存成功！")
                if(this.state.status=="add"||this.state.useStatus=="repeatUse"){
                    
                    setTimeout(() => {
                        this.setState({
                            loading3:false
                        })
                        hashHistory.push('/taskLibrary');
                    }, 1000)
                }else{
                    setTimeout(() => {
                        this.setState({
                            loading3:false
                        })
                      
                    }, 1000)
                }
               
            }else{
                message.error(response.message)
            }
        })


    }
    //各种state改变统一设置
    changeType(type,value){
        this.setState({[type]:value},()=>console.log(this.state))
    }
    rewardChange(value,type,value2,type2){
        if(value2==undefined){
            this.setState({
                taskReward:{
                    ...this.state.taskReward,
                    [type]:value
                }
            })
        }else{
            this.setState({
                taskReward:{
                    ...this.state.taskReward,
                    [type]:value,
                    [type2]:value2
                }
            })
        }
       
    }
    taskTimeChange(value, dateString,type) {
        this.setState({
            [type]: dateString
        })
    }
    handleOk(bookCode,bookName){
    	this.setState({
            paramsBookName:bookName,
            taskParamsCode:bookCode
        })   
    }
    //任务类型改变
    taskTypeChange(v){
        this.fetchTaskActionData(v);
        this.setState({
        	"taskType":v,
        	actionCode:""
        })    
    }
    renderButton(){
        if(this.state.status=="add"||this.state.status=="edit"){
            console.log(1)
            if(this.state.status=="edit"&&this.state.useStatus!="repeatUse"){
                if(this.state.showFlag=="SHOW_ON"||this.state.showFlag=="SHOW_UNSHELVE"){
                    console.log(2)
                    return ;
                }
            }
            console.log(3)
            return (<FormItem wrapperCol={{ span: 12, offset: 4 }} style={{ marginTop: 24 }}>
            <Button type="primary" onClick={this.handleSubmit}>保存</Button>
         </FormItem>)
            
        }
    }
    render() {
    	
        const { getFieldDecorator } = this.props.form
        const { previewVisible, previewImage, previewVisible2, previewImage2,fileList,fileList2, visible, loading,loading2,loading3 } = this.state;
        
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 18 }
        }
        const uploadButton = (
            <div className="upLoad-center">
                <Icon type="plus" />
            </div>
        );
        return (
            <div id="addDutyLib">
                <p className="m-title"><Link to='/taskLibrary'><Icon type="left" />{this.state.status =="add"||this.state.useStatus=="repeatUse" ? '添加新的任务' : '编辑新的任务'}</Link></p>
                <Spin spinning={loading3}>
                <Form>
                    <Row>
                        <Col>

                            <FormItem
                                id="control-input"
                                label="任务名称"
                                {...formItemLayout}
                            >
                                {getFieldDecorator('taskName', {
                                    initialValue: this.state.taskName,
                                })(
                                    <Input id="control-input" placeholder="请输入任务名称" style={{"width":"30%"}}/>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <FormItem
                        label="任务图标"
                        {...formItemLayout} >
                        <RadioGroup value={this.state.bgDefault} onChange={(e)=>this.changeType("bgDefault",e.target.value)} style={{"float":"left"}}>
                            <Radio value="a">默认图标</Radio>
                            <Radio value="b">自定义图标</Radio>
                        </RadioGroup>
                        {
                            this.state.bgDefault=="b"&&<div><Spin spinning={loading} tip="图片上传中..." style={{"width":"104px","display":"inlineBlock"}}>
                            
                            <Upload
                                action="//jsonplaceholder.typicode.com/posts/"
                                listType="picture-card"
                                fileList={fileList}
                                onPreview={(file)=>this.setState({
                                    previewImage: file.url || file.thumbUrl,
                                    previewVisible: true,
                                })}
                                onChange={this.handleIconChange}
                                onRemove={()=>this.changeType("taskImageUrl","")}
                            >
                                {fileList.length >= 1 ? null : uploadButton}
                            </Upload>
                            
                        </Spin>
                        <Modal visible={previewVisible2} footer={null} onCancel={()=>this.changeType("previewVisible2",false)}>
                            <img alt="example" style={{ width: '100%' }} src={previewImage2} />
                        </Modal>
                        </div>
                        }
                        
                    </FormItem>
                    <FormItem
                        label="任务简介"
                        {...formItemLayout}
                    > 
                        <TextArea id="control-textarea2" rows={3} style={{"width":"30%"}} value={this.state.taskDesc} onChange={(e) =>this.changeType("taskDesc",e.target.value)}/>  
                    </FormItem>
                    <FormItem
                        label="有效时间"
                        {...formItemLayout}>
                        <Col span={24}>
                            <DatePicker
                                style={{ width: "150px" }}
                                format="YYYY-MM-DD"
                                placeholder={['开始时间']}
                                value={this.state.startTime?moment(this.state.startTime,'YYYY-MM-DD'):null}
                                onChange={(value, dateString) => { this.taskTimeChange(value, dateString, "startTime") }}
                                
                            />
                            <span style={{ width: "100%" }} className="line">—</span>
                            <DatePicker
                                style={{ width: "150px" }}
                                format="YYYY-MM-DD"
                                placeholder={['结束时间']}
                                value={this.state.endTime?moment(this.state.endTime,'YYYY-MM-DD'):null}
                                onChange={(value, dateString) => { this.taskTimeChange(value, dateString, "endTime") }}
                                
                            />
                        </Col>
                    </FormItem>
                    <FormItem
                        label="是否支持循环"
                        {...formItemLayout} >
                        <RadioGroup value={this.state.cycleType} onChange={(e)=>this.changeType("cycleType",e.target.value)} style={{"float":"left"}}>
                            <Radio value="YES">是</Radio>
                            <Radio value="NO">否</Radio>
                        </RadioGroup>
                    </FormItem>
                    {
                        this.state.cycleType=="YES"&&<div><FormItem
                            label="循环周期"
                            {...formItemLayout} >
                            <RadioGroup value={this.state.loopCycleType} onChange={(e)=>this.changeType("loopCycleType",e.target.value)} style={{"float":"left"}}>
                                <Radio value="day">日重复</Radio>
                                <Radio value="custom">自定义周期</Radio>
                                {   
                                    this.state.loopCycleType=="custom"&&<span><InputNumber
                                    style={{ width: "30%" }}
                                    value={this.state.cycleTime}
                                    onBlur={(e)=>{this.changeType("cycleTime",e.target.value)}} 
                                    onChange={(value)=>{this.changeType("cycleTime",value)}} 
                                   
                                />&nbsp;天</span>   
                                }
                            </RadioGroup>
                        </FormItem>
                        <FormItem
                        label="周期内完成次数"
                        {...formItemLayout} >
                         <InputNumber
                            disabled="true"
                            style={{ width: "100px" }}
                            value={this.state.finishTimes}
                            onBlur={(e)=>{this.changeType("finishTimes",e.target.value)}} 
                            onChange={(value)=>{this.changeType("finishTimes",value)}} 
                            
                        />   
                    </FormItem>
                    </div>
                    }
                    <FormItem
                        label="是否自动接取"
                        {...formItemLayout} >
                        <RadioGroup disabled="true" value={this.state.taskAcceptType} onChange={(e)=>this.changeType("taskAcceptType",e.target.value)} style={{"float":"left"}}>
                            <Radio value="AUTO">是</Radio>
                            <Radio value="HAND">否</Radio>
                        </RadioGroup>
                    </FormItem>
                    <FormItem
                         label="任务类型"
                         {...formItemLayout} >
                        <Select
                            showSearch
                            style={{ width: 200 }}
                            onChange={(v) =>this.taskTypeChange(v)}
                            value={this.state.taskType}
                        >
                            {
                                this.state.taskTypeList.map(item => {
                                    
                                    return <Option value={item.searchCode} key={item.searchCode}>{item.searchName}</Option>
                                })
                            }
                        </Select>
                    </FormItem>
                    <FormItem
                         label="任务行为"
                         {...formItemLayout} >
                        <Select
                            showSearch
                            style={{ width: 200 }}
                            onChange={(v) => {
                                // this.taskParameterConfigure(v);
                                this.changeType("actionCode", v); 
                                this.setState({
                                    taskParamsCode:'',
                                    times:'',
                                    paramsBookName:'',
                                })
                               
                            }}
                            value={this.state.actionCode}
                        >
                            {
                                this.state.taskActionList.map(item => {
                                    
                                    return <Option value={item.actionCode} key={item.actionCode}>{item.actionName}</Option>
                                })
                            }
                        </Select>
                    </FormItem>
                    <ParamsConfig
                        handleOk={(bookCode,bookName)=>this.handleOk(bookCode,bookName)} 
                        paramsBookName={this.state.paramsBookName}
                        bookformItemLayout={formItemLayout} 
                        getFieldDecorator={getFieldDecorator} 
                        actionCode={this.state.actionCode}
                        taskParamsCode={this.state.taskParamsCode}
                        changeType={(type,value)=>this.changeType(type,value)}
                        times={this.state.times}

                    />
                    <FormItem
                        label="是否自动完成"
                        {...formItemLayout} >
                        <RadioGroup value={this.state.rewardsAcceptType} onChange={(e)=>this.changeType("rewardsAcceptType",e.target.value)} style={{"float":"left"}}>
                            <Radio value="AUTO">是</Radio>
                            <Radio value="HAND">否</Radio>
                        </RadioGroup>
                    </FormItem>
                    <FormItem
                         label="任务奖励内容"
                         {...formItemLayout} >
                        <Select
                            showSearch
                            style={{ width: 200,marginRight:"20px","verticalAlign":"top","marginTop":"4px"}}
                            onChange={(v) => {
                                this.setState({
                                    "taskReward":{
                                        "rewardType":v,
                                        "rewardContent":"",
                                        "bookName":'',
                                    },
                                   
                                })
                            }}
                            value={this.state.taskReward.rewardType}
                        >
                            {
                                this.state.taskRewardList.map(item => {
                                    
                                    return <Option value={item.searchCode} key={item.searchCode}>{item.searchName}</Option>
                                })
                            }
                        </Select>
                        <RewardConfig 
                            rewardChange={(value,type,value2,type2)=>this.rewardChange(value,type,value2,type2)} 
                            taskReward={this.state.taskReward} 
                            changeType={(type,value)=>this.changeType(type,value)}
                            redList={this.state.redList}
                        />
                        <div style={{"marginTop":"10px"}} className="taskLibraryImg">
                            <span style={{float:"left"}}>任务奖励图标：</span>
                            <RadioGroup value={this.state.rewardDefault} onChange={(e)=>this.changeType("rewardDefault",e.target.value)}  style={{float:"left"}}>
                                <Radio value="default">默认图标</Radio>
                                <Radio value="custom">自定义图标</Radio>
                            </RadioGroup>
                            {
                                this.state.rewardDefault=="custom"&&<div>
                                <Spin spinning={loading2}  tip="图片上传中..." style={{"width":"104px","display":"inlineBlock"}}>
                                    <Upload
                                        action="//jsonplaceholder.typicode.com/posts/"
                                        listType="picture-card"
                                        fileList={fileList2}
                                        onPreview={(file)=>this.setState({
                                            previewImage2: file.url || file.thumbUrl,
                                            previewVisible2: true,
                                        })}
                                        onChange={this.handleIconChange2}
                                        onRemove={()=>this.rewardChange("","rewardIcon")}
                                    >
                                        {fileList2.length >= 1 ? null : uploadButton}
                                    </Upload>  
                                </Spin>
                                <Modal visible={previewVisible2} footer={null} onCancel={()=>this.changeType("previewVisible2",false)}>
                                    <img alt="example" style={{ width: '100%' }} src={previewImage2} />
                                </Modal>
                            </div>
                            }
                        </div>
                    </FormItem>  
                   {this.renderButton()}
                   
                    
                </Form>
                </Spin>
                {/* <Button onClick={()=>{
                    console.log(this.props.form.getFieldsValue().bookSearchName);
                    this.setState({"actionCode":"A20181026BML5WK8649"})
                    
                    }}>测试按钮</Button> */}
               
            </div>
        )
    }
}

addTaskLibrary = Form.create()(addTaskLibrary)
export default addTaskLibrary

