import Encrypt from 'jsencrypt'
import moment from 'moment'

import bookStore from './book'

const url = "https://staff.kfsyscc.org/hrapi/card/"
let headers = new Headers();
headers.append("Content-Type", "application/json")
headers.append("Accept", "application/json")


const writeBook = (cardtype, username, password) => {
    return fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        cardtype: `${cardtype}`,
        username: `${username}`,
        password: `${password}`
      })
    }).then((res) => {
        return res.json()
    }).then((res) => {
        let status = res.message
        localStorage.setItem('uid', bookStore.uid)
        localStorage.setItem('pwd', bookStore.pwd)
        localStorage.setItem('locked', bookStore.locked)
        bookStore.setObs('status', status)
    })
}

export default writeBook
