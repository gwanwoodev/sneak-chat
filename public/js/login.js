$(document).ready(function() {
   $("#send").click((evt)=> {
       //Todo Login
	   const username = $("input[name=username]").val();
	   const password = $("input[name=password]").val();
	   
	   // console.log(`username is ${username} and password is ${password}`);
	   
	   //Create JSON Data. to Fecth.
	   const params = {
		   'username': username,
		   'password': password
	   };
	   
	   //fetch to /login.
	   
       (async () => {
	   const rawResponse = await fetch('/login',
		{
		   method: 'POST',
		   headers: {
             "Accept": "application/json",
			 "Content-Type": "application/json"
		   },
		   body: JSON.stringify(params)
	   })
       const content = await rawResponse.json();
       console.log(JSON.parse(content).ok);
    })();
   });
});