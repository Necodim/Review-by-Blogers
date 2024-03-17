import React from 'react';
import ProductCard from './ProductCard';

const ProductsGrid = ({ products, isEditing, selectedProducts, handleSelectProduct }) => (
    <div className='cards'>
        {products.map((product) => (
            <ProductCard
                key={product.nmid}
                product={product}
                isEditing={isEditing}
                isSelected={selectedProducts.includes(product.nmid)}
                onClick={() => isEditing && handleSelectProduct(product.nmid)}
            />
        ))}
    </div>
);

export default ProductsGrid;