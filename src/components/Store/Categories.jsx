import React, { useEffect, useState } from 'react';
import api from '../../api/api';
import CategoryCard from './CategoryCard';

const Categories = ({ onCategorySelect }) => {
  const [categories, setCategories] = useState([]);
  const [openedCategories, setOpenedCategories] = useState({});

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.setStore();
        setCategories(response);
      } catch (error) {
        console.error('Ошибка при получении категорий:', error);
      }
    };

    fetchCategories();
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
