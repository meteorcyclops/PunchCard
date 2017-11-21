import moment from 'moment'
import {observable, action} from 'mobx'
import _ from 'lodash'

import writeBook from './writeBook'

class BookStore {
    @observable
    uid= localStorage.getItem('uid') || ""
    @observable
    pwd= localStorage.getItem('pwd') || ""
    @observable
    locked= localStorage.getItem('locked')=='true' || false
    @observable
    status= ""
    @observable
    emergency=  false
    @observable
    backendTime= moment().format('YYYYMMDDHHmmss')
    @observable
    lastPunch= {}

    @observable
    defaultTab = 1
    @observable
    dialogOpen = false

    @action
    setObs(key, value){
        this[key] = value
    }
    
    @action
    getBackendTime(){
        let headers = new Headers();
        headers.append("Content-Type", "application/json")
        headers.append("Accept", "application/json")
        const uri = 'https://staff.kfsyscc.org/hrapi/card/'
        fetch(uri, {
            method: "POST",
            headers: headers,
            body: JSON.stringify({
              api: 'getServerTime'
            })
        })
        .then( res=>res.json() )
        .then( backdata=>{
            if(backdata.data){
                this.rawBackendTime = moment(backdata.TimeStamp)
                
                setInterval(
                    ()=>{
                        this.rawBackendTime = this.rawBackendTime.add(2, 'seconds')
                        this.setObs('backendTime', this.rawBackendTime.format('YYYYMMDDHHmmss'))
                    },
                    2000
                )
            }
        } )
    }

    @action
    getLastPunch(){
        const uri = "https://staff.kfsyscc.org/hrapi/card/"
        let headers = new Headers();
        headers.append("Content-Type", "application/json")
        headers.append("Accept", "application/json")
        fetch(uri, {
            method: "POST",
            headers: headers,
            body: JSON.stringify({
              api: 'getLastPunch',
              username: `${this.uid}`,
              password: `${this.pwd}`
            })
        })
        .then( res=>res.json() )
        .then( backdata=>{
            if ( !_.isEmpty(backdata) ){
                const record = backdata.data
                this.lastPunch = record
                if (record.card_onoff == "1"||record.card_onoff == "2"){ //上一次是上班
                    this.setObs('defaultTab', 0)
                }else if(record.card_onoff == "9"||record.card_onoff == "3"){ //上一次是下班
                    this.setObs('defaultTab', 1)
                }
            }
        })
    }

    check = (type) => {
        writeBook(type, this.uid, this.pwd)
    }
    
    onBoard= () => {
        if (this.emergency) {
            this.check(2);
        } else {
            this.check(1);
        }
    }
    offBoard= () => {
        if (this.emergency) {
            this.check(3);
        } else {
            this.check(9);
        }
    }

    rawBackendTime = moment()
}

var bookStore = new BookStore()

export default bookStore

