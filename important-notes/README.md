# Important Notes
Minecraft Ranks
----------------

### Obtaining XP
XP can be obtained in the following ways:
* On rank 1 & 2, every playing hour gives 1 XP each.
* On all ranks, a donation of £1 gives 100 XP.

<br />

### Rank 1

**Hardware Costs:** From ~£0.44 to ~£0.47

--------

*Dynamic Plan*

--------

**Payment Period:** 15 days

**XP required to keep rank:** 30

**XP required to rank up:** 45

**Features:** 256 MB RAM & 1 GB disk space

<br />

--------

*No premium plan is available for this rank.*

--------

<br />

### Rank 2

**Hardware Costs:** From ~£0.88 to ~£0.94

--------

*Dynamic Plan*

--------

**Payment Period:** 15 days

**XP required to keep rank:** 30

**XP required to rank up:** 45

**Features:** 512 MB RAM, 2 GB disk space & FTP access

<br />

--------

*Premium Plan*

--------

**Price:** £1.5

**Payment Period:** 30 days

**Features:** 512 MB RAM, 2 GB disk space & FTP access

<br />

### Rank 3

**Hardware Costs:** From ~£1.75 to ~£1.89

--------

*Dynamic Plan*

--------

**Payment Period:** 30 days

**XP required to keep rank:** 250

**XP required to rank up:** 350

**Features:** 1 GB RAM, 4 GB disk space & FTP access

<br />

--------

*Premium Plan*

--------

**Price:** £3

**Payment Period:** 30 days

**Features:** 1 GB RAM, 4 GB disk space, FTP access & no ads

<br />

### Rank 4

**Hardware Costs:** From ~£3.51 to ~£3.77

--------

*Dynamic Plan*

--------

**Payment Period:** 30 days

**XP required to keep rank:** 500

**XP required to rank up:** N/A

**Features:** 2 GB RAM, 8 GB disk space & FTP access

<br />

--------

*Premium Plan*

--------

**Price:** £6

**Payment Period:** 30 days

**Features:** 2 GB RAM, 8 GB disk space, FTP access, your own server website/forum & no ads.

<br />

--------

**Update:** The "special system" may not be allowed if using Google AdSense, so we'll therefore have to rely more on donations & revenue from premium servers. To increase ad gain, free servers will also have access to their own server page, forums will still be only-premium though :)

Due to the lack of donations on smaller servers, this means that revenue from premium servers may be used to pay for them. According to several sources though, rich content pages generate more ad gain, so we might still get a lot from ads if we make sure the server pages look good and have much content like a blog for example :)

(For example, each Rank 3 premium server can pay for about 3 Rank 1 free servers)

**Also, note that the XP requirements for the ranks will change automatically each month.** This is done for it to be easier to adjust to less or more donations, and means that the XP requirements specified here may only apply for the first month(s).

--------

#### [Statistics about donations per GB RAM](http://www.planetminecraft.com/forums/how-many-donations-your-minecraft-server-you-get-t551696.html)
Donated money per GB RAM is now about $4 (~£3) per month, getting a bit more accurate now with more results :)

--------

Applications
-------------
Accepted applications will now grant some of these things depending on how the application looks:
- Higher position in queue for servers; that is less waiting time for getting a server
- More RAM for your server
- Server spotlight / server gets featured

--------

**Requirements for higher position:**
- Just a good application; a good & unique idea of a server and application looks good overall :)

**Requirements for more RAM:**
- You already have players (moving from another host)

**or**

- You help us somehow

--------

We'll be using RCON to send cmds to the server :)

[GitHub Node.js RCON](https://github.com/pushrax/node-rcon)

[NPM Node.js RCON](https://www.npmjs.com/package/rcon)

--------

#### AutoChat mode in console
- Suggested by [@isasftw](https://github.com/isasftw)

"We should have an AutoChat mode and a Commands Only mode for the console. So that if you don't have a command, just text, it will automatically add /say. And in commands only it won't"

--------

We'll use statistics about when servers usually are online to determine if another free server will work :)

--------

**Feature:** Enable/Disable FTP password changing as well as changing the password to whatever you want. Default length will be same as session id; 16 chars.

**How to setup user pages**: Use `window.location.href.indexOf(user_id)` on 404 page (which is **sent** to the user, **do not overwrite the url!**) to check url, `history.pushState({}, "", "server-page.php");` to change url without reloading. On the server, use the `socket.io-stream` module to send the html, css & js.
