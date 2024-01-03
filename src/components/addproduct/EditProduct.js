import React, { useEffect, useState } from 'react'
import { error_toast, success_toast } from '../../common/services';
import { get_login, logData, put_login } from '../../common/fetch';
import { TextField } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState({
    "name": "",
    "category": "",
    "price": 0,
    "description": "",
    "manufacturer": "",
    "availableItems": "",
    "imageUrl": ""
  })

  const editProduct =  () => {
    if (data.name.trim().length === 0 || data.category.trim().length === 0 ||
      Number(data.price)===0 || data.description.trim().length === 0 ||
      data.manufacturer.trim().length === 0 ||
      data.imageUrl.trim().length === 0
    ) {
      error_toast('Fill all the details');
      return;
    }
      put_login('/products/' + id, data)
      .then((res) => {
        success_toast('Updated successfully')
        navigate('/products')
      }).catch((e) => {
        console.log(e)
        error_toast('something went wrong')
      })


  }
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value })
  }
  const getProductData = async () => {
    await get_login('/products/' + id)
      .then((res) => {
        let a = res.data;
        setData({ ...data, name: a.name, category: a.category, price: a.price, manufacturer: a.manufacturer,
           description: a.description, availableItems: a.availableItems, imageUrl: a.imageUrl })
      }).catch((e) => {
        error_toast(e.response.data.message)
      })
  }
  useEffect(() => {
    getProductData();
  }, [id])
  useEffect(()=>{
    if (!logData()) {
      navigate('/login')
    } else {
    getProductData();
    }
  }, [id])
  return (
    <div>
      <form className='registerForm'>
        <h3 style={{ marginTop: '5px' }}>Modify Product</h3>
        <TextField name='name' label="Name" variant="outlined" value={data.name} onChange={(e) => { handleChange(e) }} />
        <TextField name='category' variant='outlined' label='Category' value={data.category} onChange={(e) => { handleChange(e) }} />
        <TextField name='manufacturer' variant='outlined' label='manufacturer' value={data.manufacturer} onChange={(e) => { handleChange(e) }} />
        <TextField name='price' type='number' variant='outlined' label='Price' value={data.price} onChange={(e) => { handleChange(e) }} />
        <TextField name='availableItems' variant='outlined' label='availableItems' value={data.availableItems} onChange={(e) => { handleChange(e) }} />
        <TextField name='imageUrl' variant='outlined' label='Image Url' value={data.imageUrl} onChange={(e) => { handleChange(e) }} />
        <TextField name='description' variant='outlined' label='description' value={data.description} onChange={(e) => { handleChange(e) }} />
        <button type='button' onClick={editProduct} className='loginBtn'>Modify Product</button>
      </form>
    </div>
  )
}

export default EditProduct