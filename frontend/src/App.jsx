import React, { useEffect, useState } from 'react'
import axios from 'axios'
import ContactForm from './ContactForm'
import LoginLogout from './LoginLogout';
import Logout from './Logout';

const App = () => {
  const [logout2, setLogout] = useState(true);
  const [trackLogout, setTrackLogout] = useState(false)
  const [book, setBook] = useState({
    title: "Thy Mommy",
    author: "Raj Khanna",
    price: '2000',
    description: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Laudantium voluptatem veritatis nobis, iusto itaque, autem quia repellat saepe obcaecati neque architecto, expedita repudiandae odit est vitae. Commodi reiciendis veritatis dolores?"
  })


  // console.log(localStorage.getItem('logout'));
  // if (localStorage.getItem('logout') == 'true') {
  //   return <Logout />
  // }

  const initPayment = (data) => {
    // console.log(data.receipt);
    const option = {
      key: "rzp_test_o3oXSCh76kNd0g",
      amount: data.amount,
      currency: data.currency,
      name: "Joydip Manna",
      description: 'Testing payment gateway',
      order_id: data.id,
      receipt_id: data.receipt,
      handler: async (response) => {
        try {
          console.log('response=>', response);
          const res = await axios.post('http://localhost:8522/verify', response);
          console.log("after checkout=>", res);
        } catch (error) {
          console.log(error);
        }
      }
    }
    const rp1 = new window.Razorpay(option)
    rp1.open();
  }

  const paymentFunc = async () => {
    try {
      const res = await axios.post("http://localhost:8522/orders", { amount: book.price })
      console.log(res);
      initPayment(res.data.data)
    } catch (error) {
      console.log(error);
    }
  }

  const logout = () => {
    const expTime = localStorage.getItem('expireTime');
    if (Date.now() > expTime) {
      // alert('Logout' + Date.now())
      console.log('Logout', expTime);
      setLogout(false)
      localStorage.setItem('logout', true)
    }
  }

  const loginLogout = () => {
    console.log('Login', Date.now());
    const timer = setInterval(() => {
      logout();
    }, 10000)
    return () => clearInterval(timer);
  }

  const increaseTime = () => {
    let time = Date.now() + 5000;
    console.log("exp time => ", time);
    console.log("exp time difference => ", (time - Date.now()));
    localStorage.setItem('expireTime', time)
  }


  useEffect(() => {
    loginLogout();
  }, [])


  useEffect(() => {
    increaseTime();
    window.addEventListener('mousedown', increaseTime);
    window.addEventListener('mouseup', increaseTime);
    window.addEventListener('mouseenter', increaseTime);
    window.addEventListener('mouseleave', increaseTime);
    window.addEventListener('mouseout', increaseTime);
    window.addEventListener('keydown', increaseTime);
    window.addEventListener('keypress', increaseTime);
    window.addEventListener('keyup', increaseTime);
    window.addEventListener('scroll', increaseTime);
    return () => {
      window.removeEventListener('mousedown', increaseTime)
      window.removeEventListener('mouseup', increaseTime)
      window.removeEventListener('mouseenter', increaseTime)
      window.removeEventListener('mouseleave', increaseTime)
      window.removeEventListener('mouseout', increaseTime)
      window.removeEventListener('keydown', increaseTime)
      window.removeEventListener('keypress', increaseTime)
      window.removeEventListener('keyup', increaseTime)
      window.removeEventListener('scroll', increaseTime)
    }
  }, [])

  return (
    <>
      <h2>{logout2 ? 'Login' : 'Logout'}</h2>
      <div style={{ display: 'flex', justifyContent: 'center', gap:'20px', flexWrap:'wrap', alignItems: 'center' }}>
        <div className='shadow-lg p-4 col-md-4 m-1 rounded' >
          <h1>{book.title}</h1>
          <p>{book.author}</p>
          <p>{book.description}</p>
          <button className='btn btn-info mt-3' onClick={paymentFunc} style={{ padding: '10px' }}>Buy now</button>
        </div>
        <div className="contact-form mt-3">
          <ContactForm />
        </div>
      </div>
      {/* <LoginLogout/> */}
    </>
  )
}

export default App
