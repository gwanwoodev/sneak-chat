$(document).ready(function() {
   $("#send").click((evt)=> {
       //Todo Register
	   const username = $("input[name=username]").val();
       const usernick = $("input[name=usernick]").val();
	   const password = $("input[name=password]").val();
       const sha256Password = SHA256(password);
	   let resultRow;
	   // console.log(`username is ${username} and password is ${password}`);
	   
	   //Create JSON Data. to Fecth.
	   const params = {
		   'username': username,
		   'password': sha256Password,
           'usernick': usernick
	   };
	   
	   //fetch to /join
	   
       (async () => {
	   const rawResponse = await fetch('/join',
		{
		   method: 'POST',
		   headers: {
             "Accept": "application/json",
			 "Content-Type": "application/json"
		   },
		   body: JSON.stringify(params)
	   })
       const content = await rawResponse.json();
       resultRow = JSON.parse(content);
           switch(resultRow.status) {
               case 200:
                   alert('Register Success');
                   location.href = "/";
                   break;
               case 400:
                   alert('Register Failed\nid already exists');
                   break;
           }
       })();
   });
});