import React, { createContext, useContext, useState } from 'react';

const SelectedProductsContext = createContext();

export const useSelectedProducts = () => useContext(SelectedProductsContext);

export const SelectedProductsProvider = ({ children }) => {
  const [selectedProducts, setSelectedProducts] = useState([]);

  const handleSelectProduct = (productId) => {
    setSelectedProducts((prevSelected) =>
      prevSelected.includes(productId)
        ? prevSelected.filter((id) => id !== productId)
        : [...prevSelected, productId]
    );
  };

  return (
    <SelectedProductsContext.Provider value={{ selectedProducts, setSelectedProducts, handleSelectProduct }}>
      {children}
    </SelectedProductsContext.Provider>
  );
};