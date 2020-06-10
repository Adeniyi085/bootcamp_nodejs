const fs = require('fs')
const mongoose =require('mongoose')
const dotenv = require('dotenv')


//Load DotENV filles    
dotenv.config({path: './config/config.env'})

//Load Db 
const Bootcamp = require('./models/Bootcamp');
const Course = require('./models/Course');

//connnec DB
mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser:true,
            useCreateIndex: true,
            useFindAndModify: false,
            useUnifiedTopology: true
    })

    // read JSON files
    const bootcamps = JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8'));
  
    const courses = JSON.parse(fs.readFileSync(`${__dirname}/_data/courses.json`, 'utf-8'));
  
  //import into DB
  const importData =  async () => {
      try {
          await Bootcamp.create(bootcamps)
         l
            console.log('Data imported...');
            
          process.exit();
      } catch (err) {
          console.error(err)
          
      }
  }

  //Delete from DB
    const deleteData =  async () => {
      try {
          await Bootcamp.deleteMany();
          await Course.deleteMany();
          console.log('Data destroyed...')
          process.exit();
      } catch (err) {
          console.error(err)
          
      }
  }

if(process.argv[2] === '-i'){
    importData();
} else if(process.argv[2] === '-d'){
    deleteData();
}