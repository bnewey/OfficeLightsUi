import Head from 'next/head'
import Wrapper from '../Machine/Wrapper'
import Nav from '../Nav';
import StyledFooter from '../Footer'
import { Component } from 'react';

import Header from "../UI/Header";


 export default class Layout extends React.Component {
    constructor(props){
      super(props);
    }


   render(){
      const {children} = this.props;
      const title = "Lights Control";

      return (
        <Wrapper>
          <Head>
            <title>{title}</title>
            
          </Head>
          
          <main className='main-wrapper'>
            { children }
            <style jsx>{`
                margin: 0% 5% 2% 5%
            `}</style>
          </main>
      
          <StyledFooter />
          
        </Wrapper>
    );
  }
}

