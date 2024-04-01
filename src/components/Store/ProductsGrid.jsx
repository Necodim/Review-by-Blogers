import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Store.css';
import ProductCard from './ProductCard';

const ProductsGrid = ({ products, isEditing }) => {
  const navigate = useNavigate();

  const initialProductsPlaceholder = new Array(4).fill({}).map((_, index) => ({
    placeholder: true,
    nmid: `placeholder-${index}`,
  }));
  const [displayProducts, setDisplayProducts] = useState(initialProductsPlaceholder);
  const [selectedProducts, setSelectedProducts] = useState([]);

  useEffect(() => {
    if (products.length > 0) {
      setDisplayProducts(products);
    }
  }, [products]);

  const handleProductClick = (product) => {
    if (isEditing) {
      setSelectedProducts((prevSelected) =>
        prevSelected.includes(product.nmid)
          ? prevSelected.filter((nmid) => nmid !== product.nmid)
          : [...prevSelected, product.nmid]
      );
    } else {
      navigate(`/store/products/${product.nmid}`, { state: { product } });
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