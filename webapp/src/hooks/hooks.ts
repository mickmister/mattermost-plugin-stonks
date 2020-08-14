import {useDispatch, useSelector} from 'react-redux';
import {isOptionsModalOpen} from '../selectors/selectors';
import {openOptionsModal, closeOptionsModal} from '../actions/actions';

export const useOptionsModal = () => {
    const dispatch = useDispatch();

    return {
        isOpen: useSelector(isOptionsModalOpen),
        openModal: () => dispatch(openOptionsModal()),
        closeModal: () => dispatch(closeOptionsModal()),
    }
}
