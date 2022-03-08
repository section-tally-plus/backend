const {MongoClient} = require('mongodb');
var ObjectID = require('mongodb').ObjectID;
let removeWatching = ["class5"] //Class you want to remove
var email = "testFind&Update@students.rowan.edu"

async function main(){
    const uri = "";//insert mongodb connection string
   
    const client = new MongoClient(uri);

        await client.connect();
        
        await findUser(client,
            {
                email: email

    
            }
        );
  
        if (oldWatch.length > 0)
        {
            console.log("in");
            i = oldWatch.length - 1;
            c = removeWatching.length - 1;
            while(i >= 0)
            {
        
                while(c >= 0)
                {
                   
                    if(removeWatching[c] === oldWatch[i])
                    {
                        if(oldWatch[i+1] == null)
                        {
                            oldWatch.pop()
                        }
                        else
                        {
                            oldWatch[i] = "Can't be Red"
                            k = i
        
                            while(k < oldWatch.length - 1)
                            {
                                
                                oldWatch[k] = oldWatch[k + 1];
                                k ++;
                            }
        
                            oldWatch.pop()
                        }
        
                    }
                    c --;
                }
                c = removeWatching.length -1;
        
                i --;
            }
        
        
        }





        await removeWatch(client,
            {
                email: email,
            },
            oldWatch
        );
        


        await client.close();

}

main().catch(console.error);


async function findUser(client, newUser){  //find document with specified email

    const result = await client.db("saction-tally1").collection("user").findOne(newUser);
    oldWatch = result.watching;
    return oldWatch;  //return the current watching array of classes
    
}

async function removeWatch(client, email, oldWatch){  //update document with new watching array
    const result = await client.db("saction-tally1").collection("user").findOne(email);
    var q = { "_id": ObjectID(result._id)}
    var newValue = { $set: {"watching": oldWatch } };
    console.log(email);
    await client.db("saction-tally1").collection("user").updateOne(q, newValue);
}