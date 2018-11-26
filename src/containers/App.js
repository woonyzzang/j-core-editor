import React, { Component, Fragment } from 'react';

import classNames from 'classnames/bind';
import Split from 'react-split';

import Header from '../components/Header';
import PanelSplit from '../components/PanelSplit';
import EditorSettings from '../components/LayerPopups/EditorSettings';
import EditorHelp from '../components/LayerPopups/EditorHelp';

import styles from './App.scss';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
// 액션 생성 함수 로드
import * as codeMirrorEditorActions from '../modules/codeMirrorEditor';

class App extends Component {
    /** output 패널 업데이트 */
    onUpdateOutput = () => {
        const { codeMirrorEditorHtml, codeMirrorEditorCss, codeMirrorEditorJavaScript, CodeMirrorEditorActions } = this.props;
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
            <script>${codeMirrorEditorJavaScript}</script>
            <style>${codeMirrorEditorCss}</style>
            </head>
            <body>${codeMirrorEditorHtml}</body>
            </html>
        `);
        output.close();

        CodeMirrorEditorActions.togglePanelOutputTitle((codeMirrorEditorHtml.trim().length)? true : false);
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
        const { codeMirrorEditorHtmlConfig, codeMirrorEditorCssConfig, codeMirrorEditorJavaScriptConfig, panelOutputTitleState } = this.props;

        return (
            <Fragment>
                <div id="wrap">
                    <Header
                        headerTitle="J Core Editor"
                        onUpdateOutput={this.onUpdateOutput}
                        onPanelChangeSize={this.onPanelChangeSize}
                    />
                    <div id="container">
                        <div id="content">
                            <main>
                                <Split ref="splitter" sizes={[25, 25, 25, 25]} gutterSize={4} minSize={0} className={cx('splitter')}>
                                    <PanelSplit
                                        panelName="codeMirrorEditorHtml"
                                        panelTitle="HTML"
                                        codeMirrorConfig={{
                                            mode: 'text/html', // 문서타입
                                            theme: 'monokai', // 테마
                                            scrollbarStyle: 'simple', // 스크롤바 스타일
                                            smartIndent: false, // 자동 들여쓰기
                                            tabSize: codeMirrorEditorHtmlConfig.get('tabSize'), // 탭 간격
                                            indentWithTabs: codeMirrorEditorHtmlConfig.get('indentWithTabs'), // 들여 쓰기 할 때 첫 번째 N * tabSize 공백을 N 탭으로 바꿔야 하는지 여부
                                            // readOnly: true, // 쓰기 방지
                                            lineWrapping: codeMirrorEditorHtmlConfig.get('lineWrapping'), // 가로 스크롤바 숨김, 너비에 맞게 줄바꿈.
                                            lineNumbers: codeMirrorEditorHtmlConfig.get('lineNumbers'), // 라인넘버 표시
                                            // fixedGutter: false,
                                            styleActiveLine: true, // 코드 셀렉트라인 활성화
                                            // styleActiveSelected: true,
                                            matchTags: {bothTags: codeMirrorEditorHtmlConfig.get('matchTags')}, // 시작, 종료 태그 하이라이트
                                            autoCloseTags: codeMirrorEditorHtmlConfig.get('autoCloseTags'), // 자동 닫기 태그 생성
                                            keyMap: codeMirrorEditorHtmlConfig.get('keyMap'),
                                            extraKeys: codeMirrorEditorHtmlConfig.get('extraKeys').toJS(), // 코드 힌트
                                            value: codeMirrorEditorHtmlConfig.get('value')
                                        }}
                                    />
                                    <PanelSplit
                                        panelName="codeMirrorEditorCss"
                                        panelTitle="CSS"
                                        codeMirrorConfig={{
                                            mode: 'text/css',
                                            theme: 'monokai',
                                            scrollbarStyle: 'simple',
                                            smartIndent: false,
                                            tabSize: codeMirrorEditorCssConfig.get('tabSize'),
                                            lineWrapping: codeMirrorEditorCssConfig.get('lineWrapping'),
                                            lineNumbers: codeMirrorEditorCssConfig.get('lineNumbers'),
                                            styleActiveLine: true,
                                            autoCloseBrackets: true, // 자동 중괄호 생성
                                            keyMap: codeMirrorEditorCssConfig.get('keyMap'),
                                            extraKeys: codeMirrorEditorCssConfig.get('extraKeys').toJS(),
                                            value: codeMirrorEditorCssConfig.get('value')
                                        }}
                                    />
                                    <PanelSplit
                                        panelName="codeMirrorEditorJavaScript"
                                        panelTitle="JavsScript"
                                        codeMirrorConfig={{
                                            mode: 'text/javascript',
                                            theme: 'monokai',
                                            scrollbarStyle: 'simple',
                                            tabSize: codeMirrorEditorJavaScriptConfig.get('tabSize'),
                                            lineWrapping: codeMirrorEditorJavaScriptConfig.get('lineWrapping'),
                                            lineNumbers: codeMirrorEditorJavaScriptConfig.get('lineNumbers'),
                                            styleActiveLine: true,
                                            keyMap: codeMirrorEditorJavaScriptConfig.get('keyMap'),
                                            extraKeys: codeMirrorEditorJavaScriptConfig.get('extraKeys').toJS(),
                                            value: codeMirrorEditorJavaScriptConfig.get('value')
                                        }}
                                    />
                                    <div id="panelOutput" className={cx('panel')}>
                                        {(panelOutputTitleState)? null : <strong>Output</strong>}
                                        <div className={cx('previewbox')}>
                                            <iframe ref="output" frameBorder="0" title="Output Rander Viewer" allow="midi; geolocation; microphone; camera; encrypted-media;" sandbox="allow-forms allow-scripts allow-same-origin allow-modals allow-popups"></iframe>
                                        </div>
                                    </div>
                                </Split>
                            </main>
                        </div>
                    </div>
                </div>

                <EditorSettings onSelectFontSizeChange={this.onSelectFontSizeChange} />
                <EditorHelp />
            </Fragment>
        );
    }
}

export default connect(
    (state) => ({
        codeMirrorEditorHtmlConfig: state.codeMirrorEditor.get('codeMirrorEditorHtmlConfig'),
        codeMirrorEditorCssConfig: state.codeMirrorEditor.get('codeMirrorEditorCssConfig'),
        codeMirrorEditorJavaScriptConfig: state.codeMirrorEditor.get('codeMirrorEditorJavaScriptConfig'),
        codeMirrorEditorHtml: state.codeMirrorEditor.get('codeMirrorEditorHtml'),
        codeMirrorEditorCss: state.codeMirrorEditor.get('codeMirrorEditorCss'),
        codeMirrorEditorJavaScript: state.codeMirrorEditor.get('codeMirrorEditorJavaScript'),
        panelOutputTitleState: state.codeMirrorEditor.get('panelOutputTitleState')
    }),
    (dispatch) => ({
        CodeMirrorEditorActions: bindActionCreators(codeMirrorEditorActions, dispatch)
    })
)(App);