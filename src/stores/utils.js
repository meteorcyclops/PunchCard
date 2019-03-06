
import swal from 'sweetalert'
import _ from 'lodash'

const urlStaffCard = "https://staff.kfsyscc.org/hrapi/card/" //https://staff.kfsyscc.org/hrapi/card/
let headers = new Headers();
headers.append("Content-Type", "application/json")
headers.append("Accept", "application/json")

const isNumeric = (n) => {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

const sendToFlow = (ot_type, data) => {
    const { emp_no, boss_id, off_time, ot_time, ot_hours } = data

    return fetch(urlStaffCard, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
            api: 'send_to_flow',
            emp_no, boss_id,
            off_time, ot_time, ot_hours,
            ot_type,
        })
    })
        .then((res) => res.json())
        .then((res) => {
            const { status, err, data } = res

            // console.log('sendToFlow', res)
            const formID = _.get(data, ['data', 'form_id'])
            if (status && isNumeric(formID) && formID.length === 10) {
                const formName = ot_type === 'dayoff' ? '「積休」' : '「加班費」'
                swal(`${formName} 表單已送出！`, {
                    icon: 'success',
                });
                // console.log(res)    
            } else {
                const msg = _.get(data, ['msg'], '發生未知錯誤，請不用擔心，資訊部會為病房區補申請。')
                swal(msg, {
                    icon: 'warning',
                });
                // console.warn(msg)
            }

            // logSchedule({
            //     emp_no, name, msg: res
            // })
        }).catch(err => console.log('sendToFlow 錯誤'))
}

const checkOvertime = (username, password) => {
    // console.log('username, password', username, password)
    // console.log('bookStore.uid', bookStore.uid)

    return fetch(urlStaffCard, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
            api: 'check_overtime',
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
                    }).then((otType) => {
                        // console.log('otType', otType)
                        switch (otType) {
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

                        sendToFlow(otType, data)
                    })
                }
            } else {
                console.log(err)
                // logSchedule(data, err)
            }
        })
        .catch((err) => {
            console.log('checkOvertime 錯誤')
        })
}

const logSchedule = (data, err = {}) => {
    let url = `https://emr.kfsyscc.org/mongo/logs/schedule`
    // console.log(data, err)
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

export { sendToFlow, checkOvertime }