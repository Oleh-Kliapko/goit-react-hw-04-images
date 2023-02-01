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
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [visibleBtn, setVisibleBtn] = useState(false);
  const [largeImg, setLargeImg] = useState('');
  const [tags, setTags] = useState('');
  const [totalPages, setTotalPages] = useState(0);

  // The first rendering of homepage
  useEffect(() => {
    Notify.info('Please start searching', {
      timeout: 4000,
      fontSize: '20px',
      position: 'center-center',
    });
  }, []);

  // The rendering of page after searching
  useEffect(() => {
    if (!imageName) {
      return;
    }

    setLoading(true);

    API.getImages(imageName, page, PER_PAGE.current)
      .then(({ hits, totalHits }) => {
        setVisibleBtn(true);
        setImages(images => (images = [...images, ...hits]));

        if (page === 1) {
          toast.success(`Hooray! We found ${totalHits} images`);
          window.scroll(0, 0);
        }

        const countPages = Math.ceil(totalHits / PER_PAGE.current);
        setTotalPages(countPages);

        if (page >= countPages) {
          setVisibleBtn(false);
          toast.info(
            `We're sorry, but you've reached the end of search "${imageName}". Please start a new search`
          );
        }
      })
      .catch(() =>
        toast.error(
          `Sorry, there are no images "${imageName}". Please try again.`
        )
      )
      .finally(() => {
        setLoading(false);
      });
  }, [imageName, page]);

  // Other functions

  const onSubmitForm = value => {
    if (value !== imageName) {
      setImageName(value);
      setPage(1);
      setImages([]);
    } else {
      toast.warn('The new search must be different from the current search');
    }
  };

  const onLoadMore = () => setPage(state => state + 1);

  const onSelectedImage = ({ largeImageURL, tags }) => {
    setLargeImg(largeImageURL);
    setTags(tags);
  };

  const onCloseByEscape = () => setLargeImg('');

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
          onCloseByEscape={onCloseByEscape}
        />
      )}
      <ToastContainer autoClose={3000} />
    </AppWrapper>
  );
}
