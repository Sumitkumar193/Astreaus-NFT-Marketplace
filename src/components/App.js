import React, { Component } from "react";  //Import class components from "React"
import Web3 from "web3";    //Import web3
import detectEthereumProvider from "@metamask/detect-provider"; //detects ethereum provider (wallets ie metamask etc)
import ERC721NFT from '../abis/ERC721NFT.json';
import {MDBCard, MDBCardBody, MDBCardImage, MDBCardText, MDBCardTitle, MDBBtn} from 'mdb-react-ui-kit';
import FormData from 'form-data';
import axios from 'axios';
import './App.css';


class App extends Component {

    //Call functions here
    async componentDidMount() {
        await this.loadWeb3();
        await this.loadBlockchainData();
    }

    //Logins
    async loadWeb3(){
        if (detectEthereumProvider) { //check if Metamask is installed
            console.log('Ethereum provider is detected!')
        } else {
            console.log('Ethereum provider cannot be found!')
        }
    }

    async loadBlockchainData() {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts'});  //grab account address
        this.setState({account:accounts[0]})

        const networkId = await window.ethereum.networkVersion;   //grab network/chain ID

        const networkData = ERC721NFT.networks[networkId]

        if(networkData){
            const abi = ERC721NFT.abi;
            const address = networkData.address;
            const web3 = new Web3(window.ethereum);               //!important    Initialize web3.js
            await window.ethereum.request({ method: 'eth_requestAccounts' });            //!important
            const Contract = web3.eth.Contract(abi, address);
            const totalSupply = await Contract.methods.totalSupply().call()
            this.setState({Contract: Contract})

            //Load NFTs into array
            for(let i=1;i<=totalSupply;i++){
                const NFT = await Contract.methods.getString(i).call()
                const ownerOf = await Contract.methods.ownerOf(i).call()
                //Push NFT data into this.state.json array
                const NFTs = await Contract.methods.getString(i).call();
                this.fetchJson('https://gateway.pinata.cloud/ipfs/'+NFTs);
                //Set push NFT data into asxnft and ownedby state
                this.setState({ASXNFT:[...this.state.ASXNFT, NFT]})    // ... => previous state data
                this.setState({ownedBy:[...this.state.ownedBy, ownerOf]}) 
            }
        }else{
            window.alert("Smart contract is not deployed!")
            console.log('Network does not match according to contract')
        }
    }

    async transfer(nTokenId, value) {
        //Load contracts -> find owner and buyer -> check a!=b -> call transfer
        const tokenId = nTokenId+1;
        const Contract = this.state.Contract;
        const from_address = await Contract.methods.ownerOf(tokenId).call();
        const LFA = from_address.toLowerCase(); //Lower Case _from address
        const to_address = this.state.account;
        const TFA = to_address.toLowerCase();   //Lower Case _to address
        const price = value * 1000000000000000000;
        const hexPrice = price.toString(16);
        if(LFA !== TFA){
            const tx = {
                'from': this.state.account,
                'to': from_address,
                'value': hexPrice
            }

            const txHash = await window.ethereum.request({
                method: 'eth_sendTransaction',
                params: [tx],
              }); 
            if(txHash){
                await Contract.methods.transferFrom(from_address,to_address,tokenId).send({from: this.state.account});   //call method 'transferFrom' to make transfer
            }
            this.refreshPage();
        }else{
            window.alert('Transaction cannot be completed!')
            this.refreshPage();
        }
    }   

    refreshPage() {
        window.location.reload(true);
    }
    minting = (ASX) => {
        this.state.Contract.methods.mint(ASX).send({from: this.state.account})
        .once('receipt', (receipt) => {
            this.setState({ASXNFT:[...this.state.ASXNFT, ASX]})
        })
    }

    handleChange(event){
        this.setState({
          // Computed property names
          // keys of the objects are computed dynamically
          [event.target.name] : event.target.value
        })
    }
    
    async handleSubmit(event){
        const { title, price, description, ipfsHash} = this.state;
        const JSONBody = {
            "name": title,
            "description": description,
            "image": 'ipfs://'+ipfsHash,
            "price": price,
            "attributes": []
        }

            const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
            const response = await axios.post(
                url,
                JSONBody,
                {
                  headers: {
                    'pinata_api_key': `${process.env.REACT_APP_API_KEY.replace(/`/g, "")}`,
                    'pinata_secret_api_key': `${process.env.REACT_APP_API_SECRET.replace(/`/g, "")}`
                  }
                }
            )
            
            if(response.data.IpfsHash){
                this.setState({jsonHash: response.data.IpfsHash});
                this.minting(this.state.jsonHash);
            }else{
                const delUrl = 'https://api.pinata.cloud/pinning/unpin/'+ipfsHash;
                    return axios.delete(
                        delUrl,
                        {
                        headers : { 
                            'pinata_api_key': `${process.env.REACT_APP_API_KEY.replace(/`/g, "")}`,
                            'pinata_secret_api_key': `${process.env.REACT_APP_API_SECRET.replace(/`/g, "")}`
                        }
                    });
            }
    }

    async fetchJson(url) {
        const response = await axios.get(url);
        this.setState({json: [...this.state.json, response]})
    }

    async changeHandler(event){
        //Save file in this.state.file
        await this.setState({ file: event.target.files[0], loaded: 0 })
        const formData = new FormData()
        formData.append('file', this.state.file)
        

            const url =  `https://api.pinata.cloud/pinning/pinFileToIPFS`
            const response = await axios.post(
            url,
            formData,
                {
                    maxContentLength: "Infinity",
                    headers: {
                        "Content-Type": `multipart/form-data;boundary=${formData._boundary}`, 
                        'pinata_api_key': `${process.env.REACT_APP_API_KEY.replace(/`/g, "")}`,
                        'pinata_secret_api_key': `${process.env.REACT_APP_API_SECRET.replace(/`/g, "")}`
                    }
                }
            )

        const uploadDate = Date.parse(response.data.Timestamp);
        const currentDate = Date.now();

        if(currentDate-uploadDate > 300000){
            alert('This file is already minted');
            this.refreshPage();
        }else{
            //Store ipfsHash
            this.setState({ipfsHash: response.data.IpfsHash})
        }
    }

    constructor(props) {    //Props - Pass states from one to another
        super(props)
        this.state = {  
            account: '',     //Create a state & look for changes
            Contract: [],
            totalSupply: 0,
            ASXNFT : [],    //Stores nft
            ownedBy : [],    //Stores owners
            file: null,
            json: [],
            name: '',
            desc: '',
            price: '',
            ipfsHash: '',
            jsonHash: ''
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.changeHandler = this.changeHandler.bind(this);
    }   

    

    render() {
        return( 
            <div className="container-filled">
                <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
                    <div className="navbar-brand col-sm-3 col-md-3 mr-0" style={{color: '#e6e6e6'}}>
                        Astreaus - The NFT Marketplace
                    </div>
                    <ul className="navbar-nav px-3">
                        <li key={''} className="nav-item text-nowrap d-none d-sm-none d-sm-block">
                            <small className="text-white">
                                {this.state.account}
                            </small>
                        </li>
                    </ul>
                </nav>
                <div className="container-fluid mt-1">
                    <div className="row">
                        <main role='main' className='col-lg-12 d-flex text-center'>
                            <div className="content mr-auto ml-auto" style={{opacity: '0.8'}}>
                                <h1 style={{color:'black'}}>Astreaus v2.0</h1>
                                <form onSubmit={this.handleSubmit}>
                                    {/* <input type='text' placeholder='Location of NFT' className='form-control mb-1' value={this.state.link} onChange={this.handleChange} />
                                    <p style={{margin:'2px'}}>OR</p> */}
                                    <input type='file'  className='form-control mb-2' onChange={this.changeHandler} />
                                    <p style={{margin:'2px'}}>Note: Details related to NFT can be changed but not the image</p>
                                    <input name='title' type='text' placeholder='Title' className='form-control mb-1' value={this.state.title} onChange={this.handleChange} />
                                    <textarea name='description' placeholder='Description' className='form-control mb-1' value={this.state.description} onChange={this.handleChange} />
                                    <input name='price' type='number' placeholder='Price' className='form-control mb-1' value={this.state.price} onChange={this.handleChange} />
                                    <input type='button' style={{margin:'6px'}} className="btn btn-primary btn-black" onClick={this.handleSubmit} value='Mint NFT' />
                                </form>
                            </div>
                        </main>
                    </div>
                </div>
                <hr></hr>
                <div className="row textCenter">
                    {
                        this.state.json.map((perData, key) => {
                            return(
                                <div className="mdbCards" key={this.state.json.indexOf(perData)}>
                                <MDBCard className="token img" style={{maxWidth:'22rem'}}>
                                <MDBCardImage alt={'ipfsLink: '+perData.data.image} src={'https://gateway.pinata.cloud/ipfs/'+perData.data.image.slice(7)} position='top' height='250rem' style={{marginRight:'10px'}}/>
                                <MDBCardBody>
                                    <MDBCardTitle>{perData.data.name} #{this.state.json.indexOf(perData)+1} </MDBCardTitle>
                                    <MDBCardText>{perData.data.description}</MDBCardText>
                                    <MDBCardText style={{fontSize: '10px'}}> Owner:<br/> {this.state.ownedBy[this.state.json.indexOf(perData)]} </MDBCardText>
                                    <MDBCardText><b>Price: {perData.data.price} ETH</b></MDBCardText>
                                    <MDBBtn href={'https://gateway.pinata.cloud/ipfs/'+this.state.ASXNFT[this.state.json.indexOf(perData)]}>Download</MDBBtn>
                                    <MDBBtn color='success' style={{marginLeft: '10px'}} onClick={() => { this.transfer(this.state.json.indexOf(perData), perData.data.price) }}>Buy</MDBBtn>
                                </MDBCardBody>
                                </MDBCard>
                            </div>
                        )})
                    }
                </div>
            </div>
        )
    }
}

export default App; //Moves app to index.js/ReactDom in homepage