import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { PixabayApi } from './js/api';
import Notiflix from 'notiflix';
import createGallery from './gallery.hbs';

const submitBtnEl = document.querySelector('#search-form');
const galleryEl = document.querySelector('.gallery');
// const loadMoreBtnEl = document.querySelector('.load-more');

const pixabayApi = new PixabayApi();
const gallery = new SimpleLightbox('.gallery a');
let nextPage = 3;

const infiniteObserver = new IntersectionObserver(([entry], observer) => {
  if (entry.isIntersecting) {
    observer.unobserve(entry.target);

    onLoadMoreImages((nextPage += 1));
  }
});

const smoothScroll = () => {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
};

// const makeHiddenBtn = () => {
//   loadMoreBtnEl.classList.add('is-hidden');
//   loadMoreBtnEl.removeEventListener('click', onLoadMoreImages);
// };

const onLoadMoreImages = () => {
  pixabayApi.page += 1;
  pixabayApi.fetchPhoto().then(response => {
    const { data } = response;
    smoothScroll();

    if (
      data.total <= pixabayApi.page * pixabayApi.per_page ||
      data.hits.length === 0
    ) {
      // makeHiddenBtn();
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
      return;
    }
    galleryEl.insertAdjacentHTML('beforeend', createGallery(data.hits));
    gallery.refresh();
    const lastCard = document.querySelector('.card:last-child');

    if (lastCard) {
      infiniteObserver.observe(lastCard);
    }
  });
  // .catch(err => {
  //   Notiflix.Notify.failure(
  //     'Sorry, there are no images matching your search query. Please try again.'
  //   );
  // });
};

const onSearchImagesSubmit = event => {
  event.preventDefault();

  pixabayApi.page = 1;
  galleryEl.innerHTML = '';
  pixabayApi.searchQuery = event.currentTarget.elements.searchQuery.value;

  if (pixabayApi.searchQuery !== '') {
    pixabayApi.fetchPhoto().then(response => {
      const { data } = response;
      if (data.totalHits === 0) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        return;
      }
      if (data.totalHits === 1) {
        galleryEl.insertAdjacentHTML('beforeend', createGallery(data.hits));
        return;
      }

      galleryEl.insertAdjacentHTML('beforeend', createGallery(data.hits));
      Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
      gallery.refresh();

      const lastCard = document.querySelector('.card:last-child');

      if (lastCard) {
        infiniteObserver.observe(lastCard);
      }
      // loadMoreBtnEl.classList.remove('is-hidden');
      // loadMoreBtnEl.addEventListener('click', onLoadMoreImages);

      if (data.total <= pixabayApi.page * pixabayApi.per_page) {
        //   makeHiddenBtn();
      }
    });
    // .catch(err => {
    //   Notiflix.Notify.failure(
    //     'Sorry, there are no images matching your search query. Please try again.'
    //   );
    // });
  }
  //   loadMoreBtnEl.classList.add('is-hidden');
};

submitBtnEl.addEventListener('submit', onSearchImagesSubmit);
