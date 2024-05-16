import React, { useEffect, useState } from 'react';
import api from '../../../api/api';
import { useToastManager } from '../../../hooks/useToast';
import CategoryCard from './CategoryCard';

const Categories = ({ onCategorySelect }) => {
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [openedCategories, setOpenedCategories] = useState({});
  const [errorMessage, setErrorMessage] = useState('');

  const { showToast } = useToastManager();

  useEffect(() => {
    if (errorMessage) {
      showToast(errorMessage, 'error');
    }
  }, [errorMessage, showToast]);

  useEffect(() => {
    const fetchData = async () => {
      setCategoriesLoading(true);
      try {
        const response = await api.setStore();
        if (Array.isArray(response)) {
          setCategories(response);
        } else {
          throw new Error('Неверный формат данных');
        }
      } catch (error) {
        setCategories([]);
        if (error !== 'Открытых бартеров нет') {
          setErrorMessage('Произошла ошибка при получении списка категорий');
        }
        console.error(error.message);
      } finally {
        setCategoriesLoading(false);
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
        {categoriesLoading && <p>Категории загружаются...</p>}
        {!categoriesLoading &&
          categories.map(category => (
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
          ))
        }
      </div>
    </div>
  );
};

export default Categories;