import { useState, useEffect, useRef } from 'react';
import { Notify } from 'notiflix';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AppWrapper } from './App.slyled';
import { Searchbar } from './Searchbar/Searchbar';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { API } from '../services/api';
import { Loader } from './Loader/Loader';
import { ButtonLoadMore } from './ButtonLoadMore/ButtonLoadMore';
import { Modal } from './Modal/Modal';
import { ScrollEnabled } from '../services/scroll';

export function App() {
  const PER_PAGE = useRef(12);

  const [imageName, setImageName] = useState('');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visibleBtn, setVisibleBtn] = useState(false);
  const [largeImg, setLargeImg] = useState('');
  const [tags, setTags] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalHits, setTotalHits] = useState(0);

  // The first rendering of page
  useEffect(() => {
    Notify.info('Please start searching', {
      timeout: 4000,
      fontSize: '20px',
      position: 'center-center',
    });
  }, []);

  // The first rendering of page after the first searching
  useEffect(() => {
    if (!imageName) {
      return;
    }

    setPage(1);
    setLoading(true);

    const fetchData = async () => {
      return await API.getImages(imageName);
    };

    fetchData()
      .then(({ hits, totalHits }) => {
        setTotalHits(totalHits);
        setImages(hits);
        toast.success(`Hooray! We found ${totalHits} images`);
        window.scroll(0, 0);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [imageName]);

  // The rendering of page after click on LoadMore Button
  useEffect(() => {
    if (page === 1) {
      return;
    }

    setLoading(true);

    const fetchData = async () => {
      return await API.getImages(page, PER_PAGE.current);
    };

    fetchData()
      .then(({ hits }) => setImages(images => (images = [...images, ...hits])))
      .finally(() => setLoading(false));
  }, [page]);

  // The rendering of page after reaching of collection ending
  useEffect(() => {
    if (totalHits === 0) {
      return;
    }

    setVisibleBtn(true);
    const countPages = Math.ceil(totalHits / PER_PAGE.current);
    setTotalPages(countPages);

    if (page >= countPages) {
      setVisibleBtn(false);
      toast.info(
        `We're sorry, but you've reached the end of search "${imageName}". Please start a new search`
      );
    }
    // eslint-disable-next-line
  }, [totalHits, page]);

  // Other functions

  const onSubmitForm = value => {
    if (value !== imageName) {
      setImageName(value);
    } else {
      toast.warn('The new search must be different from the current search');
    }
  };

  const onLoadMore = () => setPage(state => state + 1);

  const onSelectedImage = ({ largeImageURL, tags }) => {
    setLargeImg(largeImageURL);
    setTags(tags);
  };

  const onCloseByClick = evt => {
    if (evt.target.id === 'backdrop') {
      setLargeImg('');
      window.removeEventListener('keydown', onCloseByEscape);
    }
  };

  const onCloseByEscape = evt => {
    if (evt.code === 'Escape') {
      setLargeImg('');
      window.removeEventListener('keydown', onCloseByEscape);
    }
  };

  return (
    <AppWrapper>
      <ScrollEnabled />
      <Searchbar onSubmit={onSubmitForm} />
      {loading && <Loader />}
      <ImageGallery images={images} onSelected={onSelectedImage} />
      {visibleBtn && (
        <ButtonLoadMore
          onLoadMore={onLoadMore}
          page={page}
          totalPages={totalPages}
        />
      )}
      {largeImg && (
        <Modal
          largeImg={largeImg}
          tags={tags}
          onCloseByClick={onCloseByClick}
          onCloseByEscape={onCloseByEscape}
        />
      )}
      <ToastContainer autoClose={3000} />
    </AppWrapper>
  );
}
