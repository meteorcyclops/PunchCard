import React, { Component } from 'react'
import {observer} from 'mobx-react'
import styled from 'styled-components'
import _ from 'lodash'
import moment from 'moment'

import bookStore from './stores/book'

class TitleTime extends React.Component {
    render() {
        const nowTimeM = moment(bookStore.backendTime, 'YYYYMMDDHHmmss')
        // 現在時間:
        return (
            <div style={{
                textAlign: 'center',
                height:'65px', 
                fontSize:'60px', 
                color:'rgba(255,255,255,0.1)',  
                paddingTop: '10px', 
            }}>
                <span>{nowTimeM.format('HH')}:</span>
                <span>{nowTimeM.format('mm')}:</span>
                <span>{nowTimeM.format('ss')}</span>
            </div>
        )
    }
}

export default observer(TitleTime)