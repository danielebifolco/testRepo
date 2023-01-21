import ReactDataGrid from '@inovua/reactdatagrid-community';
import '@inovua/reactdatagrid-community/index.css'
import { useState, useEffect, useCallback, ReactDOM } from "react";
import useEth from "../../contexts/EthContext/useEth";
import Button from '@inovua/reactdatagrid-community/packages/Button';
import "./style.css"

function Grid(){
    const [dataSource, setDataSource] = useState([]);
    //const [columns] = useState(defaultColumns);
    const [proposalQuote,setProposalQuote] = useState(0);
 
    const defaultColumns = [
        { name: 'id', header: 'ID', maxWidth: 50, defaultFlex: 1 },
        { name: 'name', header: 'Name', maxWidth: 200, defaultFlex: 1 },
        { name: 'quote', header: 'Quote', maxWidth: 200, defaultFlex: 1 },
        { name: 'expire', header: 'Expire', maxWidth: 200, defaultFlex: 1 },
        { name: 'proposal', header: 'Proposal', maxWidth: 1000, defaultFlex: 1,
            render: ({ data }) =>{
                return  <div style={{ display: 'inline-block' }}>
                            <Button onClick={ () => {showForm(data.id)}}>New Proposal</Button>
                        </div>
            }
        },
        { name: 'winner', header: 'Proposal', maxWidth: 1000, defaultFlex: 1,
            render: ({ data }) =>{
                return  <div style={{ display: 'inline-block' }}>
                            <Button onClick={ () => {showForm(data.id)}}>New Proposal</Button>
                        </div>
            },
            def
        }
        
      ];

    const{state : {contract, accounts, owner}} = useEth();
    const [inputValue, setInputValue] = useState("");
    const [tenderName, setTenderName] = useState("");
    const [tenderQuote, setTenderQuote] = useState("");
    const [tenderExpire, setTenderExpire] = useState("");
    let indexTender;
    const [show, setShow] = useState(false);
    const [rowId, setRowId] = useState(0);
    
    const showForm = (id) => {
        console.log("RowID: ", id)
        setRowId(id);
        setShow(true);
    }
    const hideForm = () => {
        setShow(false);
    }
    
    const readTender =  async () => {
        console.debug("Contract", contract);
        if(contract){
        const tenders = await contract.methods.getTenders().call({from: accounts[0]});
        console.log("tenders",tenders);
        let data=[];
        if(tenders){
            console.log(tenders);
            for (const tender of tenders){
                if(tender.status){
                    const tempTender = JSON.parse(tender.URI);
                    tempTender.id = tender.id;
                    data.push(tempTender);
                }
                console.log("data: ",data);
            }
        }
        setDataSource(data);
        }
    }
    
    /*useEffect(() => {
        const tryReadTender = () => {
            try {
                readTender();
            } catch (err) {
                console.error(err);
            }
            };
            tryReadTender();
    }, [contract]);*/

    const openNewTender = async () => { 
        console.log(contract);
        const temp = {
            name: tenderName,
            quote: tenderQuote,
            expire: tenderExpire
        }
        indexTender = await contract.methods.openNewTender(JSON.stringify(temp)).send({ from: accounts[0]});
    }
    const newProposal = async (quote,id) => {
        await contract.methods.Proposal(quote,id, accounts[0]).send({ from: accounts[0]});
        hideForm();
    }

    const winner = async () => {
        const winne = await contract.methods.assignWinner(0).call({ from: accounts[0]});
        console.log(winne);
    };
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
    const gridStyle = { minHeight: 550, minWidth:1000};
   
    const renderForm = (
        <div className="form">
            <div className="input-container">
              <label>Quote </label>
              <input type="number" required 
                    value = {proposalQuote}
                    onChange = {proposalInputChange} />
            </div>
            <div className="button-container">
              <button onClick={()=>newProposal(proposalQuote, rowId)}>
                Send Proposal
                </button>
            </div>
        </div>
     );
    
    return (
        
        <div >
            <div>{show && renderForm}</div>
            
            <Button onClick={() => readTender()} style={{marginRight: 10}}>
                Load async data
            </Button>
            <div className= "input_field">
                <input 
                    type = "text" 
                    value = {tenderName}
                    onChange = {nameInputChange}
                />
                <input 
                    type = "number" 
                    value = {tenderQuote}
                    onChange = {quoteInputChange}
                />
                <input 
                    type = "date" 
                    value = {tenderExpire}
                    onChange = {expireInputChange}
               />
                <button onClick={openNewTender}>
                    Create New Tender
                </button>
            </div>
            <div id="Grid-div">
                <ReactDataGrid 
                    idProperty="id"
                    columns={defaultColumns}
                    dataSource={dataSource}
                    style={gridStyle}
                />
            </div>

        </div>
        );
}

export default Grid;