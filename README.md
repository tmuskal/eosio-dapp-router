# eosio-dapp-router
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
open browser at http://localhost:9090/ipfs/QmXf13DPX7ULuKpve3DU6KwZ37oMXFmCjhZG1LrctbfX4H?#endpoints=QmYCRZMziBHofYrd1NUTpJdecQxwdMLhZFZM5epoTfxTo8&name=yourapp

or https://cloudflare-ipfs.com/ipfs/QmXf13DPX7ULuKpve3DU6KwZ37oMXFmCjhZG1LrctbfX4H/#?endpoints=QmYCRZMziBHofYrd1NUTpJdecQxwdMLhZFZM5epoTfxTo8&name=yourapp

or for kylin: https://cloudflare-ipfs.com/ipfs/QmXf13DPX7ULuKpve3DU6KwZ37oMXFmCjhZG1LrctbfX4H/#?endpoints=QmZEMyJANVnjSDB6ujQLMbNQ56U65SG8nzx78wQ2SnouS1&name=yourapp
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