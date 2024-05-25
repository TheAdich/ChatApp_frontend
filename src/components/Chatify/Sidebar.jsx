import React, { useState,useEffect,useMemo } from 'react'
import '../../staticCss/chat.css'
import profile from '../../assets/profile.svg'
import srchIcon from '../../assets/search.png';
import { useSelector } from 'react-redux'

const Sidebar = ({ chat, setGetid, setSearchBox,user,socket }) => {

    
    const [socketid,setSocketid]=useState();
  useEffect(()=>{
    socket.on('connect',()=>{
        setSocketid(socket.id);
  })
    
    //socket.on("welcomeEvent", (msg) => {
    //  console.log(msg); 
    //});

      return () => {
        socket.off('welcomeEvent');
        socket.disconnect();
      };
  },[socket])

  const handleGetid = (e) => {
    setGetid(e._id);
    socket.emit('joinChat',e._id);
    
}
const handleUserSearch = () => {
    setSearchBox(prev => !prev);
}


    return (
        <div className='sidebar_section'>
            <div className='searchIcon' onClick={()=>handleUserSearch()}>
                <p style={{'fontSize':'1.6rem'}}>Search User</p>
                <img src={srchIcon} style={{'width':'1.8rem','marginLeft':'0.5rem'}}></img>
            </div>
            <div className='all_users'>
                {chat.map((e) => (
                    <div key={e._id} className='sidebar_user' onClick={() => handleGetid(e)}>
                        <img src={e.pic} style={{ width: '3vw','height':'3vw', "border":'none','borderRadius':'50%'}}></img>
                        <div className='user_attribute'>
                            <p>{e.chatName}</p>
                            {e.messages[0] ? <p>{e.messages[0].content.slice(0, 15) + "..."}</p> : <p>Type something to chat!</p>}
                        </div>
                        <div className='status'>online</div>
                    </div>
                ))}

            </div>
        </div>
    )
}

export default Sidebar