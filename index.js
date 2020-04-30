const fs = require("fs");
const util = require("util");
const inquirer = require("inquirer");
const https = require("https");
const axios = require("axios")
const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);
const questions = [
    "What is your Github username?",///0
    "What is the repository name?",//1
    "How should the user install your app?",//2
    "Describe how to use your app. Are there any special instructions?",//3
    "List any contributors/third party assests (libraries/apis). Seperate items with a comma.",
    "What type of license does your repo have?",
    "Are there any guidlines for contributors to follow?"

];



function promptUser1() {
    return inquirer.prompt([
        {
            message: questions[0],
            name: "username",
            type: "input"
        },
        {
            message: questions[1],
            name: "repoName",
            type: "input"
        },
        {
            message: questions[2],
            name: "install",
            type: "input"
        },
        {
            message: questions[3],
            name: "usage",
            type: "input"
        },
        {
            message: questions[4],
            name: "credits",
            type: "input"
        },
        {
            type: "list",
            message: (questions[5]),
            name: "license",
            choices: ["MIT", "lgpl-3.0", "mpl-2.0", "agpl-3.0", "unlicense", "apache-2.0", "gpl-3.0"]
        },
        {
            message: questions[6],
            name: "contribute",
            type: "input"
        }
    ])
}

function generateReadMe(arr) {
    return `
![Maintenance](https://img.shields.io/maintenance/no/2020?style=for-the-badge)

# Project Title: ${arr[1].name}

## Description

${arr[1].description}



## Table of Contents

*[Installation]
*[Usage]
*[Credits]
*[License]
*[Contributors]

## Installation
${arr[2]}

## Usage
${arr[3]}

## Credits
${arr[4]}

## License
${arr[5]}

## Contributor Guidelines
${arr[6]}

    `
}



promptUser1()
    .then(async function (ans) {
        const queryUrl = `https://api.github.com/users/${ans.username}`;
        const repoUrl = `https://api.github.com/repos/${ans.username}/${ans.repoName}`
        respArr = [];

        const resp = await axios.get(queryUrl);
        let { name: userName, email: email, avatar_url: picUrl } = await resp.data;
        const user = {
            "name": userName,
            'email': email,
            'picUrl': picUrl
        };

        const resp2 = await axios.get(repoUrl);
        let { license, description, name } = await resp2.data;
        const gitRepo = {
            "license": license.name,
            "description": description,
            "name": name
        };

        respArr.push(user, gitRepo, ans.install, ans.usage, ans.credits, ans.license, ans.contribute);


        return respArr

    }).then(function (arr) {
        // console.log(arr);
        const credits = arr[4].split(",");
        credits.forEach(el => {
            el.trim()
            el = "-" + el
        });
        const constString = credits.join("\n");
        arr[4] = constString;
         if (arr[5].trim()==="MIT"){
                arr[5] = "[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)" + "<br>" + arr[5]
                console.log(arr[5]);
        }
        //MIT", "lgpl-3.0", "mpl-2.0", "agpl-3.0", 
        //"unlicense", "apache-2.0", "gpl-3.0


        const readMe = generateReadMe(arr);


        return writeFileAsync("README.md", readMe);
    })







