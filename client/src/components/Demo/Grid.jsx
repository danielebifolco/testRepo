import ReactDataGrid from '@inovua/reactdatagrid-community';
import '@inovua/reactdatagrid-community/index.css'
import { useState, useEffect } from "react";
import useEth from "../../contexts/EthContext/useEth";
import Button from '@inovua/reactdatagrid-community/packages/Button';
import "./style.css";

function Grid() {

    const defaultColumns = ({ visible }) => {
        return [
            { name: 'status', header: 'Status', maxWidth: 100, defaultFlex: 1, visible: false },
            { name: 'id', header: 'ID', maxWidth: 100, defaultFlex: 1 },
            { name: 'name', header: 'Name', maxWidth: 200, defaultFlex: 1 },
            { name: 'quote', header: 'Quote', maxWidth: 200, defaultFlex: 1 },
            { name: 'expire', header: 'Expire', maxWidth: 200, defaultFlex: 1 },
            {
                name: 'proposal', header: 'Proposal', maxWidth: 200,minWidth: 150, defaultFlex: 1,
                render: ({ data }) => {
                    return <div style={{ display: 'inline-block' }}>
                        <Button onClick={() => { showProposalForm(data.id) }} disabled={!data.status}>New Proposal</Button>
                    </div>
                }, visible: !visible
            },
            {
                name: 'select', header: 'Select Winner', maxWidth: 200, minWidth: 150, defaultFlex: 1,
                render: ({ value, data }) => {

                    return <div style={{ display: 'inline-block' }}>
                        <Button onClick={() => {
                                    const now = new Date();
                                    const tempdate = data.expire.split('-');
                                    const date = new Date (tempdate[0],tempdate[1]-1,tempdate[2]);
                                    if(Number(date)<=Number(now)){
                                        winner(data.id)
                                    }else{
                                        alert("Can not close Tender before Expire Date")
                                    }
                                }
                            } 
                            disabled={data.status}>Winner</Button>
                    </div>

                }, visible
            },
            { name: 'winner', header: 'Winner', minWidth: 400, defaultFlex: 1 },
            
        ]
    };
    
    const { state: { contract, accounts, owner } } = useEth();
    
    const [dataSource, setDataSource] = useState([]);
    const [proposalQuote, setProposalQuote] = useState("");
    const [visible, setVisible] = useState(false);
    const [columns, setColumns] = useState(defaultColumns({ visible }));
    const [tenderName, setTenderName] = useState("");
    const [tenderQuote, setTenderQuote] = useState("");
    const [tenderExpire, setTenderExpire] = useState("");
    const [rowId, setRowId] = useState(0);
    
    //Quando uno degli elementi nella lista cambia viene richiamata la funzione
    useEffect(() => {
        setVisible(owner);
        setColumns(defaultColumns({ visible }));
        readTender();
    }, [owner, accounts, visible]);

    //invocare le funzioni messe a disposizione dai contratti
    const readTender = async () => {
        try{
            if (contract) {
                const tenders = await contract.methods.getTenders().call({ from: accounts[0] });
                let data = [];
                console.log(tenders)
                if (tenders) {
                    for (const tender of tenders) {
                        const tempTender = JSON.parse(tender.URI);
                        tempTender.status = tender.status;
                        tempTender.id = tender.id;
                        console.log(tenders)
                        if (!tender.status) {
                            tempTender.winner = tender.win;
                        } else {
                            tempTender.winner = "";
                        }
                        data.push(tempTender);
                    }
                }
                setDataSource(data);
            } 
        }catch(err){
            console.debug(err);
        }
    }

    const openNewTender = async () => {
        try{
            const temp = {
                name: tenderName,
                quote: tenderQuote,
                expire: tenderExpire
            }
            await contract.methods.openNewTender(JSON.stringify(temp)).send({ from: accounts[0] });
            readTender();
        }catch(err){
            console.debug(err);
        }
    }

    const newProposal = async (quote, id) => {
        try{
            console.log(await contract.methods.newProposal(quote, id).send({ from: accounts[0] }));
            showProposalForm();
        }catch(err){
            console.debug(err);
        }
    }

    const winner = async (id) => {
        try{
            await contract.methods.assignWinner(id).send({ from: accounts[0] });
            readTender();
        }catch(err){
            console.log(err);
        }
      
    };

    // funzioni di controllo sugli elementi della pagina
    const nameInputChange = e => {
        setTenderName(e.target.value);
    };
    const quoteInputChange = e => {
        setTenderQuote(e.target.value);
    };
    const expireInputChange = e => {
        setTenderExpire(e.target.value);
    };
    const proposalInputChange = e => {
        setProposalQuote(e.target.value);
    };

    const showTenderForm = () => {
        const tenderForm  = document.getElementById("newTenderForm")
        if (tenderForm.style.display  === "none"){
            tenderForm.style.display = "block";
        }else {
            tenderForm.style.display = "none";
        }
    }

    const showProposalForm = (id) => {
        const proposalForm  = document.getElementById("proposalForm")
        if (proposalForm.style.display  === "none"){
            setRowId(id)
            proposalForm.style.display = "block";
        }else {
            proposalForm.style.display = "none";
        }
    }
    const validateTenderForm = () => {
        const inName = document.getElementById("inputName");
        const inQuote = document.getElementById("inputQuote");
        const inDate  = document.getElementById("inputDate");
     
        let err = false;
        
        if ((inName.value === '') || (typeof inName.value !== 'string') || (inName.value.length < 8) ){
            err = true;
            inName.style.borderColor  = 'red';
        }

        if(inQuote.value === '' || inQuote.value < 0){
            err = true;
            inQuote.style.borderColor  = 'red';

        }
        const now = new Date();
        const tempdate = inDate.value.split('-');
        const data = new Date (tempdate[0],tempdate[1]-1,tempdate[2]);
        if(isNaN(Number(data))|| Number(data)<Number(now)){
            err = true;
            inDate.style.borderColor  = 'red';
        }
        if (!err){
            openNewTender();
        }
    }
    const validateProposalForm = () => {
        const inProposal = document.getElementById("inputProposal");

        if(proposalQuote > 0 && proposalQuote <= dataSource[rowId].quote){
            newProposal(proposalQuote, rowId)
        }else {
            inProposal.style.borderColor  = 'red';
        }
    }

    const prposalForm = (
        <div id = "proposalForm" className="show-form" style = {{display:"none"}}>
            <div className="input-container">
                <label>Quote </label>
                <input id = "inputProposal" type="number" required
                    value={proposalQuote}
                    onChange={proposalInputChange} />
            </div>
            <div className="button-container">
                <Button onClick={validateProposalForm }>
                    Send Proposal
                </Button>
            </div>
        </div>
    );
    
    const onRenderRow = (rowProps) => {
        if (rowProps.data.status === true) {
            rowProps.style.color = '#008f39'
        } else {
            rowProps.style.color = '#808080'
        }
    }

    const gridStyle = { minHeight: 550, minWidth: 1000 };
    
    return (

        <div >
            <div style={{justifyContent:"center"}}>
                {prposalForm}
            </div>
            <Button onClick={() => {
                readTender();
                setColumns(defaultColumns({ visible }));
            }
            }
                style={{ marginRight: 10, marginBottom:10 }}>
                Load async data
            </Button>
            {owner && <Button onClick={showTenderForm}
                style={{ marginRight: 10, marginBottom:10 }}>
                Add new Tender        
            </Button>}
            <div id = "newTenderForm" className="show-form" style = {{display:"none"}}>
                <div className='input-container'>
                    <label>Name </label>
                    <input
                        id= 'inputName'
                        placeholder='Name'
                        type="text"
                        value={tenderName}
                        onChange={nameInputChange}
                    />
                    <label>Quote </label>
                    <input
                    
                        id= 'inputQuote'
                        placeholder='Quote'
                        type="number"
                        value={tenderQuote}
                        onChange={quoteInputChange}
                    />
                    <label>Expire Date </label>
                    <input
                        id= 'inputDate'
                        placeholder='Expire'
                        type="date"
                        value={tenderExpire}
                        onChange={expireInputChange}
                        min = {new Date().toISOString().split("T")[0]}
                        
                    />
                </div>
                <div className='button-container'>
                <Button onClick={validateTenderForm}>
                    Create New Tender
                </Button>
                </div>
            </div>
            <div id="Grid-div">
                <ReactDataGrid
                    key={visible}
                    idProperty="id"
                    columns={columns}
                    dataSource={dataSource}
                    onRenderRow={onRenderRow}
                    style={gridStyle}
                />
            </div>
        </div>
    );
}

export default Grid;