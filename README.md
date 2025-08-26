# Test assignment

To run code inside this project 

1. Clone project inside directory
2. run ```npm install``` or ```npm i``` Preferably with Node 20+
3. run ```npm run dev```

## Test file

Application does not have connection to BE so to simulate parsing of the pdf file we
use special file inside mock ```src/api/contracts/mock.json```

To update it please add sections as written in this file. 

```json
{
  "sections": [
    {
      "sectionName": "Insurance",
      "options": [
        "Insurance clause 1",
        "Insurance clause 2"
      ]
    }
  ]
}
```

Each section will be displayed as a menu section on a second step.

## Supported formats

Currently we parse only PDF files. One file per upload for showcase.


## Important 
Without setting up correct ```mock.json``` nothing will be highlighted on a second step
since we don't parse PDF. 
