import 'isomorphic-unfetch';

async function getVariables(){
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

async function setVariables( switchVariables){
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

async function addVariable(switchVariable){
    const route = '/switch/addSwitchVariable';
    try {
        var response = await fetch(route,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ switchVariable: switchVariable})
            });
        return response.ok;
    }catch (error) {
        console.log(error);
        throw error; 
    }
}

async function removeVariable(switchVariable_id){
    const route = '/switch/removeSwitchVariable';
    try {
        var response = await fetch(route,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: switchVariable_id})
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