import React, {Component} from 'react';
import './App.css';
import Grid from 'material-ui/Grid';
import validation from './Validation'
import Button from 'material-ui/Button';
import Input, {InputLabel} from 'material-ui/Input';
import moment from 'moment';
import Switch from 'material-ui/Switch';
import {FormControlLabel, FormGroup, FormControl} from 'material-ui/Form';
import Checkbox from 'material-ui/Checkbox';

import styled, {injectGlobal} from 'styled-components'

class App extends Component {

    constructor() {
        super();
        let uid = localStorage.getItem('uid');
        let pwd = localStorage.getItem('pwd');
        let locked = localStorage.getItem('locked');
        if (uid === null) {
            uid = ""
        }
        if (pwd === null) {
            pwd = ""
        }
        if (locked === null) {
            locked = false
        }
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
            });
        });
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
    };

    handleBool = prop => (event, checked) => {
        this.setState({[prop]: checked});
    };

    render() {

        injectGlobal`

            body {
              margin: 0;
              color: #6a6f8c;
              background: #c8c8c8;
              font: 600 16px/18px 'Open Sans', sans-serif;
            }

            *, :after, :before {
              box-sizing: border-box
            }

            .clearfix:after, .clearfix:before {
              content: '';
              display: table
            }

            .clearfix:after {
              clear: both;
              display: block
            }

            a {
              color: inherit;
              text-decoration: none
            }

            .login-wrap {
              width: 100%;
              margin: auto;
              max-width: 525px;
              min-height: 670px;
              position: relative;
              background: url(https://raw.githubusercontent.com/khadkamhn/day-01-login-form/master/img/bg.jpg) no-repeat center;
              box-shadow: 0 12px 15px 0 rgba(0, 0, 0, .24), 0 17px 50px 0 rgba(0, 0, 0, .19);
            }

            .login-html {
              width: 100%;
              height: 100%;
              position: absolute;
              padding: 90px 70px 50px 70px;
              background: rgba(40, 57, 101, .9);
            }

            .login-html .sign-in-htm,
            .login-html .sign-up-htm {
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              position: absolute;
              transform: rotateY(180deg);
              backface-visibility: hidden;
              transition: all .4s linear;
            }

            .login-html .sign-in,
            .login-html .sign-up,
            .login-form .group .check {
              display: none;
            }

            .login-html .tab,
            .login-form .group .label,
            .login-form .group .button {
              text-transform: uppercase;
            }

            .login-html .tab {
              font-size: 22px;
              margin-right: 15px;
              padding-bottom: 5px;
              margin: 0 15px 10px 0;
              display: inline-block;
              border-bottom: 2px solid transparent;
            }

            .login-html .sign-in:checked + .tab,
            .login-html .sign-up:checked + .tab {
              color: #fff;
              border-color: #1161ee;
            }

            .login-form {
              min-height: 345px;
              position: relative;
              perspective: 1000px;
              transform-style: preserve-3d;
            }

            .login-form .group {
              margin-bottom: 15px;
            }

            .login-form .group .label,
            .login-form .group .input,
            .login-form .group .button {
              width: 100%;
              color: #fff;
              display: block;
            }

            .login-form .group .input,
            .login-form .group .button {
              border: none;
              padding: 15px 20px;
              border-radius: 25px;
              background: rgba(255, 255, 255, .1);
            }

            .login-form .group input[data-type="password"] {
              text-security: circle;
              -webkit-text-security: circle;
            }

            .login-form .group .label {
              color: #aaa;
              font-size: 12px;
            }

            .login-form .group .button {
              background: #1161ee;
            }

            .login-form .group label .icon {
              width: 15px;
              height: 15px;
              border-radius: 2px;
              position: relative;
              display: inline-block;
              background: rgba(255, 255, 255, .1);
            }

            .login-form .group label .icon:before,
            .login-form .group label .icon:after {
              content: '';
              width: 10px;
              height: 2px;
              background: #fff;
              position: absolute;
              transition: all .2s ease-in-out 0s;
            }

            .login-form .group label .icon:before {
              left: 3px;
              width: 5px;
              bottom: 6px;
              transform: scale(0) rotate(0);
            }

            .login-form .group label .icon:after {
              top: 6px;
              right: 0;
              transform: scale(0) rotate(0);
            }

            .login-form .group .check:checked + label {
              color: #fff;
            }

            .login-form .group .check:checked + label .icon {
              background: #1161ee;
            }

            .login-form .group .check:checked + label .icon:before {
              transform: scale(1) rotate(45deg);
            }

            .login-form .group .check:checked + label .icon:after {
              transform: scale(1) rotate(-45deg);
            }

            .login-html .sign-in:checked + .tab + .sign-up + .tab + .login-form .sign-in-htm {
              transform: rotate(0);
            }

            .login-html .sign-up:checked + .tab + .login-form .sign-up-htm {
              transform: rotate(0);
            }

            .hr {
              height: 2px;
              margin: 60px 0 50px 0;
              background: rgba(255, 255, 255, .2);
            }

            .foot-lnk {
              text-align: center;
            }
        `

        let msg = "";
        if (this.state.status !== "") {
            msg = (
                <Grid item xs={12} style={{color: "darkred"}}>
                    <h3>{this.state.status}</h3>
                </Grid>
            )
        }
        return (
            <div className="login-wrap">
                <div className="login-html">
                    <input id="tab-1" type="radio" name="tab" className="sign-in" checked/><label for="tab-1"
                                                                                                  className="tab">Sign
                    In</label>
                    <input id="tab-2" type="radio" name="tab" className="sign-up"/><label for="tab-2"
                                                                                          className="tab">Sign
                    Up</label>
                    <div className="login-form">
                        <div className="sign-in-htm">
                            <div className="group">
                                <label for="user" className="label">Username</label>
                                <input id="user" type="text" className="input"/>
                            </div>
                            <div className="group">
                                <label for="pass" className="label">Password</label>
                                <input id="pass" type="password" className="input" data-type="password"/>
                            </div>
                            <div className="group">
                                <input id="check" type="checkbox" className="check" checked/>
                                <label for="check"><span className="icon"></span> Keep me Signed
                                    in</label>
                            </div>
                            <div className="group">
                                <input type="submit" className="button" value="Sign In"/>
                            </div>
                            <div className="hr"/>
                        </div>
                        <div className="sign-up-htm">
                            <div className="group">
                                <label for="user" className="label">Username</label>
                                <input id="user" type="text" className="input"/>
                            </div>
                            <div className="group">
                                <label for="pass" className="label">Password</label>
                                <input id="pass" type="password" className="input" data-type="password"/>
                            </div>
                            <div className="group">
                                <label for="pass" className="label">Repeat Password</label>
                                <input id="pass" type="password" className="input" data-type="password"/>
                            </div>
                            <div className="group">
                                <label for="pass" className="label">Email Address</label>
                                <input id="pass" type="text" className="input"/>
                            </div>
                            <div className="group">
                                <input type="submit" className="button" value="Sign Up"/>
                            </div>
                            <div className="hr"/>
                            <div className="foot-lnk">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default App
