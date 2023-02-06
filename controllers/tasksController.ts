import { Request, RequestHandler, Response } from 'express';
import expressAsyncHandler from 'express-async-handler/index.js';
import mongoose from 'mongoose';
import taskModel from '../models/taskModel.js';


export const getAllTasks : RequestHandler = expressAsyncHandler(async (req: Request | any, res: Response)  => { 
    //!If Private?
    //* const allDocs : any = await taskModel.find({owner: req.user.id}); 
    //* console.log(allDocs);
    //* res.json(allDocs);

    const allDocs : any = await taskModel.find({
        owningObjective: req.params.objectiveId /*or req.body.owningObjective */
        /*,memberId: req.user._id - to ensure user is a member of this station*/
    }); 
    console.log(allDocs);
    res.json(allDocs);
});

//Create new (POST)
export const createNewTask : RequestHandler = expressAsyncHandler(async (req : any | Request, res : Response) => {
    if (!req.body.owningObjective || !req.body.owner || !req.body.taskName) {
        res.status(400);
        console.log('fields are missing in the Task Create request!');
        throw new Error('fields are missing in the Task Create request!');
    }

    const newTask : mongoose.Document = await taskModel.create({
        owningObjective: req.body.owningObjective, 
        owner: req.user.id, 
        taskName: req.body.taskName
    }); 
    res.json(newTask);
})

//Retrieve by ID (GET)
export const getTaskById : RequestHandler = expressAsyncHandler(async (req : any | Request, res : Response) => {
    if (!req.params.id){
        res.status(400);
        throw new Error('Can not retrieve document! request FAILED')
    }

    const task : any = await taskModel.findOne({
        _id: req.params.id, 
        owningObjective: req.params.objectiveId
        /*,memberId: req.user._id - to ensure user is a member of this station*/
    }); 
    console.log(task);
    res.status(200).json(task);
})

export const updateTaskById : RequestHandler = expressAsyncHandler(async (req : Request | any, res : Response) => {
    if (!req.params.id){
        res.status(400);
        throw new Error('Can not retrieve document! request FAILED')
    }

    //if (Objective.owningProject.ProjectSettings.bAllowMembersChanges == false)
    if (true){ // Private
        const task : any = await taskModel.findOneAndUpdate({
            _id: req.params.id, 
            owner: req.user._id, 
            owningObjective: req.body.owningObjective
        }, req.body); 
        console.log(task);
        res.json(task);
    } else { // Public
        const task : any = await taskModel.findOneAndUpdate({
            _id: req.params.id, 
            owningProject: req.body.owningProject
            /*,memberId: req.user._id - to ensure user is a member of this station*/
        }, req.body); 
        console.log(task);
        res.json(task);
    }
    
})

export const deleteTaskById : RequestHandler = expressAsyncHandler(async (req : Request | any , res : Response) => {
    const task : any = await taskModel.findOneAndDelete({
        _id: req.params.id, 
        owner: req.user._id
    }); 
    console.log(task);
    res.json(task);
})