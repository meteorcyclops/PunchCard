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
            schedule_list: 
            [
                {
                    date:'20171214',
                    time:'1600',
                    status:'表訂上班時間',
                    from: ''
                },
                {
                    date:'20171214',
                    time:'0000',
                    status:'表訂下班時間',
                    from: ''
                },
                {
                    date:'20171215',
                    time:'1600',
                    status:'表訂上班時間',
                    from: ''
                },
                {
                    date:'20171215',
                    time:'0000',
                    status:'表訂下班時間',
                    from: ''
                },
                {
                    date:'20171216',
                    time:'1600',
                    status:'表訂上班時間',
                    from: ''
                },
                {
                    date:'20171216',
                    time:'0000',
                    status:'表訂下班時間',
                    from: ''
                }
            ],
            punch_list: [
                {
                    data_type : "1",
                    card_onoff: "1",
                    card_from: "ip",
                    card_date: '20171215',
                    card_time: "1530"
                },
                {
                    data_type : "1",
                    card_onoff: "9",
                    card_from: "ip",
                    card_date: '20171216',
                    card_time: "0030"
                },
                {
                    data_type : "1",
                    card_onoff: "1",
                    card_from: "ip",
                    card_date: '20171216',
                    card_time: "1533"
                },
                {
                    data_type : "1",
                    card_onoff: "9",
                    card_from: "ip",
                    card_date: '20171217',
                    card_time: "0033"
                },
            ], //首頁的每一列打卡記錄(多天)
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



        //跨日班表會爆炸！
        // this.getDataFrom(twoMonthsAgo);
        // this.getPage1From(twoMonthsAgo);
        this.showDetailOfDay('20171215');
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
     //先移到別的地方
        let tmp_time_list = [];
        console.log('punch list:',this.state.punch_list);

        let on_time = null;
        let off_time = null;
        for(let i=0;i<this.state.schedule_list.length; i++){
            if(this.state.schedule_list[i].date === date){
                if(this.state.schedule_list[i].status==='表訂上班時間'){
                    on_time = this.state.schedule_list[i].time;
                }
                if(this.state.schedule_list[i].status==='表訂下班時間'){
                    off_time = this.state.schedule_list[i].time;
                }
            }
        }

        if(off_time > on_time){
            console.log('為正常班:');
            let record_list = _.filter(this.state.punch_list, (n) => {
                if (n.card_date === date) {
                    return n;
                }
            });
            //record_list: 整理後的打卡記錄
            console.log('今天的記錄:',record_list);

            //把此天的打卡記錄寫入 tmp_time_list 中
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

            //抓當天班表
            _.filter(this.state.schedule_list, (el)=>{
                if(el.date === date){
                    tmp_time_list.push(el);                   
                }
            });


            //依時間，從早到晚排序
            tmp_time_list = _.sortBy(tmp_time_list, ['time']);
            //time_list: 打卡記錄 + 班表 融合


            this.setState({ time_list: tmp_time_list, open_dialog: true });


        }else{
            // console.log('為跨日班:');
            // console.log('on_time:',on_time);
            // console.log('off_time:',off_time);

            const nextDate = moment(date, 'YYYYMMDD').add(1, 'days').format("YYYYMMDD");
 
            // 把 date 以前3小時的"上班"都抓出來，以及 nextDate下班的4小時內也抓出來
            // 決定不做這些事。有隱藏的危險。跨日班，就直接顯示2天的打卡。
            // const on_time_moment = moment(date+ on_time, "YYYYMMDDHHmm");
            // const get3hoursFromOnTimeMoment = moment(on_time_moment).subtract(3,'hours').format('YYYYMMDDHHmm');
            // console.log('最早上班打卡時間:',get3hoursFromOnTimeMoment);
            // const off_time_moment = moment(date + off_time, "YYYYMMDDHHmm").add(1, 'days');
            // const get4HoursAfterOffTimeMoment = moment(off_time_moment).add(4, 'hours').format("YYYYMMDDHHmm");
            // console.log('最晚下班打卡時間:',get4HoursAfterOffTimeMoment);


            let record_list = _.filter(this.state.punch_list, (n) => {
                if (  n.card_date === date || n.card_date === nextDate ) {
                    return n;
                }
            });
            //record_list: 整理後的打卡記錄
            console.log('這此上班的記錄:',record_list);
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

            //抓當天班表
            //疑問：16:00~隔天0:00這種班表，在隔天的日期，還是會顯示前1天的日期。要確認其他超過0:00的，會不會跳日期。
            //例如此個案班表： date:20171215 1600班表上班、 20171216 00:00班表下班 (到了零晨沒有自動加1天)
            _.filter(this.state.schedule_list, (el)=>{
                if(el.date === date){
                    tmp_time_list.push(el);                   
                }
            });


        //依時間，從早到晚排序
        tmp_time_list = _.sortBy(tmp_time_list, ['date', 'time']);
        console.log('tmp_time_list:',tmp_time_list);

        this.setState({ time_list: tmp_time_list, open_dialog: true });

        }

    } // end of showDetailOfDay

    handleRequestClose = () => {
        this.setState({ open_dialog: false });
    }

    getPage1From = (minDate)=>{
        const schedule_list =[];
        const schedule_uri = "https://staff.kfsyscc.org/hrapi/card/";
        fetch(schedule_uri, {
            method: "POST",
            headers: new Headers({ 'Accept': 'application/json' }),
            body: JSON.stringify({
                "username": this.state.username,
                "password": this.state.password,
                "minDate": minDate,
                "api": "getScheList" //取得班表
            })
        })
        .then((res) => {
            return res.json();
        })
        .then(result=>{
            if (result.status === true) {
                result.data.forEach(element => {

                    schedule_list.push({
                        date: element.sch_date.toString(),
                        time: element.on_time,
                        status: '表訂上班時間',
                        from: ''
                    });
                    schedule_list.push({
                        date: element.sch_date.toString(),
                        time: element.off_time,
                        status: '表訂下班時間',
                        from: ''
                    });

                });
                console.log('先抓到班表:',schedule_list);

                ////////////////////////
                //接下來抓打卡記錄
                ////////////////////////
                const punch_uri = "https://staff.kfsyscc.org/hrapi/card/";
                fetch(punch_uri, {
                    method: "POST",
                    headers: new Headers({ 'Accept': 'application/json' }),
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

                            console.log('打卡記錄punch_list:',order_data);

                            //state.punch_list 有資料後，Rows就會開始顯示
                            this.setState({
                                punch_list: order_data,
                                schedule_list: schedule_list
                            });

                        } else {
                            throw data.err;
                        }

                    })
                    .catch((err) => {
                        console.warn('呼叫API：https://staff.kfsyscc.org/hrapi/card/，函數:getPunchList 發生錯誤：', err);
                        alert('伺服器回報錯誤.\n\n請使用院內網路。\n\n可能的問題：' + err);
                    })

            ///////// 打卡記錄end




            }

        })
        .catch((err) => {
            console.warn('呼叫API：https://staff.kfsyscc.org/hrapi/card/，函數:getSchedultList 發生錯誤：', err);
            alert('伺服器回報錯誤.\n\n請使用院內網路。\n\n可能的問題：' + err);
        })

    }






    getDataFrom__old = (minDate) => {
       



        const uri = "https://staff.kfsyscc.org/hrapi/card/";
        fetch(uri, {
            method: "POST",
            headers: new Headers({ 'Accept': 'application/json' }),
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
                console.log('====================================');
                console.log('所有記錄:', data.data);
                console.log('====================================');
                
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
                alert('伺服器回報錯誤.\n\n請使用院內網路。\n\n可能的問題：' + err);
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
                        formatDate={this.getFormateMonthDate}
                    />

                    <Rows
                        punch_list={this.state.punch_list}
                        schedule_list={this.state.schedule_list}
                        AttendanceRecord={this}
                        showDetailOfDay={this.showDetailOfDay} />
                    
                </div>
            </div>


        );
    }
}

export default AttendanceRecord;
