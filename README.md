# Artemis-crm

## Shortcuts

- [Description](#description)
- [Installation](#installation)
- [Usage](#usage)
- [Contributors](#contributors)
- [License](#license)

## Description

Artemis is for the job seeker that needs simple tools for organization, communication, and self-improvement to increase the
odds of landing that next big opportunity.

The idea behind Artemis is to first build an MVP that can handle the most basic organizational improvements to someones online
job hunt, and then add a little bit more:

- A contacts organizer
- A 'Job Tracker,' a.k.a. a kanban-style visual tool for tracking multiple job application processes
- An events / reminders tool (for remembering coffee chats and interviews)
- Notes
- Cloud storage of resumes and forms

And once that's good and done, a little bit more to make it even more useful:

- Data Analytics
- Some game-ification elements to help us stay focused on that hunt!

Having experience with the MERN stack, we decided this was a better opportunity to use a
relational database, and chose instead to use a service by neon.tech that provides a serverless 
postgreSQL database instead of our usualy MongoDB. We also chose to use redux toolkit to manage
complex state, as well as SASS and css modules.

In the process, we found a few things out:

1) We really appreciated the longer planning phase - it helped us immensely 
during the production phase - because we had more time to be familiar with the newer technologies
we decided to add this time around.

2) 

3)

## Installation (git)

Using your terminal:

1) Navigate to the folder where you want to place the containing folder, named 'artemis-crm'
2) type <code>git clone https://github.com/jonathananddaryll/artemis-crm/</code>
3) Navigate to both of these folders:

/artemis-crm/client/
/artemis-crm/server/

and for ***each folder***, install the npm packages for the server:

<code>npm install</code>

and also create a .env file to store your private keys

<code>touch .env</code>

4) Sign up for a free account with each of these 3rd party providers:

   Clerk.com - user authentication and user management
   neon.tech - serverless postgresql database

fill in the rest of your clerk info here in the CLIENT .env file:

VITE_CLERK_PUBLISHABLE_KEY=  
VITE_CLERK_SECRET_KEY=

and put your clerk & neon.tech keys in the SERVER .env file:

(Variables starting with 'PG' as well as the 'ENDPOINT_ID' are all related to neon.tech)

PORT=5432  
PGHOST=''  
PGDATABASE=''  
PGUSER=''  
PGPASSWORD=''  
ENDPOINT_ID=''  
CLERK_PUBLISHABLE_KEY=  
CLERK_SECRET_KEY=

5) 'Seed' the postgres database:

Using the following tables, use either the CLI or the built-in SQL editor provided by neon.tech
to add these (empty) tables to your database:

board  
contact  
document  
job  
job_contact  
note  
task  
timeline  
users

6) Run both servers:

You can use the concurrently package from npm to run both with one statement:

<code>concurrently \"npm run server\" \"npm run client\"</code>

or just open two separate terminals to run each script in a separate window

<code>npm run server</code>
<code>npm run client</code>

7) Go to your browser and type in:

<code>http://localhost:5173</code>

8) Enjoy!


## Contributors

Daryll Osis @dirtyhoops
Jon Harvey @collectivenectar

## License

GNU GPLv3

[back to the top](#shortcuts)
