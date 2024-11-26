import css from './ImageCard.module.css';

// Типізація пропсів компонента
interface ImageCardProps {
  src: string; // URL зображення
  alt: string; // Опис зображення
  onClick: () => void; // Обробник кліку
}

function ImageCard({ src, alt, onClick }: ImageCardProps) {
  return (
    <div onClick={onClick} className={css.card} style={{ cursor: 'pointer' }}>
      <img src={src} alt={alt} />
    </div>
  );
}

export default ImageCard;
