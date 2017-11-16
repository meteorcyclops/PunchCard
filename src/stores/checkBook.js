import {observable, action} from 'mobx'
import _ from 'lodash'

import bookStore from './book'

import moment from 'moment'

class CheckBook {
    @observable
    msg = ''
    @observable
    lastPunch = ''
    @observable
    todaySchedule = ''

    punchList = [ ]

    @action
    loadPunchInfo(data) {
        fetch('https://staff.kfsyscc.org/service/', {
            credentials: 'include',
            method: 'POST',
            body: JSON.stringify( 
                { 
                    uid: bookStore.uid, 
                    api: "punchInfo" 
                }
            )
        }).then( res=>res.json() )
        .then((res)=>{
            if(!res.status){
                alert( '讀取資料錯誤： '+ res.err)
                return false
            }else{
                this.punchList = res.data.punchRecords
                this.todaySchedule = res.data.todaySchedule
                if( _.isEmpty(res.data.todaySchedule) ){
                    alert( '此員工帳號沒有班表')
                    return false
                }
            }
        })
    }

    @action
    setMsg(str) {
        this.msg = str
    }

    checkPunch(){
        const nowTime = moment(bookStore.backendTime, 'YYYYMMDDhhmmss')
        const punchList = this.punchList
        const lastPunch = _.filter(punchList, x=>x.ID == 1)


// ---- 會打卡失敗 ----------------- //
// ---- 1. 連續上班 7 天 ----------- //
        let dateList = []
        const dayNum = 7
        for (let i = 1; i <= dayNum ; i++){
            dateList.push( nowTime.add(days=1).format('YYYYMMDD') )
        }
        const allPunchDate = punchList.map( x=> x.CARD_DATE )
        let punchNum = 0
        _.forEach(dateList, (data)=>{
            if (allPunchDate.indexOf(data)>-1){
                punchNum += 1
            }
        })
        if (punchNum >= 7){
            alert( '打卡失敗!\n已連續工作超過13小時。\n如有任何問題，敬請洽詢人力資源部黃副主任（分機3501）。\n非常謝謝！')
            return false
        }
// message = '打卡失敗!\n已連續上班7日。\n';
// ---- 2. 工作超過 13 小時 ----------- //
// message = '打卡失敗!\n已連續工作超過13小時。\n';

// ---- 2.  比班表半小時還早 ----------- //
// message = '提醒!打上班卡時間超過班表30分鐘前，如係加班者，敬請勾選「緊急呼叫上班打卡」，並請記得於加班結束時，隨即申請加班費或積休時數，再打下班卡。\n';
        
        // message = '提醒您！\n如非加班，敬請於班表之下班時間30分鐘內打卡下班。\n如是加班，敬請先申請加班費後再打卡下班。\n';
        // message + '如有任何問題，敬請洽詢人力資源部黃副主任（分機3501）。\n非常謝謝！';
        //     var ncpmsg = '(' + (remains >= 0 ? '剩餘' : '超過') + ': ' + Math.abs(remains) + '天)';
        //     message += (message.length > 0 ? '\n\n' : '') + '您的密碼即將過期' + ncpmsg + '，請您利用 Ctrl + Alt + Del 盡速變更密碼。'
    }    
}

var checkBook = new CheckBook()

export default checkBook