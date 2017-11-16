import {observable, action} from 'mobx'

class CheckBook {
    @observable
    msg = ''
    @observable
    lastPunch = ''

    punchList = []

    @action
    loadData(data) {
        this.data = data
    }

    @action
    setMsg(str) {
        this.msg = str
    }

    checkPunch(){
        
        
        
        case '@HumanResources.CARD_NOAPPLYOVERTIME':
            message = '提醒您！\n如非加班，敬請於班表之下班時間30分鐘內打卡下班。\n如是加班，敬請先申請加班費後再打卡下班。\n';
            break;
        case '@HumanResources.CARD_OVER7DAYS_OVER13HOURS':
            message = '打卡失敗!\n已連續上班7日及工作超過13小時。\n';
            break;
        case '@HumanResources.CARD_OVER7DAYS':
            message = '打卡失敗!\n已連續上班7日。\n';
            break;
        case '@HumanResources.CARD_OVER13HOURS':
            message = '打卡失敗!\n已連續工作超過13小時。\n';
            break;
        case '@HumanResources.CARD_EARLY':
            message = '提醒!打上班卡時間超過班表30分鐘前，如係加班者，敬請勾選「緊急呼叫上班打卡」，並請記得於加班結束時，隨即申請加班費或積休時數，再打下班卡。\n';
            break;
        }
        if(message.length > 0) {
            message = message + '如有任何問題，敬請洽詢人力資源部黃副主任（分機3501）。\n非常謝謝！';
        }
        if (needChangePassword) {
            var remains = maxDaysPasswordNeedChanged - json.PasswordDiffDays;
            var ncpmsg = '(' + (remains >= 0 ? '剩餘' : '超過') + ': ' + Math.abs(remains) + '天)';
            message += (message.length > 0 ? '\n\n' : '') + '您的密碼即將過期' + ncpmsg + '，請您利用 Ctrl + Alt + Del 盡速變更密碼。'
        }
}

var checkBook = new CheckBook()

export default checkBook