import { useState, useEffect } from 'react';
import axios from 'axios';
import SearchBar from '../SearchBar/SearchBar';
import ImageGallery from '../ImageGallery/ImageGallery';
import ImageModal from '../ImageModal/ImageModal';
import LoadMoreBtn from '../LoadMoreBtn/LoadMoreBtn';
import { Hourglass } from 'react-loader-spinner';
import css from './App.module.css';

// API Unsplash
const ACCESS_KEY = 'oRnvDff_v4Fguye2gfRmfu2bAV1azLMWGiVWxPK_ofo';
const BASE_URL = 'https://api.unsplash.com/search/photos';

// Типізація відповіді від API Unsplash
export interface UnsplashImage {
  id: string; // Унікальний ідентифікатор зображення
  urls: {
    small: string; // URL маленької версії зображення
    regular: string; // URL більшої версії зображення
  };
  alt_description: string | null; // Опис зображення
}

// Функція для отримання даних із Unsplash API
export const fetchImages = async (
  query: string, // Пошуковий запит
  page = 1, // Номер сторінки
  perPage = 12 // Кількість результатів на сторінку
): Promise<UnsplashImage[]> => {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        query,
        page,
        per_page: perPage,
        client_id: ACCESS_KEY,
      },
    });

    // Перевірка даних та підстановка відсутніх значень
    return response.data.results.map((image: any) => ({
      ...image,
      urls: {
        small: image.urls.small,
        regular: image.urls.regular || image.urls.small,
      },
    }));
  } catch (error) {
    console.error(error);
    return [];
  }
};

function App() {
  const [query, setQuery] = useState<string>('');
  const [images, setImages] = useState<UnsplashImage[]>([]);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [selectedImage, setSelectedImage] = useState<UnsplashImage | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Виконуємо запит на отримання зображень
  useEffect(() => {
    const getImages = async () => {
      if (!query) return;
      setLoading(true);
      try {
        const data = await fetchImages(query, page);
        setImages(prevImages => [...prevImages, ...data]); // Додаємо нові зображення до існуючих
      } catch (err) {
        setError(err as Error);
      }
      setLoading(false);
    };

    getImages();
  }, [query, page]);

  // Обробник пошуку
  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    setImages([]);
    setPage(1);
    setError(null);
  };

  // Завантаження додаткових зображень
  const handleLoadMore = () => {
    setPage(prevPage => prevPage + 1); // Збільшуємо номер сторінки
  };

  // Відкриття модального вікна
  const openModal = (image: UnsplashImage) => {
    setSelectedImage(image);
    setIsModalOpen(true);
  };

  // Закриття модального вікна
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };

  return (
    <div className={css.appcontainer}>
      <SearchBar onSubmit={handleSearch} />
      {loading && page === 1 && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
          }}
        >
          <Hourglass
            visible={true}
            height="80"
            width="80"
            ariaLabel="hourglass-loading"
            wrapperStyle={{}}
            wrapperClass=""
            colors={['#306cce', '#72a1ed']}
          />
        </div>
      )}
      {error && <p>Oops... Something went wrong. Error: {error.message}</p>}
      {!loading && images.length === 0 && query && <p>No images found.</p>}
      {images.length > 0 && (
        <>
          <ImageGallery images={images} openModal={openModal} />
          <div style={{ textAlign: 'center' }}>
            <LoadMoreBtn onClick={handleLoadMore} />
          </div>
        </>
      )}
      {loading && page > 1 && (
        <div style={{ textAlign: 'center' }}>
          <Hourglass
            visible={true}
            height="80"
            width="80"
            ariaLabel="hourglass-loading"
            wrapperStyle={{}}
            wrapperClass=""
            colors={['#306cce', '#72a1ed']}
          />
        </div>
      )}
      {selectedImage && (
        <ImageModal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          image={selectedImage}
        />
      )}
    </div>
  );
}

export default App;
