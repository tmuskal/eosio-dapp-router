# eosio-dapp-router
## Project setup
```
yarn install
```
### Set Default App
```
TBD
```
### Set Default Endpoints
```
TBD
```
### Init local IPFS
```
npm run initipfs
```
### Deploy
```
npm run deploy
```
open browser at http://localhost:9090/ipfs/QmNW73SkD3hcMWdpCEu6EiiHbzrxDh52PE4tNxw4RGZtJ2?#app=yourapp
or https://cloudflare-ipfs.com/ipfs/QmNW73SkD3hcMWdpCEu6EiiHbzrxDh52PE4tNxw4RGZtJ2/#?name=yourapp
or for kylin: https://cloudflare-ipfs.com/ipfs/QmNW73SkD3hcMWdpCEu6EiiHbzrxDh52PE4tNxw4RGZtJ2/#?name=yourapp&endpoints=QmZEMyJANVnjSDB6ujQLMbNQ56U65SG8nzx78wQ2SnouS1
## Redeploy Endpoint list
```
npx --no-install jsipfs add .\endpoints-kylin.list
npx --no-install jsipfs add .\endpoints-mainnet.list
```
## Contract Setup
### Contract support for metadata
Add the following code to your contract's class body:
```
struct metadata { 
  name    key; 
  string  value; 
  uint64_t primary_key() const { return key.value; } 
}; 
typedef eosio::multi_index<"meta"_n, metadata> _t_meta; 
[[eosio::action]] 
void setmeta(
  name    key, 
  string  value 
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
```
cleos push action yourcontract setmeta "[\"frontend.url\", \"https://mywebsite.com\"]" -p yourcontract@active
```

Frontend URL "frontend.url"

Frontend code git "frontend.git"

Contract code git "contract.git"_n