import React, {Component} from 'react'
// import green from 'material-ui/colors/green'
import {observer} from 'mobx-react'
import _ from 'lodash'
import Rx from 'rxjs';
import $ from 'jquery'

import TitleTime from './TitleTime'
import BookCardBody from './BookCardBody'

import bookStore from './stores/book'

import styled, {keyframes} from 'styled-components'
import './css/App.css'

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.timeCount = false
        this.ableBack = true
    }

    componentWillMount() {
        bookStore.getBackendTime()
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
                console.log('right')
                // $( ".login-html, .sign-in-htm" ).addClass("touchSlideRight");
                // $( ".login-html, .sign-in-htm" ).removeClass("touchSlideRight");

            }
            if (((endX - startX) < -90) && this.timeCount && this.ableBack) {
                this.timeCount = false
                // $( ".login-html, .sign-in-htm" ).addClass("touchSlideLeft");
                // $( ".login-html, .sign-in-htm" ).removeClass("touchSlideLeft");
                console.log('left')
            }
        })
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
