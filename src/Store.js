import {observable, action} from  'mobx';
import _ from 'lodash';
import fetchQL from './Validation'

let dataStore = observable({
    data: {
        oinmasts: []
    }
});

_.assign(dataStore, {
    getOinmasts: action((chart_no, ins_month) => {
        const queryString = `
            query{
              oinmasts(chartno:"${chart_no}",ins_month:"${ins_month}"){
                chart_no,
                hdept_code,
                head_seq,
                doc_no,
                chart_seq,
                ins_month,
                reg_date,
                repay_flag,
                part_code,
                icdh_code1,
                icdh_code2,
                icdh_code3,
                icdh_code4,
                icdh_code5,
                treat_code1,
                treat_code2,
                treat_code3,
                treat_code4,
                drug_days,
                tot_amt,
                tot_drug_amt,
                tot_other_amt,
                tot_clinic_amt,
                tot_stuff_amt,
                diag_amt,
                serv_amt,
                part_amt,
                tot_apply_amt,
                conti_ticket,
                turn_in_flag
              }
            }
    `;
        fetchQL(queryString).then(data => {
            dataStore.data.oinmasts = data.data.oinmasts;
        })
    }),
    updateData: action((obj, index) => {
        dataStore.data.oinmasts[index] = obj;
        const queryString = `
            mutation{
              update_oinmast(input:{
                chart_no:"${obj.chart_no}",
                chart_seq:${obj.chart_seq},
                doc_no:"${obj.doc_no}",
                head_seq: ${obj.head_seq}
                hdept_code:"${obj.hdept_code}"
                repay_flag:"${obj.repay_flag}",
                ins_month:"${obj.ins_month}",
                reg_date:"${obj.reg_date}",
                part_code:"${obj.part_code}",
                icdh_code1:"${obj.icdh_code1}",
                icdh_code2:"${obj.icdh_code2}",
                icdh_code3:"${obj.icdh_code3}",
                icdh_code4:"${obj.icdh_code4}",
                icdh_code5:"${obj.icdh_code5}",
                treat_code1:"${obj.treat_code1}",
                treat_code2:"${obj.treat_code2}",
                treat_code3:"${obj.treat_code3}",
                treat_code4:"${obj.treat_code4}",
                drug_days:${obj.drug_days},
                tot_amt:${obj.tot_amt},
                tot_drug_amt:${obj.tot_drug_amt},
                tot_other_amt:${obj.tot_other_amt},
                tot_clinic_amt:${obj.tot_clinic_amt},
                tot_stuff_amt:${obj.tot_stuff_amt},
                diag_amt:${obj.diag_amt},
                serv_amt:${obj.serv_amt},
                part_amt:${obj.part_amt},
                tot_apply_amt:${obj.tot_apply_amt},
                conti_ticket:"${obj.conti_ticket}",
                turn_in_flag:"${obj.turn_in_flag}"
              }){
                oinmast{
                  chart_no,
                  chart_seq,
                  ins_month,
                  repay_flag
                }
              }
            }
    `;
        fetchQL(queryString).then(data => {
            console.log(data);
        })
    })

});


export default dataStore;
