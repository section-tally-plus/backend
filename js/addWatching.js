const {MongoClient} = require('mongodb');
var ObjectID = require('mongodb').ObjectID;
let addToWatching = ["class4", "class5", "class18"]
var email = "testFind&Update@students.rowan.edu"

async function main(){
    const uri = "";//insert mongodb connection string
   
    const client = new MongoClient(uri);

        await client.connect();
        
        await addUser(client,
            {
                email: email

    
            }
        );
  

       if (addToWatching.length > 0) 
        {
            i = addToWatching.length - 1;
            c = newWatch.length - 1;
            while(i >= 0)  //make sure there are no duplicates between two arrays
            {

                while(c >= 0)
                {
           
                    if(newWatch[c] === addToWatching[i])
                    {
                        if(addToWatching[i+1] == null)    //Get rid of duplicates
                        {
                            addToWatching.pop()
                        }
                        else
                        {
                            k = i

                            while(k < addToWatching.length - 1)
                            {
                        
                                addToWatching[k] = addToWatching[k + 1];
                                k ++;
                            }

                            addToWatching.pop()
                        }

                    }
                    c --;
                }
                c = newWatch.length -1;

                i --;
            }

            if (addToWatching.length > 0)
            {
                i = addToWatching.length - 1;
                c = newWatch.length - 1;

                while(i >= 0)       //combines two arrays
                {
                    newWatch.push(addToWatching[i]);  
                    i --;
                }
            }   

        }





        await addWatch(client,
            {
                email: email,
            },
            newWatch
        );
        


        await client.close();

}

main().catch(console.error);


async function addUser(client, newUser){  //find document with specified email

    const result = await client.db("saction-tally1").collection("user").findOne(newUser);
    newWatch = result.watching;
    return newWatch;  //return the current watching array of classes
    
}

async function addWatch(client, email, newWatch){  //update document with new watching array
    const result = await client.db("saction-tally1").collection("user").findOne(email);
    var q = { "_id": ObjectID(result._id)}
    var newValue = { $set: {"watching": newWatch } };
    console.log("This is newWatch" + newWatch);
    console.log(email);
    await client.db("saction-tally1").collection("user").updateOne(q, newValue);
}