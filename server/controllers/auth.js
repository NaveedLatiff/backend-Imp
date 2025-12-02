import jwt from "jsonwebtoken";
import User from "../models/auth.js";
import bcrypt from 'bcryptjs'
import transporter from "../config/nodemailer.js";
import { validationResult } from "express-validator";


export const register = async (req, res) => {

    try {
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.json({
                success: false,
                errors: errors.array()
            });
        }

        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.json({
                success: false,
                message: "User Already Exist"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await User.create({
            name, email, password: hashedPassword
        })

        const token = jwt.sign({ id: user._id }, process.env.SESSION_SECRET, { expiresIn: '7d' })

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        const mailOption = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: "Welcome To AMJOTECH",
            text: `You Register with ${email}`
        }

        await transporter.sendMail(mailOption, (err, info) => {
            if (err) {
                console.log("Email Error:", err);
            } else {
                console.log("Email Sent:", info);
            }
        });

        return res.json({
            success: true,
            message: "User Registered Successfully",
            userData: {
                name: user.name,
                isVerified: user.isVerified,
            },
        })

    } catch (err) {
        return res.json({
            success: false,
            message: `Internal Server Error ${err.message}`
        })
    }
}

export const login = async (req, res) => {

    try {
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.json({
                success: false,
                errors: errors.array()
            });
        }

        const {email,password}=req.body

        const user = await User.findOne({ email })
        if (!user) {
            return res.json({
                success: false,
                message: "Invalid Email"
            })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.json({
                success: false,
                message: "Invalid Password"
            })
        }

        const token = jwt.sign({ id: user._id }, process.env.SESSION_SECRET, { expiresIn: '7d' })

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        return res.json({
            success: true,
            message: "Login Successfully",
            userData: {
                name: user.name,
                isVerified: user.isVerified,
            },
        })

    } catch (err) {
        res.json({
            success: false,
            message: "Internal Server Error"
        })
    }

}


export const logout = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',

        })
        return res.json({
            success: true,
            message: "Logout Successfully"
        })

    } catch (err) {
        return res.json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

export const sendVerifyOtp = async (req, res) => {
    const userId = req.userId;
    try {
        const user = await User.findById(userId)
        if (user.isVerified) {
            return res.json({
                success: false,
                message: "User Already Verified"
            })
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000))

        user.verifyOtp = otp;
        user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;

        await user.save();

        const mailOption = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: "Welcome To AMJOTECH",
            text: `Your Otp is ${otp}`
        }

        await transporter.sendMail(mailOption, (err, info) => {
            if (err) {
                console.log("Email Error:", err);
            } else {
                console.log("Email Sent:", info);
            }
        });

        return res.json({
            success: true,
            message: "Verification code successfully send"
        })

    }
    catch (err) {
        return res.json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

export const verifyEmail = async (req, res) => {
    const userId = req.userId;
    const { otp } = req.body;
    if (!userId || !otp) {
        return res.json({
            success: false,
            message: "Missing Details"
        })
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.json({
                success: false,
                message: "User Not Found"
            })
        }

        if (user.verifyOtp == '' || user.verifyOtp != otp) {
            return res.json({
                success: false,
                message: "Invalid Otp"
            })
        }

        if (user.verifyOtpExpireAt < Date.now()) {
            return res.json({
                success: false,
                message: "Otp Expired"
            })
        }

        user.verifyOtp = '';
        user.verifyOtpExpireAt = 0;
        user.isVerified = true

        await user.save();

        return res.json({
            success: true,
            message: "Otp Verified",
            userData: {
                name: user.name,
                isVerified: user.isVerified
            }
        })

    } catch (err) {
        return res.json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

export const isAuthenticated = async (req, res) => {
    try {
        const userId = req.userId;

        if (!userId) {
            return res.json({
                success: false,
                message: "User ID not found"
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.json({
                success: false,
                message: "User not found"
            });
        }

        return res.json({
            success: true,
            message: "You are Authorized",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                isVerified: user.isVerified
            }
        });
    } catch (err) {
        return res.json({
            success: false,
            message: `Internal Server Error: ${err.message}`
        });
    }
}


export const sendResetOtp = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.json({
            success: false,
            message: "Please Provide the Email"
        })
    }
    try {
        const user = await User.findOne({ email })
        if (!user) {
            return res.json({
                success: false,
                message: "User Not Found"
            })
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000))

        user.resetOtp = otp;
        user.resetOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;

        await user.save();

        const mailOption = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: "Welcome To AMJOTECH",
            text: `Your Reset Password Otp is ${otp}`
        }

        await transporter.sendMail(mailOption);

        return res.json({
            success: true,
            message: "Reset Password Verification code successfully send"
        })

    }
    catch (err) {
        return res.json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

export const verifyResetOtp = async (req, res) => {
    const { email, otp } = req.body;
    if (!email || !otp) {
        return res.json({ success: false, message: "Email and OTP are required" });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) return res.json({ success: false, message: "User not found" });

        if (user.resetOtp === '' || user.resetOtp !== otp) {
            return res.json({ success: false, message: "Invalid OTP" });
        }

        if (user.resetOtpExpireAt < Date.now()) {
            return res.json({ success: false, message: "OTP expired" });
        }

        return res.json({ success: true, message: "OTP verified successfully" });
    } catch (err) {
        return res.json({ success: false, message: "Internal Server Error" });
    }
};


export const resetPassword = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.json({
            success: false,
            message: "Please provide email and new password",
        });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.json({
                success: false,
                message: "User not found",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;

        await user.save();

        return res.json({
            success: true,
            message: "Password updated successfully",
        });
    } catch (err) {
        return res.json({
            success: false,
            message: `Internal Server Error: ${err.message}`,
        });
    }
};
