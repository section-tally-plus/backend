const {MongoClient} = require('mongodb');
var ObjectID = require('mongodb').ObjectID;
let removePast = ["class28"] //Class you want to remove
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
  
        if (oldPast.length > 0)
        {
            console.log("in");
            i = oldPast.length - 1;
            c = removePast.length - 1;
            while(i >= 0)
            {
        
                while(c >= 0)
                {
                   
                    if(removePast[c] === oldPast[i])
                    {
                        if(oldPast[i+1] == null)
                        {
                            oldPast.pop()
                        }
                        else
                        {
                            oldPast[i] = "Can't be Red"
                            k = i
        
                            while(k < oldPast.length - 1)
                            {
                                
                                oldPast[k] = oldPast[k + 1];
                                k ++;
                            }
        
                            oldPast.pop()
                        }
        
                    }
                    c --;
                }
                c = removePast.length -1;
        
                i --;
            }
        
        
        }





        await removePastClass(client,
            {
                email: email,
            },
            oldPast
        );
        


        await client.close();

}

main().catch(console.error);


async function findUser(client, newUser){  //find document with specified email

    const result = await client.db("saction-tally1").collection("user").findOne(newUser);
    oldPast = result.past_classes;
    return oldPast;  //return the current past_classes array of classes
    
}

async function removePastClass(client, email, oldPast){  //update document with new past_classes array
    const result = await client.db("saction-tally1").collection("user").findOne(email);
    var q = { "_id": ObjectID(result._id)}
    var newValue = { $set: {"past_classes": oldPast } };
    console.log(email);
    await client.db("saction-tally1").collection("user").updateOne(q, newValue);
}