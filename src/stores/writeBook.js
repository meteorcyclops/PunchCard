import _ from 'lodash'
import swal from 'sweetalert'

import bookStore from './book'
import changePasswdStore from './ChangePasswdStore';

const url = "https://staff.kfsyscc.org/hrapi/card/" //https://staff.kfsyscc.org/hrapi/card/
let headers = new Headers();
headers.append("Content-Type", "application/json")
headers.append("Accept", "application/json")


const writeBook = (cardtype, username, password) => {
    bookStore.setObs('status', '請稍後...')
    bookStore.setObs('dialogOpen', true)

    try {
        localStorage.setItem('uid', bookStore.uid)
        localStorage.setItem('pwd', bookStore.pwd)
        localStorage.setItem('locked', bookStore.locked)
    }catch(err) {
        console.log('無法寫入local storage')
    }

    return fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        api: 'punch',
        cardtype: `${cardtype}`,
        username: `${username}`,
        password: `${password}`
      })
    }).then((res) => {
        return res.json()
    }).then((res) => {
        let result = res
        if (result.status){
            bookStore.setObs('status', result.msg)

            if (cardtype == '9') { // 打下班卡才需判斷
                checkOvertimeOrHasNightFee(username, password)
            }
        }else{
            bookStore.setObs('status', result.err)
        }

        /* ---------------------------------------- */
        /* 打卡成功後，得到key，傳 key 到改密碼模組 by 丁丁 */
        /* -----------------------------------------*/

        //如果後端沒有傳回 data[0].key ，就不要檢查密碼到期了
        if(res.data && res.data[0]){
            changePasswdStore.setSid(res.data[0].key);
        }


    })
    .catch((err)=>{
        if (!navigator.onLine){
            bookStore.setObs('status', '連線錯誤 ！\n請連上和信醫院 wifi 後使用。')
        
        }else{
            bookStore.setObs('status', `連線錯誤!
            1. 請確定有使用和信醫院 wifi
            2. 試試看把歷史紀錄跟 cookie 清掉後重開
            3. 請確認帳號密碼正確(未過期)
            4. 以上都沒用，記下狀況後聯絡資訊部王傳道#3466`)
        }
    })
}

const checkOvertimeOrHasNightFee = (username, password) => {
    // console.log('username, password', username, password)
    // console.log('bookStore.uid', bookStore.uid)

    return fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
            api: 'checkOvertimeOrHasNightFee',
            username: `${username}`,
            password: `${password}`
        })
    }).then((res) => {
        return res.json()
    }).then((res) => {
        // res = {
        //     "emp_no": emp_no,
        //     "on_time": on_time,
        //     "off_time": off_time,
        //     "ot_hours": ot_hours,
        // }     
        console.log(res)
        const { status, data } = res
        if (status) {
            const { emp_no, on_time, off_time, ot_hours } = data

            if (ot_hours >= 2) {
                swal({
                    title: '請選擇加班費或積休',
                    text: '您今日延長工時預設加班是報加班費，如須積休請自行選擇。',
                    icon: 'warning',
                    buttons: {
                        dayoff: '積休',
                        money: '加班費'
                    },
                    dangerMode: true,
                }).then((option) => {
                    // console.log('option', option)
                    switch (option) {
                        case 'dayoff':
                            swal('你選擇「積休」', {
                                icon: 'success',
                            })
                            break

                        default:
                            swal('你選擇「加班費」', {
                                icon: 'success',
                            })
                            break
                    }

                    sendToFlow(option, data)
                })
            }
        }
    })
}

const sendToFlow = (type, data) => {
    const { emp_no, boss_id, on_time, off_time, ot_time, ot_hours } = data
    let salaryWeekdays = '' // 平日 計薪
    let accumulationWeekdays = '' // 平日 積假
    let typeName = '「加班費」'

    if (type == 'dayoff') {
        accumulationWeekdays = ot_hours
        typeName = '「積休」'
    } else {
        salaryWeekdays = ot_hours
    }

    const user_id = emp_no
    const startDate = off_time
    const endDate = ot_time
    const add_thingsay = '新排班測試'
    // const salaryWeekdays = '' // 平日 計薪
    const salaryRest = ''
    const salaryEmptyClass = ''
    const salaryTeacherTraining = ''
    const salaryReward = ''
    const salaryCountrySetting = ''
    const salarySpecialBreak = ''
    const salaryTyphoon = ''
    const salarySpecialOvertime = ''
    const salarySpecialOvertimeInHoliday = ''
    const salarySpecialOvertimeInEvening = ''
    const salaryDistance = ''
    // const accumulationWeekdays = '' // 平日 積假
    const accumulationRest = ''
    const accumulationEmptyClass = ''
    const accumulationTeacherTraining = ''
    const accumulationReward = ''
    const accumulationCountrySetting = ''
    const accumulationSpecialBreak = ''
    const accumulationTyphoon = ''
    const accumulationSpecialOvertime = ''
    const accumulationSpecialOvertimeInHoliday = ''
    const accumulationSpecialOvertimeInEvening = ''
    const accumulationDistance = ''
    const sendData = `user_id=${user_id}&startDate=${startDate}&endDate=${endDate}&boss_id=${boss_id}&add_thingsay=${add_thingsay}&salaryWeekdays=${salaryWeekdays}&salaryRest=${salaryRest}&salaryEmptyClass=${salaryEmptyClass}&salaryTeacherTraining=${salaryTeacherTraining}&salaryReward=${salaryReward}&salaryCountrySetting=${salaryCountrySetting}&salarySpecialBreak=${salarySpecialBreak}&salaryTyphoon${salaryTyphoon}=&salarySpecialOvertime=${salarySpecialOvertime}&salarySpecialOvertimeInHoliday=${salarySpecialOvertimeInHoliday}&salarySpecialOvertimeInEvening=${salarySpecialOvertimeInEvening}&salaryDistance=${salaryDistance}&accumulationWeekdays=${accumulationWeekdays}&accumulationRest=${accumulationRest}&accumulationEmptyClass=${accumulationEmptyClass}&accumulationTeacherTraining=${accumulationTeacherTraining}&accumulationReward=${accumulationReward}&accumulationCountrySetting=${accumulationCountrySetting}&accumulationSpecialBreak=${accumulationSpecialBreak}&accumulationTyphoon=${accumulationTyphoon}&accumulationSpecialOvertime=${accumulationSpecialOvertime}&accumulationSpecialOvertimeInHoliday=${accumulationSpecialOvertimeInHoliday}&accumulationSpecialOvertimeInEvening=${accumulationSpecialOvertimeInEvening}&accumulationDistance=${accumulationDistance}`
    const host = 'flow.kfsyscc.org'
    // 正式區網址： flow.kfsyscc.org 測試區網址： flow-test.kfcc.intra

    fetch(`http://${host}/flow/MyFlowWS/MyFlowWebService.asmx/sendWorkOvertime?${sendData}`)
        .then(res => {
            return res.text()
        })
        .then(req => {
            console.warn(req)
            // <?xml version="1.0" encoding="utf-8"?><string xmlns="http://tempuri.org">{"status":false,"msg":"您申請的加班時間與之前記錄重疊！","data":{}}</string>
            req = req.replace(`<?xml version="1.0" encoding="utf-8"?>`, '')
                .replace(`<string xmlns="http://${host}/MyFlowWebService">`, '')
                .replace(`<string xmlns="http://tempuri.org">`, '')
                .replace(`</string>`, '')
                .trim()
            req = JSON.parse(req)
            // console.log('req', req)
            const form_id = _.get(req, ['data', 'form_id'])
            if (req['status'] && !isNaN(parseInt(form_id)) && form_id.length === 10) {
                swal(`${typeName} 表單已送出！`, {
                    icon: "success",
                });
                // console.log(req)    
            } else {
                swal(req['msg'], {
                    icon: "warning",
                });
                // console.warn(req['msg'])
            }
        }).catch(err => console.log(err))
}

export default writeBook
