import react, { FC, useContext, useEffect, useState } from 'react';
import CadastroUsuario from '../../component/CadastroUsuarioComponent';
import PulseiraComponent from '../../component/PulseiraComponent';
import TabelaUsuario from '../../component/TabelaUsuario';
import { IUser } from '../../Models/IUser';
import api from '../../Services/api';

import styles from './home.module.css';

interface IHome { }
interface IFilter {
  fullName: string,
  cpf: string
}

const Home: FC<IHome> = () => {

    const [reload, setReload] = useState(false);
    const [listUsers, setListUsers] = useState<IUser[]>();
    const [listFilterUsers, setListFilterUsers] = useState<IUser[]>();
    
    const reloadPage = () => setReload(true);
    
    useEffect(() => {
      const fetchData = async () => {
        const data = await api.post('user/find', {fullName: '', cpf: ''});
        return data;
      }
    
      fetchData().then((response:any) => {
              setListUsers(response.data.data);
              setListFilterUsers(response.data.data);
              setReload(false);
          }).catch(console.error);
    }, [reload]);
    
    return(
      <>
        <div id='panel' className={styles.panel}>
          <div>
            <div className='row m-0'>
              <div className="col-md-4 d-flex align-items-center">
                <CadastroUsuario reloadPage={reloadPage}/>
              </div>
              <div className="col-md-8 m-0">
                <TabelaUsuario users={listFilterUsers} reloadPage={reloadPage}/>
              </div>
            </div>
          </div>
        </div>

        
      </>
    )
}

export default Home;
