import React, { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import { toast } from 'react-toastify';
import axios from 'axios';


function ContactForm() {
    const [data, setData] = useState({
        user_name: '',
        user_email: '',
        subject: '',
        message: ''
    });
    const [loading, setloading] = useState(false);
    // const form = useRef();
    // const sendEmail = (e) => {
    //     e.preventDefault();
    //     emailjs.sendForm('service_e01sg76', 'template_w7yfl22', form.current, 'IFpKHLBVmzU6qNAuG')
    //         .then((res) => {
    //             if (res.status == 200) {
    //                 toast.success('Email Send..')
    //             }
    //         })
    //         .then((err) => {
    //             toast.error(err.text);
    //         })
    // }

    const formSubmit = async (e) => {
        e.preventDefault();
        console.log(data);
        if(data.user_email === '' && data.user_name === '' && data.subject === '' && data.message === ''){
            toast.warning('Fill the form first')
            return;
        }
        setloading(true)
        const res = await axios.post('http://localhost:8522/send-mail', data);
        if (res.data.status == 200) {
            toast.success(res.data.message)
            setloading(false)
            setData({
                user_name: '',
                user_email: '',
                subject: '',
                message: ''
            })
        }
        else {
            toast.error(res.data.message)
        }

    }

    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value })
    }

    return (
        <>
            <div className='d-flex justify-content-center flex-column align-items-center '>
                <form action="" onSubmit={formSubmit} className='shadow-lg p-5 rounded' >
                    <div className="text-center">{loading ? 'Loading...' : ''}</div>
                    <p>Send Your Feedback..</p>
                    <label>Name</label>
                    <input type="text" name="user_name" value={data.user_name} onChange={handleChange} className='form-control' />
                    <label>Email</label>
                    <input type="email" name="user_email" value={data.user_email} onChange={handleChange} className='form-control' />
                    <label>Subject</label>
                    <input type='text' name="subject" value={data.subject} onChange={handleChange} className='form-control' />
                    <label>Message</label>
                    <textarea name="message" value={data.message} onChange={handleChange} className='form-control' />
                    <input type="submit" value="Send" className='btn btn-success w-100 mt-4' />
                </form>
            </div>
        </>
    )
}

export default ContactForm;