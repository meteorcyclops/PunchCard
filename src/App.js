import React, {Component} from 'react'
// import green from 'material-ui/colors/green'

import TitleTime    from './TitleTime'
import BookCardBody from './BookCardBody'

import bookStore from './stores/book'

import './css/App.css'

class App extends Component {
    render() {
        return (
            <div className="for-the-overlay">
                {/*<TitleTime />*/}
                <div className="login-wrap">
                    <div className="login-html">
                        <input id="tab-1" type="radio" name="tab" className="sign-in" defaultChecked/>
                        <label htmlFor="tab-1" className="tab">上班</label>
                        <input id="tab-2" type="radio" name="tab" className="sign-up"/>
                        <label htmlFor="tab-2" className="tab">下班</label>

                        <div className="login-form" style={{marginTop: '8%'}}>
                            <BookCardBody
                                className="sign-in-htm"
                                onClick={bookStore.onBoard}
                                in
                            />
                            <BookCardBody
                                className="sign-up-htm"
                                onClick={bookStore.offBoard}
                            />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default App
