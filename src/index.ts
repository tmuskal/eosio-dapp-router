import { JsonRpc } from 'eosjs';

async function load(){    
    const hashAddr = window.location.hash.substr(1);    
    const hashParamsParts = hashAddr.split('?');
    let hashParams = {};
    if(hashParamsParts.length > 1){
    hashParams = hashParamsParts[1].split("&")
        .map(v => v.split("="))
        .reduce( (pre, [key, value]) => ({ ...pre, [key]: value }), {} );
    }
    let appName = hashParams['name']; // autorediect if exists
    let endpointsHash = hashParams['endpoints']; // ipfshash  
    const ipfsPrefix = `/ipfs/`;
    
    // if(!endpointsHash){
    //     endpointsHash = 'QmYCRZMziBHofYrd1NUTpJdecQxwdMLhZFZM5epoTfxTo8';
    // }
    const endpointsListResp = await fetch(ipfsPrefix + endpointsHash);
    const endpointsListText = await endpointsListResp.text();
    const enspointsList = endpointsListText.split('\n');
    const endpoints = enspointsList.map(endpoint=>new JsonRpc(`${window.location.protocol}//${endpoint}`, { fetch }));    
    // resolve metadata for appName from all endpoints
    try{        
        const results = await endpoints[0].get_table_rows({
            json: true,               // Get the response as json
            code: appName,      // Contract that we target
            scope: appName,         // Account that owns the data
            lower_bound: "frontend.url",
            table: 'meta',        // Table name
            limit: 1,                // Maximum number of rows that we want to get
            reverse: false,           // Optional: Get reversed data
            show_payer: false          // Optional: Show ram payer
        });      
        if(results.rows.length && results.rows[0].key == "frontend.url"){
            const appUrl = results.rows[0].value;
            window.location.href = appUrl;        
        }
        else {
            alert(`frontend metadata(frontend.url) for ${appName} is missing`);
        }
    }
    catch(e){
        alert(`frontend metadata for ${appName} is missing`);
    }
}
load().then(a=>{});