import React, { createContext, useState } from 'react';
import { toast } from 'react-toastify';
import { json } from 'stream/consumers';

import { IUser } from '../Models/IUser';
import api from '../Services/api';

interface AuthContextData {
    signed: boolean;
    user: IUser | null,
    Login(email: string, password: string): Promise<void>;
}
const AuthContext = createContext<AuthContextData>({} as AuthContextData);

interface Props {
    children: React.ReactNode;
}

export const AuthProvider: React.FC<Props> = ({ children }) => {
    const [user, setUser] = useState<IUser | null>(null);

    const Login = async (email: string, password: string) => {
        const response = await api.post('account/login', {
            email: email,
            password: password,
        });
        
        if(!response.data.data){
            toast.warn(response.data.message);
        }else{
            setUser(response.data.data);
            api.defaults.headers.common['Authorization'] = `Bearer ${response.data.message}`;
            localStorage.setItem("@App:user", JSON.stringify(user));
            localStorage.setItem("@App:token", response.data.message);
            toast.success('Usuário encontrado !');
        }
    }

    return (
        <AuthContext.Provider value={{ signed: Boolean(user), Login, user }}>
          {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;