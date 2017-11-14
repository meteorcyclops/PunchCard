import React from 'react'
import {observer} from 'mobx-react'
import * as mobx from 'mobx'
import styled, {keyframes} from 'styled-components'
import Switch from 'material-ui/Switch'
import Checkbox from 'material-ui/Checkbox'
import {FormGroup, FormControlLabel} from 'material-ui/Form'

import bookStore from './stores/book'

class BookCardBody extends React.Component {

    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleBool = this.handleBool.bind(this);
    }

    handleChange(prop) {
        return (event) => {
            bookStore.setObs(prop, event.target.value)
        }
    }

    handleBool(prop) {
        return (event, checked) => {
            bookStore.setObs(prop, checked)
        }
    }

    render() {
        const className = this.props.className
        const bookFunction = this.props.onClick
        const inOrOut = this.props.in

        const uid = bookStore.uid
        const locked = bookStore.locked
        const pwd = bookStore.pwd
        const msg = bookStore.status

        const BoxLabel = this.styledDiv.boxLabel
        const FlexRowDiv = this.styledDiv.flexRowDiv

        console.log(mobx.toJS(locked));

        const bouncedUp = keyframes`
            from{
            height:120px;
            }
            to{
            height:0;
            }
`

        const bouncedDown = keyframes`
            from{
            height:0;
            }
            to{
            height:120px;
            }
`
        const InputDiv = styled.div`
            background-color: #ffffff;
            animation: ${locked?bouncedDown:bouncedUp} .5s linear 1;
            height:${locked?'120px':'0px'}
        `

        return (
            <div className={className}>
                <InputDiv>
                    <div className="group">
                        <label htmlFor="uid" className="label">帳號</label>
                        <input
                            id="uid"
                            disabled={locked}
                            value={uid}
                            onChange={this.handleChange('uid')}
                            className="input"
                        />
                    </div>
                    <div className="group">
                        <label htmlFor="pwd" className="label">密碼</label>
                        <input
                            id="pwd"
                            disabled={locked}
                            type="password"
                            value={pwd}
                            onChange={this.handleChange('pwd')}
                            className='input'
                        />
                    </div>
                </InputDiv>
                <div className="group">
                    <FlexRowDiv>
                        <FormControlLabel
                            control={
                                <Switch
                                    onChange={this.handleBool('locked')}
                                    aria-label="locked"
                                    checked={locked}
                                />
                            }
                            label={<BoxLabel>鎖定帳密</BoxLabel>}
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    onChange={this.handleBool('emergency')}
                                    value="emergency"
                                    style={{margin: '0px 7px'}}
                                />
                            }
                            label={<BoxLabel>緊急狀態</BoxLabel>}
                        />
                    </FlexRowDiv>
                </div>
                <div className="group">
                    <button className='button' onClick={bookFunction}>
                        {inOrOut ? '上班' : '下班'}
                    </button>
                </div>
                <div className="hr"/>
                <div className="foot-lnk">
                    <div style={{color: "#fff"}}>
                        <h3>{mobx.toJS(msg)}</h3>
                    </div>
                </div>
            </div>
        )
    }

    styledDiv = {
        boxLabel: styled.span`
            color: #d8d8d8;
            left: -6px;
            top: 1px;
            position: relative;
            font-weight: normal;
            font-size: '15px'
        `,
        flexRowDiv: styled.div`
            display: flex;
            flex-flow: row;
            align-items: center;
        `
    }
}

export default observer(BookCardBody)