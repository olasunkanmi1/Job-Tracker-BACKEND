import Job from '../models/Job.js';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError, NotFoundError } from '../errors/index.js';
import checkPermissions from '../utils/chechPermissions.js';

const createJob = async (req, res) => {
    const { position, company } = req.body
    
    if (!position || !company) {
        throw new BadRequestError('Please Provide All Values');
    }

    req.body.createdBy = req.user.userId;

    const job = await Job.create(req.body);
    res.status(StatusCodes.CREATED).json({ job });
}

const deleteJob = async (req, res) => {
    const { id: jobId } = req.params;
  
    const job = await Job.findOne({ _id: jobId });
  
    if (!job) {
      throw new NotFoundError(`No job with id : ${jobId}`);
    }
  
    checkPermissions(req.user, job.createdBy);
  
    await job.remove();
    res.status(StatusCodes.OK).json({ msg: 'Success! Job removed' });
};

const getAllJobs = async (req, res) => {
    const jobs = await Job.find({ createdBy: req.user.userId });

    res.status(StatusCodes.OK)
    .json({ jobs, totalJobs: jobs.length, numOfPages: 1 });
}

const updateJob = async (req, res) => {
    const { id: jobId } = req.params;
    
    const { company, position, jobLocation } = req.body;
  
    if (!company || !position) {
      throw new BadRequestError('Please Provide All Values');
    }
  
    const job = await Job.findOne({ _id: jobId });
    console.log('requests', job.createdBy)
  
    if (!job) {
      throw new NotFoundError(`No job with id ${jobId}`);
    }

    checkPermissions(req.user, job.createdBy)
  
    // check permissions --better if no hooks in Job schema
    const updatedJob = await Job.findOneAndUpdate({ _id: jobId }, req.body, {
      new: true,
      runValidators: true,
    });
  
    res.status(StatusCodes.OK).json({ updatedJob });

    // alternative approach
    // job.position = position;
    // job.company = company;
    // job.jobLocation = jobLocation;

    // await job.save();
    // res.status(StatusCodes.OK).json({ job });
};

const showStats = async (req, res) => {
    res.send('show stats')
}

export { createJob, deleteJob, getAllJobs, updateJob, showStats }