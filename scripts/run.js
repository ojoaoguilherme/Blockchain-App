const main = async () => {
   const [owner, randomPerson] = await hre.ethers.getSigners();
   const waveContractFactory = await hre.ethers.getContractFactory(
      "WavePortal"
   );
   const waveContract = await waveContractFactory.deploy({
      value: hre.ethers.utils.parseEther("0.1"),
   });
   await waveContract.deployed();
   console.log("Contract deployed to:", waveContract.address);
   console.log("Contract deployed by:", owner.address);
   let contractBalance = await hre.ethers.provider.getBalance(
      waveContract.address
   );

   console.log(
      "Contract initial balance:",
      hre.ethers.utils.formatEther(contractBalance)
   );

   let waveTxn = await waveContract.wave("Quero ganhar");
   await waveTxn.wait();

   waveTxn = await waveContract.connect(randomPerson).wave("Random");
   await waveTxn.wait();

   waveTxn = await waveContract.connect(randomPerson).wave("Random message 1");
   await waveTxn.wait();

   waveTxn = await waveContract.connect(randomPerson).wave("Random message 2");
   await waveTxn.wait();

   waveTxn = await waveContract.connect(randomPerson).wave("Random message 3");
   await waveTxn.wait();

   contractBalance = await hre.ethers.provider.getBalance(waveContract.address);
   console.log(
      "Contract final balance:",
      hre.ethers.utils.formatEther(contractBalance)
   );

   let allWaves = await waveContract.getAllWaves();
   console.log(allWaves);
   console.log("-------------------");
   let allWinners = await waveContract.getAllWinners();
   console.log(allWinners);
};

const runMain = async () => {
   try {
      await main();
      process.exit(0);
   } catch (error) {
      console.log(error);
      process.exit(1);
   }
};

runMain();
