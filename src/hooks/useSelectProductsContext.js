import React, { createContext, useContext, useState } from 'react';

const SelectedProductsContext = createContext();

export const useSelectedProducts = () => useContext(SelectedProductsContext);

export const SelectedProductsProvider = ({ children }) => {
  const [selectedProducts, setSelectedProducts] = useState([]);

  const handleSelectProduct = (product) => {
    setSelectedProducts((prevSelected) => {
      const index = prevSelected.findIndex(p => p.id === product.id);
      if (index > -1) {
        return prevSelected.filter(p => p.id !== product.id);
      } else {
        return [...prevSelected, product];
      }
    });
  }

  return (
    <SelectedProductsContext.Provider value={{ selectedProducts, setSelectedProducts, handleSelectProduct }}>
      {children}
    </SelectedProductsContext.Provider>
  );
};
