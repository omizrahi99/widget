// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;
import "./ISessionValidationModule.sol";
import {ECDSA} from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract ERC20SessionValidationModule is ISessionValidationModule {
    uint256 public lastPaymentTimestamp;

    function validateSessionParams(
        address destinationContract,
        uint256 callValue,
        bytes calldata _funcCallData,
        bytes calldata _sessionKeyData,
        bytes calldata /*_callSpecificData*/
    ) external virtual override returns (address) {
        (
            address sessionKey,
            address recipient,
            uint256 subscriptionAmount
        ) = abi.decode(_sessionKeyData, (address, address, uint256));

        require(callValue == 0, "Non Zero Value");

        (address recipientCalled, uint256 amount) = abi.decode(
            _funcCallData[4:],
            (address, uint256)
        );

        require(recipient == recipientCalled, "Wrong Recipient");
        require(amount <= subscriptionAmount, "Max Amount Exceeded");
        return sessionKey;
    }

    function validateSessionUserOp(
        UserOperation calldata _op,
        bytes32 _userOpHash,
        bytes calldata _sessionKeyData,
        bytes calldata _sessionKeySignature
    ) external pure override returns (bool) {
        require(
            bytes4(_op.callData[0:4]) == EXECUTE_OPTIMIZED_SELECTOR ||
                bytes4(_op.callData[0:4]) == EXECUTE_SELECTOR,
            "Invalid Selector"
        );
        (
            address sessionKey,
            address recipient,
            uint256 subscriptionAmount
        ) = abi.decode(_sessionKeyData, (address, address, uint256));
        
        require(block.timestamp - lastPaymentTimestamp >= 30 days, "Payment can only be made once a month");
        lastPaymentTimestamp = block.timestamp;

        {
            (uint256 callValue, ) = abi.decode(
                _op.callData[4:], // skip selector
                (uint256, bytes)
            );
            if (callValue != 0) {
                revert("Non Zero Value");
            }
        }

        bytes calldata data;

        {
            uint256 offset = uint256(bytes32(_op.callData[4 + 64:4 + 96]));
            uint256 length = uint256(
                bytes32(_op.callData[4 + offset:4 + offset + 32])
            );
            data = _op.callData[4 + offset + 32:4 + offset + 32 + length];
        }

        (address recipientCalled, uint256 amount) = abi.decode(
            data[4:],
            (address, uint256)
        );

        if (recipientCalled != recipient) {
            revert("Wrong Recipient");
        }
        if (amount > subscriptionAmount) {
            revert("Max Amount Exceeded");
        }
        
        return
            ECDSA.recover(
                ECDSA.toEthSignedMessageHash(_userOpHash),
                _sessionKeySignature
            ) == sessionKey;
    }
}
