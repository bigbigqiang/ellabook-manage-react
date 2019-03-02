import React from 'react';
import { Icon, Button, Row, Col, Select, DatePicker, Input, Popconfirm, message, Modal, Radio, Checkbox, Carousel, Spin } from 'antd';
// const { MonthPicker, RangePicker } = DatePicker;
// import moment from 'moment';
// import 'moment/locale/zh-cn';
import './preview.css';
import './preview3.css';
import './style.css';
// moment.locale('zh-cn');
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;
import getUrl from "../util.js";
import commonData from '../commonData.js';
import Swiper from './swiper.min.js';
import star1 from '../../assets/images/star1.png';
import star2 from '../../assets/images/star2.png';

export default class PriceSet extends React.Component {

    constructor() {
        super()
        this.state = {
            spinning: true,
            isFirst: true,
            carouselData: [],
            subjectData: [],
            remittanceData: [
              {
                   week: '周三看什么',
                   more: '更多',
                   title:'的的大块大块',
                   text: '幼儿园社会交往互动故事[托马斯和许愿星] ,源自英国的学前超级品牌,让孩子学会更好地与别人相处幼儿园社会交往互动故事[托马斯和许愿星] ,源自英国的学前超级品牌,让孩子学会更好地与别人相处幼儿园社会交往互动故事[托马斯和许愿星] ,源自英国的学前超级品牌,让孩子学会更好地与别人相处幼儿园社会交往互动故事[托马斯和许愿星] ,源自英国的学前超级品牌,让孩子学会更好地与别人相处幼儿园社会交往互动故事[托马斯和许愿星] ,源自英国的学前超级品牌,让孩子学会更好地与别人相处幼儿园社会交往互动故事[托马斯和许愿星] ,源自英国的学前超级品牌,让孩子学会更好地与别人相处幼儿园社会交往互动故事[托马斯和许愿星] ,源自英国的学前超级品牌,让孩子学会更好地与别人相处',
                   img: 'http://book.ellabook.cn/B201801190002.png'
              },
              {
                  
                   title:'得到空空导弹看',
                   text: '幼儿园社会交往互动故事[托马斯和许愿星] ,源自英国的学前超级品牌,让孩子学会更好地与别人相处',
                   img: 'http://book.ellabook.cn/B201801190002.png'
              },
              {
                   title:'扣分扣分罚款看',
                   text: '幼儿园社会交往互动故事[托马斯和许愿星] ,源自英国的学前超级品牌,让孩子学会更好地与别人相处',
                   img: 'http://book.ellabook.cn/B201801190002.png'
              }
            ],
            partData: [
                   {
                       type: 'LIST_HAND',
                       more: '更多',
                       title: '新书抢先看',
                       ads:[],
                       data: [
                           {
                               img: 'http://book.ellabook.cn/c33cf360871e4507bf023a531a892f1b',
                               title: '也许的样子(上)',
                               text: '文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字'
                           },
                           {
                               img: 'http://book.ellabook.cn/B201801190002.png',
                               title: '我喜欢美好',
                               text: '文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字'
                           },
                           {
                               img: 'http://book.ellabook.cn/4f8e5cc88d2d4a0eaa781d30b523f398',
                               title: '这样的伦敦(上)',
                               text: '文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字'
                           }
                       ]
                   },
                   {
                       type: 'SLIDE_PORTRAIT',
                       more: '更多',
                       title: '新书抢先看',
                       data: [
                           {
                               img: 'http://book.ellabook.cn/c33cf360871e4507bf023a531a892f1b',
                               title: '也许的样子(上)',
                           },
                           {
                               img: 'http://book.ellabook.cn/B201801190002.png',
                               title: '我喜欢美好',
                           },
                           {
                               img: 'http://book.ellabook.cn/4f8e5cc88d2d4a0eaa781d30b523f398',
                               title: '这样的伦敦(上)',
                           },
                           {
                               img: 'http://book.ellabook.cn/c33cf360871e4507bf023a531a892f1b',
                               title: '也许的样子(上)',
                           },
                           {
                               img: 'http://book.ellabook.cn/B201801190002.png',
                               title: '我喜欢美好',
                           },
                           {
                               img: 'http://book.ellabook.cn/4f8e5cc88d2d4a0eaa781d30b523f398',
                               title: '这样的伦敦(上)',
                           }
                       ]
                   },
                   {
                       type: 'SLIDE_HORIZONTAL',
                       more: '更多',
                       title: '新书抢先看',
                       data: [
                           {
                               img: 'http://book.ellabook.cn/c33cf360871e4507bf023a531a892f1b',
                               title: '也许的样子(上)',
                           },
                           {
                               img: 'http://book.ellabook.cn/B201801190002.png',
                               title: '我喜欢美好',
                           },
                           {
                               img: 'http://book.ellabook.cn/4f8e5cc88d2d4a0eaa781d30b523f398',
                               title: '这样的伦敦(上)',
                           },
                           {
                               img: 'http://book.ellabook.cn/c33cf360871e4507bf023a531a892f1b',
                               title: '也许的样子(上)',
                           },
                           {
                               img: 'http://book.ellabook.cn/B201801190002.png',
                               title: '我喜欢美好',
                           },
                           {
                               img: 'http://book.ellabook.cn/4f8e5cc88d2d4a0eaa781d30b523f398',
                               title: '这样的伦敦(上)',
                           },
                           {
                               img: 'http://book.ellabook.cn/c33cf360871e4507bf023a531a892f1b',
                               title: '也许的样子(上)',
                           },
                           {
                               img: 'http://book.ellabook.cn/B201801190002.png',
                               title: '我喜欢美好',
                           },
                           {
                               img: 'http://book.ellabook.cn/4f8e5cc88d2d4a0eaa781d30b523f398',
                               title: '这样的伦敦(上)',
                           }
                       ]
                   },
            ]
        }
    }
    setOneKV(k, v) {
        this.setState({
            [k]: v
        })
    }
    componentDidMount() {
      this.fetchDefaultData();
    }
    async fetchDefaultData() {
      var data = await fetch(getUrl.url, {
          method: 'POST',
          headers: {
              "Content-type": "application/x-www-form-urlencoded"
          },
          mode: 'cors',
          body: "method=ella.operation.HomePagePreview"+"&content=" +JSON.stringify({"platformCode":this.props.platformCode}) + commonData.dataString
      }).then(res => res.json());
      console.log(data);
        this.setState({
            carouselData: data.data.banner.map(item => {
                return {
                    img: item.bannerImageUrl
                }
            }),
            subjectData: data.data.subject.map(item => {
              return {
                  bgImageUpUrl: item.bgImageUpUrl,
                  subjectTitle: item.subjectTitle
              }
            }),
            remittanceData:data.data.daily.map((item,index)=>{
              return {
                dailyTitle:item.dailyTitle,
                dailyImg:item.dailyImg,
                dailyDesc:item.dailyDesc.length>80?item.dailyDesc.substring(0,80):item.dailyDesc,
                week:index==0?data.data.part.find(item => item.partStyle == "DAILY_BOOK").partTitle:'',
                more: index==0?data.data.part.find(item => item.partStyle == "DAILY_BOOK").targetDesc:'',

              }
            }),
            partData: data.data.part.map(item => {
              return {
                partStyle: item.partStyle,
                targetDesc: item.targetDesc,
                partTitle: item.partTitle,
                bannerImageUrl:item.bannerImageUrl,
                ads:item.ads,
                operateCopy:item.operateCopy,
                bgImageUpUrl:item.bgImageUpUrl,
                books: item.books.map(_item => {
                  return {
                    ossUrl: _item.ossUrl,
                    bookName: _item.bookName,
                    bookIntroduction: _item.bookIntroduction.length>43?_item.bookIntroduction.substring(0,43)+'...':_item.bookIntroduction,
                    bookScore:_item.bookScore,
                    coreTags:_item.coreTags,
                    authorName:_item.authorName
                  }
                }),
                courses:item.courses.map(_item => {
                  return {
                    ossUrl: _item.ossUrl,
                    bookName: _item.bookName,
                    bookIntroduction: _item.bookIntroduction.length>43?_item.bookIntroduction.substring(0,43)+'...':_item.bookIntroduction,
                    classHour:_item.classHour
                  }
                })
              };
            }),
            spinning: false
        },()=>{
          
        	if(this.state.carouselData.length!=0){
        		var swiper = new Swiper('.swiper-container',{
    					autoplay: false,
    					speed: 1000,
    					autoplayDisableOnInteraction: false,
    					loop: true,
    					centeredSlides: true,
    					slidesPerView: 2,
    					pagination: '.swiper-pagination',
    					paginationClickable: true,
    					onInit: function(swiper) {
    						swiper.slides[2].className = "swiper-slide swiper-slide-active";
    					},
    					breakpoints: {
    						668: {
    							slidesPerView: 1,
    						}
    					}
				    });
        	}
        	
        })
    }
    render() {
      const { remittanceData }=this.state;
      return <Spin spinning={this.state.spinning}>
                <div id='preview3'>
                  <div className="box3">
                	  <div className="innerwrap">
                      <div className="inner" >
                    	  <section class="pc-banner">
							            <div className="swiper-container">
								            <div className="swiper-wrapper">
									           {
										            this.state.carouselData.map((item,index) =>{
											
		                              return <div className={index==0?"swiper-slide swiper-slide-center none-effect":"swiper-slide"}>      
													          <img src={item.img} />
												            <div className="layer-mask"></div>
		                              </div>
		                                   
		                            })
									            }
								            </div>
								            <div className="swiper-pagination"></div>
							            </div>
						            </section>
                       	<div className="inner_title">
                          <div style={{width:999999}}>
                            {
                              this.state.subjectData.map(item =>
                                <div className="itempart">
                                  <img src={item.bgImageUpUrl} />
                                  <span>{item.subjectTitle}</span>
                                </div>
                              )
                            }
                          </div>
                        </div>       
                        <div className="remittance">
	                        <div className="remittance_title">
	                            <span className='week'>{remittanceData[0].week}</span>
	                            <span className='more'>{remittanceData[0].more}<Icon type="right" /></span>
	                        </div>
                          	<div className="remittanceAll">
                          
                      			<div className="remittanceItem">
                          			
                           	  		<div className="remittRightWrap">
                           	  			<span className="todayRecommend">今日推荐</span>
		                                <div className="remittRight">
		                              	  <h5>{remittanceData[0].dailyTitle}</h5>
		                              	  <p>{remittanceData[0].dailyDesc}</p>
		                                </div>
		                                <div className='imgWrap'>
		                                  <img src={remittanceData[0].dailyImg} alt="" />
		                                </div>
                              		</div>
                            	</div>
                            <div className="remittanceItem">
                              <div className="remittRightWrap">
                                <div className="remittRight">
                                  <h5>{this.state.remittanceData[1].dailyTitle}</h5>
                                  <p>{this.state.remittanceData[1].dailyDesc}</p>
                                </div>
                                <div className='imgWrap'>
                                  <img src={this.state.remittanceData[1].dailyImg} alt="" />
                                </div>
                              </div>
                            </div>
                            <div className="remittanceItem">
                              <div className="remittRightWrap">
                                <div className="remittRight">
                                  <h5>{this.state.remittanceData[2].dailyTitle}</h5>
                                  <p>{this.state.remittanceData[2].dailyDesc}</p>
                                </div>
                                <div className='imgWrap'>
                                  <img src={this.state.remittanceData[2].dailyImg} alt="" />
                                </div>
                              </div>

                            </div>
                          
                          </div>
                        </div>
                        <div className="partData">
                          {
                            this.state.partData.map((item,index)=>{
                              switch (item.partStyle                                                                                   ) {
                                case 'IMAGE_TEXT':
                                    return (
                                      <div className="partItem">
                                        <div className="partItem_title">
                                          <span className='partTitle'>{item.partTitle}</span>
                                          <span className='more'>{item.targetDesc}<Icon type="right" style={{color:"#ccc"}} /></span>
                                        </div>
                                        
                                        <div className="book_image_text">
                                          <div style={{width:999999}}>
                                            {
                                              item.books.map(item2=>{
                                                //创造一个长度为n值为下标的数组
                                                const curscore=[...Array(Math.floor(item2.bookScore)).keys()];
                                                const curscore2=[...Array(Math.ceil(item2.bookScore)-Math.floor(item2.bookScore)).keys()];
                                                console.log(curscore)
                                                console.log(curscore2)
                                                return <div className="bookItem">
                                                  <img src={item2.ossUrl} className="bookImgCover"/>
                                                  <div className="bookItemRight">
                                                    <h5>{item2.bookName}</h5>
                                                    <div className="grade">
                                                        {
                                                          curscore.map(item=>{
                                                            console.log(1)
                                                            return <img className="star" src={star1} />
                                                          })
                                                          
                                                        }
                                                        {
                                                          curscore2.map(item=>{
                                                            return <img className="star" src={star2} />
                                                          })
                                                        }
                                                        <div className="score">{item2.bookScore}</div>
                                                    </div>
                                                    <p>{item2.bookIntroduction}</p>
                                                  </div>
                                                </div>
                                              })
                                          
                                            }
                                          </div>
                                        </div>
                                       {
                                        item.ads.length!=0?<div className="ad_banner">
                                          <img src={item.ads[0].hdImageUrl} className="ad_bannerImg"/>
                                      </div>:null
                                      }
                                      </div>
                                    );
                                    case 'SVIP':
                                    return (
                                      <div className="partItem">
                                        <div className="partItem_title">
                                          <span className='partTitle'>{item.partTitle}</span>
                                          <span style={{"color":"#999"}}>&nbsp;&nbsp;&nbsp;{item.operateCopy}</span>
                                          <span className='more'>{item.targetDesc}<Icon type="right" style={{color:"#ccc"}} /></span>
                                        </div>
                                        
                                        <div className="book_image_text">
                                          
                                          <div className="bookItem">
                                           <img src={item.bgImageUpUrl} style={{"width":"329px","height":"246px","marginRight":"20px"}}/>
                                          
                                          </div>
                                            {
                                              item.books.map(item2=>{
                                                //创造一个长度为n值为下标的数组
                                                return <div className="bookItem">
                                                  <img src={item2.ossUrl} className="bookImgCover"/>
                                                  <div className="bookItemRight">
                                                    <h5>{item2.bookName}</h5>
                                                    <p>{item2.bookIntroduction}</p>
                                                    <button className="freeRead">免费看</button>
                                                  </div>
                                                </div>
                                              })
                                          
                                            }
                                          
                                        </div>
                                       {
                                        item.ads.length!=0?<div className="ad_banner">
                                          <img src={item.ads[0].hdImageUrl} className="ad_bannerImg"/>
                                      </div>:null
                                      }
                                      </div>
                                    );      
                                case 'SLIDE_PORTRAIT':
                                  return (
                                    <div className="partItem">
                                      <div className="partItem_title">
                                        <span className='partTitle'>{item.partTitle}</span>
                                        <span className='more'>{item.targetDesc}<Icon type="right" style={{color:"#ccc"}} /></span>
                                      </div>
                                      {item.courses.length!=0?<div className="course_vertical">
                                        <div style={{width:999999}}>
                                          {
                                            item.courses.map(item2=>{

                                              return <div className="courseItem">
                                                <img src={item2.ossUrl} className="courseImgCover"/>
                                                <h5>{item2.bookName}</h5>
                                                <span>{item2.classHour}课时</span>
                                                <p>{item2.bookIntroduction}</p>
                                                
                                              </div>
                                            })
                                        
                                          }
                                        </div>
                                      </div>:null
                                      }
                                      {item.books.length!=0?<div className="book_vertical">
                                        
                                        {
                                          item.books.map(item2=>{

                                            return <div className="bookItem">
                                              <img src={item2.ossUrl} className="bookImgCover"/>
                                              <h5>{item2.bookName}</h5>
                                            </div>
                                          })
                                      
                                        }
                                       
                                      </div>:null
                                      }
                                      {
                                         item.ads.length!=0?<div className="ad_banner">
                                          <img src={item.ads[0].hdImageUrl} className="ad_bannerImg"/>
                                      </div>:null
                                      }
                                    </div>
                                
                                  );
                                case 'SLIDE_HORIZONTAL':
                                  return (
                                    <div className="partItem">
                                      <div className="partItem_title">
                                        <span className='partTitle'>{item.partTitle}</span>
                                        <span className='more'>{item.targetDesc}<Icon type="right" style={{color:"#ccc"}} /></span>
                                      </div>
                                      {item.courses.length!=0?<div className="course_horizontal">
                                          <div style={{width:999999}}>
                                            {
                                              item.courses.map(item2=>{
                                                
                                                return <div className="courseItemHori">
                                                  <div style={{"height":"185px","overflow":"hidden"}}>
                                                    <img src={item2.ossUrl} className="courseImgCover"/>
                                                  </div>
                                                  <h5>{item2.bookName}</h5>
                                                  <span>{item2.classHour}课时</span>
                                                  <p>{item2.bookIntroduction}</p>
                                                  
                                                </div>
                                              })
                                          
                                            }
                                          </div>
                                        </div>
                                        :null
                                      }
                                      {item.books.length!=0?<div className="book_horizontal">
                                          
                                        {
                                          item.books.map(item2=>{
                                           
                                            const coreTags=item2.coreTags!=null?item2.coreTags.split(","):[];
                                            console.log(coreTags)
                                            return <div className="bookItemHori">
                                              
                                              <img src={item2.ossUrl} className="bookImgCover"/>
                                              <div className="bookHoriRight">
                                                <h5>{item2.bookName}</h5>
                                               	<p className="authorName">{item2.authorName}</p>
                                                <p>{item2.bookIntroduction}</p>
                                                <div className="coreTags">
                                                  {
                                                    coreTags.map((item3,index)=>{
                                                      if(index>2){
                                                        return;
                                                      }
                                                      return <div className="itemTag">{item3}</div>
                                                    })
                                                  }
                                                </div>
                                                <button>立即阅读</button>
                                                <span>会员免费借阅</span>
                                              </div>
                                            </div>
                                          })
                                      
                                        }
                                          
                                        </div>
                                        :null
                                      }
                                      {
                                         item.ads.length!=0?<div className="ad_banner">
                                          <img src={item.ads[0].hdImageUrl} className="ad_bannerImg"/>
                                      </div>:null
                                      }
                                     
                                    </div>
                                  );
                                  case 'AD_SINGLE':
                                  return (
                                      item.bannerImageUrl!=''?<div className="partItem">
                                        <div className="ad_banner">
                                          <img src={item.bannerImageUrl} className="ad_bannerImg"/>
                                      </div>
                                      </div>:null
                                       
                                  )
                              }          

                            })
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Spin>
            }
}