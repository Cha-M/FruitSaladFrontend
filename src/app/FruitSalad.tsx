"use client";

import React, { useEffect, useState, FC } from "react";
import fruitSaladAbi from "./abi/FruitSalad.json";
import { MetaMaskInpageProvider } from "@metamask/providers";
import { ethers, Contract, formatEther } from "ethers";

declare global {
  interface Window {
    ethereum?: MetaMaskInpageProvider;
  }
}

const fruitSaladAddress = "0x48c17bc0409C0ab9f9B777D8b068831C9593eEfa";

interface AccountProps {
  account: string | null;
  balance: string | null;
  refreshBalances(): any;
}

const Account = ({ account, balance, refreshBalances }: AccountProps) =>
  account ? (
    <div className="w-full flex h-auto flex-col lg:flex-row text-sm lg:space-x-2 space-y-2 lg:space-y-0">
      <div className="w-full rounded-lg bg-gray-100 p-4 shadow-md break-words md:whitespace-nowrap flex-initial">
        Account: {account}
      </div>
      <div className="w-full rounded-lg bg-gray-100 p-4 shadow-md lg:whitespace-nowrap flex-initial">
        Balance: {balance}
      </div>
      <button
        onClick={refreshBalances}
        className="rounded-lg bg-blue-200 hover:bg-blue-100 p-4 font-bold shadow-md whitespace-nowrap flex-1"
      >
        Refresh
      </button>
    </div>
  ) : (
    //do this styling
    <div className="w-full max-w-5xl flex-row text-sm lg:flex space-x-2">
      <div className="w-full rounded-lg bg-gray-100 p-4 shadow-md whitespace-nowrap flex-initial">
        No account selected. lease connect an account through your{" "}
        <a href="https://metamask.io/download/">
          <u>MetaMask</u>
        </a>{" "}
        wallet to continue.
      </div>
    </div>
  );

interface FruitExchangeProps {
  saladFruits: {
    Mango: string;
    Orange: string;
    Banana: string;
    Peach: string;
    Grape: string;
    FruitSalad: string;
  };
  buyOneSaladFruit(): any;
  makeFruitSalad(): any;
  defaultAccount: string | null;
}

const FruitExchange = ({
  saladFruits,
  buyOneSaladFruit,
  makeFruitSalad,
  defaultAccount,
}: FruitExchangeProps) => (
  //space-y-2 lg:space-y-0
  <div className="w-full max-w-5xl items-center justify-between text-sm lg:flex mt-2 space-y-2 lg:space-y-0">
    <div className="w-full lg:w-auto">
      <button
        disabled={defaultAccount === null}
        onClick={buyOneSaladFruit}
        className="disabled:bg-gray-100 disabled:text-gray-500 rounded-lg bg-blue-200 hover:bg-blue-100 p-4 font-bold shadow-md w-full lg:w-auto"
      >
        Buy fruit
      </button>
    </div>
    <div className="space-y-2">
      <div className="rounded-lg bg-gray-100 p-4 w-30 shadow-md">
        🥭 Mangoes: {saladFruits.Mango}
      </div>
      <div className="rounded-lg bg-gray-100 p-4 w-30 shadow-md">
        🍊 Oranges: {saladFruits.Orange}
      </div>
      <div className="rounded-lg bg-gray-100 p-4 w-30 shadow-md">
        🍌 Bananas: {saladFruits.Banana}
      </div>
      <div className="rounded-lg bg-gray-100 p-4 w-30 shadow-md">
        🍑 Peaches: {saladFruits.Peach}
      </div>
      <div className="rounded-lg bg-gray-100 p-4 w-30 shadow-md">
        🍇 Grapes: {saladFruits.Grape}
      </div>
    </div>
    <button
      disabled={defaultAccount === null}
      onClick={makeFruitSalad}
      className="disabled:bg-gray-100 disabled:text-gray-500 w-full lg:w-auto rounded-lg bg-blue-200 hover:bg-blue-100 p-4 font-bold shadow-md"
    >
      Mix fruit
    </button>
    <div className="rounded-lg bg-gray-100 p-4 w-30 shadow-md">
      🥣 FruitSalad: {saladFruits.FruitSalad}
    </div>
  </div>
);

const FruitSalad = () => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [defaultAccount, setDefaultAccount] = useState<string | null>(null);
  const [fruitSaladContract, setFruitSaladContract] = useState<Contract | null>(
    null
  );
  const [fruitSaladContractWithSigner, setFruitSaladContractWithSigner] =
    useState<Contract | null>(null);
  const [etherBalance, setEtherBalance] = useState<string>("?");

  const [saladFruits, setSaladFruits] = useState<{
    Mango: string;
    Orange: string;
    Banana: string;
    Peach: string;
    Grape: string;
    FruitSalad: string;
  }>({
    Mango: "?",
    Orange: "?",
    Banana: "?",
    Peach: "?",
    Grape: "?",
    FruitSalad: "?",
  });

  const connectWallet = () => {
    if (window.ethereum) {
      window.ethereum
        .request({
          method: "eth_requestAccounts",
        })
        .then((result: any) => {
          changeAccount(result[0]);
          setErrorMessage("Wallet connected");
        });
    } else {
      setErrorMessage("Need to install MetaMask");
    }
  };

  const changeAccount = (newAccount: string) => {
    setDefaultAccount(newAccount);
    updateContracts();
  };

  const updateContracts = async () => {
    if (window.ethereum) {
      let _provider: ethers.BrowserProvider = new ethers.BrowserProvider(
        window.ethereum
      );
      let _signer: ethers.JsonRpcSigner = await _provider.getSigner();
      let sepoliaProvider = ethers.getDefaultProvider("sepolia");

      setFruitSaladContract(
        new Contract(fruitSaladAddress, fruitSaladAbi, sepoliaProvider)
      );
      setFruitSaladContractWithSigner(
        new Contract(fruitSaladAddress, fruitSaladAbi, _signer)
      );
    }
  };

  const refreshBalances = async () => {
    if (
      window.ethereum &&
      defaultAccount &&
      fruitSaladContractWithSigner &&
      fruitSaladContract
    ) {
      try {
        let _provider: ethers.BrowserProvider = new ethers.BrowserProvider(
          window.ethereum
        );
        setEtherBalance(
          `${formatEther(await _provider.getBalance(defaultAccount))} ETH`
        );

        setSaladFruits({
          Mango: `${await fruitSaladContractWithSigner.balanceOf(
            defaultAccount,
            0
          )}`,
          Orange: `${await fruitSaladContractWithSigner.balanceOf(
            defaultAccount,
            1
          )}`,
          Banana: `${await fruitSaladContractWithSigner.balanceOf(
            defaultAccount,
            2
          )}`,
          Peach: `${await fruitSaladContractWithSigner.balanceOf(
            defaultAccount,
            3
          )}`,
          Grape: `${await fruitSaladContractWithSigner.balanceOf(
            defaultAccount,
            4
          )}`,
          FruitSalad: `${await fruitSaladContractWithSigner.balanceOf(
            defaultAccount,
            5
          )}`,
        });
      } catch (error) {
        console.error("refreshBalances catch", error);
      }
    }
  };

  const buyOneSaladFruit = async () => {
    if (fruitSaladContractWithSigner) {
      try {
        const oneFruitUpdate: any = await fruitSaladContractWithSigner.buyFruit(
          1,
          {
            value: 500000000000000,
          }
        );
        await oneFruitUpdate.wait();
      } catch (error) {
        console.error("buyTenSaladFruit catch", error);
      }
    }
  };

  const makeFruitSalad = async () => {
    if (fruitSaladContractWithSigner) {
      try {
        const fruitSaladUpdate: any =
          await fruitSaladContractWithSigner.makeFruitSalad(1);
        await fruitSaladUpdate.wait();
      } catch (error) {
        console.error("fruitSaladUpdate catch", error);
      }
    }
  };

  useEffect(() => {
    connectWallet();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="w-full max-w-5xl flex-col text-sm lg:flex space-y-4">
      <Account
        account={defaultAccount}
        balance={etherBalance}
        refreshBalances={refreshBalances}
      />
      <FruitExchange
        saladFruits={saladFruits}
        buyOneSaladFruit={buyOneSaladFruit}
        makeFruitSalad={makeFruitSalad}
        defaultAccount={defaultAccount}
      />
    </div>
  );
};
export default FruitSalad;
