import {ActionType} from '../actions/action_types';
import {combineReducers} from 'redux';

type Action = {
    type: string;
}

export function optionsModalOpen(state = false, {type}: Action) {
    switch (type) {
        case ActionType.OPEN_OPTIONS_MODAL:
            return true;
        case ActionType.CLOSE_OPTIONS_MODAL:
            return false;
        case ActionType.TOGGLE_OPTIONS_MODAL:
            return !state;
        default:
            return state;
    }
}

export default combineReducers({
    optionsModalOpen,
});
