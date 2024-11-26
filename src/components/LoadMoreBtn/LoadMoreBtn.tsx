// Типізація пропсів для компонента
interface LoadMoreBtnProps {
  onClick: () => void; // Функція, яка викликається при натисканні кнопки
}

function LoadMoreBtn({ onClick }: LoadMoreBtnProps) {
  return <button onClick={onClick}>Load more</button>;
}

export default LoadMoreBtn;
