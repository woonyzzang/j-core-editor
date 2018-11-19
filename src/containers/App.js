import React, { Component, Fragment } from 'react';
import axios from 'axios';

import classNames from 'classnames/bind';
import Split from 'react-split';

import { capitalizeFirstLetter } from '../components/Utils';
import Header from '../components/Header';
import PanelSplit from '../components/PanelSplit';
import EditorSettings from '../components/LayerPopups/EditorSettings';
import EditorHelp from '../components/LayerPopups/EditorHelp';

import styles from './App.scss';

class App extends Component {
    state = {
        codeMirrorEditorHtmlConfig: {
            tabSize: 4,
            indentWithTabs: true,
            lineWrapping: false,
            lineNumbers: true,
            matchTags: true,
            autoCloseTags: true,
            keyMap: 'default',
            extraKeys: {'Ctrl-J': 'toMatchingTag', 'Ctrl-Space': 'autocomplete'},
            value: ''
        },
        codeMirrorEditorCssConfig: {
            tabSize: 4,
            lineWrapping: false,
            lineNumbers: true,
            keyMap: 'default',
            extraKeys: {'Ctrl-Space': 'autocomplete'},
            value: ''
        },
        codeMirrorEditorJavaScriptConfig: {
            tabSize: 4,
            lineWrapping: false,
            lineNumbers: true,
            keyMap: 'default',
            extraKeys: {'Ctrl-Space': 'autocomplete'},
            value: ''
        },
        codeMirrorEditorHtml: '',
        codeMirrorEditorCss: '',
        codeMirrorEditorJavaScript: '',
        panelOutputTitleState: false,
        isLyPopEditorSettingsShow: false,
        isLyPopEditorHelpShow: false
    }

    /** output 패널 업데이트 */
    onUpdateOutput = () => {
        const outputFrame = this.refs.output,
            output = outputFrame.contentDocument || outputFrame.contentWindow.document;

        output.open();
        output.write(`
            <!DOCTYPE html>
            <html>
            <head>
            <meta charset="utf-8">
            <title></title>
            <script>            
            ((win) => { // 라이브러리 동일 식별자 네이밍 중복 제거 (콘솔 에러 방지)
                const LIBS = ['jQuery', '_', 'UPLEAT'];
                
                LIBS.forEach((lib) => {
                    if (win[lib]) { delete win[lib]; }
                });
            })(window);
            </script> 
            <script src="http://127.0.0.1:3000/cdn/libs/jquery-1.10.2.min.js"></script>
            <script src="http://127.0.0.1:3000/cdn/libs/lodash-3.10.1.min.js"></script>            
            <script src="http://127.0.0.1:3000/cdn/upleat-core-1.0.2.min.js"></script>
            <script>${this.state.codeMirrorEditorJavaScript}</script>
            <style>${this.state.codeMirrorEditorCss}</style>
            </head>
            <body>${this.state.codeMirrorEditorHtml}</body>
            </html>
        `);
        output.close();

        this.setState({
            panelOutputTitleState: (this.state.codeMirrorEditorHtml.trim().length)? true : false
        });
    }

    /** 에디터 패널 업데이트 */
    onUpdatePanel = (panelName, newCode) => {
        this.setState({
            [panelName]: newCode
        });
    }

    /** 컴포넌트 모듈 변경 */
    onComponentChange = (val) => {
        switch (val) {
            case 'none':
                this.setState({
                    codeMirrorEditorHtmlConfig: {...this.state.codeMirrorEditorHtmlConfig, value: ''},
                    codeMirrorEditorCssConfig: {...this.state.codeMirrorEditorCssConfig, value: ''},
                    codeMirrorEditorJavaScriptConfig: {...this.state.codeMirrorEditorJavaScriptConfig,  value: ''},
                    codeMirrorEditorHtml: '',
                    codeMirrorEditorCss: '',
                    codeMirrorEditorJavaScript: ''
                }, () => this.onUpdateOutput());
                break;
            default:
                axios.get('http://127.0.0.1:3000/modules/data.json')
                    .then((res) => { // SUCCESS
                        res.data.forEach((data, index) => {
                            if (val === data.module) {
                                axios.all([axios.get(data.url.html), axios.get(data.url.css), axios.get(data.url.javascript)])
                                    .then(axios.spread((htmlCode, cssCode, javascriptCode) => {
                                        this.setState({
                                            codeMirrorEditorHtmlConfig: {...this.state.codeMirrorEditorHtmlConfig, value: htmlCode.data},
                                            codeMirrorEditorCssConfig: {...this.state.codeMirrorEditorCssConfig, value: cssCode.data},
                                            codeMirrorEditorJavaScriptConfig: {...this.state.codeMirrorEditorJavaScriptConfig, value: javascriptCode.data},
                                            codeMirrorEditorHtml: htmlCode.data,
                                            codeMirrorEditorCss: cssCode.data,
                                            codeMirrorEditorJavaScript: javascriptCode.data
                                        }, () => this.onUpdateOutput());
                                    }));
                            }
                        });
                    })
                    .catch((res) => console.error(res)); // ERROR
                break;
        }
    }

    /**  패널 사이즈 변경 */
    onPanelChangeSize = (controlsRef) => {
        let dataSizes = this.refs.splitter.split.getSizes().slice(); // 배열 복사

        // 데이터 사이즈 배열 가공
        Array.from(controlsRef.children).forEach((elem, index) => {
            if (!elem.classList.contains('active')) {
                dataSizes[index] = 0;
            } else {
                let arr = [];

                // [D] IE Edge ERROR: Object doesn't support property or method 'Symbol(Symbol.iterator)'
                // for (let elem of controlsRef.children) {
                //     if (elem.classList.contains('active')) { arr.push(elem); }
                // }
                Array.from(controlsRef.children).forEach((elem) => {
                    if (elem.classList.contains('active')) { arr.push(elem); }
                });

                dataSizes[index] = (100 / arr.length);
            }
        });

        this.refs.splitter.split.setSizes(dataSizes);
    }

    /** 셋팅 버튼 이벤트 */
    onEditorSettings = (selector) => {
        const target = capitalizeFirstLetter(selector.replace(/^[#]/g, ''));

        this.setState({
            [`is${target}Show`]: !this.state[`is${target}Show`]
        }, () => {
            document.querySelector(selector).focus();
        });
    }

    /** 셋팅 라인 넘버 노출/숨김 변경 */
    onSwitchLineNumbersChange = (checked) => {
        this.setState({
            codeMirrorEditorHtmlConfig: {...this.state.codeMirrorEditorHtmlConfig, lineNumbers: checked},
            codeMirrorEditorCssConfig: {...this.state.codeMirrorEditorCssConfig, lineNumbers: checked},
            codeMirrorEditorJavaScriptConfig: {...this.state.codeMirrorEditorJavaScriptConfig, lineNumbers: checked}
        });
    }

    /** 셋팅 가로 스크롤바 숨김, 너비에 맞게 줄바꿈 변경 */
    onSwitchLineWrappingChange = (checked) => {
        this.setState({
            codeMirrorEditorHtmlConfig: {...this.state.codeMirrorEditorHtmlConfig, lineWrapping: checked},
            codeMirrorEditorCssConfig: {...this.state.codeMirrorEditorCssConfig, lineWrapping: checked},
            codeMirrorEditorJavaScriptConfig: {...this.state.codeMirrorEditorJavaScriptConfig, lineWrapping: checked}
        });
    }

    /** 셋팅 들여 쓰기 할 때 첫 번째 N * tabSize 공백을 N 탭으로 바꿔야 하는지 여부 변경 */
    onSwitchIndentWithTabsChange = (checked) => {
        this.setState({
            codeMirrorEditorHtmlConfig: {...this.state.codeMirrorEditorHtmlConfig, indentWithTabs: checked}
        });
    }

    /** 셋팅 코드 힌트 자동완성 레이어 노출/숨김 변경 */
    onSwitchShowHintsChange = (checked) => {
        this.setState({
            codeMirrorEditorHtmlConfig: {...this.state.codeMirrorEditorHtmlConfig, extraKeys: (checked)? {'Ctrl-J': 'toMatchingTag', 'Ctrl-Space': 'autocomplete'} : {'Ctrl-J': 'toMatchingTag', 'Ctrl-Space': ''}},
            codeMirrorEditorCssConfig: {...this.state.codeMirrorEditorCssConfig, extraKeys: (checked)? {'Ctrl-Space': 'autocomplete'} : {'Ctrl-Space': 'autocomplete'}},
            codeMirrorEditorJavaScriptConfig: {...this.state.codeMirrorEditorJavaScriptConfig, extraKeys: (checked)? {'Ctrl-Space': 'autocomplete'} : {'Ctrl-Space': ''}}
        });
    }

    /** 셋팅 자동 닫기 태그 생성 변경 */
    onSwitchAutoCloseTagsChange = (checked) => {
        this.setState({
            codeMirrorEditorHtmlConfig: {...this.state.codeMirrorEditorHtmlConfig, autoCloseTags: checked}
        });
    }

    /** 셋팅 시작, 종료 태그 하이라이트 변경 */
    onSwitchMatchTagsChange = (checked) => {
        this.setState({
            codeMirrorEditorHtmlConfig: {...this.state.codeMirrorEditorHtmlConfig, matchTags: checked}
        });
    }

    /** 셋팅 탭 간격 변경 */
    onSelectIndentUnitChange = (val) => {
        this.setState({
            codeMirrorEditorHtmlConfig: {...this.state.codeMirrorEditorHtmlConfig, tabSize: val},
            codeMirrorEditorCssConfig: {...this.state.codeMirrorEditorCssConfig, tabSize: val},
            codeMirrorEditorJavaScriptConfig: {...this.state.codeMirrorEditorJavaScriptConfig, tabSize: val}
        });
    }

    /** 셋팅 키맵 변경 */
    onSelectKeyMapChange = (val) => {
        this.setState({
            codeMirrorEditorHtmlConfig: {...this.state.codeMirrorEditorHtmlConfig, keyMap: val},
            codeMirrorEditorCssConfig: {...this.state.codeMirrorEditorCssConfig, keyMap: val},
            codeMirrorEditorJavaScriptConfig: {...this.state.codeMirrorEditorJavaScriptConfig, keyMap: val}
        });
    }

    /** 셋팅 폰트 사이즈 변경 */
    onSelectFontSizeChange = (val) => {
        const $editbox = this.refs.splitter.parent.querySelectorAll('.editbox');

        $editbox.forEach((elem) => {
            elem.classList.remove('default', 'small', 'big', 'jabba', 'bigger');
            elem.classList.add(val);
        });
    }
    
    /** 첫 렌더링 시점 완료 (컴포넌트 라이프 사이클) */
    componentDidMount() {
        // 키보드 단축키 이벤트 핸들러
        document.addEventListener('keydown', (e) => {
            // 컨트롤 + 엔터 Run (실행)
            if ((e.keyCode === 10 || e.keyCode === 13) && e.ctrlKey) { this.onUpdateOutput(); }
        }, false);
    }

    render() {
        const cx = classNames.bind(styles);

        return (
            <Fragment>
                <div id="wrap">
                    <Header
                        headerTitle="J Core Editor"
                        onUpdateOutput={this.onUpdateOutput}
                        onComponentChange={this.onComponentChange}
                        onPanelChangeSize={this.onPanelChangeSize}
                        onEditorSettings={this.onEditorSettings}
                    />
                    <div id="container">
                        <div id="content">
                            <main>
                                <Split ref="splitter" sizes={[25, 25, 25, 25]} gutterSize={4} minSize={0} className={cx('splitter')}>
                                    <PanelSplit
                                        panelName="codeMirrorEditorHtml"
                                        panelTitle="HTML"
                                        onUpdatePanel={this.onUpdatePanel}
                                        codeMirrorConfig={{
                                            mode: 'text/html', // 문서타입
                                            theme: 'monokai', // 테마
                                            scrollbarStyle: 'simple', // 스크롤바 스타일
                                            smartIndent: false, // 자동 들여쓰기
                                            tabSize: this.state.codeMirrorEditorHtmlConfig.tabSize, // 탭 간격
                                            indentWithTabs: this.state.codeMirrorEditorHtmlConfig.indentWithTabs, // 들여 쓰기 할 때 첫 번째 N * tabSize 공백을 N 탭으로 바꿔야 하는지 여부
                                            // readOnly: true, // 쓰기 방지
                                            lineWrapping: this.state.codeMirrorEditorHtmlConfig.lineWrapping, // 가로 스크롤바 숨김, 너비에 맞게 줄바꿈.
                                            lineNumbers: this.state.codeMirrorEditorHtmlConfig.lineNumbers, // 라인넘버 표시
                                            // fixedGutter: false,
                                            styleActiveLine: true, // 코드 셀렉트라인 활성화
                                            // styleActiveSelected: true,
                                            matchTags: {bothTags: this.state.codeMirrorEditorHtmlConfig.matchTags}, // 시작, 종료 태그 하이라이트
                                            autoCloseTags: this.state.codeMirrorEditorHtmlConfig.autoCloseTags, // 자동 닫기 태그 생성
                                            keyMap: this.state.codeMirrorEditorHtmlConfig.keyMap,
                                            extraKeys: this.state.codeMirrorEditorHtmlConfig.extraKeys, // 코드 힌트
                                            value: this.state.codeMirrorEditorHtmlConfig.value
                                        }}
                                    />
                                    <PanelSplit
                                        panelName="codeMirrorEditorCss"
                                        panelTitle="CSS"
                                        onUpdatePanel={this.onUpdatePanel}
                                        codeMirrorConfig={{
                                            mode: 'text/css',
                                            theme: 'monokai',
                                            scrollbarStyle: 'simple',
                                            smartIndent: false,
                                            tabSize: this.state.codeMirrorEditorCssConfig.tabSize,
                                            lineWrapping: this.state.codeMirrorEditorCssConfig.lineWrapping,
                                            lineNumbers: this.state.codeMirrorEditorCssConfig.lineNumbers,
                                            styleActiveLine: true,
                                            autoCloseBrackets: true, // 자동 중괄호 생성
                                            keyMap: this.state.codeMirrorEditorCssConfig.keyMap,
                                            extraKeys: this.state.codeMirrorEditorCssConfig.extraKeys,
                                            value: this.state.codeMirrorEditorCssConfig.value
                                        }}
                                    />
                                    <PanelSplit
                                        panelName="codeMirrorEditorJavaScript"
                                        panelTitle="JavsScript"
                                        onUpdatePanel={this.onUpdatePanel}
                                        codeMirrorConfig={{
                                            mode: 'text/javascript',
                                            theme: 'monokai',
                                            scrollbarStyle: 'simple',
                                            tabSize: this.state.codeMirrorEditorJavaScriptConfig.tabSize,
                                            lineWrapping: this.state.codeMirrorEditorJavaScriptConfig.lineWrapping,
                                            lineNumbers: this.state.codeMirrorEditorJavaScriptConfig.lineNumbers,
                                            styleActiveLine: true,
                                            keyMap: this.state.codeMirrorEditorJavaScriptConfig.keyMap,
                                            extraKeys: this.state.codeMirrorEditorJavaScriptConfig.extraKeys,
                                            value: this.state.codeMirrorEditorJavaScriptConfig.value
                                        }}
                                    />
                                    <div id="panelOutput" className={cx('panel')}>
                                        {(this.state.panelOutputTitleState)? null : <strong>Output</strong>}
                                        <div className={cx('previewbox')}>
                                            <iframe ref="output" frameBorder="0" title="Output Rander Viewer" allow="midi; geolocation; microphone; camera; encrypted-media;" sandbox="allow-forms allow-scripts allow-same-origin allow-modals allow-popups"></iframe>
                                        </div>
                                    </div>
                                </Split>
                            </main>
                        </div>
                    </div>
                </div>

                <EditorSettings
                    isLyPopEditorSettingsShow={this.state.isLyPopEditorSettingsShow}
                    onSwitchLineNumbersChange={this.onSwitchLineNumbersChange}
                    onSwitchLineWrappingChange={this.onSwitchLineWrappingChange}
                    onSwitchIndentWithTabsChange={this.onSwitchIndentWithTabsChange}
                    onSwitchShowHintsChange={this.onSwitchShowHintsChange}
                    onSwitchAutoCloseTagsChange={this.onSwitchAutoCloseTagsChange}
                    onSwitchMatchTagsChange={this.onSwitchMatchTagsChange}
                    onSelectIndentUnitChange={this.onSelectIndentUnitChange}
                    onSelectKeyMapChange={this.onSelectKeyMapChange}
                    onSelectFontSizeChange={this.onSelectFontSizeChange}
                />
                <EditorHelp isLyPopEditorHelpShow={this.state.isLyPopEditorHelpShow} />
            </Fragment>
        );
    }
}

export default App;