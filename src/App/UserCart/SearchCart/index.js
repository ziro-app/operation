import React, { useEffect, useState, useMemo } from 'react';
import Header from '@bit/vitorbarbosa19.ziro.header';
import Icon from '@bit/vitorbarbosa19.ziro.icon';
import Dropdown from '@bit/vitorbarbosa19.ziro.dropdown';
import { motion } from 'framer-motion';
import { cart, statusBlock, statusName, card, brandName, timestamp, dot, bubble } from './styles';
import { container } from '@ziro/theme';
import { prepareStatusForConsume, prepareStoreownersForConsume, prepareSellersToConsume, prepareCartsForConsume } from '../utils';
import { useQuery } from './useQuery';
import { useLocation } from 'wouter';
import { Menu } from '../../Menu';

export default ({ carts, storeowners, setQueryStr }) => {
  const [, setLocation] = useLocation();

  const useQuerySelector = useQuery();

  const [storeownerId, setStoreownerId] = useQuerySelector('storeownerId');
  const [seller, setSeller] = useQuerySelector('seller');
  const [status, setStatus] = useQuerySelector('status');

  const _carts = useMemo(prepareCartsForConsume(carts, seller, storeownerId, status), [carts, seller, storeownerId, status]);
  const _storeowners = useMemo(prepareStoreownersForConsume(_carts.available, storeowners), [_carts.available, storeowners]);
  const _sellers = useMemo(prepareSellersToConsume(_carts.available), [_carts.available]);
  const _status = useMemo(prepareStatusForConsume(_carts.available), [_carts.available]);

  const [bufferStatus, setBufferStatus] = useState(status && _status.convert.ENtoPT[status]);
  const [bufferRazao, setBufferRazao] = useState(storeownerId && _storeowners.convert.IdToRazao[storeownerId]);

  useEffect(() => {
    const conv = _status.convert.PTtoEN[bufferStatus];
    if (conv) setStatus(conv);
  }, [bufferStatus]);

  useEffect(() => {
    setBufferStatus(status && _status.convert.ENtoPT[status]);
  }, [status]);

  useEffect(() => {
    const conv = _storeowners.convert.RazaoToId[bufferRazao];
    if (conv) setStoreownerId(conv);
  }, [bufferRazao]);

  useEffect(() => {
    setBufferRazao(storeownerId && _storeowners.convert.IdToRazao[storeownerId]);
  }, [storeownerId]);

  useEffect(() => {
    setQueryStr(location.search);
  }, [storeownerId, seller, status]);

  return (
    <Menu title="Pedidos">
      <div style={container}>
        <div style={{ display: 'grid', gridGap: '8px', marginBottom: '40px' }}>
          <Dropdown
            value={seller || ''}
            list={_sellers.options}
            placeholder="Filtrar fabricante"
            onChange={({ target: { value } }) => setSeller(value)}
            onChangeKeyboard={e => e && setSeller(e.value)}
          />
          <Dropdown
            value={bufferStatus || ''}
            list={_status.options.PT}
            placeholder="Filtrar status"
            onChange={({ target: { value } }) =>
              !value || _status.convert.PTtoEN[value] ? setStatus(_status.convert.PTtoEN[value]) : setBufferStatus(value)
            }
            onChangeKeyboard={e => e && setBufferStatus(e.value)}
          />
          <Dropdown
            value={bufferRazao || ''}
            list={_storeowners.options.razoes}
            placeholder="Filtrar lojista"
            onChange={({ target: { value } }) =>
              !value || _storeowners.convert.RazaoToId[value] ? setStoreownerId(_storeowners.convert.RazaoToId[value]) : setBufferRazao(value)
            }
            onChangeKeyboard={e => e && setBufferRazao(e.value)}
          />
        </div>
        <div style={cart}>
          {_status.options.EN.map(EN => (
            <div key={EN} style={statusBlock}>
              <label style={statusName}>{_status.convert.ENtoPT[EN]}</label>
              {_carts.byStatus[EN].map(cart => (
                <motion.div key={cart.id} whileTap={{ scale: 0.95 }} onClick={() => setLocation(`/pedidos/${cart.id}`)} style={card}>
                  <div style={{ display: 'grid' }}>
                    <label
                      style={{
                        fontSize: 16,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {_storeowners.convert.IdToRazao[cart.storeownerId]}
                      <span style={dot}>.</span>
                    </label>
                    <label style={brandName}>{cart.brandName}</label>
                    <label style={timestamp}>
                      {cart.lastUpdate ? `Atualizado ${cart.lastUpdate}` : `Adicionado ${cart.added}`}
                    </label>
                  </div>
                  <div style={bubble}>{cart.productIds?.length || '0'}</div>
                  <div style={{ transform: 'rotate(90deg)' }}>
                    <Icon type="chevronUp" size={20} color="black" />
                  </div>
                </motion.div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </Menu>
  );
};
