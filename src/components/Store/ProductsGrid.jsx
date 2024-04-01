import React from 'react';
import ProductCard from './ProductCard';

const ProductsGrid = ({ products, isEditing, selectedProducts, handleSelectProduct }) => {
  return (
    <div className='cards'>
      {products.map((product) => (
        <ProductCard
          key={product.nmid}
          product={product}
          isEditing={isEditing}
          isSelected={selectedProducts.includes(product.nmid)}
          onClick={() => handleSelectProduct(product)}
        />
      ))}
    </div>
  );
}

export default ProductsGrid;