import React from 'react'
import { render } from 'react-dom'
import { LocaleProvider } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';

// 引入React-Router模块
import { Router, Route, hashHistory, IndexRoute } from 'react-router'

// Animate.CSS样式
// import 'animate.css/animate.min.css'

// 引入主体样式文件
import './main.css'

// 引入单个页面（包括嵌套的子页面）
import Free from './components/free/free.js'
import Index from './components/index/index.js'
import AddMoudle from './components/index/addMoudle.js'
import Banner from './components/banner/banner.js'
import AddBanner from './components/banner/addBannerPicture.js'
import AddAdvertBanner from './components/advertBanners/addAdvertBanner.js'
import Topic from './components/topic/topic.js'
import Addtopic from './components/topic/addTopic.js'
import Home from './components/home/home.js'
import userControl from './components/user/userControl.js'
import userList from './components/user/userList.js'
import orderPage from './components/order/orderPage.js'
import orderDetails from './components/order/orderDetails.js'
import Goodslist from './components/goods/goodsList.js'
import AddGoods from './components/add/Goods.js'
import Addellagold from './components/add/Ellagold.js'
import Addellavip from './components/add/Ellavip.js'
import Addcourse from './components/addcourse/Course.js'
import SeeDetails from './components/seeDetails/Details.js'
import Recommend from './components/recommend/index.js'
import addRecommend from './components/recommend/addRecommend.js'

import bookService from './components/bookService/index.js'
import addActivity from './components/bookService/addActivity'
import vip from './components/vip/vip.js'
import addVip from './components/vip/addVip.js'
import Authorization from './components/account/authorization.js'
import EditAuthorization from './components/account/editAuthorization.js'
import Administrators from './components/account/administrators.js'
import Staff from './components/account/staff.js'
import EditStaff from './components/account/editStaff.js'
import Logger from './components/logger/logger.js'
import bookList from './components/book/bookList.js'
import ClassifySort from './components/book/classifySort.js'
import AdvertManage from './components/advertBanners/advertManage.js'

import firstPartner from './components/account/firstPartner.js'
import firstDetail from './components/account/firstDetail.js'
import addFirst from './components/account/addFirst.js'
import editFirst from './components/account/editFirst.js'
import secondPartner from './components/account/secondPartner.js'
import editSecond from './components/account/editSecond.js'
import secondDetail from './components/account/secondDetail.js'


import RedActivity from './components/red/red_activity/Red_activity.js'
import AddRedActivity from './components/red/red_activity/Red_activity/add.js'
import Filetext from './components/filetext/Filetext.js'
import AddFiletext from './components/filetext/Filetext/add.js'
import Remittance from './components/remittance/daily_remittance.js'
import AddRemittance from './components/remittance/add/add.js'
import UploadRemittance from './components/remittance/add/upload.js'
import Editor from './components/editor/editor.js'
import OriginalAuthor from './components/book/originalAuthor.js'
import EllaAuthor from './components/book/ellaAuthor.js'
import BookPrize from './components/book/bookPrize.js'
import EllaAuthorDetail from './components/book/ellaAuthorDetail.js'
import BookComment from './components/solution/BookComment.js'
import CourseComment from './components/solution/CourseComment.js'
import FeedBackList from './components/message/feedBackList.js'
import FeedBackDetail from './components/message/feedBackDetail.js'
import editBook from './components/book/edtor/index.js'
import TeachingMode from './components/teachingMode/getTeachingMode.js'
import H5activity from './components/h5activity/h5activity.js'
import OpeH5activity from './components/h5activity/opeH5activity.js'
import GoodsGroup from './components/goodsGroup/goodGroup.js'
import Publish from './components/account/publish.js'
import PublishBook from './components/account/publishBook.js'
import messageList from './components/messageList/messageList.js'
import addNewMessage from './components/messageList/addNewMessage.js'
import test from './components/test/form.js'
import advertisement from './components/messageList/advertisement/index.js'
import lightningAdvertisement from './components/messageList/lightningAdvertisement/index.js'
import updateMessage from './components/messageList/updateMessage/index.js'
import userSign from './components/userSign/userSign.js'
import addSign from './components/userSign/addSign.js'

import OpeClass from './components/class/ope.js'

import editSign from './components/userSign/editSign.js'
import IndexClass from './components/class/index.js'

import watchcode from './components/pwdCode/pwdCode.js'
import addCode from './components/pwdCode/addCode.js'
import editCode from './components/pwdCode/editCode.js'
import broadcast from './components/classRadio/classRadioIndex.js'
import recommendation from './components/recommendation/recommendation.js'
import addRecommendation from './components/recommendation/addRecommendation.js'

import PopSearchList from './components/PopSearch/PopSearchList.js'

//主推IP
import featuredIP from './components/pushIp/pushIp.js'
import addPushIp from './components/pushIp/addPushIp.js'
// 任务
import MedalList from './components/task/medal.js'
import AddMedal from './components/task/addMedal.js'
import PointsAccount from './components/task/PointsAccount.js'
import PointsDetail from './components/task/PointsDetail.js'
import TaskAccount from './components/task/TaskAccount.js'
import TaskDetail from './components/task/TaskDetail.js'
import Idfa from './components/idfa/index.js'


//任务墙和任务库
import TaskLibrary from './components/task/taskLibrary.js'
import addTaskLibrary from './components/task/addTaskLibrary.js'
import TaskWall from './components/task/taskWall.js'
import addTaskWall from './components/task/addTaskWall.js'

//兑换码
import addRedeemCode from './components/redeemcode/addRedeemcode.js';
import RedeemCode from './components/redeemcode/redeemcode.js';
import RedeemList from './components/redeemcode/redeemList.js';

//图书合集
import BookSeries from './components/book/bookSeries.js';
import addBookSeries from './components/book/addBookSeries.js';

//听书
import ListenHome from './components/listenBook/ListenHome.js';
import listenBookResources from './components/listenBook/listenBookResourcesList.js'
import opeListenBookResources from './components/listenBook/opeListenBookResources.js'
import ListenRecommend from './components/listenBook/ListenRecommend.js';
import addListenRecommend from './components/listenBook/addListenRecommend.js';
import ListenBookSleep from './components/listenBook/ListenBookSleep.js'

//听书广告横幅
import ListenBookAdList from './components/listenBook/listenBookAd/ListenBookAdList.js'
import AddListenBookAd from './components/listenBook/listenBookAd/AddListenBookAd.js'
//听书专题
import ListenBookTopicList from './components/listenBook/listenBookTopic/ListenBookTopicList.js'
import AddListenBookTopic from './components/listenBook/listenBookTopic/AddListenBookTopic.js'
import AddBookSleep from './components/listenBook/AddBookSleep.js';

//图书分类
import ClassifiedBook from './components/BookClassified/BookClassified'
import AddBookClassified from './components/BookClassified/AddBookClassified'

// 配置路由
render((
    <LocaleProvider locale={zh_CN}>
        <Router history={hashHistory} >
            <Route path="/" component={Home}>
                <IndexRoute component={Free} />
                <Route path="free" component={Free} />
                <Route path="index" component={Index} />
                <Route path="home/index/addMoudle/:status" component={AddMoudle} />
                <Route path="home/banner" component={Banner} />
                <Route path="home/addBannerPic/:status" component={AddBanner} />
                <Route path="home/addAdvertBanner/:status/:partCode" component={AddAdvertBanner} />
                <Route path="home/topic" component={Topic} />
                <Route path="home/topic/addtopic/:status" component={Addtopic} />
                <Route path="goodslist" component={Goodslist} />
                <Route path="adBanner" component={AdvertManage} />
                <Route path="addGoods" component={AddGoods} />
                <Route path="addellagold" component={Addellagold} />
                <Route path="/addcourse/:goodsCode/:goodsName" component={Addcourse} />
                <Route path="addellavip" component={Addellavip} />
                <Route path="/seeDetails/:goodsCode/:goodsType/:goodsName" component={SeeDetails} />
                <Route path="userControl" component={userControl} />
                <Route path="userList" component={userList} />
                <Route path="userList/:indexInit" component={userList} />
                <Route path="orderPage" component={orderPage} />
                <Route path="orderDetails" component={orderDetails} />
                <Route path="orderDetails/:indexInit/:curuid" component={orderDetails} />
                <Route path="recommend" component={Recommend} />
                <Route path="addRecommend/:partCode/:recommendType/:addOredit" component={addRecommend} />
                <Route path="addRecommend/:partCode/:recommendType/:addOredit/:indexInit" component={addRecommend} />
                <Route path="/popularsearch" component={PopSearchList} />
                <Route path="bookService" component={bookService} />
                <Route path="addActivity/:code/:type/:fill" component={addActivity} />
                <Route path="vip" component={vip} />
                <Route path="addVip" component={addVip} />
                <Route path="authorization" component={Authorization} />
                <Route path="editAuthorization/:status/:roleName" component={EditAuthorization} />
                <Route path="administrators" component={Administrators} />
                <Route path="staff" component={Staff} />
                <Route path="editStaff/:status" component={EditStaff} />
                <Route path="loggers" component={Logger} />
                <Route path="bookList" component={bookList} />
                <Route path="classifySort" component={ClassifySort} />

                <Route path="red" component={RedActivity} />
                <Route path="red/redactivity/addRedActivity" component={AddRedActivity} />
                <Route path="red/redactivity/addRedActivity/:type/:record" component={AddRedActivity} />
                <Route path="textList" component={Filetext} />
                <Route path="filetext/addFiletext/:id" component={AddFiletext} />


                <Route path="remittance" component={Remittance} />
                <Route path="remittance/addRemittance" component={AddRemittance} />
                <Route path="remittance/uploadRemittance/:id/:content" component={UploadRemittance} />
                <Route path="editor" component={Editor} />
                <Route path="originalAuthor" component={OriginalAuthor} />
                <Route path="ellaAuthor" component={EllaAuthor} />
                <Route path="bookPrize" component={BookPrize} />

                <Route path="ellaAuthorDetail" component={EllaAuthorDetail} />


                <Route path="editbook" component={editBook} />
                <Route path="getTeachingMode/:status/:bookPages/:bookName" component={TeachingMode} />

                <Route path="bookComment" component={BookComment} />
                <Route path="courseComment" component={CourseComment} />
                <Route path="feedBackList" component={FeedBackList} />
                <Route path="feedBackDetail" component={FeedBackDetail} />


                <Route path="h5activity" component={H5activity} />
                <Route path="h5activity/operation/:ope" component={OpeH5activity} />
                <Route path="h5activity/operation/:ope/:code" component={OpeH5activity} />
                <Route path="goodsGroup/:ope" component={GoodsGroup} />
                <Route path="goodsGroup/:ope/:id" component={GoodsGroup} />
                <Route path="publish" component={Publish} />
                <Route path="publishBook" component={PublishBook} />

                <Route path="firstPartner" component={firstPartner} />
                <Route path="firstDetail" component={firstDetail} />
                <Route path="addFirst" component={addFirst} />
                <Route path="editFirst" component={editFirst} />
                <Route path="secondPartner" component={secondPartner} />
                <Route path="editSecond" component={editSecond} />
                <Route path="secondDetail" component={secondDetail} />
                <Route path="messageList" component={messageList} />
                <Route path="messageList/back/:type" component={messageList} />
                <Route path="messageList/addNewMessage" component={addNewMessage} />
                <Route path="messageList/addNewMessage/:ope" component={addNewMessage} />
                <Route path="messageList/advertisement/:ope" component={advertisement} />
                <Route path="messageList/advertisement/:ope/:adviceCode" component={advertisement} />
                <Route path="messageList/lightningAdvertisement/:ope" component={lightningAdvertisement} />
                <Route path="messageList/lightningAdvertisement/:ope/:adviceCode" component={lightningAdvertisement} />
                <Route path="messageList/updateMessage/:ope/:adviceCode" component={updateMessage} />

                <Route path="userSign" component={userSign} />
                <Route path="addSign" component={addSign} />
                <Route path="course" component={IndexClass} />
                <Route path="course/back/:num" component={IndexClass} />
                <Route path="course/:ope/:type" component={OpeClass} />
                <Route path="test" component={test} />
                <Route path="editSign" component={editSign} />

                <Route path="watchcode" component={watchcode} />
                <Route path="addCode" component={addCode} />
                <Route path="editCode" component={editCode} />
                <Route path="broadcast" component={broadcast} />
                <Route path="recommendation" component={recommendation} />
                <Route path="addRecommendation" component={addRecommendation} />
                <Route path="featuredIP" component={featuredIP} />
                <Route path="addPushIp" component={addPushIp} />
                <Route path="medal" component={MedalList} />
                <Route path="medal/addMedal/:status" component={AddMedal} />
                <Route path="pointsAccount" component={PointsAccount} />
                <Route path="pointsDetail" component={PointsDetail} />
                <Route path="taskAccount" component={TaskAccount} />
                <Route path="taskDetail" component={TaskDetail} />
                <Route path="addTaskWall/:status/:taskWallCode" component={addTaskWall} />
                <Route path="idfa" component={Idfa} />

                <Route path="taskLibrary" component={TaskLibrary} />
                <Route path="addTaskLibrary/:status/:taskCode/:useStatus" component={addTaskLibrary} />
                <Route path="taskWall" component={TaskWall} />
               
                <Route path="listenBookResourcesList/ope" component={opeListenBookResources} />
                <Route path="redeemcode" component={RedeemCode} />

                <Route path="addredeemcode/:status/:cardCode/:redeemCodeType/:batch" component={addRedeemCode} />
                <Route path="redeemlist/:redeemCodeType/:batch" component={RedeemList} /> 

                <Route path="bookSeries" component={BookSeries} />
                <Route path="addBookSeries/:status/:seriesCode" component={addBookSeries} />
                
                <Route path="listenBookHomePage" component={ListenHome} />
                
                <Route path="listenBookPartList" component={ListenRecommend} />
                <Route path="addListenRecommend/:status/:listenCode/:target" component={addListenRecommend} />

                <Route path="listenBookSleepList" component={ListenBookSleep} />
                <Route path="addbooksleep/:status/:sleepCode" component={AddBookSleep} />

                <Route path="/listenBookAdList" component={ListenBookAdList} />
                <Route path="/addListenBookAd/:target" component={AddListenBookAd} />

                <Route path="/listenBookSubjectList" component={ListenBookTopicList} />
                <Route path="/addListenBookTopic" component={AddListenBookTopic} />
               
                <Route path="listenBookResourcesList" component={listenBookResources} />
                <Route path="bookClassified" component={ClassifiedBook} />
                <Route path="addBookClassified" component={AddBookClassified} />
                {/* <Route path="addListenRecommend/:partCode/:recommendType/:addOredit/:indexInit" component={addListenRecommend} /> */}
                
            </Route>
        </Router>
    </LocaleProvider>
), document.getElementById('app'));
