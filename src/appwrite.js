import { Client, TablesDB, Account, ID,  Query } from "appwrite";

const PROJECT_ID = import.meta.env.VITE_APPWRITE_PR0JECT_ID;
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const TABLE_ID = import.meta.env.VITE_APPWRITE_TABLE_ID;

const client = new Client();
client
  .setEndpoint("https://sgp.cloud.appwrite.io/v1")
  .setProject(PROJECT_ID); // Replace with your project ID

// const account = new Account(client);
const tablesDB = new TablesDB(client);




export const updateSearchCount = async (searchTerm, movie) => {
    try {
      // 1. Use Appwrite SDK to check if the search term exists in the database
      const result = await tablesDB.listRows({
        databaseId: DATABASE_ID,
        tableId: TABLE_ID,
        queries: [Query.equal('searchTerm', searchTerm)]
      })  

      if (result.total > 0) {
        // 2. If it does, update the count
        const row = result.rows[0];  
        await tablesDB.updateRow({
            databaseId: DATABASE_ID,
            tableId: TABLE_ID,
            rowId: row.$id,
            data: {
                count: row.count + 1,
            }
        }) 

      } else {
        // 3. If it doesn't, create a document with the search term and count as 1
        await tablesDB.createRow({
            databaseId: DATABASE_ID,
            tableId: TABLE_ID,
            rowId: ID.unique(),
            data: {
                searchTerm: searchTerm,
                count: 1,
                movie_id: movie.id,
                poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`

            }
        })
      }

    } catch (err) {
        
    }

    

    
    
    console.log(PROJECT_ID, DATABASE_ID, TABLE_ID);
}


export const getTrendingMovies = async() => {
    try {
        const result = await tablesDB.listRows({databaseId: DATABASE_ID,
        tableId:TABLE_ID, queries: [Query.limit(5), 
            Query.orderDesc("count")
        ]
        })

        return result.rows;
    } catch(err) {
        console.error(err);
    }
}