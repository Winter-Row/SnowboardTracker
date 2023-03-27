const configurations = {
    'db' : 'mongodb+srv://Projecttrackerapp:strongpass2023@cluster0.5kgfphm.mongodb.net/SnowboardTracker',
    'github':{
        'clientId':'f4f76e739854be6615a3',
        'clientSecret':'9c59dfd3decbc12bd2b8ce7ebfc70c44927b10c1',
        'callbackUrl':'http://localhost:3000/github/callback'
    }
}

// export in order to make it available to the rest of the app
module.exports = configurations;