import React from 'react';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import App from 'next/app';
import withRedux from 'next-redux-wrapper';

import reducers from 'reducers';

import 'style/app.scss';

const makeStore = (initialState, options) => createStore(reducers, initialState, applyMiddleware(thunk)); // eslint-disable-line
// due to the need of withRouter
// the maintain suggest not using pure functional style
class MyApp extends App {
    static async getInitialProps({Component, ctx}) {
        const pageProps = Component.getInitialProps ? await Component.getInitialProps(ctx) : {};

        return { pageProps };
    }

    render() {
        const {
            Component,
            pageProps,
            store,
        } = this.props;

        return (
            <Provider store={store}>
                <Component {...pageProps}/>
            </Provider>
        );
    }
}

export default withRedux(makeStore)(MyApp);