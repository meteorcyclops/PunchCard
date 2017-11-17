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
    defaultTab = 1
    @observable
    dialogOpen = false

    @action
    setObs(key, value){
        this[key] = value
    }
    
    @action
    getBackendTime(){
        const uri = 'https://gateway.kfsyscc.org/Gateway/a/CardClient/ClockTimeStamp'
        fetch(uri)
        .then( res=>res.json() )
        .then( backdata=>{
            if(backdata.TimeStamp){
                this.rawBackendTime = moment(backdata.TimeStamp)
                
                setInterval(
                    ()=>{
                        this.rawBackendTime = this.rawBackendTime.add(1, 'seconds')
                        this.setObs('backendTime', this.rawBackendTime.format('YYYYMMDDHHmmss'))
                    },
                    1000
                )
            }
        } )
    }

    @action
    getLastPunch(){
        const uri = "https://staff.kfsyscc.org/hrapi/card"
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
                if (record.card_onoff == "1"){ //上一次是上班
                    this.setObs('defaultTab', 0)
                }else if(record.card_onoff == "9"){ //上一次是下班
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

