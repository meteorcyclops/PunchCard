import React, {Component} from 'react';
import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';
import Input, {InputLabel} from 'material-ui/Input';
import Switch from 'material-ui/Switch';
import {FormControlLabel} from 'material-ui/Form';
import Checkbox from 'material-ui/Checkbox';
import styled, {injectGlobal} from 'styled-components'
import green from 'material-ui/colors/green';
import moment from 'moment';

import validation from './stores/Validation'

import './css/App.css'

const styles = {
    checked: {
        color: green[500],
    },
};

class App extends Component {
    constructor() {
        super();
        const uid = localStorage.getItem('uid') || ""
        const pwd = localStorage.getItem('pwd') || ""
        const locked = localStorage.getItem('locked') || ""
        
        this.state = {
            uid: uid,
            pwd: pwd,
            status: "",
            locked: locked,
            emergency: false
        };
    }

    check(type) {
        validation(type, this.state.uid, this.state.pwd).then((res) => {
            let status = res.ErrorMessage;
            if (status === "") {
                let ts = res.TimeStamp;
                let dt = moment(ts).format("YYYY/MM/DD hh:mm:ss");
                let username = res.UserName;
                if (type === 1) {
                    status = `${username} 上班打卡成功(${dt})`;
                }
                if (type === 2) {
                    status = `${username} 緊急上班打卡成功(${dt})`;
                }
                if (type === 3) {
                    status = `${username} 緊急下班打卡成功(${dt})`;
                }
                if (type === 9) {
                    status = `${username} 下班打卡成功(${dt})`;
                }

                localStorage.setItem('uid', this.state.uid);
                localStorage.setItem('pwd', this.state.pwd);
                localStorage.setItem('locked', this.state.locked);
            }
            this.setState({
                status: status
            })
        })
    }

    onBoard() {
        if (this.state.emergency) {
            this.check(2);
        } else {
            this.check(1);
        }
    }

    offBoard() {
        if (this.state.emergency) {
            this.check(3);
        } else {
            this.check(9);
        }
    }

    handleChange = prop => event => {
        this.setState({[prop]: event.target.value});
    }

    handleBool = prop => (event, checked) => {
        this.setState({[prop]: checked});
    }

    render() {
        let msg = "";
        if (this.state.status !== "") {
            msg = (
                <Grid item xs={12} style={{color: "#fff"}}>
                    <h3>{this.state.status}</h3>
                </Grid>
            )
        }
        return (
            <div className="login-wrap">
                <div className="login-html">
                    <input id="tab-1" type="radio" name="tab" className="sign-in" checked/><label htmlFor="tab-1"
                                                                                                  className="tab">上班</label>
                    <input id="tab-2" type="radio" name="tab" className="sign-up"/><label htmlFor="tab-2"
                                                                                          className="tab">下班</label>
                    <div className="login-form" style={{marginTop: '8%'}}>
                        <div className="sign-in-htm">
                            <div className="group">
                                <label htmlFor="uid" className="label">帳號</label>
                                <input
                                    id="uid"
                                    disabled={this.state.locked}
                                    value={this.state.uid}
                                    onChange={this.handleChange('uid')}
                                    className="input"
                                />
                            </div>
                            <div className="group">
                                <label htmlFor="pwd" className="label">密碼</label>
                                <input
                                    id="pwd"
                                    disabled={this.state.locked}
                                    type="password"
                                    value={this.state.pwd}
                                    onChange={this.handleChange('pwd')}
                                    className='input'
                                />
                            </div>
                            <div className="group">
                                <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                                    <FormControlLabel
                                        style={{margin: '0'}}
                                        control={
                                            <Switch
                                                checked={this.state.locked}
                                                onChange={this.handleBool('locked')}
                                                aria-label="locked"
                                            />
                                        }
                                    />
                                    <div style={{
                                        color: '#d8d8d8',
                                        left: '-6px',
                                        top: '1px',
                                        position: 'relative',
                                        fontWeight: 'normal',
                                        fontSize: '15px'
                                    }}>鎖定帳密
                                    </div>

                                    <FormControlLabel
                                        style={{margin: '0'}}
                                        control={
                                            <Checkbox
                                                checked={this.state.emergency}
                                                onChange={this.handleBool('emergency')}
                                                value="emergency"
                                            />
                                        }
                                    />
                                    <div style={{
                                        color: '#d8d8d8',
                                        left: '-6px',
                                        top: '1px',
                                        position: 'relative',
                                        fontWeight: 'normal',
                                        fontSize: '15px'
                                    }}>緊急狀態
                                    </div>
                                </div>
                            </div>
                            <div className="group">
                                <button
                                    className='button'
                                    onClick={this.onBoard.bind(this)}
                                >
                                    上班
                                </button>
                            </div>
                            <div className="hr"/>
                            <div className="foot-lnk">
                                <div style={{color: '#fff'}}>{msg}</div>
                            </div>
                        </div>
                        <div className="sign-up-htm">
                            <div className="group">
                                <label htmlFor="uid" className="label">帳號</label>
                                <input
                                    id="uid"
                                    disabled={this.state.locked}
                                    value={this.state.uid}
                                    onChange={this.handleChange('uid')}
                                    className="input"
                                />
                            </div>
                            <div className="group">
                                <label htmlFor="pwd" className="label">密碼</label>
                                <input
                                    id="pwd"
                                    disabled={this.state.locked}
                                    type="password"
                                    value={this.state.pwd}
                                    onChange={this.handleChange('pwd')}
                                    className='input'
                                />
                            </div>
                            <div className="group">
                                <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                                    <FormControlLabel
                                        style={{margin: '0'}}
                                        control={
                                            <Switch
                                                checked={this.state.locked}
                                                onChange={this.handleBool('locked')}
                                                aria-label="locked"
                                            />
                                        }
                                    />
                                    <div style={{
                                        color: '#d8d8d8',
                                        left: '-6px',
                                        top: '1px',
                                        position: 'relative',
                                        fontWeight: 'normal',
                                        fontSize: '15px'
                                    }}>鎖定帳密
                                    </div>

                                    <FormControlLabel
                                        style={{margin: '0'}}
                                        control={
                                            <Checkbox
                                                checked={this.state.emergency}
                                                onChange={this.handleBool('emergency')}
                                                value="emergency"
                                            />
                                        }
                                    />
                                    <div style={{
                                        color: '#d8d8d8',
                                        left: '-6px',
                                        top: '1px',
                                        position: 'relative',
                                        fontWeight: 'normal',
                                        fontSize: '15px'
                                    }}>緊急狀態
                                    </div>
                                </div>
                            </div>
                            <div className="group">
                                <button
                                    className='button'
                                    onClick={this.offBoard.bind(this)}>
                                    下班
                                </button>
                            </div>
                            <div className="hr"/>
                            <div className="foot-lnk">
                                <div style={{color: '#fff'}}>{msg}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default App
