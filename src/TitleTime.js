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
        // 現在時間: 
        return (
            <div style={{fontSize:'60px',color:'rgba(255,255,255,0.1)', textAlign: 'center'}}>
                    {nowTimeM.format('HH')}
                :
                    {nowTimeM.format('mm')}
                :
                    {nowTimeM.format('ss')}
            </div>
        )
    }

    mainDiv = styled.div`
        display: flex; 
        flex-flow: row; 
        align-items: center;
    `
}

export default observer(TitleTime)