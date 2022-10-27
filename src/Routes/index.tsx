import react, { FC, useContext } from 'react';

import SignRoutes from './SignRoutes';
import OtherRoutes from './OtherRoutes';
import AuthContext from '../Context/auth';

const Routes: React.FC = () => {
    const { signed } = useContext(AuthContext);

    return signed ? <OtherRoutes /> : <SignRoutes />;
};

export default Routes;