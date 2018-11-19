import React, { Component } from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames/bind';

import styles from './EditorHelp.scss';

class EditorHelp extends Component {
    static defaultProps = {
        isLyPopEditorHelpShow: false
    }

    static propTypes = {
        isLyPopEditorHelpShow: PropTypes.bool
    }

    render() {
        const cx = classNames.bind(styles);

        return (
            <article tabIndex={0} id="lyPopEditorHelp" className={cx('ly_pop', 'ly_pop_editor_help', {hidden: !this.props.isLyPopEditorHelpShow})}>
                <div className={cx('ly_pop_header')}>
                    <h1>Editor Help</h1>
                </div>
                <div className={cx('ly_pop_container')}>
                    <div className={cx('ly_pop_content')}>
                        <section>
                            <h2>Keyboard shortcuts</h2>
                            <ul>
                                <li>[ctrl] + [enter]: Re-render output.</li>
                            </ul>
                        </section>
                        <section>
                            <h2>Send feedback &amp; file bugs</h2>
                            <ul>
                                <li><a href="mailto://seungwoonjjang@gmail.com">Developer by woonyzzang.</a></li>
                            </ul>
                        </section>
                    </div>
                </div>
            </article>
        );
    }
}

export default EditorHelp;