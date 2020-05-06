import React, { useEffect } from 'react'
import PropTypes from 'prop-types';

import MainLayout from '../components/Layouts/Main';

import LightsUi from '../components/LightsUi/LightsUi';
import WithData from '../components/Machine/WithData';
import ReconnectSnack from '../components/UI/ReconnectSnack';
//import ModeSettingsModal from '../components/Settings/ModeSettingsModal';

const Index = function ({data_lights, data_switch, endpoint, socket, settings} ) {

    return (
        <MainLayout>
            <ReconnectSnack data_lights={data_lights} data_switch={data_switch} socket={socket} />
            {/*<ModeSettingsModal endpoint={endpoint} socket={socket} />*/}


            <LightsUi data_lights={data_lights} data_switch={data_switch} socket={socket} endpoint={endpoint}/>
            
        </MainLayout>
    );
}

//does work when were being passed props 
Index.getInitialProps = async ({ query }) => ({ settings: query.settings });

Index.propTypes = {
  settings: PropTypes.shape({
    results: PropTypes.array.isRequired,
  }),
};

Index.defaultProps = {
  settings: null,
};

export default WithData(Index);