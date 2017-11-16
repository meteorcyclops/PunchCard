import moment from 'moment'
import {observable, action} from 'mobx'

import writeBook from './writeBook'
// import checkBook from './checkBook'

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
    backendTime= moment().format('YYYYMMDDhhmmss')

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
                        this.setObs('backendTime', this.rawBackendTime.format('YYYYMMDDhhmmss'))
                    },
                    1000
                )
            }
        } )
    }

    check = (type) => {
        writeBook(type, bookStore.uid, bookStore.pwd)
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

