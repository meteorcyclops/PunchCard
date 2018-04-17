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
	openPwdChanging = false;

	@action
	sendToServer(account, oldPwd, newPwd) {

		let obj = {
			username: account,
			pwd: oldPwd,
			new_pwd: newPwd
		};
		// console.log('obj:',obj);
		const showFail = ()=>{
			swal({
				icon: "error",
				title: `更改失敗`,
				text: `可能失敗的原因：

							●不能使用前3次密碼
							●密碼長度至少5個字元
							●舊帳號密碼錯誤`
			});
		}
		axios.post('https://staff.kfsyscc.org/hrapi/change_pwd', obj)
		.then(res=>{
			console.log('res:',res);
			if(res.status === 200 && res.data && res.data.status === true){
				swal("修改密碼成功", "下次請使用新密碼", "success");
			}else{
				showFail();
			}
		})
		.catch(err=>{
			console.log('err:',err);
			showFail();
		})
	}


	@action
	setSid(newValue) {
		console.log('設新key:', newValue);
		this.sid = newValue;

		if (!_.isEmpty(this.sid)) {
			axios.get('https://staff.kfsyscc.org/api/python/passwd_last_set/' + this.sid)
				.then(res => {
					console.log('取得上次修改密碼日期:', res);
					if (res.data.status === "ok") {
						let pwdLastSet = res.data.pwdLastSet;
						this.LastSet = moment(pwdLastSet, "YYYY-MM-DD");
						let pwdLockDeadline = this.LastSet.add(90, 'days');
						let now = moment();

						this.remainDays = pwdLockDeadline.diff(now, 'days');
						//if 已經快到90天了，跳請更新密碼提示訊息
						this.showHint = true;
						let text = this.remainDays>=0 ? `您的密碼再過${this.remainDays}天到期` : `您的密碼已經到期`;
						swal({
							icon: "warning",
							title: `請更換新密碼`,
							text: `${text}
                        
                        ●資安政策：每隔三個月(90天)必須更換新密碼，否則到時候會無法打卡！
            
                        想沿用舊密碼？
								最近使用過的前3組密碼，系統會鎖住不能再使用。但第4組密碼可以。
								→可先連續改密碼3次，第4次再改回原本的密碼。
								例如：原密碼→改成密碼A→改成密碼B→改成密碼C→改成原密碼`,
							buttons: { changeNow: "立即改密碼", cancel: "先不用" },
							className: 'changePasswdHint'
						})
							.then((value) => {
								switch (value) {
									case "cancel":
										this.showHint = false;
										break;
									case "changeNow":
										bookStore.setObs('recordPageOpen', true);
										changePasswdStore.setPwdOpen(true);
										break;
									default:
										break;
								}
							})



						if (this.remainDays < 10) {
							this.showHint = true;
							// 再過{remainDays}天您的密碼就到期，請更換新密碼

							// 資安政策：每隔三個月(90天)必須更換新密碼，否則無法打卡

							// 記不住新密碼？

							// 最近用過的3組密碼，系統會鎖定不能再使用。但第4組密碼可以。
							// 所以可以先連續改密碼3次，第4次再改回原本的密碼。
							// call-to-action: 『立即改密碼』『先不用』
						}


					} else if (res.data.status === "error") {
						console.log('取得上次修改密碼日期發生錯誤:', res.data.message);
					}
				})
				.catch(err => {
					console.log('err:', err);
				})
		}
	}

	@action
	setPwdOpen(newValue) {
		this.openPwdChanging = newValue;
	}
}

var changePasswdStore = new ChangePasswdStore()

export default changePasswdStore

