import React, { useEffect, useState } from 'react'
import { delete_login, get_login, logData } from '../../common/fetch'
import { useLocation, useNavigate } from 'react-router-dom';
import { error_toast, success_toast, confirm_toast } from '../../common/services';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import './home.css'
import { MenuItem, TextField, ToggleButton, ToggleButtonGroup } from '@mui/material';
const Home = () => {
  const loggdata = logData();
  const location = useLocation();
  const navigate = useNavigate();
  const [products1, setProducts1] = useState([])
  const [products, setProducts] = useState([])
  const [categeries, setCategories] = useState(['ALL'])

  const [alignment, setAlignment] = useState('ALL');
  const handleChange = (event, newAlignment) => {
    if (newAlignment === 'ALL') {
        getProducts();
    } else {
      let a = [...products1]
      a = a.filter((e, i) => e.category === newAlignment)
      setProducts(a)
    }
    setAlignment(newAlignment);
  };
  const getProducts = async () => {
    await get_login('/products')
      .then((res) => {
        setProducts1(res.data)
        setProducts(res.data)
      }).catch((e) => {
        error_toast(e.response.data.message)
      })
  }
  const handleSort = (e) => {
    console.log(e.target.value)
    let a = [...products]
    if (e.target.value === 'asc') {
      a.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
      setProducts(a)
    }
    if (e.target.value === 'desc') {
      a.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
      setProducts(a)
    }
    if (e.target.value === 'new') {
      a.reverse();
      setProducts(a)
    }
  }
  const getCategories = async () => {
    await get_login('/products/categories')
      .then((res) => {
        let a = categeries.concat(res.data)
        setCategories(a)
      }).catch((e) => {
        error_toast(e.response.data.message)
      })
  }
  const delteSwal = (id) => {
    let callback = (result) => {
      if (result.isConfirmed) {
        deleteProduct(id);
      }
    }
    confirm_toast(callback);
  }

  const deleteProduct = async (id) => {
    await delete_login('/products/' + id)
      .then((res) => {
        getProducts();
        success_toast('Product deleted Successfully');
      }).catch((e) => {
        error_toast('something went wrong')
      })
  }

  useEffect(() => {
    if (!loggdata) {
      navigate('/login')
    } else {
      // getProducts();
      getCategories();
    }
  }, [])

  useEffect(() => {
    let a = [...products]
    if(location.pathname.split('/').length>2){
      a = a.filter((e)=>{
        return e.name.toLowerCase().includes(location.pathname.split('/')[2].toLowerCase())
      })
      setProducts(a)
    }else{
      getProducts();
    }
      
  }, [location])
  
  return (
    <div>
      <ToggleButtonGroup
        color="primary"
        value={alignment}
        exclusive
        onChange={handleChange}
        aria-label="Platform"
        style={{ marginTop: '30px', width: '100%', display: 'flex', justifyContent: 'center' }}
      >
        {
          categeries.map((e, i) =>
            <ToggleButton key={i} value={e}>{e}</ToggleButton>
          )
        }
        {/* <ToggleButton value="APPAREL">APPAREL</ToggleButton>
        <ToggleButton value="ELECTRONICS">ELECTRONICS</ToggleButton>
        <ToggleButton value="PERSONAL CARE">PERSONAL CARE</ToggleButton> */}
      </ToggleButtonGroup>
      <div style={{ marginLeft: '50px' }}>
        <p style={{ marginBottom: '20px' }}>Sort by:</p>
        <TextField
          id="outlined-select-currency"
          select
          label="Select"
          defaultValue="def"
          onChange={(e) => { handleSort(e) }}
          style={{ width: '200px', textAlign: 'start' }}
        >
          <MenuItem value="def">Default</MenuItem>
          <MenuItem value="asc">Price:Low to High</MenuItem>
          <MenuItem value="desc">Price:High to Low</MenuItem>
          <MenuItem value="new">Newest</MenuItem>
        </TextField>
      </div>
      <div className='card-parent'>
        {
          products.map((item) =>
            <Card key={item.id} sx={{ maxWidth: 345, padding: '10px' }}>
              <CardMedia
                component="img"
                alt="green iguana"
                height="250"
                image={item.imageUrl}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div" style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>{item.name}</span>
                  <span>₹ {item.price}</span>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.description.length > 100 ? item.description.slice(1, 100) + '...' : item.description}
                </Typography>
              </CardContent>
              <CardActions style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button size="small" variant='contained' onClick={()=>{navigate('/product/'+item.id)}}>Buy</Button>
               {logData()?.role=='ADMIN' && <div>
                  <Button size="small" onClick={() => { navigate('/editproduct/' + item.id) }}><EditIcon /></Button>
                  <Button size="small" onClick={() => { delteSwal(item.id) }}><DeleteIcon /></Button>
                </div>}
              </CardActions>
            </Card>
          )
        }
      </div>
    </div>
  )
}

export default Home