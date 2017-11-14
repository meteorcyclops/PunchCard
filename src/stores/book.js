import moment from 'moment'
import {observable, action} from 'mobx'

import writeBook from './writeBook'

const bookStore = observable({
    uid: localStorage.getItem('uid') || "",
    pwd: localStorage.getItem('pwd') || "",
    locked: localStorage.getItem('locked')=='true' || false,
    status: "",
    emergency:  false,

    setObs: action(
        (key, value)=>{
            bookStore[key] = value
        }
    ),

    check: (type) => {
        writeBook(type, bookStore.uid, bookStore.pwd).then((res) => {
            let status = res.ErrorMessage
            if (status === "") {
                let ts = res.TimeStamp;
                let dt = moment(ts).format("YYYY/MM/DD hh:mm:ss")
                let username = res.UserName;
                if (type === 1) {
                    status = `${username} 上班打卡成功(${dt})`;
                }
                if (type === 2) {
                    status = `${username} 緊急上班打卡成功(${dt})`
                }
                if (type === 3) {
                    status = `${username} 緊急下班打卡成功(${dt})`
                }
                if (type === 9) {
                    status = `${username} 下班打卡成功(${dt})`
                }

                localStorage.setItem('uid', bookStore.uid)
                localStorage.setItem('pwd', bookStore.pwd)
                localStorage.setItem('locked', bookStore.locked)
            }   
            bookStore.setObs('status', status)
        })
    },
    onBoard: () => {
        if (bookStore.emergency) {
            bookStore.check(2);
        } else {
            bookStore.check(1);
        }
    },
    offBoard: () => {
        if (bookStore.emergency) {
            bookStore.check(3);
        } else {
            bookStore.check(9);
        }
    }
})
export default bookStore

