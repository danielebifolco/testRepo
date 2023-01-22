import ReactDataGrid from '@inovua/reactdatagrid-community';
import '@inovua/reactdatagrid-community/index.css'
import { useState, useEffect, useCallback } from "react";
import useEth from "../../contexts/EthContext/useEth";
import Button from '@inovua/reactdatagrid-community/packages/Button';
import 'react-notifications/lib/notifications.css';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import "./style.css";

function Grid(){
     
    const defaultColumns = ({visible}) =>{
        return [
        { name:'status', header: 'Status', maxWidth: 100, defaultFlex: 1,visible:false},
        { name:'winner', header: 'winn', maxWidth: 100, defaultFlex: 1,visible:false},
        { name: 'id', header: 'ID', maxWidth: 100, defaultFlex: 1 },
        { name: 'name', header: 'Name', maxWidth: 200, defaultFlex: 1 },
        { name: 'quote', header: 'Quote', maxWidth: 200, defaultFlex: 1 },
        { name: 'expire', header: 'Expire', maxWidth: 200, defaultFlex: 1},
        { name: 'proposal', header: 'Proposal', maxWidth: 200, defaultFlex: 1, 
            render: ({ data }) =>{
                return  <div style={{ display: 'inline-block' }}>
                            {data.status && <Button onClick={ () => {showForm(data.id)}}>New Proposal</Button>}
                        </div>
            }, visible : !visible
        },
        { name: 'Selectwinner', header: 'Select Winner', maxWidth: 1000, defaultFlex: 1,
            render: ({ data }) =>{
               
                return  <div style={{ display: 'inline-block' }}>
                                {data.status ? <Button onClick={ async () => {
                                                        const win = await winner(data.id);
                                                        console.log("Winner", win);
                                                        NotificationManager.success('The winner is:' + win, 'Success');
                                }}>Winner</Button>: data.winner}
                            </div>
                
            },visible
        }
        
      ]};
    const [dataSource, setDataSource] = useState([]);
    const [proposalQuote,setProposalQuote] = useState(0);

    const [visible, setVisible] = useState(false);
    const [columns, setColumns] = useState(defaultColumns({ visible }));


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
                const tempTender = JSON.parse(tender.URI);
                tempTender.status = tender.status;
                tempTender.id = tender.id;
                data.push(tempTender);
                console.log("data: ",data);
            }
        }
            console.log("owner:",owner);
            console.log("visib: ", visible);
        setDataSource(data);
        }
    }

    
    useEffect(() => {
        setVisible(owner);
        setColumns(defaultColumns({ visible }));
        setDataSource([]);
        
       //this.forceUpdate();
    }, [owner, accounts]);


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
        await contract.methods.Proposal(quote,id).send({ from: accounts[0]});
        hideForm();
    }

    const winner = async (id) => {
        let data2;
        console.log("id: ", id);
        const winne = await contract.methods.assignWinner(id).send({ from: accounts[0]});
        const addressWinner= contract.methods.ownerOf(id).call({from: accounts[0]});
        console.log("Winnne1: ", addressWinner);
        data2=dataSource;
        data2[id].winner=addressWinner;
        console.log("data2: ",data2);
        setDataSource(data2);
        //readTender();
        return addressWinner;
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
              <button onClick={()=>{newProposal(proposalQuote, rowId)}}>
                Send Proposal
                </button>
            </div>
        </div>
     );
    
    return (
        
        <div >
            <div>
                {show && renderForm}
            </div>
            <Button onClick={() =>  {
                            readTender();
                            setColumns(defaultColumns({ visible }));
}
                        } 
                style={{marginRight: 10}}>
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
                    key={visible}
                    idProperty="id"
                    columns={columns}
                    dataSource={dataSource}
                    style={gridStyle}
                />
            </div>
            <NotificationContainer/>

        </div>
        );
}

export default Grid;