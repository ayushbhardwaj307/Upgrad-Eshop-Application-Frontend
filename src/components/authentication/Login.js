import React, { useState } from 'react'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { error_toast, success_toast } from '../../common/services';
import { post_data } from '../../common/fetch';
import { TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
const Login = () => {
  const navigate = useNavigate()
  const [data, setData] = useState({
    "username": "",
    "password": "",
  })

  const signIn = async () => {
    if (data.username.trim().length === 0 || data.password.trim().length === 0) {
      error_toast('Fill all the details');
      return;
    }
    await post_data('/auth/signin', data, {})
      .then((res) => {
        localStorage.setItem('token', res.data.token)
        localStorage.setItem('role', res.data.role)
        success_toast('Login Successfully.')
        navigate('/products')
      }).catch((e) => {
        error_toast(e.response.data.message)
      })
  }
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value })
  }
  return (
    <div>
      <form className='registerForm'>
        <span><LockOutlinedIcon /></span>
        <h3 style={{ marginTop: '5px',textAlign:'center' }}>Sign In</h3>
        <TextField type="email" name='username' variant='outlined' label='Email Address*' onChange={(e) => { handleChange(e) }} />
        <TextField type="password" name='password' variant='outlined' label='Password*' onChange={(e) => { handleChange(e) }} />
        <button type='button' onClick={signIn} className='loginBtn'>SIGN IN</button>
      </form>
    </div>
  )
}

export default Login