import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { upperFirst } from 'lodash';
import axios from 'axios';
import classNames from 'classnames/bind';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
// 액션 생성 함수 로드
import * as codeMirrorEditorActions from '../../actions/codeMirrorEditor';
import * as lyPopEditorActions from '../../actions/lyPopEditor';

import styles from './Header.scss';

class Header extends Component {
    controlsRef = React.createRef();

    static defaultProps = {
        headerTitle: 'J Editor',
        onPanelChangeSize: () => console.warn('onPanelChangeSize not defined')
    }

    static propTypes = {
        headerTitle: PropTypes.string.isRequired,
        onPanelChangeSize: PropTypes.func
    }

    state = {
        componentDatas: []
    }

    /** 컴포넌트 모듈 변경 */
    componentChange = (e) => {
        const { CodeMirrorEditorActions } = this.props;
        const val = e.target.value;

        switch (val) {
            case 'none':
                const deferred = new Promise((resolve) => {
                    setTimeout(() => {
                        CodeMirrorEditorActions.setComponent({htmlCode: '', cssCode: '', javascriptCode: ''});
                        resolve();
                    }, 250);
                });

                deferred.then(this.props.onUpdateOutput);
                break;
            default:
                axios.get('http://127.0.0.1:3000/modules/data.json')
                    .then((res) => { // SUCCESS
                        res.data.forEach((data) => {
                            if (val === data.module) {
                                axios.all([axios.get(data.url.html), axios.get(data.url.css), axios.get(data.url.javascript)])
                                    .then(axios.spread((htmlCode, cssCode, javascriptCode) => {
                                        const deferred = new Promise((resolve) => {
                                            setTimeout(() => {
                                                CodeMirrorEditorActions.setComponent({htmlCode: htmlCode['data'], cssCode: cssCode['data'], javascriptCode: javascriptCode['data']});
                                                resolve();
                                            }, 250);
                                        });

                                        deferred.then(this.props.onUpdateOutput);
                                    }));
                            }
                        });
                    })
                    .catch((res) => console.error(res)); // ERROR
                break;
        }
    }

    /** 컨트롤 버튼 active 클래스 토글 이벤트 핸들러 */
    controlAcvtiveToggle = (e) => {
        const $this = e.currentTarget;
        let arr = [];

        $this.classList.toggle('active');

        Array.from(this.controlsRef.current.childNodes).forEach((elem) => {
            if (elem.classList.contains('active')) { arr.push(elem); }
        });

        // 에디터 패널 최소 1개 유지
        if (arr.length < 1) { $this.classList.add('active'); }

        this.props.onPanelChangeSize(this.controlsRef);
    }

    /** 유틸 버튼 actice 클래스 토글 이벤트 핸들러 */
    utileActiveToggle = (e) => {
        e.preventDefault();

        const { LyPopEditorActions } = this.props;
        const $this = e.currentTarget;
        const target = $this.getAttribute('href');

        $this.classList.toggle('active');
        LyPopEditorActions.toggleEditorSettings(upperFirst(target.split('#')[1]));
        document.querySelector(target).focus();
    }

    /** 첫 렌더링 시점 완료 (컴포넌트 라이프 사이클) */
    componentDidMount() {
        axios.get('http://127.0.0.1:3000/modules/data.json')
            .then((res) =>
                // 데이터 가공
                res.data.map((data) => ({
                    author: `${data.author}`,
                    moduleName: `${data.module}`,
                    moduleVal: `${upperFirst(data.module)} - ${data.version}`
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
                        <label htmlFor="component">Module</label>
                        <select defaultValue={"none"} onChange={(e) => this.componentChange(e)} id="component">
                            {/* (() => { //IIFE 패턴 })() */}
                            <option value="none">none</option>
                            {this.state.componentDatas.map((data, index) => (<option key={index} title={data.author} value={data.moduleName}>{data.moduleVal}</option>))}
                        </select>
                    </div>
                </div>
                <div ref={this.controlsRef} className={cx('controls')}>
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

export default connect(
    null,
    (dispatch) => ({
        CodeMirrorEditorActions: bindActionCreators(codeMirrorEditorActions, dispatch),
        LyPopEditorActions: bindActionCreators(lyPopEditorActions, dispatch)
    })
)(Header);