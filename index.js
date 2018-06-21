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
            console.log("user esponse", response.data);
            this.userToken = response.data.access_token
            return response.data.access_token
        } catch(e) {
            console.error(e.response.data.error, e.response.data.error_description)
        }
    }

    async getTokenClientCredentials() {
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
            console.log("client response", response.data);
            this.clientToken = response.data.access_token
            return response.data.access_token
        } catch(e) {
            console.error(e.response.data.error, e.response.data.error_description)
        }
    }

    // ENDPOINTS
    async userHasRole(featureName, contactId) {
        // TODO check if close to death
        await this.getTokenClientCredentials()
        try {
            const response = await axios.get(`${process.env.MP_API_ENDPOINT}/ministryplatformapi/tables/dp_User_Roles`, {
                    params: { 
                        '$select': `User_ID_Table_Contact_ID_Table.[Contact_ID], Role_ID_Table.[Role_Name], Role_ID_Table.[Role_ID], dp_User_Roles.[User_Role_ID]`,
                        '$filter': `User_ID_Table_Contact_ID_Table.[Contact_ID] = ${contactId} and Role_ID_Table.[Role_Name] LIKE '${featureName}'` 
                    },
                    headers: {
                        Authorization: `Bearer ${this.clientToken}`,
                        Accept: 'application/json'
                    }
                }
            )
            if (!response.data.length) {
                if(response.data.Message && response.data.Message.indexOf("Signature validation failed") > -1) {
                    console.error("bad token")
                }
                return false;
            }
            return true;
        } catch(e) {
            // console.error(e.response)
            if (e.response.data && e.response.data.Message.indexOf('token is expired')) {
                console.error('token expired')
            } else {
                if(e.response.status === 401) {
                    console.error('Unauthorized')
                } else {
                    console.error(e.response)
                }
            }
            return false;
        }
    }
}

module.exports = MinistryPlatform