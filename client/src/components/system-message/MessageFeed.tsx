import React from 'react';
import {useTypedSelector} from "../../redux/hooks";
import {MessagesStateType} from "../../redux/reducers/messagesReducer";

import './MessageFeed.css'
const MessageFeed = () => {
    const {messages} = useTypedSelector<MessagesStateType>(state => state.messages)

    return (
        <div className='message-box'>
            {messages.map(elem => {
                    return <div key={elem.id} className={`glass message ${elem.cssClass} ${elem.type}`}>{elem.message}</div>
                }
            )}
        </div>
    );
};

export default MessageFeed;