# eosio-dapp-router

Generates a static page (to be hosted on IPFS) for redirecting to a dapp URL registered in the eosio contract metadata.

The script iterates over given endpoints (passed in the URL as an IPFS address) and compares the results, so there is no need to trust a specific eos node.

## Example use cases

- Bookmark which redirects to a static DAO chosen frontend (content can also be hosted in IPFS)
- Contract developers can declare the recommended ui for the contract
- Website discovery without DNS

## Endpoint Hashes
- Mainnet endpoints hash: QmYzeayjNXdPxosFEYFDphMGwEzBX7s3vzK6sVaaECVxUB

- Kylin endpoints hash: QmZEMyJANVnjSDB6ujQLMbNQ56U65SG8nzx78wQ2SnouS1

[link to here](https://cloudflare-ipfs.com/ipfs/QmQKTi7QhYeLL9vmS6F4SYbBqX9q8Si6Q4abY3zgLf6K5v/#?endpoints=QmYzeayjNXdPxosFEYFDphMGwEzBX7s3vzK6sVaaECVxUB&name=cryptocoders)

## Project setup
```shell-script
yarn install
```
### Set Default App
```shell-script
TBD
```
### Set Default Endpoints
```shell-script
TBD
```
### Init local IPFS
```shell-script
npm run initipfs
```
### Deploy
```shell-script
npm run deploy
```
open browser at http://localhost:9090/ipfs/QmQKTi7QhYeLL9vmS6F4SYbBqX9q8Si6Q4abY3zgLf6K5v?#endpoints=QmYzeayjNXdPxosFEYFDphMGwEzBX7s3vzK6sVaaECVxUB&name=yourapp

or https://cloudflare-ipfs.com/ipfs/QmQKTi7QhYeLL9vmS6F4SYbBqX9q8Si6Q4abY3zgLf6K5v/#?endpoints=QmYzeayjNXdPxosFEYFDphMGwEzBX7s3vzK6sVaaECVxUB&name=yourapp

## Redeploy endpoint list
```shell-script
npx --no-install jsipfs add .\endpoints-kylin.list
npx --no-install jsipfs add .\endpoints-mainnet.list
```
## Contract Setup
### Contract support for metadata
Add the following code to your contract's class body:
```cpp
    TABLE meta { 
        name key; 
        std::string value; 
        uint64_t primary_key() const { return key.value; } 
    }; 
    typedef eosio::multi_index<"meta"_n, meta> _t_meta; 
    [[eosio::action]] 
    void setmeta(
        name key, 
        std::string value 
    ){ 
        require_auth(_self); 
        _t_meta items( _self, _self.value ); 
        auto existing = items.find( key.value ); 
        if(existing == items.end()) { 
            items.emplace(_self, [&]( auto& a ){ 
                a.key = key; 
                a.value = value; 
            }); 
        } else { 
            items.modify( *existing, eosio::same_payer, [&]( auto& a ) { 
                a.value = value; 
            }); 
        } 
    }       
```
### Call setmeta
```shell-script
cleos push action yourcontract setmeta "[\"frontend.url\", \"https://mywebsite.com\"]" -p yourcontract@active
```

- Frontend URL "frontend.url"

- Frontend code git "frontend.git"

- Contract code git "contract.git"