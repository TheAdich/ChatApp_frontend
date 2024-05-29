import React from 'react'
import '../../staticCss/chat.css'
import logo from '../../assets/logo.jpg'
import { NavLink } from 'react-router-dom'
import axios from 'axios'
const Header = ({user,setProfilePageopen}) => {

  return (
    <div className='chat_header'>
        <div className='chat_name_logo'>
            <img className='chat_logo' src={logo}></img>
            <div className='chat_name'>Sharinghan</div>
        </div>
        <div className='chat_toolbar'>
            <NavLink className='create_grp_btn' to='/creategroup'>Create a group</NavLink>
            <img className='bell' src={user?user.pic:logo}></img>
            <p style={{'cursor':'pointer'}} className='username' onClick={()=>setProfilePageopen((prev)=> !prev)}>{user && user.name}</p>
            <p className='logout' >Logout</p>
        </div>
    </div>
  )
}

export default Header