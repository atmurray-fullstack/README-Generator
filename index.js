const fs = require("fs");
const util = require("util");
const inquirer = require("inquirer");
const https = require("https");
const axios = require("axios")
const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);
const questions = [
    "What is your Github username?",
    "What is the repository name?",
    "Describe how to use your app.",
    "List any contributors/third party assests. Seperate items with a comma."

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
            name: "usage",
            type: "input"
        },
        {
            message: questions[3],
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
How do you install the project

## Usage
${arr[2]}

## Credits
${arr[3]}

## License
[![License: Unlicense](https://img.shields.io/badge/license-Unlicense-blue.svg)](http://unlicense.org/)
${arr[1].license}
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
        console.log(gitRepo.license)

        respArr.push(user, gitRepo, ans.usage, ans.contribute);
        // respArr.push(gitRepo);

        return respArr

    }).then(function (arr) {
        // console.log(arr);
        const contributors = arr[3].split(",");
        contributors.forEach(el => {
            el.trim()
            el = "-" + el
        });
        const constString = contributors.join("\n");
        arr[3] = constString;
        console.log(constString);

        const readMe = generateReadMe(arr);


        return writeFileAsync("README.md", readMe);
    })







