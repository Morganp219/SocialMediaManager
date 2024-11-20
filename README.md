# SocialMediaManager
Welcome to my PWA Prototype of the ADET @ Fort Hays Tech | NW Social Media Login I chose this project as it is something that I have been planning on doing for a while. 

To view the prototype, please use this URL: [https://morganp219.github.io/SocialMediaManager/index.html](https://morganp219.github.io/SocialMediaManager/)

Logins:
To View the Admin Side:
Username: Admin
Password: Admin

To View the Student Side: 
Username: Student
Password: Student

### Implement Firebase and IndexedDB
##### Explain how Firebase and IndexedDB are integrated into your application.
For this assignment, I chose to implement my posts to store first into the database(s), I really like using Objects (classes) for this type of data storing. They make it simple to use multiple databases with the same structure. In the final product after Firebase Auth is included there will also be a users feature implemented as well. 

Provide instructions for using CRUD operations in both online and offline modes. // Describe how the synchronization process works, including how Firebase IDs are maintained.
Following logic behind how I coded my PostsDB, the same CRUD functions work for both online and offline using the attemptToSavePosts() method.. There is a function that is called that syncronises both databases together. In this assignment I opted for more of a complex approach by working both Online & Offline in seperate functions. With my previous experience working with multiple database syncs and database writes, there is an allPosts array that holds everything into memory, this array makes sure that all of my databases are in sync. When a User is offline, there is a chance that FirebaseIDs will not work so there is a temporary ID creator on the bottom inspired by my Python assignments that gives it a temporary ID, Once firebase syncs back down, it updates the ID to be the FirebaseID. 

In the final version, Once FirebaseAuth is implemented for the final, the final part of the database sync can commence. 

##Previous READMEs

### Service Worker
On install of the application, I have it store all of the HTML, CSSes and Javascripts that are neccessary to run the application without internet. Right now, until there is a server connection, I have 4 temp images that is inside of the cache addAll. Once I get server connection, they will be cached via the fetch. I went ahead and added in a version deleter if it is not the current cache. This will allow updates to be done. (For example: socialmediamgr, socialmediamgr-v1.2). Currently this code is light enough that it wont effect the app without the use of it but it allows for future expansion

### Manifest File
This manifest file is a basic PWA required manifest file, it contains all the required such as name, short name and description. I choose to keep it as a standalone application so it did not have any URL bar. The theme color I wanted it to be my golden color with the background to be white. As at some point, when authenication is in, the website will check if there is a user logged in, if there is not return to index, so by default I want them to go to the login screen. Finally, from other projects I've taught, I knew of a few PWA tools that allow icons to be converted from a 512x512 image down to all recommended sizes that Apple, Google (Android), and Windows recommends.
