import React, { useEffect, useState } from 'react';
import api from '../../api/api';
import CategoryCard from './CategoryCard';

const Categories = ({ onCategorySelect }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/categories');
        setCategories(response.data);
      } catch (error) {
        console.error('Ошибка при получении категорий:', error);
        // Обработка ошибок, например, показ сообщения
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className='categories-wrapper' id='categories'>
      <div className='list'>
        {categories.map(category => (
          <React.Fragment key={category.id}>
            <CategoryCard
              onClick={() => onCategorySelect(category.id)}
              className='list-item'
              title={category.title}
              count={category.count}
              data-category={category.id}
            />
            {category.subCategories && category.subCategories.map(subCategory => (
              <CategoryCard
                key={subCategory.id}
                onClick={() => onCategorySelect(subCategory.id)}
                className='sub list-item closed'
                title={subCategory.title}
                count={subCategory.count}
                data-category={subCategory.id}
                data-parent-category={category.id}
              />
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default Categories;