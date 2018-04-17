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
            origin_pwd_show: false,
            new_pwd_show: false,
        }
    }
    handleSend = () => {
        if(this.adAccount.value.length === 0  || 
            this.oldPasswd.value.length === 0 || 
            this.newPasswd.value.length === 0 ||
            this.checkNewPasswd(this.newPasswd.value) === false
        ){
            return false;
        }

        changePasswdStore.sendToServer(this.adAccount.value, this.oldPasswd.value, this.newPasswd.value);
    }

    checkNewPasswd= (value)=>{
        const errChar = '!#@$%^&*()-+ ';
        const mypwd = value;
        let isOK = true;
        let err_msg_list = [];

        if(mypwd.length < 5){
            err_msg_list.push('至少5個字元');
            isOK = false;
        }

        for(let i=0;i<mypwd.length;i++){
            if( _.includes(errChar, mypwd[i]) ){
                err_msg_list.push('不得使用特殊符號：!#@$%^&*()-+ <空格>');
                isOK = false;
                break;
            }
        }


        if(isOK){
            this.setState({err_msg: ''});
            return isOK;
        }else{
            this.setState({err_msg: err_msg_list.join(', ')  });
            return isOK;
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
                            <input type='text' className="pwdPanel_input" defaultValue={bookStore.uid} ref={a => this.adAccount = a} />
                        </div>

                        <div className="pwdPanel_field">原密碼</div>
                        <div className="pwdPanel_row">
                            <input type={this.state.origin_pwd_show? 'text' : 'password'} className="pwdPanel_input" ref={a => this.oldPasswd = a} />
                            <span 
                                onClick={() => {this.setState( (prevState)=>{return {origin_pwd_show: !prevState.origin_pwd_show}}   ) }}
                                style={{ color: 'rgba(255, 255, 255, 0.7)', cursor: 'pointer', position: 'absolute', right: '18px', padding: '1px 10px', fontWeight: '100' }}
                            >{this.state.origin_pwd_show? '隱藏':'顯示'}</span>

                        </div>


                        <div className="pwdPanel_field">新密碼
                            <sup><FontAwesome name='info-circle'
                                size='lg'
                                style={{ color: 'rgba(255, 255, 255, 0.7)', cursor: 'pointer', fontSize:'0.933333em', marginLeft:'8px'}}
                                onClick={()=>{ swal('密碼原則', `0. 至少5 個字元
                                1. 英文大寫字元 (A 到 Z)
                                2. 英文小寫字元 (a 到 z) 
                                3. 10 進位數字 (0 到 9) 
                                4. 底線( _ )`); }}
                                title="密碼原則"
                            /></sup>

                            <span className="pwdPanel_pwdHint">{this.state.err_msg}</span>
                        </div>
                        <div className="pwdPanel_row">
                            <input type={this.state.new_pwd_show? 'text' : 'password'}
                                className="pwdPanel_input" 
                                ref={a => this.newPasswd = a} 
                                onChange={()=>{this.checkNewPasswd(this.newPasswd.value)}}/>
                            <span 
                                onClick={() => {this.setState( (prevState)=>{return {new_pwd_show: !prevState.new_pwd_show}}   ) }}
                                style={{ color: 'rgba(255, 255, 255, 0.7)', cursor: 'pointer', position: 'absolute', right: '18px', padding: '1px 10px', fontWeight: '100' }}
                            >{this.state.new_pwd_show? '隱藏':'顯示'}</span>

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
