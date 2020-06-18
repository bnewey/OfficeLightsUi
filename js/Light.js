import 'isomorphic-unfetch';

async function getVariables(){
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

async function setVariables( lightVariables){
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

async function addVariable(lightVariable){
    const route = '/light/addLightVariable';
    try {
        var response = await fetch(route,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ lightVariable: lightVariable})
            });
        return response.ok;
    }catch (error) {
        console.log(error);
        throw error; 
    }
}

async function removeVariable(lightVariable_id){
    const route = '/light/removeLightVariable';
    try {
        var response = await fetch(route,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: lightVariable_id})
            });
        return response.ok;
    }catch (error) {
        console.log(error);
        throw error; 
    }
}

module.exports = {
    getVariables: getVariables,
    setVariables: setVariables,
    addVariable: addVariable,
    removeVariable: removeVariable,
};