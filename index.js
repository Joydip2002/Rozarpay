import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import nodemailer from 'nodemailer'

const port = process.env.PORT || 8522;
const app = express();
dotenv.config();
app.use(cors());
app.use((express.json()))
// app.use("api/payment/",paymentRoutes)

app.get('/', (req, res) => {
    res.send('Hello World!');
})

app.post('/orders', async (req, res) => {
    try {
        const instance = new Razorpay({
            key_id: "rzp_test_o3oXSCh76kNd0g",
            key_secret: "PeNWFvpP6yBXQm2Q2W0ej8Vf"
        })
        const options = {
            amount: req.body.amount * 100,
            currency: 'INR',
            receipt: crypto.randomBytes(10).toString("hex"),
        }
        instance.orders.create(options, (error, order) => {
            if (error) {
                console.log(error);
                return res.status(500).json("Something Went Wrong!!")
            }
            else {
                return res.status(200).json({ "data": order });
            }
        })
    } catch (error) {
        console.log(error);
    }
})

app.post('/verify', async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        const sign = razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSign = crypto.createHmac("sha256", process.env.KEY_SECRET).update(sign.toString()).digest("hex");
        if (razorpay_signature === expectedSign) {
            return res.json({ "message": "Payment Verified Successful", "status": 200, "data": req.body });
        }
        else {
            return res.json({ "message": "Payment Verified Unccessful", "status": 500 });
        }
    } catch (error) {
        console.log(error);
    }
})

// nodemailer Send Email
app.post('/send-mail', (req, res) => {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: "joydipmanna2002@gmail.com",
            pass: "jqquwyllanfgiulf"
        }
    });
    let mailOptions = {
        from: "joydipmanna2002@gmail.com",
        to: req.body.user_email,
        subject: req.body.subject,
        text: req.body.message
    };
    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.log('Error occurred');
            console.log(err.message || err);
            res.json({'message':'Something went wrong..','status':500});
        } else {
            console.log(`Email sent successfully!`)
            res.json({'message':'Email send successfully..','status':200})
        }
    })

})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})