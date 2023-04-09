# Enterprise-Web-Development-Coursework

# User Commands To Run Script & Website 

First thing to do on a new terminal is to run the docker container on the correct port for the website to be able to connect and work. Becuase ubuntu should already be installed, run:

**sudo docker run -ti -p 3000:3000 ubuntu bash**

This should allow the docker to run on the correct port. If not, run more commands to make the docker and website connect to **port **3000****


With the container connected to the right port, run:

**sudo docker ps**

To find the name of the container that can then be used to run the "ServerScript.sh" that should be downloaded and added to the files.

**sudo docker cp (location of where the script was downloaded to)/ServerScript.sh (container name):/ServerScript.sh**

After this, using:

**sudo docker attach (container name)**

and then:

**ls**

should hopefully show that the "ServerScript.sh" is in the files of the location you are currently in.

**If this doesn't work then all you need to do is make sure the "ServerScript.sh" is available to run.**

To get the script ready to run, type:

 **chmod u+x ServerScript.sh**
 **sed -i -e 's/\r$//' /ServerScript.sh**
 
 And then finally, to run the script itself:
 
 **sudo ./ServerScript.sh** 
 
 **(Or just type the location of the script and run the script like that)**
 
 This should run the script and connect to the github, install all the packages and required dependencies, and create a directory that the Mongo database will run from called "MongoDatabase" 


Now to get the Mongo database working.

Open a second terminal and and run:
**sudo docker exec -it (container name) bash**
This should hopefully connect the terminal to the correct container that should hold the location of the connected GitHub files and the location of "MongoDatabase" that was created when the scriopt was run. test this using **ls.** 
**If this didnt work, then just run commands to navigate to where the "MongoDatabase" file is located.**
Then, type:
**mongod --dbpath . (OR type the location of the mongo database instead of the ".")**
And this should hopefully run the Mongo database. **KEEP THIS TERMINAL OPEN.**

Click back to the first terminal that was used to run the script, and navigate to the location of "server.js" and "package.json", this should be the **/Enterprise-Web-Development-Coursework#/backend** location.
Once in the correct file location, finally type:
**npm run server**
To run the server proper, click on a browser and navigate to:
**http://localhost:3000/**
To see if everything worked.
