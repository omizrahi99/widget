#FactumPay
Lineascan URL: 
Abstracted Account:
https://goerli.lineascan.build/address/0x28A7f0977bbc4F698FE19408B33AbBC73D2191e8#code

Session Key Verifier Module:
https://goerli.lineascan.build/address/0xEc4dEDEFcD8f3EA993740113a96e90Cd03194b12#code


# FactumPay: How it Works

FactumPay is a payment widget for dApps. We collaborate with Metamask and Biconomy’s fiat gateway to swiftly set up and fund a new subscriber's wallet. We create a Biconomy smart account for the user, additionally generating a Biconomy session key for them.

## Session Keys

Session keys are a remarkable feature of Biconomy smart accounts. They act as temporary cryptographic keys that can be authorized to sign only a predetermined set of operations. This empowers users to share their session keys with dApps and other users, enabling operations on their behalf without jeopardizing security or self-custody.

Upon user subscription and permission agreement, the session key contract is initiated with these rigid permissions. The session key, wallet address, and some payment metadata are then forwarded to the client's backend.

The client's backend preserves a user data ledger, but notably, it's all pseudonymous, marking a departure from traditional web2 user management. The backend utilizes the session keys to notify user contracts regarding due payments. The session key inspects the payment's validity, and if legitimate, attempts to employ the smart account module to transfer the agreed funds to the Client's wallet. By consistently cross-referencing transaction addresses with the internal user ledger, the user's payment state is updated. This information is readily accessible by the client for efficient user permissions and content gating management.

---

# Technical Deep Dive on FactumPay

FactumPay is a subscription widget tailored for dApps. It capitalizes on Biconomy Smart Accounts and session keys to curate an intuitive and engaging user journey.

## Biconomy Smart Accounts

Biconomy Smart Accounts represent a unique digital wallet format, enabling users to engage with web3 applications without incurring gas fees. They stem from account abstraction, a novel Ethereum standard that distinguishes user accounts from transactional addresses.

## Session Keys

Session keys, integral to Biconomy Smart Accounts, are transient cryptographic keys, authorized for a specific set of operations. Users can securely share these keys with dApps and peers, allowing permitted operations without endangering their assets or privacy.

## How FactumPay Works

FactumPay operates by initiating a Biconomy Smart Account and session key for every new subscriber. This session key subsequently spawns a subscription contract, authorizing the FactumPay backend to alert the user's Smart Account when a payment is impending.

Emphasizing privacy, the FactumPay backend ledger retains pseudonymous user data, a stark contrast to traditional web2 user systems. This ensures that real identities remain confidential during payment processing.

Upon a user's payment date, the FactumPay backend employs the session key to ping the user's Smart Account. The Smart Account assesses the payment's authenticity and, if confirmed, endeavors to dispatch the settled funds to the client's wallet.

By methodically aligning transaction addresses with the internal ledger, the user's payment status is updated. Clients can then effortlessly fetch this data to regulate user access and content restrictions.

## Benefits of Using FactumPay

FactumPay offers a plethora of advantages to both dApps and their users:

- **Seamless User Experience**: Eliminate the hassles of gas fees and intricate Smart Account management.
- **Pseudonymous Payments**: Maintain user anonymity without compromising on transactional efficiency.
- **Flexible Subscription Options**: From recurring to one-time payments, FactumPay accommodates a diverse array.
- **Easy Integration**: Seamlessly merge FactumPay with pre-existing dApps.

# Sponsors

## Metamask
We use Metamasks sdk to quickly connect with, or create a user wallet when they want to subscribe. We get their wallet address and store this alongside information like their session key to maintain parity with the on chain user state

## Biconomy
Biconomy's Smart Account and Session Key are the cornerstone of FatumPay. They allow us to add timed payment permissions to smart contracts, powering all of factumpay



