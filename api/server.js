require('dotenv').config();
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser')
const logger = require('./logger/logger');

app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(cookieParser());

// pathe of manager
const manager = require('./routers/managerApi');
app.use('/managerApi',manager);

// pathe of responsableLivraison
const responsableLivraison = require('./routers/responsableLivraisonApi');
app.use('/responsableLivraisonApi', responsableLivraison);

// pathe of vehicule
const vehicule = require('./routers/vehiculeApi');
app.use('/vehiculeApi', vehicule);

// pathe of admin
const admin = require('./routers/adminApi');
app.use('/adminApi', admin);

// pathe of chauffeur
const chauffeur = require('./routers/chauffeurApi');
app.use('/chauffeurApi',chauffeur);

// pathe of livraison
const livraison = require('./routers/livraisonApi');
app.use('/livraisonApi',livraison);

// connction with monogodb
const mongoose = require('mongoose');
// mongoose.connect(process.env.NODE_ENV === 'development' ? process.env.DATABASE_URL : process.env.MONGODB_URI,{useUnifiedTopology:true,useNewUrlParser:true});

// const db = mongoose.connection;
// db.on('error',(error)=>{console.error(error);});
// db.once('open',()=>{console.log('Database is connected');});
mongoose.connect(process.env.DATABASE_URL,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
},
(err)=>{
    if(err) return console.error(err)
    console.log('connected to mongoose')
});



// start server with any port or 4000(cmd:npm run start)
const port = process.env.PORT || 4000;
app.listen(port,()=>{logger.info(`started on port ', ${port}`)});