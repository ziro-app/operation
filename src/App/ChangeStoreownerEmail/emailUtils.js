import { post } from 'axios';

export const generateConfirmLink = async email => {
    const url = `${process.env.FIREBASE_AUTH_URL}resendConfirmEmail`;
    const config = {
        headers: {
            'Content-type': 'application/json',
            'Authorization': process.env.FIREBASE_AUTH_TOKEN
        }
    };
    const body = {
        email,
        type: 'Email'
    }
    try {
        const { data: { link } } = await post(url, body, config);
        return link;
    } catch (error) {
        throw error;
    }
};

export const apiResendEmail = async (email, link) => {
    const urlEmail = process.env.API_EMAIL;
    const configEmail = {
        headers: {
            'Content-type': 'application/json',
            'Authorization': process.env.EMAIL_TOKEN
        }
    };
    try {
        const body = {
            to: email,
            customEmail: false,
            confirmEmail: {
                link
            }
        };
        await post(urlEmail, body, configEmail);
    } catch (error) {
        throw error;
    }
};
