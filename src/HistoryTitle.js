import React from 'react' 
import {observer} from 'mobx-react' 
import _ from 'lodash' 
import moment from 'moment'

import styled from 'styled-components'

import bookStore from './stores/book'

class HistoryTitle extends React.Component {
    pickDay(day){
        if(day==0){
            return '今天'
        }else if (day==1){
            return '昨天'
        }else if (day==2){
            return '前天'
        }else {
            return '大於三天前'
        }
    }
    pickType(cardtype){
        if (cardtype == '1') { 
            return `上班`; 
        } 
        else if (cardtype == '2') { 
            return `緊急上班` 
        } 
        else if (cardtype == '3') { 
            return `緊急下班` 
        } 
        else if (cardtype == '9') { 
            return `下班` 
        } else{
            return ''
        }
    }
    
    render() {
        const lastPunch = bookStore.lastPunch

        if ( _.isEmpty(lastPunch) ){
            return (
                <div></div>
            )
        }else{

            const lastDate = lastPunch.card_date
            const lastTime = moment(lastPunch.card_time, 'HHmm').format('HH:mm')

            const todayDate = moment(bookStore.backendTime, 'YYYYMMDDHHmmss')
            
            const dayDelta = moment(todayDate).diff( moment(lastDate, 'YYYYMMDD'), 'days')
            const dayTitle = this.pickDay( dayDelta)
            const dayFoot = this.pickType( lastPunch.card_onoff )

            const Div=styled.div`
                position: absolute; 
                right: 7px;
                top: 8px;
                font-size: 12px; 
                z-index:1;
                cursor: pointer;
                border:2px solid;
                border-radius:25px; 
                padding: 5px 11px; 
                color:rgba(106, 111, 140, 0.5)
            `

            return(
                <Div 
                    onClick={()=>{ bookStore.setObs('recordPageOpen', true)}}
                >
                    {dayDelta<=2?`${dayTitle} ${lastTime} ${dayFoot}`:`${dayTitle}      `} 
                </Div>
            )
        }
        
    }
}

export default observer(HistoryTitle)