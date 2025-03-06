// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {VRFConsumerBaseV2Plus} from "@chainlink/contracts/src/v0.8/vrf/dev/VRFConsumerBaseV2Plus.sol";
import {VRFV2PlusClient} from "@chainlink/contracts/src/v0.8/vrf/dev/libraries/VRFV2PlusClient.sol";

// errors
error Vote__InvalidCandidateId();
error Vote__WinnerNotSelected();
error Vote__RequestNotFound();
error Vote__NoRequestsYet();

/**
 * @title The mock vote contract
 * @notice This vote contract gets mock random values from the VRFCoordinatorV2_5Mock
 */

contract MockVote is VRFConsumerBaseV2Plus {
    bool public hasWinner;
    uint immutable s_subscriptionId;
    bytes32 immutable s_keyHash;
    uint32 constant CALLBACK_GAS_LIMIT = 100000;
    uint16 constant REQUEST_CONFIRMATIONS = 3;
    uint32 constant NUM_WORDS = 1;

    uint256[] public s_randomWords;
    uint256 public s_randomRange;
    uint256 public s_requestId;
    uint256 public randomWinnerId;

    string[] public candidates = [
        "Gregory the Gnome",
        "Bongo the Monkey",
        "Vladimir the Vampire"
    ];

    mapping(address => uint256) public userVotes;

    event ReturnedRandomness(uint256[] randomWords);
    event Winner(uint256 userCandidateId, uint256 winnerId, bool hasWon);

    constructor(
        uint256 subscriptionId,
        address vrfCoordinator,
        bytes32 keyHash
    ) VRFConsumerBaseV2Plus(vrfCoordinator) {
        s_keyHash = keyHash;
        s_subscriptionId = subscriptionId;
    }

    function requestRandomWords() external onlyOwner {
        randomWinnerId = 0;
        s_requestId = s_vrfCoordinator.requestRandomWords(
            VRFV2PlusClient.RandomWordsRequest({
                keyHash: s_keyHash,
                subId: s_subscriptionId,
                requestConfirmations: REQUEST_CONFIRMATIONS,
                callbackGasLimit: CALLBACK_GAS_LIMIT,
                numWords: NUM_WORDS,
                extraArgs: VRFV2PlusClient._argsToBytes(
                    VRFV2PlusClient.ExtraArgsV1({nativePayment: false})
                )
            })
        );
    }

    function fulfillRandomWords(
        uint256 /*requestId*/,
        uint256[] calldata randomWords
    ) internal override {
        s_randomWords = randomWords;
        randomWinnerId = (randomWords[0] % 3);
        // randomWinnerId = ((s_randomWords[s_randomWords.length - 1] + 1) % 3);

        hasWinner = true;
        emit ReturnedRandomness(randomWords);
    }

    function vote(uint candidateId) public {
        userVotes[msg.sender] = candidateId;
    }

    function hasUserWon() public {
        if (userVotes[msg.sender] == randomWinnerId) {
            emit Winner(userVotes[msg.sender], randomWinnerId, true);
        } else {
            emit Winner(userVotes[msg.sender], randomWinnerId, false);
        }
    }
}
