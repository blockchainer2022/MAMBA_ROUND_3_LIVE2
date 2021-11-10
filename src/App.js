import { useState, useEffect } from "react";
import Home from "./pages/Home";
import Web3 from "web3";
import { contractAbi, contractAddress } from "./config";
import { contractAbi2, contractAddress2 } from "./config2";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { InformationModal, ConfirmationLoadingPopup } from "./components";
import axios from "axios";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import "./app.css";
function App() {
  const [chainId, setChainId] = useState(null);
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [price, setPrice] = useState(0);
  const [bnbBalance, setBnbBalance] = useState(0);
  const [icoPrice, setIcoPrice] = useState(0);
  const [totalSupply, setTotalSupply] = useState(0);
  const [tokenSold, setTokenSold] = useState(0);
  const [userTokenBalance, setUserTokenBalance] = useState(0);
  //FOR POPUP
  const [nftMinted, setNftMinted] = useState(false);
  const [claimMinted, setClaimMinted] = useState(false);
  const [nftMinting, setNftMinting] = useState(false);
  const [claimMinting, setClaimMinting] = useState(false);
  const [mintingInProgress, setMintingInProgress] = useState(false);
  const [claimInProgress, setClaimInProgress] = useState(false);
  const [confirmTransaction, setConfirmTransaction] = useState(false);
  const [claimConfirmTransaction, setClaimConfirmTransaction] = useState(false);
  const [lessValueWarn, setLessValueWarn] = useState(false);

  const [accessAccountDenied, setAccessAccountDenied] = useState(false);
  const [installEthereum, setInstallEthereum] = useState(false);
  const [switchToMainnet, setswitchToMainnet] = useState(false);
  const [transactionRejected, setTransactionRejected] = useState(false);
  const [transactionFailed, setTransactionFailed] = useState(false);
  const [ethereumCompatibleBrowser, setEthereumCompatibleBrowser] =
    useState(false);

  const [activeStep, setActiveStep] = useState(1);
  const [claimBalance, setClaimBalance] = useState(0);
  const [claimedBalance, setClaimedBalance] = useState(0);
  // const [apiClaimData, setApiClaimData] = useState({});

  // console.log(claimBalance);

  // const [buyConfirm, setBuyConfirm] = useState(false);

  const providerOptions = {
    walletconnect: {
      package: WalletConnectProvider, // required
      options: {
        infuraId: "9a29c26a16574eb1b8b8959e8aba86ed", // required
      },
    },
  };

  const web3Modal = new Web3Modal({
    providerOptions, // required
  });
  async function loadWalleConnect() {
    //alert('Hello');
    const provider = await web3Modal.connectTo("walletconnect");
    const web3 = new Web3(provider);

    const chainId = await web3.eth.getChainId();
    console.log("chainId:", chainId);

    const contract = new web3.eth.Contract(contractAbi, contractAddress);
    console.log(contract);
    // const totalsupply = await contract.methods.getTokenSupply().call();
    // const finalTotalSupply = window.web3.utils.fromWei(totalsupply, "ether");
    // console.log("totalSupply:", finalTotalSupply);

    // setTotalSupply(finalTotalSupply);
    const accounts = await web3.eth.getAccounts();
    setAccount(accounts[0]);
    // console.log(accounts[0]);
    provider.on("accountsChanged", (accounts) => {
      console.log("account:", accounts[0]);
    });

    // Subscribe to chainId change
    provider.on("chainChanged", (chainId) => {
      console.log("chainid", chainId);
    });

    // Subscribe to provider connection
    provider.on("connect", (info) => {
      console.log("info", info);
    });

    // Subscribe to provider disconnection
    provider.on("disconnect", (error) => {
      console.log(error);
    });
  }

  //for MetaMask

  async function loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);

      try {
        loadBlockchainData();
        getCurrentAddressConnected();
        addAccountsAndChainListener();
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });

        setAccount(accounts[0]);

        // console.log("account:", account);

        const balance = await window.web3.eth.getBalance(accounts[0]);

        const balance_Eth = window.web3.utils.fromWei(balance, "ether");
        // console.log("balance:", balance);
        // console.log("balance_Eth:", balance_Eth);
        setBnbBalance(balance_Eth);
        // console.log(bnbBalance);
      } catch (error) {
        if (error.code === 4001) {
          // swal("Request to access account denied!", "", "error");
          setAccessAccountDenied(true);
        } else console.error(error);
      }
    } else {
      setInstallEthereum(true);
    }
  }

  useEffect(() => {
    const localAccount = localStorage.getItem("account");

    if (localAccount === "metamask") {
      loadWeb3();
    }
    if (localAccount === "walletconnect") {
      loadWalleConnect();
    }
    const claimData = JSON.parse(localStorage.getItem("claimData"));
    if (claimData) {
      if (claimData.address === account) {
      }
    }
    console.log(claimData);

    const getData = async () => {
      try {
        let { data } = await axios.get(
          `https://defi.mobiwebsolutionz.com/api/mamba/get-isclaimed-testnet.php?address=${account}`
        );
        console.log("claim data", data);
        // setApiClaimData(data.data);
        if (data?.data.is_claimed) {
          // setActiveStep(Number(data.data.step));
          setClaimedBalance(Number(data.data.amount));
        }
      } catch (error) {
        console.log(error);
      }
    };

    getData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account]);

  const loadBlockchainData = async () => {
    let contract = new window.web3.eth.Contract(contractAbi2, contractAddress2);
    let test = contractAddress;
    console.log(test);
    try {
      let { data } = await axios.get(
        `https://defi.mobiwebsolutionz.com/api/mamba/get-isclaimed-testnet.php?address=${account}`
      );
      // console.log("", data);
      // setApiClaimData(data.data);
      if (data?.data.is_claimed) {
        setActiveStep(Number(data.data.step));
        setClaimedBalance(Number(data.data.amount));
        contract = new window.web3.eth.Contract(contractAbi2, contractAddress2);
        test = contractAddress2;
      }
    } catch (error) {
      console.log(error);
    }

    setContract(contract);
    console.log(test);
    const chainId = await window.web3.eth.getChainId();
    setChainId(chainId);
    //success when chainId = 97 else failure
    // you are connected to main net
    // Please connect to main net

    if (chainId === 56) {
      toast(`You are connected to main net`, {
        type: "success",
        position: toast.POSITION.BOTTOM_CENTER,
      });
      const totalsupply = await contract.methods
        .getContractTokenBalance()
        .call();
      // const finalTotalSupply = window.web3.utils.fromWei(totalsupply, "ether");
      // console.log("totalSupply:", totalsupply);
      setTotalSupply(totalsupply);
      // console.log("total supply", totalsupply / 1000000000);

      const price = await contract.methods.ICOPrice().call();
      setPrice(price / 1000000000);
      // console.log("Icoprice:", price / 1000000000);
      const endTime = await contract.methods.endTime().call();
      // console.log("endTime:", endTime);
      const startTime = await contract.methods.startTime().call();
      // console.log("Start time:", startTime);
      const ICOtarget = await contract.methods.ICOTarget().call();
      // console.log("IcoTARGET:", ICOtarget / 1000000000);
      // const convertedICOPrice = Web3.utils.fromWei(price);
      setIcoPrice(price / 1000000000);
      // console.log("icoprice:", convertedICOPrice);
      const tokensold = await contract.methods.tokenSold().call();
      // const finalTokenSold = window.web3.utils.fromWei(tokensold, "ether");
      // console.log("tokenSold:", tokensold);
      if (account) {
        const claimed = await contract.methods.getBNBInvestment(account).call();
        const finalClaimed = window.web3.utils.fromWei(claimed, "ether");
        console.log("finalClaimed data", finalClaimed);
        setClaimBalance(finalClaimed);
      }
      setTokenSold(tokensold);
      console.log(activeStep);
      const postTokens = async () => {
        try {
          const response = await axios.post(
            "https://defi.mobiwebsolutionz.com/api/mamba/update-testnet.php",
            {
              startTime: startTime,
              endTime: endTime,
              ICOprice: price / 1000000000,
              ICOtarget: ICOtarget / 1000000000,
              total_supply: totalsupply / 1000000000,
              total_sold: tokensold / 1000000000,
            }
          );
          console.log(response);
        } catch (error) {
          console.log(error);
        }
      };

      postTokens();
      const tokenBalance = await contract.methods
        .getUserTokenBalance()
        .call({ from: account });

      setUserTokenBalance(tokenBalance / 100);
      console.log("User Token Balance:", tokenBalance);
    } else {
      toast("Please connect to main net", {
        type: "error",
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }
  };

  const getCurrentAddressConnected = async () => {
    try {
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });
      if (accounts.length > 0) {
        setAccount(accounts[0]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const addAccountsAndChainListener = async () => {
    //this event will be emitted when the currently connected chain changes.
    window.ethereum.on("chainChanged", (_chainId) => {
      window.location.reload();
      // loadWeb3();
    });

    // this event will be emitted whenever the user's exposed account address changes.
    window.ethereum.on("accountsChanged", (accounts) => {
      window.location.reload();
      // loadWeb3();
    });
  };

  async function buy(buyAmount) {
    if (contract) {
      if (chainId === 56) {
        if (buyAmount === 0) {
          setLessValueWarn(true);
        } else {
          setConfirmTransaction(true);

          const finalPrice = window.web3.utils.toWei(
            buyAmount.toString(),
            "ether"
          );
          // console.log("finalPrice:", finalPrice);
          // await contract.methods.buy().estimateGas(
          //   {
          //     from: account,
          //     value: finalPrice,
          //   },
          //   function (error, estimatedGas) {
          //     console.log("estimatedGas:", estimatedGas);
          //   }
          // );

          await contract.methods
            .buy()
            .send({ from: account, value: finalPrice })
            .on("transactionHash", function () {
              setConfirmTransaction(false);
              setMintingInProgress(true);
            })
            .on("confirmation", function () {
              const el = document.createElement("div");
              el.innerHTML =
                "View minted NFT on OpenSea : <a href='https://testnets.opensea.io/account '>View Now</a>";

              // swal({
              //   title: "NFT Minted!",
              //   content: el,
              //   icon: "success",
              // });
              const claimdata = {
                address: account,
                step: 2,
                claimed: true,
                claimedBnb: claimBalance,
              };
              window.localStorage.setItem(
                "claimData",
                JSON.stringify(claimdata)
              );
              async function postData() {
                try {
                  const { data } = await axios.post(
                    "https://defi.mobiwebsolutionz.com/api/mamba/set-isclaimed-testnet.php",
                    { address: account, amount: claimedBalance, step: 2 }
                  );

                  console.log("buydata", data);
                } catch (error) {
                  console.log(error);
                }
              }
              postData();
              setNftMinted(true);
              setConfirmTransaction(false);
              setMintingInProgress(false);
              setActiveStep((prev) => prev + 1);
              // setBuyConfirm(true);
            })
            .on("error", function (error, receipt) {
              if (error.code === 4001) {
                // swal("Transaction Rejected!", "", "error");
                setNftMinted(false);
                setTransactionRejected(true);
                setConfirmTransaction(false);
                setMintingInProgress(false);
              } else {
                // swal("Transaction Failed!", "", "error");
                setTransactionFailed(true);
                setConfirmTransaction(false);
                setMintingInProgress(false);
                setNftMinted(false);
              }
            });
        }
      } else {
        // swal("Please switch to mainnet to buy Agod", "", "error");
        setswitchToMainnet(true);
      }
    } else {
      // swal(
      //   "",
      //   "Please install an Ethereum-compatible browser or extension like MetaMask to use this dApp!",
      //   "error"
      // );
      setEthereumCompatibleBrowser(true);
    }
  }
  async function claim() {
    if (contract) {
      if (chainId === 56) {
        // if (buyAmount === 0) {
        //   setLessValueWarn(true);
        // } else {
        setClaimConfirmTransaction(true);

        await contract.methods
          .claimInvestment()
          .send({ from: account })
          .on("transactionHash", function () {
            setClaimConfirmTransaction(false);
            setClaimInProgress(true);
          })
          .on("confirmation", function () {
            const el = document.createElement("div");
            el.innerHTML =
              "View minted NFT on OpenSea : <a href='https://testnets.opensea.io/account '>View Now</a>";

            const claimdata = {
              address: account,
              step: "1",
              claimed: true,
              claimedBnb: claimBalance,
            };
            window.localStorage.setItem("claimData", JSON.stringify(claimdata));
            async function postData() {
              try {
                const { data } = await axios.post(
                  "https://defi.mobiwebsolutionz.com/api/mamba/set-isclaimed-testnet.php",
                  { address: account, amount: claimBalance, step: 1 }
                );

                console.log(data);
              } catch (error) {
                console.log(error);
              }
            }
            postData();
            setClaimMinted(true);
            setClaimConfirmTransaction(false);
            setClaimInProgress(false);
          })
          .on("error", function (error, receipt) {
            if (error.code === 4001) {
              // swal("Transaction Rejected!", "", "error");
              setClaimMinted(false);
              setTransactionRejected(true);
              setClaimConfirmTransaction(false);
              setClaimInProgress(false);
            } else {
              // swal("Transaction Failed!", "", "error");
              setTransactionFailed(true);
              setClaimConfirmTransaction(false);
              setClaimInProgress(false);
              setClaimMinted(false);
            }
          });
      } else {
        // swal("Please switch to mainnet to buy Agod", "", "error");
        setswitchToMainnet(true);
      }
    } else {
      // swal(
      //   "",
      //   "Please install an Ethereum-compatible browser or extension like MetaMask to use this dApp!",
      //   "error"
      // );
      setEthereumCompatibleBrowser(true);
    }
  }

  return (
    <div>
      <Home
        account={account}
        bnbBalance={bnbBalance}
        buy={buy}
        icoPrice={icoPrice}
        totalSupply={totalSupply}
        tokenSold={tokenSold}
        userTokenBalance={userTokenBalance}
        loadWeb3={loadWeb3}
        loadWalleConnect={loadWalleConnect}
        activeStep={activeStep}
        claim={claim}
        claimBalance={claimBalance}
        claimedBalance={claimedBalance}
      />
      <InformationModal
        open={lessValueWarn}
        onClose={setLessValueWarn}
        title="Alert!"
        text="Amount Should Not be 0"
      />
      <InformationModal
        open={accessAccountDenied}
        onClose={setAccessAccountDenied}
        title="Oops"
        text="Request to access account denied!"
      />
      <InformationModal
        open={installEthereum}
        onClose={setInstallEthereum}
        title="Oops"
        text="Please install an Ethereum-compatible browser or extension like MetaMask to use this dApp!"
      />
      <InformationModal
        open={nftMinted}
        onClose={setNftMinted}
        title="Swap Successful"
        text="You have successfully Swapped BNBs with MAMBAs"
        mint={true}
      />
      <InformationModal
        open={claimMinted}
        onClose={setClaimMinted}
        title="Claim Successful"
        text="You have successfully claim BNBs"
        mint={true}
      />
      <InformationModal
        open={nftMinting}
        onClose={setNftMinting}
        title="Information"
        text="Purchasing NFT!"
      />
      <InformationModal
        open={claimMinting}
        onClose={setClaimMinting}
        title="Information"
        text="Claiming BNB!"
      />
      <InformationModal
        open={transactionRejected}
        onClose={setTransactionRejected}
        title="Error"
        text="Transaction Rejected!"
      />
      <InformationModal
        open={transactionFailed}
        onClose={setTransactionFailed}
        title="Error"
        text="Transaction Failed!"
      />
      <InformationModal
        open={switchToMainnet}
        onClose={setswitchToMainnet}
        title="Error"
        text="Please switch to mainnet to Buy Mamba"
      />
      <InformationModal
        open={ethereumCompatibleBrowser}
        onClose={setEthereumCompatibleBrowser}
        title="Error"
        text="Please install an Ethereum-compatible browser or extension like MetaMask to use this dApp!"
      />
      <ConfirmationLoadingPopup
        open={confirmTransaction}
        title="Confirm Transaction"
        message="Confirm transaction to swap the BNBs with MAMBAs"
      />
      <ConfirmationLoadingPopup
        open={claimConfirmTransaction}
        title="Confirm Transaction"
        message="Confirm transaction to claim BNBs "
      />
      <ConfirmationLoadingPopup
        open={mintingInProgress}
        title="Buying In Progress"
        message="Please wait to get confirmation of the transaction from blockchain"
      />
      <ConfirmationLoadingPopup
        open={claimInProgress}
        title="Claiming In Progress"
        message="Please wait to get confirmation of the transaction from blockchain"
      />
    </div>
  );
}

export default App;
