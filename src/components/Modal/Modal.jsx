import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createPortal } from 'react-dom';
import { Backdrop, ModalWrapper } from './Modal.styled';
import { ScrollDisabled } from '../../services/disable-scroll';

const modalRoot = document.querySelector('#modal-root');

export class Modal extends Component {
  componentDidMount() {
    window.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown);
  }

  handleKeyDown = evt => {
    if (evt.code === 'Escape') {
      this.props.onCloseByEscape();
    }
  };

  render() {
    const { largeImg, tags, onCloseByClick } = this.props;
    return createPortal(
      <Backdrop id="backdrop" onClick={onCloseByClick}>
        <ModalWrapper>
          <img src={largeImg} alt={tags} />
        </ModalWrapper>
        <ScrollDisabled />
      </Backdrop>,
      modalRoot
    );
  }
}

Modal.propTypes = {
  largeImg: PropTypes.string.isRequired,
  tags: PropTypes.string.isRequired,
  onCloseByEscape: PropTypes.func,
  onCloseByClick: PropTypes.func,
};
