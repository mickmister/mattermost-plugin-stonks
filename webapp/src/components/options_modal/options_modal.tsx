import React, {FunctionComponent} from 'react';
import FullScreenModal from '../full_screen_modal/full_screen_modal';

import OptionsForm from './options_form';
import {useOptionsModal} from '../../hooks/hooks';
import {Theme} from 'mattermost-redux/types/preferences';

type Props = {
    theme: Theme;
}

const OptionsModal: FunctionComponent<Props> = (props) => {
    const modalState = useOptionsModal();
    if (!modalState.isOpen) {
        return null;
    }

    const inner = (
        <OptionsForm {...props} />
    );

    return (
        <FullScreenModal
            show={modalState.isOpen}
            onClose={modalState.closeModal}
        >
            <div className='channel-subscriptions-modal'>
                <div className='channel-subscriptions-modal-body'>
                    {inner}
                </div>
            </div>
        </FullScreenModal>
    );
}

export default OptionsModal;
