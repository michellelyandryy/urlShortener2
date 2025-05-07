import { createLink, getLink } from "../models/Link";
import { incrementCounter, getCounter} from "../models/Counter.js";
import { decodeBase62Code } from "../utils/helpers.js";
import pool from '../config/db.js';

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

        //grabs linkID
        const linkId = await decodeBase62Code(short_link);

        //get longer ver of link 
        const [rows] = await pool.query(
            'SELECT long_link FROM links WHERE id = ?',
            [linkId]
        );

        if(rows.length === 0){
            return res.status(404).json({message: "Link not found"});
        }

        const long_link = rows[0].long_link;

        //put up +1 on counter
        await incrementCounter(linkId);

        //finally redirect
        res.redirect(long_link);
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
        const linkId = decodeBase62Code(short_link);
        
        if(!link){
            return res.status(404).json({message: 'Link not foudn'});
        }

        //get counter from the model
        const count = await getCounter(link.id);
        res.status(200).json({short_link, long_link: link.long_link, clicks: count});
    } catch (error) {
        console.error('Error fetching link clicks:',);
        res.status(500).json({message: "Something went wrong fetching link clicks"});
    }
};