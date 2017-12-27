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
            schedule_list: [
                {
                    "sch_date":'20171214',
                    "on_time": "1600",
                    "off_time": "0000",
                },
                {
                    "sch_date":'20171215',
                    "on_time": "1600",
                    "off_time": "0000",
                },
                {
                    "sch_date":'20171216',
                    "on_time": "1600",
                    "off_time": "0000",
                },
                {
                    "sch_date":'20171217',
                    "on_time": "0000",
                    "off_time": "0000",
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
            time_list: [],
            cross_day_work: false
        }
    }

    componentWillMount() {

        //抓最近2個月的打卡記錄
        // let twoMonthsAgo = moment().subtract(2, 'years').format('YYYYMMDD');
        let twoMonthsAgo = moment().subtract(2, 'months').format('YYYYMMDD');

        //跨日班表會爆炸！
        // this.getPunchList(twoMonthsAgo);
        // this.getScheduleList(twoMonthsAgo)

        this.showDetailOfDay(this.state.punch_list[0]);
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

    getScheduleList = (minDate) =>{
        const uri = "https://staff.kfsyscc.org/hrapi/card/";
        fetch(uri, {
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
            .then((result) => {
                if (result.status === true) {
                    this.setState({schedule_list: result.data});
                }
            })
            .catch(err=>{
                console.log('讀取班表發生錯誤:',err);
            })
        
    }

    showDetailOfDay = (punch) => {
        console.log('按了detail:',punch);
        //先判斷 punch 所屬的班表，是否為跨日
        let database_schedule_obj = null;
        //取得點擊的打卡時間，所屬的班表區段  (依點擊的是上班or下班，有不同天的取消)
        if(punch.card_onoff === "1" || punch.card_onoff === "2"){
            //if 按上班

            //從schedule_list 裡取得跟 punch 那天一樣的班表
            database_schedule_obj = (this.state.schedule_list.filter((el)=>el.sch_date === punch.card_date))[0];
            //此次區段的上下班時段(from 資料庫)


        }else{
            // 按下班
            //從schedule_list 裡取得跟 punch 前1天的班表
            database_schedule_obj = (this.state.schedule_list.filter((el)=>{
                if(el.sch_date ===  moment(punch.card_date, "YYYYMMDD").subtract(1, 'days').format("YYYYMMDD")){
                    return true;
                }
            }))[0];//此次區段的上下班時段(from 資料庫)
        }


        let graphic_time_list = []
        //從 schedule_list 判斷是不是「跨日班」
        if( parseInt(database_schedule_obj.on_time) > parseInt(database_schedule_obj.off_time) ){
            console.log('為跨日班:');
            //跨日班
            if(punch.card_onoff === "1" || punch.card_onoff === "2"){
                //if 按的是上班


                let schedule_on = moment(database_schedule_obj.sch_date + database_schedule_obj.on_time, "YYYYMMDDHHmm");
                let schedule_off = moment(database_schedule_obj.sch_date + database_schedule_obj.off_time, "YYYYMMDDHHmm").add(1, 'days');
                let next_schedule_on = moment(database_schedule_obj.sch_date + database_schedule_obj.on_time, "YYYYMMDDHHmm").add(1, 'days');
                let prev_schedule_off = moment(database_schedule_obj.sch_date + database_schedule_obj.off_time, "YYYYMMDDHHmm");


                let graphic_time_list = [];

                //把此次上下班班表加入 graphic_time_list 裡
                graphic_time_list.push({
                    date: schedule_on.format("YYYYMMDD"),
                    time: schedule_on.format("HHmm"),
                    status: "表訂上班時間",
                    from: ''
                });
                graphic_time_list.push({
                    date: schedule_off.format("YYYYMMDD"),
                    time: schedule_off.format("HHmm"),
                    status: "表訂下班時間",
                    from: ''
                });


                let result1 = this.state.punch_list.filter(el=>{

                    if( 
                        (moment(el.card_date + el.card_time, "YYYYMMDDHHmm") > prev_schedule_off &&
                        moment(el.card_date + el.card_time, "YYYYMMDDHHmm") < schedule_on &&
                        (el.card_onoff === "1" || el.card_onoff === "2")) ||

                        (moment(el.card_date + el.card_time, "YYYYMMDDHHmm") < next_schedule_on &&
                        moment(el.card_date + el.card_time, "YYYYMMDDHHmm") > schedule_off &&
                        (el.card_onoff === "9" || el.card_onoff === "3")) ||


                        (moment(el.card_date + el.card_time, "YYYYMMDDHHmm") > schedule_on &&
                        moment(el.card_date + el.card_time, "YYYYMMDDHHmm") < schedule_off) 
                    ){
                        return true;
                    }
                })

                result1.forEach(el=>{
                    let statusText = '';
                    switch(el.card_onoff){
                        case '1':
                            statusText = '上班';
                            break;
                        case '9':
                            statusText = '下班';
                            break;
                        case '2':
                            statusText = '緊急上班';
                            break;
                        case '3':
                            statusText = '緊急下班';
                            break;
                        default:
                            statusText = '';
                    }


                    graphic_time_list.push({
                        date: el.card_date,
                        time: el.card_time,
                        status: statusText,
                        from: el.card_from
                    });
                })

                graphic_time_list = _.sortBy(graphic_time_list, ['date', 'time']);
                console.log('有班表的graphic_time_list:',graphic_time_list);
                this.setState({ time_list: graphic_time_list, open_dialog: true, cross_day_work:true });

            }else if(punch.card_onoff === "9" || punch.card_onoff === "3"){
                //if(按的是下班)

                let schedule_on = moment(database_schedule_obj.sch_date + database_schedule_obj.on_time, "YYYYMMDDHHmm");
                let schedule_off = moment(database_schedule_obj.sch_date + database_schedule_obj.off_time, "YYYYMMDDHHmm").add(1, 'days');

                let next_schedule_on = moment(punch.card_date + database_schedule_obj.on_time, "YYYYMMDDHHmm");
                let prev_schedule_off = moment(database_schedule_obj.sch_date + database_schedule_obj.off_time, "YYYYMMDDHHmm");

                let graphic_time_list = [];

                //把此次上下班班表加入 graphic_time_list 裡
                graphic_time_list.push({
                    date: schedule_on.format("YYYYMMDD"),
                    time: schedule_on.format("HHmm"),
                    status: "表訂上班時間",
                    from: ''
                });
                graphic_time_list.push({
                    date: schedule_off.format("YYYYMMDD"),
                    time: schedule_off.format("HHmm"),
                    status: "表訂下班時間",
                    from: ''
                });

                let result1 = this.state.punch_list.filter(el=>{
                    if( 
                        (moment(el.card_date + el.card_time, "YYYYMMDDHHmm") > prev_schedule_off &&
                        moment(el.card_date + el.card_time, "YYYYMMDDHHmm") < schedule_on &&
                        (el.card_onoff === "1" || el.card_onoff === "2")) ||

                        (moment(el.card_date + el.card_time, "YYYYMMDDHHmm") < next_schedule_on &&
                        moment(el.card_date + el.card_time, "YYYYMMDDHHmm") > schedule_off &&
                        (el.card_onoff === "9" || el.card_onoff === "3")) ||


                        (moment(el.card_date + el.card_time, "YYYYMMDDHHmm") > schedule_on &&
                        moment(el.card_date + el.card_time, "YYYYMMDDHHmm") < schedule_off) 
                    ){
                        return true;
                    }
                });                    

                // console.log('相關的打卡記錄:',result1);
                result1.forEach(el=>{
                    let statusText = '';
                    switch(el.card_onoff){
                        case '1':
                            statusText = '上班';
                            break;
                        case '9':
                            statusText = '下班';
                            break;
                        case '2':
                            statusText = '緊急上班';
                            break;
                        case '3':
                            statusText = '緊急下班';
                            break;
                        default:
                            statusText = '';
                    }


                    graphic_time_list.push({
                        //因為跨日，所以 date 要加1
                        date: el.card_date,
                        time: el.card_time,
                        status: statusText,
                        from: el.card_from
                    });
                })
                graphic_time_list = _.sortBy(graphic_time_list, ['date', 'time']);
                console.log('最後graphic_time_list:',graphic_time_list);
                this.setState({ time_list: graphic_time_list, open_dialog: true, cross_day_work:true });
                
                

            }
        }else{
            console.log('為正常班');
            //正常班
        }
        // let tmp_time_list = [];

        // //取得 on_time 和 off_time 以判斷是否為「跨日班」
        // let on_time = null;
        // let off_time = null;
        // for(let i=0;i<this.state.schedule_list.length; i++){
        //     if(this.state.schedule_list[i].date === date){
        //         if(this.state.schedule_list[i].status==='表訂上班時間'){
        //             on_time = this.state.schedule_list[i].time;
        //         }
        //         if(this.state.schedule_list[i].status==='表訂下班時間'){
        //             off_time = this.state.schedule_list[i].time;
        //         }
        //     }
        // }
        

        // if(off_time > on_time){
        //     //為正常班
        //     let record_list = _.filter(this.state.punch_list, (n) => {
        //         if (n.card_date === date) {
        //             return n;
        //         }
        //     });
        //     //record_list: 整理後的打卡記錄

        //     //把此天的打卡記錄寫入 tmp_time_list 中
        //     record_list.forEach((ele) => {
        //         let tmp_status = '';
        //         if (ele.card_onoff === '1') {
        //             tmp_status = '上班';
        //         } else if (ele.card_onoff === '9') {
        //             tmp_status = '下班';
        //         } else if (ele.card_onoff === '3') {
        //             tmp_status = '緊急下班';
        //         } else if (ele.card_onoff === '2') {
        //             tmp_status = '緊急上班';
        //         } else {
        //             tmp_status = ele.card_onoff;
        //         }


        //         tmp_time_list.push({
        //             date: ele.card_date,
        //             time: ele.card_time,
        //             status: tmp_status,
        //             from: ele.card_from
        //         })
        //     })

        //     //抓當天班表
        //     _.filter(this.state.schedule_list, (el)=>{
        //         if(el.date === date){
        //             tmp_time_list.push(el);                   
        //         }
        //     });


        //     //依時間，從早到晚排序
        //     tmp_time_list = _.sortBy(tmp_time_list, ['time']);
        //     //time_list: 打卡記錄 + 班表 融合


        //     this.setState({ time_list: tmp_time_list, open_dialog: true, cross_day_work:false });


        // }else{
        //     //為跨日班

        //     const nextDate = moment(date, 'YYYYMMDD').add(1, 'days').format("YYYYMMDD");
 
        //     // 把 date 以前3小時的"上班"都抓出來，以及 nextDate下班的4小時內也抓出來
        //     // 決定不做這些事。有隱藏的危險。跨日班，就直接顯示2天的打卡。
        //     // const on_time_moment = moment(date+ on_time, "YYYYMMDDHHmm");
        //     // const get3hoursFromOnTimeMoment = moment(on_time_moment).subtract(3,'hours').format('YYYYMMDDHHmm');
        //     // console.log('最早上班打卡時間:',get3hoursFromOnTimeMoment);
        //     // const off_time_moment = moment(date + off_time, "YYYYMMDDHHmm").add(1, 'days');
        //     // const get4HoursAfterOffTimeMoment = moment(off_time_moment).add(4, 'hours').format("YYYYMMDDHHmm");
        //     // console.log('最晚下班打卡時間:',get4HoursAfterOffTimeMoment);


        //     let record_list = _.filter(this.state.punch_list, (n) => {
        //         if (  n.card_date === date || n.card_date === nextDate ) {
        //             return n;
        //         }
        //     });
        //     //record_list: 整理後的打卡記錄

        //     record_list.forEach((ele) => {
        //         let tmp_status = '';
        //         if (ele.card_onoff === '1') {
        //             tmp_status = '上班';
        //         } else if (ele.card_onoff === '9') {
        //             tmp_status = '下班';
        //         } else if (ele.card_onoff === '3') {
        //             tmp_status = '緊急下班';
        //         } else if (ele.card_onoff === '2') {
        //             tmp_status = '緊急上班';
        //         } else {
        //             tmp_status = ele.card_onoff;
        //         }

        //         tmp_time_list.push({
        //             date: ele.card_date,
        //             time: ele.card_time,
        //             status: tmp_status,
        //             from: ele.card_from
        //         })

        //     })

        //     //抓當天班表
        //     //疑問：16:00~隔天0:00這種班表，在隔天的日期，還是會顯示前1天的日期。要確認其他超過0:00的，會不會跳日期。
        //     //例如此個案班表： date:20171215 1600班表上班、 20171216 00:00班表下班 (到了零晨沒有自動加1天)
        //     _.filter(this.state.schedule_list, (el)=>{
        //         if(el.date === date){
        //             tmp_time_list.push(el);                   
        //         }
        //     });


        // //依時間，從早到晚排序
        // tmp_time_list = _.sortBy(tmp_time_list, ['date', 'time']);

        // this.setState({ time_list: tmp_time_list, open_dialog: true, cross_day_work:true });

        // }

    } // end of showDetailOfDay

    handleRequestClose = () => {
        this.setState({ open_dialog: false });
    }

    
    getPunchList = (minDate) => {
       
        //只抓一支api的函數。先留著。


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
                if (data.status === true) {

                    let ordered_punch_list = _.orderBy(data.data, ['card_date', 'card_time'], ['desc', 'desc']);

                    //state.punch_list 有資料後，Rows就會開始顯示
                    this.setState({
                        punch_list: ordered_punch_list
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
                        cross_day_work={this.state.cross_day_work}
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
