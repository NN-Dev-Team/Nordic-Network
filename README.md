# Nordic Network

[![Join the chat at https://gitter.im/TropicSapling/Nordic-Network](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/TropicSapling/Nordic-Network?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Prototype of Nordic Network:
Free Hosting Service

In total 64 GB RAM will be available the first month;
- 32 GB RAM in USA
- 32 GB RAM in UK


You can now run a Minecraft test server by following these instructions:
-------------------------------------------------------------------------
1. Clone this repository to your computer.
2. Edit the first line in public/properities.txt (where it says
"nordic-network.tk") to "localhost".
3. Go to Nordic-Network/private/servers/0 and add the Minecraft server
jar in there. Make sure it's named minecraft_server.jar, it can actually
be any jar and not only Minecraft but it must have that name _for now_
:)
4. Go to your terminal, type in "cd
path/to/github/projects/Nordic-Network/private" (use "\" instead of "/"
if on Windows) and after that type in "node controlpanel-server". **Make
sure node.js AND required libraries are installed.**
5. Start your browser and go to "localhost:15015", press Inspect Element
and click on "Console". Then type in "startServer(0, "01234569abcdef");"
and press enter. The server will now start on your computer :)
