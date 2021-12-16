# Blockchain App

Esse projeto consiste em mandar mensagens ao smart contract e 50% de chances de receber 0.0001 ETH na rede Rinkeby da Ethereum.

## A versão finalizada esta online neste link https://blockchain-app.vercel.app/

![image](https://user-images.githubusercontent.com/57265920/146457310-89c02ff4-cbc4-488d-a526-08e0be32a900.png)

Para rodar o projeto local segue os passos adiante e tenha instalado a carteira metamask como extensão do navegador. 
```shell
git clone git@github.com:ojoaoguilherme/Blockchain-App.git
yarn install ou npm install
npx hardhat node
```

Resultado:
![image](https://user-images.githubusercontent.com/57265920/146458659-55cbd560-c4cc-458c-bb8d-8d5ff799d48f.png)

### Em outro terminal execute os seguintes comandos
```shell
npx hardhat run Scripts/deploy --network localhost
```
resultado: 
![image](https://user-images.githubusercontent.com/57265920/146458721-964ad7d2-498f-49ea-b658-c9bd5eda9154.png)

1. copie o endereço do contrato e substitua no arquivo App.jsx na variavel contractAdress
![image](https://user-images.githubusercontent.com/57265920/146458764-5d38b100-32a0-4f82-8e51-3e9754000a2c.png)
2. cd frontend && yarn start ou npm run start

resultado:
![image](https://user-images.githubusercontent.com/57265920/146459091-5339a87c-a7ea-4027-82c3-3dbb728d803f.png)



