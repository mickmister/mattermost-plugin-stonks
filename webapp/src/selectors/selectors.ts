import {GlobalState} from 'mattermost-redux/types/store'

export type FullState = GlobalState & {
    'plugins-stonks': {
        optionsModalOpen: boolean;
    };
};

export const getPluginState = (state: FullState) => {
    return state['plugins-stonks'];
}

export const isOptionsModalOpen = (state: FullState) => getPluginState(state).optionsModalOpen;
