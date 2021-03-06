import "../core/assets/styles/globals.css"
import "../core/assets/styles/main.css"
import React from "react"
import { ChakraProvider } from "@chakra-ui/react";
import { Provider as Provisioner }  from "react-redux";
import QReduxStore from "../core/redux/store";
import { LoadingProgressProvider } from '../core/views/components/Loading'
import NextNprogress from 'nextjs-progressbar';
import Layouts from "../core/views/components/Layouts"
import ToastNotification from "../core/helpers/utils/ToastNotification"
export default function App({ Component, pageProps }) {
    return (

   <>
    <NextNprogress
          color="linear-gradient(90deg, rgba(0,61,89, 0.6) 33%, rgba(67,178,99,1) 67%);"
          startPosition={0.3}
          stopDelayMs={200}
          height={3}
          showOnShallow={true}
        />
     {/*REDUX STATE ENHANCER*/}
    <Provisioner store={QReduxStore}>
        <ChakraProvider>
          <LoadingProgressProvider>
          <ToastNotification/>
          <Layouts>

                  <Component {...pageProps} />
            </Layouts>
          </LoadingProgressProvider>
        </ChakraProvider>
    </Provisioner>
  </>
    
    )
  }




