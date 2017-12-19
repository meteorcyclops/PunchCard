import React, { Component } from 'react';
import moment from 'moment';
import _ from 'lodash';
import PopUpDialog from './PopUpDialog';
import Rows from './Rows';

import bookStore from '../stores/book'
import FontAwesome from 'react-fontawesome';
import '../css/AttendanceRecord.css';

const styles = {
    button: {
        background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
        borderRadius: 3,
        border: 0,
        color: 'white',
        height: 48,
        padding: '0 30px',
        boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .30)',
    }
}

class AttendanceRecord extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: bookStore.uid,
            password: bookStore.pwd,
            punch_list: [], //首頁的每一列打卡記錄(多天)
            open_dialog: false,

            dialog_title: '',
            dialog_content: '',
            time_list: []
        }
    }

    componentWillMount() {

        //抓最近2個月的打卡記錄
        // let twoMonthsAgo = moment().subtract(2, 'years').format('YYYYMMDD');
        let twoMonthsAgo = moment().subtract(2, 'months').format('YYYYMMDD');
        // let twoMonthsAgo = moment().subtract(7, 'days').format('YYYYMMDD');
        this.getDataFrom(twoMonthsAgo);
    }

    getFormateYear = (rawDate) => {
        let d = new moment(rawDate, "YYYYMMDD");
        return d.format('YYYY');
    }

    getFormateMonthDate = (rawDate) => {
        let d = new moment(rawDate, "YYYYMMDD");
        return d.format('MM/DD');
    }

    getFormateTime = (rawTime) => {
        let d = new moment(rawTime, "HHmm");
        return d.format('HH:mm');
    }

    showDetailOfDay = (date) => {
        let year = this.getFormateYear(date);
        let monthNdate = this.getFormateMonthDate(date);
        this.setState({
            dialog_title: year + '/' + monthNdate + '打卡記錄',
            time_list: []
        });

        let tmp_time_list = [];

        const uri = "https://staff.kfsyscc.org/hrapi/card/";
        fetch(uri, {
            method: "POST",
            body: JSON.stringify({
                "username": this.state.username,
                "password": this.state.password,
                "minDate": date,
                "api": "getScheList" //取得班表
            })
        })
            .then((res) => {
                return res.json();
            })
            .then((result) => {

                //取得上下班表訂時間
                let on_time = '';
                let off_time = '';
                if (result.status === true) {
                    result.data.forEach(element => {
                        if (element.sch_date === date) {
                            on_time = element.on_time;
                            off_time = element.off_time;
                        }

                    });

                    tmp_time_list.push({
                        date: date.toString(),
                        time: on_time,
                        status: '表訂上班時間',
                        from: ''
                    });
                    tmp_time_list.push({
                        date: date.toString(),
                        time: off_time,
                        status: '表訂下班時間',
                        from: ''
                    });


                    //查打卡記錄
                    const record_url = "https://staff.kfsyscc.org/hrapi/card/";
                    fetch(record_url, {
                        method: "POST",
                        body: JSON.stringify({
                            "username": this.state.username,
                            "password": this.state.password,
                            "minDate": date,
                            "api": "getPunchList"
                        })
                    })
                        .then((res) => {
                            return res.json();
                        })
                        .then((result) => {
                            if (result['status'] === true) {


                                let record_list = _.filter(result['data'], (n) => {
                                    if (n.card_date === date) {
                                        return n;
                                    }
                                });
                                //record_list: 整理後的打卡記錄


                                record_list.forEach((ele) => {
                                    let tmp_status = '';
                                    if (ele.card_onoff === '1') {
                                        tmp_status = '上班';
                                    } else if (ele.card_onoff === '9') {
                                        tmp_status = '下班';
                                    } else if (ele.card_onoff === '3') {
                                        tmp_status = '緊急下班';
                                    } else if (ele.card_onoff === '2') {
                                        tmp_status = '緊急上班';
                                    } else {
                                        tmp_status = ele.card_onoff;
                                    }


                                    tmp_time_list.push({
                                        date: ele.card_date,
                                        time: ele.card_time,
                                        status: tmp_status,
                                        from: ele.card_from
                                    })

                                })
                                //time_list: 打卡記錄 + 班表 融合


                                //依時間，從早到晚排序
                                tmp_time_list = _.sortBy(tmp_time_list, ['time']);


                                this.setState({ time_list: tmp_time_list });

                            } else {
                                throw result['err'];
                            }
                        })
                        .catch((err) => {
                            console.warn('呼叫API：https://staff.kfsyscc.org/hrapi/card/，函數:getPunchList 發生錯誤：', err);
                            alert('伺服器回報錯誤.\n\n可能的問題：' + err);
                        });


                } else {
                    throw result.err;
                    // this.setState({dialog_content: "出現問題了" });
                }
            })
            .catch((err) => {
                console.warn('呼叫API：https://staff.kfsyscc.org/hrapi/card/，函數:getScheList 發生錯誤：', err);
                alert('伺服器回報錯誤.\n\n可能的問題：' + err);
            });



        //顯示dialog
        this.setState({ open_dialog: true })


        ////////////////////// showDetailOfDay //////////////////////////////////////////////////
    } // end of showDetailOfDay

    handleRequestClose = () => {
        this.setState({ open_dialog: false });
    }



    getDataFrom = (minDate) => {
        
        const uri = "https://staff.kfsyscc.org/hrapi/card/";
        fetch(uri, {
            method: "POST",
            body: JSON.stringify({
                "username": this.state.username,
                "password": this.state.password,
                "minDate": minDate,	//從minDate這一天抓到最新的資料
                "api": "getPunchList"
            })
        })
            .then((res) => {
                return res.json();
            })
            .then((data) => {

                if (data.status === true) {

                    var order_data = _.orderBy(data.data, ['card_date', 'card_time'], ['desc', 'desc']);

                    //state.punch_list 有資料後，Rows就會開始顯示
                    this.setState({
                        punch_list: order_data
                    });

                } else {
                    throw data.err;
                }

            })
            .catch((err) => {
                console.warn('呼叫API：https://staff.kfsyscc.org/hrapi/card/，函數:getPunchList 發生錯誤：', err);
                alert('伺服器回報錯誤.\n\n可能的問題：' + err);
            })
    } //end of getData




    render() {
        return (
            <div className="kfcc_background" style={styles.bg_img_style}>
                <div className="ar_for-the-overlay">
                    <span>
                        <div className="hint" >
                        <FontAwesome name='times-circle' 
                            size='lg' 
                            style={{ color: 'white', position:'absolute', left:'20px', cursor: 'pointer' }} 
                            onClick={()=>{bookStore.setObs('recordPageOpen', false)}}
                        />
                            {this.state.username} 的打卡紀錄
                        </div>
                    </span>
                    <PopUpDialog
                        open={this.state.open_dialog}
                        onRequestClose={this.handleRequestClose}
                        title={this.state.dialog_title}
                        time_list={this.state.time_list}
                        formatTime={this.getFormateTime}
                    />

                    <Rows
                        punch_list={this.state.punch_list}
                        AttendanceRecord={this}
                        showDetailOfDay={this.showDetailOfDay} />
                    
                </div>
            </div>


        );
    }
}

export default AttendanceRecord;
