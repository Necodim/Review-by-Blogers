import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api/api';

const CategoryPage = () => {
  const { id } = useParams();
  const [categoryPageData, setCategoryPageData] = useState(null);

  useEffect(() => {
    const fetchCategoryPageData = async () => {
      try {
        const response = await api.setCategoryPage(id);
        console.log(response)
        setCategoryPageData(response);
      } catch (error) {
        console.error('Ошибка при получении данных категории:', error);
      }
    };
    fetchCategoryPageData();
  }, [id]);

  if (!categoryPageData) {
    return <div>Загрузка данных категории...</div>;
  }

  return (
    <div>
      {/* <h2>{categoryPageData.name}</h2> */}
      {/* Здесь может быть дополнительный контент, например, список товаров категории */}
    </div>
  );
};

export default CategoryPage;