import { fromJS } from 'immutable';
import { handleActions, createAction } from 'redux-actions';

// 액션 타입
const TOGGLE_EDITOR_SETTINGS = 'lyPopEditor/UPDATE_PANEL';

// 액션 생성 함수
export const toggleEditorSettings = createAction(TOGGLE_EDITOR_SETTINGS);

// 초기 상태
const initialState = fromJS({
    isLyPopEditorSettingsShow: false,
    isLyPopEditorHelpShow: false
});

// 리듀서
export default handleActions({
    [TOGGLE_EDITOR_SETTINGS]: (state, action) => (
        state.set(`is${action.payload}Show`, !state.get(`is${action.payload}Show`))
    )
}, initialState);