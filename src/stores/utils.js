
import swal from 'sweetalert'
import _ from 'lodash'

const urlStaffCard = "https://staff.kfsyscc.org/hrapi/card/" //https://staff.kfsyscc.org/hrapi/card/
let headers = new Headers();
headers.append("Content-Type", "application/json")
headers.append("Accept", "application/json")

const sendToFlow = (type, data) => {
    const { emp_no, name, boss_id, on_time, off_time, ot_time, ot_hours } = data

    let inpuItem = {
        user_id: emp_no,
        boss_id: boss_id,
        startDate: off_time,
        endDate: ot_time,
        add_thingsay: '新排班系統自動申請加班',
        salaryWeekdays: '', // 平日 計薪
        salaryRest: '',
        salaryEmptyClass: '',
        salaryTeacherTraining: '',
        salaryReward: '',
        salaryCountrySetting: '',
        salarySpecialBreak: '',
        salaryTyphoon: '',
        salarySpecialOvertime: '',
        salarySpecialOvertimeInHoliday: '',
        salarySpecialOvertimeInEvening: '',
        salaryDistance: '',
        accumulationWeekdays: '',  // 平日 積假
        accumulationRest: '',
        accumulationEmptyClass: '',
        accumulationTeacherTraining: '',
        accumulationReward: '',
        accumulationCountrySetting: '',
        accumulationSpecialBreak: '',
        accumulationTyphoon: '',
        accumulationSpecialOvertime: '',
        accumulationSpecialOvertimeInHoliday: '',
        accumulationSpecialOvertimeInEvening: '',
        accumulationDistance: '',
    }

    inpuItem['salaryWeekdays'] = '' // 平日 計薪
    inpuItem['accumulationWeekdays'] = '' // 平日 積假
    inpuItem['typeName'] = '「加班費」'

    if (type == 'dayoff') {
        inpuItem['accumulationWeekdays'] = ot_hours
        inpuItem['typeName'] = '「積休」'
    } else {
        inpuItem['salaryWeekdays'] = ot_hours
    }

    const sendData = _.reduce(inpuItem, function (result, value, key) {
        if (result !== '') {
            result += '&'
        }
        result = result + `${key}=${value}`
        return result;
    }, '')

    const host = 'flow.kfsyscc.org'
    // 正式區網址： flow.kfsyscc.org 測試區網址： flow-test.kfcc.intra

    fetch(`http://${host}/flow/MyFlowWS/MyFlowWebService.asmx/sendWorkOvertime?${sendData}`)
        .then(res => res.text())
        .then(req => {
            // console.warn(req)
            // <?xml version="1.0" encoding="utf-8"?><string xmlns="http://tempuri.org">{"status":false,"msg":"您申請的加班時間與之前記錄重疊！","data":{}}</string>
            req = req.replace(`<?xml version="1.0" encoding="utf-8"?>`, '')
                .replace(`<string xmlns="http://${host}/MyFlowWebService">`, '')
                .replace(`<string xmlns="http://tempuri.org">`, '')
                .replace(`</string>`, '')
                .trim()
            req = JSON.parse(req)
            const form_id = _.get(req, ['data', 'form_id'])
            if (req['status'] && !isNaN(parseInt(form_id)) && form_id.length === 10) {
                swal(`${inpuItem['typeName']} 表單已送出！`, {
                    icon: "success",
                });
                // console.log(req)    
            } else {
                swal(req['msg'], {
                    icon: "warning",
                });
                // console.warn(req['msg'])
            }

            logSchedule({
                emp_no, name, msg: req
            })
        }).catch(err => console.log('sendToFlow 錯誤'))
}

const checkOvertimeOrHasNightFee = (username, password) => {
    // console.log('username, password', username, password)
    // console.log('bookStore.uid', bookStore.uid)

    return fetch(urlStaffCard, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
            api: 'checkOvertimeOrHasNightFee',
            username: `${username}`,
            password: `${password}`
        })
    })
        .then((res) => res.json())
        .then((res) => {
            const { status, data, err } = res
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
            } else {
                // console.log(err)
                logSchedule(data, err)
            }
        })
        .catch((err) => {
            console.log('checkOvertimeOrHasNightFee 錯誤')
        })
}

const logSchedule = (data, err = {}) => {
    let url = `https://emr.kfsyscc.org/mongo/logs/schedule`
    console.log(data, err)
    const body = {
        ...data,
        err,
    }

    const headers = new Headers({
        "Content-Type": "application/json",
        "Accept": "application/json"
    })
    return fetch(url, {
        method: "POST",
        headers: headers,
        credentials: 'include',
        body: JSON.stringify(body)
    })
        .then(res => { })
        .catch(e => { })
}

export { sendToFlow, checkOvertimeOrHasNightFee }