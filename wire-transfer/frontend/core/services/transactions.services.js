import axios from "../config/api_config/axios.config";
import toast from "react-hot-toast"
export const myTransactions = async (accountNumber) => {
  let request = axios.get(`accounts/${accountNumber}/transactions`);
  return request.then((response) => {
    if (response.status === 200) {
      return response && response;
    }
  });
};
export const getWalletAccounts = async (emailId) => {
  let request = axios.get(`user/${emailId}/accounts`);
  return request.then((response) => {
    if (response.status === 200) {
      return response && response;
    }
  });
};

export const getUserProfileById = async (Id) => {
  let request = axios.get(`search/${Id}/users`);
  return request.then((response) => {
    if (response.status === 200) {
      return response && response;
    }
  });
};
export const creditLedgerAccount = async (ledgerDetail) => {
 let request = axios.post(`/transactions/${ledgerDetail?.accountNumber}/credit`, ledgerDetail);  
  return request.then((response) => {
    if (response.status === 200) {
      return response && response;
    }
  });
}
export const debitLedgerAccount = async (ledgerDetail) => {
	let request = axios.post(`/transactions/${ledgerDetail?.accountNumber}/debit`, ledgerDetail);
  return request.then((response) => {
    if (response.status === 200) {
      return response && response;
    }
  });
}


export const fetchConversionRates = async (currencyFrom,currencyTo) => {
      const result = await fetch(//
        //8c627c48be6db29a67c2b7cf
        `https://v6.exchangerate-api.com/v6/ed66962687fdf4b5a9afb6c6/pair/${currencyFrom}/${currencyTo}`
      );
      //console.log(result);
      if (result.ok) {
        const rates = await result.json();
        return rates.conversion_rate;
        
      }
    };

export const sendMoneyOverseas = async (creditLedgerDetail,debitLedgerDetail) =>{
   // console.log(creditLedgerDetail)
   // console.log(debitLedgerDetail)
  try{
    const creditorAccount = await getWalletAccounts(creditLedgerDetail.receipientId)
    creditLedgerDetail.accountNumber = creditorAccount.data.data[0].accountNumber
    const debitorAccount = await getWalletAccounts(debitLedgerDetail.senderEmail)
    debitLedgerDetail.accountNumber = debitorAccount.data.data[0].accountNumber

   // console.log( debitLedgerDetail,creditLedgerDetail)
   const presignedSignatureCredit = await creditLedgerAccount(creditLedgerDetail)
   console.log(presignedSignatureCredit)
   const presignedSignatureDebit = await debitLedgerAccount(debitLedgerDetail)
   console.log(presignedSignatureDebit)
   if(presignedSignatureCredit.status==200 ){ //if credit was successful
     if(presignedSignatureDebit.status==200){ // if debit was successful
          return "OK"
      }else{
       
         //else reverse credit
           toast.error("Transaction could not complete. Dont worry we will reverse any transaction that has been debited or credited with out properly derived state.")
           return 'FAILED'
      }
      
   }else{
       toast.error("Transaction could not be completed. Please contact your bank manager next year!!!") 
        return 'FAILED'
    }
  }catch(error){
    // roll back transaction
    toast.error(error.message|| error)
    console.log(error)
     console.log("INOPERATIVE SWITCH OR ACCOUNT")
      return 'FAILED'
 }
}




export const reverseMoneyTransfered = async (creditLedgerDetail,debitLedgerDetail) => {
  try{
    const creditorAccount = await getWalletAccounts(creditLedgerDetail.receipientId)
    creditLedgerDetail.accountNumber = creditorAccount.data.data[0].accountNumber
    const debitorAccount = await getWalletAccounts(debitLedgerDetail.receipientId)
    debitLedgerDetail.accountNumber = debitorAccount.data.data[0].accountNumber
    await creditLedgerAccount(debitLedgerDetail)
    await debitLedgerAccount(creditLedgerDetail)
  
  }catch(error){
    console.log("INOPERATIVE SWITCH OR ACCOUNT")
  }
}




export const deriveForeignExchangeAccountBalance = async (FROM="USD",TO='USD',AMOUNT=1) =>{
    let result =[]
    
      const currency_one = FROM;
      const currency_two = TO;

      
      let request = await fetch(`https://api.exchangerate-api.com/v4/latest/${currency_one}`)
      
      if (!request.ok) {
           throw new Error(`HTTP error! status: ${response.status}`);
      }
     
      let data = await request.json()
      let rate = data.rates[currency_two];
      return  (AMOUNT * rate).toFixed(2)
  
  
  }

const userCannotProceedToPayment = async (myWalletDetails, fromCurrency,AmountToSend) =>{
    /*this is an expensive function */
    /*it should only run if user is permitted*/
    let disableTransaction = true;
    const loggedInUsersWallet = myWalletDetails;
    let accountBalance = loggedInUsersWallet.balance
    const allowedTradingCurrencies = ["USD","NGN",'EUR'];
    if(allowedTradingCurrencies.includes(toCurrency)){
        let exchangeAccountBalance = keyValuePairBalance[fromCurrency]
       if(exchangeAccountBalance > AmountToSend){
          disableTransaction = false;
          //you can transact
          const keyValuePairBalance = {
            "USD": await deriveForeignExchangeAccountBalance("USD","USD",accountBalance) ,
            "EUR": await deriveForeignExchangeAccountBalance("USD","EUR",accountBalance),
            "NGN": await deriveForeignExchangeAccountBalance("USD","NGN",accountBalance),
          }
          return disableTransaction
       }else{
        //you cant transact
         return disableTransaction
       }
    }else{
      //you cant transact
      return disableTransaction
    }
    //AI DECISION MAKER RETURNS VALUE
    return failing
  }
