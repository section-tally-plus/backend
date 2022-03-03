const {MongoClient} = require('mongodb');

var email = "notifyTest@rowan.students.edu";

async function main(){
    
    const uri = "";//insert mongodb connection string
   
    
    const client = new MongoClient(uri);

        
        await client.connect();

        await addUser(client,
            {
                email: email
            }
           
        );

       
        
        await client.close();
}

main().catch(console.error);


async function addUser(client, email){

    result = await client.db("saction-tally1").collection("user").findOne(email); //User Document

    var c = result.watching.length - 1;
    any = 0;
    while(c >= 0)    //finds classes in watching list in collection1 by using Crse and Subj
    {

        var key = result.watching[c];  //key is string "CrseSubj", watching classes saved as key


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


        clss = await client.db("saction-tally1").collection("collection1").findOne({"Subj": word, "Crse": num});
        project = { projection: {"Enr": 1, "Max": 1} };
        
        query = { "Crse": num, "Subj": word };
        clss2 = await client.db("saction-tally1").collection("collection1").find(query, project).toArray();  //find all documents of class and put them in array
        var i = clss2.length -1;
        
        if(clss2.length > 0)
        {

            while(i >= 0)  //check to see if any seats are open
            {
                if(parseInt(clss2[i].Max) - parseInt(clss2[i].Enr) > 0 )
                    {
                        any ++;
                    }
                    i --;
            }
        }
        console.log(result.email + " there is " + any + " section(s) of " + clss.Title + " open!"); //Somehow notify the user via email or text

        c --;
    }
    return result;
    
}
