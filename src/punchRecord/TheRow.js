import React, { Component } from 'react';
import FontAwesome from 'react-fontawesome';
import Button from 'material-ui/Button';

class TheRow extends Component {
    render() {
        let tmp_className = "row " + this.props.color;
        return (
            <div className={tmp_className} onClick={() => { this.props.showDetail(this.props.date) }}>
                <span className="date">
                    <span className="Year">{this.props.year}</span>
                    <span className="Month_and_Date">{this.props.Month_and_Date}</span>
                </span>
                <span className="time">{this.props.time}</span>
                <span className="status">{this.props.status}</span>
                <span className="detail">
                    <Button onClick={() => { this.props.showDetail(this.props.punch) }} style={{ minWidth: '0' }}>
                        <FontAwesome name='ellipsis-v' size='lg' style={{ color: 'white' }} />
                    </Button>
                </span>

            </div>
        );
    }
}


export default TheRow
