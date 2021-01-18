import React from 'react'
import FormInput from '@bit/vitorbarbosa19.ziro.form-input'
import InputText from '@bit/vitorbarbosa19.ziro.input-text'
import InputPercentage from '@bit/vitorbarbosa19.ziro.input-percentage'
import InputMoney from '@bit/vitorbarbosa19.ziro.input-money'
import Dropdown from '@bit/vitorbarbosa19.ziro.dropdown'
import capitalize from '@ziro/capitalize'
import maskInput from '@ziro/mask-input'
import banksList from '../utils/banks'
import SingleImageUpload from '../SingleImageUpload/index'

const cardForm = ({
  installment,
  setInstallment,
  installments,
  discount,
  setDiscount,
  paymentType,
  setPaymentType,
  bank,
  bankName,
  setBankName,
  storeownerName,
  setStoreownerName,
  storeowners,
  setStoreowner,
  supplierName,
  setSupplierName,
  suppliers,
  setSupplier,
  banks,
  setBank,
  accountNumber,
  setAccountNumber,
  agency,
  setAgency,
  beneficiary,
  setBeneficiary,
  beneficiaryDocument,
  setBeneficiaryDocument,
  needUpdateBankAccount,
  setNeedUpdateBankAccount,
  isLoadingFunction,
  totalAmount,
  setTotalAmount,
  setRomaneio,
  filename,
  setFilename,
  setUid,
  note,
  setNote,
  suppliersTrends,
  paymentTypeReceivable,
  setPaymentTypeReceivable,
  pixKey,
  setPixKey
}) => {
  const fields = [
    <FormInput name="totalAmount" label="Valor do romaneio sem desconto" input={<InputMoney value={totalAmount} setValue={setTotalAmount} />} />,
    <FormInput
      name="romaneio"
      label="Foto do Romaneio"
      input={<SingleImageUpload setFile={setRomaneio} filename={filename || ''} setFilename={setFilename} indexOfFile={0} />}
    />,
    <FormInput name="installment" label="Parcelas" input={<InputText value={4} inputMode="numeric" readyOnly disabled />} />,
    <FormInput
      name="discount"
      label="Desconto à vista"
      input={
        <InputText
          value={discount ? `% ${discount}` : ''}
          onChange={({ target: { value } }) => {
            const newPrctg = value.replace(/\s/g, '').replace('%', '').replace(',', '.')
            setDiscount(newPrctg)
          }}
          placeholder="% 0.00"
          inputMode="numeric"
        />
      }
    />,
    <FormInput
      name="storeowner"
      label="Lojista"
      input={
        <Dropdown
          value={storeownerName}
          onChange={({ target: { value } }) => {
            if (value !== '') {
              setStoreownerName(value)
              const searched = storeowners.find(storeowner => storeowner.razao === value)
              if (searched) {
                setStoreowner(searched)
              } else setStoreowner({})
            } else {
              setStoreownerName('')
              setStoreowner({})
            }
          }}
          onChangeKeyboard={element => {
            if (element && element.value !== '') {
              setStoreownerName(element.value)
              const searched = storeowners.find(storeowner => storeowner.razao === element.value)
              if (searched) {
                setStoreowner(searched)
              } else setStoreowner({})
            } else {
              setStoreownerName('')
              setStoreowner({})
            }
          }}
          list={storeowners.map((storeowner, index) => (storeowner.duplicate ? `${storeowner.razao} - ${index}` : storeowner.razao)).sort()}
          placeholder="Nome do Lojista"
        />
      }
    />,
    <FormInput
      name="fabricante"
      label="Fabricante"
      input={
        <Dropdown
          value={supplierName.split(' - ')[0]}
          onChange={({ target: { value } }) => {
            if (value !== '') {
              const count = suppliers
                .map((supplier, index) => `${supplier.fabricante} - ${supplier.banco}`)
                .sort()
                .filter(function (str) {
                  return str.includes(supplierName)
                }).length
              if (count === 0) {
                setBank('')
                setBeneficiary('')
                setBeneficiaryDocument('')
                setBankName('')
                setAccountNumber('')
                setAgency('')
              }
              console.log('count', count)
              setSupplierName(value.split(' - ')[0])
            } else {
              setSupplierName('')
            }
          }}
          onChangeKeyboard={element => {
            if (element && element.value !== '') {
              setSupplierName(element.value.split(' - ')[0])
            } else {
              setSupplierName('')
            }
          }}
          list={suppliersTrends.map((supplier, index) => (supplier.duplicate ? `${supplier.razao} - ${index}` : supplier.razao)).sort()}
          placeholder="Nome do Fabricante"
        />
      }
    />,
    <FormInput
      name="paymentType"
      label="Tipo de Pagamento"
      input={
        <Dropdown
          disabled={isLoadingFunction}
          value={paymentType}
          readOnly
          onChange={({ target: { value } }) => setPaymentType(value)}
          onChangeKeyboard={element => (element ? setPaymentType(element.value) : null)}
          list={['Transferência', 'Cheque']}
          placeholder="Transferência ou Cheque"
        />
      }
    />,
    paymentType === 'Transferência' ? (
      <FormInput
        name="paymentType"
        label="Tipo de Recebimento do Fabricante"
        input={
          <Dropdown
            value={paymentTypeReceivable}
            readOnly
            onChange={({ target: { value } }) => setPaymentTypeReceivable(value)}
            onChangeKeyboard={element => (element ? setPaymentTypeReceivable(element.value) : null)}
            list={['TED', 'PIX']}
            placeholder="TED ou PIX"
            disabled={isLoadingFunction}
          />
        }
      />
    ) : (
      <FormInput name="" label="" input={<></>} />
    ),
    paymentType === 'Transferência' ? (
    <FormInput
      name="supplier"
      label="Fabricantes dos Dados Bancários"
      input={
        <Dropdown
          value={supplierName}
          onChange={({ target: { value } }) => {
            if (value !== '') {
              setSupplierName(value)
              const searched = suppliers.find(supplier => supplier.fabricante === value.split(' -')[0])
              console.log('searched', searched)
              console.log('searched banks', banks)

              setBank('')
              setBeneficiary('')
              setBeneficiaryDocument('')
              setBankName('')
              setAccountNumber('')
              setAgency('')

              if (searched) {
                setUid(searched.uid)
                setSupplier(searched)
                const searchedBank = banks.find(bank => bank.fabricante === value.split(' - ')[0] && bank.banco === value.split(' - ')[1])
                if(paymentTypeReceivable === 'PIX') setPixKey(value.split(' - ')[1])
                if (searchedBank) {
                  setBank(searchedBank)
                  setBeneficiary(searchedBank.razao)
                  const mask = /^\d{3}.?\d{3}.?\d{3}-?\d{2}$/.test(searchedBank.cnpj) ? '###.###.###-##' : '##.###.###/####-##'
                  setBeneficiaryDocument(maskInput(searchedBank.cnpj, mask, true))
                  setBankName(searchedBank.banco)
                  setAccountNumber(searchedBank.conta)
                  setAgency(searchedBank.agencia)
                  setNeedUpdateBankAccount(false)
                } else {
                  setNeedUpdateBankAccount(true)
                }
              } else {
                setSupplier({})
                setBank({})
              }
            } else {
              setSupplierName('')
              setPixKey('')
              setSupplier({})
              setBank({})
              setBeneficiary('')
              setBeneficiaryDocument('')
              setBankName('')
              setAccountNumber('')
              setAgency('')
              setNeedUpdateBankAccount(false)
            }
          }}
          onChangeKeyboard={element => {
            console.log('entrou 2')
            if (element && element.value !== '') {
              setSupplierName(element.value)
              const searched = suppliers.find(supplier => supplier.fabricante === element.value.split(' -')[0])
              if(paymentTypeReceivable === 'PIX') setPixKey(element.value.split(' - ')[1])
              if (searched) {
                setUid(searched.uid)
                setSupplier(searched)
                const searchedBank = banks.find(bank => bank.fabricante === element.value.split(' -')[0])
                if (searchedBank) {
                  setBank(searchedBank)
                  setBeneficiary(searchedBank.razao)
                  const mask = /^\d{3}.?\d{3}.?\d{3}-?\d{2}$/.test(searchedBank.cnpj) ? '###.###.###-##' : '##.###.###/####-##'
                  setBeneficiaryDocument(maskInput(searchedBank.cnpj, mask, true))
                  setBankName(searchedBank.banco)
                  setAccountNumber(searchedBank.conta)
                  setAgency(searchedBank.agencia)
                }
              } else {
                setSupplier({})
                setBank({})
                setPixKey('')
              }
            } else {
              setSupplierName('')
              setSupplier({})
              setBank({})
            }
          }}
          disabled={isLoadingFunction}
          readOnly
          list={suppliers
            .map((supplier, index) => `${supplier.fabricante} - ${supplier.banco}`)
            .sort()
            .filter(function (str) {
              return str.includes(supplierName)
            })}
          placeholder="Selecione a conta ou deixe em branco!"
        />
      }
    />
    ) : (
      <FormInput name="" label="" input={<></>} />
    ),
    paymentTypeReceivable === 'PIX' ? (
      <FormInput
        name="pix"
        label="Chave PIX"
        input={<InputText value={pixKey} onChange={({ target: { value } }) => setPixKey(capitalize(value))} placeholder="Chave do PIX"
        disabled={!!supplierName.split(' - ')[1]}  />}
      />
    ) : (
      <FormInput name="" label="" input={<></>} />
    ),
    paymentTypeReceivable === 'TED' ? (
      <FormInput
        name="beneficiary"
        label="Beneficiário"
        input={
          <InputText
            value={beneficiary}
            onChange={({ target: { value } }) => (bank.razao ? () => null : setBeneficiary(capitalize(value)))}
            placeholder="Nome do beneficiário"
            disabled={!!bank.razao}
          />
        }
      />
    ) : (
      <FormInput name="" label="" input={<></>} />
    ),
    paymentTypeReceivable === 'TED' ? (
      <FormInput
        name="beneficiaryDocument"
        label="Documento"
        input={
          <InputText
            value={beneficiaryDocument}
            onChange={({ target: { value } }) => {
              if (bank.cnpj) () => null
              else {
                const mask = value.length <= 14 ? '###.###.###-##' : '##.###.###/####-##'
                setBeneficiaryDocument(maskInput(value, mask, true))
              }
            }}
            placeholder="CPF ou CNPJ"
            inputMode="numeric"
            disabled={!!bank.cnpj}
          />
        }
      />
    ) : (
      <FormInput name="" label="" input={<></>} />
    ),
    paymentTypeReceivable === 'TED' ? (
      <FormInput
        name="bankName"
        label="Banco"
        input={
          <Dropdown
            value={bankName}
            onChange={({ target: { value } }) => (bank.banco ? () => null : setBankName(value))}
            onChangeKeyboard={element => (bank.banco ? () => null : element.value ? setBankName(element.value) : null)}
            submitting={!!bank.banco}
            list={banksList.map(bank => bank.split(' - ')[1])}
            placeholder="Ex.: Banco do Brasil"
          />
        }
      />
    ) : (
      <FormInput name="" label="" input={<></>} />
    ),
    paymentTypeReceivable === 'TED' ? (
      <FormInput
        name="agency"
        label="Número da Agência"
        input={
          <InputText
            value={agency}
            onChange={({ target: { value } }) => (bank.agencia ? () => null : setAgency(value))}
            placeholder="Ex.: 1463-8"
            inputMode="numeric"
            disabled={!!bank.agencia}
          />
        }
      />
    ) : (
      <FormInput name="" label="" input={<></>} />
    ),
    paymentTypeReceivable === 'TED' ? (
      <FormInput
        name="accountNumber"
        label="Número da Conta"
        input={
          <InputText
            value={accountNumber}
            onChange={({ target: { value } }) => (bank.conta ? () => null : setAccountNumber(value))}
            placeholder="Ex.: 14637-8"
            inputMode="numeric"
            disabled={!!bank.conta}
          />
        }
      />
    ) : (
      <FormInput name="" label="" input={<></>} />
    ),
  ]
  return fields
}

const pixForm = ({
  installment,
  setInstallment,
  installments,
  discount,
  setDiscount,
  paymentType,
  setPaymentType,
  bank,
  bankName,
  setBankName,
  accountNumber,
  setAccountNumber,
  agency,
  setAgency,
  beneficiary,
  setBeneficiary,
  beneficiaryDocument,
  setBeneficiaryDocument,
  totalAmount,
  setTotalAmount,
  note,
  setNote,
  setUid,
}) => {
  const fields = [
    <FormInput name="totalAmount" label="Valor recebido" input={<InputMoney value={totalAmount} setValue={setTotalAmount} />} />,
    <FormInput
      name="installment"
      label="Parcelas"
      input={
        <Dropdown
          value={4}
          onChange={({ target: { value } }) => setInstallment(value)}
          onChangeKeyboard={element => (element ? setInstallment(element.value) : null)}
          list={installments}
          placeholder="Quantidade de parcelas"
          readonly
        />
      }
    />,
    <FormInput
      name="discount"
      label="Desconto à vista"
      input={
        <InputText
          value={discount ? `% ${discount}` : ''}
          onChange={({ target: { value } }) => {
            const newPrctg = value.replace(/\s/g, '').replace('%', '').replace(',', '.')
            setDiscount(newPrctg)
          }}
          placeholder="% 0.00"
          inputMode="numeric"
        />
      }
    />,
    <FormInput
      name="paymentType"
      label="Tipo de Pagamento"
      input={
        <Dropdown
          value={paymentType}
          readOnly
          onChange={({ target: { value } }) => setPaymentType(value)}
          onChangeKeyboard={element => (element ? setPaymentType(element.value) : null)}
          list={['TED', 'Cheque']}
          placeholder="TED ou Cheque"
        />
      }
    />,
    paymentType === 'TED' ? (
      <FormInput
        name="beneficiary"
        label="Beneficiário"
        input={
          <InputText
            value={beneficiary}
            onChange={({ target: { value } }) => (bank.razao ? () => null : setBeneficiary(capitalize(value)))}
            placeholder="Nome do beneficiário"
            disabled={!!bank.razao}
          />
        }
      />
    ) : (
      <FormInput name="" label="" input={<></>} />
    ),
    paymentType === 'TED' ? (
      <FormInput
        name="beneficiaryDocument"
        label="Documento"
        input={
          <InputText
            value={beneficiaryDocument}
            onChange={({ target: { value } }) => {
              if (bank.cnpj) () => null
              else {
                const mask = value.length <= 14 ? '###.###.###-##' : '##.###.###/####-##'
                setBeneficiaryDocument(maskInput(value, mask, true))
              }
            }}
            placeholder="CPF ou CNPJ"
            inputMode="numeric"
            disabled={!!bank.cnpj}
          />
        }
      />
    ) : (
      <FormInput name="" label="" input={<></>} />
    ),
    paymentType === 'TED' ? (
      <FormInput
        name="bankName"
        label="Banco"
        input={
          <Dropdown
            value={bankName}
            onChange={({ target: { value } }) => (bank.banco ? () => null : setBankName(value))}
            onChangeKeyboard={element => (bank.banco ? () => null : element.value ? setBankName(element.value) : null)}
            submitting={!!bank.banco}
            list={banksList.map(bank => bank.split(' - ')[1])}
            placeholder="Ex.: Banco do Brasil"
          />
        }
      />
    ) : (
      <FormInput name="" label="" input={<></>} />
    ),
    paymentType === 'TED' ? (
      <FormInput
        name="agency"
        label="Número da Agência"
        input={
          <InputText
            value={agency}
            onChange={({ target: { value } }) => (bank.agencia ? () => null : setAgency(value))}
            placeholder="Ex.: 1463-8"
            inputMode="numeric"
            disabled={!!bank.agencia}
          />
        }
      />
    ) : (
      <FormInput name="" label="" input={<></>} />
    ),
    paymentType === 'TED' ? (
      <FormInput
        name="accountNumber"
        label="Número da Conta"
        input={
          <InputText
            value={accountNumber}
            onChange={({ target: { value } }) => (bank.conta ? () => null : setAccountNumber(value))}
            placeholder="Ex.: 14637-8"
            inputMode="numeric"
            disabled={!!bank.conta}
          />
        }
      />
    ) : (
      <FormInput name="" label="" input={<></>} />
    ),
  ]
  return fields
}

const tedForm = ({
  paymentType,
  setPaymentType,
  storeownerName,
  setStoreownerName,
  storeowners,
  setStoreowner,
  supplierName,
  setSupplierName,
  suppliers,
  setSupplier,
  banks,
  setBank,
  bank,
  bankName,
  setBankName,
  accountNumber,
  setAccountNumber,
  agency,
  setAgency,
  beneficiary,
  setBeneficiary,
  beneficiaryDocument,
  setBeneficiaryDocument,
  totalAmount,
  setTotalAmount,
  note,
  setNote,
  setRomaneio,
  filename,
  setFilename,
  paymentTypeReceivable,
  setPaymentTypeReceivable,
  pixKey,
  setPixKey,
  needUpdateBankAccount,
  setNeedUpdateBankAccount,
  isLoadingFunction,
  suppliersTrends,
  setSuppliersTrends,
  setUid,
}) => {
  // console.log('isLoadingFunction', isLoadingFunction)
  const fields = [
    <FormInput name="totalAmount" label="Valor da transferência recebida" input={<InputMoney value={totalAmount} setValue={setTotalAmount} />} />,
    <FormInput
      name="romaneio"
      label="Foto do Romaneio"
      input={<SingleImageUpload setFile={setRomaneio} filename={filename || ''} setFilename={setFilename} indexOfFile={0} />}
    />,
    <FormInput
      name="note"
      label="Observação"
      input={<InputText value={note} onChange={({ target: { value } }) => setNote(value)} placeholder="Observações sobre o link" />}
      />,
    <FormInput
      name="storeowner"
      label="Lojista"
      input={
        <Dropdown
          value={storeownerName}
          onChange={({ target: { value } }) => {
            if (value !== '') {
              setStoreownerName(value)
              const searched = storeowners.find(storeowner => storeowner.razao === value)
              if (searched) {
                setStoreowner(searched)
              } else setStoreowner({})
            } else {
              setStoreownerName('')
              setStoreowner({})
            }
          }}
          onChangeKeyboard={element => {
            if (element && element.value !== '') {
              setStoreownerName(element.value)
              const searched = storeowners.find(storeowner => storeowner.razao === element.value)
              if (searched) {
                setStoreowner(searched)
              } else setStoreowner({})
            } else {
              setStoreownerName('')
              setStoreowner({})
            }
          }}
          list={storeowners.map((storeowner, index) => (storeowner.duplicate ? `${storeowner.razao} - ${index}` : storeowner.razao)).sort()}
          placeholder="Nome do Lojista"
        />
      }
    />,
    <FormInput
      name="fabricante"
      label="Fabricante"
      input={
        <Dropdown
          value={supplierName.split(' - ')[0]}
          onChange={({ target: { value } }) => {
            if (value !== '') {
              const count = suppliers
                .map((supplier, index) => `${supplier.fabricante} - ${supplier.banco}`)
                .sort()
                .filter(function (str) {
                  return str.includes(supplierName)
                }).length
              if (count === 0) {
                setBank('')
                setBeneficiary('')
                setBeneficiaryDocument('')
                setBankName('')
                setAccountNumber('')
                setAgency('')
              }
              console.log('count', count)
              setSupplierName(value.split(' - ')[0])
            } else {
              setSupplierName('')
            }
          }}
          onChangeKeyboard={element => {
            if (element && element.value !== '') {
              setSupplierName(element.value.split(' - ')[0])
            } else {
              setSupplierName('')
            }
          }}
          list={suppliersTrends.map((supplier, index) => (supplier.duplicate ? `${supplier.razao} - ${index}` : supplier.razao)).sort()}
          placeholder="Nome do Fabricante"
        />
      }
    />,
    <FormInput
      name="paymentType"
      label="Tipo de Pagamento"
      input={
        <Dropdown
          value={paymentType}
          disabled={isLoadingFunction}
          readOnly
          onChange={({ target: { value } }) => {
            setPaymentTypeReceivable('')
            setPaymentType(value)
          }}
          onChangeKeyboard={element => {
            setPaymentTypeReceivable('')(element ? setPaymentType(element.value) : null)
          }}
          list={['Transferência', 'Cheque']}
          placeholder="Transferência ou Cheque"
        />
      }
    />,
    paymentType === 'Transferência' ? (
      <FormInput
        name="paymentType"
        label="Tipo de Recebimento do Fabricante"
        input={
          <Dropdown
            value={paymentTypeReceivable}
            readOnly
            onChange={({ target: { value } }) => setPaymentTypeReceivable(value)}
            onChangeKeyboard={element => (element ? setPaymentTypeReceivable(element.value) : null)}
            list={['TED', 'PIX']}
            placeholder="TED ou PIX"
            disabled={isLoadingFunction}
          />
        }
      />
    ) : (
      <FormInput name="" label="" input={<></>} />
    ),
    paymentType === 'Transferência' ? (<FormInput
      name="supplier"
      label="Fabricantes dos Dados Bancários"
      input={
        <Dropdown
          value={supplierName}
          onChange={({ target: { value } }) => {
            if (value !== '') {
              setSupplierName(value)
              const searched = suppliers.find(supplier => supplier.fabricante === value.split(' -')[0])
              console.log('searched', searched)
              console.log('searched banks', banks)

              setBank('')
              setBeneficiary('')
              setBeneficiaryDocument('')
              setBankName('')
              setAccountNumber('')
              setAgency('')

              if (searched) {
                setUid(searched.uid)
                setSupplier(searched)
                const searchedBank = banks.find(bank => bank.fabricante === value.split(' - ')[0] && bank.banco === value.split(' - ')[1])
                if (searchedBank) {
                  setBank(searchedBank)
                  setBeneficiary(searchedBank.razao)
                  const mask = /^\d{3}.?\d{3}.?\d{3}-?\d{2}$/.test(searchedBank.cnpj) ? '###.###.###-##' : '##.###.###/####-##'
                  setBeneficiaryDocument(maskInput(searchedBank.cnpj, mask, true))
                  setBankName(searchedBank.banco)
                  setAccountNumber(searchedBank.conta)
                  setAgency(searchedBank.agencia)
                  setNeedUpdateBankAccount(false)
                } else {
                  setNeedUpdateBankAccount(true)
                }
              } else {
                setSupplier({})
                setBank({})
              }
            } else {
              setSupplierName('')
              setSupplier({})
              setBank({})
              setBeneficiary('')
              setBeneficiaryDocument('')
              setBankName('')
              setAccountNumber('')
              setAgency('')
              setNeedUpdateBankAccount(false)
            }
          }}
          onChangeKeyboard={element => {
            console.log('entrou 2')
            if (element && element.value !== '') {
              setSupplierName(element.value)
              const searched = suppliers.find(supplier => supplier.fabricante === element.value.split(' -')[0])
              if (searched) {
                setUid(searched.uid)
                setSupplier(searched)
                const searchedBank = banks.find(bank => bank.fabricante === element.value.split(' -')[0])
                if (searchedBank) {
                  setBank(searchedBank)
                  setBeneficiary(searchedBank.razao)
                  const mask = /^\d{3}.?\d{3}.?\d{3}-?\d{2}$/.test(searchedBank.cnpj) ? '###.###.###-##' : '##.###.###/####-##'
                  setBeneficiaryDocument(maskInput(searchedBank.cnpj, mask, true))
                  setBankName(searchedBank.banco)
                  setAccountNumber(searchedBank.conta)
                  setAgency(searchedBank.agencia)
                }
              } else {
                setSupplier({})
                setBank({})
              }
            } else {
              setSupplierName('')
              setSupplier({})
              setBank({})
            }
          }}
          disabled={isLoadingFunction}
          readOnly
          list={suppliers
            .map((supplier, index) => `${supplier.fabricante} - ${supplier.banco}`)
            .sort()
            .filter(function (str) {
              return str.includes(supplierName)
            })}
          placeholder="Selecione a conta ou deixe em branco!"
        />
      }
    />
    ) : (
      <FormInput name="" label="" input={<></>} />
    ),
    paymentTypeReceivable === 'PIX' ? (
      <FormInput
        name="pix"
        label="Chave PIX"
        input={<InputText value={pixKey} onChange={({ target: { value } }) => setPixKey(capitalize(value))} placeholder="Chave do PIX"
        disabled={!!supplierName.split(' - ')[1]} />}
      />
    ) : (
      <FormInput name="" label="" input={<></>} />
    ),
    !isLoadingFunction && paymentTypeReceivable === 'TED' ? (
        <FormInput
          name="beneficiary"
          label="Beneficiário"
          input={
            <InputText
              value={beneficiary}
              onChange={({ target: { value } }) => (bank.razao ? () => null : setBeneficiary(capitalize(value)))}
              placeholder="Nome do beneficiário"
              disabled={!!bank.razao}
            />
          }
        />
      ) : (
        <FormInput name="" label="" input={<></>} />
      ),
      !isLoadingFunction && paymentTypeReceivable === 'TED' ? (
        <FormInput
          name="beneficiaryDocument"
          label="Documento"
          input={
            <InputText
              value={beneficiaryDocument}
              onChange={({ target: { value } }) => {
                if (bank.cnpj) () => null
                else {
                  const mask = value.length <= 14 ? '###.###.###-##' : '##.###.###/####-##'
                  setBeneficiaryDocument(maskInput(value, mask, true))
                }
              }}
              placeholder="CPF ou CNPJ"
              inputMode="numeric"
              disabled={!!bank.cnpj}
            />
          }
        />
      ) : (
        <FormInput name="" label="" input={<></>} />
      ),
      !isLoadingFunction && paymentTypeReceivable === 'TED' ? (
        <FormInput
          name="bankName"
          label="Banco"
          input={
            <Dropdown
              value={bankName}
              onChange={({ target: { value } }) => (bank.banco ? () => null : setBankName(value))}
              onChangeKeyboard={element => (bank.banco ? () => null : element.value ? setBankName(element.value) : null)}
              submitting={!!bank.banco}
              list={banksList.map(bank => bank.split(' - ')[1])}
              placeholder="Ex.: Banco do Brasil"
            />
          }
        />
      ) : (
        <FormInput name="" label="" input={<></>} />
      ),
      !isLoadingFunction && paymentTypeReceivable === 'TED' ? (
        <FormInput
          name="agency"
          label="Número da Agência"
          input={
            <InputText
              value={agency}
              onChange={({ target: { value } }) => (bank.agencia ? () => null : setAgency(value))}
              placeholder="Ex.: 1463-8"
              inputMode="numeric"
              disabled={!!bank.agencia}
            />
          }
        />
      ) : (
        <FormInput name="" label="" input={<></>} />
      ),
      !isLoadingFunction && paymentTypeReceivable === 'TED' ? (
        <FormInput
          name="accountNumber"
          label="Número da Conta"
          input={
            <InputText
              value={accountNumber}
              onChange={({ target: { value } }) => (bank.conta ? () => null : setAccountNumber(value))}
              placeholder="Ex.: 14637-8"
              inputMode="numeric"
              disabled={!!bank.conta}
            />
          }
        />
      ) : (
        <FormInput name="" label="" input={<></>} />
      ),
  ]
  return fields
}

const matchForm = state => {
  const { type } = state
  if (type === '') return [<FormInput name="" label="" input={<></>} />]
  if (type === 'Cartão de Crédito') return cardForm(state)
  if (type === 'PIX') return pixForm(state)
  if (type === 'Transferência') return tedForm(state)
}

export default matchForm
