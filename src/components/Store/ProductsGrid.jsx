import React from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCard from './ProductCard';

const ProductsGrid = ({ products, isEditing, selectedProducts, handleSelectProduct }) => {
  const navigate = useNavigate();

  const handleProductClick = (product) => {
    if (isEditing) {
      handleSelectProduct(product.nmid);
    } else {
      navigate(`/store/products/${product.nmid}`);
    }
  }
  return (
    <div className='cards'>
      {products.map((product) => (
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