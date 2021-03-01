import { useState } from 'react';
import axios from 'axios';
import { fbauth, auth, db } from '../../../Firebase/index';
import { IZoopData, IFirebaseData, IApiData, ISheetsData, IUserData } from './IRollbackData';

const url = process.env.SHEET_URL;
const config = {
  headers: {
    'Content-type': 'application/json',
    Authorization: process.env.SHEET_TOKEN,
  },
};

const findSheetsRow = async (id,rangeToSearch,spreadsheetId) => {
    const body = {
      apiResource: 'values',
      apiMethod: 'get',
      range: rangeToSearch || 'Base!E:E',
      spreadsheetId: spreadsheetId || process.env.SHEET_SUPPLIERS_ID,
    };
    let pos = 0;
    const {
      data: { values },
    } = await axios.post(url, body, config);
    values.map((user, index) => {
      if (user[0] === id) {
        pos = index + 1;
      }
    });
    return pos;
  };

const useRollback = () => {
  //é como se uma lista fosse montada, ou seja, vamos adicionar itens com suas origens,
  //identificadores e método a ser usado,
  //se houver a necessidade de rollback, iremos caminhar por essa lista realizando as operacoes
  const [dataRollback, setDataRollback] = useState <Array<IZoopData|IFirebaseData|IApiData|ISheetsData|IUserData>>([]); //useState<IRollbackData[]>([]);
  const [startRollbacks, setStartRollbacks] = useState(false);

  const update = () => {
      const run = async () => {
        if (dataRollback.length > 0) {
          let snapCollection;
          let docRefCollection;
          Object.entries(dataRollback).map(async item => {
            const { origin } = item[1] as unknown as IZoopData|IFirebaseData|IApiData|ISheetsData|IUserData;
            if (origin === 'firebase') {
              const { collection, field, identifier,method } = item[1] as unknown as IFirebaseData;
              if(method === 'delete'){
              if(field === 'uid'){
                await db.collection(collection).doc(identifier).delete();
              } else {
                snapCollection = await db.collection(collection).where(field, '==', identifier).get();
                snapCollection.forEach(doc => (docRefCollection = doc.ref));
                docRefCollection.delete();
            }}
            if(method === 'update'){
                const {fieldUpdated,valueUpdated} = item[1] as unknown as IFirebaseData;
                if(field === 'uid'){
                await db.collection('suppliers').doc(identifier).update({
                    [fieldUpdated]: valueUpdated,
                  })}
            }
            } else if (origin === 'sheets') {
              const { id, rangeToSearch, rangeToUpdate, spreadsheetId, values } = item[1] as unknown as ISheetsData;
              const sheetsRow = await findSheetsRow(id,rangeToSearch,spreadsheetId)
              const rangeWithRow = `${rangeToUpdate}${sheetsRow}`
              const url = process.env.SHEET_URL;
              const config = {
                headers: {
                  'Content-type': 'application/json',
                  Authorization: process.env.SHEET_TOKEN,
                },
              };
              const body = {
                apiResource: 'values',
                apiMethod: 'update',
                range: rangeWithRow,
                spreadsheetId,
                resource: {
                  values: [values],
                },
                valueInputOption: 'raw',
              };
              await axios.post(url, body, config);
            } else if (origin === 'zoop') {
              const { zoopId } = item[1] as unknown as IZoopData;
              await axios.post(
                `${process.env.PAY_URL}sellers-delete?seller_id=${zoopId}`,
                {},
                {
                  headers: {
                    Authorization: `${process.env.PAY_TOKEN}`,
                  },
                },
              );
            } else if (origin === 'auth'){
              const {pass} = item[1] as unknown as IUserData;
              const user = auth.currentUser;
              const credential = fbauth.EmailAuthProvider.credential(user.email, pass)
              await user.reauthenticateWithCredential(credential)
              await user.delete()
              await auth.signOut()
            } else if (origin === 'api') {
                const { data,headers,method,url } = item[1] as unknown as IApiData;
                await axios({ url, method, headers, data })
              }
          });
          setDataRollback([]);
          setStartRollbacks(false);
        }
      };
      run();
  };

  const createRollbackItem = (object: IZoopData|IFirebaseData|IApiData|ISheetsData|IUserData):void => {
      const {origin} = object
      if(origin === 'firebase'){
        const { collection, field, identifier,method} = object as IFirebaseData
        const newFirebaseItem:IFirebaseData = {origin,collection, field, identifier,method}
        addRollbackItem(newFirebaseItem)
      }
      if(origin === 'sheets'){
        const { id, rangeToSearch, rangeToUpdate, spreadsheetId, values  } = object as ISheetsData
        const newSheetsItem:ISheetsData = {origin, id, rangeToSearch, rangeToUpdate, spreadsheetId, values }
        addRollbackItem(newSheetsItem)
      }
      if(origin === 'zoop'){
        const { zoopId } = object as IZoopData
        const newZoopItem:IZoopData = {origin,zoopId}
        addRollbackItem(newZoopItem)
      }
      if(origin === 'auth'){
        const { pass} = object as IUserData
        const newAuthItem:IUserData = {origin,pass}
        addRollbackItem(newAuthItem)
      }
      if(origin === 'api'){
        const { data,headers,method,origin,url } = object as IApiData
        const newApiItem:IApiData = {data,headers,method,origin,url}
        addRollbackItem(newApiItem)
      }
  }

  const addRollbackItem = (rollbackData: IZoopData|IFirebaseData|IApiData|ISheetsData|IUserData) => {
    const array:Array<IZoopData|IFirebaseData|IApiData|ISheetsData|IUserData> = dataRollback
    array.push(rollbackData)
  };

  const startRollback = () => {
    setStartRollbacks(true);
    update()
  };
  const cleanRollback = () =>{
      setDataRollback([])
  }
  return {
    dataRollback,
    startRollback,
    createRollbackItem,
    cleanRollback
  };
}

export default useRollback;
