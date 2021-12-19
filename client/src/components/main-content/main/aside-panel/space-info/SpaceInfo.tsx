import React from 'react';
import './SpaceInfo.css'
import {useTypedSelector} from "../../../../../redux/hooks";
import {SpaceInfoStateType} from "../../../../../redux/reducers/spaceInfoReducer";

const SpaceInfo = () => {
    const {available_space, used_space} = useTypedSelector<SpaceInfoStateType>(state => state.spaceInfo)

    return (
        <div className={'space-info glass'}>
            <div className={'space-info__progress-bar'}>
                <div className="space-info__indicator" style={{width: `${used_space * 100 / available_space}%`}}></div>
            </div>
            <p className={'space-info__text'}>Занято {Math.ceil(used_space/1024/1024)} Мб из {Math.ceil(available_space/1024/1024)} Мб </p>
        </div>
    );
};

export default SpaceInfo;