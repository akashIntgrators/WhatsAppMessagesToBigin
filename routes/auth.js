const express=require("express");
const axios=require("axios");

const router=express.Router();

router.get("/",(req,res)=>{

const authUrl=

`https://accounts.zoho.com/oauth/v2/auth
?scope=ZohoBigin.modules.ALL
&client_id=${process.env.BIGIN_CLIENT_ID}
&response_type=code
&access_type=offline
&redirect_uri=${process.env.BIGIN_REDIRECT_URI}`

.replace(/\s/g,'');

res.redirect(
authUrl
);

});

router.get(
"/callback",
async(req,res)=>{

try{

const code=
req.query.code;

const response=
await axios.post(

"https://accounts.zoho.com/oauth/v2/token",

null,

{

params:{

grant_type:
"authorization_code",

client_id:
process.env.BIGIN_CLIENT_ID,

client_secret:
process.env.BIGIN_CLIENT_SECRET,

redirect_uri:
process.env.BIGIN_REDIRECT_URI,

code:code

}

}

);

console.log(
"TOKEN:"
);

console.log(
response.data
);

res.send(
"OAuth success. Check terminal."
);

}
catch(err){

console.log(
err.response?.data ||
err.message
);

res.send(
"OAuth failed"
);

}

});

module.exports=router;