import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { createPortal } from 'react-dom';
import { Backdrop, ModalWrapper } from './Modal.styled';
import { ScrollDisabled } from '../../services/scroll';

const modalRoot = document.querySelector('#modal-root');

export function Modal({ largeImg, tags, onCloseByClick, onCloseByEscape }) {
  useEffect(
    () => window.addEventListener('keydown', onCloseByEscape),
    [onCloseByEscape]
  );

  return createPortal(
    <Backdrop
      id="backdrop"
      onClick={onCloseByClick}
      onKeyDown={onCloseByEscape}
    >
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
