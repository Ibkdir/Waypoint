# Waypoint

![Workflow](/public/Workflow.png)

## Overview

This application utilizes the T3 stack, Shadcn, LangGraph, Langchain, and the AI SDK from Vercel to create a chat assistant and agent specialized in travel-related queries. This assistant can perform various tasks such as placing markers on maps and streaming generative UI components. This project aims to enhance the AI chat experience through generative UI and smart tool use.

## Getting Started

### Installation

Clone the repository and install its dependencies on your local machine:

```
git clone https://github.com/Ibkdir/Waypoint.git

cd Waypoint

npm install
```

Next, copy the .env.example file to .env and fill in your environment variables:

```
NEXT_PUBLIC_GMAP_API='..'
NEXT_PUBLIC_MAP_ID='...'
OPENAI_API_KEY='...'
OPENWEATHER_API_KEY='...'
```
 
### Running the Application

To run the application in development mode, use:

`npm run dev`

For production mode, build and start the application:

```
npm run build
npm start
```

## Acknowledgments

- [gen-ui](https://github.com/bracesproul/gen-ui)
- [T3 Stack](https://create.t3.gg/)
- [shadcn/ui](https://github.com/shadcn/ui)
