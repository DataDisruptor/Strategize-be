import { Request, RequestHandler, Response } from 'express';
import expressAsyncHandler from 'express-async-handler/index.js';
import mongoose from 'mongoose';
import projectModel from '../models/projectModel.js';


export const getAllProjects : RequestHandler = expressAsyncHandler(async (req: Request | any, res: Response)  => { 
    const allDocs : any = await projectModel.find({owner: req.user._id}); 
    res.json(allDocs);
});

//Create new (POST)
export const createNewProject : RequestHandler = expressAsyncHandler(async (req : any | Request, res : Response) => {
    if (!req.body.projectName) {
        res.status(400);
        console.log('projectName is missing in the request!');
        throw new Error('projectName is missing in the request!');
    }

    const newProject : mongoose.Document = await projectModel.create({projectName: req.body.projectName, owner: req.user.id}); 
    res.json(newProject);
})

//Retrieve by ID (GET)
export const getProjectById : RequestHandler = expressAsyncHandler(async (req : any | Request, res : Response) => {
    if (!req.query.id){
        res.status(400);
        throw new Error('Can not retrieve document! request FAILED')
    }

    const project : any = await projectModel.findOne({_id: req.query.id, owner: req.user._id}); 
    console.log(project);
    res.status(200).json(project);
})

export const updateProjectById : RequestHandler = expressAsyncHandler(async (req : Request | any, res : Response) => {
    if (!req.query.id){
        res.status(400);
        throw new Error('Can not retrieve document! request FAILED')
    }

    const project : any = await projectModel.findOneAndUpdate({_id: req.query.id, owner: req.user._id}, req.body); 
    console.log(project);
    res.json(project);
})

export const deleteProjectById : RequestHandler = expressAsyncHandler(async (req : Request | any , res : Response) => {
    const project : any = await projectModel.findOneAndDelete({_id: req.query.id, owner: req.user._id}); 
    console.log(project);
    res.json(project);
})