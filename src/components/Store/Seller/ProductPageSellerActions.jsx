import React, { useState } from 'react';
import Button from '../../Button/Button';
import PopupWriteTask from '../../Popup/PopupWriteTask';
import PopupConfirmation from '../../Popup/PopupConfirmation';

const ProductPageSellerActions = ({ hasBarter, selectedProducts, closeBarters }) => {
  const [isPopupWriteTaskVisible, setIsPopupWriteTaskVisible] = useState(false);
  const [isPopupConfirmationBarterCloseVisible, setIsPopupConfirmationBarterCloseVisible] = useState(false);

  const openPopupWriteTask = () => {
    setIsPopupWriteTaskVisible(true);
  }

  const openPopupConfirmation = () => {
    setIsPopupConfirmationBarterCloseVisible(true);
  }

  return (
    <>
      <div className='w-100'>
        {hasBarter ?
        <div className='list'>
          <div className='list-item'>
            <Button icon='format_list_bulleted'>Смотреть ТЗ</Button>
          </div>
          <div className='list-item'>
            <Button icon='cancel' onClick={openPopupConfirmation}>Закрыть бартер</Button>
          </div>
        </div> :
        <Button icon='add' onClick={openPopupWriteTask}>Открыть бартер</Button>
        }
      </div>
      <PopupWriteTask
        isOpen={isPopupWriteTaskVisible}
        onClose={() => setIsPopupWriteTaskVisible(false)}
        selectedProducts={selectedProducts}
      />
      <PopupConfirmation
        id='popup-barter-close'
        title='Вы уверены?'
        text='Вы точно хотите закрыть бартеры?'
        descr='В будущем их можно будет снова открыть'
        isOpen={isPopupConfirmationBarterCloseVisible}
        onClose={() => setIsPopupConfirmationBarterCloseVisible(false)}
        onConfirmation={closeBarters}
      />
    </>
  );
};

export default ProductPageSellerActions;