import React, { useEffect } from 'react'
import PropTypes from 'prop-types';

import MainLayout from '../components/Layouts/Main';

import LightsUi from '../components/LightsUi/LightsUi';
import WithData from '../components/Machine/WithData';
import ReconnectSnack from '../components/UI/ReconnectSnack';
import SettingsModal from '../components/Settings/SettingsModal';

const Index = function ({data_lights, data_switch, endpoint, socket, settings, user} ) {

    return (
        <MainLayout>
            <ReconnectSnack data_lights={data_lights} data_switch={data_switch} socket={socket} />
            


            <LightsUi data_lights={data_lights} data_switch={data_switch} socket={socket} endpoint={endpoint}/>
            
        </MainLayout>
    );
}

//does work when were being passed props 
Index.getInitialProps = async (ctx) => ({ user: ctx.query.user });

Index.propTypes = {
  user: PropTypes.shape({
    email: PropTypes.string.isRequired,
  }),
 };
 
 Index.defaultProps = {
  user: null,
 };

export default WithData(Index);