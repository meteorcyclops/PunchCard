import React from 'react'
import ReactDOM from 'react-dom'
import './css/index.css'
import App from './App'

import bookStore from './stores/book'

import registerServiceWorker from './serviceWorker/registerServiceWorker'

ReactDOM.render(
    <App />, 
    document.getElementById('root')
)
registerServiceWorker()
