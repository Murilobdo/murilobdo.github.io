import react, { FC } from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Login from '../Pages/Login';


const SignRoutes: FC = () => {
    return( 
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />}></Route>
        </Routes>
      </BrowserRouter>
    );
};
   
export default SignRoutes;