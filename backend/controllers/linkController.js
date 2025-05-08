import { 
    createLink, 
    getLink,
    deleteLink,
    fetchAllLinks
 } from "../models/Link.js";
import { 
    incrementCounter, 
    getSummary, 
    getRecentClick
} from "../models/Counter.js";

export const createShortLink = async (req, res) => {
  try {
    const { long_link, custom_alias } = req.body;
    if (!long_link) {
      return res.status(400).json({ message: "original link is required" });
    }

    const { id, short_link } = await createLink(long_link, custom_alias);
    res.status(201).json({ id, short_link, long_link });
  } catch (error) {
    console.error("Error creating short link:", error);
    res.status(500).json({ message: "Issue creating short link" });
  }
};

export const getAllLinks = async (req, res) => {
  try {
    const links = await fetchAllLinks();
    res.status(200).json(links);
  } catch (error) {
    console.error("Failed to get all links:", error);
    res.status(500).json({ message: "Failed to get links from database" });
  }
};

// other exports remain unchanged


//redirection
export const redirectToLongLink = async (req, res) => {
    try{
        const {short_link} = req.params;

        //validate
        if (!short_link || !/^[a-zA-Z0-9]{6}$/.test(short_link)) {
            return res.status(400).json({ message: 'Invalid short link format' });
        }

        //getLink from model 
        const link = await getLink(short_link);
        if(!link){
            return res.status(404).json({ message: 'Link not foudn'});
        }

        //put up +1 on counter
        incrementCounter(link.id).catch(error => 
            console.error('Counter increment failed:', error)
        );

        //finally redirect
        res.status(302).redirect(link.long_link);
    } catch (error){
        console.error('Redirection error:', error);
        res.status(500).json({message: "Redirection error"});
    }
};

//get counter of the link
// export const getLinkCount = async (req, res) => {
//     try{
//         const {short_link} = req.params;

//         //get id
//         const link = await getLink(short_link);
//         if(!link){
//             return res.status(404).json({message: 'Link not foudn'});
//         }

//         //get counter from the model
//         const count = await getCount(link.id);
//         res.status(200).json({short_link, long_link: link.long_link, clicks: count});
//     } catch (error) {
//         console.error('Error fetching link clicks:',);
//         res.status(500).json({message: "Something went wrong fetching link clicks"});
//     }
// };

//get click summary
export const getLinkSummary = async (req, res) => {
    try{
        const {short_link} = req.params;
        const summary = await getSummary(short_link);

        const recent = await getRecentClick(short_link.id);

        if(!summary){
            return res.status(404).json({ message: "Link not found"});
        }

        res.json(summary);
    } catch (error) {
        console.error('Error fetching summary:', error);
        res.status(500).json({ message: "Something went wrong fetching data"});
    }
};

//rm link
export const deleteShortLink = async (req, res) => {
    try{
        const {short_link} = req.params;

        //rm in db
        const isDeleted = await deleteLink(short_link);

        if(!isDeleted){
            return res.status(404).json({ message: "Link not found"});
        }
        res.status(200).json({ message: "Link successfully deleted"});
    }catch (error){
        console.error('Error deleting link:', error);
        res.status(500).json({ message: "Deleting error"});
    }
};