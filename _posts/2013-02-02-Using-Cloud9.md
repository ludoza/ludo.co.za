---
layout: default
title: Using Cloud9
---
# Using Cloud9   

So I have been playing with Cloud9 lately and just wanted a place to store things I learned about it and list some feature for those that is interested.

## Features

- Interactive debugging:
  - You can change code on the fly while your code is getting executed.
  - The normal breakpoint, call stack, variable inspector you expect from a IDE.
  
## Changing workspace

Maybe this is obvious, but when I started to use Cloud9 the workspace only opened in its project directory.

But to change the workspace just launch cloud9 from the directory you want to use it for exampe:
		
		~ $ cd projects/wickedwebapp
		wickedwebapp $ ~/apps/cloud9/server.js
			
I see this creates a .settings and .c9Revisions/ in your project folder. This makes me believe the above method is not the correct way, but it work, so I'm just adding the entries to my .gitignore file.
 
For now this is all I got but I will update this page as I go along, for myself of course. 