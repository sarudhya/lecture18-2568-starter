import { Router, type Request, type Response } from "express";
import dotenv from "dotenv";
dotenv.config();

import type { User, CustomRequest, UserPayload, Student, Enrollment } from "../libs/types.js";

import { users, reset_enrollments, students, courses, enrollments } from "../db/db.js";
import { success } from "zod";

import { authenticateToken } from "../middlewares/authenMiddleware.js";
import { checkRoleAdmin } from "../middlewares/checkRoleAdminMiddleware.js";
import { checkStudentId, checkStudentwNoAdminId, checkStudentofDel } from "../middlewares/checkStudentId.js";
import { zStudentId } from "../libs/zodValidators.js";

const router = Router();

router.get("/", authenticateToken, checkRoleAdmin, (req: Request, res: Response) => {
    try {
        return res.status(200).json({
            success: true,
            message: "Sucessful operation",
            data: enrollments.map((e) => {
                return {
                    studentId: e.studentId,
                    courses: e.courseId?.map(c => ({courseId: c}))
                }
            })
        })
    }catch(err) {
        return res.status(500).json({
            success: false,
            message: "Something is wrong, please try again",
            error: err,
        });
    }
});

router.post("/reset", authenticateToken, checkRoleAdmin, (req: Request, res: Response) => {
     try {
        reset_enrollments();
        return res.status(200).json({
            success: true,
            message: "Enrollments database has been reset",
        });
    }catch(err) {
        return res.status(500).json({
            success: false,
            message: "Something is wrong, please try again",
            error: err,
        });
    }
});

router.get("/:studentId",authenticateToken,checkStudentId, (req: Request, res: Response) => {
    try {
        const {studentId} = req.params;
        const student = students.find((s: Student) => s.studentId === studentId);
        if (!student) {
          return res.status(404).json({
            success: false,
            message: "Student does not exists",
          });
        }
        return res.status(200).json({
            success: true,
            message: "Student Information",
            data: {
                studentId: student.studentId,
                firstName: student.firstName,
                lastName: student.lastName,
                program: student.program,
                courses: student.courses?.map(c => ({courseId: c}))
            }
        });
    }catch(err) {
        return res.status(500).json({
            success: false,
            message: "Something is wrong, please try again",
            error: err,
        });
    }
});

router.post("/:studentId",authenticateToken,checkStudentwNoAdminId, (req: Request, res: Response) =>{
    const {courseId} = req.body;
    const {studentId} = req.params;
    
    const student = students.find((s) => s.studentId === studentId);
    if (!student) {
        return res.status(404).json({
            success: false,
            message: "Student not found!"
        })
    }
    const enrollment = enrollments.find((e) => e.studentId === student.studentId);
    const dcourse = enrollment?.courseId?.find((c) => c === courseId);
    if (dcourse) {
        return res.status(403).json({
            success:false,
            message: "studentId && courseId is already exists"
        })
    }
    enrollment?.courseId?.push(String(courseId));
    return res.status(201).json({
        success: true,
        message: `Student ${student.studentId} && Course ${courseId} has been add successfully`,
        data: {
            studentId: student.studentId,
            courseId: courseId
        }
    });
});

router.delete("/:studentId",authenticateToken,checkStudentofDel, (req: Request, res: Response) =>{
    const {courseId} = req.body;
    const {studentId} = req.params;
    
    const student = students.find((s) => s.studentId === studentId);
    if (!student) {
        return res.status(404).json({
            success: false,
            message: "Student not found!"
        })
    }
    const enrollment = enrollments.find((e) => e.studentId === student.studentId);
    const dcourse = enrollment?.courseId?.find((c) => c === courseId);
    if (!dcourse) {
        return res.status(404).json({
            success: false,
            message: "Enrollment does not exists"
        })
    }

    if (!Array.isArray(enrollment?.courseId)) {
        return res.status(404).json({
            success: false,
             message: "Enrollment does not exists"
        });
    }

    for (let i = 0 ;i< enrollment.courseId.length;i++) {
        if(enrollment.courseId[i] === courseId) enrollment.courseId.splice(i-1,1)
    }

    return res.status(201).json({
        success: true,
        message: `Student ${student.studentId} && Course ${courseId} has been add successfully`,
        data: enrollments
    });
});

export default router;