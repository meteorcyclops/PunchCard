import React, {Component} from 'react'
import {observer} from 'mobx-react'
import _ from 'lodash'
import Button from 'material-ui/Button'
import Dialog, {
    DialogActions,
    DialogContent,
    DialogContentText,
} from 'material-ui/Dialog'
import Rx from 'rxjs';
import $ from 'jquery'

import 'animate.css/animate.min.css'

import HistoryTitle from './HistoryTitle'
import TitleTime from './TitleTime'
import BookCardBody from './BookCardBody'

import bookStore from './stores/book'

import styled, {keyframes} from 'styled-components'

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.timeCount = false
        this.ableBack = true
    }

    componentWillMount() {
        bookStore.getBackendTime()
        bookStore.getLastPunch()
    }

    handleRequestClose(){
        bookStore.setObs('dialogOpen', false)
        bookStore.getLastPunch()
    }

    componentDidMount() {
        const elementRoot = document.querySelector('body')
        const touchStartEvent = Rx.Observable.fromEvent(elementRoot, 'touchstart')
        const touchMoveEvent = Rx.Observable.fromEvent(elementRoot, 'touchmove')
        const touchEndEvent = Rx.Observable.fromEvent(elementRoot, 'touchend')

        const observerBackPage = touchStartEvent
            .switchMap(
                (e) => {
                    this.x = e.touches[0].clientX
                    this.timeCount = true
                    _.delay(() => this.timeCount = false, 500)
                    return touchMoveEvent.takeUntil(touchEndEvent)
                })

        observerBackPage.subscribe((e) => {
            const startX = this.x
            const endX = e.touches[0].clientX

            if (((endX - startX) > 90) && this.timeCount && this.ableBack) {
                this.timeCount = false
                bookStore.setObs('defaultTab', 1)
            }
            if (((endX - startX) < -90) && this.timeCount && this.ableBack) {
                this.timeCount = false
                bookStore.setObs('defaultTab', 0)
            }
        })
    }

    handleOnChange(e){
        if(e.target.id == 'tab-2'){
            bookStore.setObs('defaultTab', 0)
        }else{
            bookStore.setObs('defaultTab', 1)
        }
    }

    render() {
        const style = {
            padding: '2.25em 1.6875em',
            backgroundImage: 'repeating-linear-gradient(135deg, rgba(0,0,0,.3), rgba(0,0,0,.3) 1px, transparent 2px, transparent 2px, rgba(0,0,0,.3) 3px)',
            backgroundSize: '4px 4px'

        };

        const locked = bookStore.locked
        const defaultTab = bookStore.defaultTab

        const InputPounch = styled.label`
            font-size: 26px;
            transform: scale(1.1);
            transform-origin: left;
        `
        return (
            <div className="for-the-overlay">
                <Dialog
                    style={style}
                    open={bookStore.dialogOpen}
                    onRequestClose={this.handleRequestClose.bind(this)}
                    classes={{
                        paper: "dialogPaper"
                    }}
                >
                    <DialogContent>
                        <DialogContentText style = {{color: '#6a6f8c',whiteSpace:'pre-line'}}>
                            {bookStore.status}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            className='animated tada infinite'
                            onClick={this.handleRequestClose}
                            style = {{color: '#bbbdd6',fontWeight:'400'}}
                        >
                            確認
                        </Button>
                    </DialogActions>
                </Dialog>
                <HistoryTitle />
                <div className="login-wrap">
                    <div className="login-html">
                        <input id="tab-1" type="radio" name="tab" className="sign-in"
                               checked={defaultTab} onChange={this.handleOnChange} />

                        <InputPounch htmlFor="tab-1" className="tab">上班</InputPounch>
                        <input id="tab-2" type="radio" name="tab" className="sign-up"
                               checked={!defaultTab} onChange={this.handleOnChange} />

                        <InputPounch htmlFor="tab-2" className="tab">下班</InputPounch>

                        <div className="login-form" style={{marginTop: '5%'}}>
                            <BookCardBody
                                className={"sign-in-htm"}
                                onClick={bookStore.onBoard}
                                in
                                locked={locked}
                            />
                            <BookCardBody
                                className={"sign-up-htm"}
                                onClick={bookStore.offBoard}
                                locked={locked}
                            />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default observer(App)
