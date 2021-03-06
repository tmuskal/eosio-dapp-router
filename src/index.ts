import { JsonRpc } from 'eosjs';
async function loadFrom(eos, appName){
    try{

        const results = await eos.get_table_rows({
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
            return appUrl;
        }
    }
    catch(e){
    }
    return null;

}

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
    const endpointsListResp = await fetch(ipfsPrefix + endpointsHash);
    const endpointsListText = await endpointsListResp.text();
    const enspointsList = endpointsListText.split('\n');
    const endpoints = enspointsList.map(endpoint=>new JsonRpc(`${window.location.protocol}//${endpoint}`, { fetch }));    
    document.getElementById('endpointsContainer').innerHTML = enspointsList.join('<br/>');
    document.getElementById('appname').innerHTML = appName;
    
    // resolve metadata for appName from all endpoints
    let message = 'Status: ';
    try{
        const results = await Promise.all(endpoints.map(e=>loadFrom(e,appName)));                
        const resultsHist = {};
        let topRes = null;
        let maxRes = 0;
        results.forEach(result => {            
            if(result){
                message += '.';
                if(!resultsHist[result])
                    resultsHist[result] = 0;
                
                if(++resultsHist[result] > maxRes){
                    topRes = result;
                    maxRes = resultsHist[result];
                }
            }
            else{
                message += 'x';
            }
        });
        message += `<br/>`;
        if(topRes){
            message += `Redirecting to ${topRes}`;
            window.location.href = topRes;        
        }
        else {
            message += `Frontend metadata(frontend.url) for ${appName} is missing`;
        }
        document.getElementById('message').innerHTML = message;
    }
    catch(e){
        message += `Frontend metadata for ${appName} is missing`;        
    }
}
load().then(a=>{});