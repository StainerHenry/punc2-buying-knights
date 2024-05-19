import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import * as s from "./styles/globalStyles";
import styled from "styled-components";

import Tabs from "./components/Tabs/Tabs";

import { PunkKnightsLogo } from "./components/punkKnightsLogo/PunkKnightsLogo";

const truncate = (input, len) =>
  input.length > len ? `${input.substring(0, len)}...` : input;

export const StyledButton = styled.button`
padding: 10px;
font-size: 100%;
font-family: coder;
border-radius: 10px;
border: solid;
border-color: white;
background-color: green;
padding: 10px;
font-weight: bold;
color: var(--secondary-text);
width: 200px;
height: 60px;
cursor: pointer;
box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
-webkit-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
-moz-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
:active {
box-shadow: none;
-webkit-box-shadow: none;
-moz-box-shadow: none;
}
`;

export const StyledRoundButton = styled.button`
border-radius: 20%;
border: none;
color: black;
background-color: lichtgrey;
font-size: 20px;
font-weight: bold;
width: 30px;
height: 20px;
cursor: pointer;
display: flex;
align-items: center;
justify-content: center;
box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
-webkit-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
-moz-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
:active {
box-shadow: none;
-webkit-box-shadow: none;
-moz-box-shadow: none;
}
`;

export const ResponsiveWrapper = styled.div`
display: flex;
flex: 1;
flex-direction: column;
justify-content: stretched;
align-items: center;
width: justify;
@media (min-width: 767px) {
flex-direction: row;
  }
`;

export const StyledImg = styled.img`
box-shadow: 0px 5px 11px 2px rgba(0, 0, 0, 0.7);
border: 5px solid var(--secondary);
background-color: var(--accent);
border-radius: 10%;
width: 200px;
@media (min-width: 900px) {
width: 250px;
}
  @media (min-width: 1000px) {
width: 200px;
}
  transition: width 0.5s;
`;

export const StyledLink = styled.a`
color: var(--secondary);
text-decoration: none;
`;

function App() {
  const [value, setValue] = React.useState(0);
  const tabData = [
    { label: "Tab 1" },
    { label: "Tab 2" }
];

  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [mintingNfk, setMintingNfk] = useState(false);
  const [feedback, setFeedback] = useState(
    `Click "Mint Knights" to mint your NFK.`
  );
  const [mintAmount, setMintAmount] = useState(1);
  const [CONFIG, SET_CONFIG] = useState({
    CONTRACT_ADDRESS: "",
    BLOCK_EXPLORER: "",
    NETWORK: {
      NAME: "",
      SYMBOL: "",
      ID: 0,
    },
    NFK_NAME: "",
    SYMBOL: "",
    MAX_KNIGHTS: 1,
    WEI_COST: 0,
    NFK_PRICE: 0,
    GAS_LIMIT: 0,
    MARKETPLACE: "",
    MARKETPLACE_LINK: "",
    SHOW_BACKGROUND: false,
  });

  const mintNFKs = () => {
    let publicPrice = CONFIG.WEI_COST;
    let gasLimit = CONFIG.GAS_LIMIT;
    let totalCostWei = String(publicPrice * mintAmount);
    let totalGasLimit = String(gasLimit * mintAmount);
    console.log("public Price: ", totalCostWei);
    console.log("Gas limit: ", totalGasLimit);
    setFeedback(`Minting your ${CONFIG.NFK_NAME}...`);
    setMintingNfk(true);
    blockchain.smartContract.methods
      .mintKnight(mintAmount)
      .send({
        gasLimit: String(totalGasLimit),
        to: CONFIG.CONTRACT_ADDRESS,
        from: blockchain.account,
        value: totalCostWei,
      })
      .once("error", (err) => {
        console.log(err);
        setFeedback("Sorry, something went wrong please try again later.");
        setMintingNfk(false);
      })
      .then((receipt) => {
        console.log(receipt);
        setFeedback(
          `You succesfully minted your ${CONFIG.NFK_NAME}! Visit Opensea.io to view it.`
        );
        setMintingNfk(false);
        dispatch(fetchData(blockchain.account));
      });
  };

  const decrementMintAmount = () => {
    let newMintAmount = mintAmount - 1;
    if (newMintAmount < 1) {
      newMintAmount = 1;
    }
    setMintAmount(newMintAmount);
  };

  const incrementMintAmount = () => {
    let newMintAmount = mintAmount + 1;
    if (newMintAmount > 5) {
      newMintAmount = 5;
    }
    setMintAmount(newMintAmount);
  };

  const getData = () => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      dispatch(fetchData(blockchain.account));
    }
  };

  const getConfig = async () => {
    const configResponse = await fetch("/config/config.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const config = await configResponse.json();
    SET_CONFIG(config);
  };

  useEffect(() => {
    getConfig();
  }, []);

  useEffect(() => {
    getData();
  }, [blockchain.account]);

  return (
    <s.Screen>
      <s.Container
        flex={1}
        ai={"center"}
        style={{ padding: 24, backgroundColor: "var(--primary)" }}
        image={CONFIG.SHOW_BACKGROUND ? "/config/images/bg.gif" : null}
      >
        <PunkKnightsLogo />

{/* ResponsiveWrapper */}

        <ResponsiveWrapper flex={1} style={{ padding: 24 }} test>
          <s.SpacerLarge />

          {/*Tab Show Position*/}
          <Tabs tabs={tabData} />

          <s.SpacerLarge />
        </ResponsiveWrapper>

        <s.SpacerMedium />
        <s.Container jc={"center"} ai={"center"} style={{ width: "70%" }}>
          <s.TextDescription
            style={{
              textAlign: "center",
              color: "var(--primary-text)",
            }}
          >
            CONTRACT ADDRESS:{" "}
            <StyledLink
              target={"_blank"}
              href={CONFIG.BLOCK_EXPLORER}
              cursor={"pointer"}
            >
              {truncate(CONFIG.CONTRACT_ADDRESS, 50)}
            </StyledLink>
          </s.TextDescription>
          <s.TextDescription
            style={{
              textAlign: "center",
              color: "var(--primary-text)",
            }}
          >
            Copyright © 2023 Punk Knights | Powered by Firechain
          </s.TextDescription>
        </s.Container>
      </s.Container>
    </s.Screen>
  );
}

export default App;
