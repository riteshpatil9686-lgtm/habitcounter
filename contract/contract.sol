// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract HabitCounter {

    // Stores the number of times you completed your habit
    uint public count;

    // When contract is deployed, count starts at 0
    constructor() {
        count = 0;
    }

    // Call this when you complete your habit
    function done() public {
        count = count + 1;
    }

    // Reset your habit count to 0
    function reset() public {
        count = 0;
    }

    // View current habit count
    function getCount() public view returns (uint) {
        return count;
    }
}
