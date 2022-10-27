import React, { FC } from 'react';
import ReactToPrint from 'react-to-print';
import '../../src/app.css'
import QRCode from "react-qr-code";
import { Button, Row } from 'react-bootstrap';

interface IPulseiraComponent{
    codeNumber: string,
    fullName: string,
    cpf: string,
    function:string,
}

const PulseiraComponent: FC<IPulseiraComponent> = (props) => {
    var contentRef:any = null;
    
    return(
        <div>
            <Row >
                <div ref={el => contentRef = el} style={{
                    textAlign: 'center',
                    marginLeft: '50px',
                    width: '120px',
                    height:'330px',
                    display: 'flex',
                    justifyContent: 'end'
                }}>
                    <div>
                        <p style={{transform: 'rotate(90deg)', padding: '12px', paddingLeft: '10px'}}>
                            <b>Nome:<br/>
                            </b><span style={{fontSize: '10px'}}>{props.fullName?.split(" ")[0]}</span>
                        </p>

                        <p style={{transform: 'rotate(90deg)', padding: '12px', paddingLeft: '0px'}}>
                            <b>CPF/RG:<br/>
                            </b><span style={{fontSize: '10px'}}>{props.cpf}</span>
                        </p>

                        <p style={{transform: 'rotate(90deg)', padding: '10px', paddingLeft: '0px'}}>
                            <b>Função:<br/>
                            </b><span style={{fontSize: '10px'}}>{props.function}</span>
                        </p>
                    
                        <QRCode value={props.codeNumber.toString()} size={60} style={{margin: "20px"}}/>
                    </div>
                </div>
            </Row>
            <Row>
                <ReactToPrint
                    content={() => contentRef}
                    trigger={() => <Button variant="primary" style={{marginTop: '100px'}}>Imprimir</Button>}
                />
            </Row>
        </div>
    )  
}

export default PulseiraComponent;