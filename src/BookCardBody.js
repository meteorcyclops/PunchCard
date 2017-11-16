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

        const BoxLabelLock = this.styledDiv.boxLabelLock
        const BoxLabelEmer = this.styledDiv.boxLabelEmergency
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
                            label={<BoxLabelLock>帳密鎖定</BoxLabelLock>}
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    onChange={this.handleBool('emergency')}
                                    value="emergency"
                                    style={{margin: '0px 7px'}}
                                />
                            }
                            label={<BoxLabelEmer>緊急狀態</BoxLabelEmer>}
                        />
                    </FlexRowDiv>
                </div>
                <div className="group">
                    <UpdownButton onClick={bookFunction}>
                        {inOrOut ? '上班' : '下班'}
                    </UpdownButton>
                </div>
                <div className="hr"/>
                <div className="foot-lnk">
                    <TitleTime />
                    <div style={{
                        color: "#fff", textAlign: 'justify',
                        textJustify: 'inter-ideographic'
                    }}>
                        <h3>{mobx.toJS(msg)}</h3>
                    </div>
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
                height:${locked?'0px':'140px'};
            `
            this.styledDiv.inputDiv = this.styledDiv.inputDiv.extend`
                animation: ${locked?this.styledDiv.bouncedUp:this.styledDiv.bouncedDown} 0.5s 0s cubic-bezier(.28,-0.8,.74,1.59);
            `
            this.styledDiv.upDownButton = !locked?this.styledDiv.fatButton:this.styledDiv.thinButton

            this.styledDiv.upDownButton = this.styledDiv.upDownButton.extend`
                animation: ${locked?this.styledDiv.makeItBigger:this.styledDiv.makeItSmaller} .4s cubic-bezier(.17,.67,.83,.67);
                animation-fill-mode: forwards;
                animation-delay: 0.6s;
            `
        }
    }

    styledDiv = {
        boxLabelLock: styled.span`
            color: #d8d8d8;
            left: -4px;
            top: -1px;
            position: relative;
            font-weight: normal;
            font-size: '15px'
        `,
        boxLabelEmergency: styled.span`
            color: #d8d8d8;
            left: -9px;
            top: -1px;
            position: relative;
            font-weight: normal;
            font-size: '15px'
        `,
        flexRowDiv: styled.div`
            display: flex;
            flex-flow: row;
            align-items: center;
            flex-wrap: wrap;
            //justify-content: center;
        `,
        bouncedUp: keyframes`
            from { height:140px; }
            to { height:0; }
        `,
        bouncedDown: keyframes`
            from{ height:0; }
            to{ height:140px; }
        `,
        inputDiv: styled.div`
        `,
        upDownButton: styled.button.attrs({ className:'button' })`
            width: 95%;
            height:45px;
            margin:0 auto;
        `
        ,
        // 胖按鈕
        fatButton: styled.button.attrs({ className:'button' })`
            
            height: 105px;
            width: 95%;
            margin: 0 auto;
            box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
            text-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
        `,
        // 瘦按鈕
        thinButton: styled.button.attrs({ className:'button' })`
            
            width: 95%;
            height:45px;
            margin:0 auto;
        `,
        // 變胖
        makeItBigger: keyframes`
            from{
                width: 95%;
                height:45px;
                margin:0 auto;
                
                box-shadow: none;
                text-shadow: none ;
            }
            to{
                
                height:105px;
                
                margin: 0 auto;
                box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
                text-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
            }
        `,
        // 變瘦
        makeItSmaller: keyframes`
            from{
                
                height:105px;
                
                margin: 0 auto;
                box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
                text-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
            }
            to{
                width: 95%;
                height:45px;
                margin:0 auto;
                
                box-shadow: none;
                text-shadow: none ; 
            }
        `


    }
}

export default observer(BookCardBody)
