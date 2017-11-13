import React from 'react' 
import {observer} from 'mobx-react' 
import * as mobx from 'mobx' 
import _ from 'lodash' 
import styled, { injectGlobal } from 'styled-components'
import Switch from 'material-ui/Switch';
import Checkbox from 'material-ui/Checkbox';

import bookStore from './stores/book'

class BookCardBody extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleBool = this.handleBool.bind(this);
    }

    handleChange(prop) {
        return (event)=>{
            bookStore.setObs(prop, event.target.value)
        }
    }

    handleBool(prop) {
        return (event, checked)=>{
            bookStore.setObs(prop, checked)
        }
    }

    render() {
        const className = this.props.className
        const bookFunction = this.props.onClick
        const inOrOut = this.props.in
    
        const BoxLabel = this.styledDiv.boxLabel
        const FlexRowDiv = this.styledDiv.flexRowDiv

        const uid =    bookStore.uid
        const locked = bookStore.locked
        const pwd =    bookStore.pwd
        const msg =    bookStore.status

        return (
            <div className={className}>
                <div className="group">
                    <label htmlFor="uid" className="label">帳號</label>
                    <input
                        id="uid"
                        disabled={bookStore.locked}
                        value={bookStore.uid}
                        onChange={this.handleChange('uid')}
                        className="input"
                    />
                </div>
                <div className="group">
                    <label htmlFor="pwd" className="label">密碼</label>
                    <input
                        id="pwd"
                        disabled={bookStore.locked}
                        type="password"
                        value={bookStore.pwd}
                        onChange={this.handleChange('pwd')}
                        className='input'
                    />
                </div>
    
                <div className="group">
                    <FlexRowDiv>
                        <FlexRowDiv>
                            <Switch onChange={this.handleBool('locked')} aria-label="locked" />
                            <BoxLabel>鎖定帳密</BoxLabel>
                        </FlexRowDiv>
                        <FlexRowDiv>
                            <Checkbox onChange={this.handleBool('emergency')} value="emergency" />
                            <BoxLabel>緊急狀態</BoxLabel>
                        </FlexRowDiv>
                    </FlexRowDiv>
                </div>
                <div className="group">
                    <button className='button' onClick={bookFunction} >
                        {inOrOut?'上班':'下班'}
                    </button>
                </div>
                <div className="hr" />
                <div className="foot-lnk">
                    <div style={{ color: "#fff" }}>
                        <h3>{mobx.toJS(bookStore.status)}</h3>
                    </div>
                </div>
            </div>
        )
    }

    styledDiv = {
        boxLabel: styled.div`
            color: #d8d8d8;
            left: -6px;
            top: 1px;
            position: relative;
            font-weight: normal;
            font-size: '15px'
        `,
        flexRowDiv: styled.div`
            display: flex; 
            flex-direction: row; 
            align-items: center
        `,
    }
}

export default observer(BookCardBody)