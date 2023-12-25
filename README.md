
## Introduction

This is a single-page application (SPA) and serves as a dashboard to visualize voting results, which are updated daily, for the 20 most recent congressional votes of both the U.S. Senate and House of Representatives. The voting results and data are from the [ProPublica API](https://projects.propublica.org/api-docs/congress-api/) and images are from the [Government Printing Office's Member Guide](https://memberguide.gpo.gov/) via the [Images of Congress project](https://github.com/unitedstates/images). 

As of February 23, 2021, the application has been deployed to Google Cloud Platform via the App Engine Service and can be viewed [here](https://protean-atom-304500.uc.r.appspot.com/).

## Setup

After cloning the repo, you will have to sign up for an API key at the [ProPublica website](https://www.propublica.org/datastore/api/propublica-congress-api).

Once you have signed up for an API key, then you will have to configure the project. Navigate to the directory `backend/src/data` and create a file called `"key.json"` in this directory. In this json file, write the contents like so:

```JavaScript
{
  "localhost": "URL_HERE",
  "production_url": "URL_HERE"
}
```

Before deploying it to a production environment, you can give the keys `"localhost"` and `"production_url"` the value of `"http://localhost:3000"`, which is the URL that you can view the frontend. Later on, you will change `"production_url"` to a new URL once the frontend has been deployed.

Now navigate to the directory `frontend/src/data` and create a file called `"key.json"` in this directory. In this json file, write the contents like so:

```JavaScript
{
  "key": "KEY_HERE",
  "url": "URL_HERE"
}
```

Set `"key"` to the API key that you received from ProPublica. For now, set `"url"` to `"http://localhost:8080"`. This will change later once you have deployed the backend.

Navigate to the respective directory and type in the commands below to install:

### Install the frontend:

`npm install --no-optional --legacy-peer-deps`

### Install the backend: 

`npm install`

You should now be able to run both the frontend and backend in separate CLIs:

### Run the frontend:

`yarn start`

### Run the backend

`npm start`

Two `app.yaml` files have been provided should you want to deploy the frontend and backend to Google Cloud Platform via App Engine. If you need help deploying, please feel free to reach out!
