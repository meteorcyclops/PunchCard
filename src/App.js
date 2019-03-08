import React, { Component } from 'react'
import { observer } from 'mobx-react'
import platform from 'platform'
import { Observable } from 'rxjs'
import _ from 'lodash'
import Button from 'material-ui/Button'
import Dialog, { DialogActions, DialogContent, DialogContentText } from 'material-ui/Dialog'
import styled, { keyframes } from 'styled-components'

import HistoryTitle from './HistoryTitle'
import TitleTime from './TitleTime'
import BookCardBody from './BookCardBody'
import DragPage from './DragPage'
import AttendanceRecord from './punchRecord/AttendanceRecord'
import bookStore from './stores/book'
import HintChangePwd from './changePasswd/HintChangePwd'
import ChangePwd from './changePasswd/ChangePwd'
import 'animate.css/animate.min.css'
import 'font-awesome/css/font-awesome.min.css'
import 'whatwg-fetch'


const browser_name = platform.name
const browser_version = platform.version
let browser_not_support = false

function browserNotSupport() {
    window.alert("警告！您現在使用的瀏覽器『太舊』，網站可能會出現異常。請使用『新版』的 Chrome/Safari 瀏覽器！\n\nYour Browser may not support. Please use newest version of Chrome/Safari!\n\n\n\n" + '您的瀏覽器名稱：' + platform.name + ', 您的瀏覽器版本：' + platform.version)
}

if ((browser_name == "IE" && parseFloat(browser_version) > 11.0) ||
    (browser_name == "Chrome" && browser_version >= "47.0") ||
    (browser_name == "Chrome Mobile" && browser_version > "51.0") ||
    (browser_name == "Safari" && parseFloat(browser_version) > 7.0)
) {
} else {
    browser_not_support = true
}

if (browser_not_support) {
    browserNotSupport();
}

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

    handleRequestClose() {
        bookStore.setObs('dialogOpen', false)
        bookStore.getLastPunch()
    }

    componentDidMount() {
        const elementRoot = document.querySelector('#punchBody')
        const touchStartEvent = Observable.fromEvent(elementRoot, 'touchstart')
        const touchMoveEvent = Observable.fromEvent(elementRoot, 'touchmove')
        const touchEndEvent = Observable.fromEvent(elementRoot, 'touchend')

        const observerBackPage = touchStartEvent
            .switchMap(
            (e) => {
                this.x = e.touches[0].clientX
                this.timeCount = true
                _.delay(() => this.timeCount = false, 500)
                return touchMoveEvent.takeUntil(touchEndEvent)
            }
            )

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

    handleOnChange(e) {
        if (e.target.id == 'tab-2') {
            bookStore.setObs('defaultTab', 0)
        } else {
            bookStore.setObs('defaultTab', 1)
        }
    }

    render() {
        console.log('v1')

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

                <DragPage 
                    open = {bookStore.recordPageOpen} 
                    closeFunc={()=>{ bookStore.setObs('recordPageOpen', false) }}
                >
                    <AttendanceRecord/>
                </DragPage>
                <ChangePwd />
                <HintChangePwd />
                <HistoryTitle />

                <div className="login-wrap" id="punchBody">
                    <div className="login-html">
                        <input id="tab-1" type="radio" name="tab" className="sign-in"
                            checked={defaultTab} onChange={this.handleOnChange} />

                        <InputPounch htmlFor="tab-1" className="tab">上班</InputPounch>
                        <input id="tab-2" type="radio" name="tab" className="sign-up"
                            checked={!defaultTab} onChange={this.handleOnChange} />

                        <InputPounch htmlFor="tab-2" className="tab">下班</InputPounch>

                        <div className="login-form" style={{ marginTop: '5%' }}>
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

                <Dialog
                    style={style}
                    open={bookStore.dialogOpen}
                    onRequestClose={this.handleRequestClose.bind(this)}
                    classes={{
                        paper: "dialogPaper"
                    }}
                >
                    <DialogContent>
                        <DialogContentText style={{ color: '#6a6f8c', whiteSpace: 'pre-line', minWidth: '150px' }}>
                            {bookStore.status}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            className='animated tada infinite'
                            onClick={this.handleRequestClose}
                            style={{ color: '#bbbdd6', fontWeight: '400' }}
                        >
                            確認
                        </Button>
                    </DialogActions>
                </Dialog>

            </div>
        )
    }
}

export default observer(App)
