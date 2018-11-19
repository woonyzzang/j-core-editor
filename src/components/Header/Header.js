import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

import classNames from 'classnames/bind';

import { capitalizeFirstLetter } from '../Utils';
import styles from './Header.scss';

class Header extends Component {
    static defaultProps = {
        headerTitle: 'J Editor',
        controlAcvtiveToggle: () => console.warn('controlAcvtiveToggle not defined'),
        utileActiveToggle: () => console.warn('utileActiveToggle not defined')
    }

    static propTypes = {
        headerTitle: PropTypes.string.isRequired,
        controlAcvtiveToggle: PropTypes.func,
        utileActiveToggle: PropTypes.func
    }

    state = {
        componentDatas: []
    }

    /** 컨트롤 버튼 active 클래스 토글 이벤트 핸들러 */
    controlAcvtiveToggle = (e) => {
        const $this = e.currentTarget;
        let arr = [];

        $this.classList.toggle('active');

        Array.from(this.refs.controls.children).forEach((elem) => {
            if (elem.classList.contains('active')) { arr.push(elem); }
        });

        // 에디터 패널 최소 1개 유지
        if (arr.length < 1) { $this.classList.add('active'); }

        this.props.onPanelChangeSize(this.refs.controls);
    }

    /** 유틸 버튼 actice 클래스 토글 이벤트 핸들러 */
    utileActiveToggle = (e) => {
        e.preventDefault();

        const $this = e.currentTarget;

        $this.classList.toggle('active');
        this.props.onEditorSettings($this.getAttribute('href'));
    }

    /** 컴포넌트 모듈 변경 */
    componentChange = (e) => {
        this.props.onComponentChange(e.target.value);
    }

    /** 첫 렌더링 시점 완료 (컴포넌트 라이프 사이클) */
    componentDidMount() {
        axios.get('http://127.0.0.1:3000/modules/data.json')
            .then((res) =>
                // 데이터 가공
                res.data.map((data) => ({
                    author: `${data.author}`,
                    moduleName: `${data.module}`,
                    moduleVal: `${capitalizeFirstLetter(data.module)} - ${data.version}`
                }))
            )
            .then((componentDatas) => {
                this.setState({componentDatas});
            })
            .catch((res) => console.error(res)); // ERROR
    }

    render() {
        const cx = classNames.bind(styles);
        const { headerTitle } = this.props;

        return (
            <header>
                <h1><a href="/">{headerTitle}</a></h1>
                <div className={cx('actions')}>
                    <button type="button" title="Shortcut: Command/Ctrl + Enter" onClick={this.props.onUpdateOutput} id="btnRun" className={cx('btn', 'btn_run')}><i className={cx('material-icons')}>play_arrow</i><span>Run</span></button>
                    <div className={cx('combobox')}>
                        <i className={cx('material-icons')}>list</i>
                        <label htmlFor="component">Component</label>
                        <select defaultValue={"none"} onChange={(e) => this.componentChange(e)} id="component">
                            {/* (() => { //IIFE 패턴 })() */}
                            <option value="none">none</option>
                            {this.state.componentDatas.map((data, index) => (<option key={index} title={data.author} value={data.moduleName}>{data.moduleVal}</option>))}
                        </select>
                    </div>
                </div>
                <div ref="controls" className={cx('controls')}>
                    <button type="button" name="btnHtml" onClick={(e) => this.controlAcvtiveToggle(e)} className={cx('btn', 'active')}>HTML</button>
                    <button type="button" name="btnCss" onClick={(e) => this.controlAcvtiveToggle(e)} className={cx('btn', 'active')}>CSS</button>
                    <button type="button" name="btnJavascript" onClick={(e) => this.controlAcvtiveToggle(e)} className={cx('btn', 'active')}>JavaScript</button>
                    <button type="button" name="btnOutput" onClick={(e) => this.controlAcvtiveToggle(e)} className={cx('btn', 'active')}>Output</button>
                </div>
                <div id="utils" className="utils">
                    <a href="#lyPopEditorSettings" title="Editor Settings" onClick={(e) => this.utileActiveToggle(e)} id="btnSettings"><i className={cx('material-icons')}>settings</i><span>Settings</span></a>
                    <a href="#lyPopEditorHelp" title="Editor Help" onClick={(e) => this.utileActiveToggle(e)} id="btnHelp">Help</a>
                </div>
            </header>
        );
    }
}

export default Header;