import React from 'react'
import {observer} from 'mobx-react'
import * as mobx from 'mobx'
import styled, {keyframes} from 'styled-components'
import Switch from 'material-ui/Switch'
import Checkbox from 'material-ui/Checkbox'
import TitleTime    from './TitleTime'
import {FormGroup, FormControlLabel} from 'material-ui/Form'

import bookStore from './stores/book'

class BookCardBody extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this)
        this.handleBool = this.handleBool.bind(this)
    }

    componentDidUpdate(){
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
        const locked = this.props.locked

        const uid = bookStore.uid
        const pwd = bookStore.pwd
        const msg = bookStore.status

        const BoxLabel = this.styledDiv.boxLabel
        const FlexRowDiv = this.styledDiv.flexRowDiv
        const InputDiv = this.styledDiv.inputDiv
        const UpdownDiv = this.styledDiv.upDowndiv
        const UpdownButton = this.styledDiv.upDownButton


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
                <UpdownDiv>
                    <UpdownButton onClick={bookFunction}>
                        {inOrOut ? '上班' : '下班'}
                    </UpdownButton>
                </UpdownDiv>
                <div className="hr"/>
                <div className="foot-lnk">
                    <div style={{color: "#fff"}}>
                        <h3>{mobx.toJS(msg)}</h3>
                    </div>
                    <TitleTime />
                </div>
            </div>
        )
    }

    componentWillReceiveProps(newProp){
        const oldLocked = this.props.locked
        const locked    = newProp.locked

        if (oldLocked!=locked){
            this.styledDiv.inputDiv = styled.div`
                overflow: hidden;
                height:${locked?'0px':'120px'};
            `
            this.styledDiv.inputDiv = this.styledDiv.inputDiv.extend`
                animation: ${locked?this.styledDiv.bouncedUp:this.styledDiv.bouncedDown} .5s 0s cubic-bezier(.28,-0.8,.74,1.59);
            `
            this.styledDiv.upDownButton = styled.button`
                animation: ${this.styledDiv.makeItBigger} .5s;
            `
        }
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
            flex-wrap: wrap;
        `,
        bouncedUp: keyframes`
            from { height:120px; }
            to { height:0; }
        `,
        bouncedDown: keyframes`
            from{ height:0; }
            to{ height:120px; }
        `,
        inputDiv: styled.div`
            overflow: hidden;
            height: 120px;
        `,
        upDowndiv: styled.div.attrs({
            className:'group'
        })`
            
        `,
        upDownButton: styled.button.attrs({
            className:'button'
        })`
            text-align: center;
            height: 500px;
        `,
        makeItBigger: keyframes`
            from{height: 0px}
            to{height: 500px}
`

    }
}

export default observer(BookCardBody)
