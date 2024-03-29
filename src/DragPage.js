import React from 'react' 
import { Observable } from 'rxjs' 
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

import './css/dragPage.css'

class DragPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            transX: 0,
            open: props.open
        }
        this.x = undefined
        this.first = true
    }

    componentWillReceiveProps(nextProps){
        if (nextProps){
            this.setState({
                open: nextProps.open,
                transX: nextProps.open?this.state.transX:0
            })
            if (!nextProps.open){
                this.first=true
            }
        }
    }

    closeSlide(){
        this.setState({ open: false, transX: 0 })
        if (this.props.closeFunc) {
            this.props.closeFunc()
        }
        this.first=true
    }


    componentDidUpdate(){
        if(this.props.open && this.first==true){
            const leftColumn = document.querySelector('#leftDragColumnTao')
            const touchStartEvent = Observable.fromEvent(leftColumn, 'touchstart')
            const touchMoveEvent = Observable.fromEvent(leftColumn, 'touchmove')
            const touchEndEvent = Observable.fromEvent(leftColumn, 'touchend')
                                    .map( e=> {
                                        if ( this.x>100 ){
                                            this.closeSlide()
                                        }else{
                                            this.setState({
                                                transX: 0
                                            })
                                        }
                                    })
    
            const observerSlide = touchStartEvent
                .switchMap(
                    (e) => {
                        this.x = e.touches[0].clientX
                        return touchMoveEvent.takeUntil(touchEndEvent)
                    })
    
            observerSlide.subscribe((e) => {
                const startX = this.x
                const endX = e.touches[0].clientX
                const pathLength = this.state.transX + (endX-startX)
                if (pathLength > 0 && endX > 0){
                    this.setState({
                        transX: pathLength
                    })
                }
                this.x = endX
            })
            this.first = false
        }
    }

    render() {
        let renderPage = <div key='slideNone' style={{display:'none'}} />;

        if(this.state.open){
            renderPage=(
                <div
                    key='slideBody'
                    style={
                        {            
                            height:'100%',
                            width:'100%',
                            transform:`translateX(${this.state.transX}px)`,
                            zIndex:'2',
                            position: 'absolute',
                            background: 'rgba(40, 57, 101, 1)',
                        }
                    }
                >
                    <div 
                        id="leftDragColumnTao" 
                        style={
                            {            
                                /* 把拖拉區塊的右上角去掉，讓 AttendanceRecord 元件的 左上角的 X 不會被遮住。 
                                    所以把高度 減去40px，並設top:40px。 by 丁丁
                                */
                                height:'calc(100% - 40px)',
                                width:'50px',
                                position:'absolute',
                                left:'0px',
                                top:'40px',
                                zIndex:'3',
                            }
                    }/>
                    {this.props.children}
                </div>
            )
        }

        return (
            <ReactCSSTransitionGroup
                transitionName='card_recordSlide'
                transitionEnterTimeout={500}
                transitionLeaveTimeout={500}
            >
                {renderPage}
            </ReactCSSTransitionGroup>
            
        )
    }
}

DragPage.defaultProps={

}

export default DragPage