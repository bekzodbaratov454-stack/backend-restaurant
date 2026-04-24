import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import signature from "cookie-signature";
import { sendEmail } from "../helpers/sendEmail.js";

import { UnauthorizedException } from "../exceptions/unauthorized.exception.js";
import { NotFoundException } from "../exceptions/not-found.exception.js";
import { ForbiddenException } from "../exceptions/forbidden.exception.js";
import { ConflictException } from "../exceptions/conflict.exception.js";


class authController {
    #_userModel;
    constructor() {
        this.#_userModel = User;
    }
      #_hashPassword = async (password) => {
        return await bcrypt.hash(password, 10);
    };


    
login = async (req, res, next) => { 
    try {
        const { email, password } = req.body;
        
        const existingUser = await this.#_userModel.findOne({ email });
        if (!existingUser) {
            throw new NotFoundException("User not found");
        }


        const isPassSame = await bcrypt.compare(
            password,
            existingUser.password
        );

        if (!isPassSame) {
            throw new UnauthorizedException("Password is incorrect");
        }



        const accessToken = jwt.sign(
            { id: existingUser._id, role: existingUser.role },
            process.env.JWT_ACCESS_SECRET,
            { expiresIn: "1d" }
        );

        const refreshToken = jwt.sign(
            { id: existingUser._id },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: "7d" }
        );


        const userObj = existingUser.toObject();
        delete userObj.password;

        res.send({ success: true, data: { accessToken, refreshToken, user: userObj } });


    } catch (error) {
        next(error);                   
    }
};





forgotPassword = async(req , res , next) => {

    try {
        const {email} = req.body;
        const existingUser = await User.findOne({ email });

        if(!existingUser) {
            throw new NotFoundException("User Not found")
        }

        const resetToken = jwt.sign(
        { userId: existingUser._id },
        process.env.JWT_ACCESS_SECRET,
          { expiresIn: "4m" }
      );

const resetUrl = `http://localhost:3000/reset-password?token=${resetToken}`;
await sendEmail(email, "Password reset", `Reset link: ${resetUrl}`);

        

        await sendEmail(email , "Password reset" , `Password reset link: ${signedUrl}`);

        res.send({ success : true, data: {message : "Link sent to your email"}});
        
    } catch (error) {
        next(error);
    }
};






  resetPassword = async (req, res, next) => {
    try {
      
      const isValid = signature.verify(req.originalUrl);
      if(!isValid) {
        throw new UnauthorizedException("Invalid or expired link")
      }


      const { userId } = req.query;
      const { password } = req.body;
      

      if (!password || password.length < 6) {
      throw new ForbiddenException("Password must be at least 6 characters");
    }



    const user = await this.#_userModel.findById(userId);
    if (!user) {
      throw new NotFoundException("User not found");
    }

    

      const hashedPass = await this.#_hashPassword(password);


  
      await this.#_userModel.updateOne(
        { _id: userId },
        { password: hashedPass },
      );

 res.send({
      success: true,
      message: "Password successfully updated",
    });

  } catch (error) {
    next(error);
  }
};






register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    if (!password || password.length < 6) {
      throw new ForbiddenException("Password must be at least 6 characters");
    }

    const existingUser = await this.#_userModel.findOne({ email });

    if (existingUser) {
      throw new ConflictException("Email has already been taken");
    }

    const hashedPassword = await this.#_hashPassword(password);

    const newUser = await this.#_userModel.create({
      name,
      email,
      password: hashedPassword,
      role: role || "user",
    });



    const accessToken = jwt.sign(
      {
        id: newUser._id,
        role: newUser.role,
        email: newUser.email,
      },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: "1d" }
    );


    const refreshToken = jwt.sign(
      {
        id: newUser._id,
        role: newUser.role,
      },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );


    const userObj = newUser.toObject();
    delete userObj.password;

    

    res.status(201).send({
      success: true,
      data: {
        user: userObj,
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
};





refresh = async (req, res, next) => {
    try {

        const refreshToken = req.body.refreshToken || req.signedCookies?.refreshToken;

        if (!refreshToken) {
            throw new UnauthorizedException("Refresh token not provided");
        }

        let decoded;
        try {
            decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        } catch (err) {
            throw new UnauthorizedException("Invalid or expired refresh token");
        }

        const user = await this.#_userModel.findById(decoded.id);
        if (!user) throw new NotFoundException("User not found");



        if (!user.isActive) {
            throw new ForbiddenException("Account is deactivated");
        }


        const accessToken = jwt.sign(
            { id: decoded.id, role: user.role }, 
            process.env.JWT_ACCESS_SECRET,
            { expiresIn: "1d" }
        );



        res.cookie("accessToken", accessToken, {
            signed: true,
            httpOnly: true,
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000), 
        });

           res.send({ success: true, data: { accessToken } });
    } catch (error) {
        next(error);
    }
};



}

export default new authController();
