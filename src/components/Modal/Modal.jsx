import { useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { createPortal } from 'react-dom';
import { Backdrop, ModalWrapper } from './Modal.styled';
import { ScrollDisabled } from '../../services/scroll';

const modalRoot = document.querySelector('#modal-root');

export function Modal({ largeImg, tags, onCloseByEscape }) {
  const onKeyEsc = useCallback(
    evt => {
      if (evt.code === 'Escape') {
        onCloseByEscape();
      }
    },
    [onCloseByEscape]
  );

  const onClickBackdrop = useCallback(
    ({ target, currentTarget }) => {
      if (target === currentTarget) {
        onCloseByEscape();
      }
    },
    [onCloseByEscape]
  );

  useEffect(() => {
    window.addEventListener('keydown', onKeyEsc);
    return () => window.removeEventListener('keydown', onKeyEsc);
  }, [onCloseByEscape, onKeyEsc]);

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
