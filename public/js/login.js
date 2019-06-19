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
	   
	   fetch('/login',
		{
		   method: 'POST',
		   headers: {
			 "Content-Type": "application/json"
		   },
		   body: JSON.stringify(params)
	   })
	   .then((res) => {
		   if(res.ok) return res.text();
	   })
	   .then((text) => {
		  $("#send").text(text);
	   });
   });
});