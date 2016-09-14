import { createStore, compose, applyMiddleware } from 'redux';
import { syncHistoryWithStore } from 'react-router-redux';
import thunk from 'redux-thunk';
import { browserHistory } from 'react-router';
import createLogger from 'redux-logger';
import rootReducer from './reducers';
import client from './apolloClient';

const initialState = {
  employees: {
    data: [],
    isLoading: false,
    error: null,
    chart: {
      index: 0,
    },
  },
  keyMetrics: {
    areaChartLabels: [],
  },
  dataView: {
    filteredIssues: null,
    currentFilter: {
      employee: 'All',
      customer: 'All',
    },
    tableHeaders: [
      'Submitted',
      'Closed',
      'Status',
      'Employee',
      'Customer',
      'Description',
    ],
    secondaryFilter: {
      status: 'All',
      state: 'All',
      order: 'Ascending',
      options: {
        statuses: [
          'All',
          'Critical',
          'Warning',
          'Ok',
          'Disabled',
          'Unknown',
        ],
        states: [
          'All',
          'Active',
          'Inactive',
        ],
        orders: [
          'Ascending',
          'Descending',
        ],
      },
    },
  },
};

/* Commonly used middlewares and enhancers */
/* See: http://redux.js.org/docs/advanced/Middleware.html*/
const loggerMiddleware = createLogger();
const middlewares = [thunk, loggerMiddleware, client.middleware()];

/* Everyone should use redux dev tools */
/* https://github.com/gaearon/redux-devtools */
/* https://medium.com/@meagle/understanding-87566abcfb7a */
const enhancers = [];
const devToolsExtension = window.devToolsExtension;
if (typeof devToolsExtension === 'function') {
  enhancers.push(devToolsExtension());
}

const composedEnhancers = compose(
  applyMiddleware(...middlewares),
  ...enhancers
);

/* Hopefully by now you understand what a store is and how redux uses them,
 * But if not, take a look at: https://github.com/reactjs/redux/blob/master/docs/api/createStore.md
 * And https://egghead.io/lessons/javascript-redux-implementing-store-from-scratch
 */
const store = createStore(
  rootReducer,
  initialState,
  composedEnhancers,
);

/* See: https://github.com/reactjs/react-router-redux/issues/305 */
export const history = syncHistoryWithStore(browserHistory, store);

/* Hot reloading of reducers.  How futuristic!! */
if (module.hot) {
  module.hot.accept('./reducers', () => {
    /*eslint-disable */ // Allow require
    const nextRootReducer = require('./reducers').default;
    /*eslint-enable */
    store.replaceReducer(nextRootReducer);
  });
}

export default store;
