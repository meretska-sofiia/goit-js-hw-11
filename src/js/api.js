import axios from 'axios';
const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '29947083-d7a9168667076548201f0ba28';

export class PixabayApi {
  constructor() {
    this.page = null;
    this.searchQuery = '';
    this.per_page = 40;
  }

  async fetchPhoto() {
    try {
      const options = {
        key: API_KEY,
        q: this.searchQuery,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: 'true',
        page: this.page,
        per_page: this.per_page,
      };

      return await axios.get(`${BASE_URL}`, { params: options });
    } catch (error) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
  }
}