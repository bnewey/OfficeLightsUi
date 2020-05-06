import 'isomorphic-unfetch';

async function getSwitchVariables(){
    const route = '/switch/getSwitchVariables';
    try{
        var data = await fetch(route,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        if(!data.ok){
            throw new Error("getSwitchVariables returned empty list or bad query")
        }
        var list = await data.json();
        return(list);
    }catch(error){
        throw error;
    }

}

async function setSwitchVariables( switchVariables){
    const route = '/switch/setSwitchVariables';
    try{
        var response = await fetch(route,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ switchVariables: switchVariables})
            });
        return response.ok;
    }catch(error){
        console.log(error);
        throw error;
    }

}

module.exports = {
    getSwitchVariables: getSwitchVariables,
    setSwitchVariables: setSwitchVariables,
};