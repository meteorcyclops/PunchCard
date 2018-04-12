import React, { Component } from 'react';
import changePasswdStore from '../stores/ChangePasswdStore';
import swal from 'sweetalert';

import { observer } from 'mobx-react'
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';

import bookStore from '../stores/book';

const styles = {
   paper: {
      position:'absolute',
      top:'10px',
      bottom:'10px',
      left:'10px',
      right:'10px',
      zIndex: '4',
   }
}
class ChangePwd extends Component {
   constructor(props) {
      super(props);
      this.state = {
          username: bookStore.uid,
          password: bookStore.pwd,
      }
  }
  handleSend = ()=>{
   changePasswdStore.sendToServer(this.adAccount.value, this.oldPasswd.value, this.newPasswd.value);
  }
  
  togglePasswd = (target)=>{
   if(target.getAttribute("type")==='password'){
      target.setAttribute('type', 'text');
   }else{
      target.setAttribute('type', 'password');
   }
  }
   render() {
      if (changePasswdStore.openPwdChanging) {
         return (
            <Paper elevation={4} style={styles.paper}>
               <h1>修改密碼</h1>
               帳號：<input type='text' value={bookStore.uid} ref={a => this.adAccount = a}/><br />
               舊密碼：<input type='text' ref={a => this.oldPasswd = a}/><button onClick={()=>{this.togglePasswd(this.oldPasswd)}}>切換</button><br />
               新密碼：<input type='text'  ref={a => this.newPasswd = a}/><button onClick={()=>{this.togglePasswd(this.newPasswd)}}>切換</button><br />
               {/* 新密碼：<input type='text'  ref={a => this.newPasswdAgain = a}/><br /> */}
               <button onClick={this.handleSend}>送出</button>
               <button onClick={()=>{changePasswdStore.setPwdOpen(false);}}>關閉</button>
            </Paper>


         );
      } else {
         return null;
      }


   }
}

export default observer(ChangePwd);
