import { argv } from 'node:process';

const uname = argv[2];

async function getGithubUser(username) {
    try {
        const response = await fetch(`https://api.github.com/users/${username}/events`, {
            method: "GET",
            headers: {
                "X-GitHub-Api-Version": "2022-11-28",
            },
        });

        if (!response.ok){
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Fetch GET  error:', error);
    }
}

const body = await getGithubUser(uname);
let outputString = "Output:\n";

// Explicitly only watch for certain events
const expectedEvents = [
    'CreateEvent',  // Create a Git branch
    'DeleteEvent',  // Delete a Git branch
    'ForkEvent',    // Fork a repo
    'IssuesEvent',  // Activity related to issue (Create an issue)
    'PushEvent',    // Commits are pushed
    'WatchEvent',   // Star a repository
];

let repos = [];
let issueRepo;
let issueAction;

if (body.length !== 0){
    for (let events of body) {
        let recordedEvent = events["type"];
        switch (recordedEvent) {
            case 'CreateEvent':
                break;
            case 'DeleteEvent':
                break;
            case 'ForkEvent':
                break;
            case 'IssuesEvent':
                issueAction = events["payload"]["action"];
                issueRepo = events["repo"]["name"];
                if (issueAction === 'opened'){
                    outputString += `- Opened a new issue in ${issueRepo}\n`;
                }else{
                    outputString += `- ${issueAction.charAt(0).toUpperCase() + issueAction.slice(1)} an issue in ${issueRepo}\n`;
                }
                break;
            case 'PushEvent':
                issueRepo = events["repo"]["name"];
                const index = repos.findIndex(rep => rep.repo === issueRepo);
                if (index == -1){
                    repos.push({"repo": issueRepo, "count": 1});
                }else{
                    repos[index]["count"] += 1;
                }
                break;
            case 'WatchEvent':
                break;
        }
    }
    for (let repo of repos){
        outputString += `- Pushed ${repo["count"]} commit/s to ${repo["repo"]}\n`;
    }
} else {
    console.log("No recorded activity within the past 30 days.");
}

console.log(outputString);
