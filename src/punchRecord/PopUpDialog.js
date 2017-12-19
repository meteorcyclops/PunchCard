import React from 'react';
import Dialog, {
    DialogActions,
    DialogContent,
    DialogTitle

} from 'material-ui/Dialog';
import _ from 'lodash';
import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import FontAwesome from 'react-fontawesome';
import bgImg from '../pictures/kfsyscc_logo_big＿1920.jpg';

const m_style = {
    paper: {
        backgroundImage: 'url(' + bgImg + ')',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: 'white',
        borderRadius: '10px'
    },
    blue_overlay: {
        background: "rgba(40,57,101,.9)",
        minHeight: '100%',
        overflowY: 'auto',
        height: '100vh'
    },
    dialog_title: {
        color: 'white'
    },
    dialog_action: {
        paddingRight: '13px'
    },
    dialog_x_button: {
        boxShadow: '0px 1px 5px 0px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12)',
        backgroundColor: '#1161ee'
    },
    dialog_content: {
        // border: '1px solid',
        minHeight: '65vh'
    },
    dialog_close_button: {
        backgroundColor: '#1161ee'
    }
}


const PopUpDialog = (props) => {
    return (
        <Dialog
            fullScreen={false}
            fullWidth={true}
            open={props.open} //this.state.open_dialog
            onRequestClose={props.onRequestClose}
            classes={{
                paper: props.classes.paper
            }}
        >
            <div style={m_style.blue_overlay}>
                <DialogTitle disableTypography={true} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>{props.title}</span>
                    <Button fab  color="primary" style={m_style.dialog_x_button} onClick={props.onRequestClose}>
                        <FontAwesome name='times' size='lg' style={{ color: 'white' }} />
                    </Button>

                </DialogTitle>

                <DialogContent style={m_style.dialog_content}>
                    {


                        _.map(props.time_list, (time, idx) => {
                            let location_html = '';
                            if (time['from'] === '') {
                                //若此元素是 「表訂上班時間」or「表訂下班時間」，則不顯示打卡主機的位置
                                location_html = '';
                            } else {
                                location_html = <div className="modal_location"><i className="fa fa-map-marker" aria-hidden="true"></i> {time['from']}</div>;
                            }

                            let modal_html =
                                <div className="modal_row" key={idx}>

                                    <div className="modal_time_block">
                                        <div className="modal_time">{props.formatTime(time['time'])}</div>
                                        <div className="modal_AMorPM"></div>
                                    </div>

                                    <div className="divider">
                                        <div className="modal_dot"></div>
                                        <div className="vline"></div>
                                    </div>

                                    <div className="status_block">
                                        <div className="modal_status">{time['status']}</div>
                                        {location_html}
                                    </div>

                                </div>;


                            return modal_html;
                        })
                    }


                </DialogContent>

                <DialogActions style={m_style.dialog_action}>

                    <Button raised color="primary" onClick={props.onRequestClose} autoFocus
                        style={m_style.dialog_close_button}>
                        關閉
            </Button>
                </DialogActions>
            </div>
        </Dialog>
    )
}

export default withStyles(m_style)(PopUpDialog);