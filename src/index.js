import React from 'react';
import ReactDOM from 'react-dom';

import App from './containers/App';
import * as serviceWorker from './serviceWorker';

import actions from './actions';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

const store = createStore(actions, window.devToolsExtension && window.devToolsExtension());

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.querySelector('#root')
);

serviceWorker.unregister();