import React, { useState } from 'react';
import './Pagination.css';

const PaginationList = ({ items, titles, itemsPerPage = 5 }) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Вычисление количества страниц
  const totalPages = Math.ceil(items.length / itemsPerPage);

  // Вычисление индексов элементов для текущей страницы
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);

  // Функция для изменения страницы
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      <div className='list gap-xs'>
        {titles &&
          <div className='list-item'>
            {titles.map((title, i) => (
              <small key={`title-${i}`}>{title}</small>
            ))}
          </div>
        }
        {currentItems.map((item, i) => (
          <div key={`item-${i}`} className='list-item'>
            {Object.entries(item).map(([key, value]) => (
              <span key={key}>{value}</span>
            ))}
          </div>
        ))}
      </div>
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            className={`pagination-button ${currentPage === index + 1 ? 'active' : ''}`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </>
  );
};

export default PaginationList;