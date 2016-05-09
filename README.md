# Nordic Network
++Free server hosting, the nordic way++

[![Join the chat at https://gitter.im/TropicSapling/Nordic-Network](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/TropicSapling/Nordic-Network?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

32 GB RAM will be available the first month, hosted in UK. (Note that 1 GB will be allocated for programs and other stuff needed)


You can now *test* the program by following these instructions:
-------------------------------------------------------------------------
1.  Clone this repository to your computer.
2.  Go to `Nordic-Network/private/mono/versions/mc` and add the Minecraft server
jar in there. Make sure it's named `minecraft_server.jar`.
3.  Go to your terminal, type in `cd
path/to/github/projects/Nordic-Network/private/mono/testing` (use "\" instead of "/"
if on Windows) and after that type in `node login`. **Make
sure node.js AND required libraries are installed and DON'T close the terminal!**
4.  Start your browser and go to "localhost:15015", press Inspect Element
and click on `Console`. Then type in `login("testuser@nordic-network.tk", "testpassword");`
and press enter.
5.  Close the terminal, reopen it and type in `node createserv-server`. Then go back to your browser, reload the page and type in `createServer(0);` into the console.
6.  Close the terminal again, reopen it and type in `node controlpanel-server`. Then go back to your browser again, reload the page and type in `startServer(0);` into the console. The server will now start on your computer **locally**, and remember this is only for testing the program. In the future you'll just need to enter the website to start your server and it will be up online :)
