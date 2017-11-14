import React, { Component } from 'react' 
import {observer} from 'mobx-react' 
import mobx from 'mobx' 
import styled from 'styled-components'
import _ from 'lodash' 

class TitleTime extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            
        }
    }

    render() {
        return (
            <div>
                現在時間: 
                <span>
                </span>
                時
                <span>
                </span>
                分
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