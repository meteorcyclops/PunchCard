import React, {Component} from 'react'
import {observer} from 'mobx-react'
import _ from 'lodash'
import Button from 'material-ui/Button'
import Dialog, {
    DialogActions,
    DialogContent,
    DialogContentText,
  } from 'material-ui/Dialog'

  
import TitleTime from './TitleTime'
import BookCardBody from './BookCardBody'

import bookStore from './stores/book'

import styled, {keyframes} from 'styled-components'
import './css/App.css'

class App extends Component {
    constructor(props){
        super(props)
    }
    componentWillMount() {
        bookStore.getBackendTime()
        bookStore.getLastPunch()
    }

    handleRequestClose(){
        bookStore.setObs('dialogOpen', false)
    }

    render() {
        const locked = bookStore.locked
        const defaultTab = this.props.tab

        const InputPounch = styled.label`
            font-size: 26px;
            transform: scale(1.1);
            transform-origin: left;
        `
        return (
            <div className="for-the-overlay">
                <Dialog open={bookStore.dialogOpen} onRequestClose={this.handleRequestClose.bind(this)}>
                    <DialogContent>
                        <DialogContentText>
                            {bookStore.status}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleRequestClose} color="primary">
                            確認
                        </Button>
                    </DialogActions>
                </Dialog>
                <div className="login-wrap">
                    <div className="login-html">
                        <input id="tab-1" type="radio" name="tab" className="sign-in" defaultChecked={defaultTab} />
                        <InputPounch htmlFor="tab-1" className="tab">上班</InputPounch>
                        <input id="tab-2" type="radio" name="tab" className="sign-up" defaultChecked={!defaultTab} />
                        <InputPounch htmlFor="tab-2" className="tab">下班</InputPounch>

                        <div className="login-form" style={{marginTop: '5%'}}>
                            <BookCardBody
                                className="sign-in-htm"
                                onClick={bookStore.onBoard}
                                in
                                locked={locked}
                            />
                            <BookCardBody
                                className="sign-up-htm"
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
