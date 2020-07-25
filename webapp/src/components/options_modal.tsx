import React from 'react';
import FullScreenModal from './full_screen_modal/full_screen_modal';

import OptionsForm from './options_form';

export default function OptionsModal() {
    const handleClose = () => {

    };

    const inner = (
        <OptionsForm/>
    );

    return (
        <FullScreenModal
            show={true}
            onClose={handleClose}
        >
            <div className='channel-subscriptions-modal'>
                <div className='channel-subscriptions-modal-body'>
                    {inner}
                </div>
            </div>
        </FullScreenModal>
    );
}
