import moment from 'moment'
import {observable, action} from 'mobx'

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
    backendTime= moment().format('hhmmss')

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
                        this.setObs('backendTime', this.rawBackendTime.format('hhmmss'))
                    },
                    1000
                )
            }
        } )
    }

    check = (type) => {
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

                localStorage.setItem('uid', this.uid)
                localStorage.setItem('pwd', this.pwd)
                localStorage.setItem('locked', this.locked)
            }   
            this.setObs('status', status)
        })
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

