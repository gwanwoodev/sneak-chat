$(document).ready(function() {
   $("input[name=username]").focus();
   $("#send").click((evt)=> {
       //Todo Login
	   const username = $("input[name=username]").val();
	   const password = $("input[name=password]").val();
       const sha256Password = SHA256(password);
	   let resultRow;
	   // console.log(`username is ${username} and password is ${password}`);
	   
	   //Create JSON Data. to Fecth.
	   const params = {
		   'username': username,
		   'password': sha256Password
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
	   });
       const content = await rawResponse.json();
       resultRow = JSON.parse(content);
           switch(resultRow.status) {
               case 200:
                   location.href = "/chat";
                   break;
               case 204:
                   alert('Login Failed');
                   break;
           }
       })();
   });
    
    
    //Enter Event
    
    $("input[name=password]").keydown((evt) => {
       if(evt.keyCode === 13) $("#send").click();
    });
});