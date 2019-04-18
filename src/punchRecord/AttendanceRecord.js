import React, { Component } from 'react';
import moment from 'moment';
import _ from 'lodash';
import PopUpDialog from './PopUpDialog';
import Rows from './Rows';

import bookStore from '../stores/book'
import changePasswdStore from '../stores/ChangePasswdStore';
import ChangePwd from '../changePasswd/ChangePwd';

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
            schedule_list: [],
            punch_list: [], //首頁的每一列打卡記錄(多天)
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

        this.getPunchList(twoMonthsAgo);
        this.getScheduleList(twoMonthsAgo);

        // this.showDetailOfDay(this.state.punch_list[0]);
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

    getStatusTextFromScheduleCode = (code) =>{
        if(code === '1'){
            return '上班';
        }else if(code === '9'){
            return '下班';
        }else if(code === '2'){
            return '緊急上班';
        }else if(code === '3'){
            return '緊急下班';
        }else{
            return '';
        }
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
        // console.log('按了ddd detail:',punch);
        //先判斷 punch 所屬的班表，是否為跨日
        if(_.isEmpty(this.state.schedule_list)){
            return false;
        }

        //取得今天班表
        let database_schedule_obj = (this.state.schedule_list.filter((el)=>el.sch_date === punch.card_date))[0];

        let graphic_time_list = []
        //從 schedule_list 判斷是不是「跨日班」

    
        let today_schedule_on = moment(database_schedule_obj.sch_date + database_schedule_obj.on_time, "YYYYMMDDHHmm");
        let today_schedule_off = moment(database_schedule_obj.sch_date + database_schedule_obj.off_time, "YYYYMMDDHHmm");
        let title = this.getFormateMonthDate(punch.card_date) + ' 打卡記錄';


        // if(跨日班){
        //     取得前一天班表的上下班
        //     if(前一天不用上班)=>不顯示
        //     把前1天的日期的打卡記錄抓出來
        //     判斷前1天的班表上下班加入 graphic_time_list (要先判斷是否是跨日)
        // }

        if( parseInt(database_schedule_obj.on_time) > parseInt(database_schedule_obj.off_time) ){
            //為跨日班，顯示今天+前一天

            //修正今天下班班表
            today_schedule_off = moment(database_schedule_obj.sch_date + database_schedule_obj.off_time, "YYYYMMDDHHmm").add(1, 'days');

            //取得前1天班表
            let pre_day_schedule = this.state.schedule_list.filter(el=>{
                if( moment(punch.card_date, "YYYYMMDD").subtract(1, 'days').format("YYYYMMDD") === el.sch_date){
                    return true;
                }
            })[0];

            if(!(pre_day_schedule.on_time === '0000' && 
            pre_day_schedule.off_time ==='0000')){
                //if(前一天不用上班)=>不顯示  => 要上班才顯示
                
                //取得前1天班表上班時刻
                let pre_day_schedule_on = moment(pre_day_schedule.sch_date + pre_day_schedule.on_time, "YYYYMMDDHHmm");

                title = this.getFormateMonthDate(pre_day_schedule_on.format('YYYYMMDD')) + ' ~ ' + this.getFormateMonthDate(punch.card_date) + ' 打卡記錄';
                
                //取得前1天班表下班時刻
                let pre_day_schedule_off = null;
                if( parseInt(pre_day_schedule.on_time) > parseInt(pre_day_schedule.off_time) ){
                    pre_day_schedule_off = moment(pre_day_schedule.sch_date + pre_day_schedule.off_time, "YYYYMMDDHHmm").add(1, 'days');
                }else{
                    pre_day_schedule_off = moment(pre_day_schedule.sch_date + pre_day_schedule.off_time, "YYYYMMDDHHmm")
                }

                //把前1天上下班班表時刻加入 graphic_time_list 裡
                graphic_time_list.push({
                    date: pre_day_schedule_on.format("YYYYMMDD"),
                    time: pre_day_schedule_on.format("HHmm"),
                    status: "表訂上班時間",
                    from: ''
                });
                graphic_time_list.push({
                    date: pre_day_schedule_off.format("YYYYMMDD"),
                    time: pre_day_schedule_off.format("HHmm"),
                    status: "表訂下班時間",
                    from: ''
                }); 


                //把前1天的打卡記錄抓出來
                let pre_day_punch_list = this.state.punch_list.filter(el=>{
                    if( el.card_date === moment(punch.card_date, "YYYYMMDD").subtract(1, 'days').format("YYYYMMDD") ){
                        return true;
                    }
                })

                pre_day_punch_list.forEach(el=>{
                    graphic_time_list.push({
                        date: el.card_date,
                        time: el.card_time,
                        status: this.getStatusTextFromScheduleCode(el.card_onoff),
                        from: el.card_from
                    });
                })

            }
        } // end 處理跨日班





        if(! (today_schedule_on.format('HHmm') ==='0000' && today_schedule_off.format('HHmm') ==='0000')){
           
            //把此次上下班班表加入 graphic_time_list 裡
            graphic_time_list.push({
                date: today_schedule_on.format("YYYYMMDD"),
                time: today_schedule_on.format("HHmm"),
                status: "表訂上班時間",
                from: ''
            });
            graphic_time_list.push({
                date: today_schedule_off.format("YYYYMMDD"),
                time: today_schedule_off.format("HHmm"),
                status: "表訂下班時間",
                from: ''
            }); 
        }


        let today_punch_list = this.state.punch_list.filter(el=>{
            if(el.card_date === punch.card_date){
                return true;
            }
        })

        today_punch_list.forEach(el=>{
            graphic_time_list.push({
                date: el.card_date,
                time: el.card_time,
                status: this.getStatusTextFromScheduleCode(el.card_onoff),
                from: el.card_from
            });
        })

        graphic_time_list = _.sortBy(graphic_time_list, ['date', 'time']);
        // console.log('有班表的graphic_time_list:',graphic_time_list);
        this.setState({ 
            time_list: graphic_time_list, 
            open_dialog: true, 
            dialog_title: title,
            cross_day_work:false 
        });


        

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
                <ChangePwd />
                <div className="ar_for-the-overlay">
                    <span>
                        <div className="hint" >
                            <FontAwesome name='times-circle' 
                                size='lg' 
                                style={{ color: 'white', cursor: 'pointer' }} 
                                onClick={()=>{bookStore.setObs('recordPageOpen', false)}}
                            />
                            <span>打卡紀錄</span>
                            <div className="changePwdBtn" onClick={()=>{changePasswdStore.setPwdOpen(true);}}>改密碼</div>
                        </div>
                    </span>
                    <PopUpDialog
                        open={this.state.open_dialog}
                        // onRequestClose={this.handleRequestClose}
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
