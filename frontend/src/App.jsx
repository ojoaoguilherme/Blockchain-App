import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import abi from "./utils/WavePortal.json";
import "./App.css";

export default function App() {
   const contractAddress = "0x90BCc3547F7E276A5Fb88F39681d1D170dB33171";
   const contractABI = abi.abi;
   const [currentAccount, setCurrentAccount] = useState("");
   const [message, setMessage] = useState("");
   const [mining, setmining] = useState(0);
   const [allWaves, setAllWaves] = useState([]);

   const checkIfWalletIsConnected = async () => {
      try {
         const { ethereum } = window;

         if (!ethereum) {
            console.log("Make sure you have metamask!");
            return;
         } else {
            console.log("We have the ethereum object", ethereum);
         }

         const accounts = await ethereum.request({ method: "eth_accounts" });

         if (accounts.length !== 0) {
            const account = accounts[0];
            console.log("Found an authorized account:", account);
            setCurrentAccount(account);
            getAllWaves();
         } else {
            console.log("No authorized account found");
         }
      } catch (error) {
         console.log(error);
      }
   };

   /**
    * Implement your connectWallet method here
    */
   const connectWallet = async () => {
      try {
         const { ethereum } = window;

         if (!ethereum) {
            alert("Get MetaMask!");
            return;
         }

         const accounts = await ethereum.request({
            method: "eth_requestAccounts",
         });

         console.log("Connected", accounts[0]);
         setCurrentAccount(accounts[0]);
      } catch (error) {
         console.log(error);
      }
   };

   const wave = async () => {
      try {
         const { ethereum } = window;

         if (ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const wavePortalContract = new ethers.Contract(
               contractAddress,
               contractABI,
               signer
            );

            let count = await wavePortalContract.getTotalWaves();
            console.log("Retrieved total wave count:", count.toNumber());

            const waveTxn = await wavePortalContract.wave(message, {
               gasLimit: 300000,
            });
            setmining(1);
            console.log("Mining...", waveTxn.hash);

            await waveTxn.wait();
            setmining(0);
            console.log("Mined -- -- ", waveTxn.hash);

            count = await wavePortalContract.getTotalWaves();
            console.log("Retrieved total wave count...", count.toNumber());
         } else {
            console.log("Ethereum object doesn't exist!");
         }
      } catch (error) {
         console.log(error);
      }
   };

   const getAllWaves = async () => {
      const { ethereum } = window;

      try {
         if (ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const wavePortalContract = new ethers.Contract(
               contractAddress,
               contractABI,
               signer
            );
            const waves = await wavePortalContract.getAllWaves();

            const wavesCleaned = waves.map((wave) => {
               return {
                  address: wave.waver,
                  timestamp: new Date(wave.timestamp * 1000),
                  message: wave.message,
               };
            });

            setAllWaves(wavesCleaned);
         } else {
            console.log("Ethereum object doesn't exist!");
         }
      } catch (error) {
         console.log(error);
      }
   };

   function handleMessage(event) {
      setMessage(event.target.value);
   }

   useEffect(() => {
      checkIfWalletIsConnected();

      let wavePortalContract;

      const onNewWave = (from, timestamp, message) => {
         console.log("NewWave", from, timestamp, message);
         setAllWaves((prevState) => [
            ...prevState,
            {
               address: from,
               timestamp: new Date(timestamp * 1000),
               message: message,
            },
         ]);
      };

      if (window.ethereum) {
         const provider = new ethers.providers.Web3Provider(window.ethereum);
         const signer = provider.getSigner();

         wavePortalContract = new ethers.Contract(
            contractAddress,
            contractABI,
            signer
         );
         wavePortalContract.on("NewWave", onNewWave);
      }

      return () => {
         if (wavePortalContract) {
            wavePortalContract.off("NewWave", onNewWave);
         }
      };
   }, []);

   return (
      <div className="mainContainer">
         <div className="dataContainer">
            <div className="header">
               <h1>👋 Olá tudo bem?</h1>
            </div>

            <div className="bio">
               <p>
                  Olá meu nome é João Guilherme estou estudando desenvolvimento
                  em blockchain e interfaces em React e Nextjs pra comunicar com
                  o contrato.
               </p>
               {currentAccount ? (
                  ""
               ) : (
                  <p>
                     Conecte sua carteira para concorrer 0.0001 ETH me mandando
                     uma mensagem!!
                  </p>
               )}
            </div>
            {currentAccount ? (
               <div className="enviar">
                  <input
                     type="text"
                     placeholder="Digite sua mensagem aqui"
                     value={message}
                     onChange={handleMessage}
                  />
                  <button onClick={wave}>
                     <p>Enviar Mensagem</p>
                  </button>
               </div>
            ) : (
               ""
            )}

            {!currentAccount && (
               <button className="waveButton" onClick={connectWallet}>
                  <div className="conectar">Connectar Carteira</div>
               </button>
            )}
            {currentAccount ? (
               //  <h1 className="totalWaves">Recebi {totalWave} até agora!</h1>
               ""
            ) : (
               <p className="desconectado">
                  Precisa conectar a sua careteira para saber quantos waves
                  recebeu!
               </p>
            )}

            <div className="minerando">{mining ? <p>Minerando...</p> : ""}</div>
         </div>
         <div className="address">
            {allWaves.map((wave, index) => {
               console.log(wave);
               return (
                  <div key={index} className="container-wave">
                     <p className="title">Address</p>
                     <p className="text">{wave.address}</p>
                     <p className="title">Date and Time</p>
                     <p className="text">
                        {wave.timestamp.toLocaleDateString()} -{" "}
                        {wave.timestamp.toTimeString()}
                     </p>
                     <p className="title">Message</p>
                     <p className="text">{wave.message}</p>
                  </div>
               );
            })}
         </div>
      </div>
   );
}
