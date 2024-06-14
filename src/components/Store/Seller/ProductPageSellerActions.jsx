import React, { useEffect, useState } from 'react';
import moment from 'moment';
import Button from '../../Button/Button';
import PopupTaskRead from '../../Popup/PopupTaskRead';
import PopupTaskWrite from '../../Popup/PopupTaskWrite';
import PopupConfirmation from '../../Popup/PopupConfirmation';
import { useUserProfile } from '../../../hooks/UserProfileContext';

const ProductPageSellerActions = ({ selectedProducts, closeBarters }) => {
  const { isActive } = useUserProfile();
  const [barter, setBarter] = useState({});
  const [isBarterOpen, setIsBarterOpen] = useState(false);
  const [isPopupTaskReadVisible, setIsPopupTaskReadVisible] = useState(false);
  const [isPopupTaskWriteVisible, setIsPopupTaskWriteVisible] = useState(false);
  const [isPopupConfirmationBarterCloseVisible, setIsPopupConfirmationBarterCloseVisible] = useState(false);

  useEffect(() => {
    if (!!selectedProducts && selectedProducts.length > 0) {
      if (selectedProducts[0] && selectedProducts[0].barter) {
        setBarter(selectedProducts[0].barter);
        if (selectedProducts[0].barter.closedat == null || moment(selectedProducts[0].barter.closedat).isAfter(moment())) {
          setIsBarterOpen(true);
        }
      }
    }
  }, [selectedProducts]);

  const openPopupTaskRead = () => {
    setIsPopupTaskReadVisible(true);
  }

  const openPopupTaskWrite = () => {
    setIsPopupTaskWriteVisible(true);
  }

  const openPopupConfirmation = () => {
    setIsPopupConfirmationBarterCloseVisible(true);
  }

  return (
    <>
      <div className='w-100'>
        <div className='list'>
          {(!!barter?.task || !!barter?.brand_instagram || !!barter?.need_feedback) &&
            <div className='list-item'>
              <Button icon='format_list_bulleted' onClick={openPopupTaskRead}>Смотреть / Изменить ТЗ</Button>
            </div>
          }
          {isBarterOpen ?
            <div className='list-item'>
              <Button icon='cancel' onClick={openPopupConfirmation}>Закрыть бартер</Button>
            </div> :
            <div className='list-item'>
              <Button icon='add' onClick={openPopupTaskWrite} disabled={!isActive}>Открыть бартер</Button>
            </div>
          }
        </div>
      </div>
      {(!!barter?.task || !!barter?.brand_instagram || !!barter?.need_feedback) &&
        <PopupTaskRead
          isOpen={isPopupTaskReadVisible}
          onClose={() => setIsPopupTaskReadVisible(false)}
          barter={barter}
          onEdit={() => { setIsPopupTaskReadVisible(false), setIsPopupTaskWriteVisible(true) }}
        />
      }
      <PopupTaskWrite
        isOpen={isPopupTaskWriteVisible}
        onClose={() => setIsPopupTaskWriteVisible(false)}
        selectedProducts={selectedProducts}
      />
      <PopupConfirmation
        id='popup-barter-close'
        title='Вы уверены?'
        text='Вы точно хотите закрыть бартер? Текущие сделки по данному товару закрыты не будут.'
        descr='В будущем его можно будет снова открыть'
        isOpen={isPopupConfirmationBarterCloseVisible}
        onClose={() => setIsPopupConfirmationBarterCloseVisible(false)}
        onConfirmation={closeBarters}
      />
    </>
  );
};

export default ProductPageSellerActions;