const axios = require("axios");
const qs = require("qs");

class MinistryPlatform {
    constructor() {
        this.userToken;
        this.clientToken;
    }

    // AUTH

    async getTokenUser() {
        const url = `${process.env.MP_API_ENDPOINT}/ministryplatformapi/oauth/connect/token`;
        const data = qs.stringify({
            'username': process.env.MP_USERNAME,
            'password': process.env.MP_PASSWORD,
            'grant_type': 'password',
            'scope': 'http://www.thinkministry.com/dataplatform/scopes/all openid',
            'client_id': process.env.MP_CLIENT_ID,
            'client_secret': process.env.MP_CLIENT_SECRET,
        });
        const config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }
        try {
            const response = await axios.post(url, data, config)
            this.userToken = response.data.access_token
            return response.data.access_token
        } catch(e) {
            console.error(e.response.data.error, e.response.data.error_description)
        }
    }

    async loadTokenClientCredentials() {
        const url = `${process.env.MP_API_ENDPOINT}/ministryplatformapi/oauth/connect/token`;
        const data = qs.stringify({
            'grant_type': 'client_credentials',
            'scope': 'http://www.thinkministry.com/dataplatform/scopes/all',
            'client_id': process.env.MP_CLIENT_ID,
            'client_secret': process.env.MP_CLIENT_SECRET,
        });
        const config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Bearer ${this.userToken}`
            }
        }
        try {
            const response = await axios.post(url, data, config)
            this.clientToken = response.data.access_token
            return response.data.access_token
        } catch(e) {
            console.error(e.response.data.error, e.response.data.error_description)
        }
    }

    async get(selectColumns, filter, table) {
        // TODO check if close to death
        await this.loadTokenClientCredentials()
        try {
            const response = await axios.get(`${process.env.MP_API_ENDPOINT}/ministryplatformapi/tables/${table}`, {
                    params: { 
                        '$select': selectColumns.join(","),
                        '$filter': filter 
                    },
                    headers: {
                        Authorization: `Bearer ${this.clientToken}`,
                        Accept: 'application/json'
                    }
                }
            )
            
            if (!response.data.length) {
                if(response.data.Message && response.data.Message.indexOf("Signature validation failed") > -1) {
                    console.error("invalid token")
                }
                return;
            }
            return response.data;
        } catch(e) {
            if (e.response.data && e.response.data.Message.indexOf('token is expired')) {
                console.error('token expired')
            } else {
                if(e.response.status === 401) {
                    console.error('Unauthorized')
                } else {
                    console.error(e.response)
                }
            }
            return;
        }
    }
}

module.exports = MinistryPlatform