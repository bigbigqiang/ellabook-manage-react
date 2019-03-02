import React from 'react'
import './days.css';

export default class daysH5 extends React.Component {
    componentWillMount() {
        document.documentElement.style.fontSize = document.documentElement.clientWidth / 20 + 'px';
        document.title = "每日读绘本";
    }
    render() {
        // console.log("bookList123456"+JSON.stringify((this.props.bookList[0].tags.split(','))))
        return (
            <div id="wrapper">
                <div className="wrapperBg">
                    <div className="wrapperCon">
                        <div className="container">

                            <header className="title">{this.props.dailyTitle}</header>
                            <figure>
                                <span className="time">{this.props.effectDate}</span>
                                <span className="author">{this.props.authorName}</span>
                            </figure>
                            <article>
                                <section className="cover">
                                    {
                                        this.props.isInsert ? <img className="coverImg" src={this.props.dailyImg} alt="推荐图书" /> : <div></div>
                                    }
                                </section>
                                <section className="content">
                                    {
                                        <div dangerouslySetInnerHTML={{ __html: decodeURIComponent(this.props.dailyContent) }} />
                                    }

                                </section>
                                <section className="recommend">
                                    <ul>
                                        {this.props.bookList !== 'undefined' ? this.props.bookList.map((item, i) => {
                                            if (item == undefined) {
                                                return null
                                            }
                                            return <li className="item" key={i}>
                                                <a className="clearfix" >
                                                    <img className="bookCover" src={item.bookResourceList[0].ossUrl} alt="推荐图书" />
                                                    <div className="bookRight">
                                                        <h3 className="titleH3">{item.bookName}</h3>
                                                        <div className='label'>
                                                            {
                                                                item.tags ? item.tags.split(',').map(item => {
                                                                    return <span>{item}</span>
                                                                }) : []
                                                            }
                                                        </div>
                                                        <p className="synopsis">{item.bookIntroduction}</p>
                                                        <span className="details">立即购买</span>
                                                    </div>
                                                </a>
                                            </li>
                                        }) : null}
                                    </ul>
                                </section>
                            </article>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
