# Astreaus-NFT-Marketplace
Astreaus marketplace based on openzeppelin contracts and react

# For initializing the project:
  1: 'git clone' this repo into a new folder then run 'npm init' for installing required node packages,<br>
  2: Switch configs to desired ethereum network in 'truffle-config.js',<br>
  3: do a command run of 'truffle migrate --reset' then allow wallet to pay for contract deployment fee,<br>
  4: 'npm run start' to initialize the react front end on the localhost and all is ready to go.<br>
  5: Project requires and supports '<b>Pinata</b>' API for IPFS upload of JSON and image.<br>
  &nbsp;&nbsp;&nbsp;&nbsp;Sign up for free/paid account and generate API Keys for project,<br>
  &nbsp;&nbsp;&nbsp;&nbsp;Then you need to creat an .env file at project root and include the api keys as following:<br>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;``REACT_APP_API_KEY="<API_KEY_HERE>" ``<br>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;``REACT_APP_API_SECRET="<API_SECRET_KEY_HERE>" ``<br>

# Images
1. Homepage of Astreaus NFT Marketplace:
  ![Homepage](https://raw.githubusercontent.com/Sumitkumar193/Astreaus-NFT-Marketplace/main/images/1.png)
2. Sign-in with metamask wallet:
  ![signIn](https://raw.githubusercontent.com/Sumitkumar193/Astreaus-NFT-Marketplace/main/images/2.png)
3. Select photo or file for upload to ipfs:
  ![uploading](https://raw.githubusercontent.com/Sumitkumar193/Astreaus-NFT-Marketplace/main/images/3.png)
4. Fill in metadata of the NFT (i.e. Title, Description, Price):
  ![metadata](https://raw.githubusercontent.com/Sumitkumar193/Astreaus-NFT-Marketplace/main/images/4.png)
5. Hit submit by clicking ``Mint NFT`` button and confirm transaction in metamask wallet:
  ![minting](https://raw.githubusercontent.com/Sumitkumar193/Astreaus-NFT-Marketplace/main/images/5.png)
6. Homepage of Marketplace after minting NFT
  ![homepageAfterMint](https://raw.githubusercontent.com/Sumitkumar193/Astreaus-NFT-Marketplace/main/images/6.png)
<b>For purchase of NFT:</b><br>
Note: Austreaus Marketplace do not charge any commission and sends ETH directly to user.
7. Pay user from metamask wallet:
  ![payUserDirectly](https://raw.githubusercontent.com/Sumitkumar193/Astreaus-NFT-Marketplace/main/images/7.png)
8. Transfer Ownership of NFT and pay for transaction:
  ![transferOwnership](https://raw.githubusercontent.com/Sumitkumar193/Astreaus-NFT-Marketplace/main/images/8.png)
9. Ownership is successfully transfered to new owner:
  ![newOwnerOfNFT](https://raw.githubusercontent.com/Sumitkumar193/Astreaus-NFT-Marketplace/main/images/9.png)
  
# Notes:
  1.Project is not production ready so there may be few bugs which i have not encountered yet.<br>
  2.Project support metamask wallet only<br>
  3.Project is by default set for Ganache Testnet (from truffle framework)<br>
  4.Project also checks whether if the image/file is already available on IPFS to prevent uploading content of another authors.<br>
  5.Approval functionality is yet to be implemented!<br>
 

  
