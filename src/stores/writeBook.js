import Encrypt from 'jsencrypt'
import moment from 'moment'

import bookStore from './book'

const url = "https://staff.kfsyscc.org/hrapi/card/" //https://staff.kfsyscc.org/hrapi/card/
let headers = new Headers();
headers.append("Content-Type", "application/json")
headers.append("Accept", "application/json")


const writeBook = (cardtype, username, password) => {
    bookStore.setObs('status', '請稍後...')
    bookStore.setObs('dialogOpen', true)
    localStorage.setItem('uid', bookStore.uid)
    localStorage.setItem('pwd', bookStore.pwd)
    localStorage.setItem('locked', bookStore.locked)

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
        }else{
            bookStore.setObs('status', result.err)
        }
    })
    .catch((err)=>{
        if (!navigator.onLine){
            bookStore.setObs('status', '連線錯誤 ！\n請連上和信醫院 wifi 後使用。')
        
        }else{
            bookStore.setObs('status', '連線錯誤 ！\n請記下狀況後聯絡資訊部王傳道～3Q')
        }
    })
}

export default writeBook
