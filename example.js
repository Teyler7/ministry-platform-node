const MP = require('./src/app.js');
const mp = new MP();

(async function test() {
    const selectColumns = []
    selectColumns.push('User_ID_Table_Contact_ID_Table.[Contact_ID]')
    selectColumns.push('Role_ID_Table.[Role_Name]')
    selectColumns.push('dp_User_Roles.[User_Role_ID]')
    const filter = `User_ID_Table_Contact_ID_Table.[Contact_ID] = 7680320 and Role_ID_Table.[Role_Name] LIKE 'pushpay'` 
    const table = 'dp_User_Roles'
    const data = await mp.withSelectColumns(selectColumns)
                         .withFilter(filter)
                         .fromTable(table)
                         .get()
    console.info("data!", data);
})()