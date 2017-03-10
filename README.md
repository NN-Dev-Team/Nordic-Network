# Nordic Network
### Dynamic server hosting, the nordic way

[![Join the chat at https://gitter.im/TropicSapling/Nordic-Network](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/TropicSapling/Nordic-Network?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

64 GB RAM will be available the first month, hosted in UK. (Note that 1-2 GB will be allocated for programs and other stuff needed)


You can now *test* the program by following these instructions:
-------------------------------------------------------------------------
1.  Clone this repository to your computer.
2.  Go to `Nordic-Network/private/mono/versions/mc` and add the Minecraft server
jar in there. Make sure it's named `minecraft_server.jar`.
3.  Go to your terminal, type in `cd
path/to/github/projects/Nordic-Network/private/mono` (use "\" instead of "/"
if on Windows) and after that type in `node server`. **Make
sure node.js AND required libraries are installed and DON'T close the terminal!**
4.  Start your browser and go to "localhost:15015", press Inspect Element
and click on `Console`. Then type in `login("testuser@nordic-network.tk", "testpassword");`
and press enter.
5.  Type in `createServer(0);` into the console.
6.  Type in `startServer(0);` into the console. The server will now start on your computer **locally**, and remember this is only for testing the program. In the future you'll just need to enter the website to start your server and it will be up online :)

To test the website:
-------------------------------------------------------------------------
1. Clone this repository to your computer.
2. Install XAMPP
3. Open XAMPP, run the Apache application.
3. Move the contents of Nordic-Network into the XAMPP `htdocs` folder.
4. Run the FileZilla application.
5. Open the FileZilla Server control panel (click on admin in the actions in the XAMPP window).
6. Change the server address to `localhost` and click ok. Once the panel has opened, click on the user icon (open the user accounts dialog)
7. Add an account, give it a username and password, and set it's home directory (this setting is under `Shared Folders`) to your server directory. (`Nordic-Network\private\mono\servers\0`)
8. Open your web browser and type in `localhost`, you can now go to `localhost/controlpanel.html` to see the panel in action, with working FTP!

**Please note that the website running using this method does not support the Node.js program. No launching servers or creating accounts as of now.**
