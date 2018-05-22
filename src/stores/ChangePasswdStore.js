import moment from 'moment'
import 'moment-timezone'
import { observable, action } from 'mobx'
import _ from 'lodash'
import axios from 'axios';
import writeBook from './writeBook'
import bookStore from './book';
// import swal from 'sweetalert2'
import swal from 'sweetalert';
import '../css/ChangePasswd.css';
import { Base64 } from 'js-base64';

class ChangePasswdStore {
	@observable
	sid = "";

	@observable
	LastSet = "";

	@observable
	showHint = false;

	@observable
	remainDays = '';

	@observable
	pwdLockDeadline = '';

	@observable
	openPwdChanging = false;

	@observable
	isBusy = false;

	@action
	sendToServer(account, oldPwd, newPwd) {
		this.setIsBusy(true);
		const base64Encode_oldPwd = Base64.encode(oldPwd);
		const base64Encode_newPwd = Base64.encode(newPwd);

		try {
			localStorage.setItem('pwd', newPwd)
		}
		catch{

		}

		let obj = {
			username: account,
			pwd: base64Encode_oldPwd,
			new_pwd: base64Encode_newPwd
		};
		const showFail = ()=>{
			swal({
				icon: "error",
				title: `更改失敗`,
				text: `可能失敗的原因：

							●不能使用前3次密碼
							●密碼長度至少5個字元
							●舊帳號密碼錯誤`,
				closeOnClickOutside: false,
			});
		}
		axios.post('https://staff.kfsyscc.org/hrapi/change_pwd', obj)
		.then(res=>{
			this.setIsBusy(false);
			if(res.status === 200 && res.data && res.data.status === true){
				swal({
					title: "修改密碼成功", 
					text: "下次請使用新密碼", 
					icon:"success",
					closeOnClickOutside: false
				});
			}else{
				showFail();
			}
		})
		.catch(err=>{
			console.log('err:',err);
			this.setIsBusy(false);
			showFail();
		})
	}


	@action
	setSid(newValue) {
		this.sid = newValue;

		if (!_.isEmpty(this.sid)) {
			axios.get('https://staff.kfsyscc.org/api/python/passwd_last_set/' + this.sid)
				.then(res => {
					if (res.data.status === "ok") {
						let pwdLastSet = res.data.pwdLastSet;
						this.LastSet = moment(pwdLastSet, "YYYY-MM-DD");
						this.pwdLockDeadline = this.LastSet.add(90, 'days');
						let now = moment();

						this.remainDays = this.pwdLockDeadline.diff(now, 'days');
						//if 已經快到90天了，跳請更新密碼提示訊息

						//剩10天內到期，跳提示訊息
						if (this.remainDays < 10) {
							this.showHint = true;
						}

					} else if (res.data.status === "error") {
						console.log('檢查是否需要改密碼，發生錯誤:', res.data.message);
					}
				})
				.catch(err => {
					console.log('檢查是否需要改密碼，發生錯誤:', err);
				})
		}
	}

	@action
	setPwdOpen(newValue) {
		this.openPwdChanging = newValue;
	}

	@action 
	setIsBusy(newValue){
		this.isBusy = newValue;
	}
	@action
	setShowHint(newValue) {
		this.showHint = newValue;
	}
}

var changePasswdStore = new ChangePasswdStore()

export default changePasswdStore

