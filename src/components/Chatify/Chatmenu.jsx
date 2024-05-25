import React, { useState, useEffect,useMemo,useRef } from 'react'
import '../../staticCss/chat.css'
import profile from '../../assets/profile.svg'
import axios from 'axios'
import Loading from '../../Loader/Loading';
import { useNavigate } from 'react-router-dom';
const Chatmenu = ({ chat, getId,user,socket}) => {
    const admin=user;
    const navigateTo = useNavigate();
    const [data, setdata] = useState(null);
    const [loading, setLoading] = useState(true);
    const token = sessionStorage.getItem('jwt');
    const [msg, setmsg] = useState("");
    const [displayMsg,setDisplayMsg]=useState([]);
    const chatDisplayRef = useRef(null);

    useEffect(()=>{
        socket.on('getMessage',(msg)=>{
            setDisplayMsg((prev)=> [...prev,msg]);
            scrollToBottom();

        })
        return ()=>{
            socket.off('getMessage');
        }
    },[socket])
    
    useEffect(() => {
        const fetchUserChat = async () => {
            const instance = axios.create({
                baseURL: `${process.env.REACT_APP_BACKEND}/api/chat`,
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `${token}`
                }
            })
            try {
                if (getId) {
                    const res = await instance.post('/userChat', { id: getId });
                    if (res.data) {
                        setDisplayMsg(res.data.messages);
                        setdata(res.data);
                    }
                    setLoading(false);

                }

            } catch (err) {
                console.log(err);
                setLoading(false);
            }
        }
        fetchUserChat();
    }, [getId])

    const scrollToBottom = () => {
        if (chatDisplayRef.current) {
            chatDisplayRef.current.scrollTop = chatDisplayRef.current.scrollHeight;
        }
    };
    
    const redirectTorename=(data)=>{
        if(data.groupAdmin===admin._id.toString()){
        navigateTo(`/renamegroup?q=${data._id}`);}
        else alert('Only admin can edit grp details!');
    }

    const postMessage = async (e) => {
        e.preventDefault();
        const instance = axios.create({
            'baseURL': `${process.env.REACT_APP_BACKEND}/api/msg`,
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `${token}`
            }
        })
        try{
            const res=await instance.post('/postmessage',{id:getId,content:msg});
           // console.log(res.data);
            if (res.data) {
                setDisplayMsg((prevMsgs) => [...prevMsgs, res.data]);
                scrollToBottom();
                socket.emit('newMessage',{msg:res.data, room:getId});
            }
        }catch(err){
            console.log(err);
        }
        setmsg("");
    }

    return (
        <div className='user_chat_window'>
            <div className='user_chat_header'>
                <img src={data?data.pic:profile} style={{ width: '3.5vw', "marginLeft":"1rem" ,"borderRadius":"50%" }}></img>
                <p style={{ "marginLeft": "1rem", "fontSize": "1.2rem" }}>{data ? data.chatName : "Username"}</p>
                {data && data.isGroupChat===true?<button className='edit_grp_btn' onClick={()=>redirectTorename(data)}>Edit Group info</button>:""}
            </div>
            {getId !== undefined ? <div className='chat_display_section' ref={chatDisplayRef}>
                {loading ? <Loading /> :
                    data && displayMsg.length > 0 ?
                    displayMsg.map((e,ind) => (
                            <div key={ind} className='msg_box' >
                                <p>{e.sender.name}:</p><p>{e.content}</p>
                            </div>
                        )) : <div className='msg_box'><p>No messages yet</p></div>
                }
            </div> : "Click on chat to start conversation"}

            {getId !== undefined ? <form className='chat_type_box' onSubmit={(e) => postMessage(e)}>
                <input type='text' placeholder='Type Something' style={{'fontSize':'1.3rem'}} value={msg} onChange={(e) => setmsg(e.target.value)}></input>
                <button className='post_btn' type='submit' value='post'>Post</button>
            </form> : ""}
        </div>
    )
}

export default Chatmenu