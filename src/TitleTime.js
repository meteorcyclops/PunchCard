import React, { Component } from 'react' 
import {observer} from 'mobx-react' 
import mobx from 'mobx' 
import styled from 'styled-components'
import _ from 'lodash'
import moment from 'moment'

import bookStore from './stores/book'

class TitleTime extends React.Component {
    render() {
        const nowTimeM = moment(bookStore.backendTime, 'YYYYMMDDhhmmss')
        return (
            <div>
                現在時間: 
                <span>
                    {nowTimeM.format('hh')}
                </span>
                時
                <span>
                    {nowTimeM.format('mm')}
                </span>
                分
                <span>
                    {nowTimeM.format('ss')}
                </span>
                秒
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