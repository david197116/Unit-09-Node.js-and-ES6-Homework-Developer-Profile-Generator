const inquirer = require("inquirer");
const axios = require("axios");
const pdf = require('html-pdf');

const colors = {
    green: {
        wrapperBackground: "#E6E1C3",
        headerBackground: "#C1C72C",
        headerColor: "black",
        photoBorderColor: "#black"
      },
      blue: {
        wrapperBackground: "#5F64D3",
        headerBackground: "#26175A",
        headerColor: "white",
        photoBorderColor: "#73448C"
      },
      pink: {
        wrapperBackground: "#879CDF",
        headerBackground: "#FF8374",
        headerColor: "white",
        photoBorderColor: "#FEE24C"
      },
      red: {
        wrapperBackground: "#DE9967",
        headerBackground: "#870603",
        headerColor: "white",
        photoBorderColor: "white"
      }
   
  };

const questions = [
    {
        type: "input",
        name: "githubUserName",
        message: "Enter your GitHub Username"
    },
    {
        type: "list",
        name: "color",
        message: "What is your favorite color?",
        choices: ['green', 'blue', 'pink', 'red'],
    }

];

class DoMyHomework {
  constructor() {
    this.githubUserName = null;
 
  }

  promptUser() {
    return inquirer.prompt(questions).then(({ githubUserName,color }) => {
      this.githubUserName = githubUserName;
      this.color= color;
      this.makeApiRequest();
    })
  }

  makeApiRequest() {
    return Promise.all(
      [
        axios.get(`https://api.github.com/users/${this.githubUserName}`),
        axios.get(`https://api.github.com/users/${this.githubUserName}/starred`)
      ])
      .then((
        [
          {
            data:
            {
              avatar_url,
              location,
              name,
              blog,
              bio,
              public_repos,
              followers,
              following
            }
          },
          {
            data:
            {
              length
            }
          }
        ]
      ) => {
        this.avatar_url = avatar_url;
        this.location = location;
        this.name = name;
        this.blog = blog;
        this.bio = bio;
        this.public_repos = public_repos;
        this.followers = followers;
        this.following = following;
        this.stars = length;
        console.log(this);
        this.createHtml();
      })
  }
   

  
  createHtml() {
  
    this.html = 
    `<!DOCTYPE html>
    <html lang="en">
       <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta http-equiv="X-UA-Compatible" content="ie=edge" />
          <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.8.1/css/all.css"/>
          <link href="https://fonts.googleapis.com/css?family=BioRhyme|Cabin&display=swap" rel="stylesheet">
          <title>Document</title>
          <style>
          @page {
            margin: 0;
          }
         *,
         *::after,
         *::before {
         box-sizing: border-box;
         }
         html, body {
         padding: 0;
         margin: 0;
         }
         html, body, .wrapper {
         height: 100%;
         }
         .wrapper {
         background-color: ${colors[this.color].wrapperBackground};
         padding-top: 100px;
         }
         body {
         background-color: white;
         -webkit-print-color-adjust: exact !important;
         font-family: 'Cabin', sans-serif;
         }
         main {
         background-color: #E9EDEE;
         height: auto;
         padding-top: 30px;
         }
         h1, h2, h3, h4, h5, h6 {
         font-family: 'BioRhyme', serif;
         margin: 0;
         }
         h1 {
         font-size: 3em;
         }
         h2 {
         font-size: 2.5em;
         }
         h3 {
         font-size: 2em;
         }
         h4 {
         font-size: 1.5em;
         }
         h5 {
         font-size: 1.3em;
         }
         h6 {
         font-size: 1.2em;
         }
         .photo-header {
         position: relative;
         margin: 0 auto;
         margin-bottom: -50px;
         display: flex;
         justify-content: center;
         flex-wrap: wrap;
         background-color: ${colors[this.color].headerBackground};
         color: ${colors[this.color].headerColor};
         padding: 10px;
         width: 95%;
         border-radius: 6px;
         }
         .photo-header img {
         width: 250px;
         height: 250px;
         border-radius: 50%;
         object-fit: cover;
         margin-top: -75px;
         border: 6px solid ${colors[this.color].photoBorderColor};
         box-shadow: rgba(0, 0, 0, 0.3) 4px 1px 20px 4px;
         }
         .photo-header h1, .photo-header h2 {
         width: 100%;
         text-align: center;
         }
         .photo-header h1 {
         margin-top: 10px;
         }
         .links-nav {
         width: 100%;
         text-align: center;
         padding: 20px 0;
         font-size: 1.1em;
         }
         .nav-link {
         display: inline-block;
         margin: 5px 10px;
         }
         .workExp-date {
         font-style: italic;
         font-size: .7em;
         text-align: right;
         margin-top: 10px;
         }
         .container {
         padding: 50px;
         padding-left: 100px;
         padding-right: 100px;
         }

         .row {
           display: flex;
           flex-wrap: wrap;
           justify-content: space-between;
           margin-top: 20px;
           margin-bottom: 20px;
         }

         .card {
           padding: 20px;
           border-radius: 6px;
           background-color: ${colors[this.color].headerBackground};
           color: ${colors[this.color].headerColor};
           margin: 20px;
         }
         
         .col {
         flex: 1;
         text-align: center;
         }

         a, a:hover {
         text-decoration: none;
         color: inherit;
         font-weight: bold;
         }

         @media print { 
          body { 
            zoom: .75; 
          } 
         }
      </style>
    </head>
        <body>
        <header>
        <div class="wrapper">
          <div class="photo-header">
            <img src="${this.avatar_url}"><br>
            <h1>Hi!</h1>
            <h2>My name is ${this.name}</h2>
        <nav class="links-nav">
          <a class="nav-link" href="https://www.google.com/maps/place/${this.location.split(' ')[0]}+${this.location.split(' ')[1]}">${this.location}</a>
          <a class="nav-link" href="https://github.com/${this.githubUserName}">gitHub</a>
          <a class="nav-link" href="${this.blog}">Blog</a>
        </nav>
        </header>
        <div class="container">
        <div class="row">
        <div class="col">
        <h4>${this.bio}</h4>
        </div>
        </div>
        <div class="col card">
        <h2>Public Repositories:</h1>
        ${this.public_repos}
        </div>
        <div class="col card">
        <h2>Followers:</h2>
        ${this.followers}
        </div>
        </div>
        <div class="row">
        <div class="col card"
        <h2>Stars:</h2>
        ${this.stars}
        </div>
        </div>
        <div class="col card">
        <h2>Following:</h2>
        ${this.following}
        </div>
        </div>
        </body>
        </html>`;
    console.log(this);
    this.createPdf();
  }

  createPdf() {
    pdf.create(this.html).toFile('./class-test.pdf', function (err, res) {
      if (err) return console.log(err);
      console.log(res);
    });
  }

}

var newHomework = new DoMyHomework();
newHomework.promptUser();
