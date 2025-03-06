// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {VRFConsumerBaseV2Plus} from "@chainlink/contracts/src/v0.8/vrf/dev/VRFConsumerBaseV2Plus.sol";
import {VRFV2PlusClient} from "@chainlink/contracts/src/v0.8/vrf/dev/libraries/VRFV2PlusClient.sol";

// errors
error Vote__InsufficientEth();
error Vote__InvalidCandidateId();
error Vote__WinnerNotSelected();
error Vote__RequestNotFound();
error Vote__NoRequestsYet();

/**
 * @title Vote
 * @notice This contract enables users to place votes for pre-set candidates, which after generating a random
 * number between 0-2 (0, 1, 2) via Chainlink VRF, returns back whether the candidate the user voted for won
 */
contract Vote is VRFConsumerBaseV2Plus {
    // state variables

    address private _owner;

    // my subscription Id
    uint256 public s_subscriptionId;

    // past request Id's
    uint256[] public requestIds;

    // additional requirements
    bool public hasWinner;
    uint256 public constant ENTRANCE_FEE = 0.0001 ether;
    uint32 public constant CALLBACK_GAS_LIMIT = 100000;
    uint8 public constant REQUEST_CONFIRMATIONS = 3;
    uint8 public constant NUM_WORDS = 1;
    uint256 public randomWinnerId;

    bytes32 public keyHash =
        0x787d74caea10b2b357790d5b5247c2f63d1d91572a9846f780606e4d953677ae;

    string[] public candidates = [
        "Gregory the Gnome",
        "Bongo the Monkey",
        "Vladimir the Vampire"
    ];

    // events
    event UserVoted(address indexed user, uint256 candidateId);
    event RequestSent(uint256 requestId, uint32 numWords);
    event RequestFulfilled(uint256 requestId, uint256[] randomWords);
    event Winner(uint256 userCandidateId, uint256 winnerId, bool hasWon);
    event EntryReceived(address indexed user, uint256 amount);

    // structs

    struct RequestStatus {
        bool fulfilled;
        bool exists;
        uint256[] randomWords;
    }

    // mappings
    mapping(address => uint256) public userVotes;
    mapping(address => bool) public hasEntered;
    mapping(uint256 => RequestStatus) public s_requests;

    // constructor

    constructor(
        uint256 subscriptionId
    ) VRFConsumerBaseV2Plus(0x9DdfaCa8183c41ad55329BdeeD9F6A8d53168B1B) {
        s_subscriptionId = subscriptionId;
        _owner = msg.sender;
    }

    // functions

    function requestRandomWords() external returns (uint256 requestId) {
        randomWinnerId = 0;
        requestId = s_vrfCoordinator.requestRandomWords(
            VRFV2PlusClient.RandomWordsRequest({
                keyHash: keyHash,
                subId: s_subscriptionId,
                requestConfirmations: REQUEST_CONFIRMATIONS,
                callbackGasLimit: CALLBACK_GAS_LIMIT,
                numWords: NUM_WORDS,
                extraArgs: VRFV2PlusClient._argsToBytes(
                    VRFV2PlusClient.ExtraArgsV1({nativePayment: false})
                )
            })
        );

        s_requests[requestId] = RequestStatus({
            randomWords: new uint256[](0),
            exists: true,
            fulfilled: false
        });

        requestIds.push(requestId);

        emit RequestSent(requestId, NUM_WORDS);
        return requestId;
    }

    function fulfillRandomWords(
        uint256 _requestId,
        uint256[] calldata _randomWords
    ) internal override {
        if (!(s_requests[_requestId].exists)) {
            revert Vote__RequestNotFound();
        }

        s_requests[_requestId].fulfilled = true;
        s_requests[_requestId].randomWords = _randomWords;

        randomWinnerId = (_randomWords[0] % 3);

        hasWinner = true;
        emit RequestFulfilled(_requestId, _randomWords);
    }

    function getLastRequestId() public view returns (uint) {
        if (requestIds.length == 0) {
            revert Vote__NoRequestsYet();
        }

        return requestIds[requestIds.length - 1];
    }

    function getRequestStatus(
        uint256 _requestId
    ) external view returns (bool fulfilled, uint256[] memory randomWords) {
        if (!(s_requests[_requestId].exists)) {
            revert Vote__RequestNotFound();
        }
        RequestStatus memory request = s_requests[_requestId];
        return (request.fulfilled, request.randomWords);
    }

    function enterVote() public payable {
        if (msg.value < ENTRANCE_FEE) {
            revert Vote__InsufficientEth();
        }
        emit EntryReceived(msg.sender, msg.value);
    }

    function vote(uint candidateId) public {
        userVotes[msg.sender] = candidateId;
        emit UserVoted(msg.sender, candidateId);
    }

    function hasUserWon() public {
        if (!hasWinner) {
            revert Vote__WinnerNotSelected();
        }

        if (userVotes[msg.sender] == randomWinnerId) {
            emit Winner(userVotes[msg.sender], randomWinnerId, true);
        } else {
            emit Winner(userVotes[msg.sender], randomWinnerId, false);
        }
    }

    function withdraw() external {
        require(msg.sender == _owner, "Not the contract owner");
        require(address(this).balance > 0, "No ETH to withdraw");
        payable(_owner).transfer(address(this).balance);
    }
}
