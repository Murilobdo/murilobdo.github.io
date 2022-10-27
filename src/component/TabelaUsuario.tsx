import react , { FC, useState, useCallback } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { AiTwotoneDelete, AiFillPrinter, AiOutlineFileSearch, AiOutlineFileExcel } from 'react-icons/ai';
import * as XLSX from 'xlsx';
import { useFormik } from 'formik';
import * as yup from "yup";
import { Button, Col, Container, Form, Modal, Row } from 'react-bootstrap';
import { toast } from 'react-toastify';

import styles from '../Pages/Home/home.module.css';
import api from '../Services/api';
import { IUser } from '../Models/IUser';
import PulseiraComponent from './PulseiraComponent';
import axios, { AxiosRequestConfig } from 'axios';
import { formatMuiErrorMessage } from '@mui/utils';


interface ITabelaUsuario{
    users: IUser[] | undefined,
    reloadPage: Function 
}

const TabelaUsuario: FC<ITabelaUsuario> = (props) => {


    var rows = new Array();
    const [selectUser, setSelectUser] = useState<IUser>();
    const [filterUsers, setFilterUSers] = useState<IUser[] | undefined>(props.users);
    const [excelFile, setExcelFile] = useState(null);
    const [loading, setLoading] = useState(false);

    // submit
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    //Form de busca
    const schema = yup.object().shape({
        fullName: yup.string().required("Campo obrigatório"),
        cpf: yup.string().required("Campo obrigatório"),
    });
    
    const formik = useFormik({
        initialValues: {
            fullName: "", //"Murilo Bernardes de Oliveira",
            cpf: ""//"47380002860",
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

    if(filterUsers)
    {
        filterUsers.forEach(user => {
            rows.push({
                id: user.userId,
                userId: user.userId, 
                codeNumber: user.codeNumber,
                fullName: user.fullName,
                cpf: user.cpf,
                function: user.function,
                company: user.company,
            });
        });
    }

    
    const columns: GridColDef[] = [
        { field: 'fullName', headerName: 'Nome', width: 150 },
        { field: 'cpf', headerName: 'CPF', width: 150 },
        { field: 'function', headerName: 'Função', width: 150 },
        { field: 'company', headerName: 'Empresa', width: 150 },
        { 
            field: 'acoes',
            headerName: 'Ações',
            width: 150,
            renderCell: (params) => {
              return <div className='d-flex justify-content-around'>
                <span onClick={() => handleDelete(params.row)}><AiTwotoneDelete/></span>
                <span onClick={() => handlePrinter(params.row)}><AiFillPrinter/></span>
              </div>
            },   
        },
    ];

    const handleDelete = async (user: IUser) => {
        try {
            var response = await api.post("User/DeleteUser", {userId: user.userId});
            if(response.data)
                toast.success(response.data.message);
            else
                toast.warn(response.data.message);
            props.reloadPage();
        } catch (error) {
            toast.warn("Não foi possivel finalizar a ação")
        }
    }

    const handlePrinter = (user: IUser) => {
        setSelectUser(user);
        handleShow();
    }

    const handleFind = async () => {
        if(formik.values.cpf.length > 0 || formik.values.fullName.length > 0)
        {
            var response:any = await api.post("user/find", formik.values);
            if(response.data.isSuccess){
                setFilterUSers(response.data.data);
                toast.success(response.data.message);
            }else{
                toast.warn(response.data.errorList[0]);
            }
        }else{
            setFilterUSers(props.users);
        }
    }

    // submit function
    const handleSubmitExcel = async (e:any)=>{
        e.preventDefault();
        if(excelFile!==null){
            const workbook = XLSX.read(excelFile,{type:'buffer'});
            const worksheetName = workbook.SheetNames[0];
            const worksheet=workbook.Sheets[worksheetName];
            const excelData = XLSX.utils.sheet_to_json(worksheet);
            var array: IUser[] = [];
            excelData.forEach((element:any) => {
                const currentUser: IUser = {
                    userId: 0, 
                    codeNumber: element.numero,
                    fullName: element.nome,
                    cpf: element.cpf,
                    function: element.funcao,
                    company: element.empresa,
                    checkin: new Date(),
                    email: '',
                    role: '',
                    staff: '',
                    token: ''
                };
                array.push(currentUser)
            });
            const dados = {
                excelText: `${JSON.stringify(array)}`
            }
            try {
                var response:any = await api.post("user/ImportExcel", dados);
                if(response.data.isSuccess){
                    toast.success(response.data.message);
                    props.reloadPage();
                }else{
                    toast.error(response.data.message);
                }
            } catch (error:any) {
                toast.error(error.message);
            }
        }
    }

    const handleFile = (e: any) => {
        let selectedFile = e.target.files[0];
        if(selectedFile){
            let reader = new FileReader();
            reader.readAsArrayBuffer(selectedFile);
            reader.onload=(e:any)=>{
              setExcelFile(e.target.result);
            } 
        }
        else{
            setExcelFile(null);
        }
    }

    const handleRemoveAll = async () => {
        try {
            var response:any = await api.get("user/RemoveAll");
            if(response.data.isSuccess){
                toast.success(response.data.message);
                props.reloadPage();
            }else{
                toast.error(response.data.message);
            }
        } catch (error:any) {
            toast.error(error.message);
        }
    }


    return(
        <div id='panel-tabela'>
            <div>
                <div>
                    <h3 className={styles.textCenter}>Funcionários ja cadastrados no sistema</h3>
                </div>

                <Container>
                    <Row style={{padding: "0px 0px", width: "100%", marginBottom:"10px"}}>
                            <Col xs={12}>
                                <form className='form-group' autoComplete="off" style={{width: "100%", padding: "0px", border: "none"}}
                                    onSubmit={handleSubmitExcel}>
                                    <Row>
                                        <Col xs={7}>
                                            <input type='file' className='form-control' 
                                                onChange={handleFile} required></input>   
                                        </Col>
                                        <Col xs={5}>
                                            <button type='submit' className='btn btn-success mx-1'> 
                                                Importar Excel <AiOutlineFileExcel/>
                                            </button>
                                            <Button className='btn-danger' onClick={handleRemoveAll}>
                                                Excluir Tudo <span>X</span>
                                            </Button>
                                        </Col>
                                    </Row>
                                </form>
                            </Col>
                        </Row>
                    <Row style={{padding: "0px 0px", width: "100%"}}>
                        <Form style={{padding: "0px", border: "none"}}>
                            <Row>
                                <Col xs={5}>
                                    <Form.Control
                                        id='fullName'
                                        name='fullName'
                                        placeholder='Busca pelo nome'
                                        onChange={(e) => setInputValue("fullName", e.target.value)}
                                        value={formik.values.fullName}
                                        style={{marginRight: "5px"}}/> 
                                </Col>
                                <Col xs={5}>
                                    <Form.Control 
                                        id='cpf'
                                        name='cpf'
                                        placeholder='Busca pelo CPF'
                                        onChange={(e) => setInputValue("cpf", e.target.value)}
                                        style={{marginRight: "5px"}}
                                        value={formik.values.cpf}/>
                                </Col>
                                <Col xs={2}>
                                    <Button className='btn-primary' onClick={handleFind}>
                                        Buscar <AiOutlineFileSearch/>
                                    </Button>
                                </Col>
                            </Row>
                        </Form>
                    </Row>
                    
                </Container>

                <div style={{ height: 300, width: '100%', marginTop: "20px" }}>
                    <DataGrid rows={rows} columns={columns} />
                </div>
              
            </div>

            <div>
                {selectUser ? 
                (    
                    <Modal show={show} onHide={handleClose}>
                        <Modal.Body>
                        <PulseiraComponent
                            codeNumber={selectUser.codeNumber}
                            fullName={selectUser.fullName}
                            cpf={selectUser.cpf}
                            function={selectUser.function}/>
                        </Modal.Body>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                    </Modal>
                ): ''}
            </div>
        </div>
    )
}

export default TabelaUsuario;