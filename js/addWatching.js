const {MongoClient} = require('mongodb');
var ObjectID = require('mongodb').ObjectID;
//let addToWatching = ["09510CJ", "L6101CHEM"];
let addToWatching = ["L6101CHEM"];
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

        console.log(addToWatching);
        i = addToWatching.length - 1;
        //console.log(i);
        while(i >= 0)
        {
            var key = addToWatching[i]; 
            console.log(key);


            if((/[a-zA-Z]/).test(key.charAt(0)))  //Splis up key into subj and crse
            {
                var front = key.charAt(0);
                key = key.replace(key.charAt(0), '');

                word = key.replace(/[0-9]/g, '');
                num = key.replace(/\D/g,'');
                num = num.toString();
                num = front + num;
            }
            else
            {
                word = key.replace(/[0-9]/g, '');
                num = key.replace(/\D/g,'');
                num = num.toString();
            }

            querey = {"Subj": word, "Crse": num}
            clss = await client.db("section_tally_plus").collection("stp_202220").findOne(querey); //Find class that will be favorited
            if(clss.sectionData[i])
            {
                newClss = clss.sectionData[i].Favorites + 1  // add 1 to favorites
                var newValue = { $set: {"sectionData.0.Favorites": newClss } };
                await client.db("section_tally_plus").collection("stp_202220").updateMany(querey, newValue);   //Update favorites in all classes with that subject and course number
            }
                        i --;
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

    const result = await client.db("section_tally_plus").collection("user").findOne(newUser);
    newWatch = result.watching;
    return newWatch;  //return the current watching array of classes
    
}

async function addWatch(client, email, newWatch){  //update document with new watching array
    const result = await client.db("section_tally_plus").collection("user").findOne(email);
    var q = { "_id": ObjectID(result._id)}
    var newValue = { $set: {"watching": newWatch } };
    console.log("This is newWatch" + newWatch);
    console.log(email);
    await client.db("section_tally_plus").collection("user").updateOne(q, newValue);
}