import React from 'react';
import TheRow from './TheRow';
import Infinite from 'react-infinite';

const viewportToPixels = (value)=>{
    var parts = value.match(/([0-9\.]+)(vh|vw)/);
    var q = Number(parts[1]);
    var side = window[['innerHeight', 'innerWidth'][['vh', 'vw'].indexOf(parts[2])]];
    return side * (q/100);
  }
const handleInfiniteLoad = ()=>{
    // console.log('執行fucking function!!!!');
    
}
const elementInfiniteLoad =()=>{
    return null;
}

const Rows = (props) => {
    //props.punch_list
    let status = '';

    //綠：41a045
    //紫：ae30ba
    //黃：baa639
    //藍：1a79b5
    //紅：ba5230
    let color_list = ['green', 'purple', 'yellow', 'blue', 'red'];
    let i = 0, tmpdate = '';

    let tmp_array = [];
    let color = '';

    props.punch_list.forEach((element, idx) => {
        //緊急修改
        // 找element.card_time 跟 schedule_list的date一致的
        if (element.card_onoff === '1') {
            status = '上班';
        } else if (element.card_onoff === '9') {
            status = '下班';
        } else if (element.card_onoff === '3') {
            status = '緊急下班';
        } else if (element.card_onoff === '2') {
            status = '緊急上班';
        } else {
            console.warn('發現未處理的例外值，card_onoff的為值：', element.card_onoff)
        }

        //第一個元素。跟上一個暫存比，如無暫存，則使用「綠」。
        // console.log('日期：', element.card_date, ', tmpDate:', tmpdate);
        if (tmpdate === '') {
            tmpdate = element.card_date;
            color = color_list[i];
            // console.log('第1次。選擇：', color_list[i])
        }

        if (element.card_date === tmpdate) {
            // console.log('進入日期 = tmpDate, 顏色不變');
            //存入暫存
            // color = 不變;

        } else {
            // console.log('進入日期 != tmpDate, 顏色使用下一個');
            tmpdate = element.card_date;
            ++i;
            color = color_list[i % 5];
        }

        let eachRow = (<TheRow
            color={color}
            punch={element}
            date={element.card_date}
            year={props.AttendanceRecord.getFormateYear(element.card_date)}
            Month_and_Date={props.AttendanceRecord.getFormateMonthDate(element.card_date)}
            time={props.AttendanceRecord.getFormateTime(element.card_time)}
            status={status}
            key={idx}
            showDetail={props.showDetailOfDay}
        />);

        tmp_array.push(eachRow);


    }); //each

    const height = viewportToPixels('100vh') - 113;
    


    return (
        <div className="container">

            <div className="table">
                <div className="header">
                    <span className="date">日期</span>
                    <span className="time">時間</span>
                    <span className="status">打卡</span>
                    <span className="detail">詳情</span>

                </div>
                {/* <div className="tbody"> */}
                    <Infinite elementHeight={40}
                            containerHeight={height}
                            infiniteLoadBeginEdgeOffset={200}
                            onInfiniteLoad={handleInfiniteLoad}
                            isInfiniteLoading={false}
                            loadingSpinnerDelegate={elementInfiniteLoad()}
                            className="tbody"
                        >
                        {tmp_array}
                    </Infinite>
                {/* </div> */}

            </div>

        </div>

    );

}


export default Rows;
