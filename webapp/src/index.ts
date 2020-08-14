import manifest from './manifest';

import reducers from './reducers/reducers';

import OptionsModal from './components/options_modal/options_modal';
import PluginRegistry from './registry';
import {toggleOptionsModal} from './actions/actions';

export default class Plugin {
    initialize(registry: PluginRegistry, store) {
        registry.registerReducer(reducers);
        registry.registerRootComponent(OptionsModal);

        registry.registerChannelHeaderButtonAction('S', () => store.dispatch(toggleOptionsModal()), 'Options DropdownText', 'Options Tooltip')
    }
}

(window as any).registerPlugin(manifest.id, new Plugin());
