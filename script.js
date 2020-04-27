const fs = require("fs");
const util = require("util");
const inquirer = require("inquirer");
const https = require("https");
const axios = require("axios")
const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);
const questions = [];

inquirer
    .prompt([
        {
            message: "enter your Github  username",
            name: "username",
            type:"input"
        },
        {
            message: "What is the name of your repo?",
            name: "repoName",
            type:"input"
        },

    ])
    .then((ans) => {
        const queryUrl = `https://api.github.com/users/${ans.username}`;
        const repoUrl = `https://api.github.com/repos/${ans.username}/${ans.repoName}`
        axios.get(queryUrl)
            .then((resp) => {
                const { name: name, email: email, avatar_url: picUrl } = resp.data;

                // writeFileAsync('test.txt', JSON.stringify(resp.data, null, 2)).then(() => {
                //     console.log('success');
                // })
            }).catch(err => {
                console.log(err);
            });

        axios.get(repoUrl)
            .then((resp) => {
                console.log(resp.data)
                writeFileAsync('test.txt', JSON.stringify(resp.data, null, 2)).then(() => {
                    console.log('success');
                })
            }).catch(err => {
                console.log(err);
            });

    })



