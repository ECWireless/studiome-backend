// Imports
const sgMail = require('@sendgrid/mail')
const express = require('express')
const cors = require('cors')
const router = express.Router()

// Initialize Port and App
let port = process.env.PORT;
if (port == null || port == "") {
    port = 8000;
}

const app = express();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

router.post('/mail', async (req, res, next) => {
    const { name, email, number, message } = req.body;
    const confirmationEmail = {
        to: email,
        from: 'studiomellc@gmail.com',
        subject: `Submission was successful!`,
        html: `
          <p>Thank you for contacting us! We will get back to you as soon as possible.</p>
          <br/>
          <h3>Your submission:</h3>
          <p>Name: ${name}</p>
          <p>Email: ${email}</p>
          <p>Phone: ${number}</p>
          <p>Message: ${message}</p>
        `
    }

    const notificationEmail = {
        to: 'studiomellc@gmail.com',
        from: 'studiomellc@gmail.com',
        subject: `New Contact Form Submission - ${email}`,
        html: `
          <p>New contact form submission from ${name}.</p>
          <br/>
          <p>Name: ${name}</p>
          <p>Email: ${email}</p>
          <p>Phone: ${number}</p>
          <p>Message: ${message}</p>
        `
    }

    try {
        await sgMail.send(confirmationEmail)
        await sgMail.send(notificationEmail)
        res.status(200).send('Message sent successfully.')
      } catch (error) {
        console.log('ERROR', error)
        res.status(400).send('Message not sent.')
      }
})

app.use(cors())
app.use(express.json())
app.use('/', router)
app.listen(port, () => console.log(`App listening on port ${port}`))
