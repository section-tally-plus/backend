const {MongoClient} = require('mongodb');

async function main(){
    
    const uri = "mongodb+srv://root:Senior-project321@cluster0.u1zph.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";//insert mongodb connection string
   
    
    const client = new MongoClient(uri);

    var email = "chuck@rowan.students.edu";
    var phone = "1234567890";
    var watch = ["03210ACC"];
    var past = [];

        
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

    await client.db("section_tally_plus").collection("user").insertOne(newUser);
    console.log(`New user has been added`);
    
}

