const {MongoClient} = require('mongodb');
var ObjectID = require('mongodb').ObjectID;
let addToPast = ["L6101CHEM"]
var email = "chuck@rowan.students.edu"

async function main(){
    const uri = "";//insert mongodb connection string
   
    const client = new MongoClient(uri);

        await client.connect();
        
        await addUser(client,
            {
                email: email

    
            }
        );
  

       if (addToPast.length > 0) 
        {
            i = addToPast.length - 1;
            c = newPast.length - 1;
            while(i >= 0)  //make sure there are no duplicates between two arrays
            {

                while(c >= 0)
                {
           
                    if(newPast[c] === addToPast[i])
                    {
                        if(addToPast[i+1] == null)    //Get rid of duplicates
                        {
                            addToPast.pop()
                        }
                        else
                        {
                            k = i

                            while(k < addToPast.length - 1)
                            {
                        
                                addToPast[k] = addToPast[k + 1];
                                k ++;
                            }

                            addToPast.pop()
                        }

                    }
                    c --;
                }
                c = newPast.length -1;

                i --;
            }

            if (addToPast.length > 0)
            {
                i = addToPast.length - 1;
                c = newPast.length - 1;

                while(i >= 0)       //combines two arrays
                {
                    newPast.push(addToPast[i]);  
                    i --;
                }
            }   

        }





        await addPast(client,
            {
                email: email,
            },
            newPast
        );
        


        await client.close();

}

main().catch(console.error);


async function addUser(client, newUser){  //find document with specified email

    const result = await client.db("section_tally_plus").collection("user").findOne(newUser);
    newPast = result.past_classes;
    //console.log(result);
    return newPast;  //return the current past_classes array of classes
    
}

async function addPast(client, email, newPast){  //update document with new past_classes array
    const result = await client.db("section_tally_plus").collection("user").findOne(email);
    var q = { "_id": ObjectID(result._id)}
    var newValue = { $set: {"past_classes": newPast } };
    await client.db("section_tally_plus").collection("user").updateOne(q, newValue);
}