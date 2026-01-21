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
        console.error('Fetch POST error:', error);
    }
}

const body = await getGithubUser(uname);

// Explicitly only watch for certain events
const expectedEvents = [
    'CreateEvent',  // Create a Git branch
    'DeleteEvent',  // Delete a Git branch
    'ForkEvent',    // Fork a repo
    'IssuesEvent',  // Activity related to issue (Create an issue)
    'PushEvent',    // Commits are pushed
    'WatchEvent',   // Star a repository
];


