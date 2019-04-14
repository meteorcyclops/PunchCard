import moment from 'moment'
import 'moment-timezone'
import {observable, action} from 'mobx'
import _ from 'lodash'

import writeBook from './writeBook'

import firebase from 'firebase'

firebase.initializeApp({
    apiKey: "AIzaSyB-mnAxpvri5O2NGtM4sP5Q89Bj5oeQxUg",
    authDomain: "service-f8424.firebaseapp.com",
    databaseURL: "https://service-f8424.firebaseio.com",
    projectId: "service-f8424",
    storageBucket: "service-f8424.appspot.com",
    messagingSenderId: "371482619421"
});
  
var db = firebase.firestore();

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

    @observable
    recordPageOpen = false

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
                this.rawBackendTime = moment(backdata.data)
                this.rawBackendTimeDelta = this.rawBackendTime.diff(moment())
                setInterval(
                    ()=>{
                        this.rawBackendTime = moment().add(this.rawBackendTimeDelta)
                        this.setObs('backendTime', this.rawBackendTime.format('YYYYMMDDHHmmss'))
                    },
                    1000
                )
            }
        } )
        .catch( ()=>{
            setInterval(
                ()=>{
                    this.rawBackendTime = moment().add( 1000 )
                    this.setObs('backendTime', this.rawBackendTime.format('YYYYMMDDHHmmss'))
                },
                1000
            )
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

