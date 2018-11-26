import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import classNames from 'classnames/bind';

// 액션 생성 함수 로드
import * as codeMirrorEditorActions from '../../../modules/codeMirrorEditor';

import styles from './EditorSettings.scss';

class EditorSettings extends Component {
    /** 폰트 사이즈 */
    selectFontSizeChange = (e) => {
        this.props.onSelectFontSizeChange(e.target.value);
    };

    render() {
        const cx = classNames.bind(styles);
        const { isLyPopEditorSettingsShow, CodeMirrorEditorActions } = this.props;

        return (
            <article tabIndex={0} id="lyPopEditorSettings" className={cx('ly_pop', 'ly_pop_editor_settings', {hidden: !isLyPopEditorSettingsShow})}>
                <div className={cx('ly_pop_header')}>
                    <h1>Editor Settings</h1>
                </div>
                <div className={cx('ly_pop_container')}>
                    <div className={cx('ly_pop_content')}>
                        <section>
                            <h2>General</h2>
                            <div className={cx('field_cont')}>
                                <ul>
                                    <li>
                                        <label className={cx('chk_switch')}>
                                            <input type="checkbox" defaultChecked={true} onChange={(e) => CodeMirrorEditorActions.setSwitchLineNumbers(e.target.checked)} />
                                            <span className={cx('checkbox')}></span>
                                            <em>Line numbers</em>
                                        </label>
                                    </li>
                                    <li>
                                        <label className={cx('chk_switch')}>
                                            <input type="checkbox" defaultChecked={false} onChange={(e) => CodeMirrorEditorActions.setSwitchLineWrapping(e.target.checked)} />
                                            <span className={cx('checkbox')}></span>
                                            <em>Wrap lines</em>
                                        </label>
                                    </li>
                                    <li>
                                        <label className={cx('chk_switch')}>
                                            <input type="checkbox" defaultChecked={true} onChange={(e) => CodeMirrorEditorActions.setSwitchIndentWithTabs(e.target.checked)} />
                                            <span className={cx('checkbox')}></span>
                                            <em>Indent with tabs</em>
                                        </label>
                                    </li>
                                    <li>
                                        <label className={cx('chk_switch')}>
                                            <input type="checkbox" defaultChecked={true} onChange={(e) => CodeMirrorEditorActions.setSwitchShowHints(e.target.checked)} />
                                            <span className={cx('checkbox')}></span>
                                            <em>Code hinting (autocomplete)</em>
                                        </label>
                                    </li>
                                </ul>
                                <div className={cx('select_pairs')}>
                                    <div className={cx('select_pair')}>
                                        <label htmlFor="indentUnit">Indent size:</label>
                                        <select defaultValue={4} onChange={(e) => CodeMirrorEditorActions.setSelectIndentUnit(e.target.value)} id="indentUnit">
                                            <option value="2">2 spaces</option>
                                            <option value="3">3 spaces</option>
                                            <option value="4">4 spaces</option>
                                        </select>
                                    </div>
                                    <div className={cx('select_pair')}>
                                        <label htmlFor="keyMap">Key map:</label>
                                        <select defaultValue={"default"} onChange={(e) => CodeMirrorEditorActions.setSelectKeyMap(e.target.value)} id="keyMap">
                                            <option value="default">Default</option>
                                            <option value="sublime">Sublime Text</option>
                                            <option value="vim">VIM</option>
                                            <option value="emacs">EMACS</option>
                                        </select>
                                    </div>
                                    <div className={cx('select_pair')}>
                                        <label htmlFor="fontSize">Font size:</label>
                                        <select defaultValue={"default"} onChange={(e) => this.selectFontSizeChange(e)} id="fontSize">
                                            <option value="default">Default</option>
                                            <option value="small">Small</option>
                                            <option value="big">Big</option>
                                            <option value="bigger">Bigger</option>
                                            <option value="jabba">Jabba</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </section>
                        <section>
                            <h2>Behavior</h2>
                            <div className={cx('field_cont')}>
                                <ul>
                                    <li>
                                        <label className={cx('chk_switch')}>
                                            <input type="checkbox" defaultChecked={true} onChange={(e) => CodeMirrorEditorActions.setSwitchAutoCloseTags(e.target.checked)} />
                                            <span className={cx('checkbox')}></span>
                                            <em>Auto-close HTML tags</em>
                                        </label>
                                    </li>
                                    <li>
                                        <label className={cx('chk_switch')}>
                                            <input type="checkbox" defaultChecked={true} onChange={(e) => CodeMirrorEditorActions.setSwitchMatchTags(e.target.checked)} />
                                            <span className={cx('checkbox')}></span>
                                            <em>Highlight matching tags</em>
                                        </label>
                                    </li>
                                </ul>
                            </div>
                        </section>
                    </div>
                </div>
            </article>
        );
    }
}

export default connect(
    (state) => ({
        isLyPopEditorSettingsShow:  state.lyPopEditor.get('isLyPopEditorSettingsShow')
    }),
    (dispatch) => ({
        CodeMirrorEditorActions: bindActionCreators(codeMirrorEditorActions, dispatch)
    })
)(EditorSettings);