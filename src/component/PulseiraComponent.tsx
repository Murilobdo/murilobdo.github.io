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
            <Row>
                <div ref={el => contentRef = el} style={{
                    textAlign: 'center',
                    display: 'flex',
                    height: '300px'
                }}>
                    <div style={{marginRight: '20px', marginTop: '0px', fontSize: '20px'}}>
                        <p style={{transform: 'rotate(90deg)', padding: '12px', paddingLeft: '10px'}}>
                            <b>Nome:<br/>
                            </b><span style={{fontSize: '14px'}}>{props.fullName?.split(" ")[0]}</span>
                        </p>

                        <p style={{transform: 'rotate(90deg)', padding: '12px', paddingLeft: '10px'}}>
                            <b>CPF/RG:<br/>
                            </b><span style={{fontSize: '14px'}}>{props.cpf}</span>
                        </p>

                        <p style={{transform: 'rotate(90deg)', padding: '12px', paddingLeft: '10px'}}>
                            <b>Função:<br/>
                            </b><span style={{fontSize: '14px'}}>{props.function}</span>
                        </p>
                    
                        <QRCode value={props.codeNumber.toString()} size={60}/>
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