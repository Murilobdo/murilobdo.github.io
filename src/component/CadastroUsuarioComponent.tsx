import { AxiosRequestConfig } from 'axios';
import react , { FC, useState, useCallback } from 'react';
import { Button, Form, Row } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import * as yup from "yup";

import styles from '../Pages/Home/home.module.css';
import api from '../Services/api';
import { AiOutlineUserAdd } from 'react-icons/ai';


interface ICadastroUsuario{
    reloadPage: Function 
}

const CadastroUsuario: FC<ICadastroUsuario> = (props) => {

    const [loading, setLoading] = useState(false);

    //Form & Validation
    const schema = yup.object().shape({
        codeNumber: yup.string().required("Campo obrigatório"),
        fullName: yup.string().required("Campo obrigatório"),
        cpf: yup.string().required("Campo obrigatório"),
        function: yup.string().required("Campo obrigatório"),
        email: yup.string().required("Campo obrigatório"),
        company: yup.string().required("Campo obrigatório"),
        staff: yup.string().required("Campo obrigatório"),
    });

    const formik = useFormik({
        initialValues: {
            codeNumber: "16516516219",
            fullName: "Murilo Bernardes de Oliveira",
            cpf: "47380002860",
            function: "Bar",
            email: "bar@teste.com",
            company: "Bar Company",
            staff: "Acesso Livre",
        },
        validationSchema: schema,
        onSubmit: async () => {
            setLoading(false);
            var config: AxiosRequestConfig<any> = {
                headers:{
                    'Authorization': `Bearer ${localStorage.getItem("@App:token")}`
                }
            };
            var response = await api.post('user/adduser', formik.values, config);
            if(response.data.data){
                toast.success(response.data.message);
                props.reloadPage();
            }else{
                toast.warn(response.data.message);
            }
            setLoading(true);
        },
    });

    const setInputValue = useCallback(
        (key:any, value:any) => 
            formik.setValues({...formik.values, [key]: value}),
        [formik]
    )

    return(
        <>
            <Form onSubmit={formik.handleSubmit} className={styles.panelCadastro}>
                <h3 className={styles.textCenter}>Cadastro de Funcionários</h3>
                <div className='row m-0'>
                    <Form.Group >
                        <Form.Label>Numero de Série</Form.Label>
                        <Form.Control
                            id='codeNumber'
                            name='codeNumber'
                            placeholder='Armazenado no QRCode'
                            onChange={(e) => setInputValue("codeNumber", e.target.value)}
                            value={formik.values.codeNumber}/>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Nome</Form.Label>
                        <Form.Control 
                            id='fullName'
                            name='fullName'
                            placeholder='Nome completo'
                            onChange={(e) => setInputValue("fullName", e.target.value)}
                            value={formik.values.fullName}/>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>CPF</Form.Label>
                        <Form.Control 
                            id='cpf'
                            name='cpf'
                            placeholder='999.999.999-99'
                            onChange={(e) => setInputValue("cpf", e.target.value)}
                            value={formik.values.cpf}/>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Função</Form.Label>
                        <Form.Control 
                            id='function'
                            name='function'
                            placeholder='Ex: Staff'
                            onChange={(e) => setInputValue("function", e.target.value)}
                            value={formik.values.function}/>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Empresa</Form.Label>
                        <Form.Control 
                            id='company'
                            name='company'
                            placeholder='Cotrole Company'
                            onChange={(e) => setInputValue("company", e.target.value)}
                            value={formik.values.company}/>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Staff</Form.Label>
                        <Form.Control 
                            id='staff'
                            name='staff'
                            placeholder='Ex: acesso livre'
                            onChange={(e) => setInputValue("staff", e.target.value)}
                            value={formik.values.staff}/>
                    </Form.Group>

                    <Button variant='primary' type='submit' className='mt-3'>
                        Cadastrar <AiOutlineUserAdd/>
                    </Button>
                </div>
            </Form>
        </>
    )
}

export default CadastroUsuario;