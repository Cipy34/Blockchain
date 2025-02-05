// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

abstract contract Withdrawable {
    mapping(address => uint) public pendingWithdrawals;

    event Withdrawal(address indexed to, uint amount);

    //Se adauga soldul ce poate fi retras
    function _addPendingWithdrawal(address recipient, uint amount) internal {
        pendingWithdrawals[recipient] += amount;
    }

    //Pentru a permite utilizatorului sa retraga sumele acumulate
    function withdraw() external {
        uint amount = pendingWithdrawals[msg.sender];
        require(amount > 0, "No funds available for withdrawal");
        pendingWithdrawals[msg.sender] = 0;
        payable(msg.sender).transfer(amount);
        emit Withdrawal(msg.sender, amount);
    }
}
