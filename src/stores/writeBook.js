import moment from 'moment'

import bookStore from './book'
import axios from 'axios';
import changePasswdStore from './ChangePasswdStore';

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

        /* ---------------------------------------- */
        /* 打卡成功後，得到key，傳 key 到改密碼模組 by 丁丁 */
        /* -----------------------------------------*/
        changePasswdStore.setSid(res.data[0].key);


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

export default writeBook
