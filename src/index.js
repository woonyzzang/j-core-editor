import React from 'react';
import ReactDOM from 'react-dom';
import App from './containers/App';

import * as serviceWorker from './serviceWorker';

import modules from './modules';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

const store = createStore(modules, window.devToolsExtension && window.devToolsExtension());

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>
    , document.querySelector('#root')
);

serviceWorker.unregister();