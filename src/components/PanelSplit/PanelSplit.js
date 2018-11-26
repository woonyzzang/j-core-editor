import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import classNames from 'classnames/bind';
import CodeMirror from 'react-codemirror';
import 'codemirror/mode/xml/xml'; // HTML Syntax (필수)
import 'codemirror/mode/css/css'; // CSS Syntax (필수)
import 'codemirror/mode/javascript/javascript'; // JavaScript Syntax (필수)
import 'codemirror/addon/scroll/simplescrollbars'; // 스크롤바
import 'codemirror/addon/fold/xml-fold'; // 같은단어 강조(의존성 필수)
import 'codemirror/addon/edit/matchtags'; // 같은단어 강조
import 'codemirror/addon/edit/closetag'; // HTML 닫기 태그 자동 생성
import 'codemirror/addon/edit/closebrackets'; // CSS 닫기 중괄호 자동 생성
import 'codemirror/addon/hint/show-hint'; // 자동완성 레이어(의존성 필수)
import 'codemirror/addon/hint/xml-hint'; // XML 자동완성 레이어
import 'codemirror/addon/hint/html-hint'; // HTML 자동완성 레이어
import 'codemirror/addon/hint/css-hint'; // CSS 자동완성 레이어
import 'codemirror/addon/hint/javascript-hint'; // JavaScript 자동완성 레이어
import 'codemirror/addon/selection/active-line'; // 커서 활설화 라인
import 'codemirror/addon/comment/comment'; // 키맵 주석(의존성 필수)
import 'codemirror/keymap/sublime'; // sublime 키맵
import 'codemirror/keymap/vim'; // vim 키맵
import 'codemirror/keymap/emacs'; // emacs 키맵

// 액션 생성 함수 로드
import * as codeMirrorEditorActions from '../../modules/codeMirrorEditor';

import styles from './PanelSplit.scss';

class PanelSplit extends Component {
    static defaultProps = {
        panelName: 'codeMirrorEditorHtml',
        panelTitle: 'Editor Panel',
        codeMirrorConfig: {}
    }

    static propTypes = {
        panelName: PropTypes.string.isRequired,
        panelTitle: PropTypes.string.isRequired,
        codeMirrorConfig: PropTypes.object,
        onUpdatePanel: PropTypes.func
    }
    
    /** 에디터 패널 업데이트 변경 이벤트 핸들러 */
    updateCode = (panelName, newCode) => {
        const { CodeMirrorEditorActions } = this.props;

        setTimeout(() => {
            CodeMirrorEditorActions.setUpdatePanel({panelName, newCode});
        }, 300);
    }

    render() {
        const cx = classNames.bind(styles);
        const { panelName, panelTitle, codeMirrorConfig } = this.props;

        return (
            <article className={cx('panel')}>
                <h1>{panelTitle}</h1>
                <CodeMirror
                    // ref={(ref) => this.codeMirrorEditor = ref}
                    options={codeMirrorConfig}
                    className={cx('editbox')}
                    onChange={(newCode) => {
                        this.updateCode(panelName, newCode);
                    }}
                />
            </article>
        );
    }
}

export default connect(
    null,
    (dispatch) => ({
        CodeMirrorEditorActions: bindActionCreators(codeMirrorEditorActions, dispatch)
    })
)(PanelSplit);