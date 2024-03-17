import React, { useEffect, useState } from 'react';
import api from '../../api/api';
import { useToastManager } from '../../hooks/useToast';
import CategoryCard from './CategoryCard';

const Categories = ({ onCategorySelect }) => {
  const [categories, setCategories] = useState([]);
  const [openedCategories, setOpenedCategories] = useState({});
  const [errorMessage, setErrorMessage] = useState('');

  const { showToast, resetLoadingToast } = useToastManager();

  useEffect(() => {
    if (errorMessage) {
      resetLoadingToast();
      showToast(errorMessage, 'error');
    }
  }, [errorMessage, showToast]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.setStore();
        if (Array.isArray(response)) {
          setCategories(response);
        } else {
          throw new Error('Неверный формат данных');
        }
      } catch (error) {
        setCategories([]);
        setErrorMessage('Произошла ошибка при получении списка категорий');
        console.error(error.message);
      }
    }
    fetchData();
  }, []);

  const handleCategoryClick = (categoryId) => {
    setOpenedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  return (
    <div className='categories-wrapper' id='categories'>
      <div className='list'>
        {categories.map(category => (
          <React.Fragment key={category.id}>
            <CategoryCard
              onClick={() => handleCategoryClick(category.id)}
              className={`list-item ${openedCategories[category.id] ? 'opened' : 'closed'}`}
              title={category.name}
              count={category.barters}
              data-category={category.id}
            />
            {openedCategories[category.id] && category.subcategories && category.subcategories.map(subCategory => (
              <CategoryCard
                key={subCategory.id}
                onClick={() => onCategorySelect(subCategory.id)}
                className='sub list-item'
                title={subCategory.name}
                count={subCategory.barters}
                data-category={subCategory.id}
              />
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default Categories;
