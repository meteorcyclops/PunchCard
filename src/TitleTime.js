import React, { Component } from 'react'
import {observer} from 'mobx-react'
import mobx from 'mobx'
import styled from 'styled-components'
import _ from 'lodash'
import moment from 'moment'

import bookStore from './stores/book'

class TitleTime extends React.Component {
    render() {
        const nowTimeM = moment(bookStore.backendTime, 'YYYYMMDDHHmmss')
        const MainDiv = this.mainDiv
        // 現在時間:
        return (
            <MainDiv>
                <span>{nowTimeM.format('HH')}:</span>
                <span>{nowTimeM.format('mm')}:</span>
                <span>{nowTimeM.format('ss')}</span>
            </MainDiv>
        )
    }

    mainDiv = styled.div`
        display: flex;
        flex-flow: row;
        align-items: center;
        justify-content: center; 
        height:65px; 
        font-size:60px; 
        color:rgba(255,255,255,0.1);  
        margin-top: 5px 
    `
}

export default observer(TitleTime)