// Filename - Tabs.js

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Tab from "./Tab";
import "../../App.css";
import * as s from "../../styles/globalStyles";
import styled from "styled-components";


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

const Tabs = ({ tabs }) => {
	const [activeTab, setActiveTab] = useState(1);
    console.log(activeTab)
    const data = useSelector((state) => state.data);
    const blockchain = useSelector((state) => state.blockchain);
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
	const handleTabClick = (index) => {
		setActiveTab(index + 1);
	};

	return (
		<div className="tabs-container">
			<div className="tabs">
				{tabs.map((tab, index) => (
					<Tab
						key={index}
						label={tab.label}
						onClick={() =>
							handleTabClick(index)
						}
						isActive={index === activeTab}
					/>
				))}
			</div>
			<div className="tab-content">
                {activeTab === 1 && 
                    <s.Container
            flex={2}
            jc={"center"}
            ai={"center"}
            style={{
              backgroundColor: "var(--accent)",
              padding: 24,
              borderRadius: 24,
              border: "4px solid var(--secondary)",
              boxShadow: "0px 5px 11px 2px rgba(0,0,0,0.7)",
            }}
          >
            <s.MintStatusTitle
              style={{
                textAlign: "center",
                fontWeight: "bold",
                color: "var(--accent-text)",
              }}
            >
              Punk Knights dApp
            </s.MintStatusTitle>
            <s.StatusDescription
              style={{
                textAlign: "center",
                color: "var(--primary-text)",
              }}
            >
              Minting is now open for the public with a maximum mint amount of 5
              knights
            </s.StatusDescription>
            <s.SpacerSmall />
            <StyledImg alt={"example"} src={"/config/images/example.gif"} />
            <s.KnightSupply
              style={{
                textAlign: "center",
                fontWeight: "bold",
                color: "var(--accent-text)",
              }}
            >
              {data.totalSupply} / {CONFIG.MAX_KNIGHTS}
            </s.KnightSupply>
            <s.SpacerSmall />
            {Number(data.totalSupply) >= CONFIG.MAX_KNIGHTS ? (
              <>
                <s.TextTitle
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                  The sale has ended.
                </s.TextTitle>
                <s.TextDescription
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                  You can still find {CONFIG.NFK_NAME} on
                </s.TextDescription>
                <s.SpacerSmall />
                <StyledLink target={"_blank"} href={CONFIG.MARKETPLACE_LINK}>
                  {CONFIG.MARKETPLACE}
                </StyledLink>
              </>
            ) : (
              <>
                <s.TextTitle
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                  {CONFIG.SYMBOL} costs {CONFIG.NFK_PRICE}{" "}
                  {CONFIG.NETWORK.SYMBOL}.
                </s.TextTitle>
                <s.SpacerSmall />

                {blockchain.account === "" ||
                blockchain.smartContract === null ? (
                  <s.Container ai={"center"} jc={"center"}>
                    <s.TextDescription
                      style={{
                        textAlign: "center",
                        color: "var(--accent-text)",
                      }}
                    >
                      Connect Wallet to the {CONFIG.NETWORK.NAME} network
                    </s.TextDescription>
                    <s.SpacerSmall />
                    <StyledButton
                      onClick={(e) => {
                        e.preventDefault();
                        dispatch(connect());
                        getData();
                      }}
                    >
                      CONNECT WALLET
                    </StyledButton>
                    {blockchain.errorMsg !== "" ? (
                      <>
                        <s.SpacerSmall />
                        <s.TextDescription
                          style={{
                            textAlign: "center",
                            color: "var(--accent-text)",
                          }}
                        >
                          {blockchain.errorMsg}
                        </s.TextDescription>
                      </>
                    ) : null}
                  </s.Container>
                ) : (
                  <>
                    <s.TextDescription
                      style={{
                        textAlign: "center",
                        color: "var(--accent-text)",
                      }}
                    >
                      {feedback}
                    </s.TextDescription>
                    <s.SpacerMedium />
                    <s.Container ai={"center"} jc={"center"} fd={"row"}>
                      <StyledRoundButton
                        style={{ lineHeight: 0.4 }}
                        disabled={mintingNfk ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          decrementMintAmount();
                        }}
                      >
                        -
                      </StyledRoundButton>
                      <s.SpacerMedium />
                      <s.TextDescription
                        style={{
                          textAlign: "center",
                          fontSize: "250%",
                          color: "var(--accent-text)",
                        }}
                      >
                        {mintAmount}
                      </s.TextDescription>
                      <s.SpacerMedium />
                      <StyledRoundButton
                        disabled={mintingNfk ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          incrementMintAmount();
                        }}
                      >
                        +
                      </StyledRoundButton>
                    </s.Container>
                    <s.SpacerSmall />
                    <s.Container ai={"center"} jc={"center"} fd={"row"}>
                      <StyledButton
                        disabled={mintingNfk ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          mintNFKs();
                          getData();
                        }}
                      >
                        {mintingNfk ? "MINTING KNIGHTS" : "MINT KNIGHTS"}
                      </StyledButton>
                    </s.Container>
                  </>
                )}
              </>
            )}
                    </s.Container>
                }
			</div>
            
		</div>
	);
};

export default Tabs;
