import Encrypt from 'jsencrypt'
import moment from 'moment'

import bookStore from './book'

const url = "http://localhost:8020/hrapi/card" //https://staff.kfsyscc.org/hrapi/card/
let headers = new Headers();
headers.append("Content-Type", "application/json")
headers.append("Accept", "application/json")


const writeBook = (cardtype, username, password) => {
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
        bookStore.setObs('dialogOpen', true)
    })
}

export default writeBook
