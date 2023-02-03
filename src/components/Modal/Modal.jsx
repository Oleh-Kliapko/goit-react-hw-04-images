import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { createPortal } from 'react-dom';
import { Backdrop, ModalWrapper } from './Modal.styled';
import { ScrollDisabled } from '../../services/scroll';

const modalRoot = document.querySelector('#modal-root');

export function Modal({ largeImg, tags, onCloseByEscape }) {
  const onClickBackdrop = evt => {
    console.log(evt);
    if (evt.target === evt.currentTarget) {
      onCloseByEscape();
    }
  };

  useEffect(() => {
    const isPushEsc = evt => {
      if (evt.code === 'Escape') {
        onCloseByEscape();
      }
    };

    window.addEventListener('keydown', isPushEsc);
    return () => window.removeEventListener('keydown', isPushEsc);
  }, [onCloseByEscape]);

  return createPortal(
    <Backdrop id="backdrop" onClick={onClickBackdrop}>
      <ModalWrapper>
        <img src={largeImg} alt={tags} />
      </ModalWrapper>
      <ScrollDisabled />
    </Backdrop>,
    modalRoot
  );
}

Modal.propTypes = {
  largeImg: PropTypes.string.isRequired,
  tags: PropTypes.string.isRequired,
  onCloseByEscape: PropTypes.func,
  onCloseByClick: PropTypes.func,
};
