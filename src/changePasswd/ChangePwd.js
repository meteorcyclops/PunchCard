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
            err_msg: '',
            show_pwd_again_not_same: false,

            origin_pwd_show: false,
            new_pwd_show: false,
            new_pwd_again_show: false,
        }

        this.adAccount = bookStore.uid;
        this.oldPasswd = ''
        this.newPasswd = ''
        this.newPasswdAgain = ''
    }

    handleSend = () => {

        if (
            this.adAccount.length === 0 || 
            this.oldPasswd.length === 0 || 
            this.checkNewPasswd( this.newPasswd ) === false
        ) {
            return false;
        }

        if( this.newPasswdAgain !== this.newPasswd){
            this.setState({show_pwd_again_not_same: true});
            return false;
        }else{
            this.setState({show_pwd_again_not_same: false});
        }

        changePasswdStore.sendToServer(this.adAccount, this.oldPasswd, this.newPasswd);
    }

    onChangeInput( e, key ){
        this[key] = e.target.value;
        if(key === 'newPasswd'){
            this.checkNewPasswd(this[key]);
        }
    }

    checkNewPasswd = (value) => {
        const errChar = ' ';
        const mypwd = value;
        
        let err_msg_list = [];

        if (mypwd.length < 5) {
            err_msg_list.push('至少5個字元');
        }

        for (let i = 0; i < mypwd.length; i++) {
            if (_.includes(errChar, mypwd[i])) {
                err_msg_list.push('不得使用<空格>');
                break;
            }
        }

        if ( err_msg_list.length === 0 ) {
            this.setState({ err_msg: '' });
            return true;
        
        } else {
            this.setState({ err_msg: err_msg_list.join(', ') });
            return false;
        }
    }

    render() {
        
        if (changePasswdStore.openPwdChanging === false) {
            return null;
        }
        
        return (
            <Paper elevation={4} className="changePwdPanel">
                <div className="pwdPanel_wrapper">
                    <FontAwesome name='times-circle'
                        size='lg'
                        style={{ color: 'white', cursor: 'pointer', position: 'absolute', top: '23px', left: '23px' }}
                        onClick={() => { changePasswdStore.setPwdOpen(false); }}
                    />
                    <h1 className="pwdPanel_title">修改密碼</h1>

                    <div className="pwdPanel_field">帳號</div>
                    <div className="pwdPanel_row">
                        <input type='text' defaultValue={bookStore.uid} onChange={ (e)=>{ this.onChangeInput(e, 'adAccount') }  } />
                    </div>

                    <div className="pwdPanel_field">原密碼</div>
                    <div className="pwdPanel_row">
                        <input type={this.state.origin_pwd_show ? 'text' : 'password'} onChange={ (e)=>{ this.onChangeInput(e, 'oldPasswd') }} />
                        <span 
                            className="pwdPanel_showOrHide"
                            onClick={ () => { this.setState((prevState) => { return { origin_pwd_show: !prevState.origin_pwd_show } }) }}
                        >{this.state.origin_pwd_show ? '隱藏' : '顯示'}</span>

                    </div>


                    <div className="pwdPanel_field">新密碼
                        <FontAwesome name='info-circle'
                            className="pwdPanel_info"
                            size='lg'
                            onClick={() => {
                                swal('密碼原則', `1. 至少 5個字元
                            2. 英文大寫字元 (A 到 Z)
                            3. 英文小寫字元 (a 到 z) 
                            4. 10 進位數字 (0 到 9) 
                            `);
                            }}
                            title="密碼原則"
                        />

                        <span className="pwdPanel_pwdHint">{this.state.err_msg}</span>
                    </div>
                    <div className="pwdPanel_row">
                        <input type={this.state.new_pwd_show ? 'text' : 'password'}
                            onChange={ (e)=>{ this.onChangeInput(e, 'newPasswd') }} 
                        />

                        <span className="pwdPanel_showOrHide"
                            onClick={() => { this.setState((prevState) => { return { new_pwd_show: !prevState.new_pwd_show } }) }}
                        >{this.state.new_pwd_show ? '隱藏' : '顯示'}</span>

                    </div>

                    <div className="pwdPanel_field">確認新密碼
                        <span className="pwdPanel_pwdHint">{this.state.show_pwd_again_not_same? '兩次密碼不一致' :''}</span>
                    </div>
                    <div className="pwdPanel_row">
                        <input type={this.state.new_pwd_again_show ? 'text' : 'password'}
                            onChange={ (e)=>{ this.onChangeInput(e, 'newPasswdAgain') }} 
                        />

                        <span className="pwdPanel_showOrHide"
                            onClick={() => { this.setState((prevState) => { return { new_pwd_again_show: !prevState.new_pwd_again_show } }) }}
                        >{this.state.new_pwd_again_show ? '隱藏' : '顯示'}</span>

                    </div>

                    <div className="pwdPanel_row" style={{ justifyContent: 'space-between' }}>
                        <button className="pwdPanel_submit" onClick={this.handleSend}>送出{changePasswdStore.isBusy? '...':''}</button>
                        <button className="pwdPanel_cancel" onClick={() => { changePasswdStore.setPwdOpen(false); }}>放棄</button>
                    </div>
                </div>
            </Paper>


        );



    }
}

export default observer(ChangePwd);
