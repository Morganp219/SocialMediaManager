# SocialMediaManager
Welcome to my PWA Prototype of the ADET @ Fort Hays Tech | NW Social Media Login I chose this project as it is something that I have been planning on doing for a while. 

To view the prototype, please use this URL: https://morganp219.github.io/SocialMediaManager/index.html

Logins:
To View the Admin Side:
Username: Admin
Password: Admin

To View the Student Side: 
Username: Student
Password: Student

### Service Worker
On install of the application, I have it store all of the HTML, CSSes and Javascripts that are neccessary to run the application without internet. Right now, until there is a server connection, I have 4 temp images that is inside of the cache addAll. Once I get server connection, they will be cached via the fetch. I went ahead and added in a version deleter if it is not the current cache. This will allow updates to be done. (For example: socialmediamgr, socialmediamgr-v1.2). Currently this code is light enough that it wont effect the app without the use of it but it allows for future expansion

### Manifest File
This manifest file is a basic PWA required manifest file, it contains all the required such as name, short name and description. I choose to keep it as a standalone application so it did not have any URL bar. The theme color I wanted it to be my golden color with the background to be white. As at some point, when authenication is in, the website will check if there is a user logged in, if there is not return to index, so by default I want them to go to the login screen. Finally, from other projects I've taught, I knew of a few PWA tools that allow icons to be converted from a 512x512 image down to all recommended sizes that Apple, Google (Android), and Windows recommends.