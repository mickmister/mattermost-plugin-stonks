import {ActionType} from './action_types';

export const openOptionsModal = () => {
    return {
        type: ActionType.OPEN_OPTIONS_MODAL,
    };
};

export const closeOptionsModal = () => {
    return {
        type: ActionType.CLOSE_OPTIONS_MODAL,
    };
};

export const toggleOptionsModal = () => {
    return {
        type: ActionType.TOGGLE_OPTIONS_MODAL,
    };
};

export const fetchSharePricePictureURL = (symbol: string, duration: string, frequency: string) => {
    const u = `/plugins/stonks/etrade?symbol=${symbol}&duration=${duration}&frequency=${frequency}`;
    return fetch(u).then(r => r.text());
};
