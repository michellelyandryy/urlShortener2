import { createLink, getLink } from "../models/Link.js";
import { incrementCounter, getCount} from "../models/Counter.js";

export const createShortLink = async (req, res) => {
    try{
        const {long_link} = req.body;
        if(!long_link){
            return res.status(400).json({ message: 'original link is required'});
        }

        //insert & grab short code
        const {id, short_link} = await createLink(long_link);
        res.status(201).json({ id, short_link, long_link});
    }catch (error){
        console.error('Error creating short link:', error);
        res.status(500).json({ message: "Issue creating short link"});
    }
};

//redirection
export const redirectToLongLink = async (req, res) => {
    try{
        const {short_link} = req.params;

        //getLink from model 
        const link = await getLink(short_link);

        if(!link){
            return res.status(404).json({ message: 'Link not foudn'});
        }

        //put up +1 on counter
        await incrementCounter(link.id);

        //finally redirect
        res.redirect(link.long_link);
    } catch (error){
        console.error('Error redirecting to long link:', error);
        res.status(500).json({message: "Redirection error"});
    }
};

//get counter of the link
export const getLinkCount = async (req, res) => {
    try{
        const {short_link} = req.params;

        //get id
        const link = await getLink(short_link);
        
        if(!link){
            return res.status(404).json({message: 'Link not foudn'});
        }

        //get counter from the model
        const count = await getCount(link.id);
        res.status(200).json({short_link, long_link: link.long_link, clicks: count});
    } catch (error) {
        console.error('Error fetching link clicks:',);
        res.status(500).json({message: "Something went wrong fetching link clicks"});
    }
};