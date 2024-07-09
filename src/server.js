import express from 'express';
import bodyParser from 'body-parser';
import mysql from 'mysql';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import fileUpload from 'express-fileupload';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import puppeteer from 'puppeteer';
import { Console, error } from 'console';
const saltRounds = 10;

const app = express();
const PORT = 3002;

app.use(bodyParser.json());
app.use(cors()); // Use the cors middleware
app.use(fileUpload());
// Create MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'projectfinal'
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
 // console.log('Connected to the database');
});//////////////////
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/') // Directory where files will be stored
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
});
const upload = multer({ storage: storage });
//////////////
// Define a route for uploading a PDF file with username
app.post('/upload-pdf/:username', (req, res) => {
  const username = req.params.username;
  const { companyName, jobname, email } = req.body;
  const CV = req.files.pdf;
  const ID_image = req.files.ID_image;

  if (!ID_image || !CV) {
    return res.status(500).json({ success: false, message: 'PDF or Image is empty' });
  }

  const query = 'INSERT INTO pdf_file (file, ID_image, username, jobname, CompanyName, email, Type) VALUES (?, ?, ?, ?, ?, ?, ?)';
  connection.query(query, [CV.data, ID_image.data, username, jobname, companyName, email, '0'], (error, results) => {
    if (error) {
      console.error('Error inserting file data into database:', error);
      return res.status(500).json({ success: false, message: 'An error occurred while uploading the file' });
    }

    // If the file data insertion is successful, update the total count
    updateTotalCount(res);
  });
});

// Function to update the total count
const updateTotalCount = (res) => {
  const currentDate = new Date().toISOString().slice(0, 10); // Get current date in YYYY-MM-DD format

  // Check if a record with the current date exists in the database
  const selectQuery = `SELECT * FROM charts WHERE Date = ?`;
  connection.query(selectQuery, [currentDate], (error, results) => {
    if (error) {
      console.error('Error checking for existing record:', error);
      return res.status(500).json({ success: false, message: 'An error occurred while checking for existing record' });
    } else {
      if (results.length > 0) {
        // If a record exists, increment the Jobapplay count by 1
        const currentJobapplayCount = results[0].Jobapplay + 1;
        updateTotal(currentDate, currentJobapplayCount, res);
      } else {
        // If no record exists, insert a new record with Jobapplay count set to 1
        insertRecord(currentDate, 1, res);
      }
    }
  });
};

// Function to update total for the current date
const updateTotal = (date, total, res) => {
  const updateQuery = `UPDATE charts SET Jobapplay = ? WHERE Date = ?`;
  connection.query(updateQuery, [total, date], (error, results) => {
    if (error) {
      console.error('Error updating total:', error);
      return res.status(500).json({ success: false, message: 'An error occurred while updating total count' });
    } else {
      console.log('Total count updated successfully');
      return res.status(200).json({ success: true, message: 'Total count updated successfully' });
    }
  });
};

// Function to insert a new record for the current date with total set to 1
const insertRecord = (date, total, res) => {
  const insertQuery = `INSERT INTO charts (Date, Jobapplay) VALUES (?, ?)`;
  connection.query(insertQuery, [date, total], (error, results) => {
    if (error) {
      console.error('Error inserting record:', error);
      return res.status(500).json({ success: false, message: 'An error occurred while inserting record' });
    } else {
      console.log('Record inserted successfully');
      return res.status(200).json({ success: true, message: 'Record inserted successfully' });
    }
  });
};


//////////


app.get('/download-pdf', (req, res) => {
  const { jobname, companyname } = req.query;

  // SQL query to fetch the file path from the database
  const query = 'SELECT file FROM pdf_file WHERE jobname = ? AND CompanyName = ?';

  // Execute the query
  connection.query(query, [jobname, companyname], (err, results) => {
    if (err) {
      console.error('Error fetching PDF from database:', err);
      res.status(500).json({ error: 'Failed to fetch PDF from database' });
      return;
    }

    if (results.length === 0 || !results[0].file) {
      res.status(404).json({ error: 'PDF not found in database' });
      return;
    }

    // Get the file path from the query results
    const filePath = results[0].file;

    // Read the file from the server's file system
    fs.readFile(filePath, (err, data) => {
      if (err) {
        console.error('Error reading file from server:', err);
        res.status(500).json({ error: 'Failed to read file from server' });
        return;
      }

      // Set response headers for PDF file download
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="file.pdf"');

      // Send the file data as the response
      res.send(data);
    });
  });
});


///////
app.put('/updatuser/:username', (req, res) => {
  const username = req.params.username;
  const userData = req.body;

  const { Name,email,Bio,Skill1,Skill2,img,Phone,Languages,country,city,Instagram,Facebook,Website } = userData;

  // SQL query to update user data in 'infor' table
  const sql = `UPDATE infor SET Name=?, email=?, Bio=?, Skill1=?, Skill2=?, img=?, Phone=?, Languages=?, country=?, city=?, Instagram=?, Facebook=?, Website=?, WHERE username = ?`;
  const values = [Name,email,Bio,Skill1,Skill2,img,Phone,Languages,country,city,Instagram,Facebook,Website, username];

  connection.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error updating user data:', err);
      res.status(500).json({ error: 'Failed to update user data' });
      return;
    }
    //console.log('User data updated successfully');
    res.status(200).json({ message: 'User data updated successfully' });
  });
});
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////
app.get('/experiences/:username', (req, res) => {
  const username = req.params.username;
  console.log(username);
  const query = 'SELECT * FROM experiences WHERE username = ?'; // Adjust for your column names

  connection.query(query, [username], (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      res.status(500).json({ success: false, message: 'An error occurred, please try again later' });
      return;
    }
    res.json({
      results
    });

  });
});
////////////
/*app.get('/appearpdf/:username/:Nameofjobs', (req, res) => {
  const username = req.params.username;
  const Nameofjobs = req.params.Nameofjobs;
  
  const query = 'SELECT * FROM pdf_file WHERE CompanyName = ? AND jobname = ? AND Type = ?'; // Adjust for your column names

  connection.query(query, [username,Nameofjobs,'0'], (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      res.status(500).json({ success: false, message: 'An error occurred, please try again later' });
      return;
    }
    res.json({
      results
    });

  });
});*/
app.post('/dpftypeacept/:ID/:email/:username/:jobname/:useremail', (req, res) => {
  const ID = req.params.ID;
  const email = req.params.email;
  const username = req.params.username;
  const jobname = req.params.jobname;
  const useremail = req.params.useremail;

  const query = 'UPDATE pdf_file SET Type = 1 WHERE ID = ?'; // Adjust for your column names and condition

  connection.query(query, [ID], (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      res.status(500).json({ success: false, message: 'An error occurred, please try again later' });
      return;
    }
    
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'mohammedadwan44@gmail.com',
        pass: 'uvtn gwwl yqgy dxie'
      }
    });
    var mailOptions = {
      from: 'mohammedadwan44@gmail.com',
      to: useremail,
      subject: 'Acceptance for a private job interview in ' + username, // Corrected
      text: 'You have been accepted for a job interview for ' + jobname + '. Please check your page on Hier me to choose the appropriate date or contact us via the official email: '+email+'. Thank you' // Corrected
    };
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });

    res.json({
      success: true,
      message: 'PDF type updated successfully'
    });
  });
});
////////
app.get('/educations/:username', (req, res) => {
  const username = req.params.username;
  console.log(username);
  const query = 'SELECT * FROM educations WHERE username = ?'; // Adjust for your column names

  connection.query(query, [username], (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      res.status(500).json({ success: false, message: 'An error occurred, please try again later' });
      return;
    }
    res.json({
      results
    });

  });
});
//////////
app.get('/allinformation/:username', (req, res) => {
  const username = req.params.username;
  console.log(username);
  const query = 'SELECT * FROM infor WHERE username = ?'; // Adjust for your column names

  connection.query(query, [username], (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      res.status(500).json({ success: false, message: 'An error occurred, please try again later' });
      return;
    }
    res.json({
      results
    });

  });
});

///////////
app.get('/skills/:username', (req, res) => {
  const username = req.params.username;
  console.log(username);
  const query = 'SELECT `Skills` FROM `infor` WHERE username = ?'; // Use placeholders

  connection.query(query, [username], (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      res.status(500).json({ success: false, message: 'An error occurred, please try again later' });
      return;
    }
    res.json({
      results
    });

  });
});

///////////
app.get('/alluser', (req, res) => {

  const query = 'SELECT * FROM login'; // Adjust for your column names

  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      res.status(500).json({ success: false, message: 'An error occurred, please try again later' });
      return;
    }

    res.json(results);

  });
});
////////////////////////

///some eddite here no need for pass and is login
/*app.post('/profileimg', (req, res) => {
  const { username} = req.body;

  const query = 'SELECT * FROM login WHERE username = ?'; // Adjust for your column names

  connection.query(query, [username], (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      res.status(500).json({ success: false, message: 'An error occurred, please try again later' });
      return;
    }

    const imageBlob = results[0].img;
    res.send(imageBlob);
  });
});*/
///////////
//app.use(bodyParser.json());
//
app.get('/jobs', (req, res) => {
  // Perform the SQL query to select all job records from the 'jobs' table
  const query = 'SELECT * FROM jobs';

  // Execute the query
  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      res.status(500).json({ error: 'An error occurred' });
      return;
    }

    // Send the job records as JSON response
    res.json(results);
  });
});
app.get('/jobsComp/:username', (req, res) => {
  const username=req.params.username;
  // Perform the SQL query to select all job records from the 'jobs' table
  const query = 'SELECT * FROM jobs WHERE CompanyName =?';

  // Execute the query
  connection.query(query,[username], (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      res.status(500).json({ error: 'An error occurred' });
      return;
    }

    // Send the job records as JSON response
    res.json(results);
  });
});
/////////////
app.get('/jobsCompID/:ID', (req, res) => {
  const ID=req.params.ID;
  // Perform the SQL query to select all job records from the 'jobs' table
  const query = 'SELECT * FROM jobs WHERE ID =?';

  // Execute the query
  connection.query(query,[ID], (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      res.status(500).json({ error: 'An error occurred' });
      return;
    }

    // Send the job records as JSON response
    res.json({results});
  });
});
////////////
// Login route
app.get('/adminuser', (req, res) => {
  const query = `SELECT * FROM login WHERE isAdmin = 0 OR isAdmin = 2`;
  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error retrieving user data:', error);
      res.status(500).json({ success: false, message: 'An error occurred while retrieving user data' });
    } else {
      res.json(  results );
    }
  });
});
app.put('/updatepass/:user', (req, res) => {
  const username = req.params.user;
  const { newpass } = req.body;
  const query1 = `UPDATE login SET pass =? WHERE username = ?`;
  connection.query(query1, [newpass, username], (error) => {
    if (error) {
      console.error('Error updating is_logging status:', error);

    }
    return res.json("Done");
  });
});
/*app.post('/logoutpdate', (req, res) => {

  const query1 = `UPDATE login SET isLogin = 0 WHERE isLogin = 1 AND isAdmin =0`;
  connection.query(query1, (error) => {
    if (error) {
      console.error('Error updating is_logging status:', error);

    }

  });
});*/
////////////
app.post('/UpdateJob/:ID/:NameofJob', (req, res) => {
  const ID=req.params.ID;
  const NameofJob =req.params.NameofJob;

const {jobName,jobLocation,jobDescription,companyName,jobCategory,jobTime,salary,joblevel} = req.body;
  const query1 = `UPDATE jobs SET NameofJobs = ? , Location=?, Description=?,CompanyName=?, Majored=? ,	jobtime=?, salary=?,JobLevel=? WHERE ID=?`;
  connection.query(query1,[jobName,jobLocation,jobDescription,companyName,jobCategory,jobTime,salary,joblevel,ID], (error, results)  => {
    if (error) {
      console.error('Error updating is_logging status:', error);
      return res.status(500).json({ error: 'Internal server error' });
    
    }
    if (results.affectedRows === 1) {
      res.json({ success: true, message: 'user updated successfully' });
      const query1 = `UPDATE pdf_file SET jobname = ?  WHERE jobname=?`;
      connection.query(query1,[jobName,NameofJob], (error, results)  => {
        if (error) {
          console.error('Error updating  Pdf Table status:', error);
         // return res.status(500).json({ error: 'Internal server error' });
        
        }});
    } else {
      res.status(404).json({ error: ' not found' });
    }

  });
});
/////////////
/*app.post('/logoutpdateadmin', (req, res) => {

  const query1 = `UPDATE login SET isLogin = 0 WHERE isLogin = 1 AND isAdmin =1`;
  connection.query(query1, (error) => {
    if (error) {
      console.error('Error updating is_logging status:', error);

    }

  });
});*/
/////////
app.put('/updateuser/:id', (req, res) => {
  const userId = req.params.id;
  const { user, pass, email, isAdmin, selectedMajored, ispaid } = req.body;
  //console.log(ispaid);

  const query1 = `UPDATE login SET username = ?, pass =?, email = ?, isAdmin =? , Majored = ? , isPaid = ? WHERE ID = ? `;
  connection.query(query1, [user, pass, email, isAdmin, selectedMajored, ispaid, userId], (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }

    // Check if the record was updated successfully
    if (results.affectedRows === 1) {
      res.json({ success: true, message: 'user updated successfully' });
    } else {
      res.status(404).json({ error: 'user not found' });
    }
  });
});
app.put('/updatjob/:id', (req, res) => {
  const userId = req.params.id;
  const { name, location, description, paid } = req.body;
  const query1 = `UPDATE jobs SET Nameofjobs = ?, Location =?, Description = ? ,isPaid =? WHERE ID = ?`;
  connection.query(query1, [name, location, description, paid, userId], (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }

    // Check if the record was updated successfully
    if (results.affectedRows === 1) {
      res.json({ success: true, message: 'Job updated successfully' });
    } else {
      res.status(404).json({ error: 'Job not found' });
    }
  });
});
/////////
app.post('/jobspaid', (req, res) => {
  const query = 'SELECT * FROM jobs WHERE  isPaid = 1';

  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      res.status(500).json({ success: false, message: 'An error occurred, please try again later' });
      return;
    }

    if (results.length > 0) {
      // Send the array of results in the response
      res.json({ success: true, results: results });
    } else {
      res.status(404).json({ success: false, message: 'No companies found' });
    }
  });
});
//////////
/////////
app.post('/Companys', (req, res) => {
  const query = 'SELECT * FROM login WHERE isAdmin = 2 AND isPaid = 1';

  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      res.status(500).json({ success: false, message: 'An error occurred, please try again later' });
      return;
    }

    if (results.length > 0) {
      // Send the array of results in the response
      res.json({ success: true, results: results });
    } else {
      res.status(404).json({ success: false, message: 'No companies found' });
    }
  });
});
//////////
app.get('/allCompany', (req, res) => {
  // Perform the SQL query to select all job records from the 'jobs' table
  const query = 'SELECT * FROM login WHERE isAdmin = 2';

  // Execute the query
  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      res.status(500).json({ error: 'An error occurred' });
      return;
    }

    // Send the job records as JSON response
    res.json(results);
  });
});
//////////
// Login route
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const query = 'SELECT * FROM login WHERE username = ?';

  connection.query(query, [username], (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      res.status(500).json({ success: false, message: 'An error occurred, please try again later' });
      return;
    }

    if (results.length === 0) {
      res.status(401).json({ success: false, message: 'Invalid username or password' });
      return;
    }

    const hashedPassword = results[0].pass;

    bcrypt.compare(password, hashedPassword)
      .then(match => {
        if (match) {
          const user = {
            ID: results[0].ID,
            username: results[0].username,
            email: results[0].email,
            majored: results[0].Majored,
            isAdmin: results[0].isAdmin,
            isPaid: results[0].isPaid
          };

          // Generate JWT token
          const token = jwt.sign(
            { 
              ID: user.ID,
              isAdmin: user.isAdmin,
              isPaid: user.isPaid ,
              username: user.username,
              email: user.email,
              majored: user.Majored,
            },
            'your_secret_key',
            { expiresIn: '1h' }
          ); // Adjust the expiration time as needed
//console.log(token);
          res.json({
            success: true,
            message: 'Login successful',
            token: token,
            username: user.username,
            email: user.email,
            majored: user.Majored,
          });
          //////////
          const currentDate = new Date().toISOString().slice(0, 10); // Get current date in YYYY-MM-DD format

          // Check if a record with the current date exists in the database
          const selectQuery = `SELECT * FROM charts WHERE date = ?`;
          connection.query(selectQuery, [currentDate], (error, results) => {
            if (error) {
              console.error('Error checking for existing record:', error);
             // res.status(500).json({ error: 'Failed to check for existing record' });
            } else {
              if (results.length > 0) {
                // If a record exists, increment the total by 1
                const total = results[0].Login + 1;
                updateTotal(currentDate, total, res);
              } else {
                // If no record exists, insert a new record with total set to 1
                const total = 1;
                insertRecord(currentDate, total, res);
              }
            }
          });
        
        
        // Function to update total for the current date
        const updateTotal = (date, total, res) => {
          const updateQuery = `UPDATE charts SET Login = ? WHERE date = ?`;
          connection.query(updateQuery, [total, date], (error, results) => {
            if (error) {
              console.error('Error updating total:', error);
              //res.status(500).json({ error: 'Failed to update total' });
            } else {
              console.log('Total updated successfully');
             // res.status(200).json({ message: 'Total updated successfully' });
            }
          });
        };
        
        // Function to insert a new record for the current date with total set to 1
        const insertRecord = (date, total, res) => {
          const insertQuery = `INSERT INTO charts (date, Login) VALUES (?, ?)`;
          connection.query(insertQuery, [date, total], (error, results) => {
            if (error) {
              console.error('Error inserting record:', error);
             // res.status(500).json({ error: 'Failed to insert record' });
            } else {
              console.log('Record inserted successfully');
             // res.status(200).json({ message: 'Record inserted successfully' });
            }
          });
        };

          ////////
        } else {
          res.status(401).json({ success: false, message: 'Invalid username or password' });
        }
      })
      .catch(err => {
        console.error('Error comparing passwords:', err);
        res.status(500).json({ success: false, message: 'An error occurred, please try again later' });
      });
  });
});
/////////////
/*app.get('/online1', (req, res) => {
  // Perform the SQL query to select all job records from the 'jobs' table
  const query = 'SELECT * FROM login WHERE isLogin = 1';

  // Execute the query
  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      res.status(500).json({ error: 'An error occurred' });
      return;
    }

    // Send the job records as JSON response
   // console.log();
    res.json({ username: results[0].username, pass: results[0].pass, isAdmin: results[0].isAdmin });
  });
});*/
///////////
//select who is online
/*app.get('/online', (req, res) => {
  // Perform the SQL query to select all job records from the 'jobs' table
  const query = 'SELECT * FROM login WHERE isLogin = 1 AND isAdmin = 0';

  // Execute the query
  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      res.status(500).json({ error: 'An error occurred' });
      return;
    }

    // Send the job records as JSON response
    //console.log();
    res.json({ username: results[0].username, pass: results[0].pass });
  });
});*/
///////////
/*app.get('/onlinecompany/:username', (req, res) => {
  const username =req.params.username;
  // Perform the SQL query to select all job records from the 'jobs' table
  const query = 'SELECT * FROM login WHERE username =?';

  // Execute the query
  connection.query(query,[username] ,(error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      res.status(500).json({ error: 'An error occurred' });
      return;
    }

    // Send the job records as JSON response
    //console.log();
    
    res.json({results});
  });
});*/
app.get('/getcv/:id', (req, res) => {
  const id = req.params.id;

  // SQL query to select the CV file based on the ID
  const query = 'SELECT file FROM pdf_file WHERE id = ?';

  // Execute the query
  connection.query(query, [id], (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      res.status(500).json({ error: 'An error occurred while retrieving the CV' });
      return;
    }

    if (results.length === 0) {
      res.status(404).json({ error: 'CV not found' });
      return;
    }

    // Get the CV file data from the query results
    const cvData = results[0].file;

    // Set response headers for file download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="CV_${id}.pdf"`);

    // Send the CV file data as the response
    res.send(cvData);
  });
});
/////////
app.get('/getID_Photo/:id', (req, res) => {
  const id = req.params.id;

  // SQL query to select the CV file based on the ID
  const query = 'SELECT ID_image FROM pdf_file WHERE id = ?';

  // Execute the query
  connection.query(query, [id], (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      res.status(500).json({ error: 'An error occurred while retrieving the CV' });
      return;
    }

    if (results.length === 0) {
      res.status(404).json({ error: 'ID Photo not found' });
      return;
    }

    // Get the CV file data from the query results
    const getID_Photo = results[0].ID_image;

    // Set response headers for file download
    res.setHeader('Content-Type', 'application/png');
    res.setHeader('Content-Disposition', `attachment; filename="CV_${id}.png"`);

    // Send the CV file data as the response
    res.send(getID_Photo);
  });
});

/////////
/*app.post('/newjob', (req, res) => {
  const { name, location, description, company, selectedMajored, paid } = req.body;
  const insertQuery = 'INSERT INTO jobs (Nameofjobs, Location, Description,CompanyName,Majored,isPaid) VALUES (?,?,?,?,?,?)';
  connection.query(insertQuery, [name, location, description, company, selectedMajored, paid], (insertError) => {
    if (insertError) {
      console.error('Error inserting user:', insertError);
      return res.status(500).json({ message: 'An error occurred, please try again later' });
    }

    return res.status(201).json({ message: 'User created successfully' });
  });

});*/
////////////////
app.post('/newjobAdmin', (req, res) => {
  const { jobName, jobTime, companyName, jobLocation, jobDescription, jobCategory, salary, joblevel,isPaid } = req.body;
  
  console.log(jobName, jobLocation, jobDescription, companyName, jobCategory, jobTime, salary, joblevel,isPaid);
  // Your database insertion code here
  const insertQuery = 'INSERT INTO jobs (Nameofjobs, Location, Description, CompanyName, Majored, jobtime, salary, JobLevel,isPaid) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?,?)';
  connection.query(insertQuery, [jobName, jobLocation, jobDescription, companyName, jobCategory, jobTime, salary, joblevel, isPaid], (insertError) => {
    if (insertError) {
      console.error('Error inserting job:', insertError);
      return res.status(500).json({ message: 'An error occurred, please try again later' });
    }
///////////////////
const currentDate = new Date().toISOString().slice(0, 10); // Get current date in YYYY-MM-DD format

  // Check if a record with the current date exists in the database
  const selectQuery = `SELECT * FROM charts WHERE date = ?`;
  connection.query(selectQuery, [currentDate], (error, results) => {
    if (error) {
      console.error('Error checking for existing record:', error);
      //res.status(500).json({ error: 'Failed to check for existing record' });
    } else {
      if (results.length > 0) {
        // If a record exists, increment the total by 1
        const total = results[0].Jobs + 1;
        updateTotal(currentDate, total, res);
      } else {
        // If no record exists, insert a new record with total set to 1
        const total = 1;
        insertRecord(currentDate, total, res);
      }
    }
  });


// Function to update total for the current date
const updateTotal = (date, total, res) => {
  const updateQuery = `UPDATE charts SET Jobs = ? WHERE date = ?`;
  connection.query(updateQuery, [total, date], (error, results) => {
    if (error) {
      console.error('Error updating total:', error);
     // res.status(500).json({ error: 'Failed to update total' });
    } else {
      console.log('Total updated successfully');
      //res.status(200).json({ message: 'Total updated successfully' });
    }
  });
};

// Function to insert a new record for the current date with total set to 1
const insertRecord = (date, total, res) => {
  const insertQuery = `INSERT INTO charts (date, Jobs) VALUES (?, ?)`;
  connection.query(insertQuery, [date, total], (error, results) => {
    if (error) {
      console.error('Error inserting record:', error);
    //  res.status(500).json({ error: 'Failed to insert record' });
    } else {
      console.log('Record inserted successfully');
      //res.status(200).json({ message: 'Record inserted successfully' });
    }
  });
};

//////////////////
    return res.status(201).json({ message: 'Job created successfully' });
  });
});
///////////
app.get('/imgCom/:id', (req, res) => {
const id=req.params.id;
const img ='SELECT * FROM jobs WHERE ID = ?';
connection.query(img, [id], (error, results) => {
  if (error) {
    console.error('Error executing query:', error);
    res.status(500).json({ success: false, message: 'An error occurred, please try again later' });
    return;
  }

  if (results) {
    ////////

    ///////////
    res.end(
     results[0].img
     );
  } else {
    res.status(401).json({ success: false, message: 'Invalid username or password' });
  }
});

})
/////
app.post('/newjobCom', (req, res) => {
  const { jobName, jobTime, companyName, jobLocation, jobDescription, jobCategory, salary, joblevel,isPaid } = req.body;
  
  console.log(jobName, jobLocation, jobDescription, companyName, jobCategory, jobTime, salary, joblevel,isPaid);
  // Your database insertion code here
  const insertQuery = 'INSERT INTO jobs (Nameofjobs, Location, Description, CompanyName, Majored, jobtime, salary, JobLevel,isPaid) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?,?)';
  connection.query(insertQuery, [jobName, jobLocation, jobDescription, companyName, jobCategory, jobTime, salary, joblevel, isPaid], (insertError) => {
    if (insertError) {
      console.error('Error inserting job:', insertError);
      return res.status(500).json({ message: 'An error occurred, please try again later' });
    }
////////////////
//Jobs Charts
const currentDate = new Date().toISOString().slice(0, 10); // Get current date in YYYY-MM-DD format

  // Check if a record with the current date exists in the database
  const selectQuery = `SELECT * FROM charts WHERE date = ?`;
  connection.query(selectQuery, [currentDate], (error, results) => {
    if (error) {
      console.error('Error checking for existing record:', error);
    //  res.status(500).json({ error: 'Failed to check for existing record' });
    } else {
      if (results.length > 0) {
        // If a record exists, increment the total by 1
        const total = results[0].Jobs + 1;
        updateTotal(currentDate, total, res);
      } else {
        // If no record exists, insert a new record with total set to 1
        const total = 1;
        insertRecord(currentDate, total, res);
      }
    }
  });


// Function to update total for the current date
const updateTotal = (date, total, res) => {
  const updateQuery = `UPDATE charts SET Jobs = ? WHERE date = ?`;
  connection.query(updateQuery, [total, date], (error, results) => {
    if (error) {
      console.error('Error updating total:', error);
  //    res.status(500).json({ error: 'Failed to update total' });
    } else {
      console.log('Total updated successfully');
  //    res.status(200).json({ message: 'Total updated successfully' });
    }
  });
};

// Function to insert a new record for the current date with total set to 1
const insertRecord = (date, total, res) => {
  const insertQuery = `INSERT INTO charts (date, Jobs) VALUES (?, ?)`;
  connection.query(insertQuery, [date, total], (error, results) => {
    if (error) {
      console.error('Error inserting record:', error);
     // res.status(500).json({ error: 'Failed to insert record' });
    } else {
      console.log('Record inserted successfully');
    //  res.status(200).json({ message: 'Record inserted successfully' });
    }
  });
};

//////////////
    return res.status(201).json({ message: 'Job created successfully' });
  });
});
///////////////

//////////
app.post('/newuser', (req, res) => {
  let { name, email, majored, size, isPaid,isAdmin } = req.body;
  const Img = req.files;
  console.log(Img)
  console.log(Img.image[0].data)
  console.log(name[0])
  const query = 'SELECT * FROM login WHERE username = ? OR email = ?';
  connection.query(query, [name[0], email[0]], (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      return res.status(500).json({ message: 'An error occurred, please try again later' });
    }

    if (results.length > 0) {
      const existingUser = results.find(user => user.username === name || user.email === email);
      if (existingUser.username === name) {
        return res.status(400).json({ message: 'Username already exists' });
      } else {
        return res.status(400).json({ message: 'Email already exists' });
      }
    }

    // Generate random password
    const randomVariable = Math.floor(100000000 + Math.random() * 900000000);
    
    // Hash the random password (You need to import bcrypt)
    bcrypt.hash(randomVariable.toString(), saltRounds)
      .then(hashedPassword => {
        // Do something with the hashed password here
        
        // Send verification email
        var transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: 'mohammedadwan44@gmail.com',
            pass: 'uvtn gwwl yqgy dxie'
          }
        });

        var mailOptions = {
          from: 'mohammedadwan44@gmail.com',
          to: email,
          subject: 'Account Password',
          text: 'This email contains the password for your account: ' + randomVariable + '. Do not share it with anyone.'
        };

        transporter.sendMail(mailOptions, function(error, info) {
          if (error) {
            //console.log(error);
            return res.status(500).json({ message: 'Error sending verification email' });
          } else {
           // console.log('Email sent: ' + info.response);
            
            // Insert new user into the database
            const insertQuery = 'INSERT INTO login (username, pass, email, isAdmin, isLogin, size, Majored, isPaid, img) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
            connection.query(insertQuery, [name[0], hashedPassword, email[0], isAdmin[0], '0', size[0], majored[0], isPaid[0], Img.image[0].data], (insertError) => {
              if (insertError) {
                console.error('Error inserting user:', insertError);
                return res.status(500).json({ message: 'An error occurred, please try again later' });
              }
              return res.status(201).json({ message: 'User created successfully' });
            });
          }
        });
      })
      .catch(hashError => {
        console.error('Error hashing password:', hashError);
        return res.status(500).json({ message: 'An error occurred, please try again later' });
      });
  });
});

/////////
app.post('/signupforedit', (req, res) => {
  const { username, email } = req.body;

  // Insert new user into the database
  const insertQuery = 'INSERT INTO infor (username, Email) VALUES (?, ?)';
  connection.query(insertQuery, [username, email], (insertError) => {
    if (insertError) {
      console.error('Error inserting user:', insertError);
      return res.status(500).json({ message: 'An error occurred, please try again later' });
    }

    return res.status(201).json({ message: 'User created successfully' });
  });
});
///////
app.post('/signup', (req, res) => {
  const { username, email, password, isadmin, islogin, selectedMajored } = req.body;
  // Check if username or email already exists in the database
  const query = 'SELECT * FROM login WHERE username = ? OR email = ?';
  connection.query(query, [username, email], (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      return res.status(500).json({ message: 'An error occurred, please try again later' });
    }

    if (results.length > 0) {
      const existingUser = results.find(user => user.username === username || user.email === email);
      if (existingUser.username === username) {
        return res.status(400).json({ message: 'Username already exists' });
      } else {
        return res.status(400).json({ message: 'Email already exists' });
      }
    }
    bcrypt.hash(password, saltRounds)
  .then(hashedPassword => {
    // Do something with the hashed password here
    const insertQuery = 'INSERT INTO login (username, email, pass, isAdmin, isLogin,Majored) VALUES (?,?, ?, ?, ?, ?)';
    connection.query(insertQuery, [username, email, hashedPassword, isadmin, islogin, selectedMajored], (insertError) => {
      if (insertError) {
        console.error('Error inserting user:', insertError);
        return res.status(500).json({ message: 'An error occurred, please try again later' });
      }

      // Insert additional user info into the "info" table
      const insertQuery1 = 'INSERT INTO infor (username, Email) VALUES (?, ?)';
      connection.query(insertQuery1, [username, email], (infoInsertError) => {
        if (infoInsertError) {
          console.error('Error inserting user info:', infoInsertError);
          return res.status(500).json({ message: 'An error occurred, please try again later' });
        }

        return res.status(201).json({ message: 'User created successfully' });
      });
    });


    //////////////////////////
    //console.log('Hashed password:', hashedPassword);
  })
  .catch(error => {
    console.error('Error hashing password:', error);
  });
    // Insert new user into the database
    
  });
});

/////////
app.delete('/deleteJob/:id', (req, res) => {
  const jobId = req.params.id;

  const query = 'DELETE FROM jobs WHERE id = ?';

  connection.query(query, [jobId], (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }

    res.json({ success: true, message: 'Job deleted successfully' });
  });
});
app.delete('/dpftypedelte/:id/:email/:username/:jobname/:useremail', (req, res) => {
  const jobId = req.params.id;
  const email = req.params.email;
  const username = req.params.username;
  const jobname = req.params.jobname;
  const useremail = req.params.useremail;

  const query = 'DELETE FROM pdf_file WHERE ID = ?';

  connection.query(query, [jobId], (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'mohammedadwan44@gmail.com',
        pass: 'uvtn gwwl yqgy dxie'
      }
    });
    var mailOptions = {
      from: 'mohammedadwan44@gmail.com',
      to: useremail,
      subject: 'We are sorry that your application was rejected ' + username,
      text: 'We are sorry that your application for the job ' + jobname + ' was rejected. For any information, contact us via official mail: ' + email + '. Thank you'
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        //console.log(error);
      } else {
        //console.log('Email sent: ' + info.response);
      }
    });
    res.json({ success: true, message: 'Job deleted successfully' });
  });
});

//////////
app.delete('/deleteuser/:id', (req, res) => {
  const jobId = req.params.id;

  const query = 'DELETE FROM login WHERE id = ?';

  connection.query(query, [jobId], (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }

    res.json({ success: true, message: 'Job deleted successfully' });
  });
});
//////////////
function getCountOfValue(valueToCount, callback) {
  // Query to count occurrences of the value in the jobs table
  const query = 'SELECT COUNT(*) AS count FROM jobs WHERE Majored = ?'; // Adjust column_name as per your table schema

  // Execute the query with the provided value
  connection.query(query, [valueToCount], (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      callback(error, null);
      return;
    }

    // Extract the count from the query result
    const count = results[0].count;
    callback(null, count);
  });
}
app.get('/count/:value', (req, res) => {
  const valueToCount = req.params.value;

  // Call the getCountOfValue function to get the count
  getCountOfValue(valueToCount, (error, count) => {
    if (error) {
      res.status(500).json({ error: 'An error occurred while counting the value' });
      return;
    }

    res.json({ count });
  });
});
///////////
app.post('/froget-pass-update', (req, res) => {
  const { pass, email } = req.body;
//console.log(pass,email,"sadfsf")
  // Validation: Check if pass and email are present
  

  bcrypt.hash(pass, saltRounds)
    .then(hashedPassword => {
      const query1 = `UPDATE login SET pass = ? WHERE email = ?`;
      connection.query(query1, [hashedPassword, email], (error, results) => {
        if (error) {
          console.error('Error updating password:', error);
          return res.status(500).json({ message: "Error updating password" });
        }

        // Check if any rows were affected (password updated)
        if (results.affectedRows > 0) {
          return res.status(200).json({ message: "Password updated successfully" });
        } else {
          return res.status(404).json({ message: "User not found or password not updated" });
        }
      });
    })
    .catch(hashError => {
      console.error('Error hashing password:', hashError);
      return res.status(500).json({ message: "Error hashing password" });
    });
});

////////////
app.get('/forget-send-email',function(req,res){
  const randomVariable = Math.floor(100000 + Math.random() * 900000);
  const { email } = req.query;
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'mohammedadwan44@gmail.com',
      pass: 'uvtn gwwl yqgy dxie'
    }
  });
  var mailOptions = {
    from: 'mohammedadwan44@gmail.com',
    to: email,
    subject: 'Confirmation Code',
    text: 'Confirmation code to change the password for your account on Hire me the website  '+randomVariable+' Please dont share it if you dont want it'
  };
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      //console.log(error);
    } else {
     // console.log('Email sent: ' + info.response);
      res.json({ success: true, message: 'Email sent successfully', randomVariable });
    }
  });
})

///////////
app.get('/send-email',function(req,res){
  const randomVariable = Math.floor(100000 + Math.random() * 900000);
  const { email } = req.query;
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'mohammedadwan44@gmail.com',
      pass: 'uvtn gwwl yqgy dxie'
    }
  });
  var mailOptions = {
    from: 'mohammedadwan44@gmail.com',
    to: email,
    subject: 'Vrification Account',
    text: 'This email is for verification your account in Hire me Website This is the code  '+randomVariable+' Please dont share it if you dont want it'
  };
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
     // console.log(error);
    } else {
      //console.log('Email sent: ' + info.response);
      res.json({ success: true, message: 'Email sent successfully', randomVariable });
    }
  });
})
/*app.post('/addExperiences/:username/:ID', (req, res) => {
  const username = req.params.username;
  const ID = req.params.ID;
  const { name, companyName, time, startDate, endDate, location, discription } = req.body; // Use req.body instead of req.query

  // Insert new experience into the database
  const insertQuery = 'INSERT INTO experiences (username, name, companyName, time, startDate, endDate, location, discription, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
  connection.query(insertQuery, [username, name, companyName, time, startDate, endDate, location, discription, ''], (insertError) => {
    if (insertError) {
      console.error('Error inserting experience:', insertError);
      return res.status(500).json({ message: 'An error occurred, please try again later' });
    }

    return res.status(201).json({ message: 'Experience created successfully' });
  });
});*/
app.post('/addExperiences/:username/:ID', (req, res) => {
  const username = req.params.username;
  const ID = req.params.ID;
  const { name, companyName, time, startDate, endDate, location, discription } = req.body;

  // Check if experience with the given ID exists
  const checkQuery = 'SELECT * FROM experiences WHERE username = ? AND ID = ?';
  connection.query(checkQuery, [username, ID], (checkError, results) => {
    if (checkError) {
      console.error('Error checking for experience:', checkError);
      return res.status(500).json({ message: 'An error occurred, please try again later' });
    }

    if (results.length > 0) {
      // Experience with the given ID exists, update it
      const updateQuery = 'UPDATE experiences SET name = ?, companyName = ?, time = ?, startDate = ?, endDate = ?, location = ?, discription = ? WHERE username = ? AND ID = ?';
      connection.query(updateQuery, [name, companyName, time, startDate, endDate, location, discription, username, ID], (updateError) => {
        if (updateError) {
          console.error('Error updating experience:', updateError);
          return res.status(500).json({ message: 'An error occurred, please try again later' });
        }
        
        return res.status(200).json({ message: 'Experience updated successfully' });
      });
    } else {
      // Experience with the given ID does not exist, insert a new record
      const insertQuery = 'INSERT INTO experiences (username, ID, name, companyName, time, startDate, endDate, location, discription, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
      connection.query(insertQuery, [username, ID, name, companyName, time, startDate, endDate, location, discription, ''], (insertError) => {
        if (insertError) {
          console.error('Error inserting experience:', insertError);
          return res.status(500).json({ message: 'An error occurred, please try again later' });
        }

        return res.status(201).json({ message: 'Experience created successfully' });
      });
    }
  });
});


app.post('/addEducations/:username/:ID', (req, res) => {
  const username = req.params.username;
  const ID = req.params.ID;
  const { name, major, year, discription, image } = req.body;

  // Check if education with the given ID and username exists
  const checkQuery = 'SELECT * FROM educations WHERE ID = ? AND username = ?';
  connection.query(checkQuery, [ID, username], (checkError, results) => {
    if (checkError) {
      console.error('Error checking for education:', checkError);
      return res.status(500).json({ message: 'An error occurred, please try again later' });
    }

    if (results.length > 0) {
      // Education with the given ID and username exists, update it
      const updateQuery = 'UPDATE educations SET name = ?, major = ?, year = ?, discription = ? WHERE ID = ?';
      connection.query(updateQuery, [name, major, year, discription, ID], (updateError) => {
        if (updateError) {
          console.error('Error updating education:', updateError);
          return res.status(500).json({ message: 'An error occurred, please try again later' });
        }

        return res.status(200).json({ message: 'Education updated successfully' });
      });
    } else {
      // Education with the given ID and username does not exist, insert it
      const insertQuery = 'INSERT INTO educations (username, ID, name, major, year, discription, image) VALUES (?, ?, ?, ?, ?, ?, ?)';
      connection.query(insertQuery, [username, ID, name, major, year, discription, ''], (insertError) => {
        if (insertError) {
          console.error('Error inserting education:', insertError);
          return res.status(500).json({ message: 'An error occurred, please try again later' });
        }

        return res.status(201).json({ message: 'Education inserted successfully' });
      });
    }
  });
});


app.delete('/deleteExperiences/:id', (req, res) => {
  const jobId = req.params.id;

  const query = 'DELETE FROM experiences WHERE id = ?';

  connection.query(query, [jobId], (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }

    res.json({ success: true, message: 'Experiences deleted successfully' });
  });
});
app.delete('/deleteEducations/:id', (req, res) => {
  const jobId = req.params.id;

  const query = 'DELETE FROM educations WHERE id = ?';

  connection.query(query, [jobId], (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }

    res.json({ success: true, message: 'Educations deleted successfully' });
  });
});
app.post('/updateinfor/:username', (req, res) => {
  const username = req.params.username;
  const {Name,email,Bio,Skill1,Skill2,img,Phone,Languages,country,city,Instagram,Facebook,Website} = req.query;
 // console.log(city,"ffefafa");
  // Insert new user into the 
  const insertQuery = `UPDATE infor SET Name = ?, email =?, Bio = ?, Skill1 =? , Skill2 = ? ,img=?,Phone=? ,Languages=?,country=? ,city=?,Instagram=?,Facebook=?,Website=? WHERE username = ? `;
  connection.query(insertQuery, [Name,email,Bio,Skill1,Skill2,img,Phone,Languages,country,city,Instagram,Facebook,Website,username], (insertError) => {
    if (insertError) {
      console.error('Error inserting user:', insertError);
      return res.status(500).json({ message: 'An error occurred, please try again later' });
    }

    return res.status(201).json({ message: 'Experiences created successfully' });
  });
});
////////////////
app.post('/upload-skills/:username', (req, res) => {
  const username = req.params.username;
  const {  skills } = req.body;

  // Check if skills data for the user already exists
  const checkQuery = 'SELECT * FROM infor WHERE username = ?';
  connection.query(checkQuery, [username], (checkError, results) => {
    if (checkError) {
      console.error('Error checking skills:', checkError);
      return res.status(500).json({ message: 'An error occurred while checking skills data' });
    }

    if (results.length > 0) {
      // Skills data exists for the user, update it
      const updateQuery = 'UPDATE infor SET skills = ? WHERE username = ?';
      connection.query(updateQuery, [skills, username], (updateError) => {
        if (updateError) {
          console.error('Error updating skills:', updateError);
          return res.status(500).json({ message: 'An error occurred while updating skills data' });
        }
        return res.status(200).json({ message: 'Skills data updated successfully' });
      });
    } else {
      // Skills data does not exist for the user, insert new record
      const insertQuery = 'INSERT INTO infor (username, skills) VALUES (?, ?)';
      connection.query(insertQuery, [username, skills], (insertError) => {
        if (insertError) {
          console.error('Error inserting skills:', insertError);
          return res.status(500).json({ message: 'An error occurred while inserting skills data' });
        }
        return res.status(200).json({ message: 'Skills data inserted successfully' });
      });
    }
  });
});

//////////////
app.post('/upload-Social/:username', (req, res) => {
  const username = req.params.username;
  const {  socials } = req.body;

  // Check if skills data for the user already exists
  const checkQuery = 'SELECT * FROM infor WHERE username = ?';
  connection.query(checkQuery, [username], (checkError, results) => {
    if (checkError) {
      console.error('Error checking Social:', checkError);
      return res.status(500).json({ message: 'An error occurred while checking Social data' });
    }

    if (results.length > 0) {
      // Skills data exists for the user, update it
      const updateQuery = 'UPDATE infor SET Social = ? WHERE username = ?';
      connection.query(updateQuery, [socials, username], (updateError) => {
        if (updateError) {
          console.error('Error updating Social:', updateError);
          return res.status(500).json({ message: 'An error occurred while updating Social data' });
        }
        return res.status(200).json({ message: 'Social data updated successfully' });
      });
    } else {
      // Skills data does not exist for the user, insert new record
      const insertQuery = 'INSERT INTO infor (username, Social) VALUES (?, ?)';
      connection.query(insertQuery, [username, socials], (insertError) => {
        if (insertError) {
          console.error('Error inserting Social:', insertError);
          return res.status(500).json({ message: 'An error occurred while inserting Social data' });
        }
        return res.status(200).json({ message: 'Skills data inserted successfully' });
      });
    }
  });
});
/////////////
app.post('/allinformation/:username/:Bio', (req, res) => {
  const username = req.params.username;
  const Bio = req.params.Bio;


  // Check if education with the given ID and username exists
  const checkQuery = 'SELECT * FROM infor WHERE  username = ?';
  connection.query(checkQuery, [ username], (checkError, results) => {
    if (checkError) {
      console.error('Error checking for infor:', checkError);
      return res.status(500).json({ message: 'An error occurred, please try again later' });
    }

    if (results.length > 0) {
      // Education with the given ID and username exists, update it
      const updateQuery = 'UPDATE infor SET Bio = ? WHERE username = ?';
      connection.query(updateQuery, [Bio,username], (updateError) => {
        if (updateError) {
          console.error('Error updating infor:', updateError);
          return res.status(500).json({ message: 'An error occurred, please try again later' });
        }

        return res.status(200).json({ message: 'infor updated successfully' });
      });
    } else {
      // Education with the given ID and username does not exist, insert it
      const insertQuery = 'INSERT INTO infor (username,Bio) VALUES (?, ?)';
      connection.query(insertQuery, [username,Bio], (insertError) => {
        if (insertError) {
          console.error('Error inserting infor:', insertError);
          return res.status(500).json({ message: 'An error occurred, please try again later' });
        }

        return res.status(201).json({ message: 'infor inserted successfully' });
      });
    }
  });
});
///////////////////
app.post('/allinformationadd/:username', (req, res) => {
  const username = req.params.username;
  const { email, languages, phone } = req.body;
  // Check if education with the given ID and username exists
  const checkQuery = 'SELECT * FROM infor WHERE username = ?';
  connection.query(checkQuery, [ username], (checkError, results) => {
    if (checkError) {
      console.error('Error checking for infor additinal Data:', checkError);
      return res.status(500).json({ message: 'An error occurred, please try again later' });
    }

    if (results.length > 0) {
      // Education with the given ID and username exists, update it
      const updateQuery = 'UPDATE infor SET Phone =? , email = ?, Languages = ?  WHERE username= ?';
      connection.query(updateQuery, [phone, email, languages,username], (updateError) => {
        if (updateError) {
          console.error('Error infor additinal Data education:', updateError);
          return res.status(500).json({ message: 'An error occurred, please try again later' });
        }
//////////
const updateQuery1 = 'UPDATE pdf_file SET email =?  WHERE username= ?';
      connection.query(updateQuery1, [ email,username], (updateError) => {
        if (updateError) {
          console.error('Error In edite email in PDF Table education:', updateError);
          return res.status(500).json({ message: 'An error occurred, please try again later' });
        }
       
      });
      const updateQuery2 = 'UPDATE login SET email =?  WHERE username= ?';
      connection.query(updateQuery2, [ email,username], (updateError) => {
        if (updateError) {
          console.error('Error In edite email in Login Table education:', updateError);
          return res.status(500).json({ message: 'An error occurred, please try again later' });
        }
       
      });

////////////
        return res.status(200).json({ message: 'infor additinal Data updated successfully' });
      });
    } else {
      // Education with the given ID and username does not exist, insert it
      const insertQuery = 'INSERT INTO infor (username ,Phone, email, Languages) VALUES (?,?, ?, ?)';
      connection.query(insertQuery, [username ,phone, email, languages], (insertError) => {
        if (insertError) {
          console.error('Error inserting infor additinal Data:', insertError);
          return res.status(500).json({ message: 'An error occurred, please try again later' });
        }

        return res.status(201).json({ message: 'infor additinal Data inserted successfully' });
      });
    }
  });
});
////////////

/////////////////
app.post('/allinformationaddmain/:username', (req, res) => {
  const username = req.params.username;
  const { name, companyName, country,city} = req.body;
  console.log(req.body)
  let jobImg; // Declare jobImg using let

if (req.files && req.files.image !== undefined) {
  jobImg = req.files.image; // Assign value if req.files.image exists
}

    //console.log(jobImg.data)

  // Check if education with the given ID and username exists
  const checkQuery = 'SELECT * FROM infor WHERE username = ?';
  connection.query(checkQuery, [ username], (checkError, results) => {
    if (checkError) {
      console.error('Error checking for infor additinal Data:', checkError);
      return res.status(500).json({ message: 'An error occurred, please try again later' });
    }

    if (results.length > 0) {
      if(jobImg !==undefined  && name ==results.name  && country==results.country && city == results.city){
      // Education with the given ID and username exists, update it
      const updateQuery = 'UPDATE infor SET SETimg=?, companyname= ? WHERE username = ?';
      connection.query(updateQuery, [jobImg.data,companyName,username], (updateError) => {
        if (updateError) {
          console.error('Error infor additinal Data education:', updateError);
          return res.status(500).json({ message: 'An error occurred, please try again later' });
          
        }
        

        return res.status(200).json({ message: 'infor additinal Data updated successfully' });
      });
    }
      else if((jobImg !==undefined ) &&( name !==results.name  || country !==results.country || city !== results.city))
        {
/////////
const updateQuery = 'UPDATE infor SET SETimg=? , companyname = ? WHERE username = ?';
      connection.query(updateQuery, [jobImg.data,companyName,username], (updateError) => {
        if (updateError) {
          console.error('Error infor additinal Data education:', updateError);
          return res.status(500).json({ message: 'An error occurred, please try again later' });
          
        }

        return res.status(200).json({ message: 'infor additinal Data updated successfully' });
      });
        //////
        connection.query("CREATE TABLE IF NOT EXISTS tempedtie (Name VARCHAR(255), city VARCHAR(255), username VARCHAR(255),country VARCHAR(255))", (err, result) => {
          if (err) return res.status(500).json({ error: err.message });
          //console.log("Table created or already exists");
      
          // Insert data into the table
          connection.query("INSERT INTO tempedtie (Name, country, username, country) VALUES (?, ?, ?, ?)", [name, username, country,city], (err, result) => {
            if(err){
             // console.log(err)
              return res.status(500).json({ error: err.message })}
          
           // console.log("Data inserted successfully");
            res.status(200).json({ message: "Data inserted successfully" });
          });
        });
        ///////
      }
      else if((jobImg ==undefined ) &&( name !==results.name || country !==results.country || city !== results.city))
      //////
      console.log("fadf")
      connection.query("CREATE TABLE IF NOT EXISTS tempedtie(Name VARCHAR(255), city VARCHAR(255), username VARCHAR(255),country VARCHAR(255))", (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
       // console.log(err)}
        // Insert data into the table
            // Insert data into the table
          connection.query("INSERT INTO tempedtie (Name, city, username, country) VALUES (?, ?, ?, ?)", [name, city,username,country], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            //console.log("Data inserted successfully");
            /////////
            const updateQuery = 'UPDATE infor SET companyname=? WHERE username = ?';
            connection.query(updateQuery, [companyName,username], (updateError) => {
              if (updateError) {
                console.error('Error infor additinal Data education:', updateError);
                return res.status(500).json({ message: 'An error occurred, please try again later' });
                
              }})
            ///////////
            res.status(200).json({ message: "Data inserted successfully" });
          });
        });
      
      /////////////////
    } else {
      if(jobImg == undefined){
      // Education with the given ID and username does not exist, insert it
      const insertQuery = 'INSERT INTO infor (username ,Name, companyname, country,city) VALUES (?,?,?,?, ?)';
      connection.query(insertQuery, [username ,name, companyName, country,city], (insertError) => {
        if (insertError) {
          console.error('Error inserting infor additinal Data:', insertError);
          return res.status(500).json({ message: 'An error occurred, please try again later' });
        }

        return res.status(201).json({ message: 'infor additinal Data inserted successfully' });
      });}
      else{ const insertQuery = 'INSERT INTO infor (username ,Name, companyname, country,city,img) VALUES (?,?,?,?, ?, ?)';
      connection.query(insertQuery, [username ,name, companyName, country,city,jobImg.data.data], (insertError) => {
        if (insertError) {
          console.error('Error inserting infor additinal Data:', insertError);
          return res.status(500).json({ message: 'An error occurred, please try again later' });
        }

        return res.status(201).json({ message: 'infor additinal Data inserted successfully' });
      });}


    }
  });
});
/////////////////////
app.post('/acceptediteadmin/:username/:city/:country/:name', (req, res) => {
  // Check if table is empty
  const username=req.params.username;
  const city=req.params.city;
  const country=req.params.country;
  const name=req.params.name;
  
  const updateQuery2 = 'UPDATE infor SET city =?, country=? ,name=?  WHERE username= ?';
  connection.query(updateQuery2, [ city,country,name,username], (updateError) => {
    if (updateError) {
      console.error('Error In edite email in Login Table education:', updateError);
      return res.status(500).json({ message: 'An error occurred, please try again later' });
    }
  })
  
  const query = 'DELETE FROM tempedtie WHERE username = ?';

  connection.query(query, [username], (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }})
  connection.query("SELECT * FROM tempedtie", (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.length === 0) {
      // If table is empty, delete it
      connection.query("DROP TABLE tempedtie", (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        //console.log("Table deleted");
        res.status(200).json({ message: "Table deleted" });
      });
    } else {
     // console.log("Table is not empty");
      res.status(200).json({ message: "Table is not empty" });
    }
  });
});


///////////////////////////
app.get('/accepteedite', (req, res) => {
  const tableName = 'tempedtie'; // Table name to check
const databaseName='projectfinal'
  // Query to check if the table exists
  const tableCheckQuery = `SELECT COUNT(*) AS tableExists FROM information_schema.tables WHERE table_schema = ? AND table_name = ?`;
  
  connection.query(tableCheckQuery, [databaseName, tableName], (checkError, checkResults) => {
    if (checkError) {
      console.error('Error checking table existence:', checkError);
      return res.status(500).json({ success: false, message: 'An error occurred while checking table existence' });
    }

    // Check if the table exists
    const tableExists = checkResults[0].tableExists === 1;
    
    if (!tableExists) {
      // Table does not exist
      return res.status(404).json({ success: false, message: 'Table does not exist' });
    }

    // Table exists, proceed with the query
    const imgQuery = 'SELECT * FROM tempedtie';
    connection.query(imgQuery, (error, results) => {
      if (error) {
        console.error('Error executing query:', error);
        return res.status(500).json({ success: false, message: 'An error occurred while fetching data' });
      }
      
      // If no results or image data found
      res.json(results);
    });
  });
});
///////////
app.delete('/deleteedtiadmin/:username', (req, res) => {
  // Check if table is empty
  const username=req.params.username;
  //console.log(username,"fdas")
  const query = 'DELETE FROM tempedtie WHERE username = ?';

  connection.query(query, [username], (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }})
  connection.query("SELECT * FROM tempedtie", (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.length === 0) {
      // If table is empty, delete it
      connection.query("DROP TABLE tempedtie", (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
      //  console.log("Table deleted");
        res.status(200).json({ message: "Table deleted" });
      });
    } else {
      //console.log("Table is not empty");
      res.status(200).json({ message: "Table is not empty" });
    }
  });
});

/////////////
app.get('/profileimg/:username', (req, res) => {
  const username = req.params.username;
  const imgQuery = 'SELECT img FROM infor WHERE username = ?';
  connection.query(imgQuery, [username], (error, results) => {
      if (error) {
          console.error('Error executing query:', error);
          res.status(500).json({ success: false, message: 'An error occurred, please try again later' });
          return;
      }

      if (results.length > 0 && results[0].img) {
          // If the query returned results and the image data exists
          const imageBuffer = results[0].img; // Assuming the image data is stored as a buffer
          res.end(imageBuffer);
      } else {
          // If no results or image data found
          res.status(404).json({ success: false, message: 'Profile image not found' });
      }
  });
});

///////////
app.post('/generate-pdf', async (req, res) => {
  try {
    const {  experiences, educations, skills,additionalDetails,mainData } = req.body;

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    // Construct HTML content dynamically using template literals
    let htmlContent = `<!DOCTYPE html>
      <html>
        <head>
          <style>
            /* Add your CSS styles here */
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
            }
            h1 {
              color: #333;
              text-decoration: underline;
            }
            .section {
              margin-bottom: 20px;
            }
          </style>
        </head>
        <body>
          <div class="section">
          <h3>${mainData.name}</h3>
            <h3><strong>Company Name:</strong> ${mainData.companyName}</h3>
            <h3><strong>Phone:</strong> ${mainData.country}</h3>
            <h3><strong>Phone:</strong> ${mainData.city}</h3>
            <h3>Email :${additionalDetails.email}</h3>
            <h3><strong>Phone:</strong> ${additionalDetails.phone}</h3>
            <h3><strong>Languages:</strong> ${additionalDetails.languages}</h3>
          </div>`;

    // Add experiences
    htmlContent += `<div class="section">
                      <h2>Experiences</h2>`;
    experiences.forEach((experience, index) => {
      htmlContent += `<p><strong>Experience ${index + 1}:`;
      // Add other fields as needed
      htmlContent += `<p><strong>Company Name :</strong> ${experience.companyName}</p>`;
      
      htmlContent += `<p><strong>Time :</strong> ${experience.time}</p>`;

      htmlContent += `<p><strong>Start Date - End Date :</strong> ${experience.startDate} - ${experience.endDate}</p>`;
     
     htmlContent += `<p><strong>Location :</strong> ${experience.location}</p>`;

      htmlContent += `<p><strongDescription :</strong> ${experience.description}</p>`;

    });
    htmlContent += `</div>`;

    // Add educations
    htmlContent += `<div class="section">
                      <h2>Educations</h2>`;
    educations.forEach((education, index) => {
      htmlContent += `<p><strong>Education ${index + 1}:`;
      // Add other fields as needed
      htmlContent += `<p><strong>Major :</strong> ${education.major}</p>`;

      htmlContent += `<p><strong>Year :</strong> ${education.year}</p>`;

      htmlContent += `<p><strong>Description :</strong> ${education.description}</p>`;

      });
    htmlContent += `</div>`;

    // Add skills
    htmlContent += `<div class="section">
                      <h2>Skills</h2>`;
    skills.forEach((skill, index) => {
      htmlContent += `<p><strong>Skill ${index + 1}:</strong> ${skill.name}</p>`;
      // Add other fields as needed
    });
    htmlContent += `</div>`;

    htmlContent += `</body>
      </html>`;

    // Load HTML content into the page
    await page.setContent(htmlContent);

    // Generate PDF
    const pdfBuffer = await page.pdf({ format: 'A4' });

    // Set response headers and send PDF buffer
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=cv.pdf');
    res.send(pdfBuffer);

    // Close browser
    await browser.close();
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).send('Error generating PDF');
  }
  
});
///////////////////////////
app.get('/applicants/:jobname', (req, res) => {
  const jobName = req.params.jobname;

  const sql = `
    SELECT 
      p.ID,
      p.file,
      p.username,
      p.jobname,
      p.CompanyName,
      p.email,
      u.Skills AS skills,
      u.city AS location,
      GROUP_CONCAT(CONCAT(e.name, ': ', e.discription) SEPARATOR ', ') AS experiences
    FROM 
      pdf_file p
    JOIN 
      infor u 
    ON 
      p.username = u.username
    LEFT JOIN
      experiences e
    ON
      p.username = e.username
    WHERE 
      p.jobname = ?
      AND
      p.Type = 0
    GROUP BY
      p.ID;
  `;

  connection.query(sql, [jobName], (err, results) => {
    if (err) {
      console.error('Error executing SQL query: ', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.json(results);
  });
});

////////////
app.get('/userjobs/:username', (req, res) => {
  const username = req.params.username;

  const sql = ` SELECT username, jobname, CompanyName,Type  FROM   pdf_file   WHERE   username = ?  `;

  connection.query(sql, [username], (err, results) => {
    if (err) {
      console.error('Error executing SQL query: ', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    //console.log(results)
    res.json(results);
  });
});
//here is change 20022
////////////////////////
app.get('/job-stats', (req, res) => {
  // Extract start and end dates from query parameters
  const startDate = req.query.startDate;
  const endDate = req.query.endDate;
  //console.log(`Received startDate: ${startDate}, endDate: ${endDate}`);

  const query = `SELECT DATE(Date) AS date, Jobs AS Jobs FROM charts WHERE Date BETWEEN ? AND ? GROUP BY DATE(Date)`;

  // Execute SQL query with parameters
  connection.query(query, [startDate, endDate], (error, results) => {
    if (error) {
      console.error('Error fetching job stats:', error);
      res.status(500).json({ error: 'Failed to fetch job stats' });
    } else {
      //console.log('Job stats fetched successfully');
     // console.log(results);
      res.status(200).json(results);
    }
  });
});
app.get('/login-stats', (req, res) => {
  // Extract start and end dates from query parameters
  const startDate = req.query.startDate;
  const endDate = req.query.endDate;
  //console.log(`Received startDate: ${startDate}, endDate: ${endDate}`);

  const query = `SELECT DATE(Date) AS date, Login AS Login FROM charts WHERE Date BETWEEN ? AND ? GROUP BY DATE(Date)`;

  // Execute SQL query with parameters
  connection.query(query, [startDate, endDate], (error, results) => {
    if (error) {
      console.error('Error fetching Login stats:', error);
      res.status(500).json({ error: 'Failed to fetch job stats' });
    } else {
      //console.log('Login stats fetched successfully');
     // console.log(results);
      res.status(200).json(results);
    }
  });
});
app.post('/applay-stats', (req, res) => {
  const { dates, startTimes, endTimes, nameofjobs, usernames,companys,zoomlink } = req.body;
if (dates.length === 0 || startTimes.length === 0 || endTimes.length === 0 ||
  dates.every(date => date.trim() === '') ||
  startTimes.every(time => time.trim() === '') ||
  endTimes.every(time => time.trim() === '')) {
return res.status(400).json({ error: 'All fields are required' });
}

  if (dates.length !== startTimes.length || dates.length !== endTimes.length ) {
    return res.status(400).json({ error: 'All arrays must have the same length' });
  }

  const query = `INSERT INTO interviewdates (Nameofjob, username, Date, StartTime, EndTime ,Type,company,zoomlink) VALUES ?`;
  
  const values = dates.map((date, index) => [
    nameofjobs[index],
    usernames[index],
    dates[index],
    startTimes[index],
    endTimes[index],
    '0',
    companys[index],
    zoomlink[index]
  ]);

  connection.query(query, [values], (error, results) => {
    if (error) {
      console.error('Error inserting job stats:', error);
      res.status(500).json({ error: 'Failed to insert job stats' });
    } else {
      res.status(200).json({ message: 'Job stats inserted successfully' });
    }
  });
});
app.get('/interviews', (req, res) => {
  const query = 'SELECT * FROM interviewdates WHERE Type =1';

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching interviews:', err);
      res.status(500).json({ error: 'Failed to fetch interviews' });
      return;
    }
    res.json(results);
  });
});
app.get('/interviewsuser/:jobname/:companyname/:user', (req, res) => {
  const jobname =req.params.jobname;
const companyname =req.params.companyname;
const user =req.params.user;

  const query = 'SELECT * FROM interviewdates WHERE Nameofjob =? AND company =? AND username=? ';


  connection.query(query,[jobname,companyname,user], (err, results) => {
    if (err) {
      console.error('Error fetching interviews:', err);
      res.status(500).json({ error: 'Failed to fetch interviews' });
      return;
    }
    res.json(results);
  });
});
app.put('/updateinterviewsuser/:id', (req, res) => {
  const interviewId = req.params.id;
  const { interviewType } = req.body; // Assuming you want to update `typeofmeet` field

  // Perform the SQL UPDATE operation
  connection.query(
    'UPDATE interviewdates SET Type = 1, Accepted = 0, typeofmeet = ? WHERE ID = ?',
    [interviewType, interviewId],
    (error, results) => {
      if (error) {
        console.error('Error updating interview:', error);
        return res.status(500).json({ error: 'Failed to update interview' });
      }

      // Release the connection back to the pool after handling the query results

      res.status(200).json({ message: 'Interview updated successfully' });
    }
  );
});
app.delete('/deleteinterviewsuser/:jobname/:companyname/:user', (req, res) => {
  const jobname = req.params.jobname;
  const companyname = req.params.companyname;
  const user = req.params.user;
  
  // Perform the SQL DELETE operation
  connection.query('DELETE FROM interviewdates WHERE Type = 0 AND Accepted = 0 AND Nameofjob = ? AND company = ? AND username = ?', [jobname, companyname, user], (error, results) => {
    if (error) {
      console.error('Error deleting interview:', error);
      res.status(500).json({ error: 'Failed to delete interview' });
      return;
    }

    // Release the connection back to the pool after handling the query results
    res.status(200).json({ message: 'Interview deleted successfully' });
  });
});
app.put('/interviewsreject/:id', (req, res) => {
  const interviewId = req.params.id;
  const { description } = req.body;

  // Perform the SQL UPDATE operation
  connection.query(
    'UPDATE interviewdates SET Accepted = 2, Description = ? WHERE ID = ?',
    [description, interviewId],
    (error, results) => {
      if (error) {
        console.error('Error updating interview:', error);
        res.status(500).json({ error: 'Failed to update interview' });
        return;
      }

      // Release the connection back to the pool after handling the query results
      res.status(200).json({ message: 'Interview updated successfully' });
    }
  );
});
app.delete('/interviewsDeleteuser/:id', (req, res) => {
  const interviewId = req.params.id;
  

  // Perform the SQL UPDATE operation
  connection.query(
    'DELETE interviewdates  WHERE ID = ?',
    [ interviewId],
    (error, results) => {
      if (error) {
        console.error('Error updating interview:', error);
        res.status(500).json({ error: 'Failed to DELETE interview' });
        return;
      }

      // Release the connection back to the pool after handling the query results
      res.status(200).json({ message: 'Interview DELETE successfully' });
    }
  );
});
//////
app.delete('/userdeleteappfrompdffile/:jobName/:companyName/:username', (req, res) => {
  const jobName = req.params.jobName;
  const companyName = req.params.companyName;
  const username = req.params.username;
  // Perform the SQL UPDATE operation
  connection.query('DELETE from pdf_file  WHERE username = ? AND jobname=? AND CompanyName=?',    [username, jobName,companyName],
    (error, results) => {
      if (error) {
        console.error('Error updating interview:', error);
        res.status(500).json({ error: 'Failed to DELETE PDF_file' });
        return;
      }

      // Release the connection back to the pool after handling the query results
      res.status(200).json({ message: 'PDF_file DELETE successfully' });
    }
  );
});
///////
app.put('/interviewsaccept/:id', (req, res) => {
  const interviewId = req.params.id;
  const { description } = req.body;
console.log(description)
  // Perform the SQL UPDATE operation
  connection.query(
    'UPDATE interviewdates SET Accepted = 1, Description = ? WHERE ID = ?',
    [description, interviewId],
    (error, results) => {
      if (error) {
        console.error('Error updating interview:', error);
        res.status(500).json({ error: 'Failed to update interview' });
        return;
      }

      // Release the connection back to the pool after handling the query results
      res.status(200).json({ message: 'Interview updated successfully' });
    }
  );
});
app.get('/notification/:username', (req, res) => {
  const username = req.params.username;
  console.log(username);
  const query = 'SELECT * FROM notifications WHERE username = ?'; // Adjust for your column names

  connection.query(query, [username], (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      res.status(500).json({ success: false, message: 'An error occurred, please try again later' });
      return;
    }
    res.json({
      results
    });

  });
});
app.delete('/notificationdelete/:id', (req, res) => {
  const id = req.params.id;
  
  console.log(id);
  const query = 'DELETE FROM notifications WHERE ID = ?'; // Adjust for your column names

  connection.query(query, [id], (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      res.status(500).json({ success: false, message: 'An error occurred, please try again later' });
      return;
    }
    res.json({
      results
    });

  });
});
app.put('/notificationread/:id/:read', (req, res) => {
  const id = req.params.id;
  let read = req.params.read;
  console.log(read)
  if(read == true){read =0}else{read =1}
  console.log(read)
  // Perform the SQL UPDATE operation
  connection.query('UPDATE notifications SET `read` = ? WHERE ID = ?', [read,id], (error, results) => {
    if (error) {
      console.error('Error updating interview:', error);
      res.status(500).json({ error: 'Failed to update notifications read' });
      return;
    }

    // Release the connection back to the pool after handling the query results
   
    res.status(200).json({ message: 'notifications read updated successfully' });
  });
});
app.post('/notification', (req, res) => {
  const { username, description, company } = req.body;
  console.log( username, description, company)
  // Perform the SQL INSERT operation
  connection.query('INSERT INTO notifications (username, description, company, `read`) VALUES (?, ?, ?, ?) ', [username, description, company, '0'], (error, results) => {
    if (error) {
      console.error('Error INSERT notifications:', error);
      res.status(500).json({ error: 'Failed to INSERT notification ' });
      return;
    }

    // Release the connection back to the pool after handling the query results

    res.status(200).json({ message: 'Notification INSERT  successfully' });
  });
});
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
