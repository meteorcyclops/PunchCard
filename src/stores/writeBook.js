import Encrypt from 'jsencrypt'
import moment from 'moment'

import bookStore from './book'

const url = "https://gateway.kfsyscc.org/Gateway/a/CardClient/CardCheckVerify/"
let headers = new Headers();
headers.append("Content-Type", "application/x-www-form-urlencoded")
headers.append("Accept", "application/json")

const pass_enc = pwd => {
    let crypt = new Encrypt.JSEncrypt()
    let pubkey = `-----BEGIN PUBLIC KEY-----
MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAMTFn+dyIjvI31GnD12D8zgueC8fwgRt
xL/sETU8CDMaUlYygVH4jLwRc3UNr5minj8TgMnfDXocSoPKN3n28N8CAwEAAQ==
-----END PUBLIC KEY-----`;
    crypt.setPublicKey(pubkey);
    return encodeURIComponent(crypt.encrypt(pwd))
}


const writeBook = (cardtype, username, password) => {
    let epwd = pass_enc(password);
    epwd = encodeURIComponent(epwd);
    let data = `CardType=${cardtype}&UserId=${username}&Password=`+epwd+``
    return fetch(url, {
        method: "POST",
        headers: headers,
        body: data
    }).then((res) => {
        return res.json()
    }).then((res) => {
        let status = res.ErrorMessage
        if (status === "") {
            let ts = res.TimeStamp;
            let dt = moment(ts).format("YYYY/MM/DD hh:mm:ss")
            let username = res.UserName;
            if (cardtype === 1) {
                status = `${username} 上班打卡成功(${dt})`;
            }
            if (cardtype === 2) {
                status = `${username} 緊急上班打卡成功(${dt})`
            }
            if (cardtype === 3) {
                status = `${username} 緊急下班打卡成功(${dt})`
            }
            if (cardtype === 9) {
                status = `${username} 下班打卡成功(${dt})`
            }

            localStorage.setItem('uid', this.uid)
            localStorage.setItem('pwd', this.pwd)
            localStorage.setItem('locked', this.locked)
        }   
        bookStore.setObs('status', status)
    })
}

export default writeBook
