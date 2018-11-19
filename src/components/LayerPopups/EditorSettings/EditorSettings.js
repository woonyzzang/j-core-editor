import React, { Component } from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames/bind';

import styles from './EditorSettings.scss';

class EditorSettings extends Component {
    static defaultProps = {
        isLyPopEditorSettingsShow: false,
        switchLineNumbersChange: () => console.warn('switchLineNumbersChange not defined'),
        switchLineWrappingChange: () => console.warn('switchLineWrappingChange not defined'),
        switchIndentWithTabsChange: () => console.warn('switchIndentWithTabsChange not defined'),
        switchShowHintsChange: () => console.warn('switchShowHintsChange not defined'),
        switchAutoCloseTagsChange: () => console.warn('switchAutoCloseTagsChange not defined'),
        switchMatchTagsChange: () => console.warn('switchMatchTagsChange not defined'),
        selectIndentUnitChange: () => console.warn('selectIndentUnitChange not defined'),
        selectKeyMapChange: () => console.warn('selectKeyMapChange not defined'),
        selectFontSizeChange: () => console.warn('selectFontSizeChange not defined')
    }

    static propTypes = {
        isLyPopEditorSettingsShow: PropTypes.bool,
        switchLineNumbersChange: PropTypes.func,
        switchLineWrappingChange: PropTypes.func,
        switchIndentWithTabsChange: PropTypes.func,
        switchShowHintsChange: PropTypes.func,
        switchAutoCloseTagsChange: PropTypes.func,
        switchMatchTagsChange: PropTypes.func,
        selectIndentUnitChange: PropTypes.func,
        selectKeyMapChange: PropTypes.func,
        selectFontSizeChange: PropTypes.func
    }

    /** 라인 넘버 노출/숨김 */
    switchLineNumbersChange = (e) => {
        this.props.onSwitchLineNumbersChange(e.target.checked);
    }

    /** 가로 스크롤바 숨김, 너비에 맞게 줄바꿈 */
    switchLineWrappingChange = (e) => {
        this.props.onSwitchLineWrappingChange(e.target.checked);
    }

    /** 들여 쓰기 할 때 첫 번째 N * tabSize 공백을 N 탭으로 바꿔야 하는지 여부 */
    switchIndentWithTabsChange = (e) => {
        this.props.onSwitchIndentWithTabsChange(e.target.checked);
    }

    /** 라인 코드 힌트 자동완성 레이어 노출/숨김 */
    switchShowHintsChange = (e) => {
        this.props.onSwitchShowHintsChange(e.target.checked);
    }

    /** 자동 닫기 태그 생성 */
    switchAutoCloseTagsChange = (e) => {
        this.props.onSwitchAutoCloseTagsChange(e.target.checked);
    }

    /** 시작, 종료 태그 하이라이트 */
    switchMatchTagsChange = (e) => {
        this.props.onSwitchMatchTagsChange(e.target.checked);
    }

    /** 탭 간격 */
    selectIndentUnitChange = (e) => {
        this.props.onSelectIndentUnitChange(e.target.value);
    }

    /** 키맵 */
    selectKeyMapChange = (e) => {
        this.props.onSelectKeyMapChange(e.target.value);
    }

    /** 폰트 사이즈 */
    selectFontSizeChange = (e) => {
        this.props.onSelectFontSizeChange(e.target.value);
    }

    render() {
        const cx = classNames.bind(styles);

        return (
            <article tabIndex={0} id="lyPopEditorSettings" className={cx('ly_pop', 'ly_pop_editor_settings', {hidden: !this.props.isLyPopEditorSettingsShow})}>
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
                                            <input type="checkbox" defaultChecked={true} onChange={(e) => this.switchLineNumbersChange(e)} />
                                            <span className={cx('checkbox')}></span>
                                            <em>Line numbers</em>
                                        </label>
                                    </li>
                                    <li>
                                        <label className={cx('chk_switch')}>
                                            <input type="checkbox" defaultChecked={false} onChange={(e) => this.switchLineWrappingChange(e)} />
                                            <span className={cx('checkbox')}></span>
                                            <em>Wrap lines</em>
                                        </label>
                                    </li>
                                    <li>
                                        <label className={cx('chk_switch')}>
                                            <input type="checkbox" defaultChecked={true} onChange={(e) => this.switchIndentWithTabsChange(e)} />
                                            <span className={cx('checkbox')}></span>
                                            <em>Indent with tabs</em>
                                        </label>
                                    </li>
                                    <li>
                                        <label className={cx('chk_switch')}>
                                            <input type="checkbox" defaultChecked={true} onChange={(e) => this.switchShowHintsChange(e)} />
                                            <span className={cx('checkbox')}></span>
                                            <em>Code hinting (autocomplete)</em>
                                        </label>
                                    </li>
                                </ul>
                                <div className={cx('select_pairs')}>
                                    <div className={cx('select_pair')}>
                                        <label htmlFor="indentUnit">Indent size:</label>
                                        <select defaultValue={4} onChange={(e) => this.selectIndentUnitChange(e)} id="indentUnit">
                                            <option value="2">2 spaces</option>
                                            <option value="3">3 spaces</option>
                                            <option value="4">4 spaces</option>
                                        </select>
                                    </div>
                                    <div className={cx('select_pair')}>
                                        <label htmlFor="keyMap">Key map:</label>
                                        <select defaultValue={"default"} onChange={(e) => this.selectKeyMapChange(e)} id="keyMap">
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
                                            <input type="checkbox" defaultChecked={true} onChange={(e) => this.switchAutoCloseTagsChange(e)} />
                                            <span className={cx('checkbox')}></span>
                                            <em>Auto-close HTML tags</em>
                                        </label>
                                    </li>
                                    <li>
                                        <label className={cx('chk_switch')}>
                                            <input type="checkbox" defaultChecked={true} onChange={(e) => this.switchMatchTagsChange(e)} />
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

export default EditorSettings;