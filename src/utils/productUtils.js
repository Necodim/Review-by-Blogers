import { useNavigate } from 'react-router-dom';

const navigate = useNavigate();

export const selectProduct = (productId, isEditing, setSelectedProducts) => {
  if (isEditing) {
    setSelectedProducts((prevSelected) =>
      prevSelected.includes(productId)
        ? prevSelected.filter((id) => id !== productId)
        : [...prevSelected, productId]
    );
  } else {
    navigate(`/store/products/product-${productId}`);
  }
}