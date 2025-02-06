import React from "react";
import contractServices from "../utils/contractServices";

const DepositWithdraw = ({ account }) => {
  return (
    <div>
      <button onClick={contractServices.withdraw}>Withdraw</button>
    </div>
  );
};

export default DepositWithdraw;
