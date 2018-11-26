import React, { Component } from 'react';

import classNames from 'classnames/bind';

import { connect } from 'react-redux';

import styles from './EditorHelp.scss';

class EditorHelp extends Component {
    render() {
        const cx = classNames.bind(styles);
        const { isLyPopEditorHelpShow } = this.props;

        return (
            <article tabIndex={0} id="lyPopEditorHelp" className={cx('ly_pop', 'ly_pop_editor_help', {hidden: !isLyPopEditorHelpShow})}>
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

export default connect(
    (state) => ({
        isLyPopEditorHelpShow:  state.lyPopEditor.get('isLyPopEditorHelpShow')
    })
)(EditorHelp);