import { fromJS } from 'immutable';
import { handleActions, createAction } from 'redux-actions';

// 액션 타입
const SET_UPDATE_PANEL = 'codeMirrorEditor/UPDATE_PANEL';
const SET_COMPONENT = 'codeMirrorEditor/COMPONENT';
const SET_SWITCH_LINE_NUMBERS = 'codeMirrorEditor/SWITCH_LINE_NUMBERS';
const SET_SWITCH_LINE_WRAPPING = 'codeMirrorEditor/SWITCH_LINE_WRAPPING';
const SET_SWITCH_INDENT_WITH_TABS = 'codeMirrorEditor/SWITCH_INDENT_WITH_TABS';
const SET_SWITCH_SHOW_HINTS = 'codeMirrorEditor/SWITCH_SHOW_HINTS';
const SET_SWITCH_AUTO_CLOSE_TAGS = 'codeMirrorEditor/SWITCH_AUTO_CLOSE_TAGS';
const SET_SWITCH_MATCH_TAGS = 'codeMirrorEditor/SWITCH_MATCH_TAGS';
const SET_SELECT_INDENT_UNIT = 'codeMirrorEditor/SELECT_INDENT_UNIT';
const SET_SELECT_KEYMAP = 'codeMirrorEditor/SELECT_KEYMAP';
const TOGGLE_PANEL_OUTPUT_TITLE = 'codeMirrorEditor/PANEL_OUTPUT_TITLE';

// 액션 생성 함수
export const setUpdatePanel = createAction(SET_UPDATE_PANEL); // 업데이트 패널
export const setComponent = createAction(SET_COMPONENT); // 컴포넌트 셀렉트 박스 변경
export const setSwitchLineNumbers = createAction(SET_SWITCH_LINE_NUMBERS); // 라인 넘버 노출/숨김
export const setSwitchLineWrapping = createAction(SET_SWITCH_LINE_WRAPPING); // 가로 스크롤바 숨김, 너비에 맞게 줄바꿈
export const setSwitchIndentWithTabs = createAction(SET_SWITCH_INDENT_WITH_TABS); // 들여 쓰기 할 때 첫 번째 N * tabSize 공백을 N 탭으로 바꿔야 하는지 여부
export const setSwitchShowHints = createAction(SET_SWITCH_SHOW_HINTS); // 라인 코드 힌트 자동완성 레이어 노출/숨김
export const setSwitchAutoCloseTags = createAction(SET_SWITCH_AUTO_CLOSE_TAGS); // 자동 닫기 태그 생성
export const setSwitchMatchTags = createAction(SET_SWITCH_MATCH_TAGS); // 시작, 종료 태그 하이라이트
export const setSelectIndentUnit = createAction(SET_SELECT_INDENT_UNIT); // 탭 간격
export const setSelectKeyMap = createAction(SET_SELECT_KEYMAP); // 키맵
export const togglePanelOutputTitle = createAction(TOGGLE_PANEL_OUTPUT_TITLE); // OUPUT 패널 타이틀 영역 노출/숨김

// 초기 상태
const initialState = fromJS({
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
    panelOutputTitleState: false
});

// 리듀서
export default handleActions({
    [SET_UPDATE_PANEL]: (state, action) => {
        const { panelName, newCode } = action.payload;

        return state.set(panelName, newCode);
    },
    [SET_COMPONENT]: (state, action) => {
        const {htmlCode, cssCode, javascriptCode} = action.payload;

        return state
            .setIn(['codeMirrorEditorHtmlConfig', 'value'], htmlCode)
            .setIn(['codeMirrorEditorCssConfig', 'value'], cssCode)
            .setIn(['codeMirrorEditorJavaScriptConfig', 'value'], javascriptCode)
            .set('codeMirrorEditorHtml', htmlCode)
            .set('codeMirrorEditorCss', cssCode)
            .set('codeMirrorEditorJavaScript', javascriptCode)
    },
    [SET_SWITCH_LINE_NUMBERS]: (state, action) => (
        state
            .setIn(['codeMirrorEditorHtmlConfig', 'lineNumbers'], action.payload)
            .setIn(['codeMirrorEditorCssConfig', 'lineNumbers'], action.payload)
            .setIn(['codeMirrorEditorJavaScriptConfig', 'lineNumbers'], action.payload)
    ),
    [SET_SWITCH_LINE_WRAPPING]: (state, action) => (
        state
            .setIn(['codeMirrorEditorHtmlConfig', 'lineWrapping'], action.payload)
            .setIn(['codeMirrorEditorCssConfig', 'lineWrapping'], action.payload)
            .setIn(['codeMirrorEditorJavaScriptConfig', 'lineWrapping'], action.payload)
    ),
    [SET_SWITCH_INDENT_WITH_TABS]: (state, action) => (
        state.setIn(['codeMirrorEditorHtmlConfig', 'indentWithTabs'], action.payload)
    ),
    [SET_SWITCH_SHOW_HINTS]: (state, action) => (
        state
            .setIn(['codeMirrorEditorHtmlConfig', 'extraKeys', 'Ctrl-Space'], (action.payload)? 'autocomplete' : '')
            .setIn(['codeMirrorEditorCssConfig', 'extraKeys', 'Ctrl-Space'], (action.payload)? 'autocomplete' : '')
            .setIn(['codeMirrorEditorJavaScriptConfig', 'extraKeys', 'Ctrl-Space'], (action.payload)? 'autocomplete' : '')
    ),
    [SET_SWITCH_AUTO_CLOSE_TAGS]: (state, action) => (
        state.setIn(['codeMirrorEditorHtmlConfig', 'autoCloseTags'], action.payload)
    ),
    [SET_SWITCH_AUTO_CLOSE_TAGS]: (state, action) => (
        state.setIn(['codeMirrorEditorHtmlConfig', 'matchTags'], action.payload)
    ),
    [SET_SELECT_INDENT_UNIT]: (state, action) => (
        state
            .setIn(['codeMirrorEditorHtmlConfig', 'tabSize'], action.payload)
            .setIn(['codeMirrorEditorCssConfig', 'tabSize'], action.payload)
            .setIn(['codeMirrorEditorJavaScriptConfig', 'tabSize'], action.payload)
    ),
    [SET_SELECT_KEYMAP]: (state, action) => (
        state
            .setIn(['codeMirrorEditorHtmlConfig', 'keyMap'], action.payload)
            .setIn(['codeMirrorEditorCssConfig', 'keyMap'], action.payload)
            .setIn(['codeMirrorEditorJavaScriptConfig', 'keyMap'], action.payload)
    ),
    [TOGGLE_PANEL_OUTPUT_TITLE]: (state, action) => (
        state.set('panelOutputTitleState', action.payload)
    )
}, initialState);