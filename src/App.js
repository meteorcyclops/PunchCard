import React, {Component} from 'react'
// import green from 'material-ui/colors/green'
import {observer} from 'mobx-react'

import TitleTime from './TitleTime'
import BookCardBody from './BookCardBody'

import bookStore from './stores/book'

import styled, {keyframes} from 'styled-components'
import './css/App.css'

class App extends Component {
    componentWillMount() {
        bookStore.getBackendTime()
    }

    render() {
        const locked = bookStore.locked
        const InputPounch = styled.label`
            font-size: 26px;
            transform: scale(1.1);
            transform-origin: left;
        `
        return (
            <div className="for-the-overlay">
                {/*<TitleTime />*/}
                <div className="login-wrap">
                    <div className="login-html">
                        <input id="tab-1" type="radio" name="tab" className="sign-in" defaultChecked/>
                        <InputPounch htmlFor="tab-1" className="tab">上班</InputPounch>
                        <input id="tab-2" type="radio" name="tab" className="sign-up"/>
                        <InputPounch htmlFor="tab-2" className="tab">下班</InputPounch>

                        <div className="login-form" style={{marginTop: '8%'}}>
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
