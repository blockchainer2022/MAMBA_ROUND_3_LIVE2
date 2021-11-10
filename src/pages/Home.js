import React, { useEffect, useState } from "react";
import { Header } from "../components";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { HeroSection } from "../sections";
import axios from "axios";

toast.configure();
const Home = ({
  account,
  buy,
  totalSupply,
  tokenSold,
  loadWeb3,
  icoPrice,
  bnbBalance,
  userTokenBalance,
  loadWalleConnect,
  activeStep,
  claim,
  claimBalance,
  claimedBalance,
}) => {
  const [data, setData] = useState({});

  useEffect(() => {
    const getData = async () => {
      try {
        const { data } = await axios.get(
          "https://defi.mobiwebsolutionz.com/api/mamba/get-ico-details-testnet.php"
        );

        setData(data.data);
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  }, []);

  return (
    <div>
      <Header
        account={account}
        loadWeb3={loadWeb3}
        loadWalleConnect={loadWalleConnect}
      />
      <HeroSection
        account={account}
        buy={buy}
        totalSupply={data.ICOtarget}
        icoPrice={data.ICOprice}
        bnbBalance={bnbBalance}
        tokenSold={data.total_sold}
        userTokenBalance={userTokenBalance}
        loadWalleConnect={loadWalleConnect}
        loadWeb3={loadWeb3}
        startTime={data.startTime}
        endTime={data.endTime}
        activeStep={activeStep}
        claim={claim}
        claimBalance={claimBalance}
        claimedBalance={claimedBalance}
      />
    </div>
  );
};

export default Home;
