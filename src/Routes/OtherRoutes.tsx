import react, { FC } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Home from '../Pages/Home';

const OtherRoutes: FC = () => {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />}></Route>
        </Routes>
      </BrowserRouter>
    );
};
   
export default OtherRoutes;