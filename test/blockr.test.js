//const { should } = require('chai')
const {assert} = require('chai')

const Blockr = artifacts.require('./addInfo')   //Contract name : addInfo

require('chai')
.use(require('chai-as-promised'))
.should()

contract('Blockr', (accounts)=>{

    let contract

    //Before hook runs the program firstly
    before( async () => {
        contract = await Blockr.deployed()
    })

    
    describe('deployment', async ()=> {
        //Check initial deployment
        it('deploys successfully', async () => {
            const address = contract.address
            assert.notEqual(address, '')
            assert.notEqual(address, undefined)
            assert.notEqual(address, null)
            assert.notEqual(address, 0x0)
        })
        it('Name checks out', async () => {
            const name = await contract.name()
            assert.equal(name,'Blockr')
        })
        it('Symbol checks out', async () => {
            const Symbol = await contract.symbol()
            assert.equal(Symbol, 'BLK')
        })
    })

    describe('minting check', async ()=> {
        //Check initial deployment
        it('mints successfully', async () => {
            const result = await contract.mint('linkOfImage01')
            const totalSupply = await contract.totalSupply()
            //Check
            assert.equal(totalSupply, 1)
            const event = result.logs[0].args
            assert.equal(event._from,'0x0000000000000000000000000000000000000000','Address of from.')
            assert.equal(event._to,accounts[0],'Address of message sender')

            await contract.mint('linkOfImage01').should.be.rejected
        })
    })

    describe('Checks Indexing', async () => {
        it('list of tokens', async ()=> {
            await contract.mint('linkOfImage02')
            await contract.mint('linkOfImage03')
            await contract.mint('linkOfImage04')
            const totalSupply = await contract.totalSupply()
    
            let result = []
            let Blockr
            for(i=0;i<totalSupply;i++){
                Blockr = await contract.addInfos(i)
                result.push(Blockr)
            }
            let expected = ['linkOfImage01','linkOfImage02','linkOfImage03','linkOfImage04']
            assert.equal(result.join(','),expected.join(','))   //Join converts array into string "required because assert compare strings or int"
        })
    })
})