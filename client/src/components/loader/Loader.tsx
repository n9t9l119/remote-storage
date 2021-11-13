import React from 'react';
import './Loader.css'
import {useTypedSelector} from "../../redux/hooks";
import {AppStateType} from "../../redux/reducers/appReducer";


const Loader = () => {
    const {loading} = useTypedSelector<AppStateType>(state => state.app)

    return (
        loading ?
            <div className={'loader-container'}>
                <div className={'loader-block'}>
                    <div className={'loader'}>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            </div> :
            null
    );
};

export default Loader;