const {MongoClient} = require('mongodb');
var ObjectID = require('mongodb').ObjectID;
let removeWatching = ["L6101CHEM"] //Class you want to remove
//let removeWatching = ["20334ACC"]
var email = "chuck@rowan.students.edu"

async function main(){
    const uri = "mongodb+srv://root:Senior-project321@cluster0.u1zph.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";//insert mongodb connection string
   
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

        i = removeWatching.length - 1;
        while(i >= 0)
        {
            //res = await client.db("section_tally_plus").collection("user").findOne({email: email}); //User Document
            var key = removeWatching[i]; 
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
            clss = await client.db("section_tally_plus").collection("stp_202220").findOne(querey); //find class to remove from watching
            if(clss.sectionData[i])
            {
                newClss = clss.sectionData[i].Favorites - 1 //remove favorite
                var newValue = { $set: {"sectionData.0.Favorites": newClss } };

                await client.db("section_tally_plus").collection("stp_202220").updateMany(querey, newValue); //Update favorites in all classes with that subject and course number
            }
            i --;
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

    const result = await client.db("section_tally_plus").collection("user").findOne(newUser);
    oldWatch = result.watching;
    return oldWatch;  //return the current watching array of classes
    
}

async function removeWatch(client, email, oldWatch){  //update document with new watching array
    const result = await client.db("section_tally_plus").collection("user").findOne(email);
    var q = { "_id": ObjectID(result._id)}
    var newValue = { $set: {"watching": oldWatch } };
    console.log(email);
    await client.db("section_tally_plus").collection("user").updateOne(q, newValue);
}