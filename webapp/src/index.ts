import manifest from './manifest';
import OptionsModal from './components/options_modal';

export default class Plugin {
    initialize(registry, store) {
        registry.registerRootComponent(OptionsModal);
    }
}

window.registerPlugin(manifest.id, new Plugin());
