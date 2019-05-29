import React, { Component } from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames/bind';
import Split from 'react-split';

import styles from '../App.scss';

class PageTemplate extends Component {
    splitterRef = React.createRef();

    static defaultProps = {
        header: PropTypes.element,
        children: PropTypes.element
    };

    static propTypes = {
        header: PropTypes.element.isRequired,
        children: PropTypes.array.isRequired
    };

    render() {
        const cx = classNames.bind(styles);
        const { header, children } = this.props;

        return (
            <div id="wrap">
                {header}
                <div id="container">
                    <div id="content">
                        <main>
                            <Split ref={this.splitterRef} sizes={[25, 25, 25, 25]} gutterSize={4} minSize={0} className={cx('splitter')}>
                                {children}
                            </Split>
                        </main>
                    </div>
                </div>
            </div>
        );
    }
}

export default PageTemplate;