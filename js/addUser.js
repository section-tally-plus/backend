const {MongoClient} = require('mongodb');

async function main(){
    
    const uri = "";//insert mongodb connection string
   
    
    const client = new MongoClient(uri);

    var email = "test@students.rowan.edu"
    var phone = "1234567890"
    var watch = ["class5", "class3"]
    var past = ["class2", "class4", "class1"]

        
        await client.connect();

        

        
        await addUser(client,
            {
                email: email,
                phone: phone,
                watching: watch,
                past_classes: past
            }
        );
  
       
        
        await client.close();
}

main().catch(console.error);


async function addUser(client, newUser){

    await client.db("saction-tally1").collection("user").insertOne(newUser);
    console.log(`New user has been added`);
    
}

