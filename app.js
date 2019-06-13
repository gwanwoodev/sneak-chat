const exress = require('express');
const path = require('path');
const app = express();

const APP_PORT = 5733

//This is config for render view in 'views' folder
//and use pug as template engine

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.get('/', (req, res) => {
   res.render('index');
});


app.listen(APP_PORT, () => {
   console.log(`App running on port ${APP_PORT}`);
});