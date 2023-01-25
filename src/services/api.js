import axios from 'axios';

const KEY = '31235804-68392d2c82bd431c260e5e919';
const BASE_URL = 'https://pixabay.com/api/';

const getImages = async (query = [], page = 1, perPage = 12) => {
  const options = {
    params: {
      q: query,
      page: page,
      per_page: perPage,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      key: KEY,
    },
  };

  const {
    data: { hits, totalHits },
    status,
  } = await axios.get(`${BASE_URL}`, options);

  if (status !== 200 || totalHits === 0) {
    throw new Error();
  } else return { hits, totalHits };
};

export const API = {
  getImages,
};
