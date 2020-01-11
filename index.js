const inquirer = require("inquirer");
const fs = require("fs");
const util = require("util");
const axios = require("axios");
const writeFileAsync = util.promisify(fs.writeFile);
// This function will prompt user for favorit color for card background
function promptUser() {
    return inquirer.prompt([
       
        {
            type: "input",
            name: "color",
            message: "What is your favorite color?"        
        },
        {
            type: "input",
            name: "login",
            message: "What is your git hub login?"
        }
        
    ]);
}

function generateHTML(user) {
    
     return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">
    <script src="https://kit.fontawesome.com/723d8fa4ad.js" crossorigin="anonymous"></script>
    <link href="https://fonts.googleapis.com/css?family=Kaushan+Script&display=swap" rel="stylesheet">
<style>
.backDrop {
    background-image: url(https://media.giphy.com/media/2jMtN1BCK7gUIbzILm/giphy.gif);
    margin-top: 20px;
}
.public, .followers, .gitHub, .following {
    
    height: auto;
    min-height: 100px;   
    background-image: linear-gradient(${user.color}, white); 
    margin: 5px auto;
    padding: 5px auto;
    text-align: center;
    align-content: center;
    border-radius: 20px;
    padding-top: 35px;
    
   
}
.statement {
    text-align: center;
    height: auto;
    min-height: 100px;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    font-size: 18pt;
    margin: 0 auto;
    padding: 0;
    margin-top: 10px;
    padding-top: 30px;
    
}
.about {
    text-align: center;
    height: auto;
    min-height: 230px;
    background-image: linear-gradient(${user.color}, white);
    margin: 0px auto;
    margin-bottom: -20px;
    padding-top: 60px;
    position: relative;
}
.pic {
    height: 150px;
    width: 150px;
    border-radius: 50%;    
    text-align: center;
    display: block;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: -50px;
    margin-top: 20px;
    position: relative;
    z-index: 1;   
    border: 5px solid rgb(226, 226, 43);
    
}
.container {
    background-color: rgb(231, 220, 220);
    height: 100vh;
   
}
.card {
    margin: 0;
    padding: 0;
    
}
.name {
    font-family: 'Kaushan Script', cursive;
    font-size:22pt;
}
</style>
</head>
<body>
<div class="container">
    <div class="row">
        <div class="col-lg-12">
             <div class="card backDrop">
    <div class="row">
        <div class="col">
        <img class="pic" src=${user.avatar_url} alt="pic">
        </div>
    </div>
        <div class="row">
            <div class="col-lg-11 about">
                <p class="name">My name is ${user.name}! </p>
                <p>Currently @ ${user.company}</p>
                <p><i class="fas fa-map-marked-alt"></i>  ${user.location}  <i class="fab fa-github"></i> <a href="url">${user.html_url}</a>   <i class="fas fa-blog"></i>  <a href="url">${user.blog}</a></p>
            </div>
        </div>
    </div>
        </div>
    </div>
   
    <div class="row">
        <div class="col statement">
            <p>${user.bio}</p>
        </div>
    </div>
    <div class="row">
        <div class="col-lg-5  public">
            Public Repositories: ${user.public_repos}
        </div>
        <div class="col-lg-5  followers">
            Followers: ${user.followers}
        </div>
    </div>
    <div class="row">
        <div class="col-lg-5  gitHub">
            GitHub Stars: ${user.stars}
        </div>
        <div class="col-lg-5  following">
            Following: ${user.following}
        </div>
    </div>           
</div>
</body>
</html>`;
}

async function init() {
    console.log("Hello there!!! Answer a couple of questions below to see your GitHub Resume. Please be sure to completely file out your github for best results.)
    try {
        // this code will promt the user with two questions
        const answers = await promptUser();
        // This code will do a https call to the user's github user login entered
        const userData =  await axios.get(`https://api.github.com/users/${answers.login}`) 
        // this code will do the same call to user's github but will only look at the starred github repos on profile
        const userStars = await axios.get(`https://api.github.com/users/${answers.login}/starred`)
        // this code uses the spread operater to gather data from the requested areas of data and generate html       
        const html = generateHTML({...answers, ...userData.data, stars: userStars.data.length});
        // code awaits previous information before creating index.html file or rewriting over previous file
        await writeFileAsync("index.html", html);
        // this console log will display if no error and correctly generated html
        console.log("Successfully wrote to index.html");
    } catch(err) {
        console.log(err);
    }
}

init();