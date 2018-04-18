import React, { Component } from 'react';
import changePasswdStore from '../stores/ChangePasswdStore';
import { observer } from 'mobx-react'
// import swal from 'sweetalert';
import Card, { CardActions, CardContent, CardMedia } from 'material-ui/Card';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import warningIcon from '../pictures/warning.png';
import bookStore from '../stores/book';
const styles = {
    hintChangedPwd_card: {
        width: '90%',
        maxWidth: '500px',
        position: 'absolute',
        zIndex: '2',
        left: '50%',
        top: '50%',
        backgroundColor: 'midnightblue',
        padding: '6% 7%',
        paddingTop: '3%',
        borderRadius: '5px',
        transform: 'translate(-50% ,-50%)',
    }
}
const HintChangePwd = observer(class HintChangePwd extends Component {
    handleChangePwdNow = ()=>{
        changePasswdStore.setShowHint(false);
        bookStore.setObs('recordPageOpen', true);
        changePasswdStore.setPwdOpen(true);
    }
    render() {
        const { classes } = this.props;

        if (changePasswdStore.showHint === true) {

            let text = changePasswdStore.remainDays>=0 ? `您的密碼將在${changePasswdStore.remainDays}天後到期` : `您的密碼已經過期`;


            return (
                <Card className={classes.hintChangedPwd_card}>

                    <CardContent>
                        <img src={warningIcon} alt="警告icon" className="hintChangePwd_warningIcon" />
                    </CardContent>
                    <CardContent style={{padding: '0', marginTop: '15px'}}>
                        <div className="hintChangePwd_main">{text}<br />
                            請在{changePasswdStore.pwdLockDeadline.format("YYYY-MM-DD")}前更新密碼<br />
                            否則無法打卡<br />
                        </div>
                    </CardContent>
                    <CardActions style={{marginTop: '30px', justifyContent: 'space-between'}}>
                        <button className="pwdPanel_submit" style={{fontSize: '0.8rem', margin: '0'}} onClick={this.handleChangePwdNow}>修改密碼</button>
                        <button className="pwdPanel_cancel" style={{fontSize: '0.8rem', margin: '0'}} onClick={()=>{changePasswdStore.setShowHint(false);}}>先不用</button>
ß                    </CardActions>
                </Card>


            );
        } else {
            return null;
        }

    }
})

export default     (withStyles(styles)  (HintChangePwd))    ;
