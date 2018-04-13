import React, { Component } from 'react';
import changePasswdStore from '../stores/ChangePasswdStore';
import swal from 'sweetalert';

import { observer } from 'mobx-react'
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import _ from 'lodash';
import bookStore from '../stores/book';
import FontAwesome from 'react-fontawesome';


class ChangePwd extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: bookStore.uid,
            password: bookStore.pwd,
            err_msg: '',
        }
    }
    handleSend = () => {
        changePasswdStore.sendToServer(this.adAccount.value, this.oldPasswd.value, this.newPasswd.value);
    }

    togglePasswd = (target) => {
        if (target.getAttribute("type") === 'password') {
            target.setAttribute('type', 'text');
        } else {
            target.setAttribute('type', 'password');
        }
    }
    checkNewPasswd= (e)=>{
        console.log('e:',e.target.value);
        const errChar = '!#@$%^&*()-+';
        const mypwd = e.target.value;
        let isOK = true;
        let err_msg_list = [];

        if(mypwd.length < 5){
            err_msg_list.push('至少5個字元');
            isOK = false;
        }

        for(let i=0;i<mypwd.length;i++){
            if( _.includes(errChar, mypwd[i]) ){
                err_msg_list.push('不得使用特殊符號：!#@$%^&*()-+');
                isOK = false;
                break;
            }
        }


        if(isOK){
            this.setState({err_msg: ''});
        }else{
            this.setState({err_msg: err_msg_list.join(', ')  });
            // this.newPasswd.style.backgroundColor = '#D0021B';
        }
    }
    render() {
        if (changePasswdStore.openPwdChanging) {
            return (
                <Paper elevation={4} className="changePwdPanel">
                    <div className="pwdPanel_wrapper">
                        <h1 className="pwdPanel_title">修改密碼</h1>

                        <div className="pwdPanel_field">帳號</div>
                        <div className="pwdPanel_row">
                            <input type='text' className="pwdPanel_input" value={bookStore.uid} ref={a => this.adAccount = a} />
                        </div>

                        <div className="pwdPanel_field">原密碼</div>
                        <div className="pwdPanel_row">
                            <input type='text' className="pwdPanel_input" ref={a => this.oldPasswd = a} />
                            <FontAwesome name='eye-slash'
                                size='2x'
                                style={{ color: 'rgba(255, 255, 255, 0.7)', cursor: 'pointer', position: 'absolute', right: '18px', padding: '1px 10px' }}
                                onClick={() => { this.togglePasswd(this.oldPasswd) }}
                            />
                        </div>


                        <div className="pwdPanel_field">新密碼<span className="pwdPanel_pwdHint">{this.state.err_msg}</span></div>
                        <div className="pwdPanel_row">
                            <input type='text' 
                                className="pwdPanel_input" 
                                ref={a => this.newPasswd = a} 
                                onChange={this.checkNewPasswd}/>
                            <FontAwesome name='eye-slash'
                                size='2x'
                                style={{ color: 'rgba(255, 255, 255, 0.7)', cursor: 'pointer', position: 'absolute', right: '18px', padding: '1px 10px' }}
                                onClick={() => { this.togglePasswd(this.newPasswd) }}
                            />
                        </div>

                        {/* 新密碼：<input type='text'  ref={a => this.newPasswdAgain = a}/><br /> */}
                        <div className="pwdPanel_row" style={{ justifyContent: 'space-between' }}>
                            <button className="pwdPanel_submit" onClick={this.handleSend}>送出</button>
                            <button className="pwdPanel_cancel" onClick={() => { changePasswdStore.setPwdOpen(false); }}>放棄</button>
                        </div>
                    </div>
                </Paper>


            );
        } else {
            return null;
        }


    }
}

export default observer(ChangePwd);
