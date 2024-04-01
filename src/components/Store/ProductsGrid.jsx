import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Store.css';
import { useSelectedProducts } from '../../hooks/useSelectProductsContext';
import ProductCard from './ProductCard';

const ProductsGrid = ({ products, isEditing }) => {
  const navigate = useNavigate();

  const { selectedProducts, handleSelectProduct } = useSelectedProducts();

  const initialProductsPlaceholder = new Array(4).fill({}).map((_, index) => ({
    placeholder: true,
    nmid: `placeholder-${index}`,
  }));
  const [displayProducts, setDisplayProducts] = useState(initialProductsPlaceholder);

  useEffect(() => {
    if (products.length > 0) {
      setDisplayProducts(products);
    }
  }, [products]);

  const handleProductClick = (product) => {
    if (isEditing) {
      handleSelectProduct(product.nmid);
    } else {
      navigate(`/store/products/${product.id}`, { state: { product } });
    }
  }

  return (
    <div className='cards'>
      {displayProducts.map((product) => (
        <ProductCard
          key={product.nmid}
          product={product}
          isEditing={isEditing}
          isSelected={selectedProducts.includes(product.nmid)}
          onClick={() => handleProductClick(product)}
        />
      ))}
    </div>
  );
}

export default ProductsGrid;