# Restful web services for ezFuel app

## Background
For several months, long queues formed for kilometers outside fuel stations around the country as Sri Lanka struggled to get enough fuel supply owing to a severe currency deficit in the midst of the worst economic crisis in the country's post-independence history.

## Solution
ezFuel is a mobile application with a community-driven approach to manage fuel queues in Sri Lanka efficiently by recording the details of fuel queues, remaining fuel amounts and making the details publicly available with live updates.

## System Overview

![overview for ead 2](https://user-images.githubusercontent.com/68691231/198070900-ca32b7b0-9871-48b5-9bdf-b9521853f052.png)

## Database Design

![ea for ead drawio](https://user-images.githubusercontent.com/68691231/196745638-ac09ef51-8888-4a45-8035-c32f696543c1.png)

### `npm run dev` 
Runs the API in development mode.

> Note: You should first create a `.env` file in the root directory of the project before running the application in Dev environment. 
> 
> In the `.env` file you should define these variables. `MONGO_DB_CONNECTION_STRING, TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN`

