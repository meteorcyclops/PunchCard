import _ from 'lodash'

import bookStore from './book'
import changePasswdStore from './ChangePasswdStore';
import { checkOvertime } from './utils'

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
            
            try{
                loginStaff( username, password )
            } catch (err){ console.log(err) }

            if (cardtype == '9') { // 打下班卡才需判斷
                try {
                    checkOvertime(username, password)
                }
                catch (err){
                    console.log(err)
                }
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

export default writeBook
