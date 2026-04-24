import { Feedback } from "../models/feedback.model.js";
import { NotFoundException } from "../exceptions/not-found.exception.js";

class FeedBackController {


    createFeedback = async ( req, res , next) => {
        try {

            const { type , message } = req.body;

            const feedback = await Feedback.create({
                type,
                message,
                device_info: req.headers["user-agent"] || "unknown",
            });

            res.status(201).json({ success: true , data: feedback });
            
        } catch (error) {
            next(error)
            
        }
    };





getFeedbacks = async (req , res , next) => {
    try {
        const feedback = await Feedback.find().sort({ createdAt: -1});

        res.status(200).json({ success: true , data: feedback });
         } catch (error) {
            next(error)
        
    }
};






getFeedBackById = async (req , res , next) => {
    try {

        const feedback = await Feedback.findById(req.params.id);

        if(!feedback) {
            throw new NotFoundException("Feedback not found");
        }

        res.status(200).json({ success: true , data: feedback});

        
    } catch (error) {
        next(error)
        
    }
};





deleteFeedback = async (req , res , next) => {
    try {
        const feedback = await Feedback.findByIdAndDelete(req.params.id);

        if(!feedback) {
            throw new NotFoundException("Feedback not found!")
        }


        res.status(200).json({ success: true , message: "Feedback successfully deleted"});
    } catch (error) {
        next(error)
    };
};


}


export default new FeedBackController();