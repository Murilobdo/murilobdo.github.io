import react, { FC, useCallback, useContext, useState } from 'react';
import { Form } from 'react-bootstrap';
import { useFormik } from "formik";
import * as yup from "yup";

import AuthContext from '../../Context/auth'
import styles from './index.module.css';

interface ILogin { }

const Login: FC<ILogin> = () => {

    const context = useContext(AuthContext);
    const [loading, setLoading] = useState(false);


    //Form & Validation
    const schema = yup.object().shape({
        email: yup.string().email("Digite um email válido").required("Campo obrigatório"),
        password: yup.string().required("Campo obrigatório"),
    });

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        validationSchema: schema,
        onSubmit: async () => {
            setLoading(true);
            await context.Login(formik.values.email, formik.values.password);
            setLoading(false);
        },
    });

    const setInputValue = useCallback(
        (key:any, value:any) => 
            formik.setValues({...formik.values, [key]: value}),
        [formik]
    )

    return(
    <>
        <div className={styles.panel}>
            <Form className={styles.form} onSubmit={formik.handleSubmit}>
                <div className="Auth-form-content">
                <h3 className="Auth-form-title">Sign In</h3>
                <div className="form-group mt-3">
                    <label>Email</label>
                    <input
                        type="email"
                        id='email'
                        name='email'
                        className="form-control mt-1"
                        placeholder="Endereço de email"
                        onChange={(e) => setInputValue("email", e.target.value)}
                        value={formik.values.email}
                    />
                    <small>{formik.errors.email}</small>
                </div>
                <div className="form-group mt-3">
                    <label>Senha</label>
                    <input
                        id='password'
                        name='password'
                        type="password"
                        className="form-control mt-1"
                        placeholder="......."
                        onChange={(e) => setInputValue("password", e.target.value)}
                        value={formik.values.password}
                    />
                    <small>{formik.errors.password}</small>
                </div>
                <div className="d-grid gap-2 mt-3">
                    <button type="submit" className="btn btn-primary">
                        {loading ? 'Entrando...' : 'Entrar'}
                    </button>
                </div>
                </div>
            </Form>
        </div>
    </>)
}

export default Login;