export const inviteLetter = async (token, email) => {
    return {
            from: 'bot@gmail.com',  // sender address
            to: email,   // list of receivers
            subject: 'Inviting',
            text: 'That was easy!',
            html: `<b>Hey there! </b>
            <br> Your invite link <a href="http://127.0.0.1:3300/signup/?token=${token}">there</a><br/>`}
            }
