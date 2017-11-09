import React, {Component} from 'react';
import './App.css';
import Grid from 'material-ui/Grid';
import validation from './Validation'
import Button from 'material-ui/Button';
import Input, {InputLabel} from 'material-ui/Input';
import moment from 'moment';
import Switch from 'material-ui/Switch';
import {FormControlLabel, FormGroup, FormControl} from 'material-ui/Form';

class App extends Component {

    constructor() {
        super();
        let uid = localStorage.getItem('uid');
        let pwd = localStorage.getItem('pwd');
        let locked = localStorage.getItem('locked');
        if (uid === null) {
            uid = ""
        }
        if (pwd === null) {
            pwd = ""
        }
        if (locked === null) {
            locked = false
        }
        this.state = {
            uid: uid,
            pwd: pwd,
            status: "",
            locked: locked
        };
    }


    onBoard() {
        validation(1, this.state.uid, this.state.pwd).then((res) => {
            let status = res.ErrorMessage;
            if (status === "") {
                let ts = res.TimeStamp;
                let dt = moment(ts).format("YYYY/MM/DD hh:mm:ss");
                let username = res.UserName;
                status = `${username} 上班打卡成功(${dt})`;
                localStorage.setItem('uid', this.state.uid);
                localStorage.setItem('pwd', this.state.pwd);
                localStorage.setItem('locked', this.state.locked);
            }
            this.setState({
                status: status
            });
        });
    }

    offBoard() {
        validation(9, this.state.uid, this.state.pwd).then((res) => {
            let status = res.ErrorMessage;
            if (status === "") {
                let ts = res.TimeStamp;
                let dt = moment(ts).format("YYYY/MM/DD hh:mm:ss");
                let username = res.UserName;
                status = `${username} 下班打卡成功(${dt})`;
                localStorage.setItem('uid', this.state.uid);
                localStorage.setItem('pwd', this.state.pwd);
                localStorage.setItem('locked', this.state.locked);
            }
            this.setState({
                status: status
            });
        });
    }

    handleChange = prop => event => {
        this.setState({[prop]: event.target.value});
    };

    setLocked = prop => (event, checked) => {
        this.setState({[prop]: checked});
    };

    render() {
        let msg = "";
        if (this.state.status !== "") {
            msg = (
                <Grid item xs={12} style={{color: "darkred"}}>
                    <h3>{this.state.status}</h3>
                </Grid>
            )
        }
        return (
            <Grid container alignContent="center" alignItems="center" justify="center">
                <Grid item xs={12}>
                    <h3>上下班打卡</h3>
                </Grid>
                {msg}
                <Grid item xs={12}>
                    <FormControl fullWidth>
                        <InputLabel htmlFor="uid">帳號</InputLabel>
                        <Input
                            id="uid"
                            disabled={this.state.locked}
                            value={this.state.uid}
                            onChange={this.handleChange('uid')}
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12}>
                    <FormControl fullWidth>
                        <InputLabel htmlFor="pwd">密碼</InputLabel>
                        <Input
                            id="pwd"
                            disabled={this.state.locked}
                            type="password"
                            value={this.state.pwd}
                            onChange={this.handleChange('pwd')}
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12}>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={this.state.locked}
                                onChange={this.setLocked('locked')}
                                aria-label="locked"
                            />
                        }
                        label="鎖定帳密"
                    />
                </Grid>
                <Grid item xs={6}>
                    <Button
                        onClick={this.onBoard.bind(this)}
                        raised
                        color="primary">
                        上班
                    </Button>
                </Grid>
                <Grid item xs={6}>
                    <Button
                        onClick={this.offBoard.bind(this)}
                        raised>
                        下班
                    </Button>
                </Grid>
            </Grid>
        );
    }
}

export default App;
