import 'isomorphic-unfetch';

async function getLightVariables(){
    const route = '/light/getLightVariables';
    try{
        var data = await fetch(route,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        if(!data.ok){
            throw new Error("getLightVariables returned empty list or bad query")
        }
        var list = await data.json();
        return(list);
    }catch(error){
        throw error;
    }

}

async function setLightVariables( lightVariables){
    const route = '/light/setLightVariables';
    try{
        var response = await fetch(route,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ lightVariables: lightVariables})
            });
        return response.ok;
    }catch(error){
        console.log(error);
        throw error;
    }

}

module.exports = {
    getLightVariables: getLightVariables,
    setLightVariables: setLightVariables,
};