# The-API-Collector #

Postman Public APIs List Crawler Implementation Using Express, MongoDB and Docker.

## Steps to run the code ##

- Navigate to the root folder containing the app.js and the Dockerfile
- Install docker on your system, if not already present and build the image using: **docker-compose up --build**
- After the console shows that it has succesfully connected to the database navigate to **http://localhost:9000/**
- This will show a message in the console informing that the extraction has started
- After it has completed collecting all the APIs, a message saying **"APIs collection completed"** will be visible on the console.
- The database can be checked for the entries using:
  - Open a seperate terminal
  - Fire **docker exec -it postman_crawler_mongohost_1 bash** to login to the Mongo Environment
  - Then fire **mongosh** to enter the mongo shell
  - **use post-man-crawler**
  - **db.apis.count()** will show the number of entries in the collection

##  Database and Schema  ##

- MongoDB has been used in the backend to implement the project.
- Mongoose has been to connect to the database, the schema is created by itself and does not need any developer intervention
- One table to store the API data, the categories and the tokens are stored in the session variable
- The database name being used is: **post-man-crawl**

### Schema Details  ###
```javascript
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const apiSchema = new Schema({
    API: {
        type: String,
        required: true
    },
    Description: {
        type: String,
        required: false
    },
    Auth: {
        type: String,
        required: false
    },
    HTTPS: {
        type: Boolean,
        required: false
    },
    CORS: {
        type: String,
        required: false
    },
    Link: {
        type: String,
        required: true
    },
    Category: {
        type: String,
        required: true
    }

})


const API = mongoose.model('API', apiSchema)
module.exports = API
```
The API(Name),Link and Category have have been marked as necessary for the APIs that are to be stored and the rest may or may not be present for any given document in the collection.

**Note:** A database purging script is also present to allow the application to have multiple runs but that needs to be manually exceuted before each rerun to clear out the collection being used. The steps to run the file are:
- **docker exec -it postman_crawler_expressapi_1 bash**
- **node utils/data_cleaner.js**

##  Target Functionalities Acheived  ##

Points to achieve  | Achieved
------------- | -------------
Concept of OOPS | Yes
Handling authentication requirements & token expiration of server | Yes
Pagination to get all data  | Yes
Work around for rate limited server | Yes
Crawled all API entries for all categories and stored it in a database  | Yes


##  Points for Improvement  ##

- The initiation process for the appilcation can be improved, as Chrome caches the the URL after the first request. If it not deleted from the cache, it sends a GET request to our API end point even before we press enter and this causes overlapping requests to hit our end point causing an error with too Many requests. Therefore, the console must be monitored to check if the app has started automatically as a result of the dummy request from Chorme.
- A front end can be added, so that the user can see the APIs that have been collected and request collection from a webpage as well.
