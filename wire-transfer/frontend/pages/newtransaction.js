import React, { ReactNode,ReactElement, useState, useEffect } from "react";
import { login, logOut, setPrevPath } from "../core/redux/actions/auth.action";

import Link from "next/link"
import Currency from 'react-currency-icons'
import AsyncSelect from 'react-select/async';
import axios      from 'axios'
import {
  IconButton,
  Avatar,
  Box,
  CloseButton,
  Flex,
  HStack,
  VStack,
  Icon,
  useColorModeValue,

  Drawer,
  DrawerContent,
  Text,
  useDisclosure,
  BoxProps,
  FlexProps,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Stack,
  Button,
   SimpleGrid,


Select,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Heading
  
} from '@chakra-ui/react';
import {
  FiHome,
  FiTrendingUp,
  FiCompass,
  FiStar,
  FiSettings,
  FiMenu,
  FiBell,
  FiChevronDown,
} from 'react-icons/fi';
import { IconType } from 'react-icons';
import { ReactText } from 'react';
import { FcLock } from 'react-icons/fc';
import * as  CurrencyIconSet from 'react-currency-icons'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSyncAlt,
  faDollarSign,
  faEuroSign,
} from "@fortawesome/free-solid-svg-icons";
/*apis*/
import { searchUser } from "../core/services/auth.services"
import currencies from "../core/services/currencylist.service.json";
import RequestLoader from "../core/views/components/RequestLoader"
import { useToast } from '@chakra-ui/react'

import PropTypes from "prop-types";
import { connect } from "react-redux";

import { useRouter } from 'next/router';

import { 
  sendMoneyOverseas, 
  getWalletAccounts,
  deriveForeignExchangeAccountBalance,
  userCannotProceedToPayment as FintechAIDecisionMakerBlockUserAction //check this out
} from "../core/services/transactions.services" 

import seoOptimization from "../core/helpers/utils/seoOptimizer";
import Layout from "../core/views/components/Layouts"
import { Loader, SomethingWentWrong } from "../core/views/components/Feedback"
const pageSEO = seoOptimization(
  "About",
  "This is the shit in town.We power the web globally at simba. Hire us now"
);
 const positions = [
    'top',
    'top-right',
    'top-left',
    'bottom',
    'bottom-right',
    'bottom-left',
  ]
//usage
// async function testAIDecision(){
//  console.log( await FintechAIDecisionMakerBlockUserAction({balance:1000},"EUR",40000)) //FALSE  
//  console.log( await FintechAIDecisionMakerBlockUserAction({ balance:1000},"NGN",400)) //TRUE

// }
// testAIDecision()

const LinkItems = [
  { name: 'dashboard', icon: FiHome },
  { name: 'New Transaction', icon: FiTrendingUp },
  { name: 'Account Settings', icon: FiCompass },
  { name: 'Logout', icon: FiStar },
  
];






const handleLogout = async () => {
    await logOut();
    setTimeout(() => {
      if(typeof window!==undefined){
         localStorage.clear()
         window.location.href="/login"

      }
    }, 2000);
  };

  const redirectTo = (url) =>{
    setTimeout(() => {
       if(typeof window!==undefined){
        window.location.href=url
      }
    }, 1000);
  }





const MobileNav = ({ onOpen, auth: {user  }, ...rest }) => {
const router = useRouter();
    let isLoggedIn = false;
  const [id, setId] = useState("")
  const [email, setEmail] = useState("")
  const [firstName, setFirstName ] = useState("")
  const [lastName, setLastName] = useState("")
  const [isAuthenticated,setIsAuthenticated] = useState(false)
  const [token,setToken] = useState("")

  useEffect(async()=>{
      if(typeof window!=="undefined"){
         
        if(window.localStorage && window.localStorage.getItem("user")){
          console.log(window.localStorage.getItem("user"))
          user = JSON.parse(window.localStorage.getItem("user"))
          setId(user.id)
          setEmail(user.email)
          setFirstName(user.firstName)
          setLastName(user.lastName)
          setIsAuthenticated(user.isAuthenticated)
          setToken(user.token)

          if (user.token && user.isAuthenticated) {
             isLoggedIn = true;
          }
        }else{
          await logOut()
          setTimeout(()=>{window.location.href="/login"},2000)
        }
      }
  },[user])


  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 4 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue('white', 'gray.900')}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
      justifyContent={{ base: 'space-between', md: 'flex-end' }}
      {...rest}>
      <IconButton
        display={{ base: 'flex', md: 'none' }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
        icon={<FiMenu />}
      />

      <Text
        display={{ base: 'flex', md: 'none' }}
        fontSize="2xl"
        fontFamily="monospace"
        fontWeight="bold">
        TRANSFERWIZ
      </Text>

      <HStack spacing={{ base: '0', md: '6' }}>
        <IconButton
          size="lg"
          variant="ghost"
          aria-label="open menu"
          icon={<FiBell />}
        />
        <Flex alignItems={'center'}>
          <Menu>
            <MenuButton
              py={2}
              transition="all 0.3s"
              _focus={{ boxShadow: 'none' }}>
              <HStack>
                <Avatar
                  size={'sm'}
                  src={
                    'https://avatars.githubusercontent.com/u/26296603?v=4'
                  }
                />
                <VStack
                  display={{ base: 'none', md: 'flex' }}
                  alignItems="flex-start"
                  spacing="1px"
                  ml="2">
                  <Text fontSize="md">{user?.firstName + " "+ user?.lastName }</Text>
                  <Text fontSize="xs" color="gray.600">
                   You are logged in
                  </Text>
                </VStack>
                <Box display={{ base: 'none', md: 'flex' }}>
                  <FiChevronDown />
                </Box>
              </HStack>
            </MenuButton>
             <MenuList
              bg={useColorModeValue('white', 'gray.900')}
              borderColor={useColorModeValue('gray.200', 'gray.700')}>
              <Link href="/dashboard"><MenuItem>My Transactions</MenuItem></Link>
               <Link href="/newtransaction"><MenuItem>New Transaction</MenuItem></Link>
              <MenuDivider />
            <MenuItem onClick={(e)=>{handleLogout(e)}}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </HStack>
    </Flex>
  );
};



MobileNav.propTypes = {
  auth: PropTypes.object.isRequired,
};



const mapStateToProps3 = (state) => ({
  auth: state.auth
});

const MobileNavigate = connect(mapStateToProps3, {
  
})(MobileNav);





const ReceipientProfiler  = ({selectedUser, auth: {  user , prevPath },logout }) =>{
  const [receipientWalletDetails,setReceipientWalletDetails] = useState({})
  useEffect(()=>{
    async function getAccontInfo(){
      if(selectedUser.email.length>0){


          const ReceipientUserWallet = await getWalletAccounts(selectedUser.email)
          setReceipientWalletDetails({...ReceipientUserWallet.data.data[0]})

        
      } 
    }
    getAccontInfo()
  },[])




  return(

       <Flex
       style={{display:selectedUser.email.length>0?"block":"none"}}
      minH={'500px'} 
      w="100%"
      bg={useColorModeValue('gray.50', 'gray.800')}>
      <Stack  w="100%" spacing={8} maxW={'lg'} >
        
        <Box

          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.700')}
          boxShadow={'lg'}
          p={8}>
          <Stack >

           <Flex justifyContent="space-between" bg="#f5f5f5" padding="10px">
             <Avatar
                  size={'sm'}
                  src={
                    'https://avatars.githubusercontent.com/u/26296603?v=4'
                  }
                /> 
            <h2> Receipient Wallet Information</h2>
          
          </Flex>

            <div>
     

      <div id="container" >
        <div id="content-box">
                 <Text>Confirmation Detail</Text>
              {/*<Text color="darkblue" fontSize="25px" p="10px">Account Number: {receipientWalletDetails?.accountNumber} </Text>
              <Text color="darkblue" fontSize="25px" p="10px">Wallet Type: {receipientWalletDetails?.type} </Text>
              */}
              <hr/>
              <Text fontSize="20px" p="10px">FullName:{ " "+  selectedUser.firstName+ " " +selectedUser.lastName}</Text>
              <Text fontSize="20px" p="10px">Email:{  " "+ selectedUser.email}</Text>      
              
               <Text fontSize="20px" p="10px">
               You are about to make a credit transaction to the receipient { " "+  selectedUser.firstName+ " " +selectedUser.lastName} .
               Please confirm the information details are correct
               </Text>      
           

           <Text>https://github.com/saladinjake/trasferwise-app <br/> POWERED BY SIMBA</Text>          
        </div>
      </div>
    </div>
            
            <Stack spacing={10}>
              
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  )
} 



ReceipientProfiler.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps4 = (state) => ({
  auth: state.auth
});

const ReceipientProfilerBatch = connect(mapStateToProps4, {})(ReceipientProfiler);


function NewTransfer({ auth: {  user , prevPath },logout }) {
  const toastedBread = useToast()

  const handleInputChange = (newValue) => {
    const inputValue = newValue.replace(/\W/g, '');
    // setState({ inputValue });
    return inputValue;
  };

  let isLoggedIn = false;
  
  const [id, setId] = useState("")
  const [email, setEmail] = useState("")
  const [firstName, setFirstName ] = useState("")
  const [lastName, setLastName] = useState("")
  const [isAuthenticated,setIsAuthenticated] = useState(false)
  const [token,setToken] = useState("")
  //receipient wallet
  const [walletDetails,setWalletDetails] = useState({})
  
  //logged in user bank wallet
  const [myWalletDetails,setMyWalletDetails] = useState({})

    const [animateLoader, setAnimateLoader] = useState(false)
    const [ifSomethingWentWrong,setIfSomethingWentWrong] = useState(false)

  useEffect(()=>{

    const checkUser = async () => {
      setAnimateLoader(true)
      if(typeof window!=="undefined"){
        //  console.log(user)
        if(window.localStorage && window.localStorage.getItem("user")){
         // console.log(window.localStorage.getItem("user"))
          user = JSON.parse(window.localStorage.getItem("user"))
          setId(user.id)
          setEmail(user.email)
          setFirstName(user.firstName)
          setLastName(user.lastName)
          setIsAuthenticated(user.isAuthenticated)
          setToken(user.token)
          
          const loggedInUserWallet = await getWalletAccounts(user.email)
          setMyWalletDetails({...loggedInUserWallet.data.data[0]})
          setAnimateLoader(false)
          console.log({...loggedInUserWallet.data.data[0]})
          if (user.token && user.isAuthenticated) {
             isLoggedIn = true;
          }
        }else{
          await logOut()
          setTimeout(()=>{window.location.href="/login"},2000)
        }
      }
      setAnimateLoader(false)
    };
    checkUser();
      
  },[])

  const [inputFrom, setInputFrom] = useState(0);
  const [inputTo, setInputTo] = useState(0);
  const [rate, setRate] = useState(0);
  const [currencyFrom, setCurrencyFrom] = useState("USD");
  const [currencyTo, setCurrencyTo] = useState("EUR");

  const [allUsers, setAllUsers] = useState([]);
  const [receipientInfo, setReceipientInfo] = useState({
    firstName:"",
    email:"",
    lastName:"",
    accountNumber:""
  })

  const handleChangeFrom = (event) => {
    const { value } = event.target;
    if(value<0){ value= value * -1}
     if(value!==null && (value <=0 || value >0 )){
       setInputFrom(value);
       setInputTo(value * rate);
    }else{
      //avoid division by zero or empty input so as not to disturb the api endpoint
      //with invalid data
      //dont waste api resouce they are expensive to be awaken
      if(value<0){ value= value * -1}
       //reset value
       setInputFrom(value);
       setInputTo(value * rate);

    }
  };

  const handleChangeTo = (event) => {
    
    const { value } = event.target;
    if(value<0){ value= value * -1}
    if(value!==null && (value >=0  )){
      setInputTo(value);
      setInputFrom(value / rate);
    }else{
      //avoid division by zero or empty input so as not to disturb the api endpoint
      //with invalid data
      //dont waste api resouce they are expensive to be awaken
        if(value<0){ value= value * -1}

       //reset value
      setInputTo(value);
      setInputFrom(value / rate);
    }
    
  };

  const handleSelectFrom = async (event) => {
    const { value } = event.target;
    setCurrencyFrom(value);
     await deriveForeignExchangeAccountBalance(value,currencyTo,inputFrom)
     .then(exchangeAmt =>{
        setInputTo(exchangeAmt)
        // setRate(inputFrom*exchangeAmt)
     })

  };

  const handleSelectTo = async (event) => {
    const { value } = event.target;
    setCurrencyTo(value);
    await deriveForeignExchangeAccountBalance(currencyFrom,value,inputFrom)
    .then(exchangeAmt => {setInputTo(exchangeAmt) ;   })

  };

  const handleSwap = () => {
    setCurrencyFrom(currencyTo);
    setCurrencyTo(currencyFrom);
  };




  //payload submit transaction payload and validation

  const transactionPayload = {
    name:'',
    sendingAmount:0.00,
    receivingAmount: 0.00, 
    rate:1,
    senderid: id,
    receipientId: null,
    sendingCurrency:currencyFrom,
    receivingCurrency:currencyTo,

  };

  const [submitData, setSubmitData] = useState(transactionPayload)
  const [isSubmitClick, setIsSubmitClicked] = useState(false)

  const getUserEmail = (searchName) =>{
    const firstName = searchName.split()[0]
    const foundUser = allUsers.find(user =>{
       const testData = user.firstname + " " + user.lastname
       if(
        testData.toLowerCase()===searchName.toLowerCase()
          
        ){
         return user.email
       }else{
        return ""
       }
    })
  }

  useEffect(()=>{
     
      const getWalletReceipient = async () => {
        try{
           if(receipientInfo.email.length>4){
            const walletAccount = await getWalletAccounts( receipientInfo.email)
            setWalletDetails({...walletAccount.data.data[0]})
    
           }
        }catch(err){
          console.log(err)
          setIfSomethingWentWrong(true)
        }     
     }
     getWalletReceipient()
   
  },[])

  const setUserProfile = () => {
    const userInputHtml = document.getElementById("wizards")
    const userInputCopy =  userInputHtml.value.toLowerCase();

    const foundUser = allUsers.find(  (user) =>{
       const testData = user.firstname + " " + user.lastname 
       if(testData.toLowerCase()===userInputCopy){
         setReceipientInfo(user)  
        return user
       }else{
        
        return false
       }
       return foundUser
    })
  }


  const handleSelectedUser = () => {
    const userInputHtml = document.getElementById("wizards")
    const userInputCopy =  userInputHtml.value.toLowerCase();

    const foundUser = allUsers.find(user =>{
       const testData = user.firstname + " " + user.lastname 
       if(testData.toLowerCase()===userInputCopy){

        return user.email
       }else{
        return ""
       }
    })
   // console.log(foundUser)
    if(!foundUser || foundUser.length<=0){
      userInputHtml.value =""
       toastedBread({positions,
        title: 'An error occurred.',
        status:"error",
        description: "User dont exist. please select a user from the dropdown",
        duration: 9000,
        isClosable: true,
      })
       return null
    }else{
      //set state of the field
      setReceipientInfo(foundUser)
       return foundUser
    }
  }
  

  useEffect(() => {

    const fetchConversionRates = async (FROM="USD",TO='USD',AMOUNT=1) => {
      const currency_one = FROM;
      const currency_two = TO;
      let request = await fetch(`https://api.exchangerate-api.com/v4/latest/${currency_one}`)
      if (!request.ok) {
           throw new Error(`HTTP error! status: ${request.status}`);
           setIfSomethingWentWrong(true)
      }
      let data = await request.json()
      let rate = data.rates[currency_two];
      if (rate) {
        setRate(rate);
        setSubmitData({
          ...submitData,
          rate:rate,
          //inputTo:inputFrom*rate,
      
        })
      }
    };
    fetchConversionRates(currencyFrom,currencyTo,inputFrom);
  }, [currencyFrom,currencyTo,inputFrom, inputTo]);


  useEffect(() => {
    const findUsers = async () => {
      try{
        const result = await searchUser()
      //console.log(result.data);
      //user should not send money  to him self
      // let exclusiveUsers =[...result.data.data];
      // exclusiveUsers = exclusiveUsers.filter(foundUser => {
      //   const fullName = foundUser.firstName + " " + foundUser.lastName
      //   return fullName != (user.firstName + " " + user.lastName)
      // })
      setAllUsers([...result.data.data]) 

      }catch(err){
        setIfSomethingWentWrong(true)
      }
      
      
    };
    findUsers();
  }, []);


  
  const handleSubmitTransactionExchange = async () =>{
    setIsSubmitClicked(true)
    //only disturb the api 
    //if user wallet account is sufficient to do
    //anyy transactions

    //this is a complex and heavy transaction that is done one time if data is right

    //usage
    // async function testAIDecision(){
    //  console.log( await FintechAIDecisionMakerBlockUserAction({balance:1000},"EUR",40000)) //FALSE  
    //  console.log( await FintechAIDecisionMakerBlockUserAction({ balance:1000},"NGN",400)) //TRUE

    // }
    // testAIDecision()
    //if and only if my account is sufficient
   try{

    const amountToSend = inputFrom
    const isNotSufficient = await FintechAIDecisionMakerBlockUserAction(myWalletDetails,currencyFrom,amountToSend)
    console.log(isNotSufficient)
    if(!isNotSufficient.disableTransaction){ // negation negation principle -x- =+
           const selectedUser = document.getElementById("wizards").value
          if(!selectedUser ){
            toastedBread({positions,
              title: 'An error occurred.',
              status:"error",
              description: "Receipient User not selected. ",
              duration: 9000,
              isClosable: true,
            })
            setIsSubmitClicked(false)
            return false
          }

         // const debitAccountBalanceEquivalence = isNotSufficient.resultingUserBalance[currencyFrom] 
         

         const debitAccountBalanceEquivalence = 
            isNotSufficient.resultingUserBalance["USD"] 
            // REMEMBER THE TRADE OFF..
            //WE HAVE ONE DOLLAR ACCOUNT NOT MULTIPLE ACCOUNT IN DIFF COUNTRIES
            //IF AM IN US, I JUST ONLY CARE ABOUT MY BALANCE IN US AND USE A CALCULATOR
            //IF I MUST SEND SANDRA WINNY SOME MONEY IN FRANCE 
            //SO SHE DONT BREAK UP WITH ME... 

           const creditLedgerPayload = {
              name: document.getElementById("wizards").value,
              //amount: inputFrom,
              //we are only concerened with base account which is in dollars
              //all other account rate can change 

              //the logic here is simple
              //let the user trade in what ever currency
              //we only keep track of our dollar and the rate in which the exchange was done
              //then save to db which is multiplied during transaction history view
              amount:  amountToSend,
              // FOR RECORD PURPOSE LETS SAVE THE EQUIVALENT BALANCE IN TO CURRENCY
              exchangeAmount: rate*amountToSend, //we keep record only in dollars
              rate:rate,
              sendingCurrency:currencyFrom,
              receivingCurrency:currencyTo,
              senderId: id,
              senderEmail:email,
              receipientId: handleSelectedUser().email,
            };
            const debitLedgerPayload = {
              name: firstName + " " + lastName,
               amount:  amountToSend,
              exchangeAmount:rate*amountToSend,
               rate:rate,
              sendingCurrency:currencyFrom,
              receivingCurrency:currencyTo, 
              senderId: handleSelectedUser().id,
              senderEmail:email,
              receipientId: email,
              
            };
            console.log(creditLedgerPayload)
            console.log(debitLedgerPayload)
            Object.keys(creditLedgerPayload).forEach(key =>{
               if(creditLedgerPayload[key]==""  || creditLedgerPayload[key]==undefined || creditLedgerPayload[key]==null ){
                   toastedBread({positions,
                    title: 'An error occurred.',
                    status:"error",
                    description: "Transaction could not be processed. Ensure all fields are filled",
                    duration: 9000,
                    isClosable: true,
                  })
                   setIsSubmitClicked(false)
                  return false
               }

               if(key==="exchangeAmount" || key==="amount"){
                 if(debitLedgerPayload[key]<=0){
                     toastedBread({positions,
                    title: 'An error occurred.',
                    status:"error",
                    description: "Enter an amount value greater than zero",
                    duration: 9000,
                    isClosable: true,
                  })
                      setIsSubmitClicked(false)
                  return false
                 }
               }
            })

            Object.keys(debitLedgerPayload).forEach(key =>{
               if(debitLedgerPayload[key]==""  || debitLedgerPayload[key]==undefined || debitLedgerPayload[key]==null ){
                   toastedBread({positions,
                    title: 'An error occurred.',
                    status:"error",
                    description: "Transaction could not be processed. Ensure all fields are filled",
                    duration: 9000,
                    isClosable: true,
                  })
                    setIsSubmitClicked(false)
                  return false
               }

               if(key==="exchangeAmount" || key==="amount"){
                 if(debitLedgerPayload[key]<=0){
                     toastedBread({positions,
                    title: 'An error occurred.',
                    status:"error",
                    description: "Enter an amount value greater than zero",
                    duration: 9000,
                    isClosable: true,
                  })
                      setIsSubmitClicked(false)
                  return false
                 }
               }
            })

          try{

            const successful = await sendMoneyOverseas(creditLedgerPayload,debitLedgerPayload)
          if(successful=="OK"){
            // toast yippikayeh M**F**KA!!!
             setIsSubmitClicked(false)
            toastedBread({positions,
                  title: 'SUCCESSFUL',
                  status:"success",
                  description: "Transaction was successful",
                  duration: 9000,
                  isClosable: true,
            })
          }

          }catch(error){

              toastedBread({positions,
                  title: 'Error',
                  status:"error",
                  description: error.message|| error.toString(),
                  duration: 9000,
                  isClosable: true,
            })  
            setIfSomethingWentWrong(true)  
          }

          setIsSubmitClicked(false)
        }else{
          toastedBread({positions,
                  title: 'Error',
                  status:"error",
                  description: `Your account balance is not sufficient for this transaction.To fund your wallet please wait for version 2`,
                  duration: 20000,
                  isClosable: true,
            })
        }
        
       }catch(err){
         setIfSomethingWentWrong(true)
       }
    setIsSubmitClicked(false)     
  }



  return (


<Layout SEO={pageSEO}>
 <>
 
    <Stack
        direction={{ base: 'column', md: 'row' }}
        justifyContent="space-between"   >
      
      
 <>
{!animateLoader ?  (
    <Flex
      minH={'500px'} 
      w="100%"
      bg={useColorModeValue('gray.50', 'gray.800')}>
      <Stack  w="100%" spacing={8} maxW={'lg'} >
        
        <Box

          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.700')}
          boxShadow={'lg'}
          p={8}>
          <Stack >

           <Flex justifyContent="space-between" bg="#f5f5f5" padding="10px">
              
            <h2>TRANSFERWIZ MONEY EXCHANGE </h2>
         
          </Flex>



      <Box p="20px">
       <Stack
                direction={{ base: 'column', sm: 'row' }}
                align={'start'}
                justify={'space-between'}>
                <p>
                 1 {currencyFrom} = {rate} {currencyTo}
               </p>
                <Button id="swap-icon">
              <Text  
                onClick={handleSwap}
              >Swap</Text>
            </Button> 
              </Stack>   
     </Box>

            <FormControl id="email">
              <FormLabel>Receipient Name:</FormLabel>
                
                <div>
                  
                  <Input onChange={setUserProfile}  type="text" id="wizards" name="wizards" list="users-list" />
                  <datalist id="users-list">

                     { 
                       allUsers.length > 0 ?  allUsers.map(user => {
                          return (
                           <option>{user.firstname + " "+ user.lastname }</option>
                            )
                       })
                       : (<RequestLoader/>)
                     }


                   
                  </datalist>
                </div>
            </FormControl>



            <div>
     

      <div id="container">
        <div id="content-box">
        
       
<div className="calc-col-left">
          <FormLabel>From Currency</FormLabel>
            <Select onChange={handleSelectFrom} value={currencyFrom}>
              {Object.keys(currencies).map((currency, index) => (
                <option value={currency} key={index}>
                  {currency} - {currencies[currency].name}
                </option>
              ))}
            </Select>
            </div>
<div className="calc-col-right">
          <FormControl id="email" >
              <FormLabel>From Amount</FormLabel>
            <Input
              id="amountFrom"
              type="number"
              value={inputFrom}
              onChange={handleChangeFrom}
            />

            </FormControl>
      </div>



<div className="calc-col-left">
<FormLabel>To Currency</FormLabel>
            <Select onChange={handleSelectTo} value={currencyTo}>
              {Object.keys(currencies).map((currency, index) => {
                return (
                  <option value={currency} key={index}>
                    {currency} - {currencies[currency].name}
                  </option>
                );
              })}
            </Select>

</div>

<div className="calc-col-right">
 <FormControl id="email" className="calc-col-left">
              <FormLabel>To Amount</FormLabel>
            <Input
              id="amountTo"
              type="number"
              value={inputTo}
              onChange={handleChangeTo}
            />
           </FormControl>
</div>
           

          
        </div>
      </div>
    </div>
            
            <Stack spacing={10}>
              
              <Button
                bg={'blue.400'}
                color={'white'}
                _hover={{
                  bg: 'blue.500',
                }}
                disabled={isSubmitClick ? true : false}
                onClick={(e)=>{
                  e.preventDefault()
                  handleSubmitTransactionExchange(e)
                }}
                >
               Quick Transfer
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
): ifSomethingWentWrong? (<SomethingWentWrong  />): (<Loader/>)}
</>

{!animateLoader ? (
    <ReceipientProfilerBatch selectedUser={{
      email:receipientInfo?.email,
      firstName:receipientInfo?.firstname,
      lastName:receipientInfo?.lastname,
      walletDetails:walletDetails
    }} />) :(
     <Loader/>
    )}

    </Stack>


 </>



    </Layout>
  );
}


NewTransfer.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth
});

const FTransaction = connect(mapStateToProps, {})(NewTransfer);
 
 const Dashboard = ({
  auth: {isAuthenticated, token, user , prevPath },
  children,
}) =>{
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
    <Box minH="100vh" bg={useColorModeValue('gray.100', 'gray.900')}>
      <SidebarNavigationContent
        onClose={() => onClose}
        display={{ base: 'none', md: 'block' }}
      />
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full">
        <DrawerContent>
          <SidebarNavigationContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <MobileNavigate onOpen={onOpen} />
      <Box   ml={{ base: 0, md: 60 }} p="4">
        {children}
      <Stack bg="#fff" height={"550px"}  p="4" boxShadow="lg" m="4" borderRadius="sm">
         <FTransaction/>
         </Stack>
      </Box>
    </Box>
      </>
  );
}



Dashboard.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps2 = (state) => ({
  auth: state.auth
});

const FTransactionDashboard = connect(mapStateToProps2, {})(Dashboard);




const SidebarNavigationContent = ({ onClose, ...rest }) => {
  return (
    <Box
      transition="2s ease"
      bg={useColorModeValue('white', 'gray.900')}
      borderRight="1px"
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w={{ base: 'full', md: 60 }}
      pos="fixed"
      h="full"
      {...rest}>
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
          TRANSFERWIZ
        </Text>
        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      </Flex>
      <Link href="/dashboard"><NavItem icon={FiHome} >Dashboard</NavItem></Link>
      <Link href="/newtransaction"><NavItem icon={FiTrendingUp} >New Transaction</NavItem></Link>      
      <NavItem icon={FiStar} onClick={(e)=>{handleLogout(e)}}>Logout</NavItem>
    
    </Box>
  );
};

const NavItem = ({ icon, children, ...rest }) => {
  return (
    <Link href="#" style={{ textDecoration: 'none' }} _focus={{ boxShadow: 'none' }}>
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bg: 'cyan.400',
          color: 'white',
        }}
        {...rest}>
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            _groupHover={{
              color: 'white',
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </Link>
  );
};








export default FTransactionDashboard 